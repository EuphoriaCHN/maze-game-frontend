'use strict';

(function (window, undefined) {
    // 遮罩层逻辑
    jQuery(function () {
        $('#start').on('click', function (ev) {
            let mask = $('#mask');

            if (typeof mask.get(0).timerInterval !== 'undefined') {
                window.clearInterval(mask.get(0).timerInterval);
            }

            mask.get(0).timerInterval = window.setInterval(function () {
                let offsetLeft = mask.position().left;

                let offsetTop = mask.position().top;
                let width = mask.width();

                let height = mask.height();

                if (width >= 1100) {
                    window.clearInterval(mask.get(0).timerInterval);
                    mask.hide().css('z-index', 0);
                    $('#main').fadeIn(400).css('display', 'flex');
                    $('#mainPage').hide();
                }

                let change = Math.floor(((1100 - width)) / 10);
                if (change <= 10) {
                    change = 10;
                }

                mask.css({
                    width: width + change + 'px',
                    height: height + change + 'px',
                    left: offsetLeft - change / 2 + 'px',
                    top: offsetTop - change / 2 + 'px'
                });
            }, 30);
        });
    });
})(window, undefined);
