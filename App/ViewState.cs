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
        private Core S;
        public Page Page;

        public void Load(Core WebsilkCore)
        {
            S = WebsilkCore;
            Page = S.Page;
        }
    }

    public class ViewStates
    {
        public List<structViewStateInfo> Views = new List<structViewStateInfo>();
    }
}