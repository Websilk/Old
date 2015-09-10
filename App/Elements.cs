using System;
using System.Collections.Generic;

namespace Websilk
{
    public enum ElementType
    {
        Button = 1,
        List = 2,
        Panel = 3,
        Textbox = 4
    }

    public class Elements
    {

        private Core R;
        private string Path = ""; //relative path

        public Elements(Core WebsilkCore, string path)
        {
            R = WebsilkCore;
            Path = path;
        }

        public Element.Element Load(ElementType type, string name, string path = "")
        {
            string pth = path;
            Element.Element elem;
            if(pth == "") { pth = Path; }

            switch (type)
            {
                case ElementType.Button:
                    elem = new Element.Button(R, pth + "elements/button.html", name);
                    break;

                case ElementType.List:
                    elem = new Element.List(R, pth + "elements/list.html", name);
                    break;

                case ElementType.Panel:
                    elem = new Element.Panel(R, pth + "elements/panel.html", name);
                    break;

                case ElementType.Textbox:
                    elem = new Element.Textbox(R, pth + "elements/textbox.html", name);
                    break;

                default:
                    elem = new Element.Element(R, pth, name);
                    break;
            }

            return elem;
        }
    }
}

namespace Websilk.Element
{
    public class Element
    {
        protected Core R;
        protected Scaffold scaffold;
        public string Name = "";
        public string Folder = "";

        public Element(Core WebsilkCore, string path, string name = "")
        {
            R = WebsilkCore;
            scaffold = new Scaffold(R, path, name);
        }

        public Dictionary<string, string> Data
        {
            get { return scaffold.Data; }
        }

        public string Render()
        {
            return scaffold.Render();
        }
    }
}
