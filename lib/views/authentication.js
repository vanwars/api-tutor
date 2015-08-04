define(["underscore", "views/base"],
    function (_, Base) {
        "use strict";
        var AuthenticationView = Base.extend({
        	
            initialize: function (opts) {
            	_.extend(this, opts);
            	if (this.token) {
            		this.login();
            	} else {
            		this.logout();
            	}
            }, 
            
            login: function () {
                this.globals.token = this.token;
                localStorage.setItem('access_token', this.token);
                this.globals.appRouter.navigate('#/' + this.redirect_route);
            },
            
            logout: function () {
            	console.log("logout");
            	localStorage.setItem('access_token', null);
            	this.globals.appRouter.navigate('#/' + this.redirect_route);
            }
        });
        return AuthenticationView;
    });