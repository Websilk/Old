namespace Websilk.Components
{
    public class Login : Component
    {
        public Login(Core WebsilkCore) : base(WebsilkCore)
        {
        }

        public override string name
        {
            get
            {
                return "Login";
            }
        }

        public override string contentName
        {
            get { return "Login Form"; }
        }

        public override int instanceLimit
        {
            get
            {
                return 1;
            }
        }

        public override string Render()
        {
            string loginHost = "";
            string loginQuery = "";
            //If InStr(myEvolver.pageUrl[0], "localhost") = 0 Then loginHost = "https://" & myEvolver.pageUrl[0].Replace("http://", "").Replace("https://", "").Replace("/", "")
            if (S.isLocal == false) { loginHost = "https://websilk.com"; }
            if (S.Util.IsEmpty(S.Request.Query["resetpass"]) == false)
            {
                loginQuery += "&resetpass=" + S.Request.Query["resetpass"];
            }
            string htm = "<iframe id=\"loginframe" + id + "\" style=\"width:100%; height:100%; background-color:transparent;\"  frameborder=\"0\" scrolling=\"no\" src=\"" + loginHost + "/api/Components/Login/LoadForm?v=" + S.ViewStateId + "&w=" + S.Page.websiteId + "&u=" + S.Page.ownerId + "&l=" + S.Page.themeName + "&s=" + dataField.Replace("|", ",") + "&d=" + designField.Replace("|", ",") + loginQuery;
            if (S.Page.isEditable == true) { htm += "&edit=1"; }
            htm += "\"></iframe>";
            innerHTML = htm;

            if (S.User.userId == 0 | S.Page.isEditable == true)
            {
                string myJs = "";
                myJs += 
                    "S.components.cache['c" + id + "'].LoginFromIframe = function(id){" + 
                        "S.ajax.post('/api/Components/Login/Authenticate',{'authId':id}, this.LoginRedirect);" + 
                    "};" + 
                    "S.components.cache['c" + id + "'].LoginRedirect = function(data){" + 
                        "var c = S.components.cache['c" + id + "'];" + 
                        "if(data.d == ''){" +
                            "$S('c" + id + "').innerHTML = '" + htm.Replace("'", "\\'") + "';" + "alert('incorrect email or password');}" + 
                        "else{" +
                            "$S('c" + id + "').innerHTML = '<div style=\"padding-top:20px; width:100%; text-align:center;\">Login successful. Loading dashboard...</div>';" + 
                            "S.ajax.post('/api/App/Url', { url: data.d }, S.ajax.callback.pageRequest);" + 
                        "}" + 
                    "};";
                S.Page.RegisterJS("login" + id, myJs);
            }
            else
            {
                innerHTML = "<div style=\"text-align:center; width:100%; padding-top:10px;\">You are currently logged into your account.</div>";
            }

            return base.Render();
        }
    }
}