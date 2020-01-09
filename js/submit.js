'use strict';

((window, undefined) => {
    jQuery(() => {
        /**
         * 当点击了 submit 按钮时调用
         * @returns {boolean} 如果为 false 代表提交失败
         */
        window.submitMaze = function () {
            // 如果未设置起点或者终点
            if (typeof window.startPoint === 'undefined') {
                window.drawTipsFloatBar('你还没有设置起点哦', 'error-tips');
                return false;
            } else if (typeof window.endPoint === 'undefined') {
                window.drawTipsFloatBar('你还没有设置终点哦', 'error-tips');
                return false;
            }

            let mazeBody = $('#mazeBody');
            let eachRows = mazeBody.children('.row');

            // 记录数据，为广搜做准备
            let maze = [];
            let start = [];
            let end = [];

            // 遍历迷宫的每一行
            for (let i = 0; i < eachRows.length; i++) {
                // 获得当前行
                let row = eachRows.get(i);
                let eachCols = $(row).children();
                let rows = [];
                for (let j = 0; j < eachCols.length; j++) {
                    // 获得当前区块
                    let block = $(eachCols.get(j));
                    if (block.hasClass('wall')) {
                        // 如果是墙，则令其为 -1
                        rows.push(-1);
                    } else {
                        // 反之为 0
                        rows.push(0);
                        if (block.hasClass('start')) {
                            // 如果当前元素是起点
                            start = [i, j];
                        } else if (block.hasClass('end')) {
                            // 如果当前元素是终点
                            end = [i, j];
                        }
                    }
                }
                maze.push(rows);
            }

            new Promise((resolve, reject) => {
                // 发送请求
                jQuery.ajax({
                    // url: 'http://maze.wqh4u.cn/api/gettingMaze',
                    url: 'http://localhost:8000/api/gettingMaze',
                    dataType: 'text',
                    type: 'POST',
                    data: {
                        maze: JSON.stringify(maze),
                        start: JSON.stringify(start),
                        end: JSON.stringify(end)
                    },
                    success: function (res) {
                        resolve(res);
                    },
                    error: function (e) {
                        reject(e);
                    }
                });
            })
                .then(function (res) {
                    res = $.parseJSON(res);
                    if (res.length === 0) {
                        // 如果返回了一个空列表则代表没有去终点的方法
                        window.drawTipsFloatBar('无路可走！', 'error-tips');
                    } else {
                        window.drawAnswerLines({
                            steps: res,
                            start: start,
                            end: end
                        });
                    }
                    return true;
                }, function (e) {
                    if (e && e.statusText) {
                        window.drawTipsFloatBar(e.statusText, 'error-tips');
                    } else {
                        window.drawTipsFloatBar('服务器错误，请稍后再试哦~', 'error-tips');
                    }
                    console.error(e);
                    return false;
                });
        };

        /**
         * 获取随机的一个迷宫
         */
        window.getRandomMaze = function () {
            new Promise((resolve, reject) => {
                jQuery.ajax({
                    // url: 'http://maze.wqh4u.cn/api/randomMaze',
                    url: 'http://localhost:8000/api/randomMaze',
                    dataType: 'text',
                    type: 'POST',
                    data: {
                        rowNumber: JSON.stringify(window.mazeRows),
                        colNumber: JSON.stringify(window.mazeCols),
                    },
                    success: function (res) {
                        resolve(res);
                    },
                    error: function (e) {
                        reject(e);
                    }
                });
            }).then(data => {
                data = $.parseJSON(data);
                if (data.status === 500) {
                    window.drawTipsFloatBar(data.data, 'error-tips');
                }　else {
                    window.createRandomMaze(data.data);
                }
            }, e => {
                if (e && e.statusText) {
                    window.drawTipsFloatBar(e.statusText, 'error-tips');
                } else {
                    window.drawTipsFloatBar('服务器错误，请稍后再试哦~', 'error-tips');
                }
                console.error(e);
                return false;
            });
        }
    });
})(window, undefined);
