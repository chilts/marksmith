// ----------------------------------------------------------------------------
//
// decodeJsonToMetaAndRemove.js
//
// Copyright 2013 Andrew Chilton <andychilton@gmail.com>
//
// License: http://chilts.mit-license.org/2013/
//
// ----------------------------------------------------------------------------
//
// Decodes 'meta' from '/path.json' to '/path'
//
// e.g.
//
//     '/path.json' : { 'data' : '{"title":"A Page"}' }
//
// to
//
//     '/path' : { meta : { title : 'A Page' } }
//
// ----------------------------------------------------------------------------

var _ = require('underscore');

// ----------------------------------------------------------------------------

module.exports = function decodeJsonToMetaAndRemove(store, log) {
    fmt.title('Plugin : Decode JSON to Meta');

    var urls = Object.keys(store);
    urls = urls.filter(function(url) {
        // looks like "*.json"
        return url.match(/\.json$/);
    });

    urls.forEach(function(url, i) {
        fmt.field('Converting JSON', url);

        var newUrl = url.replace(/\.json$/, '');
        fmt.field('To ->', newUrl);

        store[newUrl] = store[newUrl] || {};
        store[newUrl].meta = _.extend(
            {},
            store[newUrl].meta,
            JSON.parse(store[url].data)
        );
        delete store[url];
    });
}

// ----------------------------------------------------------------------------
