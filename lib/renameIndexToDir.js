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

module.exports = function renameIndexToDir(store, log) {
    log('Plugin : Rename Index to Dir');

    var urls = Object.keys(store);
    urls = urls.filter(function(url) {
        // looks like "*/index"
        return url.match(/\/index$/);
    });

    urls.forEach(function(url, i) {
        log('* ' + url);
        console.log(store[url]);

        var newUrl = url.replace(/\/index$/, '/');
        log('  -> ' + newUrl);

        // if there is already a newUrl, then provide a warning
        if ( store[newUrl] ) {
            log('WARNING: ' + newUrl + ' already exists ... OVERWRITING!');
        }
        store[newUrl] = store[newUrl];
        delete store[url];
    });
}

// ----------------------------------------------------------------------------
