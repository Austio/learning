# Instructions

1. In this exercise, you will practice what you learned about creating an object that "inherits from" (aka, "delegates its behavior to") another object. The "ex4.js" file provides you a simple definition for a `Widget` object, as well as the start of a `Button` object.

2. Finish out the definition of the `Button` object:
  - define `Button` so that it "inherits from" (aka "delegates to") `Widget`.
  - the Button constructor should have a `width`, `height`, and `label` parameter passed to it.
  - uncomment the Button's `render` and `onClick` function shells, and correctly define them.
  - make the `onClick` handler print with the console "Button ___ clicked!", where "___" is that particular button's label

3. Uncomment the `$(document).ready(..)` handler at the bottom of the file, and correct the instantiations of the two button objects, so that they create buttons with 2 different sizes and labels.

4. BONUS: The code given to you is clearly in the "old style" function/constructor/new style of defining objects and "inheritance". Using what we learned about OLOO-style code with `Object.create()`, rewrite the code using behavior delegation and OLOO-style. Hint: don't think of parent/child, think of two peer objects, one who delegates to the other.
