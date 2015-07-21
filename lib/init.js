define(["underscore",
        "jquery",
        "backbone",
        "marionette",
        "views/base",
        "views/record-list",
        "views/record-detail",
        "views/api",
        "views/authentication"
    ],
    function (_, $, Backbone, Marionette, BaseView, RecordListView, 
				RecordDetailView, APIView, AuthenticationView) {
        "use strict";
        var App = new Marionette.Application();
        _.extend(App, {
        	
            routes: {},
            pages: {}, 
            globals: {
        		appRouter: null,
        		token: null,
        		pages: {}
        	},

            buildRoutes: function (pages) {
                /* Dynamically builds Backbone Routes from the config file */
                var that = this;
                _.each(pages, function (page) {
                	if (page.url) {
	                    that.routes[page.url] = function (param1, param2, param3) {
	                    	that.loadViewsFromRoute(page.url, param1, param2, param3);
	                    }
                	} else if (page.urls) {
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
            		if (page.url && page.url == url) {
            			//console.log("Route match (url):", url, page);
                		that.loadView(url, page, param1, param2, param3);
            		} else if (page.urls) { //if page matches more than one route
            			//console.log("page.urls:", page.urls);
            			_.each(page.urls, function(page_url){
            				//console.log("page.urls:", page_url, url);
            				if(page_url == url) {
            					//console.log("Route match (urls):", page_url, page);
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
						//console.log("load view w/o routes", page);
                		var View = that.getView(page),
						view = new View(page);
						$(page.target).html(view.el);
            		}
            	});	
			},

            getView: function (page) {
                switch (page.type) {
                case "api":
                	return APIView.extend(page);
                case "authenticate":
                	return AuthenticationView.extend(page);
                case "detail":
                    return RecordDetailView.extend(page);
                case "list":
                    return RecordListView.extend(page);
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
                //console.log(page);
            },

            loadView: function (url, page, param1, param2, param3) {
            	page.active_route = url;
            	this.updatePageWithRouterParams(page, param1, param2, param3);
            	page.globals = this.globals;
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
                this.buildRoutes(this.globals.pages);
                this.loadViewsWithoutRoutes();
                var AppRouter = Backbone.Router.extend({
                    routes: this.routes
                });
                this.globals.appRouter = new AppRouter();
                Backbone.history.start();
            }
        });

        App.addInitializer(function () {
            var that = this;
            $.getJSON('config.json',
                function (data) {
                    that.pages = that.globals.pages = data.pages;
                    that.init();
                });
        });
        return App;
    });

