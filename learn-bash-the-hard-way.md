## Learn Bash the Hard Way

 - ${} will dereference whatever is inside of it

### Globbing and Quoting

* -> converts into the string that is the list of all files in the directory

```bash
$ touch file1 file2 file3
$ ls *
$ echo *

# * above converts to the string "file1 file2 file3" and equivalent to this
$ ls file1 file2 file3
$ echo file1 file2 file 3  
```  

Glob Patterns
 - ? - any single character
 - [abd] - any character from the group abd
 - [a-d] - any character from the group abcd 
 - . has no special significance, it is the . character


From the above 
```
ls *1 # all that end in 1
ls f* # all that begin with f 
ls file[a-z] # all that start with file and then end in a-z
```

dot files do not show up in ls type things
```
# touch .adotfile
# mkdir .adotfolder
# touch .adotfolder/file1
# touch .adotfolder/.adotfile

ls # doesn't show dot files
ls * # doesn't show dot files
echo .* # will show all the files beginning with .
```

* has different significance in regex vs glob 

```
rename -n 's/(.*)/new$1/' *
# Would rename all files to new*
# the * here is interpretted by rename because it is in single quotes, sh would only interpret i fit is in " or outside of the rename
# the second * is a glob interpretted by sh
```
 
Takeaways
 - '.' has no meaning in glob

### Variables
  
 - PPID -> Containts Bashs parent process id  
 - `readonly` can set read only variables readonly FOO=bar
 - `unset` will remove a varilable
 - `export` sets a variable in the global  
 - `compgen` list of possible word completions for tabs
  
```
# - = Assigns 
# - $ dereferences variables
# - convention is capitalized 

$ FOO=bar
$ echo FOO
FOO
$ echo $FOO
bar

# The shell reads words separated by space, so you must quote
$ MYSENTENCE=A sentence
sh: 4: sentence: not found
$ MYSENTENCE="A sentence"
$ echo $MYSENTENCE
A sentence

# Shell only interpolates in double quotes
$ WORD="word"
$ SENTENCE="Many $WORD"
$ echo $SENTENCE
Many word

# Notice Single Quotes are not interpolated
$ SENTENCE='Many $WORD'
$ echo $SENTENCE
Many $WORD

# This is not true of globs, they are evaluated normally
$ MYGLOB=*
$ echo $MYGLOB
file1 file2 file3

$ MYGLOB="*"
$ echo $MYGLOB
file1 file2 file3

$ MYGLOB=*
$ echo $MYGLOB
file1 file2 file3

$ MYGLOB='*'
$ echo "$MYGLOB"
*
$ echo '$MYGLOB'
$MYGLOB
$ echo $MYGLOB
file1 file2 file3

# Unset
$ FOO=bar 
$ echo $FOO
bar
$ unset FOO
$ echo $FOO

# export
$ echo $EXPORTED

$ export EXPORTED=alive
$ bash
$ sh
$ echo $EXPORTED
alive
```

### Arrays
  
- Bash prints the first element if no index is given
- square brackets at the end don't work because square brackets are interpreted as a string, not reference to items in the array
- Have to tell bash to treat whole string ARRAY[0] as the variable to be dereferenced, can do this by using the curly brace 
  
```
$ bash --version
GNU bash, version 5.0.17(1)-release (x86_64-pc-linux-gnu)
Copyright (C) 2019 Free Software Foundation, Inc.
  License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>

This is free software; you are free to change and redistribute it.
  There is NO WARRANTY, to the extent permitted by law.
  $ echo $BASH_VERSINFO
5
$ echo $BASH_VERSINFO[0]
5[0]
$ echo ${BASH_VERSINFO[0]}
5
$ echo ${BASH_VERSINFO}
5
$ echo $BASH_VERSION_and_some_string

$ echo ${BASH_VERSION}_and_some_string
5.0.17(1)-release_and_some_string

# All Bash Variables are arrays

$ echo ${BASH_VERSINFO[1]}
0
$ echo ${BASH_VERSINFO[2]}
17
$ FOO=bar
$ echo ${FOO[2]}

$ echo ${FOO[1]}

$ echo ${FOO[0]}
bar
```
