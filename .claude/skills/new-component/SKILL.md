---
description: Scaffold a new React component following project conventions.
disable-model-invocation: true
---

Create a new component with the name and purpose specified in $ARGUMENTS.

Follow these strict project conventions:
1. Create directory `src/components/<Name>/`
2. Create `src/components/<Name>/index.tsx` exporting a default component with interface `<Name>Props`.
3. Create unit test in `src/components/<Name>/<Name>.test.tsx` verifying basic rendering using Testing Library.