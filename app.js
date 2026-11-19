(() => {
  'use strict';
  const lessons = window.RLearningSessions || [];
  const modules = ["Start here", "Explore data", "Understand patterns", "Build models", "Go further"];
  const progressKey = "sharmilaRProgress_v1";
  const notesKey = "sharmilaRNotes_v1";
  const $ = (selector, root = document) => root.querySelector(selector);
  const esc = (value) => String(value).replace(/[&<>"']/g, (ch) => ({"&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;"}[ch]));
  const readStore = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const readProgress = () => readStore(progressKey, []);
  const saveProgress = (items) => localStorage.setItem(progressKey, JSON.stringify(items));
  const readNotes = () => readStore(notesKey, {});
  const lessonUrl = (id) => `session.html?lesson=${encodeURIComponent(id)}`;
  const done = (id) => readProgress().includes(id);

  function setYear() { const year = $("#year"); if (year) year.textContent = new Date().getFullYear(); }
  function setupMenu() {
    const button = $("#menuToggle");
    if (!button) return;
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      document.body.classList.toggle("menu-open", !open);
      button.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
    });
  }

  function renderCourseProgress() {
    const completed = readProgress();
    const count = Math.min(lessons.length, completed.filter((id) => lessons.some((item) => item.id === id)).length);
    const countNode = $("#completedCount");
    if (countNode) countNode.textContent = count;
    const title = $("#progressTitle");
    if (title) title.textContent = count === 0 ? "A fresh start is a good start." : count === lessons.length ? "You made it through the full path!" : "Look at you, building momentum.";
    const message = $("#progressMessage");
    if (message) message.textContent = count === 0 ? "Complete a session to see your progress here." : `${lessons.length - count} session${lessons.length - count === 1 ? "" : "s"} left in your learning journey.`;
    const bar = $("#progressBar");
    if (bar) bar.style.width = `${lessons.length ? count / lessons.length * 100 : 0}%`;
    const progress = $("#courseProgress");
    if (progress) progress.setAttribute("aria-valuenow", String(count));
    const sideCount = $("#sideCompleted");
    if (sideCount) sideCount.textContent = count;
    const sideBar = $("#sideProgressBar");
    if (sideBar) sideBar.style.width = `${lessons.length ? count / lessons.length * 100 : 0}%`;
  }

  function renderPath() {
    const grid = $("#pathGrid");
    if (!grid) return;
    grid.innerHTML = modules.map((module, index) => {
      const group = lessons.filter((item) => item.module === module);
      const completed = group.filter((item) => done(item.id)).length;
      const firstTodo = group.find((item) => !done(item.id)) || group[0];
      return `<a class="path-step" href="${lessonUrl(firstTodo?.id || "01")}"><span class="path-number">0${index + 1}</span><span class="path-info"><b>${esc(module)}</b><small>${group.length} short sessions · ${group.length ? esc(group[0].level) : "Coming soon"}</small></span><span class="path-count">${completed}/${group.length}<i>→</i></span></a>`;
    }).join("");
  }

  let activeFilter = "all";
  function renderLessons() {
    const grid = $("#lessonGrid");
    if (!grid) return;
    const query = $("#lessonSearch")?.value.trim().toLowerCase() || "";
    const visible = lessons.filter((item) => {
      const matchesFilter = activeFilter === "all" || item.module === activeFilter;
      const haystack = `${item.title} ${item.summary} ${item.module} ${item.level}`.toLowerCase();
      return matchesFilter && haystack.includes(query);
    });
    grid.innerHTML = visible.map((item) => `<article class="lesson-card ${done(item.id) ? "is-done" : ""}">
      <div class="card-topline"><span class="card-number">${item.id}</span><span class="card-status">${done(item.id) ? "✓ COMPLETE" : esc(item.level.toUpperCase())}</span></div>
      <div class="card-module">${esc(item.module)}</div><h3><a href="${lessonUrl(item.id)}">${esc(item.title)}</a></h3><p>${esc(item.summary)}</p>
      <div class="card-bottom"><span>${item.minutes} MIN READ</span><a href="${lessonUrl(item.id)}" aria-label="Open session ${item.id}: ${esc(item.title)}">Open notes <b>↗</b></a></div>
    </article>`).join("");
    const empty = $("#emptySearch");
    if (empty) empty.hidden = visible.length !== 0;
    const filterButtons = $("#filters");
    if (filterButtons) filterButtons.querySelectorAll("[data-filter]").forEach((button) => button.classList.toggle("selected", button.dataset.filter === activeFilter));
  }

  function setupHome() {
    renderCourseProgress(); renderPath(); renderLessons();
    $("#lessonSearch")?.addEventListener("input", renderLessons);
    $("#filters")?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      activeFilter = button.dataset.filter;
      renderLessons();
    });
    $("#dailyQuiz")?.addEventListener("click", (event) => {
      const choice = event.target.closest("[data-quiz-answer]");
      if (!choice) return;
      const feedback = $("#dailyFeedback");
      const correct = choice.dataset.quizAnswer === "correct";
      $("#dailyQuiz").querySelectorAll(".quiz-option").forEach((button) => button.disabled = true);
      choice.classList.add(correct ? "answer-correct" : "answer-wrong");
      if (feedback) feedback.textContent = correct ? "Exactly. The mean is the sum of values divided by the number of values. The median is the middle after sorting." : "Not quite. The median is the middle after sorting; the mode is the most common. mean() gives the arithmetic average.";
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) { event.preventDefault(); $("#lessonSearch")?.focus(); }
    });
  }

  function renderCode(code) { return esc(code).replace(/\n/g, "<br>"); }

  function renderSessionMenu(activeId) {
    const menu = $("#sessionMenu");
    if (!menu) return;
    menu.innerHTML = modules.map((module) => {
      const group = lessons.filter((item) => item.module === module);
      return `<section class="menu-group"><div class="menu-group-title">${esc(module)}</div>${group.map((item) => `<a class="menu-session ${item.id === activeId ? "current" : ""} ${done(item.id) ? "completed" : ""}" href="${lessonUrl(item.id)}"><span class="menu-check">${done(item.id) ? "✓" : item.id}</span><span>${esc(item.title)}</span></a>`).join("")}</section>`;
    }).join("");
  }

  function renderLesson() {
    const content = $("#lessonContent");
    if (!content) return;
    const params = new URLSearchParams(window.location.search);
    const requestedId = params.get("lesson") || "01";
    const index = lessons.findIndex((item) => item.id === requestedId);
    const safeIndex = index < 0 ? 0 : index;
    const item = lessons[safeIndex];
    const previous = lessons[safeIndex - 1];
    const next = lessons[safeIndex + 1];
    const completed = done(item.id);
    document.title = `${item.id} · ${item.title} — Learning R With Ease`;
    const crumb = $("#breadcrumbTitle");
    if (crumb) crumb.textContent = `${item.id} · ${item.title}`;
    renderCourseProgress();
    renderSessionMenu(item.id);
    const notes = readNotes();
    const points = item.concepts.map((concept) => `<li><span class="point-mark">✳</span><span>${esc(concept)}</span></li>`).join("");
    const choices = item.quiz.options.map((option, i) => `<button class="quiz-answer" type="button" data-choice="${i}"><span class="choice-key">${String.fromCharCode(65 + i)}</span>${esc(option)}</button>`).join("");
    content.innerHTML = `<header class="lesson-hero"><div class="eyebrow">SESSION ${item.id} <span class="eyebrow-index">${esc(item.module.toUpperCase())}</span></div><div class="lesson-meta"><span>${item.minutes} MIN READ</span><i></i><span>${esc(item.level.toUpperCase())}</span><i></i><span>R NOTES</span></div><h1>${esc(item.title)}</h1><p class="lesson-summary">${esc(item.summary)}</p></header>
      <section class="lesson-block"><div class="block-heading"><span class="block-index">01</span><div><span class="block-kicker">THE IDEA</span><h2>Let's make sense of it.</h2></div></div><ul class="concept-list">${points}</ul></section>
      <section class="lesson-block code-lesson"><div class="block-heading"><span class="block-index">02</span><div><span class="block-kicker">IN R</span><h2>See it in a small example.</h2></div></div><div class="lesson-code-window"><div class="code-window-head"><span><i></i> SESSION-${item.id}.R</span><button type="button" data-copy-code>Copy code</button></div><pre><code id="lessonCode">${renderCode(item.code)}</code></pre></div><div class="code-explain"><span class="explain-mark">↳</span><p>Try each line in an R script. Change one value, run it again, and notice what changes.</p></div></section>
      <section class="lesson-block practice-block"><div class="block-heading"><span class="block-index">03</span><div><span class="block-kicker">YOUR TURN</span><h2>A small practice step.</h2></div></div><div class="practice-prompt"><div class="practice-label"><span>✎</span> TRY THIS</div><p>${esc(item.practice)}</p><a href="#your-notes" class="text-link">Jot down your result <span>↓</span></a></div></section>
      <section class="lesson-block quiz-block"><div class="block-heading"><span class="block-index">04</span><div><span class="block-kicker">QUICK CHECK</span><h2>Does it make sense?</h2></div></div><div class="lesson-quiz" data-correct="${item.quiz.answer}" data-explanation="${esc(item.quiz.why)}"><p class="quiz-question">${esc(item.quiz.question)}</p><div class="quiz-answers">${choices}</div><p class="lesson-quiz-feedback" role="status" aria-live="polite"></p></div></section>
      <section class="lesson-block notes-block" id="your-notes"><div class="block-heading"><span class="block-index">05</span><div><span class="block-kicker">YOUR PERSONAL NOTES</span><h2>Keep a thought for later.</h2></div></div><label class="notes-label" for="lessonNotes">Your note for this session</label><textarea id="lessonNotes" rows="4" placeholder="Write a question, example, or idea you want to remember…">${esc(notes[item.id] || "")}</textarea><div class="notes-status" id="notesStatus" aria-live="polite">Notes save in this browser.</div></section>
      <div class="lesson-complete-row"><button class="button ${completed ? "button-completed" : "button-primary"}" id="completeLesson" type="button" aria-pressed="${completed}">${completed ? "✓ Session complete" : "Mark session complete"}</button><span>Progress is saved on this device.</span></div>
      <nav class="lesson-pager" aria-label="Previous and next sessions">${previous ? `<a href="${lessonUrl(previous.id)}" class="pager-link previous"><small>← PREVIOUS</small><b>${esc(previous.title)}</b></a>` : `<a href="index.html#sessions" class="pager-link previous"><small>← COURSE</small><b>All sessions</b></a>`}${next ? `<a href="${lessonUrl(next.id)}" class="pager-link next"><small>NEXT SESSION →</small><b>${esc(next.title)}</b></a>` : `<a href="index.html#learning-path" class="pager-link next"><small>THE WHOLE PATH →</small><b>Review your journey</b></a>`}</nav>`;
    $("[data-copy-code]", content)?.addEventListener("click", async (event) => {
      const button = event.currentTarget;
      try { await navigator.clipboard.writeText(item.code); button.textContent = "Copied ✓"; }
      catch { button.textContent = "Select and copy"; }
      window.setTimeout(() => { button.textContent = "Copy code"; }, 1800);
    });
    $(".lesson-quiz", content)?.addEventListener("click", (event) => {
      const answer = event.target.closest("[data-choice]");
      if (!answer || answer.disabled) return;
      const quiz = answer.closest(".lesson-quiz");
      const chosen = Number(answer.dataset.choice);
      const correct = chosen === Number(quiz.dataset.correct);
      quiz.querySelectorAll(".quiz-answer").forEach((button) => { button.disabled = true; if (Number(button.dataset.choice) === Number(quiz.dataset.correct)) button.classList.add("correct"); });
      if (!correct) answer.classList.add("incorrect");
      quiz.querySelector(".lesson-quiz-feedback").textContent = `${correct ? "That's right. " : "Here's the key idea. "}${quiz.dataset.explanation}`;
    });
    $("#lessonNotes", content)?.addEventListener("input", (event) => {
      const nextNotes = readNotes(); nextNotes[item.id] = event.target.value; localStorage.setItem(notesKey, JSON.stringify(nextNotes));
      const status = $("#notesStatus", content); if (status) status.textContent = "Saved just now · in this browser";
    });
    $("#completeLesson", content)?.addEventListener("click", (event) => {
      const current = readProgress();
      const wasDone = current.includes(item.id);
      saveProgress(wasDone ? current.filter((id) => id !== item.id) : [...current, item.id]);
      renderCourseProgress(); renderSessionMenu(item.id);
      const button = event.currentTarget;
      const newDone = !wasDone;
      button.classList.toggle("button-completed", newDone); button.classList.toggle("button-primary", !newDone);
      button.setAttribute("aria-pressed", String(newDone)); button.textContent = newDone ? "✓ Session complete" : "Mark session complete";
    });
  }

  setYear(); setupMenu();
  if (document.body.dataset.page === "home") setupHome();
  if (document.body.dataset.page === "lesson") renderLesson();
})();
