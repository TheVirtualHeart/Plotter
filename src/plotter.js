var Point = require('./point');
var Plot = require('./plot');
var Line = require('./line');

/**
 * Creates a Plotter object. Given a HTML Canvas Element, this function creates
 * a series of functions for interacting with it. It also attaches some of
 * these functions to event listeners for mouse and touch events.
 * @module Plotter
 *
 * @param {HTMLCanvasElement} canvas - The Canvas element that plots will be
 * drawn on.
 *
 * @param {Point} padding - a Point that describs how much padding
 * to apply to the canvas element before rendering elements.
 */
function createPlotter()
{
	var canvas, ctx;
	var plots = [];
	var plotNames = {};
	var currentPlot, clipped = false;
	var debugBorders = false;
	var padding = typeof arguments[1] !== "undefined" ? arguments[1] : new Point(0, 0);
	
	canvas = arguments[0];
	ctx = canvas.getContext("2d");
		
	canvas.addEventListener("mousedown", function(e){updateMouse(e);}, false);
	canvas.addEventListener("mousemove", function(e){updateMouse(e);}, false);
	canvas.addEventListener("mouseup", function(e){updateMouse(e);}, false);
	canvas.addEventListener("touchstart", function(e){updateTouch(e);}, false);
	canvas.addEventListener("touchmove", function(e){updateTouch(e);}, false);
	canvas.addEventListener("touchend", function(e){updateTouch(e);}, false);
	canvas.addEventListener("touchcancel", function(e){updateTouch(e);}, false);
	

	/**
	 * Take a point in the page coordinate system and convert it to the plot
	 * coordinate system.
	 * 
	 * @param  {Point} p - the point in the page coordinate system.
	 * 
	 * @param  {Plot} plot - the plot object. The point will be converted to
	 * this plot's coordinate system.
	 * 
	 * @return {Point} - A Point in the Plot's local coordinate system.
	 */
	function pageToPlot(p, plot)
	{
		var s = plot.settings;
		var x = (p.x - canvas.offsetLeft - s.offset.x) / s.pixelPerUnit.x + s.domain.x;
		var y = (canvas.height - (p.y - canvas.offsetTop) - (canvas.height - (s.offset.y + s.plotSize.y))) / s.pixelPerUnit.y + s.range.x;
		return new Point(x, y);
	}
	

	/**
	 * Determines whether a given point is in the bounds of the given plot.
	 * 
	 * @param  {Point} p - The point that we are checking.
	 * 
	 * @param  {Plot} plot - the plot we are checking the point against.
	 * 
	 * @return {boolean} - true if the point is in the bounds of the plot. False
	 * otherwise.
	 */
	function pointInBounds(p, plot)
	{
		var s = plot.settings;
		return (p.x >= s.domain.x && p.x <= s.domain.y && p.y >= s.range.x && p.y <= s.range.y)
	}
	

	/**
	 * Cycle through all of the plots and check if the current point is within
	 * its bounds. If so, return the ID of the plot.
	 * 
	 * @param  {Point} p - the point in the canvas coordinate system.
	 * 
	 * @return {number} - returns the index value of the plot underneath the
	 * point. If there is no plot underneath the point, a value of -1 is
	 * returned.
	 */
	function findPlotUnderPoint(p)
	{
		for (var i = 0; i < plots.length; i++) {
			if (pointInBounds(pageToPlot(p, plots[i]), plots[i])) {
				return i;
			}
		}
		return -1;
	}
	

	/**
	 * Listens for a mouse event on the canvas. It tries to find the plot on
	 * which the event occurred and records the location where the event
	 * occurred in the plot's local coordinate system. Afterwards, it updates
	 * the state of the plot's mouse event.
	 * 
	 * @param  {Event} e - the MouseEvent that occurred
	 */
	function updateMouse(e)
	{
		var plot = findPlotUnderPoint(new Point(e.pageX, e.pageY));
		if (plot == -1) {
			return;
		}

		plot = plots[plot];
		var p = pageToPlot(new Point(e.pageX, e.pageY), plot);
		var type = e.type.replace("mouse", '');
		
		if ((type == "down" || type == "move") && (!(e.buttons & 1) && e.button != 0)) {
			return;
		}
		
		plot.mouse[type].x = p.x;
		plot.mouse[type].y = p.y;
		if (type == "down")
		{
			plot.mouse.isDown = true;
			plot.mouse.isUp = false;
		}
		else if (type == "up")
		{
			plot.mouse.isDown = false;
			plot.mouse.isUp = true;
		}
	}
	

	/**
	 * Listens for a touch event on the canvas and converts it to an equivalent
	 * mouse event.
	 * @fires MouseEvent.
	 * @alias module: Plotter~updateTouch
	 * 
	 * @param  {Event} e - an event list that contains all of the touch events
	 * that occurred.
	 */
	function updateTouch(e)
	{	
		var type = e.type.replace("touch",'');
		for(var i = 0; i < e.changedTouches.length; i++)
		{
			// var touchID;
			var event;
			
			switch(type)
			{
				case "start":
					event = new window.MouseEvent("mousedown",
					{screenX: e.changedTouches[i].screenX, screenY: e.changedTouches[i].screenY,
					clientX: e.changedTouches[i].clientX, clientY: e.changedTouches[i].clientY});
				break;
				case "move":
					event = new window.MouseEvent("mousemove",
					{screenX: e.changedTouches[i].screenX, screenY: e.changedTouches[i].screenY,
					clientX: e.changedTouches[i].clientX, clientY: e.changedTouches[i].clientY});
				break;
				case "cancel":
				case "end":
					event = new window.MouseEvent("mouseup",
					{screenX: e.changedTouches[i].screenX, screenY: e.changedTouches[i].screenY,
					clientX: e.changedTouches[i].clientX, clientY: e.changedTouches[i].clientY});
				break;
				default:
				break;
			}
			canvas.dispatchEvent(event);
		}
		if (e.touches.length > 0)
		{
			var plot = findPlotUnderPoint(new Point(e.pageX, e.pageY));
			if (plot != -1)
			{
				plots[plot].mouse.isDown = true;
				plots[plot].mouse.isUp = false;
			}
		}
		if (e.touches.length == 1 && type == "move") {
			e.preventDefault();
		}
	}
	

	/**
	 * Resizes the canvas element to fit the contents of the plots. It cycles
	 * through all of the plots and records the highest x value and the highest
	 * y value. It then resizes the canvas and redraws the plots.
	 * @alias module: Plotter~refitCanvas
	 */
	function refitCanvas()
	{
		if (plots.length == 0) {
			return;
		}
		
		if (clipped)
		{
			ctx.restore();
			clipped = false;
		}
		
		var size = new Point(0, 0);
		for (var i = 0; i < plots.length; i++)
		{
			var s = plots[i].settings;
			size.x = Math.max(size.x, s.offset.x + s.plotSize.x + s.labelBleed.x);
			size.y = Math.max(size.y, s.offset.y + s.plotSize.y + s.labelSize.y);
		}			
		canvas.width = size.x + padding.x + 10;
		canvas.height = size.y + padding.y + 10;
		
		ctx.strokeStyle = "#0000FF";
		ctx.lineWidth = 2;
		ctx.strokeRect(0, 0, canvas.width, canvas.height);
		
		for (var j = 0; j < plots.length; j++)
			drawPlot(plots[j]);
	}
	

	/**
	 * Renders the specified plot on the canvas. This function takes a Plot
	 * object and then uses its settings to draw it on the canvas.
	 * @alias module: Plotter~drawPlot
	 * 
	 * @param  {Plot} plot - the Plot object we want to render on the canvas
	 */
	function drawPlot(plot)
	{
		var s = plot.settings;
		var tickLabel;
		
		ctx.translate(s.offset.x, s.offset.y);
		ctx.clearRect(-s.labelSize.x, s.labelBleed.y, s.plotSize.x + s.labelSize.x + s.labelBleed.x, s.plotSize.y + s.labelSize.y - s.labelBleed.y);
		if (debugBorders)
		{
			ctx.lineWidth = 0.5;
			ctx.strokeRect(-s.labelSize.x, s.labelBleed.y, s.plotSize.x + s.labelSize.x + s.labelBleed.x, s.plotSize.y + s.labelSize.y - s.labelBleed.y);
		}	
		ctx.lineWidth = 2;
		
		//plot
		ctx.fillStyle = "#F8F8F8";
		ctx.fillRect(0, 0, s.plotSize.x, s.plotSize.y);
		ctx.fillStyle = "#000000";
		ctx.strokeStyle = "#E0E0E0";
		ctx.font = "16px Helvetica";
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.beginPath();
			for( var i = 0; i <= s.plotSize.x / s.gridSize.x; i++)
			{
				var x = i * s.gridSize.x;
				if (s.orientation=="c" || s.orientation=="d")
					x = s.plotSize.x - x;
				
				if (s.drawGrid)
				{
					ctx.moveTo(x, s.plotSize.y);
					ctx.lineTo(x, 0);
				}
				
				if (!(i % s.labelFrequency.x) && s.labelFrequency.x > 0)
				{
					tickLabel = s.domain.x + i * s.unitPerTick.x;
					ctx.fillText( s.labelPrecision.x == -1 ? tickLabel : tickLabel.toFixed(s.labelPrecision.x), x, s.plotSize.y + 5);
				}
			}
			ctx.textAlign = "right";
			ctx.textBaseline = "middle";
			for(var j = 0; j <= s.plotSize.y / s.gridSize.y; j++)
			{
				var y = j * s.gridSize.y;
				if (!(s.orientation=="b" || s.orientation=="c"))
					y = s.plotSize.y - y;	
				if (s.drawGrid)
				{
					ctx.moveTo(0, y);
					ctx.lineTo(s.plotSize.x, y);
				}
				if (!(i % s.labelFrequency.y) && s.labelFrequency.y > 0)
				{
					tickLabel = s.range.x + j * s.unitPerTick.y;
					ctx.fillText(s.labelPrecision.y == -1 ? tickLabel : tickLabel.toFixed(s.labelPrecision.y), -5, y);
				}
			}
		ctx.stroke();
		
		//axis
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 1;
		ctx.beginPath();
			var axisOffset = new Point(
			(s.zeroBoundAxis ? Math.max(0, Math.min(s.plotSize.x, ((s.orientation=="c"||s.orientation=="d") ? s.domain.y : -s.domain.x) * s.pixelPerUnit.x)) : (s.orientation=="c"||s.orientation=="d") ? s.plotSize.x : 0),
			(s.zeroBoundAxis ? Math.min(s.plotSize.y, Math.max(0, ((s.orientation=="b"||s.orientation=="c") ? -s.range.x : s.range.y) * s.pixelPerUnit.y)) : (s.orientation=="b"||s.orientation=="c") ? 0 : s.plotSize.y));
			ctx.moveTo(axisOffset.x, 0);
			ctx.lineTo(axisOffset.x, s.plotSize.y);
			ctx.moveTo(0, axisOffset.y);
			ctx.lineTo(s.plotSize.x, axisOffset.y);
		ctx.stroke();
		
		//x axis label
		ctx.textAlign = "center";
		ctx.textBaseline = "bottom";
		ctx.font = "24px Helvetica";
		ctx.fillText(s.xAxis, s.plotSize.x * 0.5, s.plotSize.y + s.labelSize.y);
		
		//y axis label
		ctx.translate(-s.labelSize.x,  s.plotSize.y * 0.5);
		ctx.rotate(3 * Math.PI * 0.5);
		ctx.textBaseline = "top";
		ctx.fillText(s.yAxis, 0, 0);
		ctx.rotate(-3 * Math.PI * 0.5);
		ctx.translate(s.labelSize.x,  -(s.plotSize.y * 0.5));
		
		//coordinates
		if (s.drawCoords) //needs to be redone entirely
		{
			var coordOffsetY = Math.max(ctx.measureText(s.domain.x).width, ctx.measureText(s.domain.y).width);
			var coordOffsetX = coordOffsetY * 2 + ctx.measureText("y: ").width;
			ctx.textAlign = "left";
			ctx.textBaseline = "bottom";
			ctx.fillText("x: " + (isNaN(Math.round(this.mouse.move.x)) ? 0 : Math.round(this.mouse.move.x)), s.plotSize.x - coordOffsetX - 20, s.plotSize.y + s.labelSize.y);
			ctx.fillText("y: " + (isNaN(Math.round(this.mouse.move.y)) ? 0 : Math.round(this.mouse.move.y)), s.plotSize.x - coordOffsetY - 10, s.plotSize.y + s.labelSize.y);
		}
		
		ctx.translate(-s.offset.x, -s.offset.y);
	}
	
	/**
	 * An object that contains several functions for interacting with the
	 * Plotter. These include functions for interacting with the plots, as well
	 * as functions for drawing shapes and objects.
	 * @exports Object
	 */
	return {


		/**
		 * @property {boolean} drawBorders - If specified, a border will be
		 * drawn around the canvas element.
		 */
		set drawBorders(value) { debugBorders = value; },
		get drawBorders() { return debugBorders; },


		/**
		 * Creates a new plot on the canvas with the given settings and name.
		 * @param  {Object} settings - An object containing all of the settings
		 * that the plot can have. For further information, see {@link
		 * #module_Plot.settings}
		 * 
		 * @param  {string} name - the name that we want to give the plot.
		 * 
		 * @return {number} - the index location of the plot in the plots array.
		 */
		newPlot: function(settings, name)
		{
			var plot = new Plot(settings, ctx);
			plots.push(plot);
			
			if (typeof name !== "undefined")
				plotNames[name] = plots.length - 1;
			
			refitCanvas();
			drawPlot(plot);
			
			return plots.length - 1;
		},


		/**
		 * Clear and reset the current plot.
		 * @param  {boolean} [unclip=false] - if specified, the clipping mask
		 * will be removed, clearing anything outside the bounds of the graph
		 */
		clearPlot: function(unclip)
		{
			unclip = typeof unclip !== "undefined" ? unclip : false;
			
			if (currentPlot == undefined) {
				return;
			}

			if (clipped && unclip) {
				ctx.restore();
			}
			
			drawPlot(currentPlot);
			if (clipped)
			{
				ctx.save();
				ctx.rect(currentPlot.settings.offset.x + 1, currentPlot.settings.offset.y, currentPlot.settings.plotSize.x - 1, currentPlot.settings.plotSize.y - 1);
				ctx.clip();
			}
		},


		/**
		 * Edit the settings of the plot, changing the way it is displayed. The
		 * function goes through several steps: 
		 * 		1. Selects the appropriate plot from the plots array. 
		 * 		2. If specified, redraw the canvas 
		 * 		3. updates the plot with new settings 
		 * 		4. if specified, recalculate the labels of the plot 
		 * 		5. draw the plot with these settings 
		 * 		6. If clipped, specify the new clipping region.
		 * 		
		 * @param  {number|string} plot - the name or id of the plot to edit.
		 * 
		 * @param  {object} settings - an object that contains the settings of
		 * the plot that we want to change. These values will overwrite the
		 * plot's current settings values. For further information, see
		 * {@link #module_Plot.settings}
		 * 
		 * @param  {boolean} [reCalcLabels=false] - if true, the plot will
		 * recalculate the location and size of it's labels.
		 * 
		 * @param  {boolean} [redrawCanvas=false] - if true, the plot will
		 * redraw the entire canvas before redrawing the plot.
		 */
		editPlot: function(plot, settings, reCalcLabels, redrawCanvas)
		{
			if (typeof plot === "number" && (plot < 0 || plot > plots.length - 1)) {
				return;
			}
			
			/*
			 * This block of code determines whether or not the current plot
			 * given is an id or a string and then selects the appropriate plot
			 * from list.
			 */
			plot = (typeof plot === "number" ?
				plots[plot] :
				((typeof plot === "string" ||
					plot instanceof String ||
					plot.constructor == String ||
					Object.prototype.toString.call(plot) == "[object String]") ?
					plots[plotNames[plot]] :
					plot));
			
			redrawCanvas = typeof redrawCanvas !== "undefined" ? redrawCanvas : false;
			reCalcLabels = typeof reCalcLabels !== "undefined" ? reCalcLabels : false;
			
			if (plot == undefined) {
				return;
			}
			
			if (clipped) {
				ctx.restore();
			}
			
			if (redrawCanvas)
			{
				ctx.clearRect(0,0, canvas.width, canvas.height);
				ctx.strokeStyle = "#0000FF";
				ctx.lineWidth = 2;
				ctx.strokeRect(0, 0, canvas.width, canvas.height);
			}
			
			for (var key in settings) {
				if (plot.settings.hasOwnProperty(key)) {
					plot.settings[key] = settings[key];
				}
			}
			
			if (reCalcLabels) {
				plot.reCalculateLabels();
			}
			
			drawPlot(plot);
			
			if (clipped)
			{
				ctx.save();
				ctx.rect(currentPlot.settings.offset.x + 1, currentPlot.settings.offset.y, currentPlot.settings.plotSize.x - 1, currentPlot.settings.plotSize.y - 1);
				ctx.clip();
			}
		},


		/**
		 * Given a plot, find it in the plots array and set it as the current
		 * plot.
		 * @alias module: Plotter.selectPlot
		 * 
		 * @param  {string|number} plot - The name or ID of the plot we want to
		 * select
		 * 
		 * @param  {boolean} [clear=true] - states whether or not we want to
		 * clear the plot after selecting it.
		 * 
		 * @param  {boolean} [clip=true] - states whether or not to clip the
		 * plot. If true, all drawing will be clipped to the bounds of the plot.
		 */
		selectPlot: function(plot, clear, clip)
		{
			if (typeof plot === "number" && (plot < 0 || plot > plots.length - 1)) {
				throw new Error("Plot ID does not exist");
			}
			
			clear = typeof clear !== "undefined" ? clear : true;
			clip = typeof clip !== "undefined" ? clip : true;

			/*
			 * This block of code determines whether or not the current plot
			 * given is an id or a string and then selects the appropriate plot
			 * from list.
			 */
			plot = (typeof plot === "number" ?
				plots[plot] :
				((typeof plot === "string" ||
					plot instanceof String ||
					plot.constructor == String ||
					Object.prototype.toString.call(plot) == "[object String]") ?
					plots[plotNames[plot]] :
					plot));
			
			if (plot == undefined) {
				return;
			}	
			if (clipped) {
				ctx.restore();
			}
			currentPlot = plot;
			if (clear) {
				drawPlot(currentPlot);
			}
			
			if (clip)
			{
				ctx.save();
				ctx.rect(currentPlot.settings.offset.x + 1, currentPlot.settings.offset.y, currentPlot.settings.plotSize.x - 1, currentPlot.settings.plotSize.y - 1);
				ctx.clip();
				clipped = true;
			}
			else if (clipped) {
				clipped = false;
			}
		},


		/**
		 * @property {CanvasRenderingContext2D} ctx - (readonly) Gets the current
		 * canvas context.
		 */
		get ctx() { 
			return ctx; 
		},


		/**
		 * @property {Object} mouse - (readonly) Gets the mouse settings of the
		 * current plot.
		 */
		get mouse()
		{
			if (currentPlot == undefined)
				return;
			return currentPlot.mouse;
		},


		/**
		 * @property {Object} settings - (readonly) Gets the settings of the
		 * current plot. For further information, see 
		 * {@link #module_Plot.settings}
		 */
		get settings()
		{
			if (currentPlot == undefined) {
				return;
			}
			return currentPlot.settings;
		},


		/** 
		 * Checks to see if a given point is on the plot. If a specific plot is
		 * specified, it will check that one. Otherwise, it will use the current
		 * plot.
		 * @alias module: Plotter.pointOnPlot
		 * @instance
		 * 
		 * @param  {Point} p - A point object. The function checks to see
		 * if this point is in the bounds of the plot.
		 * 
		 * @param  {number=|string=} plot - the plot that the point will be
		 * checked against. If one isn't specified, the current plot will be
		 * checked.
		 * 
		 * @return {boolean} - true if the point is within the bounds of the
		 * plot. False otherwise.
		 */
		pointOnPlot: function(p, plot)
		{
			if (typeof plot === "number" && 
			(plot >= 0 && plot <= plots.length - 1)) {
					plot = plots[plot];
			}
			else if (typeof plot === "string" || 
			plot instanceof String || 
			Object.prototype.toString.call(plot) == "[object String]") {
				plot = plots[plotNames[plot]];
			}
			else if (plot.hasOwnProperty('constructor') && plot.constructor == String) {
				plot = plots[plotNames[plot]];
			}
			else {
				plot = currentPlot;
			}
			
			return pointInBounds(p, plot);
		},


		/**
		 * Given a single point, translate its coordinates from the local
		 * coordinates of the plot to the actual coordinates of the canvas.
		 * @alias module: Plotter.plotToCanvas
		 * @instance
		 * 
		 * @param  {Point} p 	- The point in the local coordinates of the plot.
		 * 
		 * @return {Point}   	- The point translated to the coordinates of the
		 * graph.
		 */
		plotToCanvas: function(p)
		{
			var s = currentPlot.settings;
			var x = (((s.orientation=="c"||s.orientation=="d") ? s.domain.y : 2 * p.x) - p.x - ((s.orientation=="c"||s.orientation=="d") ? 0 : s.domain.x)) * s.pixelPerUnit.x + s.offset.x;
			var y = s.plotSize.y - ((((s.orientation=="b"||s.orientation=="c") ? s.range.y : 2 * p.y) - p.y - ((s.orientation=="b"||s.orientation=="c") ? 0 : s.range.x)) * s.pixelPerUnit.y) + s.offset.y;
			return new Point(x, y);
		},


		/**
		 * Draw a point on the chart. The point is first translated from the
		 * local coordinate point system to the actual canvas coordinates. After
		 * this, it draws a circle to the size specified in radius. If the fill
		 * parameter is specified, it will be filled by the current context
		 * color. Otherwise, it strokes an outline.
		 * @alias module:Plotter.plotPoint
		 * @instance
		 * 
		 * @param  {Point}  		- the point that will be drawn on the plot
		 * 
		 * @param  {number} r    	- the radius of the circle that will be drawn
		 * 
		 * @param  {boolean=} fill 	- says whether or not to fill the circle. If
		 * true, the cirlce will be filled. Otherwise, an outline will be drawn.
		 */
		plotPoint: function(p, r, fill)
		{
			if (currentPlot == undefined) {
				return;
			}
			
			r = typeof r !== "undefined" ? r : 2;
			fill = typeof fill !== "undefined" ? fill : true;
			
			p = this.plotToCanvas(p);

			ctx.beginPath();
				ctx.arc(p.x, p.y, r, 0, 2 * Math.PI);
			if (fill) {
				ctx.fill();
			}
			else
				ctx.stroke();
		},


		/**
		 * Draw a line on the current plot. Given two points, translate their
		 * coordinates from the plot's local coordinates to the actual canvas
		 * coordinates and then draw a line between them.
		 * @alias module:Plotter.plotLine
		 * @instance
		 * 
		 * @param  {Point} p1 - The first point
		 * 
		 * @param  {Point} p2 - The second point, a line is drawn from the first
		 * point to the second point
		 */
		plotLine: function(p1, p2)
		{
			if (currentPlot == undefined) {
				return;
			}
			
			p1 = this.plotToCanvas(p1);
			p2 = this.plotToCanvas(p2);

			ctx.lineCap = "round";
			ctx.beginPath();
				ctx.moveTo(p1.x, p1.y);
				ctx.lineTo(p2.x, p2.y);
			ctx.stroke();
		},


		/**
		 * This function draws a line on the current plot. Given a single point
		 * and the slope of the line, generate the line and draw it on the
		 * graph.
		 * @alias module:Plotter.plotSlope
		 * @instance
		 * 
		 * @param  {Point}	p     	- a single point on the line.
		 * 
		 * @param  {number}	slope 	- the slope of the line
		 * 
		 * @return {Line} - A Line object based on the calculations that were
		 * made
		 */
		plotSlope: function(p, slope)
		{
			if (currentPlot == undefined)
				return;
			
			// follow the slope of the line to the leftmost edge of the plot
			var p1 = new Point(currentPlot.settings.domain.x, p.y - slope * (p.x - currentPlot.settings.domain.x));
			if (!pointInBounds(p1, currentPlot))
			{
				p1.y = p1.y < currentPlot.settings.range.x ? currentPlot.settings.range.x : currentPlot.settings.range.y;
				p1.x = p.x - (p.y - p1.y)/slope;
			}

			// follow the slope of the line to the rightmost edge of the plot
			var p2 = new Point(currentPlot.settings.domain.y, p.y - slope * (p.x - currentPlot.settings.domain.y));
			if (!pointInBounds(p2, currentPlot))
			{
				p2.y = p2.y < currentPlot.settings.range.x ? currentPlot.settings.range.x : currentPlot.settings.range.y;
				p2.x = p.x - (p.y - p2.y)/slope;
			}

			// plot the line and return it
			this.plotLine(p1, p2);
			return new Line(p1, p2, slope, new Point(p.x, p.y));
		},


		/**
		 * Take an array of vertices and add them to the plot sequentially.
		 * When all of them have been added, draw them on the canvas.
		 * @alias module:Plotter.plotPoly
		 * @instance
		 * 
		 * @param  {Array.<Point>} points - an array that contains all of the 
		 * vertices of the polygon. They will be plotted in the order they are
		 * listed in the array.
		 * 
		 * @param  {boolean} closed - a boolean value that specifies whether 
		 * the vertices should be connected when the plot is rendered. By
		 * default, the vertices will not be rendered.
		 */
		plotPoly: function(points, closed)
		{
			var length = Object.keys(points).length;
			var p;
			if (currentPlot == undefined || length < 2) {
				return;
			}
			
			closed = typeof closed !== "undefined" ? closed : false;
			
			if (typeof points == "undefined") {
				return;
			}
			
			ctx.lineCap = "round";
			ctx.beginPath();
				for (var i = 0; i < length - 1; i++)
				{
					p = this.plotToCanvas(points[i]);
					if (i != 0)
						ctx.lineTo(p.x, p.y);
					else
						ctx.moveTo(p.x, p.y);
				}
				if (closed)
				{
					p = this.plotToCanvas(points[0]);
					ctx.lineTo(p.x, p.y);
				}
			ctx.stroke();
		},


		/**
		 * Given a mathematical callback function, render it on a plot. This
		 * function iterates from the start value to the end value. At each
		 * point, it calls the callback function, passing the current value
		 * iteration as a parameter. It records the output and uses that to
		 * generate a Point object. The Point is then added to the canvas
		 * context's path. When it has reached the end, it calls the canvas
		 * context's stroke method to draw it.
		 * @alias module:Plotter.plotFunction
		 * @instance
		 * 
		 * @param  {Function} func - the function we want to plot on the graph.
		 * It takes a numeric value as a parameter and returns a numeric value.
		 * 
		 * @param  {boolean=} xFunc - this specifies whether the function is to
		 * be graphed along the x-axis or the y-axis. It's default value is
		 * true.
		 * 
		 * @param  {number=} step - the value to increment by when calculating
		 * function points. By default, it will increment by 1.
		 * 
		 * @param  {number=} start - this is the value that the function will
		 * start calculating values at. By default, it will use the start value
		 * of the plot's domain (if an xFunc) or range (if not an xFunc)
		 * 
		 * @param  {number=} end - this is the value that the function will stop
		 * calculating values at. By default, it will use the end value of the
		 * plot's domain (if an xFunc) or range (if not an xFunc)
		 */
		plotFunction: function(func, xFunc, step, start, end)
		{
			if (currentPlot == undefined) {
				return;
			}

			xFunc = typeof xFunc !== "undefined" ? xFunc : true;
			step = typeof step !== "undefined" ? step : 1;
			start = typeof start !== "undefined" ? start : (xFunc ? currentPlot.settings.domain.x : currentPlot.settings.range.x);
			end = typeof end !== "undefined" ? end : (xFunc ? currentPlot.settings.domain.y : currentPlot.settings.range.y);

			var i = start, funcValue;

			ctx.lineCap = "round";
			ctx.beginPath();

				/*
				 * This loops iterates, adding the amount specified by timestep
				 * value to the count each time. At each time. If the value exists,
				 * it draws a line to the new location. It does this until the value
				 * of the count is greater than or equal to the end value.
				 */
				while (i < end)
				{
					funcValue = func(i);
					if (typeof funcValue !== "undefined") {
						var p = new Point(xFunc?i:funcValue, xFunc?funcValue:i);
						p = this.plotToCanvas(p);		
						if (i != start) {
							ctx.lineTo(p.x, p.y);
						}
						else {
							ctx.moveTo(p.x, p.y);
						}
					}
					i+= step;
					if (i > end) {
						i = end;
					}
				}

				/*
				 * an edge case. In the event that start is greater than or
				 * equal to end, plot that point
				 */
				if (typeof funcValue !== "undefined") {
					//points.push(new Point(xFunc?i:funcValue, xFunc?funcValue:i));
				}

			ctx.stroke();
		},


		/** 
		 * If a plot is currently specified, draw the text at the specified
		 * point on the plot.
		 * 
		 * @param  {string} text  - The text the user wants to write on the canvas
		 * 
		 * @param  {Point} point  - The point, in the plot's local coordinate
		 * system, that the text will be rendered at.
		 */
		plotText: function(text, point)
		{
			if (currentPlot == undefined)
				return;
			point = typeof point !== "undefined" ? point : new Point(currentPlot.settings.domain.x + (currentPlot.settings.domain.y - currentPlot.settings.domain.x) * 0.5, currentPlot.settings.range.x + (currentPlot.settings.range.y - currentPlot.settings.range.x) * 0.5);
			point = this.plotToCanvas(point);
			ctx.fillText(text, point.x, point.y);
		},


		/**
		 * Print the plot data of the pointObject as CSV. The function accepts
		 * a PointObject, retrives its points and parses the specified fields
		 * as a CSV file. If no fields are specified, the function will print
		 * all of them.
		 *
		 * @param  {PointObject} pointObject - the object from which plotter
		 * retrieves the points.
		 * 
		 * @param  {Array=} fields - an array of the fields to display
		 */
		printPlotData: function(pointObject, fields) {
			var csv = "";
			var points = pointObject.getPoints();
			var header = fields ? fields : Object.keys(points[0]);
			
			var point = {};
			for (var curPoint = 0; curPoint < points.length; curPoint++) {
				point = points[curPoint];
				if (curPoint === 0) {	
					for(var curHeader = 0; curHeader < header.length; curHeader++) {
						if (curHeader > 0) {
							csv += ",";
						}
						csv += header[curHeader];
					}
					csv += "\n";
				}
				for (var j = 0; j < header.length; j++) {
					if (j > 0) {
						csv += ",";
					}
					csv += point[header[j]];
				}
				csv += "\n";
			}
			window.open("data:text/csv;charset=utf-8," + encodeURIComponent(csv));
		}
	}
}

module.exports = createPlotter;