<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="KeyIssues.aspx.cs" Inherits="KeyControlApp.KeyEntry" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">

	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta http-equiv="cache-control" content="no-cache" />

	<title>KeyIssues</title>

	<link href="Styles/jquery-ui.css" rel="stylesheet" />
	<link href="Styles/Site.css" rel="stylesheet" />
	<link href="Styles/content.css" rel="stylesheet" />
	<link href="Styles/popup.css" rel="stylesheet" />
	<link href="Styles/keyissues.css" rel="stylesheet" />

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

	<form id="form1" runat="server">

		<div id="dialogOK" onblur="self.focus();">
			<h4>
				<label id="msgOk"></label>
			</h4>
		</div>
		<div id="dialogYesNo" onblur="self.focus();">
			<h4>
				<label id="msgYesNo"></label>
			</h4>
		</div>
		<div id="dialogYNCancel" onblur="self.focus();">
			<h4>
				<label id="msgYNCancel"></label>
			</h4>
		</div>


		<div id="dialogImgDeleteOK" onblur="self.focus();">
			<h4>
				<label id="msgImgDeleteOk"></label>
			</h4>
		</div>
		<div id="dialogImgDeleteYesNo" onblur="self.focus();">
			<h4>
				<label id="msgImgDeleteYesNo"></label>
			</h4>
		</div>

		<div id="dialogImgNewOK" onblur="self.focus();">
			<h4>
				<label id="msgImgNewOk"></label>
			</h4>
		</div>
		<div id="dialogImgNewYesNo" onblur="self.focus();">
			<h4>
				<label id="msgImgNewYesNo"></label>
			</h4>
		</div>

		<div id="confirmReplaceDialog" onblur="self.focus();"></div>


		<div id="control_area">
			<a href="#" class="info">
				<input type="image" class="controlImages info" id="imgNew" src="images/new20.png" />
				<span id="spAdd">Add a new record</span>
			</a>

			<a href="#" class="info">
				<input type="image" class="controlImages info" id="imgEdit" src="images/edit20.png" />
				<span id="spEdit">Edit this record</span>
			</a>

			<a href="#" class="info">
				<input type="image" class="controlImages info" id="imgSave" src="images/save20.png" />
				<span id="spSave">Save this record</span>
			</a>

			<a href="#" class="info">
				<input type="image" class="controlImages info" id="imgDelete" src="images/delete20.png" />
				<span id="spDelete">Delete this record</span>
			</a>
		</div>

		<div class="default_main">

			<div class="borders2x dv-TopBar"></div>
			<br /><br />
			<div style="margin-left: 80px; font-size: 1.2em;">
				<h4>
					<label >My Sections :</label>
					<select id="mySections">
						<option recordid="" value=""></option>
					</select>

					<label id="lblSelName">By Name:</label>
					<select class="key-Select" id="selLastName">
						<option recordid="" id="optZero" value=""></option>
					</select>
				</h4>
			</div>

			<br /><br />

			<div id="dv-data" class="dv-DataEntry borders2x borderShadows">

				<table style="margin-left: 22px; margin-top: 20px;">
					<tbody>
						<tr>
							<td>
								<label id="lblFName" class="key-Label">First Name :</label></td>
							<td>
								<input type="text" id="txtFirstName" class="key-Input" /></td>
							<td>
								<label id="lblLName" class="key-Label">Last Name :</label></td>
							<td>
								<input type="text" id="txtLastName" class="key-Input" /></td>
							<td>
								<label id="lblSection" class="key-Label">Section :</label></td>
							<td>
								<input type="text" id="txtSection" class="key-Input" /></td>
						</tr>

						<tr>
							<td></td>
						</tr>

						<tr>
							<td>
								<label id="lblKeyNumber" class="key-Label" >Key Number :</label></td>
							<td>
								<select class="key-Select" id="selKeyNumber">
									<option recordid="" value=""></option>
								</select>
							</td>
							<td>
								<label id="lblRoomNumber" class="key-Label" >Room Num. :</label></td>
							<td>
								<input type="text" id="txtRoomNumber" class="key-Input" />
							</td>
							<td>
								<label id="lblCustodian" class="key-Label" >Custodian :</label></td>
							<td>
								<select class="key-Select" id="selCustodian">
									<option recordid=""></option>
								</select>
							</td>
						</tr>

						<tr>
							<td></td>
						</tr>

						<tr>
							<td>
								<label id="lblIssued" class="key-Label">Issue Date :</label></td>
							<td>
								<input type="text" id="dpkIssued" class="key-Input" /></td>
							<td>
								<label id="lblReturned" class="key-Label">Return Date :</label></td>
							<td>
								<input type="text" id="dpkReturned" class="key-Input" /></td>
							<td>
								<label id="lblLost" class="key-Label">Lost Date :</label></td>
							<td>
								<input type="text" id="dpkLost" class="key-Input" /></td>
						</tr>

					</tbody>
				</table>




			</div>
			<!-- END dv-data -->

		</div>
		<!-- END default_main -->
	</form>

<%--<input type ="button" id="btnScroll" onclick="$.fn.TestClick();" value="SCROLL" />--%>

</asp:Content>
