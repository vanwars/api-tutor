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
		"external/codemirror/addon/fold/brace-fold"
		],
    function (_, Base, CodeMirror) {
        "use strict";
        var TemplateEditor = Base.extend({
        	editableTemplateText: null,
        	editableTemplatePath: null,
        	editableCssText: null,
        	editableCssPath: "styles.css",
        	activeEditor: "css",
        	templateEditor: null,
        	template_path: 'lib/internal_templates/code-editor.tpl',
        	
        	events: {
        		'click li': 'switchTemplate',
        		'click .update-template': 'notifyUpdate'
        	},
        	
            initialize: function (opts) {
            	_.extend(this, opts);
            	this.extras = this.extras || {};
            	this.extras.activeEditor = "css";
            	var that = this;
                this.globals.vent.on("template-loaded", function (opts) {
                	that.editableTemplateText = opts.templateText;
                	that.editableTemplatePath = opts.templatePath;
				  	that.render();
				});
				this.initHandlebarsHighlighter();
				
				//get parent template:
				this.loadTemplateFromFile(this.template_path);
				
				//ge editable CSS template:
				this.loadTemplateFromFile(this.editableCssPath, function (cssText) {
					that.editableCssText = cssText;
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
            	}
            	var $container = this.$el.find(".tab-content"),
            		$textarea = $("<textarea></textarea").html(textareaText);
            	$container.append($textarea);
            	this.templateEditor = CodeMirror.fromTextArea($textarea.get(0), {
					mode: mode,
					lineNumbers: true,
					theme: "api-tester",
					styleActiveLine: true,
					matchBrackets: true
				});
				//this.templateEditor.setSize("100%", this.$el.height());
            },
            
            switchTemplate: function (e) {
            	e.preventDefault();
            	this.activeEditor = this.extras.activeEditor = $(e.currentTarget).attr("mode");
            	this.render();
            },
            
            notifyUpdate: function (e) {
            	e.preventDefault();
            	var templateText = this.templateEditor.getValue(),
            		templatePath = this.editableTemplatePath;
            	if(this.activeEditor == "css") {
            		templatePath = this.editableCssPath;
            	}
            	this.updateTemplateCache(templatePath, templateText);
            	this.globals.vent.trigger("template-updated");
            }
        });
        return TemplateEditor;
    });