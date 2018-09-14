<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Inventory.aspx.cs" Inherits="PCInventory2018.Inventory" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
	<title>Inventory</title>

	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<link href="Styles/jquery-ui.css" rel="stylesheet" type="text/css" />

	<%--<script src="Scripts/less.js"></script>--%>
	<link href="Styles/design.css" rel="stylesheet" type="text/css" />

	<script src="Scripts/jquery-1.12.4.js"></script>
	<script src="Scripts/jquery-ui.js"></script>

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
		function ShowElement(element, h, w, p, m) {
			var el = document.getElementById(element);
			el.style.width = w;
			el.style.height = h;
			el.style.padding = p;
			el.style.margin = m;
			el.style.visibility = "visible";
			return false;
		}


		function highlightMenuItem(menuItem, prev, aName) {

			if (menuItem == undefined || menuItem === "" || aName === undefined || aName === "")
				return;

			$('a.anchors').each(function (i, e) {
				if ($.trim($(e)[0].innerText) === aName) {
					var li = document.getElementById(menuItem);
					$(li).css('background-color', '#BA0651');
					$(li).css('border', '2px solid white');
					// Highlight
					$(e).css('background-color', '#BA0651');
					$(e).css('color', '#F2F3D9');
					$(e).css('font-weight', 'bold');
					$(e).css('outline', 'none');
				}
				else {
					var li = document.getElementById(prev);
					$(li).css('background-color', '#F2F3D9');
					$(li).css('border', 'none');
					// Remove highlight
					$(e).css('background-color', '#F2F3D9');
					$(e).css('color', '#BA0651');
					$(e).css('font-weight', 'normal');
					$(e).css('outline', 'none');
				}
			});

			return false;
		}

	</script>

	<script src="Scripts/miscFunctions.js"></script>

	<!-- Google Charts -->
	<script src="Scripts/loader.js"></script>

	<script src="Scripts/global.js"></script>
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
						<li id="liMenuDescrepancies"><a href="#" class="anchors">Discrepancies</a></li>
						<li id="liMenuHandReceipts"><a href="#" class="anchors">Reconciled Hand Receipts</a></li>
						<li id="liMenuEcnSearch"><a href="#" class="anchors">Search ECN</a></li>
						<li id="liMenuSnSearch"><a href="#" class="anchors">Search SN</a></li>
						<li id="liMenuViewAllDmlss"><a href="#" class="anchors">View All DMLSS Inv.</a></li>
						<li id="liMenuExcelExport"><a href="#" class="anchors">Excel Export</a></li>
					</ul>

				</div>
			</header>


			<div id="dvSpc" style="width: 90%; height: 40px;">
				<div style="width: 100%;">
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
									<div class="div-Columns" style="margin-left: 2px; width: 40px;">ECN</div>
									<div class="div-Columns" style="width: 350px;">Manufacturer</div>
									<div class="div-Columns" style="width: 155px;">Model</div>
									<div class="div-Columns" style="width: 420px;">Nomenclature</div>
									<div class="div-Columns" style="width: 400px;">Custodian</div>
									<div class="div-Columns" style="width: 250px;">Customer</div>
									<div class="div-Columns" style="width: 120px;">Customer ID</div>
								</div>
								<div id="dvDmlssData">
								</div>
							</div>
						</div>
					</div>
				</section>

				<!-- ######################## -->
				<section id="SccmInventorySection" class="bordersBrown_2x8 sections">
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
				<section id="DescrepanciesSection" class="bordersBrown_2x8 sections">
				</section>

				<!-- ######################## -->
				<section id="ReconciledSection" class="bordersBlack_2x8 sections">
				</section>

				<!-- ######################## -->
				<section id="SearchEcnSection" class="bordersBlack_2x8 sections"></section>

				<!-- ######################## -->
				<section id="SearchSnSection" class="bordersBlack_2x8 sections"></section>


				<br />
				<br />

				<br />
				<br />

			</div>

			<br />
			<div id="dv_asOfDate">
				<label id="lblAsOfDate"></label>
			</div>

			<footer></footer>
		</div>

	</form>
</body>
</html>
