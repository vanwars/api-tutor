{{ paginator }}

{{#data}}
<div class="col-md-2 article-img">
    <a href="#">
    	<div class="likes">{{ likes.count }}</div>
        <img src="{{images.thumbnail.url}}" />
    </a>
   <div class="article-overlay"></div>
</div>
{{/data}}
