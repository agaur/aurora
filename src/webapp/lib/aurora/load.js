$(document).ready(function() { 
$('.chart-tabs-tabs a').click(function(){
	switch_tabs($(this));
});

switch_tabs($('.defaulttab'));
//select all the a tag with name equal to modal
$('button[name=modal],div[name=modal]').click(function(e) {
	//Cancel the link behavior
	e.preventDefault();
	
	//Get the A tag
	var id = $(this).attr('id');

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

});    

function switch_tabs(obj) {
$('.chart-tabs-tab-content').hide();
$('.chart-tabs-tabs a').removeClass("selected");
var id = obj.attr("rel");

$('#'+id).show();
obj.addClass("selected");
} 

var chartJSON = {
	
	"charter" : [{
	// 
	"chart" : [
	 {
		"type" : "hbar",
		"content" :	[{	
				"chart" : "chart-image-url",
				"jsoncontent": [{
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
	}]}]}]},
	
	// ============== Vertical Bar Graph ============
	{
	"chart" : [
	 {
		"type" : "vbar",
		"content" :	[{	
				"chart" : "chart-image-url",
				"jsoncontent": [{
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
	}]}]}]},
	
	// ======== Multi Line Horizontal ========
	{
	"chart" : [
	 {
		"type" : "mhbar",
		"content" :	[{	
				"chart" : "chart-image-url",
				"jsoncontent": [{
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
	}]}]}]},
	{
	// ============ MultiLine Vertical ==========
	"chart" : [
	 {
		"type" : "mvbar",
		"content" :	[{	
				"chart" : "chart-image-url",
				"jsoncontent": [{
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
	}]}]}]},
	
	// Line Graph Dots 
	{
	"chart" : [
	 {
		"type" : "pline",
		"content" :	[{	
				"chart" : "chart-image-url",
				"jsoncontent": [{
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
	}]}]}]},
	
	// Simple Line Graph
	{
	"chart" : [
	 {
		"type" : "sline",
		"content" :	[{	
				"chart" : "chart-image-url",
				"jsoncontent": [{
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
	}]}]}]},
	
	// Multi Line Graph
	{
	"chart" : [
	 {
		"type" : "mline",
		"content" :	[{	
				"chart" : "chart-image-url",
				"jsoncontent": [{
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
	}]}]}]},
	
	// Line Graph Step
	{
	"chart" : [
	 {
		"type" : "stline",
		"content" :	[{	
				"chart" : "chart-image-url",
				"jsoncontent": [{
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
	}]}]}]},
	
	// Bubble Graph
	{
	"chart" : [
	 {
		"type" : "bubble",
		"content" :	[{	
				"chart" : "chart-image-url",
				"jsoncontent": [{
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
	}]}]}]},
	
	// Pie Graph
	{
	"chart" : [
	 {
		"type" : "pie",
		"content" :	[{	
				"chart" : "chart-image-url",
				"jsoncontent": [{
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
	}]}]}]},
	
	// Donut Graph
	{
	"chart" : [
	 {
		"type" : "donut",
		"content" :	[{	
				"chart" : "chart-image-url",
				"jsoncontent": [{
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
	}]}]}]},
	
	// Stacked Area Graph
	{
	"chart" : [
	 {
		"type" : "area",
		"content" :	[{	
				"chart" : "chart-image-url",
				"jsoncontent": [{
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
	}]}]}]},
	
	// Tree Graph
	{
	"chart" : [
	 {
		"type" : "tree",
		"content" :	[{	
				"chart" : "chart-image-url",
				"jsoncontent": [{
							"caption": "Tree and Node Graph",
							"yAxisName": "Names",
							"xAxisName": "Sales Figure",
							"toolTip": 1,
							"width": 500,
							"height": 500,
							"palette": 1,
							"type": "b",
							"root" : "Pramati",
							"data" : [
								{
									"Pramati Technologies" : [
										{
											"dept" : "server", 
											"employees":"80", 
											"workingdays":"5"
										}, 
										{
											"dept" : "non-server", 
											"employees":"80", 
											"workingdays":"6"
										}
									]
								},
								{
									"Imaginea Technologies" : [
										{
											"dept" : "bigmachines", 
											"employees":"80", 
											"workingdays":"4"
										}, 
										{
											"dept" : "leantaas", 
											"employees":"80", 
											"workingdays":"12"
										}
									]
								},
								{
									"Social Twist" : [
										{
											"dept" : "tell a friend", 
											"employees":"80", 
											"workingdays":"5"
										}, 
										{
											"dept" : "buzz around", 
											"employees":"60", 
											"workingdays":"3"
										}
									]
								},
								{
									"Qontext" : [
										{
											"dept" : "chatting", 
											"employees":"80", 
											"workingdays":"5"
										},
										{
											"dept" : "non-chatting", 
											"employees":"80", 
											"workingdays":"5"
										}
									]
								}	
							]
	}]}]}]}
]};
