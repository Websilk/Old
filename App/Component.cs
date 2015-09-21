using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Websilk
{

    public enum enumRmlNames
    {
        button = 0,
        comment = 1,
        grid = 2,
        menu = 3,
        photolist = 4,
        stackpanel = 5,
        textbox = 6,
        product = 7,
        list = 8,
        blogentry = 9
    }

    public enum enumComponentType
    {
        component = 0,
        panel = 1,
        child = 2
    }

    public class Component
    {
        [JsonIgnore]
        protected Core S;
        public string id = ""; //id of the component instance
        public int pageId; //the id of the instance of this component
        public int layerId; //layer this component belongs to
        public string panelId; //id of the panel this component belongs to
        public int index; //position index within the panel
        public enumComponentType type = 0;
        public string workfolder = "";

        //data stored about the component
        public string dataField = "";
        public string designField = "";
        public string positionField = "";
        public string cssField = "";
        public string[] data;
        public string[] design;
        public string[] position;
        public string[] css;

        public List<string> specialHash;

        public bool isDropped = false; //true if component was dropped on the page by the user
        public bool justLoaded = false; //true if the component was just loaded onto the page
        public bool rendered = false; //true only if already rendered on the page
        
        private string _header = "";
        private string _footer = "";
        
        [JsonIgnore]
        public Utility.DOM.Element DivItem;
        [JsonIgnore]
        protected Scaffold Scaffold;

        public Component(Core WebsilkCore)
        {
            S = WebsilkCore;
            LoadDataArrays();
            DivItem = new Utility.DOM.Element("div");
        }

        public virtual void Load()
        {
            //when the component is first initialized onto the page
        }

        public virtual string Render()
        {
            if(rendered == true) { return _header + DivItem.Render() + _footer; }
            string classes = "component id-" + id + " type-" + name.ToLower().Replace(" ", "").Replace("/", "-");
            DivItem.Classes.Insert(0,classes);
            
            DivItem.id = "c" + id;
            DivItem.Style["z-index"] = (index + 100).ToString();
            rendered = true;
            return _header + DivItem.Render() + _footer;

        }

        public virtual void LoadedNewPage()
        {
            //executed whenever a new page is loaded via AJAX, 
            //but only if the component is already loaded on the page
        }

        public virtual void DroppedComponent()
        {
            //executed whenever a component instance is dragged & dropped onto the page
        }

        public virtual void PageLoadComplete()
        {
            //executed after all components are loaded onto the page
        }

        public virtual void LoadProperties()
        {
            //executed when the user loads the properties window for this component
        }

        public virtual void SaveProperties()
        {
            //executed when the user saves the properties for this component
        }

        public virtual void SavePage()
        {
            //executed when a user who is editing the page saves the page
        }

        public virtual void DeleteComponent()
        {
            //executed when the user deletes the component from the page while in edit mode
        }

        public virtual void RemoveComponent()
        {
            //executed when Websilk loads a different page & removes this component from the page
        }

        public virtual string name
        {
            get { return ""; }
        }

        public virtual string app
        {
            get { return ""; }
        }

        public virtual string contentName
        {
            get { return ""; }
        }

        public virtual string jsDuplicate
        {
            //a custom javascript function to call when the
            //user clicks the component select duplicate button 
            //within the Page Editor
            get { return ""; }
        }

        public string innerHTML
        {
            get { return DivItem.innerHTML; }
            set { DivItem.innerHTML = value; }
        }

        public virtual int defaultWidth
        {
            get { return 200; }
        }

        /// <summary>
        /// acceptable values include "px", "%", and "win"
        /// </summary>
        public virtual string defaultWidthType
        {
            get { return "px"; }
        }

        public virtual int defaultHeight
        {
            get { return 200; }
        }

        /// <summary>
        /// acceptable values include "px", "auto", and "win"
        /// </summary>
        public virtual string defaultHeightType
        {
            get { return "auto"; }
        }

        public virtual int Weight
        {
            //determines how heavy this component is, meaning how much 
            //load the component will take on the server CPU, memory, 
            //and most importantly, SQL queries & the server hard drive.

            //total page weight should not exceed 100, so a typical page
            //should contain an average of 10 to 20 components at 1 to 5 weight each
            get { return 0; }
        }

        public virtual int instanceLimit
        {
            //total instances of this component allowed on the page
            get
            {
                return 0;
            }
        }

        public virtual bool showProperties
        {
            //if true, shows properties after the user drags & drops the component onto the page
            get { return false; }
        }

        public virtual void registerHash()
        {
            //registers all special hash commands with Websilk, only when the hash is being executed
        }

        public virtual void executeHash(string hash)
        {
            //executed if the hash changes and affects this specific component
        }

        public virtual void receiveCommand(string cmd, string value)
        {
            //execute a command sent from another component
        }

        public virtual object returnCommand(string cmd)
        {
            //execute a command sent from another component, 
            //then return a value back to the other component
            return null;
        }

        public string attributes(string key)
        {
            return DivItem.Attributes[key];
        }


        public void LoadDataArrays()
        {
            if (!string.IsNullOrEmpty(dataField))
            {
                data = dataField.Split('|');
            }
            if (!string.IsNullOrEmpty(designField))
            {
                design = designField.Split('|');
            }
            //if (!string.IsNullOrEmpty(positionField))
            //{
            //    position = positionField.Split('|');
            //}
            //if (!string.IsNullOrEmpty(cssField))
            //{
            //    css = cssField.Split('|');
            //}
        }

        public void header(string htm)
        {
            _header = htm;
        }

        public void footer(string htm)
        {
            _footer = htm;
        }

        public ComponentView GetComponentView()
        {
            ComponentView cv = new ComponentView();
            cv.pageId = pageId;
            cv.id = id;
            cv.name = name;
            cv.index = index;
            cv.type = type;
            cv.workfolder = workfolder;
            cv.layerId = layerId;
            cv.panelId = panelId;
            cv.dataField = dataField;
            cv.designField = designField;
            cv.positionField = positionField;
            cv.cssField = cssField;
            cv.specialHash = specialHash;

            return cv;
        }

        public void LoadFromComponentView(ComponentView cView)
        {
            id = cView.id;
            pageId = cView.pageId;
            layerId = cView.layerId;
            index = cView.index;
            panelId = cView.panelId;
            type = cView.type;
            workfolder = cView.workfolder;

            dataField = cView.dataField;
            designField = cView.designField;
            positionField = cView.positionField;
            cssField = cView.cssField;

            specialHash = cView.specialHash;
        }

    }

    public class ComponentView
    {
        public string id = ""; //id of the component instance
        public int pageId; //the id of the instance of this component
        public int layerId; //layer this component belongs to
        public int index;//position index within the panel
        public string panelId; //id of the panel this component belongs to
        public enumComponentType type = 0;
        public string workfolder = "";

        
        //data stored about the component
        public string dataField = "";
        public string designField = "";
        public string positionField = "";
        public string cssField = "";

        public string name = "";

        public List<string> specialHash;

    }

    public class ComponentProperties
    {

        [JsonIgnore]
        protected Core S;
        [JsonIgnore]
        protected string innerHTML = "";
        [JsonIgnore]
        protected Scaffold scaffold;
        [JsonIgnore]
        protected ComponentView _component;

        public string id = "";
        public string section = "";

        public ComponentView Component
        {
            get
            {
                if (_component != null)
                    return _component;
                _component = S.Page.GetComponentViewById(id);
                return _component;
            }
        }

        public virtual int Width
        {
            get { return 300; }
        }

        public ComponentProperties(Core WebsilkCore, ComponentView c, string Section)
        {
            S = WebsilkCore;
            _component = c;
            id = Component.id;
            section = Section;
            scaffold = new Scaffold(S, "/app/components/" + Component.name.Replace(" ", "/") + "/properties.html", "");
        }

        public string Render()
        {

            return scaffold.Render();
        }

        public Dictionary<string, string> Data
        {
            get
            {
                return scaffold.Data;
            }
        }

    }

    public class ComponentQuickMenu
    {


        protected Core S;
        public virtual int Width
        {
            get { return 100; }
        }

        public void InitMenu(Core WebsilkCore)
        {
            S = WebsilkCore;
        }

        /// <summary>
        /// Use to execute code when the menu first loads
        /// </summary>
        /// <remarks></remarks>

        public virtual void LoadMenu(List<string> data = null, string dataType = "")
        {
        }
    }

}

