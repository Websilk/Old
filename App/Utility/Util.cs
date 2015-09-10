namespace Websilk.Utility
{
    public class Util
    {
        private Core R;

        public Str Str;
        public Xml Xml;
        public Serializer Serializer;

        public Util(Core WebsilkCore)
        {
            R = WebsilkCore;
            Str = new Str(R);
            Xml = new Xml();
            Serializer = new Serializer(R);
        }

        #region "Validation"

        public bool IsEmpty(object obj)
        {
            if(obj == null) { return true; }
            if (string.IsNullOrEmpty(obj.ToString())==true) { return true; }
            return false;
        }

        #endregion

        #region "Information"
        public string GetBrowserType()
        {
            string browser = R.Request.Headers["User-Agent"].ToLower();
            int major = 11;
            int minor = 0;
            if (browser.IndexOf("chrome") >= 0)
            {
                if (major > 10)
                {
                    return "chrome";
                }
                else
                {
                    return "legacy-chrome";
                }
            }
            else if (browser.IndexOf("firefox") >= 0)
            {
                if (major == 3 & minor >= 6)
                {
                    return "firefox";
                }
                else if (major > 3)
                {
                    return "firefox";
                }
                else
                {
                    return "legacy-firefox";
                }
            }
            else if (browser.IndexOf("safari") >= 0)
            {
                if (browser.IndexOf("iphone") >= 0)
                {
                    return "iphone";
                }
                else if (browser.IndexOf("ipad") >= 0)
                {
                    return "ipad";
                }
                else if (major <= 4)
                {
                    return "legacy-safari";
                }
                return "safari";
            }
            return "";
        }
        #endregion
    }
}
