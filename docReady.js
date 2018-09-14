
/*
	COMPILE js to min files
	https://closure-compiler.appspot.com/home
*/




strictFn();




$(document).ready(function () {

	var color = '';
	var countThis = '';
	var nomenclature = '';



	

	// Get current page title                               
	var page = $(document).find('title').text().trim();


	if (page.indexOf('Default') >= 0)
		thisPage = defaultPage;



	// Load main chart data
	if (page.indexOf('Inventory') >= 0)
	{
		// Load the Visualization API and the corechart package.
		google.charts.load('current', { 'packages': ['corechart'] });

		document.getElementById('txtCount').disabled = true;

		$('#dv_Nomenclature').css('visibility', 'hidden');
		$('#dv_DmlssCountTitle').css('visibility', 'hidden');

		HideElement('liMenuExcelExport');
		HideElement('DataViewSection');
		HideElement('SccmInventorySection');
		HideElement('DmlssInventorySection');
		HideElement('DescrepanciesSection');
		HideElement('ReconciledSection');
		HideElement('SearchEcnSection');
		HideElement('SearchSnSection');


		GetAsOfDate();
		thisPage = inventoryPage;
		nomenclature = 'PRINTER';
		title = 'PRINTER';
		fromWho = 'Inline model count';

		$.ajax({
			sync: false,
			url: "ChartDataHandler.ashx",
			cache: false,
			type: "GET",
			datatype: "json",
			data: { 'option': 'GET', 'action': 'GetModelCount', 'model': nomenclature },
			success: function (count) {
				// Count of PRINTER on startup 
				SetHiddenElement('hidModelCount', count);
			},
			error: function (request, status, error) {
				LogError(request.status, request.statusText, request.responseText, fromWho);
			}
		});

	}







	////////////////////////////////////////////////////////
	//                   E V E N T S                        
	////////////////////////////////////////////////////////



	////////////////////////////////////////////////////////
	// button click event on banner page                    
	$('#btnAcknowledges').click(function (e) {
		window.open('inventory.aspx', '_self', false);
	});


	var liClicked = '';
	var prevClicked = '';


	////////////////////////////////////////////////////////
	// menu item click events                               
	$('li').click(function (e) {
		var id = this.id;
		var table = '';
		var criteria = '';

		liClicked = id;

		e.preventDefault();

		switch (id) {
			case 'liMenuSccm':
				highlightMenuItem(id, prevClicked, "SCCM Inventory");

				HideElement('DataViewSection');
				$('#dv_Nomenclature').css('visibility', 'hidden');
				$('#dv_DmlssCountTitle').css('visibility', 'hidden');
				HideElement('DmlssInventorySection');
				HideElement('DescrepanciesSection');
				HideElement('SearchEcnSection');
				HideElement('SearchSnSection');
				// Hide this menu item
				$('#liMenuExcelExport').fadeOut('slow', function () { });

				// section, height, width, padding, margin   
				ShowElement('SccmInventorySection', "400px", "1000px", "0", "50px 0 0 442px");
				prevClicked = id;
				$('#liMenuLeftMargin').css('width', '450px');

				break;

			case 'liMenuDmlss':
				highlightMenuItem(id, prevClicked, "DMLSS Inventory");

				HideElement('DataViewSection');
				HideElement('SccmInventorySection');
				HideElement('DescrepanciesSection');
				HideElement('ReconciledSection');
				HideElement('SearchEcnSection');
				HideElement('SearchSnSection');
				// Hide this menu item
				$('#liMenuExcelExport').fadeOut('slow', function () { });

				GetNomenclature();

				$('#dv_Nomenclature').css('visibility', 'visible');
				$('#dv_DmlssCountTitle').css('visibility', 'visible');

				//################################################
				//  NEED TO GET NEW SCCM DATA FROM CYBER FIRST    
				// var sCount = GetEquipmentCount('', '', 'SCCM');

				// Load manufactures [printers] chart             
				table = 'DMLSS';
				criteria = nomenclature;
				GetEquipmentCount(table, criteria, 'DMLSS');
				
				// section, height, width, padding, margin   
				ShowElement('DmlssInventorySection', "550px", "1200px", "0", "20px 0 0 337px");

				// Get data from handler and draw chart
				GetDmlssChartTable(nomenclature, title);
				prevClicked = id;
				$('#liMenuLeftMargin').css('width', '450px');

				break;


			case 'liMenuDescrepancies':
				highlightMenuItem(id, prevClicked, "Discrepancies");

				HideElement('DataViewSection');
				$('#dv_Nomenclature').css('visibility', 'hidden');
				$('#dv_DmlssCountTitle').css('visibility', 'hidden');
				HideElement('DmlssInventorySection');
				HideElement('SccmInventorySection');
				HideElement('ReconciledSection');
				HideElement('SearchEcnSection');
				HideElement('SearchSnSection');
				// Hide this menu item
				$('#liMenuExcelExport').fadeOut('slow', function () { });

				// section, height, width, padding, margin   
				ShowElement('DescrepanciesSection', "400px", "1000px", "5px", "50px 0 0 442px");
				prevClicked = id;
				$('#liMenuLeftMargin').css('width', '450px');

				break;

			case 'liMenuHandReceipts':
				highlightMenuItem(id, prevClicked, "Reconciled Hand Receipts");

				HideElement('DataViewSection');
				$('#dv_Nomenclature').css('visibility', 'hidden');
				$('#dv_DmlssCountTitle').css('visibility', 'hidden');
				HideElement('DmlssInventorySection');
				HideElement('SccmInventorySection');
				HideElement('DescrepanciesSection');
				HideElement('SearchEcnSection');
				HideElement('SearchSnSection');
				// Hide this menu item
				$('#liMenuExcelExport').fadeOut('slow', function () { });

				// section, height, width, padding, margin   
				ShowElement('ReconciledSection', "400px", "1000px", "5px", "50px 0 0 442px");
				prevClicked = id;
				$('#liMenuLeftMargin').css('width', '450px');

				break;

			case 'liMenuEcnSearch':
				highlightMenuItem(id, prevClicked, "Search ECN");

				HideElement('DataViewSection');
				$('#dv_Nomenclature').css('visibility', 'hidden');
				$('#dv_DmlssCountTitle').css('visibility', 'hidden');
				HideElement('DmlssInventorySection');
				HideElement('SccmInventorySection');
				HideElement('DescrepanciesSection');
				HideElement('ReconciledSection');
				HideElement('SearchSnSection');
				// Hide this menu item
				$('#liMenuExcelExport').fadeOut('slow', function () { });

				// section, height, width, padding, margin   
				ShowElement('SearchEcnSection', "400px", "1000px", "5px", "50px 0 0 442px");
				prevClicked = id;
				$('#liMenuLeftMargin').css('width', '450px');

				break;

			case 'liMenuSnSearch':
				highlightMenuItem(id, prevClicked, "Search SN");

				HideElement('DataViewSection');
				$('#dv_Nomenclature').css('visibility', 'hidden');
				$('#dv_DmlssCountTitle').css('visibility', 'hidden');
				HideElement('DmlssInventorySection');
				HideElement('SccmInventorySection');
				HideElement('DescrepanciesSection');
				HideElement('ReconciledSection');
				HideElement('SearchEcnSection');
				// Hide this menu item
				$('#liMenuExcelExport').fadeOut('slow', function () { });

				// section, height, width, padding, margin   
				ShowElement('SearchSnSection', "400px", "1000px", "5px", "50px 0 0 442px");
				prevClicked = id;
				$('#liMenuLeftMargin').css('width', '450px');

				break;

			case 'liMenuViewAllDmlss':
				highlightMenuItem(id, prevClicked, "View All DMLSS Inv.");

				//HideElement('DataViewSection');
				//$('#dv_Nomenclature').css('visibility', 'hidden');
				//$('#dv_DmlssCountTitle').css('visibility', 'hidden');
				//HideElement('DmlssInventorySection');
				//HideElement('SccmInventorySection');
				//HideElement('DescrepanciesSection');
				//HideElement('ReconciledSection');
				//HideElement('SearchEcnSection');
				// Hide this menu item
				$('#liMenuExcelExport').fadeOut('slow', function () { });

				// section, height, width, padding, margin   
				// ShowElement('SearchSnSection', "400px", "1000px", "5px", "50px 0 0 442px");
				prevClicked = id;
				$('#liMenuLeftMargin').css('width', '450px');

				break;

			// Hide until dataViewSection is visible
			case 'liMenuExcelExport':
				highlightMenuItem(id, prevClicked, "Excel Export");

				//HideElement('DataViewSection');
				//$('#dv_Nomenclature').css('visibility', 'hidden');
				//$('#dv_DmlssCountTitle').css('visibility', 'hidden');
				//HideElement('DmlssInventorySection');
				//HideElement('SccmInventorySection');
				//HideElement('DescrepanciesSection');
				//HideElement('ReconciledSection');
				//HideElement('SearchEcnSection');

				// section, height, width, padding, margin   
				// ShowElement('SearchSnSection', "400px", "1000px", "5px", "50px 0 0 442px");
				prevClicked = id;
				break;

			default:
				break;

		}
	});



	////////////////////////////////////////////////////////
	// select change event                                  
	$('select').change(function (e) {

		var ddlID = this.id;
		var foreColor = '';
		var elemColor = '';
		var bkColor = '';
		var elem = '';

		// dont need to do anything if user select blank row  
		if (this.options[this.selectedIndex].value.length < 1)
			return;

		selection = this.options[this.selectedIndex].value;
		HideElement('DataViewSection');

		switch (ddlID) {
			case 'selEquipment':

				ShowElement('DmlssInventorySection', '', '', '', '');

				// Get new data and draw new chart 
				nomenclature = selection;
				fromWho = 'Inline selEquipment change';
				
				$.ajax({
					sync: false,
					url: "ChartDataHandler.ashx",
					cache: false,
					type: "GET",
					datatype: "json",
					data: { 'option': 'GET', 'action': 'GetModelCount', 'model': nomenclature },
					success: function (count) {
						// Count of PRINTER on startup 
						SetHiddenElement('hidModelCount', count);
					},
					error: function (request, status, error) {
						LogError(request.status, request.statusText, request.responseText, fromWho);
					}
				});

				//################################################
				//  NEED TO GET NEW SCCM DATA FROM CYBER FIRST    
				// var sCount = GetEquipmentCount('', '', 'SCCM');

				// Load manufactures [printers] chart             
				table = 'DMLSS';
				criteria = nomenclature;
				GetEquipmentCount(table, criteria, 'DMLSS');

				// Get data from handler and draw chart
				GetDmlssChartTable(nomenclature, selection);
				break;

			case 'selElements1':
				foreColor = 'white';
				bkColor = '#1F1E3F';
				break;

			case 'selElements2':
				foreColor = 'white';
				bkColor = '#030027';
				break;

			case 'selElements3':
				foreColor = '#F2F3D9';
				bkColor = 'beige';
				break;

			case 'selElements4':
				foreColor = '#DC9E82';
				bkColor = 'white';
				break;

			case 'selElements5':
				foreColor = '#C16E70';
				bkColor = 'white';
				break;

			case 'selElements6':
				foreColor = '#BA0651';
				bkColor = 'white';
				break;

			case 'selElements7':
				foreColor = '#424242';
				bkColor = 'white';
				break;

			case 'selElements8':
				foreColor = '#0D1B2A';
				bkColor = 'white';
				break;

			case 'selElements9':
				foreColor = '#1B263B';
				bkColor = 'white';
				break;

			case 'selElements10':
				foreColor = '#415A77';
				bkColor = 'white';
				break;

			case 'selElements11':
				foreColor = '#778DA9';
				bkColor = 'white';
				break;

			case 'selElements12':
				foreColor = 'brown';
				bkColor = '#E0E1DD';
				break;

			case 'selElements13':
				foreColor = '#47051F';
				bkColor = 'white';
				break;

			case 'selElements14':
				foreColor = '#260511';
				bkColor = 'white';
				break;

			default:
				break;
		}

		switch (selection) {
			case 'Title Bkg':
				$('.h2-Title').css('background-color', bkColor);
				$('.h2-Title').css('color', 'white');
				break;

			case 'Title Color':
				$('.h2-Title').css('color', foreColor);
				$('.h2-Title').css('background-color', bkColor);
				break;

			case 'LI Bkg':
				$('li').css('background-color', bkColor);
				break;

			case 'LI Color':
				$('li').css('color', foreColor);
				break;

			case 'A':
				$('a').css('color', foreColor);
				break;

			case 'Label Color':
				$('label').css('color', bkColor);
				break;

			case 'Label Bkg':
				$('label').css('background-color', bkColor);
				break;

			case 'Div Border Color':
				$('div').css('border-color', foreColor);
				break;

			case 'Menu Text':
				$('.nav').css('color', foreColor);
				break;

			case 'Menu Bkg':
				$('.nav').css('background-color', bkColor);
				break;

			case 'Header Bkg':
				$('dv-menu').css('background-color', bkColor);
				break;
		}


	});

});