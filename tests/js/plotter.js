var Plotter = require('./../../src/entry').Plotter;
var expect = require('chai').expect;
var util = require('util');

/**
 * A function to initialize the plotter object
 */
function initializePlotter(app) {
    var canvas = document.getElementById('canvas');
    return new Plotter(canvas);
};


describe('A suite of tests against the Plotter object', function () {
    before(function(done) {
        require('./setup.js');
        done();
    });
    describe('Tests for correctly initialized Plotter', function () {
        var app;
        beforeEach(function (done) {
            app = initializePlotter(app);
            done();
        });
        describe('tests that basic initialization works', function () {
            it('tests that a Plotter can be initialized properly', function (done) {
                expect(app).to.be.an('object');
                done();
            }); 
        });
        describe('tests for the debug border', function () {
            it('initializes the debug border as false', function (done) {
                expect(app.drawBorders).to.be.false;
                done();
            });
            it('toggles the debug border to true and back', function (done) {
                app.drawBorders = true;
                expect(app.drawBorders).to.be.true;
                app.drawBorders = false;
                expect(app.drawBorders).to.be.false;
                done();
            });
        });
        describe('tests for the newPlot function', function () {
            it('initializes the plotter with no plots', function (done) {
                /*
                 * The generated plot ID is equal to the plot's index
                 * the plots array and is added sequentially. Knowing
                 * this, when plotter is initialized and creates a plot,
                 * the generate plot ID should be '0'
                 */
                var plotID = app.newPlot({}, 'testPlot');
                expect(plotID).to.be.eql(0);
                done();
            });
            it ('can retrieve a plot by id or name', function (done) {
                done();
            });
        });
    });
    
});