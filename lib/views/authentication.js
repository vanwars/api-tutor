define(["underscore", 
		"views/base",
		"hello"
		],
    function (_, Base, hello) {
        "use strict";
        var AuthenticationView = Base.extend({
        	events: {
        		'click .btn': 'login'
        	},
        	initialize: function (opts) {
        		_.extend(this, opts);
        		if (this.action == 'login') {
	        		hello.init(this.globals.api_keys, {
						redirect_uri: 'http://apitutor.org/' + this.provider + '/',
						oauth_proxy: 'https://auth-server.herokuapp.com/proxy',
						display: 'popup'
					});
					this.render();
        		} else {
        			this.logout();
        		}
        	},
            
            login: function (e) {
            	e.preventDefault();
            	console.log("logging in", this.provider);
            	hello(this.provider).login();
            },
            
            logout: function () {
            	hello.logout(this.provider);
            	this.globals.appRouter.navigate('#/' + this.redirect_route);
            }
        });
        return AuthenticationView;
    });