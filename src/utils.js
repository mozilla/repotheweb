define('utils', ['config'],
       function (config) {
           var doc = document,
             iframe = doc.createElement("iframe");
           // iframe.style.display = "none";
           doc.body.appendChild(iframe);
           iframe.src = config.ipServer + "/rph_iframe.html";
           iframe.style.position = 'absolute';
           iframe.style.left = -7000;

           return {
               iframe: iframe,
           };
       });


