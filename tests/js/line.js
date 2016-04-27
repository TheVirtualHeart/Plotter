var Line = require('./../../src/entry').Line;
var Point = require('./../../src/entry').Point;
var expect = require('chai').expect;

describe('A suite of tests against the Line object', function () {
    
    describe('Tests for correctly initialized Line', function () {
        it('tests that a Line can be initialized properly with 2 points', function (done) {
            var p1 = new Point(1, 2);
            var p2 = new Point(3, 4);
            var l = new Line(p1, p2);
            
            expect(l.a).to.be.a.Point;
            expect(l.a.x).to.eql(1);
            expect(l.a.y).to.eql(2);
            
            expect(l.b).to.be.a.Point;
            expect(l.b.x).to.eql(3);
            expect(l.b.y).to.eql(4);
            
            expect(l.point).to.be.undefined;
            expect(l.slope).to.be.undefined;
            done();
        }); 
    });
    
    describe('Tests for incorrectly initialized Lines', function () {
        it('tests a Line initialized with no parameters', function (done) {
            var l = new Line();
            expect(l.a).to.be.undefined;
            expect(l.b).to.be.undefined;
            expect(l.point).to.be.undefined;
            expect(l.sloe).to.be.undefined;
            done();
        }); 
        
        it('allows the User to enter point-and-slope arguments in a two-point initialization', function (done) {
            var l = new Line(new Point(3, 4), 5);
            expect(l.a).to.be.a.Point;
            expect(l.a.x).to.eql(3)
            expect(l.a.y).to.eql(4);;
            expect(l.b).to.eql(5);
            expect(l.point).to.be.undefined;
            expect(l.sloe).to.be.undefined;
            done();
        }); 
    });
    
});