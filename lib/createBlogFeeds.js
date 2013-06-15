// ----------------------------------------------------------------------------
//
// createBlogFeeds.js
//
// Copyright 2013 Andrew Chilton <andychilton@gmail.com>
//
// License: http://chilts.mit-license.org/2013/
//
// ----------------------------------------------------------------------------
//
// Makes both '/rss' and '/atom' for all URLs of type 'blog'.
//
// e.g.
//
//     '/'     : { meta : { type : 'blog' } }
//
// adds
//
//     '/rss'  : { meta : { type : 'rendered' }, content : ... }
//     '/arom' : { meta : { type : 'rendered' }, content : ... }
//
// ----------------------------------------------------------------------------

var data2xml = require('data2xml')({ attrProp : '@', valProp  : '#' });

// ----------------------------------------------------------------------------

module.exports = function createBlogIndexes(store, log) {
    log('Plugin : Blog Feeds');

    var urls = Object.keys(store);
    // console.log(urls);
    urls = urls.filter(function(url) {
        return store[url] && store[url].meta && store[url].meta.type === 'blog';
    });

    // for each blog
    urls.forEach(function(url, i) {
        log('* ' + url);

        var home = store['/'];

        // ---
        // firstly, make and store the RSS feed
        var rss = {
            '@' : { version : '2.0' },
            channel : {
                title         : home.cfg.title,
                description   : home.cfg.description,
                link          : 'http://' + home.cfg.domain + url,
                lastBuildDate : (new Date()).toISOString(),
                pubDate       : (new Date()).toISOString(),
                ttl           : 1800,
                item          : [],
            }
        };

        rss.item = store[url].posts.map(function(post, i) {
            return {
                title       : post.meta.title,
                description : post.content,
                link        : 'http://' + home.cfg.domain + post.url,
                guid        : 'http://' + home.cfg.domain + post.url,
                pubDate     : post.meta.date,
            };
        });

        store[url + 'rss.xml'] = {
            meta : {
                type        : 'rendered',
                contentType : 'application/xml',
            },
            content : data2xml('rss', rss),
        };

        // ---
        // now, make the Atom feed

        var atom = {
            '@'     : { xmlns : 'http://www.w3.org/2005/Atom' },
            title   : home.cfg.title,
            link    : {
                '@' : {
                    href : 'http://' + home.cfg.domain + url + 'atom.xml',
                    rel  : 'self',
                },
            },
            updated : (new Date()).toISOString(),
            id      : 'http://' + home.cfg.domain + '/',
            author  : {
                name  : 'Andrew Chilton',
                email : 'andychilton@gmail.com',
            },
            entry   : [],
        };

        atom.entry = store[url].posts.map(function(post, i) {
            return {
                title   : post.meta.title,
                id      : 'http://' + home.cfg.domain + post.url,
                link    : [
                    {
                        '@' : { href : 'http://' + home.cfg.domain + post.url }
                    },
                    {
                        '@' : {
                            href : 'http://' + home.cfg.domain + post.url,
                            rel : 'self'
                        }
                    }
                ],
                content : {
                    '@' : { type : 'html' },
                    '#' : post.content,
                },
                updated : post.meta.date,
            };
        });

        // make a page for the /atom feed
        store[url + 'atom.xml'] = {
            meta : {
                type        : 'rendered',
                contentType : 'application/xml',
            },
            content : data2xml('feed', atom),
        };
    });
}
