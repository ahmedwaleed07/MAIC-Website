# AutoCAD 3D Design: Modeling and Visualization
**MICHIGAN ACADEMY OF INNOVATION AND CREATIVITY**

**Innovate. Create. Lead.**

COURSE STUDY MANUAL
Course language: English
Estimated guided study: 10 hours
Copyright 2026 MAIC. All rights reserved.

Original independent MAIC teaching text with fictional model dimensions. Autodesk and AutoCAD are trademarks of Autodesk, Inc. This is not an official Autodesk course or vendor certification. Menu locations and supported features can differ by product edition and release.

<!-- MAIC-PAGE -->

## 02 — The 3D Modeling Workflow

Three-dimensional CAD represents length, width, height and relationships between parts. AutoCAD supports 3D solids, surfaces, meshes and reference wireframes. These model types have distinct strengths. A solid represents an enclosed volume useful for mechanical or architectural forms; a surface can control complex boundaries without necessarily defining a closed volume; meshes often assist freeform modeling. Choosing the correct representation makes later modifications and verification easier.

Learners will plan units and coordinates, build clean 2D profiles, create basic 3D solids, apply extrusion and revolution methods, combine solids with Boolean operations, adjust a user coordinate system, inspect geometry in different views, assign visual styles and materials, make a simple presentation and prepare a responsible file handoff. This course does not replace engineering analysis, dimensional inspection or manufacturing approval.

**Ten-hour guided allocation:** Orientation 30 minutes; eight instructional sections on pages 3–10 at 55 minutes each (440 minutes); modeling case on page 11 for 90 minutes; final quality review on page 12 for 40 minutes. Total 600 minutes. Learners may use an AutoCAD edition with 3D modeling tools or study the workflow using diagrams if no compatible license is available.

**Starter:** Sketch a rectangular bracket using top, front and right-side views. Label what each view shows and how thickness will be established in the 3D model.

<!-- MAIC-PAGE -->

## 03 — Units, Cartesian Coordinates and Model Planning

Modeling begins with a consistent coordinate system. The X, Y and Z axes describe direction, but dimensions are meaningful only when the drawing uses clearly defined units and scale. A design for a 120 mm bracket must not accidentally be interpreted as 120 inches. Confirm the project's unit convention, physical references and tolerances before constructing many objects. Set layers and sensible names to separate source profiles, temporary construction geometry and final solids.

AutoCAD's World Coordinate System (WCS) provides a fixed reference; the User Coordinate System (UCS) can be oriented for drawing or modifying geometry on a selected plane. Confusing UCS orientation with the displayed camera view can produce objects on the wrong plane. Check both before extrusion or face modification. Orthographic views are useful for dimensions, while an isometric view helps inspect spatial form.

Plan the object as constructive steps. A bracket may begin with a flat base, add a raised support and then remove a cylindrical mounting hole. This sequence is easier to inspect than a complex form built without a plan. Record required dimensions and whether a feature is a solid, a visual detail or only a reference line.

**Fictional example:** A base is 120 × 60 mm and 10 mm thick. It is sketched in the XY plane and given a positive Z thickness. An offset mounting hole must be located using its center coordinates rather than estimated by eye.

**Practice:** Create a unit plan and a three-view annotated sketch for a bracket; identify the base plane and expected feature sequence.

<!-- MAIC-PAGE -->

## 04 — Creating Solids From Primitives and 2D Profiles

A quick 3D model may start with primitive solids such as BOX, CYLINDER or CONE, or from closed 2D geometry. Autodesk documents EXTRUDE, REVOLVE, SWEEP and LOFT as ways to form geometry from suitable profiles. The specific result depends on whether profiles are closed, planar and otherwise valid. A complex outline with small gaps may fail to produce the intended closed volume.

Start with a rectangle, check that it forms a valid closed boundary and create a 3D base by extrusion. A circle can become a cylinder or represent a subtractive hole. REVOLVE turns an appropriate profile around an axis; SWEEP carries a profile along a path; LOFT forms geometry between cross-sections. Select the operation based on the object's functional shape, not only an attractive preview.

The PRESSPULL command may extrude a closed bounded area or modify a solid face; an open object can produce a different result. Autodesk's documentation describes differences among selecting a closed planar boundary, an open object and an existing solid face. Recheck the selected objects and the active UCS when an extrusion behaves unexpectedly.

**Worked geometry:** A rectangular base 120 mm long, 60 mm wide and 10 mm thick has a nominal uncut volume of 120 × 60 × 10 = 72,000 mm³. This is a geometry exercise, not a measured part mass. Material density would be needed to estimate mass.

**Practice:** Create a BOX and an EXTRUDE version of the base; compare measured dimensions and orientation.

<!-- MAIC-PAGE -->

## 05 — Boolean Operations and Solid Editing

Boolean operations construct new geometry from existing objects. UNION combines selected overlapping or touching compatible solids, SUBTRACT removes one solid's overlapping volume from another, and INTERSECT retains their shared region. Autodesk documents these as core operations for composite 3D solids. Before performing them, verify that objects actually overlap as intended and that the correct subtract-from and subtracting selections are made.

Think through geometry and volume. To create a through-hole, construct a cylinder positioned through the base and subtract it. A cylinder that ends short of the bottom may create a blind recess instead. A model can look correct from one camera angle while the hole stops unexpectedly inside the material. Use multiple views or sectioning to verify the result.

Preserve a version before destructive edits and keep construction geometry organized. Boolean operations can change the object's edit history or complicate revisions depending on system settings. The safe approach is to document the feature sequence, use clear source names and validate the final solid's dimensions. Avoid claiming a design is manufacturable solely because a Boolean command succeeded.

**Worked example:** A bracket base is 72,000 mm³ before removing one centered through-hole of radius 5 mm through a 10 mm thickness. The ideal removed volume is π × 5² × 10 = 250π mm³, approximately 785.4 mm³. The ideal resulting volume is about 71,214.6 mm³, assuming the cylinder lies entirely inside the base.

**Practice:** Model a through-hole using SUBTRACT, then inspect it in a sectional or opposite-side view.

<!-- MAIC-PAGE -->

## 06 — UCS, 3D Navigation and Visual Styles

Three-dimensional navigation changes how the user sees the object but not necessarily its geometry. Autodesk documents 3DORBIT for dynamic viewing and common visual styles such as Conceptual, Realistic and X-Ray. A perspective view can communicate spatial depth; parallel projection can be more convenient for some dimensional comparisons. Use a combination of standard orthographic and isometric views to find hidden mistakes.

When a feature must be created on an inclined or vertical plane, orient the UCS appropriately. Do not infer that the working plane changed just because the camera rotated. Check the active UCS before drawing or using PRESSPULL. A mismatch may cause a profile to extrude along an unexpected axis. If an operation fails, inspect whether the profile is closed and planar before repeatedly issuing the same command.

Keep the camera and model coordinate decisions separate in documentation. A reviewer should be able to recover the intended design orientation and inspect all sides. Save named views where supported so recurring evaluation is consistent. Visual styles are presentation aids; they do not verify actual physical dimensions or correct manufacturing tolerances.

**Fictional example:** A mounting tab faces upward but a hole profile was drawn in the global XY plane. Reorienting the UCS to the tab face allows the intended geometry to be constructed on that plane.

**Practice:** Capture a top, front, isometric and sectional view. State which design problem each is best at revealing.

<!-- MAIC-PAGE -->

## 07 — Modifying Models and Maintaining Geometric Quality

A model will often change after the first sketch. Features may be moved, copied, rotated or adjusted by face editing. AutoCAD has 3D-specific controls such as 3DROTATE, while familiar 2D commands may behave with respect to the active UCS. Confirm selection sets carefully to avoid moving construction guides together with finished solids. Use exact numeric inputs for important dimensions rather than visual estimation.

Geometric quality affects downstream use. Small gaps, unintended intersections, nonmanifold surfaces and inconsistent units can cause trouble for section drawings, export or 3D printing. Some operations are sensitive to whether the object is a solid, a surface or a mesh. A conversion should be verified before assuming that a mesh behaves like a closed solid for Boolean editing.

Organize the model for repeatable revision. Keep a descriptive file name, layer scheme, model version and dimension notes. When a part changes, review dependent features such as hole positions and clearance. A dimensioned model is only as reliable as its constraints, inputs and inspection. Do not assume the display of a 3D object is proof that its fit or physical safety has been tested.

**Fictional example:** Moving the support tab 10 mm may cause a nearby mounting hole to be off-center. Recheck both geometries after each edit rather than judging the isometric view alone.

**Practice:** Create a controlled revision, log which dimensions changed and compare the updated model with the original version.

<!-- MAIC-PAGE -->

## 08 — Materials, Lighting and Visual Communication

Visualization helps reviewers understand form, color and material intent. A shaded model can show geometry more clearly than a wireframe; realistic material appearance and lighting can help communicate a product concept. Autodesk's visual style and rendering tools vary by platform and release. A reflective surface or dramatic shadow should not be mistaken for evidence that the specified material meets structural or safety requirements.

Assign materials to suitable objects with explicit notes. A metallic appearance does not establish actual alloy composition. A plastic-like texture does not establish temperature resistance. If a rendered image includes windows, people or an outdoor setting, ensure these remain clearly illustrative rather than claimed documentary evidence of a built project. Use consistent camera angles for before/after comparisons.

Review readability. A render should have enough contrast to distinguish edges and separate objects from the background. Excessive lighting effects can hide small assembly details. Provide a neutral engineering view alongside any stylized presentation. For an object with a critical hole or joint, at least one view should make the feature inspectable.

**Fictional example:** A product bracket is rendered in gray metal for a client presentation. The accompanying technical note says the actual selected material, finish and performance must be confirmed by engineering review.

**Practice:** Prepare one neutral shaded view and one presentation view. Explain what each can and cannot prove.

<!-- MAIC-PAGE -->

## 09 — Documentation, Dimensions and Export Formats

A 3D model may be needed for design review, manufacturing communication or presentation. Different purposes need different exports. Keep the original editable DWG and its project notes. Provide orthographic images, dimensions and section details where required. An exported raster rendering cannot substitute for a fully editable 3D model. A neutral interchange format may preserve geometry with different fidelity depending on the receiver; test compatibility before promising full feature-history transfer.

For 3D printing, Autodesk documents workflows that translate selected solid geometry into a faceted mesh representation such as STL. An STL can communicate approximate shape but is not the same as a dimensioned engineering drawing or the parametric source. Check physical units, model closure, wall thickness and manufacturing constraints with the intended process. Tool behavior and available export options vary by installed version.

Deliver documents with traceable identifiers. Use a version number, units, date, author or reviewer field and a simple change note. Avoid using a render with no scale reference as the only technical deliverable. A reviewer needs enough information to find incorrect thicknesses or missing details.

**Fictional example:** A bracket is handed off as DWG plus a dimensioned review PDF and a tested STL for prototyping. The recipient is told which file is authoritative for design revisions.

**Practice:** Write an export checklist comparing an editable DWG, a review PDF, a rendered image and an STL.

<!-- MAIC-PAGE -->

## 10 — Verification, Safety and Responsible Handoff

A completed AutoCAD model still requires checks. Confirm dimensions, units, hole alignment, solid completeness, intersections and any fabrication constraints. Compare the geometry with the original functional brief. If the design will be loaded or used in a safety-critical application, competent engineering analysis and applicable testing are required; this introductory CAD project alone does not establish load capacity or regulatory compliance.

Use inspection views and measurements. A hole that seems circular in a shaded view may be on the wrong plane or have an incorrect depth. Where supported, volume and mass-properties tools can support geometric checking, but results depend on a valid solid and appropriate units and material assumptions. Cross-check important quantities with straightforward arithmetic when feasible.

Before sharing, remove unrelated test objects, archive an editable original and record what has not been verified. A presentation render should not be labeled a manufactured part. A revision request should identify the authoritative model version and the change needed. Re-export deliverables after the final correction rather than leaving an outdated PDF alongside a newer DWG.

**Fictional example:** The bracket hole passes a simple geometric check but the load rating is unknown. The handoff states “geometry reviewed; mechanical performance not evaluated” rather than promising the bracket is safe for a heavy installation.

**Practice:** Create a ten-item verification checklist and document two failure scenarios that might not appear in a single isometric view.

<!-- MAIC-PAGE -->

## 11 — Worked Case: Model a Mounting Bracket

**Entirely fictional engineering exercise.** Design a simple solid base measuring 120 × 60 × 10 mm, with a centered circular through-hole of radius 5 mm. Add a vertical tab with a separate dimensioned sketch. The exercise assumes no actual engineering load requirement, manufacturing tolerance or safety classification. Use consistent millimeter units and clearly mark the WCS/UCS orientation.

First create a closed 120 × 60 profile and use EXTRUDE or BOX for a 10 mm base. Construct a cylinder of radius 5 mm aligned through the base, then use SUBTRACT. Verify the hole from above and below; ensure it is not a blind recess. Calculate the expected base volume as 72,000 mm³ and ideal through-hole volume as approximately 785.4 mm³. The base after removal is approximately 71,214.6 mm³ before adding the tab.

Sketch the tab, check its position and extrusion axis, and UNION it with the base only if that matches the intended solid assembly. Inspect a front view and an isometric view. Apply a neutral visual style for geometry verification and an optional visual material for a separate presentation image. Save the editable model, a dimensioned PDF and a simple revision log.

**Variation:** Move the hole 10 mm along X, while retaining a sufficient edge distance based on the fictional geometry. Verify that the cylindrical cut remains wholly within the base; this is not a structural calculation.

**Deliverables:** Unit and coordinate plan, construction sketches, 3D model, two orthographic checks, Boolean-operation explanation, expected-volume arithmetic and export checklist.

<!-- MAIC-PAGE -->

## 12 — Knowledge Check, Modeling Assignment and References

**Self-test:** (1) How do solids differ from surfaces? (2) Why set units and a UCS? (3) What can EXTRUDE do with a valid closed profile? (4) What does REVOLVE do? (5) How do UNION, SUBTRACT and INTERSECT differ? (6) Why inspect a hole from both sides? (7) Does 3DORBIT change geometry? (8) What does a Realistic visual style not prove? (9) Why is STL different from editable DWG? (10) Which engineering checks remain beyond the CAD exercise?

**Final practice:** Produce the fictional bracket design and a short technical package. Include a dimensioned source sketch, an editable model or detailed annotated modeling plan, a feature sequence, exact numeric inputs, a sectional view, volume calculations, neutral/presentation views, version log and checks of actual file outputs. State assumptions clearly and do not claim certified mechanical safety.

**Learning rubric:** Units and planning 15%; correct solid construction 25%; Boolean geometry and arithmetic 20%; model inspection and editing 15%; visualization and communication 10%; export, versioning and verification 15%. This practice rubric is not an Autodesk certification, manufacturing qualification or official MAIC assessment.

**Vendor references:** Autodesk AutoCAD 2026 documentation, About Modeling 3D Objects (https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Core/files/GUID-9DACE807-BC9D-4357-B47E-C6199F6AF1A2.htm), PRESSPULL command (https://help.autodesk.com/view/ACD/2026/ENU/?caas=caas%2Fdocumentation%2FCIV3D%2F2014%2FENU%2FfilesACD%2FGUID-9D072BB2-D97F-41DB-8414-41BC83A16EFA-htm.html), and About Printing 3D Models (https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Core/files/GUID-16D8B210-E4FC-4E89-9905-B5F9C9569E39.htm). Confirm commands in the installed AutoCAD edition. All MAIC examples are original.
