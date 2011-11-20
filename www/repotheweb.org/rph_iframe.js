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
    }, /* store_rph */
    /**
     * Looks in localStorage for the user's preferred
     * protocol handler for the given scheme. If they don't
     * have a default, it prompts the user to choose one.
     * If no protocol handler is found, false is returned.
     *
     * scheme - string - A scheme for a non-standard URI
     * orig_url - string - The original non-standard URL
     * Returns a protocol handler object or false
     */
    load_rph = function (scheme, url) {
        var ls = localStorage,
            known_handlers,
            raw_handlers,
            handlers;
        if (! ls.getItem('protocolhandler-list')) {
            ls.setItem('protocolhandler-list', JSON.stringify([]));
        }
        known_handlers = JSON.parse(ls.getItem('protocolhandler-list'));

        if (known_handlers) {
            var test = known_handlers[scheme],
                key,
                handlers;

            if (! test) {
                return false;
            }
            key = 'protocolhandlers-' + scheme; // TODO: DRY in rph_iframe.js
            raw_handlers = JSON.parse(ls.getItem(key));
            if (raw_handlers === null) {
                alert('Programming error, no handlers found for ' + scheme);
            }
            handlers = raw_handlers[scheme];
            for (var i=0; i < handlers.length; i++) {
                var ph = handlers[i];
                if (ph.default == true) {
                    return ph;
                }
            }
            /* Worst... UI... EVAR */
            var msg = "The following applications can be used to handle " +
                      scheme + " links. [",
                suggest,
                title_to_idx = {},
                titles = [],
                answer;

            for (var i=0; i < handlers.length; i++) {
                ph = handlers[i];
                    if (! suggest) {
                        suggest = ph.title;
                    }

                    title_to_idx[ph.title] = i;
                    titles.push(ph.title);
            }
            msg += titles.join(" | ");
            msg += "] Which one would you like to use?"
            answer = prompt(msg, suggest);
            if (answer) {
                if (handlers[title_to_idx[answer]]) {
                    return handlers[title_to_idx[answer]];
                } else {
                    return handlers[0];
                }
            }
            /* End Worst ... UI... EVAR */
        }
        return false;
    }, /* load_rph */

    /**
     * Rewrites a URI to a protocol handler's URL
     *
     * handler - protocol handler object {scheme, url, title, default}
     * url - String which is a URL with a non-standard scheme.
     * Returns a string which is the normalized url.
     *
     * Example - Given the following protocol handler and url:
     *     handler - {scheme: 'bitcoin', url: 'https://bitcointoday.info/transaction/%s',
                      title: 'Bitcoin Today', default: true}
     *     url - 'bitcoin:tx/f5d8ee39a430901c91a5917b9f2dc19d6d1a0e9cea205b009ca73dd04470b9a6'
     * We would get back:
     *     https://bitcointoday.com/view/tx/f5d8ee39a430901c91a5917b9f2dc19d6d1a0e9cea205b009ca73dd04470b9a6
     *
     * Caller is responsible for validating scheme is valid and matches url.
     * Caller is responsible for handler url being valid.
     */
    rewrite_url = function (handler, url) {
        var parts = handler.url.split('%s');
        // TODO: Do I need to escape url?
        return parts[0] + url + parts[1];
    };

    chan.bind("registerProtocolHandler", function(trans, rph) {
        store_rph(rph);
        //trans.complete('okay');
    });

    chan.bind("protocolHandler", function(trans, ctx) {
        var rv = false,
            rph = load_rph(ctx.scheme, ctx.url);
        if (rph !== false) {
           rv = rewrite_url(rph, ctx.url);
        }
        trans.complete(rv);
    });
})();
