

/*
	COMPILE js to min files
	https://closure-compiler.appspot.com/home
*/




///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///                                                             ///
///   Lookup Nomenclature from DMLSS for selEquipment element   ///
///                                                             ///
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function GetNomenclature() {

	var fromWho = 'GetNomenclature()';

	try {
		$.ajax({
			url: "ChartDataHandler.ashx",
			cache: false,
			type: "GET",
			data: { 'option': 'GET', 'action': 'GetNomenclature' },
			success: function (data) {
				if (data.length === 0) {
					return "ERROR: No data returned from Handler to GetNomenclature().";
				}
				var i = 0;
				for (i = 0; i < data.length; i++) {
					$('#selEquipment').append("<option realNomen='' value='" + data[i].OptionValue + "'>" + data[i].OptionText + "</option>");
				}

				SelectOptionValue('selEquipment', 'PRINTER');
				gChartNomenclature = "PRINTER";
				SetHiddenElement('', 'PRINTER');
				GetNomenclatureCount('PRINTER');
				
			},
			error: function (request, status, error) {
				LogError(request.status, request.statusText, request.responseText, fromWho);
			}
		});
	}
	catch (err) {
		fromWho += '\n\t\tTry Catch err = ' + err;
		LogError(err.name + ' ' + err.number, err.message, err.description, fromWho);
	}
}


///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///                                                             ///
///                                                             ///
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function GetAsOfDate()
{
	var fromWho = 'GetAsOfDate()';

	try {
		$.ajax({
			url: "ChartDataHandler.ashx",
			cache: false,
			type: "GET",
			data: { 'option': 'GET', 'action': 'GetAsOfDate' },
			success: function (data) {
				if (data.length === 0) {
					return "ERROR: No data returned from Handler to GetAsOfDate().";
				}

				document.getElementById('lblAsOfDate').innerHTML = 'Data as of ' + data;

			},
			error: function (request, status, error) {
				LogError(request.status, request.statusText, request.responseText, fromWho);
			}
		});
	}
	catch (err) {
		fromWho += '\n\t\tTry Catch err = ' + err;
		LogError(err.name + ' ' + err.number, err.message, err.description, fromWho);
	}
}



///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///                                                             ///
/// Get num items of nomenclature select on inventory page      ///
///                                                             ///
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function GetNomenclatureCount(nomenclature)
{
	var fromWho = 'GetNomenclatureCount(' + nomenclature + ')';

	try {
		$.ajax({
			url: "ChartDataHandler.ashx",
			cache: false,
			type: "GET",
			datatype: "json",
			data: { 'option': 'GET', 'action': 'GetNomenclatureCount', 'nomen': nomenclature },
			success: function (count) {
				if (count.length === 0) {
					return "ERROR: No data returned from Handler to GetNomenclatureCount().";
				}

				SetHiddenElement('hidNomenclatureCount', count);
			},
			error: function (request, status, error) {
				LogError(request.status, request.statusText, request.responseText, fromWho);
			}
		});
	}
	catch (err) {
		fromWho += '\n\t\tTry Catch err = ' + err;
		LogError(err.name + ' ' + err.number, err.message, err.description, fromWho);
	}
}




///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///                                                             ///
///   Get count for SCCM or DMLSS nomenclature                  ///
///                                                             ///
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function GetEquipmentCount(table, criteria, dataTable) {
	var fromWho = 'GetEquipmentCount(' + table + ', ' + criteria + ', '+ dataTable + ')';

	try {
		$.ajax({
			url: "ChartDataHandler.ashx",
			cache: false,
			type: "GET",
			data: { 'option': 'GET', 'action': 'GetEquipmentCount', 'table': table, 'criteria': criteria, 'dataTable': dataTable },
			success: function (cnt) {
				if (cnt.length === 0) {
					return "ERROR: No data returned from Handler to GetEquipmentCount().";
				}

				$('#txtCount').val('DMLSS ' + criteria + ' INVENTORY DATA - ' + cnt + ' TOTAL');
			},
			error: function (request, status, error) {
				LogError(request.status, request.statusText, request.responseText, fromWho);
			}
		});
	}
	catch (err) {
		fromWho += '\n\t\tTry Catch err = ' + err;
		LogError(err.name + ' ' + err.number, err.message, err.description, fromWho);
	}
}


///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///                                                             ///
///                                                             ///
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function GetSccmChartTable(table, criteria, title)
{
	var fromWho = 'GetSccmChartTable()';

	try {
		$.ajax({
			url: "ChartDataHandler.ashx",
			cache: false,
			type: "GET",
			data: { 'option': 'GET', 'action': 'GetSccmChartTable', 'table': table, 'criteria': criteria, 'dataTable': dataTable },
			success: function (dataTable) {
				if (cnt.length === 0) {
					return "ERROR: No data returned from Handler to GetEquipmentCount().";
				}
				
				// Draw chart for Nomenclature chosen     
				google.charts.load('current', { 'packages': ['corechart'] });
				google.charts.setOnLoadCallback(DrawSccmChart(title));
			},
			error: function (request, status, error) {
				LogError(request.status, request.statusText, request.responseText, fromWho);
			}
		});
	}
	catch (err) {
		fromWho += '\n\t\tTry Catch err = ' + err;
		LogError(err.name + ' ' + err.number, err.message, err.description, fromWho);
	}
}


///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///                                                             ///
///         Get data for fisrt chart after a selection          ///
///                                                             ///
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function GetDmlssChartTable(nomenclature, title)
{
	var fromWho = 'GetDmlssChartTable(title, criteria)';

	try {
		$.ajax({
			url: "ChartDataHandler.ashx",
			cache: false,
			type: "GET",
			data: { 'option': 'GET', 'action': 'GetDmlssChartTable', 'nomenclature': nomenclature },
			success: function (dataTable) {
				if (dataTable.length === 0 || dataTable === undefined) {
					return "ERROR: No data returned from Handler to GetDmlssChartTable().";
				} 

				// Draw chart for Nomenclature chosen     
				google.charts.load('current', { 'packages': ['corechart'] });
				google.charts.setOnLoadCallback(DrawDmlssChart(title, dataTable));
			},
			error: function (request, status, error) {
				LogError(request.status, request.statusText, request.responseText, fromWho);
			}
		});
	}
	catch (err) {
		fromWho += '\n\t\tTry Catch err = ' + err;
		LogError(err.name + ' ' + err.number, err.message, err.description, fromWho);
	}
}


///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///                                                             ///
/// Get data for 2nd chart after selection on 1st chart         ///
///                                                             ///
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function GetDmlssDrillChartTable(nomen, manu) {
	
	if (nomen === manu)
		alert('GetDmlssDrillChartTable ' + nomen + ' = ' + manu);

	var fromWho = 'GetDmlssDrillChartTable(manu, nomen)';
	chartManufacturer = manu;

	try {
		$.ajax({
			url: "ChartDataHandler.ashx",
			cache: false,
			type: "GET",
			data: { 'option': 'GET', 'action': 'GetDmlssDrillChartTable', 'nomenclature': nomen, 'manu': manu },
			success: function (dataTable)
			{
				if (dataTable.length === 0 || dataTable === undefined) {
					return "ERROR: No data returned from Handler to GetDmlssDrillChartTable().";
				}

				// Draw chart for Nomenclature chosen     
				google.charts.load('current', { 'packages': ['corechart'] });
				google.charts.setOnLoadCallback(DrawDmlssDrillChart(manu, dataTable));

			},
			error: function (request, status, error) {
				LogError(request.status, request.statusText, request.responseText, fromWho);
			}
		});
	}
	catch (err) {
		fromWho += '\n\t\tTry Catch err = ' + err;
		LogError(err.name + ' ' + err.number, err.message, err.description, fromWho);
	}
}

///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///                                                             ///
/// Get the data for a dynamic grid after user selects slice on ///
/// the second chart                                            ///
///     0 = get manufacturer                                    ///
///     1 = get all model data                                  ///
///     2 = get all nomenclature data                           ///
///                                                             ///
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function GetDmlssGridData(manu, model, nomen, all, sortBy)
{
	var fromWho = "GetDmlssGridData(" + manu + ', ' + model + ', ' + nomen + ', ' + all + ', ' + sortBy + ')';

	gChartNomenclature = nomen;
	gChartModel = model;
	gChartManufacturer = manu;

	try {
		$.ajax({
			url: "ChartDataHandler.ashx",
			cache: false,
			type: "GET",
			data: {
				'option': 'GET',
				'action': 'GetDmlssGridData',
				'manu': gChartManufacturer,
				'nomen': gChartNomenclature,
				'model': gChartModel,
				'all': all,
				'sortBy': sortBy
			},
			success: function (dataTable) {
				if (dataTable.length === 0 || dataTable === undefined) {
					return "ERROR: No data returned from Handler to GetDmlssGridData().";
				}

				// Remove dvDmlssContent if exists   
				if ($('#dvDmlssContent').length > 0)
					$('#dvDmlssContent').remove();

				var newDiv = document.createElement('div');
				newDiv.setAttribute('id', 'dvDmlssContent');
				newDiv.setAttribute('height', '100%');
				newDiv.setAttribute('width', '100%');

				// Add div dvDmlssContent to dvDmlssData     
				var parent = document.getElementById('dvDmlssData');
				parent.appendChild(newDiv);

				// Append html data to dvDmlssContent        
				var appendText = "";
				var i = 0;

				for(i = 0; i < dataTable.length; i++)
				{
					DmlssGridData.ECN = dataTable[i].ECN;												
					DmlssGridData.Manufacturer = dataTable[i].Manufacturer;
					DmlssGridData.Model = dataTable[i].Model;										
					DmlssGridData.Nomenclature = dataTable[i].Nomenclature;
					DmlssGridData.Custodian = dataTable[i].Custodian;						
					DmlssGridData.Customer = dataTable[i].Customer;							
					DmlssGridData.CustomerID = dataTable[i].CustomerID;					

					// apply id for each row to use in delegate 
					var row = 'dvRow' + i.toString().trim();
					if(i % 2)
						appendText += "<div id='" + row + "' class='highlightRow div-Rows'>";
					else
						appendText += "<div id='" + row + "' class='div-Rows'>";

					// apply id to each column to use in delegate 
					var colID = 'col' + i.toString().trim();
					var ecnSpan = "<span onclick='ecnSpanClick(this)'; id='r" + i + "-c1' class='col-Ecn'>" + DmlssGridData.ECN + "</span>";
					var span = "<span id='r" + i + "-c";

					appendText += ecnSpan;
					appendText += span + "2' class='col-Manufacturer'>" + DmlssGridData.Manufacturer + "</span>";
					appendText += span + "3' class='col-Model'>" + DmlssGridData.Model + "</span>";
					appendText += span + "4' class='col-Nomenclature'>" + DmlssGridData.Nomenclature + "</span>";
					appendText += span + "5' class='col-Custodian'>" + DmlssGridData.Custodian + "</span>";
					appendText += span + "6' class='col-Customer'>" + DmlssGridData.Customer + "</span>";
					appendText += span + "7' class='col-CustomerID'>" + DmlssGridData.CustomerID + "</span>";

					$(appendText).appendTo('#dvDmlssContent').val();

					appendText = "";
				}

				appendText = appendText += "</div></div>";

				$(appendText).appendTo('#dvDmlssData').val();

				console.log($('#dvDmlssData').innerHTML);
			},
			error: function (request, status, error) {
				LogError(request.status, request.statusText, request.responseText, fromWho);
			}
		});
	}
	catch (err) {
		fromWho += '\n\t\tTry Catch err = ' + err;
		LogError(err.name + ' ' + err.number, err.message, err.description, fromWho);
	}
}



///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///                                                             ///
/// Get the data for a dynamic grid after user selects slice on ///
/// the second chart                                            ///
///     0 = get manufacturer                                    ///
///     1 = get all model data                                  ///
///     2 = get all nomenclature data                           ///
///                                                             ///
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function GetSccmGridData(manu, model, nomen, all, sortBy)
{
	var fromWho = "GetSccmGridData(" + manu + ', ' + model + ', ' + nomen + ', ' + all + ', ' + sortBy + ')';

	gChartNomenclature = nomen;
	gChartModel = model;
	gChartManufacturer = manu;

	try {
		$.ajax({
			url: "ChartDataHandler.ashx",
			cache: false,
			type: "GET",
			data: {
				'option': 'GET',
				'action': 'GetSccmGridData',
				'manufacturer': gChartManufacturer,
				'nomenclature': gChartNomenclature,
				'model': gChartModel,
				'all': all,
				'sortBy': sortBy
			},
			success: function (dataTable) {
				if (dataTable.length === 0 || dataTable === undefined) {
					return "ERROR: No data returned from Handler to GetDmlssGridData().";
				}

				// Remove dvSccmContent if exists   
				if ($('#dvSccmContent').length > 0)
					$('#dvSccmContent').remove();

				var newDiv = document.createElement('div');
				newDiv.setAttribute('id', 'dvSccmContent');
				newDiv.setAttribute('height', '100%');
				newDiv.setAttribute('width', '100%');

				// Add div dvSccmContent to dvSccmData     
				var parent = document.getElementById('dvSccmData');
				parent.appendChild(newDiv);

				// Append html data to dvSccmContent        
				var appendText = "";
				var i = 0;

				for (i = 0; i < dataTable.length; i++) {
					SccmGridData.ECN = dataTable[i].ECN;
					SccmGridData.Manufacturer = dataTable[i].Manufacturer;
					SccmGridData.Model = dataTable[i].Model;
					SccmGridData.Nomenclature = dataTable[i].Nomenclature;
					SccmGridData.Custodian = dataTable[i].Custodian;
					SccmGridData.Customer = dataTable[i].Customer;
					SccmGridData.CustomerID = dataTable[i].CustomerID;

					// apply id for each row to use in delegate 
					var row = 'dvRow' + i.toString().trim();
					if (i % 2)
						appendText += "<div id='" + row + "' class='highlightRow div-Rows'>";
					else
						appendText += "<div id='" + row + "' class='div-Rows'>";

					// apply id to each column to use in delegate 
					var colID = 'col' + i.toString().trim();
					var ecnSpan = "<span onclick='snnSpanClick(this)'; id='r" + i + "-c1' class='col-Sn'>" + SccmGridData.ECN + "</span>";
					var span = "<span id='r" + i + "-c";

					appendText += ecnSpan;
					appendText += span + "2' class='col-Manufacturer'>" + SccmGridData.Manufacturer + "</span>";
					appendText += span + "3' class='col-Model'>" + SccmGridData.Model + "</span>";
					appendText += span + "4' class='col-Nomenclature'>" + SccmGridData.Nomenclature + "</span>";
					appendText += span + "5' class='col-Custodian'>" + SccmGridData.Custodian + "</span>";
					appendText += span + "6' class='col-Customer'>" + SccmGridData.Customer + "</span>";
					appendText += span + "7' class='col-CustomerID'>" + SccmGridData.CustomerID + "</span>";

					$(appendText).appendTo('#dvSccmContent').val();

					appendText = "";
				}

				appendText = appendText += "</div></div>";
				$(appendText).appendTo('#dvSccmData').val();
  			console.log($('#dvSccmData').innerHTML);

			},
			error: function (request, status, error) {
				LogError(request.status, request.statusText, request.responseText, fromWho);
			}
		});
	}
	catch (err) {
		fromWho += '\n\t\tTry Catch err = ' + err;
		LogError(err.name + ' ' + err.number, err.message, err.description, fromWho);
	}
}


///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///          Display search results dynamically on page            
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function ListSearchResults(data, rowCount, searchType)
{
	var parentDiv = '';
	var oldDiv = '';

	if (searchType === 'ECN') {
		parentDiv = document.getElementById('dv_EcnSearchResults');
		// Remove dv_EcnSearchData if exists   
		oldDiv = document.getElementById('dv_EcnSearchData');
	}

	if (searchType === 'SN') {
		parentDiv = document.getElementById('dv_SnSearchResults');
		// Remove dv_SnSearchData if exists   
		oldDiv = document.getElementById('dv_SnSearchData');
	}

	if (oldDiv !== null) 
		parentDiv.removeChild(oldDiv);
	


	// Create new div 
	var newDiv = document.createElement('div');
	if(searchType ==='ECN')
		newDiv.setAttribute('id', 'dv_EcnSearchData');
	else
		newDiv.setAttribute('id', 'dv_SnSearchData');

	newDiv.style.paddingLeft = "50px";
	newDiv.style.marginTop = "5px";
	newDiv.style.marginLeft = "20px";
	newDiv.style.width = "1700px";
	newDiv.style.height = "auto";

	// Add div dv_EcnSearchData to dv_EcnSearchResults     
	parentDiv.appendChild(newDiv);

	var appendText = "";
	var i = 0;

	HideAsOfDate();

	// resize dv_EcnSearchResults if more than 1 result is returned 
	if (rowCount > 1) {
		var h1 = 650;
		var h2 = 0;

		if (rowCount === 2 && searchType === 'ECN') {
			$('#SearchEcnSection').css('height', h1.toString().trim() + 'px');
		} 
		if (rowCount === 2 && searchType === 'SN') {
			$('#SearchSnSection').css('height', h1.toString().trim() + 'px');
		}

		if (rowCount > 2 && searchType === 'ECN') {
			h1 += (rowCount * 83);
			$('#SearchEcnSection').css('height', h1.toString().trim() + 'px');
		}
		if (rowCount > 2 && searchType === 'SN') {
			h1 += (rowCount * 83);
			$('#SearchSnSection').css('height', h1.toString().trim() + 'px');
		}

		if (rowCount > 3) {
			if(searchType === 'ECN')
				$('#SearchEcnSection').css('height', h1.toString().trim() + 'px');
			if (searchType === 'SN')
				$('#SearchSnSection').css('height', h1.toString().trim() + 'px');
		}
	}


	for (i = 0; i < rowCount; i++) {
		// apply id for each row to use in delegate 
		var row = 'dvRow' + i.toString().trim();
		appendText += "<div id='" + row + "' class='div-SearchRows'>";

		// apply id to each column to use in delegate 
		var colID = 'col' + i.toString().trim();

		/////////////////////////////////////// DIVS not SPANS     
		appendText += "<div class='newDiv' >";
		appendText += "<div class='newCol spanFirst topBorder leftBorder' ><label id='lblDmlssCol1' >ECN : " + data.ECN[i] + "</label></div>";
		appendText += "<div class='newCol spanAlternate topBorder Border'><label id='lblDmlssCol2' >Serial : " + data.MfrSerialNo[i] + "</label></div>";
		appendText += "<div class='newCol spanFirst topBorder leftBorder'><label id='lblDmlssCol3' >Manufacturer : " + data.Manufacturer[i] + "</label></div>";
		appendText += "<div class='newCol spanAlternate topBorder leftBorder rightBorder' style='border-right: 1px solid rgb(71,5,31);'><label id='lblDmlssCol4' >Nomenclature : " + data.Nomenclature[i] + "</label></div><br/>";

		appendText += "<div class='newCol spanFirst leftBorder'><label id='lblDmlssCol5' >Model : " + data.Model[i] + "</label></div>";
		appendText += "<div class='newCol spanAlternate leftBorder'><label id='lblDmlssCol6' >Common Model : " + data.CommonModel[i] + "</label></div>";
		appendText += "<div class='newCol spanFirst leftBorder'><label id='lblDmlssCol7' >Ownership : " + data.Ownership[i] + "</label></div>";
		appendText += "<div class='newCol spanAlternate leftBorder rightBorder' style='border-right: 1px solid rgb(71,5,31);'><label id='lblDmlssCol8' >ID : " + data.ID[i] + "</label></div><br/>";

		appendText += "<div class='newCol spanFirst leftBorder'><label id='lblDmlssCol9' >Customer : " + data.Customer[i] + "</label></div>";
		appendText += "<div class='newCol spanAlternate leftBorder'><label id='lblDmlssCol10' >Customer ID : " + data.CustomerID[i] + "</label></div>";
		appendText += "<div class='newCol spanFirst leftBorder'><label id='lblDmlssCol11' >Custodian : " + data.Custodian[i] + "</label></div>";
		appendText += "<div class='newCol spanAlternate leftBorder rightBorder' style='border-right: 1px solid rgb(71,5,31);'><label id='lblDmlssCol12' >Org Name : " + data.OrgName[i] + "</label></div><br/>";

		appendText += "<div class='newCol spanFirst leftBorder bottomBorder'><label id='lblDmlssCol13' >Location : " + data.Location[i] + "</label></div>";
		appendText += "<div class='newCol spanAlternate leftBorder bottomBorder'><label id='lblDmlssCol14' >Acq Date : " + data.AcqDate[i] + "</label></div>";
		appendText += "<div class='newCol spanFirst leftBorder bottomBorder'><label id='lblDmlssCol15' >Acq Cost : " + data.AcqCost[i] + "</label></div>";
		appendText += "<div class='newCol spanAlternate leftBorder bottomBorder rightBorder' style='border-right: 1px solid rgb(71,5,31);'><label id='lblDmlssCol16' >Life Exp : " + data.LifeExp[i] + "</label></div><br/>";

		appendText += "</div>";

		// when you have more than one search criteria 
		// you will have more than one data set        
		if (rowCount > 1)
			appendText += "<br/><br/>";

		// add the html to the div 
		if(searchType === 'ECN')
			$(appendText).appendTo('#dv_EcnSearchData').val();
		if (searchType === 'SN')
			$(appendText).appendTo('#dv_SnSearchData').val();

		// reset for new row  
		appendText = "";
	}

	// close divs  
	appendText += "</div></div>";

	if (searchType === 'ECN')
		$(appendText).appendTo('#dv_EcnSearchData').val();
	if (searchType === 'SN')
		$(appendText).appendTo('#dv_SnSearchData').val();
}


///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///                                                             ///
/// Build table to act as grid. Use AJAX to fill object with    ///
/// data needed for columns before calling this function.       ///
///                                                             ///
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function BuildDynamicTable(dataDiv, tableName)
{
	var i = 0;
	var div = '#' + dataDiv;

	$(div).each(function () {
		var dvName = $(this).attr('id');

		if (dataDiv === tableName) {

			$(this).find('label').each(function () {
				$element = $(this);

				var txtBox = $element.children('input[type="text"]');
				var txtName = $element[0].attributes[1].value;

				var txtArea = $element.children('textarea');
				var drp = $element.children('select');
				var html = "<span class='readonly-data' ";
				var id = '';

				if (txtBox.length > 0) {
					if (showedit)
						txtBox.show();
					else {
						id = 'spn' + txtBox.attr('id').substring(3);
						html += "id='" + id + "'>" + txtBox.val().replace(/\'/, "\'") + '</span>';
						txtBox.hide();
						$(this).append(html);
					}
				}
				else if (txtArea.length > 0) {
					if (showedit) {
						txtArea.show();
					}
					else {
						id = 'spn' + txtArea.attr('id').substring(3);
						html += "id='" + id + "'>" + txtArea.html().replace(/\n/gm, "<br />") + '</span>';
						txtArea.hide();
						$(this).append(html);
					}
				}
				else if (drp.length > 0) {
					if (drp.attr('skip') === void 0) {
						if (showedit)
							drp.show();
						else {
							var selValue = drp.children('option:selected').text();

							id = 'spn' + drp.attr('id').substring(3);
							selValue = selValue.length === 0 ? '' : selValue;

							html += "id='" + id + "'>" + selValue + '</span>';
							drp.hide();
							$(this).append(html);
						}
					}
				}
			});
		}
	});
}





