(function () {
    'use strict';

    Lampa.Listener.follow('app', (e) => {
        if (e.type == 'ready') {
            setTimeout(function () {
                $("[data-action=feed]").eq(0).remove();
            }, 10);
        }
    });

})();