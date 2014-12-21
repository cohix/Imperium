#Imperium Release Notes

>Starting with release train 0.3, I will be updating this document with release notes for each release.

##v0.3
* Added draft post support: prefix the filename with an underscore to set it as a draft; i.e. _Test.md. It will be ignored by the getPosts bot.
* Added support for the ~nextPrevLinks~ tag in post.html. Use it to get links to the next and previous post. 
    - First/last posts will get links to Home instead. 
    - The links have class = 'cell' so they can be put in a display: table div. 
* Protip: add class = 'container hundred table' to get a div that is full-width and acts as a table (requires imperium.css).