```
 _______  _______  _______  _        _______  _______ __________________         
(       )(  ___  )(  ____ )| \    /\(  ____ \(       )\__   __/\__   __/|\     /|
| () () || (   ) || (    )||  \  / /| (    \/| () () |   ) (      ) (   | )   ( |
| || || || (___) || (____)||  (_/ / | (_____ | || || |   | |      | |   | (___) |
| |(_)| ||  ___  ||     __)|   _ (  (_____  )| |(_)| |   | |      | |   |  ___  |
| |   | || (   ) || (\ (   |  ( \ \       ) || |   | |   | |      | |   | (   ) |
| )   ( || )   ( || ) \ \__|  /  \ \/\____) || )   ( |___) (___   | |   | )   ( |
|/     \||/     \||/   \__/|_/    \/\_______)|/     \|\_______/   )_(   |/     \|
                                                                                 
```

MarkSmith - Convert a tree of files into a data structure that can be served with
[marksmith-server](https://github.com/chilts/marksmith-server).

## It's Plugins All the Way Down ##

Generally, marksmith just reads a directory of content into a flat object containing only the data contained in the
file. For example, given the following directory structure, Marksmith creates an object out of it:

```
content/
┬ index.html
│ index.json
│ .cfg.json
```

This would produce a data structure such as:

```
pages = {
  '/': {},
  '/.cfg.json': { data: '{"domain":"simple.example.org"}\n' },
  '/index.html': { data: '<h1>Index</h1>\n<p>This is a simple site.</p>\n' },
  '/index.json': { data: '{"title":"Simple Site"}\n' }
}
```

From here, it's up to various plugins to manipulate the tree so that it is servable by [Marksmith
Server](https://github.com/chilts/marksmith-server).

## What can Marksmith Server serve? ##

Essentially, what you have above is a mapping of the URLs to the content that should be served. At the moment,
Marksmith Server wouldn't know what to do with each of the above URLs (such as '/index.html') since it contains data
only. We somehow need to transform that into something that can be served.

To do that we need plugins since plugins go through the ```pages``` data structure and manipulate it into something
usable.

### Pre-Rendered Content ###

Marksmith Server can serve pre-rendered content. For example, to serve a static HTML page as your homepage, you'd want
the following:

```
pages = {
    '/' : {
        meta : {
            type : 'rendered',
            contentType : 'text/html',
        },
        content : "<h1>My Homepage</h1>",
    },
}
```

Therefore, if Marksmith is asked for the url '/', it will respond with the content and the content type will be
'text/html'. This is because this page is of type 'rendered'.

### Templated Content ###

If a page has some content but it needs to be rendered within a template, then it will look like this:

```
pages = {
    '/' : {
        meta : {
            type : 'page',
        },
        content : "<h1>My Homepage</h1>",
    },
}
```

For templated content,  the meta.type is set to any of 'page', 'post', 'archive' or 'blog'.

The templates are read from the directory given to Marksmith Server. Here, Marksmith itself is only concerned with the
content directory.

### Redirects ###

While redirects can be served using the 'rendered' type, it is easier to create it's own since it's used quite a
lot. The following would be equivalent:

```
pages = {
    '/blog' : {
        meta : {
            type : 'redirect',
            to   : '/blog/',
        },
    },
}
pages = {
    '/blog' : {
        meta : {
            type : 'rendered',
            headers : {
                location : '/blog/',
            },
            status : 302,
        },
        content : '',
    },
}
```

That's it. There are only three types of content that Marksmith Server can serve, however, the possibilities of these
are endless.

## Plugins ##

* convertMarkdownToContentAndRemove
* convertTextileToContentAndRemove
* createBlogFeeds
* createBlogIndexes
* createDirRedirects
* createTextSitemap
* decodeDirCfg
* decodeJsonToMetaAndRemove
* decodeYamlToMetaAndRemove
* extractYamlFrontMatterToMeta
* filenameDateToMetaAndRename
* makeGravatarUrlsFromAuthorEmail
* makeOtherGravatarUrlSizes
* renameIndexToDir
* setChtmlAsContentAndRemove
* setHtmlAsRenderedPageAndRemove

## How a Plugin Works ##

All plugins are one function, which takes one parameter (the ```store```) and manipulates it directly. For example, the
```decodeDirCfg``` plugin does the following conversion:

```
// From:
{
    '/.cfg.json' : '{"title":"My Blog"}'
}

// To:
{
    '/' : {
        'meta' : {
            'title' : 'My Blog'
        }
    }
}
```

As you can see, it converts any ```.cfg.json``` files it finds in each directory, to be the meta object of that
directory. It also removed what was at '/.cfg.json' so that this isn't served in any way.

Please see each individual plugin for full details.

## Plugins ##

There are a number of plugins which come with Marksmith. Make sure you check if any plugins need to be run in the
correct order.

# Author #

Written by [Andrew Chilton](http://chilts.org/) -
[Blog](http://chilts.org/blog/) -
[Twitter](https://twitter.com/andychilton).

# License #

* [Copyright 2013 Andrew Chilton.  All rights reserved.](http://chilts.mit-license.org/2013/)

(Ends)
