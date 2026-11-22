# BIM Fundamentals: Smarter Building Design & Planning
**MICHIGAN ACADEMY OF INNOVATION AND CREATIVITY**

**Innovate. Create. Lead.**

COURSE STUDY MANUAL
Course language: English
Estimated guided study: 8 hours
Copyright 2026 MAIC. All rights reserved.

Original independent MAIC material. Building Information Modeling terminology is explained at an introductory level. The fictional building data are not construction-approved. This course is not a buildingSMART certification or an ISO conformity assessment.

<!-- MAIC-PAGE -->

## 02 — BIM as a Shared Information Process

Building Information Modeling (BIM) combines structured building information with digital representations and coordinated workflows. A three-dimensional view can be part of BIM, but geometry alone is insufficient: a wall may need an identity, properties, relationships, construction phase and a trusted information source. Teams should be able to use the same agreed data without confusing outdated assumptions with approved facts.

Learners should identify project information requirements, describe key model objects and properties, organize roles and files, explain common data environments, understand open exchange concepts, perform basic model coordination, assess information quality and define useful deliverables for construction and operation. The objective is responsible information management rather than proficiency in one commercial BIM application.

**Eight-hour guided plan:** Orientation 20 minutes; eight topic sections on pages 3–10 at 45 minutes each (360 minutes); coordination case on page 11 for 60 minutes; final assessment on page 12 for 40 minutes. Total 480 minutes. A spreadsheet and simple model viewer can support the exercises where full authoring software is unavailable.

**Starter:** Compare a picture of a wall with a structured wall record containing ID, dimensions, material assumption, location, revision and responsible author. Identify which questions the structured record can answer.

<!-- MAIC-PAGE -->

## 03 — Roles, Goals and Information Requirements

BIM planning begins by identifying what decisions people need to make and when. An owner may need asset and maintenance data, designers need geometry and performance context, contractors need coordinated constructible information, and facility managers need reliable handover records. The same model does not automatically satisfy every stakeholder unless its intended uses and data requirements are defined.

Write project information requirements with a clear purpose. For example, a planned classroom building might need space areas, door identifiers, planned room functions and equipment references. Define how accurately these must be known at each stage. A preliminary wall position is not a surveyed as-built condition. Information should have an author, status, revision and approval process.

An information delivery plan identifies responsibility and timing. Do not demand maximum geometric detail on day one if the actual decision only needs rough massing. Conversely, insufficient information about service shafts can hide design conflicts later. Agree how issues and changes will be reported and who may accept them.

**Fictional example:** A campus project needs to know which mechanical equipment serves each classroom. A model showing air-conditioning boxes without identifiers cannot reliably supply a maintenance schedule.

**Practice:** Draft six stakeholder information needs, corresponding fields and an accountable reviewer.

<!-- MAIC-PAGE -->

## 04 — Objects, Properties and Information Quality

A BIM object represents something meaningful, such as a wall, door, space, beam or air-handling unit. Its geometric shape is only one attribute. Other properties may identify type, classification, dimensions, material, performance, system membership, location and relevant status. An object called “Wall 1” without trustworthy metadata cannot necessarily support quantity takeoffs or asset management.

Distinguish type-level properties shared by many objects from instance-level values applying to one element. A classroom door may inherit a type description while having a unique ID, location and maintenance record. Ensure identifiers are stable and unique within the intended system. Avoid overloading one free-text field with unrelated values when structured data would support validation.

Quality control should check completeness, consistency, permissible values and relationships. A door linked to a nonexistent room or recorded in the wrong floor level is a data problem, even if the visual model looks plausible. Define units and classification rules. A quantity extracted from the model can be inaccurate when objects are missing or duplicated.

**Fictional example:** A two-storey building contains ten similar doors. Each needs a distinct instance identity, even though all ten may reference one door type.

**Practice:** Build a sample object schedule with ten rows and identify duplicate IDs, missing room references and inconsistent units.

<!-- MAIC-PAGE -->

## 05 — Coordination Across Disciplines

Architectural, structural and mechanical/electrical/plumbing teams often contribute different information. Model coordination compares their intended geometry and data to identify conflicts before work is executed. A mechanical duct intersecting a beam is a candidate clash; it may require changing the route, opening, structure or installation sequence. A software clash detection result is a prompt for investigation, not automatic proof of a design error.

Coordinate through agreed model references, locations, units and revisions. A duct may appear to intersect a beam because one file uses the wrong origin or vertical datum. Verify model alignment before assigning responsibility. Group issues by severity, affected work and decision owner. Record resolutions and retest the relevant models.

Consider information conflicts beyond geometry. Two drawings may give different door fire ratings, or different teams may use inconsistent room identifiers. A change in one discipline should trigger review of dependent work. Coordination meetings need recorded outcomes rather than only screenshots.

**Fictional example:** A proposed ventilation route conflicts with a structural support. The team identifies the exact elements and assigns the issue to mechanical and structural reviewers; students must not decide the structural modification without qualified input.

**Practice:** Describe three clash candidates and the evidence needed to determine whether they are real.

<!-- MAIC-PAGE -->

## 06 — Common Data Environments, Versions and Approval

A Common Data Environment (CDE) supports the controlled collection, management and sharing of project information. It should clarify where drafts, shared coordination information, published deliverables and archived records belong. File storage alone is not a mature workflow: teams need naming rules, access permissions, responsibility, change logs and release approval.

A preliminary model should not be mistaken for an approved construction issue. Mark information status and suitability for its intended use. When one team updates a design, recipients need to know which version to review. Avoid simultaneous editing of conflicting copies without a reconciliation process. Preserve change history for audit and rollback when appropriate.

Access control also matters. Contractors may need published coordination files but not confidential owner documents. Sensitive facility information should be shared on a need-to-know basis with suitable protections. Claims that a CDE is secure require actual configuration and testing; the workflow diagram alone is insufficient.

**Fictional example:** A designer uploads a new floor layout as a draft, but a contractor still references an old published drawing. The project must identify the discrepancy and the formal issue status before work changes.

**Practice:** Define folder/status transitions and a release checklist for a fictional design information package.

<!-- MAIC-PAGE -->

## 07 — Interoperability and the IFC Standard

Different BIM software tools may need to exchange building information. Industry Foundation Classes (IFC) is an open, vendor-neutral data schema associated with buildingSMART and ISO 16739. IFC can describe object identity, types, properties and relationships for building or infrastructure information. The exact data supported in an exchange depends on the selected IFC version, modeling tools and exchange purpose.

buildingSMART identifies IFC 4.3.2.0 (commonly IFC4.3 ADD2) as a current official release, corresponding to ISO 16739-1:2024. A later IFC development branch or draft should not be represented as an already finalized standard. Even when both programs say “supports IFC,” that does not guarantee every property, classification or geometry representation transfers intact.

Define an exchange test. Identify which element types and fields are required, export a sample, import it into the receiving application or viewer, and inspect identities, geometry, relations and property completeness. Document losses or mappings. Open formats promote interoperability but do not remove the need for quality checks.

**Fictional example:** An architectural export contains twenty room objects but a receiver recognizes only nineteen. The discrepancy must be investigated before using the imported file for an occupancy schedule.

**Practice:** Create an IFC exchange checklist with ten fields and a report template for missing or altered information.

<!-- MAIC-PAGE -->

## 08 — 4D, 5D and Information for Project Decisions

BIM information can support links to work sequence, cost estimates and operations when the data and processes are reliable. “4D” is commonly used for time or construction scheduling connections; “5D” for cost-related integration. These labels do not by themselves prove that dates or budgets are accurate. A visualization of planned work needs trustworthy quantities, resource assumptions and scheduling dependencies.

Quantity takeoffs can be derived from structured geometry, but model completeness and classification strongly affect results. An omitted wall or a duplicate floor object can distort cost calculations. Budget estimates also depend on market prices, labor, waste, logistics and contingencies not necessarily stored in the authoring model.

Project decisions should use model-derived figures as inputs, not unquestioned facts. Document calculation bases and reconcile them with independent checks. A change to a wall's material may affect weight, cost, thermal performance and procurement, requiring coordinated review.

**Worked arithmetic:** A fictional concrete element has a modeled volume of 4 m³ and a unit cost of $180/m³. The direct material subtotal is $720, excluding labor, reinforcement, waste, delivery and other costs. This is not a real construction quotation.

**Practice:** Build a six-line quantity/cost table and identify one data issue that would distort each estimate.

<!-- MAIC-PAGE -->

## 09 — Handover, Asset Information and Facility Operations

BIM does not end at construction handover. An owner may need accurate asset identifiers, location, manufacturer, model, service intervals, manuals and warranty data for equipment management. A visually detailed but poorly identified model can be less useful than a simpler model with dependable records.

Define handover requirements early. If the owner needs replacement filter specifications, that data must be collected and checked during procurement and commissioning. A generic object family does not automatically contain the actual installed manufacturer's information. Record the distinction between design intent, as-built data and verified installed assets.

Information privacy and security extend into operation. Some infrastructure details may be sensitive and should not be published in unrestricted online viewers. The facilities team needs clear access rights, updating procedures and responsibility for records that change over time.

**Fictional example:** A campus handover contains twenty air-handling unit objects, but three lack service manuals. The data set is incomplete even if all twenty objects appear on a 3D screen.

**Practice:** Create an asset handover template with ten fields, three required checks and an update owner.

<!-- MAIC-PAGE -->

## 10 — Model QA, Issue Management and Responsible Use

BIM quality assurance verifies that the data package is appropriate for its specific intended decision. Check geometry and model location, object IDs, classifications, required properties, units, revision status and exchange completeness. A check that passes one rule does not establish construction safety or legal compliance. Record the reviewer and exact file version when an approval is issued.

Issue management should identify the problem, affected elements, evidence, severity, responsible party, proposed action and closure proof. Test whether the fix solves the actual conflict without creating another. For a design change affecting several teams, update linked schedules and documents in a controlled way.

A project's information model may support simulations, but results depend on data quality and assumptions. Energy analysis, structural evaluation and evacuation assessments remain specialist disciplines; a modeling workflow cannot substitute for professional engineering judgment. Clear uncertainty notes are a strength, not a weakness.

**Fictional example:** A clash detector flags a beam and duct. After a design update, the models are re-exported with the correct coordinates and a reviewer checks that the new route does not create another conflict.

**Practice:** Write a ten-point model QA checklist and one complete issue record with evidence and resolution criteria.

<!-- MAIC-PAGE -->

## 11 — Applied Case: Coordinating a Small Campus Building

**Entirely fictional project.** A two-level training building contains classrooms, a corridor, service rooms and twenty modeled doors. Architectural, structural and mechanical contributors share their models for coordination. One duct appears to cross a beam, one room is missing a classification and two doors have duplicated IDs. None of these examples is a real verified project defect.

Define required information for the owner, designer, contractor and facilities team. Create an object schedule for the doors with unique IDs and room links. Map which model contains the duct and beam. Record the clash and verify that both models use the same unit convention and spatial reference before proposing a solution. Update the duplicate identifiers without changing the meaning of existing records.

**Illustrative quantity:** A proposed 4 m³ element at $180 per m³ has a nominal direct-material cost of $720, excluding the remainder of construction expenses. Use this figure only as a classroom arithmetic check. A duplicate model element could inflate a quantity total, so the schedule should be reconciled before discussing prices.

Create a common-data environment workflow showing Draft, Shared, Published and Archived information statuses. Prepare a small IFC export validation list that checks room, door and level properties. Conclude with an asset handover template for one fictional piece of equipment.

**Deliverables:** Information needs matrix, object list, model-coordination issue report, release workflow, exchange QA and a short owner handover summary.

<!-- MAIC-PAGE -->

## 12 — Review Questions, BIM Portfolio and Sources

**Self-test:** (1) Why is BIM more than a 3D picture? (2) What is the purpose of information requirements? (3) How do type and instance data differ? (4) What makes a clash candidate? (5) Why does a CDE need information status and revision control? (6) What is IFC? (7) Does IFC support guarantee perfect transfer? (8) What do 4D and 5D commonly refer to? (9) What asset information matters after handover? (10) Why does a visually correct model still need QA?

**Final practice assignment:** Create an information management proposal for the fictional campus project. Submit stakeholder data needs, ten sample object rows, two identified coordination risks, a draft release flow, an IFC exchange test, a quantity calculation, an asset handover list and a traceable issue resolution note. Clearly mark which aspects require actual engineering or regulatory verification.

**Practice rubric:** Information requirements 20%; object data quality 20%; coordination 20%; CDE and revisions 15%; interoperability 10%; handover and QA 15%. This learning rubric is not a buildingSMART certificate, formal ISO audit or official MAIC examination.

**Primary references:** buildingSMART International, Industry Foundation Classes (https://www.buildingsmart.org/standards/bsi-standards/industry-foundation-classes/); buildingSMART standards server (https://standards.buildingsmart.org/); ISO 16739-1:2024 (https://www.iso.org/standard/84123.html). References support factual terminology; the teaching prose and fictional practice case are original MAIC work.
