var Plot = require('./../../src/entry').Plot;
var expect = require('chai').expect;

describe('A suite of tests against the Plot object', function () {
    before(function(done) {
        require('./setup.js');
        done();
    });
    describe('Tests for correctly initialized Plots', function () {
        it('tests that a Plot can be initialized properly', function (done) {
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');
            var plot = new Plot({}, ctx);
            expect(plot.settings).to.be.an('object');
            expect(plot.mouse).to.be.an('object');
            expect(plot.reCalculateLabels).to.be.a('function');
            done();
        }); 
    });
    
});