---
title: React Hooks 101 - useEffect
date: "2019-08-05"
description: "Learn how to use the useEffect hook"
---

Welcome to my second article about Reacts hooks. This article is about the `useEffect` hook. Without further ado, let's get started.

If you haven't read my first article about the `useState` hook, you can do it here: https://martinnordstromblog.netlify.com/hooks-101-useState/

---

### Getting started

If you want to follow along you can copy and paste this line into the terminal (Assuming you have the `create-react-app` CLI installed):

```
create-react-app react-hooks-101-useEffect && cd react-hooks-101-useEffect && yarn start
```

When you have that setup you can paste this into your favorite IDE:

```jsx
import React, { useEffect } from "react"

const App = () => {
  useEffect(() => {})

  return <div>Learning hooks</div>
}

export default App
```

To summarize what the `useEffect` hook is for, we can say that every time the component is being rendered or re-rendered the function (`() => {}`) within `useEffect` will be called. We can also decide how much the function will be called.

So, by adding a `console.log` and a state to update we can see how many times our `useEffect` is being rendered.

```jsx
import React, { useEffect, useState } from "react"

const App = () => {
  const [input, setInput] = useState("")

  useEffect(() => {
    console.log("I'm being rendered")
  })

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
    </div>
  )
}

export default App
```

If you type stuff into the input you can see that the function inside `useEffect` is being called for each time you update the state.

If you are uncertain about how `useState` works, you can learn about it more here: https://martinnordstromblog.netlify.com/hooks-101-useState/

### Dependencies

`useEffect` also provides an optional second argument, which is called _dependencies_ and that is an array. That argument allows use to _skip_ calling the function if certain values haven't been changed. To demonstrate this, we could add a second input and pass its value to `useEffects` _dependencies_.

```jsx
import React, { useEffect, useState } from "react"

const App = () => {
  const [inputs, setInputs] = useState({ email: "", password: "" })

  useEffect(() => {
    console.log("I'm being rendered when the password value changes")
  }, [inputs.password])

  return (
    <div>
      <input
        name="email"
        placeholder="Email"
        value={inputs.email}
        onChange={e => {
          e.persist()
          setInputs(curr => ({ ...curr, email: e.target.value }))
        }}
      />
      <input
        name="password"
        placeholder="Password"
        value={inputs.password}
        onChange={e => {
          e.persist()
          setInputs(curr => ({ ...curr, password: e.target.value }))
        }}
      />
    </div>
  )
}

export default App
```

We will get a `console.log` on the initial render, but when we type in the emails field no additional logs are showing up. That's because `inputs.password` value hasn't changed. But when we type in the password field we can see the logs being fired.

Also worth noting is that we can put many more values into `useEffect`s _dependencies_ and we could also put this: `[]`.

```jsx
import React, { useEffect, useState } from "react"

const App = () => {
  const [inputs, setInputs] = useState({ email: "", password: "" })

  useEffect(() => {
    console.log("I'm only being rendered on the initial render")
  }, [])

  return (
    <div>
      <input
        name="email"
        placeholder="Email"
        value={inputs.email}
        onChange={e => {
          e.persist()
          setInputs(curr => ({ ...curr, email: e.target.value }))
        }}
      />
      <input
        name="password"
        placeholder="Password"
        value={inputs.password}
        onChange={e => {
          e.persist()
          setInputs(curr => ({ ...curr, password: e.target.value }))
        }}
      />
    </div>
  )
}

export default App
```

Now, this will only render on the initial render and the function won't be called any other time. Why? Well, since an empty array is just an empty array. It won't change. You can think about this as the `componentDidMount` lifecycle method.

### Cleanup

The `useEffect` hook can also return a (optional) function, also called the `cleanup function`. That function will be every time the component unmounts.

We can see this by adding another component that we will conditionally render. Every time we unmount `Div` our _cleanup function_ will be called.

```jsx
import React, { useEffect, useState } from "react"

const Div = () => {
  useEffect(() => {
    console.log("I'm being rendered")

    return () => console.log("I have been unmounted")
  }, [])

  return <div>I'm a div</div>
}

const App = () => {
  const [show, setShow] = useState(true)

  return (
    <>
      {show && <Div />}
      <button onClick={() => setShow(!show)}>Toggle</button>
    </>
  )
}

export default App
```

The _cleanup function_ will also be called every time the values in our _dependencies_ updates (assuming we have one).

```jsx
const App = () => {
  const [inputs, setInputs] = useState({ email: "", password: "" })

  useEffect(() => {
    console.log("I'm being on the initial render")

    return () => console.log("I have been unmounted")
  }, [inputs.password])

  return (
    <div>
      <input
        name="email"
        placeholder="Email"
        value={inputs.email}
        onChange={e => {
          e.persist()
          setInputs(curr => ({ ...curr, email: e.target.value }))
        }}
      />
      <input
        name="password"
        placeholder="Password"
        value={inputs.password}
        onChange={e => {
          e.persist()
          setInputs(curr => ({ ...curr, password: e.target.value }))
        }}
      />
    </div>
  )
}

export default App
```

### Multiple useEffects

Similar to `useState` we can have multiple `useEffect`s in our component and they will run in order.

```jsx
import React, { useEffect } from "react"

const App = () => {
  useEffect(() => {
    console.log("useEffect 1")
  }, [])

  useEffect(() => {
    console.log("useEffect 2")
  }, [])

  return <div>Learning hooks</div>
}

export default App
```
If we check our console we can see that `useEffect 1` shows up before `useEffect 2`.

### Custom hooks with useEffect

Now when we know some basic usage with `useEffect` I'd like to show you how we can create our custom hooks that can be used in real-world applications.

One of which are events. We, front-end developers, stumble upon events pretty often. When using events we first need to add an `eventListner` and then remove it when our component unmounts. Before we had to use multiple lifecycle methods to achieve this which we **couldn't** (without render props) share easily between components. But thanks to the `useEffect` hook we can write something like this:

```jsx
import { useEffect } from "react";

export const useEventCallback = ({
  eventName,
  callback,
  element = window,
  active = true
}) => {
  useEffect(() => {
    if (active) {
      element.addEventListener(eventName, callback);

      return () => {
        element.removeEventListener(eventName, callback);
      };
    }
  }, [eventName, callback, element, active]);
};
};
```

Here we have a fully reusable event callback hook that we can use inside our functional components. It takes:

- `eventName` - such as `keydown`, `mousemove` etc.
- `callback` - will be run when the event occurs.
- `element` - when changed it will run our function.
- `active` - to see if our event is still active. Let's us avoid adding the event listener if false.

We could use our `useEventCallback` hook like so:

```jsx
import React from "react";
import { useEventCallback } from "./useEventCallback";

const App = () => {
  const onMouseMove = event => console.log(event);

  useEventCallback({ eventName: "mousemove", callback: onMouseMove });

  return <div>Learning hooks</div>;
}

export default App;
```

Try moving your cursor around on the screen and see how your console is being destroyed by console logs.

Another thing we often do is fetching data. We could make a `useFetch` hook for that as well. It could look like this:

```jsx
import { useState, useEffect } from "react";

export const useFetch = url => {
  const [state, setState] = useState({ data: null, loading: true });

  useEffect(() => {
    setState(currState => ({ data: currState.data, loading: true }));
    fetch(url)
      .then(a => a.json())
      .then(b => setState({ data: b, loading: false }))
  }, []);

  return state;
}
```
- `url` - the url we want to fetch data from.

And use it like this:

```jsx
import React from "react";
import { useFetch } from "./useFetch";

const App = () => {
  const randomDigit = Math.floor(Math.random() * 104 + 5);

  const { data } = useFetch(
    `https://api.giphy.com/v1/gifs/search?api_key=dppowCiYXsJgxcuSgfRf4CGWqx2onwuo&q=fail&limit=1&offset=${randomDigit}&rating=PG&lang=en`
  );

  return (
    <div>{!data ? "" : <img src={data.data[0].images.downsized.url} />}</div>
  );
};

export default App;
```

There we have it! That's a little introduction to `useEffect` and some stuff you can do with it. I hope you will enjoy `useEffect` as much as I do with its flexibility and its new way to fetch data, work with event listeners, etc.

### Last Remarks

Thanks for reading my article! I hope you've found it helpful. This is the second part of my “React Hooks 101" series. Next article will be about `useRef`. So please follow on my other social media platforms to get news about the upcoming articles!

[Instagram](https://instagram.com/martinnordstromcode)
[Twitter](https://twitter.com/martinnrdstrm)
[Github](https://github.com/martinnord)
