define(["jquery",
        "underscore",
        "handlebars",
        "views/record-list",
        "external/codemirror/lib/codemirror",
		"external/codemirror/addon/selection/active-line",
		"external/codemirror/addon/fold/foldcode",
		"external/codemirror/addon/fold/foldgutter",
		"external/codemirror/addon/fold/brace-fold"
    ],
    function ($, _, Handlebars, RecordList, CodeMirror) {

        var APIView = RecordList.extend({
        	events: function(){
		      	return _.extend({}, RecordList.prototype.events,{
		          	'click .search': 'search',
    				'change select': 'routeToUserTemplate'
		      	});
		   	},
  			base_template: null,
  			paramsEditor: null,
  			jsonViewer: null,
  			
  			initialize: function (opts) {
            	this.checkCredentials();
            	if (!opts.query_params) {
            		opts.query_params = {}; 
        		}
        		opts.query_params['access_token'] = opts.globals.token;
                this.opts = opts;
            	this.preRender();
                this.dataAttribute = opts.data_attribute || "results";
                this.updateUrlWithRouterData();
                this.updateParamsWithRouterData();
                this.loadBaseTemplate();
                this.initCollection();
                this.listenTo(this.collection, 'reset', this.renderWithHelpers);
            },
            
            checkCredentials: function () {
            	this.setCredentials();
  				if(!this.globals.token) {
  					this.globals.appRouter.navigate('#/login');
  					return;
  				}
            },
  			
  			search: function (e) {
  				e.preventDefault();
  				this.collection.query_params = JSON.parse(
  					this.paramsEditor.getValue()
  				);
  				this.api_url = this.$el.find("input:text").val();
  				this.collection.api_url = this.api_url;
  				this.collection.fetch({ reset: true });
  			},
            
            routeToUserTemplate: function (e) {
            	var that = this;
            	this.template_path = this.$el.find("select").val();
            	if (this.template_path == "json") {
            		this.render();
            		return;
            	}
            	this.loadTemplateFromFile("templates/" + this.template_path, this.loadChildTemplate);
            },
            
            loadChildTemplate: function (templateText) {
            	this.template = Handlebars.compile(templateText);
            	this.render();
            	this.globals.vent.trigger("template-loaded", templateText);
            },

            newPage: function (e) {
                var that = this;
                this.collection.query_params = JSON.parse(
  					this.paramsEditor.getValue()
  				);
                this.collection.api_url = $(e.target).attr('page-num');
                this.collection.fetch({ reset: true });
                e.preventDefault();
            },
  			
  			loadBaseTemplate: function (opts) {
  				// loads the harness template
  				var path = 'lib/internal_templates/api-form.tpl'  + '?rand' + Math.random(),
                    that = this;
                $.ajax({
                    url: path,
                    dataType: "text",
                    success: function (base_template) {
                		that.base_template = Handlebars.compile(base_template);
                		that.renderHarness();
                		if(!that.template_path) {
                        	that.collection.fetch({reset: true, data: { access_token: that.globals.token } });
                        } else {
                        	that.loadTemplateFromFile("templates/" + that.template_path);
                        }
                    }
                });
            },

  			renderHarness: function () {
  				//renders API harness:
  				var data = {}, json, paramMirror;
  				_.extend(data, this.templateHelpers);
                _.extend(data, this.opts);
                _.extend(data, { tabs: _.where(this.globals.pages, {type: "api"}) })
                data.api_params = JSON.stringify(this.collection.query_params, null, '  ');
                this.$el.html(this.base_template(data));
                this.paramsEditor = CodeMirror.fromTextArea(this.$el.find('#query_params').get(0), {
				mode: "application/ld+json",
					theme: "neat",
					lineWrapping: true
				});
				this.paramsEditor.setSize("100%", 100);
                this.postRender();
  			},
  			
  			render: function () {
  				//render's user-defined template:
  				var data = {}, json;
  				_.extend(data, this.templateHelpers);
                _.extend(data, this.opts);
                if (this.template_path && this.template_path != "json") {
                	data[this.dataAttribute] = this.collection.toJSON();
                	this.$el.find('.display-results').html(this.template(data));
                } else {
                	data = this.collection.getRawData();
                	this.displayFormattedJSON(data);
                }
                this.postRender();
  			},
  			
  			displayFormattedJSON: function (data) {
				var $textarea = $('<textarea></textarea>'),
					$el = this.$el.find('.display-results'),
					json_viewer;
				$textarea.val(JSON.stringify(data, null, 3));
				$el.empty();
			 	$el.append($textarea);
				this.jsonViewer = CodeMirror.fromTextArea($textarea.get(0), {
					mode: "application/ld+json",
					styleActiveLine: true,
					lineNumbers: true,
					theme: "neat",
					lineWrapping: true,
					readOnly: true,
					foldGutter: true,
					viewportMargin: Infinity,
					gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
				});
				//this.jsonViewer.setSize("100%", 500);
			}
        	
        });
        return APIView;
    });
