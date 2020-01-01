'use strict';

/**
 * 处理浮动提示块逻辑
 */
(function (window, undefined) {
    /**
     * 开启一个浮动块
     * @param text 浮动块文本
     * @param classStyle 浮动块类名
     */
    window.drawTipsFloatBar = function (text, classStyle) {
        if (typeof window.tipsFloatBar !== 'undefined') {
            // 如果当前已经有正在浮动的块了
            window.clearTimeout(window.tipsFloatBar.timeOutTimer); // 清空等待定时器
            window.tipsFloatBar.stop().remove(); // 停止当前动画并移除
        }

        // 设置新的浮动提示框
        window.tipsFloatBar = $(`<div class="${classStyle}"></div>`).addClass('tips-float-bar').text(text).hide(); // 设置并隐藏这个块

        // 加入到 main 中
        $('#main').append(window.tipsFloatBar);

        // 获取其 宽高 + padding + border 以设置定位
        let shouldMarginTop = -1 * window.tipsFloatBar.innerHeight() / 2;
        let shouldMarginLeft = -1 * window.tipsFloatBar.innerWidth() / 2;

        // margin 值补正
        window.tipsFloatBar.css({
            marginLeft: shouldMarginLeft + 'px',
            marginTop: shouldMarginTop + 'px'
        });

        // 设置动画
        window.tipsFloatBar.fadeIn(300, function () {
            $(this).fadeTo(600, .7, 'linear', function () {
                $(this).fadeTo(600, 1, 'linear', function () {
                    $(this).fadeOut(300);
                });
            });
        });
    };
})(window, undefined);
