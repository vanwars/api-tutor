define([], function () {
    "use strict";
    var AuthenticationMixin = {
        setCredentials: function () {
        	var access_token = localStorage.getItem('access_token');
        	if(access_token) {
        		this.globals.token = access_token;
        	}
        }
    };
    return AuthenticationMixin;
});