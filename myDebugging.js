

var thisElementStyle = {
	'border': '',
	'border-radius': '',
	'top-border': '',
	'right-border': '',
	'bottom-border': '',
	'left-border': ''

}




$(document).ready(function () {


	$('div').mouseenter(function (e) {

		if(e.target.id === 'dv_Info')
		{
			alert('Found');
		}
	});


	// Show each elements style in the console 
	// as the mouse moves across screen        
	$('body').mousemove(function (e)
	{

		var thisElement = e.target;
		var elStyle = thisElement.style;
		var allStyles = window.getComputedStyle(thisElement, null);
		
		console.clear();

		var inLine = 'Inline style for ' + e.target.id + ': \n{\n';
		inLine += '\t' + thisElement.style.cssText;           // gets inline style only
		inLine += '\n}\n\n';

		var css = 'Element : ' + e.target.id + ':  \n{\n';

		css += allStyles.display.length === 0 ? '' : '\tdisplay: ' + allStyles.display + '\n';
		css += allStyles.position.length === 0 ? '' : '\tposition: ' + allStyles.position + '\n';
		css += allStyles.width.length === 0 ? '' : '\twidth: ' + allStyles.width + '\n';
		css += allStyles.minWidth.length === 0 ? '' : '\tminWidth: ' + allStyles.minWidth + '\n';
		css += allStyles.maxWidth.length === 0 ? '' : '\tmaxWidth: ' + allStyles.maxWidth + '\n';
		
		css += allStyles.height.length === 0 ? '' : '\theight: ' + allStyles.height + '\n';
		css += allStyles.minHeight.length === 0 ? '' : '\tminHeight: ' + allStyles.minHeight + '\n';
		css += allStyles.maxHeight.length === 0 ? '' : '\tmaxHeight: ' + allStyles.maxHeight + '\n';

		css += allStyles.color.length === 0 ? '' : '\tcolor: ' + allStyles.color + '\n';
		css += allStyles.backgroundColor.length === 0 ? '' : '\tbackgroundColor: ' + allStyles.backgroundColor + '\n';

		css += allStyles.top.length === 0 ? '' : '\ttop: ' + allStyles.top + '\n';
		css += allStyles.right.length === 0 ? '' : '\tright: ' + allStyles.right + '\n';
		css += allStyles.bottom.length === 0 ? '' : '\tbottom: ' + allStyles.bottom + '\n';
		css += allStyles.left.length === 0 ? '' : '\tleft: ' + allStyles.left + '\n';

		css += allStyles.margin.length === 0 ? '' : '\tmargin: ' + allStyles.margin + '\n';
		css += allStyles.marginTop.length === 0 ? '' : '\tmargin-top: ' + allStyles.marginTop + '\n';
		css += allStyles.marginRight.length === 0 ? '' : '\tmargin-right: ' + allStyles.marginRight + '\n';
		css += allStyles.marginBottom.length === 0 ? '' : '\tmargin-bottom: ' + allStyles.marginBottom + '\n';
		css += allStyles.marginLeft.length === 0 ? '' : '\tmargin-left: ' + allStyles.marginLeft + '\n';


		css += allStyles.padding.length === 0 ? '' : '\tpadding: ' + allStyles.padding + '\n';
		css += allStyles.paddingTop.length === 0 ? '' : '\tpaddingTop: ' + allStyles.paddingTop + '\n';
		css += allStyles.paddingRight.length === 0 ? '' : '\tpaddingRight: ' + allStyles.paddingRight + '\n';
		css += allStyles.paddingBottom.length === 0 ? '' : '\tpaddingBottom: ' + allStyles.paddingBottom + '\n';
		css += allStyles.paddingLeft.length === 0 ? '' : '\tpaddingLeft: ' + allStyles.paddingLeft + '\n';


		css += allStyles.border.length === 0 ? '' : '\tborder: ' + allStyles.border + '\n';
		css += allStyles.font.length === 0 ? '' : '\tfont: ' + allStyles.font + '\n';
		//css += allStyles.position.length === 0 ? '' : ' position: ' + allStyles.fo + '\n';
		//css += allStyles.position.length === 0 ? '' : ' position: ' + allStyles.position + '\n';
		
		css += '\n}\n';


		var check = $('dv_Info');
		var chStyle;
		var chkCss = '\n\n';

		if (check !== undefined)
		{
//			chStyle = window.getComputedStyle(check.cssText, null);
	//		chkCss = 'height: '+ chStyle.height;
		}

		console.log(inLine + css + chkCss);
	});




	
});
