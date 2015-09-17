namespace Websilk.Services.Components
{
	public class Login: Service
	{
        private string id = "login";
        private string host = "";
        private string[] content;
        private string[] design;
        private int websiteId;
        private string themeFolder;
        private string websiteFolder;
        private Scaffold scaffold;

        public Login(Core WebsilkCore, string[] paths):base(WebsilkCore, paths)
		{
		}

        private void SetupWebRequest()
        {
            host = S.Page.Url.host;

            //setup scaffolding variables
            scaffold  = new Scaffold(S, "/app/components/login/login.html", "", new string[] { "head", "action", "body", "foot", "script" });

            //get Website properties from Request.Query
            content = S.Request.Query["s"].Split(',');
            design = S.Request.Query["d"].Split(',');
            if (design.Length <= 1) { design = new string[] { "", "", "", "", "", "", "", "", "", "", "", "false", "", "", "" }; }
            websiteId = int.Parse(S.Request.Query["w"]);
            themeFolder = "/content/themes/" + S.Request.Query["l"] + "/";
            websiteFolder = "/content/websites/" + websiteId + "/";
            scaffold.Data["head"] = "<link rel=\"Stylesheet\" type=\"text/css\" href=\"/css/websilk.css\"/>" +
                               "<link rel=\"Stylesheet\" type=\"text/css\" href=\"" + themeFolder + "style.css\"/>" +
                               "<link rel=\"Stylesheet\" type=\"text/css\" href=\"" + websiteFolder + "website.css\"/>";

            //set form action
            scaffold.Data["action"] = "/websilk/Components/Login/PostForm" + S.Request.QueryString;

            //set missing Page properties
            S.Page.themeFolder = themeFolder;
            S.Page.websiteId = websiteId;
            S.Elements = new Elements(S, themeFolder);


            //setup scaffold parameters
            scaffold.Data["script"] = "this.isNotKeepAlive=1; S.ajax.viewstateId = '" + S.ViewStateId + "';";

            if (S.isLocal == true)
            {
                scaffold.Data["foot"] = "<script type=\"text/javascript\" src=\"/scripts/core/jquery-2.1.3.min.js\" noasync></script>\n" +
                                   "<script type=\"text/javascript\" src=\"/scripts/core/view.js\" noasync></script>\n" +
                                   "<script type=\"text/javascript\" src=\"/scripts/core/global.js\" noasync></script>\n";
            }
            else
            {
                scaffold.Data["foot"] = "<script type=\"text/javascript\" src=\"/scripts/websilk.js?v=" + S.Version + "\" noasync></script>\n";
            }
        }

        public WebRequest LoadForm()
        {
            WebRequest wr = new WebRequest();
            string htm = "";

            SetupWebRequest();

            Element.Textbox elemTextbox = (Element.Textbox)S.Elements.Load(ElementType.Textbox, design[0]);
            Element.Button elemButton = (Element.Button)S.Elements.Load(ElementType.Button, design[1]);

           //setup login form properties
            int designFieldsAlign = 1; //1=vertical, 2=horizontal
            int designLabelAlign = 1; //1=left, 2=top left, 3=top right
            int designButtonAlign = 1; //1=right, 2=bottom left, 3=bottom center, 4=bottom right, 5=hidden
            int designLabelPadding = 2; //top or bottom padding of label
            int designFieldPadding = 10; //vertical & horizontal padding between form items (textboxes & button)
            string designTextboxWidth = "200px";
            string designButtonWidth = "100px";
            string designButtonTitle = "Log In";
            int designButtonOffset = 2; //top offset position of button
            int designWidth = 0;
            int designHeight = 0;
            int designPadding = 0;

            //load login form settings
            if(content.Length > 4)
            {
                if (S.Util.Str.IsNumeric(content[0]) == true) { designFieldsAlign = int.Parse(content[0]); }
                if (S.Util.Str.IsNumeric(content[1]) == true) { designLabelAlign = int.Parse(content[1]); }
                if (S.Util.Str.IsNumeric(content[2]) == true) { designButtonAlign = int.Parse(content[2]); }
                if (S.Util.Str.IsNumeric(content[3]) == true) { designLabelPadding = int.Parse(content[3]); }
                if (S.Util.Str.IsNumeric(content[4]) == true) { designFieldPadding = int.Parse(content[4]); }
            }
            if(content.Length > 8)
            {
                if (!string.IsNullOrEmpty(content[5])) { designTextboxWidth = content[5]; }
                if (!string.IsNullOrEmpty(content[6])) { designButtonWidth = content[6]; }
                if (!string.IsNullOrEmpty(content[7])) { designButtonTitle = content[7]; }
                if (!string.IsNullOrEmpty(content[8])) { designButtonOffset = int.Parse(content[8]); }
            }
            if(content.Length > 14)
            {
                if (S.Util.Str.IsNumeric(content[12]) == true) { designWidth = int.Parse(content[12]); }
                if (S.Util.Str.IsNumeric(content[13]) == true) { designHeight = int.Parse(content[13]); }
                if (S.Util.Str.IsNumeric(content[14]) == true) { designPadding = int.Parse(content[14]); }
            }

            //email label
            htm += "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:100%;";
            if (designPadding >= 0)
            {
                //htm &= "padding:" & designPadding & "px;"
            }
            htm += "\"><tr>";
            htm += "<td style=\"vertical-align:top;\">";
            if (designLabelAlign != 4)
            {
                htm += "<div style=\"";
                if (designLabelAlign == 1)
                    htm += " float:left;";
                if (designLabelAlign > 1)
                    htm += " width:100%; padding-bottom:" + designLabelPadding + "px;";
                if (designLabelAlign == 1)
                    htm += " padding-right:" + designLabelPadding + "px;";
                if (designLabelAlign == 3)
                    htm += " text-align:right;";
                if (designFieldsAlign == 2)
                    htm += " padding-top:4px;";
                htm += "\">Email</div>";
            }
            //email textbox
            if (designFieldsAlign == 1 & designLabelAlign == 1)
                htm += "</td><td style=\"vertical-align:top;\">";
            htm += "<div style=\"";
            if (designLabelAlign > 1 & designFieldsAlign == 1)
                htm += "padding-top:" + designLabelPadding + "px;";
            if (designLabelAlign == 1 & designFieldsAlign == 1)
                htm += "padding-top:" + designFieldPadding + "px;";
            if (designLabelAlign == 1)
                htm += "float:left;";
            htm += "\">";

            if (designLabelAlign == 4)
            {
                //add hidden textbox for inside labels
                htm += elemTextbox.Render("email", "", "Email", "width:" + designTextboxWidth + ";");
            }
            else
            {
                htm += elemTextbox.Render("email", "", "", "width:" + designTextboxWidth + ";");
            }

            htm += "</div></td>";
            //password label
            if (designFieldsAlign == 1)
                htm += "</tr><tr>";
            htm += "<td style=\"vertical-align:top;";
            if (designFieldsAlign == 2)
                htm += "padding-left:" + designFieldPadding + "px;";
            if (designFieldsAlign == 1)
                htm += "padding-top:" + designFieldPadding + "px;";
            htm += "\">";
            if (designLabelAlign != 4)
            {
                htm += "<div style=\"";
                if (designLabelAlign == 1) { htm += " float:left;"; }
                if (designLabelAlign > 1) { htm += " width:100%; padding-bottom:" + designLabelPadding + "px;"; }
                if (designLabelAlign == 1) { htm += " padding-right:" + designLabelPadding + "px;"; }
                if (designLabelAlign == 3) { htm += " text-align:right;"; }
                if (designFieldsAlign == 2) { htm += " padding-top:4px;"; }
                htm += "\">Password</div>";
            }
            //password textbox
            if (designFieldsAlign == 1 & designLabelAlign == 1) { htm += "</td><td style=\"vertical-align:top;\">"; }
            htm += "<div style=\"";
            if (designLabelAlign > 1 & designFieldsAlign == 1) { htm += "padding-top:" + designLabelPadding + "px;"; }
            if (designLabelAlign == 1 & designFieldsAlign == 1) { htm += "padding-top:" + designFieldPadding + "px;"; }
            if (designLabelAlign == 1) { htm += "float:left;"; }
            htm += "\">";

            if (designLabelAlign == 4)
            {
                //add hidden textbox for inside labels
                htm += elemTextbox.Render("password", "", "Password", "width:" + designTextboxWidth + ";", Element.Textbox.enumTextType.password);
            }
            else
            {
                htm += elemTextbox.Render("password", "", "", "width:" + designTextboxWidth + ";", Element.Textbox.enumTextType.password);
            }

            //forgot password link
            htm += "<div style=\"padding:7px;\"><a href=\"" + S.Request.Path + "&forgotpass\">forgot password?</a></div>";
            htm += "</div></td>";

            //submit button
            if (designButtonAlign < 5)
            {
                if (designFieldsAlign == 1) { htm += "</tr><tr>"; }
                if (designFieldsAlign == 2 & designButtonAlign > 1) { htm += "</tr><tr>"; }
                htm += "<td style=\"vertical-align:top;";
                if (designFieldsAlign == 2 & designButtonAlign == 1) { htm += "padding-left:" + designFieldPadding + "px;"; }
                if (designFieldsAlign == 1) { htm += "padding-top:" + designFieldPadding + "px;"; }
                htm += "\"";
                if (designFieldsAlign == 1) { htm += " colspan=\"2\""; }
                if (designButtonAlign == 1) { htm += " valign=\"bottom\""; }
                htm += "><div style=\"";
                switch (designButtonAlign)
                {
                    //1=right, 2=bottom left, 3=bottom center, 4=bottom right, 5=hidden
                    case 1:
                    case 4:
                        if (designFieldsAlign == 1)
                        {
                            htm += " float:right;";
                        }
                        else
                        {
                            htm += "position:relative; top:" + designButtonOffset + "px;";
                        }
                        break;
                    case 3:
                        htm += " margin-left:auto; margin-right:auto;";
                        break;
                }
                htm += "\">";

                //add login button
                htm += elemButton.Render(id + "Login", "javascript:$('form')[0].submit()", designButtonTitle);
                htm += "</div></td>";
            }
            htm += "</tr></table>";

            scaffold.Data["body"] = htm;

            //finally, scaffold login HTML
            wr.html = scaffold.Render();
            return wr;
        }

        public WebRequest PostForm()
        {
            //save form in SQL so parent window can authenticate
            WebRequest wr = new WebRequest();
            if(Form.ContainsKey("email") == false) { return wr; }
            if (Form.ContainsKey("password") == false) { return wr; }
            SetupWebRequest();

            Utility.Encryption crypt = new Utility.Encryption(S);
            string email = Form["email"];
            string pass = Form["password"];
            string salt = crypt.GetMD5Hash(email + "?" + pass);
            string loginid = S.Util.Str.CreateID();
            string host;
            if(S.isLocal == true)
            {
                host = "http://" + S.Page.Url.host;
            }else
            {
                host = "https://" + S.Page.Url.host;
            }
            //IHttpConnectionFeature ip = S.Context.GetFeature<IHttpConnectionFeature>();
            S.Page.SqlPage.SaveLoginForAuth(salt, email, loginid);
            scaffold.Data["script"] += "setTimeout(function(){parent.postMessage(\"login|" + loginid + "\",\"" + host + "\");},10);";

            //finally, scaffold login HTML
            scaffold.Data["body"] = "<div style=\"text-align:center; width:100%; padding-top:10px;\">Processing login...</div>";
            wr.html = scaffold.Render();
            return wr;
        }

        public string Authenticate(string authId)
        {
            //authenticate login info from parent window
            Inject result = new Inject();
            if (S.User.LogIn(authId) == true)
            {
                return "Dashboard";
            }
            return "";
        }
	}
}