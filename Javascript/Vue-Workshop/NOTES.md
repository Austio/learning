
### Dep Tracking

```

// Does not account for conditionals and reruns properly
function autorun (update) {
  calledFunction = update;
  update()
  calledFunction = undefined;
}

// Does
function autorun (update) {
  function wrappedUpdate() {
    calledFunction = update;
    update()
    calledFunction = undefined;
  }

  wrappedUpdate()
}
```

### Plugins
  - $options all properties in the component and normalized that we can access
  
### Render Functions
 - [Vue Template Explorer](https://vue-template-explorer.now.sh/#%3Cdiv%20id%3D%22app%22%3E%7B%7B%20msg%20%7D%7D%3C%2Fdiv%3E)  
 - [Repo](https://github.com/yyx990803/vue-template-explorer)
 - [Docs](https://vuejs.org/v2/guide/render-function.html#The-Data-Object-In-Depth)
 
#### createElement 
 - can accept a component
 - referrenced as h
 - `h(MyComponent, { props: ... })`
  
#### Interface
 - this.$slots.default - array, all unnamed slots
 - this.$slots.foo - array, all slots named foo
 - this.$arrts - all the attributes (not props) 