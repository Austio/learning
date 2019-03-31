1. Controlled Components:
 - Does not have any of its own state
 - Value of child is controlled by the parent (passed via v-model)
 - Communicates new state through events

2. Customizing VModel
 - VModel is sugar for `:value="x" @input="handleInput"`
 - You can customize controlled components to emit names that are more clear for what they are doing
 - Example below, emits `toggle` and value of `toggled` but is able to communicate with vmodel using regular input/value

![Customizing VModel](./images/02_customizing_vmodel.png)
