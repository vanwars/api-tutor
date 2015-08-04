define(["underscore", "jquery", "backbone", "model", "hello", "hello-instagram"],
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
            dataType: "json",
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
            	/* add additional parameters & authentication credentials to the
            	   api_url
            	
                if (this.query_params) {
                	var delimiter = (this.api_url.indexOf("?") == -1) ? "?" : "&";
                	return this.api_url + delimiter + $.param(this.query_params);
                }*/
                
                /*
                hello(this.key)
					.api(
						'https://api.twitter.com/1.1/search/tweets.json',
						'GET',
						{ q: '#puppies', result_type: 'recent' }
					).then(this.showTweets.bind(this), this.handleError.bind(this));
			*/
                return this.api_url;
            },

            sync: function (method, collection, options) {
            	options.dataType = this.dataType;
            	if (method == 'read') {
					var d = $.Deferred();
					hello('instagram').api(
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
                return response[this.dataAttribute];
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
