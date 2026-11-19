# Add a learning session

All lesson content is in `sessions.js`. The home page, filters, module counts, lesson sidebar, and session-to-session navigation read from this list.

Add a new object to `window.RLearningSessions`:

```js
{
  id: "19",                         // unique, two-digit ID
  title: "A clear topic title",
  module: "Go further",              // Start here | Explore data | Understand patterns | Build models | Go further
  stage: "Go further",
  minutes: 12,
  level: "Intermediate",
  summary: "A short introduction to the idea.",
  concepts: ["First takeaway.", "Second takeaway.", "Third takeaway."],
  code: "# R example\nx <- c(2, 4, 6)\nmean(x)",
  practice: "A small task for the learner to try in R.",
  quiz: {
    question: "A quick concept check?",
    options: ["First answer", "Second answer", "Third answer"],
    answer: 1,                        // zero-based option index
    why: "Explain why the correct answer is right."
  }
}
```

Use the next unused ID and keep lesson explanations short, accurate, and supported by a worked R example. The site escapes lesson text before rendering it as HTML. Add links only after the lesson object is in the catalog.
