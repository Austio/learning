# Instructions

1. This exercise calls for you to write some async flow-control code to more properly handle the provided callback mess as shown in "ex5.js".

2. Expected behavior:
	- Request all 3 files at the same time (in "parallel").
	- Render them ASAP (don't just blindly wait for all to finish loading)
	- BUT, render them in proper (obvious) order: "file1", "file2", "file3".
	- After all 3 are done, output "Complete!".

3. Use either native promises, the *asynquence* lib (provided), or your own favorite async/promises library/utility.
