/**
 * The basefunction for the Bubble initialization. 
 * Initializes the AreaGraph. Sets the data
 * @params {Object}
 * 			[graphDef] graphDef object supplied by the User for which the graph needs to be plotted. It contains graph properties and the data
 * @params {Object}
 * 			[parentDimension] parentDimension object that will indicate the dimensions of AR.Graph
 * @params {Object}
 * 			[panel] A panel object indicating the Graph Panel in which the current Area graph will be displayed
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

