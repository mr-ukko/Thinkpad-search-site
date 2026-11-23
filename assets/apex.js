(function () {
  var TP = window.TP;
  var BRANDS = TP.brands;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  // Model lists come straight from each sub-site's own data.js, so adding a model there
  // makes it appear here (search + redirects) automatically.
  TP.load(BRANDS.map(function (b) { return TP.url(b.key, "/assets/data.js"); }), render);

  function render() {
    var T = window.THINKPAD || {};
    var app = document.getElementById("app");

    var header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML = '<div class="wrap"><span class="brand"><a class="brand-name" href="/">Think<b>Pad</b></a>' +
      '<a class="era era-icon" href="/" title="thinkpad.fi"><img src="/favicon.svg" alt="thinkpad.fi" width="22" height="22">' +
      (TP.local ? "<small>local</small>" : "") + '</a></span><nav class="nav">' +
      BRANDS.map(function (b) { return '<a href="' + TP.url(b.key) + '">' + esc(b.name) + "</a>"; }).join("") +
      TP.tools.map(function (t) { return '<a class="ext" href="' + esc(t.url) + '" target="_blank" rel="noopener">' + esc(t.name) + "</a>"; }).join("") +
      "</nav></div>";
    document.body.insertBefore(header, app);
    var footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = '<div class="wrap">© ' + new Date().getFullYear() + " thinkpad.fi. Fan-made, not affiliated with Lenovo or IBM." + (TP.local ? " Local test mode." : "") + "</div>";
    document.body.appendChild(footer);

    var count = function (k) { return T[k] ? T[k].models.length : null; };
    app.innerHTML =
      '<div class="wrap"><div class="hero"><h1>thinkpad.fi</h1><p>Everything about ThinkPads in one place. Pick an era, or search for a model by name.</p></div>' +
      '<section><div class="brands">' + BRANDS.map(function (b) {
        var n = count(b.key);
        return '<a class="card brand-card ' + b.key + '" href="' + TP.url(b.key) + '"><h3>' + esc(b.name) + '</h3><div class="meta">' + esc(b.era) +
          (n != null ? " · " + n + " models" : "") + "</div><p>" + esc(b.blurb) + "</p></a>";
      }).join("") + "</div></section>" +
      '<section><h2>Find a model</h2><div class="toolbar"><input id="q" type="search" placeholder="Search all ThinkPads, e.g. T460p…" autocomplete="off"></div>' +
      '<div class="grid" id="grid"></div></section></div>';

    var list = [];
    BRANDS.forEach(function (b) {
      if (!T[b.key]) return;
      T[b.key].models.forEach(function (m) { list.push({ m: m, b: b }); });
    });

    function draw() {
      var q = document.getElementById("q").value.trim().toLowerCase();
      var grid = document.getElementById("grid");
      if (!q) { grid.innerHTML = ""; return; }
      var hits = list.filter(function (x) { return (x.m.name + " " + x.m.id + " " + x.m.summary + " " + (x.m.gpu || []).map(function (g) { return g.name; }).join(" ")).toLowerCase().indexOf(q) > -1; });
      grid.innerHTML = hits.length ? hits.map(function (x) {
        return '<a class="card" href="' + TP.url(x.b.key, "/" + x.m.id + "/") + '"><h3>' + esc(x.m.name) + '</h3><div class="meta">' + x.m.year +
          ' <span class="tag">' + esc(x.b.name) + "</span></div><p>" + esc(x.m.summary) + "</p></a>";
      }).join("") : "<p>No models match.</p>";
    }
    document.getElementById("q").addEventListener("input", draw);
  }
})();
