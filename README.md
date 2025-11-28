# Kanban Board

A fully functional Kanban Board application with drag-and-drop functionality, LocalStorage persistence, and keyboard accessibility.

## Features

- **Create Boards**: Create multiple boards to organize different projects
- **Drag & Drop Cards**: Move cards between columns using drag and drop
- **LocalStorage Persistence**: All data is saved locally and persists across browser sessions
- **Keyboard Accessibility**: Full keyboard navigation support for accessibility

## Key Features

### Board Management
- Create new boards with custom names
- Switch between multiple boards using the dropdown selector
- Delete boards when no longer needed

### Column Management
- Add columns to organize your workflow (e.g., To Do, In Progress, Done)
- Edit column names
- Delete columns along with all their cards

### Card Management
- Add cards with title and optional description
- Edit existing cards
- Delete cards
- Move cards between columns via drag and drop

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate between elements |
| `Enter` / `Space` | Select/activate element or edit focused card |
| `Arrow Keys` | Move selected card between columns or within a column |
| `Escape` | Close modals or cancel operation |
| `Delete` / `Backspace` | Delete focused card |

## Getting Started

1. Open `index.html` in a web browser
2. Click "+ New Board" to create your first board
3. Add columns to your board (e.g., "To Do", "In Progress", "Done")
4. Add cards to your columns
5. Drag cards between columns to update their status

## Technology Stack

- **HTML5**: Semantic markup with ARIA attributes for accessibility
- **CSS3**: Modern styling with CSS Grid, Flexbox, and CSS Custom Properties
- **Vanilla JavaScript**: No frameworks - pure JavaScript for DOM manipulation and LocalStorage API

## Browser Support

Works in all modern browsers that support:
- LocalStorage API
- Drag and Drop API
- CSS Grid and Flexbox
- ES6+ JavaScript

## Accessibility

This application is built with accessibility in mind:
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Screen reader announcements for actions
- Focus management in modals
- Visible focus indicators
- Reduced motion support

## Data Storage

All data is stored in the browser's LocalStorage under the key `kanban-boards`. Data persists across browser sessions but is specific to each browser/device.