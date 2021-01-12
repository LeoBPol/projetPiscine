/*!
 * Author:  Mark Allan B. Meriales
 * Name:    Mark Your Calendar v0.0.1
 * License: MIT License
 */

(function($) {
    // https://stackoverflow.com/questions/563406/add-days-to-javascript-date
    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    Date.prototype.changeDate = function() {
        var date = new Date(this.valueOf());
        if (0 == date.getDay()) { date.setDate(date.getDate() - 6) };
        if (2 == date.getDay()) { date.setDate(date.getDate() - 1) };
        if (3 == date.getDay()) { date.setDate(date.getDate() - 2) };
        if (4 == date.getDay()) { date.setDate(date.getDate() - 3) };
        if (5 == date.getDay()) { date.setDate(date.getDate() - 4) };
        if (6 == date.getDay()) { date.setDate(date.getDate() - 5) };
        return date;
    }

    $.fn.markyourcalendar = function(opts) {
        var prevHtml = `
            <div id="myc-prev-week">
                <
            </div>
        `;
        var nextHtml = `<div id="myc-next-week">></div>`;
        var defaults = {
            availability: [[], [], [], [], [], [], []], // listahan ng mga oras na pwedeng piliin
            isMultiple: false,
            months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
            prevHtml: prevHtml,
            nextHtml: nextHtml,
            selectedDates: [],
            startDate: new Date(),
            weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        };
        var settings = $.extend({}, defaults, opts);
        var html = ``;
        var onClick = settings.onClick;
        var onClickNavigator = settings.onClickNavigator;
        var instance = this;

        // kuhanin ang buwan
        this.getMonthName = function(idx) {
            return settings.months[idx];
        };

        var formatDate = function(d) {
            var date = '' + d.getDate();
            var month = '' + (d.getMonth() + 1);
            var year = d.getFullYear();
            if (date.length < 2) {
                date = '0' + date;
            }
            if (month.length < 2) {
                month = '0' + month;
            }
            return year + '-' + month + '-' + date;
        };

        // Eto ang controller para lumipat ng linggo
        // Controller to change 
        this.getNavControl = function() {
            
            var previousWeekHtml = `<div id="myc-prev-week-container">` + settings.prevHtml + `</div>`;
            var nextWeekHtml = `<div id="myc-prev-week-container">` + settings.nextHtml + `</div>`;
            if (this.getMonthName(settings.startDate.getMonth()) != this.getMonthName(settings.startDate.addDays(4).getMonth())) { var monthYearHtml = `
                <div id="myc-current-month-year-container">
                    ` + this.getMonthName(settings.startDate.getMonth()) + ' ' + settings.startDate.getFullYear() + ' - ' + this.getMonthName(settings.startDate.addDays(4).getMonth()) + ' ' + settings.startDate.addDays(4).getFullYear() + `
                </div>
            `;}

            else { var monthYearHtml = `
                <div id="myc-current-month-year-container">
                    ` + this.getMonthName(settings.startDate.getMonth()) + ' ' + settings.startDate.getFullYear() +  `
                </div>
            `;}

            var navHtml = `
                <div id="myc-nav-container">
                    ` + previousWeekHtml + `
                    ` + monthYearHtml + `
                    ` + nextWeekHtml + `
                    <div style="clear:both;"></div>
                </div>
            `;
            return navHtml;
        };

        // kuhanin at ipakita ang mga araw
        this.getDatesHeader = function() {
            settings.startDate = settings.startDate.changeDate();
            var tmp = ``;
            for (i = 0; i < 5; i++) {
                var d = settings.startDate.addDays(i);
                tmp += `
                    <div class="myc-date-header" id="myc-date-header-` + i + `">
                        <div class="myc-date-number">` + d.getDate() + `</div>
                        <div class="myc-date-display">` + settings.weekdays[d.getDay()] + `</div>
                    </div>
                `;
            }
            var ret = `<div id="myc-dates-container">` + tmp + `</div>`;
            return ret;
        }

        // kuhanin ang mga pwedeng oras sa bawat araw ng kasalukuyang linggo
        this.getAvailableTimes = function() {
            // settings.startDate = settings.startDate.changeDate();
            var tmp = ``;
            for (i = 0; i < 5; i++) {
                var tmpAvailTimes = ``;
                $.each(settings.availability[i], function() {
                    tmpAvailTimes += `
                        <a href="javascript:;" class="myc-available-time" data-time="` + this + `" data-date="` + formatDate(settings.startDate.addDays(i)) + `">
                            ` + this + `
                        </a>
                    `;
                });
                tmp += `
                    <div class="myc-day-time-container" id="myc-day-time-container-` + i + `">
                        ` + tmpAvailTimes + `
                        <div style="clear:both;"></div>
                    </div>
                `;
            }
            return tmp
        }

        // i-set ang mga oras na pwedeng ilaan
        this.setAvailability = function(arr) {
            settings.availability = arr;
            render();
        }

        // clear
        this.clearAvailability = function() {
            settings.availability = [[], [], [], [], [], [], []];
        }

        // pag napindot ang nakaraang linggo
        this.on('click', '#myc-prev-week', function() {
            // settings.startDate = settings.startDate.changeDate();
            settings.startDate = settings.startDate.addDays(-7);
            instance.clearAvailability();
            render(instance);
            document.getElementById('selected-date').innerHTML = '<i>Veuillez choisir un créneau</i>'
            document.getElementById('selected-time').innerHTML = '<i>Veuillez choisir un créneau</i>'
            document.getElementById('valideBtn').classList.add('btn_disabled');

            if ($.isFunction(onClickNavigator)) {
                onClickNavigator.call(this, ...arguments, instance);
            }
        });

        // pag napindot ang susunod na linggo
        this.on('click', '#myc-next-week', function() {
            // settings.startDate = settings.startDate.changeDate();
            settings.startDate = settings.startDate.addDays(7);
            instance.clearAvailability();
            render(instance);
            document.getElementById('selected-date').innerHTML = '<i>Veuillez choisir un créneau</i>'
            document.getElementById('selected-time').innerHTML = '<i>Veuillez choisir un créneau</i>'
            document.getElementById('valideBtn').classList.add('btn_disabled');

            if ($.isFunction(onClickNavigator)) {
                onClickNavigator.call(this, ...arguments, instance);
            }
        });


        // pag namili ng oras
        this.on('click', '.myc-available-time', function() {
            if (!$(this).hasClass('indisponible')) {
                var date = $(this).data('date');
                var time = $(this).data('time');
                var tmp = date + ' ' + time;
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                    document.getElementById('selected-date').innerHTML = '<i>Veuillez choisir un créneau</i>'
                    document.getElementById('selected-time').innerHTML = '<i>Veuillez choisir un créneau</i>'
                    document.getElementById('valideBtn').classList.add('btn_disabled') 
                    var idx = settings.selectedDates.indexOf(tmp);
                    if (idx !== -1) {
                        settings.selectedDates.splice(idx, 1);
                    }
                } else {
                    if (settings.isMultiple) {
                        $(this).addClass('selected');
                        settings.selectedDates.push(tmp);
                    } else {
                        settings.selectedDates.pop();
                        if (!settings.selectedDates.length) {
                            $('.myc-available-time').removeClass('selected');
                            $(this).addClass('selected');
                            settings.selectedDates.push(tmp);
                        }
                    }
                }

                if ($.isFunction(onClick)) {
                        onClick.call(this, ...arguments, settings.selectedDates);
                            
                        if ($(this).hasClass('selected')) {

                            // INDISPONIBLE = NOHOVER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

                            // $(this).addClass('indisponible')
                            // $(this).addClass('noHover')
                
                            x = this.getAttribute('data-time')
                            // x est le créneau au format hh:mm
                            y = this.getAttribute('data-date')
                            // y est la date au format aaaa-mm-jj
                            z = y + " | " + x
                            document.getElementById('demo').innerHTML = z
                            document.getElementById('valideBtn').classList.remove('btn_disabled')                       
                            
                        }

                    }
                }
        });

        var render = function() {
            ret = `
                <div id="myc-container">
                    <div id="myc-nav-container">` + instance.getNavControl() + `</div>
                    <div id="myc-week-container">
                        <div id="myc-dates-container">` + instance.getDatesHeader() + `</div>
                        <div id="myc-available-time-container">` + instance.getAvailableTimes() + `</div>
                    </div>
                </div>
            `;
            instance.html(ret);
        };

        render();
    };

})(jQuery);

