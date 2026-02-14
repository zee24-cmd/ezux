# Design System: EzUX Precision UI
**Project ID:** ezux-workspace-v1

## 1. Visual Theme & Atmosphere
The **EzUX Atmosphere** is defined as "The Focused Workspace." It is a high-density, utilitarian aesthetic that balances enterprise-grade reliability with a premium, modern digital feel. 
*   **Mood:** Airy, precise, and responsive.
*   **Philosophy:** "Data as Interface." Visual noise is minimized to allow content to lead. Depth is used semantically to indicate focus, not just for decoration.
*   **Interaction Vibe:** "Breathing." Transitions are fluid, and the UI responds to user presence through subtle micro-animations and glow effects.

## 2. Color Palette & Roles
The system uses a vibrant yet professional palette designed for long-term focus and clarity.

*   **Vibrant Electric Blue (#3b82f6):** **Primary Action Color.** Used for main buttons, active states, and selection indicators. It represents digital precision and momentum.
*   **Mist-Glass White (#ffffff):** **Surface Primary.** Used for the main workspace background. In dark mode, this shifts to **Deep Obsidian (#030712)**.
*   **Soft Slate Gray (#64748b):** **Muted Sentiment.** Used for secondary text, metadata, and de-emphasized UI elements like inactive icons.
*   **Vivid Ruby Red (#ef4444):** **Destructive Action.** Used for errors, alerts, and critical deletions.
*   **Ambient Glow (#3b82f6 with 10% opacity):** **Contextual Focus.** Used as a subtle background tint to highlight current sections or active groupings.

## 3. Typography Rules
*   **Font Family:** Modern Sans-Serif (Inter/System Default).
*   **Headings:** Bold and tightened (tracking -0.025em). Headings use a high-contrast weight to establish clear hierarchical landmarks.
*   **Body:** Medium tracking, optimized for readability at 14px (text-sm). 
*   **Monospace:** Used exclusively for data IDs and technical values to provide a "tool-like" feel.

## 4. Component Stylings
*   **Buttons:** 
    *   **Shape:** Subtly rounded corners (8px / 0.5rem).
    *   **Behavior:** Scale slightly (98%) on click; primary buttons have a subtle glow on hover.
*   **Cards & Containers:** 
    *   **Concept:** "Floating Planes." Containers use a whisper-soft diffused shadow to appear lifted from the workspace.
    *   **Edges:** "Precise Curves" (8px radius).
    *   **Background:** 5% opacity primary tint when focused.
*   **Inputs & Forms:** 
    *   **Stroke:** Thin 1px border using Muted Slate (#e2e8f0).
    *   **Active State:** Border shifts to Electric Blue with a faint outer ring (ring-2).
    *   **The "Blade":** Small, glassmorphic popovers with background blur (backdrop-blur-md) for transient tasks.

## 5. Layout Principles
*   **Whitespace Strategy:** "Comfortable Density." We use a strict 4px grid (e.g., gap-2, p-4). Components are compact by default but use generous margins between logical groups.
*   **Alignment:** Strict grid alignment. The "Time-Range" in the Scheduler and "Cell-Borders" in the Table act as the skeleton of the UI.
*   **Depth Hierarchy:** 
    *   **Level 0 (Base):** Workspace background.
    *   **Level 1 (Surface):** Cards, Tables, Sidebar.
    *   **Level 2 (Transient):** Popovers, Tooltips, "Quick-Action Blades."
    *   **Level 3 (Interruption):** Centered Modals and Alerts.

## 6. UX Patterns (Efficiency First)
*   **Staged Disclosure:** Complex forms are never forced upfront. We use the **"Quick-Action Blade"** for initial data entry (Title), allowing the user to expand to a full editor only when metadata (Attendees, Attachments) is required.
*   **Direct Manipulation:** Users interact directly with data (dragging event ranges, grouping table columns) rather than navigating through hidden menus.
*   **Predictive Indicators:** Active filters or sorted columns use a "Vibrant Indicator" (soft blue glow) to ensure the user always knows *why* information is being displayed.
