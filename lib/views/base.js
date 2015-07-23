define(["underscore", "marionette", "views/view-mixin"],
    function (_, Marionette, ViewMixin) {
        "use strict";
        var BaseView = Marionette.View.extend({
            initialize: function (opts) {
            	this.opts = opts;
                //Note: render is defined in the ViewMixin.
                this.render();
            }
        });
        _.extend(BaseView.prototype, ViewMixin);
        return BaseView;
    });