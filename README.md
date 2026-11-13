# COS 106 Student Portfolio and Academic Management Website

Practical term project for **COS 106: Introduction to Web Technologies**, Miva Open University.

Built by **Oluwatobiloba Adeleke**, Computing Science student.

A responsive, five-page student portfolio built with plain **HTML5, CSS3 and vanilla JavaScript**: no frameworks, no build step. It runs directly in a browser and is hosted with GitHub Pages.

- **Live site:** https://hanszom.github.io/cos106-portfolio/
- **Repository:** https://github.com/Hanszom/cos106-portfolio

## Pages

| Page | File | Contents |
|---|---|---|
| Home | `index.html` | Name, photograph, welcome message, navigation, short biography, links to every section |
| About | `about.html` | Education timeline, career aspirations, transferable and technical skills, COS 106 project table, interests, PublishPilot demonstration video |
| Projects | `projects.html` | BookIntel (in development), PublishPilot (prototype) and this portfolio, each with an image, description, status and links where they exist |
| Planner | `planner.html` | Interactive task manager (add, complete, delete, filter, clear completed) with localStorage, plus a weekly study timetable |
| Contact | `contact.html` | Contact form (name, email, phone, message) with JavaScript validation |

## File structure

```
cos106-portfolio/
├── index.html
├── about.html
├── projects.html
├── planner.html
├── contact.html
├── css/
│   └── style.css          one external stylesheet for every page
├── js/
│   └── script.js          one script for every page (each feature checks its page)
├── images/
│   ├── profile.jpg               homepage photograph
│   ├── profile-placeholder.svg   fallback if the photograph fails to load
│   ├── project-*.svg             project illustrations
│   ├── appdemo-poster.jpg        preview frame shown before the video plays
│   └── favicon.svg
├── media/
│   └── appdemo.mp4        PublishPilot demonstration video (H.264, 444×960, about 12 MB)
└── README.md
```

## Personalising the site

The site is fully personalised: photograph (`images/profile.jpg`), education, long-term career goal and a demonstration video of PublishPilot.

**Replacing the video:** keep it in `media/appdemo.mp4` and use the H.264 (AVC) format with AAC audio, which plays in every modern browser. Phone screen recordings are usually HEVC and very large, so convert them first and keep the file well under GitHub's 50 MB warning size (this one is about 12 MB). Update the poster image `images/appdemo-poster.jpg` and the caption in `about.html` to match.

To check for any bracketed placeholders left in page text:

```bash
grep -no '>\[[^]<]*\]<' *.html
```

## Running locally

Option 1: double-click `index.html` to open it in your browser. Everything works this way.

Option 2: run a small local web server, which is closer to how GitHub Pages serves the site:

```bash
cd ~/Documents/cos106-portfolio
```

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser. Press `Ctrl + C` in the terminal to stop the server.

## Publishing with GitHub Pages

### 1. Commit and push the files (first time)

The GitHub repository already exists and is empty. From the project folder:

```bash
cd ~/Documents/cos106-portfolio
```

```bash
git add .
```

```bash
git commit -m "Add COS 106 student portfolio website"
```

```bash
git push -u origin main
```

If Git asks you to sign in, use your GitHub username and a **personal access token** as the password (GitHub → Settings → Developer settings → Personal access tokens). Or sign in with GitHub Desktop or the GitHub CLI.

### 2. Turn on GitHub Pages

1. Open https://github.com/Hanszom/cos106-portfolio
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Set **Branch** to `main` and the folder to `/ (root)`, then click **Save**.
5. Wait one to two minutes, then refresh the page. GitHub shows the address: **https://hanszom.github.io/cos106-portfolio/**

### 3. Updating the site later

After editing files:

```bash
git add .
```

```bash
git commit -m "Describe what you changed"
```

```bash
git push
```

GitHub Pages republishes automatically within a minute or two.

## Requirements checklist

### Functional requirements

| Requirement | Where it is implemented |
|---|---|
| Homepage: student name and photograph | `index.html` hero: `<h1>` with name, `<img src="images/profile.jpg">` with placeholder fallback |
| Homepage: welcome message | `index.html` hero lead paragraph |
| Homepage: navigation menu | Sticky header `<nav>` on every page, collapses to a hamburger menu on mobile |
| Homepage: brief biography | `index.html` "A little about me" section |
| Homepage: professional layout | Dark navy hero, two-column grid, cards, call-to-action band, footer |
| About: educational background | `about.html#education`, timeline built as an ordered list |
| About: career aspirations | `about.html#career`, short, medium and long-term goal cards |
| About: technical skills | `about.html#skills`, grouped skill tag lists |
| About: hobbies and interests | `about.html#interests` |
| Projects: at least three sample projects | `projects.html`: three `<article>` project cards (BookIntel, PublishPilot, this portfolio) |
| Projects: descriptions | A summary, a list of what is built and what is not, and technology tags on each card |
| Projects: images or screenshots | `images/project-*.svg` on each card |
| Projects: links (real or simulated) | Working internal links (planner, contact form) and the GitHub repository. BookIntel and PublishPilot are not public yet, so their cards say so instead of showing invented links |
| Planner: add tasks | `planner.html` form → `addTask()` in `js/script.js` |
| Planner: mark tasks completed | Checkbox on each task → `toggleTask()` |
| Planner: delete tasks | Bin button on each task → `deleteTask()`; also "Clear completed" → `clearCompleted()` |
| Planner uses JavaScript | All planner logic is in `initPlanner()` in `js/script.js`; tasks persist in `localStorage` |
| Contact form: name, email, phone, message | `contact.html` `#contact-form` |
| Validation: no field empty | `rules` object in `initContactForm()`: every rule checks for an empty value first |
| Validation: email format | `EMAIL_PATTERN` regular expression |
| Validation: phone digits only | `DIGITS_ONLY` regular expression `/^[0-9]+$/` (plus a 7 to 15 digit length check) |
| Hosted, with repository link | GitHub Pages URL and repository above |

### HTML requirements

| Requirement | Where |
|---|---|
| Semantic elements | `header`, `nav`, `main`, `section`, `article`, `aside`, `figure`, `figcaption`, `footer` on every page |
| Forms | Planner task form (`planner.html`), contact form (`contact.html`) with labels, `input`, `select`, `textarea`, `datalist` |
| Tables | COS 106 project table with `thead`, `tbody`, `tfoot` and `caption` (`about.html`); weekly study timetable (`planner.html`) |
| Images | Profile photo, project images, SVG icons; every image has `alt` text |
| Hyperlinks | Internal navigation, in-page anchors (`about.html` chips), external links, `mailto:` link |
| Lists | Navigation menus (`ul`), education timeline (`ol`), skills, interests, contact details, footer links |
| Multimedia | `<video controls>` in `about.html#demo`: no autoplay, poster image, `playsinline`, responsive sizing, caption, fallback text and a download link |

### CSS requirements

| Requirement | Where in `css/style.css` |
|---|---|
| External stylesheet | One file, linked from every page with `<link rel="stylesheet" href="css/style.css">` |
| Responsive design | Section 16: breakpoints at 1024px, 860px and 600px; fluid type with `clamp()` |
| Flexbox and CSS Grid | Flexbox: nav, buttons, tags, task rows. Grid: hero, cards, skills, projects, planner and contact layouts |
| Navigation styling | Section 5: sticky blurred header, active-page underline, animated hamburger menu |
| Animations and transitions | Hover transitions on buttons and cards, scroll-reveal fade-in, floating glow, pulsing status dot, task slide-in and slide-out, progress bar |
| Consistent colour scheme | Section 1: colour tokens (navy, blue, cyan) used everywhere |
| Mobile-friendly interface | Collapsible menu, single-column layouts, tables turn into stacked cards, 44px touch targets, no horizontal scrolling at 375px |

### JavaScript requirements

| Requirement | Where in `js/script.js` |
|---|---|
| Event handling | `click`, `submit`, `change`, `input`, `blur`, `keydown` and `scroll` listeners; event delegation on the task list |
| DOM manipulation | `createTaskElement()` builds tasks with `createElement`; stats, progress bar, error messages and success message are updated live |
| Form validation | `initContactForm()` and the planner's empty-task check |
| Dynamic content updates | `renderTasks()`, `updateStats()`, task filter, live validation messages, footer year |
| Arrays and functions | `tasks` array with `map`, `filter`, `forEach` and `unshift`; named functions for each operation |
| Interactive task management | Add, complete, delete, filter and clear completed, saved in `localStorage` |

## Testing performed

- All five pages link to each other through the header and footer navigation. Every local image, script, stylesheet and media path loads.
- Planner: an empty task is rejected with a message. Adding, completing, filtering (All, To do, Completed), deleting and clearing completed tasks all work. Tasks remain after a page reload. HTML typed into a task is shown as plain text.
- Contact form: an empty submit shows four messages. An invalid email, a phone number with letters, spaces or symbols, and a phone number that is too short are each rejected with a specific message. A valid submission shows a success message and clears the form.
- Responsive layout checked at 360px and 375px (mobile), 768px and 1024px (tablet) and 1280px (desktop) with no horizontal scrolling. The mobile menu opens and closes.
- Planner form: the Due date and Priority controls never overlap. They sit side by side when there is room and stack when the panel is narrow.
- The demonstration video loads, plays, pauses and seeks with its controls. It fits the screen at 360px, 375px and desktop widths without overflowing.

## Notes

- The contact form has **no backend**. It validates in the browser and shows a confirmation, but it does not send email.
- Planner tasks are stored in the visitor's own browser (`localStorage`). They are not shared between devices.
- AI assistance: I used Claude, an AI coding assistant, to help write, test and publish the code. I directed the project and supplied all personal and project details.
- The design takes inspiration from modern VPN and SaaS landing pages (deep navy, vivid blue, rounded cards). All graphics and text are original.
