<form role="tabpanel" class="form-horizontal tab-pane fade in active" id="{{ slugify name }}">
  	<i class="fullscreen fa fa-expand pull-right"></i>
  	<select name="status">
  		<option value="json">JSON</option>
  		{{#templates}}
  		<option value="{{path}}">{{name}}</option>
  		{{/templates}}
  	</select>
  	<div class="form-group">
  		<div class="row">
	    	<label for="tag-search" class="col-sm-2 control-label">{{ name }} URL</label>
	    	<div class="col-sm-7">
	    		<input type="text" class="form-control" value="{{ api_url }}">
	  		</div>
	  		<div class="col-sm-2">
	  			<button class="btn btn-primary search">Search</button>
	  		</div>
	  	</div>
	  	<div class="row">
	  		<div class="col-sm-2">
		  		<label for="tag-query_params" class="control-label">Query Parameters</label>
		  		<br>
		  		<a href="{{ reference_url }}" target="_blank">more info...</a>
		  	</div>
	  		<div class="col-sm-7">
	    		<textarea id="query_params">{{api_params}}</textarea>
	    		
	  		</div>
	  	</div>
  	</div>
  	<div class="row">
  		<div class="col-sm-12 display-results"></div>
  	</div>
</form>