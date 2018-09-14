






///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
// Draw chart from DMLSS Inventory li click or selEquipment select 
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function DrawDmlssChart(title, datatable)
{
	// Create the data table.
	var dmlssData = new google.visualization.DataTable();
		
	dmlssData.addColumn('string', datatable.header1);
	dmlssData.addColumn('number', datatable.header2);

	var rows = [,]
	var x = 0;

	if (datatable.ManuData.length > 0) {
		for (var i = 0; i < datatable.ManuData.length; i++) {
			rows[i, x] = [datatable.ManuData[i], parseInt(datatable.CountData[i])];
			x++;
		}

		dmlssData.addRows(rows);
	}

	// Set chart options
	pieChartOptions = {
		titleTextStyle: {
			color: '#000000',
			fontName: 'Verdana',
			fontSize: 14,
			bold: true,
			width: 300
		},
		'title': title,
		'width': 800,
		'height': 460,
		'is3D': true
	};
		
	var dmlssChart = new google.visualization.PieChart(document.getElementById('dmlss_chart_div'));
	dmlssChart.draw(dmlssData, pieChartOptions);

	// use select instead of click event         
	// Register my event handlers                
	google.visualization.events.addListener(dmlssChart, 'select', function (e)
	{
		if (e !== undefined) {
			var selectedItem = dmlssChart.getSelection()[0];
			if (selectedItem) {
				var manufacturer = dmlssData.getValue(selectedItem.row, 0);
				var cnt = dmlssData.getValue(selectedItem.row, 1);

				$('#txtCount').val('DMLSS ' + manufacturer + ' ' + pieChartOptions.title + ' INVENTORY DATA - ' + cnt + ' TOTAL');

				// draw new chart on select  
				DmlssModelDrillDown(manufacturer, cnt, title);
			}
		}
	});
}
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
/// Dra
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function DmlssModelDrillDown(nomenclature, c, manu)
{
	GetDmlssDrillChartTable(nomenclature, manu);
}







///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
// Draw new chart when slice selected. If drill chart is clicked   
// a list of items will be displayed for export to EXCEL.          
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function DrawDmlssDrillChart(title, datatable)
{
	// Create the data table.
	var dmlssDrillData = new google.visualization.DataTable();

	dmlssDrillData.addColumn('string', datatable.header1);
	dmlssDrillData.addColumn('number', datatable.header2);

	var rows = [, ]
	var x = 0;
	
	if (datatable.ManuData.length > 0) {
		for (var i = 0; i < datatable.ManuData.length; i++) {
			rows[i, x] = [datatable.ManuData[i], parseInt(datatable.CountData[i])];
			x++;
		}
		dmlssDrillData.addRows(rows);
	}

	// Set chart options
	pieChartOptions = {
		titleTextStyle: {
			color: '#000000',
			fontName: 'Verdana',
			fontSize: 14,
			bold: true,
			width: 300
		},
		'title': title,
		'width': 800,
		'height': 460,
		'is3D': true
	};

	//alert('Drawing second chart  DrawDmlssDrillChart()');

	var dmlssDrillChart = new google.visualization.PieChart(document.getElementById('dmlss_chart_div'));
	dmlssDrillChart.draw(dmlssDrillData, pieChartOptions);

	// use select instead of click event         
	// Register my event handlers                
	google.visualization.events.addListener(dmlssDrillChart, 'select', function (e) {
		if (e !== undefined) {
			var selectedItem = dmlssDrillChart.getSelection()[0];
			if (selectedItem) {
				var manufacturer = dmlssDrillData.getValue(selectedItem.row, 0);
				var cnt = dmlssDrillData.getValue(selectedItem.row, 1);

				$('#dv_Nomenclature').css('visibility', 'hidden');
				$('#dv_DmlssCountTitle').css('visibility', 'hidden');

				HideElement('DmlssInventorySection')

				// Get chart data for specific item selected 
				// section, height, width, padding, margin   
				ShowElement('DataViewSection', '100%', '1868px', '5px', '0 5px 0 5px');
				
				// Set ul liMenuLeftMargin width after showing new menu items
				var p = document.getElementById("liMenuLeftMargin");
				var style = p.currentStyle || window.getComputedStyle(p);

				var mLeftWdith = style.width;
				var mLNum = mLeftWdith.substr(0, mLeftWdith.length - 2);   // remove 'px'
				var newW = (mLNum - 50).toString() + 'px';
				$('#liMenuLeftMargin').css('width', '380px');
				ShowElement('liMenuExcelExport', '35px', '120px', '15px 0 0 0', '10px 0 0 0');

				// Hide this menu item
				$('#liMenuExcelExport').fadeIn('slow', function () { });


				// Draw dynamic table                        
				GetDmlssGridData();

				$('footer').css('visibility', 'visible');
			}
		}
	});
}