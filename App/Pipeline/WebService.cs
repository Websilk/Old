using System;
using Microsoft.AspNet.Http;
using System.Text;
using System.IO;
using System.Collections.Generic;
using System.Reflection;
using Newtonsoft.Json;

namespace Websilk.Pipeline
{
    public class WebService
    {
        Core S;

        public WebService(Server server, HttpContext context, string[] paths, IFormCollection form = null)
        {
            //get parameters from request body, including ViewState ID
            string viewstate = "";
            object[] parms = new object[0];
            byte[] bytes = new byte[0];
            string data = "";
            int dataType = 0; //0 = ajax, 1 = form post, 2 = multi-part form

            if (form == null)
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    context.Request.Body.CopyTo(ms);
                    bytes = ms.ToArray();
                }
                data = Encoding.UTF8.GetString(bytes, 0, bytes.Length);
            }else
            {
                dataType = 2;
            }
            
            if (data.Length > 0)
            {
                if (data.IndexOf("Content-Disposition") > 0)
                {
                    //multi-part file upload
                    dataType = 2;
                }
                else if (data.IndexOf("{") >= 0 && data.IndexOf("}") > 0 && data.IndexOf(":") > 0)
                {
                    //JSON post data
                    Dictionary<string, object> attr = JsonConvert.DeserializeObject<Dictionary<string, object>>(data);
                    parms = new object[attr.Count - 1];
                    int x = 0; string val = "";
                    foreach (KeyValuePair<string, object> item in attr)
                    {
                        if(item.Value != null) {
                            val = item.Value.ToString(); ;
                        }
                        else {
                            val = "";
                        }
                        
                        if (item.Key == "viewstateId")
                        {
                            viewstate = val;
                        }
                        else
                        {
                            parms[x] = item.Value.ToString();
                            x = x + 1;
                        }
                    }
                }
                else if (data.IndexOf("=") >= 0)
                {
                    //form post data
                    dataType = 1;
                }
            }
            else
            {
                //get viewstate from query string
                viewstate = context.Request.Query["v"];
            }

            S = new Core(server, context, viewstate, "service");
            S.Page.GetPageUrl();

            //load service class from URL path
            string className = "Websilk.Services." + paths[1];
            string methodName = paths[2];
            if(paths.Length == 4) { className += "." + paths[2]; methodName = paths[3]; }
            Type type =Type.GetType(className);
            Service service = (Service)Activator.CreateInstance(type, new object[] { S });

            if (dataType == 1)
            {
                //form post data
                string[] items = S.Server.UrlDecode(data).Split('&');
                string[] item;
                for(int x = 0; x < items.Length; x++)
                {
                    item = items[x].Split('=');
                    service.Form.Add(item[0], item[1]);
                }
            }else if(dataType == 2)
            {
                //multi-part file upload
                service.Files = form.Files;
            }

            //execute method from service class
            MethodInfo method = type.GetMethod(methodName);

            //try to cast params to correct types
            ParameterInfo[] methodParams = method.GetParameters();
            if(parms.Length < methodParams.Length)
            {
                //add missing parameters
                var tlen = parms.Length;
                Array.Resize(ref parms, methodParams.Length);
                for(var x = tlen; x < methodParams.Length; x++)
                {
                    parms[x] = "";
                }
            }
            for(var x = 0; x < methodParams.Length; x++)
            {
                //cast params to correct (supported) types
                switch (methodParams[x].ParameterType.Name.ToLower())
                {
                    case "int32":
                        parms[x] = Int32.Parse((string)parms[x]);
                        break;

                    case "boolean":
                        parms[x] = parms[x].ToString().ToLower() == "true" ? true : false;
                        break;

                    case "double":
                        parms[x] = double.Parse((string)parms[x]);
                        break;
                }
            }

            object result = method.Invoke(service, parms);
            if(result != null)
            {
                switch (result.GetType().FullName)
                {
                    case "Websilk.WebRequest":
                        //send raw content (HTML)
                        WebRequest res = (WebRequest)result;
                        context.Response.ContentType = res.contentType;
                        context.Response.WriteAsync(res.html);
                        break;

                    default:
                        //JSON serialize web service response
                        string serialized = "{\"type\":\"" + result.GetType().FullName + "\", \"d\":" + JsonConvert.SerializeObject(result) + "}";

                        context.Response.ContentType = "text/json";
                        context.Response.WriteAsync(serialized);
                        break;
                }
            }else {
                context.Response.ContentType = "text/json";
                context.Response.WriteAsync("{\"type\":\"Empty\",\"d\":{}}");
            }

            //finally, unload the Websilk Core:
            //close SQL connection, save ViewState, save User info
            S.Unload();
        }

        private static bool IsNumeric(string s)
        {
            float output;
            return float.TryParse(s, out output);
        }
    }
}
