(function(window) {
        
    //
    // Internal flags
    //
    
    var namespace = Symbol(),
        context = Symbol(),
        action = Symbol(),
        location = Symbol(),
        type = Symbol(),
        private = Symbol();
    

    //
    // The heart of the beast
    //
    
    function Grabber() {
        var ns = Symbol();
        
        /**
         * The `grab` function
         * @param {Object} ctx
         * @return {Object} accessor
         */
        return function(ctx) {
            return extend(accessor, [
                namespace, ns,
                context, ctx,
                location, ctx
            ]);
        };
    }
    


    //
    // Base accessor object
    //
    
    // all flags and properties hidden behind
    // internal symbols
    var accessor = extend(Object.create(null), [
        context, undefined,
        namespace, null,
        location, null,
        action, noop,
        private, true
    ]);
    
    // make chainable properties to set flags/functions
    defineProperties(accessor, {
        
        /**
         * Access the prototype namespaces
         * shared by all instances of this object
         */
        'static': function() {
            return extend(this, [
                location, this[context].__proto__
            ]);
        },
        
        /**
         * Access the instance namespace
         * only used by this instance of the object
         */
        'instance': function() {
            return extend(this, [
                location, this[context]
            ]);
        },
        
        /**
         * Access public variables
         * probably shouldn't ever need to be used but..
         */
        'public': function() {
            return extend(this, [
                private, false
            ]);
        },
        
        /**
         * The default, access variables hidden behind
         * a namespace. Also probably not going to be used..
         */
        'private': function() {
            return extend(this, [
                private, true
            ]);
        },
        
        /**
         * Want to get a variable
         */
        'get': function() {
            return extend(this, [
                action, actions.get
            ]);
        },
        
        /**
         * Want to set a variable
         */
        'set': function() {
            return extend(this, [
                action, actions.set
            ]);
        },
        
        /**
         * Want to delete a variable
         */
        'remove': function() {
            return extend(this, [
                action, actions.remove
            ]);
        }
    });
        
    // add filler properties (for nice sentences)
    ['a', 'the', 'then'].forEach(function(filler) {
        defineProperty(accessor, filler, noop);
    });
    
    // the function to actually do something
    // after all necessary flags have been set
    accessor.variable =
    accessor.var = function() {
        var public = !this[private],
            loc = this[location],
            act = this[action],
            ns = this[namespace];
            
        // if public, don't worry about namespacing, do action
        if (public) return act.apply(loc, arguments);
        
        // otherwise, make sure namespace exists, then do action
        if (!loc[ns]) loc[ns] = Object.create(null);
        return act.apply(loc[ns], arguments);
    };
    


    //
    // Actions
    //
    
    var actions = {
        
        // get variable
        get: function(key) {
            return this[key];
        },
        
        // set variable
        set: function(key, value) {
            return this[key] = value;
        },
        
        // delete variable
        remove: function(key) {
            return delete this[key];
        }
    };
    


    //
    // Utilities
    //
    
    /**
     * Extends an object overriding properties without destroying them
     * Uses an array of [key, value, key value] instead of an object
     * to make it easier to use Symbols as keys
     *
     * @param {Object} obj
     * @param {Array} props - [key, value, key value]
     * @return {Object} - extended object
     */
    function extend(obj, props) {
        obj = Object.create(obj);
        
        for(var i = 0; i < props.length; i+=2) {
            obj[props[i]] = props[i + 1];
        }
        
        return obj;
    }
    
    /**
     * A property definer, used for chained syntax
     * Borrowed from chai.js
     *
     * @param {*} ctx
     * @param {String} name
     * @param {Function} getter
     */
    function defineProperty(ctx, name, getter) {
        Object.defineProperty(ctx, name, {
            get: function() {
                var result = getter.call(this);
                return result === undefined ? this : result;
            },
            configurable: true
        });
    }
 
    /**
     * Define a bunch of properties at once
     * @param {Object} ctx
     * @param {Object} getters
     */
    function defineProperties(ctx, getters) {
        for(var key in getters) {
            defineProperty(ctx, key, getters[key]);
        }
    }
    
    /**
     * Does nothing
     */
    function noop() {}


    //
    // Export
    //

    // node
    if ( typeof module === 'object' && module && typeof module.exports === "object") {
        module.exports = Grabber;
    }
    
    // browser
    else {
        window.Grabber = Grabber;

        if (typeof define === "function" && define.amd) {
            define("grabber", [], function() {
                return Grabber;
            });
        }
    }
    
})(this);