

## Basic Structure ##

The basic structure and code of Marksmith is really simple. All it does is load up an entire directory listing into
memory for further manipulation by the plugins.

For example, if you have the following content structure, it'll look like this once loaded up:

```
content/
┬ index.html
│ index.json
│ .cfg.json
├─┬ blog/
│ ├── first-post.md
│ ├── first-post.json
│ ├── 2nd-post.md
│ └── 2n-post.json
└─┬ projects/
  ├── marksmith.html
  └── proximity.html
```

Will result in the following tree:

```
{
   '/index.html' : { ... },
   '/index.json' : { ... },
   '/.cfg.json' : { ... },
   '/blog/first-post.md' : { ... },
   '/blog/first-post.json' : { ... },
   '/blog/2nd-post.md' : { ... },
   '/blog/2nd-post.json' : { ... },
   '/project/marksmith.html' : { ... },
   '/project/proximity.html' : { ... },
}
```

Currently at this point, then ```{ ... }``` will just be the contents of the file stored in the ```data``` property:

```
{ data : '<contents of file>' }
```

## How a Plugin Works ##

All plugins are one function, which takes one parameter (the ```store```) and manipulates it directly. For example, the
```decodeDirConfig``` plugin does the following:

```
// From:
{
    '/.cfg.json' : '{"title":"My Blog"}'
}

// To:
{
    '/' : {
        'meta' : {
            'title' : 'My Blog'
        }
    }
}
```

As you can see, it converts any ```.cfg.json``` files it finds in each directory, to be the meta object of that
directory.

Please see each individual plugin for full details.

## Plugins ##

There are a number of plugins which come with Marksmith. Make sure you check if any plugins need to be run in the
correct order.

### decodeDirConfig ##




# Author #

Written by [Andrew Chilton](http://chilts.org/) -
[Blog](http://chilts.org/blog/) -
[Twitter](https://twitter.com/andychilton).

# License #

* [Copyright 2013 Andrew Chilton.  All rights reserved.](http://chilts.mit-license.org/2013/)

(Ends)
