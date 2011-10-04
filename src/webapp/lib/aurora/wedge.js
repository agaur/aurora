/**
 * The basefunction for the Wedge initialization. 
 * Initializes the WedgeGraph. Sets the data
 * @params {Object}
 * 			[graphDef] graphDef object supplied by the User for which the graph needs to be plotted. It contains graph properties and the data
 * @params {Object}
 * 			[parentDimension] parentDimension object that will indicate the dimensions of AR.Graph
 * @params {Object}
 * 			[panel] A panel object indicating the Graph Panel in which the current Wedge graph will be displayed
 * This is a base class and is called by different Wedge implementations (Eg : Donut or Pie)
 */
AR.Wedge = function (parentDimension, panel, graphDef) {
	var properties = ["values", "labels", "legends"];
	var wedge = panel.add(pv.Wedge);
	var wedgeLabels, valueLabels;
	var dataValues = AR.Utility.getDataArray(graphDef.data);
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
			return graphDef.data[this.index].label;
		});
		adjustLabelPosition(parentDimension);
	};
	
	self.showValues = function (parentDimension) {
		valueLabels = wedge.add(pv.Label).textAlign("center").textBaseline("middle").text(function () {
			return graphDef.data[this.index].value;
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
		return AR.Utility.getToolTipText(graphDef.data, this.index);
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


/**
 * Wedge API to construct a Pie Graph
 * @param {object}
 *            [graphDef] An object containing the graph properties and the data
 * @extends AR.Graph
 */
AR.PieGraph = function (graphDef) {
	var self = this;
	AR.Graph.apply(self, [graphDef]);
	var wedges = new AR.Wedge(self._dimension, self._panel, graphDef);
	//TODO: add other function such as changing the pallete etc  
	// Would kinda serve as APIs for a new user who's come in.. 
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


/**
 * Wedge API to construct a Donut Graph
 * @param {object}
 *            [graphDef] An object containing the graph properties and the data
 * @extends AR.Graph
 */


