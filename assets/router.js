// thinkpad.fi/<id>  ->  <brand>.thinkpad.fi/<id>/
// e.g. thinkpad.fi/T460p -> lenovo.thinkpad.fi/t460p/
// Looks the id up in the model lists loaded from both sub-sites.
(function () {
  var TP = window.TP;
  var seg = (location.pathname.split("/").filter(Boolean)[0] || "").toLowerCase().replace(/\.html?$/, "");
  if (!seg) { location.replace("/"); return; }

  TP.load(TP.brands.map(function (b) { return TP.url(b.key, "/assets/data.js"); }), function () {
    var T = window.THINKPAD || {};
    var hit = null;
    TP.brands.forEach(function (b) {
      if (!hit && T[b.key] && T[b.key].models.some(function (m) { return m.id === seg; })) hit = TP.url(b.key, "/" + seg + "/");
    });
    if (hit) { location.replace(hit); return; }

    var msg = document.getElementById("msg");
    msg.innerHTML = "<h1>Page not found</h1><p>No ThinkPad called <b></b> found.</p><p>" +
      '<a class="btn" href="/">Search models</a>' +
      TP.brands.map(function (b) { return '<a class="btn ghost" href="' + TP.url(b.key) + '">' + b.name + "</a>"; }).join("") + "</p>";
    msg.querySelector("b").textContent = seg;
  });
})();
