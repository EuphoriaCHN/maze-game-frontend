'use strict';

/**
 * 全局设置
 */
(function (window, undefined) {
    $(document.body).css({
        width: $(window).width(),
        height: $(window).height()
    });
    $(window).resize(function () {
        $(document.body).css({
            width: $(this).width(),
            height: $(this).height()
        });
    });
})(window, undefined);
