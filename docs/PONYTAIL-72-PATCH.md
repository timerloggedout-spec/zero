# Stale ponytail comment fix (upstream #72)

Prepared by timerloggedout-spec help-wanted lane.

## Flex (`layout_flex_children`)

Replace:

```text
ponytail: no wrapping, no `flex-grow/shrink/basis`, no `justify-content` or
`align-items`, and no intrinsic content sizing.
```

With:

```text
ponytail: `flex-wrap`, `justify-content`, `align-items`, `align-self`, and
`flex-grow` are read. Still missing: `flex-shrink`, `flex-basis`, and
intrinsic content sizing.
```

## Grid (`layout_grid_children`)

Replace:

```text
ponytail: no named lines, `grid-area`, `auto-fit/minmax`, or alignment.
```

With:

```text
ponytail: `grid-template-areas` and `minmax()` are read; named lines,
full `grid-area` shorthand, and `auto-fit`/`auto-fill` sizing are not.
```

Apply on `crates/zero-engine/src/layout.rs` and open PR against vedantnimbarte/zero.
