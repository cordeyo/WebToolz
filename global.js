
/*
	COMPILE js to min files
	https://closure-compiler.appspot.com/home
*/



function strictFn() {
	// This line makes EVERYTHING under this strict mode
	'use strict';
}


var thisPage = '';
var adminPage = "admin";
var defaultPage = "default";
var inventoryPage = "inventory";

var optionValue = {
	Option: "",
	Value: ""
};


var Dialogs = {
	// Click Responses 
	OK: 1,
	YES: 2,
	NO: 3,
	CANCEL: 4,
	// Button Types    
	DialogOK: 5,
	DialogYesNo: 6,
	DialogYNCancel: 7,
	DialogType: '',
	DialogAnswer: '',
	DialogMessage: '',
	DialogTitle: '',
	DialogPage: ''
};


//var sccmData = new google.visualization.DataTable();
//var sccmDrillData1 ;
//var sccmDrillData2 = new google.visualization.DataTable();

//var dmlssDataTable = new google.visualization.DataTable();
//var dmlssDrillData1 = new google.visualization.DataTable();
//var dmlssDrillData2 = new google.visualization.DataTable();

//var discrepancyData = new google.visualization.DataTable();

var previousSelection = '';


var DmlssChart = {
	header1: 'Manu',
	header2: 'Count',
	manuData: [],
	countData: []
};

var pieChartOptions = {
	titleTextStyle: {
		color: '#000000',
		fontName: 'Verdana',
		fontSize: 14,
		bold: true,
		width: 300
	},
	'title': '',
	'width': 800,
	'height': 460,
	'is3D': true
};


var DmlssGridData = {
	ECN: '',
	Manufacturer: '',
	Model: '',
	Nomenclature: '',
	Custodian: '',
	Customer: '',
	CustomerID: ''
}




