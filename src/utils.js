define('utils', ['onready', 'config'],
       function ($, config) {
           var doc = document,
             iframe = doc.createElement("iframe");
           // iframe.style.display = "none";
           doc.body.appendChild(iframe);
           iframe.src = config.ipServer + "/rph_iframe.html";
           iframe.style.position = 'absolute';
           iframe.style.left = -7000;

           $(function() {document.body.appendChild(iframe);});

           return {
               iframe: iframe,
							 getFavicon : function() {
									// In any URL based element, href is the full path, which is accessed here
									var link = document.querySelector('link[rel~=icon]');
									if (link != undefined) return link.href;
					
									link = document.createElement('a');
									link.href = "/favicon.ico";
									return link.href;
								},
           };
       });


