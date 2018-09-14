


// LYNDON'S  
function MakeFormReadonly(parentID, skipIndex, showedit)
{
	$(parentID).each(function (i)
	{
		if (i != skipIndex)            // Skip Personnel Section 
		{
			$(this).find('label').each(function () {
				var txtBx = $(this).children('input[type="text"]');
				var txtArea = $(this).children('textarea');
				var drp = $(this).children('select');
				var html = "<span class='readonly-data' ";
				var id = '';

				if (txtBx.length > 0) {
					if (showedit)
						txtBx.show();
					else {
						id = 'spn' + txtBx.attr('id').substring(3);
						html += "id='" + id + "'>" + txtBx.val().replace(/\'/, "\'") + '</span>';
						txtBx.hide();
						$(this).append(html);
					}
				}
				else if (txtArea.length > 0) {
					if (showedit) {
						txtArea.show();
					}
					else {
						id = 'spn' + txtArea.attr('id').substring(3);
						html += "id='" + id + "'>" + txtArea.html().replace(/\n/gm, "<br />") + '</span>';
						txtArea.hide();

						$(this).append(html);
					}
				}
				else if (drp.length > 0) {
					if (drp.attr('skip') == undefined) {
						if (showedit)
							drp.show();
						else {
							var selValue = drp.children('option:selected').text();

							id = 'spn' + drp.attr('id').substring(3);
							selValue = selValue.length == 0 ? '' : selValue;

							if (id.indexOf('spnVehicleDriver') > -1 && selValue.length == 0) {
								selValue = 'Unknown'
							}

							html += "id='" + id + "'>" + selValue + '</span>';
							drp.hide();
							$(this).append(html);
						}
					}
				}
			});
		}
	});
}




















$(function () {
	$.ajax({
		type: "POST",
		url: "Default.aspx/GetCustomers",
		data: '{}',
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: OnSuccess
	});
});


// SUCCESS
function OnSuccess(response) {
	var xmlDoc = $.parseXML(response.d);
	var xml = $(xmlDoc);
	var customers = xml.find("Table");
	var row = $("[id*=gvCustomers] tr:last-child");
	if (customers.length > 0) {
		$.each(customers, function () {
			var customer = $(this);
			AppendRow(row, $(this).find("CustomerId").text(), $(this).find("Name").text(), $(this).find("Country").text())
			row = $("[id*=gvCustomers] tr:last-child").clone(true);
		});
	} else {
		row.find(".Edit").hide();
		row.find(".Delete").hide();
		row.find("span").html('&nbsp;');
	}
}

// ADD ROW 
function AppendRow(row, customerId, name, country) {
	//Bind CustomerId.
	$(".CustomerId", row).find("span").html(customerId);

	//Bind Name.
	$(".Name", row).find("span").html(name);
	$(".Name", row).find("input").val(name);

	//Bind Country.
	$(".Country", row).find("span").html(country);
	$(".Country", row).find("input").val(country);

	row.find(".Edit").show();
	row.find(".Delete").show();
	$("[id*=gvCustomers]").append(row);
}


// INSERTING RECORDS
//Add event handler.
$("body").on("click", "[id*=btnAdd]", function () {
	var txtName = $("[id*=txtName]");
	var txtCountry = $("[id*=txtCountry]");
	$.ajax({
		type: "POST",
		url: "Default.aspx/InsertCustomer",
		data: '{name: "' + txtName.val() + '", country: "' + txtCountry.val() + '" }',
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (response) {
			var row = $("[id*=gvCustomers] tr:last-child");
			if ($("[id*=gvCustomers] tr:last-child span").eq(0).html() != "&nbsp;") {
				row = row.clone();
			}
			AppendRow(row, response.d, txtName.val(), txtCountry.val());
			txtName.val("");
			txtCountry.val("");
		}
	});
	return false;
});

// EDITING RECORDS
//Edit event handler.
$("body").on("click", "[id*=gvCustomers] .Edit", function () {
	var row = $(this).closest("tr");
	$("td", row).each(function () {
		if ($(this).find("input").length > 0) {
			$(this).find("input").show();
			$(this).find("span").hide();
		}
	});
	row.find(".Update").show();
	row.find(".Cancel").show();
	row.find(".Delete").hide();
	$(this).hide();
	return false;
});


// UPDATING RECORDS
//Update event handler.
$("body").on("click", "[id*=gvCustomers] .Update", function () {
	var row = $(this).closest("tr");
	$("td", row).each(function () {
		if ($(this).find("input").length > 0) {
			var span = $(this).find("span");
			var input = $(this).find("input");
			span.html(input.val());
			span.show();
			input.hide();
		}
	});
	row.find(".Edit").show();
	row.find(".Delete").show();
	row.find(".Cancel").hide();
	$(this).hide();

	var customerId = row.find(".CustomerId").find("span").html();
	var name = row.find(".Name").find("span").html();
	var country = row.find(".Country").find("span").html();
	$.ajax({
		type: "POST",
		url: "Default.aspx/UpdateCustomer",
		data: '{customerId: ' + customerId + ', name: "' + name + '", country: "' + country + '" }',
		contentType: "application/json; charset=utf-8",
		dataType: "json"
	});

	return false;
});


// DELETING RECORDS
//Delete event handler.
$("body").on("click", "[id*=gvCustomers] .Delete", function () {
	if (confirm("Do you want to delete this row?")) {
		var row = $(this).closest("tr");
		var customerId = row.find("span").html();
		$.ajax({
			type: "POST",
			url: "Default.aspx/DeleteCustomer",
			data: '{customerId: ' + customerId + '}',
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (response) {
				if ($("[id*=gvCustomers] tr").length > 2) {
					row.remove();
				} else {
					row.find(".Edit").hide();
					row.find(".Delete").hide();
					row.find("span").html('&nbsp;');
				}
			}
		});
	}

	return false;
});

// CANCEL  
//Cancel event handler.
$("body").on("click", "[id*=gvCustomers] .Cancel", function () {
	var row = $(this).closest("tr");
	$("td", row).each(function () {
		if ($(this).find("input").length > 0) {
			var span = $(this).find("span");
			var input = $(this).find("input");
			input.val(span.html());
			span.show();
			input.hide();
		}
	});
	row.find(".Edit").show();
	row.find(".Delete").show();
	row.find(".Update").hide();
	$(this).hide();
	return false;
});