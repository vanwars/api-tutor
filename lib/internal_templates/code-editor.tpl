<ul class="nav nav-tabs" role="tablist">
  	<li {{#ifEqual activeEditor "template"}}class="active"{{/ifEqual}} mode="template">
  		<a href="#edit-template">Template</a>
  	</li>
  	<li {{#ifEqual activeEditor "css"}}class="active"{{/ifEqual}} mode="css">
  		<a href="#edit-style">CSS</a>
  	</li>
</ul>
<div role="tabpanel" class="tab-content form-horizontal tab-pane fade in active"></div>
<a href="#0" class="update-template">Update Template</a>