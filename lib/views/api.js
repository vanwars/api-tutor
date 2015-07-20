define(["jquery",
        "underscore",
        "views/record-list"
    ],
    function ($, _, RecordList, Collection, Handlebars) {

        var APIView = RecordList.extend({
        	
        	events: {
    			'click .btn': 'search'
  			}, 
  			
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
  				this.collection.api_url = this.$el.find("input:text").val();
  				this.collection.fetch({ reset: true });
  			},
  			
  			render: function (e) {
  				var data = {},
                    json = this.collection.getVisibleCollection().toJSON();
                _.extend(data, this.templateHelpers);
                _.extend(data, this.opts);
                this.$el.html(this.template(data));
                
                data = {};
                data[this.dataAttribute] = this.collection.toJSON();
  				this.$el.find('.display-results').html(
  					JSON.stringify(data)
  				);
  				this.postRender();
  			}
        	
        });
        return APIView;
    });
