using System;
using System.Xml;

namespace Websilk.Components
{
    public class Menu : Component
    {
        public Menu(Core WebsilkCore) : base(WebsilkCore)
        {
            
        }

        public override string Render()
        {
            LoadMenu();
            return base.Render();
        }

        private void LoadMenu(int selectedIndex = -1, string reloadItem = "", int reloadOldIndex = 0, string reloadOldItem = "")
        {
            

        }

    }
}
