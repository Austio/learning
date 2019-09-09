### Reports
 - title
 - severity
 - description
 - reproduction
 - impact
 - mitigation
 - affected urls

### Click Jacking
Embedding transparent iframe on a page over top of an area to click.  Can tell if you click on something and it doesn't do anything.

### Null Termination Bugs
The null byte terminates strings in c, you can take advantage of this for php, ruby, python when they are using dynamic includes

Allows you to truncate strings at will, really vulnerable to 

 - `?page=/etc/password%00`

### Injection
 - path injection - using . and .. to upload or read from system
 - command injection - using ``


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
