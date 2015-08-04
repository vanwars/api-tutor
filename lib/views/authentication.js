define(["underscore", 
		"views/base",
		"hello",
		"hello-instagram"
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
	        		hello.init({
						instagram: 'beca1ae92f3d41aebf31830a19df35d5'
					}, {
						redirect_uri: 'http://apitutor.org/instagram/'
					});
					this.render();
        		} else {
        			this.logout();
        		}
        	},
            
            login: function (e) {
            	e.preventDefault();
            	hello(this.provider).login();
            },
            
            logout: function () {
            	hello.logout(this.provider);
            	this.globals.appRouter.navigate('#/' + this.redirect_route);
            }
        });
        return AuthenticationView;
    });