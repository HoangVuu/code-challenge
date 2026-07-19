# Problem 3: Messy React — Analysis & Refactored Code

## Computational Inefficiencies and Anti-Patterns

### 1. Missing `blockchain` Property in `WalletBalance` Interface
The `WalletBalance` interface does not include a `blockchain` property, yet `balance.blockchain` is accessed in the code. This causes a TypeScript compilation error.

### 2. Use of `any` Type in `getPriority`
```ts
const getPriority = (blockchain: any): number => { ... }
```
Using `any` defeats the purpose of TypeScript's type safety. It should use a specific string literal union type or at minimum `string`.

### 3. Undefined Variable `lhsPriority`
```ts
const balancePriority = getPriority(balance.blockchain);
if (lhsPriority > -99) { // ❌ lhsPriority is never defined
```
The variable `lhsPriority` is referenced but never declared. It should be `balancePriority`.

### 4. Inverted Filter Logic
```ts
if (balance.amount <= 0) {
  return true;
}
```
The filter keeps balances with **zero or negative** amounts, which is almost certainly the opposite of the intended behavior. It should keep balances where `amount > 0`.

### 5. `getPriority` Recreated on Every Render
`getPriority` is a pure function defined inside the component. It is recreated on every render and, because it's a new reference each time, it could trigger unnecessary recalculations if passed as a dependency. It should be moved **outside** the component since it has no dependency on props or state.

### 6. `useMemo` Has Unnecessary Dependency (`prices`)
```ts
useMemo(() => { ... }, [balances, prices]);
```
The `prices` variable is not used inside the `useMemo` callback, yet it's listed as a dependency. This causes `sortedBalances` to be recalculated every time `prices` changes, even though the result wouldn't differ. This is a computational inefficiency.

### 7. Sort Comparator Does Not Return a Value for Equal Elements
```ts
.sort((lhs, rhs) => {
  if (leftPriority > rightPriority) return -1;
  else if (rightPriority > leftPriority) return 1;
  // ❌ no explicit return 0
});
```
When priorities are equal, the comparator returns `undefined` instead of `0`. This leads to unpredictable sort behavior across JavaScript engines.

### 8. `formattedBalances` Is Computed but Never Used
```ts
const formattedBalances = sortedBalances.map(...); // computed
const rows = sortedBalances.map(...);              // uses sortedBalances, not formattedBalances
```
The `formattedBalances` array is calculated but then `rows` iterates over `sortedBalances` instead. This is both a wasted computation and a bug—`balance.formatted` will be `undefined` in the `rows` mapping.

### 9. Type Mismatch in `rows` Mapping
```ts
const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => { ... })
```
`sortedBalances` contains `WalletBalance` objects, not `FormattedWalletBalance`. The type annotation is incorrect and masks the missing `formatted` property.

### 10. Using Array Index as React `key`
```tsx
key={index}
```
Using the array index as a key is an anti-pattern when the list can be reordered, filtered, or modified. It leads to incorrect component reuse and potential UI bugs. A unique identifier like `balance.currency` should be used instead.

### 11. `formattedBalances` and `rows` Are Not Memoized
Both `formattedBalances` and `rows` are recalculated on every render, even when their inputs haven't changed. They should either be combined into the existing `useMemo` or wrapped in their own memoization.

### 12. `children` Destructured but Never Used
```ts
const { children, ...rest } = props;
```
`children` is extracted from props but never rendered or passed anywhere. This is dead code.

### 13. Empty `Props` Interface
```ts
interface Props extends BoxProps {}
```
An empty interface that only extends another is unnecessary boilerplate. `BoxProps` can be used directly.

### 14. `classes.row` Is Undefined
`classes` is never defined or imported in the component. This will cause a runtime error.

---

## Refactored Code

See `refactored.tsx` for the complete refactored implementation.
