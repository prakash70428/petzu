# Features

Each subfolder here is a self-contained domain slice (e.g. `features/shop`,
`features/community`, `features/auth`). A feature owns everything specific
to its domain:

```
features/shop/
  components/   # UI only this feature uses
  hooks/        # stateful logic only this feature needs
  services/     # API calls scoped to this feature
  types.ts      # domain types
  constants.ts  # domain constants
```

Anything reused by two or more features gets promoted out to the top-level
`components/`, `hooks/`, `services/`, or `types/` folders instead of living
here. This keeps feature folders deletable: removing a feature should never
break unrelated code.

No features exist yet — this is foundation-only scaffolding.
