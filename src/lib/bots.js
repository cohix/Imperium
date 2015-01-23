
var fs = require('fs');
var fourOhFour = '';

fs.readFile('404.md', 'utf-8', function(err, data)
{
	if(!err)
	{
		fourOhFour = data;
	}
	else
	{
		fourOhFour = '#404: Post not found\nPlease check the url!';
	}
});

var getPosts = function(fromIndex, toIndex, callback)
{
	fs.readdir("../posts", function(err, files)
	{
		if(!err)
		{
			for(var i = 0; i < files.length; i++)
			{
				if(files[i].substring(0, 1) == '_' || files[i] == '.DS_Store')
				{
					files.splice(i, 1); //remove the draft or the .DS_Store
				}
			}

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
			callback(fourOhFour);
		}
	});
}

var getPostContent = function(name, callback)
{
	if(name.substring(0, 1) != '_') //Don't allow drafts to be read
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
				callback(fourOhFour);
			}
		});
	}
	else
	{
		callback(fourOhFour);
	}

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

