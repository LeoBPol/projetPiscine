var $input = $('.clock').clockpicker({
    default:          'now',
    placement:        'bottom',
    align:            'left',
    donetext:         'jesuisuneboss',
    autoclose:        false,
    vibrate:          true,
    fromnow:          0,
    init:             function () { console.log('initial') },
    beforeShow:       function () { console.log('avant apparition') },
    afterShow:        function () { console.log('apres apparition') },
    beforeHide:       function () { console.log('avant cacher') },
    afterHide:        function () { console.log('apres cachere') },
    beforeHourSelect: function () { console.log('avant de selectionner heure') },
    afterHourSelect:  function () { console.log('avant de selectionner heure') },
    beforeDone:       function () { console.log('avant finaliser') },
    afterDone:        function () { console.log('apres finaliser') }
});

$input.clockpicker('show');