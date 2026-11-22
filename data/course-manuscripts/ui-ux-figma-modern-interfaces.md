# Apply UI/UX Design with Figma for Modern Interfaces
**MICHIGAN ACADEMY OF INNOVATION AND CREATIVITY**

**Innovate. Create. Lead.**

COURSE STUDY MANUAL
Course language: English
Estimated guided study: 8 hours
Copyright 2026 MAIC. All rights reserved.

Original independent MAIC study material. Figma is a product of Figma, Inc.; this is not a vendor certification. Available tools and plan entitlements may change. Check official product help for your actual workspace and version.

<!-- MAIC-PAGE -->

## 02 — From User Need to Interactive Interface

Figma provides a collaborative design environment for arranging screens, defining components and exploring prototype interactions. It does not replace user research or the engineering required for a live application. A successful Figma project begins with a task and a coherent content model, then uses frames, auto layout, components and prototypes to test design ideas. Attractive static screens are only a portion of a complete interaction.

This course applies UX reasoning to a practical booking interface. Learners should organize a design file, establish grids and text styles, use Figma frames, apply auto layout and resizing, build a component library with variants, connect prototype screens, document states, test a task and prepare a responsible developer handoff. The application case is fictional; no prototype constitutes an actual booking.

**Eight-hour guided plan:** Introduction 20 minutes; pages 3–10 at 45 minutes each (360 minutes); applied prototype on page 11 for 60 minutes; final presentation and review on page 12 for 40 minutes. Total 480 minutes. Use a Figma account with available editing features; some advanced prototyping features and collaboration modes may require eligible plans.

**Starter exercise:** Sketch a room reservation card, a date selector and a Confirm control on paper. Before reproducing them in Figma, write how the screen should react to empty results and failed confirmation.

<!-- MAIC-PAGE -->

## 03 — Planning the Figma File and Screen Structure

Create a clearly named design file for the fictional room-booking project. Organize pages or sections for research notes, explorations, components, final screens and handoff. A consistent naming convention helps other people understand the difference between editable source frames and finished mockups. Avoid publishing confidential customer data in shared design files or using public links without permission.

Start with basic frames for a narrow phone and a wider desktop context. Place content in logical groups: top navigation, heading, available-room list, selected booking details, and feedback region. A frame is the container for design elements and may support responsive behaviors. Test hierarchy with real-length text instead of placeholder strings that all happen to fit.

Define the primary task in writing: “Choose an available room and receive a confirmed reservation.” Record the requirements that must survive device changes: labels, dates, cancellation conditions and a reliable status message. Keep design notes describing what the prototype can and cannot simulate.

**Fictional example:** A phone frame shows a search heading, date control, room cards and My bookings navigation. The desktop version may spread the content into columns but should preserve the same information and actions.

**Practice:** Establish sections named Brief, Components, Mobile, Desktop and Review. Add annotations explaining each screen's user goal and the states that remain incomplete.

<!-- MAIC-PAGE -->

## 04 — Frames, Auto Layout and Responsive Resizing

Figma's auto layout helps arrange children using spacing, padding, alignment and flow rules. Current official guidance describes vertical, horizontal and grid flows, and the shortcut Shift+A for adding auto layout in supported editing contexts. Use these tools to make structures adapt when text changes or a component is resized. A responsive frame should respond to content rather than require manual repositioning for every edit.

Apply auto layout first to a button: icon or label plus horizontal and vertical padding. Then place buttons inside a horizontal group and cards inside a vertical list. Test the group with a longer translated label; it should grow, wrap or rearrange according to explicit resizing decisions. Distinguish a fixed width from content-based sizing, and verify which children can fill available space.

Auto layout is not the same as a browser's fully implemented responsive system. It is a design model requiring tests and engineering translation. Child-layer constraints work differently when an element follows auto layout than when it ignores the flow. Check the actual Figma help before assuming a control provides a particular constraint behavior in every context.

**Worked example:** A booking button uses 16 units of horizontal padding on each side and a 100-unit text label. Its content-based width is approximately 16 + 100 + 16 = 132 units, excluding border and icon effects. A longer label should not be clipped merely to preserve 132 units.

**Practice:** Build an auto-layout button and three-card list. Resize the parent to a narrow width and record what breaks.

<!-- MAIC-PAGE -->

## 05 — Text, Color Styles and Accessible Foundations

Establish typographic roles before decorating screens: title, section heading, body, form label, caption and button text. Choose sizes and spacing based on actual reading context. Create reusable color and text styles or other supported design-system resources appropriate to the current Figma environment. Consistent naming, such as Text/Body and Color/Primary, helps handoff.

Use color to clarify actions and states. Do not rely only on green and red to indicate success and failure; messages need readable labels. Evaluate text/background contrast against current accessibility requirements for the intended product. The general WCAG 2.2 AA contrast threshold for normal text is 4.5:1 and for qualifying large text is 3:1, subject to exceptions. Contrast alone cannot establish focus, semantics or keyboard accessibility in implemented software.

Add realistic copy. A room-card title should show the actual room name, capacity and time availability. A booking form label should remain visible when a value is entered. A disabled Submit state should have a clear explanation for what is missing. Keep the official brand wordmark distinct from translatable interface copy, and test localized labels without distorting fixed identity geometry.

**Fictional example:** A card displays “Room A — 4 seats” and a clear Available label. The user does not have to interpret green fill as the only sign of availability.

**Practice:** Define a six-role type scale, three color roles and two error/success message styles, and test their readability.

<!-- MAIC-PAGE -->

## 06 — Components, Instances and Variants

A component is a reusable source for interface elements. Its instances allow the design to share consistent structure while adapting permitted details. Build a button component with labels and icon slots, then create documented variants for default, hover where relevant, disabled, loading and error-adjacent feedback. Component variants can represent related options without making numerous unrelated duplicate frames.

Current Figma help describes interactive components that switch between variants using prototyping interactions. This can make repeated controls easier to demonstrate. However, a simulated transition between visual states does not implement real authentication, capacity checking or database writes. Document which state changes are illustrative and which require backend logic in production.

Name components by semantic function and properties rather than accidental visual appearance. For example, Button / Primary, Input / Date and Card / Room communicate intended roles. Keep padding, radii and labels consistent. Review instances after master component changes; a library update should not silently make text unreadable in one language.

**Fictional example:** A date-field component supports Empty, Selected and Error states. In a prototype, the Error variant explains “Choose a date” without requiring a real calendar API.

**Practice:** Create three component families, at least three meaningful button states and two variants of a form field. Note where the component needs real implementation semantics.

<!-- MAIC-PAGE -->

## 07 — Building a Multi-Step Prototype

A Figma prototype connects frames and interactions to simulate a user journey. Outline the flow before wiring connections: Browse rooms, Room details, Choose date, Review, Confirmation. Include a no-availability branch and a missing-date error. Link interactive controls to the correct destinations and make Back navigation behave predictably. The actual interaction options can differ by Figma workspace and plan.

Prototype demonstrations should never imply that a completed click writes a genuine reservation. A confirmation frame is explicitly a simulation. Use realistic task text and make errors observable. Avoid the common mistake of connecting every button to the same success screen, which prevents testing meaningful validation.

Use overlays, scroll behavior and transitions only where they improve the task demonstration. A modal should be understandable and have a way to close or reverse the action. A dramatic animation is not a substitute for clear feedback. For a real product, technical requirements include accessible keyboard focus and screen-reader semantics, neither of which is guaranteed by a prototype link alone.

**Fictional example:** The Confirm button moves to a simulated Confirmation frame only when the prototype's chosen branch represents a valid form. An empty date goes to an explanatory error instead.

**Practice:** Build at least six connected screens, including a failed or unavailable state. Use a test plan to verify every destination and back path.

<!-- MAIC-PAGE -->

## 08 — Design Variables, Modes and Interaction Limits

Design variables can store named values for color, numeric properties, text or boolean states when supported. They can help connect a design-system decision to multiple screens and, in eligible plans, drive more advanced prototype behavior. Official Figma documentation indicates that variables in prototypes require eligible paid or education-type plans and edit access. Do not assume every Free account can access every advanced action.

Begin with simple shared color tokens and a spacing system. If available, introduce modes for different contexts, such as light and dark color presentations, and test contrast in each. A boolean variable may simulate whether a selection is active; a string variable may change a label. All states remain prototype representations until implemented with real application logic.

Avoid variable complexity that hides the core task. A room-booking prototype does not need a deeply automated state machine if a few clear frames reveal the relevant usability problem. Document defaults, relationships and limitations so a reviewer can reproduce the intended state. Never describe simulated reservation data as a real customer record.

**Fictional example:** A prototype text variable displays “Room B selected,” but the resulting booking remains fictional. The live system would still require server-side availability checks.

**Practice:** Define three design tokens and, if the plan supports it, test one variable-based state. Provide a static alternative for reviewers without that entitlement.

<!-- MAIC-PAGE -->

## 09 — Responsive Design and Multilingual Interface Testing

A modern interface may need layouts for phones, tablets and desktop browsers. Use frames with deliberate widths, appropriate auto layout and components that adapt to content. Test when a long label wraps, an icon separates from text or a list exceeds the viewport. Preserve the order of steps and visibility of actions. Do not treat shrink-to-fit as a universal mobile solution.

Localization introduces meaningful complexity. Right-to-left scripts require appropriate shaping, direction and spacing. Mixed Arabic and English details, such as emails, URLs and numeric dates, need actual rendering checks. A fixed official wordmark should stay unchanged when interface copy is translated. Auto layout can adapt to changed text length but does not automatically solve every reading-order or navigation concern.

Check feedback states in each relevant locale. A small “error” icon may be insufficient; explanatory text should also be present. Ensure the user can identify the current selected room and date without relying on color alone. Test a narrow viewport with long room names and multilingual cancellation instructions.

**Fictional example:** A room list that fits two columns on desktop becomes one column on a phone. The My bookings button retains its position in the navigation model, even as the visual arrangement changes.

**Practice:** Produce one mobile and one desktop variant plus an Arabic-language label test. Record three layout defects and their corrections.

<!-- MAIC-PAGE -->

## 10 — Reviews, Handoff and Real-World Implementation

A design review should focus on task success, not merely color preference. Ask participants to complete realistic actions without telling them which controls to use. Record confusion, wrong destinations, back-navigation failures and unreadable states. A design file can include annotations naming component behavior, measurements, content sources and technical acceptance criteria.

Handoff requires more than a polished link. Provide developers with frame descriptions, reusable component specifications, interaction states, color and type tokens, asset rights, localization requirements and error handling. If a plugin or integration produces code, it still needs engineering review, testing and accessibility checks. A prototype does not directly supply a secure production system.

Record which features depend on Figma plan access. Advanced variable interactions, for instance, should have screenshots or an equivalent static explanation when reviewers cannot reproduce them. Keep a history of the approved design version. When a component changes, audit linked screens for unintended impacts.

**Fictional example:** An engineer asks what happens when a booking time becomes unavailable while the user is reviewing. The handoff explicitly specifies a rejected confirmation state with a new availability choice, rather than inventing success.

**Practice:** Prepare a one-page handoff note with five interaction states, two responsive decisions and three testable development conditions.

<!-- MAIC-PAGE -->

## 11 — Worked Case: Room Booking in Figma

**Entirely fictional exercise.** A community learning center has three rooms available for reservations. Users need to find a room, choose date and time, review cancellation rules and receive confirmation. The actual data and technical booking service are not connected to the Figma project.

Create a Figma file with the sections Brief, Components, Mobile, Desktop and Handoff. Define fonts, color roles and common spacing. Build Room Card, Date Field and Primary Button components with relevant variants. Use auto layout to stack cards and allow a longer room title without overlapping the next item. Create six prototype screens covering entry, available list, room detail, booking form, validation error and simulated confirmation.

**Applied sizing:** A fictional button uses a 104-unit text label and 16 units of padding on each side. With no icon, its nominal content/padding width is 104 + 16 + 16 = 136 units before borders or other properties. Test a translated 150-unit label rather than assuming it will fit the same width.

Ask three classmates to attempt a specific task without guidance. Record observed errors and back-navigation issues; do not claim this convenience sample represents all students. Retest the revised component and note what changed. Include a short comparison of desktop and mobile screens and a warning that the confirmation is simulated.

**Deliverables:** Organized Figma file or annotated screenshots, source brief, three component families, six-screen prototype, one responsive test, test observations and developer handoff notes.

<!-- MAIC-PAGE -->

## 12 — Knowledge Check and Practical Assessment

**Self-test:** (1) What does a Figma frame contain? (2) What does auto layout control? (3) What shortcut can apply auto layout in current guidance? (4) How does a component differ from its instance? (5) What is a variant used for? (6) Why can a simulated confirmation not establish an actual booking? (7) What can design variables store? (8) Why must plan entitlement be checked for advanced prototype variables? (9) How should right-to-left localization be tested? (10) What should accompany a developer handoff?

**Final assignment:** Produce an original interface prototype for the fictional booking service. Deliver a brief, two responsive layouts, three reusable components, a selection-and-confirmation interaction, at least one validation error, documented prototype limitations, a short usability test and acceptance criteria for a future production implementation. Mark all names and data as hypothetical.

**Practice rubric:** Task and requirements 15%; Figma file organization 10%; auto layout and responsive behavior 20%; components and variants 20%; prototype accuracy and error states 15%; accessibility and localization 10%; test notes and handoff 10%. This is not a Figma certification or a completed MAIC student examination.

**Official reference materials:** Figma Help, Guide to auto layout, https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout-in-Figma ; Create interactive components with variants, https://help.figma.com/hc/en-us/articles/360061175334-Create-interactive-components-with-variants ; Use variables in prototypes, https://help.figma.com/hc/en-us/articles/14506587589399-Use-variables-in-prototypes ; W3C WCAG 2.2, https://www.w3.org/TR/WCAG22/ . Check current terms and features. Course text and examples are independently authored by MAIC.
