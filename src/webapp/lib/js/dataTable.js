function DataTable(selector, options){
	var self = this;
	self.defaults = {
		type: "json",
		multiSelect : false,
		hoverClass: "datatable-highlight",
		selectedRowClass: "datatable-selected",
		hoveringRow: true,
		clickRow: true
	}
	jQuery.extend(self.defaults, options );
	self.context = jQuery(selector);
	//self.dataTableHeader = jQuery("<div class='data-table-header'></div>");
	self.dataTable = jQuery('<table cellspacing="0" cellpadding="0" class="datatable-grid"></table>');
	self.dataTableHeader = jQuery('<thead></thead>');
	self.dataTableBody = jQuery('<tbody></tbody>');
	self.dataTableFoot = jQuery('<tfoot></tfoot>');
	//self.dataTableHeader.append(self.dataTable);
	self.dataTable.append(self.dataTableHeader);
	self.dataTable.append(self.dataTableBody);
	self.dataTable.append(self.dataTableFoot);
	self.context.append(self.dataTable);
	self.columnDefaultSettings = {	"sortable" :true,
									"datatype" :"string",
									"resize"   : false,
									"width"    :100	,
									"align"	   :"center",
									"className"    :""
								};
	self.rowDefaultSettings = {	"sortable" :true,
								"resize"   : false,
								"width"    :100	,
								"align"	   :"center",
								"className"    :""
							  };	
	//self.mainColumnHeaders = {};
}

DataTable.prototype = {

    /*** **
	     *****
	  
	    [{header:"",sortby:"",datatype:"",subcolumnnames:[{},{}]},
	    {header:"",sortable:false,datatype:"",subcolumnnames:[{},{}]}]
	 
	  *****
	****  ***/
	columnHeaders: function(column_headers){
	
		var self = this, columnsArr = [];
		self.column_headers=column_headers;
		columnsArr.push(self.prepareColumnHeaders(column_headers,0));
		self.dataTableHeader.append(columnsArr.join(""));
		self.setMainColumns();
		
		return self;
	},
	
	setMainColumns : function(){
		var self = this;
		self.mainColumns=[];
		function setMainColumns(columns) {
			jQuery.each(columns, function(ind,val){
				if(val.subcolumnnames) {
					setMainColumns(val.subcolumnnames);
				} else {
					self.mainColumns.push({header:val.header, className:val.className});
				}
			});
		}
		setMainColumns(self.column_headers);	
	
	},
	
	prepareColumnHeaders: function(column_headers,level){
	    var self = this, columnsArr = [], subColumns = []; 
		columnsArr.push("<tr>");
		//self.mainColumnHeaders["level_"+level] = [];
		jQuery.each(column_headers, function(ind,val){
			var defaultOptions = self.columnDefaultSettings, colspan, collapseIcon ="" ;
			defaultOptions = jQuery.extend({},defaultOptions , val);
			if(defaultOptions.subcolumnnames) {
				subColumns = subColumns.concat(defaultOptions.subcolumnnames);
				//self.mainColumnHeaders["level_"+level].push({level:(level+1)});
			} else {
				//self.mainColumnHeaders["level_"+level].push({header:defaultOptions.header, className:defaultOptions.className});
			}
			columnsArr.push("<th colspan='"+(defaultOptions.cols || 1)+"' rowspan='"+(defaultOptions.rows || 1)+"' label='"+defaultOptions.header+"' info='"+ind+"' class='data-table-header-cell data-table-column-"+ind+" "+defaultOptions.className+"'>");
			columnsArr.push("<span>");
			columnsArr.push(defaultOptions.header);
			columnsArr.push("</span>");
			columnsArr.push("</th>");
		});
		columnsArr.push("</tr>");
		if(subColumns.length>0){
			columnsArr.push(self.prepareColumnHeaders(subColumns,level++));
		}
		return columnsArr.join("");
	},	
	
	setMainRows : function(){
		var self = this;
		self.mainRows=[];
		function setMainRows(rows) {
			jQuery.each(rows, function(ind,val){
				if(val.subrownames) {
					setMainRows(val.subrownames);
				} else {
					self.mainRows.push({header:val.header, className:val.className});
				}
			});
		}
		setMainRows(self.row_headers);	
	
	},
	
	rowHeaders: function(row_headers){
		var self = this, rowsArr = [];
		self.row_headers=row_headers;
		rowsArr.push(self.prepareRowHeaders(row_headers,0));
		self.dataTableBody.append(rowsArr.join(""));
		self.setMainRows();
		
		return self;
	},	
	
	prepareRowHeaders: function(row_headers){
	    var self = this, rowsArr = []; 
		function subRows(sub_rows){
			var rowsArr = [];
			jQuery.each(sub_rows, function(ind,val){
					if (ind === 0){
						rowsArr.push("<th colspan='"+(val.cols || 1)+"' rowspan='"+(val.rows || 1)+"' label='"+val.header+"' info='"+ind+"' class='data-table-header-row data-table-row-"+ind+" "+val.className+"'>");
						rowsArr.push("<span>");
						rowsArr.push(val.header);
						rowsArr.push("</span>");
						rowsArr.push("</th>");
				   }
					
					if(val.subrownames) {						
						rowsArr.push(subRows(val.subrownames));
					} else {
						if (ind === 0){
							rowsArr.push(fillColumns(val.header, val.className));
							rowsArr.push("</tr>");
						} else {
							rowsArr.push(self.prepareRowHeaders([val]));
						}
					}				
			});
			return rowsArr.join("");
		}
		function fillColumns(rowName,rowclass) {
		    if(!self.mainColumns) return false;
			var colsArr = [];
			jQuery.each(self.mainColumns, function(ind,val){
			    if(ind === 0) {return;}
				colsArr.push("<td info='"+val.header+"_"+rowName+"' parentclasses ='"+val.className+"_"+rowclass+"'></td>");
			});
			return colsArr.join("");
		}
		jQuery.each(row_headers, function(ind,val){
			var defaultOptions = self.rowDefaultSettings;
			
			defaultOptions = jQuery.extend({},defaultOptions , val);
			rowsArr.push("<tr label='"+defaultOptions.header+"'>");
			rowsArr.push("<th colspan='"+(defaultOptions.cols || 1)+"' rowspan='"+(defaultOptions.rows || 1)+"' label='"+defaultOptions.header+"' info='"+ind+"' class='data-table-header-row data-table-row-"+ind+" "+defaultOptions.className+"'>");
			rowsArr.push("<span>");
			rowsArr.push(defaultOptions.header);
			rowsArr.push("</span>");
			rowsArr.push("</th>");
			if(defaultOptions.subrownames) {
				rowsArr.push(subRows(defaultOptions.subrownames));				
			} else {
				rowsArr.push(fillColumns(defaultOptions.header, defaultOptions.className));
				rowsArr.push("</tr>");
			}
				
		});		
		
		return rowsArr.join("");
	},
     
    findColumns : function(cell_styles) {
		var self = this, requiredCells;
		if(cell_styles.rowHeader && cell_styles.columnHeader) {
			requiredCells = self.dataTableBody.find("td[info='"+cell_styles.columnHeader+"_"+cell_styles.rowHeader+"']");
		} else if(cell_styles.rowHeader && cell_styles.columnIndex) {
			requiredCells = self.dataTableBody.find("td[info$='"+cell_styles.rowHeader+"']:eq("+(cell_styles.columnIndex-1)+")");	
		} else if(cell_styles.rowIndex && cell_styles.columnHeader) {
			requiredCells = self.dataTableBody.find("tr:nth-child("+(parseInt(cell_styles.rowIndex,10))+")>td[info^='"+cell_styles.columnHeader+"']");
		} else if(cell_styles.rowIndex && cell_styles.columnIndex) {
			requiredCells = self.dataTableBody.find("tr:nth-child("+(parseInt(cell_styles.rowIndex,10))+")>td:eq("+(cell_styles.columnIndex-1)+")");
		} else if(cell_styles.rowHeader || cell_styles.rowIndex) {
			//return self.rowStyle(cell_styles);
			if(cell_styles.rowIndex) {
				if(jQuery.isArray(cell_styles.rowIndex)) {
					requiredCells = self.dataTableBody.find("tr").filter(function(index){
						if(jQuery.inArray( index+1, cell_styles.rowIndex ) !==-1) {
							return true;
						}					
					}).find("td");
				} else {
					requiredCells = self.dataTableBody.find("tr:nth-child("+(parseInt(cell_styles.rowIndex,10))+")>td");
				}
			} else if(cell_styles.rowHeader) {
				if(jQuery.isArray(cell_styles.rowHeader)) {
					requiredCells = self.dataTableBody.find("td").filter(function(index){
						var curRowHeaderArr = jQuery(this).attr("info").split("_");
						if(curRowHeaderArr.length>1 && jQuery.inArray( curRowHeaderArr[1], cell_styles.rowHeader ) !==-1) {
							return true;
						}					
					});
				} else {
					requiredCells = self.dataTableBody.find("td[info$='"+cell_styles.rowHeader+"']");	
				}
			}
		} else if(cell_styles.columnHeader || cell_styles.columnIndex) {
			if(cell_styles.columnIndex) {
				if(jQuery.isArray(cell_styles.columnIndex)) {
					requiredCells = self.dataTableBody.find("td").filter(function(index){
						 var curObj = jQuery(this);
						 var curInd = curObj.closest("tr").find("td").index(curObj);
						 if(jQuery.inArray( curInd+1, cell_styles.columnIndex ) !==-1) {
							return true;
						 }
					});
				} else {
					requiredCells = self.dataTableBody.find("tr").find("td:eq("+(parseInt(cell_styles.columnIndex,10)-1)+")");
				}
			} else if(cell_styles.columnHeader) {
				if(jQuery.isArray(cell_styles.columnHeader)) {
					requiredCells = self.dataTableBody.find("td").filter(function(index){
						var curColHeaderArr = jQuery(this).attr("info").split("_");
						if(jQuery.inArray( curColHeaderArr[0], cell_styles.columnHeader ) !==-1) {
							return true;
						}					
					});
				} else {
					requiredCells = self.dataTableBody.find("td[info^='"+cell_styles.columnHeader+"']");	
				}
			}
		} else if(cell_styles.selector){
			requiredCells = self.dataTableBody.find(cell_styles.selector);
		}
        return requiredCells;
	},
	
	/****
	   {
			rowIndex :number (or) [] // either it is string or array - it will start with 1
			(or)
			rowHeader : "" (or) [] // either it is string or array
			style : {"color":"red"} // it should be json format 	   
	   }
	
	****/
	
	
	rowStyle: function(rowStyles){
		var self = this, cells;
		cells = self.findColumns(rowStyles);
		if(cells && cells.size()>0 && rowStyles.style) {
		   cells.css(rowStyles.style);
		}
		return self;
	},
	
	/****
	   {
			columnIndex :number (or) [] // either it is string or array - it will start with 1
			(or)
			columnHeader : "" (or) [] // either it is string or array
			style : {"color":"red"} // it should be json format 	   
	   }
	
	****/
	columnStyle: function(columnStyles){
		var self = this, cells;
		cells = self.findColumns(columnStyles);
		if(cells && cells.size()>0 && columnStyles.style) {
		   cells.css(columnStyles.style);
		}
		return self;
	},
	
	/***
		{
			rowHeader :string,	(or) rowIndex :index,
			columnHeader :string, (or) columnIndex :index,
			selector : html selector name
			style : json object which contains css styles
		
		}
	
	***/
	
	addStyle: function(cell_styles){
		var self = this, requiredCells;
		requiredCells = self.findColumns(cell_styles);
		
		if(requiredCells && requiredCells.size()>0 && cell_styles.style) {
		   requiredCells.css(cell_styles.style);
		}
		return self;
	},
	
	findCellHeaderJson : function(obj,header){
		var requiredObj;
		jQuery.each(obj, function(ind,val){
			if(val.colHeader === header) {
			   requiredObj = val;
			   return false;
			}
		});
		return requiredObj;
	},
	
	addEvent : function(eventName, selectors, cB){
		var self = this;
		var requiredCells = self.findColumns(selectors);
        requiredCells.unbind(eventName, cB).bind(eventName, cB);
		return self;
	},
	
	removeEvent : function(eventName, selectors, cB){
		var self = this;
		var requiredCells = self.findColumns(selectors);
        requiredCells.unbind(eventName, cB);
		return self;
	},
	
	findRowHeader: function(label){
		var self = this, requiredHeader;
		function getRequiredRow(rows) {
			jQuery.each(rows, function(ind,val){
					if(val.header === label) {
						requiredHeader = val;
						return false;
					}
					if(val.subrownames) {
						getRequiredRow(val.subrownames);
					}				
			});
		}
		getRequiredRow(self.row_headers);
		return requiredHeader;		
	},
	
	findChildRows: function(label) {
		var self = this, requiredRows=[];		
		function getMainRows(rows) {
			jQuery.each(rows, function(ind,val){
				if(val.subrownames) {
					getMainRows(val.subrownames);
				} else {
					requiredRows.push("th[label='"+val.header+"']");
				}
			});
		}
		var requiredHeader = self.findRowHeader(label);
		if(!requiredHeader) { return false; }
		if(requiredHeader.subrownames) {
			getMainRows(requiredHeader.subrownames);
		} else {
			requiredRows.push("th[label='"+requiredHeader.header+"']");
		}		
		return jQuery(requiredRows.join(",")).closest("tr");
	},
	
	renderData: function(data){
		var self = this;
		if(self.row_headers && self.column_headers) {
			jQuery.each(data, function(ind,val){
				jQuery.each(val, function(ind2,val2){
					self.dataTableBody.find('td[info="'+val2.colHeader+"_"+val2.rowHeader+'"]').html(val2.colContent);
				});
			});
		} else if(self.column_headers) {
			var bodyContentArr = [];
			jQuery.each(data, function(ind,val){
				bodyContentArr.push("<tr>");
				jQuery.each(self.mainColumns, function(ind2,val2){
					var requiredColumn = self.findCellHeaderJson(val,val2.header);
					bodyContentArr.push("<td info='");
					bodyContentArr.push(requiredColumn.colHeader);
					bodyContentArr.push("' parentclasses ='");
					bodyContentArr.push(val2.className);
					bodyContentArr.push("'>");
					bodyContentArr.push(requiredColumn.colContent);
					bodyContentArr.push("</td>");
				});
				bodyContentArr.push("</tr>");
			});
			self.dataTableBody.append(bodyContentArr.join(""));		
		}
		if(self.defaults.hoveringRow) {
			self.dataTableBody.undelegate("hover").delegate("tr", "hover", function(event){
				var curObj = jQuery(event.target);
				var label  = curObj.is("th")?curObj.attr("label"):curObj.closest("tr").find("th:last").attr("label");
				var requiredRows;
				if(label){requiredRows = self.findChildRows(label);}
				if(!requiredRows) {requiredRows = curObj.closest("tr");}
				if(requiredRows) {requiredRows.toggleClass("datatable-highlight-row").find("td").toggleClass(self.defaults.hoverClass);}
			});
		}
		var allInfo = self.dataTableBody.find("tr,td");
		if(self.defaults.clickRow) {
			self.dataTableBody.undelegate("click").delegate("tr", "click", function(event){
				//event.stop
				allInfo.removeClass(self.defaults.selectedRowClass+" datatable-selected-row");
				var curObj = jQuery(event.target);
				var label  = curObj.is("th")?curObj.attr("label"):curObj.closest("tr").find("th:last").attr("label");
				var requiredRows;
				if(label){requiredRows = self.findChildRows(label);}
				if(!requiredRows) {requiredRows = curObj.closest("tr");}
				if(requiredRows) {requiredRows.toggleClass("datatable-selected-row").find("td").toggleClass(self.defaults.selectedRowClass);}
			});
		}
		return self;
	},
	
	findRow : function(obj){
		var requiredRow;
		if(obj.rowHeader) {
		    requiredRow = self.dataTableBody.find("tr[label='"+obj.rowHeader+"']");
		} else if(obj.rowIndex) {
			requiredRow = self.dataTableBody.find("tr:eq("+(parseInt(obj.rowIndex,10)-1)+")");
		}
		return requiredRow;
	},	
	
	selectRow :function(obj){
		var self = this;
		var requiredRow = self.findRow(obj);
		requiredRow.toggleClass(self.defaults.selectedRowClass);
		return self;
	},
	
	selectColumn :function(obj){
		var self = this;
		var requiredColumn = self.findColumns(obj);
		requiredColumn.toggleClass(self.defaults.selectedRowClass);
		return self;
	},
}