
var fs = require('fs');

var getPosts = function(fromIndex, toIndex, callback)
{
	fs.readdir("../posts", function(err, files)
	{
		if(!err)
		{
			// console.log("Length: " + files.length + " From: " + fromIndex + " To: " + toIndex);

			if(files.indexOf(".DS_Store") > -1) 
				files.splice(files.indexOf(".DS_Store"), 1);

			files.sort(function(a, b) 
			{
               return fs.statSync("../posts/" + b).ctime.getTime() - fs.statSync("../posts/" + a).ctime.getTime();
           	});

           	files = files.slice(fromIndex, toIndex);

			var retObj = {posts: []};

			files.forEach(function(item)
			{
				var url = item.substring( 0, item.indexOf('.') ); //remove file extension
				var postTitle = url.replace(/_/g, " ") //replace underscores with spaces

				if(postTitle != "")
					retObj['posts'].push( {title: postTitle, url: "/posts/" + url} );
			});

           	callback(retObj);
		}
		else
		{
			console.log(err);
			callback({error: err});
		}
	});
}



var getPageContent = function(name, callback)
{
	console.log(name)
	var file = '../pages/' + name + '.md';
	console.log(file);

	fs.readFile(file, 'utf-8', function(err, data)
	{
		if(!err)
		{
			callback(data);
		}
		else
		{
			callback("#404: Page not found\nPlease check the url!");
		}
	});
}

var getPostContent = function(name, callback)
{
	var file = '../posts/' + name + '.md';

	fs.readFile(file, 'utf-8', function(err, data)
	{
		if(!err)
		{
			callback(data);
		}
		else
		{
			callback("#404: Post not found\nPlease check the url!");
		}
	});
}

var loadConfigFile = function(callback)
{
	fs.readFile('../config.json', 'utf-8', function(err, data)
	{
		var configJson = {};

		if(!err)
		{
			configJson = JSON.parse(data);
			configJson['config'] = true;
		}
		else
		{
			configJson = {config: false};
		}

		callback(configJson);
	});
	
}

var getFirstImage = function(name)
{
	var file = '..' + name + '.md';
	var img = '';

	var fileContents = fs.readFileSync(file, 'utf-8');

	var fromIndex = fileContents.indexOf('<img');
	var toIndex = fileContents.indexOf('</img>') + 6; // 6 compensates for < / i m g >

	// console.log('From: ' + fromIndex + ' To: ' + toIndex); //Logging the indecies of the found substrings

	if(fromIndex != -1 && toIndex != -1 && fromIndex < toIndex)
	{
		img = fileContents.substring(fromIndex, toIndex);

		return img;
	}
	else return -1;


}

module.exports.getPosts = getPosts;
module.exports.getPageContent = getPageContent;
module.exports.getPostContent = getPostContent;
module.exports.loadConfigFile = loadConfigFile;
module.exports.getFirstImage = getFirstImage;

