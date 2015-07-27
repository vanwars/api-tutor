var json;
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
    				'change select': 'changeTemplate',
    				'click .fullscreen': 'fullscreen'
		      	});
		   	},
  			base_template: null,
  			paramsEditor: null,
  			jsonViewer: null,
  			
  			initialize: function (opts) {
            	var that = this;
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
                this.globals.vent.on("template-updated", function (templatePath) {
                	var templateText = that.getTemplateTextFromCache(templatePath);
                	that.template = Handlebars.compile(templateText);
            		that.render();
				});
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
            
            changeTemplate: function (e) {
            	var that = this,
            		file_path = this.$el.find("select").val();
            	if (file_path == "json") {
            		this.template_path = null;
            		this.render();
            		return;
            	}
            	this.template_path = "templates/" + file_path;
            	this.loadTemplateFromFile(this.template_path, this.loadChildTemplate);
            },
            
            loadChildTemplate: function (templateText, templatePath) {
            	this.template = Handlebars.compile(templateText);
            	this.render();
            	this.globals.vent.trigger("template-loaded", {
            		templateText: templateText,
            		templatePath: templatePath
            	});
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
                        that.collection.fetch({reset: true });
                        that.$el.find("select option:eq(1)").attr('selected', 'selected');
                        that.$el.find("select").trigger("change");
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
				this.paramsEditor.setSize("100%", 80);
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
                	this.globals.vent.trigger("json-loaded");
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
					extraKeys: {"Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); }},
					viewportMargin: Infinity,
					gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
				});
				this.jsonViewer.setSize("auto", 500);
			},
			
			fullscreen: function() {
			    elem = this.$el.find('.display-results').get(0);
			    if(this.jsonViewer) {
			    	console.log($(window).width(), $(window).height());
			    	this.jsonViewer.setSize("auto", $(window).height() + 50);	
			    }
			    if (!document.fullscreenElement && !document.mozFullScreenElement &&
			        !document.webkitFullscreenElement && !document.msFullscreenElement) {
			        if (elem.requestFullscreen) {
			            elem.requestFullscreen();
			        } else if (elem.msRequestFullscreen) {
			            elem.msRequestFullscreen();
			        } else if (elem.mozRequestFullScreen) {
			            elem.mozRequestFullScreen();
			        } else if (elem.webkitRequestFullscreen) {
			            elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			        }
			    } else {
			    	if(this.jsonViewer) {
				    	this.jsonViewer.setSize("auto", 500);	
				    }
			        if (document.exitFullscreen) {
			            document.exitFullscreen();
			        } else if (document.msExitFullscreen) {
			            document.msExitFullscreen();
			        } else if (document.mozCancelFullScreen) {
			            document.mozCancelFullScreen();
			        } else if (document.webkitExitFullscreen) {
			            document.webkitExitFullscreen();
			        }
			    }
			}
        	
        });
        return APIView;
    });
