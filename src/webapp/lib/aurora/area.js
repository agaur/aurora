/**
 * The basefunction for the Stacked Area Graph initialization. Need x and y co-ordinates.  
 * Initializes the StackedAreaGraph. Sets the data
 * @params {Object}
 * 			[graphDef] graphDef object supplied by the User for which the graph needs to be plotted. It contains graph properties and the data
 * @params {Object}
 * 			[parentDimension] parentDimension object that will indicate the dimensions of AR.Graph
 * @params {Object}
 * 			[panel] A panel object indicating the Graph Panel in which the current Area graph will be displayed. 
 * This is a base class and is called by different Area implementations. 
 */
AR.stackedarea = function(parentDimension, panel, graphDef){
	var self = this;
	// dataValues will contain the whole x,y,z values in form of an array. 
	var dataValues = AR.Utility.getTwoDimensionData(graphDef.data);
	//self._stackedArea = panel.add(pv.Layout.Stack);
	self._stackedArea = panel.add(pv.Area);
	var datum = graphDef.data;
	//self._stackedArea.layers(datum);
	self._stackedArea.data(datum);

	var setX = function(parentDimension){
		var maxVal = AR.Utility.getSingleDimensionData(graphDef.data,AR.Utility.Dimension.x).max();
		var xScale = pv.Scale.linear(0, maxVal).range(0, parentDimension.width-40); 
		//var xScale = pv.Scale.linear(graphDef.data, function(d) d.x).range(0, parentDimension.width); 
		self._stackedArea.left(function(d){
			var value = xScale(d.x);
			return xScale(d.x);
		});
	};
	
	var setY = function(parentDimension){
		var maxVal = AR.Utility.getSingleDimensionData(graphDef.data,AR.Utility.Dimension.y).max();
		var yScale = pv.Scale.linear(0, maxVal).range(0, parentDimension.height-40);
		self._stackedArea.height(function(d){
			var value = yScale(d.y)
			return yScale(d.y)
		});
	};
	
	var setXandY = function(parentDimension){
			setX(parentDimension);
			setY(parentDimension);
	};
	
	var setBottom = function(){
		self._stackedArea.bottom(0);
	};
	
	var setFillStyle = function(){
		self._stackedArea.fillStyle("rgb(121,173,210)");
	};
	
	var setAnchor = function(){
		self._stackedArea.anchor("top").add(pv.Line).lineWidth(3);
	};
	
		
	self.setStackAttributes = function(){
			var self = this;
			setBottom();
			setXandY(parentDimension);	
			setFillStyle();
			setAnchor();
	};
	
	
	self.setStackAttributes();
	//self._stackedArea.layer.add(pv.Area);		
};


/**
 * The basefunction for the Stacked Area Graph initialization. MultiGraph this is! 
 * Initializes the StackedAreaGraph. Sets the data
 * @params {Object}
 * 			[graphDef] graphDef object supplied by the User for which the graph needs to be plotted. It contains graph properties and the data
 * @params {Object}
 * 			[parentDimension] parentDimension object that will indicate the dimensions of AR.Graph
 * @params {Object}
 * 			[panel] A panel object indicating the Graph Panel in which the current Area graph will be displayed. 
 * This is a base class and is called by different Area implementations. 
 */
AR.multistackedarea = function(parentDimension, panel, graphDef){
	// TODO  Multiple area graphs in the same canvas
};


/**
 * API to construct a Stacked Area Graph
 * @param {object}
 *            [graphDef] An object containing the graph properties and the data
 * @extends AR.Graph
 */
AR.StackedAreaGraph = function(graphDef){
	var self = this;
	var stackedArea;
	AR.Graph.apply(self,[graphDef]);
	
	var setRules = {
	"v" : function () {
		if(graphDef.data){
			var maxVal = AR.Utility.getSingleDimensionData(graphDef.data,AR.Utility.Dimension.y).max();
			self.setHorRules(maxVal,AR.Utility.scale.linear);
		}	
	},
	
	"h" : function () {
		if(graphDef.data){
			var maxVal = AR.Utility.getSingleDimensionData(graphDef.data,AR.Utility.Dimension.x).max();
			self.setVerticalRules(maxVal,AR.Utility.scale.linear);
		}	
	},
	
	"b" : function () {
		if(graphDef.data){
			var xmaxVal = AR.Utility.getSingleDimensionData(graphDef.data,AR.Utility.Dimension.y).max();
			self.setHorRules(xmaxVal,AR.Utility.scale.linear);
			
			var ymaxVal = AR.Utility.getSingleDimensionData(graphDef.data,AR.Utility.Dimension.x).max();
			self.setVerticalRules(ymaxVal,AR.Utility.scale.linear);
		}	
	}
	
	};
	
	setRules[graphDef.type || "b"]();
	if(graphDef.dataset){
	}else
		stackedArea = new AR.stackedarea(self._dimension, self._panel, graphDef);
	
	
	// These are the constructor methods you can use to set/reset Graph panel. 
	self.setWidth = function (width) {
		AR.Graph.prototype.setWidth.call(self, width);
		stackedArea.adjustPosition(self._dimension);
	};
	self.setHeight = function (height) {
		AR.Graph.prototype.setHeight.call(self, height);
		stackedArea.adjustPosition(self._dimension);
	};
	
	self.setTop= function (top) {
		AR.Graph.prototype.setTop.call(self, top);
		stackedArea.adjustPosition(self._dimension);
	};
	
	self.setHeight = function (bottom) {
		AR.Graph.prototype.setBottom.call(self, bottom);
		stackedArea.adjustPosition(self._dimension);
	};
	
	self.setLeft= function (left) {
		AR.Graph.prototype.setLeft.call(self, left);
		stackedArea.adjustPosition(self._dimension);
	};
	
	self.setHeight = function (right) {
		AR.Graph.prototype.setRight.call(self, right);
		stackedArea.adjustPosition(self._dimension);
	};
	
	
}
AR.StackedAreaGraph.prototype = AR.extend(AR.Graph);
