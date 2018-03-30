# Fundamental Definition

### Webpack
At it’s heart: You have assets, they are all modules and you declare dependencies between them explicitly and web pack resolves them and spits out static files for your web application

### Loaders
Streams files of specific types though a transpiler and spit out a file (think js babel, css postcss, images url-loader, file-loader, etc)

### Plugins (lo, prefetchplugin)
Do more advanced things like reducing size of lodash, deduping code between libraries

# Config Props
1. Output: The name of the filename and path you would like your files output to, also where they will be served from (publicPath
2. Entry: The place where you want webpack to start compiling your code
3. Context: where to look for your entry file
4. devtool: generates a source map for development so that you can break
```
{
  context: resolve('src'),
  entry: './bain.js',
  output: {
    path: resolve('dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  devtool: 'eval' // only for development, super fast
  devtool: 'source-map' // only for production
}
```
# Transpiling

### Babel Loader
This is property on the module prop.  You need the `babel-loader, babel-core and babel-preset-2015` to use

```
{
  loaders: [
    { test: /\.js$/, loaders: ['babel'], exclude: /node_modules/ },
    { test: /what to grab/, loaders: ['apply last', 'apply second', 'apply first'], exclude: /dont want this done/ }
  ]
}
```

### Css loaders
Results in a js module, css is a string with Resolves images resolved to base64 or file

### Style Loader
Injects style from css loader into the dom

# Code Splitting
Load code only when it was needed - Minimize all of the

The way you lazy load code is using System.inport

```
System.import('./foo')
  .then(exportLoaded => exportLoaded.default)

//webpack, downside is there is no way to catch errors
require.ensure()
```



# Common JS Dependency Resolution
1. require() function, allows to import a module to current scope
2. module object, which is exported

### Exporting
in files, set what you are wanting to export onto `module.exports`

