<!-- Authentication with third party -->
<!-- form id="token-form" action="{{ auth_url }}" method="GET">
  	<div class="form-group">

    	<div class="col-sm-1">
    		<label for="client_id" class="control-label">client_id:</label>
    	</div>
    	<div class="col-sm-5">
    		<input type="text" class="form-control" id="client_id" name="client_id"
    		value="{{ client_id }}" placeholder="Client ID">
  		</div>
  		<div class="col-sm-1">
  			<button type="submit" class="btn btn-default">Get Access Token</button>
  		</div>

  	</div>
  	<input type="hidden" name="response_type" value="token">
	<input type="hidden" id="redirect_uri" name="redirect_uri" value="{{redirect_url}}">
</form -->

<button service="instagram" title="Sign in to Instagram" class="btn zocial icon instagram">Instagram</button>
