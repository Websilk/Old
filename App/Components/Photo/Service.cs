namespace Websilk.Services.Components
{
    public class Photo : Service
    {

        public Photo(Core WebsilkCore, string[] paths) : base(WebsilkCore, paths)
        {
        }

        public Inject UpdatePhoto(string id, string photo, int type)
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();
            response.element = "#c" + id;
            response.inject = enumInjectTypes.replace;
            string js = "";

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            
            ComponentView view = S.Page.GetComponentViewById(id);
            if(view != null)
            {
                //update component data field
                //file|hover-file|orig-width|orig-height|url|new-window|window-name|alt-text|speed (0 - 8)
                //use-bg|bg-size|bg-position|use-tile|use-parallax|parallax-speed|parallax-offset (9 - 15)
                string[] data = new string[15];
                string folder = "";
                if(view.dataField != "")
                {
                    data = view.dataField.Split('|');
                }

                //get photo info
                SqlClasses.Dashboard sqlDash = new SqlClasses.Dashboard(S);
                SqlReader reader = sqlDash.GetPhoto(S.Page.websiteId, photo);
                if(reader.Rows.Count > 0)
                {
                    reader.Read();
                    data[2] = reader.GetInt("width").ToString();
                    data[3] = reader.GetInt("height").ToString();
                    folder = reader.Get("foldername");
                    if(folder != "") { folder += "/"; }
                }

                if (type == 1)
                {
                    //default photo
                    data[0] = folder + photo;
                    js += "$('#propsPreviewPhoto > img')[0].src = '/content/websites/" + S.Page.websiteId + "/photos/" + folder + "tiny" + photo + "';";

                    //update component position settings to use new photo width & height
                    string[] position = view.positionField.Split('|');
                    for(var i = 0; i < position.Length; i++)
                    {
                        if(position[i] != "")
                        {
                            string[] pos = position[i].Split(',');
                            pos[6] = data[2];
                            pos[7] = "px";
                            pos[8] = data[3];
                            pos[9] = "auto";
                            position[i] = string.Join(",", pos);
                        }
                    }
                    view.positionField = string.Join("|", position);
                    js += "S.components.cache['c" + view.id + "'].position = ['" + position[0] + "','" + position[1] + "','" + position[2] + "','" + position[3] + "','" + position[4] + "'];" +
                          "S.editor.components.loadPositionCss($S('c" + view.id + "'));";
                }
                else
                {
                    //hover photo
                    data[1] = folder + photo;
                    js += "$('.winProperties .remove-hover-photo').show();";
                }

                if(js != "") { S.Page.RegisterJS("changephoto", js); }

                //re-render component
                view.dataField = string.Join("|", data);
                Component comp = S.Page.LoadComponentFromView(view);
                comp.Render();
                //return inner HTML instead of fully rendered component
                response.html = comp.DivItem.innerHTML;
            }
            else
            {
                lostInject();
            }
            SaveEnable(); //allow page to save
            response.js = CompileJs();
            return response;
        }

        public Inject SaveProperties(string id, string url, string alt, string target, string win)
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();
            response.element = "#c" + id;
            response.inject = enumInjectTypes.replace;

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }


            ComponentView view = S.Page.GetComponentViewById(id);
            if (view != null)
            {
                //update component data field
                //file|hover-file|orig-width|orig-height|url|new-window|window-name|alt-text|speed (0 - 8)
                //use-bg|bg-size|bg-position|use-tile|use-parallax|parallax-speed|parallax-offset (9 - 15)
                string[] data = new string[15];
                if (view.dataField != "")
                {
                    data = view.dataField.Split('|');
                }
                data[4] = S.Util.Str.CleanInput(url);
                if(target != "") { data[5] = "1"; }
                else { data[5] = ""; }
                data[6] = S.Util.Str.CleanInput(win);
                data[7] = S.Util.Str.CleanInput(alt);

                //re-render component
                view.dataField = string.Join("|", data);
                Component comp = S.Page.LoadComponentFromView(view);
                comp.Render();
                //return inner HTML instead of fully rendered component
                response.html = comp.DivItem.innerHTML;
            }
            else
            {
                lostInject();
            }
            SaveEnable(); //allow page to save
            response.js = CompileJs();
            return response;
        }

        public Inject RemoveHover(string id)
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();
            response.element = "#c" + id;
            response.inject = enumInjectTypes.replace;

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }


            ComponentView view = S.Page.GetComponentViewById(id);
            if (view != null)
            {
                //update component data field
                //file|hover-file|orig-width|orig-height|url|new-window|window-name|alt-text|speed (0 - 8)
                //use-bg|bg-size|bg-position|use-tile|use-parallax|parallax-speed|parallax-offset (9 - 15)
                string[] data = new string[15];
                if (view.dataField != "")
                {
                    data = view.dataField.Split('|');
                }
                data[1] = "";

                //re-render component
                view.dataField = string.Join("|", data);
                Component comp = S.Page.LoadComponentFromView(view);
                comp.Render();
                //return inner HTML instead of fully rendered component
                response.html = comp.DivItem.innerHTML;
            }
            else
            {
                lostInject();
            }
            SaveEnable(); //allow page to save
            response.js = CompileJs();
            return response;
        }
    }
}