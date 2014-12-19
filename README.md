
#im·pe·ri·um
####/ˌimˈpirēəm/
#####noun
>def: absolute power

##NodeJS Content Management System

Imperium is a lightweight content management system that gives you **absolute power** over your content using plaintext files and markdown syntax. 

####Please Note:
This product is still in its early stages of development. The documentation is not nearly complete. The theming system is also not nearly complete. If you wish to help with documentation, please send me an email (connor at cohix dot ca). Feature requests can also be sent there, but please keep bug reports here on github. Most of all, please fork and develop, if you can!

##Features
    * Three commands to get Imperium running
    * Configurable using a single config.json file
    * Full MarkDown parsing and code highlighting
    * Flat file cms - posts are .md files in a single folder - Imperium will organize them and display them for you... top level pages are the same!
    * Themeable using html, css, and Imperium '~' syntax
    * Optional MongoDB cache for maximum performance
    * Minimal dependencies - install in < 10sec
    * Beautiful and responsive default theme

##Installation and Running
Seriously, it takes only 3 bash commands to get Imperium up and running:
```bash
git clone https://github.com/cohix/Imperium.git
npm install
node imperium.js (or forever start imperium.js)
```

##Configuration
Your Imperium instance is configured using a ```config.json``` file in the root of the Imperium directory. Here are the options.

* siteTitle
    - default: none
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
    - default: "Imperium Site"
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
    * The pages to be displayed in the nav bar.
    * Example: ["About", "Contact", "Resume", "Imperium"]
    * These will be converted to file names: i.e. "Buy Tickets" will be converted to "Buy_Tickets.md", so ensure you have a .md file in the /pages folder to match each page in the nav
