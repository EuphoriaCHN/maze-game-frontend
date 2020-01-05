'use strict';

((window, undefined) => {
    jQuery(() => {
        let submitButton = $('#submit .selection');
        submitButton.on('click', function (ev) {
            if (typeof window.startPoint === 'undefined') {
                window.drawTipsFloatBar('你还没有设置起点哦', 'error-tips');
                return false;
            } else if (typeof window.endPoint === 'undefined') {
                window.drawTipsFloatBar('你还没有设置终点哦', 'error-tips');
                return false;
            }

            let mazeBody = $('#mazeBody');
            let eachRows = mazeBody.children('.row');

            let maze = [];
            let start = [];
            let end = [];

            for (let i = 0; i < eachRows.length; i++) {
                let row = eachRows.get(i);
                let eachCols = $(row).children();
                let rows = [];
                for (let j = 0; j < eachCols.length; j++) {
                    let block = $(eachCols.get(j));
                    if (block.hasClass('wall')) {
                        rows.push(1);
                    } else {
                        rows.push(0);
                        if (block.hasClass('start')) {
                            start = [i, j];
                        } else if (block.hasClass('end')) {
                            end = [i, j];
                        }
                    }
                }
                maze.push(rows);
            }

            new Promise((resolve, reject) => {
                jQuery.ajax({
                    // url: 'http://maze.wqh4u.cn/api/gettingMaze',
                    url: 'http://127.0.0.1:8000/api/gettingMaze',
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
                    console.log(res);
                    if (res.length === 0) {
                        window.drawTipsFloatBar('无路可走！', 'error-tips');
                    } else {
                        window.drawAnswerLines({
                            steps: res,
                            start: start,
                            end: end
                        });
                    }
                }, function (e) {
                    if (e.statusText) {
                        window.drawTipsFloatBar(e.statusText, 'error-tips');
                    } else {
                        window.drawTipsFloatBar('服务器错误，请稍后再试哦~', 'error-tips');
                    }
                    console.error(e);
                });
        });
    });
})(window, undefined);
