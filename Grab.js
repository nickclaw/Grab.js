(function(exports) {
    
    exports.Grabber = Grabber;
    
    /**
     * Create a grabber for your module
     * @return {Function} - grab
     */
    function Grabber() {
        var _static = Symbol('static'),
            _instance = Symbol('instance');
        
        /**
         * Grab an instance or static variable from the context
         * @param {Object} ctx
         * @return {Object} - chainable grabber
         */
        return function(ctx) {
            
            return extendSecret(proto, {
                ctx: ctx,
                loc: ctx,

                _static: _static,
                _instance: _instance
            });
        }
    }
    
    var secret = Symbol('secrets');
    
    //
    // Chaining functions
    //
    
    var chainable = function() {
        
    };
    defineProperties(chainable, {
        
        get: function() {
            return extendSecret(this, {
                action: get
            });
        },
        
        set: function() {
            return extendSecret(this, {
                action: set
            });
        },
        
        remove: function() {
            return extendSecret(this, {
                action: remove
            });
        },
        
        static: function() {
            return extendSecret(this, {
                type: this[secret]._static
            });
        },
        
        instance: function() {
            return extendSecret(this, {
                type: this[secret]._instance
            });
        }
    });
    
    chainable.var =
    chainable.variable = function() {
        var map = this[secret];
        
        // TODO v8ify
        if (!map.loc[map.type]) map.loc[map.type] = Object.create(null);
        return map.action.call(map.loc[map.type], arguments, map);
    };
    
    ['a', 'the', 'then', 'variable', 'var'].forEach(function(filler) {
        defineProperty(chainable, filler, noop);
    });
    
    //
    // Flags
    //
    
    var proto = Object.create(chainable);
    proto[secret] = {
        ctx: undefined,
        loc: undefined,
        type: null,
        action: null,
        
        _instance: null,
        _static: null
    };
    
    //
    // Actions
    //
    
    function get(args, flags) {
        return this[args[0]];
    }
    
    function set(args, flags) {
        return this[args[0]] = args[1];
    }
    
    function remove(args, flags) {
        return delete this[args[0]];
    }
    
    //
    // Utility methods
    //
    
    /**
     * Extend an object
     * @param {Object} obj
     * @param {Object} params
     */
    function extendSecret(obj, props) {
        obj[secret]= Object.create(obj[secret]);
        for (key in props) {
            if (props.hasOwnProperty(key)) obj[secret][key] = props[key];
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
        for(key in getters) {
            defineProperty(ctx, key, getters[key]);
        }
    }
    
    /**
     * Does nothing
     */
    function noop() {}
    
})(this);