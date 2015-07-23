<!-- Pagination -->
{{ paginator }}

{{#data}}
   {{#if location }}
	<img class="thumbnail" 
		src="https://maps.googleapis.com/maps/api/staticmap?center={{ location.latitude }},{{ location.longitude }}&zoom=5&size=120x120&markers=color:blue%7C{{ location.latitude }},{{ location.longitude }}" />
   {{/if}}
{{/data}}