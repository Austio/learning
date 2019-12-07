Vue 3 Essentials

```
import { ref, reactive, toRefs } from '@vue/composition/api'
```

### ref

Ref `a` is a reactive object, it is not a primative.  So when you accessing in any script (setup, methods, etc
 - scripts: access and change `a.value`
 - template: access {{a}}

```
<template>
  <!-- in a template, vue will see this is a ref and expose its value property -->
  <div>{{a}}</div>
</template>

<script>
  const a = ref(3)
  // anywhere out of a template, you must access the value on the object
  // will fail, a is not a primative it is a reactive reference
  a++
  
  // will work b/c it is a reactive reference
  a.value++
</script>
```

### reactive

React creates a reactive object in the same way we are used to from vue components.  
  - You do not have to call `.value` on these objects
  - You cannot destructure them
  
###  toRefs

Converts a reactive object into references that can be accessed individually  

### lifecycles
- most things are converted to `on+lifecycle` `onBeforeMounted`
- There is not beforeCreated or created because they are called immediately before and after setup, so you can just do them in setup

### new Lifecycles
 - onRenderTracked - Used for when a dependency is first added to a tracker
 - onDependencyTracked - When a dep caused a rerender
 
