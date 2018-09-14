﻿using System;
using System.Web;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Data.Odbc;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
using System.Windows.Forms;

using Microsoft.VisualBasic;


namespace KeyControlApp
{
	/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
	/// 
	/// <summary>
	///   Summary description for DataHandler
	/// </summary>
	/// 
	/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
	public class DataHandler : IHttpHandler
	{
		protected List<string> TableList = new List<string>();

		public void ProcessRequest(HttpContext context)
		{
			context.Response.ContentType = "application/json";
			var json = new JavaScriptSerializer();
			List<string> fieldsList = new List<string>();
			string returns = "";

			string option = context.Request["option"];
			string action = context.Request["action"];

			string searchString = "";
			string sID = context.Request["sectionID"];
			int sectionID = 0;

			if (sID != null)
				if (sID.Length > 0)
					sectionID = Int32.Parse(sID);

			switch (option)
			{
				case "GET":

					switch (action)
					{
						case "GetSearchValues":
							searchString = context.Request["searchString"];
							returns = GetSearchValues(searchString, sectionID);
							break;

						case "A":
							returns = GetSearchValues("", sectionID);
							break;

						case "B":
							returns = GetSearchValues("", sectionID);
							break;

						case "GetAciveSections":
							returns = GetAciveSections(context);
							break;

						case "GetGridData":
							returns = GetGridData(context);
							break;

						case "GetCustodians":
							returns = GetCustodians(context);
							break;

						case "GetRoomNumber":
							string keyNum = context.Request["keyNumber"];
							returns = GetRoomNumber(keyNum, sectionID);
							break;

						default:
							break;
					}
					break;

				case "SET":
					break;

				default:
					break;
			}

			context.Response.Write(returns);
		}



		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// 
		/// <summary>
		///   Return data for select elements on KeySearch.aspx
		/// </summary>
		/// 
		/// <param name="context"></param>
		/// 
		/// <returns>string</returns> 
		///   Serialized list to be added to select element option list
		/// 
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public string GetSearchValues(string searchString, int id)
		{
			var json = new JavaScriptSerializer();

			if (searchString == null || searchString.Length == 0)
				return "ERROR: Missing parameter [searchString] in GetSearchValues()";

			SqlDataAccess sda = new SqlDataAccess();
			SqlConnection cn = sda.CreateSqlConnection();
			SqlCommand cmd = sda.CreateSqlCommand();
			DataSet ds = new DataSet();
			DataTable dt = new DataTable();

			List<string> nameList = new List<string>();

			try
			{
				using (cn)
				{
					cn.Open();
					using (cmd)
					{
						cmd.Connection = cn;
						cmd.CommandType = CommandType.Text;

						switch (searchString)
						{
							case "LastName":
								cmd.CommandText = "SELECT KeyHolders.Last, KeyHolders.First, KeyHolders.ID " +
																	"FROM KeyHolders INNER JOIN Sections ON KeyHolders.SectionID = Sections.SectionID " +
																	"WHERE (Sections.SectionID = @SectionID) ORDER BY Last";
								break;

							case "KeyNumber":
								cmd.CommandText = "SELECT Keys.KeyNumber, Keys.ID " +
																	"FROM Sections INNER JOIN " +
																	"Keys ON Sections.SectionID = Keys.SectionID INNER JOIN " +
																	"Rooms ON Keys.RoomID = Rooms.ID " +
																	"WHERE Sections.SectionID = @SectionID ORDER BY KeyNumber";
								break;

							case "RoomNumber":
								cmd.CommandText = "SELECT Rooms.RoomNumber, Rooms.ID " +
																	"FROM Keys INNER JOIN Sections ON Keys.SectionID = Sections.SectionID LEFT OUTER JOIN " +
																	"Rooms ON Keys.RoomID = Rooms.ID " +
																	"WHERE (Sections.SectionID = @SectionID) ORDER BY Rooms.RoomNumber";
								break;

							default:
								break;
						}

						cmd.Parameters.Add("@SectionID", SqlDbType.Int);
						cmd.Parameters["@SectionID"].Value = id;

						dt.Load(cmd.ExecuteReader());

						List<SelectOptions> list = new List<SelectOptions>();
						SelectOptions option = new SelectOptions();

						foreach (DataRow dr in dt.Rows)
						{
							option = new SelectOptions();

							// KeyHolder.ID or Keys.ID or Rooms.ID
							switch (searchString)
							{
								case "LastName":
									option.RecordID = dr[2].ToString();
									option.OptionValue = dr[0].ToString() + ", " + dr[1].ToString();
									option.OptionText = dr[0].ToString() + ", " + dr[1].ToString();
									break;

								case "KeyNumber":
								case "RoomNumber":
									option.RecordID = dr[1].ToString();
									option.OptionValue = dr[0].ToString();
									option.OptionText = dr[0].ToString();
									break;
								default:
									break;

							}

							list.Add(option);
						}
						return json.Serialize(list);
					}
				}
			}
			catch (Exception ex)
			{
				return json.Serialize(ex.Message);
			}
		}


		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// 
		/// <summary>
		///   Return all keys numbers 
		/// </summary>
		/// 
		/// <param name="context"></param>
		/// 
		/// <returns>string</returns> 
		///   Serialized list to be added to select element option list
		/// 
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public string GetKeyNumbers(int id)
		{
			var json = new JavaScriptSerializer();

			SqlDataAccess sda = new SqlDataAccess();
			SqlConnection cn = sda.CreateSqlConnection();
			SqlCommand cmd = sda.CreateSqlCommand();
			DataSet ds = new DataSet();
			DataTable dt = new DataTable();

			List<string> keyList = new List<string>();

			try
			{
				using (cn)
				{
					cn.Open();
					using (cmd)
					{
						cmd.Connection = cn;
						cmd.CommandType = CommandType.Text;
						cmd.CommandText = "SELECT KeyNumber, RoomID FROM Keys";
						dt.Load(cmd.ExecuteReader());

						if (dt.Rows.Count > 1 && dt.Rows[0][0] != null && dt.Columns.Count == 2)
						{
							for (int i = 0; i < dt.Rows.Count; i++)
							{
								keyList.Add(dt.Rows[0][0].ToString() + ", " + dt.Rows[0][1].ToString());
							}
						}
					}
				}
			}
			catch (Exception ex)
			{
				return json.Serialize(ex.Message);
			}
			return json.Serialize(keyList);
		}


		public string GetRoomNumber(string keyNum, int sectionID)
		{
			var room = "";
			var json = new JavaScriptSerializer();

			SqlDataAccess sda = new SqlDataAccess();
			SqlConnection cn = sda.CreateSqlConnection();
			SqlCommand cmd = sda.CreateSqlCommand();
			DataSet ds = new DataSet();
			DataTable dt = new DataTable();

			try
			{
				using (cn)
				{
					cn.Open();
					using (cmd)
					{
						cmd.Connection = cn;
						cmd.CommandType = CommandType.Text;
						cmd.CommandText = "SELECT DISTINCT Rooms.RoomNumber, Keys.ID, Keys.KeyNumber " +
							"FROM Keys INNER JOIN Rooms ON Keys.RoomID = Rooms.ID " +
							"WHERE (Keys.SectionID = @SectionID) AND (Keys.KeyNumber = @KeyNumber)";

						cmd.Parameters.Add("@SectionID", SqlDbType.Int);
						cmd.Parameters["@SectionID"].Value = sectionID;
						cmd.Parameters.Add("@KeyNumber", SqlDbType.NVarChar);
						cmd.Parameters["@KeyNumber"].Value = keyNum;

						dt.Load(cmd.ExecuteReader());

						if (dt.Rows.Count == 1)
						{
							room = dt.Rows[0][0].ToString();
						}
					}
				}
			}
			catch (Exception ex)
			{
				return json.Serialize(ex.Message);
			}
			return json.Serialize(room);
		}


		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// 
		/// <summary>
		///   Return all room numbers
		/// </summary>
		/// 
		/// <param name="context"></param>
		/// 
		/// <returns>string</returns> 
		///   Serialized list to be added to select element option list
		/// 
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public string GetRoomNumbers(int id)
		{
			var json = new JavaScriptSerializer();

			SqlDataAccess sda = new SqlDataAccess();
			SqlConnection cn = sda.CreateSqlConnection();
			SqlCommand cmd = sda.CreateSqlCommand();
			DataSet ds = new DataSet();
			DataTable dt = new DataTable();

			List<string> roomList = new List<string>();

			try
			{
				using (cn)
				{
					cn.Open();
					using (cmd)
					{
						cmd.Connection = cn;
						cmd.CommandType = CommandType.Text;
						cmd.CommandText = "SELECT ID, RoomNumber FROM Rooms";
						dt.Load(cmd.ExecuteReader());

						if (dt.Rows.Count > 1 && dt.Rows[0][0] != null && dt.Columns.Count == 2)
						{
							for (int i = 0; i < dt.Rows.Count; i++)
							{
								roomList.Add(dt.Rows[0][0].ToString() + ", " + dt.Rows[0][1].ToString());
							}
						}
					}
				}
			}
			catch (Exception ex)
			{
				return json.Serialize(ex.Message);
			}
			return json.Serialize(roomList);
		}



		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// Return sections that custodian maintains
		/// </summary>
		/// <param name="context"></param>
		/// <returns></returns>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public string GetAciveSections(HttpContext context)
		{
			var json = new JavaScriptSerializer();
			var userName = context.Request["userName"];

			SqlDataAccess sda = new SqlDataAccess();
			SqlConnection cn = sda.CreateSqlConnection();
			SqlCommand cmd = sda.CreateSqlCommand();
			DataSet ds = new DataSet();
			DataTable dt = new DataTable();

			List<SelectOptions> sectionList = new List<SelectOptions>();
			SelectOptions option = new SelectOptions();

			try
			{
				using (cn)
				{
					cn.Open();
					using (cmd)
					{
						cmd.Connection = cn;
						cmd.CommandType = CommandType.Text;
						cmd.CommandText = "SELECT DISTINCT Sections.Section, Custodians.UserID, Sections.SectionID " +
															"FROM Custodians RIGHT OUTER JOIN " +
															"KeyHolders ON Custodians.ID = KeyHolders.CustodianID LEFT OUTER JOIN " +
															"Sections ON Custodians.ID = Sections.CustodianID " +
															"WHERE (Custodians.UserID = @UserName)";

						cmd.Parameters.Add("@UserName", SqlDbType.NVarChar);
						cmd.Parameters["@UserName"].Value = userName;

						option.RecordID = "0";
						option.OptionValue = "";
						option.OptionText = "";

						dt.Load(cmd.ExecuteReader());

						foreach (DataRow dr in dt.Rows)
						{
							// section ID
							option.RecordID = dr[2].ToString();
							// section 
							option.OptionValue = dr[0].ToString();
							option.OptionText = dr[0].ToString();
							sectionList.Add(option);
						}

						return json.Serialize(sectionList);
					}
				}
			}
			catch (Exception ex)
			{
				return json.Serialize(ex.Message);
			}
		}



		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// 
		/// </summary>
		/// <param name="context"></param>
		/// <returns></returns>
		/// /// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public string GetCustodians(HttpContext context)
		{
			var id = 0;
			var sectionid = context.Request["sectionID"];
			if (sectionid != "")
				id = Int32.Parse(sectionid);

			var json = new JavaScriptSerializer();

			SqlDataAccess sda = new SqlDataAccess();
			DataSet ds = new DataSet();
			DataTable dt = new DataTable();

			List<SelectOptions> list = new List<SelectOptions>();
			SelectOptions option = new SelectOptions();

			using (SqlConnection cn = sda.CreateSqlConnection(sda.ConnectionString))
			{
				cn.Open();
				using (SqlCommand cmd = sda.CreateSqlCommandConn(cn))
				{
					cmd.CommandType = CommandType.Text;
					cmd.CommandText = "SELECT ID, (FirstName + ' ' + LastName) AS CName, SectionID FROM Custodians WHERE SectionID = @SectionID";
					cmd.Parameters.Add("@SectionID", SqlDbType.Int);
					cmd.Parameters["@SectionID"].Value = id;

					dt.Load(cmd.ExecuteReader());

					if (dt.Rows.Count > 0 && dt.Rows[0][0] != null)
					{
						foreach (DataRow dr in dt.Rows)
						{
							option = new SelectOptions();

							// section ID
							option.RecordID = dr["ID"].ToString();
							// section 
							option.OptionValue = dr["CName"].ToString();
							option.OptionText = dr["CName"].ToString();
							list.Add(option);
						}

					}
					return json.Serialize(list);
				}
			}
		}



		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// Get data for KeyIssues page after last name change
		/// </summary>
		/// <param name="context"></param>
		/// <returns></returns>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public string GetIssuedData(HttpContext context)
		{
			var filter = context.Request["filter"];
			var filterValue = context.Request["filterValue"];
			var sectionID = context.Request["sectionID"];
			var id = Int32.Parse(sectionID);
			var json = new JavaScriptSerializer();
			var lastName = "";
			var firstName = "";

			if (filterValue == null || filterValue == null || sectionID == null)
				return "Error: GetGridData parameter missing.";
			if (filterValue.Length == 0 || filter.Length == 0 || sectionID.Length == 0)
				return "Error: GetGridData parameter missing.";

			if (filterValue.Contains(","))
			{
				lastName = filterValue.Split(',')[0].Trim();
				firstName = filterValue.Split(',')[1].Trim();
			}
			SqlDataAccess sda = new SqlDataAccess();
			DataSet ds = new DataSet();
			DataTable dt = new DataTable();

			using (SqlConnection cn = sda.CreateSqlConnection(sda.ConnectionString))
			{
				cn.Open();
				using (SqlCommand cmd = sda.CreateSqlCommandConn(cn))
				{
					cmd.CommandType = CommandType.StoredProcedure;

					cmd.CommandText = "Get_FullNameIssue";
					cmd.Parameters.Add("@LASTNAME", SqlDbType.NVarChar);
					cmd.Parameters["@LASTNAME"].Value = lastName;
					cmd.Parameters.Add("@FIRSTNAME", SqlDbType.NVarChar);
					cmd.Parameters["@FIRSTNAME"].Value = firstName;
					cmd.Parameters.Add("@SECTIONID", SqlDbType.Int);
					cmd.Parameters["@SECTIONID"].Value = id;

					try
					{
						dt.Load(cmd.ExecuteReader());
					}
					catch (Exception ex)
					{
						System.Windows.Forms.MessageBox.Show("ERROR: " + ex.Message);
					}

					// Convert DataTable to List  
					List<GridInfo> gridInfo = ConvertDataTable<GridInfo>(dt);
					return json.Serialize(gridInfo);
				}
			}
		}



		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		/// <summary>
		/// 
		/// </summary>
		/// <param name="context"></param>
		/// <returns></returns>
		/// ///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///@@///
		public string GetGridData(HttpContext context)
		{
			var filter = context.Request["filter"];
			var filterValue = context.Request["filterValue"];
			var sectionID = context.Request["sectionID"];
			var id = Int32.Parse(sectionID);
			var json = new JavaScriptSerializer();
			var lastName = "";
			var firstName = "";

			if (filterValue == null || filterValue == null || sectionID == null)
				return "Error: GetGridData parameter missing.";
			if (filterValue.Length == 0 || filter.Length == 0 || sectionID.Length == 0)
				return "Error: GetGridData parameter missing.";

			if (filterValue.Contains(","))
			{
				lastName = filterValue.Split(',')[0].Trim();
				firstName = filterValue.Split(',')[1].Trim();
			}

			SqlDataAccess sda = new SqlDataAccess();
			DataSet ds = new DataSet();
			DataTable dt = new DataTable();

			using (SqlConnection cn = sda.CreateSqlConnection(sda.ConnectionString))
			{
				cn.Open();
				using (SqlCommand cmd = sda.CreateSqlCommandConn(cn))
				{
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.Parameters.Add("@SECTIONID", SqlDbType.Int);
					cmd.Parameters["@SECTIONID"].Value = id;

					// first, last, keyno, room, issued, returned, lost, status
					switch (filter)
					{
						case "FullName":
							cmd.CommandText = "Get_FullNameIssue";
							cmd.Parameters.Add("@LASTNAME", SqlDbType.NVarChar);
							cmd.Parameters["@LASTNAME"].Value = lastName;
							cmd.Parameters.Add("@FIRSTNAME", SqlDbType.NVarChar);
							cmd.Parameters["@FIRSTNAME"].Value = firstName;
							break;

						case "LastName":
							cmd.CommandText = "Get_LastNameGrid";
							cmd.Parameters.Add("@LASTNAME", SqlDbType.NVarChar);
							cmd.Parameters["@LASTNAME"].Value = lastName;
							cmd.Parameters.Add("@FIRSTNAME", SqlDbType.NVarChar);
							cmd.Parameters["@FIRSTNAME"].Value = firstName;
							break;

						case "KeyNumber":
							var keyno = filterValue;
							cmd.CommandText = "Get_KeyNumberGrid";
							cmd.Parameters.Add("@KEYNUM", SqlDbType.NVarChar);
							cmd.Parameters["@KEYNUM"].Value = filterValue;
							break;

						case "RoomNumber":
							var roomno = filterValue;
							cmd.CommandText = "Get_RoomNumberGrid";
							cmd.Parameters.Add("@ROOMNUM", SqlDbType.NVarChar);
							cmd.Parameters["@ROOMNUM"].Value = filterValue;
							break;

						default:
							break;
					}

					try
					{
						dt.Load(cmd.ExecuteReader());
					}
					catch (Exception ex)
					{
						System.Windows.Forms.MessageBox.Show("ERROR: " + ex.Message);
					}

					// Convert DataTable to List  
					List<GridInfo> gridInfo = ConvertDataTable<GridInfo>(dt);
					return json.Serialize(gridInfo);
				}
			}
		}



		/// <summary>
		/// Using Generic Method to convert
		/// datatable into a list
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="dt"></param>
		/// <returns></returns>
		private static List<T> ConvertDataTable<T>(DataTable dt)
		{
			List<T> data = new List<T>();
			foreach (DataRow row in dt.Rows)
			{
				T item = GetItem<T>(row);
				data.Add(item);
			}
			return data;
		}
		/// <summary>
		/// Using Generic Method to convert
		/// datatable into a list
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="dr"></param>
		/// <returns></returns>
		private static T GetItem<T>(DataRow dr)
		{
			Type temp = typeof(T);
			T obj = Activator.CreateInstance<T>();

			foreach (DataColumn column in dr.Table.Columns)
			{
				foreach (System.Reflection.PropertyInfo pro in temp.GetProperties())
				{
					if (pro.Name == column.ColumnName)
						pro.SetValue(obj, dr[column.ColumnName], null);
					else
						continue;
				}
			}
			return obj;
		}

		/// <summary>
		/// 
		/// </summary>
		public bool IsReusable
		{
			get
			{
				return false;
			}
		}
	}
















	public class SelectOptions
	{
		public string RecordID { get; set; }
		public string OptionValue { get; set; }
		public string OptionText { get; set; }
	}

	public class LastNameSelect
	{
		public string KeyHolderID { get; set; }
		public string LastName { get; set; }
		public string FirstName { get; set; }
	}

	public class KeyNumberSelect
	{
		public string KeyID { get; set; }
		public string LastName { get; set; }
		public string FirstName { get; set; }

	}

	public class KeyHolderInfo
	{
		public string ID { get; set; }
		public string FirsName { get; set; }
		public string LastName { get; set; }
		public string IsCustodian { get; set; }
	}

	public class CustodianInfo
	{
		public string ID { get; set; }
		public string UserID { get; set; }
		public string Section { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Phone { get; set; }
		public string Email { get; set; }
		public string IsActive { get; set; }
		public string IsAdmin { get; set; }
		public string IsDeleted { get; set; }
	}

	public class GridLines
	{
		List<string> Line = new List<string>();
	}


	public class GridInfo
	{
		public string Last { get; set; }
		public string First { get; set; }
		public string KeyNumber { get; set; }
		public string RoomNumber { get; set; }
		public string Issued { get; set; }
		public string Returned { get; set; }
		public string LostDate { get; set; }
		public string Section { get; set; }
		public string Custodian { get; set; }
	}

}




