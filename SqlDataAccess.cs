using System;
using System.Data;
using System.Data.Odbc;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Web.UI;
using System.Text.RegularExpressions;


namespace PCInventory2018
{
	public class SqlDataAccess
	{
		public string ConnectionString = "Data Source=amedeamca400057; Integrated Security=True; Initial Catalog=pcInventory;";
		public string odbcConnString = "Driver={SQL Server};Server=amedeamca400057;Database=pcInventory;Trusted_Connection=Yes;";

		// 0 = query
		// 1 = stored proc
		public enum QueryTypes
		{
			Query = 0,
			StoredProcedure = 1
		}

		public int QueryType { get; set; }
		public string QueryTType { get; set; }
		public string sqlID { get; set; }
		public string uname { get; set; }

		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// 
		/// </summary>
		/// <returns></returns>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public SqlConnection CreateSqlConnection()
		{
			return new SqlConnection(this.ConnectionString);
		}


		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// 
		/// </summary>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public SqlConnection CreateSqlConnection(string conString)
		{
			return new SqlConnection(conString);
		}

		public OdbcConnection CreateOdbcConnection()
		{
			OdbcConnection conn = new OdbcConnection(odbcConnString);
			return conn;
		}


		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// 
		/// </summary>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public SqlCommand CreateSqlCommand()
		{
			SqlCommand cmd = new SqlCommand();
			return cmd;
		}


		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// 
		/// </summary>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public SqlCommand CreateSqlCommand(SqlConnection cn, string sql)
		{
			SqlCommand cmd = new SqlCommand(sql, cn);

			return cmd;
		}


		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// 
		/// </summary>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public SqlCommand CreateSqlCommandConn(SqlConnection cn)
		{

			SqlCommand cmd = new SqlCommand();
			cmd.Connection = cn;
			return cmd;
		}

		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// 
		/// </summary>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public SqlCommand CreateSqlCmdStoredProc(SqlConnection cn, string spName)
		{
			SqlCommand cmd = new SqlCommand();
			cmd.Connection = cn;
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandText = spName;
			return cmd;
		}

		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// 
		/// </summary>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public SqlCommand CreateSqlCmdText(SqlConnection cn, string sqlText)
		{
			SqlCommand cmd = new SqlCommand();
			cmd.Connection = cn;
			cmd.CommandType = CommandType.Text;
			cmd.CommandText = sqlText;
			return cmd;
		}

		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// 
		/// </summary>
		/// <param name="table"></param>
		///
		/// <returns></returns>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public DataTable GetDataTable(string qry, QueryTypes qt, string cString)
		{
			using (SqlConnection cn = new SqlConnection(cString))
			{
				using (SqlCommand cmd = CreateSqlCommand())
				{
					cn.Open();

					cmd.Connection = cn;
					if (qt == QueryTypes.StoredProcedure)
						cmd.CommandType = CommandType.StoredProcedure;

					if (qt == QueryTypes.Query)
						cmd.CommandType = CommandType.Text;

					cmd.CommandText = qry;
					cmd.Parameters.Add("@FNAME", SqlDbType.VarChar, 100).Value = "";
					cmd.Parameters.Add("@LNAME", SqlDbType.VarChar, 100).Value = "";
					DataTable dt = new DataTable();
					dt.Load(cmd.ExecuteReader());
					return dt;
				}
			}
		}


		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// 
		/// </summary>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public DataTable GetDataTable(string storedProcedure, Dictionary<String, Object> parameters)
		{
			DataSet ds = new DataSet();


			using (SqlConnection cn = new SqlConnection(ConnectionString))
			{
				using (SqlCommand cmd = CreateSqlCommand())
				{
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandText = storedProcedure;

					SqlDataAdapter adapter = new SqlDataAdapter(storedProcedure, cn);
					foreach (KeyValuePair<String, Object> p in parameters)
						adapter.SelectCommand.Parameters.AddWithValue("@" + p.Key, (p.Value.ToString().Length == 0) ? DBNull.Value : p.Value);

					cn.Open();

					ds.Tables.Add(new DataTable());
					adapter.Fill(ds.Tables[0]);

					return ds.Tables[0];
				}
			}
		}


		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// 
		/// </summary>
		/// <param name="sql"></param>
		/// <param name="paramName"></param>
		/// <param name="paramVal"></param>
		/// <returns></returns>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public string GetStringValue(string sql, string paramName, string paramVal)
		{
			string scalarValue = "";
			string rval = "";

			sqlID = "";

			if (paramName.Length == 0 || paramVal.Length == 0)
			{
				throw new Exception("Missing paramenter value in GetStringValue() of SqlDataAccess Class.");
			}

			using (SqlConnection cnn = new SqlConnection(ConnectionString))
			{
				try
				{
					cnn.Open();
					SqlCommand cmd = new SqlCommand(sql, cnn);
					cmd.Parameters.AddWithValue(paramName, paramVal);

					cmd.CommandType = CommandType.Text;
					cmd.CommandText = sql;

					DataTable dt = new DataTable();
					SqlDataAdapter da = new SqlDataAdapter(cmd);
					da.Fill(dt);

					if (dt.Rows.Count > 0)
					{
						scalarValue = "1";
						rval = dt.Rows[0][0].ToString();
						//scalarValue = dt.Rows[0][0].ToString();  // UserName from DB
					}
					else
					{
						scalarValue = "0";
						rval = "";
					}
				}
				catch (Exception ex)
				{
					Console.WriteLine(ex.Message);
				}
			}
			return scalarValue;
		}


		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// 
		/// </summary>
		/// <param name="uname"></param>
		/// <returns></returns>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public string GetUserID(string uname, string tablename)
		{
			string usr = "";

			using (SqlConnection cnn = new SqlConnection(ConnectionString))
			{
				cnn.Open();
				using (SqlCommand cmd = new SqlCommand())
				{
					cmd.Connection = cnn;
					cmd.CommandType = CommandType.Text;
					cmd.CommandText = "SELECT UserID FROM " + tablename + " WHERE UserID = @UserID";
					cmd.Parameters.AddWithValue("@UserID", uname);

					DataTable dt = new DataTable();
					SqlDataAdapter da = new SqlDataAdapter(cmd);
					da.Fill(dt);

					if (dt.Rows.Count > 0)
					{
						usr = dt.Rows[0][0].ToString();  // UserName from DB 
					}
				}
			}

			return usr;
		}

		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// 
		/// </summary>
		/// <param name="cmd"></param>
		/// <returns></returns>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public int GetIntValue(string sql, string paramName, string paramVal)
		{
			int val = 0;

			using (SqlConnection cnn = new SqlConnection(ConnectionString))
			{
				try
				{
					cnn.Open();
					// Select Count(*) From xxx where yyy = zzz  
					SqlCommand cmd = new SqlCommand(sql, cnn);
					cmd.Parameters.AddWithValue(paramName, paramVal);

					cmd.CommandType = CommandType.Text;
					cmd.CommandText = sql;

					cmd.ExecuteScalar();
					val = (int)cmd.ExecuteScalar();
				}
				catch (Exception ex)
				{
					Console.WriteLine(ex.Message);
				}
			}

			return val;
		}


		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// 
		/// </summary>
		/// <returns></returns>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public string GetStringValue(SqlCommand cmd)
		{
			string scalarValue = "";

			using (SqlConnection cnn = new SqlConnection(ConnectionString))
			{
				try
				{
					cnn.Open();
					cmd.Connection = cnn;
					cmd.CommandType = CommandType.StoredProcedure;

					scalarValue = cmd.ExecuteScalar().ToString();
				}
				catch (Exception ex)
				{
					Console.WriteLine(ex.Message);
				}
			}
			cmd.Dispose();

			return scalarValue;
		}

		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// 
		/// </summary>
		/// <returns></returns>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public void ExecuteNonQuery(string sql)
		{
			using (SqlConnection cnn = new SqlConnection(ConnectionString))
			{
				try
				{
					cnn.Open();
					SqlCommand cmd = new SqlCommand(sql, cnn);
					cmd.CommandType = CommandType.Text;
					cmd.CommandText = sql;

					cmd.ExecuteNonQuery();
					cmd.Dispose();
				}
				catch (Exception ex)
				{
					Console.WriteLine(ex.Message);
				}
			}
		}

		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// 
		/// </summary>
		/// <returns></returns>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public void ExecuteNonQuery(SqlCommand cmd)
		{
			using (SqlConnection cnn = new SqlConnection(ConnectionString))
			{
				try
				{
					cnn.Open();
					cmd.Connection = cnn;
					cmd.CommandType = CommandType.StoredProcedure;

					cmd.ExecuteNonQuery();
				}
				catch (Exception ex)
				{
					Console.WriteLine(ex.Message);
				}
				cmd.Dispose();
			}
		}


		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// 
		/// </summary>
		/// <returns></returns>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public bool UserHasPermissions(string username, string tableName)
		{
			bool bHasPermission = false;
			int cnt = 0;

			try
			{
				string[] userNameArray = username.Split('\\');
				username = userNameArray[userNameArray.GetUpperBound(0)];

				DataTable dt = new DataTable();
				string sql = "SELECT Count(*) FROM " + tableName + " WHERE UserID = @UserName AND Active = 1";

				uname = GetUserID(username, tableName);

				using (SqlConnection cn = new SqlConnection(ConnectionString))
				{
					cn.Open();
					using (SqlCommand cmd = new SqlCommand(sql, cn))
					{
						cmd.Parameters.AddWithValue("@UserName", uname);
						cnt = (int)cmd.ExecuteScalar();
					}
				}

				if (cnt == 1)
					bHasPermission = true;
				else
					bHasPermission = false;
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
			}
			return bHasPermission;
		}


		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// 
		/// </summary>
		/// <param name="username"></param>
		/// <returns></returns>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public bool UserHasAdminPermissions(string username, string tableName)
		{
			bool bHasPermission = false;

			string[] userNameArray = username.Split('\\');
			username = userNameArray[userNameArray.GetUpperBound(0)];

			string sql = "SELECT UserID FROM " + tableName + " WHERE UserID = @UserName AND Active = 1 AND IsAdmin = 1";

			if (GetStringValue(sql, "@UserName", username) == "1")
				bHasPermission = true;
			else
				bHasPermission = false;

			return bHasPermission;
		}


		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// 
		/// </summary>
		/// <param name="username"></param>
		/// <returns></returns>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public List<string> GetUserStats(string username, string tableName)
		{
			List<string> stat = new List<string>();

			int iStr = 0;

			try
			{
				string[] userNameArray = username.Split('\\');
				username = userNameArray[userNameArray.GetUpperBound(0)];

				string sql = "SELECT COUNT(*) FROM " + tableName + " WHERE UserID = @UserName AND Active = 1";
				stat.Add("SQL = " + sql);

				iStr = GetIntValue(sql, "@UserName", username);
				stat.Add("vStr = " + iStr.ToString());
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
			}

			stat.Add("iStr > 0 ==  " + (iStr > 0).ToString());

			return stat;
		}


		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// Log each user when page is accessed
		/// </summary>
		/// <param name="uName">User name</param>
		/// <param name="page">Page accessed</param>
		/// <param name="logDate">Date / Time</param>
		/// <returns></returns>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public bool LogUser(string uName, string page, DateTime logDate)
		{
			bool ok = true;
			uName = RemoveAMED(uName);

			using (SqlConnection cn = CreateSqlConnection(ConnectionString))
			{
				cn.Open();
				using (SqlCommand cmd = CreateSqlCommandConn(cn))
				{
					cmd.CommandType = CommandType.Text;
					cmd.CommandText = "INSERT INTO LoggedDbUse (LogDate, LogUser, Page) " +
														"VALUES (@Date, @User, @Page)";
					cmd.Parameters.Add("@Date", SqlDbType.DateTime2);
					cmd.Parameters["@Date"].Value = logDate;
					cmd.Parameters.Add("@User", SqlDbType.NVarChar);
					cmd.Parameters["@User"].Value = uName;
					cmd.Parameters.Add("@Page", SqlDbType.NVarChar);
					cmd.Parameters["@Page"].Value = page;

					cmd.ExecuteNonQuery();

					cmd.Parameters.Clear();
					cmd.CommandText = "SELECT COUNT(*) FROM LoggedDbUse WHERE " +
						"LogDate = '" + logDate + "' AND LogUser = '" + uName + "' AND Page = '" + page + "'";

					int x = (int)cmd.ExecuteScalar();
					if (x != 1)
						ok = false;
				}
			}
			return ok;
		}



		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// Remove AMED from user name
		/// </summary>
		/// <param name="uName">Name with AMED\\.....</param>
		/// <returns>Name without AMED\\....</returns>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public string RemoveAMED(string uName)
		{
			string[] userNameArray = uName.Split('\\');
			uName = userNameArray[userNameArray.GetUpperBound(0)];
			return uName;
		}


	}
}