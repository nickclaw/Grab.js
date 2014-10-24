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
});