<img src = 'http://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/2000px-Node.js_logo.svg.png'> </img>
 
<br>

To start off my series of NodeJS posts, I want to start with one of the most popular libraries, ExpressJS. This library is so popular that it is almost considered its own product. You'll hear people talk about the MEAN stack, which is a short way of saying you use MongoDB, ExpressJS, AngularJS, and NodeJS as your back-to-front solution. As these tutorials progress I will make my way through this stack, with one difference. I am not an AngularJS developer, I work mainly on the back-end, but when I do front-end work, I opt for Twitter's Bootstrap framework. We'll talk more about the front end later, for now let's talk about NodeJS and ExpressJS

>NOTE: This tutorial assumes that you have NodeJS and NPM installed and configured properly. You should be familiar with basic terminal commands such as cd and mkdir. 

##What is ExpressJS?

>Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

That's about it, really. The blurb on the Express website says it best. Express is a library of APIs and functions that allow Node devs to quickly and easily create super powerful backends for their web and mobile apps. Today we're going to look at the basics of Express, and how to get a simple web app up and running. It shouldn't take more than 30 minutes or so.

##Let's dive right in!

The first thing we need to do is set up out package.json file. For those who don't know, JSON stands for **JavaScript Object Notation**, and it's a way for JavaScript objects to be stored on disk, or in a database. The syntax for JSON is very simple, but we'll save it for another post. You'll have to open your shell application (Terminal or iTerm on Mac, CMD, PowerShell, or similar on Windows, or Terminal on linux), and make your way to the directory your project will be in. I like to keep a folder called **Workspaces** in my Google Drive, and then a **Node** folder inside that. To do this, use the *cd* command to move around your filesystem until you find a good place. Run these few commands to make a Workspace, Node, and project folder.
```
mkdir Workspaces
cd Workspaces
mkdir Node
cd Node
mkdir ExpressTutorial
cd ExpressTutorial
```
Alright, now that we're set up for our project, we have to use a tool called NPM (Node Package Manager) to create an empty package.json file. You can create it manually, but the tool makes it much easier. Let's run the *init* command to start:
```
npm init
```
You can then follow the prompts to create a new node project. I usually just press enter continually until the wizard is over. For our purposes, the default settings are fine. Once the package.json file is ready, we can install the dependencies for our project. Let's run the following to install express and add it to our package.json file.
```
npm install express --save
```
And now with all that out of the way, let's get to the code! Open your text editor of choice (mine is Sublime Text), and create a new file inside your project folder called *server.js*. Open it up and let's write a few lines.
```
var express = require('express');
var fs = require('fs');

var app = express();

//routes go here

app.listen(3000);
```
Lets go through line by line. Lines 1 and 2 are the app's *require* statements. This essentially loads the *express* and *fs* libraries into the app for use in our code. I've explained what express is used for already, but you may be wondering what the fs library is. Fs is a built-in library for accessing the server's filesystem. This will be our quick intro to asynchronous callbacks. 

Line 4 is the creation of the express object. This object will contain the routes and functions of our Node app.

Line 8 tells our app to listen on port 3000. This simply means that to access the app from your browser, you would visit <ip address>:3000. When running your app locally, http://localhost:3000 will work perfectly.

##Routes

The concept of routes is an express idea which will shape the organization of your app. A route is a pathway into your app. For example you could have a route for the *homepage* of your app, one for the *about* page, and one for the *blog* page. This is a very simple example, but it will help introduce us to the concept of routes. Let's add the *homepage* route first.
```
var express = require('express');
var fs = require('fs');

var app = express();

app.get("/", function(req, res)
{
   res.send("This is the homepage");
});

app.listen(3000);
```
Congrats! You now have a fully working node app. Return to your terminal to get it running.
```
node server.js
```
You won't see anything in the console, but the server is silently listening for requests on port 3000. Open your browser and visit http://localhost:3000, and you should see the text we put into the response above. Let's look at this snippet:
```
app.get("/", function(req, res)
{
   res.send("This is the homepage");
});
```
Line 1 is the route definition. It essentially says "when we get a request on '/', execute this function". The function takes two parameters; a request object and a response object. These objects are generated by express, and we can use them to get information about the request, and generate a response to send back to the browser. 

Line 3 is the most basic form of a response. the *send* method of the res object sends a string back as a response. This is plaintext, no HTML, no JSON, just text. Let's spruce this up a bit. Replace the code snippet above with this one:
```
app.get("/", function(req, res)
{
   fs.readFile("index.html", function(err, data)
   {
       if(!err)
       {
           res.setHeader('content-type', 'text/html');
           res.end(data);
       }
       else throw err;
   });
});
```
Don't panic, It's a bit more code but it's fairly simple once you understand the asynchronous callback that fs uses. We simply called the *readFile* method from the fs library to read a file from the disk and return it's contents as an object. Line 3 grabs the contents of the index.html file we are about to create, and once the data has been loaded, returns it in an asynchronous callback as the *data* parameter. The *readFile* method also returns an *err* object, which we check on line 5 in case the file does not exist, or some other error occurs. Lines 5-8 are very simple: if there is no error (!err means "if *err* is false"), then set the content type to *text/html*, load the contents of the file into the response, and send it back to the browser. The *end* method is similar to the *send* method we saw earlier, except it can send data which is more complex than a string. Line 10 states that if the error is true, "throw" it, a.k.a. print the error to the console.

##The HTML

We need to write some quick HTML in order to have something to send back to the browser. Using your text editor, create a file called *index.html* and save it to the same directory as server.js. Normally we would put html and other assets in seperate folders, but for this example the root folder will do fine. Put the following in index.html
```
 <html>
     <head>
         <title> Express Rules! </title>
     </head>
     <body>
         <h1> This is the homepage </h1>
     </body>
 </html>
```
Save it and re-run your node app. To quit the instance you had already running, press ctrl+c (the universal interrupt command). run *node server.js* again, and reload your browser page. Other than the changed title in the browser tab, it should look more or less the same. The difference is that your app is now reading from the filesystem and serving real webpages instead of just text.

If at this point you are confused, go back through the steps we used to get here, and try fiddling with the different parts to see what happens. Try console.log(err). Try accessing some of the properties of the req object, like req.url or req.body. Try deleting index.html and read the error thrown, and try to understand it. Once you understand the code we've written thus far, we can continue.

Just below the homepage route, add the following snippet:
```
app.get("/blog", function(req, res)
{
   fs.readFile("blog.html", function(err, data)
   {
       if(!err)
       {
           res.setHeader('content-type', 'text/html');
           res.end(data);
       }
       else throw err;
   });
});

app.get("/about", function(req, res)
{
   fs.readFile("blog.html", function(err, data)
   {
       if(!err)
       {
           res.setHeader('content-type', 'text/html');
           res.end(data);
       }
       else throw err;
   });
});
```
We instantly have the code required for two more pages. Use the template of index.html to make blog.html and about.html. Try to add some other html tags like `<p>` and `<ul>`, or even `<img>` if you're feeling adventurous. Once they've been created, try accessing http://localhost:3000/about and http://localhost:3000/blog. You should see the html you made for those pages.

##Wrap-up

Well, that wasn't so hard was it? Try experimenting with routes. A cool trick is to use the **wildcard** character * to make a more complex route. For example, "/blog/\*" would encompass "/blog/post1", "/blog/post12", and anything else that starts with "/blog/". You can use the req.url property to figure out what page the user is trying to get, and write code to get the right file for them.

In the next post I'm going to talk about express in a bit more depth, and we're going to use a new library to make HTTP requests to another web API. If you have an API you would like to learn about, send me a message on twitter **@cohix**. You can also send me any other questions about this post, as well as any suggestions for my future tutorials. If you like this tutorial, send me a funny picture on twitter. I like pugs :)

Cheers
-CH








