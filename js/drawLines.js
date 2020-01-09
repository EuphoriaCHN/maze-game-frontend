'use strict';

((window, undefined) => {
    jQuery(function () {
        // 定义脚步方向
        let decorations = {
            'UP': [-1, 0].toString(),
            'DOWN': [1, 0].toString(),
            'LEFT': [0, -1].toString(),
            'RIGHT': [0, 1].toString()
        };

        /**
         * 旋转脚印
         * @param step 当前脚印 jQuery 对象
         * @param rotateDeg 旋转角度
         */
        let setStepDecoration = (step, rotateDeg) => {
            step.css('transform', `rotate(${rotateDeg}deg)`);
        };

        /**
         * 清空路径动画
         */
        window.clearAnswersAnimation = function () {
            // 停止当前正在创建路径的计时器
            window.clearInterval(window.createLineTimer);
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
            // 获得上一步的脚印方向
            let before = undefined;

            window.createLineTimer = window.setInterval(function () {
                if (index === steps.length - 1) {
                    // 走到了终点前一个就退出，以防覆盖终点
                    window.clearInterval(window.createLineTimer);
                    return;
                }
                curRow += window.dx[parseInt(steps[index]) - 1];
                curCol += window.dy[parseInt(steps[index]) - 1];
                index += 1;

                let now = $(eachRows.get(curRow).children[curCol]);

                let offset = 24; // 把这个元素缩小（要不然图片太大）

                if (window.blockHeight < 25) {
                    offset = 0; // 如果迷宫格子本身就很小了，那么就不要缩放了
                }
                // 直接将这个路径节点添加到当前迷宫区块内作为一个子元素存在
                let newStep = $("<div></div>");
                newStep.addClass('line-block').css({
                    width: Math.max(...[1, window.blockWidth - offset]) + 'px',
                    height: Math.max(...[1, window.blockHeight - offset]) + 'px',
                    top: offset / 2 + 'px', // 设置了 position: relative
                    left: offset / 2 + 'px'
                });

                let decorationString = [window.dx[parseInt(steps[index]) - 1], window.dy[parseInt(steps[index]) - 1]].toString();
                if (decorationString === decorations['UP']) {
                    // TOP
                    if (typeof before !== 'undefined') {
                        if (before === decorations['LEFT']) {
                            // 上一步是向左走的，现在往上走，那么脚印因该朝着左上
                            setStepDecoration(newStep, -45);
                        } else if (before !== decorations['UP']) {
                            // 因为这一步是向上走的，那么上一步不可能是向下走，只可能是向右
                            // 那么这一步应该往右上
                            setStepDecoration(newStep, 45);
                        }
                    }
                    // 反之要不然这是第一步，图片本身就是向上的，不用旋转
                    // 要么上一步也是向上的，图片本身就是向上的，不用旋转
                } else if (decorationString === decorations['DOWN']) {
                    // DOWN
                    if (typeof before !== 'undefined') {
                        if (before === decorations['DOWN']) {
                            // 上一步也是往下走的，那么这一步不变
                            setStepDecoration(newStep, 180);
                        } else {
                            if (before === decorations['LEFT']) {
                                // 上一步是向左走的，现在往下走，那么脚印因该朝着左下
                                setStepDecoration(newStep, 225);
                            } else {
                                // 因为这一步是向下走的，那么上一步不可能是向下走，只可能是向右
                                // 那么这一步应该往右下
                                setStepDecoration(newStep, 135);
                            }
                        }
                    } else {
                        // 这是第一步，则直接设置
                        setStepDecoration(newStep, 180);
                    }
                } else if (decorationString === decorations['LEFT']) {
                    // LEFT
                    if (typeof before !== 'undefined') {
                        if (before === decorations['LEFT']) {
                            // 上一步也是往左走的，那么这一步不变
                            setStepDecoration(newStep, -90);
                        } else {
                            if (before === decorations['UP']) {
                                // 上一步是向上走的，现在往左走，那么脚印因该朝着左上
                                setStepDecoration(newStep, -45);
                            } else {
                                // 因为这一步是向左走的，那么上一步不可能是向右走，只可能是向下
                                // 那么这一步应该往左下
                                setStepDecoration(newStep, 225);
                            }
                        }
                    } else {
                        // 这是第一步，则直接设置
                        setStepDecoration(newStep, -90);
                    }
                } else {
                    // RIGHT
                    if (typeof before !== 'undefined') {
                        if (before === decorations['RIGHT']) {
                            // 上一步也是往右走的，那么这一步不变
                            setStepDecoration(newStep, 90);
                        } else {
                            if (before === decorations['UP']) {
                                // 上一步是向上走的，现在往左走，那么脚印因该朝着右上
                                setStepDecoration(newStep, 45);
                            } else {
                                // 因为这一步是向左走的，那么上一步不可能是向左走，只可能是向下
                                // 那么这一步应该往右下
                                setStepDecoration(newStep, 135);
                            }
                        }
                    } else {
                        // 这是第一步，则直接设置
                        setStepDecoration(newStep, 90);
                    }
                }
                before = decorationString;

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
