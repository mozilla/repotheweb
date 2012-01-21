var _ = function() {
	    var args = Array.prototype.slice.call(arguments),
        string = _.lang[args.shift()];

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
    data = function(key) {
        return JSON.parse(localStorage.getItem(key));
    },
    each = $.each;

$(function() {
    $('script[type="text/template"]').each(function() {
        var html = tmpl($(this).html(), window);
        $(this).replaceWith(html);
    });
});

// Temporary english translations, will be moved out once defined
_.lang = {
    'Protocol Handlers' : 'Protocol Handlers',
    'config Tooltip' : 'Configure all registered protocol handlers.',
    'service tooltip' : 'Open link with %s.',
    'select Handler' : 'Select "%s" Service',
    'service' : 'Configure all handlers',
    'no default' : 'Select handler each time',
    'confirm delete' : 'Are you sure you want to unregister this %s handler?\n\nYou will need to go to it\'s site to reregister it.',
    'confirm register' : 'Add %s (%s) as a handler for %s links?'
}
/* $.ajax((localStorage.getItem('lang') || navigator.language || navigator.userLanguage || "en").split('-')[0] + '/', {
	async : false,
	datatype : 'json',
	success : function(res) {_.lang = res;}
}); */
        
