using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;



namespace PCInventory2018
{
	public partial class Inventory : System.Web.UI.Page
	{
		SqlDataAccess sda = new SqlDataAccess();

		protected void Page_Load(object sender, EventArgs e)
		{
			string username = Environment.UserName;
			System.Web.UI.WebControls.Label lb = new Label();
			lb = lblName;
			this.lblName.Text = username;
		}


	}
}