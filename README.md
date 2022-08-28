# use-tiny-state


[![npm version](https://badge.fury.io/js/use-tiny-state.svg)](https://badge.fury.io/js/use-tiny-state)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/poteboy/use-tiny-state/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/poteboy/use-tiny-state/tree/main)


> tiniest global state management library you can use anywhere in your application🤞

- The difference from useState is that it is component-independent and can be referenced and updated from anywhere in the application.
- Also, when a state is updated, unlike context-based global state management library, re-rendering is performed only by the component that uses the state.

## Install

```bash
yarn add use-tiny-state
```

## Example

```tsx
import React from "react";
import { makeState, useTinyState } from "use-tiny-state";
import { render } from "react-dom";

const _count = makeState(0);

function App() {
  const [count] = useTinyState<number>(_count);

  return (
    <div>
      <button onClick={() => _count(count + 1)}>countUp</button>
      <div>{count}</div>
    </div>
  );
}

render(<App />, document.getElementById("root"));
```
