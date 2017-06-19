# Instructions

1. In this exercise, you will revisit your work from exercise 2 (the note taking app). You will need to copy in your fixed code from "ex2.js" (or "ex2-fixed.js") into the "ex3.js" file, as your starting point.

2. Using what you learned about `prototype` to construct an object instance, modify your previous code to not use module/encapsulation pattern, but instead create a `this` based object. Your public API should stay the same from exercise 2 (although everything will be public now). The main difference will be that you have a constructor function called "NotesManager" (or whatever), and then you will need to create an instance of that object, and can call it something useful, like "myNotes".

3. Pay particular attention to your event handlers and what we learned about how `this` gets reassigned. What have we learned about how to fix that?

4. Because a `this` based object does not have "private" (encapsulated) data, your data will be publicly available on the instance, as well as all your helper methods. How does this change the maintainability and robustness of your code and implementation?

5. What benefits do you see to structuring your code this (`prototype`-based) way? What are the tradeoffs?
