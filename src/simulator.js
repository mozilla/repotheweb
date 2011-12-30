define(
    'simulator',
    ['config', 'jschannels', 'utils'],
    function (config, jschannels, utils) {
        return {
            /* BEGIN registerProtocolHandler simulator
             *
             * When a user clicks a link that isn't a standard
             * internet protocol, this code will:
             * 1) Look in localStorage for a registered protocol handler
             * 2) Look in the current html document for a fallback meta tag
             *
             * If a protocol handler is found, the href of the link is
             * re-written to the handler's url.
             *
             * If none are found, pass-through to the browser
             */
            simulate_rph: function (e) {
                var this_url = $(this).attr('href'),
                    this_scheme = this_url.split(':')[0],
                    official_schemes = [
                    'http', 'https', 'mailto', 'ftp', 'gopher'
                    ], //gopher, I kid, I kid
                    prtcl_hndlr,
                    _ = require('simulator'),
                    fallback;
                e.preventDefault();
                if (this_url.indexOf(official_schemes) != -1) {
                    return false;
                }
                // ensure handler_list exists
                e.preventDefault();
                fallback = $('meta[name=fallback-rph][protocol=' + this_scheme + ']', $(this).parents('html')).attr('content');
                _.run_protocol_handler(this_scheme, this_url, fallback);
                return true;
            }, /* simulate_rph */
            /**
             * Asynchonous function to run the user's protocol handler or passthrough to browser.
             * Method cancels the current event.
             *
             * scheme - string - A scheme for a non-standard URI
             * orig_url - string - The original non-standard URL
             * Return - void, async
             */
            run_protocol_handler: function (scheme, orig_url, fallback) {
                var iframe = utils._open_hidden_iframe(window.document),
                chan = config.chan;
                // clean up a previous channel that never was reaped
                if (chan) chan.destroy();
                chan = jschannels.Channel.build({'window': iframe.contentWindow, 'origin': '*', 'scope': "mozid"});

                function cleanup() {
                    chan.destroy();
                    chan = undefined;
                    if (iframe.close) iframe.close();
                    if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
                };

                // TODO caller semantics... async or sync. Leak handlers into 3rd party sites to pre-load?
                chan.call(
                    {
                        'method': "protocolHandler",
                        'params': {'scheme': scheme, 'url': orig_url},
                        'success': function (new_url) {
                            //TODO rph_iframe.js DRY
                            var rewrite_url = function (handler_url, url) {
                                    var parts = handler_url.split('%s');
                                    return parts[0] + url + parts[1];
                                },
                                fallback_url = rewrite_url(fallback, orig_url);
                            cleanup();
                            if (new_url === false) {
                                if (fallback) {
                                    window.location = fallback_url;
                                } else {
                                    window.location = orig_url;
                                }
                            } else {
                                window.location = new_url;
                            }
                        },
                        'error': function(code, msg) {

                        }
                    }); //chan.call
            } /* run_protocol_handler */
        };
    });
