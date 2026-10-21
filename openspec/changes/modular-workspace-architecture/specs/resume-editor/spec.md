# Spec Delta

## Purpose

Provides an interactive resume editing workspace that enables structured section management, rich form inputs, real-time drafting state, drag-and-drop ordering, and bullet point refinement.

## ADDED Requirements

### Requirement: Section Content Editing
The Resume Editor module SHALL provide dedicated form controllers for personal info, summary, work experience, education, skills, projects, and custom sections to update resume data models.

#### Scenario: Editing work experience item
- **WHEN** a user modifies a role title, company name, or bullet description in the experience section form
- **THEN** the editor module updates the in-memory resume data model and signals state change to parent observers

### Requirement: Dynamic Section Reordering
The Resume Editor module SHALL enable users to change the visual and logical order of resume sections and reflect this order in metadata.

#### Scenario: Reordering sections
- **WHEN** a user drags the "Skills" section above the "Work Experience" section
- **THEN** the module updates `meta.sectionOrder` to reflect the new sequence and updates the editor view layout

### Requirement: Bullet Point Optimization
The Resume Editor module SHALL provide contextual modals and actions to analyze bullet points for action verbs, metrics, and XYZ formula compliance.

#### Scenario: Requesting bullet improvement
- **WHEN** a user triggers the bullet improver on an experience description
- **THEN** the module displays the bullet improvement interface with suggested action verbs and metric placeholders

### Requirement: Debounced Autosave State Management
The Resume Editor module SHALL track dirty state changes and emit debounced persistence requests to prevent excessive write operations.

#### Scenario: Debounced save trigger
- **WHEN** a user continuously types into an editor input field
- **THEN** the editor buffers updates and invokes the save handler only after the debounce interval elapses without new keystrokes
