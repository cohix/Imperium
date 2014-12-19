
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

//////////////////////
//NCMS Configuration//
//////////////////////

var config = {};

bots.loadConfigFile(function(configJson)
{
	if(configJson['config'] == false)
	{
		console.log("### NCMS requires a config.json file... please create one ###\n\n".red);
		process.exit(1);
	}

	else
	{
		console.log("### Config File Loaded Successfully ###".magenta);
		config = configJson;
	}
});


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
	var sidebar = fs.readFileSync("../theme/cont/sidebar.html");
	var header = '';
	var banner = '';
	var sidebar = '';
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
	var sidebar = fs.readFileSync("../theme/cont/sidebar.html");
	var header = '';
	var banner = '';
	var sidebar = '';
	var footer = '';
	var postsHtml = '';
	
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

		var pageHtml = generatePageContent( name, pageString );

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
	var sidebar = fs.readFileSync("../theme/cont/sidebar.html");
	var header = '';
	var banner = '';
	var sidebar = '';
	var footer = '';
	var postsHtml = '';
	
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

		var postHtml = generatePostContent( name, pageString );

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
		var title = name.replace(/_/g, " ");

		template = template.replace(/~postContent~/g, renderedContent);

		template = template.replace(/~postTitle~/g, title);

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


module.exports.frontPage = generateFrontPage;
module.exports.TLPage = generateTLPage;
module.exports.post = generatePost;



