/*jslint strict: false, plusplus: false */
/*global require: true, navigator: true, window: true */
require(
    ['jschannels', 'simulator', 'utils', 'config'],
    function (jschannels, sim, utils, config) {
        if (!navigator.xregisterProtocolHandler || !navigator._registerProtocolHandlerIsShimmed) {
            var simulate_rph;
            navigator.xregisterProtocolHandler = function (scheme, url, title) {
                // Prompt user, if conset, store locally
                var domain_parts, domain,
                doc = window.document,
                iframe = utils.iframe,
                chan = config.chan;

                // clean up a previous channel that never was reaped
                if (chan) chan.destroy();
                chan = jschannels.Channel.build({'window': iframe.contentWindow, 'origin': '*', 'scope': "mozid"});

                function cleanup() {
                    chan.destroy();
                    config.chan = undefined;
                }

                if (url.indexOf("%s") == -1) {
                    if (window.console) console.error("url missing %s " + url);
                    return;
                }
                domain_parts = url.split('/');
                if (domain_parts.length < 2) {
                    if (window.console) console.error("Improper url " + url);
                    return;
                }
                domain = domain_parts[2];

                chan.call({
                              method: "registerProtocolHandler",
                              params: {scheme: scheme, url: url, title:title, icon:utils.getFavicon()},
                              success: function (rv) {
                                  cleanup();
                              },
                              error: function(code, msg) {

                              }
                          });//chan.call

                navigator._registerProtocolHandlerIsShimmed = true;

            }

            document.onclick = function(e) {
								/* Correct IE, partially in vain */
								var target;
                if (!e) e = window.event;
                if (e.target) target = e.target
								else target = e.srcElement;

                if (target.nodeName.toLowerCase() != "a") return;  // Only activate on <a> tags

								/* Go to the altered URL returned by the simulation */
                open(sim.simulate_rph(target.href), target.target ? target.target : "_self");
								return false;
            }

        } // end if
    }); // end require
