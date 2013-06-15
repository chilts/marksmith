// ----------------------------------------------------------------------------
//
// decodeDirCfg.js
//
// Copyright 2013 Andrew Chilton <andychilton@gmail.com>
//
// License: http://chilts.mit-license.org/2013/
//
// ----------------------------------------------------------------------------
//
// Decodes things like '/.cfg.json' to '/' and extends (or creates) the 'meta'
// info there.
//
// e.g.
//
//     '/.cfg.json' : { data : '{"type":"blog","title":"My Blog"}' }
//
// will give:
//
//     '/' : { cfg : { type : 'blog', title : 'My Blog' }, ... }
//
// ----------------------------------------------------------------------------

module.exports = function decodeDirConfig(store, log) {
    log('Plugin : Decode .cfg.json to page.cfg');

    var urls = Object.keys(store);

    urls = urls.filter(function(url) {
        // looks like "/.cfg.json" or "/path/.cfg.json"
        return url.match(/\/\.cfg\.json$/);
    });

    urls.forEach(function(url) {
        log('* ' + url);

        var newUrl = url.replace(/\.cfg\.json$/, '');
        log(' -> ', newUrl);

        store[newUrl] = store[newUrl] || {};
        store[newUrl].cfg = JSON.parse(store[url].data);
        delete store[url];
    });
}

// ----------------------------------------------------------------------------
