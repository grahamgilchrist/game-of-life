window.modules = window.modules || {};
window.modules.GridModel = (function ($) {
    'use strict';

    // javascript object depicting a grid model
    // Use prototypical inheritance to define a javscript OOP like object with "methods"
    // The window module returns a consturctor for a new grid model

    var CELL_DEAD = 0;
    var CELL_ALIVE = 1;

    // define object contructor
    var GridModel = function () {
        var numRows = 100;
        var numCols = 100;
        this.createGrid(numRows, numCols);
    };

    GridModel.prototype.duplicate = function () {
        var newModel = new GridModel();
        // Use JSON methods as a quick way to ensure we copy contents of grid and not reference to this models grid
        newModel.grid = JSON.parse(JSON.stringify(this.grid));
        return newModel;
    }

    GridModel.prototype.createGrid = function (numRows, numCols) {
        // create a nested array representation of the grid with all cells initially dead
        this.grid = [];

        for (var rowIndex = 0; rowIndex < numRows; rowIndex++) {
            var row = [];
            for (var colIndex = 0; colIndex < numCols; colIndex++) {
                var cell = CELL_DEAD;
                row.push(cell);
            }
            this.grid.push(row);
        }
    };

    GridModel.prototype.isAlive = function (row, column) {
        // All cells outside the grid are considered to be dead.        
        if (row === this.numRows + 1 || row === - 1) {
            return false;
        }
        if (column === this.numCols + 1 || column === - 1) {
            return false;
        }

        if (this.grid[row] && this.grid[row][column] === CELL_ALIVE) {
            return true;
        }

        return false;
    };
    
    GridModel.prototype.allDead = function () {
        for (var rowIndex = 0; rowIndex < this.grid.length; rowIndex++) {
            for (var columnIndex = 0; columnIndex < this.grid[rowIndex].length; columnIndex++) {
                if (this.isAlive(rowIndex, columnIndex)) {
                    return false;
                }                
            }
        }
        return true;
    }

    GridModel.prototype.setState = function (row, column, alive) {
        // store original stae for comparison later
        var originalState = this.isAlive(row, column);

        // set new value
        if (alive) {
            this.grid[row][column] = CELL_ALIVE;
        } else {
            this.grid[row][column] = CELL_DEAD;
        }

        var newState = this.isAlive(row, column);

        // trigger update event if model has changed
        if (originalState !== newState) {
            var eventData = {
                gridModel: this,
                row: row,
                column: column
            };
            $(document).trigger('gridModel:update', eventData);
        }
    };

    return GridModel;
})(window.jQuery);
