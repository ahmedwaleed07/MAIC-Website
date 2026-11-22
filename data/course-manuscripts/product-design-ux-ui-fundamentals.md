# Product Design and UX/UI Fundamentals
**MICHIGAN ACADEMY OF INNOVATION AND CREATIVITY**

**Innovate. Create. Lead.**

COURSE STUDY MANUAL
Course language: English
Estimated guided study: 8 hours
Copyright 2026 MAIC. All rights reserved.

Original MAIC instructional material. All organizations, user studies and product figures are hypothetical. This introductory course is not an external vendor certificate or a claim that the design has been commercially validated.

<!-- MAIC-PAGE -->

## 02 — Product Design Connects Problems and Outcomes

Product design is the process of defining a useful offering and shaping how it works, how it looks, and how it can be delivered responsibly. User experience (UX) addresses the overall quality of a person's interaction with the product; user interface (UI) concerns the controls and information through which a digital product is operated. Product design extends beyond either: it considers user needs, operational feasibility, business outcomes, accessibility, technical constraints, and ongoing improvement. A beautiful prototype can fail as a product if users cannot complete a meaningful task.

At the end of this course learners should be able to frame a product problem, investigate user needs, map assumptions, identify core jobs and user journeys, prioritize features, create an information architecture and wireframes, specify interface states, design a prototype, evaluate a short usability study and write practical acceptance criteria. The goal is a defensible product decision rather than a collection of decorative screens.

**Guided eight-hour study route:** Introduction 20 minutes; eight sections on pages 3–10 at 45 minutes each (360 minutes); case application on page 11 for 60 minutes; final assessment and reflection on page 12 for 40 minutes. Total 480 minutes. Use paper, diagrams or an appropriate design application; no particular software subscription is required.

**Starter:** A fictional library wants a mobile reservation service. Write what visitors need to accomplish, what the library must maintain, and which evidence would show that the service actually works.

<!-- MAIC-PAGE -->

## 03 — Discovery: Evidence, Problems and Assumptions

Product discovery begins with the problem and its context, not an instruction to add a fashionable feature. Stakeholders may request a calendar dashboard because bookings are often missed, but the real issue might be unclear reminders, unreliable capacity data or a confusing confirmation step. Write a problem statement identifying affected users, an important task, observed evidence and the impact of failure. Separate facts from assumptions and proposed solutions.

Use interviews, task observation, support records and existing service metrics to understand the problem. No single method provides a complete answer. Interviews can reveal motivations but may not accurately predict behavior; direct observation of a realistic task reveals friction that participants might not mention. Record what was observed separately from an inference about the cause. A handful of users can reveal a problem worth investigating but cannot determine an exact population rate.

Map competing needs. Users want convenience and honest availability. Administrators require accurate capacity and protection against duplicate reservations. Operations staff need a way to handle cancellations and service disruptions. Privacy, limited connectivity, accessibility and available development resources constrain the feasible solution. A well-scoped first release makes these constraints explicit.

**Fictional example:** Three of six test participants fail to notice the cancellation terms. The observation supports investigating policy visibility, not asserting that half of all possible users will fail.

**Practice:** Develop a research plan with five neutral questions, a problem statement, three testable hypotheses and a table separating known facts from assumptions.

<!-- MAIC-PAGE -->

## 04 — Value Proposition, Personas and Product Outcomes

A product proposition describes what progress the intended user can make and why the offering may be preferable to a practical alternative. The alternative may be another application, a phone call, a paper form or doing nothing. A user persona helps summarize a meaningful pattern of needs, context and limitations; it remains a working hypothesis until validated with actual users. Avoid demographic stereotypes or invented quotations.

Define outcomes at two levels. A user outcome might be confirming a suitable room within a few minutes without staff assistance. A business or service outcome could be fewer avoidable double bookings, clearer capacity planning or fewer support requests. Features are means to those ends. “Add a dashboard” is an output; “reduce unsuccessful booking attempts” is a potential outcome that can be evaluated.

Choose a small number of measures with explicit definitions. Task-completion rate is successful unaided task attempts divided by eligible attempts. Error rate should specify the error type. A click or page view may indicate activity but not the actual service outcome. Balance speed against accuracy: a booking flow should not become faster by omitting important cancellation conditions.

**Worked example:** A fictional test has eight users, six completing the task unaided. Observed success is 6/8 = 75% within that sample. Do not generalize that value to a whole country or claim a tested improvement without a baseline.

**Practice:** Write a value proposition, two evidence-based persona hypotheses and one user plus one operational outcome with denominators.

<!-- MAIC-PAGE -->

## 05 — Product Scope, Priorities and Minimum Useful Experience

A roadmap arranges product decisions over time. Prioritization considers user value, confidence in evidence, development effort, dependencies, risk and ongoing cost. A simple scoring framework can support discussion, but it should not hide uncertainty behind a precise-looking total. Product leaders should distinguish must-have functionality from refinements and future experiments.

For a room-booking service, accurate availability, a clear reservation request, readable policies, server confirmation and safe cancellation may be essential. Decorative animations or advanced recommendations are possible later additions. A minimum useful product must still work safely and truthfully; the word minimum is not permission to ignore accessibility, security or correct data.

Write user stories and acceptance conditions. “As a visitor, I need to find an available room for Tuesday” describes a user goal. “Given an unavailable slot, when I try to reserve it, then the server rejects the request and the interface explains how to choose another” is testable behavior. Do not describe the acceptance criteria only in terms of colors or button presence.

**Fictional example:** A team with one month of engineering capacity chooses reliable booking and cancellation over a social sharing feature. It records which expectations are deferred and why.

**Practice:** Make a list of eight proposed features, prioritize five for an initial release and write three testable acceptance criteria.

<!-- MAIC-PAGE -->

## 06 — Information Architecture, Journeys and Wireframes

Information architecture organizes labels, content and navigation around how people search and act. A user journey describes stages across channels and time, from recognizing a need to using and managing the service. For the fictional room product, a journey might be: discover rooms, compare time slots, read conditions, confirm, and later modify a reservation.

A sitemap groups Browse, My bookings and Help separately from administrative tasks. A user flow connects screens and decisions, including empty availability, invalid inputs, cancellation and system failures. A wireframe sketches hierarchy, navigation, labels and major controls before detailed colors are chosen. Low-fidelity work is useful because it invites changes at low cost.

Evaluate both best-case and failure paths. A result that says “No rooms available” after a network outage is inaccurate; the correct state distinguishes service failure from verified absence of availability. Critical policies should be discoverable before commitment. Back navigation must not silently lose work, especially when a person has completed most of a form.

**Fictional example:** A wireframe includes an availability list and a status area. If the API cannot be reached, the status reports a loading failure with a Retry action rather than a false empty list.

**Practice:** Create a three-level sitemap, five-step journey and six-state wireframe flow; label the transitions that require server evidence.

<!-- MAIC-PAGE -->

## 07 — UI Principles: Components, Hierarchy and Responsive Behavior

A UI system needs visible hierarchy, consistent labels, adequate spacing and components that respond predictably. Define primary versus secondary actions, form field labels, room cards, alerts, navigation and confirmation content. Reusable components reduce inconsistent behavior but must be tested whenever a shared style is updated. Define each component's normal, focused, disabled, busy, invalid and success states as relevant.

Responsive design retains the task while adapting to different viewports. A desktop layout can show filters beside results; a narrow phone may stack them. Do not arbitrarily move the main navigation after a tab change or shrink text so far that it becomes illegible. A long translated label may need wrapping or more space. The approved logo and wordmark retain their defined proportions and style even when explanatory copy changes language.

Use visual emphasis responsibly. A prominent action should not imply that a request has completed before a server response. A disabled Confirm button may need a message explaining the missing date. A field error requires text beyond a red border. Motion and shadows are optional; task clarity is not.

**Fictional example:** A reusable Room Card component exposes capacity, time range, availability label and a relevant action. Card height grows when a translated name wraps; the next card does not overlap it.

**Practice:** Specify five components with their states and inspect a phone and desktop version of one information screen.

<!-- MAIC-PAGE -->

## 08 — Accessibility, Privacy and Trust by Design

Accessible digital products aim to be perceivable, operable, understandable and robust. W3C WCAG 2.2 provides relevant criteria covering contrast, form labels, keyboard access, focus appearance and predictable navigation. A color palette that passes contrast testing does not establish full accessibility; real interactions and semantic behavior must also be checked. Avoid requiring a user to infer errors from color alone.

Privacy and security influence product choices. A reservation flow should collect only necessary contact information and protect access to private bookings. Client-side validation can improve feedback but cannot authorize a booking. Server-side rules must verify availability and permissions, especially when two people may attempt to book the same slot. Do not expose sensitive internal errors or other customers' details in UI messages.

Design for language and context. Arabic text requires proper shaping and right-to-left treatment; mixed URLs and numbers need special care. Some users may have unreliable connectivity and need recoverable failure states. Consent to use personal data should be specific to a real purpose and supported by appropriate controls, not assumed because a prototype shows a checkbox.

**Fictional example:** A booking fails because the slot was taken. The interface says “This time is no longer available. Choose another,” and the server does not create a duplicate record.

**Practice:** Audit one form against six accessibility points and list three server-side safeguards it needs before production.

<!-- MAIC-PAGE -->

## 09 — Prototyping, Usability Study and Iteration

A prototype allows a team to explore interaction sequences before committing to full engineering. It may be a paper flow, clickable design or functional test environment. A clickable confirmation screen does not establish a genuine database reservation; a production service needs authenticated and authorized server behavior. Make that distinction explicit to stakeholders.

Define usability tasks in ordinary language without telling people where to click. A task such as “Reserve an available room for a study session on Thursday afternoon” tests discoverability and completion. Record unaided completion separately from assisted completion, failed attempts, user errors and unexpected confusion. Collect feedback neutrally. A small study can identify problems to investigate but not reliably estimate whole-population behavior.

Analyze findings by severity, recurrence and impact. Fix barriers that prevent task completion before polishing decorations. Retest the revised flow. If a change improves one task but hides important cancellation rules, it may not be a net improvement. Document assumptions, what changed and whether the evidence supports the decision.

**Fictional example:** A first prototype hides the Cancel action inside an unrelated account menu. A revised version exposes it under My bookings. A follow-up test observes whether people can actually find it.

**Practice:** Write a three-task test plan and a review sheet recording outcome, confusion, severity and a proposed revision.

<!-- MAIC-PAGE -->

## 10 — Product Delivery, Handoff and Post-Launch Learning

A design becomes a product through implementation, operations and maintenance. Handoff should communicate screen structure, content, component states, responsive rules, localization, accessibility, API dependencies, error handling, permissions and testable acceptance criteria. Screenshots alone cannot specify what the backend must do when inventory changes or a payment fails.

Set an initial release checklist: verified core task, functional authentication where required, authorized data access, reliable failure handling, mobile usability, accessibility checks, performance, privacy information and rollback plan. Assign ownership to each unresolved item. A product may be technically deployed yet still not be suitable for users if it displays false confirmations or inaccessible forms.

Post-launch learning requires outcome metrics and real feedback. Record support tickets, task errors, completion under defined conditions, cancellations and repeated failures. Avoid interpreting more page views as proof of better usability. Keep a versioned record of changes and a way to reverse a harmful deployment. Improvement is iterative and cannot be promised on the basis of mockups alone.

**Fictional example:** A new filter increases clicks but also increases duplicate booking failures. The team examines the server records and task flow before declaring the interface more effective.

**Practice:** Prepare a handoff checklist, six acceptance tests and a two-week learning plan with explicit data definitions.

<!-- MAIC-PAGE -->

## 11 — Applied Case: Design the Library Reservation Product

**This is a fictional case.** A community library has three rooms: A seats four people, B seats two and C seats six. The service must show current availability, allow a visitor to choose a date and time, display cancellation conditions and confirm only when the server accepts the booking. A separate administration view manages room capacity but should not appear as the main visitor interface.

Begin with a discovery plan covering users who book once and those who book repeatedly. Write a value proposition that does not promise unlimited rooms. Create a simple sitemap and journey. Sketch entry, search results, room detail, form, unavailable and success screens. Add accessible labels, responsive layout rules and a clear error when the network fails. Include an authenticated production requirement for preventing two people reserving the same room-time combination.

**Practice arithmetic:** If rooms A and C are available at a selected time, their combined seating capacity is 4 + 6 = 10 seats, not ten separate rooms. If six of eight test participants complete the full task unaided, the observed success rate in that small sample is 75%. Neither statistic proves that all possible slots are available or that all real users behave similarly.

**Deliverables:** A 200-word brief, two personas marked as hypotheses, prioritized feature list, site map, six wireframes, four component specifications, accessibility checklist, short usability test and five engineering acceptance criteria.

**Reflection:** Describe an error state and one improvement you would measure after deployment.

<!-- MAIC-PAGE -->

## 12 — Knowledge Check, Project Portfolio and Sources

**Self-test:** (1) How does product design extend beyond UI? (2) Why investigate the problem before specifying a feature? (3) What is a user outcome rather than an output? (4) Why can personas remain hypotheses? (5) What should minimum useful functionality include? (6) Why distinguish a network failure from empty availability? (7) What should a responsive component preserve? (8) Which rules must be enforced on the server? (9) What can a small usability test establish? (10) What belongs in an engineering handoff?

**Final project:** Develop a responsible proposal for the fictional reservation product. Submit a concise research plan, evidence/assumption table, outcome definition, prioritization, journey map, sitemap, wireframes, component-state matrix, two responsive layout treatments, a prototype test and acceptance criteria. Write a short evaluation covering user value, feasible development, inclusion, privacy and an improvement decision based on observed evidence.

**Practice evaluation rubric:** Discovery and evidence 20%; value and scope decisions 15%; journeys and information architecture 20%; UI usability and accessibility 20%; testing quality 15%; practical handoff 10%. This assessment is a study activity, not an official grade, credential or deployment acceptance.

**Further references:** W3C WCAG 2.2, https://www.w3.org/TR/WCAG22/ ; W3C WAI Forms Tutorial, https://www.w3.org/WAI/tutorials/forms/ . Review the applicable accessibility standards and the actual implementation stack. All course examples, instructional text and figures are original MAIC teaching material.
