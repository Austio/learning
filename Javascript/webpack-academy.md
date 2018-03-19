### Webpack Exports Accepts a function

`yarn build — —env.foo=1`

```
module.exports = (env) => {
  console.log(env)
  return {
    entry: `./src_${env.foo}`
  }
}

// Console logs the object `{ foo: 1 }`
```

### Path Setting

Good idea to move path into a common file.

```
module.exports = {
  outputPath: path.join(__dirname, ‘..’, ‘dist')
}
```

### Node Debugging

debug-brk=> Will break at the first line and wait

## Plugins

### webpack.ProgressPlugin
Used to display what is taking a long time on build

### html-webpack-plugin from node
Generates a builer plate html file in dist will include script that webpack builds

### url-loader
Converts images/fonts into base64 strings.  Useful for small icons.

Have to balance bundle size vs network requests to load images.

```
rules: [{
  test: /\.png/,
  use: [{
    loader: ‘url-lodaer’,
    options: { limit: 12000 },
  }]
}]
```

### Webpack Dev Server

Express under hood - Emits bundles to memory and websocket requests on changes

### Style and CSS Loader

```
rules: [{
  test: /\.css/,
  use: [’style-loader’, ‘css-loader']
}]
```

### Extract text webpack plugin

For Production
 
Extract Text Plugin

```
const ExtractTextWebpackPlugin =require(‘extract-text-webpack-plugin’)

rules: [{
  test: /\.css/,
  use: ExtractTextWebpackPlugin.extract({
    use: 'css-loader’,
    fallback: ‘style-loader
  })
}]
```

### Uglify JS Plugin
beta and performance and bug fixes

new UglifyJsWebpackPlugin({ sourceMap: true })

### CompressionWebpackPlugin



## Debugging Slow Boot Times

