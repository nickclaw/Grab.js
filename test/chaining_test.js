var expect = require('chai').expect,
	grab = require('../symgrab.js')();


describe('symgrab chaining', function() {

	it('should ignore filler chain words', function() {

		var grabbed = grab({});

		expect(grabbed).to.equal(grabbed.a);
		expect(grabbed).to.equal(grabbed.the);
		expect(grabbed).to.equal(grabbed.then);
	});

	it('should keep a common prototype when chained', function() {
		var grabbed = grab({});

		expect(grabbed.static.__proto__).to.equal(grabbed);
		expect(grabbed.instance.__proto__).to.equal(grabbed);
		expect(grabbed.public.__proto__).to.equal(grabbed);
		expect(grabbed.private.__proto__).to.equal(grabbed);
		expect(grabbed.get.__proto__).to.equal(grabbed);
		expect(grabbed.set.__proto__).to.equal(grabbed);
		expect(grabbed.remove.__proto__).to.equal(grabbed);
	});

	it('should correctly inherit a prototypes values', function() {
		var grabbed = grab({});
		grabbed.test = "HI";

		expect(grabbed.static.test).to.equal(grabbed.test);
		expect(grabbed.instance.test).to.equal(grabbed.test);
		expect(grabbed.public.test).to.equal(grabbed.test);
		expect(grabbed.private.test).to.equal(grabbed.test);
		expect(grabbed.get.test).to.equal(grabbed.test);
		expect(grabbed.set.test).to.equal(grabbed.test);
		expect(grabbed.remove.test).to.equal(grabbed.test);
	});
});