# Build Dynamic User Interfaces (UI) for Websites
**MICHIGAN ACADEMY OF INNOVATION AND CREATIVITY**

**Innovate. Create. Lead.**

COURSE STUDY MANUAL
Course language: English
Estimated guided study: 8 hours
Copyright 2026 MAIC. All rights reserved.

Original independent MAIC teaching content. Fictional app records, APIs and user test results are used for training. This introductory course does not certify a website as secure, accessible or ready for production.

<!-- MAIC-PAGE -->

## 02 — What Makes a Website Interface Dynamic?

A dynamic user interface responds to actions, changes in data, available space and application state. A static picture of a booking form shows where controls might appear; a functional interface allows people to enter values, correct errors, request information and receive truthful feedback. Dynamic behavior belongs to the whole system, including semantic content, responsive layout, browser events, network requests and server-side validation.

Learners should be able to use semantic HTML structure, organize CSS layouts, define component states, manage form data, distinguish client and server responsibilities, render lists and empty states, fetch data safely, handle loading and failure, check accessibility, and design a basic testing and deployment checklist. Examples use a fictional study-room booking page without real personal data.

**Eight-hour guided schedule:** Introductory analysis 20 minutes; pages 3–10 at 45 minutes each (360 minutes); worked interface on page 11 for 60 minutes; final review and assessment on page 12 for 40 minutes. Total 480 minutes including practical work. The approach applies to plain JavaScript or a modern component framework, with particular implementations depending on the chosen stack.

**Opening exercise:** Describe four states of a booking form: initial, valid input, submitting and confirmed or failed. Explain why a UI should not call the last state “confirmed” until the service accepts the request.

<!-- MAIC-PAGE -->

## 03 — Semantic HTML, Content and Application Structure

HTML describes document meaning. A page can use landmarks such as header, navigation, main content and footer, along with properly ordered headings and labeled form controls. Semantic elements aid navigation and make application behavior easier to understand. A clickable visual box is not automatically equivalent to a real button; use controls suited to their function before adding custom interaction.

Define the information architecture first. The fictional reservation site has Browse rooms, My bookings and Help. The main page shows room cards, selection inputs, cancellation rules and an action to request a reservation. Avoid adding unrelated navigation options merely to fill a layout. Keep product terms and data definitions consistent across every screen.

Forms need labels, input types, grouping and correct error descriptions. Client validation can identify missing values quickly, but is not a security boundary. A server must still authenticate and authorize actions and verify rules such as room availability. Preserve the distinction between displayed data and trusted records.

**Example:** Use a button for “Check availability,” a labeled date input for the desired day and a text message for an unavailable result. Do not simulate a successful reservation by altering the heading after any arbitrary click.

**Practice:** Sketch the DOM structure for a page with two landmarks, a card list and a three-field booking form. Name what each element means to users.

<!-- MAIC-PAGE -->

## 04 — CSS Layout: Flexbox, Grid and Responsive Rules

CSS controls presentation. Flexbox suits many one-dimensional arrangements, such as a navigation row or a form-action group. CSS Grid is useful for two-dimensional arrangements, including card collections. Choose layouts for readable content rather than to demonstrate every available feature. Set spacing and type rules consistently, and prefer responsive relationships to fixed absolute positions that break at new viewport sizes.

A simple desktop page might show a filter panel next to room results, while a phone stacks those sections. Breakpoints are decisions based on actual content, not universal device labels. When an item becomes too narrow to read, rearrange it; do not reduce every font until the page technically fits. Use accessible control sizes and visible focus indicators, and test in zoomed or narrow conditions.

Content changes should not make navigation jump unpredictably. If a card title wraps to two lines, the layout should allow adequate height without covering the next card. Long localized strings require similar care. The brand mark remains consistent when language changes, even though surrounding text direction and spacing may adapt.

**Fictional example:** Three room cards appear in columns on a desktop and in a single vertical list on a small phone. The available time, capacity and action remain visible in both.

**Practice:** Specify one Flexbox row, one responsive grid and a breakpoint criterion based on when the card content stops fitting.

<!-- MAIC-PAGE -->

## 05 — State, Events and Rendering Decisions

Application state represents information the interface needs to display or update: selected room, date, loading status, error message and current results. User events such as typing, selection and button activation request changes to that state. A predictable design has an explicit relationship between input, validation, state and rendered feedback. Avoid storing conflicting copies of the same information when one reliable source can drive the display.

A state model may begin as idle, become editing, move to validating and submitting, then end as confirmed or rejected. Not every state transition is valid. A booking cannot become confirmed simply because a button is pressed; an authorized service response is required. Show disabled and busy states when appropriate, but preserve clear error recovery and prevent accidental duplicate submission.

Rendering lists also needs care. When there are no rooms, distinguish a genuine empty result from a network failure. During loading, show meaningful progress without inventing results. For components reused across many cards, keep a stable identity for each record so updates do not shift input values to the wrong row.

**Fictional example:** Changing the date invalidates the previously chosen slot if it is no longer applicable. The screen should ask the user to select a current slot rather than silently reuse an old one.

**Practice:** Draw a transition diagram for idle, editing, submitting, confirmed and rejected, and label the evidence required for each transition.

<!-- MAIC-PAGE -->

## 06 — Forms, Validation and User Feedback

Forms collect structured information for a defined task. Use clear persistent labels and examples only where needed. Identify required fields, acceptable formats and relationships between values. Error messages should explain what must be corrected; a red outline alone is not enough. Place feedback near the relevant field and provide a summary for complex forms when useful.

Distinguish client-side validation from server-side enforcement. A client can check that a date is present and syntactically valid; the server must verify the booking is still available and the user is permitted to make it. Users can alter browser requests, so server rules cannot rely on disabled controls or hidden inputs. Minimize personal information collection and limit storage to what the service needs.

Successful submission needs confirmation containing useful next steps, not merely an animation. A rejected request should preserve recoverable input and offer an understandable action, such as choosing another slot. Prevent repeated requests where appropriate through pending states and reliable server-side handling. Never print internal stack traces or private data into public error messages.

**Fictional example:** A date is selected, but the reserved slot was taken by another user. The server rejects the request and the UI displays “This time is no longer available. Choose another.”

**Practice:** Write three field-level errors and a server rejection message. Explain which checks belong on the client and which must be enforced on the server.

<!-- MAIC-PAGE -->

## 07 — Fetching Data, APIs and Asynchronous Interfaces

Modern websites often request information from APIs. An availability view may ask a service for room records, receive a response and render the result. A network request can succeed, fail, time out or return a valid empty dataset. Design for each outcome. A successful HTTP response is not always proof that a business action happened unless the service contract explicitly confirms the transaction.

Define the API's expected data shape: room identifier, name, capacity and available time slots. Treat server-provided and user-provided content as untrusted for presentation. Insert ordinary text as text rather than unsafe executable markup; do not use a user's room name as an HTML string without proper handling. Use authorization controls and input validation on the server. This course gives the principles, not a substitute for secure implementation review.

Handle race conditions. If a user selects Monday, then quickly selects Tuesday, a slower Monday response should not overwrite the newer Tuesday results. A request identifier or abort mechanism can prevent stale results from becoming current. Preserve coherent loading and error states during retries.

**Fictional example:** A filtered room list fails to load because the service is temporarily unavailable. The interface shows “Could not load availability. Try again,” not “No rooms exist.”

**Practice:** Draw a request-response sequence showing pending, success with results, success with no results, transport failure and stale-response suppression.

<!-- MAIC-PAGE -->

## 08 — Components, Reuse and a Design-System Contract

A component groups presentation and behavior that serves a recognizable purpose. Room Card, Date Filter, Availability List, Alert and Booking Form are useful reusable components. Define inputs, outputs, state and accessibility responsibilities. A component should not hide ownership of an important server operation; the application needs a clear place where request and response logic are coordinated.

Use design tokens for colors, spacing, typography, corners and other repeatable values. A component specification should cover default, hover where relevant, focus, disabled, loading, error and success presentations. A reliable interface does not use an unavailable state only as a gray tint; it also includes textual information. Build tests around behavior, not merely whether components render.

A reusable pattern must remain adaptable. A room card may include a longer name or a translated label. Its container should grow or wrap appropriately, and the action target should remain usable. Keep navigation placement stable across related views. Avoid direct copy-paste variations that drift into inconsistent field labels or disabled-state behavior.

**Fictional example:** Two pages use the same Date Filter component. A fix to its error label improves both, but the team retests each layout for unexpected overflow.

**Practice:** Write a four-component contract table listing props, visible states, actions and accessibility checks.

<!-- MAIC-PAGE -->

## 09 — Accessibility and Internationalization in Implementation

Accessibility must operate in the working website, not only in design screenshots. WCAG 2.2 provides a framework for perceivable, operable, understandable and robust interfaces. Use semantic controls and associated labels, meaningful error text, visible focus, keyboard operation and suitable contrast. Dynamic changes may need appropriate announcements so assistive technology users know that results have loaded or a submission failed.

Test interfaces with zoom, keyboard-only use and reduced viewport widths. Do not trap focus within a page region unintentionally. Avoid hiding essential instructions behind overlays or sticky navigation. Use correctly marked language and text direction when content is localized. Arabic needs appropriate right-to-left layout; email addresses and URLs may still require careful bidirectional handling.

Design tokens alone do not guarantee accessibility. A brand can have excellent colors but a form that cannot be submitted with a keyboard. Likewise, a correctly labeled button may be ineffective when the API fails without feedback. Evaluate full task flow and state transitions under realistic conditions, including empty lists and errors.

**Fictional example:** After changing a date filter, the results update with a readable status such as “Three rooms available.” A screen-reader announcement is planned and tested rather than inferred from visual changes.

**Practice:** Check six accessibility concerns and create an Arabic-label test for the main booking form without changing the brand mark.

<!-- MAIC-PAGE -->

## 10 — Testing, Security Boundaries and Deployment Review

Interface testing should cover meaningful tasks and risks. Unit tests can validate pure logic such as date constraints; component tests can check labels and state changes; integration tests can simulate API failures; end-to-end tests can verify a complete booking flow against a controlled test environment. Test both a successful case and cases that should be rejected. Production security review is a separate specialist activity.

Avoid common hazards. User-provided content must not become arbitrary executable HTML. Authorization belongs on the server. Sensitive credentials must not be embedded in client code. Prevent unintended duplicate submissions and ensure a request cannot reserve a slot on behalf of someone else without appropriate permission. Do not claim that the presence of a login screen alone guarantees protection.

Before deployment, run a quality checklist covering functional actions, responsive layout, localization, accessibility, errors, caching behavior and performance. Test how the UI behaves on slow networks and when the service is unavailable. Record the application version and rollback approach. Analytics should respect user privacy and measure actual task outcomes.

**Fictional example:** A booking passes visual review but can be submitted twice while loading. The team adds client pending feedback and verifies server-side handling so duplicate reservations are not created.

**Practice:** Write eight acceptance tests, including an unauthorized request, missing-date validation, stale API result and narrow-screen overflow.

<!-- MAIC-PAGE -->

## 11 — Worked Project: A Dynamic Study-Room Interface

**Entirely fictional data.** A learning center lists three rooms: A (four seats), B (two seats) and C (six seats). Availability comes from a hypothetical API response. The user selects a date, reviews times, chooses a room, enters necessary contact details and requests confirmation. The API can reject a slot because another user reserved it. No real database or production URL is supplied in the exercise.

Draft semantic page structure and a responsive grid. Implement or storyboard an Availability List that handles loading, no results, an ordinary data response and transport failure. Build a labeled booking form with clear errors for missing date or contact information. A successful confirmation must depend on a simulated authorized service result within the classroom example; an actual deployed system would need real server checks.

**Worked arithmetic:** If the three rooms have 4, 2 and 6 seats, the combined nominal seating capacity is 12 seats. This does not mean 12 rooms or guarantee all seats are free in every time slot. If only Rooms A and C are available at a selected time, the displayed combined seating capacity is 10 seats. Keep capacities distinct from available booking slots.

Create a component table and test changes in selected date, cancellation, loading and rejected booking. Use an Arabic-language label sample and check mobile wrapping. Write two automated acceptance tests and two manual accessibility checks.

**Deliverables:** Brief, semantic markup plan, responsive layout, state diagram, component contracts, error texts, hypothetical API schema, test results and revision log.

<!-- MAIC-PAGE -->

## 12 — Review Questions and Development Portfolio

**Self-test:** (1) What makes an interface dynamic? (2) Why use native semantic controls? (3) When is CSS Grid preferable to a simple Flexbox row? (4) How should submission state differ from confirmation? (5) Which validation must happen on the server? (6) Why can a slow earlier API response be dangerous? (7) What does a component contract include? (8) Why does correct branding not guarantee accessibility? (9) What should a browser do after a failed booking? (10) Why does a test suite need rejection scenarios?

**Final project:** Build or specify the fictional dynamic booking interface. Submit a requirements brief, HTML landmark outline, responsive design, state chart, reusable component definitions, accessible labels, simulated API contract, success and error states, and a minimum eight-case quality checklist. If actual code is written, run it against controlled fictional data and distinguish the prototype from a live service.

**Practice rubric:** Content and semantics 15%; responsive presentation 15%; state and event handling 20%; validation and server trust boundaries 20%; accessibility and localization 15%; test coverage and technical documentation 15%. These exercises do not constitute security certification or an approved MAIC assessment.

**Further reading:** MDN Web Docs, HTML elements (https://developer.mozilla.org/en-US/docs/Web/HTML/Element), CSS layout (https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout), Fetch API (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), and W3C WCAG 2.2 (https://www.w3.org/TR/WCAG22/). Follow current documentation for the actual technology stack. All instructional wording and fictional cases are independently authored.
