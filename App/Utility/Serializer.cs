using System;
using Newtonsoft.Json;

namespace Websilk.Utility
{
    public class Serializer
    {
        private Core S;

        public Serializer(Core WebsilkCore)
        {
            S = WebsilkCore;
        }

        public object ReadObject(string str, Type objType)
        {
            return JsonConvert.DeserializeObject(str, objType, new JsonSerializerSettings() { TypeNameHandling = TypeNameHandling.Objects });
        }

        public byte[] WriteObject(object obj)
        {
            return S.Util.Str.GetBytes(JsonConvert.SerializeObject(obj));
        }

        public string WriteObjectAsString(object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }
    }
}
