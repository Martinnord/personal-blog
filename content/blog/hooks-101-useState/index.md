---
title: React Hooks 101 - useState
date: "2019-07-30"
description: "Learn how to use the useState hook"
---

This is my very first post on my new blog. I'm going to start it with creating a series where I explain all the different hooks within React. Not only how to use them, but also the advantages they have over class components.

Starting with, `useState`.

---

### Getting started

If you want to follow along you can copy and paste this line into the terminal (Assuming you have the `create-react-app` CLI installed):

```
create-react-app react-hooks-101-usestate && cd react-hooks-101-usestate && yarn start
```

This is our starting point:

```jsx
import React from "react";

const App = () => {
  return <div>Learning hooks</div>;
};

export default App;
```

### Some gotchas

There are a couple of rules you need to follow when using hooks. I'm going to go over some of them real quick, but you can read more about them here: https://reactjs.org/docs/hooks-rules.html

Here are some of them:

- Hooks can **only** be used within functions. They won't work with class components.
- You cannot call hooks inside conditions, loops or nested functions. You **need** to have them at the top level of your functional component (see below).

```jsx
import React from "react";

const App = () => {
    const myCondition = true;
    if (myCondition) {
        React.useState(...); // React Hook "React.useState" is called conditionally. React Hooks must be called in the exact same order in every component render.
    }

    return <div>Learning hooks</div>;
};

export default App;
```

### What is useState?

`useState` lets us turn our otherwise non-stateful/functional components to one that can have its own state.

### How to use it

The first paramater in `useState` is the inital value(s). Just like we define initial value(s) for our state in class components.

Below is an example where the initial value is `42`.

```jsx
import React, { useState } from "react";

const App = () => {
  useState(42);

  return <div>Learning hooks</div>;
};

export default App;
```

We can also have a function that returns the initial value(s), which still is `42` in this case.

```jsx
import React, { useState } from "react";

const App = () => {
  useState(() => 42);

  return <div>Learning hooks</div>;
}

export default App;
```

The reason we would use a function to return the initial value(s) is if we had an expensive computation. Meaning we were to have a function that has many if statements, loops, much data, etc. We could call it like this,

```jsx
import React, { useState } from "react";

const heavyFunc = () => {
    ...
    return biggestBlopEver;
};

const App = () => {
    useState(() => heavyFunc());

    return <div>Learning hooks</div>;
};

export default App;
```

This will only be called on the **first render** and not on every single re-render.

To utilize `useState` we need to create some variables. Note that `useState` returns an array. The reason for that is so we can name our variables whatever we want. Whereas if it had been an object we couldn't.

See more here if you are uncertain about destructuring: https://www.vojtechruzicka.com/destructuring-javascript/

The first value is the _value_ of the state and the second value will be the _setter function_. In this example, we will be creating a simple counter.

```jsx
import React, { useState } from "react";

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div>{count}</div>
      <div>
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
    </div>
  );
};

export default App;
```

Also worth noting is that we can pass in an _updater function_, similar to `this.setState(currState => {...})`. The _updater function_ will take a single parameter (which is the current state) and let us use it. Like this:

```jsx
<button onClick={() => setCount(currCount => currCount + 1)}>+</button>;
```

To save us some headaches we need to know that `useState` **doesn't** do any _merging_. You might be familiar with something like this:

```jsx
import React, { Component } from "react";

class App extends Component {
  state = {
    countOne: 0,
    countTwo: 42,
  };

  render() {
    const { countOne, countTwo } = this.state;
    return (
      <div>
        <div>Count One: {countOne}</div>
        <div>Count Two: {countTwo}</div>
        <div>
          <button
            onClick={() => {
              this.setState(currState => ({
                countOne: currState.countOne + 1,
              }));
            }}
          >
            Update count one
          </button>
        </div>
      </div>
    );
  };
};

export default App;
```

Here we have two properties in our state, `countOne` and `countTwo`. When we click the button our `countOne` will be incremented with +1 and our `countTwo` will stay the same. But in hooks, it works differently. Here's an exact copy of the code above written with hooks.

```jsx
import React, { useState } from "react";

const App = () => {
  const [{ countOne, countTwo }, setCounts] = useState({
    countOne: 0,
    countTwo: 42,
  });

  return (
    <div>
      <div>{countOne}</div>
      <div>{countTwo}</div>
      <button
        onClick={() => {
          setCounts(currCounts => ({
            ...currCounts,
            countOne: currCounts.countOne + 1,
          }));
        }}
      >
        +
      </button>
      {/* OR */}
      <button
        onClick={() => {
          setCounts(currCounts => ({
            countTwo: currCounts.countTwo + 1,
            countOne: currCounts.countOne + 1,
          }));
        }}
      >
        +
      </button>
    </div>
  );
};

export default App;
```

So when we store objects in our state using `useState`, we either need to spread the state (`...`) or provide all the keys for our _updater function_. You can try to remove the line,

```js
...currCounts,
```

to see what happens when there's no merging. We will just set the values that our _updater function_ has and all other values within our state will be overridden.

### Mulitple useStates

We can have how many `useState`s as we want. Instead of storing an object that contains two counts, we could write this:

```jsx
import React, { useState } from "react";

const App = () => {
  const [countOne, setCountOne] = useState(0);
  const [countTwo, setCountTwo] = useState(42);

  return (
    <div>
      <div>Count One: {countOne}</div>
      <div>Count Two: {countTwo}</div>
      <button onClick={() => setCountOne(currCountOne => currCountOne + 1)}>
        +
      </button>
    </div>
  );
};

export default App;
```

And when we press the button we won't mutate `countTwo` and only update `countOne`.

Now you might be asking yourself when you should split your states up and when to have one larger. I don't know if there's any 100% correct answer, but I always go after this:

_"If the values depend on each other, meaning that you need to update them at the same time, make a larger state. Otherwise, split the states up."_

---

### Custom Hooks

Since you now have some basic knowledge about hooks, especially the `useState` hook, you might be wondering why these are useful. And one big advantage is that you can write custom logic, encapsulate it at one place and use it everywhere (only in functions!!).

A common thing we use in our apps are forms. So we could create a custom `useForm` hook. Which could look like this:

```jsx
import { useState } from "react";

export const useForm = (initialValues, callback) => {
  const [values, setValues] = useState(initialValues);

  const handleSubmit = event => {
    if (event) {
      event.preventDefault();
    }
    callback();
  };

  const handleChange = event => {
    event.persist();
    setValues(values => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  return [values, handleChange, handleSubmit];
};
```

And then use it our app like this:

```jsx
import React from "react";
import { useForm } from "./useForm";

const App = () => {
  const login = () => {
    console.log("Values: ", values);
  };

  const [values, handleChange, handleSubmit] = useForm(
    { email: "", password: "" },
    login
  );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="email" value={values.email} onChange={handleChange} />
        <input
          name="password"
          value={values.password}
          onChange={handleChange}
        />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default App;
```

Now we have encapsulated this logic within our custom `useForm` hook and we can use it everywhere within our application (only in functions!!). It as **no** UI, only our custom logic. So we don't need to use render props anymore.

![Alt Text](https://media.giphy.com/media/uTuLngvL9p0Xe/giphy.gif)

### Last Remarks

I hope you found this helpful. This is the first part of my “React Hooks 101" series. Next article will be about `useEffect`. So please follow on my other social media platforms to get news about the upcomming articles!

[Instagram](https://instagram.com/martinnordstromcode)
[Twitter](https://twitter.com/martinnrdstrm)
[Github](https://github.com/martinnord)
