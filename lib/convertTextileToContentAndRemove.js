// ----------------------------------------------------------------------------
//
// convertTextileToContentAndRemove.js
//
// Copyright 2013 Andrew Chilton <andychilton@gmail.com>
//
// License: http://chilts.mit-license.org/2013/
//
// ----------------------------------------------------------------------------
//
// Renders the content from '/some-textile.textile' to '/some-textile'.
//
// e.g.
//
//     '/some-textile.textile' : { 'data' : '...textile...' }
//
// to
//
//     '/some-textile' : { content : '...html...' }
//
// ----------------------------------------------------------------------------

var _ = require('underscore');
var textile = require('textile-js');

// ----------------------------------------------------------------------------

module.exports = function convertTextileToContentAndRemove(store, log) {
    log('Plugin : Convert Textile to Content');

    var urls = Object.keys(store);
    urls = urls.filter(function(url) {
        // looks like "*.textile"
        return url.match(/\.textile$/);
    });

    urls.forEach(function(url, i) {
        fmt.field('Converting Textile', url);

        var newUrl = url.replace(/\.textile$/, '');
        fmt.field('To ->', newUrl);

        store[newUrl] = store[newUrl] || {};
        store[newUrl].content = textile(store[url].data);
        store[newUrl].meta = _.extend({}, store[newUrl].meta, store[url].meta);
        delete store[url];

        // convert the textile to content and extend any existing 'meta'
        store[newUrl] = store[newUrl] || {};
        if ( store[newUrl].content ) {
            log('WARNING: ' + newUrl + ' already has content set ... OVERWRITING!');
        }
        store[newUrl].content = textile(store[url].data);
        store[newUrl].meta = _.extend(
            {},
            store[newUrl].meta,
            store[url].meta
        );
        delete store[url];
    });
}

// ----------------------------------------------------------------------------
