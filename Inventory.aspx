<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Inventory.aspx.cs" Inherits="PCInventory2018.Inventory" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
	<title>Inventory</title>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<link href="Styles/jquery-ui.css" rel="stylesheet" type="text/css" />
	<link href="Styles/popup.css" rel="stylesheet" type="text/css" />
	<link href="Styles/design.css" rel="stylesheet" type="text/css" />



	<%--<script src="Scripts/less.js"></script>--%>
	<script src="Scripts/jquery-1.12.4.js"></script>
	<script src="Scripts/jquery-ui.js"></script>
	<script src="Scripts/myDebugging.js"></script>

	<!-- Google Charts -->
	<script src="Scripts/loader.js"></script>
	<script src="Scripts/global.js"></script>

	<script>
		// use javascript 1.7 for LET, CONST
		type = "application/javascript;version=1.7";

		///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		///  Click event for dynamically created spans containing data  ///
		///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		function ecnSpanClick(e) {
			e.preventDefault;

			let id = e.id;
			let ecn = e.innerText;
			let fromWho = 'ecnSpanClick(e)';

			// Get data for ECN  
			try {
				$.ajax({
					url: "ChartDataHandler.ashx",
					cache: false,
					type: "GET",
					data: { 'option': 'GET', 'action': 'GetSearchData', 'searchFor': ecn, 'search': 'ECN', 'manu': gChartManufacturer, 'nomen': gChartNomenclature },
					success: function (data) {
						if (data.length === 0 || data === undefined) {
							return "ERROR: No data returned from Handler to ecnSpanClick().";
						}

						ClearSearchObject();

						EcnSnSearchData.ECN[0] = data.ECN;
						EcnSnSearchData.MfrSerialNo[0] = data.MfrSerialNo;
						EcnSnSearchData.Manufacturer[0] = data.Manufacturer;
						EcnSnSearchData.Model[0] = data.Model;
						EcnSnSearchData.Nomenclature[0] = data.Nomenclature;
						EcnSnSearchData.CommonModel[0] = data.CommonModel;
						EcnSnSearchData.Ownership[0] = data.Ownership;
						EcnSnSearchData.ID[0] = data.ID;
						EcnSnSearchData.Custodian[0] = data.Custodian;
						EcnSnSearchData.Customer[0] = data.Customer;
						EcnSnSearchData.CustomerID[0] = data.CustomerID;
						EcnSnSearchData.OrgName[0] = data.OrgName;
						EcnSnSearchData.Location[0] = data.Location;
						EcnSnSearchData.AcqCost[0] = data.AcqCost;
						EcnSnSearchData.AcqDate[0] = data.AcqDate;
						EcnSnSearchData.LifeExp[0] = data.LifeExp;

						ListSearchResults(data, data.length, 'ECN');
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

			HideDataViewSection();
			ShowEcnSearchSection(false);
			$('#dv_EcnSearchCriteria').css('visibility', 'visible');

			prevClicked = "liMenuDmlss";
			//                  highlight           current        menu text 
			highlightMenuItem('liMenuEcnSearch', prevClicked, "Search ECN");

			prevClicked = 'liMenuEcnSearch';
		}

		// span click on SCCM data view 
		function snSpanClick(e) {
			e.preventDefault;

			var id = e.id;
			var ecn = e.innerText;
			var fromWho = 'snSpanClick(e)';

			// Get data for ECN  
			try {
				$.ajax({
					url: "ChartDataHandler.ashx",
					cache: false,
					type: "GET",
					data: { 'option': 'GET', 'action': 'GetSearchData', 'searchFor': ecn, 'search': 'SN' },
					success: function (data) {
						if (data.length === 0 || data === undefined) {
							return "ERROR: No data returned from Handler to snSpanClick().";
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

			HideDataViewSection();
			ShowSnSearchSection(false);
			$('#dv_SnSearchCriteria').css('visibility', 'visible');
			prevClicked = 'liMenuSccm';
			highlightMenuItem('liMenuSnSearch', prevClicked, "Search SN");
			prevClicked = 'liMenuSnSearch';
		}

	</script>


	<script src="Scripts/drawCharts.js"></script>
	<script src="Scripts/miscFunctions.js"></script>
	<script src="Scripts/datafunctions.js"></script>
	<script src="Scripts/docReady.js"></script>

</head>
<body>

	<div id="dialogOK" onblur="self.focus();"></div>
	<div id="dialogYesNo" onblur="self.focus();"></div>
	<div id="dialogYNCancel" onblur="self.focus();"></div>
	<div id="confirmReplaceDialog" onblur="self.focus();"></div>

	<form id="form1" runat="server">
		<input type="hidden" id="hidSccmCount" />
		<input type="hidden" id="hidDmlssCount" />
		<input type="hidden" id="hidNomenCount" />
		<input type="hidden" id="hidNomenclature" />
		<input type="hidden" id="hidModelCount" />
		<input type="hidden" id="hidModel" />


		<div id="dv_page" style="height: 100%;">

			<header>
				<div id="dv_menu" class="nav">

					<div>
						<h2 class="h2-Title">EAMC PC INVENTORY</h2>
						<div class="h2_spc"></div>
						<div class="loginDisplay">
							Welcome
						<asp:Label ID="lblName" runat="server"></asp:Label>
							!
						</div>
					</div>

					<ul>
						<li id="liMenuLeftMargin"></li>
						<li id="liMenuSccm"><a href="#" class="anchors">SCCM Inventory</a></li>
						<li id="liMenuDmlss"><a href="#" class="anchors">DMLSS Inventory</a></li>
						<li id="liMenuDiscrepancies"><a href="#" class="anchors">Discrepancies</a></li>
						<li id="liMenuHandReceipts"><a href="#" class="anchors">Reconciled Hand Receipts</a></li>
						<li id="liMenuEcnSearch"><a href="#" class="anchors">Search ECN</a></li>
						<li id="liMenuSnSearch"><a href="#" class="anchors">Search SN</a></li>
						<li id="liMenuViewAllDmlss"><a href="#" class="anchors">View All DMLSS Inv.</a></li>
						<li id="liMenuExcelExport"><a href="#" class="anchors">Excel Export</a></li>
					</ul>

				</div>
			</header>


			<div id="dvSpc" style="width: 90%; height: 40px;">

				<div style="width: 100%; padding-top: 10px; margin-left: 50px;">
					<!-- Only shown when DataViewSection is visible -->
					<div id="dv_Info">
						<div>
							<label id="lblInfo"></label>
						</div>
					</div>

					<div id="dv_Nomenclature" style="padding-bottom: 5px;">
						<!-- Nomenclature data -->
						<label for="selEquipment" id="lblEquip">Equipment</label>
						<select id="selEquipment">
							<option value=""></option>
						</select>
					</div>
				</div>
			</div>

			<div id="dv_content" <%--class="bordersBrown_1x8 borderShadows"--%>>


				<!-- SOMEWHERE put a div for 'View All DMLSS Inventory, View All HP Inventory, Return to Main

					AND a div with button for Export To Excel, Filter, Reset View, Return To Main
					
					-->


				<!-- ######################## -->
				<section id="DataViewSection" class="bordersBrown_2x8">

					<!-- DATA COLUMNS
							ECN, Manufacturer, Model, Nomenclature, Custodian, Customer, Customer ID
						 -->
					<div id="dvEntry">
						<div id="dvGrid">
							<div class="dvGridBody">
								<div id="dvDataColumns">
									<div id="hd1" class="div-Headers" style="width: 40px;">ECN</div>
									<div id="hd2" class="div-Headers" style="width: 350px;">Manufacturer</div>
									<div id="hd3" class="div-Headers" style="width: 155px;">Model</div>
									<div id="hd4" class="div-Headers" style="width: 420px;">Nomenclature</div>
									<div id="hd5" class="div-Headers" style="width: 400px;">Custodian</div>
									<div id="hd6" class="div-Headers" style="width: 200px;">Customer</div>
									<div id="hd7" class="div-Headers" style="width: 192px;">Customer ID</div>
								</div>

								<div id="dvDmlssData">
									<!-- js will create a new div here called dvDmlssContent -->
								</div>
							</div>
						</div>
					</div>
				</section>

				<!-- ######################## -->
				<section id="SccmInventorySection" class="bordersBrown_2x8 sections">

					<div id="dv_SccmTitleBar">
						<input type="text" id="txtCountSccm" value="SCCM Information" />
					</div>

					<div id="sccm_chart_div" class="chartDivs" style="display: inline-block;">
					</div>

				</section>


				<!-- ######################## -->
				<section id="DmlssInventorySection" class="bordersBrown_2x8 sections">

					<div id="dv_DmlssCountTitle">
						<input type="text" id="txtCount" />
					</div>

					<div id="dmlss_chart_div" class="chartDivs" style="display: inline-block;">
					</div>

				</section>

				<!-- ######################## -->
				<section id="DiscrepanciesSection" class="bordersBrown_2x8 sections">
					<div id="dv_DiscrepTitle">
						<input type="text" id="txtDisTitleBar" value="DMLSS-SCCM Discrepancies" />
					</div>
				</section>

				<!-- ######################## -->
				<section id="HandReceiptSection" class="bordersBlack_2x8 sections">
					<div id="dv_HandRecTitleBar">
						<input type="text" id="txtHandTitleBar" value="Reconciled Hand Receipts" />
					</div>
				</section>

				<!-- ######################## -->
				<section id="SearchEcnSection" class="bordersBrown_2x8 sections">

					<div id="dv_EcnTitleBar">
						<input type="text" id="txtEcnTitleBar" class="center" value="ECN Search Equipment Information" />

						<div id="dv_EcnSearchCriteria" >
							<div >
								<label id="lblEcnLbl" >Enter each full 6 digit ECN on a new line</label><br />
							</div>
							<br />
							<textarea class="input" id="txtEcnSearchFor" rows="4" cols="18" ></textarea><br />

							<input type="button" id="btnEcnSearch" value="Submit" />
						</div>
						<!-- dynamic data here -->
						<div id="dv_EcnSearchResults" >

						</div>

					</div>
				</section>




				<!-- ######################## -->
				<section id="SearchSnSection" class="bordersBrown_2x8 sections">

					<div id="dv_SnTitleBar">
						<input type="text" id="txtSnTitleBar" class="center" value="Serial Number Search Equipment Information" />
						
						<div id="dv_SnSearchCriteria" >

							<label id="lblSnLbl" >Enter each serial number on a new line</label><br />
							<br />
							<textarea class="input" id="txtSnSearchFor" rows="4" cols="18" ></textarea><br />
							<input type="button" id="btnSnSearch" value="Submit" />
						</div>
						<!-- dynamic data here -->
						<div id="dv_SnSearchResults" >


						</div>
					</div>
				</section>
			</div>

			<br />
			<div id="dv_asOfDate">
				<label id="lblAsOfDate"></label>
			</div>

			<footer>

			</footer>
		</div>

	</form>

	<script>
		///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		function HideElement(element) {
			var el = document.getElementById(element);
			el.style.visibility = "hidden";
			el.style.width = "0";
			el.style.height = "0";
			el.style.padding = "0";
			el.style.margin = "0";
			return false;
		}
		///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// element, height, width, padding, margin                        
		///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		function ShowElement(element, h, w, p, m) {
			var el = document.getElementById(element);
			el.style.width = w;
			el.style.height = h;
			el.style.padding = p;
			el.style.margin = m;
			el.style.visibility = "visible";
			return false;
		}
		///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		///          Toggle highlight on menu buttons in header         ///
		///                                                             ///
		///      menuItem - Menu item to highlight                      ///
		///      prev - Menu item currently highlighted                 ///
		///      aName - Menu anchor text for the item to highlight     ///
		///                                                             ///
		///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		function highlightMenuItem(menuItem, prev, aName) {

			if (menuItem == undefined || menuItem === "" || aName === undefined || aName === "")
				return;

			$('a.anchors').each(function (i, e) {
				if ($.trim($(e)[0].innerText) === aName) {
					var li = document.getElementById(menuItem);
					// Highlight
					$(li).css('background-color', '#BA0651');
					$(li).css('border', '2px solid white');
					$(e).css('background-color', '#BA0651');
					$(e).css('color', '#F2F3D9');
					$(e).css('font-weight', 'bold');
					$(e).css('outline', 'none');
				}
				else {
					var li = document.getElementById(prev);
					// Remove highlight
					$(li).css('background-color', '#F2F3D9');
					$(li).css('border', 'none');
					$(e).css('background-color', '#F2F3D9');
					$(e).css('color', '#BA0651');
					$(e).css('font-weight', 'normal');
					$(e).css('outline', 'none');
				}
			});
			return false;
		}


		function HideAsOfDate() {
			HideElement('dv_asOfDate');
			$('#lblAsOfDate').css('display', 'none');
		}
		function HideSccmSection() {
			HideElement('SccmInventorySection');
			$('#txtCountSccm').css('visibility', 'hidden');
			$('#dv_SccmTitleBar').css('visibility', 'hidden');
			$('#sccm_chart_div').css('visibility', 'hidden');
			$('#txtCountSccm').css('visibility', 'hidden');
		}
		function HideDmlssSection() {
			HideElement('DmlssInventorySection');
			$('#txtCount').css('visibility', 'hidden');
			$('#dv_DmlssCountTitle').css('visibility', 'hidden');
			$('#dv_Nomenclature').css('visibility', 'hidden');
		}
		function HideDataViewSection() {
			HideElement('DataViewSection');
			HideElement('dv_Info');
			$('#dv_asOfDate').css('visibility', 'hidden');
		}
		function HideDiscrepanciesSection() {
			HideElement('DiscrepanciesSection');
		}
		function HideHandReceiptSection() {
			HideElement('HandReceiptSection');
		}
		function HideEcnSearchSection() {
			HideElement('SearchEcnSection');
			$('#dv_EcnSearchCriteria').css('visibility', 'hidden');
			$('#dv_EcnTitleBar').css('visibility', 'hidden');
			$('#txtEcnTitleBar').css('visibility', 'hidden');
		}
		function HideSnSearchSection() {
			HideElement('SearchSnSection');
			$('#dv_SnSearchCriteria').css('visibility', 'hidden');
			$('#dv_SnTitleBar').css('visibility', 'hidden');
			$('#txtSnTitleBar').css('visibility', 'hidden');
		}




		/// Show Sections when needed 
		function ShowDataViewSection() {
			/// element, height, width, padding, margin    
			ShowElement('DataViewSection', "95%", "1890px", "0", "0 0 0 10px");
			$('#dv_asOfDate').css('visibility', 'hidden');
			$('#lblAsOfDate').css('visibility', 'hidden');
		}
		function ShowSccmSection() {
			ShowElement('SccmInventorySection', "560px", "1000px", "0", "50px 0 0 442px");
			$('#dv_SccmTitleBar').css('visibility', 'visible');
			$('#sccm_chart_div').css('visibility', 'visible');
			$('#txtCountSccm').css('visibility', 'visible');
			$('#dv_asOfDate').css('visibility', 'visible');
			$('#lblAsOfDate').css('visibility', 'visible');
		}
		function ShowDmlssSection() {
			// height, width, padding, margin
			ShowElement('DmlssInventorySection', "560px", "1000px", "0", "50px 0 0 442px");
			ShowElement('dv_Info', '', '', '', '');
			ShowElement('dv_DmlssCountTitle', '40px', '997px', '0', '0');
			$('#txtCount').css('visibility', 'visible');
			$('#dv_Nomenclature').css('visibility', 'visible');
			$('#dv_asOfDate').css('visibility', 'visible');
			$('#lblAsOfDate').css('visibility', 'visible');
		}
		function ShowDiscrepanciesSection() {
			ShowElement('DiscrepanciesSection', "600px", "1000px", "0", "5px 0 0 442px");
			$('#dv_asOfDate').css('visibility', 'visible');
			$('#lblAsOfDate').css('visibility', 'visible');
		}
		function ShowHandReceiptSection() {
			ShowElement('HandReceiptSection', "600px", "1000px", "0", "5px 0 0 442px");
			$('#dv_asOfDate').css('visibility', 'visible');
			$('#lblAsOfDate').css('visibility', 'visible');
		}
		/// If newSearch = true show elements that 
		/// allow data entry for search            
		function ShowEcnSearchSection(newSearch) {
			if (newSearch === true)
				$('#dv_EcnSearchCriteria').css('visibility', 'visible');
			else
				$('#dv_EcnSearchCriteria').css('visibility', 'hidden');

			ShowElement('SearchEcnSection', "600px", "1800px", "0", "5px 0 0 25px");
			$('#dv_EcnTitleBar').css('visibility', 'visible');
			$('#txtEcnTitleBar').css('visibility', 'visible');
			$('#dv_asOfDate').css('visibility', 'visible');
			$('#lblAsOfDate').css('visibility', 'visible');
		}
		/// If newSearch = true show elements that 
		/// allow data entry for search            
		function ShowSnSearchSection(newSearch) {
			if (newSearch === true)
				$('#dv_SnSearchCriteria').css('visibility', 'visible');
			else
				$('#dv_SnSearchCriteria').css('visibility', 'hidden');

			ShowElement('SearchSnSection', "600px", "1800px", "0", "5px 0 0 25px");
			$('#dv_SnTitleBar').css('visibility', 'visible');
			$('#txtSnTitleBar').css('visibility', 'visible');
			$('#dv_asOfDate').css('visibility', 'visible');
			$('#lblAsOfDate').css('visibility', 'visible');
		}
		function ShowAsOfDate() {
			ShowElement('dv_asOfDate', '20px', '350px', '5px', '0 0 0 750px');
			$('#lblAsOfDate').css('display', 'block');
		}


	</script>
</body>

</html>
