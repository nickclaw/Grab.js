/**
 *
 *
 */
(function(exports) {
    
    exports.Grab = Grab;
    
    var secret = Symbol("_secret_vars");
    
    //
    // Creator
    //

    function Grab() {
        
        //
        // Symbols
        //
        var instance = Symbol("instance_vars");
        var static = Symbol("static_vars");
        
        return function(ctx) {
            return new Grabber(ctx, {
                'instance': instance,
                'static': static
            });
        };
    }
    
    //
    // Constructor
    //

    function Grabber(ctx, symbols) {
        this[secret] = {
            symbols: symbols,
            ctx: ctx,
            location: ctx,
            type: null,
            action: null
        };
    }
    
    //
    // Prototype
    //
    
    // thing that actually does something
    Grabber.prototype.var =
    Grabber.prototype.variable = function variable(key, value) {
        if (!this[secret]['type']) throw new Error("error");
        if (!this[secret]['action']) throw new Error("error");
        if (!this[secret]['location'][this[secret]['type']]) this[secret]['location'][this[secret]['type']] = Object.create(null);
        return this[secret]['action'](this[secret]['location'][this[secret]['type']], key, value);
    };
    
    // chainable
    defineProperties(Grabber.prototype, {
        
        'static': function() {
            this[secret]['type'] = this[secret]['symbols']['static'];
            this[secret]['location'] = this[secret]['ctx']['constructor']['prototype'];
        },
        
        'instance': function() {
            this[secret]['type'] = this[secret]['symbols']['instance'];
            this[secret]['location'] = this[secret]['ctx'];
        },
        
        'get': function() {
            this[secret]['action'] = get;
        },
        
        'set': function() {
            this[secret]['action'] = set;
        },
        
        'remove': function() {
            this[secret]['action'] = remove;
        }
    });
    
    // filler
    ['a', 'the', 'then'].forEach(function(filler) {
        defineProperty(Grabber.prototype, filler, function(){});
    });

    //
    // Handlers
    //
    function get(vars, key) {
        return vars[key];
    }

    function set(vars, key, value) {
        return vars[key] = value;
    }

    function remove(vars, key) {
        return delete vars[key];
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
    
})(this);