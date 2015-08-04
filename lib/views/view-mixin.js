define([], function () {
    "use strict";
    var ViewMixin = {
        templateText: null,
		opts: null,
		
        loadTemplateFromFile: function (templatePath, callback) {
        	var that = this,
        		templateText = this.getTemplateTextFromCache(templatePath);
        	callback = callback || this.renderTemplateCallback;
        	
        	if (!templateText) {
                $.ajax({
	                url: templatePath  + '?rand' + Math.random(),
	                dataType: "text",
	                success: function (templateText) {
	                	that.updateTemplateCache(templatePath, templateText)
	                	callback.call(that, templateText, templatePath);
	                }
	            });
            } else {
            	//console.log("loading cached template:", templatePath);
                callback.call(that, templateText, templatePath);
            }
        },
        
        renderTemplateCallback: function (templateText, templatePath) {
        	var data = {}, template = null;
        	template = Handlebars.compile(templateText);
        	_.extend(data, this.opts);
            _.extend(data, this.extras);
            this.$el.html(template(data));
        },
        
        render: function () {
        	var path = "templates/" + this.template_path,
        		templateText = this.getTemplateTextFromCache(path);
        	this.preRender();
        	if (!templateText) {
                this.loadTemplateFromFile(path);
            } else {
                this.renderTemplateCallback(templateText);
            }
        	this.postRender();
            return this.$el;
        },
        
        setCredentials: function () {
        	var access_token = localStorage.getItem('access_token');
        	if(access_token) {
        		this.globals.token = access_token;
        	}
        },
        
        updateTemplateCache: function (templatePath, templateText) {
        	this.globals.templateCache[templatePath] = templateText;
        },
        
        getTemplateTextFromCache: function (templatePath) {
        	return this.globals.templateCache[templatePath];
        },
        
        preRender: function () {
			if (this.pre_render) {
            	eval(this.pre_render + "()");
            }
		},

		postRender: function () {
			if (this.post_render) {
            	eval(this.post_render + "()");
            }
		}
    };
    return ViewMixin;
});