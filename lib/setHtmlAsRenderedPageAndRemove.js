// ----------------------------------------------------------------------------
//
// setHtmlAsRenderedPageAndRemove.js
//
// Copyright 2013 Andrew Chilton <andychilton@gmail.com>
//
// License: http://chilts.mit-license.org/2013/
//
// ----------------------------------------------------------------------------
//
// Does a direct copy of things like '/a-page.chtml' to the content of
// '/a-page'. Marksmith will render this by calling the relevant template with
// this content already set.
//
// e.g.
//
//     '/a-page.html' : { 'data' : '...' }
//
// to
//
//     '/a-page' : { content : '...', meta : { ... } }
//
// ----------------------------------------------------------------------------

var _ = require('underscore');

// ----------------------------------------------------------------------------

module.exports = function setHtmlAsRenderedPageAndRemove(store, log) {
    log('Plugin : Set HTML as Rendered Page and Remove');

    var urls = Object.keys(store);
    urls = urls.filter(function(url) {
        // looks like "*.html"
        return url.match(/\.html$/);
    });

    urls.forEach(function(url, i) {
        fmt.field('Moving HTML to Rendered Page', url);

        var newUrl = url.replace(/\.html$/, '');
        fmt.field('To ->', newUrl);

        store[newUrl] = store[newUrl] || {};

        // give a warning if there is already content here
        if ( store[newUrl].content ) {
            log('WARNING: ' + newUrl + ' already has content set ... OVERWRITING!');
        }
        store[newUrl].content = store[url].data;
        store[newUrl].meta = _.extend(
            {},
            store[newUrl].meta,
            store[url].meta,
            { type : 'rendered', contentType : 'text/html' }
        );
        delete store[url];
    });
}

// ----------------------------------------------------------------------------
