
(function() {
    var chan = Channel.build({
        window: window.parent,
        origin: "*",
        scope: "mozid"
    }),
    store_rph = function (rph) {
        var key,
            raw_phs,
            phs,
            raw_ph_list,
            ph_list,
            hasPRH;
        key = 'protocolhandlers-' + rph.scheme;
        raw_phs = localStorage.getItem(key);
        hasRPH = function (rph_list, rph) {
            for (var i=0; i < rph_list.length; i++) {
                if (rph_list[i].url == rph.url) {
                    return true;
                }
            }
            return false;
        };
        if (! raw_phs) {
            phs = {};
        } else {
            phs = JSON.parse(raw_phs);
        }
        if (! phs[rph.scheme]) {
            phs[rph.scheme] = [];
        }
/* {"music":[
  {"scheme":"music","url":"http://dev.rhapsody.com:8003/rph/relay.html?uri=%s","title":"Rhapsody","default":true},
  {"scheme":"music","url":"http://dev.spotify.com:8004/rph?uri=%s","title":Spotify","default":false}
]} */
        if (! hasRPH(phs, rph)) {
            phs[rph.scheme].push(rph);
        }
        localStorage.setItem(key, JSON.stringify(phs));

        /* Maintain a cache of schemes */
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
    }; /* store_rph */

    chan.bind("registerProtocolHandler", function(trans, rph) {
        store_rph(rph);
        //trans.complete('okay');
    });
})();
