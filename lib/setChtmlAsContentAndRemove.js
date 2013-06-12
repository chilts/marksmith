// ----------------------------------------------------------------------------
//
// setChtmlAsContent.js
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

module.exports = function setChtmlAsContentAndRemove(store, log) {
    log('Plugin : Set HTML as Content');

    var urls = Object.keys(store);
    urls = urls.filter(function(url) {
        // looks like "*.chtml"
        return url.match(/\.chtml$/);
    });

    urls.forEach(function(url, i) {
        fmt.field('Moving HTML to Content', url);

        var newUrl = url.replace(/\.chtml$/, '');
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
            store[url].meta
        );
        delete store[url];
    });
}

// ----------------------------------------------------------------------------
