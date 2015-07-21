define(["jquery",
        "underscore",
        "handlebars",
        "views/record-list"
    ],
    function ($, _, Handlebars, RecordList) {

        var APIView = RecordList.extend({
        	events: function(){
		      	return _.extend({}, RecordList.prototype.events,{
		          	'click .btn': 'search',
    				'change select': 'routeToTemplate'
		      	});
		   	},
  			base_template: null,
  			
  			initialize: function (opts) {
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
                	this.$el.find('.display-results').html(JSON.stringify(data));	
                }
  				this.postRender();
  			}
        	
        });
        return APIView;
    });
