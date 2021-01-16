var $input = $('.clock').clockpicker({
    default:          '12:00',
    placement:        'bottom',
    align:            'left',
    donetext:         'Valider',
    autoclose:        true,
    vibrate:          true,
    fromnow:          0,
    init:             function () { console.log('initial') },
    beforeShow:       function () {console.log('avant apparition') },
    afterShow:        function () {
        console.log('apres apparition')
        document.getElementsByClassName('popover ')[0].setAttribute('class', 'popover clockpicker-popover bottom clockpicker-align-left visible')
    },
    beforeHide:       function () { console.log('avant cacher') },
    afterHide:        function () { console.log('apres cachere') },
    beforeHourSelect: function () { console.log('avant de selectionner heure') },
    afterHourSelect:  function () { console.log('avant de selectionner heure') },
    beforeDone:       function () { console.log('avant finaliser') },
    afterDone:        function () { console.log('apres finaliser') }
});