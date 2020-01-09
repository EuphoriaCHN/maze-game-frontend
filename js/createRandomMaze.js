((window, undefined) => {
    jQuery(() => {
        /**
         * 构建随即迷宫
         * @param randomMaze
         */
        window.createRandomMaze = function (randomMaze) {
            // 首先应该清空当前的所有迷宫
            $('#reset').click();

            let mazeBody = $('#mazeBody');
            let eachRows = mazeBody.children('.row');
            // now = $(eachRows.get(curRow).children[curCol]);

            randomMaze.forEach((rows, i) => {
                rows.forEach((cols, j) => {
                    if (cols === 1) {
                        // 如果这一点是墙壁
                        $(eachRows.get(i).children[j]).addClass('wall');
                    }
                });
            });

            // 放置起点和终点
            window.startPoint = $(eachRows.get(0).children[0]).addClass('start');
            window.endPoint = $(eachRows.get(window.mazeRows - 1).children[window.mazeCols - 1]).addClass('end');

            // 自动提交
            if (window.autoSubmit) {
                $('#submit').click();
            }
        };
    });
})(window, undefined);
