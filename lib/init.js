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
        	
            pages: {},
            routes: {},
            globals: {
        		appRouter: null,
        		token: null
        	},

            buildRoutes: function (pages) {
                var that = this;
                /* Dynamically builds Backbone Routes from the config file */
                _.each(pages, function (page) {
                    that.pages[page.url] = page;
                    if (page.type == "detail") {
                        page.modelID = page.id;
                    }
                    that.routes[page.url] = function (param1, param2, param3) {
                    	that.loadViewsFromRoute(page.url, param1, param2, param3);
                    }
                });
            },

            loadViewsFromRoute: function (url, param1, param2, param3) {
            	var that = this;
            	_.each(this.pages, function (page) {
            		if (page.url && page.url == url) {
            			console.log("Route match:", url, page)
                		that.loadView(page, param1, param2, param3);
            		}
            	});
            },

			loadViewsWithoutRoutes: function () {
				var that = this;
				_.each(this.pages, function (page) {
            		if (!page.url) {
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
                var hops = page.url.split(/[\/,=]+/),
                    params = [param1, param2, param3],
                    param;
                _.each(hops, function (hop) {
                    if (hop.indexOf(':') != -1) {
                        param = hop.replace(':', '');
                        page[param] = params.shift();
                        //console.log(param, page[param]);
                    }
                });
                //console.log(page);
            },

            loadView: function (page, param1, param2, param3) {
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
                this.buildRoutes(this.pages);
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
                    that.pages = data.pages;
                    that.init();
                });
        });
        return App;
    });

