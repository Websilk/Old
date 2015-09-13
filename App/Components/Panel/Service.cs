using System.Linq;

namespace Websilk.Services.Components
{
    public class Panel : Service
    {

        public Panel(Core WebsilkCore, string[] paths) : base(WebsilkCore, paths)
        {
        }

        public Inject DuplicateCell(string id, string aboveId, int duplicate)
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();
            response.element = "#c" + id + " > div:last-child";
            response.inject = enumInjectTypes.after;

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            if(aboveId != "" && aboveId != "last")
            {
                response.element = "#" + aboveId;
                response.inject = enumInjectTypes.before;
            }

            //duplicate panel cell & all content inside of it
            ComponentView view = S.Page.GetComponentViewById(id);
            if (view != null)
            {
                //data = name,design,css|name,design,css|etc...
                string[] data = view.dataField.Split('|');
                if(duplicate < data.Length)
                {
                    string[] panelData = data[duplicate].Split(',');

                    //create new name for duplicated panel
                    string newName = panelData[0];
                    string[] nameParts = new string[] { };
                    string namePart = "";
                    int incr = 2;
                    nameParts = newName.Split(' ');
                    if(nameParts.Length > 1) { 
                        if (S.Util.Str.IsNumeric(nameParts[nameParts.Length - 1]) == true)
                        {
                            incr = int.Parse(nameParts[nameParts.Length - 1]) + 1;
                        }
                        if (nameParts.Length > 1)
                        {
                            namePart = string.Join(" ", nameParts.Take(nameParts.Length - 1).ToArray());
                        }
                        else { namePart = nameParts[0]; }
                    }
                    else { namePart = panelData[0]; }
                    newName = namePart + " " + incr.ToString();

                    //find incriment value for new name
                    while (view.dataField.IndexOf(newName + ',') >= 0)
                    {
                        incr += 1;
                        newName = namePart + " " + incr.ToString();
                    }

                    //reload panel instance
                    Websilk.Components.Panel panel = new Websilk.Components.Panel(S);
                    panel.LoadFromComponentView(view);
                    panel.LoadDataArrays();
                    panel.GetPanelList();

                    //add new panel cell instance to panel component
                    view.dataField += "|" + newName + "," + panelData[1] + "," + panelData[2];
                    panel.dataField = view.dataField;
                    panel.LoadDataArrays();
                    panel.AddPanel(newName);

                    //render panel cell instance
                    response.html = panel.RenderPanel(data.Length);

                }
            }

            SaveEnable(); //allow page to save
            response.js = CompileJs();
            return response;
        }
    }
}