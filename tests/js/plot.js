var Plot = require('./../../src/entry').Plot;
var Point = require('./../../src/entry').Point;
var Line = require('./../../src/entry').Line;
var expect = require('chai').expect;

describe('A suite of tests against the Plot object', function () {
    before(function(done) {
        require('./setup.js');
        done();
    });
    
    describe('Tests for correctly initialized Plots', function () {
        var plot;
        before(function(done) {
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');
            plot = new Plot({}, ctx);
            done();
        });
        
        it('tests that a Plot can be initialized properly', function (done) {
            expect(plot.settings).to.be.an('object');
            expect(plot.mouse).to.be.an('object');
            expect(plot.reCalculateLabels).to.be.a('function');
            done();
        });
        
        describe('tests of the Plot\'s settings property', function () {
            it('tests the default values of the Plot', function (done) {
                var s = plot.settings;
                
                expect(s.offset).to.be.a.Point;
                expect(s.offset).not.to.be.a.Line;
                expect(s.offset.x).to.eql(0 + 75);
                expect(s.offset.y).to.eql(0 + 20);
                
                expect(s.domain).to.be.a.Point;
                expect(s.domain).not.to.be.a.Line;
                expect(s.domain.x).to.eql(-10);
                expect(s.domain.y).to.eql(10);
                
                expect(s.range).to.be.a.Point;
                expect(s.range).not.to.be.a.Line;
                expect(s.range.x).to.eql(-10);
                expect(s.range.y).to.eql(10);
                
                expect(s.pixelPerUnit).to.be.a.Point;
                expect(s.pixelPerUnit.x).to.eql(10);
                expect(s.pixelPerUnit.y).to.eql(10);
                
                var plotY = s.pixelPerUnit.y * (s.range.y - s.range.x);
                var plotX = s.pixelPerUnit.x * (s.domain.y - s.domain.x);
                expect(s.plotSize).to.be.a.Point;
                expect(s.plotSize.x).to.eql(plotX);
                expect(s.plotSize.y).to.eql(plotY);
                
                expect(s.unitPerTick).to.be.a.Point;
                expect(s.unitPerTick.x).to.eql(1);
                expect(s.unitPerTick.y).to.eql(1);
                
                var gridSizeY = s.unitPerTick.y * s.pixelPerUnit.y;
                var gridSizeX = s.unitPerTick.x * s.pixelPerUnit.x;
                expect(s.gridSize).to.be.a.Point;
                expect(s.gridSize.y).to.eql(gridSizeY);
                expect(s.gridSize.x).to.eql(gridSizeX);
                
                expect(s.labelFrequency).to.be.a.Point;
                expect(s.labelFrequency.x).to.eql(2);
                expect(s.labelFrequency.y).to.eql(2);
                
                expect(s.xAxis).to.eql('xAxis');
                expect(s.yAxis).to.eql('yAxis');
                expect(s.zeroBoundAxis).to.be.true;
                expect(s.drawGrid).to.be.true;
                expect(s.drawCoords).to.be.false;
                expect(s.orientation).to.eql('a');
                
                done();
            });
            
            it('tests that the offset is modified correctly', function (done) {
                var s = plot.settings;
                s.offset = new Point(10, 10);
                expect(s.offset).to.be.a.Point;
                expect(s.offset.x).to.eql(10 + 75);
                expect(s.offset.y).to.eql(10 + 20);
                done();
            });
            
            it('tests that the domain is modified correctly', function (done) {
                var s = plot.settings;
                s.domain = new Point(0, 100);
                expect(s.domain).to.be.a.Point;
                expect(s.domain.x).to.eql(0);
                expect(s.domain.y).to.eql(100);
                
                s.domain = new Point(0, -100);
                expect(s.domain).to.be.a.Point;
                expect(s.domain.x).to.eql(-100);
                expect(s.domain.y).to.eql(0);
                
                done();
            });
            
            it('tests that the range is modified correctly', function (done) {
                var s = plot.settings;
                s.range = new Point(0, 100);
                expect(s.range).to.be.a.Point;
                expect(s.range.x).to.eql(0);
                expect(s.range.y).to.eql(100);
                
                s.range = new Point(0, -100);
                expect(s.range).to.be.a.Point;
                expect(s.range.x).to.eql(-100);
                expect(s.range.y).to.eql(0);
                
                done();
            });
            
            it('tests that the pixelPerUnit variable is modified correctly', function (done) {
                var s = plot.settings;
                s.pixelPerUnit = new Point(50, 150);
                expect(s.pixelPerUnit).to.be.a.Point;
                expect(s.pixelPerUnit.x).to.eql(50);
                expect(s.pixelPerUnit.y).to.eql(150);
                
                s.pixelPerUnit = new Point(0, 100);
                expect(s.pixelPerUnit).to.be.a.Point;
                expect(s.pixelPerUnit.x).to.eql(50);
                expect(s.pixelPerUnit.x).not.to.eql(0);
                expect(s.pixelPerUnit.y).to.eql(100);
                
                s.pixelPerUnit = new Point(90, 0);
                expect(s.pixelPerUnit).to.be.a.Point;
                expect(s.pixelPerUnit.x).to.eql(90);
                expect(s.pixelPerUnit.y).to.eql(100);
                expect(s.pixelPerUnit.y).not.to.eql(0);
                
                s.pixelPerUnit = new Point(0, 0);
                expect(s.pixelPerUnit).to.be.a.Point;
                expect(s.pixelPerUnit.x).to.eql(90);
                expect(s.pixelPerUnit.x).not.to.eql(0);
                expect(s.pixelPerUnit.y).to.eql(100);
                expect(s.pixelPerUnit.y).not.to.eql(0);
                
                done();
            });
            
            it('tests that the unitPerTick is modified correctly', function (done) {
                var s = plot.settings;
                s.unitPerTick = new Point(15, 15);
                expect(s.unitPerTick).to.be.a.Point;
                expect(s.unitPerTick.x).to.eql(15);
                expect(s.unitPerTick.y).to.eql(15);
                
                s.unitPerTick = new Point(0, 100);
                expect(s.unitPerTick).to.be.a.Point;
                expect(s.unitPerTick.x).to.eql(15);
                expect(s.unitPerTick.x).not.to.eql(0);
                expect(s.unitPerTick.y).to.eql(100);
                
                s.unitPerTick = new Point(90, 0);
                expect(s.unitPerTick).to.be.a.Point;
                expect(s.unitPerTick.x).to.eql(90);
                expect(s.unitPerTick.y).to.eql(100);
                expect(s.unitPerTick.y).not.to.eql(0);
                
                s.unitPerTick = new Point(0, 0);
                expect(s.unitPerTick).to.be.a.Point;
                expect(s.unitPerTick.x).to.eql(90);
                expect(s.unitPerTick.x).not.to.eql(0);
                expect(s.unitPerTick.y).to.eql(100);
                expect(s.unitPerTick.y).not.to.eql(0);
                
                done();
            });
            
            it('tests that the labelFrequency variable is modified correctly', function (done) {
                var s = plot.settings;
                s.labelFrequency = new Point(50, 150);
                expect(s.labelFrequency).to.be.a.Point;
                expect(s.labelFrequency.x).to.eql(50);
                expect(s.labelFrequency.y).to.eql(150);
                
                s.labelFrequency = new Point(0, -100);
                expect(s.labelFrequency).to.be.a.Point;
                expect(s.labelFrequency.x).to.eql(0);
                expect(s.labelFrequency.y).to.eql(0);
                
                s.labelFrequency = new Point(-90, 0);
                expect(s.labelFrequency).to.be.a.Point;
                expect(s.labelFrequency.x).to.eql(0);
                expect(s.labelFrequency.y).to.eql(0);
                
                s.labelFrequency = new Point(-10, -10);
                expect(s.labelFrequency).to.be.a.Point;
                expect(s.labelFrequency.x).to.eql(0);
                expect(s.labelFrequency.y).to.eql(0);
                
                done();
            });
        });
        
    });
    
});