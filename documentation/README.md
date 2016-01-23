## Modules

<dl>
<dt><a href="#module_Line">Line</a></dt>
<dd><p>A generic object for holding a line.</p>
</dd>
<dt><a href="#module_Plot">Plot</a></dt>
<dd><p>Plots are what Points (and objects that consist of Points) are rendered on.
Plots describe the context in which Points are drawn, holding information
such as labels and a local coordinate system. Plotter uses this information
when plotting points and other objects.</p>
</dd>
<dt><a href="#module_Plotter">Plotter</a></dt>
<dd><p>Creates a Plotter object. Given a HTML Canvas Element, this function creates
a series of functions for interacting with it. It also attaches some of
these functions to event listeners for mouse and touch events.</p>
</dd>
<dt><a href="#module_Point">Point</a></dt>
<dd><p>A generic object for holding a point</p>
</dd>
</dl>

<a name="module_Line"></a>
## Line
A generic object for holding a line.


| Param | Type | Description |
| --- | --- | --- |
| pa | <code>Point</code> | the first point on the line (used for calculating a line based on two points) |
| pb | <code>Point</code> | the second point on the line (used for calculating a line based on two points) |
| s | <code>number</code> | the slope of the line (used for calculating a line based on point-slope) |
| p | <code>Point</code> | the point on the line (used for calculating a line based on point-slope) |

<a name="module_Plot"></a>
## Plot
Plots are what Points (and objects that consist of Points) are rendered on.
Plots describe the context in which Points are drawn, holding information
such as labels and a local coordinate system. Plotter uses this information
when plotting points and other objects.


* [Plot](#module_Plot)
    * [.settings](#module_Plot.settings) : <code>Object</code>
    * [.mouse](#module_Plot.mouse) : <code>Object</code>
    * [.recalculateLabels()](#module_Plot.recalculateLabels)

<a name="module_Plot.settings"></a>
### Plot.settings : <code>Object</code>
A collection of settings that are used to affect the appearance of
the plot.

**Kind**: static property of <code>[Plot](#module_Plot)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| settings.offset | <code>Point</code> | by default, a graph is rendered in the upper left corner of the canvas. This allows you to reposition the plot relative to this point. |
| settings.domain | <code>Point</code> | the points along the x-axis that the plot will display |
| settings.range | <code>Point</code> | the points along the y-axis that the plot will display |
| settins.pixelPerUnit | <code>Point</code> | The number of pixels that each unit of the plot will take up |
| settings.plotSize | <code>Point</code> | (readonly) The size of the plot in pixels. This value is calculated by multiplying the pixels per unit by the number of units in the graph (domain end - domain start and range end - range start) |
| settings.unitPerTick | <code>Point</code> | A tick is wherever a line is drawn on the plot. This controls how many units must pass before a tick is drawn |
| settings.gridSize | <code>Point</code> | (readonly) The size of each block of ticks on the plot. Calculated by multiplying the pixelPerUnit by the unitPerTick |
| settings.labelFrequency | <code>Point</code> | This is the rate at which labels are drawn on the ticks. It will default to a label for every tick |
| settings.labelSize | <code>Point</code> | (readonly) The size of the label, where x is width and y is height, as calculated by calculateLabelSize() |
| settings.labelBleed | <code>Point</code> | (readonly) |
| settings.labelPrecision | <code>Point</code> | This is a point that determines how many decimals trail after the "." character. Values less than 0 disable this feature. |
| settings.xAxis | <code>string</code> | the label for the x axis |
| settings.yAxis | <code>string</code> | the label for the y axis |
| settings.zeroBoundAxis | <code>boolean</code> | determines whether a thick black line is drawn around the 0 axis. If false, the thick black line will be drawn around the edges of the graph. |
| settings.drawGrid | <code>boolean</code> | determines whether the |
| settings.drawCoords | <code>boolean</code> | If true, the mouse coordinates will be rendered. CURRENTLY NOT WORKING. |
| settings.orientation | <code>string</code> | determines where the origin of the graph is rendered. It starts at the bottom left and goes counterclockwise. "a" is the bottom left, "b" is the top left, "c" is the top right, "d" is the bottom right. |

<a name="module_Plot.mouse"></a>
### Plot.mouse : <code>Object</code>
a collection of settings related to the mouse in relation to the
plot.

**Kind**: static property of <code>[Plot](#module_Plot)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| mouse | <code>object</code> | a collection of settings related to the mouse in relation to the plot. |
| mouse.down | <code>Point</code> | The point in the plot's local coordinates where the mouse was last down. |
| mouse.move | <code>Point</code> | The point in the plot's local coordinates where the mouse has moved to |
| mouse.up | <code>Point</code> | The point in the plot's local coordinates where the mouse was last down. |
| mouse.isDown | <code>Point</code> | The point in the plot's local coordinates where the mouse was last down. |
| mouse.isUp | <code>Point</code> | The point in the plot's local coordinates where the mouse was last down. |

<a name="module_Plot.recalculateLabels"></a>
### Plot.recalculateLabels()
Recalculate the size of the labels and the label bleed.

**Kind**: static method of <code>[Plot](#module_Plot)</code>  
<a name="module_Plotter"></a>
## Plotter
Creates a Plotter object. Given a HTML Canvas Element, this function creates
a series of functions for interacting with it. It also attaches some of
these functions to event listeners for mouse and touch events.


| Param | Type | Description |
| --- | --- | --- |
| canvas | <code>HTMLCanvasElement</code> | The Canvas element that plots will be drawn on. |
| padding | <code>Point</code> | a Point that describs how much padding to apply to the canvas element before rendering elements. |


* [Plotter](#module_Plotter)
    * [~plotPoly(points, closed)](#module_Plotter..plotPoly)
    * [~plotFunction(func, [xFunc], [step], [start], [end])](#module_Plotter..plotFunction)
    * [~plotText(text, point)](#module_Plotter..plotText)
    * [~printPlotData(pointObject, [fields])](#module_Plotter..printPlotData)

<a name="module_Plotter..plotPoly"></a>
### Plotter~plotPoly(points, closed)
Take an array of vertices and add them to the plot sequentially.
When all of them have been added, draw them on the canvas.

**Kind**: inner method of <code>[Plotter](#module_Plotter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| points | <code>Array.&lt;Point&gt;</code> | an array that contains all of the  vertices of the polygon. They will be plotted in the order they are listed in the array. |
| closed | <code>boolean</code> | a boolean value that specifies whether  the vertices should be connected when the plot is rendered. By default, the vertices will not be rendered. |

<a name="module_Plotter..plotFunction"></a>
### Plotter~plotFunction(func, [xFunc], [step], [start], [end])
Given a mathematical function, render it on a plot. This function
iterates from the start value to the end value. At each point, it
calculates the point at that value using the given function.

**Kind**: inner method of <code>[Plotter](#module_Plotter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| func | <code>function</code> | the function we want to plot on the graph. It takes a numeric value as a parameter and returns a numeric value. |
| [xFunc] | <code>boolean</code> | this specifies whether the function is to be graphed along the x-axis or the y-axis. It's default value is true. |
| [step] | <code>number</code> | the value to increment by when calculating function points. By default, it will increment by 1. |
| [start] | <code>number</code> | this is the value that the function will start calculating values at. By default, it will use the start value of the plot's domain (if an xFunc) or range (if not an xFunc) |
| [end] | <code>number</code> | this is the value that the function will stop calculating values at. By default, it will use the end value of the plot's domain (if an xFunc) or range (if not an xFunc) |

<a name="module_Plotter..plotText"></a>
### Plotter~plotText(text, point)
If a plot is currently specified, draw the text at the specified
point on the plot.

**Kind**: inner method of <code>[Plotter](#module_Plotter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | The text the user wants to write on the canvas |
| point | <code>Point</code> | The point, in the plot's local coordinate system, that the text will be rendered at. |

<a name="module_Plotter..printPlotData"></a>
### Plotter~printPlotData(pointObject, [fields])
Print the plot data of the pointObject as CSV. The function accepts
a PointObject, retrives its points and parses the specified fields
as a CSV file. If no fields are specified, the function will print
all of them.

**Kind**: inner method of <code>[Plotter](#module_Plotter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| pointObject | <code>PointObject</code> | the object from which plotter retrieves the points. |
| [fields] | <code>Array</code> | an array of the fields to display |

<a name="module_Point"></a>
## Point
A generic object for holding a point


| Param | Type | Description |
| --- | --- | --- |
| px | <code>number</code> | the x coordinate of the point |
| py | <code>number</code> | the y coordinate of the point |

