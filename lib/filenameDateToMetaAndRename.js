// ----------------------------------------------------------------------------
//
// filenameDateToMetaAndRename .js
//
// Copyright 2013 Andrew Chilton <andychilton@gmail.com>
//
// License: http://chilts.mit-license.org/2013/
//
// ----------------------------------------------------------------------------
//
// Finds all URLs which start with (\d\d\d\d-\d\d-\d\d-)(.*), grabs the date
// from the first patching parenthesis and renames the URL to the second
// parenthesis.
//
// Note: this is designed to help migrate from GitHub Pages (Jekyll) which
// put dates into the filename.
//
// e.g.
//
//     '/2013-06-10-hello-world' : { data : ... }
//
// will give:
//
//     '/hello-world' : { meta : { date : '2013-06-10' }, data : ... }
//
// ----------------------------------------------------------------------------

var _ = require('underscore');

// ----------------------------------------------------------------------------

module.exports = function filenameDateToMetaAndRename(store, log) {
    log('Plugin : Filename Date to Meta and Rename');

    var urls = Object.keys(store);
    urls = urls.filter(function(url) {
        // looks like "yyyy-mm-dd-*"
        return url.match(/\/\d\d\d\d-\d\d-\d\d-/);
    });

    urls.forEach(function(url, i) {
        log('* ' + url);

        var re = /\/(\d{4}-\d{2}-\d{2})-/;
        var m = url.match(re);

        var date = m[1];
        var newUrl = url.replace(re, '/');

        log('  - new  : ' + newUrl);
        log('  - date : ' + date);

        // create new url, extend meta, copy data over and remove old url
        store[newUrl] = store[newUrl] || {};
        store[newUrl].meta = _.extend({}, store[newUrl].meta, { date : date });
        store[newUrl].data = store[url].data;
        delete store[url];
    });
}

// ----------------------------------------------------------------------------
