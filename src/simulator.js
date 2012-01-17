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
                    'http', 'https', 'ftp', 'gopher'
                    ], //gopher, I kid, I kid
                    prtcl_hndlr, fallback;
                if (this_url.indexOf(official_schemes) != -1) {
                    return false;
                }
                // ensure handler_list exists
                fallback = $('meta[name=fallback-rph][protocol=' + this_scheme + ']', $(this).parents('html')).attr('content');
                location.assign(config.ipServer+'/#'+this_url);
                return false;
            }, /* simulate_rph */
        };
    });


