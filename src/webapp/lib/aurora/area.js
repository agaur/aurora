/**
 * The basefunction for the Area Graph initialization. 
 * Initializes the AreaGraph. Sets the data
 * @params {Object}
 * 			[graphDef] graphDef object supplied by the User for which the graph needs to be plotted. It contains graph properties and the data
 * @params {Object}
 * 			[parentDimension] parentDimension object that will indicate the dimensions of AR.Graph
 * @params {Object}
 * 			[panel] A panel object indicating the Graph Panel in which the current Area graph will be displayed. 
 * This is a base class and is called by different Area implementations. 
 */
AR.area = function(parentDimension, panel, graphDef){
	var self = this;
	self._area = panel.add(pv.Area);
	var data = graphDef.data;
	self._noOfRecords = graphDef.data.length;
	var dataValues = AR.Utility.getDataArray(graphDef.data);
	this._parentDimension = parentDimension;
	this._area.data(dataValues);	
	var adjustHeight = function (parentDimension) {
		var areaHeight = pv.Scale.linear(0, AR.Utility.findMax(graphDef.data)).range(0, parentDimension.height - 40);
		self._area.height(function (d) {
			return areaHeight(d);
		});
	};
	
	this._area.fillStyle(function(d) "hsl(" + (d * 50) + ",50%,50%)")
	var adjustBottom = function (parentDimension) {
		self._area.bottom(0);
	};
	var adjustLeft = function (parentDimension) {
		self._area.left(function () {
			return (this.index * 100) + 15;
		});
	};
	var setInterpolate = function(){
		self._area.interpolate("step-after");
	}
	var setStrokeStyletoBlack = function(){
		self._area.strokeStyle("black");
	}
	var setSegmented = function(){
		self._area.segemented = true;
	}
	// TODO define a layout designer which does the following
	self.adjustPosition = function (parentDimension) {
		setInterpolate();
		setSegmented();
		adjustBottom(parentDimension);
		adjustLeft(parentDimension);
		adjustHeight(parentDimension);
		setStrokeStyletoBlack();
	};
	/*self._area.title(function () {
		return AR.Utility.getToolTipText(data, this.index);
	});
	if (graphDef.toolTip && graphDef.toolTip === 1) {
		self._area.event("mouseover", pv.Behavior.tipsy({
		gravity : function () {
			return ("s");
		},
		fade : true
		}));
	}*/
	self.adjustPosition(self._parentDimension);
};

/**
 * API to construct an Area Graph
 * @param {object}
 *            [graphDef] An object containing the graph properties and the data
 * @extends AR.Graph
 */
AR.AreaGraph = function(graphDef){
	 var self = this;
	 var area;
	 //  Here you have the dimensions set and the panel and its boundaries. 
	 AR.Graph.apply(self,[graphDef]);
	 area = new AR.area(self._dimension, self._panel, graphDef);
	 	this.setPalette = function (paletteCode) {
		//TODO setPallete is a utility function. Correct it
		AR.Utility.setPalette(area, paletteCode);
	};
}
AR.AreaGraph.prototype = AR.extend(AR.Graph);

/******************************************************************************************************/

/**
 * The basefunction for the Stacked Area Graph initialization. 
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
	self._graphPanel = panel
	self._stackedArea = self._graphPanel.add(pv.Layout.Stack);
	self.graphDef = graphDef;
	
	var setX = function(parentDimension){
		var maxVal = AR.Utility.getSingleDimensionData(graphDef.data,AR.Utility.Dimension.x).max();
		var xScale = pv.Scale.linear(0, maxVal).range(0, parentDimension.width); 
		self._stackedArea.x(function(d){
			return xScale(d.x);
		});
	};
	
	var setY = function(parentDimension){
		var maxVal = AR.Utility.getSingleDimensionData(graphDef.data,AR.Utility.Dimension.y).max();
		var yScale = pv.Scale.linear(0, maxVal).range(0, parentDimension.height);
		self._stackedArea.y(function(d){
			return yScale(d.y)
		});
	};
	
	var setXandY = function(parentDimension){
			setX(parentDimension);
			setY(parentDimension);
	};
	
	self.setStackAttributes = function(){
			var self = this;
			self._stackedArea.layers(self.graphDef.data);
			setXandY(parentDimension);
			
	};
	
	self.template =  function(){
			var self = this;
			self.setStackAttributes();
			panel.layer.add(pv.Area);
	};
	
	self.template();
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
