grab.js
---------
Use the new Symbol api to keep your variables well contained.

```javascript
// class.js
var grab = require('grab')();

function MyClass() {
    var vars = grab(this),
        staticVars = vars.static,
        instance = vars.instance;
        
    instance.count = 0;
    
    if (!static.instanceCount) static.instanceCount = 0;
    static.instanceCount++;
}

MyClass.increment = function(instance) {
    grab(instance).instance.count++;
}

MyClass.prototype.getInstanceCount = function() {
    return grab(this).static.instanceCount;
}

MyClass.prototype.getCount = function() {
    return grab(this).instance.count;
}

module.exports = MyClass;
```

```javascript
//main.js
var MyClass = require('./MyClass.js');

var classA = new MyClass();
var classB = new MyClass();

classA.getInstanceCount(); // => 2
MyClass.increment(classA);
classA.getCount(); // => 1

var grab = require('grab')();

// internal 
grab(classA).static.instanceCount; // => undefined
grab(classA).static.instanceCount = 5;

grab(classA).instance.count; // => undefined
classA.count; // => undefined
grab(classA).instance.count = 10000;

classA.getInstanceCount(); // => 2
classA.getCount(); // => 1

Object.keys(classA); // => [ ]

```