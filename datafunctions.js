

/*
	COMPILE js to min files
	https://closure-compiler.appspot.com/home
*/




///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///   Lookup distinct Nomenclature from DMLSS table                
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

				for (var i = 0; i < data.length; i++) {
					$('#selEquipment').append("<option value='" + data[i].OptionValue + "'>" + data[i].OptionText + "</option>");
				}

				SelectOptionValue('selEquipment', 'PRINTER');
				GetModelCount('PRINTER');
				
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
/// Get num items of nomenclature select on inventory page         
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function GetModelCount(nomenclature)
{
	var fromWho = 'GetModelCount(' + nomenclature + ')';

	try {
		$.ajax({
			url: "ChartDataHandler.ashx",
			cache: false,
			type: "GET",
			datatype: "json",
			data: { 'option': 'GET', 'action': 'GetModelCount', 'model': nomenclature },
			success: function (count) {
				if (count.length === 0) {
					return "ERROR: No data returned from Handler to GetModelCount().";
				}
				SetHiddenElement('hidModelCount', count);
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
///   Get count for SCCM or DMLSS nomenclature                     
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
				$('#txtCount').val('DMLSS '+ criteria + ' INVENTORY DATA - ' + cnt + ' TOTAL');
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
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function GetSccmChartTable (table, criteria, title) {
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
				
				// Draw Chart 
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
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function GetDmlssChartTable(nomenclature, title)
{
	var fromWho = 'GetDmlssChartTable(table, criteria)';

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
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function GetDmlssDrillChartTable(manu, nomen) {

	var fromWho = 'GetDmlssDrillChartTable(manu, nomen)';

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
///
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function GetDmlssGridData()
{
	try {
		$.ajax({
			url: "ChartDataHandler.ashx",
			cache: false,
			type: "GET",
			data: { 'option': 'GET', 'action': 'GetDmlssGridData' },
			success: function (dataTable) {
				if (dataTable.length === 0 || dataTable === undefined) {
					return "ERROR: No data returned from Handler to GetDmlssGridData().";
				}
				
				var appendText;

				for(var i = 0; i < dataTable.length; i++)
				{
					DmlssGridData.ECN = dataTable[i]["ECN"];
					DmlssGridData.Manufacturer = dataTable[i]["Manufacturer"];
					DmlssGridData.Model = dataTable[i]["Model"];
					DmlssGridData.Nomenclature = dataTable[i]["ECNNomenclature"];
					DmlssGridData.Custodian = dataTable[i]["Custodian"];
					DmlssGridData.Customer = dataTable[i]["Customer"];
					DmlssGridData.CustomerID = dataTable[i]["CustomerID"];

					// Draw grid from data
					appendText = "  <div class='.div-DmlssData' style='margin-left: 3px; width: 40px;'>" + DmlssGridData.ECN + "</div>";
					appendText += "  <div class='.div-DmlssData' style='width: 350px;'>" + DmlssGridData.Manufacturer + "</div>";
					appendText += "  <div class='.div-DmlssData' style='width: 155px;'>" + DmlssGridData.Model + "</div>";
					appendText += "  <div class='.div-DmlssData' style='width: 420px;'>" + DmlssGridData.Nomenclature + "</div>";
					appendText += "  <div class='.div-DmlssData' style='width: 400px;'>" + DmlssGridData.Custodian + "</div>";
					appendText += "  <div class='.div-DmlssData' style='width: 250px;'>" + DmlssGridData.Customer + "</div>";
					appendText += "  <div class='.div-DmlssData' style='width: 120px;'>" + DmlssGridData.CustomerID + "</div>";
					appendText += "<br />";

					$(appendText).appendTo('#dvDmlssData').val();

					appendText = "";

				}
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
/// Build table to act as grid. Use AJAX to fill object with       
/// data needed for columns before calling this function.          
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
