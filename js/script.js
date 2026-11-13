/* =========================================================
   COS 106 Student Portfolio — main script
   One file is shared by every page. Each feature first checks
   that its elements exist, so it only runs on the right page.

   1. Site-wide: mobile navigation, header shadow, footer year,
      scroll-reveal animations
   2. Projects page: filter buttons and simulated links
   3. Planner page: add / complete / delete tasks (localStorage)
   4. Contact page: form validation
   ========================================================= */

(function () {
  "use strict";

  // Lets the CSS know JavaScript is running (used by the reveal animation).
  document.documentElement.classList.add("js");

  /* -------------------------------------------------------
     1. Site-wide behaviour
     ------------------------------------------------------- */

  function initNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.getElementById("nav-menu");
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("is-open", open);
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close the menu after choosing a link, pressing Escape or clicking elsewhere.
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".nav")) setOpen(false);
    });
  }

  function initHeaderShadow() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function initFooterYear() {
    var year = String(new Date().getFullYear());
    document.querySelectorAll(".js-year").forEach(function (el) {
      el.textContent = year;
    });
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* -------------------------------------------------------
     2. Projects page
     ------------------------------------------------------- */

  function initProjectFilter() {
    var buttons = document.querySelectorAll("[data-filter]");
    var cards = document.querySelectorAll(".project-card");
    var status = document.querySelector(".filter-status");
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.dataset.filter;
        var shown = 0;

        buttons.forEach(function (b) {
          var active = b === button;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-pressed", String(active));
        });

        cards.forEach(function (card) {
          var tags = card.dataset.tags.split(" ");
          var match = filter === "all" || tags.indexOf(filter) !== -1;
          card.hidden = !match;
          if (match) {
            shown++;
            card.classList.add("is-visible");
          }
        });

        if (status) {
          status.textContent = filter === "all" ? "" :
            "Showing " + shown + " of " + cards.length + " projects.";
        }
      });
    });
  }

  function initSimulatedLinks() {
    document.querySelectorAll(".js-simulated").forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        var note = document.getElementById(link.getAttribute("aria-describedby"));
        if (note) note.hidden = false;
      });
    });
  }

  /* -------------------------------------------------------
     3. Academic planner
     ------------------------------------------------------- */

  var STORAGE_KEY = "cos106-planner-tasks";

  function initPlanner() {
    var form = document.getElementById("task-form");
    var list = document.getElementById("task-list");
    if (!form || !list) return;

    var titleInput = document.getElementById("task-title");
    var courseInput = document.getElementById("task-course");
    var dueInput = document.getElementById("task-due");
    var priorityInput = document.getElementById("task-priority");
    var titleError = document.getElementById("task-title-error");
    var emptyState = document.getElementById("empty-state");
    var emptyMessage = document.getElementById("empty-message");
    var filterButtons = document.querySelectorAll("[data-task-filter]");
    var clearButton = document.getElementById("clear-completed");

    // The array that holds every task object.
    var tasks = loadTasks();
    var currentFilter = "all";
    var newTaskId = null; // only the newest task gets the slide-in animation

    /* ----- Storage ----- */
    function loadTasks() {
      try {
        var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(saved) ? saved : [];
      } catch (e) {
        return [];
      }
    }

    function saveTasks() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (e) {
        // Storage can be unavailable (e.g. private browsing). The planner still works for this visit.
      }
    }

    /* ----- Task operations ----- */
    function addTask(title, course, due, priority) {
      newTaskId = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      tasks.unshift({
        id: newTaskId,
        title: title,
        course: course,
        due: due,
        priority: priority,
        done: false,
        createdAt: new Date().toISOString()
      });
      saveTasks();
      renderTasks();
    }

    function toggleTask(id) {
      tasks = tasks.map(function (task) {
        if (task.id === id) task.done = !task.done;
        return task;
      });
      saveTasks();
      renderTasks();
    }

    function deleteTask(id) {
      tasks = tasks.filter(function (task) { return task.id !== id; });
      saveTasks();
      renderTasks();
    }

    function clearCompleted() {
      tasks = tasks.filter(function (task) { return !task.done; });
      saveTasks();
      renderTasks();
    }

    /* ----- Helpers ----- */
    function getVisibleTasks() {
      return tasks.filter(function (task) {
        if (currentFilter === "active") return !task.done;
        if (currentFilter === "completed") return task.done;
        return true;
      });
    }

    function todayString() {
      var d = new Date();
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    }

    function formatDate(isoDate) {
      // Parse "YYYY-MM-DD" as a local date (avoids time zone shifts).
      var parts = isoDate.split("-");
      var date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
    }

    function capitalise(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }

    /* ----- Rendering (DOM manipulation) ----- */
    function createTaskElement(task) {
      var item = document.createElement("li");
      item.className = "task priority-" + task.priority + (task.done ? " is-done" : "") + (task.id === newTaskId ? " is-new" : "");
      item.dataset.id = task.id;

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "task-check";
      checkbox.checked = task.done;
      checkbox.setAttribute("aria-label", (task.done ? "Mark as not completed: " : "Mark as completed: ") + task.title);

      var content = document.createElement("div");
      content.className = "task-content";

      var title = document.createElement("p");
      title.className = "task-title";
      title.textContent = task.title; // textContent keeps user input safe from HTML injection

      var meta = document.createElement("div");
      meta.className = "task-meta";

      if (task.course) {
        var course = document.createElement("span");
        course.textContent = task.course;
        meta.appendChild(course);
      }
      if (task.due) {
        var due = document.createElement("span");
        var overdue = !task.done && task.due < todayString();
        due.textContent = (overdue ? "Overdue: " : "Due ") + formatDate(task.due);
        if (overdue) due.className = "overdue";
        meta.appendChild(due);
      }
      var priority = document.createElement("span");
      priority.textContent = capitalise(task.priority) + " priority";
      meta.appendChild(priority);

      content.appendChild(title);
      content.appendChild(meta);

      var del = document.createElement("button");
      del.type = "button";
      del.className = "task-delete";
      del.setAttribute("aria-label", "Delete task: " + task.title);
      del.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-3 6h12l-1 12H7L6 9Zm4 2v8h2v-8h-2Zm4 0v8h2v-8h-2Z"/></svg>';

      item.appendChild(checkbox);
      item.appendChild(content);
      item.appendChild(del);
      return item;
    }

    function updateStats() {
      var total = tasks.length;
      var done = tasks.filter(function (t) { return t.done; }).length;
      var percent = total ? Math.round((done / total) * 100) : 0;

      document.getElementById("stat-total").textContent = total;
      document.getElementById("stat-active").textContent = total - done;
      document.getElementById("stat-done").textContent = done;
      document.getElementById("progress-bar").style.width = percent + "%";
      document.getElementById("progress-text").textContent = total
        ? percent + "% complete (" + done + " of " + total + " tasks)"
        : "No tasks yet.";
      clearButton.disabled = done === 0;
    }

    function renderTasks() {
      var visible = getVisibleTasks();
      list.innerHTML = "";
      visible.forEach(function (task) {
        list.appendChild(createTaskElement(task));
      });
      newTaskId = null;

      emptyState.hidden = visible.length > 0;
      if (!tasks.length) {
        emptyMessage.textContent = "No tasks yet. Add your first task using the form.";
      } else if (currentFilter === "active") {
        emptyMessage.textContent = "Nothing left to do. Well done!";
      } else {
        emptyMessage.textContent = "No completed tasks yet.";
      }
      updateStats();
    }

    /* ----- Event handling ----- */
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var title = titleInput.value.trim();
      if (!title) {
        titleError.textContent = "Please enter a task before adding it.";
        titleInput.classList.add("is-invalid");
        titleInput.setAttribute("aria-invalid", "true");
        titleInput.focus();
        return;
      }
      addTask(title, courseInput.value.trim(), dueInput.value, priorityInput.value);
      form.reset();
      titleInput.focus();
    });

    titleInput.addEventListener("input", function () {
      if (titleInput.value.trim()) {
        titleError.textContent = "";
        titleInput.classList.remove("is-invalid");
        titleInput.removeAttribute("aria-invalid");
      }
    });

    // One listener on the list handles every task (event delegation).
    list.addEventListener("change", function (event) {
      if (event.target.classList.contains("task-check")) {
        toggleTask(event.target.closest(".task").dataset.id);
      }
    });

    list.addEventListener("click", function (event) {
      var button = event.target.closest(".task-delete");
      if (!button) return;
      var item = button.closest(".task");
      item.classList.add("is-removing");
      // Wait for the slide-out transition before removing the task.
      setTimeout(function () { deleteTask(item.dataset.id); }, 220);
    });

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        currentFilter = button.dataset.taskFilter;
        filterButtons.forEach(function (b) {
          var active = b === button;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-pressed", String(active));
        });
        renderTasks();
      });
    });

    clearButton.addEventListener("click", clearCompleted);

    renderTasks();
  }

  /* -------------------------------------------------------
     4. Contact form validation
     ------------------------------------------------------- */

  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var success = document.getElementById("form-success");
    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var DIGITS_ONLY = /^[0-9]+$/;
    var submitted = false;

    // Each rule returns an error message, or an empty string if the value is valid.
    var rules = {
      name: function (value) {
        if (!value) return "Please enter your name.";
        if (value.length < 2) return "Your name should be at least 2 characters.";
        return "";
      },
      email: function (value) {
        if (!value) return "Please enter your email address.";
        if (!EMAIL_PATTERN.test(value)) return "Please enter a valid email address, for example name@example.com.";
        return "";
      },
      phone: function (value) {
        if (!value) return "Please enter your phone number.";
        if (!DIGITS_ONLY.test(value)) return "Your phone number must contain digits only (0–9), with no spaces, dashes or + sign.";
        if (value.length < 7 || value.length > 15) return "Your phone number should be between 7 and 15 digits long.";
        return "";
      },
      message: function (value) {
        if (!value) return "Please enter a message.";
        if (value.length < 10) return "Your message should be at least 10 characters.";
        return "";
      }
    };

    function validateField(name) {
      var input = form.elements[name];
      var error = document.getElementById(name + "-error");
      var message = rules[name](input.value.trim());

      error.textContent = message;
      input.classList.toggle("is-invalid", !!message);
      input.classList.toggle("is-valid", !message);
      if (message) {
        input.setAttribute("aria-invalid", "true");
      } else {
        input.removeAttribute("aria-invalid");
      }
      return !message;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submitted = true;
      success.hidden = true;

      var fieldNames = Object.keys(rules);
      var results = fieldNames.map(validateField);
      var firstInvalid = fieldNames[results.indexOf(false)];

      if (firstInvalid) {
        form.elements[firstInvalid].focus();
        return;
      }

      // Valid: there is no server, so show an honest confirmation instead of pretending to send.
      var name = form.elements.name.value.trim();
      success.innerHTML = "";
      var heading = document.createElement("strong");
      heading.textContent = "Thank you, " + name + ". Your message passed all checks.";
      var note = document.createElement("p");
      note.textContent = "This website has no server, so the message was not sent. Please email me directly using the address on this page.";
      success.appendChild(heading);
      success.appendChild(note);
      success.hidden = false;
      success.focus();

      form.reset();
      submitted = false;
      fieldNames.forEach(function (n) {
        form.elements[n].classList.remove("is-valid", "is-invalid");
      });
    });

    // After the first submit attempt, re-check fields live as the user corrects them.
    Object.keys(rules).forEach(function (name) {
      var input = form.elements[name];
      input.addEventListener("input", function () {
        if (submitted) validateField(name);
      });
      input.addEventListener("blur", function () {
        if (submitted || input.value.trim()) validateField(name);
      });
    });
  }

  /* -------------------------------------------------------
     Start everything
     ------------------------------------------------------- */
  initNavigation();
  initHeaderShadow();
  initFooterYear();
  initReveal();
  initProjectFilter();
  initSimulatedLinks();
  initPlanner();
  initContactForm();
})();
