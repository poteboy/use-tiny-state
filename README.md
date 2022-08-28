# use-tiny-state

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/poteboy/use-tiny-state/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/poteboy/use-tiny-state/tree/main)

> tiniest global state management library you can use anywhere in your application🤞

## Install

```bash
yarn add use-tiny-state
```

## Example

```tsx
import React from "react";
import { makeState, useTinyState } from "use-tiny-state";
import { render } from "react-dom";

const count = makeState(0);

function App() {
  const [_count] = useTinyState<number>(count);

  return (
    <div>
      <button onClick={() => count.set(_count + 1)}>countUp</button>
      <div>{_count}</div>
    </div>
  );
}

render(<App />, document.getElementById("root"));
```
