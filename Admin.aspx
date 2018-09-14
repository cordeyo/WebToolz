<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Admin.aspx.cs" Inherits="KeyControlApp.Admin" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">

	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<title>Admin</title>

	<link href="Styles/jquery-ui.css" rel="stylesheet" />
	<link href="Styles/Site.css" rel="stylesheet" />
	<link href="Styles/content.css" rel="stylesheet" />
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
</asp:Content>
