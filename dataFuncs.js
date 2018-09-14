/*jshint sub:true*/


///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///   Get all field names for tables that have select controls     
///   on a page                                                    
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function GetKeySearchSelectValues() {
	fromWho = 'GetKeySearchSelectValues(' + thisPage + ')';

	GetLastNames('selLastName');

	GetKeyNumbers('selKeyNumber');

	GetRoomNumbers('selRoomNumber');

}



///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///   Get all field names for tables that have select controls     
///   on a page                                                    
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function LoadSelects(pageName) {
	fromWho = 'LoadSelects(' + pageName + ')';

	try {
		switch (pageName) {
			case keyIssuesPage:
				GetKeyNumbers('selKeyNumber');
				GetRoomNumbers('selRoomNumber');

				break;

			case keySearchPage:
				GetLastNames('selLastName');
				GetKeyNumbers('selKeyNumber');
				GetRoomNumbers('selRoomNumber');
				break;

			default:
				break;
		}
	}
	catch (err) {
		fromWho += '\n\t\tExternal Try Catch error c = ' + err;
		LogError(err.name + ' ' + err.number, err.message, err.description, fromWho);
	}
}


///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///   Insert all options for a custodian in given select           
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function FillAciveSections(selectElement) {
	fromWho = 'FillActiveSection(' + selectElement + ')';

	try {
		$.ajax({
			cache: false,
			url: "DataHandler.ashx",
			type: "GET",
			data: { 'option': 'GET', 'action': 'GetAciveSections', 'userName': thisUser },
			success: function (options) {
				// Returns Last, First, ID
				if (options.length === 0) {
					LogMiscError('ERROR:NULLAJAX', 'data.length = 0', 'Generic Handler returned no data.', fromWho);
					return;
				}
				// selSections for keysearch page
				// selSections for keyissues page
				for (var i = 0; i < options.length; i++) {
					$('#' + selectElement).append("<option recordid='" + options[i].RecordID + "' value='" + options[i].OptionValue + "'>" + options[i].OptionText + "</option>");
				}
			},
			error: function (request, status, error) {
				LogError(request.status, request.statusText, request.responseText, fromWho);
			}
		});
	}
	catch (err) {
		fromWho += '\n\t\tExternal Try Catch error c = ' + err;
		LogError(err.name + ' ' + err.number, err.message, err.description, fromWho);
	}
}


///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///   Insert custodians for key issues page                        
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function FillCustodians(selectElement) {
	fromWho = 'FillCustodians(' + selectElement + ')';

	try {
		$.ajax({
			cache: false,
			url: "DataHandler.ashx",
			type: "GET",
			data: { 'option': 'GET', 'action': 'GetCustodians', 'sectionID': thisSectionID },
			success: function (options) {
				if (options.length === 0) {
					LogMiscError('ERROR:NULLAJAX', 'options.length = 0', 'Generic Handler returned no data.', fromWho);
					return;
				}

				for (var i = 0; i < options.length; i++) {
					$('#' + selectElement).append("<option recordid='" + options[i].RecordID + "' value='" + options[i].OptionValue + "'>" + options[i].OptionText + "</option>");
				}
			},
			error: function (request, status, error) {
				LogError(request.status, request.statusText, request.responseText, fromWho);
			}
		});
	}
	catch (err) {
		fromWho += '\n\t\tExternal Try Catch error c = ' + err;
		LogError(err.name + ' ' + err.number, err.message, err.description, fromWho);
	}
}



///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///   Get all last names select control on a page and insert       
///   into a given select element                                  
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function FillLastNames(selectElement) {
	fromwho = "FillLastNames(" + selectElement + ")";

	// clear other search options   
	if (thisPage === keySearchPage) {
		setZeroIndex('selKeyNumber');
		setZeroIndex('selRoomNumber');
	}

	try {
		$.ajax({
			cache: false,
			url: "DataHandler.ashx",
			type: "GET",
			data: { 'option': 'GET', 'action': 'GetSearchValues', 'searchString': 'LastName', 'sectionID': thisSectionID },
			success: function (options) {
				// Returns Last, First, ID
				if (options.length === 0) {
					LogMiscError('ERROR:NULLAJAX', 'data.length = 0', 'Generic Handler returned no data.', fromWho);
					return;
				}

				for (var i = 0; i < options.length; i++) {
					$('#' + selectElement).append("<option recordid='" + options[i].RecordID + "' value='" + options[i].OptionValue + "'>" + options[i].OptionText + "</option>");
				}
			},
			error: function (request, status, error) {
				LogError(request.status, request.statusText, request.responseText, fromWho);
			}
		});
	}
	catch (err) {
		fromWho += '\n\t\tExternal Try Catch error c = ' + err;
		LogError(err.name + ' ' + err.number, err.message, err.description, fromWho);
	}
}



///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///   Get all key numbers for select element on a page             
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function FillKeyNumbers(selectElement) {
	fromWho = "GetKeyNumbers(" + selectElement + ")";

	// clear other search options 
	if (thisPage === keySearchPage) {
		setZeroIndex('selLastName');
		setZeroIndex('selRoomNumber');
	}

	try {
		$.ajax({
			cache: false,
			url: "DataHandler.ashx",
			type: "GET",
			data: { 'option': 'GET', 'action': 'GetSearchValues', 'searchString': 'KeyNumber', 'sectionID': thisSectionID },
			success: function (options) {
				if (options.length === 0) {
					LogMiscError('ERROR:NULLAJAX', 'data.length = 0', 'Generic Handler returned no data.', fromWho);
					return;
				}

				for (var i = 0; i < options.length; i++) {
					$('#' + selectElement).append("<option recordid='" + options[i].RecordID + "' value='" + options[i].OptionValue + "'>" + options[i].OptionText + "</option>");
				}
			},
			error: function (request, status, error) {
				LogError(request.status, request.statusText, request.responseText, fromWho);
			}
		});
	}
	catch (err) {
		fromWho += '\n\t\tExternal Try Catch error c = ' + err;
		LogError(err.name + ' ' + err.number, err.message, err.description, fromWho);
	}
}



///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///   Get room number when user selects key number on issues page  
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function GetRoomNumber(keyNumber) {

	fromWho = "GetRoomNumber(" + keyNumber + ")";

	try {
		$.ajax({
			cache: false,
			url: "DataHandler.ashx",
			type: "GET",
			data: { 'option': 'GET', 'action': 'GetRoomNumber', 'keyNumber': keyNumber, 'sectionID': thisSectionID },
			success: function (room) {
				if (room.length === 0) {
					LogMiscError('ERROR:NULLAJAX', 'data.length = 0', 'Generic Handler returned no data.', fromWho);
					return;
				}

				$('#txtRoomNumber').val(room);
			},
			error: function (request, status, error) {
				LogError(request.status, request.statusText, request.responseText, fromWho);
			}
		});
	}
	catch (err) {
		fromWho += '\n\t\tExternal Try Catch error c = ' + err;
		LogError(err.name + ' ' + err.number, err.message, err.description, fromWho);
	}
}



///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///   Get all room numbers for select element on a page            
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function FillRoomNumbers(selectElement) {
	fromWho = "FillRoomNumbers(" + selectElement + ")";

	// clear other search options 
	if (thisPage === keySearchPage) {
		document.getElementById('selKeyNumber').selectedIndex = 0;
		document.getElementById('selLastName').selectedIndex = 0;
	}

	try {
		$.ajax({
			cache: false,
			url: "DataHandler.ashx",
			type: "GET",
			data: { 'option': 'GET', 'action': 'GetSearchValues', 'searchString': 'RoomNumber', 'sectionID': thisSectionID },
			success: function (options) {
				if (options.length === 0) {
					LogMiscError('ERROR:NULLAJAX', 'data.length = 0', 'Generic Handler returned no data.', fromWho);
					return;
				}

				for (var i = 0; i < options.length; i++) {
					$('#' + selectElement).append("<option recordid='" + options[i].RecordID + "' value='" + options[i].OptionValue + "'>" + options[i].OptionText + "</option>");
				}
			},
			error: function (request, status, error) {
				LogError(request.status, request.statusText, request.responseText, fromWho);
			}
		});
	}
	catch (err) {
		fromWho += '\n\t\tExternal Try Catch error c = ' + err;
		LogError(err.name + ' ' + err.number, err.message, err.description, fromWho);
	}
};


///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
/// Set option text to given value for given element               
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function SetSelectOptionText(id, selectVal) {

	var elem = document.getElementById(id);
	elem.value = selectVal;

};



///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///
function GetIssuedData(filter, filterValue) {
	var option = '';
	var action = '';
	fromWho = 'GetIssuedData(' + filter + ', ' + filterValue + ')';
	// GetIssuedData('FullName', selectElem.options[selectElem.selectedIndex].value);
	try {
		$.ajax({
			cache: false,
			url: "DataHandler.ashx",
			type: "GET",
			data: { 'option': 'GET', 'action': 'GetGridData', 'filter': filter, 'filterValue': filterValue, 'sectionID': thisSectionID },
			success: function (data) {

				if (data.length === 0 || data.length === undefined) {
					LogMiscError('ERROR:NULLAJAX', 'data.length = 0', 'Generic Handler returned no data.', fromWho);
					return;
				}
								
				GridInfo.Last = data[0].Last;
				$('#txtLastName').val(data[0].Last)
				// g
				GridInfo.First = data[0].First;
				$('#txtFirstName').val(data[0].First);

				GridInfo.KeyNumber = data[0].KeyNumber;
				SetSelectOptionText('selKeyNumber', data[0].KeyNumber);

				GridInfo.RoomNumber = data[0].RoomNumber;
				$('#txtRoomNumber').val(data[0].RoomNumber);
				
				// g
				GridInfo.Issued = data[0].Issued;
				$('#dpkIssued').val(data[0].Issued);
				// g
				GridInfo.Returned = data[0].Returned;
				$('#dpkReturned').val(data[0].Returned);
				// g
				GridInfo.LostDate = data[0].LostDate;
				$('#dpkLost').val(data[0].LostDate);
				// g
				GridInfo.Section = data[0].Section;
				$('#txtSection').val(data[0].Section);
				// blank
				GridInfo.Custodian = data[0].Custodian;
				SetSelectOptionText('selCustodian', data[0].Custodian);
				
			},
			error: function (request, status, error) {
				LogError(request.status, request.statusText, request.responseText, fromWho);
			}
		});
	}
	catch (err) {
		fromWho += '\n\t\tExternal Try Catch error c = ' + err;
		LogError(err.name + ' ' + err.number, err.message, err.description, fromWho);
	}
};


///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
/// Uses Ajax to get data needed to create table-grid. Build is    
/// either based on a select option or loads all with no filter    
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function GetGridData(filter, filterValue) {
	var option = '';
	var action = '';

	// remove current data in grid  
	$('#dvData').empty();

	// load all   
	if (filter === void 0)
		fromWho = 'GetGridData()';
	else
		fromWho = 'GetGridData(' + filter + ', ' + filterValue + ')';

	try {
		$.ajax({
			cache: false,
			url: "DataHandler.ashx",
			type: "GET",
			data: { 'option': 'GET', 'action': 'GetGridData', 'filter': filter, 'filterValue': filterValue, 'sectionID': thisSectionID },
			success: function (data) {

				if (data.length === 0 || data.length === undefined) {
					LogMiscError('ERROR:NULLAJAX', 'data.length = 0', 'Generic Handler returned no data.', fromWho);
					return;
				}

				var appendText;

				for (var i = 0; i < data.length; i++) {
					GridInfo.Last = data[i].Last;
					GridInfo.First = data[i].First;
					GridInfo.KeyNumber = data[i].KeyNumber;
					GridInfo.RoomNumber = data[i].RoomNumber;
					GridInfo.Issued = data[i].Issued;
					GridInfo.Returned = data[i].Returned;
					GridInfo.LostDate = data[i].LostDate;
					GridInfo.Section = data[i].Section;
					GridInfo.Custodian = data[i].Custodian;

					// Draw grid from data
					appendText = "  <div class='div-Data' style='margin-left: 3px; width: 115px;'>" + GridInfo.Last + "</div>";
					appendText += "  <div class='div-Data' style='width: 115px;'>" + GridInfo.First + "</div>";
					appendText += "  <div class='div-Data' style='width: 75px;'>" + GridInfo.KeyNumber + "</div>";
					appendText += "  <div class='div-Data' style='width: 75px;'>" + GridInfo.RoomNumber + "</div>";
					appendText += "  <div class='div-Data' style='width: 75px;'>" + GridInfo.Issued + "</div>";

					if (GridInfo.Returned === null || GridInfo.Returned === undefined || GridInfo.Returned === "")
						appendText += "  <div class='div-Data' style='width: 75px;'>_________</div>";
					else
						appendText += "  <div class='div-Data' style='width: 75px;'>" + GridInfo.Returned + "</div>";

					if (GridInfo.LostDate === null || GridInfo.LostDate === undefined || GridInfo.LostDate === "")
						appendText += "  <div class='div-Data' style='width: 75px;'>_________</div>";
					else
						appendText += "  <div class='div-Data' style='width: 75px;'>" + GridInfo.LostDate + "</div>";

					appendText += "  <div class='div-Data' style='width: 160px;'>" + GridInfo.Section + "</div>";
					appendText += "<br />";

					//$(appendText).appendTo('#dvData');
					//$('#dvData').append(appendText);
					$(appendText).appendTo('#dvData').val();

					appendText = "";

				}

			},
			error: function (request, status, error) {
				LogError(request.status, request.statusText, request.responseText, fromWho);
			}
		});
	}
	catch (err) {
		fromWho += '\n\t\tExternal Try Catch error c = ' + err;
		LogError(err.name + ' ' + err.number, err.message, err.description, fromWho);
	}
}


