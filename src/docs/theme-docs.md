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

##Containers

##Fragments
Fragments are small snippets of code that are meant to be taken by the Imperium theme engine, modified, and placed into containers many times. An example of a fragment is postContainer.html, which provides the template for a post displyed in the main post list.
