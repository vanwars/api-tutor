define(["underscore", "views/base"],
    function (_, Base) {
        "use strict";
        var AuthenticationView = Base.extend({
            initialize: function (opts) {
            	_.extend(this, opts);
                this.globals.token = this.token;
                this.globals.appRouter.navigate('#/media-by-tag/photo_hover.tpl');
            }
        });
        return AuthenticationView;
    });