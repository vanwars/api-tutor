define(["underscore", 
		"views/base",
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
		"external/codemirror/addon/fold/brace-fold",
		"external/codemirror/addon/hint/show-hint",
		"external/codemirror/addon/hint/css-hint"
		],
    function (_, Base, CodeMirror) {
        "use strict";
        var TemplateEditor = Base.extend({
        	editableTemplateText: null,
        	editableTemplatePath: null,
        	editableCssText: null,
        	editableCssPath: "styles.css",
        	activeEditor: "template",
        	templateEditor: null,
        	mode: "json",
        	template_path: '/lib/internal_templates/code-editor.tpl',
        	
        	events: {
        		'click li': 'switchTemplate',
        		'click .update-template': 'notifyUpdate'
        	},
        	
            initialize: function (opts) {
            	_.extend(this, opts);
            	this.extras = this.extras || {};
            	this.extras.activeEditor = this.activeEditor;
            	var that = this;
                this.globals.vent.on("template-loaded", function (opts) {
                	that.editableTemplateText = opts.templateText;
                	that.editableTemplatePath = opts.templatePath;
                	that.mode = "normal";
				  	that.render();
				});
				this.globals.vent.on("json-loaded", function (opts) {
					that.mode = "json";
				  	that.render();
				});
				this.initHandlebarsHighlighter();
				
				//get parent template:
				this.loadTemplateFromFile(this.template_path, function (templateText, templatePath) {
					that.renderTemplateCallback(templateText, templatePath);
					
					//get editable CSS template:
					that.loadTemplateFromFile(that.editableCssPath, function (cssText) {
						that.editableCssText = cssText;
						$('#custom-styles').html(cssText);
						that.render();
					});
				});
				
				
            },
            initHandlebarsHighlighter: function () {
            	CodeMirror.defineMode("htmlhandlebars", function(config) {
			    	return CodeMirror.multiplexingMode(
			          	CodeMirror.getMode(config, "text/html"),
			          	{
			          		open: "{{", 
			          		close: "}}",
			           		mode: CodeMirror.getMode(config, "handlebars"),
			           		parseDelimiters: true
			          	});
			     });
            },
            
            render: function () {
            	//render main template:
            	this.loadTemplateFromFile(this.template_path);
            	
            	//render editable template:
            	var textareaText = this.editableTemplateText, 
            		mode = "htmlhandlebars";
            	if(this.activeEditor == "css") {
            		textareaText = this.editableCssText;
            		mode = "text/css"
            	} else if(this.mode == "json") {
            		textareaText = "";
            	}
            	var $container = this.$el.find(".tab-content"),
            		$textarea = $("<textarea></textarea").html(textareaText);
            	$container.append($textarea);
            	this.templateEditor = CodeMirror.fromTextArea($textarea.get(0), {
					mode: mode,
					lineNumbers: true,
					theme: "api-tester",
					styleActiveLine: true,
					autohint: true,
					hint: true,
					extraKeys: {"Ctrl-Space": "autocomplete"},
					matchBrackets: true
				});
				this.templateEditor.setSize("100%", $(window).height() - 164);
            },
            
            switchTemplate: function (e) {
            	e.preventDefault();
            	this.activeEditor = this.extras.activeEditor = $(e.currentTarget).attr("mode");
            	this.render();
            },
            
            notifyUpdate: function (e) {
            	e.preventDefault();
            	var code = this.templateEditor.getValue();
            	if(this.activeEditor == "css") {
            		this.editableCssText = code;
            		this.updateTemplateCache(this.editableCssPath, code);
            		$('#custom-styles').html(code);
            	} else {
            		this.editableTemplateText = code;
					this.updateTemplateCache(this.editableTemplatePath, code);
            		this.globals.vent.trigger("template-updated", this.editableTemplatePath);
            	}
            }
        });
        return TemplateEditor;
    });