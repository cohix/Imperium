
//////////////////////
//Require Statements//
//////////////////////

var fs = require('fs');
var bots = require('./bots.js')
var marked = require('marked');
var hl = require('highlight.js');

var first = "<!DOCTYPE html>\n<html>";
var bodyStart = "\t<body>";
var last = "\t</body>\n</html>"
var config = {}; //This will be populated fom imperium.js once config.json is loaded on startup


/////////////////////////////////
//Markdown Parser Configuration//
/////////////////////////////////

marked.setOptions({
  highlight: function (code) 
  {
    return hl.highlightAuto(code).value;
  }
});


///////////////////////
//Generator Functions//
///////////////////////

var generateFrontPage = function(pageNum, callback)
{
	var head = fs.readFileSync("../theme/head.html");
	var sidebar = fs.readFileSync("../theme/cont/sidebar.html", "utf-8");
	var header = '';
	var banner = '';
	var footer = '';
	var postsHtml = '';

	var html = first + head + bodyStart;


	bots.getPosts(pageNum*25, (pageNum*25)+25, function(posts)
	{
		if(config['useBanner'] == true) banner = generateBanner( config['siteTitle'] );

		if(banner != -1) // -1 indicates that fs failed in generateBanner
			if(config['bannerAboveNav'] == true) html += banner;

		if(config['useHeader']) header = generateHeader();

		if(header != -1) // -1 indicates that fs failed in generateHeader
			html += header;

		if(banner != -1) // -1 indicates that fs failed in generateBanner
			if(config['bannerAboveNav'] == false) html += banner;

		console.log("Sidebar: " + sidebar);
		console.log("Config: " + config['useSidebar']);

		if(sidebar != '')
			if(config['useSidebar'] == true) html += sidebar;

		postsHtml = generatePostsList( posts['posts'], pageNum );

		if(postsHtml != -1) // -1 indicates that fs failed in generatePostsList
			html += postsHtml;

		if(config['useFooter']) footer = generateFooter();

		if(footer != -1) // -1 indicates that fs failed in generateFooter
			html += footer + last;
		else
			html += last;
		
		callback(html);
	});

	
}

var generateTLPage = function(name, callback)
{
	var head = fs.readFileSync("../theme/head.html");
	var sidebar = fs.readFileSync("../theme/cont/sidebar.html", "utf-8");
	var header = '';
	var banner = '';
	var footer = '';
	var pageHtml = '';
	
	var html = first + head + bodyStart;

	bots.getPageContent(name, function(pageString)
	{
		var title = name.replace(/_/g, " ");

		if(config['useBanner'] == true) banner = generateBanner( title );

		if(banner != -1) // -1 indicates that fs failed in generateBanner
			if(config['bannerAboveNav'] == true) html += banner;

		if(config['useHeader']) header = generateHeader();

		if(header != -1) // -1 indicates that fs failed in generateHeader
			html += header;

		if(banner != -1) // -1 indicates that fs failed in generateBanner
			if(config['bannerAboveNav'] == false) html += banner;

		if(sidebar != '')
			if(config['useSidebar'] == true) html += sidebar;

		pageHtml = generatePageContent( name, pageString );

		if(pageHtml != -1) // -1 indicates that fs failed in generatePostsList
			html += pageHtml;

		if(config['useFooter']) footer = generateFooter();

		if(footer != -1) // -1 indicates that fs failed in generateFooter
			html += footer + last;
		else
			html += last;
		
		callback(html);

	});

}

var generatePost = function(name, callback)
{
	var head = fs.readFileSync("../theme/head.html");
	var sidebar = fs.readFileSync("../theme/cont/sidebar.html", "utf-8");
	var header = '';
	var banner = '';
	var footer = '';
	var postHtml = '';
	
	var html = first + head + bodyStart;

	bots.getPostContent(name, function(pageString)
	{
		var title = name.replace(/_/g, " ");

		header = generateHeader();

		if(config['useBanner'] == true) banner = generateBanner( title );

		if(banner != -1) // -1 indicates that fs failed in generateBanner
			if(config['bannerAboveNav'] == true) html += banner;

		if(config['useHeader']) header = generateHeader();

		if(header != -1) // -1 indicates that fs failed in generateHeader
			html += header;

		if(banner != -1) // -1 indicates that fs failed in generateBanner
			if(config['bannerAboveNav'] == false) html += banner;

		if(sidebar != '')
			if(config['useSidebar'] == true) html += sidebar;

		postHtml = generatePostContent( name, pageString );

		if(postHtml != -1) // -1 indicates that fs failed in generatePostsList
			html += postHtml;

		if(config['useFooter']) footer = generateFooter();

		if(footer != -1) // -1 indicates that fs failed in generateFooter
			html += footer + last;
		else
			html += last;
		
		callback(html);

	});

}

var generatePageContent = function(name, pageString)
{
	var template = fs.readFileSync('../theme/page.html', 'utf-8');

	if(template)
	{
		var renderedContent = marked(pageString);
		var title = name.replace(/_/g, " ");

		template = template.replace(/~pageContent~/g, renderedContent);

		template = template.replace(/~pageTitle~/g, title);

		return template;
	}
	else return -1;
}

var generatePostContent = function(name, postString)
{
	var template = fs.readFileSync('../theme/post.html', 'utf-8');

	if(template)
	{
		var renderedContent = marked(postString);
		var nextPrevLinks = generateNextPrevLinks(name)
		var title = name.replace(/_/g, " ");

		template = template.replace(/~postContent~/g, renderedContent);

		template = template.replace(/~postTitle~/g, title);
		
		template = template.replace(/~nextPrevLinks~/g, nextPrevLinks);

		return template;
	}
	else return -1;
}

var generatePostsList = function(posts, pageNum)
{
	console.log("Page: " + pageNum);

	var postList = ''
	var container = fs.readFileSync("../theme/index.html", 'utf-8');
	var template = fs.readFileSync("../theme/frag/postCell.html", "utf-8");

	if(template)
	{
		if(posts.length != 0)
		{
			posts.forEach(function(post)
			{
				var newPost = template;
				var postTitle = post['title'];
				var postUrl = post['url'];
				var firstImg = bots.getFirstImage(postUrl);

				newPost = newPost.replace(/~postCellTitle~/g, postTitle); //set post title
				
				newPost = newPost.replace(/~postCellLink~/g, postUrl); //set post link using title as key

				if(firstImg != -1)
				{
					firstImg = firstImg.replace("<img", "<img class = 'postCellImg'");
					newPost = newPost.replace(/~postFirstImage~/g, firstImg); //insert image html
				}
				else
				{
					newPost = newPost.replace(/~postFirstImage~/g, ''); //insert image html
				}


				postList += newPost;
			});
		}
		else
		{
			console.log("No posts".red);
			postList = "There are no posts in this range!";
		}
		

		container = container.replace(/~postList~/g, postList);

		container = container.replace(/~paginationLinks~/g, generatePaginationLinks(pageNum) );

		return container;
	}
	else return -1;
	
}

var generateHeader = function()
{
	var headerHtml = fs.readFileSync("../theme/cont/header.html", "utf-8");
	var linkHtml = fs.readFileSync('../theme/frag/headerLink.html', "utf-8");

	var pages = generatePageLinks();

	var linkList = ''

	var homeLink = linkHtml;

	homeLink = homeLink.replace(/~headerPageTitle~/g, config['homeLink']); //set Page title
	
	homeLink = homeLink.replace(/~headerPageLink~/g, '/'); //set Page link
	
	homeLink = homeLink.replace(/~headerLinkColor~/g, config['homeLinkColor'] + " home-link");

	linkList += homeLink;

	if(headerHtml && linkHtml)
	{
		pages.forEach(function(page)
		{
			var newLink = linkHtml;
			var pageTitle = page['title'];
			var pageUrl = page['url'];

			newLink = newLink.replace(/~headerPageTitle~/g, pageTitle); //set Page title
			
			newLink = newLink.replace(/~headerPageLink~/g, pageUrl); //set Page link

			newLink = newLink.replace(/~headerLinkColor~/g, config['headerLinkColor'] + " nav-link");

			linkList += newLink;
		});

		headerHtml = headerHtml.replace(/~headerNavLinks~/g, linkList);

		return headerHtml;
	}
	else return -1;

}

var generatePaginationLinks = function(pageNum)
{

	var prev = "<a href = '";
	var next = "<a href = '/page/" + (pageNum+2) + "' class = 'cell' id = 'nextLink'> <h3> Older </h3> </a>";

	if(pageNum <= 0)
		prev = '<h3 class = "cell" id = "prevLink"> Newer </h3>';
	else if(pageNum == 1)
		prev += "/' class = 'cell' id = 'prevLink'> <h3> Newer </h3> </a> ";
	else
		prev += '/page/' + (pageNum) + "' class = 'cell' id = 'prevLink'> <h3> Newer </h3> </a> ";

	return prev + '\n' + next;
}

var generateNextPrevLinks = function(name) //TODO: Make this faster. It's based on bots.getPosts(), but not async
{
	var files = fs.readdirSync("../posts");

	var next = '';
	var prev = '';
	var prevHtml = "<a class = 'cell' id = 'prevLink' href = '/posts/";
	var nextHtml = "<a class = 'cell' id = 'nextLink' href = '/posts/";
	
	if(files != null)
	{
		for(var i = 0; i < files.length; i++)
		{
			if(files[i].substring(0, 1) == '_' || files[i] == '.DS_Store')
			{
				files.splice(i, 1); //remove the drafts or the .DS_Store's
			}
		}

		files.sort(function(a, b) 
		{
           return fs.statSync("../posts/" + b).mtime.getTime() - fs.statSync("../posts/" + a).mtime.getTime();
       	});

		var index  = files.indexOf(name + '.md')

		if(index != files.length-1) //if it's not the last post
       		next = files[index + 1];
       	
		if(index != 0) //if it's not the first post
       		prev = files[index - 1];


 		if(prev != '' && prev != undefined)
 		{
 			var url = prev.substring( 0, prev.indexOf('.') ); //remove file extension
			var prevTitle = url.replace(/_/g, " ") //replace underscores with spaces

 			prevHtml += url + "'> <h3>" + prevTitle + '</h3> </a>';
 		}
 		else
 			prevHtml = "<a class = 'cell' id = 'prevLink' href = '/'><h3>Home</h3></a>";

 		if(next != '' && next != undefined)
 		{
			var url = next.substring( 0, next.indexOf('.') ); //remove file extension
			var nextTitle = url.replace(/_/g, " ") //replace underscores with spaces

 			nextHtml += url + "'> <h3>" + nextTitle + '</h3> </a>';
 		}
 		else
 			nextHtml = "<a class = 'cell' id = 'nextLink' href = '/'><h3>Home</h3></a>";

 		console.log("Next: " + nextHtml + ' Prev: ' + prevHtml);

       	return prevHtml + '\n' + nextHtml;
	}
	else
	{
		console.log(err);
		return({error: err});
	}
}

var generateBanner = function(title)
{
	var banner = fs.readFileSync("../theme/cont/banner.html", "utf-8");

	if(banner)
	{
		banner = banner.replace(/~bannerTitle~/g, title);

		return banner;
	}
	else
	{
		return -1;
	}
}

var generateFooter = function()
{
	var footer = fs.readFileSync("../theme/cont/footer.html", "utf-8");

	if(footer)
	{
		footer = footer.replace(/~footerBlurb~/g, config['footerBlurb']);

		return footer;
	}
	else
	{
		return -1;
	}
}

var generatePageLinks = function()
{
	var pages = config['pageOrder'];
	var retObj = [];

	pages.forEach(function(item)
	{
		var url = '/' + item.replace(/ /g, '_');

		retObj.push( {title: item, url: url} );
	});

   	return retObj;
}

var loadConfigIntoGenerator = function(configObj)
{
	config = configObj;
}


module.exports.frontPage = generateFrontPage;
module.exports.TLPage = generateTLPage;
module.exports.post = generatePost;
module.exports.loadConfigIntoGenerator = loadConfigIntoGenerator;



