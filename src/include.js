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
                // Simulate hanger notification
                if (confirm("Add " + title + "(" + domain + ") as an application for " +
                            scheme + " links?")) {
                    chan.call({
                                  method: "registerProtocolHandler",
                                  params: {'scheme': scheme, 'url': url, 'title':title, 'default':true},
                                  success: function (rv) {
                                      cleanup();
                                  },
                                  error: function(code, msg) {

                                  }
                              });//chan.call
                }// if confirm
                navigator._registerProtocolHandlerIsShimmed = true;

            }

            document.onclick = function(e) {
var target;
                if (!e) e = window.event;
                if (e.target) target = e.target
else target = e.srcElement;
                if (target.nodeName.toLowerCase() != "a") return;
                return sim.simulate_rph.call(target, e);
            }

        } // end if
    }); // end require
