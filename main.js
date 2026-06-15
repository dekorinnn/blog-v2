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
  { title: "Spursy",                  href: "entry/052526-2.html",            date: "25th of May 2026"     },
  { title: "Knicks in 5!!!!!",        href: "entry/060926.html",              date: "9th of June 2026"     },
  { title: "Expert Academic Writers", href: "entry/061326.html",              date: "13th of June 2026"    },
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

function grindrDickPicInTheMorning(){
  const euw = document.getElementById("gaybar");
  euw.innerHTML = `
    <ul>
      <li><a href="index.html">Home</a></li>
      <li><a href="blog.html">Blog</a></li>
      <li><a>Essay</a></li>
    </ul>
  `;
}

function funnyBrickhon(){
  const gock = document.getElementById("sidebar");
  gock.innerHTML = `
    <h3>Important Stuff</h3>

    <h3><b>LARP </b>ship_i_like</h3>
    <p>
      palmer-helios(OTP)<br>
      digital-dober<br>
          bakushin-flight<br>
      vodka-machan-scarlet<br>
      opera-doto<br>
      golshi-mcqueen<br>
      teio-mcqueen<br>
      may-bridget-unika<br>
      marisa-alice<br>
      miyagi-sendai<br>
      kumiko-reina<br>
      chika-ai<br>
      mizi-sua<br>
      uika-mana<br>
            mutsumi-nyamu<br>
            soyo-anon<br>
            me-tartaglia<br>
    </p>

    <h3><B>INFO </B>socials</h3>
    <p>
      Discord - digidober<br>
      Twitter - nadekoctl<br>
    </p>
  `;
}

grindrDickPicInTheMorning();
funnyBrickhon();
buildEntryTable();