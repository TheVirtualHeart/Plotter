var Point = require('./../../src/entry').Point;
var expect = require('chai').expect;

describe('A suite of tests against the Point object', function () {
    
    describe('Tests for correctly initialized Points', function () {
        it('tests that a Point can be initialized properly', function (done) {
            var p = new Point(1, 3);
            expect(p.x).to.eql(1);
            expect(p.y).to.eql(3);
            done();
        }); 
    });
    
    describe('Tests for incorrectly initialized Points', function () {
        it('tests a Point initialized with no parameters', function (done) {
            var p = new Point();
            expect(p.x).to.be.undefined;
            expect(p.y).to.be.undefined;
            done();
        }); 
        
        it('tests a Point initialized with one parameters', function (done) {
            var p = new Point(3);
            expect(p.x).to.eql(3);
            expect(p.y).to.be.undefined;
            done();
        }); 
        
        it('tests a Point initialized with letters for parameters', function (done) {
            var p = new Point('one', 'b');
            expect(p.x).to.eql('one');
            expect(p.y).to.eql('b');
            done();
        }); 
        
    });
    
});