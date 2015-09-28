using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Websilk
{
    public enum enumArrangement
    {
        none = -1,
        grid = 0,
        rows = 1,
        slideshow = 2,
        book = 3
    }

    public class Panel
    {
        [JsonIgnore]
        private Core S;
        public string name = "";
        public string id = "";
        public int pageId = 0;
        public bool isPartOfTheme = false;
        public enumArrangement arrangement = enumArrangement.none;
        public string[] arrange = new string[] { }; //arrangement settings

        [JsonIgnore]
        public List<Component> Components = new List<Component>();


        private string _DesignHead = "";
        private string _DesignFoot = "";
        private string _StackHead = "";
        private string _StackFoot = "";
        private string _InnerHead = "";
        private string _InnerFoot = "";
        private bool _isEmpty = false;
        private Array _ComponentDesigns;

        private bool _overflow = false;
        [JsonIgnore]
        public Utility.DOM.Element inner = new Utility.DOM.Element("div");

        public Panel(Core WebsilkCore, string Name = "")
        {
            S = WebsilkCore;
            name = Name;
        }

        public string Render()
        {
            string htm = "";
            inner.id = "inner";
            inner.Classes.Add("inner-panel inner" + id);
            if (Overflow == true) { inner.Style.Add("overflow", "hidden");}

            List<string> comps = new List<string>();
            for(int x = 0; x < Components.Count; x++)
            {
                comps.Add(Components[x].Render());
            }
            
            inner.innerHTML = InnerHead + 
                              (isEmpty == true ? "" : string.Join("\n",comps.ToArray())) + 
                              InnerFoot;

            var classes = "";
            var style = "";
            if(arrange.Length == 0) { arrange = new string[] { "a", "150", "0" }; }

            switch (arrangement)
            {
                case enumArrangement.grid:
                    //arrange-settings = width-type (fixed or responsive), fixed-width, 
                    //                   responsive-max-columns, responsive-min-width, 
                    //                   height-type (auto or fixed), fixed-height, 
                    //                   auto-height-mosaic, spacing
                    classes += " item-cell";
                    if(arrange[0] == "r")
                    {
                        style += "min-width:" + arrange[3] + "px;";
                    }
                    if(arrange[4] == "f")
                    {
                        style += "height:" + arrange[5] + "px;";
                    }
                    if(arrange[7] != "0")
                    {
                        style += "padding:0px " +(int.Parse(arrange[7]) / 2) + "px;";
                    }
                    break;

                case enumArrangement.rows:
                    //arrange-settings = height-type (auto or fixed), fixed-height, spacing
                    classes += " item-cell";
                    if (arrange[7] != "0")
                    {
                        style += "padding-bottom:" + arrange[2] + "px;";
                    }
                    break;

                case enumArrangement.slideshow:
                    classes += " item-slide";
                    break;

                case enumArrangement.book:
                    classes += " item-page";
                    break;

            }
            if(style != "") { style = " style=\"" + style + "\""; }

            htm = StackHead + "<div id=\"" + id + "\" class=\"panel" + name + " ispanel" + (isPartOfTheme == true ? " istheme" : "") + classes + "\"" + 
                  style + ">" +
                  DesignHead + inner.Render() + DesignFoot + "</div>" + StackFoot;

            return htm;
        }

        /// <summary>
        /// only executed once after initializing the panel
        /// </summary>
        public void AddPanelView()
        {
            PanelView pv = GetPanelView();
            bool addpv = true;
            if (S.Page.PanelViews.Count > 0)
            {
                foreach (PanelView p in S.Page.PanelViews)
                {
                    if (p.name == pv.name)
                    {
                        addpv = false;
                        break;
                    }
                }
            }
            if (addpv == true)
            {
                S.Page.PanelViews.Add(pv);
            }
        }

        public virtual string DesignHead
        {
            //the html code of the design header for the evolver panel
            get { return _DesignHead; }
            set { _DesignHead = value; }
        }

        public virtual string DesignFoot
        {
            //the html code of the design header for the evolver panel
            get { return _DesignFoot; }
            set { _DesignFoot = value; }
        }

        public virtual string StackHead
        {
            //the html code of the stack panel header for the evolver panel
            get { return _StackHead; }
            set { _StackHead = value; }
        }

        public virtual string StackFoot
        {
            //the html code of the stack panel footer for the evolver panel
            get { return _StackFoot; }
            set { _StackFoot = value; }
        }

        public virtual string InnerHead
        {
            //the html code of the stack panel header for the evolver panel
            get { return _InnerHead; }
            set { _InnerHead = value; }
        }

        public virtual string InnerFoot
        {
            //the html code of the stack panel footer for the evolver panel
            get { return _InnerFoot; }
            set { _InnerFoot = value; }
        }

        public virtual bool isEmpty
        {
            //shows a box inside the panel that says "drag & drop a component here"
            get { return _isEmpty; }
            set { _isEmpty = value; }
        }

        public virtual Array ComponentDesigns
        {
            //the html code of the design header for the evolver panel
            get { return _ComponentDesigns; }
            set { _ComponentDesigns = value; }
        }

        public virtual void setPadding(string padding)
        {
            inner.Style.Add("padding", padding);
        }

        public virtual bool Overflow
        {
            get { return _overflow; }
            set { _overflow = value; }
        }

        public PanelView GetPanelView()
        {
            PanelView pv = new PanelView();
            pv.name = name;
            pv.id = id;
            pv.pageId = pageId;
            pv.isPartOfTheme = isPartOfTheme;
            pv.arrangement = arrangement;
            pv.className = inner.id;

            return pv;
        }

        public void LoadFromPanelView(PanelView pv)
        {
            name = pv.name;
            id = pv.id;
            pageId = pv.pageId;
            isPartOfTheme = pv.isPartOfTheme;
            arrangement = pv.arrangement;
        }

    }

    public class PanelView
    {
        public string name = "";
        public string id = "";
        public int pageId = 0;
        public bool isPartOfTheme = false;
        public enumArrangement arrangement = 0;
        public string className = "";
    }
}
