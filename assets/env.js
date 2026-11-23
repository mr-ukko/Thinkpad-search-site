// Shared by all three sites (identical copy in apex/, ibm/, lenovo/).
// Decides which domain to build links for, so the SAME code works:
//   - locally:    http://thinkpad.localhost:8080, http://ibm.thinkpad.localhost:8080, ...
//   - on GitHub:  https://thinkpad.fi, https://ibm.thinkpad.fi, ...
(function () {
  var local = /(^|\.)thinkpad\.localhost$/.test(location.hostname);
  var domain = local ? "thinkpad.localhost" : "thinkpad.fi";
  var port = local && location.port ? ":" + location.port : "";

  window.TP = {
    local: local,
    brands: [
      { key: "ibm", name: "IBM ThinkPads", era: "1992 – 2005", blurb: "The originals: butterfly keyboards, Pentium M and classic black boxes." },
      { key: "lenovo", name: "Lenovo ThinkPads", era: "2005 – today", blurb: "From the T60 to the latest X1 Carbon: the Lenovo era." },
    ],
    // External tools shown in the top bar of every site
    tools: [
      { name: "TPFanCtrl2", url: "https://github.com/Shuzhengz/TPFanCtrl2" },
      { name: "TPFanControl", url: "https://thinkwiki.de/TPFanControl" },
    ],
    // TP.url("") -> main site, TP.url("ibm", "/t42/") -> ibm site
    url: function (sub, path) {
      return location.protocol + "//" + (sub ? sub + "." : "") + domain + port + (path || "/");
    },
    // Load scripts and call done() when all finished (also when some fail, e.g. a site not deployed yet)
    load: function (urls, done) {
      var n = urls.length;
      if (!n) { done(); return; }
      urls.forEach(function (u) {
        var s = document.createElement("script");
        s.src = u;
        s.async = true;
        s.onload = s.onerror = function () { if (--n === 0) done(); };
        document.head.appendChild(s);
      });
    },
  };
})();
