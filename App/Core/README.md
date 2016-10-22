# Websilk
A powerful web development platform built with ASP.net Core

### The App/Core Folder
This folder is reserved for all the core features Websilk requires to maintain a user's session, cache objects on the server, access an SQL database, and render the various components & applications on a web page.

#### Core.cs
Nearly every class within Websilk has access to an instance to `Websilk.Core` as a global variable named `S`, where the following classes are accessable: `S.Server`, `S.Session`, `S.Page`, `S.Sql`, `S.ViewState`, `S.User`, `S.Util`, `S.Context`, `S.Request`, `S.Response`, `S.App`, and `S.WebService`. 

*NOTE: If executing an initial page request, `S.App` is accessable, but if executing a Web API call, `S.WebService` is accessable instead.*

#### Server.cs
This class is initialized when the Kestrel web server first loads and `Startup.cs` begins listening to the asynchronous `Run()` task. Every page request & Web API call will have access to the exact same instance of the Server class, where many different objects & files will be cached to speed up page load time. Also, the Server class can tell you where on your local hard drive your web application is running from by calling `S.Server.MapPath('/my/path')`

#### Page.cs
This class is responsible for loading the contents of a web page by gathering page information from the database, opening a corresponding `page.xml` file, then loading and rendering components onto the web page.

#### Service.cs
A base class used to handle various types of Web API calls. 

The `PageRequest` class sends a JSON array of components to render onto a web page that is already loaded in the web browser. 

The `Inject` class will load raw HTML into a specified DOM element onto a web page that is already loaded in the web browser.

The `WebRequest` class will simply return raw text in a specified content type, such as 'text/html'.

*NOTE: The Form property is a Dictionary of key/value pairs that were sent with the request POST. Also, the Files property is a collection of files (if any) that were uploaded with the `multipart/form-data` request POST.

#### Scaffold.cs
A string parsing class that essentially replaces mustache variables, such as `{{content}}` with data. It can also show or hide blocks of content, such as `{{has-button}}<div>My Button</div>{{/has-button}}`. It is mainly used to load & parse HTML template files. 

#### Sql.cs
One database class to rule them all. This class is used to connect to an Sql database, execute Sql queries and provide a simple an flexible way to access the rows of data returned from Sql queries.

#### User.cs
All the functionality for managing the current user, such as logging in & out of their account and accessing their security clearance for various websites & dashboard features.