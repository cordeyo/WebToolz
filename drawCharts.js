






///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///                                                             ///
///                Draw chart from DMLSS Inventory              ///
///                li click or selEquipment select              ///
///                                                             ///
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function DrawDmlssChart(title, datatable)
{
	gChartNomenclature = title;

	// Create the data table.
	var dmlssData = new google.visualization.DataTable();
		
	dmlssData.addColumn('string', datatable.header1);
	dmlssData.addColumn('number', datatable.header2);

	var arrayLen = datatable.ManuData.length;
	var rows = [arrayLen];
	var c = 0;

	if (arrayLen > 0) 
	{
		for (var i = 0; i < arrayLen; i++)
		{
			rows[i] = [2];
			rows[i][0] = datatable.ManuData[i];							//  Manufacturer from DDL,   
			rows[i][1] = parseInt(datatable.CountData[i]);	//  Number of items          
			console.log(rows);
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
		if (e !== undefined)
		{
			var selectedItem = dmlssChart.getSelection()[0];

			if (selectedItem) {
				// given HP from chart but should be HEWLETT-PACKARD CO (COMPUTERS)
				gChartManufacturer = dmlssData.getValue(selectedItem.row, 0);

				var cnt = dmlssData.getValue(selectedItem.row, 1);
				$('#txtCount').val('DMLSS ' + gChartManufacturer + ' ' + pieChartOptions.title + ' INVENTORY DATA - ' + cnt + ' TOTAL');

				// draw new chart on select chart slice  
				DmlssChartDrillDown(gChartManufacturer, cnt, title);
			}
		}
	});
}



///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///                                                             ///
///               Get the data for the 2nd chart                ///
///               after selection on the 1st chart              ///
///               GetDmlssDrillChartTable function              /// 
///               will draw the chart                           ///
///                                                             ///
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function DmlssChartDrillDown(manu, c, nomenclature)
{
	GetDmlssDrillChartTable(nomenclature, manu);
}




///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
///                                                             ///
///           Draw new chart when slice selected. If            ///
///           drill chart is clicked a list of items            ///
///           will be displayed for export to EXCEL.            ///
///                                                             ///
///@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
function DrawDmlssDrillChart(title, datatable)
{
	// Create the data table.
	var dmlssDrillData = new google.visualization.DataTable();
	var manu = title;

	dmlssDrillData.addColumn('string', datatable.header1);
	dmlssDrillData.addColumn('number', datatable.header2);

	var arrayLen = datatable.ManuData.length;
	var rows = [arrayLen];
	var c = 0;

	if (arrayLen > 0) {
		for (var i = 0; i < arrayLen; i++) {
			rows[i] = [2];
			rows[i][0] = datatable.ManuData[i];							//  Manufacturer from DDL,   
			rows[i][1] = parseInt(datatable.CountData[i]);	//  Number of items          
			console.log(rows);
		}
		console.log(rows);
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


	//  Drawing second chart  DrawDmlssDrillChart()
	var dmlssDrillChart = new google.visualization.PieChart(document.getElementById('dmlss_chart_div'));
	dmlssDrillChart.draw(dmlssDrillData, pieChartOptions);

	// use select instead of click event           
	// Register my event handlers                  
	google.visualization.events.addListener(dmlssDrillChart, 'select', function (e)
	{
		if (e !== undefined)
		{
			var selectedItem = dmlssDrillChart.getSelection()[0];

			if (selectedItem)
			{
				gChartModel = dmlssDrillData.getValue(selectedItem.row, 0);
				var cnt = dmlssDrillData.getValue(selectedItem.row, 1);

				HideDmlssSection();

				// Get chart data for specific item selected 
				ShowDataViewSection();

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
				// 0 = get manufacturer          
				// 1 = get model data            
				// 2 = get all nomenclature data 
				// 3 = (0-use params) (1-all)    
				// 4 = sort on this              
				GetDmlssGridData(gChartManufacturer, gChartModel, gChartNomenclature, '0', 'Ecn5');  // ECN5 to gChartModel

				$('footer').css('visibility', 'visible');
			}
		}
	});
}
