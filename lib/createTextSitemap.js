// ----------------------------------------------------------------------------
//
// createTextSitemap.js
//
// Copyright 2013 Andrew Chilton <andychilton@gmail.com>
//
// License: http://chilts.mit-license.org/2013/
//
// ----------------------------------------------------------------------------
//
// Creates '/sitemap.txt'. Requires that store['/'].meta.siteUrl is set.
//
// e.g.
//
//     '/sitemap.txt' : {
//         type : 'rendered',
//         content : '...',
//         meta : { contentType : 'text/plain' },
//     }
//
// ----------------------------------------------------------------------------

module.exports = function createTextSitemap(store, log) {
    log('Plugin : Create (Text) Sitemap');

    var home = store['/'].cfg.domain;


    // check that we have a 'siteUrl' set (this should look like 'https?://example.com'
    var siteUrl;
    if ( store['/'].meta.siteUrl ) {
        siteUrl = store['/'].meta.siteUrl;
    }
    else {
        log('WARNING: siteUrl not set ... using the empty string!');
        siteUrl = '';
    }

    // get all URLs apart from redirects
    var urls = Object.keys(store).filter(function(url) {
        return store[url].type !== 'redirect';
    });

    var fullUrls = urls.map(function(url) {
        return siteUrl + url;
    });

    var content = fullUrls.join('\n');

    if ( store['/sitemap.txt'] ) {
        log('WARNING: /sitemap.txt already exists ... OVERWRITING!');
    }

    store['/sitemap.txt'] = {
        type    : 'rendered',
        content : content,
        meta    : {
            contentType : 'text/plain',
        },
    };
}

// ----------------------------------------------------------------------------
