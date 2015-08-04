define(["underscore", 
		"views/base",
		"hello",
		"hello-instagram"
		],
    function (_, Base, hello) {
        "use strict";
        var LoginView = Base.extend({
        	
        	events: {
        		'click .btn': 'login'
        	},
        	initialize: function (opts) {
        		_.extend(this, opts);
        		var that = this;
        		hello.init({
					instagram: 'beca1ae92f3d41aebf31830a19df35d5'
				}, {
					redirect_uri: 'http://apitutor.org'
				});
				this.render();
        	},
            
            login: function (e) {
            	e.preventDefault();
            	alert("Login!");
            	hello('instagram').login();
            }
        });
        return LoginView;
    });