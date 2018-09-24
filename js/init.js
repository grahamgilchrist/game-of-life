(function ($) {
    'use strict';

    $(document).ready(function () {
        var gridModel = new window.modules.GridModel();

        window.modules.gridView.init();
        window.modules.engine.init(gridModel);
        
        window.modules.gridView.renderInitialGrid(gridModel);
    });
})(window.jQuery);
