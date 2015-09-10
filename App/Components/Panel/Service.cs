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

            //add new panel cell instance to panel component


            SaveEnable(); //allow page to save
            response.js = CompileJs();
            return response;
        }
    }
}