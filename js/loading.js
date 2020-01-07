'use strict';

/**
 * 当页面处于并行加载 JS 脚本时的加载动画逻辑
 */
(function (window, undefined) {
    let nowLoading = document.getElementById('nowLoading');
    let loadingPointCounter = 0;
    nowLoading.timingInterval = window.setInterval(function () {
        if (++loadingPointCounter > 3) {
            loadingPointCounter = 0;
        }
        switch (loadingPointCounter) {
            case 0:
                nowLoading.innerHTML = 'now loading&nbsp;&nbsp;&nbsp;';
                break;
            case 1:
                nowLoading.innerHTML = 'now loading.&nbsp;&nbsp;';
                break;
            case 2:
                nowLoading.innerHTML = 'now loading..&nbsp;';
                break;
            case 3:
                nowLoading.innerHTML = 'now loading...';
        }
    }, 300);

    window.nowLoading = nowLoading;
})(window, undefined);
