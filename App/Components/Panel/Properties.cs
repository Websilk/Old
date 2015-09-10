
namespace Websilk.Components.Properties
{
    public class Panel : ComponentProperties
    {
        public override int Width
        {
            get
            {
                return 450;
            }
        }

        public Panel(Core WebsilkCore, ComponentView c) : base(WebsilkCore, c)
        {
            //scaffold.Setup(new string[] { "helpicon-hover", "helpicon-link", "helpicon-alt", "helpicon-window" });
            //scaffold.Data["helpicon-hover"] = "";
            //scaffold.Data["helpicon-link"] = "";
            //scaffold.Data["helpicon-alt"] = "";
            //scaffold.Data["helpicon-window"] = "";
        }

    }
}
