---
name: vue-script
description: 'Build, edit, debug, inspect, preview, and validate apps that use Vue-Script, a custom Vue build tool. Use when working with vue-script.toml, configured page HTML placeholders, .vue components, .vue.js helpers, .vue.css styles, component dependencies, generated HTML, or runtime and UI behavior in a Vue-Script site.'
argument-hint: 'Describe the app, components, issue, or UI behavior to create, update, inspect, or test.'
---

# Vue-Script

Use this skill when building or modifying apps that use Vue-Script.

Vue-Script is not Vite, webpack, or Vue SFC tooling. It is a custom Rust build script that assembles Vue apps into one HTML file by:

1. Loading configuration from `vue-script.toml`.
2. Starting from the configured main component.
3. Recursively following component dependencies declared by top-level `<link rel="component" href="...">` elements.
4. Collecting templates, scripts, imports, and styles.
5. Injecting them into the configured page template.

Vue-Script commonly uses Vue from the configured page HTML rather than a bundler-managed runtime. Inspect the target project before choosing or changing its Vue integration.

## When To Use

- Creating a new Vue-Script app or component tree.
- Editing `vue-script.toml`, page shell HTML, or `.vue` component files.
- Adding shared helper code in `.vue.js` files.
- Adding shared styles in `.vue.css` files.
- Fixing build issues involving dependency paths, dependency cycles, or malformed top-level `.vue` structure.
- Debugging a generated page that fails to load, mount, render, or behave correctly.
- Previewing a Vue-Script site and checking its rendered DOM, console output, layout, or interactions.

## Core Model

Author apps around these pieces:

- `vue-script.toml`: project config.
- The page HTML configured by `[app].page`, containing placeholder comments.
- The root component configured by `[app].main`.
- `.vue`: Vue-Script component fragments.
- `.vue.js`: plain JavaScript helper modules that are inlined into the final module script.
- `.vue.css`: plain CSS files that are merged into the final style block.

The builder reads these config keys:

```toml
[app]
page = "path/to/page.html"
main = "path/to/main.vue"

[target]
path = "path/to/output.html"
```

Paths in `vue-script.toml` are relative to the project root, which is the directory that contains `vue-script.toml`.

The `check` command requires an explicit TypeScript compilation target in `[check].target`, such as `"es2020"`, `"es2022"`, or `"esnext"`.
It uses `tsc` on `PATH` unless `[check].typescript` selects a compiler.
An absolute compiler path is used as-is; a relative one is resolved from the directory containing `vue-script.toml`.

`[target].path` is optional. If it is omitted, the builder prints the assembled HTML to stdout instead of writing a file.

## Vue Runtime Integration

Vue-Script does not provide the Vue runtime. Inspect the configured page and existing components to determine how the project loads Vue, and preserve its established Vue version and API style.

For a new project with no established runtime convention, prefer Vue 3 loaded globally from the page before the injected app code. Preserve the three build placeholders, for example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Vue-Script App</title>
	<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>
<!-- STYLES -->
</head>
<body>
<!-- TEMPLATES -->
<!-- SCRIPTS -->
</body>
</html>
```

For that Vue 3 global-runtime model, use patterns such as `Vue.createApp(...)`, `app.component(...)`, and component objects declared through the assembled script order. When editing an existing project, follow its runtime and APIs instead.

## Supported File Types

Vue-Script recognizes exactly these file name suffixes:

- `.vue`: full component fragment.
- `.vue.js`: script-only helper file.
- `.vue.css`: style-only helper file.

Any other component-like extension is unsupported by the builder.

## `.vue` File Structure

A `.vue` file must be an HTML fragment, not a full HTML document. Prefer this top-level order for consistency and readability:

1. Zero or more `<link>` elements
2. Optional `<script>`
3. Optional `<template>` xor `<div>`
4. Optional `<style>`

The parser accepts these supported top-level elements in any order, and it allows top-level whitespace and comments. Important constraints enforced by the parser are:

- No non-whitespace top-level text nodes.
- No duplicate top-level sections.
- Do not include both `<template>` and `<div>` in the same file.
- `<script>` and `<style>` must use explicit closing tags.
- Keep `<script>` and `<style>` bodies plain text so they can be extracted cleanly.

Use this shape for a parent or root component file that renders two child components:

```html
<link rel="component" href="components/hero-banner.vue">
<link rel="component" href="components/feature-list.vue">

<script>
const app = Vue.createApp({
	data() {
		return {
			title: 'Hello Vue-Script',
			features: ['Small build tool', 'Vue 3 runtime', 'Single HTML output'],
		};
	},
});

app.component('hero-banner', HeroBanner);
app.component('feature-list', FeatureList);
app.mount('#app');
</script>

<div id="app">
	<hero-banner :title="title"></hero-banner>
	<feature-list :items="features"></feature-list>
</div>
```

Any child component or helper used by this file should be declared with a top-level `<link rel="component" href="...">` element.

Use this shape for a child component file that uses `<template>`.
A good convention is to use the same string for the template id and the root element class name so the relationship stays obvious,
then use BEM-style class names such as `hero-banner__title` for internal elements:

```html
<script>
const HeroBanner = {
	template: '#hero-banner',
	props: {
		title: String,
	},
};
</script>

<template id="hero-banner">
	<section class="hero-banner">
		<h1 class="hero-banner__title">{{ title }}</h1>
	</section>
</template>

<style>
.hero-banner {
	padding: 24px;
	border-bottom: 1px solid #ddd;
}

.hero-banner__title {
	margin: 0;
}
</style>
```

## Dependency Rules

There are two different script inputs that affect build output.

### Component links

Use one top-level `<link rel="component" href="...">` element per Vue-Script file dependency required by the current file.

Example:

```html
<link rel="component" href="components/hero-banner.vue">
<link rel="component" href="components/feature-list.vue">
<link rel="component" href="helpers/formatters.vue.js">

<script>
const app = Vue.createApp({});

app.component('hero-banner', HeroBanner);
app.component('feature-list', FeatureList);
app.mount('#app');
</script>
```

Behavior:

- Each `<link rel="component">` adds another file to the build graph.
- Paths are resolved relative to the current component's directory.
- Dependencies are traversed recursively from `app.main`.
- Dependency scripts are emitted before the component that depends on them.
- Vue-Script treats every `<component is="...">` value as opaque. Add the boolean `dynamic` attribute to each link that the outlet can select. This marks only that link as used and leaves unused-import warnings enabled for all other links.
- A parent file declares component links for its children and helpers; a child component does not depend on itself.
- Declare every child component or helper that the current file depends on.
- Write dependency links as `<link rel="component" href="...">`.

Use component links for:

- Child `.vue` components.
- Shared `.vue.js` helpers.
- Shared `.vue.css` styles.

Keep the dependency graph acyclic. The builder orders scripts by walking dependencies first.

For example, a route outlet backed by a table of component objects can declare its possible dynamic dependencies explicitly:

```html
<link rel="component" href="pages/home-page.vue" dynamic>
<link rel="component" href="pages/settings-page.vue" dynamic>

<template id="route-outlet">
	<component :is="activeRoute.component"></component>
</template>
```

### `import` lines in script source

Use normal JavaScript `import` lines directly inside `.vue` `<script>` blocks or `.vue.js` helper files when you need external module imports.

Example:

```html
<script>
	import { something } from './module.js';

	Vue.createApp({}).mount('#app');
</script>
```

Behavior:

- The builder looks for lines that start with `import` after trimming leading whitespace.
- Matching lines are collected and emitted before the remaining component script bodies in the final `<script type="module">` block.
- Module specifiers are emitted unchanged. The browser resolves relative specifiers from the generated target HTML, not from the source `.vue` or `.vue.js` file.
- Relative imports are intended for downloaded or vendored ES modules stored with the target's other static files.
- Collected import lines do not add Vue-Script files to the dependency graph.
- Import extraction is ad hoc and line-based, not a full JavaScript parse.

Use import lines for standard JavaScript module imports. Use component links for Vue-Script source files.

Keep the distinction clear:

- `<link rel="component">` participates in Vue-Script dependency discovery and ordering.
- `import` lines only emit JavaScript import statements into the final module script; their paths use the generated target as their browser-visible base.

## Path Conventions

When authoring `<link rel="component" href="...">` entries, treat the `href` value as relative to the file that contains it.

Examples:

- From `src/main.vue`, `<link rel="component" href="components/hero-banner.vue">` resolves to `src/components/hero-banner.vue`.
- From `src/main.vue`, `<link rel="component" href="helpers/formatters.vue.js">` resolves to `src/helpers/formatters.vue.js`.
- From `src/components/feature-list.vue`, `<link rel="component" href="item-pill.vue">` resolves to `src/components/item-pill.vue`.

Do not treat `href` values as project-root relative unless the current file is already at the root.

## Build Output Assembly

The builder reads the page HTML and replaces three placeholder comments:

- `<!-- STYLES -->`
- `<!-- TEMPLATES -->`
- `<!-- SCRIPTS -->`

Assembly behavior:

- All discovered styles are merged into one `<style>` block.
- All discovered templates are concatenated and inserted as raw markup.
- All discovered scripts are placed into one `<script type="module">` block.
- Collected `import` statements are emitted before component script bodies.
- Script bodies are ordered so dependencies come before dependents.

## Practical Authoring Guidance

When asked to build an app with Vue-Script, follow this workflow:

1. Inspect `vue-script.toml` to find the real page and main entry paths.
2. Inspect the page HTML and preserve the placeholder comments.
3. Preserve the project's existing Vue runtime integration; for a new project, load Vue 3 before the injected app code.
4. Declare every child component and helper dependency with top-level `<link rel="component" href="...">` elements on the file that needs it.
5. Keep JavaScript imports as normal `import ...;` lines in the script body, one import per line if you want Vue-Script to extract them.
6. Put reusable helpers in `.vue.js` files when they do not need a template.
7. Put reusable global CSS in `.vue.css` files when it is shared across multiple components.
8. Use BEM-style class naming to keep component styles local in practice, for example `.hero-banner`, `.hero-banner__title`, and `.hero-banner--compact`.
9. Keep component names, template ids, custom element tags, and registered component objects aligned.
10. Prefer small dependency graphs with clear one-way dependency relationships.

## Typical Build Result

For a project where a root component depends on child components and helpers:

- Child template markup is inserted into the configured page output.
- Helper JavaScript is emitted before the component code that calls it.
- All collected `import` lines are emitted before the remaining script bodies.
- All discovered styles are merged into one style block.

## What To Avoid

- Do not write Vue 2 `new Vue(...)` or global `Vue.component(...)` patterns in new example code unless the existing project already depends on them.
- Do not assume `.vue` files are compiled by npm tooling.
- Do not add unsupported top-level blocks such as `<script setup>`.
- Do not remove or rename the HTML placeholder comments.
- Do not introduce file extensions that the Vue-Script tool does not parse.
- Do not use scoped styles; Vue-Script merges styles globally and does not provide SFC-style style scoping.
- Do not rely on multi-line or dynamically constructed import statements being extracted correctly; the current import handling is intentionally line-based.
- Do not use generic class names that are likely to leak across components; prefer BEM-style naming to keep selectors component-specific.

## Build And Validation

Run the build before runtime or UI validation:

```bash
vue-script build
```

This skill assumes the `vue-script` executable is installed and available on `PATH`. If it is unavailable, stop and tell the user to install it; do not install it on their behalf. For example:

```bash
cargo install vue-script
```

Other supported commands exist:

```bash
vue-script open
vue-script serve
```

Command behavior:

- `vue-script build` assembles the configured output.
- `vue-script open` builds and opens the generated target as a local file in the browser, using the built output path directly rather than serving it over HTTP.
- `vue-script serve` builds, starts a loopback-only Python `http.server` from the project root on port `8000`, opens the resulting `http://127.0.0.1:8000/...` URL, and blocks the terminal until stopped unless the user explicitly uses detached mode.

Do not hand browser validation back to the user when the available tools can perform it safely. Choose a preview method based on the app and environment:

- For self-contained output, a browser or browser-automation tool can load the generated target directly.
- If module imports, browser security rules, or application behavior require HTTP, start a non-opening local server from the project root in a managed terminal session, inspect the configured target URL, and stop the server afterward. A command such as `python3 -m http.server 8000 --bind 127.0.0.1` is suitable when Python is available.
- Use `vue-script open` only when opening an interactive browser is appropriate and permitted; it creates a GUI side effect and gives the agent less control over inspection.
- Use `vue-script serve` only when its automatic opener and watch behavior are useful and permitted. Prefer blocking or otherwise managed execution so the process can be stopped; do not leave detached preview servers running unintentionally.

Validate in proportion to the change:

- Use a successful build as structural validation and respond to its diagnostics instead of manually duplicating the builder's checks.
- For runtime, component, or UI changes, render the target with available browser automation and wait for Vue to mount. Check the post-mount DOM and browser console instead of relying only on source HTML.
- Exercise the interactions affected by the task, such as clicks, form input, keyboard handling, emitted events, or navigation, and verify their visible state changes.
- For visual changes, inspect screenshots at relevant viewport sizes and check for clipping, overflow, unreadable text, and broken responsive layout.
- Distinguish application defects from preview-environment failures such as an unavailable Vue CDN or blocked module request.
- Stop any preview server or browser process started for validation.

If browser automation is unavailable, do not claim that runtime behavior or interactions were exercised.

## Implementation Notes For Agents

When generating Vue-Script code:

- Follow the file naming and placement conventions already used by the target project.
- Keep changes minimal and consistent with the capabilities of the Vue-Script tool.
- Match the target project's Vue runtime and API patterns. Use the Vue 3 global-runtime model only as the default for a new project without an established convention.
- If the user asks for features that the Vue-Script tool does not support, explain the limitation and work within the supported workflow instead of inventing unsupported behavior.
