define(["jquery",
        "underscore",
        "marionette",
        "collection",
        "views/view-mixin",
        "handlebars",
        "handlebars-helpers"
    ],
    function ($, _, Marionette, Collection, ViewMixin, Handlebars) {
        'use strict';
        /**
         * Controls a dictionary of overlayGroups
         * @class OverlayManager
         */
        //Todo: can this be a Marionette CollectionManager, since it's managing Layer models?
        var RecordList = Marionette.View.extend({

            events: {
                'click .page': 'getNewPage',
                'keyup #filter' : 'filterCollection'
            },
            filterVal: null,
            dataAttribute: "results",

            initialize: function (opts) {
            	_.extend(this, opts);
            	this.opts = opts;
            	this.preRender();
                this.dataAttribute = opts.data_attribute || "results";
                this.updateUrlWithRouterData();
                this.updateParamsWithRouterData();
                this.initCollection();
                this.listenTo(this.collection, 'reset', this.renderWithHelpers);
                this.loadTemplateFromFile("templates/" + this.template_path);
            },
            
            initCollection: function () {
            	this.collection = new Collection({
                    api_url: this.opts.api_url,
                    query_params: this.opts.query_params,
                    page_size: this.opts.page_size || 10,
                    comparator: this.opts.ordering_field || "id",
                    enableFiltering: this.opts.enable_filtering || false,
                    filterFields: this.opts.filter_fields || [],
                    dataAttribute: this.dataAttribute,
                    nextURL: this.opts.next_url || "next",
                    provider: this.provider
                });
            },

            filterCollection: _.throttle(function (e) {
                this.filterVal = $(e.currentTarget).val();
                this.collection.filter(this.filterVal);
                this.collection.trigger('reset');
            }, 500),

            updateUrlWithRouterData: function () {
                var template = Handlebars.compile(this.opts.api_url);
                this.opts.api_url = template(this.opts);
            },

            updateParamsWithRouterData: function () {
                var that = this;
                var query_params = {};
                _.each(this.opts.query_params, function (param, key) {
                    if (typeof param == 'string') {
                        var template = Handlebars.compile(param);
                        template = template(that.opts);
                        query_params[key] = template;
                    } else {
                        query_params[key] = param;
                    }
                });
                this.opts.query_params = query_params;
            },

            renderWithHelpers: function () {
            	this.templateHelpers = {
                    next: this.collection.next,
                    previous: this.collection.previous,
                    count: this.collection.count,
                    filterVal: this.filterVal
                };
                _.extend(this.templateHelpers);
                this.render();
            },

            getNewPage: function (e) {
                var that = this;
                this.collection.api_url = $(e.target).attr('page-num');
                this.collection.fetch({ reset: true });
                e.preventDefault();
            },

            focusCursorIfSearchbox: function () {
                //place the cursor at the end of the input filter:
                var $input = this.$el.find('#filter'),
                    len;
                if (!$input.val()) { return; }
                len = $input.val().length;
                $input.focus();
                $input.get(0).setSelectionRange(len, len);
            },

            render: function () {
                var data = {},
                    json = this.collection.getVisibleCollection().toJSON();
                
                _.extend(data, this.templateHelpers);
                _.extend(data, this.opts);
                data[this.dataAttribute] = json;
   
                this.$el.html(this.template(data));
                this.postRender();
            }
        });
		
        _.extend(RecordList.prototype, ViewMixin);
        return RecordList;
    });