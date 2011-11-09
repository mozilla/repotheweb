define('utils', ['config'], function (config) {
    return {
        _open_hidden_iframe: function (doc) {
            var iframe = doc.createElement("iframe");
            // iframe.style.display = "none";
            doc.body.appendChild(iframe);
            iframe.src = config.ipServer + "/rph_iframe.html";
            return iframe;
        }
    };
});