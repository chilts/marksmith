// ----------------------------------------------------------------------------
//
// makeGravatarUrlsFromAuthorEmail.js
//
// Copyright 2013 Andrew Chilton <andychilton@gmail.com>
//
// License: http://chilts.mit-license.org/2013/
//
// ----------------------------------------------------------------------------
//
// Reads meta.author.email and creates meta.author.gravatarUrl.
//
// ----------------------------------------------------------------------------

module.exports = function makeGravatarUrlsFromAuthorEmail(store, log) {
    log('Plugin : Make Gravatar URLs from Author Email');

    // only get the pages with 'author.email' info
    var urls = Object.keys(store);
    urls = urls.filter(function(url) {
        var page = store[url];
        return page && page.meta && page.meta.author && page.meta.author.email;
    });

    urls.forEach(function(url, i) {
        fmt.field('* ' + url);

        var email = store[url].meta.author.email.trim().toLowerCase();
        var md5 = crypto.createHash('md5').update(email).digest('hex');
        store[url].meta.author.gravatarUrl = 'http://www.gravatar.com/avatar/' + md5 + '.jpg';
    });
}

// ----------------------------------------------------------------------------
