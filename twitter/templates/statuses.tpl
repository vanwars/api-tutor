{{#each statuses }}
	<div class="tweet">
		<img src="{{ user.profile_image_url }}" class="profile" />
		<strong>{{ user.screen_name }}</strong>:
		{{ text }}
		
		{{#each entities.media }}
			<img src="{{media_url}}" class="thumbnail" />
		{{/each }}
	</div>
{{/each }}