# React Table Editor 

A fully-featured single-page React application for managing multiple editable tables with users, including avatar support, advanced filtering, sorting, and persistent localStorage storage.

---

## Features

- **Multiple Tables**  
  Add any number of tables dynamically with editable table names.

- **Uniform Table Columns**  
  Each table row contains:  
  - Creator's username (with avatar)  
  - Creation date  
  - Last modified date  
  - Modifier's username (with avatar)  
  - Text field (up to 100 characters)

- **User Management**  
  Add, edit, and delete users with unique username and email. Select an active user from a combo box, which will be assigned as the creator/modifier for rows.

- **Row Operations**  
  Add, edit (inline or modal), and delete rows in tables. Text input limited to 100 characters.

- **Table Operations**  
  Rename tables after creation. Delete tables individually.

- **Filtering & Sorting**  
  Filter rows by text content and creator username. Sort rows by any column (text, users, dates).

- **Avatars**  
  Display user avatars next to usernames for easy identification.

- **Persistence**  
  All data (tables, rows, users, active user) is saved in browser's `localStorage` for persistence across page reloads.

- **Responsive & Accessible UI**  
  Built with [Material-UI (MUI)](https://mui.com/) components and best practices for responsiveness and accessibility.

---

