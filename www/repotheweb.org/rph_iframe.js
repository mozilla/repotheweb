(function() {
    var chan = Channel.build({
        window: window.parent,
        origin: "*",
        scope: "mozid"
    }),
     /**
      * rph - protocolHandler object
      * {scheme: 'music',
      *  url: 'http://example.com/%s',
      *  default: false
      * }
      */
    store_rph = function (rph) {
        var key,
            raw_phs,
            phs,
            raw_ph_list,
            ph_list,
            hasPRH;
        key = 'protocolhandlers-' + rph.scheme;
        raw_phs = localStorage.getItem(key);
        /* raw_phs format:
         * [
         *   { scheme: 'music',
         *     url: 'http://example.com/%s',
         *     default: false
         *   }, ...
         * ]
         */
        hasRPH = function (rph_list, rph) {
            for (var i=0; i < rph_list.length; i++) {
                if (rph_list[i].url == rph.url) {
                    return true;
                }
            }
            return false;
        };
        if (! raw_phs) {
            phs = [];
        } else {
            phs = JSON.parse(raw_phs);
        }

        if (! hasRPH(phs, rph)) {
            phs.push(rph);
            localStorage.setItem(key, JSON.stringify(phs));

            /* Maintain a cache of schemes
             * raw_ph_list format:
             * { music: true, bitcoin: true }
             */
            raw_ph_list = localStorage.getItem('protocolhandler-list');
            if (! raw_ph_list) {
                ph_list = {};
            } else {
                ph_list = JSON.parse(raw_ph_list);
            }
            if (! ph_list[rph.scheme]) {
                ph_list[rph.scheme] = true;
                localStorage.setItem('protocolhandler-list', JSON.stringify(ph_list));
            }
        }
    }; /* store_rph */

    chan.bind("registerProtocolHandler", function(trans, rph) {
	    if (confirm(_('confirm register', rph.title, rph.url.split('/')[2], rph.scheme)))
        	store_rph(rph);
        //trans.complete('okay');
    });
})();
