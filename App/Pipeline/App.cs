using System.Collections.Generic;
using Microsoft.AspNet.Http;

namespace Websilk.Pipeline
{
    public class App
    {
        private Core R;
        public Scaffold scaffold;

        public App(Server server, HttpContext context)
        {
            //the Pipeline.App is simply the first page request for a Websilk website. 
            //Scaffold the HTML, load the Websilk Core, then load a web page.

            R = new Core(server, context, "", "app");
            R.App = this;
            R.isFirstLoad = true;

            //setup scaffolding variables
            scaffold = new Scaffold(R, "/app/pipeline/app.html", "", new string[]
            { "title", "description", "facebook", "theme-css", "website-css", "editor-css", "head-css", "favicon", "font-faces", "body-class", "custom-css",
              "background", "editor","webpage-class", "body-sides","body", "scripts", "https-url", "http-url"});

            //default favicon
            scaffold.Data["favicon"] = "/images/favicon.gif";

            //check for web bots such as gogle bot
            string agent = context.Request.Headers["User-Agent"].ToLower();
            if (agent.Contains("bot") | agent.Contains("crawl") | agent.Contains("spider"))
            {
                R.Page.useAJAX = false;
                R.Page.isBot = true;
            }

            //check for mobile agent
            if (agent.Contains("mobile") | agent.Contains("blackberry") | agent.Contains("android") | agent.Contains("symbian") | agent.Contains("windows ce") | 
                agent.Contains("fennec") | agent.Contains("phone") | agent.Contains("iemobile") | agent.Contains("iris") | agent.Contains("midp") | agent.Contains("minimo") | 
                agent.Contains("kindle") | agent.Contains("opera mini") | agent.Contains("opera mobi") | agent.Contains("ericsson") | agent.Contains("iphone") | agent.Contains("ipad"))
            {
                R.Page.isMobile = true;
            }

            //get browser type
            scaffold.Data["body-class"] = R.Util.GetBrowserType();

            //parse URL
            R.Page.GetPageUrl();
            if(R.isLocal == true)
            {
                scaffold.Data["https-url"] = "http://" + R.Page.Url.host.Replace("/","");
            }else
            {
                scaffold.Data["https-url"] = "https://" + R.Page.Url.host.Replace("/", "");
            }

            //get page Info
            SqlReader reader = R.Page.GetPageInfoFromUrlPath();
            if(reader.Rows.Count > 0)
            {
                //load initial web page
                R.Page.LoadPageInfo(reader);

                if(R.Page.pageId > 0)
                {
                    string js = "";

                    //load page
                    R.Page.LoadPage(R.Page.pageFolder + "page.xml", 1, R.Page.pageId, R.Page.pageTitle);

                    //load website.css
                    scaffold.Data["website-css"] = "/content/websites/" + R.Page.websiteId + "/website.css?v=" + R.Version;

                    //load iframe resize code, so if a Websilk web page is loaded within an iframe, it can communicate
                    //with the parent web page whenever the iframe resizes.
                    if (R.Request.Query[ "ifr"] == "1")
                    {
                        js += "var frameSize = 0;" + "function checkResize(){" + "var wurl = \"" + R.Request.Query["w"] + "\";" + "if(frameHeight != frameSize){" + "parent.postMessage(\"resize|\"+(frameHeight),wurl);" + "}" + "frameSize = frameHeight;" + "setTimeout(\"checkResize();\",1000);" + "}" + "checkResize();";
                        R.Page.isEditable = false;
                    }

                    //register app javascript
                    js += "R.init(" + R.Page.useAJAX.ToString().ToLower() + ",'" + R.ViewStateId + "',R.page.title);";
                    R.Page.RegisterJS("app", js);

                    //display Page Editor
                    if (R.Page.isEditable == true)
                    {
                        Editor editor = new Editor(R);
                        string[] result = editor.LoadEditor();
                        scaffold.Data["editor"] = result[0];
                        R.Page.RegisterJS("editor", result[1]);
                    }

                    //setup scripts
                    string scripts;
                    if(R.isLocal == true)
                    {
                        scripts = "<script type=\"text/javascript\" src=\"/scripts/utility/jquery-2.1.3.min.js\"></script>\n" +
                            "<script type=\"text/javascript\" src=\"/scripts/core/global.js\"></script>\n" +
                            "<script type=\"text/javascript\" src=\"/scripts/core/view.js\"></script>\n" +
                            //"<script type=\"text/javascript\" src=\"/scripts/core/responsive.js\"></script>\n" +
                            "<script type=\"text/javascript\" src=\"/scripts/utility.js?v=" + R.Version + "\"></script>";
                        if(R.Page.isEditable == true)
                        {
                            scripts += "<script type=\"text/javascript\" src=\"/scripts/core/editor.js?v=" + R.Version + "\"></script>\n" +
                                "<script type=\"text/javascript\" src=\"/scripts/rangy/rangy-compiled.js?v=" + R.Version + "\"></script>\n" +
                                "<script type=\"text/javascript\" src=\"/scripts/utility/dropzone.js?v=" + R.Version + "\"></script>\n" +
                                "<script type=\"text/javascript\">R.editor.load();</script>";
                        }
                    }
                    else
                    {
                        scripts = "<script type=\"text/javascript\" src=\"/scripts/websilk.js?v=" + R.Version + "\"></script>\n" +
                                "<script type=\"text/javascript\" src=\"/scripts/utility.js?v=" + R.Version + "\"></script>";
                        if (R.Page.isEditable == true)
                        {
                            scripts += "<script type=\"text/javascript\" src=\"/scripts/editor.js?v=" + R.Version + "\"></script>\n" +
                                "<script type=\"text/javascript\">R.editor.load();</script>";
                        }
                    }

                    if(R.Page.postJScode.Length > 0)
                    {
                        R.Page.postJS += string.Join("\n", R.Page.postJScode) + R.Page.postJSLast;
                    }
                                        
                    scaffold.Data["scripts"] = scripts + "\n" + "<script type=\"text/javascript\">" + R.Page.postJS + "</script>";

                    //render web page
                    scaffold.Data["body"] = R.Page.Render();
                }
            }

            //finally, scaffold Websilk platform HTML
            R.Response.ContentType = "text/html";
            R.Response.WriteAsync(scaffold.Render());

            //unload the core
            R.Unload();
        }
    }
}
