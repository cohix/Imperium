#Imperium Theme System
A theme in Imperium is organized in a logical structure of **pages**, **containers** and **fragements**. Pages are comprised of containers, and containers hold fragments. 

##Overview
The directory structure for an Imperium theme is as follows:
```
theme/
    -index.html
    -head.html
    -page.html
    -post.html
    -cont/
        -header.html
        -footer.html
        -sidebar.html
        -banner.html
    -frag/
        -headerLink.html
        -postCell.html
    -styles/
        -all CSS files
    -scripts/
        -all JS files
```

##Pages
**Pages** define the structure of an Imperium page. Page template files exist in the root of the ```theme/``` directory. There are 3 page types, and 1 special file we need to make an Imperium theme work:

* index.html
    - Defines the structure for the main page and the main post list. This file is rendered when you access '/', or the root page.
    - The post list will be rendered by Imperium, and inserted into the page using the ~postList~ tag.

* page.html
    - Defines the structure of a top-level page. This file is rendered when you access something like cohix.ca/About or cohix.ca/Contact 
    - The .md file for the page you are requesting will be rendered and inserted into the page.html template using the ~pageContent~ tag.

* post.html
    - Defines the structure of a post. This file is rendered when you access something like cohix.ca/posts/Blog_Overhaul or cohix.ca/posts/Intro_to_Express 
    - The .md file for the post you are requesting will be rendered and inserted into the post.html template using the ~postContent~ tag.

* head.html
    - Contains the <head> tag that will be inserted into the top of every file Imperium serves. This should include references to any stylesheets required. It can also contain <title> and <meta> tags. The <title> tag can be populated dynamically by Imperium using the ~pageTitle~ tag. 

##Containers

##Fragments
Fragments are small snippets of code that are meant to be taken by the Imperium theme engine, modified, and placed into containers many times. An example of a fragment is postCell.html, which provides the template for a post displyed in the main post list.