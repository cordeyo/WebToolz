using System;
using System.IO;
using System.Web;
using System.Net;
using System.Web.Script.Serialization;
using System.Text;



namespace KeyControlApp
{
	/// <summary>
	/// Summary description for ErrorLogHandler
	/// </summary>
	public class ErrorLogHandler : IHttpHandler, System.Web.SessionState.IRequiresSessionState
	{

		public void ProcessRequest(HttpContext context)
		{
			string statusCode = context.Request["StatusCode"].ToString();
			if (statusCode.Contains("200"))
				return;

			string statusText = context.Request["StatusText"].ToString();
			string errorText = context.Request["ErrorText"].ToString();
			string fromText = context.Request["FromWho"].ToString();

			string path = GetLogFolder(context) + context.Session.SessionID + ".log";
			string content = "Date: " + DateTime.Now.ToString();
			string user = "\r\nUser: " + System.Security.Principal.WindowsIdentity.GetCurrent().Name.ToString();
			string details = "\r\n\r\nException Details:\r\n";
			string source = "\r\n\r\nSource Error:";
			string stack = "\r\n\r\nStack Trace:";
			string sourceFile = "\r\n\r\nSource:\r\n";
			string fromTitle = "\r\n\rFrom Who:\r\n";


			int startIndex = errorText.IndexOf("<code><pre>");
			int endIndex = -1;

			if (startIndex > -1)
			{
				endIndex = errorText.IndexOf("</pre></code>", startIndex);
				if (endIndex > -1)
				{
					startIndex += 11;
					source += errorText.Substring(startIndex, endIndex - startIndex);
					source = source.Replace("<font color=red>", ">>>>").Replace("\r\n</font>", "<<<<\r\n").Replace("</font>", "<<<<");
				}
			}

			if (startIndex > -1)
			{
				startIndex = errorText.IndexOf("<code><pre>", startIndex);
				if (startIndex > -1)
				{
					endIndex = errorText.IndexOf("</pre></code>", startIndex);
					if (endIndex > -1)
					{
						startIndex += 11;
						stack += errorText.Substring(startIndex, endIndex - startIndex);
					}
				}
			}

			if (startIndex > -1)
			{
				startIndex = errorText.IndexOf("<b> Source File: </b>");
				if (startIndex > -1)
				{
					endIndex = errorText.IndexOf("\n", startIndex);
					if (endIndex > -1)
					{
						startIndex += 21;
						sourceFile += errorText.Substring(startIndex, endIndex - startIndex);
					}
				}
			}

			if (startIndex > -1)
			{
				startIndex = errorText.IndexOf("<b> Exception Details: </b>");
				if (startIndex > -1)
				{
					endIndex = errorText.IndexOf("<br>", startIndex);
					if (endIndex > -1)
					{
						startIndex += 27;
						details += errorText.Substring(startIndex, endIndex - startIndex);
					}
				}
			}

			content += user;
			content += details;
			content += "\r\nStatus Code: " + statusCode;
			content += "\r\nStatus Text: " + statusText;
			content += "\r\nFrom Who: " + fromText;
			content += source;
			content += stack;
			content += sourceFile;
			content += "\r\n\r\n=======================================================================================================\r\n\r\n";

			if (!FileExists(path))
			{
				using (TextWriter writer = File.CreateText(path))
				{
					writer.Write(content);
				}
			}
			else
			{
				File.AppendAllText(path, content);
			}
			//writer.Close();
		}

		public bool IsReusable
		{
			get
			{
				return false;
			}
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="path"></param>
		/// <returns></returns>
		private bool FileExists(string path)
		{
			FileInfo logFile = new FileInfo(path);

			return logFile.Exists;
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="context"></param>
		/// <returns></returns>
		private string GetLogFolder(HttpContext context)
		{
			string path = context.Request.MapPath(".") + "\\Logs\\";
			DirectoryInfo dir = new DirectoryInfo(path);

			if (!dir.Exists)
				dir.Create();

			return path;
		}
	}
}