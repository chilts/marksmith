// ----------------------------------------------------------------------------
//
// convertMarkdownToContentAndRemove.js
//
// Copyright 2013 Andrew Chilton <andychilton@gmail.com>
//
// License: http://chilts.mit-license.org/2013/
//
// ----------------------------------------------------------------------------
//
// Renders the content from '/some-markdown.md' to '/some-markdown'.
//
// e.g.
//
//     '/some-markdown.md' : { 'data' : '...markdown...' }
//
// to
//
//     '/some-markdown' : { content : '...html...' }
//
// ----------------------------------------------------------------------------

var _ = require('underscore');
var marked = require('marked');

// ----------------------------------------------------------------------------

// set up 'marked'
marked.setOptions({
    gfm        : true,
    tables     : true,
    breaks     : false,
    pedantic   : false,
    sanitize   : true,
    smartLists : true,
    langPrefix : 'language-',
});

module.exports = function convertMarkdownToContentAndRemove(store, log) {
    log('Plugin : Convert Markdown to Content');

    var urls = Object.keys(store);
    urls = urls.filter(function(url) {
        // looks like "*.md"
        return url.match(/\.md$/);
    });

    urls.forEach(function(url, i) {
        fmt.field('Converting Markdown', url);

        var newUrl = url.replace(/\.md$/, '');
        fmt.field('To ->', newUrl);

        // convert the markdown to content and extend any existing 'meta'
        store[newUrl] = store[newUrl] || {};
        if ( store[newUrl].content ) {
            log('WARNING: ' + newUrl + ' already has content set ... OVERWRITING!');
        }
        store[newUrl].content = marked(store[url].data);
        store[newUrl].meta = _.extend(
            {},
            store[newUrl].meta,
            store[url].meta
        );
        delete store[url];
    });
}

// ----------------------------------------------------------------------------
