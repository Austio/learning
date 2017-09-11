
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