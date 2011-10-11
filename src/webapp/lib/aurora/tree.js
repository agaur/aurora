


/**
 * Tree API to construct a Tree Graph or otherwise called the Node-Link graph
 * @param {object}
 *            [graphDef] An object containing the graph properties and the data
 * @extends AR.Graph
 */
AR.TreeGraph = function(graphDef){
	var self = this;
	AR.Graph.apply(self, [graphDef]);
	
	// These are getter and setter methods.
	self.setWidth = function (width) {
		AR.Graph.prototype.setWidth.call(self, width);
		wedges.adjustPosition(self._dimension);
	};
	self.setHeight = function (height) {
		AR.Graph.prototype.setHeight.call(self, height);
		wedges.adjustPosition(self._dimension);
	};
};
AR.TreeGraph.prototype = AR.extend(AR.Graph);
