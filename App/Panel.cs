using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Websilk
{
    public class Panel
    {
        [JsonIgnore]
        private Core R;
        public string Name = "";
        public string id = "";
        public int Width = 0;
        public int Height = 0;
        public int ResizeType = 0;
        public int HeightType = 0;
        public int PageId = 0;
        public bool isPartOfTheme = false;
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

        public Panel(Core WebsilkCore, string name = "")
        {
            R = WebsilkCore;
            Name = name;
        }

        public string Render()
        {
            string htm = "";
            inner.id = "inner";
            inner.Classes.Add("inner-panel inner" + id);
            if (Width > 0) { inner.Style.Add("width", Width.ToString() + "px");}
            if (Height > 0) { inner.Style.Add("height", Height.ToString() + "px");}
            inner.Attributes.Add("resizeh",HeightType.ToString());
            inner.Attributes.Add("resize",ResizeType.ToString());
            if (Overflow == true) { inner.Style.Add("overflow", "hidden");}

            List<string> comps = new List<string>();
            for(int x = 0; x < Components.Count; x++)
            {
                comps.Add(Components[x].Render());
            }
            
            inner.innerHTML = InnerHead + 
                              (isEmpty == true ? "" : string.Join("\n",comps.ToArray())) + 
                              InnerFoot;

            htm = StackHead + "<div id=\"" + id + "\" class=\"panel" + Name + " ispanel" + (isPartOfTheme == true ? " istheme" : "") + "\">" +
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
            if (R.Page.PanelViews.Count > 0)
            {
                foreach (PanelView p in R.Page.PanelViews)
                {
                    if (p.Name == pv.Name)
                    {
                        addpv = false;
                        break;
                    }
                }
            }
            if (addpv == true)
            {
                R.Page.PanelViews.Add(pv);
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

        public void setWidthAndHeight(int w, string h = "")
        {
            if (w == 0 & (string.IsNullOrEmpty(h) | h == "0") == true)
            {
                //remove width & height from style
                Width = 0;
                Height = 0;

            }
            else
            {
                if (w >= 0)
                    Width = w;
                if (!string.IsNullOrEmpty(h))
                {
                    Height = int.Parse(h);
                }
                else
                {
                    Height = 0;
                }
            }
        }

        public virtual bool Overflow
        {
            get { return _overflow; }
            set { _overflow = value; }
        }

        public PanelView GetPanelView()
        {
            PanelView pv = new PanelView();
            pv.Name = Name;
            pv.id = id;
            pv.ClassName = inner.id;
            pv.isPartOfTheme = isPartOfTheme;
            pv.Components = Components;
            pv.PageId = PageId;
            pv.Height = Height;
            return pv;
        }

        public void LoadFromPanelView(PanelView pv)
        {
            Name = pv.Name;
            id = pv.id;
            isPartOfTheme = pv.isPartOfTheme;
            Components = pv.Components;
            PageId = pv.PageId;
        }

    }

    public class PanelView
    {
        public string Name = "";
        public string id = "";
        public string ClassName = "";
        public bool isPartOfTheme = false;
        public int PageId = 0;
        public int Height = 0;
        [JsonIgnore]
        public List<Component> Components = new List<Component>();
    }
}
