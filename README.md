
#im·pe·ri·um
####/ˌimˈpirēəm/
#####noun
>def: absolute power

##NodeJS Content Management System

Imperium is a lightweight content management system that gives you **absolute power** over your content using plaintext files and markdown syntax. [My website](http://beta.cohix.ca) is the official demo site for Imperium and its default theme. Imperium is offered under the MIT licence, which you can read in Imperium/docs/licence.md

####Please Note:
This product is still in its early stages of development. The documentation is not nearly complete. The theming system is also not nearly complete. If you wish to help with documentation, please send me an email (connor at cohix dot ca). Feature requests can also be sent there, but please keep bug reports here on github. Most of all, please fork and develop, if you can!

##Features
    * Three commands to get Imperium running
    * Configurable using a single config.json file
    * Full MarkDown parsing and code highlighting
    * Flat file cms - posts are .md files in a single folder - Imperium will organize them and display them for you... top level pages are the same!
    * Themeable using html, css, and Imperium '~' syntax
    * Optional MongoDB cache for maximum performance (Coming Soon!)
    * Minimal dependencies - install in < 10sec
    * Beautiful and (soon to be) responsive default theme
    * Included barebones CSS framework (theme/styles/imperium.css) for HTML engine integration

##Installation and Running
Seriously, it takes only 3 bash commands to get Imperium up and running:
```bash
git clone https://github.com/cohix/Imperium.git
npm install (from the /src directory)
node imperium.js (or forever start imperium.js) [also from the /src directory]
```

##Usage
To use Imperium, first go through the configuration section below and get your ```config.json``` file exactly how you want it. Make sure you restart Imperium to load the changes. Afterwards, go to the ```posts ``` and ```pages``` folder to replace the default files with your own content. Make sure the file names have the ```Title_of_Page_or_Post.md``` format. After that, you can start exploring the ```theme``` folder and start tweaking the look and feel of the site. The CSS for the syntax highlighting is ```theme/styles/code.css```. You can swap this one out for any of the ones found in the [highlight.js github src](https://github.com/isagalaev/highlight.js/tree/master/src/styles). Just ensure it is still named ```code.css```.

##Configuration
Your Imperium instance is configured using a ```config.json``` file in the root Imperium directory. Here are the options.

* siteTitle
    - default: "Imperium Site"
    - The title of the site. Can be inserted into the theme using ~siteTitle~

* useHeader
    - default: true
    - Determines if the site will display the header (nav) bar

* homeLinkColor 
    - default: red
    - CSS class added to the home link element ('red' is an Imperium custom class)

* headerLinkColor 
    - default: blue
    - CSS class added to the home link element ('blue' is an Imperium custom class)

* homeLink 
    - default: Imperium
    - Text to be used for the home link

* useFooter
    - default: true
    - Determines if the site will display the footer

* footerBlurb
    - default: "Site Powered by <a href='http://github.com/cohix/imperium'>Imperium</a>"
    - This field accepts and HTML string
    - Determines the text to display in the footer div
    - Can be inserted into theme using ~footerBlurb~

* useSidebar
    - default: false
    - Determines if the site will use the sidebar

* useBanner
    - default: true
    - Determines if the site will display the banner. The banner displays a large block with the current page's title.

* bannerAboveNav
    - default: false
    - The HTML engine will put the banner below the nav bar by default, but you can choose to put it above the nav.

* pageOrder (array) 
    - The pages to be displayed in the nav bar.
    - Example: ["About", "Contact", "Resume", "Imperium"]
    - These will be converted to file names: i.e. "Buy Tickets" will be converted to "Buy_Tickets.md", so ensure you have a .md file in the /pages folder to match each page in the nav

* serverPort
    - default: 80
    - Port to run the server on. Must be an integer.