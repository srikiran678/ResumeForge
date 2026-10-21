# Spec Delta

## Purpose

Provides resume analysis, abstract syntax tree reading order inspection, keyword density evaluation, and recruiter simulation telemetry.

## ADDED Requirements

### Requirement: AST Linear Reading Order Overlay
The ATS Analyzer module SHALL compute the linear reading order of resume sections and render sequential badges numbered `#01` through `#0N` aligned with `meta.sectionOrder`.

#### Scenario: Visualizing reading order indices
- **WHEN** the user enables the ATS Reading Order Inspector overlay
- **THEN** each active resume section displays a numbered badge indicating its exact extraction rank from top to bottom

### Requirement: Comprehensive ATS Score Calculation
The ATS Analyzer module SHALL parse the resume model and calculate an ATS readiness score between 0 and 100 factoring formatting compliance, action verb density, and quantifiable metrics.

#### Scenario: Computing overall ATS score
- **WHEN** resume contents are analyzed
- **THEN** the analyzer generates a score breakdown highlighting strengths, warnings, and missing essential sections

### Requirement: Recruiter Scan Simulation
The ATS Analyzer module SHALL generate a visual simulation of initial recruiter glance patterns highlighting high-visibility anchor points.

#### Scenario: Launching recruiter simulation
- **WHEN** the user toggles the Recruiter Scan Simulator
- **THEN** the analyzer displays an overlay highlighting headline skills, recent job titles, and quantitative achievements

### Requirement: Raw Text Extraction Verification
The ATS Analyzer module SHALL extract plain text in natural parsing order to verify single-column continuity without two-column fragmentation.

#### Scenario: Inspecting extracted plain text
- **WHEN** the user opens the Text Extraction Viewer
- **THEN** the raw plain text representation is displayed in exact natural document order
