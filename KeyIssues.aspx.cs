using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace KeyControlApp
{
	public partial class KeyEntry : System.Web.UI.Page
	{


		protected void Page_Load(object sender, EventArgs e)
		{
			SqlDataAccess sda = new SqlDataAccess();
			string userName = Context.User.Identity.Name;
			bool hasPermissions = sda.UserHasPermissions(userName);

			if (!hasPermissions)
			{
				Response.Redirect("Default.aspx");
			}

			if (String.IsNullOrEmpty(userName))
			{
				Response.Redirect("Default.aspx");
			}

			if (!IsPostBack)
			{
				sda.LogUser(userName, "KeyIssues.aspx", DateTime.Now);
			}
		}


		
	}
}