# CLAUDE.md

## Project Overview

You are contributing to **vue-rating-kit**, an enterprise-grade, lightweight, highly customizable rating component library built specifically for **Vue 3** using the **Composition API** and **TypeScript**.

The goal is to create the most reliable and developer-friendly rating library in the Vue ecosystem while maintaining a minimal bundle size and zero unnecessary dependencies.

Every implementation decision must align with the principles defined in this document.

---

# Project Vision

Build a complete rating toolkit for Vue applications that is:

* Lightweight
* Accessible
* Fully typed
* Tree-shakeable
* Highly customizable
* Enterprise-ready
* Easy to maintain
* Easy to contribute to

The package should solve all common rating use cases without requiring consumers to build custom workarounds.

---

# Technology Stack

Mandatory technologies:

* Vue 3
* Composition API
* TypeScript
* Vite
* Vitest
* Vue Test Utils
* Pure CSS

Do not introduce alternative technologies unless explicitly requested.

---

# Non-Negotiable Principles

## 1. Zero Runtime Dependencies

Avoid external dependencies whenever possible.

Do not add packages unless they provide significant value that cannot reasonably be implemented internally.

If a dependency is proposed, explain why it is necessary.

---

## 2. Composition API Only

Use Vue 3 Composition API exclusively.

Never use:

* Options API
* Class-based components

All composables must follow Composition API best practices.

---

## 3. TypeScript First

TypeScript is mandatory.

Requirements:

* Strict typing.
* No use of `any`.
* Export public types.
* Internal utilities should also be typed.

Consumers must receive excellent IntelliSense support.

---

## 4. Pure CSS Only

Use plain CSS.

Do not use:

* Tailwind CSS
* SCSS
* LESS
* CSS-in-JS
* Styled Components

---

## 5. CSS Naming Convention

Every CSS class must be prefixed to eliminate naming conflicts.

Prefix:

`vrk-`

Examples:

* vrk-rating
* vrk-rating__star
* vrk-rating__star--filled
* vrk-rating__star--hover
* vrk-rating__star--readonly
* vrk-rating__star--disabled

No exceptions.

---

## 6. Accessibility Is Mandatory

Every interactive component must support accessibility standards.

Requirements include:

* Keyboard navigation
* Proper ARIA attributes
* Focus visibility
* Screen reader compatibility

Accessibility must never be considered optional.

---

## 7. Backward Compatibility

Avoid breaking changes.

When introducing changes:

* preserve existing APIs whenever possible,
* document migration paths,
* mark deprecated APIs before removal.

---

## 8. Performance First

Performance takes priority.

Avoid:

* unnecessary reactive state,
* excessive watchers,
* unnecessary computed properties,
* expensive DOM operations.

Optimize for both runtime performance and bundle size.

---

## 9. Tree-Shaking Support

The package must support tree-shaking.

Consumers should only pay for what they use.

Avoid designs that force importing unrelated functionality.

---

## 10. SSR Compatibility

Components must work correctly in SSR environments.

Support:

* Nuxt 3
* Vite SSR

Avoid browser-specific APIs during server rendering.

---

# Project Structure

src/

components/
composables/
styles/
types/
utils/

tests/

playground/

docs/

The structure should remain simple and predictable.

---

# Component Philosophy

Components should be:

* focused,
* reusable,
* composable,
* easy to understand.

Avoid creating large monolithic components.

Extract reusable logic into composables.

---

# Public API Principles

Public APIs should be:

* intuitive,
* stable,
* minimal.

Avoid exposing internal implementation details.

Only export APIs intended for consumers.

---

# Testing Standards

Every feature must include tests.

Required test categories:

* rendering tests,
* interaction tests,
* keyboard tests,
* accessibility tests,
* edge case tests.

Target coverage:

95% or higher.

No feature should be merged without tests.

---

# Documentation Standards

Every public feature must include documentation.

Documentation should contain:

* explanation,
* examples,
* prop definitions,
* event definitions,
* TypeScript usage examples.

Documentation should prioritize clarity over brevity.

---

# Code Style Guidelines

Requirements:

* descriptive naming,
* small functions,
* early returns,
* minimal nesting,
* self-documenting code.

Avoid clever code that reduces readability.

Maintainability is more important than reducing line count.

---

# Commit Standards

Use Conventional Commits.

Examples:

feat:
fix:
docs:
refactor:
test:
build:
chore:

Commit messages should clearly communicate intent.

---

# Phase 1 Goals

Implement the following:

* 5-star rating by default,
* v-model support,
* click interactions,
* hover interactions,
* readonly mode,
* disabled mode,
* configurable maximum stars,
* keyboard navigation,
* TypeScript support,
* unit tests,
* accessibility support.

Do not proceed to Phase 2 until Phase 1 is complete.

---

# Decision-Making Rule

When multiple solutions exist:

1. Choose simplicity.
2. Choose maintainability.
3. Choose accessibility.
4. Choose performance.
5. Choose developer experience.

Avoid overengineering.

---

# Final Objective

Build a rating library that developers trust in production environments.

Every contribution should move the project closer to becoming the definitive rating solution for Vue 3 applications.
