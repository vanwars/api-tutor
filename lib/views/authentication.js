define(["underscore", "views/base"],
    function (_, Base) {
        "use strict";
        var AuthenticationView = Base.extend({
        	
            initialize: function (opts) {
            	_.extend(this, opts);
                this.globals.token = this.token;
                localStorage.setItem('access_token', this.token);
                this.globals.appRouter.navigate('#/' + this.redirect_route);
            }
        });
        return AuthenticationView;
    });