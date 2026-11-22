# ITIL 5 Service Design, Transition, and Delivery
**MICHIGAN ACADEMY OF INNOVATION AND CREATIVITY**

**Innovate. Create. Lead.**

COURSE STUDY MANUAL
Course language: English
Estimated guided study: 10 hours
Copyright 2026 MAIC. All rights reserved.

An original independent MAIC course about service-management practice in the context of ITIL (Version 5). ITIL is a trademark associated with PeopleCert. This course is not PeopleCert-accredited training, an official ITIL qualification, or an authorized reproduction of proprietary ITIL materials. Its exam is not a PeopleCert certification exam.

<!-- MAIC-PAGE -->

## 02 — Service Value Across Design, Transition and Delivery

Digital services deliver value when people can use them reliably, securely and with clear responsibilities. Designing a service concerns its intended outcomes, experience, risks and required resources. Transition coordinates a change from an existing or planned state into reliable use. Delivery and operation provide continuing service and feedback. These activities are connected, not isolated departments with no shared accountability.

PeopleCert introduced ITIL (Version 5) in 2026 as an evolution of service and digital-product management, with an increased emphasis on integrated value creation and responsible AI-enabled environments. The official scheme includes Foundation and advanced Product, Service, Experience, Strategy and Transformation modules. This MAIC course uses general service-management concepts; it does not claim to teach all proprietary PeopleCert examination requirements or confer its certification.

Learners should describe a service value proposition, identify stakeholders and service outcomes, develop a service design brief, plan transition readiness, recognize release and change risks, distinguish service level indicators, organize operational support, evaluate continuity and suppliers, and propose continual improvement.

**Ten-hour guided study:** Orientation 30 minutes; eight sections on pages 3–10 at 55 minutes each (440 minutes); service case on page 11 for 90 minutes; assessment on page 12 for 40 minutes. Total 600 minutes. A small fictional public-service helpdesk is the practice setting.

<!-- MAIC-PAGE -->

## 03 — Service Value, Customers, Users and Outcomes

A service is not just a software application or a technical ticket queue. Its value depends on what customers and users can accomplish with acceptable cost and risk. A customer may sponsor a service, a user performs actual tasks, and a provider coordinates people, processes, partners and technology. Distinguish these roles in a service brief rather than assuming every stakeholder has identical goals.

Define outcomes and constraints. For an appointment service, the user needs accurate availability and confirmation; the provider needs capacity control and reliable communication. A service level target should support these real outcomes. High server uptime is valuable but does not prove that all users can complete bookings. Combine technical reliability with experience and operational indicators.

Create a service value proposition and an accountability map. Document known dependencies: identity verification, data storage, messaging, staff approval and support hours. Clarify what is promised and what remains subject to approval. A “pending” request is not a confirmed reservation.

**Fictional example:** A learning-center booking portal is online 99.9% of the month but sends confirmations late. Technical availability alone does not capture customer experience.

**Practice:** Draft a six-field service brief and three measurable user outcomes.

<!-- MAIC-PAGE -->

## 04 — Service Design and Architecture

Service design connects user journeys, workflows, technology, data, roles, suppliers, controls and support mechanisms. Start from a defined demand and map the whole service, including failure states. A visible booking button does not constitute an end-to-end service if staff cannot approve requests or notify the person who submitted them.

A design should consider functional and nonfunctional needs. Functional requirements specify actions such as view availability, request a reservation, cancel and receive status. Nonfunctional requirements may address security, resilience, accessibility, privacy, response time and auditability. Document interfaces between teams and providers. A design that has no route for password recovery or message-delivery failure is incomplete.

Evaluate service capacity and cost. A service promised around the clock needs corresponding processes and resources. Define a support model, incident route, knowledge base and escalation responsibilities before launch. Design control should include appropriate access permissions and verified data; merely hiding a field in the client interface does not secure it.

**Fictional example:** A center's booking service relies on an email gateway. The design specifies what happens when delivery fails: the actual reservation status remains accessible through an authorized alternative.

**Practice:** Draw a service blueprint with user, frontstage, backstage, technology and support layers.

<!-- MAIC-PAGE -->

## 05 — Transition Planning, Change and Release Readiness

Transition moves an approved service design or change toward real use. It involves planning, testing, communication, training, data migration, readiness review and reliable fallback where appropriate. A release is a coordinated introduction of one or more changes; deployment is the technical act of moving components into an environment. The two concepts overlap but should not automatically be described as identical.

Assess risk according to impact, likelihood and affected stakeholders. A change to booking confirmation may affect reporting, support scripts, notifications and user trust. Define acceptance criteria and a release decision owner. Testing should include success and rejection paths, privacy protections and behavior under failed dependencies.

Separate authorization from mere technical completion. A build that deploys successfully may still contain a defect or lack an operational owner. A rollback plan should identify what can be reversed and what data effects require correction. For high-impact changes, staged deployment and monitoring can reduce risk, but the exact process should be proportionate to context.

**Fictional example:** A new notification template is ready, but the status codes are untested. The transition review blocks release until messages correctly distinguish pending, approved and rejected requests.

**Practice:** Prepare a ten-step transition checklist and a change-risk register.

<!-- MAIC-PAGE -->

## 06 — Service Levels, Measurement and Reliability

Service levels translate expectations into measurable commitments and review methods. An agreement may identify availability, response time, recovery and support. Define the measurement method and the period; a percentage without a denominator is not actionable. Distinguish a service level target from actual measured performance, and distinguish internal objectives from public promises.

Reliability concerns consistent operation, including dependencies and error handling. Availability can be calculated as time available divided by relevant total time under an agreed definition. However, scheduled maintenance exclusions and measurement rules can vary. A service may be available while a critical transaction fails, so pair availability with task success or transaction correctness.

Track leading and lagging indicators. Monitoring can detect early warning signs such as queue growth; incident counts reveal realized failures. Avoid constructing a dashboard that measures only what is easiest to count. Report data limitations and changes in measurement definitions.

**Worked arithmetic:** A fictional service is available for 719 out of 720 eligible hours in a 30-day period. Observed availability = 719 / 720 × 100 ≈ 99.86%. This does not prove that every booking was confirmed correctly.

**Practice:** Define four service metrics, their denominators and a review schedule.

<!-- MAIC-PAGE -->

## 07 — Incident, Problem and Request Management

A service request is a user request for a standard approved action, such as access to a service. An incident is an unplanned interruption or degradation. Problem management investigates underlying causes of incidents, especially recurring ones. These activities have different aims and should not be mixed into one unstructured queue.

Create a clear service desk intake process. Record affected service, urgency, impact, symptoms, time and assigned owner. Prioritize safety and widespread impact. Provide truthful updates while investigations continue. An incident being acknowledged is not the same as it being resolved; a proposed workaround may reduce impact without removing the root cause.

A recurring issue should prompt evidence-based cause investigation. An automated email failing for a particular group may be a mail-provider issue, data defect or incorrect workflow. Avoid blaming users or declaring root cause before confirming evidence. Knowledge articles and request templates can reduce repeat work when they are accurate and current.

**Fictional example:** Several learners cannot access confirmation emails. Support logs incidents, offers authorized status lookup and opens a problem investigation after identifying repeated patterns.

**Practice:** Write one sample incident record, one request record and one problem hypothesis with appropriate next actions.

<!-- MAIC-PAGE -->

## 08 — Continuity, Suppliers and Security

Service continuity prepares an organization to sustain or restore critical activities during disruption. Start with business impact: what happens if booking stops for an hour, a day or a week? Define recovery objectives appropriate to the real process, not arbitrary numbers copied from another organization's policy. Consider backup data, staffing alternatives, communication channels and dependencies.

Suppliers influence service reliability. Messaging, identity and hosting providers may have different commitments and failure modes. Maintain supplier contacts, responsibilities and escalation paths. A contract can allocate tasks but cannot eliminate risk; test the practical fallback. Security and privacy controls must cover personal records, authentication and authorized changes.

Plan exercises. A tabletop scenario may test how staff respond when the notification provider fails. Real disaster recovery requires verified backups, test restores and properly scoped security checks. No classroom exercise should be described as formal audit or certified resilience.

**Fictional example:** The center's email provider is unavailable for six hours. A status page and staffed phone line give truthful information while the service records remain protected.

**Practice:** Write a continuity playbook with three dependencies, owners and evidence-based recovery questions.

<!-- MAIC-PAGE -->

## 09 — Experience, Collaboration and Continual Improvement

Service experience concerns how people perceive and accomplish their tasks across channels. Teams should collect user feedback, observed task results, service tickets and transaction data. Operational changes should not prioritize a technical score at the expense of access and clarity. A service design that excludes callers without a smartphone may improve one metric while failing another group.

Continual improvement is a structured learning process: identify the need, establish baseline, choose intervention, implement under control, measure outcomes and decide next steps. An improvement register should identify owner, benefit, priority and status. Projects need not be large; accurate status wording may prevent more confusion than an expensive new interface.

Collaboration crosses development, operations, security, support and supplier management. Shared definitions matter: a developer may call a request successfully submitted, while a learner assumes the booking is approved. Agree how statuses are communicated to avoid contradiction.

**Fictional example:** Users repeatedly misunderstand a pending state. The team revises content and trains staff, then checks whether support inquiries decrease under a comparable method.

**Practice:** Create an improvement register with five ideas, metrics and responsible owners.

<!-- MAIC-PAGE -->

## 10 — AI-Enabled Services and Responsible Governance

AI can assist knowledge search, routing, summarization or service analysis, but it also introduces risks of incorrect answers, exposure of sensitive information and inconsistent decisions. Use AI where the task and benefits justify it, and retain human oversight for consequential decisions. The existence of AI in a service does not remove accountability or automatically improve value.

Define boundaries for automated guidance. A chatbot can explain how to request a workshop seat; it must not claim an unapproved reservation is confirmed. Sensitive actions require authenticated systems and appropriate authorization. Training data, personal information, monitoring and escalation should be reviewed against applicable privacy and organizational rules.

Measure actual service quality after AI adoption. A shorter response time may be accompanied by more incorrect guidance, so monitor errors, human overrides, user satisfaction and incident severity. Be clear about limitations. PeopleCert's Version 5 emphasis on AI-enabled digital products provides background, not a license to reproduce official exam content.

**Fictional example:** An assistant incorrectly states that a learner has a confirmed workshop seat. The process blocks that claim unless an authorized backend record verifies it.

**Practice:** Write an AI service-risk register, three guardrail requirements and one human escalation scenario.

<!-- MAIC-PAGE -->

## 11 — Worked Case: Transitioning a Learning-Center Booking Service

**Entirely fictional operational scenario.** A learning center replaces a manual booking email with a web portal that offers session requests, capacity checking and status tracking. The old process is slow but understood by staff. The new system relies on an identity provider, database, message gateway and trained service team. Users need accurate confirmation, safe data handling and a fallback when messaging is unavailable.

Create a service blueprint with customer-facing screens, staff approval, backend operations and supplier dependencies. Define three transaction states: pending, confirmed and rejected. Design release acceptance tests: missing inputs, slot conflict, unauthorized request, message failure and successful confirmation. Do not call a deployment successful solely because the website loads.

**Illustrative metrics:** If the portal is available for 719 of 720 eligible hours, availability is approximately 99.86%. If 90 of 100 valid booking attempts receive correct authorized decisions, the observed correct-decision rate is 90%, which reveals an issue that availability alone would miss. Neither percentage represents a real MAIC service.

Prepare support ownership, a rollback plan, continuity alternatives and a two-week feedback review. If AI-assisted support is introduced, define when it may answer informational questions and when it must defer to the trusted reservation database.

**Deliverables:** Service design brief, transition plan, four service metrics, incident escalation, continuity summary and evidence-based improvement list.

<!-- MAIC-PAGE -->

## 12 — Practice Review, Portfolio and Official Framework Context

**Self-test:** (1) What distinguishes customer, user and provider roles? (2) Why is service design more than a screen? (3) How does a release differ from deployment? (4) Why should confirmation rely on authorized service data? (5) What does availability fail to measure? (6) How do incident and problem management differ? (7) Why are supplier dependencies part of continuity? (8) What makes continual improvement measurable? (9) What AI service boundary protects transactional accuracy? (10) Why does this course not confer an official ITIL qualification?

**Final project:** Develop an original service design and transition pack for the fictional learning-center booking service. Include service value, blueprint, role chart, service-level definitions, transition and testing checklist, incident/problem workflow, continuity options, AI guardrails if used, a cost/risk register and a measurable improvement plan.

**Practice rubric:** Service outcomes and design 20%; transition readiness 20%; reliability and service levels 20%; support and continuity 15%; experience and AI governance 15%; review documentation 10%. Study completion does not confer PeopleCert certification or independently approve an MAIC student examination.

**Official context references:** PeopleCert, ITIL (Version 5) Explained (https://www.peoplecert.org/itil-version-5-explained); ITIL Qualification Scheme (https://www.peoplecert.org/Frameworks-Professionals/ITIL-Framework); PeopleCert FAQ (https://www.peoplecert.org/help-and-support/faq-itil). Check official terms before offering accredited ITIL training. This course's text, case and practice questions are independently authored.
