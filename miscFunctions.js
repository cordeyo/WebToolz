
/*
	COMPILE js to min files
	https://closure-compiler.appspot.com/home
*/


//======================================================
//             M I S C   F U N C T I O N S              
//======================================================
//

// Use to wait for generic handler to return data  
var runWithTimeout = function (task, args, successCallback, timeoutCallback, timeoutInterval)
{
	var timedOut = false;
	var success = false;

	var decoratedCallback = function (result) {
		if (!timedOut) {
			success = true;
			clearTimeout(timeoutId);
			successCallback(result);
		}
	};

	var allArgs = args.slice(0);
	allArgs.push(decoratedCallback);

	task.apply(null, allArgs);

	// if task completed synchronously, no need to check for timeout
	if (!success) {
		var timeoutId = setTimeout(function () {
			timedOut = true;
			timeoutCallback();
		}, timeoutInterval);
	}
};
var delayedTask = function (name, delay, callback) {
	setTimeout(function () {
		callback(name + ' - finished.');
	}, delay);
};




///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///
function SelectOptionValue(selectID, value)
{
	var sel = document.getElementById(selectID);
	$("#" + selectID + " option:contains(" + value + ")").each(function () {
		if ($(this).text() == value) {
			$(this).attr('selected', 'selected');
			return false;
		}
		return true;
	});
}





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

						if ($(this).dialog !== undefined)
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


// Use handler to get user info 
//      (debugging only)        
function GetLocalUser() {

	var fromWho = "GetLocalUser()";
	var cName = "";

	try {
		$.ajax({
			cache: false,
			url: "DataHandler.ashx",
			type: "GET",
			data: { 'option': 'GET', 'action': 'GetLocalUser' },
			success: function (data) {
				if (data.length === 0) {
					return "ERROR: No data returned from Handler to GetLocalUser().";
				}
				name = data;
			},
			error: function (request, status, error) {
				LogError(request.status, request.statusText, request.responseText, fromWho);
			}
		});
	}
	catch (err) {
		fromWho += '\n\t\tTry Catch err = ' + err;
		LogError(err.name + ' ' + err.number, err.message, err.description, fromWho);
		var m = 'Name : ' + err.name + '\nNumber : ' + err.number + '\nDescription : ' + err.description + '\nFrom Who : ' + fromWho;
		ShowPopupMessage(thisPage, m, Dialogs.DialogOK);
	}
	return name;
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

	if (fromWho === undefined) alert('Missing fromWho LogError parameter @ ' + errorText);

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
function GetHiddenElement(name) {
	// If a page doesnt have the control but another does
	if (document.getElementById(name) === undefined || document.getElementById(name) === null)
		return undefined;

	var values = document.getElementById(name).value;
	return values;
}
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function SetHiddenElement(name, value) {
	if (name === undefined)
		return;

	// If a page doesnt have the control but another does
	if (document.getElementById(name) === undefined || document.getElementById(name) === null)
		return;

	if (document.getElementById(name) !== undefined) {
		document.getElementById(name).value = value;
	}
}













































///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
//
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
function LogError(status, statusText, errorText, fromWho) {

	if (fromWho === undefined) alert('Missing fromWho LogError parameter @ ' + errorText);

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