define(["underscore", "jquery", "backbone", "model", "hello"],
    function (_, $, Backbone, Model, hello) {
        "use strict";
        /**
         * An "abstract" Backbone Collection; the root of all of the other
         * localground.collections.* classes. Has some helper methods that help
         * Backbone.Collection objects more easily interat with the Local Ground
         * Data API.
         * @class localground.collections.Base
         */
        var Base = Backbone.Collection.extend({
            key: null,
            next: null,
            previous: null,
            count: 0,
            page_size: 100,
            opts: null,
            enableFiltering: false,
            dataAttribute: "results",
            rawData: null,
            nextURL: "next",
            filterFields: [],
            model: Model,
            query_params: {},
            keys: [
            	"instagram"
            ],
            defaults: {
                isVisible: true
            },
            initialize: function (opts) {
            	//this.authenticate();
            	this.opts = opts;
                _.extend(this, opts);
            },
            url: function () {
                return this.api_url;
            },

            sync: function (method, collection, options) {
            	if (method == 'read') {
					var d = $.Deferred();
					hello(this.provider).api(
							this.url(),
							'GET',
							this.query_params
						).then(
						function (response) {
							d.resolve(response);
							options.success(response);
						}, 
						function(response) {
							d.fail(response);
						}
					);
			        return d;
				}
		    },
            parse: function (response, options) {
            	json = response;
            	this.rawData = response;
                this.count = response.count;
                this.next = response[this.nextURL];
                this.previous = response.previous;
                if (this.dataAttribute) {
              		return response[this.dataAttribute];
                } else {
                	return response;
                }
                
            },
            filter: function (filterVal) {
                var that = this;
                if (!this.enableFiltering) { return; }
                this.each(function (model) {
                    model.checkMatch(filterVal, that.filterFields);
                });
            },
            getVisibleCollection: function () {
                var collection = new Base();
                this.each(function (item) {
                    if (!item.get("hide")) { collection.add(item); }
                });
                return collection;
            }, 
            getRawData: function() {
            	return this.rawData;	
            }

        });

        return Base;
    });
