var _ = function() {
	    var args = Array.prototype.slice.call(arguments),
        string = _.lang[args.shift()] || "";

        for (var i=0;i<args.length;i++) 
            string = string.replace('%s', args[i]);
        return string;
    },
    // From John Resig, at http://ejohn.org/blog/javascript-micro-templating/
    // Slightly modified for purpouses of this project
    // No caching (due to usage) and uses {{ & }} (due to Django taste)
    tmpl = function tmpl(str, data){
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
            tmpl(document.getElementById(str).innerHTML) :
     
          // Generate a reusable function that will serve as a template
          // generator (and which will be cached).
          new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +
           
            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +
           
            // Convert the template into pure JavaScript
            str
              .replace(/[\r\t\n]/g, " ")
              .split("{{").join("\t")
              .replace(/((^|}})[^\t]*)'/g, "$1\r")
              .replace(/\t=(.*?)}}/g, "',$1,'")
              .split("\t").join("');")
              .split("}}").join("p.push('")
              .split("\r").join("\\'")
          + "');}return p.join('');");
       
        // Provide some basic currying to the user
        return data ? fn( data ) : fn;
      },
    data = function(key, value) {
				if (value != undefined) localStorage.setItem(key, JSON.stringify(value));
        else return JSON.parse(localStorage.getItem(key));
    },
    each = $.each;

$(function() {
		// Download language file, executes synchronously before templates are rendered.
		function setLang(userLang) {
				$.ajax('/lang/' + userLang + '.i18n', {
					async : false,
					datatype : 'json',
					success : function(res) {_.lang = JSON.parse(res);},
					error : function() {setLang("en");}
				});
		}
		setLang((navigator.language || navigator.userLanguage || "en").toLowerCase().split('-')[0]);

		// execute templates
    $('script[type="text/template"]').each(function() {
        var html = tmpl($(this).html(), window);
        $(this).replaceWith(html);
    });

		// Fix broken images after they're created but before they load
		$('img').error(function() {
			$(this).attr('src', '/nofavicon.ico');
		});
});

