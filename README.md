#Repo the Web#
A JavaScript shim which provides the registerProtocolHandler JavaScript API to browsers which have not implemented it yet.

Unlike most polyfills, this one *must* be centrally hosted as it uses localStorage to maintain protocol registrations.

##Demo##

    # terminal 1
    $ cd www/repo-the-web.org/
    $ python -m SimpleHTTPServer 8001
    # terminal 2
    $ cd www/rhapsody.com/
    $ python -m SimpleHTTPServer 8002
    # terminal 3
    $ cd www/music-blog.com/
    $ python -m SimpleHTTPServer 8003

Visit [Fake Rhapsody](http://dev.rhapsody.com:8002/) and "Install Rhapsody"

Visit [Repo The Web config](http://dev.repo-the-web.org:8001/config.html) to see installed handlers
TODO Choose defaults, un-install apps, etc.

TODO Visit [Fake Music Blog](http://music-blog.com:8002/index.html) to use music: links.

##RePo Shim Usage##

###A Music Service###
    <script src="http://dev.repo-the-web.org:8001/include.js"></script>
    <script>
    navigator.xregisterProtocolHandler('music', 'http://your-domain.com/rph/uri#%s', 'Great Music App');
    </script>

###A Blog with Music Links###
    <p>Jimmie's <a href="music:musicbrainz.org/release/a5bbcaf9-5387-33e2-9411-902ac263666b">The Cry of Love</a></p>

TODO add meta tag example