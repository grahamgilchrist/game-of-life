window.modules = window.modules || {};
window.modules.engine = (function ($) {
    'use strict';

    var STATE_READY = 0;
    var STATE_RUNNING = 1;
    var STATE_PAUSED = 2;
    var intervalTime = 300;

    // Set initial game state
    var state = STATE_READY;

    // variable to store JS swetInterval (so we can clear later if needed)
    var intervalStore;
    // variable to store current tick iteration. Starts at 0
    var tick = 0;
    var gridModel;

    var module = {
        init: function (initialGridModel) {
            gridModel = initialGridModel;
            $('#start-game').on('click', module.startGame);
        },
        startGame: function () {
            if (state === STATE_READY) {
                state = STATE_RUNNING;
                $('#start-game').text('Pause');
                intervalStore = setInterval(module.gameTick, intervalTime);
            } else if (state === STATE_PAUSED) {
                state = STATE_RUNNING;
                $('#start-game').text('Pause');
                intervalStore = setInterval(module.gameTick, intervalTime);
            } else {
                // Game must be running
                state = STATE_PAUSED;
                $('#start-game').text('Start');
                clearInterval(intervalStore);                
            }
        },
        gameTick: function () {
            // don't carry on if game finished
            if (gridModel.allDead()) {
                module.stopGame();
            }
            
            // update tick
            tick += 1;

            // update grid model using conway rules
            // We take a copy of the current state, as each test wants be done indepdently against 
            //  the previous tick grid, and not affected by chnages we make as we loop over the grid
            var originalModel = gridModel;
            var newModel = originalModel.duplicate();

            originalModel.grid.forEach(function (row, rowIndex) {
                row.forEach(function (cell, columnIndex) {
                    module.applyConwayRules(rowIndex, columnIndex, originalModel, newModel);
                });
            });

            // Update the stored gridModel with our chnages
            gridModel = newModel;

            // trigger update event
            $(document).trigger('tick:update', {
                tickNumber: tick
            });
        },
        stopGame: function () {
            clearInterval(intervalStore);
        },
        applyConwayRules: function (row, column, originalModel, newModel) {
            // count neighbours
            var numLiveNeighbours = module.countLiveNeighbours(row, column, originalModel);
            var newState = originalModel.isAlive(row, column);

            if (originalModel.isAlive(row, column)) {
                // Any live cell with fewer than two live neighbours dies, as if caused by under-population.
                if (numLiveNeighbours < 2) {
                    newState = false;
                }

                // Any live cell with two or three live neighbours lives on to the next generation.
                // we do nothing to change the cell
                if (numLiveNeighbours === 2 || numLiveNeighbours === 3) {
                    newState = true;
                }
                // Any live cell with more than three live neighbours dies, as if by over-population.
                if (numLiveNeighbours > 3) {
                    newState = false;
                }
            } else {
                // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
                if (numLiveNeighbours === 3) {
                    newState = true;
                }
            }

            // Update model
            newModel.setState(row, column, newState);
        },
        countLiveNeighbours: function (row, column, gridModel) {
            var numLiveNeighbours = 0;

            // gridModel.isAlive() return a boolean, but adding this to the number either adds 1 or 0
            numLiveNeighbours += gridModel.isAlive(row - 1, column - 1);
            numLiveNeighbours += gridModel.isAlive(row - 1, column);
            numLiveNeighbours += gridModel.isAlive(row - 1, column + 1);
            numLiveNeighbours += gridModel.isAlive(row, column - 1);
            numLiveNeighbours += gridModel.isAlive(row, column + 1);
            numLiveNeighbours += gridModel.isAlive(row + 1, column - 1);
            numLiveNeighbours += gridModel.isAlive(row + 1, column);
            numLiveNeighbours += gridModel.isAlive(row + 1, column + 1);
            
            return numLiveNeighbours;
        },
        toggleSeedCell: function (row, column) {
            if (state !== STATE_READY) {
                // only allow setting seeds before game is running
                return;
            }
    
            var isAlive = gridModel.isAlive(row, column);
            gridModel.setState(row, column, !isAlive);
        }
    }

    return module;
})(window.jQuery);
