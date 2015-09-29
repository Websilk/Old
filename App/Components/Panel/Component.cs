using System.Collections.Generic;

namespace Websilk.Components
{
    public class Panel : Component
    {
        protected List<Websilk.Panel> myPanels = new List<Websilk.Panel>();

        public string headHtml = "";
        public string footHtml = "";
        private enumArrangement _arrangment;
        private string[] _arrange = new string[] { };

        public Panel(Core WebsilkCore) : base(WebsilkCore)
        {
            _arrangment = enumArrangement.none;
        }

        public override string name
        {
            get
            {
                return "Panel";
            }
        }

        public override string contentName
        {
            get { return "Panel Cell"; }
        }

        public override string jsDuplicate
        {
            get
            {
                return "S.components.calls.panel.duplicateCell";
            }
        }

        public override int defaultWidth
        {
            get
            {
                return 500;
            }
        }

        public override int defaultHeight
        {
            get
            {
                return 350;
            }
        }

        public override string defaultHeightType
        {
            get
            {
                return "px";
            }
        }

        public override void Load()
        {
            string[] panelData;
            if (isDropped == true)
            {
                //setup initial panel data
                dataField = "Panel,panel,";
                designField = "rows|a,150,0";
                LoadDataArrays();
            }

            //create the panel instances that belong to this component
            if(designField == "") { designField = "rows|a,150,0"; LoadDataArrays(); }
            for (int x = 0; x < data.Length; x++)
            {
                panelData = data[x].Split(',');
                AddPanel(panelData[0]);
            }
        }

        public void GetPanelList()
        {
            string[] panelData;
            if (myPanels.Count == 0)
            {
                //get list of panel instances if they weren't added yet
                for (int x = 0; x < data.Length; x++)
                {
                    panelData = data[x].Split(',');
                    myPanels.Add(S.Page.GetPanelByName(id + panelData[0].Replace(" ", "")));
                }
            }
        }

        public void AddPanel(string name, int index = -1)
        {
            //adds instance of a panel to the page
            Websilk.Panel newPanel = new Websilk.Panel(S);
            newPanel.name = id + name.Replace(" ", "");
            newPanel.id = "panel" + newPanel.name.Replace(" ", "");
            S.Page.AddPanel(newPanel);
            if (index == -1)
            {
                myPanels.Add(newPanel);
            }
            else
            {
                myPanels.Insert(index, newPanel);
            }

            //add panel view to list
            newPanel.AddPanelView();
        }

        public override string Render()
        {
            List<string> panels = new List<string>();
            //data = name,design,css|name,design,css|etc...
            //design = arrange-type|arrange-settings|...
            string[] arrange = design[1].Split(',');
            _arrange = arrange;

            enumArrangement arrangement = getArrangement();
            switch (arrangement)
            {
                case enumArrangement.grid:
                    //arrange-settings = width-type (fixed or responsive), fixed-width, 
                    //                   responsive-max-columns, responsive-min-width, 
                    //                   height-type (auto or fixed), fixed-height, 
                    //                   auto-height-mosaic, spacing
                    DivItem.Classes.Add("arrange-grid");
                    if(arrange[0] == "r")
                    {
                        DivItem.Classes.Add("columns" + arrange[2]);
                    }
                    break;

                case enumArrangement.rows:
                    //arrange-settings = height-type (auto or fixed), fixed-height, spacing
                    DivItem.Classes.Add("arrange-rows");
                    break;

                case enumArrangement.slideshow:
                    //arrange-settings = transition, easing-type, transition-time, auto-play, auto-play-delay
                    DivItem.Classes.Add("arrange-slideshow");
                    break;

                case enumArrangement.book:
                    //arrange-settings = paper-material (matte, laminant, textured, plain, ancient), starting-page (0=book cover, 1=page #1)
                    DivItem.Classes.Add("arrange-book");
                    break;
            }

            for (int x = 0; x < myPanels.Count; x++)
            {
                //render each panel
                panels.Add(RenderPanel(x));
            }

            DivItem.innerHTML = headHtml + string.Join("\n", panels.ToArray()) + footHtml;
            return base.Render();
        }

        public string RenderPanel(int index)
        {
            string[] panelData;
            string panelCss = "";
            Element.Panel elemPanel = null;

            string[] arrange = _arrange;
            if(arrange.Length == 0) { arrange = design[1].Split(','); }

            GetPanelList();

            //get panel CSS from design
            if (data.Length > index)
            {
                panelData = data[index].Split(',');
            }
            else
            {
                panelData = new string[] { "", "", "" };
            }

            if (panelData[1] != "")
            {
                //add CSS styling to panel inner div
                panelCss += ".inner" + myPanels[index].name + "{" + panelData[2] + "}\n";
            }

            //add skin to panel
            if (panelData[1] != "!" || elemPanel == null)
            {
                elemPanel = (Element.Panel)S.Elements.Load(ElementType.Panel, panelData[1]);
            }

            //add arrangement type to panel
            myPanels[index].arrangement = getArrangement();
            myPanels[index].arrange = arrange;
            elemPanel.Render(myPanels[index]);
            if (panelCss != "") { S.Page.RegisterCSS("panel" + id + "_" + index, panelCss); }
            return myPanels[index].Render();
        }

        private enumArrangement getArrangement()
        {
            if(_arrangment != enumArrangement.none) { return _arrangment; }
            enumArrangement arrangement = enumArrangement.grid;
            if (design.Length > 0)
            {
                //load arrangement from design settings
                switch (design[0])
                {
                    case "rows":
                        arrangement = enumArrangement.rows;
                        break;
                    case "slideshow":
                        arrangement = enumArrangement.slideshow;
                        break;
                    case "book":
                        arrangement = enumArrangement.book;
                        break;
                }
            }
            _arrangment = arrangement;
            return arrangement;
        }
    }
}
