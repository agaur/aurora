/**
 * The basefunction for the Bubble initialization. 
 * Initializes the LineGraph. Sets the data
 * @params {Object}
 * 			[graphDef] graphDef object supplied by the User for which the graph needs to be plotted. It contains graph properties and the data
 * @params {Object}
 * 			[parentDimension] parentDimension object that will indicate the dimensions of AR.Graph
 * @params {Object}
 * 			[panel] A panel object indicating the Graph Panel in which the current Line graph will be displayed
 * This is a base class and is called by different Line implementations. 
 */
AR.Line = function (parentDimension, panel, graphDef) {
	var self = this;
	var noOfRecords = graphDef.data.length;
	var line = panel.add(pv.Line);
	line.data(AR.Utility.getDataArray(graphDef.data));
	var dots = line.add(pv.Dot).lineWidth(1);
	dots.title(function () {
		return AR.Utility.getToolTipText(graphDef.data, this.index);
	});
	self.adjustLabel = function (parentDimension) {
		dots.add(pv.Label).bottom(0).text(function () {
			return graphDef.data[this.index].label;
		}).textAngle(-Math.PI / 4).textAlign("right").textBaseline("top");
	};
	self.adjustValuePositions = function (parentDimension) {
		dots.anchor("bottom").add(pv.Label).text(function () {
			return graphDef.data[this.index].value;
		});
	};
	self.adjustBottom = function (parentDimension) {
		var pointHeight = pv.Scale.linear(0, AR.Utility.findMax(graphDef.data)).range(0, parentDimension.height - 40);
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

/**
 * API to construct a Line Graph
 * @param {object}
 *            [graphDef] An object containing the graph properties and the data
 * @extends AR.Graph
 */
AR.LineGraph = function (graphDef) {
	var line;
	var self = this;
	AR.Graph.apply(self, [graphDef]);
	self.setHorRules(AR.Utility.findMax(graphDef.data),AR.Utility.scale.linear);
	line = new AR.Line(self._dimension, self._panel, graphDef);
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
