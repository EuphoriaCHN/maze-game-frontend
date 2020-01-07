(function (window, undefined) {
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
                    return true;
                }
                if (typeof window.endPoint !== 'undefined' && target.get(0) === window.endPoint.get(0)) {
                    window.endPoint.removeClass('end');
                    window.endPoint = undefined;
                    return true;
                }
                // remove
                target.removeClass('wall');
                break;
        }
        return true;
    };

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
                    width: eachColumnWidth,
                    height: eachRowsHeight,
                }).addClass('col');
                // 装载每一列
                rowDivision.append(colDivision);
            }
            rowDivision.addClass('clearfix').addClass('row');
            mazeBody.append(rowDivision);
        }

        // 初始化游戏属性
        window.gameStatus = 0; // 观察者模式
        window.startPoint = undefined; // 起点位置
        window.endPoint = undefined; // 终点位置
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
        let attached = $(ev.target);
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
    }).on('mouseover', function (ev) {
        // 鼠标滑入
        let attached = $(ev.target);
        // 如果确实是某区块被划过
        if (attached.hasClass('col')) {
            attached.css({
                border: '1px solid rgba(242, 242, 242, 1)',
            });
        }
    }).on('mouseout', function (ev) {
        // 鼠标滑出
        let attached = $(ev.target);
        // 如果确实是某区块被划过
        if (attached.hasClass('col')) {
            attached.css({
                border: '1px dashed rgba(213, 213, 213, 0.10)',
            });
        }
    });

    // 提交
    $('#submit .selection').on('click', function (ev) {
        window.submitMaze();
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
        if (allCol.hasClass('line')) {
            allCol.removeClass('line');
        }
        // 清空起点和终点
        if (typeof window.startPoint !== 'undefined') {
            window.startPoint = undefined;
        }
        if (typeof window.endPoint !== 'undefined') {
            window.endPoint = undefined;
        }
    });
})(window, undefined);
