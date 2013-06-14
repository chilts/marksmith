// ----------------------------------------------------------------------------
//
// createDirRedirects.js
//
// Copyright 2013 Andrew Chilton <andychilton@gmail.com>
//
// License: http://chilts.mit-license.org/2013/
//
// ----------------------------------------------------------------------------
//
// Finds all URLs ending with '/' and creates redirects from ''.
//
// e.g.
//
//     ''      : { type : 'redirect', to : '/'      }
//     '/blog' : { type : 'redirect', to : '/blog/' }
//     '/a/b'  : { type : 'redirect', to : '/a/b/'  }
//
// ----------------------------------------------------------------------------

module.exports = function createDirRedirects(store, log) {
    log('Plugin : Dir Redirects');

    var dirs = Object.keys(store).filter(function(dir) {
        return dir !== '/' && dir.match(/\/$/);
    });

    dirs.forEach(function(dir, i) {
        log('* ' + dir);

        var nakedDir = dir.replace(/\/$/, '');
        log('  -> ' + nakedDir);

        // generate the redirect
        if ( store[nakedDir] ) {
            log('WARNING: ' + nakedDir + ' already exists ... OVERWRITING!');
        }
        store[nakedDir] = {
            meta : {
                type   : 'redirect',
                to     : dir,
            }
        };
    });
}

// ----------------------------------------------------------------------------
