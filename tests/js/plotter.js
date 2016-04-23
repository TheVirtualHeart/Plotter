var Plotter = require('./../../src/entry').Plotter;
var expect = require('chai').expect;

describe('A suite of tests against the Plotter object', function () {
    before(function(done) {
        require('./setup.js');
        done();
    });
    describe('Tests for correctly initialized Plotter', function () {
        it('tests that a Plotter can be initialized properly', function (done) {
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');
            var app = new Plotter(canvas);
            
            expect(app).to.be.an('object');
            done();
        }); 
    });
    
});