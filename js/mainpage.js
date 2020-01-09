'use strict';

(function (window, undefined) {
    // 主页逻辑
    jQuery(function () {
        // 当页面加载
        window.addEventListener('load', function (ev) {
            // 切换标题，隐藏 now loading
            $(nowLoading).fadeOut(600, function () {
                $('.title').stop().fadeIn(600);
                $('#start').css('display', 'block');
            });
            // 清除 now loading 省略号定时器
            window.clearInterval(window.nowLoading.timingInterval);
            window.nowLoading.timingInterval = undefined;

            // 添加在主页敲击回车进入效果
            document.documentElement.onkeyup = ev => {
                let e = ev || window.event;
                let keyCode = e.code;
                // 敲击了回车
                if (keyCode === 'Enter' || keyCode === 'NumpadEnter') {
                    $('#start').click();
                }
            };

            // TweenLite 闭包逻辑
            (function () {
                if (typeof TweenLite !== 'undefined') {
                    console.log("TweenMax.min.js has been loaded!");
                    let box = document.querySelector("#mainPage");
                    let dt = document.querySelectorAll(".dot");
                    window.addEventListener("mousemove", function (e) {
                        for (let i = 0; i < dt.length; i++) {
                            //圆灯相对于 容器的坐标位置
                            let x = e.pageX - box.offsetLeft - dt[i].offsetWidth / 2;
                            let y = e.pageY - box.offsetTop - dt[i].offsetHeight / 2;
                            TweenLite.to(dt[i], i + 0.2, {
                                x: x,
                                y: y,
                                ease: Back.easeOut.config(1.7)
                            });
                        }
                    });
                } else {
                    console.error("TweenMax.min.js Load Error!");
                }
            })();

            // 开始按钮逻辑
            $('#start').hover(function () {
                let animateUnderline = $('.animate-underline');

                // 清除原动画
                if (animateUnderline.get(0).timingInterval) {
                    window.clearInterval(animateUnderline.get(0).timingInterval);
                }

                // 清除 document.documentElement 原先身上绑定的 keyup 事件
                document.documentElement.onkeyup = null;

                // 设定动画
                animateUnderline.get(0).timingInterval = window.setInterval(function () {
                    let oldWidth = parseInt(animateUnderline.css('width'));

                    let change = Math.floor((425 - oldWidth) / 10) + oldWidth; // 渐变动画算法

                    if (change === oldWidth) change++;

                    if (change >= 425) {
                        // 终点格式化
                        animateUnderline.css({
                            width: '425px',
                            left: '0'
                        });
                        window.clearInterval(animateUnderline.get(0).timingInterval);
                        animateUnderline.get(0).timingInterval = undefined;
                    }

                    animateUnderline.css({
                        width: change + 'px',
                        left: parseInt(425 / 2 - change / 2) + 'px'
                    });
                }, 15);
            }, function () {
                let animateUnderline = $('.animate-underline');

                // 清除原动画
                if (animateUnderline.get(0).timingInterval) {
                    window.clearInterval(animateUnderline.get(0).timingInterval);
                }

                // 设置动画
                animateUnderline.get(0).timingInterval = window.setInterval(function () {
                    let oldWidth = parseInt(animateUnderline.css('width'));

                    let change = oldWidth - Math.ceil(oldWidth / 10); // 渐变动画算法

                    if (change === oldWidth) change--;

                    if (change <= 0) {
                        // 终点格式化
                        animateUnderline.css({
                            width: '0',
                            left: '50%'
                        });
                        window.clearInterval(animateUnderline.get(0).timingInterval);
                        animateUnderline.get(0).timingInterval = undefined;
                    }

                    animateUnderline.css({
                        width: change + 'px',
                        left: parseInt(425 / 2 - change / 2) + 'px'
                    });
                }, 15);
            });
        });
    });
})(window, undefined);
