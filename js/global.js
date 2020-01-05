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

    // 设置步数变化量
    window.dx = [-1, 1, 0, 0];
    window.dy = [0, 0, -1, 1];
})(window, undefined);
