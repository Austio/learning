## https://frontendmasters.com/courses/web-performance

## Main Concepts
- Doing nothing is better than doing something
- Doing something later is better than now

### Render Pipeline - All MainThread
 - Javascript
 - Style Calculation
 - Layout
 - Paint
 - Composite

### CSS

Css is compiled into the cssom.  It is not free
- class names (BEM) are better than complex selectors (.something vs '.sidebard > .ul:nth-child(4n:1)'

#### Avoid Reflows
Reflows are very expensive and main cause of bad performance on low end devices.  They block the loop and cause a repaint
- When Geometry of element changes, browser must reflow
- If you reflow an element, it reflows the children and then the parents

Reflow Causes:
- Window Resize
- Changing the Font
- Content Changes
- Add or remove a stylesheet
- Add or remove classes
- Add or remove element
- Changing orientation
- Calculating or Changing size or position

Preventing Reflow
- Change class at lowest level of dom tree
- Avoid repeatedly modifying inline styles
- Trade smoothness for speed when animating in js
- Avoid table layouts
- Batch DOM manipulations
- Debounce window `onresize` events

### Layout Thrashing (forced synchronous)
Occurs when js iteratively reads then writes to the dom

*Solution* Batch Reads, then Batch Writes

https://codepen.io/Austio/pen/qBWvXRb

```
// Before: Causes Thrashing because it is iteratively iterating on calculate style then change 
function doubleWidth(elm) {
  const width = element.offsetwidth;
  element.style.width = `${width * 2}px`;
}

boxes.forEach(doubleWidth)

// After: fixed
const widths = boxes.map((elm) => elm.style.width);
widths.forEach((width, i) => {
  boxes[i].style.width = `${width * 2}px`;
})

 
```