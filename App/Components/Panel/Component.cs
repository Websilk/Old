using System.Collections.Generic;

namespace Websilk.Components
{
    public class Panel : Component
    {
        protected List<Websilk.Panel> myPanels = new List<Websilk.Panel>();

        public string headHtml = "";
        public string footHtml = "";

        public Panel(Core WebsilkCore) : base(WebsilkCore)
        {
            
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
                return "S.components.calls.duplicatePanelCell";
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
                data = new string[] { dataField };
                panelData = dataField.Split(',');
            }

            //create the panel instances that belong to this component
            for (int x = 0; x < data.Length; x++)
            {
                panelData = data[x].Split(',');
                Websilk.Panel newPanel = new Websilk.Panel(S);
                newPanel.Name = id + panelData[0].Replace(" ","");
                newPanel.id = "panel" + newPanel.Name.Replace(" ", "");
                S.Page.AddPanel(newPanel);
                myPanels.Add(newPanel);

                //add panel view to list
                newPanel.AddPanelView();
            }
        }

        public override string Render()
        {
            List<string> panels = new List<string>();
            //data = name,design,css|name,design,css|etc...
            string[] panelData;
            string panelCss = "";
            string panelDesign = "!";
            Element.Panel elemPanel = null;

            if(myPanels.Count == 0)
            {
                //get list of panel instances
                for (int x = 0; x < data.Length; x++)
                {
                    panelData = data[x].Split(',');
                    myPanels.Add(S.Page.GetPanelByName(id + panelData[0].Replace(" ", "")));
                }
            }
            for (int x = 0; x < myPanels.Count; x++)
            {
                //get panel CSS from design
                if (data.Length > x)
                {
                    panelData = data[x].Split(',');
                }
                else
                {
                    panelData = new string[] { "", "", "" };
                }
                if(panelData[1] != "") {
                    //add CSS styling to panel inner div
                    panelCss += ".inner" + myPanels[x].Name + "{" + panelData[2] + "}\n";
                }
                    
                //add skin to panel
                if(panelDesign != panelData[1] || elemPanel == null)
                {
                    elemPanel = (Element.Panel)S.Elements.Load(ElementType.Panel, panelData[1]);
                }
                elemPanel.Render(myPanels[x]);

                //render each panel
                panels.Add(myPanels[x].Render());
            }
            if(panelCss != "") { S.Page.RegisterCSS("panel" + id, panelCss); }
            DivItem.innerHTML = headHtml + string.Join("\n", panels.ToArray()) + footHtml;
            return base.Render();
        }
    }
}
