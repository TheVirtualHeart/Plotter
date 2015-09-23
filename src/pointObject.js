
/**
 * An object that emits a collection of points. Can be expanded upon
 * to include points, lines, polygons, functions, etc.
 * @return {[type]} [description]
 */
function PointObject(settings) {

	this.fillColor = settings.fillColor;
	this.strokeColor = settings.strokeColor;
	this.strokeWeight = settings.strokeWeight;
	this.radius = settings.radius;

	this.closed = settings.closed;
	this.points = [];
	
	this.addPoint = function(p) {
		this.points.push(p);
	}
}