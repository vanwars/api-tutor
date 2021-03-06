The API Tutor
==========
This project is just beginning, but its goal is to help novices to understand: (1) how publicly available APIs work, and (2) how they can be leveraged in apps and websites. A current working version of this code is hosted at [http://apitutor.org](http://apitutor.org/). As it currently stands, the tutor has some sample functionality for select endpoints (corresponding to the Instagram, Twitter, and Soundcloud APIs). Ideally, each new API Tutor page can be authored with a simple configuration file, such as (this one)[https://github.com/vanwars/api-tutor/blob/master/soundcloud/config.json]. We are trying to make these config files as easy as possible to configure.

Brainstorm of features that would be nice to incorporate:
* Simpler templating framework. Is handlebars the best approach? What else is out there for simple HTML / data binding?
* A "Generate UI" tool that allows data templates to be combined, linked, stylized, and downloaded to a responsive web app
* A single JavaScript file that abstracts away some of the complexities of interacting with the various APIs
* Better instructions for supporting high school learners in understanding:
  * HTTP requests (GET / POST / PUT / PATCH / DELETE)
  * How authenticaton (OAuth) works
  * Perhaps a step-by-step, getting started guide
* Push notifications / streams?

Dependencies
---------
The API Tutor uses several common JavaScriptlibraries:

* [Backbone.js](http://backbonejs.org/)
* [Hello.js](http://adodson.com/hello.js/)
* [Underscore.js](http://underscorejs.org/)
* [Handlebars.js](http://handlebarsjs.com/)
* [CodeMirror](https://codemirror.net/)

