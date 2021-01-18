## Learn Bash the Hard Way

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
