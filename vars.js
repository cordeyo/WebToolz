

// https://stackoverflow.com/questions/13192466/how-to-suppress-variable-is-better-written-in-dot-notation#13192501
// Tell jshint to NOT show message:                 
//  “{variable} is better written in dot notation.” 
//  
/*jshint sub:true*/

function strictFn() {
	// This line makes EVERYTHING under this strict mode
	'use strict';
}


var thisUser = '';
var thisSectionID = '';
var thisPage = '';

var fromWho = '';
var isDirty = false;
var page = '';

var defaultPage = 'default.aspx';
var keySearchPage = 'KeySearch.aspx';
var keyIssuesPage = "KeyIssues.aspx";


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



var key = { ID: '', KeyNumber: '', RoomID: '' };
var room = { ID: '', RoomNumber: '', KeyID: '' };
var section = { ID: '', Section: '' };


var KeyInfo = {
	ID: '',
	KeyNumber: '',
	RoomNumber: '',
	Issued: '',
	Returned: '',
	Lost: ''
};

var KeyHolderInfo = {
	ID: '',
	FirstName: '',
	LastName: '',
	IsCustodian: ''
};

var CustodianInfo = {
	ID: '',
	UserID: '',
	FirstName: '',
	LastName: '',
	Phone: '',
	Email: '',
	Section: '',
	IsActive: '',
	IsAdmin: '',
	IsDeleted: ''
};



var GridInfo = {
	ID: '',
	KeyID: '',
	RoomID: '',
	SectionID: '',
	Last: '',
	First: '',
	KeyNumber: '',
	RoomNumber: '',
	Issued: '',
	Returned: '',
	LostDate: '',
	Section: '',
	Custodain: ''
};





var MissingFieldName = '';
var Messages = {
	MissingData: 'You are missing data in one or more of the required fields. Operation cannot be completed',
	NothingToSave: 'Nothing to save. The original data is loaded.',
	AreYouSureDeleteRecord: 'Are you sure you want to delete this record?',
	PendingChanges: 'There are pending changes. Do you want to save these changes?',
	NothingToDelete: 'You do not have a record loaded. Nothing to delete.',
	MissingFieldMessage: 'No data was entered for the field ' + MissingFieldName + '. \nCannot continue.',
	RecordExists: 'Cannot save this record because an identical record exists.',
	NoPopupMessage: 'No message was received for ShowPopupMessage()',
	SaveSuccess: 'Record save was successful.',
	SaveFail: 'Record save failed.',
	DeleteSuccess: 'Record delete was successful',
	DeleteFail: 'Record delete failed.',
	UpdateSuccess: 'Record update successful.',
	UpdateFail: 'Record update failed.',
	SaveStatusFail: 'SaveStatus parameter is missing'
};