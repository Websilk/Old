using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Websilk
{
    public struct structViewStateInfo
    {
        public string id;
        public DateTime dateCreated;
        public DateTime dateModified;
    }

    public class ViewState
    {
        [IgnoreDataMember]
        private Core R;
        public Page Page;

        public void Load(Core WebsilkCore)
        {
            R = WebsilkCore;
            Page = R.Page;
        }
    }

    public class ViewStates
    {
        public List<structViewStateInfo> Views = new List<structViewStateInfo>();
    }
}