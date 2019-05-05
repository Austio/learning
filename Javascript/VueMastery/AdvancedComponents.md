![Vue Reactivity Call Stack](./img/VueReactivityCallStack.png)

![Vue Watcher Class](./img/VueWatcherResponsibilities.png)
![Vue Watcher Class](./img/VueWatcherClass.png)
![Vue Watcher Class](./img/VueWatcherDep.png)

### Reactivity
In order to make reactivity work we creat an observer object (dep) with notify and subscribe.  The subscribe occurs when items are being computed and collected.  The are notified when the item that subscribed updates.

Implement the `tinyVue.spec.js`

### Template Compilation

![Template Compilation](./VueRenderingAndLifecycle.png)
![Template Mounting/Reactivity](./VueRenderingAndMounting.png)
![Template Mounting/Reactivity](./VueRenderingAndReactivity.png)
![Template Mounting/Reactivity](./VueRenderingAndReactivity2.png)
![Template Mounting/Reactivity](./VueRenderingAndReactivity3.png)

Step 1 Compilation
 - Template to a render function

Step 2 Run render function
 - render function to vnode
 - vnode patch to dom
