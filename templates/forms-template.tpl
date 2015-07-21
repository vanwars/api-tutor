{{ active_route }}
<ul class="nav nav-tabs" role="tablist">
{{#tabs}}
	{{#if slugify name == active_route }}
	<li>HORRAY</li>
	{{#if}}
  	<li><a href="#/{{ slugify name }}">{{ name }} {{ ../active_route }}</a></li>
{{/tabs}}
</ul>