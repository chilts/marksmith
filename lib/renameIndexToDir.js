// ----------------------------------------------------------------------------
//
// renameIndexToDir.js
//
// Copyright 2013 Andrew Chilton <andychilton@gmail.com>
//
// License: http://chilts.mit-license.org/2013/
//
// ----------------------------------------------------------------------------
//
// Renames things like '/index' and '/blog/index' to '/' and '/blog'.
//
// ----------------------------------------------------------------------------

var _ = require('underscore');

// ----------------------------------------------------------------------------

module.exports = function renameIndexToDir(store, log) {
    log('Plugin : Rename Index to Dir');

    var urls = Object.keys(store);
    urls = urls.filter(function(url) {
        // looks like "*/index"
        return url.match(/\/index$/);
    });

    urls.forEach(function(url, i) {
        log('* ' + url);

        var newUrl = url.replace(/\/index$/, '/');
        log('  -> ' + newUrl);

        // copy over the content and extend meta
        store[newUrl] = store[newUrl] || {};
        if ( store[newUrl].content ) {
            log('WARNING: content already exists ... OVERWRITING!');
        }
        store[newUrl].content = store[url].content;
        store[newUrl].meta = _.extend(
            {},
            store[newUrl].meta,
            store[url].meta
        );
        delete store[url];
    });
}

// ----------------------------------------------------------------------------
