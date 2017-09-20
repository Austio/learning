## Resources
 - whichloadsfaster.com 
 - webpagetest.org
 - [Acceptable Performance Study](http://www.useit.com/papers/responsetime.html)
 - [Middle End - JS, Caching, Ajax](http://middleend.com)
 - [JS Compression Options](http://compressorrator.thruhere.net)
 
## Concepts
 - Measurement vs Perception - balance your measurement
 - Efficiency - Speed vs Memory (bandwidth)
 - Performance - Benchmark and Optimize, you *must* quantify these and do user studies
 - Optimize the Critical Paths - NonCritical optimization is root of all evil, immature optimization is the root of all evil
 - Speed, 100ms response is perceived as instantaneous - 1000ms perceived delay
 - Inefficiency is Systemic
 - Take a 'Performant by Default'
 
# Middle End
 
## YSLOW
  - Fewer HTTP Requests ( or deferred )
  - CDN
  - Expires/Cache-Control Header
  - GZIP
  - Stylesheets at top
  - Scripts at bottom
  - Avoid CSS Expressions
  - Externalize JS and CSS
  - Fewer DNS Lookups
  - Avoid Redirects
  - Avoid Duplicate Scripts
  - ETags (fingerprinting files)
  - Cachable AJAX
  
## Resources (JS, CSS)
 - When inlining, think about the life of the image vs life of the css.  IF the image will be far longer than the css then inlining does not make as much sense
 
 
 
 
 
 

 