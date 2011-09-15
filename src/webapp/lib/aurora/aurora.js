/*Object.keys = Object.keys || (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
        DontEnums = [ 
            'toString', 'toLocaleString', 'valueOf', 'hasOwnProperty',
            'isPrototypeOf', 'propertyIsEnumerable', 'constructor'
        ],
        DontEnumsLength = DontEnums.length;

    return function (o) {
        if (typeof o != "object" && typeof o != "function" || o === null)
            throw new TypeError("Object.keys called on a non-object");

        var result = [];
        for (var name in o) {
            if (hasOwnProperty.call(o, name))
                result.push(name);
        }

        if (hasDontEnumBug) {
            for (var i = 0; i < DontEnumsLength; i++) {
                if (hasOwnProperty.call(o, DontEnums[i]))
                    result.push(DontEnums[i]);
            }   
        }

        return result;
    };
})();*/
Array.prototype.max = Array.prototype.max || function (){
	var max = this[0];
	var len = this.length;
	var i;
	for (i = 1; i < len; i++){
		if (this[i] > max){
			max = this[i];
		}
	}
	return max;
};
/**
 * @author Aditya Gaur The top-level aurora namespace. All public methods and
 *         fields should be registered on this object.
 * @namespace The top-level aurora namespace, <tt>AR</tt>.
 */
var AR = {};
/**
 * @author Aditya Gaur Returns a prototype object suitable for extending the
 *         given class <tt>f</tt>. For more details, see Douglas Crockford's
 *         essay on prototypal inheritance.
 * @param {function}
 *            f a constructor.
 * @returns a suitable prototype object.
 * @see Douglas Crockford's essay on <a
 *      href="http://javascript.crockford.com/prototypal.html">prototypal
 *      inheritance</a>.
 */
AR.extend = function (f) {
	function g () {
	}
	g.prototype = f.prototype || f;
	return new g();
};
/**
 * @author Aditya Gaur Adds the javascript file specified by the <tt>jsPath</tt>,
 *         at the position <tt>pos</tt>.
 * @param {string}
 *            [jsPath] the path of the JS file to be included.
 * @param {string}
 *            [pos](optional)the dom element in which the script tag to include
 *            js file will appear. If unspecified the js file will be included
 *            in head.
 */
AR.addJavascript = function (jsPath, pos, dataPath, callback) {
	var position = pos || "head";
	var posElem = document.getElementsByTagName(position)[0];
	var scriptTag = document.createElement('script');
	scriptTag.setAttribute('type', 'text/javascript');
	scriptTag.setAttribute('src', jsPath);
	if (dataPath) {
		scriptTag.setAttribute('data-path', dataPath);
	}
	posElem.appendChild(scriptTag);
	return scriptTag;
};
/**
 * @author Aditya Gaur Adds the CSS file specified by the <tt>cssPath</tt>,
 *         at the position <tt>pos</tt>.
 * @param {string}
 *            [cssPath] the path of the CSS file to be included.
 * @param {string}
 *            [pos](optional)the dom element in which the link tag to include
 *            css file will appear. If unspecified the css file will be included
 *            in head.
 */
AR.addCSS = function (cssPath, pos) {
	var position = pos || "head";
	var posElem = document.getElementsByTagName(position)[0];
	var cssTag = document.createElement('link');
	cssTag.setAttribute('type', 'text/css');
	cssTag.setAttribute('href', cssPath);
	cssTag.setAttribute('rel', 'stylesheet');
	posElem.appendChild(cssTag);
};
AR.Utility = {};
/**
 * @author Aditya Gaur Finds the maximum value in the data sent for the graph
 *         creation.
 * @param {object}
 *            [graphDef] An object containing the graph properties and the data
 */
AR.Utility.scale = {
	"linear" : "linear",
	"ordinal" : "ordinal",
	"log" : "log"
};
AR.Utility.findMax = function (data) {
	var max = data[0].value;
	data.forEach(function (data) {
		if (parseInt(data.value, 10) > max) {
			max = parseInt(data.value, 10);
		}
	});
	return max;
};

AR.Utility.getDataArray = function (data) {
	var noOfRecords = data.length;
	var arr = [], i;
	for (i = 0; i < noOfRecords; i = i + 1) {
		arr.push(data[i].value);
	}
	return arr;
};
AR.Utility.Dimension = {
	x : "x",
	y : "y",
	z : "z"
};
AR.Utility.getSingleDimensionData = function(data, dimension){
	var noOfRecords = data.length;
	var arr = [];
	for(i = 0; i < noOfRecords; i = i + 1){
		arr.push(data[i][dimension]);
	}
	return arr;
};
AR.Utility.getMultiDimensionData = function (data){
	var noOfRecords = data.length;
	var arr = [],innerArr = [], i;
	for(i = 0; i < noOfRecords; i = i + 1){
		innerArr = [];
		innerArr.push(data[i].x);
		innerArr.push(data[i].y);
		innerArr.push(data[i].z);
		arr.push(innerArr);
	}
	return arr;
};
AR.Utility.getToolTipText = function (data, index) {
	return (data[index].toolTipText ? data[index].toolTipText : data[index].value);
};

// TODO create your own palette
AR.Utility.setPalette = function (element, paletteCode) {
	var paletteCodeMap = {
	"1" : "category10",
	"2" : "category19",
	"3" : "category20"
	};
	palette = paletteCodeMap[paletteCode];
	var colors = pv.Colors[palette]().range();
	element.fillStyle(function () {
		return colors[this.index % colors.length];
	});
};
// NOTE taking conventions that any variable prepended by __ is private and any
// variable prepended by _ acts as protected
/**
 * @author Aditya Gaur Base function for creating the Bars for the graph.
 */
// TODO instead of graphDef have the current graph Dimension
AR.Bar = function (graphDef, data, parentDimension, panel) {
	var self = this;
	this._bar = panel.add(pv.Bar);
	this._parentDimension = parentDimension;
	this._noOfRecords = data.length;
	if(graphDef.dataset){
		this.__noOfRecords = graphDef.dataset.length* data.length;
	}
	
	this._bar.data(AR.Utility.getDataArray(data));
	this._bar.title(function () {
		return AR.Utility.getToolTipText(data, this.index);
	});
	if (graphDef.toolTip && graphDef.toolTip === 1) {
		this._bar.event("mouseover", pv.Behavior.tipsy({
		gravity : function () {
			return (self instanceof AR.HBar ? "w" : "s");
		},
		fade : true
		}));
	} else {
		this._bar.anchor(self instanceof AR.HBar ? "right" : "top").add(pv.Label).text(function () {
			return data[this.index].value;
		}).textBaseline(self instanceof AR.HBar ? "left" : "bottom");
	}
	if (graphDef.palette) {
		AR.Utility.setPalette(self._bar, graphDef.palette);
	}
};
// TODO make a functionFactory class which makes setter functions
AR.Bar.prototype.properties = ["fillStyle", "strokeStyle"];
/**
 * @author Aditya Gaur Constructs a horizontal bars for the graph
 * @param {object}
 *            [graphDef] An object containing the graph properties and the data
 * @param {object}
 *            [panel] A protovis panel object in which the bar graph will be
 *            displayed
 * @extends AR.Bar
 */
AR.HBar = function (graphDef, data, parentDimension, panel) {
	var self = this;
	AR.Bar.apply(self, [graphDef, data, parentDimension, panel]);
	var adjustWidth = function (parentDimension) {
		var barWidth = pv.Scale.linear(0, AR.Utility.findMax(data)).range(0, parentDimension.width - 40);
		self._bar.width(function (d) {
			return barWidth(d);
		});
	};
	var adjustHeight = function (parentDimension) {
		self._bar.height((parentDimension.height - 30) / (2 * self._noOfRecords));
	};
	var adjustBottom = function (parentDimension) {
		self._bar.bottom(function () {
			return (this.index * (parentDimension.height - 30) / (self._noOfRecords)) + 30;
		});
	};
	var adjustLeft = function (parentDimension) {
		self._bar.left(0);
	};
	self.adjustLabel = function (parentDimension) {
		self._bar.anchor("left").add(pv.Label).textBaseline("right").text(function () {
			return data[this.index].label;
		}).textAngle(-Math.PI / 4).textAlign("right");
	};
	// TODO define a layout designer which does the following
	self.adjustPosition = function (parentDimension) {
		adjustHeight(parentDimension);
		adjustWidth(parentDimension);
		adjustLeft(parentDimension);
		adjustBottom(parentDimension);
	};
	self.adjustPosition(self._parentDimension);
	self.adjustLabel(self._parentDimension);
};
AR.HBar.prototype = AR.extend(AR.Bar);
/**
 * @author Aditya Gaur Constructs a vertical bars for the graph
 * @param {object}
 *            [graphDef] An object containing the graph properties and the data
 * @param {object}
 *            [panel] A protovis panel object in which the bar graph will be
 *            displayed
 * @extends AR.Bar
 */
AR.VBar = function (graphDef, data, parentDimension, panel) {
	var self = this;
	AR.Bar.apply(self, [graphDef, data, parentDimension, panel]);
	var adjustHeight = function (parentDimension) {
		var barHeight = pv.Scale.linear(0, AR.Utility.findMax(graphDef.data)).range(0, parentDimension.height - 40);
		self._bar.height(function (d) {
			return barHeight(d);
		});
	};
	var adjustWidth = function (parentDimension) {
		self._bar.width((parentDimension.width - 30) / (2 * self._noOfRecords));
	};
	var adjustLeft = function (parentDimension) {
		self._bar.left(function () {
			return (this.index * (parentDimension.width - 30) / (self._noOfRecords)) + 30;
		});
	};
	var adjustBottom = function (parentDimension) {
		self._bar.bottom(0);
	};
	self.adjustLabel = function (parentDimension) {
		self._bar.anchor("bottom").add(pv.Label).textBaseline("top").text(function () {
			return graphDef.data[this.index].label;
		}).textAngle(-Math.PI / 4).textAlign("right");
	};
	// TODO define a layout designer which does the following
	self.adjustPosition = function (parentDimension) {
		adjustHeight(parentDimension);
		adjustWidth(parentDimension);
		adjustLeft(parentDimension);
		adjustBottom(parentDimension);
	};
	self.adjustPosition(self._parentDimension);
	self.adjustLabel(self._parentDimension);
};
AR.VBar.prototype = AR.extend(AR.Bar);
AR.Graph = function (graphDef) {
	var self = this;
	self.__graphDef = graphDef;
	self._pos = undefined;
	self._dimension = {
	height : 400,
	width : 400,
	left : 40,
	right : 20,
	bottom : 60,
	top : 20
	};
	self.__captionLabel = undefined;
	self.__xAxisName = undefined;
	self.__yAxisName = undefined;
	self._horRules = undefined;
	self._verticalRules = undefined;
	self._panel = new pv.Panel();
	self._panel.left(self._dimension.left).right(self._dimension.right).bottom(self._dimension.bottom).top(self._dimension.top).strokeStyle("black");
	self._xAxis = self._panel.add(pv.Rule).bottom(0);
	self._yAxis = self._panel.add(pv.Rule).left(0);
	this.properties.forEach(function (property) {
		var upcasedProp = property.substring(0, 1).toUpperCase() + property.substring(1);
		if (graphDef[property]) {
			self["set" + upcasedProp](graphDef[property]);
		}
	});
};
AR.Graph.prototype.properties = ["width", "height", "caption", "xAxisName", "yAxisName", "borderColor", "fillColor"];
AR.Graph.prototype.setCaption = function (newVal) {
	var self = this;
	if (self.__captionLabel) {
		self.__captionLabel.text(newVal);
	} else {
		self.__captionLabel = self._panel.add(pv.Label).text(newVal).left(self._dimension.width / 2).top(0).textAlign("center");
	}
};
AR.Graph.prototype.setWidth = function (width) {
	var self = this;
	self._dimension.width = width;
	self._panel.width(self._dimension.width);
	if (self.__captionLabel) {
		self.__captionLabel.left(self._dimension.width / 2);
	}
};
AR.Graph.prototype.setHeight = function (height) {
	var self = this;
	self._dimension.height = height;
	self._panel.height(self._dimension.height);
};
AR.Graph.prototype.setXAxisName = function (name) {
	var self = this;
	if (self.__xAxisName) {
		self.__xAxisName.text(name);
	} else {
		self.__xAxisName = self._panel.add(pv.Label).bottom(-40).text(name).textAlign("center");
	}
};
AR.Graph.prototype.setYAxisName = function (name) {
	var self = this;
	if (self.__yAxisName) {
		self.__xAxisName.text(name);
	} else {
		self.__yAxisName = self._panel.add(pv.Label).left(-30).text(name).textAlign("center").textAngle(-Math.PI / 2);
	}
};
AR.Graph.prototype.setHorRules = function (maxValue, scaleType) {
	var self = this;
	var y;
	if (!self._horRules) {
		y = pv.Scale[scaleType](0, maxValue).range(0, self._dimension.height - 40);
		self._horRules = self._panel.add(pv.Rule);
		self._horRules.data(y.ticks()).bottom(y).strokeStyle(function (d) {
			return (d ? "#eee" : "#000");
		}).anchor("left").add(pv.Label).text(y.tickFormat);
	} else {
		y = pv.Scale.linear(0, maxValue).range(0, self._dimension.height - 40);
		self._horRules.bottom(y);
	}
};
AR.Graph.prototype.setVerticalRules = function (maxValue, scaleType) {
	var self = this;
	var x;
	if (!self.__verticalRules) {
		self._verticalRules = self._panel.add(pv.Rule);
		x = pv.Scale[scaleType](0, maxValue).range(0, self._dimension.width - 40);
		self._verticalRules.data(x.ticks()).left(x).strokeStyle(function (d) {
			return (d ? "#eee" : "#000");
		}).anchor("bottom").add(pv.Label).text(x.tickFormat);
	} else {
		x = pv.Scale.linear(0, maxValue).range(0, self._dimension.width - 40);
		self._verticalRules.left(x);
	}
};
AR.Graph.prototype.setBorderColor = function (color){
	var self = this; 
	self._panel.strokeStyle(color);
};
AR.Graph.prototype.setFillColor = function (color){
	var self = this; 
	self._panel.fillStyle(color);
};
AR.Graph.prototype.render = function render (div) {
	var self = this;
	if (div || self.__pos) {
		self._panel.canvas(div || self.__pos);
		self._panel.render();
		self.__pos = div || self.__pos;
	} else {
		self._panel.render();
	}
};
// TODO add the xAxis and yAxis data labels to the axis rather that bars.
AR.BarGraph = function (graphDef) {
	var bar, i, panel;
	var self = this;
	var createBars = {
	"v" : function () {
		bar = new AR.VBar(graphDef, graphDef.data, self._dimension, self._panel);
	},
	"h" : function () {
		if(graphDef.dataset){
			var dataset = graphDef.dataset;
			for(i = 0; i< graphDef.dataset.length; i++){
				 var noOfRecords = dataset.length* dataset[i].data.length;
				 panel = self._panel.add(pv.Panel).bottom(i * (self._dimension.height - 30) / (noOfRecords) );
				 bar = new AR.HBar(graphDef, dataset[i].data, self._dimension, panel);
			}
		}
		else{
			bar = new AR.HBar(graphDef, graphDef.data, self._dimension, self._panel);
		}
	}
	};
	var setRules = {
	"v" : function () {
		self.setHorRules(AR.Utility.findMax(graphDef.data),AR.Utility.scale.linear);
	},
	"h" : function () {
		self.setVerticalRules(AR.Utility.findMax(graphDef.data),AR.Utility.scale.linear);
	}
	};
	AR.Graph.apply(self, [graphDef]);
//	setRules[graphDef.type || "v"]();
	createBars[graphDef.type || "v"]();
	this.setWidth = function (width) {
		AR.Graph.prototype.setWidth.call(self, width);
		bar.adjustPosition(self._dimension);
		setRules[graphDef.type || "v"]();
	};
	this.setHeight = function (height) {
		AR.Graph.prototype.setHeight.call(self, height);
		bar.adjustPosition(self._dimension);
		setRules[graphDef.type || "v"]();
	};
	this.setPalette = function (paletteCode) {
		bar.setPalette(paletteCode);
	};
};
AR.BarGraph.prototype = AR.extend(AR.Graph);
AR.Line = function (data, parentDimension, panel, graphDef) {
	var self = this;
	var noOfRecords = data.length;
	var line = panel.add(pv.Line);
	line.data(AR.Utility.getDataArray(data));
	var dots = line.add(pv.Dot).lineWidth(1);
	dots.title(function () {
		return AR.Utility.getToolTipText(data, this.index);
	});
	self.adjustLabel = function (parentDimension) {
		dots.add(pv.Label).bottom(0).text(function () {
			return data[this.index].label;
		}).textAngle(-Math.PI / 4).textAlign("right").textBaseline("top");
	};
	self.adjustValuePositions = function (parentDimension) {
		dots.anchor("bottom").add(pv.Label).text(function () {
			return data[this.index].value;
		});
	};
	self.adjustBottom = function (parentDimension) {
		var pointHeight = pv.Scale.linear(0, AR.Utility.findMax(data)).range(0, parentDimension.height - 40);
		line.bottom(function (d) {
			return pointHeight(d);
		});
	};
	self.adjustLeft = function (parentDimension) {
		line.left(function () {
			return (this.index * (parentDimension.width - 30) / (noOfRecords)) + 30;
		});
	};
	self.adjustPositions = function (parentDimension) {
		self.adjustBottom(parentDimension);
		self.adjustLeft(parentDimension);
	};
	if (graphDef.toolTip && graphDef.toolTip === 1) {
		dots.event("mouseover", pv.Behavior.tipsy({
		gravity : function () {
			return ("s");
		},
		fade : true
		}));
	} else {
		self.adjustValuePositions(parentDimension);
	}
	if (graphDef.palette) {
		AR.Utility.setPalette(dots, graphDef.palette);
	}
	self.adjustPositions(parentDimension);
	self.adjustLabel(parentDimension);
};
AR.LineGraph = function (graphDef) {
	var line;
	var self = this;
	AR.Graph.apply(self, [graphDef]);
	self.setHorRules(AR.Utility.findMax(graphDef.data),AR.Utility.scale.linear);
	line = new AR.Line(graphDef.data, self._dimension, self._panel, graphDef);
	self.setWidth = function (width) {
		AR.Graph.prototype.setWidth.call(self, width);
		line.adjustPositions(self._dimension);
	};
	self.setHeight = function (height) {
		AR.Graph.prototype.setHeight.call(self, height);
		line.adjustPositions(self._dimension);
		self.setHorRules(AR.Utility.findMax(graphDef.data),AR.Utility.scale.linear);
	};
};
AR.LineGraph.prototype = AR.extend(AR.Graph);
AR.Wedge = function (data, parentDimension, panel, graphDef) {
	var properties = ["values", "labels", "legends"];
	var wedge = panel.add(pv.Wedge);
	var wedgeLabels, valueLabels;
	var dataValues = AR.Utility.getDataArray(data);
	var self = this;
	var adjustRadius = function (parentDimension) {
		wedge.outerRadius(function () {
			return (parentDimension.width < parentDimension.height ? (parentDimension.width - 30) / 2 : (parentDimension.height -40) / 2);
		});
	};
	var adjustAngle = function (parentDimension) {
		wedge.angle(function (d) {
			return ((d) * 2 * Math.PI);
		});
	};
	var adjustLabelPosition = function (parentDimension, isValueLabel) {
		var labels, shift;
		if (isValueLabel) {
			labels = valueLabels;
			shift = 10;
		} else {
			labels = wedgeLabels;
			shift = 0;
		}
		if (labels) {
			labels.left(function () {
				return (wedge.outerRadius() / 2 * Math.cos(wedge.midAngle()) + (parentDimension.width) / 2);
			}).bottom(function () {
				return (-wedge.outerRadius() / 2 * Math.sin(wedge.midAngle()) + (parentDimension.height ) / 2 - shift);
			});
		}
	};
	self.adjustPosition = function (parentDimension) {
		adjustRadius(parentDimension);
		adjustLabelPosition(parentDimension);
		adjustLabelPosition(parentDimension, 1);
		adjustAngle(parentDimension);
		wedge.def("o", -1).left(function(){
			return (parentDimension.width / 2 + Math.cos(this.startAngle() + this.angle() / 2) * ((this.o() === this.index) ? 10 : 0));
		}).bottom(function(){
			return (parentDimension.height / 2 - Math.sin(this.startAngle() + this.angle() / 2) * ((this.o() === this.index) ? 10 : 0));
		}).event("mouseover", function(){
			return this.o(this.index);
		}).event("mouseout",function(){
			return this.o(-1);
		});
	};

	self.showLabels = function (parentDimension) {
		wedgeLabels = wedge.add(pv.Label).textAlign("center").textBaseline("middle").text(function () {
			return data[this.index].label;
		});
		adjustLabelPosition(parentDimension);
	};
	self.showValues = function (parentDimension) {
		valueLabels = wedge.add(pv.Label).textAlign("center").textBaseline("middle").text(function () {
			return data[this.index].value;
		});
		adjustLabelPosition(parentDimension, 1);
	};
	wedge.data(pv.normalize(dataValues));
	properties.forEach(function (property) {
		var upcasedProp = property.substring(0, 1).toUpperCase() + property.substring(1);
		if (graphDef["show" + upcasedProp] && graphDef["show" + upcasedProp] === 1) {
			self["show" + upcasedProp](parentDimension);
		}
	});
	wedge.title(function () {
		return AR.Utility.getToolTipText(data, this.index);
	});
	//TODO: add tool tip at the right place
	if (graphDef.toolTip && graphDef.toolTip === 1) {
		wedge.event("mouseover", pv.Behavior.tipsy({
		gravity : function () {
			return ("s");
		},
		fade : true
		}));
	}
	self.adjustPosition(parentDimension);
};
AR.PieGraph = function (graphDef) {
	var self = this;
	AR.Graph.apply(self, [graphDef]);
	var wedges = new AR.Wedge(graphDef.data, self._dimension, self._panel, graphDef);
	//TODO: add other function such as changing the pallete etc  
	self.setWidth = function (width) {
		AR.Graph.prototype.setWidth.call(self, width);
		wedges.adjustPosition(self._dimension);
	};
	self.setHeight = function (height) {
		AR.Graph.prototype.setHeight.call(self, height);
		wedges.adjustPosition(self._dimension);
	};
};
AR.PieGraph.prototype = AR.extend(AR.Graph);


AR.Bubble = function(data, parentDimension, panel, graphDef) {
	var self = this;
	var bubble = panel.add(pv.Dot);
	bubble.data(AR.Utility.getMultiDimensionData(data));
	bubble.fillStyle("red");
	var adjustBottom = function (parentDimension) {
		var maxVal = AR.Utility.getSingleDimensionData(data,AR.Utility.Dimension.y).max();
		var bubbleBottom = pv.Scale.linear(0, maxVal).range(0, parentDimension.height - 40);
		bubble.bottom(function (d) {
			return bubbleBottom(d[1]);
		});
	};
	var adjustLeft = function (parentDimension) {
		var maxVal = AR.Utility.getSingleDimensionData(data,AR.Utility.Dimension.x).max();
		var bubbleLeft = pv.Scale.linear(0, maxVal).range(0, parentDimension.width - 30);
		bubble.left(function (d) {
			return (bubbleLeft(d[0]));
		});
	};
	var adjustSize = function (parentDimension){
		var maxVal = AR.Utility.getSingleDimensionData(data,AR.Utility.Dimension.z).max();
		var smallerDim = Math.min(parentDimension.width,parentDimension.height);
		var bubbleRadius = pv.Scale.linear(0, maxVal).range(0, smallerDim/20);
		bubble.shapeRadius(function (d){
			return (bubbleRadius(d[2]));
		});
	};
	bubble.title(function () {
		return AR.Utility.getToolTipText(data, this.index);
	});
	if (graphDef.toolTip && graphDef.toolTip === 1) {
		bubble.event("mouseover", pv.Behavior.tipsy({
		gravity : function () {
			return ("s");
		},
		fade : true
		}));
	}
	self.adjustPosition = function (parentDimension){
		adjustBottom(parentDimension);
		adjustLeft(parentDimension);
		adjustSize(parentDimension);
	};
	self.adjustPosition(parentDimension);
};
AR.BubbleGraph = function(graphDef){
	var self = this;
	AR.Graph.apply(self, [graphDef]);
	self.setHorRules(AR.Utility.getSingleDimensionData(graphDef.data, AR.Utility.Dimension.y).max(),AR.Utility.scale.linear);
	self.setVerticalRules(AR.Utility.getSingleDimensionData(graphDef.data, AR.Utility.Dimension.x).max(),AR.Utility.scale.linear);
	var bubbles = new AR.Bubble(graphDef.data, self._dimension, self._panel, graphDef);
	//TODO: add other function such as changing the pallete etc  
	self.setWidth = function (width) {
		AR.Graph.prototype.setWidth.call(self, width);
		bubbles.adjustPosition(self._dimension);
	};
	self.setHeight = function (height) {
		AR.Graph.prototype.setHeight.call(self, height);
		bubbles.adjustPosition(self._dimension);
	};
};
AR.BubbleGraph.prototype = AR.extend(AR.Graph);
/**
 * Register the file to protovis. By registering it means the pv.parse parses
 * the code.
 */
AR.registerToProtovis = function () {
	// TODO: TO BE IMPLEMENTED
};
/**
 * <tt>init</tt> function runs as soon as the this file is included. It adds
 * the required javascript files for protovis
 */
(function () {
	if (navigator.appName === "Microsoft Internet Explorer") {
		AR.addJavascript("lib/svg/svg.js", "head", "lib/svg/");
	}
	AR.addJavascript("lib/protovis-d3.3.js");
	var jQueryTipsy, tipsy;
	var jQuery = AR.addJavascript("lib/jQuery/jquery-1.4.2.min.js");
	jQuery.onload = function () {
		jQueryTipsy = AR.addJavascript("lib/jQuery/tipsy/jquery.tipsy.js");
		jQueryTipsy.onload = function () {
			tipsy = AR.addJavascript("lib/jQuery/tipsy/tipsy.js");
		};
	};
	AR.addCSS("lib/jQuery/tipsy/tipsy.css");
}());
