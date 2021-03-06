function Plot()
{
	var ctx = arguments[1];							// the context in which the 
	var settings = arguments[0];
	
	var offsetVar = new Point(0, 0);
	var domainVar = new Point(-10, 10);
	var rangeVar = new Point(-10, 10);
	var plotSizeVar = new Point(0, 0);
	var pixelPerUnitVar = new Point(10, 10);
	var unitPerTickVar = new Point(1, 1);
	var labelFrequencyVar = new Point(2, 2);
	var labelSizeVar = new Point(0, 0);
	var labelBleedVar = new Point(0, 0);
	var labelPrecisionVar = new Point(-1, -1);
	
	var self = {
		settings:
		{
			set offset(value) 
			{
				offsetVar.x = value.x;
				offsetVar.y = value.y;
			},
			get offset() { return new Point(offsetVar.x + 75, offsetVar.y + 20); },
			set domain(value)
			{
				domainVar.x = value.x < value.y ? value.x : value.y;
				domainVar.y = value.x < value.y ? value.y : value.x;
				plotSizeVar.x = this.pixelPerUnit.x * (this.domain.y - this.domain.x);
			},
			get domain() { return new Point(domainVar.x, domainVar.y); },
			set range(value)
			{
				rangeVar.x = value.x < value.y ? value.x : value.y;
				rangeVar.y = value.x < value.y ? value.y : value.x;
				plotSizeVar.y = this.pixelPerUnit.y * (this.range.y - this.range.x);
			},
			get range() { return new Point(rangeVar.x, rangeVar.y); },
			set pixelPerUnit(value)
			{
				pixelPerUnitVar.x = value.x != 0 ? value.x : pixelPerUnitVar.x;
				pixelPerUnitVar.y = value.y != 0 ? value.y : pixelPerUnitVar.y;
				plotSizeVar.x = this.pixelPerUnit.x * (this.domain.y - this.domain.x);
				plotSizeVar.y = this.pixelPerUnit.y * (this.range.y - this.range.x);
			},
			get pixelPerUnit() { return new Point(pixelPerUnitVar.x, pixelPerUnitVar.y); },
			get plotSize() { return new Point(plotSizeVar.x, plotSizeVar.y); },
			set unitPerTick(value)
			{
				unitPerTickVar.x = value.x != 0 ? value.x : unitPerTickVar.x;
				unitPerTickVar.y = value.y != 0 ? value.y : unitPerTickVar.y;
			},
			get unitPerTick() { return new Point(unitPerTickVar.x, unitPerTickVar.y); },
			get gridSize()
			{ return new Point(this.unitPerTick.x * this.pixelPerUnit.x, this.unitPerTick.y * this.pixelPerUnit.y); },
			set labelFrequency(value)
			{
				labelFrequencyVar.x = value.x >= 0 ? value.x : 0;
				labelFrequencyVar.y = value.y >= 0 ? value.y : 0;
			},
			get labelFrequency() { return new Point(labelFrequencyVar.x, labelFrequencyVar.y); },
			get labelSize() { return new Point(labelSizeVar.x, labelSizeVar.y); },
			get labelBleed() { return new Point(labelBleedVar.x, labelBleedVar.y); },
			set labelPrecision(value)
			{
				labelPrecisionVar.x = value.x >= 0 ? Math.min(20, Math.max(0, value.x)) : -1;
				labelPrecisionVar.y = value.y >= 0 ? Math.min(20, Math.max(0, value.y)) : -1;
			},
			get labelPrecision() { return new Point(labelPrecisionVar.x, labelPrecisionVar.y); },
			xAxis: "xAxis",
			yAxis: "yAxis",
			zeroBoundAxis: true,
			drawGrid: true,
			drawCoords: false,
			orientation: "a"
		},
		mouse:
		{
			down: new Point(),
			move: new Point(),
			up: new Point(),
			isDown: false,
			isUp: true
		},
		reCalculateLabels: function() { calculateLabelSize(); calculateLabelBleed(); }
	}
	
	for (var key in settings)
		if (self.settings.hasOwnProperty(key))
			self.settings[key] = settings[key];
	
	plotSizeVar.x = self.settings.pixelPerUnit.x * (self.settings.domain.y - self.settings.domain.x);
	plotSizeVar.y = self.settings.pixelPerUnit.y * (self.settings.range.y - self.settings.range.x);
	
	calculateLabelSize();
	calculateLabelBleed();
	
	function calculateLabelSize()
	{
		var x = 0;
		var y = 0;
		var s = self.settings;
		
		ctx.font = "24px Helvetica";
		var labelPadding = ctx.measureText("M.").width;
		
		if (s.labelFrequency.y != 0)
			x += Math.max(ctx.measureText(s.range.x).width, ctx.measureText(s.range.x + Math.floor(s.plotSize.y / s.gridSize.y) * s.unitPerTick.y).width);
		else
			x += 6;
		if (s.yAxis != "")
			x += labelPadding;
		
		if (s.labelFrequency.x != 0)
			y += labelPadding;
		else
			y += 6;
		if (s.xAxis != "")
			y += labelPadding;
		if (s.yAxis != "")
		{
			ctx.font = "24px Helvetica";
			var yBleed = ctx.measureText(s.yAxis).width * 0.5 - s.plotSize.y * 0.5;
			y = yBleed > y ? yBleed : y;
		}
		
		labelSizeVar.x = x;
		labelSizeVar.y = y;
	}
	
	function calculateLabelBleed()
	{
		var s = self.settings;
		var x = 0;
		var y = s.labelFrequency.y != 0 ? -8 : 0;
		
		ctx.font = "16px Helvetica";
		
		if (s.labelFrequency.x != 0)
			x =  Math.max(s.offset.x + Math.floor(s.plotSize.x / s.gridSize.x) * s.gridSize.x + ctx.measureText(s.domain.x + Math.floor(s.plotSize.x / s.gridSize.x) * s.unitPerTick.x).width * 0.5 - (s.offset.x + s.plotSize.x), 0);
		
		ctx.font = "24px Helvetica";
		
		if (x.xAxis != "")
		{
			var axisBleed = Math.max(((s.domain.y - s.domain.x) * s.pixelPerUnit.x * 0.5 + ctx.measureText(s.xAxis).width * 0.5) - ((s.domain.y - s.domain.x) * s.pixelPerUnit.x), 0);
			x = x > axisBleed ? x : axisBleed;
		}
		
		if (s.yAxis != "")
		{
			var yLabelBleed = s.plotSize.y * 0.5 - ctx.measureText(s.yAxis).width * 0.5;
			y = yLabelBleed < y ? yLabelBleed : y;
		}
		
		labelBleedVar.x = x;
		labelBleedVar.y = y;
	}
	
	return self;
}