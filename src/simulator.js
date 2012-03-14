define(
    'simulator',
    ['config', 'jschannels', 'utils'],
    function (config, jschannels, utils) {
        return {
            /* BEGIN registerProtocolHandler simulator
*
* When a user visits a link that isn't a standard
* internet protocol, this code will forward to a
* redirection page:
* http://bewehtoper.org?fallback#fakeURL
* Where the fallback is optional. 
*
* Currently only works on <a> tags.
*/
            simulate_rph: function (url) {
                var scheme = url.split(':')[0],
                    official_schemes = [
                    'http', 'https', 'ftp', 'gopher'
                    ], //gopher, I kid, I kid
                    prtcl_hndlr, fallback;
                if (url.indexOf(official_schemes) == 0) {
                    return url;  // no change
                }
                // ensure handler_list exists
                fallback = document.querySelector('meta[name=fallback-rph][protocol=' + scheme + ']').content;
								fallback = fallback ? '?' + escape(fallback) : ''; // Include the fallback if it exists
                return config.ipServer + fallback + '#' + url;
            }, /* simulate_rph */
        };
    });


