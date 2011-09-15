/**
 * The basefunction for the Bubble initialization. 
 * Initializes the BubbleGraph. Sets the data
 * @params {Object}
 * 			[graphDef] graphDef object supplied by the User for which the graph needs to be plotted. It contains graph properties and the data
 * @params {Object}
 * 			[parentDimension] parentDimension object that will indicate the dimensions of AR.Graph
 * @params {Object}
 * 			[panel] A panel object indicating the Graph Panel in which the current Bubble graph will be displayed
 * This is a base class and is called by different Bubble implementations
 */
AR.Bubble = function(parentDimension, panel, graphDef) {
	var self = this;
	var bubble = panel.add(pv.Dot);
	bubble.data(AR.Utility.getMultiDimensionData(graphDef.data));
	bubble.fillStyle("red");
	var adjustBottom = function (parentDimension) {
		var maxVal = AR.Utility.getSingleDimensionData(graphDef.data,AR.Utility.Dimension.y).max();
		var bubbleBottom = pv.Scale.linear(0, maxVal).range(0, parentDimension.height - 40);
		bubble.bottom(function (d) {
			return bubbleBottom(d[1]);
		});
	};
	var adjustLeft = function (parentDimension) {
		var maxVal = AR.Utility.getSingleDimensionData(graphDef.data,AR.Utility.Dimension.x).max();
		var bubbleLeft = pv.Scale.linear(0, maxVal).range(0, parentDimension.width - 30);
		bubble.left(function (d) {
			return (bubbleLeft(d[0]));
		});
	};
	var adjustSize = function (parentDimension){
		var maxVal = AR.Utility.getSingleDimensionData(graphDef.data,AR.Utility.Dimension.z).max();
		var smallerDim = Math.min(parentDimension.width,parentDimension.height);
		var bubbleRadius = pv.Scale.linear(0, maxVal).range(0, smallerDim/20);
		bubble.shapeRadius(function (d){
			return (bubbleRadius(d[2]));
		});
	};
	bubble.title(function () {
		return AR.Utility.getToolTipText(graphDef.data, this.index);
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

/**
 * API to construct a Bubble Graph
 * @param {object}
 *            [graphDef] An object containing the graph properties and the data
 * @extends AR.Graph
 */
AR.BubbleGraph = function(graphDef){
	var self = this;
	AR.Graph.apply(self, [graphDef]);
	self.setHorRules(AR.Utility.getSingleDimensionData(graphDef.data, AR.Utility.Dimension.y).max(),AR.Utility.scale.linear);
	self.setVerticalRules(AR.Utility.getSingleDimensionData(graphDef.data, AR.Utility.Dimension.x).max(),AR.Utility.scale.linear);
	var bubbles = new AR.Bubble(self._dimension, self._panel, graphDef);
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
