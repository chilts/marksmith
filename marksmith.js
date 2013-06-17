// ----------------------------------------------------------------------------
//
// marksmith.js - load up and parse all files in a Marksmith site.
//
// Copyright 2013 Andrew Chilton <andychilton@gmail.com>
//
// ----------------------------------------------------------------------------

var fs = require('fs');

var async = require('async');

// ----------------------------------------------------------------------------

// process all the files
function process(queue, store, item, log, callback) {
    log('Processing Filename : ' + item.filename);
    log('Root : ' + item.root);

    // get the 'url' for this item
    var url = item.filename.substr(item.root.length);
    if ( url === '' ) {
        url = '/';
    }
    log('Current URL : ' + item.url);

    // make the item is created if it doesn't already exist
    store[url] = store[url] || {};

    // firstly, check if this is a directory or a filename
    fs.stat(item.filename, function(err, stat) {
        if (err) {
            return callback(err);
        }

        if ( stat.isDirectory() ) {
            // this is a directory
            log('Reading dir : ' + item.filename);
            fs.readdir(item.filename, function(err, files) {
                files.forEach(function(filename, i) {
                    // ignore backups and temporary files
                    if ( filename.match(/(^\#)|(^\.\#)|(~$)/) ) {
                        return;
                    }
                    log('Found file : ' + filename);

                    queue.push({
                        root     : item.root,
                        filename : item.filename + '/' + filename,
                        url      : item.url,
                    });
                });
                callback();
            });
        }
        else {
            // this is a file, read it and continue
            fs.readFile(item.filename, 'utf8', function(err, data) {
                // data from the file
                log('* storing data');
                store[url] = store[url] || {};
                store[url].data = data;
                callback();
            });
        }
    });
};

function marksmith(dir, plugins, log, done) {

    // remove the trailing slash off the dir if there is one
    dir = dir.replace(/\/$/, '');

    // make a new store
    var store = {};

    // use a queue to do each file one-by-one
    var queue = async.queue(
        function(item, callback) {
            process(queue, store, item, log, callback);
        },
        1
    );

    // when everything has been done, process with plugins then call done()
    queue.drain = function() {
        // now process all plugins
        plugins.forEach(function(plugin) {
            marksmith[plugin](store, log);
        });

        done(null, store);
    };

    // now start the whole thing off
    var start = {
        root     : dir,
        filename : dir,
        url      : '/',
    };
    queue.push(start, function(err) {
        log('Finished processing : ' + dir);
    });
};

// ----------------------------------------------------------------------------

// load up all the plugins
var plugins = [
    'convertMarkdownToContentAndRemove',
    'convertTextileToContentAndRemove',
    'createBlogFeeds',
    'createBlogIndexes',
    'createDirRedirects',
    'createTextSitemap',
    'decodeDirCfg',
    'decodeJsonToMetaAndRemove',
    'decodeYamlToMetaAndRemove',
    'extractYamlFrontMatterToMeta',
    'filenameDateToMetaAndRename',
    'makeGravatarUrlsFromAuthorEmail',
    'makeOtherGravatarUrlSizes',
    'renameIndexToDir',
    'setChtmlAsContentAndRemove',
    'setHtmlAsRenderedPageAndRemove',
];
plugins.forEach(function(plugin) {
    marksmith[plugin] = require('./lib/' + plugin + '.js');
});

// export this function
module.exports = marksmith;

// ----------------------------------------------------------------------------
