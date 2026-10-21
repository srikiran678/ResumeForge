# Spec Delta

## Purpose

Provides an isolated presentation and export engine supporting multi-template layouts, real-time scaling and zoom controls, and vector PDF compilation.

## ADDED Requirements

### Requirement: Multi-Template Visual Layouts
The Template Preview module SHALL render the resume data model across selectable templates including Classic, Modern, Compact, Academic, and Hackathon while strictly adhering to `meta.sectionOrder`.

#### Scenario: Switching active template
- **WHEN** the user selects the "Modern" template from the template selector
- **THEN** the preview engine renders the resume using the modern typography, layout rules, and single-column ATS structure

### Requirement: Interactive Preview Canvas Controls
The Template Preview module SHALL provide zoom level adjustments, fit-to-width scaling, and pagination controls for inspecting the rendered document.

#### Scenario: Zooming the canvas
- **WHEN** the user adjusts the zoom slider or clicks zoom-in
- **THEN** the document scale transforms proportionally without clipping content or distorting font rendering

### Requirement: Vector PDF Document Export
The Template Preview module SHALL compile resume data into a downloadable vector PDF with 100% natural reading order and selectable text.

#### Scenario: Downloading PDF
- **WHEN** the user initiates the PDF export action
- **THEN** the module compiles the vector PDF via the rendering engine and initiates a direct file download

### Requirement: Print Layout Preservation
The Template Preview module SHALL provide media print stylesheets ensuring print dialogs render clean margins with zero two-column fragmentation.

#### Scenario: Triggering system print
- **WHEN** the user triggers browser print from the preview toolbar
- **THEN** the print media styles isolate the resume document and hide outer workspace chrome
