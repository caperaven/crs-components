# disableChildTabbing

## Introduction
This function disables child elements from being tab stoppable by setting the tabindex = -1.  
Though this affects all the children of the given element it is not recursive.
Additionally, you can also set the role of the children.  
If you don't want to change the role, leave the childRole parameter as undefined or null.

Parameters are

1. element (HTMLElement) - the element who's children to affect.
1. childRole (string) - the role value to set on the role attribute of the children.

This function is found in "/components/lib/element-utils.js"