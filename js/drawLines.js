'use strict';

((window, undefined) => {
    jQuery(function () {
        window.drawAnswerLines = function (data) {
            let mazeBody = $('#mazeBody');
            let eachRows = mazeBody.children('.row');

            let steps = data.steps;
            let start = data.start;

            // 控制迷宫的每一行元素
            let curRow = start[0], curCol = start[1];
            // 步数游标，查询当前走向
            let i = 0;

            var timer = window.setInterval(function () {
                if (i === steps.length - 1) {
                    // 走到了终点前一个就退出，以防覆盖终点
                    window.clearInterval(timer);
                    return;
                }
                curRow += window.dx[parseInt(steps[i]) - 1];
                curCol += window.dy[parseInt(steps[i]) - 1];
                i += 1;

                let now = $(eachRows.get(curRow).children[curCol]);

                now.addClass('line');
            }, 50);
        };
    });
})(window, undefined);
