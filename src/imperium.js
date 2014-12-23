
//////////////////////
//Require Statements//
//////////////////////

var express = require('express');
var fs = require('fs');
// var mdb = require('mongodb');
var morgan = require('morgan');
var colors = require('colors');
var validator = require('validator');
var favicon = require('serve-favicon');

var bots = require('./lib/bots.js');
var generator = require('./lib/generator.js');

/////////////////////
//Configure Express//
/////////////////////
var app = express();

app.use(favicon('./favicon.ico')); // default is an "Imperium <3 U" favicon

app.use(morgan('dev'));


//////////////////////
//NCMS Configuration//
//////////////////////

var config = {};

bots.loadConfigFile(function(configJson)
{
	if(configJson['config'] == false)
	{
		console.log("\n\n### NCMS requires a config.json file... please create one ###\n\n".red);
		process.exit(1);
	}

	else
	{
		console.log("\n\n### Config File Loaded Successfully ###".magenta);
		config = configJson;

		generator.loadConfigIntoGenerator(config);
		listen(config['serverPort']);
	}
});


//////////
//Routes//
//////////

app.get('/', function(req, res)
{
	//Generate homepage

	generator.frontPage(0, function(html)
	{
		res.setHeader('Content-Type', 'text/html');

		res.send(html);
	});
});

app.get('/posts/*', function(req, res)
{
	//find and display post here

	generator.post(req.url.substring(7), function(page)
	{
		res.setHeader('Content-Type', 'text/html');

		res.end(page)
	});
});

app.get('/theme/styles/*', function(req, res)
{
	fs.readFile('..' + req.url, function(err, data)
	{
		if(!err)
		{
			res.setHeader('Content-Type', 'text/css');

			res.end(data);
		}
		else
		{
			res.send("404: File not found");
		}
	});
});

app.get('/theme/scripts/*', function(req, res)
{
	fs.readFile('..' + req.url, function(err, data)
	{
		if(!err)
		{
			res.setHeader('Content-Type', 'text/javascript');

			res.end(data);
		}
		else
		{
			res.send("404: File not found");
		}
	});
});

app.get('/page/*', function(req, res)
{
	var page = req.url.substring(6);

	if(validator.isInt(page))
	{
		var pageNum = parseInt(page);

		generator.frontPage(pageNum-1, function(html)
		{
			res.setHeader('Content-Type', 'text/html');

			res.end(html)
		});
	}
	else
	{
		generator.frontPage(-1, function(html)
		{
			res.setHeader('Content-Type', 'text/html');

			res.end(html)
		});
	}
})

app.get("/*", function(req, res)
{
	//generate top-level page here
	var page = req.url.substring(1);

	generator.TLPage(page, function(html)
	{
		res.setHeader('Content-Type', 'text/html');

		res.end(html);
	});

});

var listen = function(portNum)
{
	if(validator.isInt(portNum) )
	{
		app.listen(portNum);
		console.log(colors.green("\n\n##### Starting Imperium Server ##### \n##### Listening on :" + portNum + " #####\n\n") );
	}
	else
	{
		console.log(colors.red("\n\nInvalid port setting: '" + portNum + "'; Please check config.json\n\n") );
	}
}



