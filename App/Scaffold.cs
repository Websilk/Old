using System;
using System.Collections.Generic;
using System.IO;

namespace Websilk
{
    public struct structScaffoldElement
    {
        public List<structScaffold> parts;
        public Dictionary<string, string> arguments;
    }

    public struct structScaffold
    {
        public string name;
        public string htm;
    }

    public class Scaffold
    {
        private Core S;
        public Dictionary<string, string> Data;
        public structScaffoldElement scaffold;

        public Dictionary<string, string> Arguments
        {
            get { return scaffold.arguments; }
        }

        public Scaffold(Core WebsilkCore, string file = "", string html = "", string section = "")
        {
            S = WebsilkCore;
            Data = new Dictionary<string, string>();

            if (S.Server.Scaffold.ContainsKey(file + '/' + section) == false)
            {
                scaffold = new structScaffoldElement();
                scaffold.parts = new List<structScaffold>();
                scaffold.arguments = new Dictionary<string, string>();

                //first, check if html is already provided
                var htm = html;
                if(htm == "")
                {
                    //try loading file from disk or cache next
                    if (S.Server.Cache.ContainsKey(file) == false)
                    {
                        htm = File.ReadAllText(S.Server.MapPath(file));
                    }
                    else
                    {
                        htm = (string)S.Server.Cache[file];
                    }
                }
                

                //next, find the group of code matching the scaffold name
                if(section != "")
                {
                    int[] e = new int[3];
                    string s = "";
                    e[0] = -1;
                    while(e[0] < 0) { 
                        //find starting tag (optionally with arguments)
                        e[0] = htm.IndexOf("{{" + section);
                        if(e[0] >= 0)
                        {
                            e[1] = e[0] + 2 + section.Length;
                            s = htm.Substring(e[1], 1);
                            switch (s)
                            {
                                case "}":
                                    break;

                                case " ":
                                case "(":
                                    if (s == " ") { e[1] += 1; s = htm.Substring(e[1], 1); }
                                    if (s == "(")
                                    {
                                        //get arguments
                                        e[2] = htm.IndexOf(")", e[1]);
                                        string[] args = htm.Substring(e[1] + 1, e[2] - e[1] - 1).Split(',');
                                        for (int x = 0; x < args.Length; x++)
                                        {
                                            string[] kv = args[x].Split(':');
                                            if (kv.Length == 2)
                                            {
                                                scaffold.arguments.Add(kv[0].Trim().Trim(new char[] { '\'' }), kv[1].Trim().Trim(new char[] { '\'' }));
                                            }
                                        }
                                    }
                                    break;

                                default:
                                    e[0] = -1;
                                    break;
                            }
                        } else { break; }
                        
                    }
                    e[1] = htm.IndexOf("{{/" + section + "}}");
                    if (e[0] >= 0 & e[1] > e[0])
                    {
                        e[2] = e[0] + 4 + section.Length;
                        htm = htm.Substring(e[2], e[1] - e[2]);
                    }
                }

                //get scaffold from html code
                var arr = htm.Split(new string[] { "{{" }, StringSplitOptions.RemoveEmptyEntries);
                var i = 0; structScaffold scaff;
                for (var x = 0; x < arr.Length; x++)
                {
                    i = arr[x].IndexOf("}}");
                    scaff = new structScaffold();
                    if (i > 0)
                    {
                        scaff.name = arr[x].Substring(0, i);
                        scaff.htm = arr[x].Substring(i + 2);
                    }
                    else
                    {
                        scaff.name = "";
                        scaff.htm = arr[x];
                    }
                    scaffold.parts.Add(scaff);
                }
                if(S.isLocal == false){ S.Server.Scaffold.Add(file + '/' + section, scaffold); }
            }
            else
            {
                //get scaffold object from memory
                scaffold = S.Server.Scaffold[file + '/' + section];
            }
        }

        public string Render()
        {
            return Render(Data);
        }

        public string Render(Dictionary<string, string> nData, bool replaceData = false)
        {
            if (replaceData == true) { Data = nData; }
            if (scaffold.parts.Count > 0)
            {
                //render scaffold with paired nData data
                List<string> scaff = new List<string>(); string s = "";
                bool useScaffold = false; List<List<string>> closing = new List<List<string>>();

                //remove any unwanted blocks of HTML from scaffold
                for (var x = 0; x < scaffold.parts.Count; x++)
                {
                    if (x < scaffold.parts.Count - 1)
                    {
                        for (var y = x + 1; y < scaffold.parts.Count; y++)
                        {
                            //check for closing tag
                            if (scaffold.parts[y].name == "/" + scaffold.parts[x].name)
                            {
                                //add enclosed group of HTML to list for removing
                                List<string> closed = new List<string>();
                                closed.Add(scaffold.parts[x].name);
                                closed.Add(x.ToString());
                                closed.Add(y.ToString());

                                if (nData.ContainsKey(scaffold.parts[x].name) == true)
                                {
                                    //check if user wants to include HTML 
                                    //that is between start & closing tag   
                                    s = nData[scaffold.parts[x].name];
                                    if (string.IsNullOrEmpty(s) == true) { s = ""; }
                                    if (s == "true" | s == "1")
                                    {
                                        closed.Add("true");
                                    }
                                    else { closed.Add(""); }
                                }
                                else { closed.Add(""); }

                                closing.Add(closed);
                            }
                        }

                    }
                }

                //remove all groups of HTML in list that should not be displayed
                List<int> removeIndexes = new List<int>();
                bool isInList = false;
                for (int x = 0; x < closing.Count; x++)
                {
                    if (closing[x][3] != "true")
                    {
                        //add range of indexes from closing to the removeIndexes list
                        for (int y = int.Parse(closing[x][1]); y < int.Parse(closing[x][2]); y++)
                        {
                            isInList = false;
                            for (int z = 0; z < removeIndexes.Count; z++)
                            {
                                if (removeIndexes[z] == y) { isInList = true; break; }
                            }
                            if (isInList == false) { removeIndexes.Add(y); }
                        }
                    }
                }
                //physically remove HTML list items from scaffold
                int offset = 0;
                for (int z = 0; z < removeIndexes.Count; z++)
                {
                    scaffold.parts.RemoveAt(removeIndexes[z] - offset);
                    offset += 1;
                }

                //finally, replace scaffold variables with custom data
                for (var x = 0; x < scaffold.parts.Count; x++)
                {
                    //check if scaffold item is an enclosing tag or just a variable
                    useScaffold = true;
                    if (scaffold.parts[x].name.IndexOf('/') < 0)
                    {
                        for (int y = 0; y < closing.Count; y++)
                        {
                            if (scaffold.parts[x].name == closing[y][0]) { useScaffold = false; break; }
                        }
                    }
                    else { useScaffold = false; }

                    if ((nData.ContainsKey(scaffold.parts[x].name) == true
                    || scaffold.parts[x].name.IndexOf('/') == 0) & useScaffold == true)
                    {
                        //inject string into scaffold variable
                        s = nData[scaffold.parts[x].name.Replace("/", "")];
                        if (string.IsNullOrEmpty(s) == true) { s = ""; }
                        scaff.Add(s + scaffold.parts[x].htm);
                    }
                    else
                    {
                        //passively add htm, ignoring scaffold variable
                        scaff.Add(scaffold.parts[x].htm);
                    }

                }

                //render scaffolding as HTML string
                return String.Join("", scaff.ToArray());
            }
            return "";
        }
    }
}
