const entries = [
  { title: "Initial Commit",          href: "entry/012726.html",              date: "27th of January 2026" },
  { title: "Reflection",              href: "entry/012826/entry.html",        date: "28th of January 2026" },
  { title: "Some Thoughts",           href: "entry/020126/entry.html",        date: "1st of February 2026" },
  { title: "Why Would You Read This?",href: "entry/010226.html",              date: "2nd of February 2026" },
  { title: "Why?",                    href: "entry/010226-2.html",            date: "2nd of February 2026" },
  { title: "Dear Erin",               href: "entry/021226/entry.html",        date: "2nd of February 2026" },
  { title: "Retrospective?",          href: "entry/021426/entry.html",        date: "14th of February 2026"},
  { title: "Candy-Cookie",            href: "entry/041926.html",              date: "19th of April 2026"   },
  { title: "Chocolate",               href: "entry/052526.html",              date: "25th of May 2026"     },
];

function buildEntryTable() {
  const table = document.getElementById("entry-table");

  // Clear existing rows except the header
  while (table.rows.length > 1) table.deleteRow(1);

  entries.forEach((entry, i) => {
    const row = table.insertRow();
    row.innerHTML = `
      <td>${i + 1}</td>
      <td><a href="${entry.href}">${entry.title}</a></td>
      <td>${entry.date}</td>
    `;
  });
}

buildEntryTable();