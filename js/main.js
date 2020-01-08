(function (window, undefined) {
    /**
     * 获得被选中的区块，处理了脚印方框被选中时的兼容问题
     * @param ev 事件对象
     * @returns {*|jQuery.fn.init|jQuery|HTMLElement} 实际被选中的迷宫区块
     */
    let getAttached = ev => {
        let attached = $(ev.target);
        // 如果当前选择到的是一个脚印，那么向上选择其父元素（迷宫区块）
        if (attached.hasClass('line-block')) {
            attached = attached.parent();
        }
        return attached;
    };

    /**
     * 当点击区块时，根据当前游戏状态做出响应
     * @param target 区块 jQuery 对象
     * @returns {boolean} 如果为观察者模式则返回 false
     */
    let changeBlockStatus = target => {
        switch (window.gameStatus) {
            case 0:
                window.drawTipsFloatBar('请先选择模式（鼠标移动至上方）', 'error-tips');
                // window.alert('请先选择模式（鼠标移动至上方）');
                return false;
            case 1:
                // building
                // 如果和起点或终点冲突了
                if (typeof window.startPoint !== 'undefined' && target.get(0) === window.startPoint.get(0)) {
                    window.startPoint = undefined;
                }
                if (typeof window.endPoint !== 'undefined' && target.get(0) === window.endPoint.get(0)) {
                    window.endPoint = undefined;
                }
                target.addClass('wall');
                break;
            case 2:
                // Set Start
                // remove old start
                if (typeof window.startPoint !== 'undefined') {
                    window.startPoint.removeClass('start');
                    window.startPoint = undefined;
                }
                // 如果起点和终点冲突了
                if (typeof window.endPoint !== 'undefined' && target.get(0) === window.endPoint) {
                    window.endPoint.removeClass('end');
                    window.endPoint = undefined;
                }
                // 如果这里本身是墙
                if (target.hasClass('wall')) {
                    target.removeClass('wall');
                }
                // set start
                target.addClass('start');
                // update start
                window.startPoint = target;
                break;
            case 3:
                // Set End
                // remove old end
                if (typeof window.endPoint !== 'undefined') {
                    window.endPoint.removeClass('end');
                    window.endPoint = undefined;
                }
                // 如果终点和起点冲突了
                if (typeof window.startPoint !== 'undefined' && target.get(0) === window.startPoint) {
                    window.startPoint.removeClass('start');
                    window.startPoint = undefined;
                }
                // 如果这里本身是墙
                if (target.hasClass('wall')) {
                    target.removeClass('wall');
                }
                // set end
                target.addClass('end');
                // update end
                window.endPoint = target;
                break;
            case 4:
                // Remove
                // 如果清除掉了起点或终点
                if (typeof window.startPoint !== 'undefined' && target.get(0) === window.startPoint.get(0)) {
                    window.startPoint.removeClass('start');
                    window.startPoint = undefined;
                    break;
                }
                if (typeof window.endPoint !== 'undefined' && target.get(0) === window.endPoint.get(0)) {
                    window.endPoint.removeClass('end');
                    window.endPoint = undefined;
                    break;
                }
                // remove
                if (target.hasClass('wall')) {
                    target.removeClass('wall');
                }
                break;
        }
        // 因为迷宫的状态发生了改变，可能会导致原先的路径不再使用，则需要清空
        window.clearAnswersAnimation();
        return true;
    };

    /**
     * 加载迷宫
     */
    window.loadingMaze = function () {
        let maze = $('#maze');
        let mazeBody = $('#mazeBody');
        let mazeHeight = maze.height();
        let mazeWidth = maze.width();

        let mazeRows = 10, mazeCols = 20; // 迷宫默认10行20列

        let eachColumnWidth = Math.floor(mazeWidth / mazeCols); // 计算出每一列的宽度
        let eachRowsHeight = Math.floor(mazeHeight / mazeRows); // 计算出每一行的高度

        let totalWidth = 0, totalHeight = 0; // 总迷宫宽度 总迷宫高度

        if (eachRowsHeight < eachColumnWidth) {
            // 如果每一行的高度小于每一列的宽度，那么应该压缩列宽
            // 即，高度占满，自适应宽度
            eachColumnWidth = eachRowsHeight;
            totalWidth = eachRowsHeight * mazeCols; // 以行高为参照，设置迷宫
            totalHeight = eachRowsHeight * mazeRows;
        } else {
            // 如果每一列的宽度小于每一行的高度，那么应该压缩行高
            // 即，宽度沾满，自适应高度
            eachRowsHeight = eachColumnWidth;
            totalWidth = eachColumnWidth * mazeCols; // 以列宽为参照，设置迷宫
            totalHeight = eachColumnWidth * mazeRows;
        }

        // 设置迷宫容器
        mazeBody.css({
            width: totalWidth,
            height: totalHeight
        });

        // 装载区块
        for (let i = 0; i < mazeRows; i++) {
            let rowDivision = $('<div></div>');
            // 装载每一行
            for (let j = 0; j < mazeCols; j++) {
                let colDivision = $('<div></div>');
                colDivision.css({
                    width: eachColumnWidth + 'px',
                    height: eachRowsHeight + 'px',
                }).addClass('col');
                // 装载每一列
                rowDivision.append(colDivision);
            }
            rowDivision.addClass('clearfix').addClass('row');
            mazeBody.append(rowDivision);
        }

        // 设置迷宫区块宽高为全局变量
        window.blockHeight = eachRowsHeight;
        window.blockWidth = eachColumnWidth;

        // 初始化游戏属性
        window.gameStatus = 0; // 观察者模式
        window.startPoint = undefined; // 起点位置
        window.endPoint = undefined; // 终点位置
        window.autoSubmit = false; // 自动提交
    };

    // 切换当前操作
    $('#blockSelector .content').on('click', function () {
        let selectionId = $(this).attr('id');
        let title = $('h2 sub');

        switch (selectionId) {
            case 'building':
                window.gameStatus = 1; // 正在造墙
                window.drawTipsFloatBar('正在设置障碍物', 'info-tips');
                title.text('building');
                break;
            case 'begin':
                window.gameStatus = 2; // 正在设置起点
                window.drawTipsFloatBar('正在设置起点', 'info-tips');
                title.text('set start');
                break;
            case 'finish':
                window.gameStatus = 3; // 正在设置终点
                window.drawTipsFloatBar('正在设置终点', 'info-tips');
                title.text('set end');
                break;
            case 'clear':
                window.gameStatus = 4; // 橡皮擦模式
                window.drawTipsFloatBar('橡皮擦模式', 'info-tips');
                title.text('remove');
                break;
        }
    });

    // 改变区块
    $('#mazeBody').on('mousedown', function (ev) {
        let attached = getAttached(ev);
        // 如果确实是某区块被选中
        if (attached.hasClass('col')) {
            // 处理单击事件
            if (!changeBlockStatus(attached)) {
                ev.stopPropagation();
                return false;
            }

            // 处理拖拽事件
            $(window).on('mousemove', function (ev) {
                let attached = $(ev.target);

                // 如果确实是某区块被选中
                if (attached.hasClass('col')) {
                    // 处理拖拽事件
                    changeBlockStatus(attached);
                }
            });
        }
    }).on('mouseup', function (ev) {
        // 清除拖拽事件
        $(window).off('mousemove');
        // 如果当前处于自动提交状态
        if (window.autoSubmit) {
            let attached = getAttached(ev);
            // 如果确实是一个迷宫区块被选中了
            if (attached.hasClass('col')) {
                // 如果此时既设置了起点也设置了终点
                if (typeof window.startPoint !== 'undefined' && typeof window.endPoint !== 'undefined') {
                    // 首先清空当前所有的路径，以避免请求返回了无路可走，随不调用绘画路径的结果
                    window.clearAnswersAnimation();
                    // 视为提交
                    $('#submit .selection').click();
                }
            }
        }
    }).on('mouseover', function (ev) {
        // 鼠标滑入
        let attached = getAttached(ev);
        // 如果确实是某区块被划过
        if (attached.hasClass('col')) {
            attached.css({
                border: '1px solid rgba(242, 242, 242, 1)',
            });
        }
    }).on('mouseout', function (ev) {
        // 鼠标滑出
        let attached = getAttached(ev);
        // 如果确实是某区块被划过
        if (attached.hasClass('col')) {
            attached.css({
                border: '1px dashed rgba(213, 213, 213, 0.10)',
            });
        }
    }).on('mouseleave', function (ev) {
        // 这里为了解决鼠标在拖拽时移动出去了，但 mouseout 事件存在着事件冒泡并不能很好的处理这件事
        // 需要清除拖拽事件
        if (typeof $._data(window, 'events')['mousemove'] !== 'undefined') {
            // https://blog.csdn.net/weixin_30299539/article/details/95805980
            // 如果当前确实有拖拽事件
            $(window).off('mousemove');
            // 既然已经移动出去，并且视为鼠标已经弹起，那么应该处理自动提交
            // 如果当前处于自动提交状态
            if (window.autoSubmit) {
                let attached = getAttached(ev);
                // 如果确实是一个迷宫区块被选中了
                if (attached.hasClass('col')) {
                    // 如果此时既设置了起点也设置了终点
                    if (typeof window.startPoint !== 'undefined' && typeof window.endPoint !== 'undefined') {
                        // 首先清空当前所有的路径，以避免请求返回了无路可走，随不调用绘画路径的结果
                        window.clearAnswersAnimation();
                        // 视为提交
                        $('#submit .selection').click();
                    }
                }
            }
        }
    });

    // 提交
    $('#submit .selection').on('click', function (ev) {
        window.submitMaze();
    });

    // 将模式切换为自动提交 / 非自动提交
    $('#auto .selection').on('click', function (ev) {
        if (window.autoSubmit) {
            // 如果原来为自动提交
            window.drawTipsFloatBar('关闭自动寻路模式！', 'info-tips');
            $(this).css({
                animation: '',
                color: ''
            });
        } else {
            // 如果原来并非自动提交
            window.drawTipsFloatBar('切换为自动寻路模式！', 'info-tips');
            $(this).css({
                animation: 'heart-beat 1.33s ease-in-out infinite',
                color: '#2fddc6'
            });
        }
        window.autoSubmit = !(window.autoSubmit);
    });

    // 清空
    $('#reset .selection').on('click', function (ev) {
        // 恢复选区颜色
        let allCol = $('.col');
        if (allCol.hasClass('wall')) {
            allCol.removeClass('wall');
        }
        if (allCol.hasClass('start')) {
            allCol.removeClass('start');
        }
        if (allCol.hasClass('end')) {
            allCol.removeClass('end');
        }
        // 清空路径
        window.clearAnswersAnimation();

        // 清空起点和终点
        if (typeof window.startPoint !== 'undefined') {
            window.startPoint = undefined;
        }
        if (typeof window.endPoint !== 'undefined') {
            window.endPoint = undefined;
        }
    });
})(window, undefined);
