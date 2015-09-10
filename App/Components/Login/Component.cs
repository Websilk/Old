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
            if (R.isLocal == false) { loginHost = "https://websilk.com"; }
            if (R.Util.IsEmpty(R.Request.Query["resetpass"]) == false)
            {
                loginQuery += "&resetpass=" + R.Request.Query["resetpass"];
            }
            string htm = "<iframe id=\"loginframe" + id + "\" style=\"width:100%; height:100%; background-color:transparent;\"  frameborder=\"0\" scrolling=\"no\" src=\"" + loginHost + "/websilk/Components/Login/LoadForm?v=" + R.ViewStateId + "&w=" + R.Page.websiteId + "&u=" + R.Page.ownerId + "&l=" + R.Page.themeName + "&s=" + dataField.Replace("|", ",") + "&d=" + designField.Replace("|", ",") + loginQuery;
            if (R.Page.isEditable == true) { htm += "&edit=1"; }
            htm += "\"></iframe>";
            innerHTML = htm;

            if (R.User.userId == 0 | R.Page.isEditable == true)
            {
                string myJs = "";
                myJs += 
                    "R.components.cache['c" + id + "'].LoginFromIframe = function(id){" + 
                        "R.ajax.post('/websilk/Components/Login/Authenticate',{'authId':id}, this.LoginRedirect);" + 
                    "};" + 
                    "R.components.cache['c" + id + "'].LoginRedirect = function(data){" + 
                        "var c = R.components.cache['c" + id + "'];" + 
                        "if(data.d == ''){" +
                            "$R('c" + id + "').innerHTML = '" + htm.Replace("'", "\\'") + "';" + "alert('incorrect email or password');}" + 
                        "else{" +
                            "$R('c" + id + "').innerHTML = '<div style=\"padding-top:20px; width:100%; text-align:center;\">Login successful. Loading dashboard...</div>';" + 
                            "R.ajax.post('/websilk/App/Hash', { url: data.d }, R.hash.callback);" + 
                        "}" + 
                    "};";
                R.Page.RegisterJS("login" + id, myJs);
            }

            return base.Render();
        }
    }
}