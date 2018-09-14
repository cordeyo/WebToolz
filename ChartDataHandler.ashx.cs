﻿using System;
using System.Web;
using System.Data;
using System.Collections.Generic;
using System.Data.Odbc;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
using Microsoft.VisualBasic;



namespace PCInventory2018
{
	/// <summary>
	/// Summary description for ChartDataHandler
	/// </summary>
	public class ChartDataHandler : IHttpHandler
	{

		protected static SqlDataAccess sda = new SqlDataAccess();

		protected SqlConnection conn = sda.CreateSqlConnection(sda.ConnectionString);
		protected SqlCommand cmd = sda.CreateSqlCommand();
		
		public void ProcessRequest(HttpContext context)
		{
			context.Response.ContentType = "application/json";

			var json = new JavaScriptSerializer();
			string returns = "";

			// required - GET - SET
			string option = context.Request["option"];

			// required for function to perform
			string action = context.Request["action"];
			bool bActionIsNull = action == null;

			List<string> TableList = new List<string>();

			switch (option)
			{
				case "GET":
					if (!bActionIsNull)
					{
						switch (action)
						{
							case "GetLocalUser":
								if (Environment.UserName == "Keith.Lucas")
									returns = json.Serialize("Keith.Lucas");
								else
									returns = json.Serialize("");
								break;

							// Loads DMLSS nomenclature for select options 
							case "GetNomenclature":
								returns = GetNomenclature(context);
								break;

							// Data as of date  
							case "GetAsOfDate":
								returns = GetAsOfDate();
								break;

							// Get number of Printers, Monitors etc  
							case "GetEquipmentCount":
								returns = GetEquipmentCount(context);
								break;

							// Get number of HP, Dell etc  
							case "GetModelCount":
								returns = GetModelCount(context);
								break;

							// Get
							case "GetSccmChartTable":
								returns = GetSccmChartTable(context);
								break;

							case "GetDmlssChartTable":
								returns = GetDMLSSChartTable(context);
								break;

							case "GetDmlssDrillChartTable":
								returns = GetDmlssDrillChartTable(context);
								break;

							case "GetDmlssGridData":
								returns = GetDmlssGridData(context);
								break;

							default:
								break;
						}
					}
					break;

				case "SET":
					if (!bActionIsNull)
					{
						switch (action)
						{
							case "Save":
								returns = "";
								break;

							default:
								break;
						}
					}
					break;

				default:
					break;
			}
			context.Response.Write(returns);
		}



		/// <summary>
		/// 
		/// </summary>
		/// <param name="context"></param>
		/// <returns></returns>
		public string GetNomenclature(HttpContext context)
		{
			var json = new JavaScriptSerializer();

			SqlDataAccess sda = new SqlDataAccess();
			SqlCommand cmd = sda.CreateSqlCommand();

			try
			{
				using (conn)
				{
					conn.Open();
					using (cmd)
					{
						cmd.Connection = conn;
						cmd.CommandType = CommandType.Text;
						cmd.CommandText = "SELECT DISTINCT nomenclature FROM nomenclature ORDER BY nomenclature";

						DataTable dt = new DataTable();
						dt.Load(cmd.ExecuteReader());

						List<SelectOptions> valueList = new List<SelectOptions>();
						SelectOptions options = new SelectOptions();
						options.RecordID = "0";
						options.OptionText = "";
						options.OptionValue = "";

						foreach (DataRow dr in dt.Rows)
						{
							options = new SelectOptions();
							options.RecordID = "";
							options.OptionText = dr[0].ToString();
							options.OptionValue = options.OptionText;
							valueList.Add(options);
						}
						return json.Serialize(valueList);
					}
				}
			}
			catch (Exception ex)
			{
				return json.Serialize(ex.Message);
			}
		}



		/// <summary>
		/// 
		/// </summary>
		/// <param name="context"></param>
		/// <returns></returns>
		public string GetModelCount(HttpContext context)
		{
			var json = new JavaScriptSerializer();
			var model = context.Request["model"];
			var count = "";

			try
			{
				using (conn)
				{
					conn.Open();
					using (cmd)
					{
						cmd.Connection = conn;
						cmd.CommandType = CommandType.Text;
						cmd.CommandText = "SELECT COUNT(DISTINCT Manufacturer) AS count FROM DMLSS WHERE (Nomenclature = '" + model + "');";
						int connt = (int)cmd.ExecuteScalar();
						if (connt > 0)
							count = connt.ToString().Trim();
						else
							count = "0";
					}
				}
				return count.ToString();
			}
			catch (Exception ex)
			{
				return json.Serialize(ex.Message);
			}
		}


		/// <summary>
		/// 
		/// </summary>
		/// <returns></returns>
		public string GetAsOfDate()
		{
			var json = new JavaScriptSerializer();

			try
			{
				using (conn)
				{
					conn.Open();
					using (cmd)
					{
						cmd.Connection = conn;
						cmd.CommandType = CommandType.StoredProcedure;
						cmd.CommandText = "spUpdateDate";
						cmd.Parameters.Add("@updateType", SqlDbType.Int);
						cmd.Parameters["@updateType"].Value = 1;

						DataTable dt = new DataTable();
						dt.Load(cmd.ExecuteReader());

						var d = "";
						if (dt.Rows.Count == 1)
							d = dt.Rows[0][0].ToString();

						return json.Serialize(d);
					}
				}
			}
			catch (Exception ex)
			{
				return json.Serialize(ex.Message);
			}
		}



		/// <summary>
		/// Get the total number of SCCM or DMLSS entries
		/// </summary>
		/// <param name="context"></param>
		/// <returns></returns>
		public string GetEquipmentCount(HttpContext context)
		{
			var json = new JavaScriptSerializer();
			var table = context.Request["table"];
			var criteria = context.Request["criteria"];
			var dataTable = context.Request["dataTable"];

			try
			{
				using (conn)
				{
					conn.Open();
					using (cmd)
					{
						cmd.Connection = conn;
						cmd.CommandType = CommandType.StoredProcedure;

						if (dataTable == "SCCM")
							cmd.CommandText = "spPCTot";

						if (dataTable == "DMLSS")
						{
							cmd.CommandText = "spDMLSSTot";
							cmd.Parameters.Add("@table", SqlDbType.NVarChar);
							cmd.Parameters["@table"].Value = table;
							cmd.Parameters.Add("@criteria", SqlDbType.NVarChar);
							cmd.Parameters["@criteria"].Value = criteria;
						}

						DataTable dt = new DataTable();
						dt.Load(cmd.ExecuteReader());

						var count = "";
						if (dt.Rows.Count == 1)
							count = dt.Rows[0][0].ToString();

						return json.Serialize(count);
					}
				}
			}
			catch (Exception ex)
			{
				return json.Serialize(ex.Message);
			}
		}


		/// <summary>
		/// 
		/// </summary>
		/// <param name="context"></param>
		/// <returns></returns>
		public string GetSccmChartTable(HttpContext context)
		{
			var json = new JavaScriptSerializer();
			// Set up the SQL statement for SCCM Inventory
			using (conn)
			{
				conn.Open();
				using (cmd)
				{
					// Call stored proc to get the SCCM entries
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandText = "spManuInvC";

					// Add parameter to pass to the stored procedure
					cmd.Parameters.Add(new SqlParameter("@table", SqlDbType.NVarChar, 20, "table"));
					cmd.Parameters.Add(new SqlParameter("@criteria", SqlDbType.NVarChar, 100, "criteria"));

					// Set values for stored procedure paramters
					cmd.Parameters[0].Value = "SMSComputer";
					cmd.Parameters[1].Value = "";

					// Exectute the stored procedure
					int i = cmd.ExecuteNonQuery();
					
					// Read the data into the DBTable object
					//     DBTable table = new DBTable(cmd.ExecuteReader());
					DataTable table = new DataTable();
					table.Load(cmd.ExecuteReader());

					return json.Serialize(table);
				}
			}
		}


		/// <summary>
		/// 
		/// </summary>
		/// <param name="nomenclature"></param>
		/// <returns></returns>
		public string GetDMLSSChartTable(HttpContext context)
		{
			var json = new JavaScriptSerializer();
			// Set up the SQL statement for DMLSS Inventory
			string nomenclature = context.Request["nomenclature"];

			using (conn)
			{
				conn.Open();
				using (cmd)
				{
					cmd.Connection = conn;
					// Call stored proc to get the DMLSS entries
					cmd.CommandText = "spManuInvC";
					cmd.CommandType = CommandType.StoredProcedure;

					// Add parameter to pass to the stored procedure
					cmd.Parameters.Add("@table", SqlDbType.NVarChar);
					cmd.Parameters["@table"].Value = "DMLSS";
					cmd.Parameters.Add("@criteria", SqlDbType.NVarChar);
					cmd.Parameters["@criteria"].Value = " WHERE (DMLSS.Nomenclature = '" + nomenclature + "')";

					//int j = cmd.ExecuteNonQuery();

					// Read the data into the DBTable object
					// DBTable DmlssInvChartTable = new DBTable(cmdp.ExecuteReader());
					DataTable DmlssInvChartTable = new DataTable();

					// Column 1 manu
					// Column 2 Counter
					DmlssInvChartTable.Load(cmd.ExecuteReader());

					cmd.Parameters.Remove(cmd.Parameters["@table"]);
					cmd.Parameters.Remove(cmd.Parameters["@criteria"]);

					ChartRows ChartTable = new ChartRows();
					ChartTable.Header1 = "Manu";
					ChartTable.Header2 = "Count";
					for (int i = 0; i < DmlssInvChartTable.Rows.Count; i++ )
					{
						ChartTable.ManuData.Add(DmlssInvChartTable.Rows[i][0].ToString());
						ChartTable.CountData.Add(DmlssInvChartTable.Rows[i][1].ToString());
					}
					
					return json.Serialize(ChartTable);
				}
			}
		}



		/// <summary>
		/// 
		/// </summary>
		/// <param name="context"></param>
		/// <returns></returns>
		public string GetDmlssDrillChartTable(HttpContext context)
		{
			var json = new JavaScriptSerializer();

			// Set up the SQL statement for DMLSS Inventory
			string manufacturer = context.Request["manu"];
			string Nomenclature = context.Request["nomenclature"];

			//Select total count of Models 
			string countSql = @"SELECT COUNT(DISTINCT NameplateModel) AS count FROM DMLSS INNER JOIN Alias ON DMLSS.Manufacturer = Alias.Manufacturer WHERE (Alias = '" + manufacturer + "') AND Nomenclature = '" + Nomenclature + "';";
			
			using (conn)
			{
				conn.Open();
				using (cmd)
				{
					cmd.Connection = conn;
					// Call stored proc to get the DMLSS entries
					cmd.CommandText = countSql;
					cmd.CommandType = CommandType.Text;

					SqlDataReader dr = cmd.ExecuteReader();
					int countThis = 0;
					while (dr.Read())
					{
						int counter = Convert.ToInt32(dr["count"]);
						countThis = counter;
					}
				}
				cmd.Dispose();
				conn.Close();


				conn.Open();
				using(cmd)
				{
					cmd.Connection = conn;
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandText = "spModelInvC";

					// Read the data into the DBTable object
					// DBTable DmlssInvChartTable = new DBTable(cmdp.ExecuteReader());
					DataTable DmlssInvChartTable = new DataTable();

					cmd.Parameters.Add(new SqlParameter("@table", SqlDbType.NVarChar, 20, "table"));
					cmd.Parameters[0].Value = "DMLSS";
					cmd.Parameters.Add(new SqlParameter("@manu", SqlDbType.NVarChar, 40, "manu"));
					cmd.Parameters[1].Value = manufacturer;
					cmd.Parameters.Add(new SqlParameter("@field", SqlDbType.NVarChar, 40, "field"));
					cmd.Parameters[2].Value = "NameplateModel";
					cmd.Parameters.Add(new SqlParameter("@criteria", SqlDbType.NVarChar, 100, "criteria"));
					cmd.Parameters[3].Value = " AND (DMLSS.Nomenclature = '" + Nomenclature + "')";
					// Column 1 manu
					// Column 2 Counter
					DmlssInvChartTable.Load(cmd.ExecuteReader());


					ChartRows ChartTable = new ChartRows();
					ChartTable.Header1 = "Manu";
					ChartTable.Header2 = "Count";
					for (int i = 0; i < DmlssInvChartTable.Rows.Count; i++)
					{
						ChartTable.ManuData.Add(DmlssInvChartTable.Rows[i][0].ToString());
						ChartTable.CountData.Add(DmlssInvChartTable.Rows[i][1].ToString());
					}

					return json.Serialize(ChartTable);
				}
			}
		}




		/// <summary>
		/// 
		/// </summary>
		/// <returns></returns>
		public string GetLostDmlssEcns(HttpContext context)
		{
			var json = new JavaScriptSerializer();

			// Grab the count for the correlation between SCCM and DMLSS
			using (conn)
			{
				conn.Open();
				using (cmd)
				{
					// Call stored proc to get the number of ECNs from DMLSS that are not found in SCCM
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandText = "spCompareECN";

					// Exectute the stored procedure
					int h = cmd.ExecuteNonQuery();

					// Set the data adapter to use the sql command above
					SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
					// Set the data set
					System.Data.DataSet dataSet = new System.Data.DataSet();

					// Fill the data adapter with the data set
					dataAdapter.Fill(dataSet, "ecn");

					// Set the DataTable = the DataSet data
					DataTable dataTable = dataSet.Tables["ecn"];
					
					return json.Serialize(dataTable);
				}
			}
		}


		/// <summary>
		/// 
		/// </summary>
		/// <param name="context"></param>
		/// <returns></returns>
		public string GetLostSccmEcns(HttpContext context)
		{
			var json = new JavaScriptSerializer();

			using(conn)
			{
				conn.Open();
				using (cmd)
				{
					// Call stored proc to get the number of Names from SCCM that are not found in DMLSS
					cmd.CommandText = "spCompareNameCount";
					cmd.CommandType = CommandType.StoredProcedure;
					// Exectute the stored procedure
					int f = cmd.ExecuteNonQuery();

					// Set the data adapter to use the sql command above
					SqlDataAdapter dataAdapter1 = new SqlDataAdapter(cmd);
					// Set the data set
					System.Data.DataSet dataSet1 = new System.Data.DataSet();
					// Fill the data adapter with the data set
					dataAdapter1.Fill(dataSet1, "ecn");
					// Set the DataTable = the DataSet data
					DataTable dataTable1 = dataSet1.Tables["ecn"];
					// Set NameCount = the number of SCCM entries not found in DMLSS
					string NameCount = dataTable1.Rows[0]["NameCount"].ToString();

					return json.Serialize(NameCount);
				}
			}
		}


		/// <summary>
		/// 
		/// </summary>
		/// <param name="context"></param>
		/// <returns></returns>
		public string GetEcnMatches(HttpContext context)
		{
			var json = new JavaScriptSerializer();

			using (conn)
			{
				conn.Open();

				cmd.Connection = conn;
				// Call stored proc to get the number of ECNs and Names that match between SCCM and DMLSS
				cmd.CommandText = "spMergeCount";
				cmd.CommandType = CommandType.StoredProcedure;

				// Exectute the stored procedure
				int g = cmd.ExecuteNonQuery();

				// Set the data adapter to use the sql command above
				SqlDataAdapter dataAdapter2 = new SqlDataAdapter(cmd);
				// Set the data set
				System.Data.DataSet dataSet2 = new System.Data.DataSet();
				// Fill the data adapter with the data set
				dataAdapter2.Fill(dataSet2, "ecn");
				// Set the DataTable = the DataSet data
				DataTable dataTable2 = dataSet2.Tables["ecn"];
				// Set MergeCount = the number of SECNs and Names that match between SCCM and DMLSS
				string MergeCount = dataTable2.Rows[0]["MergeCount"].ToString();

				return json.Serialize(dataTable2);
			}
		}


		public string GetDmlssGridData(HttpContext context)
		{
			var json = new JavaScriptSerializer();
			SqlDataAccess sda = new SqlDataAccess();
			DataSet ds = new DataSet();
			DataTable dt = new DataTable();

			using (conn)
			{
				conn.Open();
				using (cmd)
				{
					cmd.Connection = conn;

					// Call stored proc to get the number of ECNs and Names that match between SCCM and DMLSS
					cmd.CommandText = "spDMLSS";
					cmd.CommandType = CommandType.StoredProcedure;
					var MAX = System.Data.SqlTypes.SqlInt32.MaxValue;
					cmd.Parameters.Add(new SqlParameter("@sql", SqlDbType.NVarChar, MAX.Value, "sql"));
					cmd.Parameters["@sql"].Value = "";

					cmd.Parameters.Add(new SqlParameter("@compare", SqlDbType.NVarChar, 1000, "compare"));
					cmd.Parameters["@compare"].Value = "";

					try
					{
						dt.Load(cmd.ExecuteReader());
						List<DmlssGridData> gridInfo = ConvertDataTable<DmlssGridData>(dt);
						 
						return json.Serialize(gridInfo);

						//for (int i = 0; i < dt.Rows.Count; i++)
						//{
						//	DmlssTable.ECN.Add(dt.Rows[i]["ECN"].ToString());
						//	DmlssTable.Manufacturer.Add(dt.Rows[i]["Manufacturer"].ToString());
						//	DmlssTable.Model.Add(dt.Rows[i]["Model"].ToString());
						//	DmlssTable.Nomenclature.Add(dt.Rows[i]["Nomenclature"].ToString());
						//	DmlssTable.Custodian.Add(dt.Rows[i]["Custodian"].ToString());
						//	DmlssTable.Customer.Add(dt.Rows[i]["Customer"].ToString());
						//	DmlssTable.CustomerID.Add(dt.Rows[i]["CustomerID"].ToString());
						//}

						//return json.Serialize(gridInfo);
					}
					catch(Exception ex)
					{
						return json.Serialize("ERROR: " + ex.Message);
					}
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



	public class DmlssGridData {
		public List<string> ECN { get; set; }
		public List<string> Manufacturer { get; set; }
		public List<string> Model { get; set; }
		public List<string> Nomenclature { get; set; }
		public List<string> Custodian { get; set; }
		public List<string> Customer { get; set; }
		public List<string> CustomerID{ get; set; }
	}

	public class ChartOptions
	{
		public string Title { get; set; }
	}

	public class ChartRows {
		public string Header1 { get; set; }
		public string Header2 { get; set; }
		public List<string> ManuData = new List<string>();
		public List<string> CountData = new List<string>();
	}


	public class SelectOptions
	{
		public string RecordID { get; set; }
		public string OptionValue { get; set; }
		public string OptionText { get; set; }
	}


	

}