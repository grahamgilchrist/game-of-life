window.modules = window.modules || {};
window.modules.gridView = (function ($) {
    'use strict';

    var numRows = 100;
    var numCols = 100;

    var module = {
        init: function () {
            $(document).on('gridModel:update', module.updateGridElement);
            $(document).on('tick:update', module.updateTick);
            $('#game-grid').on('click', '.cell', module.clickCell);
        },
        renderInitialGrid: function (gridModel) {
            var $grid = $('#game-grid');
            $grid.empty();

            gridModel.grid.forEach(function (row, rowIndex) {
                var $row = $('<div class="row" position="' + rowIndex + '">');
                row.forEach(function (cell, columnIndex) {
                    var $cell = $('<div class="cell" position="' + columnIndex + '">');
                    $row.append($cell);
                });
                $grid.append($row);
            });
        },
        updateGridElement: function (event, eventData) {
            // Creating and inserting DOM elements for each grid render is costly, so
            //  we just update the classes of all the cells
            var gridModel = eventData.gridModel;

            if (eventData.row !== undefined && eventData.column !== undefined) {
                // event has been triggered for a single cell
                module.updateCellElement(gridModel, eventData.row, eventData.column);
            }
        },
        updateCellElement: function (gridModel, rowIndex, columnIndex) {
            var $cell = $('#game-grid .row').eq(rowIndex).find('.cell').eq(columnIndex);
            if (gridModel.isAlive(rowIndex, columnIndex)) {
                $cell.addClass('alive');
            } else {
                $cell.removeClass('alive');
            }
        },
        updateTick: function (event, eventData) {
            $('#tick').text(eventData.tickNumber);
        },
        clickCell: function (event) {
            var $cell = $(this);
            var column = $cell.attr('position');
            var $row = $cell.closest('.row');
            var row = $row.attr('position');

            window.modules.engine.toggleSeedCell(row, column);
        }
    }

    return module;
})(window.jQuery);
