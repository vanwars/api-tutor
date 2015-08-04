define(["underscore",
        "jquery",
        "backbone",
        "marionette",
        "views/base",
        "views/record-list",
        "views/record-detail",
        "views/api",
        "views/template-editor",
        "views/login"
    ],
    function (_, $, Backbone, Marionette, BaseView, RecordListView, 
				RecordDetailView, APIView, TemplateEditor, LoginView) {
        "use strict";
        var App = new Marionette.Application();
        _.extend(App, {
        	
            routes: {},
            pages: {}, 
            globals: {
        		appRouter: null,
        		token: null,
        		vent: null,
        		pages: {},
        		templateCache: {}
        	},
        	
        	initTemplates: function () {
        		// allows for template shortcuts in the config.json file. Template
        		// keys are replaces by their template definitions (by reference).
        		var that = this;
        		_.each(this.pages, function (page) {
        			_.each(page.templates, function(key, index) {
        				page.templates[index] = that.templates[key];
        			});
        		});
        	},
            buildRoutes: function () {
                /* Dynamically builds Backbone Routes from the config file */
                var that = this;
                _.each(this.pages, function (page) {
                	if (page.url && !page.urls) {
                		page.urls = [page.url]; 
                	}
                	if (page.urls) {
                		_.each(page.urls, function (url) {
	                		that.routes[url] = function (param1, param2, param3) {
		                    	that.loadViewsFromRoute(url, param1, param2, param3);
		                    }	
                		})
                	}
                });
            },

            loadViewsFromRoute: function (url, param1, param2, param3) {
            	/* when the route is called, load the view or views that
            	   match the route
            	*/
            	var that = this;
            	_.each(this.globals.pages, function (page) {
            		if (page.urls) {
            			_.each(page.urls, function(page_url){
            				if(page_url == url) {
            					that.loadView(page_url, page, param1, param2, param3);
            				}
            			});
            		}
            	});
            },

			loadViewsWithoutRoutes: function () {
				var that = this;
				_.each(this.pages, function (page) {
            		if (!page.url && !page.urls) {
                		var View = that.getView(page),
						view = new View(page);
						$(page.target).html(view.el);
            		}
            	});	
			},

            getView: function (page) {
            	page.globals = this.globals;
                switch (page.type) {
	                case "instagram":
	                case "soundcloud":
	                case "twitter":
	                	return APIView.extend(page);
	                case "detail":
	                    return RecordDetailView.extend(page);
	                case "list":
	                    return RecordListView.extend(page);
	                case "template-editor":
	                	return TemplateEditor.extend(page);
	            	case "login":
	                	return LoginView.extend(page);
	                default:
	                    return BaseView.extend(page);
                }
            },

            updatePageWithRouterParams: function (page, param1, param2, param3) {
                //note that routers can have multiple dynamic parameters
                var hops = page.active_route.split(/[\/,=]+/),
                    params = [param1, param2, param3],
                    param;
                _.each(hops, function (hop) {
                    if (hop.indexOf(':') != -1) {
                        param = hop.replace(':', '');
                        page[param] = params.shift();
                    }
                });
            },

            loadView: function (url, page, param1, param2, param3) {
            	page.active_route = url;
            	this.updatePageWithRouterParams(page, param1, param2, param3);
                var View = this.getView(page),
                    view = new View(page);
                $(page.target).html(view.el);
                view.delegateEvents();
                
                //remove and re-add event listeners:
                this.addListeners();
            },

            addListeners: function () {
                return;
            },

            init: function () {
            	this.initTemplates();
                this.buildRoutes();
                this.loadViewsWithoutRoutes();
                var AppRouter = Backbone.Router.extend({
	                    routes: this.routes
	                }),
	                that = this;
                this.globals.appRouter = new AppRouter();
                
				hello.on('auth.login', function (auth) {
					switch(auth.network) {
						case 'instagram':
							that.globals.appRouter.navigate('#/' + that.homeRoute);
							break;
					}
				});
				
                Backbone.history.start();
            },
        });
		
        App.addInitializer(function () {
            var that = this;
            $.getJSON('config.json?n=' + Math.random(), function (data) {
                that.pages = that.globals.pages = data.pages;
                that.templates = that.globals.templates = data.templates;
                that.globals.vent = that.vent;
                that.homeRoute = data.homeURL;
                that.init();
            });
        });
        return App;
    });

