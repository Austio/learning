## Rules

|On Quotes||
|---|---|
|'" - Quotes|Surrounding words with quotes allows you to have whitespace|
|\` backticks| are evaluated by the shell|
|$() are equivalent to backticks||
|\ backslash| escapes characters, this also works with literals like ^V (tab)|


```
~$ echo 'Home is $HOME'
 >Home is $HOME
~$ echo "Home is $HOME"
 >Home is /home/username
~$ echo "Home is \$HOME"
 >Home is $HOME
~$ echo `Home is $HOME`
 >Command 'Home' not found, did you mean:...
```

!! - rerun previous command in history
!$ - is the last parameter from previous command
```
ls x*
rm !$ -> equivalent to: rm x*
```
!* - all parameters from previous command
