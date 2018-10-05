
/*
	COMPILE js to min files
	https://closure-compiler.appspot.com/home
*/

/* use esversion: 6 */


strictFn();



























///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///                                                             ///
///                                                             ///
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
$(document).ready(function ()
{

	type = "application/javascript;version=1.7";

	var color = '';
	var countThis = '';
	
	
	


	

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
		document.getElementById('txtCountSccm').disabled = true;
		document.getElementById('txtEcnTitleBar').disabled = true;
		document.getElementById('txtSnTitleBar').disabled = true;

		HideElement('liMenuExcelExport');

		HideDataViewSection();
		HideSccmSection();
		HideDmlssSection();
		HideDiscrepanciesSection();
		HideHandReceiptSection();
		HideEcnSearchSection();
		HideSnSearchSection();

		GetAsOfDate();
		ShowAsOfDate();

		thisPage = inventoryPage;
		gChartNomenclature = 'PRINTER';
		title = gChartNomenclature;

		fromWho = 'Inline model count';

		$.ajax({
			sync: false,
			url: "ChartDataHandler.ashx",
			cache: false,
			type: "GET",
			datatype: "json",
			data: { 'option': 'GET', 'action': 'GetNomenclatureCount', 'nomen': gChartNomenclature },
			success: function (count) {
				// Count of PRINTER on startup 
				SetHiddenElement('hidNomenCount', count);
			},
			error: function (request, status, error) {
				LogError(request.status, request.statusText, request.responseText, fromWho);
			}
		});

	}







	///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
	///                                                             ///
	///                                                             ///
	///                         E V E N T S                         ///
	///                                                             ///
	///                                                             ///
	///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///



	///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
	///            button click event on banner page                ///
	///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
	$('#btnAcknowledges').click(function (e) {
		window.open('inventory.aspx', '_self', false);
	});



	///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
	//                 menu item click events                       ///
	///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
	$('li').click(function (e) {
		var id = this.id;
		var table = '';
		var criteria = '';

		liClicked = id;

		e.preventDefault();


		switch (id)
		{
			/////////////////
			/// Showing total PC count in SCCM by HP and DELL 
			case 'liMenuSccm':

				ShowAsOfDate();
				HideDataViewSection();
				HideDmlssSection();
				HideDiscrepanciesSection();
				HideHandReceiptSection();
				HideEcnSearchSection();
				HideSnSearchSection();

				// Hide this menu item
				highlightMenuItem(id, prevClicked, "SCCM Inventory");

				// Remove Excel Export if shown
				$('#liMenuExcelExport').fadeOut('slow', function () { });
				$('#liMenuLeftMargin').css('width', '450px');
				prevClicked = id;

				ShowSccmSection();
				break;


				/////////////////
			case 'liMenuDmlss':

				ShowAsOfDate();
				HideDataViewSection();
				HideSccmSection();
				HideDiscrepanciesSection();
				HideHandReceiptSection();
				HideEcnSearchSection();
				HideSnSearchSection();

				// Hide this menu item
				highlightMenuItem(id, prevClicked, "DMLSS Inventory");
				// Remove Excel Export if shown
				$('#liMenuExcelExport').fadeOut('slow', function () { });

				//   Lookup distinct Nomenclature from DMLSS table 
				//   and fill select 'selEquipment'                
				GetNomenclature();

				// show only on this menu select                   
				//$('#dv_Nomenclature').css('visibility', 'visible');
				//$('#dv_DmlssCountTitle').css('visibility', 'visible');
				//ShowElement('DmlssInventorySection', '', '', '', '');
				



				//################################################
				//  NEED TO GET NEW SCCM DATA FROM CYBER FIRST    
				// var sCount = GetEquipmentCount('', '', 'SCCM');
				//################################################

				//var e = document.getElementById('selEquipment');
				//gChartNomenclature = e.options[e.selectedIndex].text;
				// Always PRINTER on 1st open  
				gChartNomenclature = 'PRINTER';
				criteria = gChartNomenclature;


				$.ajax({
					sync: false,
					url: "ChartDataHandler.ashx",
					cache: false,
					type: "GET",
					datatype: "json",
					data: { 'option': 'GET', 'action': 'GetNomenclatureCount', 'nomen': gChartNomenclature },
					success: function (count)
					{
						SetHiddenElement('hidNomenCount', count);
						SetHiddenElement('hidNomenclature', gChartNomenclature);
					},
					error: function (request, status, error) {
						LogError(request.status, request.statusText, request.responseText, fromWho);
					}
				});

				table = 'DMLSS';
				// Load manufactures [printers] chart             
				GetEquipmentCount(table, criteria, 'DMLSS');
				
				// section, height, width, padding, margin   
				//ShowElement('DmlssInventorySection', "550px", "1200px", "0", "20px 0 0 337px");
				//ShowElement('dv_Info', '', '', '', '');
				ShowDmlssSection();

				// Get data from handler and draw chart      
				GetDmlssChartTable(gChartNomenclature, title);
				prevClicked = id;
				$('#liMenuLeftMargin').css('width', '450px');
				break;



				/////////////////
			case 'liMenuDiscrepancies':

				ShowAsOfDate();
				HideDataViewSection();
				HideSccmSection();
				HideDmlssSection();
				HideHandReceiptSection();
				HideEcnSearchSection();
				HideSnSearchSection();

				highlightMenuItem(id, prevClicked, "Discrepancies");
				// Hide this menu item
				$('#liMenuExcelExport').fadeOut('slow', function () { });

				// section, height, width, padding, margin   
				//ShowElement('DiscrepanciesSection', "400px", "1000px", "5px", "50px 0 0 442px");
				ShowDiscrepanciesSection();

				prevClicked = id;
				$('#liMenuLeftMargin').css('width', '450px');
				break;



				/////////////////
			case 'liMenuHandReceipts':

				ShowAsOfDate();
				HideDataViewSection();
				HideSccmSection();
				HideDmlssSection();
				HideDiscrepanciesSection();
				HideEcnSearchSection();
				HideSnSearchSection();

				highlightMenuItem(id, prevClicked, "Reconciled Hand Receipts");
				// Hide this menu item
				$('#liMenuExcelExport').fadeOut('slow', function () { });

				// section, height, width, padding, margin   
				//ShowElement('ReconciledSection', "400px", "1000px", "5px", "50px 0 0 442px");
				ShowHandReceiptSection();

				prevClicked = id;
				$('#liMenuLeftMargin').css('width', '450px');
				break;



				/////////////////
			case 'liMenuEcnSearch':

				HideAsOfDate();
				HideDataViewSection();
				HideSccmSection();
				HideDmlssSection();
				HideDiscrepanciesSection();
				HideHandReceiptSection();
				HideSnSearchSection();

				highlightMenuItem(id, prevClicked, "Search ECN");
				// Hide this menu item
				$('#liMenuExcelExport').fadeOut('slow', function () { });
				prevClicked = id;
				$('#liMenuLeftMargin').css('width', '450px');

				ShowEcnSearchSection(true);
				document.getElementById('txtEcnSearchFor').focus();
				document.getElementById('txtEcnSearchFor').value = '044166\n044312\n043470\n043333';
				break;

				/////////////////
			case 'liMenuSnSearch':

				HideAsOfDate();
				HideDataViewSection();
				HideDmlssSection();
				HideDiscrepanciesSection();
				HideHandReceiptSection();
				HideEcnSearchSection();

				highlightMenuItem(id, prevClicked, "Search SN");
				// Hide this menu item
				$('#liMenuExcelExport').fadeOut('slow', function () { });
				prevClicked = id;
				$('#liMenuLeftMargin').css('width', '450px');

				ShowSnSearchSection(true);
				document.getElementById('txtSnSearchFor').focus();
				document.getElementById('txtSnSearchFor').value = 'MJ01HG2Q\nA1AP01G00315\n3SQ2N22\n2UA4370CYF';
				break;

				/////////////////
			case 'liMenuViewAllDmlss':

				HideAsOfDate();
				HideDmlssSection();
				HideSccmSection();
				HideDiscrepanciesSection();
				HideHandReceiptSection();
				HideEcnSearchSection();
				HideSnSearchSection();

				highlightMenuItem(id, prevClicked, "View All DMLSS Inv.");
				// Hide this menu item
				$('#liMenuExcelExport').fadeOut('slow', function () { });


				//**************************
				//   AJAX GET DATA          
				//**************************
				// 
				// section, height, width, padding, margin   
				// ShowElement('SearchSnSection', "400px", "1000px", "5px", "50px 0 0 442px");
				ShowDataViewSection();

				prevClicked = id;
				$('#liMenuLeftMargin').css('width', '450px');
				break;

				// Hide until dataViewSection is visible

				/////////////////
			case 'liMenuExcelExport':
				highlightMenuItem(id, prevClicked, "Excel Export");
				prevClicked = id;

				
				break;

			default:
				break;
		}
	});



	///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
	///                  select change event                        ///
	///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
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

		switch (ddlID)
		{
			////////////////////
			case 'selEquipment':
				ShowDmlssSection();

				// Get new data and draw new chart 
				gChartNomenclature = selection;
				fromWho = 'Inline selEquipment change';

				//##################################################
				//  NEED TO GET NEW SCCM DATA FROM CYBER FIRST      
				// var sCount = GetEquipmentCount('', '', 'SCCM');  
				// Load manufactures [printers] chart               
				//##################################################

				table = 'DMLSS';
				criteria = gChartNomenclature;
				GetEquipmentCount(table, criteria, 'DMLSS');

				// Get data from handler and draw chart
				GetDmlssChartTable(gChartNomenclature, selection);
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
			case "Border Color":
				$('#' + ddlID).css('border', '1px solid' + foreColor);
				$('#' + ddlID).css('background-color', bkColor);
				break;

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

	

	///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
	//
	$("input[type='button']").click(function (e) {
		e.preventDefault();

		var searchType = "";
		var lines = [];
		var btn = $(this.id);

		switch(this.id)
		{
			case 'btnEcnSearch':
				if($('#txtEcnSearchFor').val().length === 0) {
					alert('Nothing to search for');
					return;
				}
				searchType = "ECN";
				lines = $('#txtEcnSearchFor').val().split('\n');
				break;

			case 'btnSnSearch':
				if($('#txtSnSearchFor').val().length === 0) {
					alert('Nothing to search for');
					return;
				}
				searchType = "SN";
				lines = $('#txtSnSearchFor').val().split('\n');
				break;

			default:
				break;
		}

		// Get info on items listed in textarea  
		try {
			$.ajax({
				url: "ChartDataHandler.ashx",
				cache: false,
				type: "GET",
				data: { 'option': 'GET', 'action': 'GetArraySearchData', 'searchFor': JSON.stringify(lines), 'searchType': searchType },
				success: function (dataTable) {
					if (dataTable.length === 0) {
						return "ERROR: No data returned from Handler to " + btn.selector + ".click()";
					}

					var rowCount = dataTable.length;    // / 18;
					var i = 0;

					/// Need to build list of returned data in dv_EcnSearchResults
					while (i < rowCount) {
						for (i = 0; i < rowCount; i++) {
							EcnSnSearchData.ECN[i] = dataTable[i].ECN;
							EcnSnSearchData.ECN5[i] = dataTable[i].ECN5; // not shown on page
							EcnSnSearchData.MfrSerialNo[i] = dataTable[i].MfrSerialNo;
							EcnSnSearchData.Manufacturer[i] = dataTable[i].Manufacturer;
							EcnSnSearchData.Model[i] = dataTable[i].Model;
							EcnSnSearchData.Nomenclature[i] = dataTable[i].Nomenclature;
							EcnSnSearchData.CommonModel[i] = dataTable[i].CommonModel;
							EcnSnSearchData.Ownership[i] = dataTable[i].Ownership;
							EcnSnSearchData.MaintAct[i] = dataTable[i].MaintAct;   // not shown on page
							EcnSnSearchData.ID[i] = dataTable[i].ID;
							EcnSnSearchData.Location[i] = dataTable[i].Location;
							EcnSnSearchData.Custodian[i] = dataTable[i].Custodian;
							EcnSnSearchData.Customer[i] = dataTable[i].Customer;
							EcnSnSearchData.CustomerID[i] = dataTable[i].CustomerID;
							EcnSnSearchData.OrgName[i] = dataTable[i].OrgName;
							EcnSnSearchData.AcqDate[i] = dataTable[i].AcqDate;
							EcnSnSearchData.AcqCost[i] = dataTable[i].AcqCost;
							EcnSnSearchData.LifeExp[i] = dataTable[i].LifeExp;
						}
					}

					ListSearchResults(EcnSnSearchData, rowCount, searchType);

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
		return false;
	});




	///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
	///            Delegate to Get row info under mouse             ///
	///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
	$('#dvDmlssData').on('mouseenter', 'div[id^="dvRow"]', function (e) {
		e.preventDefault();

		var parent = e.delegateTarget;                            // div with id dvDmlssData on Inventory.aspx  
		var rowChild = $(parent).find($('div [id^="dvRow"]'));    // the child div where id = dvRow* of parent  
		
		// Outline row under mouse 
		$(this).addClass('boxRow');
		$('#lblInfo').text('Click ECN to see more data on this equipment.');
	});

	///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
	///            Delegate to leave row info under mouse             ///
	///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
	$('#dvDmlssData').on('mouseleave', 'div[id^="dvRow"]', function (e) {

		e.preventDefault();
		var parent = e.delegateTarget;                            // div with id dvDmlssData on Inventory.aspx  
		var rowChild = $(parent).find($('div [id^="dvRow"]'));    // the child div where id = dvRow* of parent  
		// Clear outline 
		$(rowChild).removeClass('boxRow');
		$('#lblInfo').text('');

		var col = $(parent).find($('span [id^="col-"]'));
		$(col).css('color', 'rgb(255,0,0)');               // red  
		$(col).css('background-Color', 'rgb(255,255,0)');  // yellow
	});

	///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
	///           Click Delegate for row info under mouse           ///
	///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
	$('#dvDmlssData').on('click', 'div[id^="dvRow"]', function (e) {
		e.preventDefault();
		var parent = e.delegateTarget;                            // div with id dvDmlssData on Inventory.aspx  
		var rowChild = $(parent).find($('div [id^="dvRow"]'));    // the child div where id = dvRow* of parent  
		var ecn = $(this).text().substring(0, 5).trim();

		//console.clear();

		// Find column


		
	});

	///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
	///              Click Delegate for column sorting              ///
	///             Get new data on column header click             ///
	///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
	$('#dvDataColumns').on('click', 'div', function (e) {
		e.preventDefault();
		var parent = e.delegateTarget;
		var header = $(parent).find($('div [id^="hd"]'));
		var headName = $(this).text();

		//console.clear();
		alert('Sorting by [' + headName + ']');

		// Get new data on column header click      
		//GetDmlssGridData(gChartNomenclature, gChartModel, '0', headName.trim());


	});








});
