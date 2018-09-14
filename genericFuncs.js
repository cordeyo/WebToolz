/*jshint sub:true*/


//  D A T E S                                                
// Months are 0 - 11 in javascript                           
///
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
/// Return date with or without month name  
/// style:                                  
///      0 = without                        
///      1 = with                           
/// date: A date to strip time from         
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function GetDateNow(style, stripDate) {
	var d = new Date();
	var month = new Array(12);

	month.push("January");
	month.push("February");
	month.push("March");
	month.push("April");
	month.push("May");
	month.push("June");
	month.push("July");
	month.push("August");
	month.push("September");
	month.push("October");
	month.push("November");
	month.push("December");

	var day = d.getDate();
	var year = d.getFullYear();
	var theDate = '';

	// with month name
	if (style === 1) {
		if (stripDate !== null)
			theDate = month[stripDate.getMonth] + ' ' + day + ', ' + year;
		else
			theDate = month[d.getMonth()] + ' ' + day + ', ' + year;
	}

	// without month name
	if ((style === 0) || (style === void 0)) {
		if (stripDate !== null)
			theDate = stripDate.getMonth() + 1 + '/' + stripDate.getDate() + '/' + stripDate.getFullYear();
		else
			theDate = d.getMonth() + 1 + '/' + day + '/' + year;
	}

	return theDate;
}


// call   SubtractDays(Date('2012-04-23', 23);               
function SubtractDays(startDate, numberOfDays) {
	var returnDate = new Date(
							startDate.getFullYear(),
							startDate.getMonth(),
							startDate.getDate() - numberOfDays,
							startDate.getHours(),
							startDate.getMinutes(),
							startDate.getSeconds());

	//alert('Subtracting ' + numberOfDays + '\nOld Date  ' + startDate + '\n' + 'New Date ' + returnDate);
	return returnDate;
}

// call   AddDays(Date('2012-04-23', 23);                    
function AddDays(startDate, numberOfDays) {
	var returnDate = new Date(
							startDate.getFullYear(),
							startDate.getMonth(),
							startDate.getDate() + numberOfDays,
							startDate.getHours(),
							startDate.getMinutes(),
							startDate.getSeconds());

	//alert('Adding ' + numberOfDays + '\nOld Date  ' + startDate + '\n' + 'New Date ' + returnDate);
	return returnDate;
}

// call with :                                              
//       [ var myDate = new Date.DaysBetween(date1, date2) ]
Date.DaysBetween = function (date1, date2) {
	//Get 1 day in milliseconds
	var one_day = 1000 * 60 * 60 * 24;

	// Convert both dates to milliseconds
	var date1_ms = date1.getTime();
	var date2_ms = date2.getTime();

	// Calculate the difference in milliseconds
	var difference_ms = date2_ms - date1_ms;

	// Convert back to days and return
	return Math.round(difference_ms / one_day);
};



///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
/// Show modal popup window for OK, YES, NO and CANCEL dialogs     
/// global array runScript must be initialised before calling      
/// if you need to fire an event from a button or other control    
function ShowPopupMessage(page, message, dialogType) {

	Dialogs.DialogType = dialogType;

	if (message.length > 0)
		Dialogs.DialogMessage = message;
	else
		message = Messages.NoPopupMessage;

	if (Dialogs.DialogType === Dialogs.DialogOK) {

		// this html is for the message area 
		// OK dialog definition                  
		$('#dialogOK').dialog({
			modal: true,
			title: 'Information',
			icon: "ui-icon-closethick",
			zIndex: 10000,
			autoOpen: true,
			width: '300px',
			resizable: false,
			closeOnEscape: false,
			show: { effect: 'blind', duration: 600 },
			hide: { effect: "explode", duration: 800 },
			close: function (event, ui) {
			},
			open: function (e) {
				// remove & change dialog close button icon
				e.preventDefault();

				$(this).closest(".ui-dialog")
					.find(".ui-dialog-icon-closethick")
					.removeClass("ui-button-icon-closethick")
 				  .find(".ui-button-icon")
					.removeClass("ui-button-icon");
				//.html("<span class='ui-button-icon-primary ui-icon ui-icon-closethick'></span>");

				var body = "<div><h4><i>" + Dialogs.DialogMessage + "</i></h4></div>";
				$(this).html(body);
			},
			buttons: [
				{
					text: 'OK',
					click: function (e) {
						Dialogs.DialogAnswer = Dialogs.OK;

						if ($(this).dialog !== void 0)
							$(this).dialog("close");
					}
				}
			]
		});

		runScript = new Array();
		return false;
	}

	if (Dialogs.DialogType === Dialogs.DialogYesNo) {
		// this html is for the message area 
		// YES-NO dialog definition         
		$('#dialogYesNo').dialog({
			modal: true,
			icon: "ui-icon-closethick",
			title: 'Information',
			zIndex: 10000,
			autoOpen: true,
			width: '300px',
			resizable: false,
			closeOnEscape: false,
			show: { effect: 'blind', duration: 600 },
			hide: { effect: "explode", duration: 800 },
			close: function (event, ui) {

			},
			open: function () {
				// remove & change dialog close button icon
				$(this).closest(".ui-dialog")
					.find(".ui-dialog-icon-closethick")
					.removeClass("ui-button-icon-closethick")
 				  .find(".ui-button-icon")
					.removeClass("ui-button-icon");
				//.html("<span class='ui-button-icon-primary ui-icon ui-icon-closethick'></span>");

				var body = "<div><h4><i>" + Dialogs.DialogMessage + "</i></h4></div>";
				$(this).html(body);
			},
			buttons: [
				{
					text: 'YES',
					click: function (evt, ui) {
						//eval("$('#imgSave').trigger('click');");
						if (runScript.length > 0) {
							for (var i = 0; i < runScript.length; i++)
								eval(runScript[i]);
						}

						Dialogs.DialogAnswer = Dialogs.YES;
						$('#contentDiv').attr('status', "False");
						isDirty = false;
						$(this).dialog("close");
					},
				},
				{
					text: 'NO',
					click: function (evt, ui) {
						Dialogs.DialogAnswer = NO;
						$('#contentDiv').attr('status', "False");
						isDirty = false;
						$(this).dialog("close");
					}
				}
			]
		});

		runScript = new Array();
		return false;
	}


	if (Dialogs.DialogType === Dialogs.DialogYNCancel) {
		// this html is for the message area 
		// YES-NO-Cancel dialog definition         
		$('#dialogYNCancel').dialog({
			modal: true,
			icon: "ui-icon-closethick",
			title: 'Information',
			zIndex: 10000,
			autoOpen: true,
			width: '300px',
			resizable: false,
			closeOnEscape: false,
			show: { effect: 'blind', duration: 600 },
			hide: { effect: "explode", duration: 800 },
			close: function (event, ui) {

			},
			open: function () {
				// remove & change dialog close button icon
				$(this).closest(".ui-dialog")
					.find(".ui-dialog-icon-closethick")
					.removeClass("ui-button-icon-closethick")
 				  .find(".ui-button-icon")
					.removeClass("ui-button-icon");
				//.html("<span class='ui-button-icon-primary ui-icon ui-icon-closethick'></span>");

				var body = "<div><h4><i>" + Dialogs.DialogMessage + "</i></h4></div>";
				$(this).html(body);
			},
			buttons: [
				{
					text: 'YES',
					click: function (evt, ui) {
						//eval("$('#imgSave').trigger('click');");
						if (runScript.length > 0) {
							for (var i = 0; i < runScript.length; i++)
								eval(runScript[i]);
						}

						Dialogs.DialogAnswer = YES;
						$('#contentDiv').attr('status', "False");
						isDirty = false;
						$(this).dialog("close");
					},
				},
				{
					text: 'NO',
					click: function (evt, ui) {
						Dialogs.DialogAnswer = NO;
						$('#contentDiv').attr('status', "False");
						isDirty = false;
						$(this).dialog("close");
					}
				},
				{
					text: 'CANCEL',
					click: function (evt, ui) {
						Dialogs.DialogAnswer = CANCEL;
						$(this).dialog("close");
					}
				}]
		});
		runScript = new Array();
		return false;
	}

	runScript = new Array();
	return false;
}



///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///
function selectItemByValue(elmnt, value)
{
	for(var i=0; i < elmnt.options.length; i++)
  {
    if(elmnt.options[i].value == value)
      elmnt.selectedIndex = i;
  }
}


///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///
function IsAlphaNumeric(str) {
	var code, i, len;

	for (i = 0, len = str.length; i < len; i++) {
		code = str.charCodeAt(i);
		if (!(code > 47 && code < 58) &&   // numeric (0-9)
			!(code > 64 && code < 91) &&   // upper alpha (A-Z)
			!(code > 96 && code < 123)) {  // lower alpha (a-z)
		    return false;
		}
	}
	return true;
}

///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///
function StringExists(searchThis, searchText) {
	if (searchThis.indexOf(searchText) >= 0)
		return true;
	else
		return false;
}

/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
// No special chars allowed in some inputs                          
// Remove last typed char in input if not allowed                  
/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function CheckForSpecialCharacters(obj) {
	var str = obj.val();
	var newText = '';

	if (str.length > 1) {
		for (var i = 0; i < str.length; i++) {
			var c = str[i];
			if (/^[a-zA-Z0-9- ]*$/.test(c) === false) {
				newText += c.substring(0, c.length - 1);
			} else {
				newText += str[i];
			}
		}
		return newText;
	} else if (str.length === 1) {
		if (/^[a-zA-Z0-9- ]*$/.test(str) === false) {
			newText = str.substring(0, str.length - 1);
			return newText;
		}
	}

	return str;
}

///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function GetHiddenElement(name) {
	// If a page doesnt have the control but another does
	if (document.getElementById(name) === void 0 || document.getElementById(name) === null)
		return void 0;

	var values = document.getElementById(name).value;
	return values;
}

///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function SetHiddenElement(name, value) {
	if (name === void 0)
		return;

	// If a page doesnt have the control but another does
	if (document.getElementById(name) === void 0 || document.getElementById(name) === null)
		return;

	if (document.getElementById(name) !== void 0) {
		document.getElementById(name).value = value;
	}
}

///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function LogMiscError(status, statusText, alertMsg, fromWho) {

	if (alertMsg.length === 0 || status.length === 0)
		return;

	if (alertMsg.indexOf("ERROR:") === -1) {
		LogError(status, statusText, alertMsg, fromWho);
		ShowPopupMessage(thisPage, '[' + status + ']\n' + statusText + '\n' + alertMsg + '\n' + fromWho, Dialogs.DialogOK);
	}
}


///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
// Just shows label text on page under edit icons, 
// such as 'Contract Expired', no popup        
function ShowPopupInfo(msg) {

	// Expand page
	if (thisPage === contractsPage) {
		$('.contracts_contentMain').css('height', contractsMaxHeight);
		$('.main').css('height', contractsMaxHeight);
	}
	// Expand page
	if (thisPage === adminPage) {
		$('.admin_contentMain').css('height', adminMaxHeight);
		$('.main').css('height', adminMaxHeight);
	}

	if (msg.length === 0) {

		$('#lblMsg').text(daysOutMsg);
		$('#popupDiv').hide();
	}
	else {
		$('#lblMsg').text(msg);
		$('#popupDiv').show();
	}
}


///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///   Hides popup from ShowPopupInfo(msg)                          
function HidePopupInfo() {
	$('#popupDiv').hide();
	$('#lblMsg').text('');

	if (thisPage === contractsPage) {
		$('.contracts_contentMain').css('height', contractsMinHeight);
		$('.main').css('height', '720px');
	}

	if (thisPage === adminPage) {
		$('.admin_contentMain').css('height', adminMinHeight);
	}
}


///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
/// Unfade effect on Modal Popups                                  
function UnFade(element) {
	var op = 0.1;  // initial opacity
	document.getElementById(element).style.display = 'block';

	var timer = setInterval(function () {
		if (op >= 1) {
			clearInterval(timer);
		}
		document.getElementById(element).style.opacity = op;
		document.getElementById(element).style.filter = 'alpha(opacity=' + op * 100 + ")";
		op += op * 0.01;
	}, 60);
}


///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
/// Fade effect on Modal Popups                                    
function Fade(element) {
	var op = 1;  // initial opacity
	var timer = setInterval(function () {
		if (op <= 0.1) {
			clearInterval(timer);
			document.getElementById(element).style.display = 'none';
		}
		document.getElementById(element).style.opacity = op;
		document.getElementById(element).style.filter = 'alpha(opacity=' + op * 100 + ")";
		op -= op * 0.1;
	}, 50);
}




///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function LogError(status, statusText, errorText, fromWho) {

	if (fromWho === void 0) alert('Missing fromWho LogError parameter @ ' + errorText);

	try {
		$.ajax({
			cache: false,
			url: "ErrorLogHandler.ashx",
			type: "GET",
			data: { 'StatusCode': status, 'StatusText': statusText, 'ErrorText': 'errorText', 'FromWho': fromWho },
			success: function (data) {
				// ShowPopupMessage(thisPage, 'An error was logged.', Dialogs.DialogOK);
			},
			error: function (request, status, error, fromWho) {
				LogError(request.status, request.statusText, request.responseText, fromWho);
			}
		});
	}
	catch (err) {
		fromWho += '\n\t\tTry Catch err\n';
		LogError(err.name + ' ' + err.number, err.message, err.description, fromWho);
		var m = 'Name : ' + err.name + '\nNumber : ' + err.number + '\nDescription : ' + err.description + '\nFrom Who : ' + fromWho;
		ShowPopupMessage(thisPage, m, Dialogs.DialogOK);
	}
}


///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
/// Was Return key pressed                                         
function CheckKeyPress(event) {

	if (event.keyCode === 13) {
		event.preventDefault();
		bKeyPressed = false;
		isDirty = false;
		return false;
	}
	else {
		// do check on characters to determine if 
		// user is editing a record               

		if (IsAlphaNumeric(event.keyCode)) {
			saveStatus = "U";
			isDirty = true;
			SetHiddenElement('hidEditing', 'True');
			$('#isDirtyTester').text('genericFuncs-1408 isDirty= [' + isDirty + ']');
			bKeyPressed = true;
		}
	}
}


///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
/// Change select to top blank option                              
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function setZeroIndex(selectElement)
{
	document.getElementById(selectElement).selectedIndex = 0;
}

///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///   Places <options> in <select> based on searchBy selected      
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function GetSelectOptions(searchBy) {
	var fromWho = 'getSelectedOptions(' + searchBy + ')';

	try {
		if (searchBy.length === 0) {
			LogError('ERROR:NULLAJAX', 'Length = 0', 'searchBy.length === 0', 'getSelectedOptions(' + searchBy + '.');
			return false;
		}

		$.ajax({
			cache: false,
			url: "DataHandler.ashx",
			type: "GET",
			data: { 'option': 'GET', 'action': 'GetSearchForValues', 'searchBy': searchBy },
			success: function (options) {
				try {
					if (options.length === 0) {
						return "No data returned from Handler to GetSelectOptions().";
					}

					for (var i = 0; i < options.length; i++) {
						$('#selSearchFor').append("<option value='" + options[i].OptionValue + "'>" + options[i].OptionText + "</option>");
					}
				}
				catch (err) {
					LogError(err.name + ' ' + err.number, err.message, err.description, fromWho);
				}
			},
			error: function (request, status, error) {
				LogError(request.status, request.statusText, request.responseText, fromWho);
			}
		});
	}
	catch (err) {
		fromWho += '\n\t\tExternal Try Catch err = ' + err;
		LogError(err.name + ' ' + err.number, err.message, err.description, fromWho);
		var m = 'Name : ' + err.name + '\nNumber : ' + err.number + '\nDescription : ' + err.description + '\nFrom Who : ' + fromWho;
		ShowPopupMessage(thisPage, m, Dialogs.DialogOK);
	}
}



///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
/// Disable controls on new Keys Issued and Key Search pages       
/// when the custodian has more than one section until user        
/// selects a section from the dropdown 'selSections'              
///
function DisableControls() {
	var inputs = document.getElementsByTagName('input');

	if (thisPage === keySearchPage || thisPage === keyIssuesPage)
	{
		var selects = $(':input[id^="sel"]');
		for (var k = 0; k < selects.length; k++)
		{
			var selName = selects[k].id;
			if (selName !== 'selSections') {
				document.getElementById(selects[k].id).disabled = true;
			}
		}
	}
	
	if (thisPage === keyIssuesPage) 
	{
		for (var i = 0; i < inputs.length; i++) {
			var isTxt = inputs[i].id.indexOf('txt') === 0;
			var isDpk = inputs[i].id.indexOf('dpk') === 0;
			var isBtn = inputs[i].id.indexOf('btn') === 0;
			var isImg = inputs[i].id.indexOf('img') === 0;

			var name = inputs[i].id.toString();

			if (isTxt)
				document.getElementById(name).disabled = true;
			if (isDpk)
				document.getElementById(name).disabled = true;
			if (isBtn)
				document.getElementById(name).disabled = true;

			if (isImg) {
				if (name !== 'imgNew') {
					document.getElementById(name).setAttribute('disabled', true);
				}
			}
		}
	}
}


///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
/// Show controls after user selects section                       
/// 
function EnableControls() {
	var inputs = document.getElementsByTagName('input');

	if (thisPage === keySearchPage || thisPage === keyIssuesPage) 
	{
		for (var i = 0; i < inputs.length; i++) {
			var isTxt = inputs[i].id.indexOf('txt') === 0;
			var isDpk = inputs[i].id.indexOf('dpk') === 0;
			var isBtn = inputs[i].id.indexOf('btn') === 0;
			var isImg = inputs[i].id.indexOf('img') === 0;

			var name = inputs[i].id;

			if (isTxt)
				document.getElementById(name).disabled = false;
			if (isDpk)
				document.getElementById(name).disabled = false;
			if (isBtn)
				document.getElementById(name).disabled = false;
			if (isImg)
				document.getElementById(name).disabled = false;
		}

		var selects = $(':input[id^="sel"]');
		for (var k = 0; k < selects.length; k++) {
			if (selects[k].id !== 'selSearchBy') {
				document.getElementById(selects[k].id).disabled = false;
			}
		}
	}
}









///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
/// Build table to act as grid, call AJAX and fill object with     
/// date needed for columns before calling this                    
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function BuildDynamicTable(dataDiv)
{
	var i = 0;
	var div = '#' + dataDiv;



	$(div).each(function ()
	{
		var dvName = $(this).attr('id');

		if (dataDiv === 'key-Body')
		{

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


//  $(this).children('input[type="text"]').context.attributes[1].nodeValue
//  $element[0].attributes[1].value -------- same as above 1st Child textbox name  
//  txtBox.selector.length

// Span List
// undefined
// ctl00_HeadLoginView_HeadLoginName
// tableSpan
