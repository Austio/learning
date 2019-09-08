### [Defeating XSS with Content Security Policy](https://app.pluralsight.com/library/courses/c478106f-5ffb-4c65-9bf5-af49b0815c61/table-of-contents)

#### Concepts

##### Affects
 - Inline scripts do not work (<script>...)
 - Javascript cannot be loaded from external domains
 - Javascript code cannot use eval
 

##### XSS
At it's core, html is text that is parsed.  When you close a bracket you close the last tag and start another and that is the root of xss.

Examples with q query param
 - root: <input type="text" value="<%= q %>
 - <input type="text" value="<%=  %>
 - q: `" onmouseover="alert(1)"`
  - <input type="text" value="" onmouseover="alert(1)" />
 - q: `"> <script>alert(1)</script>`
  - <input type="text" value="" "> <script>alert(1)</script> />
 
##### JS Security Model (Same Origin)
 - origin:  protocol + domain + port (http://google.com:80)
 - origin of javascript code (yours, jquery, etc) is always the origin of the html page that included or loaded your script 
 
#### What

Header + Directives
 
- Content-Security-Policy: default-src='self'; img-src='...'
 - 'self' = current origin
 - 'unsafe-inline' = anything that is inlined
 - 'unsafe-eval' = loaded lazily

![CSP v1](./img/content-security-policy-v1.png)
 - default-src: sets value that all children will inherit from
 - report-uri: tells you when something has violated
 - object-src: java applets, flash, etc
 - connect-src: where can js connect to (ajax, etc) can limit scheme, url and port or any subset of them
 
 
 