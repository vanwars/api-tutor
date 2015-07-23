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
		"external/codemirror/addon/fold/brace-fold"],
    function (_, Base, CodeMirror) {
        "use strict";
        var TemplateEditor = Base.extend({
        	
        	templateText: null,
        	templateEditor: null,
        	
            initialize: function (opts) {
            	_.extend(this, opts);
            	var that = this;
                this.globals.vent.on("template-loaded", function(opts) {
                	console.log("template loaded:", opts);
                	that.templateText = opts.template_text;
				  	that.render();
				});
            },
            render: function () {
            	var $textarea = $('<textarea></textarea>').html(this.templateText);
            	this.$el.empty();
            	this.$el.append($textarea);
            	this.templateEditor = CodeMirror.fromTextArea($textarea.get(0), {
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
        return TemplateEditor;
    });