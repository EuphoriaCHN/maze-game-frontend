'use strict';

((window, undefined) => {
    jQuery(function () {
        /**
         * 清空路径动画
         */
        window.clearAnswersAnimation = function () {
            // 格式化旧路径
            if (typeof window.answerLines === 'undefined') {
                window.answerLines = [];
            } else {
                while (window.answerLines.length !== 0) {
                    let temp = answerLines.pop();
                    window.clearInterval(temp.displayTimer);
                    temp.stop().remove(); // 清空旧路径
                }
            }
        };
        /**
         * 绘制结果路线
         * @param data 结果步伐状态列表
         */
        window.drawAnswerLines = function (data) {
            window.clearAnswersAnimation();

            let mazeBody = $('#mazeBody');
            let eachRows = mazeBody.children('.row');

            let steps = data.steps;
            let start = data.start;

            // 控制迷宫的每一行元素
            let curRow = start[0], curCol = start[1];
            // 步数游标，查询当前走向
            let index = 0;

            var timer = window.setInterval(function () {
                if (index === steps.length - 1) {
                    // 走到了终点前一个就退出，以防覆盖终点
                    window.clearInterval(timer);
                    return;
                }
                curRow += window.dx[parseInt(steps[index]) - 1];
                curCol += window.dy[parseInt(steps[index]) - 1];
                index += 1;

                let now = $(eachRows.get(curRow).children[curCol]);
                let offset = 16; // 把这个元素缩小（要不然图片太大）

                // 直接将这个路径节点添加到当前迷宫区块内作为一个子元素存在
                let newStep = $("<div></div>");
                newStep.addClass('line-block').css({
                    width: Math.max(...[1, window.blockWidth - offset]) + 'px',
                    height: Math.max(...[1, window.blockHeight - offset]) + 'px',
                    top: offset / 2 + 'px', // 设置了 position: relative
                    left: offset / 2 + 'px'
                });

                let decorationString = [window.dx[parseInt(steps[index]) - 1], window.dy[parseInt(steps[index]) - 1]].toString();
                if (decorationString === [-1, 0].toString()) {
                    // TOP
                    // 向上则不用旋转，背景图片本身就是向上的
                } else if (decorationString === [1, 0].toString()) {
                    // DOWN
                    newStep.css('transform', 'rotate(180deg)');
                } else if (decorationString === [0, -1].toString()) {
                    // LEFT
                    newStep.css('transform', 'rotate(-90deg)');
                } else {
                    // RIGHT
                    newStep.css('transform', 'rotate(90deg)');
                }

                // 设置动画
                newStep.displayTimer = window.setInterval(function () {
                    newStep.fadeToggle(300, function () {
                        newStep.fadeToggle(300);
                    });
                }, 1000);

                // 添加至迷宫区块中作为子元素
                now.append(newStep);

                // 将当前步伐装载至队列
                window.answerLines.push(newStep);
            }, 120);
        };
    });
})(window, undefined);
