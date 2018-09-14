using System;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI.WebControls;


namespace KeyControlApp
{
	public class KeysClass
	{

		public string keyNumber { get; set; }
		public string issueDate { get; set; }
		public string whoIssued { get; set; }
		public string issuedTo { get; set; }
		public string turnInDate { get; set; }
		public string whoReceived { get; set; }

		SqlDataAccess sda = new SqlDataAccess();



		public string SaveKeyIssue(GridView gv, int id)
		{
			string result = "OK";
			string sqlText = "";

			using(SqlConnection cn = sda.CreateSqlConnection(sda.ConnectionString))
			{
				using(SqlCommand cmd = sda.CreateSqlCmdText(cn, sqlText))
				{
					cmd.Parameters.Add("@ID");
					cmd.Parameters["@ID"].Value = id;
				}
			}
			
			return result;
		}

	}
}