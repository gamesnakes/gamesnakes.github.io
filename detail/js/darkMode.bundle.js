!(function () {
  "use strict";
  function e(e, t) {
    for (var r = 0; r < t.length; r++) {
      var n = t[r];
      (n.enumerable = n.enumerable || !1),
        (n.configurable = !0),
        "value" in n && (n.writable = !0),
        Object.defineProperty(e, n.key, n);
    }
  }
  new ((function () {
    function t() {
      !(function (e, t) {
        if (!(e instanceof t))
          throw new TypeError("Cannot call a class as a function");
      })(this, t),
        (this.storageKey = "theme-preference"),
        (this.theme = { value: this.getColorPreference() }),
        this.reflectPreference(),
        this.events();
    }
    var r, n;
    return (
      (r = t),
      (n = [
        {
          key: "events",
          value: function () {
            var e = this;
            (window.onload = function () {
              e.reflectPreference(),
                document
                  .querySelectorAll(".js-dark-mode-trigger")
                  .forEach(function (t) {
                    t.addEventListener("click", function (t) {
                      return e.onClick(t);
                    });
                  });
            }),
              window
                .matchMedia("(prefers-color-scheme: dark)")
                .addEventListener("change", function (t) {
                  var r = t.matches;
                  (e.theme.value = r ? "dark" : "light"), e.setPreference();
                });
          },
        },
        {
          key: "getColorPreference",
          value: function () {
            return localStorage.getItem(this.storageKey)
              ? localStorage.getItem(this.storageKey)
              : "dark";
          },
        },
        {
          key: "setPreference",
          value: function () {
            localStorage.setItem(this.storageKey, this.theme.value),
              this.reflectPreference();
          },
        },
        {
          key: "reflectPreference",
          value: function () {
            var e = this;
            (document.firstElementChild.className = ""),
              document.firstElementChild.classList.add(this.theme.value),
              document
                .querySelectorAll(".js-dark-mode-trigger")
                .forEach(function (t) {
                  null == t || t.setAttribute("aria-label", e.theme.value);
                });
          },
        },
        {
          key: "onClick",
          value: function (e) {
            e.preventDefault(),
              (this.theme.value =
                "light" === this.theme.value ? "dark" : "light"),
              this.setPreference();
          },
        },
      ]) && e(r.prototype, n),
      Object.defineProperty(r, "prototype", { writable: !1 }),
      t
    );
  })())();
})();
