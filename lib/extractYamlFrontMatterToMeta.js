// ----------------------------------------------------------------------------
//
// extractYamlFrontMatterToMeta.js
//
// Copyright 2013 Andrew Chilton <andychilton@gmail.com>
//
// License: http://chilts.mit-license.org/2013/
//
// ----------------------------------------------------------------------------
//
// Extracts any front-matter YAML it finds in the 'data' segment of each URL.
//
// Note: this is designed to help migrate from GitHub Pages (Jekyll) which
// contain YAML at the start of the data of each page.
//
// e.g. '/blog/hello-world' : { 'data' : '... see below ...' }
//
// ============================================================================
// ---
// type: post
// title: Hello, World!
// tags: [ first-post ]
// ---
// The rest of the post.
// ============================================================================
//
// will give:
//
//     '/blog/hello-world' : {
//         meta : {
//             type : 'post',
//             title : 'Hello, World!',
//             tags : [ 'first-post']
//         },
//         data : 'The rest of the post.'
//     }
//
// ----------------------------------------------------------------------------

var _ = require('underscore');
var yaml = require('js-yaml');

// ----------------------------------------------------------------------------

module.exports = function extractYamlFrontMatterToMeta(store, log) {
    log('Plugin : Extract YAML Front Matter From Data Like GitHub Pages ...');

    var urls = Object.keys(store);
    urls = urls.filter(function(url) {
        // see if 'data' starts with "---\n"
        // console.log(url + ' --- ' + (store[url].data && store[url].data.substr(0, 5)));
        return store[url].data && store[url].data.match(/^---\s*\n/);
    });

    urls.forEach(function(url, i) {
        log('* ' + url);

        var lines = store[url].data.split(/\n/);

        // lose the first line (which is just "---\n")
        lines.shift();

        var frontMatter = '';
        var remainingData;
        lines.forEach(function(line) {
            if ( line === '---' ) {
                // no longer in the front matter
                remainingData = '';
            }
            else {
                if ( remainingData === undefined ) {
                    frontMatter += line + "\n";
                }
                else {
                    remainingData += line + "\n";
                }
            }
        });

        // finally, set the meta and the new data
        store[url].meta = _.extend({}, store[url].meta, yaml.load(frontMatter));
        store[url].data = remainingData;
        console.log(store[url]);
    });
}

// ----------------------------------------------------------------------------
