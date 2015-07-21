define([], function () {
    "use strict";
    var ViewMixin = {
        extras: {},
        render: function () {
        	var data = {};
            _.extend(data, this.opts);
            _.extend(data, this.extras);
            var that = this;
            if (!this.template) {
                $.ajax({
                    url: 'templates/' + this.template_path  + '?rand' + Math.random(),
                    dataType: "text",
                    success: function (template) {
                        that.template = Handlebars.compile(template);
                        that.$el.html(that.template(data));
                    }
                });
            } else {
                this.$el.html(this.template(data));
            }
            return this.$el;
        },
        validate: function () {
            if (this.template === 'undefined') {
                throw new Error("template_source must be defined upon initialization");
            }
        },
        setCredentials: function () {
        	var access_token = localStorage.getItem('access_token');
        	if(access_token) {
        		this.globals.token = access_token;
        	}
        }
    };
    return ViewMixin;
});