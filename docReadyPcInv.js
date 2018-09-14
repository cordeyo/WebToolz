/*jshint sub:true*/




///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///                                                                
///                          R E A D Y                             
///                                                                
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///


///#region                   READY                                 
$(document).ready(function () {

	thisUser = $('#ctl00_HeadLoginView_HeadLoginName').text();
	thisUser = thisUser.substr(5, thisUser.length - 5);

	// Get current page title                               
	var page = $(document).find('title').text().trim();



	// default.aspx
	if (page.indexOf('Login') >= 0)
	{
		// Default page has no user name visible as other pages do  
		var elem = document.getElementById("hidUserName").value;
		if (elem.length > 0)
			thisUser = elem.substr(5, elem.length - 5);

		FillLastNames('selLastName');
	}

	// load all option values for select controls on page
	if (page.indexOf('KeySearch') >= 0)
	{
		thisPage = keySearchPage;
		
		// Look up section of current user.
		FillAciveSections('mySections');

		DisableControls();

	}
	
	if (page.indexOf('KeyIssues') >= 0)
	{
		thisPage = keyIssuesPage;

		FillAciveSections('mySections');
		DisableControls();

	}




	//   E V E N T S   
	


	///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
	///   Loops through all select controls to get ID and any          
	///   specific control functions                                   
	///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
	$(' select').change(function (e) {

		fromWho = "select.change";

		e.preventDefault();

		var selection = '';
		var ddlID = this.id;
		var intID = '-1';
		var idx = 0;
		var selName = '';
		var sections = '';
		var selectElem = '';

		// dont need to do anything if user select blank row      
		if (this.options[this.selectedIndex].value.length < 1)
			return;

		selection = this.options[this.selectedIndex].value;

		switch (ddlID) {
			case 'selSections':
				sections = document.getElementById('selSections');
				selName = 'selSections';
			case 'mySections':
				sections = document.getElementById('mySections');
				selName = "mySections";

				thisSectionID = $('#' + selName).find(':selected').attr('recordid');
				selectElem = document.getElementById(selName);

				FillKeyNumbers('selKeyNumber');
				FillRoomNumbers('selRoomNumber');
				
				if (thisPage === keyIssuesPage) {
					FillLastNames('selLastName');
					FillCustodians('selCustodian');
				}

				if (thisPage === keySearchPage)
					FillLastNames('selLastName');

				EnableControls();

				$('#txtSection').val(this.options[this.selectedIndex].value);
				break;

			case "selKeyNumber":

				if (thisPage === keySearchPage) {
					selectElem = document.getElementById('selKeyNumber');
					setZeroIndex('selLastName');
					setZeroIndex('selRoomNumber');

					// Update grid
					GetGridData('KeyNumber', selectElem.options[selectElem.selectedIndex].value);
				}

				if (thisPage === keyIssuesPage)
				{
					// select correct Room 
					var ddlObject = document.getElementById('selKeyNumber');
					var keyNumber = ddlObject.options[ddlObject.selectedIndex].value;
					GetRoomNumber(keyNumber);
				}
				break;

			case "selRoomNumber":
				setZeroIndex('selKeyNumber');
				setZeroIndex('selLastName');

				// Update grid on Search Page
				if (thisPage == keySearchPage) {
					selectElem = document.getElementById('selRoomNumber');
					GetGridData('RoomNumber', selectElem.options[selectElem.selectedIndex].value);
				}
				
				break;

			case "selSections":
				selectElem = document.getElementById('selSections');
				FillKeyNumbers('selKeyNumber');
				FillRoomNumbers('selRoomNumber');
				FillCustodians('selCustodian');
				break;

			case "selLastName":

				// Update grid on Search Page
				if (thisPage == keySearchPage) {
					setZeroIndex('selKeyNumber');
					setZeroIndex('selRoomNumber');

					selectElem = document.getElementById('selLastName');
					GetGridData('LastName', selectElem.options[selectElem.selectedIndex].value);
				}

				if (thisPage == keyIssuesPage) {
					setZeroIndex('selKeyNumber');
					selectElem = document.getElementById('selLastName');
					GetIssuedData('FullName', selectElem.options[selectElem.selectedIndex].value);
				}

				break;

				
			default:
				break;
		}

		///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		///   Fade out on hover for images                                 
		$('#imgEdit').hover(function (e) {
			e.preventDefault();

			$('a.info:hover span').css({ left: -108 });
			$("#imgEdit").addClass('transition');
			return false;

		}, function () {
			$("#imgEdit").removeClass('transition');
		});
		///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		///   EDIT                         
		$('#imgEdit').click(function (e) {
			e.preventDefault();
			alert('EDIT');
			saveStatus = 'U';
			return false;
		});


		///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		///   Fade out on hover for images                                 
		$('#imgSave').hover(function (e) {
			e.preventDefault();

			// on hover
			$('a.info:hover span').css({ left: -55 });
			$("#imgSave").addClass('transition');
			return false;

		}, function () {
			$("#imgSave").removeClass('transition');
		});
		///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		///   SAVE                         
		$('#imgSave').click(function (e) {
			e.preventDefault();
			alert('SAVE');
			saveStatus = '';
			return false;
		});


		///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		///   Fade out on hover for images                                 
		$('#imgNew').hover(function (e) {
			e.preventDefault();

			$('a.info:hover span').css({ left: -110 });
			$("#imgNew").addClass('transition');
			return false;

		}, function () {
			$("#imgNew").removeClass('transition');
		});
		///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		///   NEW                         
		$('#imgNew').click(function (e) {
			e.preventDefault();
			alert('NEW');
			saveStatus = '';
			return false;
		});


		///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		///  Fade out on hover for images                                  
		$('#imgDelete').hover(function (e) {
			e.preventDefault();

			$('a.info:hover span').css({ left: -90 });
			$("#imgDelete").addClass('transition');
			return false;

		}, function () {
			$("#imgDelete").removeClass('transition');
		});
		///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		///   DELETE                         
		$('#imgDelete').click(function (e) {
			e.preventDefault();
			alert('DELETE');
			saveStatus = '';
			return false;
		});

		
	});


});





(function ($) {

	var txt = $('txtFName');

	//   F U N C T I O N S   
	$.fn.TestClick = function () {
		alert('Test Click');
	};




})(jQuery);


//$(document).ready(function () {

	












//});
///#endregion READY
