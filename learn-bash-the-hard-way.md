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

### Functions
- Functions keep track of variables 1..n as part of $()
- Functions have access to all outer variables
- `local` allows you to declare a variable as being local to a function, it can only do so in a function  
  
```
function myfunc
{
echo $1
echo $2
}

myfunc
>
>

myfunc "HELLO"
> HELLO
>

myfunc hello world
> hello
> world

# Local Scope
function myfunc
{
echo $myvar
}

myfunc
> 
myvar="foo"
myfunc
> foo

# Local Scope
function myfunc
{
local myvar="inside!"
echo $myvar
}

myfunc
> inside!
myvar="foo"
echo $myvar
> foo
myfunc
> inside!
```

Bash has 4 ways to call commands in bash
- builtins: are things inside of bash, cd

```
builtin grep
> bash: builtin: grep: not a shell builtin

builtin cd
>

```
- functions: things you define, you can overwrite builtin and undefine your version with `unset`
  
You can see all the existing functions with `declare`

```
declare -f
> lists all the functions with their bodies

declare -F
> list all function names
```
  
- programs: executable files, like grep/sed/vi.  Determine where these are with `which`
  
```
which which
> /usr/bin/which
```  
  
- aliases: points one reference to a program/builtin/function  `alias foo=bar`

Type tells you how a command would be interpretted by the shell 

```
type ls 
> ls is /bin/ls

type pwd
> pwd is a shell builtin

type nonfunc
test.sh: line 3: type: nonfunc: not found
```

### Files and Redirections
- | send standard out of left to standard in of right
- |& send standard out and standard error of left to standard in of right
- simple file - a file that you would see in a folder (.txt)
- file descriptor - a number assiciated with the process that represents a file.  You write to a file descriptor and the OS takes care of ensuring the data goes where it should
- > creates a new file 
- >> appends 

  
In linux, each process gets 3 file descriptors by default
 - 0 (stdin), 1 (stdout), 2 (stderr)
 - by default stdout and stderr are linked to the terminal

So when you | and error, the | is only sending standard out to the next program, stderr goes to the terminal still

So when you call `cat file2` it errors and writes the results to it's standard error
  
- /dev/null is a special sink that will read any input and ignore it, think of it as a black hole 
- & will tell a descriptor to output to another file descriptor `2>&1` will cause stderr to output to stdout

  ```
mkdir redirects
cd redirects

# Send output of "contents of file1" into file 1
# this is a success so writes to stdout
echo "contents of file1" > file1
cat file1
> contents of file1
cat file1 | grep -c file
> 1

# this is an error and writes to the processes stderr file descriptor
cat file2
> cat: file2: No such file or directory

cat file2 | grep -c file
> cat: file2: No such file or directory
> 0

# redirection infers standard out, these two are equivalent
echo "foo" > bar.txt
echo "foo" 1> bar.txt

# you can pipe the error out to oblivion (never see it)
non_command
non_command 2> /dev/null

#### UNDERSTANDING 2>&1

# 2>&1 points stderr to whatever stdout was pointed to at the time

# when this command 2>&1 was used, stdout was pointed ot the terminal
# so standard error is pointed to the terminal from there on
$ command_not 2>&1 > outfile
> command_not: command not found
$ cat outfile
> # empty because outfile does not have anything due to output being redirected to terminal

# here the other is changed, by the time we get to 2>&1 stdout of command_not
# is pointed to outfile, so when we direct stderr to stdout there it is going to the outfile
$ command_not > outfile 2>&1
$ cat outfile
> command_not: command not found
```

#### Pipes vs redirects 

- pipes pass stdout as the stdin to another command 
- redirects send output from file descriptors to a file 

```
# redirect stdin from file1 to grep command
grep -c file < file1
> 1

# identical to 
cat file1 | grep -c file
> 1
```
