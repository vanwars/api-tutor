define(["jquery",
        "underscore",
        "handlebars",
        "views/record-list",
        "external/codemirror/lib/codemirror",
        "external/codemirror/addon/mode/simple",
        "external/codemirror/addon/mode/multiplex",
        "external/codemirror/mode/javascript/javascript",
        "external/codemirror/mode/css/css",
		"external/codemirror/mode/xml/xml",
		"external/codemirror/mode/handlebars/handlebars",
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
    				'change select': 'routeToTemplate'
		      	});
		   	},
  			base_template: null,
  			
  			initialize: function (opts) {
  				this.setCredentials();
  				if(!this.globals.token) {
  					this.globals.appRouter.navigate('#/login');
  					return;
  				}
            	if (!opts.query_params) {
            		opts.query_params = {}; 
        		}
        		opts.query_params['access_token'] = opts.globals.token;
            	RecordList.prototype.initialize.apply(this, arguments);      
            },
  			
  			search: function (e) {
  				e.preventDefault();
  				this.api_url = this.$el.find("input:text").val();
  				this.collection.api_url = this.api_url;
  				this.collection.fetch({ reset: true });
  			},
  			
  			loadTemplateFromFile: function (opts) {
  				var path = 'lib/internal_templates/api-form.tpl'  + '?rand' + Math.random(),
                    that = this;
                $.ajax({
                    url: path,
                    dataType: "text",
                    success: function (base_template) {
                		that.base_template = Handlebars.compile(base_template);
                		if(!that.template_path) {
                        	that.collection.fetch({reset: true, data: { access_token: that.globals.token } });
                        } else {
                        	console.log(that.template_path);
                        	RecordList.prototype.loadTemplateFromFile.apply(that, arguments); 	
                        }
                    }
                });
            },
            
            routeToTemplate: function (e) {
            	var newTemplate = this.$el.find("select").val(), 
            		newRoute = '#/media-by-tag/';
            	if (this.$el.find("select").val() != '-1') {
            		newRoute += newTemplate;
            	}
            	this.globals.appRouter.navigate(newRoute);
            },
  			
  			render: function (e) {
  				var data = {}, json;
  				_.extend(data, this.templateHelpers);
                _.extend(data, this.opts);
                this.$el.html(this.base_template(data));
	                
                //now, show raw JSON or formatted template:
                if (this.template_path) {
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
					$el = this.$el.find('.display-results');
				$textarea.val(JSON.stringify(data, null, 3));
				$el.empty();
			 	$el.append($textarea);
				json_viewer = CodeMirror.fromTextArea($textarea.get(0), {
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
			}
        	
        });
        return APIView;
    });
