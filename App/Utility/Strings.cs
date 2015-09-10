using System;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

namespace Websilk.Utility
{
    public class Str
    {
        private Core S;

        public Str(Core WebsilkCore){
            S = WebsilkCore;
        }

        #region "Conversion"
        public int Asc(string character)
        {
            string c = character.ToString();
            if(character.Length > 1) { c = c.Substring(0, 1); }
            
            return Encoding.ASCII.GetBytes(character)[0];
        }

        public string FromBoolToIntString(bool value)
        {
            return (value == true ? "1" : "0");
        }

        public byte[] GetBytes(string str)
        {
            byte[] bytes = new byte[str.Length * sizeof(char)];
            Buffer.BlockCopy(str.ToCharArray(), 0, bytes, 0, bytes.Length);
            return bytes;
        }

        public byte[] GetBytes(Stream stream)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                stream.CopyTo(ms);
                return ms.ToArray();
            }
        }

        public string GetString(byte[] bytes)
        {
            char[] chars = new char[bytes.Length / sizeof(char)];
            Buffer.BlockCopy(bytes, 0, chars, 0, bytes.Length);
            return string.Join("",chars);
        }

        public string ReadStream(Stream stream)
        {
            stream.Position = 0;
            StreamReader reader = new StreamReader(stream, Encoding.UTF8);
            return reader.ReadToEnd();
        }

        #endregion

        #region "Manipulation"
        public string Right(string str, int len)
        {
            return str.Substring(0, str.Length - 1 - len);
        }

        public string Left(string str, int len)
        {
            return str.Substring(0+len);
        }

        public string replaceAll(string myStr, string replaceWith, params string[] findList)
        {
            string newStr = myStr.ToString();
            for (int x = 0; x <= findList.Length - 1; x++)
            {
                newStr = newStr.Replace(findList[x], replaceWith);
            }
            return newStr;
        }

        public string replaceOnlyAlphaNumeric(string myStr, bool allowAlpha = true, bool allowNumbers = true, bool allowSpaces = true)
        {
            string newStr = myStr.ToString();
            bool result = false;
            int x = 0;
            while (x < newStr.Length)
            {
                result = false;
                if (allowAlpha == true)
                {
                    if (Asc(newStr.Substring(x, 1)) >= Asc("a") & Asc(newStr.Substring(x, 1)) <= Asc("z"))
                    {
                        result = true;
                    }

                    if (Asc(newStr.Substring(x, 1)) >= Asc("A") & Asc(newStr.Substring(x, 1)) <= Asc("Z"))
                    {
                        result = true;
                    }
                }

                if (allowNumbers == true)
                {
                    if (Asc(newStr.Substring(x, 1)) >= Asc("0") & Asc(newStr.Substring(x, 1)) <= Asc("9"))
                    {
                        result = true;
                    }
                }

                if (allowSpaces == true)
                {
                    if (newStr.Substring(x, 1) == " ")
                    {
                        result = true;
                    }
                }

                if (result == false)
                {
                    //remove character
                    newStr = newStr.Substring(0, x - 1) + newStr.Substring(x + 1);
                }
                else
                {
                    x++;
                }
            }
            return newStr;
        }

        public string Capitalize(string origText)
        {
            string[] textParts = origText.Split('\"');
            for (int x = 0; x <= textParts.Length - 1; x++)
            {
                if (textParts[x].Length > 0)
                {
                    textParts[x] = textParts[x].Substring(0, 1).ToUpper() + textParts[x].Substring(1);
                }
                else
                {
                    textParts[x] =textParts[x].ToUpper();
                }
            }
            return string.Join(" ", textParts);
        }

        public string CleanHtml(string html)
        {
            return html;
            //return Regex.Replace(html, "\\s{2,}", " ").Replace("> <", "><");
        }

        public object RemoveHtmlFromString(string str, bool includeBR = false)
        {
            string RegExStr = "<[^>]*>";
            if (includeBR == true)
                RegExStr = "(\\<)(?!br(\\s|\\/|\\>))(.*?\\>)";
            Regex S = new Regex(RegExStr);
            return S.Replace(str, "");
        }

        public string MinifyJS(string js)
        {
            string result = js;
            //trim left
            result = Regex.Replace(result, "^\\s*", String.Empty, RegexOptions.Compiled | RegexOptions.Multiline);
            //trim right
            result = Regex.Replace(result, "\\s*[\\r\\n]", "\n", RegexOptions.Compiled | RegexOptions.ECMAScript);
            //remove whitespace beside of left curly braced
            result = Regex.Replace(result, "\\s*{\\s*", "{", RegexOptions.Compiled | RegexOptions.ECMAScript);
            //remove whitespace beside of coma
            result = Regex.Replace(result, "\\s*,\\s*", ",", RegexOptions.Compiled | RegexOptions.ECMAScript);
            //remove whitespace beside of semicolon
            result = Regex.Replace(result, "\\s*;\\s*", ";", RegexOptions.Compiled | RegexOptions.ECMAScript);
            //remove newline after keywords
            result = Regex.Replace(result, "\\r\\n(?<=\\b(abstract|boolean|break|byte|case|catch|char|class|const|continue|default|delete|do|double|else|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|var|void|while|with|\\r\\n|\\})\\r\\n)", " ", RegexOptions.Compiled | RegexOptions.ECMAScript);

            //remove all newlines
            //result = Regex.Replace(result, "\r\n", " ", RegexOptions.Compiled Or RegexOptions.ECMAScript)
            return result;
        }

        #endregion

        #region "Extraction"
        public string getFileExtension(string filename)
        {
            for (int x = filename.Length-1; x >= 0; x += -1)
            {
                if (filename.Substring(x, 1) == ".")
                {
                    return filename.Substring(x+1);
                }
            }

            return "";
        }

        public string GetDomainName(string url)
        {
            string[] tmpDomain = GetSubDomainAndDomain(url).Split(new char[] { '.' },3);
            if(tmpDomain.Length == 2)
            {
                return url;
            }else if(tmpDomain.Length == 3)
            {
                if(tmpDomain[1] == "co")
                {
                    return url;
                }
                return tmpDomain[1] + "." + tmpDomain[2];
            }
            return url;
        }

        public string GetSubDomainAndDomain(string url)
        {
            string strDomain = url.Replace("http://", "").Replace("https://", "").Replace("www.", "").Split('/')[0];
            if (strDomain.IndexOf("localhost") >= 0 | strDomain.IndexOf("192.168") >= 0)
            {
                strDomain = "websilk.com";
            }
            return strDomain.Replace("/", "");
        }

        public string[] GetDomainParts(string url)
        {
            string subdomain = GetSubDomainAndDomain(url);
            string domain = GetDomainName(subdomain);
            string sub = subdomain.Replace(domain, "").Replace(".", "");
            if(sub != "")
            {
                return new string[] { sub, subdomain.Replace(sub, "") };
            }
            return new string[] { "", subdomain };
        }

        public string GetPageTitle(string title)
        {
            return title.Split(new string[] { " - " },0)[1];
        }

        public string GetWebsiteTitle(string title)
        {
            return title.Split(new string[] { " - " },0)[0];
        }

        #endregion

        #region "Generation"
        public string CreateID(int length = 3)
        {
            Random rnd = new Random();
            string result = "";
            for (var x = 0; x <= length - 1; x++) {
                int type = rnd.Next(1, 3);
                int num = 0;
                switch (type)
                {
                    case 1: //a-z
                        num = rnd.Next(0, 26);
                        result += (char)('a' + num);
                        break;

                    case 2: //A-Z
                        num = rnd.Next(0, 26);
                        result += (char)('A' + num);
                        break;

                    case 3: //0-9
                        num = rnd.Next(0, 9);
                        result += (char)('1' + num);
                        break;

                }

            }
            return result;
        }

        public string GenerateLinkAsString(string hash, string page = "", bool replacehash = false)
        {
            //creates a string of the URL link within the Websilk web page that may include a hash
            //first, replace partial hash with new hash if there are duplicate hash objects
            string[] arrHash = S.Page.Url.pathAndHash.Split('\"');
            string[] arrNew = null;
            if (!string.IsNullOrEmpty(hash))
                arrNew = hash.Split('\"');
            string[] arrHashCmd = null;
            string[] arrNewCmd = null;
            string finalHash = "";
            string newHash = "";
            string newPage = page;

            //remove duplicates in the hash
            if (!string.IsNullOrEmpty(hash))
            {
                for (int x = 0; x <= arrHash.Length - 1; x++)
                {
                    for (int y = 0; y <= arrNew.Length - 1; y++)
                    {
                        arrHashCmd = arrHash[x].Split('\"');
                        arrNewCmd = arrNew[y].Split('\"');
                        if (arrHashCmd[0] == arrNewCmd[0])
                        {
                            arrHash[x] = "";
                        }
                    }
                }
            }

            //create compiled hash
            if (!string.IsNullOrEmpty(S.Page.Url.pathAndHash))
            {
                for (int x = 0; x <= arrHash.Length - 1; x++)
                {
                    if (!string.IsNullOrEmpty(arrHash[x]))
                    {
                        if (!string.IsNullOrEmpty(finalHash))
                            finalHash += "/";
                        finalHash += arrHash[x];
                    }
                }
            }

            if (S.Page.useAJAX == false & S.Page.isEditable == false)
            {
                //create url
                if (Right(newPage, 1) != "/" & !string.IsNullOrEmpty(newPage))
                    newPage += "/";
                if (Right(newHash, 1) != "/" & !string.IsNullOrEmpty(newHash))
                    newHash += "/";

                if (replacehash == true)
                {
                    newHash = newHash.Replace("//", "/");
                    if (newHash.Trim() == "/")
                        newHash = "";
                    return S.Page.Url.host + newPage + newHash;
                }
                else
                {
                    return S.Page.Url.host + S.Page.Url.path + newPage + finalHash + newHash;
                }
            }
            else
            {
                //create hash url
                if (!string.IsNullOrEmpty(page))
                {
                    newPage = page.ToLower() + "/";
                }
                if (replacehash == true)
                {
                    return "#" + newPage + hash;
                }
                else
                {
                    if (!string.IsNullOrEmpty(S.Page.Url.pathAndHash))
                    {
                        return "#" + S.Page.Url.pathAndHash + "/" + hash;
                    }
                    else
                    {
                        return "#" + hash;
                    }
                }
            }

        }

        public string GenerateLinkAsHtmlAnchorString(string hash, string page = "", string cssClass = "", string cssStyle = "", bool replacehash = false)
        {
            //creates a string of the URL link within the Websilk web page that may include a hash
            string href = "";
            if (S.Page.useAJAX == false & S.Page.isEditable == false)
            {
                href += "<a href=\"" + GenerateLinkAsString(hash, page, replacehash) + "\"";
                if (!string.IsNullOrEmpty(cssClass))
                    href += " class=\"" + cssClass + "\"";
                if (!string.IsNullOrEmpty(cssStyle))
                    href += " style=\"" + cssStyle + "\"";
                href += ">";
            }
            else
            {
                href += "<a href=\"#\" hash=\"" + GenerateLinkAsString(hash, page, replacehash).Replace("#", "") + "\"";
                if (!string.IsNullOrEmpty(cssClass))
                    href += " class=\"" + cssClass + "\"";
                if (!string.IsNullOrEmpty(cssStyle))
                    href += " style=\"" + cssStyle + "\"";
                if (!string.IsNullOrEmpty(page))
                    href += " page=\"" + page + "\"";
                if (replacehash == true)
                    href += " replace=\"true\"";
                href += ">";
            }
            return href;
        }

        public string GenerateURL(string url)
        {
            int i = 0;
            int e = 0;
            string newurl = "";
            string myUrl = url;
            i = myUrl.IndexOf("#r=");
            e = url.Length;
            if (i >= 0)
            {
                newurl = myUrl.Substring(i + 3, e - (i + 3));
                newurl = newurl.Replace(" ", "-");
                newurl = GenerateLinkAsString("", newurl, true);
                if (Right(newurl, 1) == "+")
                    newurl = newurl.Substring(1, newurl.Length - 1);
                myUrl = newurl;
            }
            //inject Websilk Script
            if (myUrl.IndexOf("#s=") >= 0 | myUrl.IndexOf("#v=") >= 0)
            {
                //S.LoadWebsilkScript();
                //make sure the websilk script class is loaded
                //myUrl = S.Script.ParseHtmlString(myUrl, myContainer.id)
            }
            return myUrl;
        }

        public string DateFolders(DateTime myDate, int folderCount = 3)
        {
            string myMonth = myDate.Month.ToString();
            if (myMonth.Length == 1)
                myMonth = "0" + myMonth;
            string myDay = myDate.Day.ToString();
            if (myDay.Length == 1)
                myDay = "0" + myDay;
            if (folderCount == 3)
            {
                return myDate.Year.ToString() + myMonth + "/" + myDay;
            }
            else if (folderCount == 1)
            {
                return myDate.Year.ToString() + myMonth;
            }
            else if (folderCount == 2)
            {
                return myDay;
            }
            return "";
        }

        public string NumberSuffix(int digit)
        {
            switch (digit)
            {
                case 1:
                    return "st";
                case 2:
                    return "nd";
                case 3:
                    return "rd";
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                    return "th";
                default:
                    switch (int.Parse(S.Util.Str.Right(digit.ToString(), 1)))
                    {
                        case 1:
                            return "st";
                        case 2:
                            return "nd";
                        case 3:
                            return "rd";
                    }
                    return "th";
            }
        }

        public string DateSentence(DateTime myDate, string dateSeparator = "-")
        {
            TimeSpan timespan = (DateTime.Now - myDate);
            if (timespan.Seconds < 30)
            {
                return "Moments ago";
            }
            else if (timespan.Seconds < 60)
            {
                return "About a minute ago";
            }
            else if (timespan.Minutes < 55)
            {
                return timespan.Minutes + " minutes ago";
            }
            else if (timespan.Hours < 1)
            {
                return "About an hour ago";
            }
            else if (timespan.Hours < 24)
            {
                return timespan.Hours + " hours ago";
            }
            else if (timespan.Days == 1)
            {
                return "Yesterday at " + string.Format("{0:t}", myDate);
            }
            else if (timespan.Days > 1 & timespan.Days < 30)
            {
                return timespan.Days + " days ago at " + string.Format("{0:t}", myDate);
            }
            else if (timespan.Days >= 30)
            {
                return "On " + myDate.ToString("M" + dateSeparator + "dd" + dateSeparator + "yyyy") + " at " + string.Format("{0:t}", myDate);
            }
            return "";
        }

        #endregion

        #region "Validation"
        public bool IsNumeric(object str)
        {
            double retNum;
            if (S.Util.IsEmpty(str) == false)
            {
                return Double.TryParse(str.ToString(), out retNum);
            }
            return false;
        }

        public bool OnlyAlphabet(string myStr, params string[] exceptionList)
        {
            bool result = false;
            for (int x = 0; x <= myStr.Length - 1; x++)
            {
                result = false;
                if (Asc(myStr.Substring(x, 1)) >= Asc("a") & Asc(myStr.Substring(x, 1)) <= Asc("z"))
                {
                    result = true;
                }
                if (Asc(myStr.Substring(x, 1)) >= Asc("A") & Asc(myStr.Substring(x, 1)) <= Asc("Z"))
                {
                    result = true;
                }
                if (exceptionList.Length >= 0)
                {
                    for (int y = exceptionList.GetLowerBound(0); y <= exceptionList.GetUpperBound(0); y++)
                    {
                        if (myStr.Substring(x, 1) == exceptionList[y])
                        {
                            result = true;
                        }
                    }
                }
                if (result == false)
                {
                    return false;
                }
            }
            return true;
        }

        public bool OnlyLettersAndNumbers(string myStr, params string[] exceptionList)
        {
            bool result = false;
            for (int x = 0; x <= myStr.Length - 1; x++)
            {
                result = false;
                if (Asc(myStr.Substring(x, 1)) >= Asc("a") & Asc(myStr.Substring(x, 1)) <= Asc("z"))
                {
                    result = true;
                }

                if (Asc(myStr.Substring(x, 1)) >= Asc("A") & Asc(myStr.Substring(x, 1)) <= Asc("Z"))
                {
                    result = true;
                }

                if (Asc(myStr.Substring(x, 1)) >= Asc("0") & Asc(myStr.Substring(x, 1)) <= Asc("9"))
                {
                    result = true;
                }

                if (exceptionList.Length >= 0)
                {
                    for (int y = exceptionList.GetLowerBound(0); y <= exceptionList.GetUpperBound(0); y++)
                    {
                        if (myStr.Substring(x, 1) == exceptionList[y])
                        {
                            result = true;
                        }
                    }
                }

                if (result == false)
                {
                    return false;
                }
            }

            return true;
        }

        public bool CheckChar(string character, bool allowAlpha = true, bool allowNumbers = true, string[] allowList = null)
        {
            if (allowAlpha == true)
            {
                if (Asc(character) >= Asc("a") & Asc(character) <= Asc("z"))
                {
                    return true;
                }

                if (Asc(character) >= Asc("A") & Asc(character) <= Asc("Z"))
                {
                    return true;
                }
            }

            if (allowNumbers == true)
            {
                if (Asc(character) >= Asc("0") & Asc(character) <= Asc("9"))
                {
                    return true;
                }
            }

            if ((allowList != null))
            {
                foreach (string c in allowList)
                {
                    if (c == character)
                        return true;
                }
            }

            return false;
        }

        public bool ContainsCurseWords(string txt)
        {
            string[] myCurse = new string[13];
            myCurse[0] = "fuck";
            myCurse[1] = "fukc";
            myCurse[2] = "bitch";
            myCurse[3] = "cunt";
            myCurse[4] = "slut";
            myCurse[5] = "whore";
            myCurse[6] = "nigger";
            myCurse[7] = "niger";
            myCurse[8] = "shit";
            myCurse[9] = "cum";
            myCurse[10] = "cock";
            myCurse[11] = "pussy";
            myCurse[12] = "vagina";

            string newtxt = txt.ToLower();
            for (int x = 0; x <= myCurse.GetUpperBound(0); x++)
            {
                if (newtxt.IndexOf(myCurse[x]) >= 0)
                {
                    return true;
                }
            }

            return false;
        }

        public string CleanInput(string input, bool noHtml = true, bool noJs = true, bool noEncoding = true, bool noSpecialChars = true, string[] allowedChars = null)
        {
            //cleans any malacious patterns from the user input 
            string cleaned = input;
            return cleaned;
        }
        #endregion
    }
}
