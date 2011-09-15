/**
 * The basefunction for the bar initialization. 
 * Initializes the barGraph. Sets the data
 * @params {Object}
 * 			[graphDef] graphDef object supplied by the User for which the graph needs to be plotted. It contains graph properties and the data
 * @params {Object}
 * 			[parentDimension] parentDimension object that will indicate the dimensions of AR.Graph
 * @params {Object}
 * 			[panel] A panel object indicating the Graph Panel in which the current Bar graph will be displayed
 * This is a base class and is called by different bar implementations (Eg : Vertical, Horizontal, Multivalued etc)
 * Adds Bar graph container to the panel, assigns data, sets anchor and tooltip with the given data
 */
AR.Bar = function (graphDef, parentDimension, panel) {
	var self = this;
	this._bar = panel.add(pv.Bar);
	this._parentDimension = parentDimension;
	this._noOfRecords = graphDef.data.length;
	this._bar.data(AR.Utility.getDataArray(graphDef.data));
	this._bar.title(function () {
		return AR.Utility.getToolTipText(graphDef.data, this.index);
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
			return graphDef.data[this.index].value;
		}).textBaseline(self instanceof AR.HBar ? "left" : "bottom");
	}
	if (graphDef.palette) {
		AR.Utility.setPalette(self._bar, graphDef.palette);
	}
};
// TODO - Some kind of a factory that sets the following properties has to be made. 
AR.Bar.prototype.properties = ["fillStyle", "strokeStyle"];


/**
 * Constructing Horizontal Bars For a Graph
 * @param {object}
 *            [graphDef] An object containing the graph properties and the data
 * @param {object}
 *            [panel] A protovis panel object in which the bar graph will be
 *            displayed
 * @extends AR.Bar
 */
AR.HBar = function (graphDef, parentDimension, panel) {
	var self = this;
	AR.Bar.apply(self, [graphDef, parentDimension, panel]);
	var adjustWidth = function (parentDimension) {
		var barWidth = pv.Scale.linear(0, AR.Utility.findMax(graphDef.data)).range(0, parentDimension.width - 40);
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
AR.HBar.prototype = AR.extend(AR.Bar);


/**
 * Constructing Vertical Bars For a Graph
 * @param {object}
 *            [graphDef] An object containing the graph properties and the data
 * @param {object}
 *            [panel] A protovis panel object in which the bar graph will be
 *            displayed
 * @extends AR.Bar
 */
AR.VBar = function (graphDef, parentDimension, panel) {
	var self = this;
	AR.Bar.apply(self, [graphDef, parentDimension, panel]);

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



// TODO add the xAxis and yAxis data labels to the axis rather that bars.
/**
 * BarGraph API. An API to create a Bar Graph
 * @param {object}
 *            [graphDef] An object containing the graph properties and the data in JSON Format
 * The corresponding BarGraph is rendered
 * @extends AR.Bar
 */
// TODO add the xAxis and yAxis data labels to the axis rather that bars.
AR.BarGraph = function (graphDef) {
	var bar, i, panel;
	var self = this;
	var createBars = {
	"v" : function () {
		bar = new AR.VBar(graphDef, self._dimension, self._panel);
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
			bar = new AR.HBar(graphDef, self._dimension, self._panel);
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
