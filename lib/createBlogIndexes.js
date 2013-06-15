// ----------------------------------------------------------------------------
//
// createBlogIndexes.js
//
// Copyright 2013 Andrew Chilton <andychilton@gmail.com>
//
// License: http://chilts.mit-license.org/2013/
//
// ----------------------------------------------------------------------------
//
// Finds all URLs of type 'blog' and adds it's children to it's 'posts'.
//
// e.g.
//
//     '/'     : { meta : { type : 'blog' } }
//
// to
//
//     '/'     : { meta : { type : 'blog' }, posts : [ ... ] }
//
// ----------------------------------------------------------------------------

function getPostsAtSameLevel(store, blogUrl, log) {
    // figure out the level number of the blog (e.g. '/' -> 1, '/blog/' -> 2)
    var blogUrlLevel = blogUrl.split('/').length - 1;

    // store the posts somewhere
    var posts = [];

    var urls = Object.keys(store);
    urls.forEach(function(url, i) {
        // if this isn't a 'post', we don't add it
        if ( !store[url].meta ) {
            return;
        }
        if ( store[url].meta.type !== 'post' ) {
            return;
        }

        // don't add the blog itself!
        if ( blogUrl === url ) {
            return;
        }

        // if this url is a subset of the blogUrl
        // (ie. it looks like '/blog/something' for '/blog/'
        // but also has the same number of slashes so we don't get '/blog/this/that')
        var urlLevel = url.split('/').length - 1;
        if ( blogUrl === url.substr(0, blogUrl.length) && blogUrlLevel === urlLevel ) {
            log('  + ', url);
            posts.push(store[url]);
        }
        else {
            log('  - ', url);
        }
    });

    return posts;
}

module.exports = function createBlogIndexes(store, log) {
    log('Plugin : Blog Indexes');

    // firstly, find all of the blog URLs
    var urls = Object.keys(store);
    var blogs = urls.filter(function(url) {
        return store[url] && store[url].meta && store[url].meta.type === 'blog';
    });

    // for each blog, gather all of it's posts
    blogs.forEach(function(blogUrl, i) {
        log('* ' + blogUrl);

        // finding all the pages in this blog
        store[blogUrl].posts = getPostsAtSameLevel(store, blogUrl, log);

        // now sort the posts in reverse order
        store[blogUrl].posts.sort(function(post1, post2) {
            return post1.meta.date < post2.meta.date;
        });

        // finally, also store this at /archive
        var archiveUrl = blogUrl + 'archive';
        store[archiveUrl] = store[archiveUrl] || {};
        store[archiveUrl].posts = store[blogUrl].posts;
    });
}

// ----------------------------------------------------------------------------
