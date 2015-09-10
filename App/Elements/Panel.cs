using System;
using System.Collections.Generic;

namespace Websilk.Element
{
    public class Panel : Element
    {
        public Panel(Core WebsilkCore, string path, string name = "") : base(WebsilkCore, path, name)
        {

        }

        public void Render(Websilk.Panel panel)
        {
            Data["content"] = "[content]";
            string p = scaffold.Render();
            int i = p.IndexOf("[content]");
            if(i >= 0)
            {
                panel.DesignHead = p.Substring(0, i);
                panel.DesignFoot = p.Substring(i + 9);
            }
            else
            {
                panel.DesignHead = "";
                panel.DesignFoot = "";
            }
        }
    }
}
