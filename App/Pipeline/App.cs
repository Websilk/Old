using System.Collections.Generic;
using Microsoft.AspNet.Http;

namespace Websilk.Pipeline
{
    public class App
    {
        private Core S;
        public Scaffold scaffold;

        public App(Server server, HttpContext context)
        {
            //the Pipeline.App is simply the first page request for a Websilk website. 
            //Scaffold the HTML, load the Websilk Core, then load a web page.

            S = new Core(server, context, "", "app");
            S.App = this;
            S.isFirstLoad = true;

            //setup scaffolding variables
            scaffold = new Scaffold(S, "/app/pipeline/app.html", "", new string[]
            { "title", "description", "facebook", "theme-css", "website-css", "editor-css", "head-css", "favicon", "font-faces", "body-class",
              "background", "editor","webpage-class", "body-sides","body", "scripts", "https-url", "http-url"});

            //default favicon
            scaffold.Data["favicon"] = "/images/favicon.gif";

            //check for web bots such as gogle bot
            string agent = context.Request.Headers["User-Agent"].ToLower();
            if (agent.Contains("bot") | agent.Contains("crawl") | agent.Contains("spider"))
            {
                S.Page.useAJAX = false;
                S.Page.isBot = true;
            }

            //check for mobile agent
            if (agent.Contains("mobile") | agent.Contains("blackberry") | agent.Contains("android") | agent.Contains("symbian") | agent.Contains("windows ce") | 
                agent.Contains("fennec") | agent.Contains("phone") | agent.Contains("iemobile") | agent.Contains("iris") | agent.Contains("midp") | agent.Contains("minimo") | 
                agent.Contains("kindle") | agent.Contains("opera mini") | agent.Contains("opera mobi") | agent.Contains("ericsson") | agent.Contains("iphone") | agent.Contains("ipad"))
            {
                S.Page.isMobile = true;
            }
            if(agent.Contains("tablet") | agent.Contains("ipad")) { S.Page.isTablet = true; }

            //get browser type
            scaffold.Data["body-class"] = S.Util.GetBrowserType() + (S.Page.isMobile ? (S.Page.isTablet ? " s-tablet" : " s-mobile") : " s-hd");

            //parse URL
            S.Page.GetPageUrl();
            if(S.isLocal == true)
            {
                scaffold.Data["https-url"] = "http://" + S.Page.Url.host.Replace("/","");
            }else
            {
                scaffold.Data["https-url"] = "https://" + S.Page.Url.host.Replace("/", "");
            }

            //get page Info
            SqlReader reader = S.Page.GetPageInfoFromUrlPath();
            if(reader.Rows.Count > 0)
            {
                //load initial web page
                S.Page.LoadPageInfo(reader);

                if(S.Page.pageId > 0)
                {
                    string js = "";

                    //load page
                    S.Page.LoadPage(S.Page.pageFolder + "page.xml", 1, S.Page.pageId, S.Page.pageTitle);

                    //load website.css
                    scaffold.Data["website-css"] = "/content/websites/" + S.Page.websiteId + "/website.css?v=" + S.Version;

                    //load iframe resize code, so if a Websilk web page is loaded within an iframe, it can communicate
                    //with the parent web page whenever the iframe resizes.
                    if (S.Request.Query[ "ifr"] == "1")
                    {
                        js += "var frameSize = 0;" + "function checkResize(){" + "var wurl = \"" + S.Request.Query["w"] + "\";" + "if(frameHeight != frameSize){" + "parent.postMessage(\"resize|\"+(frameHeight),wurl);" + "}" + "frameSize = frameHeight;" + "setTimeout(\"checkResize();\",1000);" + "}" + "checkResize();";
                        S.Page.isEditable = false;
                    }

                    //register app javascript
                    js += "S.init(" + S.Page.useAJAX.ToString().ToLower() + ",'" + S.ViewStateId + "', S.page.title);";
                    S.Page.RegisterJS("app", js);

                    //display Page Editor
                    if (S.Page.isEditable == true)
                    {
                        Editor editor = new Editor(S);
                        string[] result = editor.LoadEditor();
                        scaffold.Data["editor"] = result[0];
                        S.Page.RegisterJS("editor", result[1]);

                        //show dashboard
                        string path = S.Request.Path.ToString().ToLower().Replace(" ", "+");
                        if (path.Substring(0, 1) == "/") { path = path.Substring(1); }
                        if (path.IndexOf("dashboard") == 0)
                        {
                            S.Page.RegisterJS("dash", "S.editor.dashboard.show('" + path.ToLower() + "');");
                        }
                    }

                    

                    //setup scripts
                    string scripts;
                    if(S.isLocal == true)
                    {
                        scripts = "<script type=\"text/javascript\" src=\"/scripts/core/jquery-2.1.4.min.js\"></script>\n" +
                            "<script type=\"text/javascript\" src=\"/scripts/core/view.js\" noasync></script>\n" +
                            "<script type=\"text/javascript\" src=\"/scripts/core/global.js\" noasync></script>\n" +
                            "<script type=\"text/javascript\" src=\"/scripts/utility.js\" noasync></script>\n";
                        if (S.Page.isEditable == true)
                        {
                            scripts += "<script type=\"text/javascript\" src=\"/scripts/core/editor.js?v=" + S.Version + "\" noasync></script>\n" +
                                "<script type=\"text/javascript\" src=\"/scripts/rangy/rangy-compiled.js?v=" + S.Version + "\" noasync></script>\n" +
                                "<script type=\"text/javascript\" src=\"/scripts/utility/dropzone.js?v=" + S.Version + "\" noasync></script>\n" +
                                "<script type=\"text/javascript\" noasync>S.editor.load();</script>\n";
                        }
                    }
                    else
                    {
                        scripts = "<script type=\"text/javascript\" src=\"/scripts/websilk.js?v=" + S.Version + "\" noasync></script>\n";
                        if (S.Page.isEditable == true)
                        {
                            scripts += "<script type=\"text/javascript\" src=\"/scripts/editor.js?v=" + S.Version + "\" noasync></script>\n" +
                                "<script type=\"text/javascript\" noasync>S.editor.load();</script>\n";
                        }
                    }
                    
                    //render web page
                    scaffold.Data["body"] = S.Page.Render();
                    scaffold.Data["scripts"] = scripts + "\n" + "<script type=\"text/javascript\" noasync>" + S.Page.postJS + "</script>";
                }
            }

            //finally, scaffold Websilk platform HTML
            S.Response.ContentType = "text/html";
            S.Response.WriteAsync(scaffold.Render());

            //unload the core
            S.Unload();
        }
    }
}
