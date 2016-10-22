# Websilk
A powerful web development platform built with ASP.net Core

### The App Folder
All of the core C# namespaces for Websilk can be found here within the App folder. Learn how Websilk handles page requests & Web API calls, what components & applications are, and how the dashboard is rendered.

#### Initial Page Request
Websilk runs on the Kestrel web server, which starts an asyncronous task within `/Startup.cs`, listening for incoming page requests. When a user first loads a web page from their web browser, the async task creates a new instance of the `Websilk.Pipeline.App` class, which in turn initializes a new instance of `Websilk.Page` that loads the requested page from the database and renders the contents of the page as HTML. The web browser finally (20 ms later) loads the web page along with `/js/platform.js` and a few CSS files.

#### Web API calls for Page Requests
When a user clicks on an anchor link and is redirected to the next web page, the web browser reloads Javascript, CSS, & image resources. Websilk overrides the anchor link functionality and executes a Web API call via AJAX instead, masks the URL in the user's address bar using a Javascript History API, and replaces part of the web page with new content. The AJAX request sends a POST to the url */App/Url*, which accesses a new instance of the `Websilk.Pipeline.WebService` C# class, and the page request tries to match the POST parameter *url* to a page path in the database.

For example, clicking an anchor link for */About/Team* will attempt to load a web page called *Team* located within the page hierarchy for the *About* web page.

#### Web API calls for everything else
Making an AJAX call via the Javascript function `S.ajax.post` will access a new instance of the `Websilk.Pipeline.WebService` C# class and execute a `Websilk.Service` class method based on the AJAX url. For example, calling `S.ajax.post('/Dashboard/Pages/PageSettings', {pageId:105})` will execute the C# method `PageSettings(int pageId)` within the class `Websilk.Service.Dashboard.Pages` and return an HTML form back to Javascript, populated with all the settings for Page ID *105*. 