# AI FAILURE AUDIT – LAB 03

**Student:** Dinh Nhat Bao Nhi  
**Course:** Web Application Development  
**Project:** Production React 19

## Failure 1 – Incorrect Avatar Image Path

**Exercise:** Developer Profile Card

### AI-Generated Code

```jsx
avatar = '/avatar.jpg',
```

### Problem

The profile image failed to display in the browser. The filename referenced in the code did not match the actual image filename.

### Root Cause

The AI suggested an image path without checking the exact filename and extension.

### Correction

```jsx
avatar = '/avatar.JPG',
```

The image path must match the actual filename in the `public` directory.

### Lesson Learned

File paths and extensions should always be verified when working with external assets.

---

## Failure 2 – Incorrect Reset Data Source

**Exercise:** Scientist & Pioneer Directory

### AI-Generated Code

```jsx
const handleReset = () => {
  setPeople([...SMART_PEOPLE]);
  setQuery('');
  setMinIq(60);
  setSortBy('iq-desc');
};
```

### Problem

The component accepted an `initialData` property, but the Reset function always restored the hardcoded `SMART_PEOPLE` dataset.

This could produce incorrect results when using a different initial dataset.

### Root Cause

The AI relied on a global constant instead of using the data supplied through component properties.

### Correction

```jsx
const handleReset = () => {
  setPeople([...initialData]);
  setQuery('');
  setMinIq(60);
  setSortBy('iq-desc');
};
```

### Lesson Learned

Reusable React components should respect their input properties and avoid unnecessary hardcoded dependencies.

---

## Failure 3 – Suppressing a React Hooks Warning

**Exercise:** PUBG Vietnam Live Telemetry

### AI-Generated Code

```jsx
// eslint-disable-next-line react-hooks/set-state-in-effect
setResult({
  status: STATUS.LOADING,
  data: null,
  error: '',
});
```

### Problem

The AI attempted to suppress a React Hooks lint warning rather than restructuring the state update.

### Root Cause

The AI mixed user-triggered state transitions with asynchronous side-effect management.

### Correction

Move the loading transition into the event handler that starts the request.

For example:

```jsx
const handleConnect = () => {
  setResult({
    status: STATUS.LOADING,
    data: null,
    error: '',
  });

  setRequest({
    squadId,
    packetLoss,
    attempt: requestCount + 1,
  });
};
```

The complete implementation must also handle request cancellation, squad changes, and retry attempts.

### Lesson Learned

Lint warnings should be investigated and resolved through appropriate code design rather than suppressed without justification.

---

## Conclusion

During Lab 03, three issues were identified in AI-assisted development:

1. Incorrect image path handling.
2. Hardcoded reset data in a reusable React component.
3. Suppression of a React Hooks warning instead of addressing its cause.

These findings demonstrate the importance of reviewing AI-generated code and applying software engineering principles.

The avatar display failure was observed during development. The other two issues were identified through source-code review; their proposed corrections require implementation and verification before being considered completed.