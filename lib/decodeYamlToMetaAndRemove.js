// ----------------------------------------------------------------------------
//
// decodeYamlToMetaAndRemove.js
//
// Copyright 2013 Andrew Chilton <andychilton@gmail.com>
//
// License: http://chilts.mit-license.org/2013/
//
// ----------------------------------------------------------------------------
//
// Decodes 'meta' from '/path.yaml' to '/path'
//
// e.g.
//
//     '/path.yaml' : { 'data' : '{"title":"A Page"}' }
//
// to
//
//     '/path' : { meta : { title : 'A Page' } }
//
// ----------------------------------------------------------------------------

var _ = require('underscore');
var yaml = require('js-yaml');

// ----------------------------------------------------------------------------

module.exports = function decodeYamlToMetaAndRemove(store, log) {
    log('Plugin : Decode YAML to Meta');

    var urls = Object.keys(store);
    urls = urls.filter(function(url) {
        // looks like "*.yaml"
        return url.match(/\.yaml$/);
    });

    urls.forEach(function(url, i) {
        log('* ' + url);

        var newUrl = url.replace(/\.yaml$/, '');
        log(' -> ', newUrl);

        store[newUrl] = store[newUrl] || {};
        store[newUrl].meta = _.extend(
            {},
            store[newUrl].meta,
            yaml.load(store[url].data)
        );
        delete store[url];
    });
}

// ----------------------------------------------------------------------------
