### Resources
- [sonarwhal.com](Microsoft public scanner)

### History
 - [Live Dom Viewer](https://software.hixie.ch/utilities/js/live-dom-viewer/)
 - Firebug
 - [Chrome](https://developers.google.com/web/tools/chrome-devtools/)
 
### Tips
 - h on an element will hide it in html view 
 
 Left off mid 1-1

## Frontend Masters Chrome Tools Course 
(Stuff)[[https://frontendmasters.com/courses/chrome-dev-tools-v2]
(Slides)[https://slides.com/jkup/devtools/#/]

(DemoSite)[masteringdevtools.com]
(Github)[git@github.com:jkup/mastering-chrome-devtools.git]

### Chrome Debugger

#### *BlackBoxing*
 - In any script in a call stack, you can right click and select blackbox, that tells chrome to not step in/out of that b/c it is framework code.
 - In settings(three dots) , you can permanently blacklist a script.
 
#### Conditional Breakpoint
 - when you add a breakpoint, right click and select conditional breakpoint.  This will give you an expression to only break on

#### XHR Fetch/Breakpoints
 - Can do a break any time you hit a url that fits a pattern
 
#### Network Tab
 - Look at ttfb as the reason something is being slow.
 - queueing means that you have hit the limit of simultaneous resources to download (6) and have to wait to get another one
 
#### Node Inspector
 - You can run this on webpack to profile! 
  