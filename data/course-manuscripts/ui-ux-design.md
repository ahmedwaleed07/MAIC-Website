# UI / UX Design
**MICHIGAN ACADEMY OF INNOVATION AND CREATIVITY**

**Innovate. Create. Lead.**

COURSE STUDY MANUAL
Course language: English
Estimated guided study: 6 hours
Copyright 2026 MAIC. All rights reserved.

Original independent MAIC learning content. The fictional product and usability data used for exercises are illustrative, not verified market research. The course does not claim external professional certification.

<!-- MAIC-PAGE -->

## 02 — Understanding User Experience and Interfaces

User experience (UX) concerns how people perceive and accomplish tasks in a product or service. User interface (UI) design concerns the interactive controls, content arrangement, feedback and visual presentation through which they do so. An attractive screen can still produce a poor experience if it is confusing, slow, inaccessible or fails to complete an important action. Good design connects user needs to business and technical constraints.

At the end of this course, learners should identify a user problem, write a research plan, map tasks and information architecture, create wireframes, design a navigation system, construct an interface hierarchy, assess accessibility, prototype a task and evaluate usability evidence. The course emphasizes observing behavior rather than declaring a screen “intuitive” based only on a designer's preference.

**Six-hour guided schedule:** Orientation and problem framing 20 minutes; pages 3–10, 35 minutes each (280 minutes); worked product case on page 11 for 45 minutes; practice evaluation on page 12 for 15 minutes. Total 360 minutes. Any design tool, paper or editable diagrams can support the exercises.

**Starter task:** Imagine a site for scheduling a library study room. A user should find an available room, choose a date and receive confirmation. Write what successful completion means and what failure or misunderstanding would look like.

<!-- MAIC-PAGE -->

## 03 — Problem Framing, Stakeholders and Success Measures

Begin by defining the problem, not the intended visual solution. A stakeholder might say “add a large booking button”; users might actually struggle because available dates are unclear. Separate symptoms from causes. A problem statement names an affected audience, a task, observed friction and why it matters. It should not assume a predetermined interface component is correct.

Map stakeholder interests: learners need clear steps, administrators need reliable inventory, support staff need traceable records, and the organization needs feasible operations. These priorities can conflict. Document assumptions, constraints, security and privacy needs. Identify the main service task and acceptable completion conditions before sketching screens.

Choose outcomes that reflect the user's goal. Task-completion rate, error frequency, time to complete a typical task, comprehensibility of labels and accessibility barriers may be more useful than button color preference. Measurement requires defining who participated, what they were asked to do and what counts as success. A small classroom test cannot represent every potential user.

**Fictional example:** Users repeatedly submit booking requests without selecting a room. The root cause could be unclear room selection or confusing validation. The team needs observation before assuming the solution is a brighter button.

**Practice:** Write one neutral problem statement and three observable success criteria. Identify two hypotheses you would test rather than treat as proven.

<!-- MAIC-PAGE -->

## 04 — User Research and Respectful Evidence Collection

User research helps designers understand actual tasks, environments and obstacles. Methods include interviews, observation, moderated usability sessions, surveys and analysis of support queries. Different methods answer different questions. Interviews describe experiences and expectations; observing users attempt a task reveals specific breakdowns; analytics may show where people leave a flow but cannot alone explain why.

Recruit participants relevant to the intended task rather than only people who enjoy the existing app. Define consent and privacy expectations. Ask neutral questions such as “How did you try to book a room last time?” rather than “Wouldn't this new booking design be easier?” Record observations separately from interpretations. A participant asking where the confirm button is reflects a visible difficulty; a claim that the person dislikes technology is an unsupported inference.

Avoid fabricating interview quotes, demographic profiles or statistical significance. A test with five classmates can reveal candidate usability problems, but its findings should be labeled exploratory. Keep sensitive user information out of unneeded recordings and public prototype demonstrations. Report negative findings, since the purpose of testing is to improve the product.

**Fictional example:** Three participants cannot find cancellation rules in a room-booking flow. The design team records where they searched and then tests more visible policy placement.

**Practice:** Draft five neutral interview prompts and a four-column research note table: task, observation, interpretation and follow-up question.

<!-- MAIC-PAGE -->

## 05 — Personas, Jobs, Journeys and Information Architecture

Personas are concise working models of user needs and contexts, not substitutes for actual people. A persona should be grounded in research where possible and identify goals, constraints and decision patterns without stereotyping by age or nationality. A jobs-to-be-done view asks what progress the user wants, such as reserving a quiet space before an examination rather than merely clicking a calendar widget.

Journey maps describe stages across time and channels. A booking journey might include searching, comparing times, reviewing policy, confirming and managing a reservation. Mark questions and pain points at each step. Information architecture groups content and actions into findable categories. Labels should describe user meaning: “My bookings” is usually clearer for an account's reservations than a vague “Operations” menu.

Card sorting and tree testing can provide evidence about labels and structure when performed with suitable users. Do not overload a navigation bar with every administrative option. A user-facing flow should separate essential actions from advanced settings while maintaining clear escape routes. The correct structure depends on tasks and content volume.

**Fictional example:** A study-room product separates Browse rooms, My bookings and Help. Admin-only room capacity management remains in an authenticated management area rather than appearing as a main customer action.

**Practice:** Draw a five-step journey and a three-level sitemap. Test whether a new user could find the cancellation rule without guessing.

<!-- MAIC-PAGE -->

## 06 — Flows, Wireframes and Interaction States

A user flow shows actions and decisions between an entry point and a goal. Include successful paths, validation errors, empty results and cancellation, not only the ideal path. A wireframe represents layout and hierarchy before detailed branding. It helps teams discover whether essential controls are visible, labels are meaningful and the steps are reasonably short. Low-fidelity sketches can reveal errors before a visual style makes them harder to discuss.

Draw controls that communicate their role. A form needs explicit labels and a way to correct mistakes. A date picker should indicate unavailable dates and not pretend an empty list means an application failure. Confirmations should state what has actually happened, with a reference number or next action when appropriate. Destructive actions may need a clear warning or reversible path depending on risk.

Do not move primary navigation or change control sizes unpredictably between states. Keyboard, touch and pointer interactions should be considered. Show loading feedback without promising completion before the server confirms it. A prototype may simulate success, but its content must remain clearly marked as demonstration when it is not connected to real booking data.

**Fictional example:** Selecting a room without a date triggers an inline label explaining the missing input; the Confirm button does not falsely issue a booking receipt.

**Practice:** Build six wireframe states: search, results, details, form, error and confirmation. Trace the back-navigation route.

<!-- MAIC-PAGE -->

## 07 — Visual Hierarchy, Components and Design Systems

UI hierarchy directs attention using size, contrast, typography, spacing and consistent placement. Primary actions should be clearly distinguished from secondary ones, while critical warnings should be obvious without visual aggression. A design system defines reusable components and their states: buttons, text fields, cards, menus, dialogs, navigation and feedback. It protects consistency across screens.

Set meaningful design tokens for color, type sizes, space and borders. Tokens allow consistent changes without manually modifying every instance. Include interaction states such as default, hover where relevant, focus, disabled, loading, error and success. The state must communicate actual functionality. A disabled button may need a nearby explanation rather than leaving users to guess why they cannot continue.

Responsive design should preserve the task and readable order on narrow devices. A two-column desktop form may become one column on mobile, but the meaning and required fields should remain consistent. A fixed brand mark should not stretch, tilt or change typography on language switching. Test the same interactive element in multiple contexts.

**Fictional example:** A calendar selector and confirmation button share a consistent radius and spacing across mobile and desktop. The booking form retains explicit field labels at both sizes.

**Practice:** Define five reusable components and a mini specification showing each component's state, visual emphasis and accessibility expectations.

<!-- MAIC-PAGE -->

## 08 — Accessibility, Inclusive Design and Error Prevention

Accessibility should be part of the design process, not a separate patch after launch. W3C's Web Content Accessibility Guidelines (WCAG) 2.2 organize success criteria around perceivable, operable, understandable and robust content. Interface design should consider text contrast, meaningful labels, focus visibility, touch-target usability, keyboard interaction, correct reading order and non-color indicators of errors. The detailed criteria differ by conformance level.

An accessible booking form does not depend on placeholder text as the only label. Errors identify the affected field and explain a correction. A red border alone is insufficient. Accessible names for buttons should describe their action. For dynamic results or loading, feedback should be detectable without pretending an operation is complete. Test with keyboard operation and assistive technology when feasible; a high-contrast mockup is not proof of full compliance.

Design for varied devices, languages and cognitive loads. Keep critical instructions concise, preserve readable text on zoom and avoid unexpected timeouts or hidden steps. Arabic interfaces need appropriate script shaping and right-to-left content handling; fixed branding can remain in its approved typography. Inclusion also requires recognizing limited connectivity or slower devices.

**Fictional example:** A form error reads “Select an arrival date” beside the date input, remains visible without color and is announced appropriately in a real implementation.

**Practice:** Audit a form against six accessibility checkpoints and record which problems require technical implementation testing.

<!-- MAIC-PAGE -->

## 09 — Prototyping, Usability Tests and Iterative Evaluation

A prototype is a controlled representation of a planned experience. Low-fidelity prototypes test flow and information architecture; higher-fidelity versions test visual hierarchy, states and interaction details. The prototype may not implement the actual database or payment process, so simulated success must not be mistaken for a live transaction.

Write usability tasks as realistic goals without dictating the clicks participants should use. “Reserve an available room for Tuesday at 2 p.m.” is more useful than “Tap the blue Reserve button.” Observe errors and hesitation, record whether the user finishes independently and ask neutral follow-up questions. Predefine task success and identify moderator assistance separately.

Quantitative measures can include completion rate and time on task, but sample size matters. A test with five people may generate valuable qualitative insight yet cannot prove precise population percentages. Prioritize issues by severity, frequency and business/user impact. Change the design and rerun a relevant test; do not claim success solely because the team prefers the revised screen.

**Worked example:** Six out of eight fictional participants complete the booking task unaided. Observed task success is 6/8 = 75% in that sample. If two others finish with moderator help, report this separately rather than calling the unaided rate 100%.

**Practice:** Write a three-task test plan, observation sheet and severity ranking for three hypothetical difficulties.

<!-- MAIC-PAGE -->

## 10 — Handoff, Responsible Measurement and Continuous Improvement

Moving from prototype to production requires design specifications, assets, component states, accessibility requirements, content, localization rules and acceptance criteria. Developers should understand what each button does, which data is saved and which errors appear when the backend fails. Avoid handing over only screenshots that omit the behavior behind an attractive screen.

Define acceptance tests using actual behavior. A booking is confirmed only after an authorized server operation succeeds; a canceled booking should update the relevant record and interface consistently. Data privacy and security are design constraints, especially for personal contact details. Error messages should help users recover without revealing sensitive internal information.

After release, use support records, completion data, error logs and properly conducted user tests to evaluate the experience. Analytics can identify symptoms but needs careful interpretation. A rise in page visits is not by itself proof that the booking process improved. Document design changes and preserve versions so regressions can be investigated. User feedback should not be dismissed merely because the interface follows a polished style guide.

**Fictional example:** The prototype shows a confirmed reservation on click, while the live API can reject the time slot. The production UI must wait for the actual response and explain unavailable slots clearly.

**Practice:** Write five developer acceptance criteria and one post-launch learning plan that covers errors, task success and accessibility.

<!-- MAIC-PAGE -->

## 11 — Worked Case: Study-Room Booking Experience

**Entirely fictional case.** A learning center has three study rooms and wants students to book available periods. A user needs to choose a room, select a date/time, read the cancellation policy, provide required contact details and obtain a genuine booking confirmation. The center's administrator must prevent overlapping reservations. The fictional current site sometimes shows all available dates as blank, but the team does not know the root cause.

Begin with a research plan for users who need morning and evening sessions. Sketch a journey from discovering rooms to changing a booking. Build a sitemap with Browse, My bookings and Help. Wireframe the results screen with clear time labels, an accessible empty state and explanation when no slots exist. Add a form with inline validation and a waiting state that does not claim success before confirmation.

Design a mobile and desktop version. Use shared components for buttons and fields while keeping the main navigation predictable. For an eight-person exploratory study, suppose six finish unaided, one finishes after help and one fails. The unaided rate is 6/8 = 75%; the assisted finish must be reported separately. This small fictional sample is not a population statistic.

**Required outputs:** A problem statement, three research hypotheses, sitemap, five-step flow, six wireframe states, mini design system, accessibility checklist, usability tasks and versioned revision notes. Define one technical acceptance test for preventing duplicate bookings.

**Reflection:** Explain how you would respond if the Confirm button appeared active but the server refused a booking. The system should show an accurate error and preserve user input where appropriate.

<!-- MAIC-PAGE -->

## 12 — Knowledge Check and Portfolio Assessment

**Self-test:** (1) How do UX and UI differ? (2) Why begin with a problem statement? (3) What can observation reveal beyond an interview? (4) Why are personas research hypotheses? (5) What does information architecture organize? (6) Which nonideal states belong in a booking flow? (7) Why does an error need text beyond color? (8) What is the difference between a prototype click and a confirmed transaction? (9) What can six unaided completions among eight participants establish? (10) Why should developer handoff include behavior and not just artwork?

**Portfolio task:** Design a complete fictional room-booking flow. Submit a brief, research plan, journey, sitemap, wireframes, five component specifications, responsive screen, three realistic usability tasks and the revision decisions supported by your observations. Include an example of an error state and explain when a server response is needed.

**Practice rubric:** User problem and research logic 20%; task structure and flows 20%; interface hierarchy and components 20%; accessible design 20%; usable prototype and testing 10%; production handoff and evidence quality 10%. This is practice feedback, not an official MAIC examination or certification.

**References:** W3C WCAG 2.2, https://www.w3.org/TR/WCAG22/ ; W3C WAI Forms Tutorial, https://www.w3.org/WAI/tutorials/forms/ . Review the latest applicable standards and real software requirements before release. All student scenarios are invented MAIC teaching cases.
