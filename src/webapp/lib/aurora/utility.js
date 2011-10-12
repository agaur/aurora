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

AR.Utility.findSetMax = function (data) {
	var max = data[0];
	data.forEach(function (data) {
		if (parseInt(data, 10) > max) {
			max = parseInt(data, 10);
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

AR.Utility.getImageContentChart= function (data, type) {
	var noOfRecords = data.length;
	var arr, i;
	for (i = 0; i < noOfRecords; i = i + 1) {
		if(data[i].chart.type == type){
			arr = data[i].chart.content.chart;
		}
	}
	return arr;
};

AR.Utility.getJSONContentChart= function (data, type) {
	var noOfRecords = data.length;
	var arr, i;
	for (i = 0; i < noOfRecords; i = i + 1) {
		if(data[i].chart.type == type){
			arr = data[i].chart.content.jsoncontent;
		}
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

AR.Utility.getTwoDimensionData = function (data){
	var noOfRecords = data.length;
	var arr = [],innerArr = [], i;
	for(i = 0; i < noOfRecords; i = i + 1){
		innerArr = [];
		innerArr.push(data[i].x);
		innerArr.push(data[i].y);
		arr.push(innerArr);
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
