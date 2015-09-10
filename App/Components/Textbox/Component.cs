using System;
using System.Collections.Generic;

namespace Websilk.Components
{
    public class Textbox : Component
    {
        public Textbox(Core WebsilkCore) : base(WebsilkCore)
        {

        }

        public override string name
        {
            get
            {
                return "Textbox";
            }
        }

        public override string contentName
        {
            get { return "Textbox"; }
        }

        public override void Load()
        {
            base.Load();

            if (dataField == "")
            {
                dataField = "<div>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Etiam cursus eros eget lacus. Suspendisse ante est, lobortis vitae, congue et, bibendum ut, tortor. Sed ut urna. Integer quis lorem non ligula semper ultricies.</div>";
            }

            if(S.Page.isEditable == false)
            {
                innerHTML = dataField;
            }
            else
            {
                innerHTML = "<div class=\"textedit\">" + dataField + "</div>";
            }
            
        }
    }
}
