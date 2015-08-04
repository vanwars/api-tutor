require.config({
    baseUrl: "/lib",
    paths: {
        'backbone': 'external/backbone-min',
        'handlebars': 'external/handlebars.min',
        'jquery': '//code.jquery.com/jquery-1.8.0.min',
        'jquery.bootstrap': '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min',
        'text': 'external/text',
        'marionette': 'external/backbone.marionette',
        'underscore': 'external/underscore-min',
        'hello': '//cdnjs.cloudflare.com/ajax/libs/hellojs/1.8.0/hello.all.min', //external/hello/hello-forked',
        'hello-instagram': 'external/hello/modules/instagram'
    },
    shim: {
        'underscore': {
            exports: "_"
        },
        'backbone': {
            deps: [ "jquery", "underscore" ],
            exports: "Backbone"
        },
        'marionette': {
            deps: [ "backbone" ],
            exports: "Marionette"
        },
        'handlebars': {
            exports: "Handlebars"
        },
        'hello': {
            exports: "hello"
        },
        'hello-instagram': {
        	deps: [ "hello" ],
            exports: "hello"
        },
        'jquery.bootstrap': {
            deps: ['jquery']
        }
    },
    urlArgs: "bust=" + (new Date()).getTime()
});


