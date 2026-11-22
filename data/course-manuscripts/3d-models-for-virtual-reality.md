# 3D Models for Virtual Reality
**MICHIGAN ACADEMY OF INNOVATION AND CREATIVITY**

**Innovate. Create. Lead.**

COURSE STUDY MANUAL
Course language: English
Estimated guided study: 8 hours
Copyright 2026 MAIC. All rights reserved.

Original independent MAIC educational material. Virtual-reality platform capabilities and performance targets depend on actual hardware. The course is not a vendor certification or guarantee of comfort, medical safety or interoperability.

<!-- MAIC-PAGE -->

## 02 — Building Assets for Immersive Interaction

Virtual reality (VR) presents a spatial experience in which viewers may look around and interact with nearby objects. A 3D model used in VR must support realistic scale, clear geometry, usable materials and efficient rendering. A model that looks excellent in a still render can cause slow frames or awkward interactions on a headset. Asset design must consider both visual intent and device limits.

Learners should create a VR asset brief, use consistent units and pivot points, distinguish solid geometry from visual meshes, develop suitable topology, prepare UVs and materials, manage texture size, apply optimization methods, export through an appropriate interchange format, test model orientation and interaction, and document quality assurance. The project uses an original low-complexity museum exhibit object.

**Eight-hour guided study:** Orientation 20 minutes; eight core sections on pages 3–10 at 45 minutes each (360 minutes); practical model case on page 11 for 60 minutes; final review on page 12 for 40 minutes. Total 480 minutes. A 3D editor is helpful, but documented modeling plans and simplified meshes can support parts of the exercise without a VR headset.

**Starter:** Sketch a small museum pedestal and exhibit. Identify its approximate real dimensions, where a visitor stands and what the visitor should be able to inspect or select.

<!-- MAIC-PAGE -->

## 03 — Scale, Orientation and Asset Requirements

A VR scene depends on consistent spatial scale. If a table is modeled at one hundred times its intended size, the viewer may perceive it as an enormous structure. Record the project's length units, axis convention and import conversion. Most game engines use a defined world scale; confirm the target engine's actual rules rather than making assumptions from model appearance.

Define the asset's role: background environment, interactive object, wearable equipment or moving character. Interactive objects need appropriate pivot placement and clear affordances. A rotating exhibit may require a pivot at its center; a hinged cabinet requires a pivot near its hinge. Document collision needs separately from the visible mesh, since detailed display geometry can be unnecessarily expensive for collision.

Prepare a brief with dimensions, target device, viewing distance, maximum expected instances, animation needs, materials and rights. A stylized object may be completely appropriate when its function is clear. Avoid copying protected museum artifacts or copyrighted character models without permission.

**Fictional example:** The class exhibit is a 0.6-meter-tall invented geometric sculpture on a 0.9-meter pedestal. All dimensions are conceptual until tested at intended human scale.

**Practice:** Make a dimensioned sketch with object origin, rotation axis and three intended player interactions.

<!-- MAIC-PAGE -->

## 04 — Mesh Geometry, Topology and Modeling Discipline

Many real-time 3D assets use triangle meshes composed of vertices and faces. The visible surface is shaped by geometry, normals and materials. Dense polygons can increase GPU work and memory requirements without adding visible detail at the intended viewing distance. Use sufficient topology to preserve shape and deformation; avoid unnecessary tiny polygons in hidden surfaces.

Topology matters around moving joints, holes and sharp edges. A static sculpture may need simpler topology than an animated hand. Normals affect apparent lighting and may reveal flipped faces or shading seams. Keep object naming and transformations organized before export. Check for duplicate faces, holes and inconsistent surface orientation where the engine requires a closed or clean mesh.

Use modifiers or modeling tools where useful, but test their final evaluated output. A subdivision preview may look smooth while exporting an unexpectedly huge mesh. Decimate carefully: aggressive simplification can damage silhouette or UVs. Keep a higher-detail source mesh for revision and a lower-detail delivery asset suited to the target.

**Fictional example:** A 100,000-triangle decorative detail is rarely justified when the headset displays the sculpture small and the detail can be conveyed by a normal map.

**Practice:** Create a basic mesh and compare a detailed versus simplified version from the intended camera distance.

<!-- MAIC-PAGE -->

## 05 — UV Coordinates, Textures and Materials

UV coordinates map two-dimensional textures onto three-dimensional surfaces. Poor UV layout can cause stretching, seams and wasted texture space. Unwrap a model with attention to visible areas, orientation and texel consistency. A texture atlas can combine several related surfaces and may reduce certain rendering overhead, depending on the engine and materials.

Physically based rendering (PBR) materials use parameters such as base color and metallic/roughness properties to create predictable appearance under different lights. A material labeled “metal” does not prove the object is physically made of a particular alloy. Use appropriately licensed textures and record whether maps include color information, surface normals or masks. Do not store a huge texture simply because high resolution looks attractive in the asset editor.

Test imported material appearance in the actual target runtime. Color space, compression, lighting and shader differences can alter the result. Transparent materials and excessive overlapping layers may be expensive. Reduce material variety where it does not improve the interaction.

**Fictional example:** A sculpture uses one material set with a 1024-pixel base-color texture. The exact texture budget should still be profiled on intended hardware; a number alone is not universal optimization proof.

**Practice:** Create a UV plan, a material list and two tests for visible stretching and shader compatibility.

<!-- MAIC-PAGE -->

## 06 — Performance: Draw Calls, LOD and Culling

A VR application typically renders views for immersive display and must maintain dependable frame timing on its target hardware. Poor or inconsistent performance may reduce comfort. Rendering budgets depend on headset, engine, scene and interaction, so do not invent one universally safe triangle count or frame rate for every device.

Optimization tools can include reducing unseen geometry, consolidating materials, controlling texture memory, using level-of-detail (LOD) meshes and culling objects that are outside relevant view. These strategies have tradeoffs. Splitting an asset can improve culling but sometimes increase draw calls. Baking suitable lighting can reduce expensive real-time computation, but it may be unsuitable for objects with important dynamic lighting behavior.

Measure before and after. A low-polygon model is not automatically faster if shader complexity or transparent overdraw dominates. Profile frame timing, memory use, materials and rendering on the actual headset, not only a desktop preview. Preserve the visual function and accurate collisions while optimizing.

**Fictional example:** An exhibit consists of ten separate material objects. Combining appropriate materials may reduce draw overhead, but the real benefit requires profiling in the intended application.

**Practice:** Write a five-step performance audit including an asset before/after comparison and a quality check.

<!-- MAIC-PAGE -->

## 07 — Coordinate Systems, Export and glTF

Content-creation tools and real-time engines can use different axis conventions, scales and material implementations. Establish an export checklist for units, origin, transforms, normals, UVs, materials, animation and object hierarchy. An object that imports rotated or at the wrong height may have an axis or transform mismatch rather than an artistic error.

glTF is a runtime 3D asset delivery format standardized by the Khronos Group. The registry identifies glTF 2.0 as the current major specification, with the 2.0.1 text available in the official registry. glTF can represent scenes, nodes, meshes, materials and other supported information, but any particular import pipeline must be tested for extension and feature support. A supported extension in one tool does not guarantee the receiver understands it.

The source project and runtime export serve different purposes. The original editable model may preserve modifiers, editable sculpting details and a richer history; a runtime asset usually contains processed data intended for display. Keep both and document where transformations were baked or geometry simplified.

**Fictional example:** The sculpture exports correctly in one viewer but appears sideways in the game engine. The team checks rotation conventions and re-exports rather than manually disguising the problem.

**Practice:** Prepare a format/compatibility checklist and a report for a failed axis or material import.

<!-- MAIC-PAGE -->

## 08 — Interactions, Collision and Player Comfort

Immersive assets may respond to gaze, hands, controllers or other interaction methods. A selectable object needs a visible state and a reliable collision or interaction region. The visible mesh and physics collider should be related but need not be identical; simplified colliders can improve performance when they preserve intended behavior.

Design interactions to avoid surprise and unnecessary discomfort. Unexpected object movement, jerky motion or poorly placed UI can interfere with use. A rotation or scaling feature should have limits that keep the item visible and prevent accidental extreme changes. Important actions require feedback beyond color alone. Do not assume every device supports hand tracking or the same controller layout.

Physical safety also matters. A virtual experience should not invite users to walk into real obstacles; the platform's boundary and comfort guidelines must be followed. Accessibility may require alternative selection methods, subtitles or seated use where appropriate. A classroom asset demo does not establish medical suitability.

**Fictional example:** A museum visitor selects a sculpture to hear a short description. The object highlights visibly and the text remains accessible; the model does not unexpectedly fly toward the viewer.

**Practice:** Write a three-state interaction specification for idle, selected and unavailable, including collision and feedback rules.

<!-- MAIC-PAGE -->

## 09 — OpenXR, Runtime Integration and Testing

OpenXR is a Khronos standard for cross-platform XR application interfaces. The official registry publishes OpenXR 1.1 and related extensions. It addresses how applications interact with XR runtimes, rather than serving as a 3D mesh file format. A model may be delivered using glTF while the application uses an OpenXR-compatible runtime; these solve different technical problems.

Import the asset into a controlled test scene. Verify scale using a recognizable human reference, check orientations, inspect material and normal behavior, and test relevant controller or interaction pathways. Review performance while the asset is visible with other scene content. A clean asset in an empty scene may perform differently once multiple exhibits and lighting systems are active.

Test reliability and comfort through actual device sessions where available. Record device, software, asset version, selected feature and observed problems. A simulator or desktop test is useful but cannot fully replace headset inspection of depth, readability and motion.

**Fictional example:** The object passes an import preview but becomes impossible to select because its collider is offset. A targeted interaction test identifies the mismatch.

**Practice:** Create a VR asset acceptance checklist distinguishing file validation, runtime behavior and user observation.

<!-- MAIC-PAGE -->

## 10 — Asset QA, Rights and Technical Handoff

A 3D asset handoff should include the source project, versioned runtime export, material and texture references, dimensions, pivot notes, collision expectations and known limitations. Check geometry, UVs, normals, texture size, material slots, LOD relationships, scale and rendering performance. An original file name should not conceal a third-party model used without appropriate permission.

For collaborative projects, define who reviews artistic quality, runtime performance, interaction and accessibility. A visual artist may approve appearance without verifying frame timing or collider behavior. Track defects by asset and test condition so fixes can be reproduced. Preserve an editable baseline in case aggressive optimization damages the silhouette.

Avoid unsupported performance claims. “Optimized for all headsets” is not credible without broad tests and a defined device set. Provide the exact tested hardware, application and performance criteria instead.

**Fictional example:** The final model is tested on one headset at a defined scene complexity. The report states its limited scope rather than declaring universal VR compatibility.

**Practice:** Create a ten-point delivery QA sheet and log two issues with corrected asset versions.

<!-- MAIC-PAGE -->

## 11 — Worked Case: A Virtual Museum Exhibit

**Entirely fictional original environment.** A virtual exhibit hall contains one 0.6-meter sculpture placed on a 0.9-meter pedestal. The player can approach, select and rotate the artwork, then read a short descriptive card. The project uses an invented sculpture rather than copying a protected artwork. The headset, engine and runtime are left as explicit testing choices.

Create a dimensioned source plan, model the sculpture and pedestal, and organize meshes separately. Define pivots for rotating the art without moving the pedestal. Use a simple PBR material and a readable contrasting display card. Create one high-detail source and one simplified runtime version, with a reason for the changes. Export through a format supported by the chosen application and validate units and axis conventions.

**Illustrative arithmetic:** The nominal total height of sculpture and pedestal is 0.6 + 0.9 = 1.5 meters if the sculpture sits directly above the pedestal without overlap. That does not establish the optimal reading height for every visitor; interaction and accessibility tests remain necessary.

Test selection feedback, readable text, stable frame performance and a reset action. Record headset and software versions if physical testing is performed. Provide a no-headset review package when necessary, marking depth and comfort as unverified.

**Deliverables:** Source model or annotated plan, asset specification, materials, runtime export checklist, interaction flow, test log and accessibility review.

<!-- MAIC-PAGE -->

## 12 — VR Asset Portfolio and Source References

**Self-test:** (1) Why must VR assets use coherent scale? (2) What is topology? (3) Why do UV maps matter? (4) What is a PBR material? (5) Why is triangle count not the only performance factor? (6) What is an LOD mesh? (7) How does glTF differ from the source project? (8) Why does a visual mesh differ from its collider? (9) What does OpenXR standardize? (10) Why do asset QA reports need actual target hardware?

**Final project:** Develop an original virtual exhibit object for a specified target platform. Submit dimensional sketches, editable geometry, UV/material descriptions, optimized variant, export test, selection behavior, user-facing information, performance assumptions and a versioned QA report. Explicitly identify all untested interaction and comfort requirements.

**Practice rubric:** Brief and scale 20%; clean geometry 20%; materials and UV 15%; runtime performance 15%; interaction and inclusion 15%; export validation and documentation 15%. Self-study work is not vendor certification or an officially activated MAIC examination.

**Authoritative references:** Khronos glTF Registry, https://registry.khronos.org/glTF/ ; Khronos OpenXR Registry, https://registry.khronos.org/OpenXR/ ; Unity guidance on asset performance, https://unity.com/how-to/project-configuration-and-assets . All instructional language and case materials are independently authored.
