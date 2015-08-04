<!-- Pagination -->
{{ paginator }}

<p>
  Learn more about the Google Static Map API
  <a href="https://developers.google.com/maps/documentation/staticmaps/intro" target="_blank">here</a>.
</p>
{{#data}}
   {{#if location }}
	<img class="thumbnail" 
		src="https://maps.googleapis.com/maps/api/staticmap?center={{ location.latitude }},{{ location.longitude }}&zoom=5&size=120x120&markers=color:blue%7C{{ location.latitude }},{{ location.longitude }}" />
   {{/if}}
{{/data}}