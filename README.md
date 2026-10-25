# Lab 03 – Production React 19

**Student:** Dinh Nhat Bao Nhi (Đinh Nhật Bảo Nhi)  
**Course:** Web Application Development  
**Repository:** https://github.com/24521258-a11y/lab03-react19

## Overview

A React 19 / Vite application comprising three exercises on semantic components, derived data, and cancellable asynchronous effects. All PUBG telemetry and IQ figures in this classroom project are **illustrative demo data**, not live match statistics or validated IQ measurements.

## Exercises

### Exercise 1 – Semantic Developer Profile

- `DeveloperCard` and `SkillBadge` components using semantic HTML (`article`, `header`, `hgroup`, `dl`, `dt`, `dd`, `ul`, `li`).
- CSS Modules and responsive design, including a 375 px viewport.
- Avatar image with explicit dimensions and alternate text.
- The developer card is designed without nested `<div>` tags.

### Exercise 2 – Scientist & Pioneer Directory

- Seven demo profiles: six supplied pioneer entries and one student record (Dinh Nhat Bao Nhi, age 20, fictional IQ 120).
- Case-insensitive search by name, minimum IQ filtering, and IQ/age sorting via immutable `.toSorted()`.
- Delete and reset actions; results announced via an accessible status element.
- Derived visible list computed during rendering rather than duplicated in state.

### Exercise 3 – PUBG Vietnam Live Telemetry

- Four display states: `IDLE`, `LOADING`, `SUCCESS`, `ERROR`.
- Squad selector, loading skeleton, simulated packet loss, and reconnect/retry.
- `AbortController` cleanup to cancel superseded simulated requests.
- Request IDs prevent older results from being rendered after switching squads.
- Simulated telemetry only; no real PUBG API connection.

## Requirements

- Node.js and npm compatible with the installed Vite version.
- React 19 (verify using `npm list react react-dom`).
- A browser such as Chrome.

## Getting started

```bash
git clone https://github.com/24521258-a11y/lab03-react19.git
cd lab03-react19
npm install
npm run dev
```

Open the local address printed by Vite (usually `http://localhost:5173/`). Keep the terminal running while viewing the site.

## Quality checks

```bash
npm run build
npm run lint
```

Check browser behavior manually: 375 px layout, semantic markup, all directory filters, packet-loss error/retry, and rapid squad switching. The `lint` script uses the project's selected lint tooling; see `package.json` for its definition.

## Project layout

```text
src/
  components/
    DeveloperCard.jsx
    DeveloperCard.module.css
    SkillBadge.jsx
    SkillBadge.module.css
    ScientistDirectory.jsx
    ScientistDirectory.module.css
    PUBGTelemetry.jsx
    PUBGTelemetry.module.css
    TelemetrySkeleton.jsx
  data/
    scientists.js
    pubgData.js
  App.jsx
  App.css
  index.css
  main.jsx
public/
  avatar.JPG
AI_FAILURE_AUDIT.md
```

## AI Failure Audit

See [`AI_FAILURE_AUDIT.md`](./AI_FAILURE_AUDIT.md) for the observed avatar-path issue and two source-code issues involving reset data and a React Hooks lint-suppression pattern, together with their corrective approaches. The Git history contains follow-up fixes; the audit should accurately reflect verification actually performed.

## Git history

Work is grouped into commits for each exercise and follow-up fixes. To review locally:

```bash
git log --oneline --graph -15
```

## Notes

- The local `public/avatar.JPG` filename uses an uppercase extension; paths should match the exact filename.
- This is an educational demo, not a production telemetry service.
- Exercise evidence and defense preparation are organized separately in the Lab 03 report.
