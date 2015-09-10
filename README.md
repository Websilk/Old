# Websilk
A powerful web development platform for Windows, Linux, &amp; MacOSX, built with Microsoft ASP.net 5 vNext.

### ASP.net 5 & DNX
Microsoft has released ASP.net 5 vNext as an open source project on GitHub. This new framework can run across multiple platforms, natively on Windows, including Linux & Mac OSX with the help of Mono, in Docker containers, on Azure, and pretty much everywhere.

With ASP.net 5 vNext, you will be able to deploy a new instance of the Websilk platform from the operating system or cloud of your choice, all within minutes.

Learn more about ASP.net 5 vNext at www.github.com/aspnet/home

## Installation for Windows
### Prerequisites
1. Visual Studio 2015
2. SQL Server 2012 or higher
3. ASP.net Core 5: https://github.com/aspnet/Home

### Setup Project
1. Download, clone, or fork project from the github repository.
2. make sure DNVM for ASP.net vNext is using the correct the runtime. execute command 'dnvm list' to see which runtime is active. The active runtime should be coreclr, and architecture should be x64. If not, run command: `dnvm install latest -r coreclr -arch x64`. You may need to install specifically 1.0.0-beta5 x64 coreclr instead.
3. Execute `dnu restore` within the project folder.
4. Load project from `/Sql/SqlServer/` using Visual Studio 2015. We're going to install a database into your local Microsoft SQL Server 2012 installation.
5. Publish project (right-click project in Solution Explorer). In publish window, click `Load Profile` button, select `SqlServer.publish.xml` from project folder. Then, click `Edit...` button for Target database connection. Change the Server name to the named-pipe of your installation of SQL Server 2012, then save. Finally, click `Publish` button.
6. Open Websilk project & press play button for `kestrel`, and open your web browser to `http://localhost:5000/`.
7. Log into your dashboard from `http://localhost:5000/#dashboard`, using email `admin@localhost` and password `development`.



## Installation for Vagrant + Mono + ASP.net vNext
Websilk is (almost) running on Linux using Oracle Virtualbox within Windows 7. At the moment, `dnu restore` works, and so does `dnx . kestrel`, but a database has not been developed for Linux just yet. I've decided to use PostgreSQL. I'll keep you updated when I get Websilk working on Linux. So far, the project runs purely on DNX Core 5, which means Websilk should theoretically work on Linux right away once the database is setup.

### Prerequisites
1. Vagrant http://docs.vagrantup.com/v2/getting-started/
2. Oracle Virtualbox https://www.virtualbox.org/
3. Git GUI https://git-scm.com/download/win

### Git clone Websilk
1. Using Git bash, clone the websilk repository, `git clone https://github.com/Websilk/Home.git`

### Setup Vagrant
1. Create folder for project, then download, clone, or fork Vagrant repository for Websilk `https://github.com/Websilk/Vagrant`
2. from Vagrant project folder, execute command `vagrant up`, which will provision a new Virtualbox machine.
3. Wait for Linux to boot up, then execute command `vagrant ssh` to log into Linux (Ubuntu/Trusty64)
4. execute command `sudo apt-get install libunwind8`
5. Fix Nuget's default feed URL, execute commands `cd ~/.dnx/dnvm` and `sudo pico dnvm.sh`, then replace the following line in the config file

    _DNVM_DEFAULT_FEED="https://www.myget.org/F/aspnetvnext/api/v2"
    
6. Install ASP.net vNext for Linux https://github.com/aspnet/Home/blob/dev/GettingStartedDeb.md
7. Setup active DNVM installation, execute commands `dnvm install latest -a websilk -arch x64 -r coreclr` and `dnvm use websilk`.
8. Restore the ASP.net vNext dependencies for Websilk, execute commands `cd /var/www/websilk` and `dnu restore`.
9. Start the Kestrel web server, `dnx . kestrel`.
10. Open your web browser in Windows and navigate to `http://192.168.7.7` to view the home page of Websilk.
11. Navigate to `http://192.168.7.7/#dashboard` and login with email `admin@localhost` and password `development` to view your dashboard.
 
***

###Current State of the Websilk Platform

The screenshot above is the current Websilk `Page Editor` (built in VS 2013 with jQuery & ASMX web services), displaying the `Inline Text Editor` wrapped around a group of text on a web page.

The live version @ www.websilk.com was built using .net AJAX & Update Panels, which was a failed experiment. 70% of version 1 (ASP.net 4.0 VS 2010) functionality has been ported into version 2 (ASP.net 4.5 VS 2013 web services), and so I am porting version 2 to ASP.net 5 vNext for Visual Studio 2015 RC. 

This repo contains the cross-platform version of Websilk using ASP.net 5 vNext, and contains its own web server pipeline, replacing the traditional IIS pipeline. Startup.cs is called by Microsoft's Kestrel web server, starts listening for requests, and sends requests down a simple pipeline.

The current version of Websilk has separated client-side functionality from server-side completely, so you could theoretically port the C# code to Node.js, Perl, or Erlang. 

Learn how the server pipeline works with this workflow graphic.

![Workflow graphic](https://lh4.googleusercontent.com/JBySScj0LvQHsgQj65SZEztywuocQJk8kLofWgz_q5Z06hgGHu9h48pIgD2P0MQgPPasggq6=w1896-h875-rw)

# Capabilities

### Drag & Drop Content
 * Use `components` such as Text, Photos, Videos, Menus, Panels, Comments, Music, Lists, Buttons, Maps, & Rating (e.g. 5 star rating) to build your web pages with.
 * Drag & drop `components` directly onto your web pages from a simple `page editor` toolbar that loads above the web page.

### Dashboard
 * Manage all websites from a `dashboard`, which can be displayed in fullscreen-mode, or as a small drop-down menu within the `page editor` for quick access while creating content on your web pages.
 * Manage a heirarchy of web pages just like you would a file system.
 * Upload & organize photos into folders to use on your web pages. 
 * Develop & install `applications` to extend the funcationality of your website.
 
### Mirrored Content 
 * Share `layers` of content (a set of components) across multiple web pages, such as the header & footer of your website.

### Responsive Grids & Slideshows
Use a powerful `Panel` component, capable of handling content in many structured & responsive ways. Simply drag & drop a `Panel` component onto the page, then drag & drop components into the Panel's `cell` to start. Add a background color or image to the cell. Add more `cells` to your Panel, then drag & drop more components into those cells. Now you can organize the Panel cells into a `grid` of columns & rows. You can also make the grid act like a pinterest board, where each column is independantly stacked. 
Also, the Panel component can act like a `slideshow` instead of a grid, displaying each `cell` as a slide within the slideshow. 

 * A powerful `List` component. Create an HTML template for a `list item`, then import data into your List component like a spreadsheet. For example, the data could be a list of products (name, description, price). For each row or product in the speadsheet, the List component will generate a `list item` from the HTML template, replacing variables in the template with your data. Now you have a pretty list of products on your web page. You can organize your `list items` just like Panel component `cells`, as a grid with rows & columns, a stacked grid, or slideshow.

### Page Templates
 * Use Page Templates to create new web pages that come bundled with an interface when generated. For example, whenever you'd like to create a new entry for your blog, Websilk will duplicate the `page template` for the `blog` page to create a new `sub-page` for your blog entry. When you open the new sub-page, you'll see that it looks exactly like the `page template`, so you can quickly start writing content for the new blog entry instead of spending time setting up a new web page.

 * Data templates. Just like page templates, except instead of duplicating a page template for your new `sub-page`, the `page template` loads inside of the `sub-page`. Instead of adding new content to the `sub-page`, you can only edit what is already there. All of the components on the web page are managed by the `page template` only, which you can edit outside of your `sub-pages`. If you move or alter a component within the `page template`, it will affect all `sub-pages` that load content from the `page-template`. The `sub-page simply` overrides any changes to the content, such as text changes, photos, button links, or videos.
