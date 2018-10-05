
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

var liClicked = '';
var prevClicked = '';


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
};

var SccmGridData = {
	ECN: '',
	Manufacturer: '',
	Model: '',
	Nomenclature: '',
	Custodian: '',
	Customer: '',
	CustomerID: ''
};

var EcnSnSearchData = {
	ECN: [],
	ECN5: [],
	MfrSerialNo: [],
	Manufacturer: [],
	Model: [],
	Nomenclature: [],
	CommonModel: [],
	Ownership: [],
	MaintAct: [],
	ID: [],
	Custodian: [],
	Customer: [],
	CustomerID: [],
	OrgName: [],
	Location: [],
	AcqCost: [],
	AcqDate: [],
	LifeExp: []
};





var gChartManufacturer = '';
var gChartModel = '';
var gChartNomenclature = '';



