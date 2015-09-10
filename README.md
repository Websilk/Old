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

The platform works (for the most part). Users can log into the dashboard, create new web pages, drag & drop photos, panels, & text onto the page, save pages, and upload photos.

Learn how the server pipeline works with this workflow graphic.

![Workflow graphic](https://lh3.googleusercontent.com/cTHiinVEzOstnCPfRbXIn_zAk3WVzRMVI4UrT5TCMAhiedp6anrrRoL3PXRiBje4rFfjAyySd_YI7kw=w1896-h875-rw)
