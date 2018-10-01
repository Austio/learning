### Chapter 6 - Method and Constant Lookup

 - Ruby implements inheritance using the `super` pointer in `RClass`

#### Modules

A ruby module
- is an object
- contains method definitions
- has a superclass pointer 
- has a constants table

Different from classes in that
- can't instantiat from them, new doesn't exist on Module
- can't specify superclass
- includable into classes

Implemented using RClass/rb_classext_struct but can't use refined_class, allocator or super
![Modules RClass/rb_classext_struct](img/06_Modules_RClass_structure.png)


 