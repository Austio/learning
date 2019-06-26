## Good Babel Plugins

babel-lodash-plugin =>
  import _ from ‘lodash’ to import _map from ‘lodash/map’

babel-plugin-module-alias => 
  '../../../../utils/foo.js' to <util>/foo.js

## What is an AST Resources

 - [View Parsed AST](resources.jointjs.com/demos/rappid/apps/Ast/index.html])
 - [View Generated AST Super Awesome****](astexplorer.net)

In astexplorer you can write patterns straight in the browser.
 - select espree as parser
 - eslint vX as your output

### Visitor Pattern

module.exports = {
    meta: {
        docs: {
            description: "disallow direct lodash imports",
            category: "Possible Errors",
            recommended: true
        },
        fixable: "code",
        schema: [] // no options
    },
    create: function(context) {
        return {
          ImportDeclaration(node){
            if (node.source && node.source.value !== 'lodash') return;
            
            context.report({
              node: node,
              message: 'Prefer cherry picking from lodash like `import _get from "lodash/get"`'
            })
          }
        }
    }
};
