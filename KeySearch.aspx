<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="KeySearch.aspx.cs" Inherits="KeyControlApp.KeySearch1" %>


<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
	
	<title>KeySearch</title>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta http-equiv="cache-control" content="no-cache" />

	<link href="Styles/jquery-ui.css" rel="stylesheet" />
	<link href="Styles/site.css" rel="stylesheet" />
	<link href="Styles/content.css" rel="stylesheet" />
	<link href="Styles/keysearch.css" rel="stylesheet" />
	<link href="Styles/popup.css" rel="stylesheet" />

	<script src="Scripts/jquery-1.12.4.js"></script>
	<script src="Scripts/jquery.mask.min.js"></script>
	<script src="Scripts/jquery-ui.js"></script>


	<%-- 	COMPILE js to min files
		https://closure-compiler.appspot.com/home
	--%>

	<script src="Scripts/vars.js"></script>
	<script src="Scripts/genericFuncs.js"></script>
	<script src="Scripts/dataFuncs.js"></script>
	<script src="Scripts/docReady.js"></script>


	<script>

		function preventBack() { window.history.forward(); }
		setTimeout("preventBack()", 0);
		window.onunload = function () { null };

		// datepickers
		$(function () {
			$('input[id^="dpk"]').datepicker({
				changeYear: true,
				format: 'mm/dd/yy'
			});
			$('input[id^="dpk"]').datepicker("option", "dateFormat", 'mm/dd/yy');
		});

	</script>

</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

	<div id="search_main">
		<div id="dvSpacer"></div>
			<div style="margin-left: 80px; font-size: 1.2em;">
<%--				<h6>My Sections :
					<select id="mySections1">
						<option recordid="" value=""></option>
					</select>
				</h6>--%>
			</div>
		<br />
		<div id="dvSearch">
			
			<div class="dvTopRow" >
				<div>
					<label id="lblMySec">My Sections :</label>
					<select id="mySections">
						<option recordid="" value=""></option>
					</select>

					<label id="lblSelLName">By Name:</label>
					<select class="key-Select" id="selLastName">
						<option recordid="" id="optZero" value=""></option>
					</select>

					<label id="lblSelKey">Key :</label>
					<select class="key-Select" id="selKeyNumber" >
						<option recordid="" value=""></option>
					</select>


					<label id="lblSelRoom">Room :</label>
					<select class="key-Select" id="selRoomNumber" >
						<option recordid="" value=""></option>
					</select>
				</div>

				<div class=".key-Input">
					<%--<input type="button" id="btnClear" value="Clear" />--%>
				</div>
			</div>

		</div>

		<div id="dvEntry">
			<div id="dvGrid">
				<div class="dvGridBody">
					<div id="dvDataColumns" >
						<div class="div-Columns" style="margin-left: 2px; width: 120px;">Last</div>
						<div class="div-Columns" style="width: 120px;">First</div>
						<div class="div-Columns" style="width: 80px;">Key #</div>
						<div class="div-Columns" style="width: 80px;">Room</div>
						<div class="div-Columns" style="width: 80px;">Issued</div>
						<div class="div-Columns" style="width: 80px;">Returned</div>
						<div class="div-Columns" style="width: 80px;">Lost</div>
						<div class="div-Columns" style="width: 165px;">Section</div>
					</div>
					<div id="dvData" >
						
					</div>
				</div>
			</div>
		</div>

	</div>

</asp:Content>
