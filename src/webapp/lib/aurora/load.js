$(document).ready(function() { 
	
	// TODO write generateDivs to dynamically generate the Divs instead of writing them statically.. 
	var flag = generateDivs();
	if(flag == true){
				var type = "";
				$('.chart-tabs-tabs a').click(function(){
					switch_tabs($(this),type);
				});

				

				//select all the a tag with name equal to modal
				$('button[name=modal],div[name=modal]').click(function(e) {
					//Cancel the link behavior
					e.preventDefault();
				
					//Get the A tag
					var id = $(this).attr('id');
				
					// Get the type tag. This type tag will help us determine what image to show and what JSON to show
					type = $(this).attr('type');

					//Get the screen height and width
					var maskHeight = $(document).height();
					var maskWidth = $(window).width();

					//Set heigth and width to mask to fill up the whole screen
					$('#mask').css({'width':maskWidth,'height':maskHeight});
				
					//transition effect		
					$('#mask').fadeIn(200);	
					$('#mask').fadeTo("slow",0.8);	

					//Get the window height and width
					var winH = $(window).height()+2*$(window).scrollTop();
					var winW = $(window).width();
					  
					//Set the popup window to center
					$(id).css('top',  winH/2-$(id).height()/2);
					$(id).css('left', winW/2-$(id).width()/2);
				
					//transition effect
					$(id).fadeIn(500);
					
					switch_tabs($('.defaulttab'),type);
				});


					//if close button is clicked
					$('.window .close').click(function (e) {
						e.preventDefault();
						
						$('#mask').hide();
						$('.window').hide();
					});		

					//if mask is clicked
					$('#mask').click(function () {
						$(this).hide();
						$('.window').hide();
					});
		
	}else{
		document.write("Please check generateDivs() method in js/load.js. There might be some errors there");
	}
});    

function switch_tabs(obj,type) {
			$('.chart-tabs-tab-content').hide();
			$('.chart-tabs-tabs a').removeClass("selected");
			var id = obj.attr("rel");
			var newChartHTML = "<img src='css/images/"+type+".png' width='500px;' height='400px;'>";
			var jsonContent = getchartjson(type);
			if(id == "tabs1"){
				document.getElementById(id).innerHTML = newChartHTML;
			}else{
				//var text = JSON.stringify(jsonContent);
				var formattedJSON = FormatJSON(jsonContent);
				document.getElementById(id).innerHTML = "<pre>"+formattedJSON+"</pre>";
			}
			$('#'+id).show();
			obj.addClass("selected");
} 

function FormatJSON(oData, sIndent) {
    if (arguments.length < 2) {
        var sIndent = "";
    }
    var sIndentStyle = "    ";
    var sDataType = RealTypeOf(oData);

    // open object
    if (sDataType == "array") {
        if (oData.length == 0) {
            return "[]";
        }
        var sHTML = "[";
    } else {
        var iCount = 0;
        $.each(oData, function() {
            iCount++;
            return;
        });
        if (iCount == 0) { // object is empty
            return "{}";
        }
        var sHTML = "{";
    }
    /**
     * Attempting to iterate through items and putting 'em in place
    **/
    // loop through items
   
    var iCount = 0;
    $.each(oData, function(sKey, vValue) {
        if (iCount > 0) {
            sHTML += ",";
        }
        if (sDataType == "array") {
            sHTML += ("\n" + sIndent + sIndentStyle);
        } else {
            sHTML += ("\n" + sIndent + sIndentStyle + "\"" + sKey + "\"" + ": ");
        }

        // display relevant data type
        switch (RealTypeOf(vValue)) {
            case "array":
            case "object":
                sHTML += FormatJSON(vValue, (sIndent + sIndentStyle));
                break;
            case "boolean":
            case "number":
                sHTML += vValue.toString();
                break;
            case "null":
                sHTML += "null";
                break;
            case "string":
                sHTML += ("\"" + vValue + "\"");
                break;
            default:
                sHTML += ("TYPEOF: " + typeof(vValue));
        }

        // loop
        iCount++;
    });

    // close object
    if (sDataType == "array") {
        sHTML += ("\n" + sIndent + "]");
    } else {
        sHTML += ("\n" + sIndent + "}");
    }

    // return
    return sHTML;
}

function RealTypeOf(v) {
  if (typeof(v) == "object") {
    if (v === null) return "null";
    if (v.constructor == (new Array).constructor) return "array";
    if (v.constructor == (new Date).constructor) return "date";
    if (v.constructor == (new RegExp).constructor) return "regex";
    return "object";
  }
  return typeof(v);
}

/**
 * 	This function generateDivs is a TODO.. it will generate the whole HTML page dynamically.. 
 * */
function generateDivs(){
	var mapData = chartJSON.charter;
	var group = "", prevgroup = mapData[0].chart.group, flag = true;
	var auroraContent = loadInitials();
	var groupContent = "";
	// Always keep passing from the second iteration, if you were putting a forloop and div code in the same thing. 
	// For clarity I have separated 'em out.
	var prevgroup = "";
	for(var i=0; i<mapData.length; i++){
			var graphType = mapData[i].chart.type;
			var graphTitle = mapData[i].chart.name;
			var graphDesc = mapData[i].chart.description;
			group = mapData[i].chart.group;
			if(prevgroup == group){
			}else
				groupContent+= generateGroupContent(true, group, mapData);
			prevgroup = group;
	}
	auroraContent+= groupContent;
	var wrapAurora = wrapInitials();
	auroraContent+= wrapAurora;
	
	var auroraContainer = document.getElementById("container");
	auroraContainer.innerHTML = "";
	auroraContainer.innerHTML = auroraContent;
	
	var graphPopUpContainer = document.getElementById("boxes");
	graphPopUpContainer.innerHTML = "";
	graphPopUpContainer.innerHTML = generateGraphPopups();
	return true;
}

/**
 * flag==true would indicate that there is another group following this.. 
 * */
function generateGroupContent(flag, group, mapData){
	
	var preModals = generatePreModalDivs(flag, group);
	var modalContent = "";
	for(var i=0; i<mapData.length; i++){
			var graphType = mapData[i].chart.type;
			var graphTitle = mapData[i].chart.name;
			var graphDesc = mapData[i].chart.description;
			graphGroup = mapData[i].chart.group;
			if(group == graphGroup){
				modalContent+= generateModalElement(graphType, graphTitle, graphDesc);	
			}
	}
	preModals+= modalContent;
	var wrapModals = closePreModalAfterModel();
	preModals+= wrapModals;
	return preModals;	
		
}

/**
 * The order of generation would be
 * 	1. LoadInitials()
 *  2. generatePreModalDivs()
 *  3. generateModalElement()
 *  4. closePreModalAfterModal()
 *  5. WrapInitials()
 * */
 
function generateModalElement(type, title, description){
	var modalElement = "<div name='modal' id='#parameters' type='"+type+"' style='float:left; width:23%; padding:1%; cursor:pointer;'>";
        modalElement+= "<div id='content'>";
        modalElement+=  "<img src='css/images/"+type+".png' width='140px;'/>";
		modalElement+= "</div>";
		modalElement+= "<div style='text-decoration:none; font-weight:bold; color:#666666; padding-top:5px;'>";
		modalElement+= title;
		modalElement+= "</div>";
		modalElement+= "<div style='text-decoration:none; font-weight:normal; color:#666666; padding-top:5px; line-height:normal;'>";
		modalElement+= description;
		modalElement+= "</div>";
		modalElement+= "</div>";
		
		return modalElement;
}

function generatePreModalDivs(flag, group){
	if(flag == true){
	 var preModalElement = "<div style='float:left; width:100%; color:#69C; font-size:11px; font-weight:bold; line-height:20px;'>";
         preModalElement+=  "<div style='margin-left:5px; float:left;'>"+" "+group+" :-</div>";
         preModalElement+=   "<div style='width:100%; float:left;'>";
         
         return preModalElement;
	 }
	 else{
			return "<div></div>";
	 }
}

function closePreModalAfterModel(){
		var returnModal = "</div></div>";
			returnModal+= "<div style='width:100%; float:left; height:20px;'></div>";
			
			return returnModal;
}

function loadInitials(){
	var bootElement  = "";
        bootElement+= "<div style='color:#69C; font-size:18px; font-weight:bold; text-align:left; padding:10px; overflow:hidden;'>";
        bootElement+=  "<div style='margin-bottom:20px;'>";
        bootElement+=   "Aurora Chart Gallery";
        bootElement+=    "</div>";
        return bootElement;
}

function wrapInitials(){
		return "</div>";
}

function generateGraphPopups(){
		var graphPopUpContent = "";
		graphPopUpContent+=  "<div id='parameters' class='window'>";
		graphPopUpContent+=  "<div id='popup-header'>";
		graphPopUpContent+=  "<div style='float:left; padding-right:50px;'>Chart Style </div>";
		graphPopUpContent+=	 "<div style='float:right;'><a href='#' class='close' style='color:#CFF; text-decoration:none;'>Close</a></div>";
		graphPopUpContent+=  "</div>";
		graphPopUpContent+=  "<div id='popup-body' style='padding:10px; text-align:left; width:600px; height:500px; overflow:scroll' screenX='100' screenY='100'>";
		graphPopUpContent+=  "<div id='chart-tabs-wrapper'>";
		graphPopUpContent+=  "<div>";
		graphPopUpContent+=  "<ul class='chart-tabs-tabs'>";
		graphPopUpContent+=  "<li><a href='#' class='defaulttab' rel='tabs1'>Chart</a></li>";
		graphPopUpContent+=  "<li><a href='#' rel='tabs2'>JSON</a></li></ul></div>";
		graphPopUpContent+=  "<div class='chart-tabs-tab-content' id='tabs1' style='text-align:center;' styleX='100' styleY='100'><img src='css/images/chart.jpg'/>";                        	
        graphPopUpContent+=  "</div><div class='chart-tabs-tab-content' id='tabs2' style='overflow:auto' styleX='100' styleY='100'></div>";
        graphPopUpContent+=  "</div></div>";
				/**
            	<div id="popup-footer">
	                <div style="float:right;"><a class="close"  href="">Save</a> | <a class="close" href="">Cancel</a></div> 
				</div>
				-->
				* */
       graphPopUpContent+= "</div>";
              
          
            
            
            //-- Mask to cover the whole screen -->
      graphPopUpContent+=  "<div id='mask'></div>";
      
      return graphPopUpContent;

}
function getChartImage(type){
	var chartData = chartJSON.charter;
	return "css/images/"+type+".png";
	//var imgLocation = AR.Utility.getImageContentChart(chartData,type);
}


function getchartjson(type){
	var chartData = chartJSON.charter;
	var chartjson =  AR.Utility.getJSONContentChart(chartData,type);
	return chartjson;
}

/** Make sure that the type of the JSON you're using in the JSON mapping 
 * is same as the image name in your folder css/images for this particular graph. 
 * If not, you're gonna have to use the getImageContentChart to get the image location 
 * when you do so, your chart value should contain your absolute image path instead of just the location.
 * */
var chartJSON = {
	
	"charter" : [{
	// 
	"chart" : 
	 {
		"type"        :  "hbar",
		"group"       :  "Bar Graphs",
		"name"  	  :  "Horizontal Bar Graph",
		"description" :  "Data Comparision Using a Horizontal Bar Graph", 
		"content" :	{
				"chart" : "css/images/",
				"jsoncontent": {
					"caption": "Top 5 Sales Person",
					"yAxisName": "Names",
					"xAxisName": "Sales Figure",
					"width": 500,
					"height": 500,
					"palette": 1,
					"borderColor": "green",
					"type":"h",
					"data": [
					{
						"label": "data1",
						"value": 15
					},
					{
						"label": "data2",
						"value": 3},
					{
						"label": "data3",
						"value": 2
					},
					{
						"label": "data4",
						"value": 3},

					{
						"label": "data5",
						"value": 3
					}
				]
	}}}},
	
	// ============== Vertical Bar Graph ============
	{
	"chart" : 
	 {
		"type" : "vbar",
		"group"       :  "Bar Graphs",
		"name"  	  :  "Vertical Bar Graph",
		"description" :  "Data Comparision Using a Vertical Bar Graph",
		"content" :	{	
				"chart" : "css/images/",
				"jsoncontent": {
					"caption": "Top 5 Sales Person",
					"yAxisName": "Names",
					"xAxisName": "Sales Figure",
					"width": 500,
					"height": 500,
					"palette": 1,
					"borderColor": "green",
					"type":"v",
					"data": [
					{
						"label": "data1",
						"value": 15
					},
					{
						"label": "data2",
						"value": 3},
					{
						"label": "data3",
						"value": 2
					},
					{
						"label": "data4",
						"value": 3},

					{
						"label": "data5",
						"value": 3
					}
				]
	}}}},
	
	// ======== Multi Line Horizontal ========
	{
	"chart" : 
	 {
		"type" : "mhbar",
		"group"       :  "Bar Graphs",
		"name"  	  :  "Multi Horizontal Bar Graph",
		"description" :  "Data Comparision Using a Horizontal Multi Bar Graph",
		"content" :	{	
				"chart" : "css/images/",
				"jsoncontent": {
						"caption": "MultiValued Chart For Sales",
						"yAxisName": "Sales Figure Per Group",
						"xAxisName": "Names",
						"width": 500,
						"height": 500,
						"palette": 1,
						 "type": "h",
						 // The convention dataset has to be maintained if you wish to plot multivalued graphs;
						 "dataset": [
						 {
							"data": [		
								{
									"label": "Limca-India",
									"value": 10
								},	
								{
									"label": "Limca-US",
									"value": 4
								}
							]
						},
						
						{
							"data": [		
								{
									"label": "Coke-India",
									"value": 3
								},	
								{
									"label": "Coke-US",
									"value": 5
								}
							]
					   },
					   
					   {
							"data": [		
								{
									"label": "Thumbsup-India",
									"value": 3
								},	
								{
									"label": "Thumbsup-US",
									"value": 5
								}
							]
					   }
					  ]
	}}}},
	{
	// ============ MultiLine Vertical ==========
	"chart" : 
	 {
		"type" : "mvbar",
		"group"       :  "Bar Graphs",
		"name"  	  :  "Multi Vertical Bar Graph",
		"description" :  "Data Comparision Using a Vertical Multi Bar Graph",
		"content" :	{	
				"chart" : "css/images/",
				"jsoncontent": {
							"caption": "MultiValued Chart For Sales",
							"yAxisName": "Sales Figure Per Group",
							"xAxisName": "Names",
							"width": 500,
							"height": 500,
							"palette": 1,
							 "type": "v",
							 // The convention dataset has to be maintained if you wish to plot multivalued graphs;
							 "dataset": [
							 {
								"data": [		
									{
										"label": "Limca-India",
										"value": 10
									},	
									{
										"label": "Limca-US",
										"value": 4
									}
								]
							},
							
							{
								"data": [		
									{
										"label": "Coke-India",
										"value": 3
									},	
									{
										"label": "Coke-US",
										"value": 5
									}
								]
						   },
						   
						   {
								"data": [		
									{
										"label": "Thumbsup-India",
										"value": 3
									},	
									{
										"label": "Thumbsup-US",
										"value": 5
									}
								]
						   }
						  ]
	}}}},
	
	// Line Graph Dots 
	{
	"chart" : 
	 {
		"type" : "pline",
		"group"       :  "Line Graphs",
		"name"  	  :  "Line Graph with points marked",
		"description" :  "Simple Line Graph with pointed marked",
		"content" :	{	
				"chart" : "css/images/",
				"jsoncontent": {
					"caption": "Top 5 Sales Person",
					"yAxisName": "Names",
					"xAxisName": "Sales Figure",
					"width": 500,
					"height": 500,
					"palette": 1,
					"borderColor": "green",
					"type":"h",
					"data": [
					{
						"label": "data1",
						"value": 15
					},
					{
						"label": "data2",
						"value": 3},
					{
						"label": "data3",
						"value": 2
					},
					{
						"label": "data4",
						"value": 3},

					{
						"label": "data5",
						"value": 3
					}
				]
	}}}},
	
	// Simple Line Graph
	{
	"chart" : 
	 {
		"type" 		  : "sline",
		"group"       :  "Line Graphs",
		"name"  	  :  "Line Graph with points not marked",
		"description" :  "Simple Line Graph",
		"content" :	{	
				"chart" : "css/images/",
				"jsoncontent": {
					"caption": "Top 5 Sales Person",
					"yAxisName": "Sales Figure",
					"xAxisName": "Names",
					"toolTip": 1,
					"width": 500,
					"height": 500,
					"borderColor": "red",
					"type":"v",
					"data": [{
						"label": "1data",
						"value": 15,
						"toolTipText": "label:1data, value:15"
					},
					{
						"label": "2data",
						"value": 3
					},
					{
						"label": "3data",
						"value": 2
					}
					]
	}}}},
	
	// Multi Line Graph
	{
	"chart" : 
	 {
		"type" : "mline",
		"group"       :  "Line Graphs",
		"name"  	  :  "Multi Line Graph",
		"description" :  "A multi Line Graph representation",
		"content" :	{	
				"chart" : "css/images/",
				"jsoncontent": {
							"caption": "Multi Line Graph",
							"yAxisName": "Names",
							"xAxisName": "Sales Figure",
							"toolTip": 1,
							"width": 500,
							"height": 500,
							"palette": 1,
							"type": "b",
							 "dataset" : [
								{
									"data": [{
									"label": "1data",
									"value": 15,
									"toolTipText": "label:1data, value:15"
									}, {
									"label": "2data",
									"value": 3
									}, {
									"label": "3data",
									"value": 2
									} ]
							},
							
							{
									"data": [{
									"label": "1data",
									"value": 10,
									"toolTipText": "label:1data, value:10"
									}, {
									"label": "2data",
									"value": 5
									}, {
									"label": "3data",
									"value": 6
									} ]
							}
							]
	}}}},
	
	// Line Graph Step
	{
	"chart" : 
	 {
		"type" : "stline",
		"group"       :  "Line Graphs",
		"name"  	  :  "Multi Line Step Graph",
		"description" :  "Line Graph with Step",
		"content" :	{	
				"chart" : "css/images/",
				"jsoncontent": {
					"caption": "Multi Line Graph",
					"yAxisName": "Names",
					"xAxisName": "Sales Figure",
					"toolTip": 1,
					"width": 500,
					"height": 500,
					"palette": 1,
					"type": "b",
					 "style": "step",
					 "dataset" : [
						{
							"data": [{
							"label": "1data",
							"value": 15,
							"toolTipText": "label:1data, value:15"
							}, {
							"label": "2data",
							"value": 3
							}, {
							"label": "3data",
							"value": 2
							} ]
					},
					
					{
							"data": [{
							"label": "1data",
							"value": 10,
							"toolTipText": "label:1data, value:10"
							}, {
							"label": "2data",
							"value": 5
							}, {
							"label": "3data",
							"value": 6
							} ]
					}
					]
	}}}},
	
	// Bubble Graph
	{
	"chart" : 
	 {
		"type" : "bubble",
		"group"       :  "Scatter, Wedge and Area Graphs",
		"name"  	  :  "Bubble Graph",
		"description" :  "Simple Bubble Graph Representation",

		"content" :	{	
				"chart" : "css/images/",
				"jsoncontent": {
						"caption": "Top 5 Sales Person",
						"width": 500,
						"height": 500,
						"palette": 1,
						"toolTip": 1,
						"fillColor": "silver",
						"xAxisName": "Stickiness",
						"yAxisName": "Cost Per Service",
						"data": [
									{
										"x": 30,
										"y": 1.3,
										"z": 116,
										"toolTipText": "Traders"
									},
									{
										"x": 32,
										"y": 3.5,
										"z": 99,
										"toolTipText": "Farmers"
									},
									{
										"x": 8,
										"y": 2.1,
										"z": 33,
										"toolTipText": "Individuals"
									},
									{
										"x": 62,
										"y": 2.5,
										"z": 72,
										"toolTipText": "Medium Business Houses"
									},
									{
										"x": 78,
										"y": 2.3,
										"z": 55,
										"toolTipText": "Corporate Group A"
									}
								]
	}}}},
	
	// Pie Graph
	{
	"chart" : 
	 {
		"type" 		  : "pie",
		"group"       :  "Scatter, Wedge and Area Graphs",
		"name"  	  :  "Pie Graph",
		"description" :  "Simple Pie Graph Representation",

		"content" :	{	
				"chart" : "css/images/",
				"jsoncontent": {
						"caption": "Top 5 Sales Person",
						"width": 500,
						"height": 500,
						"palette": 1,
						"showValues" : 1,
						"showLabels" : 1,
						"data": [{
							"label": "data1",
							"value": 15
						},
						{
							"label": "data2",
							"value": 3
						},
						{
							"label": "data3",
							"value": 2
						},
						{
							"label": "data4",
							"value": 3
						},

						{
							"label": "data5",
							"value": 3
						}
						]
	}}}},
	
	// Donut Graph
	{
	"chart" : 
	 {
		"type" : "donut",
		"group"       :  "Scatter, Wedge and Area Graphs",
		"name"  	  :  "Donut Graph",
		"description" :  "Simple Donut Graph Representation",

		"content" :	{	
				"chart" : "css/images/",
				"jsoncontent": {
							"caption": "Top 5 Sales Person",
							"width": 500,
							"height": 500,
							"palette": 1,
							"showValues" : 1,
							"showLabels" : 1,
							"data": [{
								"label": "data1",
								"value": 15
							},
							{
								"label": "data2",
								"value": 3
							},
							{
								"label": "data3",
								"value": 2
							},
							{
								"label": "data4",
								"value": 3
							},

							{
								"label": "data5",
								"value": 3
							}
							]	
	}}}},
	
	// Stacked Area Graph
	{
	"chart" : 
	 {
		"type" : "area",
		"group"       :  "Scatter, Wedge and Area Graphs",
		"name"  	  :  "Stacked Area Graph",
		"description" :  "Simple Area Graph Representation",

		"content" :	{	
				"chart" : "css/images/",
				"jsoncontent": {
							"caption": "Area covered by Sales Persons",
							"yAxisName": "Names",
							"xAxisName": "Sales Figure",
							"toolTip": 1,
							"width": 500,
							"height": 500,
							"palette": 1,
							"type": "b",
							 "data": [{
									"x": 3,
									"y": 1.3
							},
							{
									"x": 2,
									"y": 4
							},
							{
									"x": 2,
									"y": 1.0
							},
							{
									"x": 3,
									"y": 1.5
							},

							{
									"x": 3,
									"y": 1.3
							}
							]
	}}}}
	
	// Tree Graph
	/*{
	"chart" : 
	 {
		"type" : "tree",
		"group"       :  "Misc",
		"name"  	  :  "Tree Graph",
		"description" :  "Tree Graph or Node Link Representation",

		"content" :	{	
				"chart" : "css/images/",
				"jsoncontent": {
							"caption": "Tree and Node Graph",
							"yAxisName": "Names",
							"xAxisName": "Sales Figure",
							"toolTip": 1,
							"width": 500,
							"height": 500,
							"palette": 1,
							"type": "b",
							"root" : "Pramati",
							 "data":{
									"Pramati Technologies":{
										"pnode1":{
											"dept":"server",
											"employees":"80",
											"workingdays":"5"
										},
										"pnode2":{
											"dept":"non-server",
											"employees":"80",
											"workingdays":"6"
										}
									},
									"Imaginea Technologies":{
										"inode1":{
											"dept":"bigmachines",
											"employees":"80",
											"workingdays":"4"
										},
										"inode2":{
											"dept":"leantaas",
											"employees":"80",
											"workingdays":"12"
										}
									},
									"Social Twist":{
										"snode1":{
											"dept":"tell a friend",
											"employees":"80",
											"workingdays":"5"
										},
										"snode2":{
											"dept":"buzz around",
											"employees":"60",
											"workingdays":"3"
										}
									},
									"Qontext":{
										"qnode1":{
											"dept":"chatting",
											"employees":"80",
											"workingdays":"5"
										},
										"qnode2":{
											"dept":"non-chatting",
											"employees":"80",
											"workingdays":"5"
										}
									}
								}	
	}}}}*/
]};
