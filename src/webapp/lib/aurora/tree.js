
/**
 * The basefunction for the Line initialization. 
 * Initializes the LineGraph. Sets the data
 * @params {Object}
 * 			[graphDef] graphDef object supplied by the User for which the graph needs to be plotted. It contains graph properties and the data
 * @params {Object}
 * 			[parentDimension] parentDimension object that will indicate the dimensions of AR.Graph
 * @params {Object}
 * 			[panel] A panel object indicating the Graph Panel in which the current Line graph will be displayed
 * This is a base class and is called by different Line implementations. 
 */
 AR.NodeLinkGraph = function(parentDimension, panel, graphDef){
 		var self = this;
 		var nlpanel = panel.add(pv.Layout.Tree);;
 		var rootTree = graphDef.root;
 		var jsondata = graphDef.data;

 		self.setDataasNodes = function(data){
 			var nodeData = FormatJSON(jsondata);
 			nlpanel.nodes(pv.dom(nodeData).root(rootTree).nodes());	
 		};

 		self.setBreadth = function(parentDimension){
 			nlpanel.breadth(function(){
 				return 85;
 			});
 		};

 		self.setDepth = function(parentDimension){
 			nlpanel.depth(function(){
 				return 7.25;
 			});	
 		};

 		self.setScaleType = function(){
 			nlpanel.orient("radial");	
 		};

 		self.connectToTree = function(){
 			nlpanel.link.add(pv.Line);
 		};

 		self.markEdges = function(){
 			nlpanel.node.add(pv.Dot);	
 		};

 		self.adjustTreeLabel = function(){
 			nlpanel.label.add(pv.Label);	
 		};

 		self.drawNodeLink = function(){
 			self.setDataasNodes(jsondata);
 			self.setBreadth(parentDimension);
 			self.setDepth(parentDimension);
 			self.setScaleType();
 			self.connectToTree();
 			self.markEdges();
 			self.adjustTreeLabel();
 		};

 		self.drawNodeLink();
 };

/**
 * Tree API to construct a Tree Graph or otherwise called the Node-Link graph
 * @param {object}
 *            [graphDef] An object containing the graph properties and the data
 * @extends AR.Graph
 */
AR.TreeGraph = function(graphDef){
	var self = this;
	AR.Graph.apply(self, [graphDef]);
	
	// Here I'm gonna have to call the Tree API or the Node Link API
	// Before I do so I am gonna adjust the panel dimensions a bit.. 



	var nodeLink;
	nodeLink = AR.NodeLinkGraph(self._dimension, self._panel, graphDef);

	// These are getter and setter methods.
	self.setWidth = function (width) {
		AR.Graph.prototype.setWidth.call(self, width);
		nodeLink.adjustPosition(self._dimension);
	};
	self.setHeight = function (height) {
		AR.Graph.prototype.setHeight.call(self, height);
		nodeLink.adjustPosition(self._dimension);
	};

/*	self.setLeft = function(left){
		AR.Graph.prototype.setLeft.call(self, left);
		nodeLink.adjustPosition(self._dimension);
	};
	self.setRight = function(right){
		AR.Graph.prototype.setRight.call(self, right);
		nodeLink.adjustPosition(self._dimension);	
	};
	self.setBottom = function(bottom){
		AR.Graph.prototype.setBottom.call(self, bottom);
		nodeLink.adjustPosition(self._dimension);	
	};
	self.setTop = function(top){
		AR.Graph.prototype.setTop.call(self,top);
		nodeLink.adjustPosition(self._dimension);	
	};
*/
	self.setLeft(75);
	self.setRight(-75);
	self.setTop(-30);
	self.setBottom(-80);
};
AR.TreeGraph.prototype = AR.extend(AR.Graph);
