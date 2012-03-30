/* local copy of of OnReady.js, altered slightly to work with Require.js 
   http://tobyho.com/2010/03/21/onready-in-a-smaller-package/ */
define('onready', function(){
    var addLoadListener
    var removeLoadListener
    if (window.addEventListener){
        addLoadListener = function(func){
            window.addEventListener('DOMContentLoaded', func, false)
            window.addEventListener('load', func, false)
        }
        removeLoadListener = function(func){
            window.removeEventListener('DOMContentLoaded', func, false)
            window.removeEventListener('load', func, false)
        }
    }else if (document.attachEvent){
        addLoadListener = function(func){
            document.attachEvent('onreadystatechange', func)
            document.attachEvent('load', func)
        }
        removeLoadListener = function(func){
            document.detachEvent('onreadystatechange', func)
            document.detachEvent('load', func)
        }
    }
    
    var callbacks = null
    var done = false
    function __onReady(){
        done = true
        removeLoadListener(__onReady)
        if (!callbacks) return
        for (var i = 0; i < callbacks.length; i++){
            callbacks[i]()
        }
        callbacks = null
    }
    function OnReady(func){
        if (done){
            func()
            return
        }
        if (!callbacks){
            callbacks = []
            addLoadListener(__onReady)
        }
        callbacks.push(func)
    }
    return OnReady
})

