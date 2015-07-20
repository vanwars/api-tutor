<!-- Authentication with third party -->
Token: {{ token }}
<form id="token-form" class="form-inline" action="{{ auth_url }}" method="GET">
  	<div class="form-group">
    	<label for="client_id">client_id</label>
    	<input type="text" class="form-control" id="client_id" name="client_id"
    		value="{{ client_id }}" placeholder="Client ID">
    	<input type="hidden" name="response_type" value="token">
    	<input type="hidden" id="redirect_uri" name="redirect_uri" value="{{redirect_url}}">
  	</div>
  	<button type="submit" class="btn btn-default">Get Access Token</button>
</form>