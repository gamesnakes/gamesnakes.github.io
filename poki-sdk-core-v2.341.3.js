(() => {
  var e,
    t,
    n,
    i,
    o = {
      5: (e, t, n) => {
        var i, o, r;
        !(function (n, a) {
          if (n) {
            var s = {},
              d = n.TraceKit,
              c = [].slice,
              l = "?",
              A =
                /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/;
            (s.noConflict = function () {
              return (n.TraceKit = d), s;
            }),
              (s.wrap = function (e) {
                return function () {
                  try {
                    return e.apply(this, arguments);
                  } catch (e) {
                    throw (s.report(e), e);
                  }
                };
              }),
              (s.report = (function () {
                var e,
                  t,
                  i,
                  o,
                  r = [],
                  a = null,
                  d = null;
                function c(e, t, n) {
                  var i = null;
                  if (!t || s.collectWindowErrors) {
                    for (var o in r)
                      if (u(r, o))
                        try {
                          r[o](e, t, n);
                        } catch (e) {
                          i = e;
                        }
                    if (i) throw i;
                  }
                }
                function l(t, n, i, o, r) {
                  if (d)
                    s.computeStackTrace.augmentStackTraceWithInitialElement(
                      d,
                      n,
                      i,
                      t
                    ),
                      h();
                  else if (r) c(s.computeStackTrace(r), !0, r);
                  else {
                    var a,
                      l = { url: n, line: i, column: o },
                      u = t;
                    if ("[object String]" === {}.toString.call(t)) {
                      var p = t.match(A);
                      p && ((a = p[1]), (u = p[2]));
                    }
                    (l.func = s.computeStackTrace.guessFunctionName(
                      l.url,
                      l.line
                    )),
                      (l.context = s.computeStackTrace.gatherContext(
                        l.url,
                        l.line
                      )),
                      c(
                        { name: a, message: u, mode: "onerror", stack: [l] },
                        !0,
                        null
                      );
                  }
                  return !!e && e.apply(this, arguments);
                }
                function p(e) {
                  c(s.computeStackTrace(e.reason), !0, e.reason);
                }
                function h() {
                  var e = d,
                    t = a;
                  (d = null), (a = null), c(e, !1, t);
                }
                function m(e) {
                  if (d) {
                    if (a === e) return;
                    h();
                  }
                  var t = s.computeStackTrace(e);
                  throw (
                    ((d = t),
                    (a = e),
                    setTimeout(
                      function () {
                        a === e && h();
                      },
                      t.incomplete ? 2e3 : 0
                    ),
                    e)
                  );
                }
                return (
                  (m.subscribe = function (a) {
                    !(function () {
                      if (!0 === t) return;
                      (e = n.onerror), (n.onerror = l), (t = !0);
                    })(),
                      (function () {
                        if (!0 === o) return;
                        (i = n.onunhandledrejection),
                          (n.onunhandledrejection = p),
                          (o = !0);
                      })(),
                      r.push(a);
                  }),
                  (m.unsubscribe = function (a) {
                    for (var s = r.length - 1; s >= 0; --s)
                      r[s] === a && r.splice(s, 1);
                    0 === r.length &&
                      (t && ((n.onerror = e), (t = !1)),
                      o && ((n.onunhandledrejection = i), (o = !1)));
                  }),
                  m
                );
              })()),
              (s.computeStackTrace = (function () {
                var e = !1,
                  t = {};
                function i(e) {
                  if ("string" != typeof e) return [];
                  if (!u(t, e)) {
                    var i = "",
                      o = "";
                    try {
                      o = n.document.domain;
                    } catch (e) {}
                    var r = /(.*)\:\/\/([^:\/]+)([:\d]*)\/{0,1}([\s\S]*)/.exec(
                      e
                    );
                    r &&
                      r[2] === o &&
                      (i = (function (e) {
                        if (!s.remoteFetching) return "";
                        try {
                          var t = (function () {
                            try {
                              return new n.XMLHttpRequest();
                            } catch (e) {
                              return new n.ActiveXObject("Microsoft.XMLHTTP");
                            }
                          })();
                          return (
                            t.open("GET", e, !1), t.send(""), t.responseText
                          );
                        } catch (e) {
                          return "";
                        }
                      })(e)),
                      (t[e] = i ? i.split("\n") : []);
                  }
                  return t[e];
                }
                function o(e, t) {
                  var n,
                    o = /function ([^(]*)\(([^)]*)\)/,
                    r =
                      /['"]?([0-9A-Za-z$_]+)['"]?\s*[:=]\s*(function|eval|new Function)/,
                    a = "",
                    s = i(e);
                  if (!s.length) return l;
                  for (var d = 0; d < 10; ++d)
                    if (!p((a = s[t - d] + a))) {
                      if ((n = r.exec(a))) return n[1];
                      if ((n = o.exec(a))) return n[1];
                    }
                  return l;
                }
                function r(e, t) {
                  var n = i(e);
                  if (!n.length) return null;
                  var o = [],
                    r = Math.floor(s.linesOfContext / 2),
                    a = r + (s.linesOfContext % 2),
                    d = Math.max(0, t - r - 1),
                    c = Math.min(n.length, t + a - 1);
                  t -= 1;
                  for (var l = d; l < c; ++l) p(n[l]) || o.push(n[l]);
                  return o.length > 0 ? o : null;
                }
                function a(e) {
                  return e.replace(/[\-\[\]{}()*+?.,\\\^$|#]/g, "\\$&");
                }
                function d(e) {
                  return a(e)
                    .replace("<", "(?:<|&lt;)")
                    .replace(">", "(?:>|&gt;)")
                    .replace("&", "(?:&|&amp;)")
                    .replace('"', '(?:"|&quot;)')
                    .replace(/\s+/g, "\\s+");
                }
                function c(e, t) {
                  for (var n, o, r = 0, a = t.length; r < a; ++r)
                    if (
                      (n = i(t[r])).length &&
                      ((n = n.join("\n")), (o = e.exec(n)))
                    )
                      return {
                        url: t[r],
                        line: n.substring(0, o.index).split("\n").length,
                        column: o.index - n.lastIndexOf("\n", o.index) - 1,
                      };
                  return null;
                }
                function A(e, t, n) {
                  var o,
                    r = i(t),
                    s = new RegExp("\\b" + a(e) + "\\b");
                  return (
                    (n -= 1),
                    r && r.length > n && (o = s.exec(r[n])) ? o.index : null
                  );
                }
                function h(e) {
                  if (!p(n && n.document)) {
                    for (
                      var t,
                        i,
                        o,
                        r,
                        s = [n.location.href],
                        l = n.document.getElementsByTagName("script"),
                        A = "" + e,
                        u = 0;
                      u < l.length;
                      ++u
                    ) {
                      var h = l[u];
                      h.src && s.push(h.src);
                    }
                    if (
                      (o =
                        /^function(?:\s+([\w$]+))?\s*\(([\w\s,]*)\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/.exec(
                          A
                        ))
                    ) {
                      var m = o[1] ? "\\s+" + o[1] : "",
                        g = o[2].split(",").join("\\s*,\\s*");
                      (t = a(o[3]).replace(/;$/, ";?")),
                        (i = new RegExp(
                          "function" +
                            m +
                            "\\s*\\(\\s*" +
                            g +
                            "\\s*\\)\\s*{\\s*" +
                            t +
                            "\\s*}"
                        ));
                    } else i = new RegExp(a(A).replace(/\s+/g, "\\s+"));
                    if ((r = c(i, s))) return r;
                    if (
                      (o =
                        /^function on([\w$]+)\s*\(event\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/.exec(
                          A
                        ))
                    ) {
                      var v = o[1];
                      if (
                        ((t = d(o[2])),
                        (r = c(
                          (i = new RegExp(
                            "on" + v + "=[\\'\"]\\s*" + t + "\\s*[\\'\"]",
                            "i"
                          )),
                          s[0]
                        )))
                      )
                        return r;
                      if ((r = c((i = new RegExp(t)), s))) return r;
                    }
                    return null;
                  }
                }
                function m(e) {
                  if (!e.stack) return null;
                  for (
                    var t,
                      n,
                      i,
                      a =
                        /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
                      s =
                        /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i,
                      d =
                        /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
                      c = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
                      u = /\((\S*)(?::(\d+))(?::(\d+))\)/,
                      h = e.stack.split("\n"),
                      m = [],
                      g = /^(.*) is undefined$/.exec(e.message),
                      v = 0,
                      f = h.length;
                    v < f;
                    ++v
                  ) {
                    if ((n = a.exec(h[v]))) {
                      var y = n[2] && 0 === n[2].indexOf("native");
                      n[2] &&
                        0 === n[2].indexOf("eval") &&
                        (t = u.exec(n[2])) &&
                        ((n[2] = t[1]), (n[3] = t[2]), (n[4] = t[3])),
                        (i = {
                          url: y ? null : n[2],
                          func: n[1] || l,
                          args: y ? [n[2]] : [],
                          line: n[3] ? +n[3] : null,
                          column: n[4] ? +n[4] : null,
                        });
                    } else if ((n = d.exec(h[v])))
                      i = {
                        url: n[2],
                        func: n[1] || l,
                        args: [],
                        line: +n[3],
                        column: n[4] ? +n[4] : null,
                      };
                    else {
                      if (!(n = s.exec(h[v]))) continue;
                      n[3] && n[3].indexOf(" > eval") > -1 && (t = c.exec(n[3]))
                        ? ((n[3] = t[1]), (n[4] = t[2]), (n[5] = null))
                        : 0 !== v ||
                          n[5] ||
                          p(e.columnNumber) ||
                          (m[0].column = e.columnNumber + 1),
                        (i = {
                          url: n[3],
                          func: n[1] || l,
                          args: n[2] ? n[2].split(",") : [],
                          line: n[4] ? +n[4] : null,
                          column: n[5] ? +n[5] : null,
                        });
                    }
                    !i.func && i.line && (i.func = o(i.url, i.line)),
                      (i.context = i.line ? r(i.url, i.line) : null),
                      m.push(i);
                  }
                  return m.length
                    ? (m[0] &&
                        m[0].line &&
                        !m[0].column &&
                        g &&
                        (m[0].column = A(g[1], m[0].url, m[0].line)),
                      {
                        mode: "stack",
                        name: e.name,
                        message: e.message,
                        stack: m,
                      })
                    : null;
                }
                function g(e, t, n, i) {
                  var a = { url: t, line: n };
                  if (a.url && a.line) {
                    (e.incomplete = !1),
                      a.func || (a.func = o(a.url, a.line)),
                      a.context || (a.context = r(a.url, a.line));
                    var s = / '([^']+)' /.exec(i);
                    if (
                      (s && (a.column = A(s[1], a.url, a.line)),
                      e.stack.length > 0 && e.stack[0].url === a.url)
                    ) {
                      if (e.stack[0].line === a.line) return !1;
                      if (!e.stack[0].line && e.stack[0].func === a.func)
                        return (
                          (e.stack[0].line = a.line),
                          (e.stack[0].context = a.context),
                          !1
                        );
                    }
                    return e.stack.unshift(a), (e.partial = !0), !0;
                  }
                  return (e.incomplete = !0), !1;
                }
                function v(e, t) {
                  for (
                    var n,
                      i,
                      r,
                      a =
                        /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i,
                      d = [],
                      c = {},
                      u = !1,
                      p = v.caller;
                    p && !u;
                    p = p.caller
                  )
                    if (p !== f && p !== s.report) {
                      if (
                        ((i = {
                          url: null,
                          func: l,
                          args: [],
                          line: null,
                          column: null,
                        }),
                        p.name
                          ? (i.func = p.name)
                          : (n = a.exec(p.toString())) && (i.func = n[1]),
                        void 0 === i.func)
                      )
                        try {
                          i.func = n.input.substring(0, n.input.indexOf("{"));
                        } catch (e) {}
                      if ((r = h(p))) {
                        (i.url = r.url),
                          (i.line = r.line),
                          i.func === l && (i.func = o(i.url, i.line));
                        var m = / '([^']+)' /.exec(e.message || e.description);
                        m && (i.column = A(m[1], r.url, r.line));
                      }
                      c["" + p] ? (u = !0) : (c["" + p] = !0), d.push(i);
                    }
                  t && d.splice(0, t);
                  var y = {
                    mode: "callers",
                    name: e.name,
                    message: e.message,
                    stack: d,
                  };
                  return (
                    g(
                      y,
                      e.sourceURL || e.fileName,
                      e.line || e.lineNumber,
                      e.message || e.description
                    ),
                    y
                  );
                }
                function f(t, a) {
                  var s = null;
                  a = null == a ? 0 : +a;
                  try {
                    if (
                      ((s = (function (e) {
                        var t = e.stacktrace;
                        if (t) {
                          for (
                            var n,
                              i =
                                / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i,
                              a =
                                / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^\)]+))\((.*)\))? in (.*):\s*$/i,
                              s = t.split("\n"),
                              d = [],
                              c = 0;
                            c < s.length;
                            c += 2
                          ) {
                            var l = null;
                            if (
                              ((n = i.exec(s[c]))
                                ? (l = {
                                    url: n[2],
                                    line: +n[1],
                                    column: null,
                                    func: n[3],
                                    args: [],
                                  })
                                : (n = a.exec(s[c])) &&
                                  (l = {
                                    url: n[6],
                                    line: +n[1],
                                    column: +n[2],
                                    func: n[3] || n[4],
                                    args: n[5] ? n[5].split(",") : [],
                                  }),
                              l)
                            ) {
                              if (
                                (!l.func &&
                                  l.line &&
                                  (l.func = o(l.url, l.line)),
                                l.line)
                              )
                                try {
                                  l.context = r(l.url, l.line);
                                } catch (e) {}
                              l.context || (l.context = [s[c + 1]]), d.push(l);
                            }
                          }
                          return d.length
                            ? {
                                mode: "stacktrace",
                                name: e.name,
                                message: e.message,
                                stack: d,
                              }
                            : null;
                        }
                      })(t)),
                      s)
                    )
                      return s;
                  } catch (t) {
                    if (e) throw t;
                  }
                  try {
                    if ((s = m(t))) return s;
                  } catch (t) {
                    if (e) throw t;
                  }
                  try {
                    if (
                      ((s = (function (e) {
                        var t = e.message.split("\n");
                        if (t.length < 4) return null;
                        var a,
                          s =
                            /^\s*Line (\d+) of linked script ((?:file|https?|blob)\S+)(?:: in function (\S+))?\s*$/i,
                          l =
                            /^\s*Line (\d+) of inline#(\d+) script in ((?:file|https?|blob)\S+)(?:: in function (\S+))?\s*$/i,
                          A = /^\s*Line (\d+) of function script\s*$/i,
                          p = [],
                          h =
                            n &&
                            n.document &&
                            n.document.getElementsByTagName("script"),
                          m = [];
                        for (var g in h) u(h, g) && !h[g].src && m.push(h[g]);
                        for (var v = 2; v < t.length; v += 2) {
                          var f = null;
                          if ((a = s.exec(t[v])))
                            f = {
                              url: a[2],
                              func: a[3],
                              args: [],
                              line: +a[1],
                              column: null,
                            };
                          else if ((a = l.exec(t[v]))) {
                            f = {
                              url: a[3],
                              func: a[4],
                              args: [],
                              line: +a[1],
                              column: null,
                            };
                            var y = +a[1],
                              w = m[a[2] - 1];
                            if (w) {
                              var b = i(f.url);
                              if (b) {
                                var k = (b = b.join("\n")).indexOf(w.innerText);
                                k >= 0 &&
                                  (f.line =
                                    y + b.substring(0, k).split("\n").length);
                              }
                            }
                          } else if ((a = A.exec(t[v]))) {
                            var Z = n.location.href.replace(/#.*$/, ""),
                              E = c(new RegExp(d(t[v + 1])), [Z]);
                            f = {
                              url: Z,
                              func: "",
                              args: [],
                              line: E ? E.line : a[1],
                              column: null,
                            };
                          }
                          if (f) {
                            f.func || (f.func = o(f.url, f.line));
                            var I = r(f.url, f.line),
                              x = I ? I[Math.floor(I.length / 2)] : null;
                            I &&
                            x.replace(/^\s*/, "") ===
                              t[v + 1].replace(/^\s*/, "")
                              ? (f.context = I)
                              : (f.context = [t[v + 1]]),
                              p.push(f);
                          }
                        }
                        return p.length
                          ? {
                              mode: "multiline",
                              name: e.name,
                              message: t[0],
                              stack: p,
                            }
                          : null;
                      })(t)),
                      s)
                    )
                      return s;
                  } catch (t) {
                    if (e) throw t;
                  }
                  try {
                    if ((s = v(t, a + 1))) return s;
                  } catch (t) {
                    if (e) throw t;
                  }
                  return { name: t.name, message: t.message, mode: "failed" };
                }
                return (
                  (f.augmentStackTraceWithInitialElement = g),
                  (f.computeStackTraceFromStackProp = m),
                  (f.guessFunctionName = o),
                  (f.gatherContext = r),
                  (f.ofCaller = function (e) {
                    e = 1 + (null == e ? 0 : +e);
                    try {
                      throw new Error();
                    } catch (t) {
                      return f(t, e + 1);
                    }
                  }),
                  (f.getSource = i),
                  f
                );
              })()),
              (s.extendToAsynchronousCallbacks = function () {
                var e = function (e) {
                  var t = n[e];
                  n[e] = function () {
                    var e = c.call(arguments),
                      n = e[0];
                    return (
                      "function" == typeof n && (e[0] = s.wrap(n)),
                      t.apply ? t.apply(this, e) : t(e[0], e[1])
                    );
                  };
                };
                e("setTimeout"), e("setInterval");
              }),
              s.remoteFetching || (s.remoteFetching = !0),
              s.collectWindowErrors || (s.collectWindowErrors = !0),
              (!s.linesOfContext || s.linesOfContext < 1) &&
                (s.linesOfContext = 11),
              (o = []),
              void 0 ===
                (r = "function" == typeof (i = s) ? i.apply(t, o) : i) ||
                (e.exports = r);
          }
          function u(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t);
          }
          function p(e) {
            return void 0 === e;
          }
        })("undefined" != typeof window ? window : n.g);
      },
      583: (e, t, n) => {
        "use strict";
        n.d(t, { Z: () => i });
        const i = {
          ready: "pokiAppReady",
          adblocked: "pokiAppAdblocked",
          ads: {
            completed: "pokiAdsCompleted",
            error: "pokiAdsError",
            impression: "pokiAdsImpression",
            durationChange: "pokiAdsDurationChange",
            limit: "pokiAdsLimit",
            ready: "pokiAdsReady",
            requested: "pokiAdsRequested",
            prebidRequested: "pokiAdsPrebidRequested",
            skipped: "pokiAdsSkipped",
            started: "pokiAdsStarted",
            stopped: "pokiAdsStopped",
            busy: "pokiAdsBusy",
            position: {
              preroll: "PP",
              midroll: "PM",
              rewarded: "PR",
              display: "DP",
            },
            video: {
              clicked: "pokiVideoAdsClicked",
              firstQuartile: "pokiVideoAdsFirstQuartile",
              midPoint: "pokiVideoAdsMidPoint",
              thirdQuartile: "pokiVideoAdsThirdQuartile",
              error: "pokiVideoAdsError",
              loaderError: "pokiVideoAdsLoaderError",
              paused: "pokiVideoAdsPauseTriggered",
              resumed: "pokiVideoAdsResumedTriggered",
              progress: "pokiVideoAdsProgress",
              buffering: "pokiVideoAdsBuffering",
              startHouseAdFlow: "pokiVideoAdsStartHouseAdFlow",
            },
            display: { error: "pokiDisplayAdsError" },
          },
          info: {
            messages: {
              timeLimit:
                "The ad-request was not processed, because of a time constraint",
              prerollLimit:
                "The ad-request was cancelled, because we're not allowed to show a preroll (PokiSDK.commercialBreak before PokiSDK.gameplayStart)",
              disabled:
                "The ad-request was cancelled, because we've disabled this format for this specific configuration",
            },
          },
          message: {
            event: "pokiMessageEvent",
            sdkDetails: "pokiMessageSdkDetails",
            setPokiURLParams: "pokiMessageSetPokiURLParams",
            sendGameScreenshot: "pokiMessageSendScreenshot",
            sendGameRawScreenshot: "pokiMessageSendRawScreenshot",
            sendUploadScreenshot: "pokiMessageSendUploadScreenshot",
            sendCommand: "pokiMessageSendCommand",
          },
          tracking: {
            custom: "pokiTrackingCustom",
            debugTrueInProduction: "pokiMessageDebugTrueProduction",
            screen: {
              gameplayStart: "pokiTrackingScreenGameplayStart",
              gameplayStop: "pokiTrackingScreenGameplayStop",
              gameLoadingFinished: "pokiTrackingScreenGameLoadingFinished",
              commercialBreak: "pokiTrackingScreenCommercialBreak",
              rewardedBreak: "pokiTrackingScreenRewardedBreak",
              firstRound: "pokiTrackingScreenFirstRound",
              roundStart: "pokiTrackingScreenRoundStart",
              roundEnd: "pokiTrackingScreenRoundEnd",
              displayAd: "pokiTrackingScreenDisplayAdRequest",
              destroyAd: "pokiTrackingScreenDisplayAdDestroy",
              playerActive: "pokiTrackingScreenPlayerActive",
            },
            playtest: {
              showModal: "pokiTrackingPlaytestShowModal",
              accepted: "pokiTrackingPlaytestAccepted",
              rejected: "pokiTrackingPlaytestRejected",
              noCanvas: "pokiTrackingPlaytestNoCanvas",
              starting: "pokiTrackingPlaytestStarting",
              connected: "pokiTrackingPlaytestConnected",
            },
            sdk: {
              status: {
                initialized: "pokiTrackingSdkStatusInitialized",
                failed: "pokiTrackingSdkStatusFailed",
              },
            },
            ads: {
              status: {
                busy: "pokiTrackingAdsStatusBusy",
                completed: "pokiTrackingAdsStatusCompleted",
                error: "pokiTrackingAdsStatusError",
                impression: "pokiTrackingAdsStatusImpression",
                limit: "pokiTrackingAdsStatusLimit",
                ready: "pokiTrackingAdsStatusReady",
                requested: "pokiTrackingAdsStatusRequested",
                prebidRequested: "pokiTrackingAdsStatusPrebidRequested",
                skipped: "pokiTrackingAdsStatusSkipped",
                started: "pokiTrackingAdsStatusStarted",
                buffering: "pokiTrackingAdsStatusBuffering",
              },
              video: {
                clicked: "pokiTrackingAdsVideoClicked",
                error: "pokiTrackingAdsVideoError",
                loaderError: "pokiTrackingAdsVideoLoaderError",
                progress: "pokiTrackingAdsVideoProgress",
                paused: "pokiTrackingAdsVideoPaused",
                resumed: "pokiTrackingAdsVideoResumed",
              },
              display: {
                requested: "pokiTrackingScreenDisplayAdRequested",
                impression: "pokiTrackingScreenDisplayAdImpression",
              },
              rewardedWeb: {
                request: "pokiTrackingRewardedWebRequest",
                ready: "pokiTrackingRewardedWebReady",
                impression: "pokiTrackingRewardedWebImpression",
                closedGranted: "pokiTrackingRewardedWebClosedGranted",
                closedDeclined: "pokiTrackingRewardedWebclosedDeclined",
                empty: "pokiTrackingRewardedWebEmpty",
              },
            },
          },
        };
      },
      735: (e, t, n) => {
        "use strict";
        n.d(t, { Z: () => Ct });
        var i = n(5),
          o = n.n(i),
          r = n(583),
          a = n(453),
          s = n(888),
          d = n(298),
          c = 15552e3,
          l = window.location.hostname;
        function A(e) {
          var t = new RegExp("".concat(e, "=([^;]+)(?:;|$)")).exec(
            document.cookie
          );
          return t ? t[1] : "";
        }
        function u(e, t) {
          document.cookie = ""
            .concat(e, "=")
            .concat(t, "; path=/; samesite=none; secure; max-age=")
            .concat(c, "; domain=")
            .concat(l);
        }
        l.endsWith("poki-gdn.com") && (l = "poki-gdn.com");
        var p = function (e, t, n, i) {
            return new (n || (n = Promise))(function (o, r) {
              function a(e) {
                try {
                  d(i.next(e));
                } catch (e) {
                  r(e);
                }
              }
              function s(e) {
                try {
                  d(i.throw(e));
                } catch (e) {
                  r(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? o(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(a, s);
              }
              d((i = i.apply(e, t || [])).next());
            });
          },
          h = function (e, t) {
            var n,
              i,
              o,
              r,
              a = {
                label: 0,
                sent: function () {
                  if (1 & o[0]) throw o[1];
                  return o[1];
                },
                trys: [],
                ops: [],
              };
            return (
              (r = { next: s(0), throw: s(1), return: s(2) }),
              "function" == typeof Symbol &&
                (r[Symbol.iterator] = function () {
                  return this;
                }),
              r
            );
            function s(s) {
              return function (d) {
                return (function (s) {
                  if (n) throw new TypeError("Generator is already executing.");
                  for (; r && ((r = 0), s[0] && (a = 0)), a; )
                    try {
                      if (
                        ((n = 1),
                        i &&
                          (o =
                            2 & s[0]
                              ? i.return
                              : s[0]
                              ? i.throw || ((o = i.return) && o.call(i), 0)
                              : i.next) &&
                          !(o = o.call(i, s[1])).done)
                      )
                        return o;
                      switch (((i = 0), o && (s = [2 & s[0], o.value]), s[0])) {
                        case 0:
                        case 1:
                          o = s;
                          break;
                        case 4:
                          return a.label++, { value: s[1], done: !1 };
                        case 5:
                          a.label++, (i = s[1]), (s = [0]);
                          continue;
                        case 7:
                          (s = a.ops.pop()), a.trys.pop();
                          continue;
                        default:
                          if (
                            !((o = a.trys),
                            (o = o.length > 0 && o[o.length - 1]) ||
                              (6 !== s[0] && 2 !== s[0]))
                          ) {
                            a = 0;
                            continue;
                          }
                          if (
                            3 === s[0] &&
                            (!o || (s[1] > o[0] && s[1] < o[3]))
                          ) {
                            a.label = s[1];
                            break;
                          }
                          if (6 === s[0] && a.label < o[1]) {
                            (a.label = o[1]), (o = s);
                            break;
                          }
                          if (o && a.label < o[2]) {
                            (a.label = o[2]), a.ops.push(s);
                            break;
                          }
                          o[2] && a.ops.pop(), a.trys.pop();
                          continue;
                      }
                      s = t.call(e, a);
                    } catch (e) {
                      (s = [6, e]), (i = 0);
                    } finally {
                      n = o = 0;
                    }
                  if (5 & s[0]) throw s[1];
                  return { value: s[0] ? s[1] : void 0, done: !0 };
                })([s, d]);
              };
            }
          },
          m = function (e, t, n) {
            if (n || 2 === arguments.length)
              for (var i, o = 0, r = t.length; o < r; o++)
                (!i && o in t) ||
                  (i || (i = Array.prototype.slice.call(t, 0, o)),
                  (i[o] = t[o]));
            return e.concat(i || Array.prototype.slice.call(t));
          },
          g = "poki_gcuid",
          v = A(g);
        const f = (function () {
          function e() {}
          return (
            (e.collectAndLog = function () {
              return p(this, void 0, void 0, function () {
                var e, t, n, i, o;
                return h(this, function (r) {
                  switch (r.label) {
                    case 0:
                      return (
                        r.trys.push([0, 5, , 6]),
                        [4, window.cookieStore.getAll()]
                      );
                    case 1:
                      return (
                        (e = r.sent()),
                        window.indexedDB.databases
                          ? [4, window.indexedDB.databases()]
                          : [3, 3]
                      );
                    case 2:
                      return (n = r.sent()), [3, 4];
                    case 3:
                      (n = []), (r.label = 4);
                    case 4:
                      return (
                        (t = n),
                        (i = m(
                          m(
                            m(
                              [],
                              e.map(function (e) {
                                return {
                                  name: e.name,
                                  expire_seconds: Math.round(
                                    (e.expires - Date.now()) / 1e3
                                  ),
                                  type: "cookie",
                                  domain: e.domain,
                                };
                              }),
                              !0
                            ),
                            Object.keys(window.localStorage).map(function (e) {
                              return {
                                name: e,
                                expire_seconds: 15552e3,
                                type: "localStorage",
                              };
                            }),
                            !0
                          ),
                          t.map(function (e) {
                            return {
                              name: e.name,
                              expire_seconds: 0,
                              type: "idb",
                            };
                          }),
                          !0
                        )),
                        (o = {
                          cookies: i,
                          p4d_game_id: s.Z.gameID,
                          user_id: v,
                        }),
                        window
                          .fetch("https://t.poki.io/game-cookies", {
                            method: "post",
                            body: JSON.stringify(o),
                          })
                          .catch(),
                        [3, 6]
                      );
                    case 5:
                      return r.sent(), [3, 6];
                    case 6:
                      return [2];
                  }
                });
              });
            }),
            (e.trackSavegames = function () {
              window.cookieStore &&
                window.cookieStore.getAll &&
                s.Z.gameID &&
                (Math.random() > 0.01 ||
                  (navigator.userAgent.indexOf("Safari") > -1 &&
                    navigator.userAgent.indexOf("Chrome") <= -1) ||
                  (v ||
                    ((v = Math.random().toString(36).substr(2, 9)), u(g, v)),
                  e.collectAndLog(),
                  setInterval(e.collectAndLog, 12e4)));
            }),
            e
          );
        })();
        function y(e) {
          if (document.body && document.body.appendChild) {
            var t = document.createElement("iframe");
            (t.style.display = "none"),
              document.body.appendChild(t),
              t.contentWindow &&
                (t.contentWindow.document.open(),
                t.contentWindow.document.write(
                  "<script>".concat(e, "</script>")
                ),
                t.contentWindow.document.close());
          } else
            document.addEventListener("DOMContentLoaded", function () {
              y(e);
            });
        }
        var w = function () {
            s.Z.isPokiIframe &&
              (y(
                "\nconst lsKey = 'poki_lsexpire';\nconst lifetime = 1000*60*60*24*30*6;\n\nwindow.addEventListener('storage', function(event) {\n\ttry {\n\t\tconst key = event.key;\n\n\t\t// key is null when localStorage.clear() is called.\n\t\tif (key === null) {\n\t\t\tlocalStorage.removeItem(lsKey);\n\t\t\treturn;\n\t\t}\n\n\t\tif (key === lsKey) return;\n\n\t\tconst updates = JSON.parse(localStorage.getItem(lsKey)) || {};\n\n\t\t// newValue is null when localStorage.removeItem() is called.\n\t\tif (event.newValue === null) {\n\t\t\tdelete updates[key];\n\t\t} else {\n\t\t\tupdates[key] = Date.now();\n\t\t}\n\t\tlocalStorage.setItem(lsKey, JSON.stringify(updates));\n\t} catch (e) {}\n});\n\nfunction expire() {\n\tconst updates = JSON.parse(localStorage.getItem(lsKey)) || {};\n\tconst expireBefore = Date.now() - lifetime;\n\tvar removed = false;\n\n\tObject.keys(updates).map(function(key) {\n\t\tif (updates[key] < expireBefore) {\n\t\t\tlocalStorage.removeItem(key);\n\t\t\tdelete updates[key];\n\t\t\tremoved = true;\n\t\t}\n\t});\n\n\tif (removed) {\n\t\tlocalStorage.setItem(lsKey, JSON.stringify(updates));\n\t}\n}\n\ntry {\n\texpire();\n} catch (e) {}\n"
              ),
              setTimeout(f.trackSavegames, 1e4),
              /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
                y(
                  "\nwindow.addEventListener('storage', function(event) {\n\ttry {\n\t\tconst key = event.key;\n\n\t\t// key is null when localStorage.clear() is called.\n\t\tif (key === null) {\n\t\t\twindow.top.postMessage({\n\t\t\t\ttype: 'mutateSaveGame',\n\t\t\t\tcontent: {\n\t\t\t\t\taction: 'clear',\n\t\t\t\t},\n\t\t\t}, '*');\n\t\t\treturn;\n\t\t}\n\n\t\t// newValue is null when localStorage.removeItem() is called.\n\t\tif (event.newValue === null) {\n\t\t\twindow.top.postMessage({\n\t\t\t\ttype: 'mutateSaveGame',\n\t\t\t\tcontent: {\n\t\t\t\t\taction: 'delete',\n\t\t\t\t\tkey,\n\t\t\t\t},\n\t\t\t}, '*');\n\t\t} else {\n\t\t\twindow.top.postMessage({\n\t\t\t\ttype: 'mutateSaveGame',\n\t\t\t\tcontent: {\n\t\t\t\t\taction: 'set',\n\t\t\t\t\tkey,\n\t\t\t\t\tvalue: event.newValue,\n\t\t\t\t},\n\t\t\t}, '*');\n\t\t}\n\t} catch (e) {}\n});\n"
                ));
          },
          b = function () {
            s.Z.gdprApplies &&
              (a.Z.setRequireConsent(!0),
              (function () {
                if (!window.__tcfapi) {
                  var e = window.top,
                    t = {};
                  (window.__tcfapi = function (n, i, o, r) {
                    var a = "".concat(Math.random()),
                      s = {
                        __tcfapiCall: {
                          command: n,
                          parameter: r,
                          version: i,
                          callId: a,
                        },
                      };
                    (t[a] = o), e.postMessage(s, "*");
                  }),
                    window.addEventListener(
                      "message",
                      function (e) {
                        var n = {};
                        try {
                          n =
                            "string" == typeof e.data
                              ? JSON.parse(e.data)
                              : e.data;
                        } catch (e) {}
                        var i = n.__tcfapiReturn;
                        i &&
                          "function" == typeof t[i.callId] &&
                          (t[i.callId](i.returnValue, i.success),
                          (t[i.callId] = null));
                      },
                      !1
                    );
                }
              })()),
              s.Z.ccpaApplies &&
                (function () {
                  if (!window.__uspapi) {
                    var e = window.top,
                      t = {};
                    (window.__uspapi = function (n, i, o) {
                      var r = "".concat(Math.random()),
                        a = {
                          __uspapiCall: { command: n, version: i, callId: r },
                        };
                      (t[r] = o), e.postMessage(a, "*");
                    }),
                      window.addEventListener(
                        "message",
                        function (e) {
                          var n = e && e.data && e.data.__uspapiReturn;
                          n &&
                            n.callId &&
                            "function" == typeof t[n.callId] &&
                            (t[n.callId](n.returnValue, n.success),
                            (t[n.callId] = null));
                        },
                        !1
                      );
                  }
                })(),
              _();
          },
          k = !1,
          Z = !1,
          E = function () {
            window.__tcfapi &&
              window.__tcfapi("ping", 2, function () {
                console.debug("GDPR - __tcfapi callback received"),
                  (k = !0),
                  clearInterval(I);
              });
          },
          I = setInterval(E, 2e3),
          x = function () {
            window.__uspapi &&
              window.__uspapi("uspPing", 1, function () {
                console.debug("USPrivacy - __uspapi callback received"),
                  (Z = !0),
                  clearInterval(C);
              });
          },
          C = setInterval(x, 2e3),
          _ = function () {
            s.Z.gdprApplies &&
              (clearInterval(C),
              E(),
              setTimeout(function () {
                k ||
                  console.error(
                    "GDPR - No __tcfapi callback after 2s, verify implementation!"
                  );
              }, 2e3)),
              s.Z.ccpaApplies &&
                (clearInterval(I),
                x(),
                setTimeout(function () {
                  Z ||
                    console.error(
                      "USPrivacy - No __uspapi callback after 2s, verify implementation!"
                    );
                }, 2e3)),
              ((!s.Z.gdprApplies && !s.Z.ccpaApplies) || d.Z.debug) &&
                (clearInterval(I), clearInterval(C));
          },
          S = function () {
            return s.Z.gdprApplies && !k && !d.Z.debug;
          },
          T = function () {
            return s.Z.ccpaApplies && !Z && !d.Z.debug;
          },
          P = n(699),
          D = n(893);
        var B =
            "MacIntel" === window.navigator.platform &&
            void 0 !== window.navigator.standalone &&
            navigator.maxTouchPoints > 1,
          j = n(573),
          z = n(992);
        const M = function () {
          for (var e = Math.floor(Date.now() / 1e3), t = "", n = 0; n < 4; n++)
            (t = String.fromCharCode(255 & e) + t), (e >>= 8);
          if (window.crypto && crypto.getRandomValues && Uint32Array) {
            var i = new Uint32Array(12);
            crypto.getRandomValues(i);
            for (n = 0; n < 12; n++) t += String.fromCharCode(255 & i[n]);
          } else
            for (n = 0; n < 12; n++)
              t += String.fromCharCode(Math.floor(256 * Math.random()));
          return btoa(t)
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=/g, "");
        };
        const O = function (e) {
          return e instanceof Array ? e : [e];
        };
        var R = 21682198607;
        const L = {
          adTagUrl:
            "//pubads.g.doubleclick.net/gampad/ads?sz=640x360|640x480&iu=/1053551/Pub-Poki-Generic&ciu_szs&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url={url}&description_url={descriptionUrl}&correlator={timestamp}",
          adTiming: {
            preroll: !1,
            timeBetweenAds: 12e4,
            timePerTry: 7e3,
            startAdsAfter: 12e4,
          },
          waterfallRetries: 2,
        };
        var G = n(58);
        const N = (function () {
          function e(e) {
            void 0 === e && (e = {}),
              this.setTimings(e),
              (this.timingIdx = { timePerTry: 0 }),
              (this.timers = {
                timePerTry: void 0,
                timeBetweenAds: void 0,
                startAdsAfter: void 0,
              }),
              G.Z.addEventListener(
                r.Z.ads.requested,
                this.startTimeBetweenAdsTimer.bind(this)
              ),
              G.Z.addEventListener(
                r.Z.ads.completed,
                this.startTimeBetweenAdsTimer.bind(this)
              ),
              G.Z.addEventListener(
                r.Z.ads.stopped,
                this.startTimeBetweenAdsTimer.bind(this)
              );
          }
          return (
            (e.prototype.setTimings = function (e) {
              var t = L.adTiming,
                n = e.preroll,
                i = void 0 === n ? t.preroll : n,
                o = e.timePerTry,
                r = void 0 === o ? t.timePerTry : o,
                a = e.timeBetweenAds,
                s = void 0 === a ? t.timeBetweenAds : a,
                d = e.startAdsAfter,
                c = void 0 === d ? t.startAdsAfter : d;
              this.timings = {
                preroll: !1 !== i,
                timePerTry: O(r),
                timeBetweenAds: s,
                startAdsAfter: c,
              };
            }),
            (e.prototype.startTimeBetweenAdsTimer = function () {
              this.startTimer("timeBetweenAds");
            }),
            (e.prototype.startStartAdsAfterTimer = function () {
              this.startTimer("startAdsAfter");
            }),
            (e.prototype.requestPossible = function () {
              return !this.timers.timeBetweenAds && !this.timers.startAdsAfter;
            }),
            (e.prototype.startWaterfallTimer = function (e) {
              this.startTimer("timePerTry", e);
            }),
            (e.prototype.stopWaterfallTimer = function () {
              this.stopTimer("timePerTry");
            }),
            (e.prototype.nextWaterfallTimer = function () {
              this.nextTiming("timePerTry");
            }),
            (e.prototype.resetWaterfallTimerIdx = function () {
              this.resetTimingIdx("timePerTry");
            }),
            (e.prototype.stopTimer = function (e) {
              this.timers[e] &&
                (clearTimeout(this.timers[e]), (this.timers[e] = void 0));
            }),
            (e.prototype.startTimer = function (e, t) {
              var n = this;
              void 0 === t && (t = function () {}),
                this.getTiming(e) <= 0
                  ? t()
                  : (this.timers[e] && clearTimeout(this.timers[e]),
                    (this.timers[e] = window.setTimeout(function () {
                      n.stopTimer(e), t();
                    }, this.getTiming(e))));
            }),
            (e.prototype.getTiming = function (e) {
              var t = this.timings[e];
              return t instanceof Array ? t[this.timingIdx[e]] : t;
            }),
            (e.prototype.nextTiming = function (e) {
              if (void 0 === this.timingIdx[e])
                throw new Error(
                  "AdTimings Error: ".concat(
                    e,
                    " does not have multiple timers"
                  )
                );
              this.timingIdx[e] =
                (this.timingIdx[e] + 1) % this.timings[e].length;
            }),
            (e.prototype.resetTimingIdx = function (e) {
              if (void 0 === this.timingIdx[e])
                throw new Error(
                  "AdTimings Error: ".concat(
                    e,
                    " does not have multiple timers"
                  )
                );
              this.timingIdx[e] = 0;
            }),
            (e.prototype.prerollPossible = function () {
              return this.timings.preroll;
            }),
            e
          );
        })();
        var U = n(906),
          q = n(902);
        const Q = function () {
            var e = window.location.href.split("?")[0],
              t = (0, U.Z)("poki_url") || e;
            return decodeURIComponent(t);
          },
          V = function () {
            return (
              "undefined" != typeof navigator &&
              /MSIE \\d|Trident.*rv:/i.test(navigator.userAgent)
            );
          };
        var F = {
          1: "eNjDw1AVTr",
          3: "AfRKClvdYk",
          5: "UprdYKe74r",
          6: "tBCJC9E6Y4",
          7: "AfRKClvdYk",
          8: "tJ44vpLpuM",
          10: "rKV8rMwiwk",
          11: "SvK8BH5qS5",
          12: "SpfIMxnWTS",
          13: "ysxIcmt3tW",
          14: "gLmtGS4aUq",
          15: "RU6ebIFLw9",
          16: "r9G4tVMYw7",
          17: "SgcDa5B8s1",
          18: "AfRKClvdYk",
          19: "DNZX8XdJXV",
          20: "39o4YUyZTX",
          21: "5sb2HFpz5a",
          22: "pgXzCJZipE",
          23: "Oani8EAGI9",
          24: "IzCeh7d7vW",
          30: "9ALgxEyGXU",
          31: "lBzSdVGY8F",
          37: "mis9Mt4np4",
          38: "AfRKClvdYk",
          43: "AfRKClvdYk",
          46: "AfRKClvdYk",
          47: "21OybbiIdc",
          48: "AfRKClvdYk",
          49: "CMVoMvvEmu",
          50: "IoQrhRb3wU",
          52: "AfRKClvdYk",
          53: "AfRKClvdYk",
        };
        var W = ["AU", "CA", "IE", "NZ", "US", "GB"],
          H = [
            "AT",
            "BE",
            "DK",
            "FI",
            "FR",
            "DE",
            "JA",
            "NO",
            "NL",
            "SA",
            "ES",
            "SE",
            "CH",
            "AE",
            "IT",
          ],
          X = ["BR", "CL", "CZ", "HU", "PL", "PT", "RU", "SK", "TH"],
          K = [
            "AR",
            "BG",
            "CO",
            "EC",
            "GR",
            "IN",
            "MX",
            "PE",
            "PH",
            "RO",
            "TR",
            "UY",
          ];
        function J() {
          var e = s.Z.country;
          return "US" === e
            ? 1.5
            : W.includes(e)
            ? 0.5
            : H.includes(e)
            ? 0.15
            : X.includes(e)
            ? 0.08
            : K.includes(e)
            ? 0.03
            : 0.02;
        }
        function Y() {
          var e = new URL("https://api.poki.com/ads/houseads/video/vast"),
            t = (0, U.Z)("site_id");
          return (
            e.searchParams.append("game_id", s.Z.gameID),
            e.searchParams.append("site", t),
            e.href
          );
        }
        var $ = {
            v_k0treo: 2.5,
            v_qr1wxs: 7.5,
            v_9diccg: 19,
            v_13q0xkw: 0.25,
            v_dn33ls: 1,
            v_z07u2o: 1.5,
            v_1400iyo: 2.25,
            v_9w8kxs: 3,
            v_ufej9c: 3.5,
            v_10960ao: 4.25,
            v_1ksbym8: 4.75,
            v_1ag9340: 5.25,
            v_1tbhh4w: 5.75,
            v_jjcgzk: 6.5,
            v_brnu9s: 7,
            v_1wscef4: 7.75,
            v_q22xhc: 8.5,
            v_f8irk0: 9,
            v_1rik45c: 9.75,
            v_lxhyww: 10.5,
            v_a9z0u8: 11,
            v_1yhiww0: 11.75,
            v_10mwg74: 12.25,
            v_1ji4u80: 12.75,
            v_wm2c5c: 13.5,
            v_2na6tc: 14,
            v_1myzri8: 14.75,
            v_3pzm68: 6,
            v_16kerr4: 6.25,
            v_1mdrmkg: 6.75,
            v_1ga0k5c: 7.25,
            v_5iwz5s: 8,
            v_12tk934: 8.25,
            v_1hsybr4: 8.75,
            v_1cj61hc: 9.25,
            v_y3r5kw: 9.5,
            v_94ow0: 10,
            v_15woqgw: 10.25,
            v_1orx4hs: 10.75,
            v_1d4e6f4: 11.25,
            v_t57ev4: 11.5,
            v_783hmo: 12,
            v_m7hkao: 12.5,
            v_hmo9hc: 13,
            v_19djnr4: 13.25,
            v_1twpm2o: 13.75,
            v_17zlou8: 14.25,
            v_ign1mo: 14.5,
            v_ccvz7k: 15,
            v_1f7b4sg: 15.25,
            v_snq4g0: 15.5,
            v_5wnf28: 16,
            v_137aozk: 16.25,
            v_1j0njsw: 16.75,
            v_1b8yx34: 17.25,
            v_yhhlhc: 17.5,
            v_25swe8: 18,
            v_15081z4: 18.25,
            v_1pje0ao: 18.75,
            v_1eptudc: 19.25,
            v_1xl28e8: 19.75,
            v_gfliio: 21,
            v_3y3sao: 22,
            v_ixhuyo: 22.5,
            v_ro52io: 23.5,
            v_qa73ls: 24.5,
            v_emo5j4: 25,
            v_yq5fk: 26,
            v_aobxts: 27,
            v_6shmgw: 28,
            v_natgqo: 28.5,
            v_x0f94w: 29.5,
            v_d2hfr4: 31,
            v_dch14w: 33,
            v_1jyadc: 34,
            v_8p5tz4: 36,
            v_fwv9xc: 37,
            v_c60r9c: 39,
            v_58awow: 40,
            v_bbcow: 42,
            v_a0x534: 43,
            v_hdmdq8: 45,
            v_2e8b28: 46,
            v_5nljb4: 48,
            v_1wr0n4: 50,
            v_pam1og: 0.5,
            v_1ipf08w: 0.75,
            v_1axqdj4: 1.25,
            v_1qr38cg: 1.75,
            v_15ldds: 2,
            v_1q248w0: 2.75,
            v_1eelatc: 3.25,
            v_1x9tou8: 3.75,
            v_8iam0w: 4,
            v_nhooow: 4.5,
            v_fq01z4: 5,
            v_w0u77k: 5.5,
            v_1vi5a0w: 15.75,
            v_orvt34: 16.5,
            v_dybn5s: 17,
            v_1q8czr4: 17.75,
            v_l11af4: 18.5,
            v_uqn2tc: 19.5,
            v_7zkdfk: 20,
            v_o7a58g: 20.5,
            v_vezl6o: 21.5,
            v_b5t88w: 23,
            v_4x2d4w: 24,
            v_xhwjk0: 25.5,
            v_lhw3r4: 26.5,
            v_tjkbuo: 27.5,
            v_h72ebk: 29,
            v_31n3sw: 30,
            v_64rl6o: 32,
            v_9lmigw: 35,
            v_3fdjpc: 38,
            v_fapfcw: 41,
            v_7o0lc0: 44,
            v_clbdvk: 47,
            v_ee8qv4: 49,
          },
          ee = {
            "11s3rwg": 2.49,
            "1uhxr0g": 2.87,
            qr1wxs: 7.5,
            "15xxon4": 0.01,
            o6no5c: 0.02,
            fb0nwg: 0.04,
            "1etkow0": 0.05,
            x2aoe8: 0.06,
            "1wkupds": 0.07,
            "11i46io": 0.09,
            jqu60w: 0.1,
            "1j9e70g": 0.11,
            "1adr6rk": 0.13,
            smh69s: 0.14,
            "1s5179c": 0.15,
            "8naeps": 0.16,
            qekf7k: 0.18,
            "1px4g74": 0.19,
            hixeyo: 0.2,
            za7fgg: 0.22,
            "1ysrgg0": 0.23,
            lyqx34: 0.26,
            "16hwveo": 1.13,
            "1fdjvnk": 1.17,
            "2jjcao": 1.2,
            "1jtdds0": 1.23,
            t6gd1c: 1.26,
            "65e29s": 1.28,
            "1nf83r4": 1.31,
            wsb30g: 1.34,
            jgukn4: 1.38,
            al7ke8: 1.4,
            "1a3rlds": 1.41,
            "8datc0": 1.44,
            "1pn4utc": 1.47,
            z07u2o: 1.5,
            "13g1c74": 1.53,
            ct4bgg: 1.56,
            ukeby8: 1.58,
            mspp8g: 1.62,
            "1dfmpz4": 1.65,
            lm6m8: 1.68,
            icw740: 1.7,
            "18zt7uo": 1.73,
            "79cfsw": 1.76,
            "1oj6ha8": 1.79,
            "1xethj4": 1.83,
            "12c2yo0": 1.85,
            bp5xxc: 1.88,
            "1syzzeo": 1.91,
            ncow00: 1.94,
            "1dzlwqo": 1.97,
            "15ldds": 2,
            "10o5edc": 2.009999,
            a18dmo: 2.04,
            "1rb2f40": 2.069999,
            pkln28: 2.1,
            "1g7insw": 2.13,
            "12w25fk": 2.17,
            c954ow: 2.2,
            "1brp5og": 2.21,
            "1400iyo": 2.25,
            v4dips: 2.3,
            hsx0cg: 2.34,
            "18fu134": 2.37,
            "167xa0w": 2.41,
            "1f3ka9s": 2.45,
            "1d5n4lc": 1.01,
            "1uwx534": 1.03,
            bml8g: 1.04,
            i2wlq8: 1.06,
            "979lhc": 1.08,
            "18ptmgw": 1.09,
            "1qh3myo": 1.11,
            "6zcuf4": 1.12,
            oqmuww: 1.14,
            fuzuo0: 1.16,
            xm9v5s: 1.18,
            "1x4tw5c": 1.19,
            "1223da8": 1.21,
            katcsg: 1.22,
            bf6cjk: 1.24,
            "1axqdj4": 1.25,
            "1sp0e0w": 1.27,
            "15ny39c": 1.29,
            nwo2rk: 1.3,
            f112io: 1.32,
            "1ejl3i8": 1.33,
            "1pkk5c": 1.36,
            "1184l4w": 1.37,
            "1izelmo": 1.39,
            schkw0: 1.42,
            "1rv1lvk": 1.43,
            "17vuubk": 1.45,
            q4ktts: 1.46,
            h8xtkw: 1.48,
            "1yirv28": 1.51,
            "3xhb7k": 1.52,
            lorbpc: 1.54,
            "1l7bcow": 1.55,
            "1cbocg0": 1.57,
            "1u2ycxs": 1.59,
            "51foqo": 1.6,
            "14jzpq8": 1.61,
            "1mb9q80": 1.63,
            dx2ozk: 1.64,
            vocphc: 1.66,
            "1v6wqgw": 1.67,
            "10467ls": 1.69,
            "1hvg83k": 1.71,
            "9h96v4": 1.72,
            r8j7cw: 1.74,
            "1qr38cg": 1.75,
            "16rwgsg": 1.77,
            p0mgao: 1.78,
            g4zg1s: 1.8,
            "1fnjh1c": 1.81,
            xw9gjk: 1.82,
            "2tixog": 1.84,
            kksy68: 1.86,
            "1k3cz5s": 1.87,
            "1b7pyww": 1.89,
            tgfyf4: 1.9,
            "5levi8": 1.92,
            "153ywhs": 1.93,
            "1mv8wzk": 1.95,
            eh1vr4: 1.96,
            w8bw8w: 1.98,
            iwvdvk: 2.02,
            "1iffev4": 2.029999,
            "19jsem8": 2.049999,
            rsie4g: 2.06,
            "7tbmkg": 2.08,
            "17bvnk0": 2.089999,
            "1p35o1s": 2.11,
            goymtc: 2.12,
            "1xysoao": 2.15,
            "3di4g0": 2.16,
            l4s4xs: 2.18,
            "1knc5xc": 2.19,
            u0f56o: 2.22,
            "1tiz668": 2.23,
            "4hghz4": 2.24,
            m8qigw: 2.26,
            dd3i80: 2.28,
            "1cvnj7k": 2.29,
            "1umxjpc": 2.31,
            "1mzuo": 2.32,
            zk70u8: 2.33,
            "1hbh1c0": 2.35,
            "8xa03k": 2.36,
            qok0lc: 2.38,
            "1q741kw": 2.39,
            "6pd91c": 2.4,
            ogn9j4: 2.42,
            "1wuuark": 2.47,
            k0treo: 2.5,
            "1jjdse8": 2.51,
            swgrnk: 2.54,
            "162xhc0": 2.57,
            fg0glc: 2.6,
            l11af4: 18.5,
            "9diccg": 19,
            "7zkdfk": 20,
            gfliio: 21,
            b5t88w: 23,
            "4x2d4w": 24,
            emo5j4: 25,
            aobxts: 27,
            "6shmgw": 28,
            "31n3sw": 30,
            "64rl6o": 32,
            dch14w: 33,
            "9lmigw": 35,
            "1yv9csg": 5.35,
            o42yo: 6.8,
            q22xhc: 8.5,
            d2hfr4: 31,
            "1np7p4w": 0.03,
            "1zk5j4": 0.08,
            av75s0: 0.12,
            "185ufpc": 0.17,
            "1h1hfy8": 0.21,
            "47gwlc": 0.24,
            d33wu8: 0.28,
            uudxc0: 0.3,
            "14tzb40": 0.33,
            e72adc: 0.36,
            "1vgwbuo": 0.39,
            "10e5szk": 0.41,
            "1i5fthc": 0.43,
            "1r12tq8": 0.47,
            pam1og: 0.5,
            gez1fk: 0.52,
            "1xot2ww": 0.55,
            kusjk0: 0.58,
            bz5jb4: 0.6,
            tqfjsw: 0.62,
            "5vegw0": 0.64,
            "1n58idc": 0.67,
            wibhmo: 0.7,
            "1fkyrk": 0.72,
            "1ipf08w": 0.75,
            s2hzi8: 0.78,
            pul8g0: 0.82,
            "1ghi96o": 0.85,
            "3nhpts": 0.88,
            lerqbk: 0.9,
            uaeqkg: 0.94,
            "14a04cg": 0.97,
            dn33ls: 1,
            ved43k: 1.02,
            zu6m80: 1.05,
            "1hlgmps": 1.07,
            qyjlz4: 1.1,
            "1lhay2o": 0.27,
            "1clnxts": 0.29,
            "1ucxybk": 0.31,
            "5bfa4g": 0.32,
            n2pam8: 0.34,
            "1ml9bls": 0.35,
            "1dpmbcw": 0.37,
            vycav4: 0.38,
            vls00: 0.4,
            imvshs: 0.42,
            "9r8s8w": 0.44,
            "199st8g": 0.45,
            "7jc16o": 0.48,
            "171w268": 0.49,
            "1ot62o0": 0.51,
            "1fxj2f4": 0.53,
            y691xc: 0.54,
            "33ij28": 0.56,
            "12m2k1s": 0.57,
            "1kdckjk": 0.59,
            "1t8zksg": 0.63,
            "15dyhvk": 0.65,
            nmohds: 0.66,
            er1h4w: 0.68,
            "1e9li4g": 0.69,
            "1w0vim8": 0.71,
            "10y4zr4": 0.73,
            j6uz9c: 0.74,
            ab7z0g: 0.76,
            "19ts000": 0.77,
            "1rl20hs": 0.79,
            "83b7y8": 0.8,
            "17lv8xs": 0.81,
            "1pd59fk": 0.83,
            gyy874: 0.84,
            yq88ow: 0.86,
            "1y8s9og": 0.87,
            "1361qtc": 0.89,
            "1kxbrb4": 0.91,
            "1c1or28": 0.93,
            "1tsyrk0": 0.95,
            "4rg3cw": 0.96,
            miq3uo: 0.98,
            "1m1a4u8": 0.99,
            "11x3klc": 5.05,
            "1nrplhc": 5.15,
            "1ag9340": 5.25,
            qh2bk0: 5.3,
            "14wh7gg": 5.45,
            w0u77k: 5.5,
            "7ltxj4": 5.6,
            kxafwg: 5.7,
            "1tbhh4w": 5.75,
            "110mw3k": 5.85,
            "1pfn5s0": 5.95,
            "3pzm68": 6,
            ml8074: 6.1,
            "1uzf1fk": 6.15,
            "16kerr4": 6.25,
            "1jvva4g": 6.35,
            "67vym8": 6.4,
            jjcgzk: 6.5,
            hbfpxc: 6.6,
            "13ij8jk": 6.65,
            "1mdrmkg": 6.75,
            p34cn4: 6.9,
            "1xhbdvk": 6.95,
            "1ihxb7k": 7.15,
            "1ga0k5c": 7.25,
            dflekg: 7.4,
            "1o1p6v4": 7.55,
            "2c1n9c": 7.6,
            "1wscef4": 7.75,
            zhp4hs: 7.9,
            "5iwz5s": 8,
            f8irk0: 9,
            y3r5kw: 9.5,
            lxhyww: 10.5,
            a9z0u8: 11,
            "783hmo": 12,
            m7hkao: 12.5,
            wm2c5c: 13.5,
            "2na6tc": 14,
            ign1mo: 14.5,
            snq4g0: 15.5,
            "5wnf28": 16,
            dybn5s: 17,
            yhhlhc: 17.5,
            testbid: 0,
            "1nz7aio": 2.43,
            xca9s0: 2.46,
            b56r5s: 2.52,
            obngu8: 2.58,
            "24jy80": 2.64,
            "1jedzpc": 2.67,
            "18au8e8": 2.73,
            hnx7nk: 2.76,
            "13v0q9s": 2.81,
            "10lkow": 2.96,
            "156gsu8": 7.05,
            "1tlh2io": 7.35,
            "1aq8ohs": 7.65,
            "1losn40": 7.95,
            "1sf0sn4": 2.55,
            "1eykhkw": 2.61,
            srgyyo: 2.7,
            "1yxr94w": 2.79,
            d83pj4: 2.84,
            n7p3b4: 2.9,
            "1dum41s": 2.93,
            "1iafm68": 2.99,
            "7vtiww": 7.2,
            b2outc: 7.8,
            "13q0xkw": 0.25,
            riisqo: 0.46,
            "1bhpkao": 0.61,
            cj4q2o: 0.92,
            "1o96vwg": 1.15,
            "1wav400": 1.35,
            "1grhukg": 1.49,
            "1vqvx8g": 1.99,
            yg8nb4: 2.14,
            "1lrajgg": 2.27,
            fl09a8: 2.44,
            "1h6h8n4": 2.77,
            "1m69xj4": 3.55,
            rdj01s: 4.3,
            "29jqww": 2.48,
            "1anqs5c": 2.53,
            "6kdgcg": 2.56,
            "1nu7hts": 2.59,
            "1wpui2o": 2.63,
            jvtyps: 2.66,
            "1sa0zy8": 2.71,
            "1q248w0": 2.75,
            "4cgpa8": 2.8,
            "1cqnqio": 2.85,
            "5gf2tc": 2.88,
            ec2328: 2.92,
            "1vlw4jk": 2.95,
            "9w8kxs": 3,
            "176vuv4": 3.05,
            "1kicd8g": 3.15,
            jbury8: 3.3,
            h3y0w0: 3.4,
            gmdxc: 3.6,
            ovmnls: 3.7,
            "15sxvy8": 3.85,
            "1j4eebk": 3.95,
            "1gwhn9c": 4.05,
            e22hog: 4.2,
            "1oo69z4": 4.35,
            nhooow: 4.5,
            "17gvg8w": 4.65,
            "1ksbym8": 4.75,
            hxwt1c: 4.9,
            t1gkcg: 5.1,
            "2221vk": 5.2,
            d5lt6o: 5.4,
            "1i7xpts": 5.55,
            "1g00yrk": 5.65,
            etjdhc: 5.8,
            s4zvuo: 5.9,
            "1c46neo": 6.05,
            "99rhts": 6.2,
            xorri8: 6.3,
            "1em2zuo": 6.45,
            "1rxji80": 6.55,
            umw8ao: 6.7,
            "192b474": 6.85,
            brnu9s: 7,
            x7ah34: 2.62,
            "11n3z7k": 2.65,
            b06ygw: 2.68,
            "1aiqzgg": 2.69,
            "8sa7eo": 2.72,
            qjk7wg: 2.74,
            zf785c: 2.78,
            m3qps0: 2.82,
            "1lmaqrk": 2.83,
            uzdq0w: 2.86,
            "14yz3sw": 2.89,
            "1mq94ao": 2.91,
            w3c3k0: 2.94,
            "10j5log": 2.97,
            irvl6o: 2.98,
            yb8um8: 3.1,
            "60e9kw": 3.2,
            "1eelatc": 3.25,
            "1rq1t6o": 3.35,
            "13b1ji8": 3.45,
            ufej9c: 3.5,
            "18utf5s": 3.65,
            "1x9tou8": 3.75,
            bk658g: 3.8,
            wxavpc: 3.9,
            "8iam0w": 4,
            ltr4e8: 4.099999,
            "1u7y5mo": 4.15,
            "10960ao": 4.25,
            "2yiqdc": 4.4,
            "1bcprls": 4.45,
            "1vvvpxc": 4.55,
            a686bk: 4.6,
            yl8g00: 4.7,
            "4mgao0": 4.8,
            "1d0nbwg": 4.85,
            "1qc3u9s": 4.95,
            fq01z4: 5,
            watslc: 7.1,
            l7a1a8: 7.3,
            zmox6o: 7.45,
            oe5d6o: 7.7,
            "18dc4qo": 7.85,
            "94ow0": 10,
            t57ev4: 11.5,
            hmo9hc: 13,
            ccvz7k: 15,
            orvt34: 16.5,
            "25swe8": 18,
            uqn2tc: 19.5,
            "3y3sao": 22,
            yq5fk: 26,
            h72ebk: 29,
            "1jyadc": 34,
            testBid: 50,
          },
          te = {
            hgfim8: "Amazon - DistrictM",
            qc2iv4: "Amazon - Magnite",
            "183cjcw": "Amazon - AppNexus",
            "8ksidc": "Amazon - OpenX",
            "1s2jaww": "Amazon - PubMatic",
            "1pumjuo": "Amazon - EMX",
            "12jknpc": "Amazon - Conversant UAM",
            "1kauo74": "Amazon - Amobee DSP",
            "15bglj4": "Amazon - PubMatic UAM APAC",
            "5swkjk": "Amazon - PubMatic UAM EU",
            "1d32f4": "Amazon - Simpli.fi",
            ksan7k: "Amazon - Index Exchange",
            urw0zk: "Amazon - Smaato",
            "1dn4f0g": "Amazon - AdGeneration",
            vvueio: "Amazon - DMX",
            "1veefi8": "Amazon - Yieldmo",
            "1i2xx4w": "Amazon - Yahoo Japan",
            rg0we8: "Amazon - UnrulyX_SSP_APS",
            y3r5kw: "Amazon - Verizon Media Group",
            "1xmb6kg": "Amazon - GumGum UAM",
            "1t6hog0": "Amazon - Acuity",
            "1n2qm0w": "Amazon - Sharethrough",
            j4d2ww: "Amazon - EMX UAM",
            "1imx3wg": "Amazon - LoopMe_UAM",
            z7pj40: "Amazon - Pulsepoint",
            p845c0: "Amazon - SmartRTB+",
          };
        var ne = {
            skyscraper: {
              1: "eexq7SUa6daeQrPF6q1CaKZ0",
              10: "SSZzGHt3d4BrOdVUug1ypxji",
              11: "OXc0ZJDJIcRgGcIta8mTUQSZ",
              12: "ulACVGPjP002tSfhDGRApuub",
              13: "c7FldnCsd9Mtcr7PgBFGKWEQ",
              14: "KJouWQMjZwvE8fxw4mAvGopZ",
              15: "ilNkOqBMO6EGbQwrZtCMHzeJ",
              16: "Kg24ec1AyTvzJ6I3Cji8lqzx",
              17: "iqvpcyepSMCVCsJfKu4JQGwr",
              18: "es9ztDrPZDW883VHbK2gUfkQ",
              19: "pvXQE41GXKGsW5Li0OSQavwT",
              20: "MCy638sYvzVbsrvcPau6lABN",
              21: "NkJeV6CuMlt41iJWcgnmMSDN",
              22: "fjKznUvVWlp6TBxuSsEkQF8H",
              23: "5tJM2ZFmNf7gii6KVS6msGc4",
              24: "xZUYMFw1zGuRzFd6DRl88Pwk",
              3: "xNmhWWy88VtzOGfderrtgDBb",
              30: "KO0gUA5iJIsleK9a941H0pW1",
              31: "wo0KU1WR11jNFxoy121ciQj8",
              37: "areVtONg11YNRQin7R2sveKy",
              47: "uzLaOEe8yqB9eWZuxdnwyawr",
              49: "ZYaqiQw00NSTBGJ4HacifENM",
              5: "qe5Tc3N2MO3daALoTdIaTmSA",
              50: "NZv1ui2F1tlQ6PQQi7umnFht",
              6: "xbx8OLCAgjm0igkmFIBw8n6E",
              8: "4vYDfNOQagnuwg9REGNWGv83",
            },
            rectangle: {
              1: "Ka3KvQx9svu71CJoRtZlwFY9",
              10: "9o5dMBQZX9bi2OsvTpc5j0pO",
              11: "gwL6nB1Twy25gpWQyEP2cVMJ",
              12: "yYUjIY5L6w2ukD5FxCIVydgG",
              13: "PoqRXAEYHKTdqNY22lIFTXRp",
              14: "eAudypoJLJEtFZz3zzvKYoAu",
              15: "4b416MUjJEdZm5nDKwvn2ELO",
              16: "H6jadzxgw0uRVRHHadZ19Zvp",
              17: "5zG8Ioh6paBscdCgUQTQE0eu",
              18: "OgMX0PlDPabF3BHOgxDbeH2n",
              19: "uzK7eCjSVYDp4KvJEg6mC59r",
              20: "yapIY909O3cgcD8QDAEehtkb",
              21: "8KT1bEUCcvASfq0LXWN2nVe0",
              22: "3LKyDpL1Xt7YactKFGxFpJO7",
              23: "GMaOiZl6YeMzYckusbO4Cdh1",
              24: "5iZnMqviynz6ndlaikqhMy73",
              3: "lcpgaTLqkd6gRi8AVtVr0gLe",
              30: "xWGhFW6bvMf9LuGYqQOhoD2h",
              31: "GqMz69ka237zrG4H8bpMuYTy",
              37: "lYrk2xnelCQrhwmO43AtjErF",
              47: "PDA12fEHtYIVr6A12fZ86JQH",
              49: "RYn9wxADCbBgKeo8Lyxx1ZHE",
              5: "N3wOmgPMiK6RaGNYjeqOzuHU",
              50: "KwEXqYIZG8fOlJyePKTBiJFs",
              6: "fJMv7XtKbfsRbzkO42fkS3Dr",
              8: "915o8cwxF5rzfQsA1Op6hhQV",
            },
            leaderboard: {
              16: "ZPwouCq7eD5kRnZjX5ct8ZIT",
              1: "sysnuL1RKPIEL98w2l6lPc1w",
              31: "FgHUFCWMZCCJaHKMF0LyIgSI",
              23: "eyGVQGQkrHwJRcLoBzepUHW2",
              14: "PeRnr3pCNPpCgJAOF3yuQCGg",
              37: "5DXFSCYcaAxAXBuZVpTHAx59",
              30: "MpHDUxZ178U65yD3l878z5m1",
              47: "oYQGytr0CbDDQqIooggCsNTO",
              18: "na3uJK58s0vgb7NyaPR6R5P8",
              50: "m3hskIBrmloAWHD7i27q2ZPN",
              3: "PIsUL8EJvXXA1thcFkCPWdhi",
              19: "cluKVL1thRZlb3bsK7oVadOZ",
              20: "8PPLwmi2mra9HNTdhftQOcC4",
              8: "cCQE4L5S1j9BmKeywuonM6hM",
              11: "uvkuS4QYv01YvuGoJvqa9xnz",
              12: "GyG0XHcaahKmsXbcjDlgtjCQ",
              17: "0ut5aHlZRj5dNfTKo9bM8nXj",
              10: "TzMO5iGdP4vt7BIOAQ2e3kpU",
              49: "f1vArQjoEfX9QdjK2TvBjnDv",
              22: "92kdBH3AxvPr1pqZ1h1TYkjN",
              13: "Y6Tl87JTAn9T1B8rq523UDeH",
              15: "B3HlKKIdq8mGyoMGkjT4m9RD",
              24: "nfS0DrtZtJ6eZVNqsWqyVVFS",
              5: "gr33qXeArxdqi0Sk4i50TmE3",
              6: "ACn0XyU2KP2l94N0HMf1vhlu",
              21: "o2PQGGTxXO92in2mASt624tn",
            },
            mobile_leaderboard: {
              16: "5X98AYdO2OAIb2m6ThLjCGR5",
              1: "nVDrFwfkiRg5Tb426duBnat4",
              31: "H8tpygATsgJwk7qJzh612B0I",
              23: "07iMij2dOIgPHzM7JFv5fYBN",
              14: "XCQLWETuRkKmiN9jCOu01NOp",
              37: "419OVNbGzLJn7wlh5jAiUFLA",
              30: "ErE9N4WozhjbawA6HFN2hC0V",
              47: "4aBsJtSPEivB07hrlV6nTgj7",
              18: "waksL4h4X7gn2TU88OgeZHHl",
              50: "Wi3BRMWcCUdKZO7leMhtCfdp",
              3: "KQ3P2qVndkjlesGkzM5Rknma",
              19: "OCsZIZrTXKyprJ8AKiI7e0Jl",
              20: "h2aMA8KeZ3tHtfRgwT2xCHUJ",
              8: "igvEPDF1ft8FBFQ2aVhCS0BG",
              11: "I1ZnJzEjRg75BZikcGMWxMTF",
              12: "ZrnW76G2qvB5pZx8VvOanqQQ",
              17: "B4f8YQfcg3WWl5k9pAnqVCfm",
              10: "cfNKknbTZxcxhNZCV2fWr4Ne",
              49: "ziBY1mSHWj9UTGcq9Tbzo5J4",
              22: "ImlLSALVeaqvi7y2e6qdBDkw",
              13: "NUx9OmJMlzbkv39hUX5FOnXv",
              15: "RxDq1opgeO5VXEQRPtdESHaX",
              24: "aswJxUjNpHyiEunaOUBGbajK",
              5: "1M1EIJhXdwEoJ8utYTDjj0DD",
              6: "gExvCBm9TEaw4jV6kRzEuDxq",
              21: "wNOOjIhadhe2s1jgq3LppWm0",
            },
            billboard: {
              16: "dr2IuY7Yb8POz9tbezoJUFey",
              1: "WhhFn8GL9nBEK2z9psbtD1SV",
              31: "JNfSIPKKAkfNgzkg3hrGlGEV",
              23: "xvsrS9J4xrRGjlus3pKkIatI",
              14: "4BL4a74RRMoiRu9D8jKAfdij",
              37: "f8B8j7tjb1YA6lAcnHSRBlfI",
              30: "vW1ODUqFt2jDk5laYsVh9PIF",
              47: "R7GldiHZEWYFwdJq936YnbZW",
              18: "83noJ3tAhRyFWDlS1iXKuRGa",
              50: "WNu1woAb2OHf3KncItSAnYnm",
              3: "Ydwhf5DPoJBinldgPdkD9okm",
              19: "3X7dNFFm484Xx6aD6nBF0k43",
              20: "qzLmNwSljh25A7s9HXQYVYtr",
              8: "tXWpZaKO291ytd8kfiy3NWlz",
              11: "0ePnxLUMZ8tKBxImFp2i1J4g",
              12: "Y1HuzbhxRv1UmUhd8dUtONQI",
              17: "lqSabVDWqYWy8jpJH57BK1vS",
              10: "zVEWUpJuNfEipDrTPGwniMP3",
              49: "B2srINo0hBkijyowlq4FQk7c",
              22: "Ljcylng1YDm5yAqEpiomGazZ",
              13: "hYTGyFgCiCUVtNOx56TkKexo",
              15: "5xkx65Y9eEhPen8gqIuOFQRZ",
              24: "ZH3Odxmz8QF49ZoZ16mPs08T",
              5: "Ax2noHPv7iRdW6DM26NxmtFT",
              6: "mZEu6Z0wDTq4UAHQoyUosm5y",
              21: "7bAgpwCip0dSf6bJXgBO6nY1",
            },
          },
          ie = [];
        function oe(e, t) {
          var n, i, o;
          return (null ===
            (i =
              null === (n = null == t ? void 0 : t.meta) || void 0 === n
                ? void 0
                : n.advertiserDomains) || void 0 === i
            ? void 0
            : i.length) > 0 &&
            (null === (o = null == t ? void 0 : t.meta) || void 0 === o
              ? void 0
              : o.advertiserDomains.find(function (e) {
                  return (function (e) {
                    return (
                      ie.includes(e) ||
                      ie.includes("www.".concat(e)) ||
                      e.includes("game")
                    );
                  })(e);
                }))
            ? (console.warn("Blocked ad: ", t), 0)
            : e;
        }
        var re = function () {
            var e;
            return (
              (null === (e = Object.keys(window.pbjs)) || void 0 === e
                ? void 0
                : e.length) > 1
            );
          },
          ae = function () {
            return (
              (ae =
                Object.assign ||
                function (e) {
                  for (var t, n = 1, i = arguments.length; n < i; n++)
                    for (var o in (t = arguments[n]))
                      Object.prototype.hasOwnProperty.call(t, o) &&
                        (e[o] = t[o]);
                  return e;
                }),
              ae.apply(this, arguments)
            );
          },
          se = function (e, t, n) {
            if (n || 2 === arguments.length)
              for (var i, o = 0, r = t.length; o < r; o++)
                (!i && o in t) ||
                  (i || (i = Array.prototype.slice.call(t, 0, o)),
                  (i[o] = t[o]));
            return e.concat(i || Array.prototype.slice.call(t));
          },
          de = "rewarded",
          ce = "video",
          le = {
            "728x90": "/"
              .concat(R, "/")
              .concat(s.Z.device, "_ingame_728x90/")
              .concat(s.Z.siteID, "_")
              .concat(s.Z.device, "_ingame_728x90"),
            "300x250": "/"
              .concat(R, "/")
              .concat(s.Z.device, "_ingame_300x250/")
              .concat(s.Z.siteID, "_")
              .concat(s.Z.device, "_ingame_300x250"),
            "970x250": "/"
              .concat(R, "/")
              .concat(s.Z.device, "_ingame_970x250/")
              .concat(s.Z.siteID, "_")
              .concat(s.Z.device, "_ingame_970x250"),
            "160x600": "/"
              .concat(R, "/")
              .concat(s.Z.device, "_ingame_160x600/")
              .concat(s.Z.siteID, "_")
              .concat(s.Z.device, "_ingame_160x600"),
            "320x50": "/"
              .concat(R, "/")
              .concat(s.Z.device, "_ingame_320x50/")
              .concat(s.Z.siteID, "_")
              .concat(s.Z.device, "_ingame_320x50"),
            "728x90_external": "/"
              .concat(R, "/external_")
              .concat(s.Z.device, "_display_ingame/external_")
              .concat(s.Z.device, "_ingame_728x90"),
            "300x250_external": "/"
              .concat(R, "/external_")
              .concat(s.Z.device, "_display_ingame/external_")
              .concat(s.Z.device, "_ingame_300x250"),
            "970x250_external": "/"
              .concat(R, "/external_")
              .concat(s.Z.device, "_display_ingame/external_")
              .concat(s.Z.device, "_ingame_970x250"),
            "160x600_external": "/"
              .concat(R, "/external_")
              .concat(s.Z.device, "_display_ingame/external_")
              .concat(s.Z.device, "_ingame_160x600"),
            "320x50_external": "/"
              .concat(R, "/external_")
              .concat(s.Z.device, "_display_ingame/external_")
              .concat(s.Z.device, "_ingame_320x50"),
          },
          Ae = !1,
          ue = function (e, t) {
            if (re()) {
              Ae = !0;
              var n = ["US", "CA", "AU"],
                i = function (e) {
                  var t =
                      V() || (0, D.Z)() || (0, j.Z)()
                        ? ["video/mp4", "application/javascript"]
                        : [
                            "video/mp4",
                            "video/webm",
                            "video/ogg",
                            "application/javascript",
                          ],
                    n = ae(
                      ae(
                        {
                          mimes: t,
                          minduration: 0,
                          maxduration: 15,
                          protocols: [2, 3, 5, 6, 7, 8, 11, 12, 13, 14],
                          w: 640,
                          h: 480,
                          placement: 1,
                          linearity: 1,
                        },
                        e ? {} : { skip: 1, skipafter: 5 }
                      ),
                      { boxingallowed: 1, pos: 1, api: [2, 7, 8] }
                    ),
                    i = "";
                  e && "desktop" === s.Z.device
                    ? (i = "4725015@640x360")
                    : e && "desktop" !== s.Z.device
                    ? (i = "4725013@640x360")
                    : e || "desktop" !== s.Z.device
                    ? e || "desktop" === s.Z.device || (i = "4725011@640x360")
                    : (i = "4725008@640x360");
                  var o;
                  return {
                    bids: [
                      {
                        bidder: "appnexus",
                        params: {
                          placementId: e ? 13184309 : 13184250,
                          supplyType: "web",
                        },
                      },
                      {
                        bidder: "openx",
                        params: {
                          delDomain: "poki-d.openx.net",
                          unit: "540105196",
                        },
                      },
                      {
                        bidder: "spotx",
                        params: {
                          channel_id: "265590",
                          ad_unit: "instream",
                          secure: !0,
                          hide_skin: !0,
                        },
                      },
                      { bidder: "ix", params: { siteId: "436284", video: {} } },
                      {
                        bidder: "richaudience",
                        params: {
                          pid: ((o = s.Z.siteID), F[o] || "MP_gIE1VDieUi"),
                          supplyType: "site",
                        },
                      },
                      {
                        bidder: "onetag",
                        params: { pubId: "6da09f566a9dc06" },
                      },
                      {
                        bidder: "rubicon",
                        params: {
                          accountId: "18608",
                          siteId: "266914",
                          zoneId: "1322034",
                          position: "atf",
                          video: { size_id: 204 },
                        },
                      },
                      {
                        bidder: "pubmatic",
                        params: { publisherId: "156838", adSlot: i },
                      },
                      {
                        bidder: "sharethrough",
                        params: { pkey: "vRjLnZDA86biUVrjIKVGxq3x" },
                      },
                      {
                        bidder: "triplelift",
                        params: {
                          inventoryCode: "Poki_Instream_Prebid",
                          video: ae({}, n),
                        },
                      },
                    ],
                    mediaTypes: {
                      video: ae(
                        { context: "instream", playerSize: [640, 480] },
                        n
                      ),
                    },
                  };
                },
                o = i(!0),
                r = i(!1),
                a = [
                  {
                    code: ce,
                    mediaTypes: r.mediaTypes,
                    bids: se([], r.bids, !0),
                  },
                  {
                    code: de,
                    mediaTypes: o.mediaTypes,
                    bids: se([], o.bids, !0),
                  },
                  {
                    code: le["728x90"],
                    mediaTypes: { banner: { sizes: [[728, 90]] } },
                    bids: se(
                      se(
                        [
                          {
                            bidder: "appnexus",
                            params: { placementId: "12940427" },
                          },
                          {
                            bidder: "openx",
                            params: {
                              unit: "539859872",
                              delDomain: "poki-d.openx.net",
                            },
                          },
                          {
                            bidder: "ix",
                            params: { siteId: "268177", size: [728, 90] },
                          },
                          {
                            bidder: "pubmatic",
                            params: {
                              publisherId: "156838",
                              adSlot: "1374895@728x90",
                            },
                          },
                          {
                            bidder: "rubicon",
                            params: {
                              accountId: "18608",
                              siteId: "204596",
                              zoneId: "1008080",
                            },
                          },
                          {
                            bidder: "onetag",
                            params: { pubId: "6da09f566a9dc06" },
                          },
                          {
                            bidder: "richaudience",
                            params: { pid: "1V6a2fgLvX", supplyType: "site" },
                          },
                        ],
                        n.includes(s.Z.country)
                          ? [
                              {
                                bidder: "33across",
                                params: {
                                  siteId: "aRJKVCig8r7ikZaKj0P0Le",
                                  productId: "siab",
                                },
                              },
                            ]
                          : [],
                        !0
                      ),
                      [
                        {
                          bidder: "sharethrough",
                          params: {
                            pkey:
                              ne.leaderboard[s.Z.siteID] || ne.leaderboard[3],
                          },
                        },
                        {
                          bidder: "triplelift",
                          params: { inventoryCode: "Poki_728x90_Prebid" },
                        },
                      ],
                      !1
                    ),
                  },
                  {
                    code: le["300x250"],
                    mediaTypes: { banner: { sizes: [[300, 250]] } },
                    bids: se(
                      se(
                        [
                          {
                            bidder: "appnexus",
                            params: { placementId: "12935252" },
                          },
                          {
                            bidder: "openx",
                            params: {
                              unit: "539859873",
                              delDomain: "poki-d.openx.net",
                            },
                          },
                          {
                            bidder: "ix",
                            params: { siteId: "268178", size: [300, 250] },
                          },
                          {
                            bidder: "pubmatic",
                            params: {
                              publisherId: "156838",
                              adSlot: "1374896@300x250",
                            },
                          },
                          {
                            bidder: "rubicon",
                            params: {
                              accountId: "18608",
                              siteId: "204596",
                              zoneId: "1008080",
                            },
                          },
                          {
                            bidder: "onetag",
                            params: { pubId: "6da09f566a9dc06" },
                          },
                          {
                            bidder: "richaudience",
                            params: { pid: "pKqNt5LyvF", supplyType: "site" },
                          },
                        ],
                        n.includes(s.Z.country)
                          ? [
                              {
                                bidder: "33across",
                                params: {
                                  siteId: "aRJKVCig8r7ikZaKj0P0Le",
                                  productId: "siab",
                                },
                              },
                            ]
                          : [],
                        !0
                      ),
                      [
                        {
                          bidder: "sharethrough",
                          params: {
                            pkey: ne.skyscraper[s.Z.siteID] || ne.skyscraper[3],
                          },
                        },
                        {
                          bidder: "triplelift",
                          params: { inventoryCode: "Poki_300x250_Prebid" },
                        },
                      ],
                      !1
                    ),
                  },
                  {
                    code: le["970x250"],
                    mediaTypes: { banner: { sizes: [[970, 250]] } },
                    bids: se(
                      se(
                        [
                          {
                            bidder: "appnexus",
                            params: { placementId: "20595278" },
                          },
                          {
                            bidder: "openx",
                            params: {
                              unit: "543540497",
                              delDomain: "poki-d.openx.net",
                            },
                          },
                          {
                            bidder: "ix",
                            params: { siteId: "597527", size: [970, 250] },
                          },
                          {
                            bidder: "pubmatic",
                            params: {
                              publisherId: "156838",
                              adSlot: "3344351@970x250",
                            },
                          },
                          {
                            bidder: "onetag",
                            params: { pubId: "6da09f566a9dc06" },
                          },
                          {
                            bidder: "richaudience",
                            params: { pid: "yYyae7vnIh", supplyType: "site" },
                          },
                        ],
                        n.includes(s.Z.country)
                          ? [
                              {
                                bidder: "33across",
                                params: {
                                  siteId: "aRJKVCig8r7ikZaKj0P0Le",
                                  productId: "siab",
                                },
                              },
                            ]
                          : [],
                        !0
                      ),
                      [
                        {
                          bidder: "sharethrough",
                          params: {
                            pkey: ne.rectangle[s.Z.siteID] || ne.rectangle[3],
                          },
                        },
                        {
                          bidder: "triplelift",
                          params: { inventoryCode: "Poki_970x250_Prebid" },
                        },
                      ],
                      !1
                    ),
                  },
                  {
                    code: le["160x600"],
                    mediaTypes: { banner: { sizes: [[160, 600]] } },
                    bids: se(
                      se(
                        [
                          {
                            bidder: "appnexus",
                            params: { placementId: "12940425" },
                          },
                          {
                            bidder: "openx",
                            params: {
                              unit: "539859871",
                              delDomain: "poki-d.openx.net",
                            },
                          },
                          {
                            bidder: "ix",
                            params: { siteId: "268175", size: [160, 600] },
                          },
                          {
                            bidder: "pubmatic",
                            params: {
                              publisherId: "156838",
                              adSlot: "1374893@160x600",
                            },
                          },
                          {
                            bidder: "rubicon",
                            params: {
                              accountId: "18608",
                              siteId: "204596",
                              zoneId: "1008080",
                            },
                          },
                          {
                            bidder: "onetag",
                            params: { pubId: "6da09f566a9dc06" },
                          },
                          {
                            bidder: "richaudience",
                            params: { pid: "rAEnPimPzC", supplyType: "site" },
                          },
                        ],
                        n.includes(s.Z.country)
                          ? [
                              {
                                bidder: "33across",
                                params: {
                                  siteId: "aRJKVCig8r7ikZaKj0P0Le",
                                  productId: "siab",
                                },
                              },
                            ]
                          : [],
                        !0
                      ),
                      [
                        {
                          bidder: "sharethrough",
                          params: {
                            pkey: ne.billboard[s.Z.siteID] || ne.billboard[3],
                          },
                        },
                        {
                          bidder: "triplelift",
                          params: { inventoryCode: "Poki_160x600_Prebid" },
                        },
                      ],
                      !1
                    ),
                  },
                  {
                    code: le["320x50"],
                    mediaTypes: { banner: { sizes: [[320, 50]] } },
                    bids: se(
                      se(
                        [
                          {
                            bidder: "appnexus",
                            params: { placementId: "20595224" },
                          },
                          {
                            bidder: "openx",
                            params: {
                              unit: "543540495",
                              delDomain: "poki-d.openx.net",
                            },
                          },
                          {
                            bidder: "ix",
                            params: { siteId: "597529", size: [320, 50] },
                          },
                          {
                            bidder: "pubmatic",
                            params: {
                              publisherId: "156838",
                              adSlot: "3344350@320x50",
                            },
                          },
                          {
                            bidder: "rubicon",
                            params: {
                              accountId: "18608",
                              siteId: "204596",
                              zoneId: "1008080",
                            },
                          },
                          {
                            bidder: "onetag",
                            params: { pubId: "6da09f566a9dc06" },
                          },
                          {
                            bidder: "richaudience",
                            params: { pid: "1DP5EtcOip", supplyType: "site" },
                          },
                        ],
                        n.includes(s.Z.country)
                          ? [
                              {
                                bidder: "33across",
                                params: {
                                  siteId: "aRJKVCig8r7ikZaKj0P0Le",
                                  productId: "siab",
                                },
                              },
                            ]
                          : [],
                        !0
                      ),
                      [
                        {
                          bidder: "sharethrough",
                          params: {
                            pkey: ne.skyscraper[s.Z.siteID] || ne.skyscraper[3],
                          },
                        },
                        {
                          bidder: "triplelift",
                          params: { inventoryCode: "Poki_320x50_Prebid" },
                        },
                      ],
                      !1
                    ),
                  },
                  {
                    code: le["728x90_external"],
                    mediaTypes: { banner: { sizes: [[728, 90]] } },
                    bids: se(
                      se(
                        [
                          {
                            bidder: "appnexus",
                            params: { placementId: "20973406" },
                          },
                          {
                            bidder: "openx",
                            params: {
                              unit: "543885656",
                              delDomain: "poki-d.openx.net",
                            },
                          },
                          {
                            bidder: "ix",
                            params: {
                              siteId: "268177",
                              placementId: "625562",
                              size: [728, 90],
                            },
                          },
                          {
                            bidder: "pubmatic",
                            params: {
                              publisherId: "156838",
                              adSlot: "3457872",
                            },
                          },
                          {
                            bidder: "rubicon",
                            params: {
                              accountId: "18608",
                              siteId: "362566",
                              zoneId: "1962680-2",
                            },
                          },
                          {
                            bidder: "onetag",
                            params: { pubId: "6da09f566a9dc06" },
                          },
                          {
                            bidder: "richaudience",
                            params: {
                              pid: "MP_gIE1VDieUi",
                              supplyType: "site",
                            },
                          },
                        ],
                        n.includes(s.Z.country)
                          ? [
                              {
                                bidder: "33across",
                                params: {
                                  siteId: "aRJKVCig8r7ikZaKj0P0Le",
                                  productId: "siab",
                                },
                              },
                            ]
                          : [],
                        !0
                      ),
                      [
                        {
                          bidder: "sharethrough",
                          params: {
                            pkey: ne.billboard[s.Z.siteID] || ne.billboard[3],
                          },
                        },
                        {
                          bidder: "triplelift",
                          params: { inventoryCode: "Poki_728x90_Prebid" },
                        },
                      ],
                      !1
                    ),
                  },
                  {
                    code: le["300x250_external"],
                    mediaTypes: { banner: { sizes: [[300, 250]] } },
                    bids: se(
                      se(
                        [
                          {
                            bidder: "appnexus",
                            params: { placementId: "20973408" },
                          },
                          {
                            bidder: "openx",
                            params: {
                              unit: "543885657",
                              delDomain: "poki-d.openx.net",
                            },
                          },
                          {
                            bidder: "ix",
                            params: { siteId: "625564", size: [300, 250] },
                          },
                          {
                            bidder: "pubmatic",
                            params: {
                              publisherId: "156838",
                              adSlot: "3457874",
                            },
                          },
                          {
                            bidder: "rubicon",
                            params: {
                              accountId: "18608",
                              siteId: "362566",
                              zoneId: "1962680-15",
                            },
                          },
                          {
                            bidder: "onetag",
                            params: { pubId: "6da09f566a9dc06" },
                          },
                          {
                            bidder: "richaudience",
                            params: {
                              pid: "MP_gIE1VDieUi",
                              supplyType: "site",
                            },
                          },
                        ],
                        n.includes(s.Z.country)
                          ? [
                              {
                                bidder: "33across",
                                params: {
                                  siteId: "aRJKVCig8r7ikZaKj0P0Le",
                                  productId: "siab",
                                },
                              },
                            ]
                          : [],
                        !0
                      ),
                      [
                        {
                          bidder: "sharethrough",
                          params: {
                            pkey:
                              ne.mobile_leaderboard[s.Z.siteID] ||
                              ne.mobile_leaderboard[3],
                          },
                        },
                        {
                          bidder: "triplelift",
                          params: { inventoryCode: "Poki_300x250_Prebid" },
                        },
                      ],
                      !1
                    ),
                  },
                  {
                    code: le["970x250_external"],
                    mediaTypes: { banner: { sizes: [[970, 250]] } },
                    bids: se(
                      se(
                        [
                          {
                            bidder: "appnexus",
                            params: { placementId: "20973415" },
                          },
                          {
                            bidder: "openx",
                            params: {
                              unit: "543885650",
                              delDomain: "poki-d.openx.net",
                            },
                          },
                          {
                            bidder: "ix",
                            params: { siteId: "625560", size: [970, 250] },
                          },
                          {
                            bidder: "pubmatic",
                            params: {
                              publisherId: "156838",
                              adSlot: "3457879",
                            },
                          },
                          {
                            bidder: "rubicon",
                            params: {
                              accountId: "18608",
                              siteId: "362566",
                              zoneId: "1962680-57",
                            },
                          },
                          {
                            bidder: "onetag",
                            params: { pubId: "6da09f566a9dc06" },
                          },
                          {
                            bidder: "richaudience",
                            params: {
                              pid: "MP_gIE1VDieUi",
                              supplyType: "site",
                            },
                          },
                        ],
                        n.includes(s.Z.country)
                          ? [
                              {
                                bidder: "33across",
                                params: {
                                  siteId: "aRJKVCig8r7ikZaKj0P0Le",
                                  productId: "siab",
                                },
                              },
                            ]
                          : [],
                        !0
                      ),
                      [
                        {
                          bidder: "sharethrough",
                          params: {
                            pkey:
                              ne.leaderboard[s.Z.siteID] || ne.leaderboard[3],
                          },
                        },
                        {
                          bidder: "triplelift",
                          params: { inventoryCode: "Poki_970x250_Prebid" },
                        },
                      ],
                      !1
                    ),
                  },
                  {
                    code: le["160x600_external"],
                    mediaTypes: { banner: { sizes: [[160, 600]] } },
                    bids: se(
                      se(
                        [
                          {
                            bidder: "appnexus",
                            params: { placementId: "20973407" },
                          },
                          {
                            bidder: "openx",
                            params: {
                              unit: "543885653",
                              delDomain: "poki-d.openx.net",
                            },
                          },
                          {
                            bidder: "ix",
                            params: { siteId: "625563", size: [160, 600] },
                          },
                          {
                            bidder: "pubmatic",
                            params: {
                              publisherId: "156838",
                              adSlot: "3457877",
                            },
                          },
                          {
                            bidder: "rubicon",
                            params: {
                              accountId: "18608",
                              siteId: "362566",
                              zoneId: "1962680-9",
                            },
                          },
                          {
                            bidder: "onetag",
                            params: { pubId: "6da09f566a9dc06" },
                          },
                          {
                            bidder: "richaudience",
                            params: {
                              pid: "MP_gIE1VDieUi",
                              supplyType: "site",
                            },
                          },
                        ],
                        n.includes(s.Z.country)
                          ? [
                              {
                                bidder: "33across",
                                params: {
                                  siteId: "aRJKVCig8r7ikZaKj0P0Le",
                                  productId: "siab",
                                },
                              },
                            ]
                          : [],
                        !0
                      ),
                      [
                        {
                          bidder: "sharethrough",
                          params: {
                            pkey: ne.rectangle[s.Z.siteID] || ne.rectangle[3],
                          },
                        },
                        {
                          bidder: "triplelift",
                          params: { inventoryCode: "Poki_160x600_Prebid" },
                        },
                      ],
                      !1
                    ),
                  },
                  {
                    code: le["320x50_external"],
                    mediaTypes: { banner: { sizes: [[320, 50]] } },
                    bids: se(
                      se(
                        [
                          {
                            bidder: "appnexus",
                            params: { placementId: "20973413" },
                          },
                          {
                            bidder: "openx",
                            params: {
                              unit: "543885649",
                              delDomain: "poki-d.openx.net",
                            },
                          },
                          {
                            bidder: "ix",
                            params: { siteId: "625559", size: [320, 50] },
                          },
                          {
                            bidder: "pubmatic",
                            params: {
                              publisherId: "156838",
                              adSlot: "3457875",
                            },
                          },
                          {
                            bidder: "rubicon",
                            params: {
                              accountId: "18608",
                              siteId: "362566",
                              zoneId: "1962680-43",
                            },
                          },
                          {
                            bidder: "onetag",
                            params: { pubId: "6da09f566a9dc06" },
                          },
                          {
                            bidder: "richaudience",
                            params: {
                              pid: "MP_gIE1VDieUi",
                              supplyType: "site",
                            },
                          },
                        ],
                        n.includes(s.Z.country)
                          ? [
                              {
                                bidder: "33across",
                                params: {
                                  siteId: "aRJKVCig8r7ikZaKj0P0Le",
                                  productId: "siab",
                                },
                              },
                            ]
                          : [],
                        !0
                      ),
                      [
                        {
                          bidder: "sharethrough",
                          params: {
                            pkey:
                              ne.mobile_leaderboard[s.Z.siteID] ||
                              ne.mobile_leaderboard[3],
                          },
                        },
                        {
                          bidder: "triplelift",
                          params: { inventoryCode: "Poki_320x50_Prebid" },
                        },
                      ],
                      !1
                    ),
                  },
                ],
                d = ae(
                  ae(
                    {
                      debug: !1,
                      enableSendAllBids: !0,
                      usePrebidCache: !0,
                      bidderTimeout: 1500,
                      priceGranularity: {
                        buckets: [
                          { precision: 2, min: 0.01, max: 3, increment: 0.01 },
                          { precision: 2, min: 3, max: 8, increment: 0.05 },
                          { precision: 2, min: 8, max: 20, increment: 0.5 },
                          { precision: 2, min: 20, max: 45, increment: 1 },
                        ],
                      },
                      currency: {
                        adServerCurrency: "EUR",
                        defaultRates: {
                          EUR: { EUR: 1, GBP: 0.84, USD: 1.02 },
                          GBP: { EUR: 1.2, GBP: 1, USD: 1.22 },
                          USD: { EUR: 0.98, GBP: 0.82, USD: 1 },
                        },
                      },
                      cache: { url: "https://prebid.adnxs.com/pbc/v1/cache" },
                      targetingControls: {
                        allowTargetingKeys: [
                          "BIDDER",
                          "AD_ID",
                          "PRICE_BUCKET",
                          "SIZE",
                          "DEAL",
                          "SOURCE",
                          "FORMAT",
                          "UUID",
                          "CACHE_ID",
                          "CACHE_HOST",
                          "ADOMAIN",
                        ],
                        allowSendAllBidsTargetingKeys: [
                          "BIDDER",
                          "AD_ID",
                          "PRICE_BUCKET",
                          "SIZE",
                          "DEAL",
                          "SOURCE",
                          "FORMAT",
                          "UUID",
                          "CACHE_ID",
                          "CACHE_HOST",
                          "ADOMAIN",
                        ],
                      },
                      ortb2: {
                        site: { name: "Poki", page: Q() },
                        device: ae(
                          {},
                          window.innerWidth && window.innerHeight
                            ? { w: window.innerWidth, h: window.innerHeight }
                            : {}
                        ),
                      },
                      pageUrl: Q(),
                      userSync: {
                        filterSettings: {
                          all: { bidders: "*", filter: "include" },
                        },
                        syncsPerBidder: 1e3,
                        syncDelay: 100,
                        userIds: [
                          {
                            name: "pubCommonId",
                            storage: {
                              type: "cookie",
                              name: "poki_pubcid",
                              expires: 180,
                            },
                          },
                        ],
                      },
                    },
                    s.Z.gdprApplies
                      ? {
                          consentManagement: {
                            gdpr: {
                              cmpApi: "iab",
                              timeout: 8e3,
                              defaultGdprScope: !0,
                            },
                          },
                        }
                      : {}
                  ),
                  s.Z.ccpaApplies
                    ? {
                        consentManagement: {
                          usp: { cmpApi: "iab", timeout: 8e3 },
                        },
                      }
                    : {}
                );
              window.pbjs.que.push(function () {
                var n,
                  i,
                  o = ae(
                    ae(
                      {
                        floors: {
                          data: {
                            currency: "EUR",
                            schema: { fields: ["mediaType"] },
                            values: {
                              banner:
                                ((i = s.Z.country),
                                W.includes(i)
                                  ? 0.13
                                  : H.includes(i)
                                  ? 0.07
                                  : X.includes(i)
                                  ? 0.04
                                  : 0.02),
                              video: J(),
                            },
                          },
                        },
                      },
                      d
                    ),
                    e.config
                  );
                0 ===
                  (null === (n = Object.keys(o.floors)) || void 0 === n
                    ? void 0
                    : n.length) &&
                  (console.log("disabled floor module"),
                  null == o || delete o.floors),
                  window.pbjs.addAdUnits(
                    (function (e, t) {
                      var n,
                        i,
                        o = s.Z.country,
                        r = null == t ? void 0 : t[o];
                      if (!r) return e;
                      for (var a = 0; a <= e.length; a++)
                        for (
                          var d = e[a],
                            c =
                              r[
                                (
                                  null ===
                                    (n = null == d ? void 0 : d.mediaTypes) ||
                                  void 0 === n
                                    ? void 0
                                    : n.video
                                )
                                  ? "video"
                                  : "display"
                              ] || {},
                            l =
                              (null === (i = null == d ? void 0 : d.bids) ||
                              void 0 === i
                                ? void 0
                                : i.length) - 1;
                          l >= 0;
                          l--
                        ) {
                          var A = d.bids[l],
                            u = Math.random();
                          c[A.bidder] &&
                            u > c[A.bidder] &&
                            e[a].bids.splice(l, 1);
                        }
                      return e;
                    })(e.adUnits || a, t)
                  ),
                  window.pbjs.setConfig(o);
                var r = function (e, t) {
                  return 640 !== t.width && (e *= 0.95), oe(e, t);
                };
                window.pbjs.bidderSettings = {
                  standard: { storageAllowed: !0 },
                  appnexus: { bidCpmAdjustment: oe },
                  openx: { bidCpmAdjustment: oe },
                  spotx: { bidCpmAdjustment: oe },
                  ix: { bidCpmAdjustment: r },
                  richaudience: { bidCpmAdjustment: r },
                  onetag: { bidCpmAdjustment: oe },
                  rubicon: { bidCpmAdjustment: oe },
                  pubmatic: { bidCpmAdjustment: r },
                  "33across": { bidCpmAdjustment: oe },
                  sharethrough: { bidCpmAdjustment: r },
                  triplelift: { bidCpmAdjustment: oe },
                };
              });
            }
          },
          pe = !1,
          he = function (e, t) {
            if (window.apstag)
              try {
                var n = function (n) {
                  d.Z.debug &&
                    console.log(
                      "Boot A9 with APS CCPA Privacy mode:",
                      "".concat(s.Z.ccpaApplies ? "on" : "off"),
                      n
                    );
                  var i =
                    e.settings ||
                    ae(
                      ae(
                        {
                          pubID: "e32f1423-28bc-43ed-8ab0-5ae6b4449cf8",
                          adServer: "googletag",
                          videoAdServer: "GAM",
                        },
                        s.Z.gdprApplies ? { gdpr: { cmpTimeout: 1e4 } } : {}
                      ),
                      s.Z.ccpaApplies
                        ? { params: { aps_privacy: n || "1--" } }
                        : {}
                    );
                  window.apstag.init(i, function () {
                    var n;
                    (pe = !(function (e) {
                      var t,
                        n,
                        i = s.Z.country,
                        o =
                          null ===
                            (n =
                              null === (t = null == e ? void 0 : e[i]) ||
                              void 0 === t
                                ? void 0
                                : t.video) || void 0 === n
                            ? void 0
                            : n.amazon;
                      return !!o && Math.random() > o;
                    })(t)),
                      null === (n = e.callback) || void 0 === n || n.call(e);
                  });
                };
                if (s.Z.ccpaApplies)
                  return void window.__uspapi("uspPing", 1, function () {
                    window.__uspapi("getUSPData", 1, function (e, t) {
                      var i;
                      if (t) {
                        var o =
                          (null === (i = null == e ? void 0 : e.uspString) ||
                          void 0 === i
                            ? void 0
                            : i.charAt(2)) || "N";
                        "-" === o && (o = "N"), n("1Y".concat(o));
                      } else n("1YN");
                    });
                  });
                n("1--");
              } catch (e) {
                window.apstag = void 0;
              }
          };
        function me(e, t, n, i, o, a, d) {
          var c = a ? "nope" : t;
          if (window.pbjs && window.pbjs.que && window.pbjs.getConfig) {
            var l,
              A = Q(),
              u = i ? de : ce,
              p = 0,
              h = function () {
                var i, o, h, m;
                if (!(--p > 0))
                  try {
                    G.Z.dispatchEvent(r.Z.ads.prebidRequested);
                    var g = window.pbjs.adUnits.filter(function (e) {
                      return e.code === u;
                    })[0];
                    if ("undefined" === g)
                      return (
                        console.error(
                          "Video-ad-unit not found, did you give it the adunit.code='video' value?"
                        ),
                        void e.requestAd(c)
                      );
                    var v = window.pbjs.adServers.dfp.buildVideoUrl({
                        adUnit: g,
                        params: {
                          iu: (0, U.Z)("iu", t),
                          sz: "640x360|640x480",
                          output: "vast",
                          cust_params: n,
                          description_url: A,
                          url: A,
                        },
                      }),
                      f = window.pbjs.getHighestCpmBids(u),
                      y = void 0;
                    if (
                      (f.length > 0 && (y = f[0]),
                      window.pbjs.markWinningBidAsUsed({ adUnitCode: u }),
                      l &&
                        (v = v.replace(
                          "cust_params=",
                          "cust_params=".concat(l, "%26")
                        )),
                      y &&
                        (null ===
                          (o =
                            null === (i = null == y ? void 0 : y.meta) ||
                            void 0 === i
                              ? void 0
                              : i.advertiserDomains) || void 0 === o
                          ? void 0
                          : o.length) > 0 &&
                        G.Z.setVideoDataAnnotations({
                          adDomain: y.meta.advertiserDomains.join(","),
                        }),
                      a)
                    ) {
                      if (l) {
                        var w = (function (e) {
                          var t = decodeURIComponent(e),
                            n = (0, U.Z)("amznbid", t);
                          if (!n) return null;
                          var i = $[n];
                          if (!i) return null;
                          var o = (0, U.Z)("amzniid", t);
                          return {
                            bid: i,
                            vast: "https://aax.amazon-adsystem.com/e/dtb/vast?b="
                              .concat(o, "&rnd=")
                              .concat(Math.round(1e10 * Math.random()), "&pp=")
                              .concat(n),
                          };
                        })(l);
                        w &&
                          (!y || !y.videoCacheKey || y.cpm < w.bid) &&
                          (y = {
                            cpm: w.bid,
                            vast: w.vast,
                            bidder: "amazon",
                            videoCacheKey: "amazon",
                          });
                      }
                      if (1 !== d && (!y || !y.videoCacheKey || y.cpm < J())) {
                        var b = 5;
                        ("ninja.io" !==
                          (null ===
                            (h =
                              null === window || void 0 === window
                                ? void 0
                                : window.location) || void 0 === h
                            ? void 0
                            : h.hostname) &&
                          "makeitmeme.com" !==
                            (null ===
                              (m =
                                null === window || void 0 === window
                                  ? void 0
                                  : window.location) || void 0 === m
                              ? void 0
                              : m.hostname)) ||
                          (b = (function () {
                            var e = s.Z.country;
                            return "US" === e
                              ? 6.1
                              : W.includes(e)
                              ? 0.5
                              : H.includes(e)
                              ? 0.15
                              : X.includes(e)
                              ? 0.08
                              : K.includes(e)
                              ? 0.03
                              : 0.02;
                          })()),
                          (y = {
                            cpm: b,
                            vast: Y(),
                            bidder: "poki",
                            videoCacheKey: "poki",
                          });
                      }
                      if (!y || !y.videoCacheKey)
                        return void G.Z.dispatchEvent(
                          1 === d ? r.Z.ads.video.error : r.Z.ads.completed,
                          { rewardAllowed: !1 }
                        );
                      switch (y.bidder) {
                        case "onetag":
                          v = "https://onetag-sys.com/invocation/?key=".concat(
                            y.videoCacheKey
                          );
                          break;
                        case "rubicon":
                          v =
                            "https://prebid-server.rubiconproject.com/cache?uuid=".concat(
                              y.videoCacheKey
                            );
                          break;
                        case "spotx":
                          v =
                            "https://search.spotxchange.com/ad/vast.html?key=".concat(
                              y.videoCacheKey
                            );
                          break;
                        case "amazon":
                        case "poki":
                          v = y.vast;
                          break;
                        default:
                          v =
                            "https://prebid.adnxs.com/pbc/v1/cache?uuid=".concat(
                              y.videoCacheKey
                            );
                      }
                      (0, q.Z)({
                        event: "video-ready",
                        bidder: null == y ? void 0 : y.bidder,
                        bid: null == y ? void 0 : y.cpm,
                      }),
                        G.Z.setVideoDataAnnotations({
                          p4d_game_id: s.Z.gameID,
                          p4d_version_id: s.Z.versionID,
                          bidder: null == y ? void 0 : y.bidder,
                          bid: null == y ? void 0 : y.cpm,
                        });
                    }
                    G.Z.setVideoDataAnnotations({
                      pokiAdServer: a,
                      adTagUrl: v,
                    }),
                      y
                        ? G.Z.setVideoDataAnnotations({
                            prebidBidder: null == y ? void 0 : y.bidder,
                            prebidBid: null == y ? void 0 : y.cpm,
                          })
                        : G.Z.setVideoDataAnnotations({
                            prebidBidder: void 0,
                            prebidBid: void 0,
                          }),
                      e.requestAd(v);
                  } catch (t) {
                    e.requestAd(c);
                  }
              };
            if ((pe && p++, Ae && p++, pe))
              try {
                window.apstag.fetchBids(
                  {
                    slots: [
                      {
                        slotID: i ? "Rewarded" : "Midroll",
                        mediaType: "video",
                      },
                    ],
                    timeout: 1500,
                  },
                  function (e) {
                    e.length > 0 && (l = e[0].encodedQsParams), h();
                  }
                );
              } catch (e) {
                h();
              }
            a && (0, q.Z)({ event: "video-request" }),
              Ae &&
                window.pbjs.que.push(function () {
                  window.pbjs.requestBids({
                    adUnitCodes: [u],
                    bidsBackHandler: function () {
                      h();
                    },
                  });
                });
          } else e.requestAd(c);
        }
        function ge() {
          var e,
            t =
              (null ===
                (e =
                  null === window || void 0 === window
                    ? void 0
                    : window.location) || void 0 === e
                ? void 0
                : e.hostname) || "";
          return "yes" === (0, U.Z)("poki-ad-server")
            ? (console.log("DEBUG: Only running Poki-ad-server"), !0)
            : ("localhost" === t ||
                "game-cdn.poki.com" === t ||
                t.endsWith(".poki-gdn.com"),
              !1);
        }
        var ve,
          fe = !1,
          ye = s.Z.testVideos,
          we = s.Z.device,
          be = ye
            ? "/6062/sanghan_rweb_ad_unit"
            : "/"
                .concat(R, "/")
                .concat(we, "_ingame_rewarded_google/")
                .concat(s.Z.siteID, "_")
                .concat(we, "_ingame_rewarded_google"),
          ke = function (e) {
            "desktop" !== we
              ? window.googletag.cmd.push(function () {
                  a.Z.track(r.Z.tracking.ads.rewardedWeb.request),
                    (function (e) {
                      googletag.defineOutOfPageSlot &&
                        (ve && googletag.destroySlots([ve]),
                        (ve = googletag
                          .defineOutOfPageSlot(
                            be,
                            googletag.enums.OutOfPageFormat.REWARDED
                          )
                          .addService(googletag.pubads())),
                        googletag.enableServices(),
                        Object.keys(e).forEach(function (t) {
                          var n,
                            i = e[t];
                          "" !== i &&
                            (null ===
                              (n = null == ve ? void 0 : ve.setTargeting) ||
                              void 0 === n ||
                              n.call(ve, t, i));
                        }));
                    })(e),
                    ve
                      ? window.googletag.cmd.push(function () {
                          window.googletag.display(ve);
                        })
                      : G.Z.dispatchEvent(r.Z.ads.video.startHouseAdFlow);
                })
              : G.Z.dispatchEvent(r.Z.ads.video.startHouseAdFlow);
          },
          Ze = (function () {
            function e(e, t) {
              void 0 === t && (t = {});
              var n = this;
              (this.retries = 0),
                (this.running = !1),
                (this.ima = e),
                (this.siteID = s.Z.siteID || 3),
                (this.country = s.Z.country || "ZZ"),
                (this.usePokiAdserver = ge()),
                (this.totalRetries = t.totalRetries || L.waterfallRetries || 1),
                (this.timing = t.timing || new N(L.adTiming)),
                G.Z.addEventListener(
                  r.Z.ads.video.error,
                  this.moveThroughWaterfall.bind(this)
                ),
                G.Z.addEventListener(
                  r.Z.ads.video.loaderError,
                  this.moveThroughWaterfall.bind(this)
                ),
                G.Z.addEventListener(
                  r.Z.ads.ready,
                  this.timing.stopWaterfallTimer.bind(this.timing)
                ),
                G.Z.addEventListener(
                  r.Z.ads.started,
                  this.stopWaterfall.bind(this)
                ),
                G.Z.addEventListener(
                  r.Z.ads.video.startHouseAdFlow,
                  function () {
                    n.startHouseAdFlow();
                  }
                );
            }
            return (
              (e.prototype.moveThroughWaterfall = function () {
                if (this.runningBackfill)
                  return (
                    (this.runningBackfill = !1),
                    void G.Z.dispatchEvent(r.Z.ads.error, {
                      message: "Backfilling failed",
                      rewardAllowed: !1,
                    })
                  );
                if (!1 !== this.running) {
                  var e = this.totalRetries;
                  if ((this.timing.stopWaterfallTimer(), this.retries < e))
                    return (
                      this.timing.nextWaterfallTimer(), void this.requestAd()
                    );
                  (this.running = !1),
                    this.timing.resetWaterfallTimerIdx(),
                    this.rewarded
                      ? ke(this.criteria)
                      : G.Z.dispatchEvent(r.Z.ads.error, { message: "No ads" });
                }
              }),
              (e.prototype.cutOffWaterfall = function () {
                this.ima.tearDown(), this.moveThroughWaterfall();
              }),
              (e.prototype.buildAdUnitPaths = function (e) {
                var t = s.Z.device,
                  n = "midroll";
                if ((0, U.Z)("noFill") || d.Z.debug) return ["junk", "junk"];
                e === r.Z.ads.position.rewarded && (n = "rewarded");
                var i = "/".concat(R, "/");
                return s.Z.isPokiIframe
                  ? [
                      ""
                        .concat(i)
                        .concat(t, "_ingame_")
                        .concat(n, "_1/")
                        .concat(this.siteID, "_")
                        .concat(t, "_ingame_")
                        .concat(n, "_1"),
                      ""
                        .concat(i)
                        .concat(t, "_ingame_")
                        .concat(n, "_2/")
                        .concat(this.siteID, "_")
                        .concat(t, "_ingame_")
                        .concat(n, "_2"),
                    ]
                  : [
                      ""
                        .concat(i, "external_")
                        .concat(t, "_video_1/external_")
                        .concat(t, "_ingame_")
                        .concat(n, "_1"),
                      ""
                        .concat(i, "external_")
                        .concat(t, "_video_2/external_")
                        .concat(t, "_ingame_")
                        .concat(n, "_2"),
                    ];
              }),
              (e.prototype.startHouseAdFlow = function () {
                var e = Y();
                G.Z.setVideoDataAnnotations({
                  pokiAdServer: !0,
                  adTagUrl: e,
                  bidder: "poki",
                  bid: 0,
                }),
                  (0, q.Z)({ event: "video-request" }),
                  this.ima.requestAd(e),
                  (this.runningBackfill = !0);
              }),
              (e.prototype.start = function (e, t) {
                void 0 === e && (e = {}),
                  (this.running = !0),
                  (this.retries = 0),
                  (this.criteria = e),
                  this.timing.resetWaterfallTimerIdx(),
                  (this.rewarded = t === r.Z.ads.position.rewarded),
                  (this.adUnitPaths = this.buildAdUnitPaths(t)),
                  this.requestAd();
              }),
              (e.prototype.requestAd = function () {
                this.timing.startWaterfallTimer(
                  this.cutOffWaterfall.bind(this)
                ),
                  this.retries++,
                  (this.criteria.waterfall = this.retries),
                  (this.runningBackfill = !1);
                var e = (this.retries - 1) % this.adUnitPaths.length,
                  t = this.adUnitPaths[e],
                  n =
                    "https://securepubads.g.doubleclick.net/gampad/ads?sz=640x360|640x480&iu=".concat(
                      t,
                      "&ciu_szs&impl=s&gdfp_req=1&env=vp&output=xml_vast4&unviewed_position_start=1&url={url}&description_url={descriptionUrl}&correlator={timestamp}"
                    ),
                  i =
                    Math.max(
                      document.documentElement.clientWidth || 0,
                      window.innerWidth || 0
                    ) > 970;
                this.criteria.billboards_fit = i ? "yes" : "no";
                var o,
                  a,
                  c =
                    (function (e) {
                      var t = encodeURIComponent(Q());
                      return (e = (e = e.split("{url}").join(t))
                        .split("{descriptionUrl}")
                        .join(t))
                        .split("{timestamp}")
                        .join(new Date().getTime().toString());
                    })(n) +
                    ((o = this.criteria),
                    (a = ""),
                    Object.keys(o).forEach(function (e) {
                      if (Object.prototype.hasOwnProperty.call(o, e)) {
                        var t = o[e];
                        Array.isArray(t) && (t = t.join()),
                          (a += "".concat(e, "=").concat(t, "&"));
                      }
                    }),
                    (a = encodeURIComponent(a)),
                    "&cust_params=".concat(a, "&"));
                s.Z.childDirected && (c += "&tfcd=1"),
                  s.Z.nonPersonalized && (c += "&npa=1"),
                  G.Z.setVideoDataAnnotations({
                    adUnitPath: t,
                    adTagUrl: c,
                    waterfall: this.retries,
                    size: "640x360v",
                  }),
                  G.Z.dispatchEvent(r.Z.ads.requested),
                  d.Z.debug
                    ? (console.debug(
                        "adRequest started in debug mode ("
                          .concat(this.retries, "/")
                          .concat(this.totalRetries, ")")
                      ),
                      this.ima.requestAd(Y()))
                    : this.usePokiAdserver
                    ? (console.debug(
                        "adRequest started with Prebid Video enabled ("
                          .concat(this.retries, "/")
                          .concat(this.totalRetries, ")")
                      ),
                      me(
                        this.ima,
                        c,
                        this.criteria,
                        this.rewarded,
                        this.country,
                        !0,
                        this.retries
                      ))
                    : 1 === this.retries
                    ? (console.debug(
                        "adRequest started with Prebid Video enabled ("
                          .concat(this.retries, "/")
                          .concat(this.totalRetries, ")")
                      ),
                      me(
                        this.ima,
                        c,
                        this.criteria,
                        this.rewarded,
                        this.country,
                        !1,
                        this.retries
                      ))
                    : (console.debug(
                        "adRequest started in plain mode ("
                          .concat(this.retries, "/")
                          .concat(this.totalRetries, ")")
                      ),
                      this.ima.requestAd(c));
              }),
              (e.prototype.isRunning = function () {
                return this.running;
              }),
              (e.prototype.stopWaterfall = function () {
                (this.running = !1),
                  this.timing.stopWaterfallTimer(),
                  this.timing.resetWaterfallTimerIdx();
              }),
              e
            );
          })();
        const Ee = Ze;
        var Ie = "pokiSdkContainer",
          xe = "pokiSdkFixed",
          Ce = "pokiSdkOverlay",
          _e = "pokiSdkHidden",
          Se = "pokiSdkInsideContainer",
          Te = "pokiSdkPauseButton",
          Pe = "pokiSdkPauseButtonBG",
          De = "pokiSdkStartAdButton",
          Be = "pokiSdkProgressBar",
          je = "pokiSdkProgressContainer",
          ze = "pokiSdkSpinnerContainer",
          Me = "pokiSdkVideoContainer",
          Oe = "pokiSdkVisible",
          Re = "pokiSDKAdContainer",
          Le = "\n."
            .concat(
              Ie,
              " {\n\toverflow: hidden;\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\twidth: 100%;\n\theight: 100%;\n\tz-index: 1000;\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n}\n\n."
            )
            .concat(Ie, ".")
            .concat(xe, " {\n\tposition: fixed;\n}\n\n.")
            .concat(Ie, ".")
            .concat(Oe, " {\n\tdisplay: block;\n}\n\n.")
            .concat(Ie, ".")
            .concat(_e, ",\n.")
            .concat(ze, ".")
            .concat(_e, " {\n\tdisplay: none;\n}\n\n.")
            .concat(Ie, ".")
            .concat(_e, ",\n.")
            .concat(ze, " {\n\tpointer-events: none;\n}\n\n.")
            .concat(
              ze,
              " {\n\tz-index: 10;\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n\tbackground: url('https://a.poki.com/images/thumb_anim_2x.gif') 50% 50% no-repeat;\n\tuser-select: none;\n}\n\n."
            )
            .concat(
              Se,
              " {\n\tbackground: #000;\n\tposition: relative;\n\tz-index: 1;\n\twidth: 100%;\n\theight: 100%;\n\tdisplay: flex;\n\tflex-direction: column;\n\n\topacity: 0;\n\t-webkit-transition: opacity 0.5s ease-in-out;\n\t-moz-transition: opacity 0.5s ease-in-out;\n\t-ms-transition: opacity 0.5s ease-in-out;\n\t-o-transition: opacity 0.5s ease-in-out;\n\ttransition: opacity 0.5s ease-in-out;\n}\n\n."
            )
            .concat(Ie, ".")
            .concat(Oe, " .")
            .concat(Se, " {\n\topacity: 1;\n}\n\n.")
            .concat(Re, ", .")
            .concat(
              Me,
              " {\n\tposition: absolute;\n\twidth: 100%;\n\theight: 100%;\n}\n\n."
            )
            .concat(
              De,
              " {\n\tposition: absolute;\n\tz-index: 9999;\n\ttop: 0;\n\n\tpadding-top: 10%;\n\twidth: 100%;\n\theight: 100%;\n\ttext-align: center;\n\tcolor: #FFF;\n\n\tfont: 700 15pt 'Arial', sans-serif;\n\tfont-weight: bold;\n\tletter-spacing: 1px;\n\ttransition: 0.1s ease-in-out;\n\tline-height: 1em;\n}\n\n."
            )
            .concat(
              Te,
              " {\n\tcursor:pointer;\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    z-index: 1;\n}\n\n."
            )
            .concat(
              Te,
              ":before {\n\tcontent: '';\n\tposition: absolute;\n\twidth: 100px;\n\theight: 100px;\n\tdisplay: block;\n\tborder: 2px solid #fff;\n\tborder-radius: 50%;\n\tuser-select: none;\n\tbackground-color: rgba(0, 0, 0, 0.6);\n\ttransition: background-color 0.5s ease;\n\tanimation: 1s linear infinite pokiPulse;\n}\n\n."
            )
            .concat(
              Te,
              ":after {\n\tcontent: '';\n\tposition: absolute;\n\tdisplay: block;\n\tbox-sizing: border-box;\n\tborder-color: transparent transparent transparent #fff;\n\tborder-style: solid;\n\tborder-width: 26px 0 26px 40px;\n\tpointer-events: none;\n\tanimation: 1s linear infinite pokiPulse;\n\tleft: 6px;\n}\n."
            )
            .concat(
              Pe,
              " {\n    position: fixed;\n    top: 0;\n    left: 0;\n    display: block;\n    content: '';\n    background: rgba(0, 43, 80, 0.5);\n    width: 100%;\n    height: 100%;\n}\n\n."
            )
            .concat(
              Pe,
              ":hover{\n\tbackground: rgba(0, 43, 80, 0.7);\n}\n\n@keyframes pokiPulse {\n\t0% {\n\t\ttransform: translate(-50%, -50%) scale(0.95);\n\t}\n\t70% {\n\t\ttransform: translate(-50%, -50%) scale(1.1);\n\t}\n\t100% {\n\t\ttransform: translate(-50%, -50%) scale(0.95);\n\t}\n}\n\n."
            )
            .concat(
              je,
              " {\n\tbackground: #B8C7DD;\n\twidth: 100%;\n\theight: 5px;\n\tposition: absolute;\n\tbottom: 0;\n\tz-index: 9999;\n}\n\n."
            )
            .concat(
              Be,
              " {\n\tposition:relative;\n\tbottom:0px;\n\tbackground: #FFDC00;\n\theight: 100%;\n\twidth: 0%;\n\ttransition: width 0.5s;\n\ttransition-timing-function: linear;\n}\n\n."
            )
            .concat(Be, ".")
            .concat(Oe, ", .")
            .concat(Te, ".")
            .concat(Oe, ", .")
            .concat(De, ".")
            .concat(
              Oe,
              " {\n\tdisplay: block;\n\tpointer-events: auto;\n}\n\n."
            )
            .concat(Be, ".")
            .concat(_e, ", .")
            .concat(Te, ".")
            .concat(_e, ", .")
            .concat(De, ".")
            .concat(_e, " {\n\tdisplay: none;\n\tpointer-events: none;\n}\n"),
          Ge = function (e, t, n) {
            if (n || 2 === arguments.length)
              for (var i, o = 0, r = t.length; o < r; o++)
                (!i && o in t) ||
                  (i || (i = Array.prototype.slice.call(t, 0, o)),
                  (i[o] = t[o]));
            return e.concat(i || Array.prototype.slice.call(t));
          },
          Ne = (function () {
            function e(e) {
              var t = this;
              if (
                ((this.hideElement = function (e) {
                  e.classList.add(_e), e.classList.remove(Oe);
                }),
                (this.showElement = function (e) {
                  e.classList.add(Oe), e.classList.remove(_e);
                }),
                (this.progressFaker = new qe(function (e) {
                  return t.updateProgressBar(e);
                })),
                this.progressFaker.queueFakeProgress(
                  10,
                  1e3,
                  r.Z.ads.prebidRequested
                ),
                this.progressFaker.queueFakeProgress(20, 2e3, r.Z.ads.started),
                this.createElements(e.wrapper),
                "undefined" != typeof window && document)
              ) {
                var n = document.createElement("style");
                (n.innerHTML = Le), document.head.appendChild(n);
              }
            }
            return (
              (e.prototype.updateProgressBar = function (e) {
                this.progressBar.style.width = "".concat(e, "%");
              }),
              (e.prototype.setupEvents = function (e) {
                this.monetization = e;
              }),
              (e.prototype.hide = function () {
                this.hideElement(this.containerDiv),
                  this.hideElement(this.progressContainer),
                  this.hidePauseButton(),
                  this.hideElement(this.startAdButton),
                  this.containerDiv.classList.remove(Ce),
                  (this.progressBar.style.width = "0%"),
                  this.progressFaker.reset();
              }),
              (e.prototype.hideSpinner = function () {
                this.hideElement(this.spinnerContainer);
              }),
              (e.prototype.show = function () {
                this.containerDiv.classList.add(Ce),
                  this.showElement(this.containerDiv),
                  this.showElement(this.spinnerContainer),
                  this.showElement(this.progressContainer),
                  this.progressFaker.start();
              }),
              (e.prototype.getVideoBounds = function () {
                return this.adContainer.getBoundingClientRect();
              }),
              (e.prototype.getAdContainer = function () {
                return this.adContainer;
              }),
              (e.prototype.getVideoContainer = function () {
                return this.videoContainer;
              }),
              (e.prototype.showPauseButton = function () {
                this.showElement(this.pauseButton),
                  this.monetization &&
                    this.pauseButton.addEventListener(
                      "click",
                      this.monetization.resumeAd.bind(this.monetization)
                    );
              }),
              (e.prototype.hidePauseButton = function () {
                this.hideElement(this.pauseButton),
                  this.monetization &&
                    this.pauseButton.removeEventListener(
                      "click",
                      this.monetization.resumeAd.bind(this.monetization)
                    );
              }),
              (e.prototype.showStartAdButton = function () {
                this.showElement(this.startAdButton),
                  this.monetization &&
                    this.startAdButton.addEventListener(
                      "click",
                      this.monetization.startAdClicked.bind(this.monetization)
                    );
              }),
              (e.prototype.hideStartAdButton = function () {
                this.hideElement(this.startAdButton),
                  this.monetization &&
                    this.startAdButton.removeEventListener(
                      "click",
                      this.monetization.startAdClicked.bind(this.monetization)
                    );
              }),
              (e.prototype.createElements = function (e) {
                var t = this;
                (this.containerDiv = document.createElement("div")),
                  (this.insideContainer = document.createElement("div")),
                  (this.pauseButton = document.createElement("div")),
                  (this.pauseButtonBG = document.createElement("div")),
                  (this.startAdButton = document.createElement("div")),
                  (this.progressBar = document.createElement("div")),
                  (this.progressContainer = document.createElement("div")),
                  (this.spinnerContainer = document.createElement("div")),
                  (this.adContainer = document.createElement("div")),
                  (this.videoContainer = document.createElement("video")),
                  (this.adContainer.id = "pokiSDKAdContainer"),
                  (this.videoContainer.id = "pokiSDKVideoContainer"),
                  (this.containerDiv.className = Ie),
                  (this.insideContainer.className = Se),
                  (this.pauseButton.className = Te),
                  (this.pauseButtonBG.className = Pe),
                  this.pauseButton.appendChild(this.pauseButtonBG),
                  (this.startAdButton.className = De),
                  (this.startAdButton.innerHTML = "Tap anywhere to play ad"),
                  (this.progressBar.className = Be),
                  (this.progressContainer.className = je),
                  (this.spinnerContainer.className = ze),
                  (this.adContainer.className = Re),
                  (this.videoContainer.className = Me),
                  this.hide(),
                  this.videoContainer.setAttribute(
                    "playsinline",
                    "playsinline"
                  ),
                  this.videoContainer.setAttribute("muted", "muted"),
                  this.containerDiv.appendChild(this.insideContainer),
                  this.containerDiv.appendChild(this.spinnerContainer),
                  this.insideContainer.appendChild(this.progressContainer),
                  this.insideContainer.appendChild(this.videoContainer),
                  this.insideContainer.appendChild(this.adContainer),
                  this.containerDiv.appendChild(this.pauseButton),
                  this.containerDiv.appendChild(this.startAdButton),
                  this.progressContainer.appendChild(this.progressBar);
                var n = e || null,
                  i = function () {
                    if ((n || (n = document.body), n))
                      if ((n.appendChild(t.containerDiv), n === document.body))
                        t.containerDiv.classList.add(xe);
                      else {
                        var e = window.getComputedStyle(n).position;
                        (e &&
                          -1 !==
                            ["absolute", "fixed", "relative"].indexOf(e)) ||
                          (n.style.position = "relative");
                      }
                    else window.requestAnimationFrame(i);
                  };
                !n ||
                  n instanceof HTMLElement ||
                  ((n = null),
                  console.error(
                    "POKI-SDK: wrapper is not a HTMLElement, falling back to document.body"
                  )),
                  i();
              }),
              e
            );
          })();
        const Ue = Ne;
        var qe = (function () {
            function e(e) {
              var t = this;
              (this.storedQueue = []),
                (this.progressCallback = e),
                this.reset(),
                G.Z.addEventListener(r.Z.ads.video.progress, function (e) {
                  var n = 100 - t.currentProgress,
                    i = (e.currentTime / e.duration) * n;
                  i < n && t.progressCallback(t.currentProgress + i);
                }),
                this.initializeNoProgressFix();
            }
            return (
              (e.prototype.queueFakeProgress = function (e, t, n) {
                var i = this;
                this.storedQueue.push({
                  progressToFake: e,
                  duration: t,
                  stopEvent: n,
                }),
                  G.Z.addEventListener(n, function () {
                    (i.eventWatcher[n] = !0),
                      (i.currentProgress = i.startProgress + e),
                      (i.startProgress = i.currentProgress),
                      i.progressCallback(i.currentProgress),
                      i.activeQueue.shift(),
                      i.activeQueue.length > 0 ? i.continue() : i.pause();
                  });
              }),
              (e.prototype.fakeProgress = function (e, t, n) {
                this.activeQueue.push({
                  progressToFake: e,
                  duration: t,
                  stopEvent: n,
                }),
                  (this.fakeProgressEvents = !0),
                  this.continue();
              }),
              (e.prototype.start = function () {
                this.activeQueue.length > 0 ||
                  ((this.activeQueue = Ge([], this.storedQueue, !0)),
                  (this.active = !0),
                  this.continue());
              }),
              (e.prototype.continue = function () {
                if (this.activeQueue.length > 0 && !this.tickInterval) {
                  this.startTime = Date.now();
                  (this.tickInterval = window.setInterval(
                    this.tick.bind(this),
                    50
                  )),
                    (this.active = !0);
                }
              }),
              (e.prototype.pause = function () {
                this.clearInterval();
              }),
              (e.prototype.tick = function () {
                var e = this.activeQueue[0],
                  t = Date.now() - this.startTime,
                  n = Math.min(t / e.duration, 1);
                (this.currentProgress =
                  this.startProgress + e.progressToFake * n),
                  this.fakeProgressEvents &&
                    G.Z.dispatchEvent(r.Z.ads.video.progress, {
                      duration: e.duration / 1e3,
                      currentTime: t / 1e3,
                    }),
                  this.progressCallback(this.currentProgress),
                  (this.eventWatcher[e.stopEvent] || 1 === n) && this.pause();
              }),
              (e.prototype.clearInterval = function () {
                this.tickInterval &&
                  (clearInterval(this.tickInterval), (this.tickInterval = 0));
              }),
              (e.prototype.initializeNoProgressFix = function () {
                var e = this;
                G.Z.addEventListener(r.Z.ads.started, function (t) {
                  e.progressWatcherTimeout = window.setTimeout(function () {
                    if (e.active) {
                      var n = 100 - e.currentProgress,
                        i = 1e3 * t.duration - 1e3;
                      e.fakeProgress(n, i, r.Z.ads.completed);
                    }
                  }, 1e3);
                }),
                  G.Z.addEventListener(r.Z.ads.video.progress, function () {
                    e.progressWatcherTimeout &&
                      (clearTimeout(e.progressWatcherTimeout),
                      (e.progressWatcherTimeout = 0));
                  });
              }),
              (e.prototype.reset = function () {
                (this.eventWatcher = {}),
                  (this.startProgress = 0),
                  (this.startTime = 0),
                  (this.currentProgress = 0),
                  (this.activeQueue = []),
                  (this.active = !1),
                  (this.fakeProgressEvents = !1),
                  this.clearInterval();
              }),
              e
            );
          })(),
          Qe = n(662),
          Ve = function (e, t, n, i) {
            return new (n || (n = Promise))(function (o, r) {
              function a(e) {
                try {
                  d(i.next(e));
                } catch (e) {
                  r(e);
                }
              }
              function s(e) {
                try {
                  d(i.throw(e));
                } catch (e) {
                  r(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? o(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(a, s);
              }
              d((i = i.apply(e, t || [])).next());
            });
          },
          Fe = function (e, t) {
            var n,
              i,
              o,
              r,
              a = {
                label: 0,
                sent: function () {
                  if (1 & o[0]) throw o[1];
                  return o[1];
                },
                trys: [],
                ops: [],
              };
            return (
              (r = { next: s(0), throw: s(1), return: s(2) }),
              "function" == typeof Symbol &&
                (r[Symbol.iterator] = function () {
                  return this;
                }),
              r
            );
            function s(s) {
              return function (d) {
                return (function (s) {
                  if (n) throw new TypeError("Generator is already executing.");
                  for (; r && ((r = 0), s[0] && (a = 0)), a; )
                    try {
                      if (
                        ((n = 1),
                        i &&
                          (o =
                            2 & s[0]
                              ? i.return
                              : s[0]
                              ? i.throw || ((o = i.return) && o.call(i), 0)
                              : i.next) &&
                          !(o = o.call(i, s[1])).done)
                      )
                        return o;
                      switch (((i = 0), o && (s = [2 & s[0], o.value]), s[0])) {
                        case 0:
                        case 1:
                          o = s;
                          break;
                        case 4:
                          return a.label++, { value: s[1], done: !1 };
                        case 5:
                          a.label++, (i = s[1]), (s = [0]);
                          continue;
                        case 7:
                          (s = a.ops.pop()), a.trys.pop();
                          continue;
                        default:
                          if (
                            !((o = a.trys),
                            (o = o.length > 0 && o[o.length - 1]) ||
                              (6 !== s[0] && 2 !== s[0]))
                          ) {
                            a = 0;
                            continue;
                          }
                          if (
                            3 === s[0] &&
                            (!o || (s[1] > o[0] && s[1] < o[3]))
                          ) {
                            a.label = s[1];
                            break;
                          }
                          if (6 === s[0] && a.label < o[1]) {
                            (a.label = o[1]), (o = s);
                            break;
                          }
                          if (o && a.label < o[2]) {
                            (a.label = o[2]), a.ops.push(s);
                            break;
                          }
                          o[2] && a.ops.pop(), a.trys.pop();
                          continue;
                      }
                      s = t.call(e, a);
                    } catch (e) {
                      (s = [6, e]), (i = 0);
                    } finally {
                      n = o = 0;
                    }
                  if (5 & s[0]) throw s[1];
                  return { value: s[0] ? s[1] : void 0, done: !0 };
                })([s, d]);
              };
            }
          };
        const We = (function () {
          function e(e) {
            var t = this;
            (this.bannerTimeout = null),
              (this.allowedToPlayAd = !1),
              (this.runningAd = !1),
              (this.completeOnce = !1),
              (this.videoStarted = !1),
              (this.currentWidth = 640),
              (this.currentHeight = 480),
              (this.currentRequestIsMuted = !1),
              (this.volume = 1),
              (this.canWeAutoPlayWithSound = function () {
                return Ve(t, void 0, void 0, function () {
                  return Fe(this, function (e) {
                    switch (e.label) {
                      case 0:
                        if (!this.blankVideo) return [2, !1];
                        e.label = 1;
                      case 1:
                        return (
                          e.trys.push([1, 3, , 4]), [4, this.blankVideo.play()]
                        );
                      case 2:
                        return e.sent(), [2, !0];
                      case 3:
                        return e.sent(), [2, !1];
                      case 4:
                        return [2];
                    }
                  });
                });
              }),
              (this.videoElement = document.getElementById(
                "pokiSDKVideoContainer"
              )),
              (this.adsManager = null),
              (this.volume = e),
              this.initAdDisplayContainer(),
              this.initBlankVideo(),
              this.initAdsLoader();
          }
          return (
            (e.prototype.initAdDisplayContainer = function () {
              this.adDisplayContainer ||
                (window.google &&
                  (this.adDisplayContainer = new google.ima.AdDisplayContainer(
                    document.getElementById("pokiSDKAdContainer"),
                    this.videoElement
                  )));
            }),
            (e.prototype.initBlankVideo = function () {
              (this.blankVideo = document.createElement("video")),
                this.blankVideo.setAttribute("playsinline", "playsinline");
              var e = document.createElement("source");
              (e.src =
                "data:video/mp4;base64, AAAAHGZ0eXBNNFYgAAACAGlzb21pc28yYXZjMQAAAAhmcmVlAAAGF21kYXTeBAAAbGliZmFhYyAxLjI4AABCAJMgBDIARwAAArEGBf//rdxF6b3m2Ui3lizYINkj7u94MjY0IC0gY29yZSAxNDIgcjIgOTU2YzhkOCAtIEguMjY0L01QRUctNCBBVkMgY29kZWMgLSBDb3B5bGVmdCAyMDAzLTIwMTQgLSBodHRwOi8vd3d3LnZpZGVvbGFuLm9yZy94MjY0Lmh0bWwgLSBvcHRpb25zOiBjYWJhYz0wIHJlZj0zIGRlYmxvY2s9MTowOjAgYW5hbHlzZT0weDE6MHgxMTEgbWU9aGV4IHN1Ym1lPTcgcHN5PTEgcHN5X3JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MSBtZV9yYW5nZT0xNiBjaHJvbWFfbWU9MSB0cmVsbGlzPTEgOHg4ZGN0PTAgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9LTIgdGhyZWFkcz02IGxvb2thaGVhZF90aHJlYWRzPTEgc2xpY2VkX3RocmVhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb25zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MCB3ZWlnaHRwPTAga2V5aW50PTI1MCBrZXlpbnRfbWluPTI1IHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCB2YnZfbWF4cmF0ZT03NjggdmJ2X2J1ZnNpemU9MzAwMCBjcmZfbWF4PTAuMCBuYWxfaHJkPW5vbmUgZmlsbGVyPTAgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAAFZliIQL8mKAAKvMnJycnJycnJycnXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXiEASZACGQAjgCEASZACGQAjgAAAAAdBmjgX4GSAIQBJkAIZACOAAAAAB0GaVAX4GSAhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZpgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGagC/AySEASZACGQAjgAAAAAZBmqAvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZrAL8DJIQBJkAIZACOAAAAABkGa4C/AySEASZACGQAjgCEASZACGQAjgAAAAAZBmwAvwMkhAEmQAhkAI4AAAAAGQZsgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGbQC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBm2AvwMkhAEmQAhkAI4AAAAAGQZuAL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGboC/AySEASZACGQAjgAAAAAZBm8AvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZvgL8DJIQBJkAIZACOAAAAABkGaAC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBmiAvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZpAL8DJIQBJkAIZACOAAAAABkGaYC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBmoAvwMkhAEmQAhkAI4AAAAAGQZqgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGawC/AySEASZACGQAjgAAAAAZBmuAvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZsAL8DJIQBJkAIZACOAAAAABkGbIC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBm0AvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZtgL8DJIQBJkAIZACOAAAAABkGbgCvAySEASZACGQAjgCEASZACGQAjgAAAAAZBm6AnwMkhAEmQAhkAI4AhAEmQAhkAI4AhAEmQAhkAI4AhAEmQAhkAI4AAAAhubW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAABDcAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAzB0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAA+kAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAALAAAACQAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAPpAAAAAAABAAAAAAKobWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAB1MAAAdU5VxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAACU21pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAhNzdGJsAAAAr3N0c2QAAAAAAAAAAQAAAJ9hdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAALAAkABIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAALWF2Y0MBQsAN/+EAFWdCwA3ZAsTsBEAAAPpAADqYA8UKkgEABWjLg8sgAAAAHHV1aWRraEDyXyRPxbo5pRvPAyPzAAAAAAAAABhzdHRzAAAAAAAAAAEAAAAeAAAD6QAAABRzdHNzAAAAAAAAAAEAAAABAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAABAAAAAQAAAIxzdHN6AAAAAAAAAAAAAAAeAAADDwAAAAsAAAALAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAAiHN0Y28AAAAAAAAAHgAAAEYAAANnAAADewAAA5gAAAO0AAADxwAAA+MAAAP2AAAEEgAABCUAAARBAAAEXQAABHAAAASMAAAEnwAABLsAAATOAAAE6gAABQYAAAUZAAAFNQAABUgAAAVkAAAFdwAABZMAAAWmAAAFwgAABd4AAAXxAAAGDQAABGh0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAACAAAAAAAABDcAAAAAAAAAAAAAAAEBAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAQkAAADcAABAAAAAAPgbWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAC7gAAAykBVxAAAAAAALWhkbHIAAAAAAAAAAHNvdW4AAAAAAAAAAAAAAABTb3VuZEhhbmRsZXIAAAADi21pbmYAAAAQc21oZAAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAADT3N0YmwAAABnc3RzZAAAAAAAAAABAAAAV21wNGEAAAAAAAAAAQAAAAAAAAAAAAIAEAAAAAC7gAAAAAAAM2VzZHMAAAAAA4CAgCIAAgAEgICAFEAVBbjYAAu4AAAADcoFgICAAhGQBoCAgAECAAAAIHN0dHMAAAAAAAAAAgAAADIAAAQAAAAAAQAAAkAAAAFUc3RzYwAAAAAAAAAbAAAAAQAAAAEAAAABAAAAAgAAAAIAAAABAAAAAwAAAAEAAAABAAAABAAAAAIAAAABAAAABgAAAAEAAAABAAAABwAAAAIAAAABAAAACAAAAAEAAAABAAAACQAAAAIAAAABAAAACgAAAAEAAAABAAAACwAAAAIAAAABAAAADQAAAAEAAAABAAAADgAAAAIAAAABAAAADwAAAAEAAAABAAAAEAAAAAIAAAABAAAAEQAAAAEAAAABAAAAEgAAAAIAAAABAAAAFAAAAAEAAAABAAAAFQAAAAIAAAABAAAAFgAAAAEAAAABAAAAFwAAAAIAAAABAAAAGAAAAAEAAAABAAAAGQAAAAIAAAABAAAAGgAAAAEAAAABAAAAGwAAAAIAAAABAAAAHQAAAAEAAAABAAAAHgAAAAIAAAABAAAAHwAAAAQAAAABAAAA4HN0c3oAAAAAAAAAAAAAADMAAAAaAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAACMc3RjbwAAAAAAAAAfAAAALAAAA1UAAANyAAADhgAAA6IAAAO+AAAD0QAAA+0AAAQAAAAEHAAABC8AAARLAAAEZwAABHoAAASWAAAEqQAABMUAAATYAAAE9AAABRAAAAUjAAAFPwAABVIAAAVuAAAFgQAABZ0AAAWwAAAFzAAABegAAAX7AAAGFwAAAGJ1ZHRhAAAAWm1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAALWlsc3QAAAAlqXRvbwAAAB1kYXRhAAAAAQAAAABMYXZmNTUuMzMuMTAw"),
                this.blankVideo.appendChild(e);
            }),
            (e.prototype.initAdsLoader = function () {
              var e = this;
              this.adsLoader ||
                (window.google &&
                  ((this.adsLoader = new google.ima.AdsLoader(
                    this.adDisplayContainer
                  )),
                  this.adsLoader
                    .getSettings()
                    .setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.INSECURE),
                  this.adsLoader
                    .getSettings()
                    .setDisableCustomPlaybackForIOS10Plus(!0),
                  this.adsLoader.addEventListener(
                    google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
                    this.onAdsManagerLoaded,
                    !1,
                    this
                  ),
                  this.adsLoader.addEventListener(
                    google.ima.AdErrorEvent.Type.AD_ERROR,
                    this.onAdLoaderError,
                    !1,
                    this
                  ),
                  this.videoElement.addEventListener("onended", function () {
                    return e.adsLoader.contentComplete();
                  })));
            }),
            (e.prototype.requestAd = function (e) {
              return Ve(this, void 0, void 0, function () {
                var t;
                return Fe(this, function (n) {
                  switch (n.label) {
                    case 0:
                      return this.runningAd
                        ? [2]
                        : ((this.runningAd = !0),
                          (this.completeOnce = !0),
                          (this.videoStarted = !1),
                          this.adDisplayContainer.initialize(),
                          (this.videoElement.src = ""),
                          ((t = new google.ima.AdsRequest()).adTagUrl = e),
                          (t.linearAdSlotWidth = this.currentWidth),
                          (t.linearAdSlotHeight = this.currentHeight),
                          (t.nonLinearAdSlotWidth = this.currentWidth),
                          (t.nonLinearAdSlotHeight = this.currentHeight),
                          (t.forceNonLinearFullSlot = !0),
                          [4, this.canWeAutoPlayWithSound()]);
                    case 1:
                      return (
                        n.sent()
                          ? (t.setAdWillPlayMuted(!1),
                            (this.currentRequestIsMuted = !1))
                          : (t.setAdWillPlayMuted(!0),
                            (this.currentRequestIsMuted = !0)),
                        (this.allowedToPlayAd = !0),
                        this.adsLoader.requestAds(t),
                        [2]
                      );
                  }
                });
              });
            }),
            (e.prototype.resize = function (e, t, n) {
              void 0 === n && (n = google.ima.ViewMode.NORMAL),
                (this.currentWidth = e),
                (this.currentHeight = t),
                this.adsManager && this.adsManager.resize(e, t, n);
            }),
            (e.prototype.onAdsManagerLoaded = function (e) {
              var t = new google.ima.AdsRenderingSettings();
              (t.enablePreloading = !0),
                (t.restoreCustomPlaybackStateOnAdBreakComplete = !0),
                (t.mimeTypes =
                  V() || (0, D.Z)() || (0, j.Z)()
                    ? ["video/mp4"]
                    : ["video/mp4", "video/webm", "video/ogg"]),
                (t.loadVideoTimeout = 8e3),
                (this.adsManager = e.getAdsManager(this.videoElement, t)),
                this.adsManager.setVolume(
                  Math.max(0, Math.min(1, this.volume))
                ),
                this.currentRequestIsMuted && this.adsManager.setVolume(0),
                this.allowedToPlayAd
                  ? (this.attachAdEvents(), G.Z.dispatchEvent(r.Z.ads.ready))
                  : this.tearDown();
            }),
            (e.prototype.setVolume = function (e) {
              (this.volume = e),
                this.adsManager &&
                  this.adsManager.setVolume(
                    Math.max(0, Math.min(1, this.volume))
                  );
            }),
            (e.prototype.startPlayback = function () {
              try {
                this.adsManager.init(
                  this.currentWidth,
                  this.currentHeight,
                  google.ima.ViewMode.NORMAL
                ),
                  this.adsManager.start();
              } catch (e) {
                this.videoElement.play();
              }
            }),
            (e.prototype.startIOSPlayback = function () {
              this.adsManager.start();
            }),
            (e.prototype.stopPlayback = function () {
              G.Z.dispatchEvent(r.Z.ads.stopped), this.tearDown();
            }),
            (e.prototype.resumeAd = function () {
              G.Z.dispatchEvent(r.Z.ads.video.resumed),
                this.adsManager && this.adsManager.resume();
            }),
            (e.prototype.tearDown = function () {
              this.adsManager &&
                (this.adsManager.stop(),
                this.adsManager.destroy(),
                (this.adsManager = null)),
                null !== this.bannerTimeout &&
                  (clearTimeout(this.bannerTimeout),
                  (this.bannerTimeout = null)),
                this.adsLoader &&
                  (this.adsLoader.contentComplete(),
                  this.adsLoader.destroy(),
                  (this.adsLoader = null),
                  this.initAdsLoader()),
                (this.completeOnce = !1),
                (this.runningAd = !1);
            }),
            (e.prototype.attachAdEvents = function () {
              var e = this,
                t = google.ima.AdEvent.Type;
              this.adsManager.addEventListener(
                google.ima.AdErrorEvent.Type.AD_ERROR,
                this.onAdError,
                !1,
                this
              ),
                [
                  t.AD_PROGRESS,
                  t.ALL_ADS_COMPLETED,
                  t.CLICK,
                  t.COMPLETE,
                  t.IMPRESSION,
                  t.PAUSED,
                  t.SKIPPED,
                  t.STARTED,
                  t.USER_CLOSE,
                  t.AD_BUFFERING,
                ].forEach(function (t) {
                  e.adsManager.addEventListener(t, e.onAdEvent, !1, e);
                });
            }),
            (e.prototype.onAdEvent = function (e) {
              var t = this,
                n = e.getAd();
              switch (e.type) {
                case google.ima.AdEvent.Type.AD_PROGRESS:
                  G.Z.dispatchEvent(r.Z.ads.video.progress, e.getAdData());
                  break;
                case google.ima.AdEvent.Type.STARTED:
                  (e.remainingTime = this.adsManager.getRemainingTime()),
                    e.remainingTime <= 0 && (e.remainingTime = 15),
                    (this.videoStarted = !0),
                    n.isLinear() ||
                      (this.bannerTimeout = window.setTimeout(function () {
                        t.completeOnce &&
                          ((t.completeOnce = !1),
                          G.Z.dispatchEvent(r.Z.ads.completed, {
                            rewardAllowed: t.videoStarted && e.rewardAllowed,
                          })),
                          t.tearDown();
                      }, 1e3 * (e.remainingTime + 1))),
                    G.Z.setVideoDataAnnotations({
                      creativeId: n.getCreativeId(),
                    }),
                    G.Z.dispatchEvent(r.Z.ads.started, {
                      duration: n.getDuration(),
                    });
                  break;
                case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                case google.ima.AdEvent.Type.COMPLETE:
                  this.completeOnce &&
                    ((this.completeOnce = !1),
                    G.Z.dispatchEvent(r.Z.ads.completed, {
                      rewardAllowed: this.videoStarted,
                    })),
                    this.tearDown();
                  break;
                case google.ima.AdEvent.Type.USER_CLOSE:
                  this.completeOnce &&
                    ((this.completeOnce = !1),
                    G.Z.dispatchEvent(r.Z.ads.completed, {
                      rewardAllowed: !1,
                    })),
                    this.tearDown();
                  break;
                case google.ima.AdEvent.Type.PAUSED:
                  this.adsManager.pause(),
                    G.Z.dispatchEvent(r.Z.ads.video.paused);
                  break;
                case google.ima.AdEvent.Type.AD_BUFFERING:
                  G.Z.dispatchEvent(r.Z.ads.video.buffering);
                  break;
                case google.ima.AdEvent.Type.CLICK:
                  G.Z.dispatchEvent(r.Z.ads.video.clicked);
                  break;
                case google.ima.AdEvent.Type.SKIPPED:
                  G.Z.dispatchEvent(r.Z.ads.skipped),
                    this.completeOnce &&
                      ((this.completeOnce = !1),
                      G.Z.dispatchEvent(r.Z.ads.completed, {
                        rewardAllowed: this.videoStarted,
                      })),
                    document.activeElement && document.activeElement.blur();
                  break;
                case google.ima.AdEvent.Type.IMPRESSION:
                  G.Z.dispatchEvent(r.Z.ads.impression, {
                    creativeId: n.getCreativeId(),
                  });
              }
            }),
            (e.prototype.onAdLoaderError = function (e) {
              this.tearDown();
              var t = null == e ? void 0 : e.getError(),
                n = (null == t ? void 0 : t.toString()) || "Unknown",
                i = (null == t ? void 0 : t.getErrorCode()) || 0;
              G.Z.dispatchEvent(r.Z.ads.video.loaderError, {
                message: n,
                errorCode: i,
              });
            }),
            (e.prototype.onAdError = function (e) {
              this.tearDown();
              var t = null == e ? void 0 : e.getError(),
                n = (null == t ? void 0 : t.toString()) || "Unknown",
                i = (null == t ? void 0 : t.getErrorCode()) || 0;
              G.Z.dispatchEvent(r.Z.ads.video.error, {
                message: n,
                errorCode: i,
              });
            }),
            (e.prototype.muteAd = function () {
              void 0 !== this.adsManager &&
                null != this.adsManager &&
                this.adsManager.setVolume(0);
            }),
            (e.prototype.isAdRunning = function () {
              return this.runningAd;
            }),
            e
          );
        })();
        var He = function (e, t, n, i) {
            return new (n || (n = Promise))(function (o, r) {
              function a(e) {
                try {
                  d(i.next(e));
                } catch (e) {
                  r(e);
                }
              }
              function s(e) {
                try {
                  d(i.throw(e));
                } catch (e) {
                  r(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? o(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(a, s);
              }
              d((i = i.apply(e, t || [])).next());
            });
          },
          Xe = function (e, t) {
            var n,
              i,
              o,
              r,
              a = {
                label: 0,
                sent: function () {
                  if (1 & o[0]) throw o[1];
                  return o[1];
                },
                trys: [],
                ops: [],
              };
            return (
              (r = { next: s(0), throw: s(1), return: s(2) }),
              "function" == typeof Symbol &&
                (r[Symbol.iterator] = function () {
                  return this;
                }),
              r
            );
            function s(s) {
              return function (d) {
                return (function (s) {
                  if (n) throw new TypeError("Generator is already executing.");
                  for (; r && ((r = 0), s[0] && (a = 0)), a; )
                    try {
                      if (
                        ((n = 1),
                        i &&
                          (o =
                            2 & s[0]
                              ? i.return
                              : s[0]
                              ? i.throw || ((o = i.return) && o.call(i), 0)
                              : i.next) &&
                          !(o = o.call(i, s[1])).done)
                      )
                        return o;
                      switch (((i = 0), o && (s = [2 & s[0], o.value]), s[0])) {
                        case 0:
                        case 1:
                          o = s;
                          break;
                        case 4:
                          return a.label++, { value: s[1], done: !1 };
                        case 5:
                          a.label++, (i = s[1]), (s = [0]);
                          continue;
                        case 7:
                          (s = a.ops.pop()), a.trys.pop();
                          continue;
                        default:
                          if (
                            !((o = a.trys),
                            (o = o.length > 0 && o[o.length - 1]) ||
                              (6 !== s[0] && 2 !== s[0]))
                          ) {
                            a = 0;
                            continue;
                          }
                          if (
                            3 === s[0] &&
                            (!o || (s[1] > o[0] && s[1] < o[3]))
                          ) {
                            a.label = s[1];
                            break;
                          }
                          if (6 === s[0] && a.label < o[1]) {
                            (a.label = o[1]), (o = s);
                            break;
                          }
                          if (o && a.label < o[2]) {
                            (a.label = o[2]), a.ops.push(s);
                            break;
                          }
                          o[2] && a.ops.pop(), a.trys.pop();
                          continue;
                      }
                      s = t.call(e, a);
                    } catch (e) {
                      (s = [6, e]), (i = 0);
                    } finally {
                      n = o = 0;
                    }
                  if (5 & s[0]) throw s[1];
                  return { value: s[0] ? s[1] : void 0, done: !0 };
                })([s, d]);
              };
            }
          };
        const Ke = function () {
          var e = window.location.pathname;
          "/" !== e[0] && (e = "/".concat(e));
          var t = encodeURIComponent(
              ""
                .concat(window.location.protocol, "//")
                .concat(window.location.host)
                .concat(e)
                .concat(window.location.search)
            ),
            n = encodeURIComponent(document.referrer),
            i = "https://devs-api.poki.com/gameinfo/@sdk?href="
              .concat(t, "&referrer=")
              .concat(n);
          return fetch(i, {
            method: "GET",
            headers: { "Content-Type": "text/plain" },
          })
            .then(function (e) {
              return He(void 0, void 0, void 0, function () {
                var t;
                return Xe(this, function (n) {
                  switch (n.label) {
                    case 0:
                      return e.status >= 200 && e.status < 400
                        ? [4, e.json()]
                        : [3, 2];
                    case 1:
                      return (t = n.sent()).game_id
                        ? [
                            2,
                            {
                              gameID: t.game_id,
                              gameTitle: t.game_name,
                              playtestLobbyID: t.playtest_lobby_id,
                              cachedContentGameID: t.cached_content_game_id,
                              specialConditions:
                                t.ad_settings.special_conditions,
                              adTiming: {
                                preroll: t.ad_settings.preroll,
                                timePerTry: t.ad_settings.time_per_try,
                                timeBetweenAds: t.ad_settings.time_between_ads,
                                startAdsAfter: t.ad_settings.start_ads_after,
                              },
                            },
                          ]
                        : [2, void 0];
                    case 2:
                      throw e;
                  }
                });
              });
            })
            .catch(function (e) {
              return (function (e) {
                return He(this, void 0, void 0, function () {
                  var t, n, i, o, r, a, s, d, c, l, A, u;
                  return Xe(this, function (p) {
                    switch (p.label) {
                      case 0:
                        console.error(e), (p.label = 1);
                      case 1:
                        return (
                          p.trys.push([1, 4, , 5]),
                          "/" !== (t = window.location.pathname)[0] &&
                            (t = "/".concat(t)),
                          (o = (i = JSON).stringify),
                          (l = { c: "sdk-p4d-error", ve: 7 }),
                          (A = { k: "error" }),
                          (a = (r = JSON).stringify),
                          (u = { status: e.status }),
                          (s = e.json) ? [4, e.json()] : [3, 3]
                        );
                      case 2:
                        (s = p.sent()), (p.label = 3);
                      case 3:
                        if (
                          ((n = o.apply(i, [
                            ((l.d = [
                              ((A.v = a.apply(r, [
                                ((u.json = s),
                                (u.body = JSON.stringify({
                                  href: ""
                                    .concat(window.location.protocol, "//")
                                    .concat(window.location.host)
                                    .concat(t)
                                    .concat(window.location.search),
                                })),
                                (u.name = e.name),
                                (u.message = e.message),
                                u),
                              ])),
                              A),
                            ]),
                            l),
                          ])),
                          (d = "https://t.poki.io/l"),
                          navigator.sendBeacon)
                        )
                          navigator.sendBeacon(d, n);
                        else
                          try {
                            (c = new XMLHttpRequest()).open("POST", d, !0),
                              c.send(n);
                          } catch (e) {}
                        return [3, 5];
                      case 4:
                        return p.sent(), [3, 5];
                      case 5:
                        return [2];
                    }
                  });
                });
              })(e);
            });
        };
        var Je = function (e, t, n, i) {
            return new (n || (n = Promise))(function (o, r) {
              function a(e) {
                try {
                  d(i.next(e));
                } catch (e) {
                  r(e);
                }
              }
              function s(e) {
                try {
                  d(i.throw(e));
                } catch (e) {
                  r(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? o(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(a, s);
              }
              d((i = i.apply(e, t || [])).next());
            });
          },
          Ye = function (e, t) {
            var n,
              i,
              o,
              r,
              a = {
                label: 0,
                sent: function () {
                  if (1 & o[0]) throw o[1];
                  return o[1];
                },
                trys: [],
                ops: [],
              };
            return (
              (r = { next: s(0), throw: s(1), return: s(2) }),
              "function" == typeof Symbol &&
                (r[Symbol.iterator] = function () {
                  return this;
                }),
              r
            );
            function s(s) {
              return function (d) {
                return (function (s) {
                  if (n) throw new TypeError("Generator is already executing.");
                  for (; r && ((r = 0), s[0] && (a = 0)), a; )
                    try {
                      if (
                        ((n = 1),
                        i &&
                          (o =
                            2 & s[0]
                              ? i.return
                              : s[0]
                              ? i.throw || ((o = i.return) && o.call(i), 0)
                              : i.next) &&
                          !(o = o.call(i, s[1])).done)
                      )
                        return o;
                      switch (((i = 0), o && (s = [2 & s[0], o.value]), s[0])) {
                        case 0:
                        case 1:
                          o = s;
                          break;
                        case 4:
                          return a.label++, { value: s[1], done: !1 };
                        case 5:
                          a.label++, (i = s[1]), (s = [0]);
                          continue;
                        case 7:
                          (s = a.ops.pop()), a.trys.pop();
                          continue;
                        default:
                          if (
                            !((o = a.trys),
                            (o = o.length > 0 && o[o.length - 1]) ||
                              (6 !== s[0] && 2 !== s[0]))
                          ) {
                            a = 0;
                            continue;
                          }
                          if (
                            3 === s[0] &&
                            (!o || (s[1] > o[0] && s[1] < o[3]))
                          ) {
                            a.label = s[1];
                            break;
                          }
                          if (6 === s[0] && a.label < o[1]) {
                            (a.label = o[1]), (o = s);
                            break;
                          }
                          if (o && a.label < o[2]) {
                            (a.label = o[2]), a.ops.push(s);
                            break;
                          }
                          o[2] && a.ops.pop(), a.trys.pop();
                          continue;
                      }
                      s = t.call(e, a);
                    } catch (e) {
                      (s = [6, e]), (i = 0);
                    } finally {
                      n = o = 0;
                    }
                  if (5 & s[0]) throw s[1];
                  return { value: s[0] ? s[1] : void 0, done: !0 };
                })([s, d]);
              };
            }
          };
        function $e() {
          return Je(this, void 0, void 0, function () {
            var e, t, n, i;
            return Ye(this, function (o) {
              switch (o.label) {
                case 0:
                  return (
                    o.trys.push([0, 3, , 4]),
                    [
                      4,
                      fetch("https://geo.poki.io/", {
                        method: "GET",
                        headers: { "Content-Type": "text/plain" },
                      }),
                    ]
                  );
                case 1:
                  return [4, o.sent().json()];
                case 2:
                  return (
                    (e = o.sent()),
                    (t = e.ISO),
                    (n = e.ccpaApplies),
                    [2, { ISO: t, ccpaApplies: n }]
                  );
                case 3:
                  return (
                    (i = o.sent()),
                    console.error(i),
                    [2, { ISO: Qe.D, ccpaApplies: !1 }]
                  );
                case 4:
                  return [2];
              }
            });
          });
        }
        var et = function (e, t, n, i) {
            return new (n || (n = Promise))(function (o, r) {
              function a(e) {
                try {
                  d(i.next(e));
                } catch (e) {
                  r(e);
                }
              }
              function s(e) {
                try {
                  d(i.throw(e));
                } catch (e) {
                  r(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? o(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(a, s);
              }
              d((i = i.apply(e, t || [])).next());
            });
          },
          tt = function (e, t) {
            var n,
              i,
              o,
              r,
              a = {
                label: 0,
                sent: function () {
                  if (1 & o[0]) throw o[1];
                  return o[1];
                },
                trys: [],
                ops: [],
              };
            return (
              (r = { next: s(0), throw: s(1), return: s(2) }),
              "function" == typeof Symbol &&
                (r[Symbol.iterator] = function () {
                  return this;
                }),
              r
            );
            function s(s) {
              return function (d) {
                return (function (s) {
                  if (n) throw new TypeError("Generator is already executing.");
                  for (; r && ((r = 0), s[0] && (a = 0)), a; )
                    try {
                      if (
                        ((n = 1),
                        i &&
                          (o =
                            2 & s[0]
                              ? i.return
                              : s[0]
                              ? i.throw || ((o = i.return) && o.call(i), 0)
                              : i.next) &&
                          !(o = o.call(i, s[1])).done)
                      )
                        return o;
                      switch (((i = 0), o && (s = [2 & s[0], o.value]), s[0])) {
                        case 0:
                        case 1:
                          o = s;
                          break;
                        case 4:
                          return a.label++, { value: s[1], done: !1 };
                        case 5:
                          a.label++, (i = s[1]), (s = [0]);
                          continue;
                        case 7:
                          (s = a.ops.pop()), a.trys.pop();
                          continue;
                        default:
                          if (
                            !((o = a.trys),
                            (o = o.length > 0 && o[o.length - 1]) ||
                              (6 !== s[0] && 2 !== s[0]))
                          ) {
                            a = 0;
                            continue;
                          }
                          if (
                            3 === s[0] &&
                            (!o || (s[1] > o[0] && s[1] < o[3]))
                          ) {
                            a.label = s[1];
                            break;
                          }
                          if (6 === s[0] && a.label < o[1]) {
                            (a.label = o[1]), (o = s);
                            break;
                          }
                          if (o && a.label < o[2]) {
                            (a.label = o[2]), a.ops.push(s);
                            break;
                          }
                          o[2] && a.ops.pop(), a.trys.pop();
                          continue;
                      }
                      s = t.call(e, a);
                    } catch (e) {
                      (s = [6, e]), (i = 0);
                    } finally {
                      n = o = 0;
                    }
                  if (5 & s[0]) throw s[1];
                  return { value: s[0] ? s[1] : void 0, done: !0 };
                })([s, d]);
              };
            }
          };
        function nt() {
          var e, t;
          return et(this, void 0, void 0, function () {
            var n, i, o, r, a;
            return tt(this, function (s) {
              switch (s.label) {
                case 0:
                  if (
                    "test" ===
                    (null ===
                      (t =
                        null ===
                          (e =
                            null === window || void 0 === window
                              ? void 0
                              : window.process) || void 0 === e
                          ? void 0
                          : e.env) || void 0 === t
                      ? void 0
                      : t.NODE_ENV)
                  )
                    return [
                      2,
                      {
                        blocklist: [],
                        countryExclusion: [],
                        bidderLimitation: {},
                      },
                    ];
                  s.label = 1;
                case 1:
                  return (
                    s.trys.push([1, 4, , 5]),
                    [
                      4,
                      fetch("https://api.poki.com/ads/settings", {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                      }),
                    ]
                  );
                case 2:
                  return [4, s.sent().json()];
                case 3:
                  return (
                    (n = s.sent()),
                    (i = n.blocklist),
                    (o = n.country_exclusion),
                    (r = n.bidder_limitation),
                    [
                      2,
                      {
                        blocklist:
                          (null == i ? void 0 : i.split(/[\r\n]+/)) || [],
                        countryExclusion: (o.split(",") || []).map(function (
                          e
                        ) {
                          return e.toUpperCase();
                        }),
                        bidderLimitation: JSON.parse(r || "{}"),
                      },
                    ]
                  );
                case 4:
                  return (
                    (a = s.sent()),
                    console.error(a),
                    [
                      2,
                      {
                        blocklist: [],
                        countryExclusion: [],
                        bidderLimitation: {},
                      },
                    ]
                  );
                case 5:
                  return [2];
              }
            });
          });
        }
        var it = function () {
          return (
            (it =
              Object.assign ||
              function (e) {
                for (var t, n = 1, i = arguments.length; n < i; n++)
                  for (var o in (t = arguments[n]))
                    Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
                return e;
              }),
            it.apply(this, arguments)
          );
        };
        var ot = (function () {
          function e() {
            (this.slotMap = new Map()),
              (this.enforceChildSafety = function () {
                window.googletag.cmd.push(function () {
                  window.googletag
                    .pubads()
                    .setPrivacySettings({
                      underAgeOfConsent: !0,
                      childDirectedTreatment: !0,
                      restrictDataProcessing: !0,
                    });
                });
              }),
              (this.enforceNonPersonalized = function () {
                window.googletag.cmd.push(function () {
                  window.googletag
                    .pubads()
                    .setPrivacySettings({ nonPersonalizedAds: !0 });
                });
              }),
              (this.requestAd = function (e) {
                var t, n;
                a.Z.track(r.Z.tracking.ads.display.requested, {
                  size: e.size,
                  opportunityId: e.opportunityId,
                  adUnitPath: e.adUnitPath,
                  duringGameplay:
                    null === (t = e.duringGameplay) || void 0 === t
                      ? void 0
                      : t.call(e),
                  refresh: e.refreshNumber > 0,
                  refreshNumber: e.refreshNumber,
                  refreshType:
                    (null === (n = e.criteria) || void 0 === n
                      ? void 0
                      : n.refreshType) || "",
                  platformAd: e.platformAd,
                });
                var i = 0,
                  o = re(),
                  s = function () {
                    if (!(--i > 0)) {
                      if (window.apstag)
                        try {
                          window.apstag.setDisplayBids();
                        } catch (e) {}
                      if (o)
                        try {
                          window.pbjs.setTargetingForGPTAsync([e.adUnitPath]),
                            (e.pbjsTargetting =
                              window.pbjs.getAdserverTargetingForAdUnitCode([
                                e.adUnitPath,
                              ]));
                        } catch (e) {}
                      e.refreshNumber > 0
                        ? window.googletag.pubads().refresh([e.gptSlot])
                        : window.googletag.display(e.id);
                    }
                  };
                if ((window.apstag && i++, o && i++, window.apstag))
                  try {
                    window.apstag.fetchBids(
                      {
                        slots: [
                          {
                            slotName: e.adUnitPath,
                            slotID: e.id,
                            sizes: [[e.width, e.height]],
                          },
                        ],
                        timeout: 1500,
                      },
                      function () {
                        s();
                      }
                    );
                  } catch (e) {
                    s();
                  }
                if (o)
                  try {
                    window.pbjs.requestBids({
                      adUnitCodes: [e.adUnitPath],
                      bidsBackHandler: function () {
                        s();
                      },
                    });
                  } catch (e) {
                    s();
                  }
                window.apstag || o || s();
              }),
              (this.requestHouseAd = function (e, t) {
                var n = it(it({}, t), {
                  dfpIsBackfill: void 0,
                  dfpLineItemId: void 0,
                  dfpCampaignId: void 0,
                  size: "".concat(e.width, "x").concat(e.height),
                  bidder: "poki",
                  bid: 0,
                });
                (0, q.Z)(it(it({}, n), { event: "request" })),
                  fetch(
                    "https://api.poki.com/ads/houseads/display/"
                      .concat(e.width, "x")
                      .concat(e.height, "?game_id=")
                      .concat(s.Z.gameID, "&site=")
                      .concat(s.Z.siteID)
                  )
                    .then(function (e) {
                      return e.json();
                    })
                    .then(function (i) {
                      (e.innerAdContainer.innerHTML = '<a href="'
                        .concat(
                          i.click_through_url,
                          '" target="_blank"><img src="'
                        )
                        .concat(i.asset, '" alt="house ad" /></a>')),
                        (t.houseAdId = i.id),
                        a.Z.track(r.Z.tracking.ads.display.impression, t),
                        (0, q.Z)(it(it({}, n), { event: "impression" })),
                        setTimeout(function () {
                          (0, q.Z)(it(it({}, n), { event: "viewable" }));
                        }, 1e3);
                    });
              });
          }
          return (
            (e.prototype.callOnCanDestroy = function (e) {
              var t = this.slotMap.get(e);
              t &&
                !t.onCanDestroyCalled &&
                t.onCanDestroy &&
                ((t.onCanDestroyCalled = !0), t.onCanDestroy());
            }),
            (e.prototype.setupSlotRenderEndedListener = function () {
              var e = this;
              window.googletag.cmd.push(function () {
                window.googletag
                  .pubads()
                  .addEventListener("slotRenderEnded", function (t) {
                    var n,
                      i,
                      o,
                      s,
                      d,
                      c = t.slot.getSlotElementId(),
                      l = e.slotMap.get(c);
                    if (l && l.gptSlot) {
                      var A = t.slot || {},
                        u =
                          (null === (n = A.getResponseInformation) ||
                          void 0 === n
                            ? void 0
                            : n.call(A)) || {},
                        p = u.isBackfill,
                        h = u.lineItemId,
                        m = u.campaignId,
                        g = (function (e) {
                          if (!e || "function" != typeof e.indexOf) return null;
                          if (
                            -1 !== e.indexOf("amazon-adsystem.com/aax2/apstag")
                          )
                            return null;
                          var t = new RegExp(
                              '(?:(?:pbjs\\.renderAd\\(document,|adId:*|hb_adid":\\[)|(?:pbadid=)|(?:adId=))[\'"](.*?)["\']',
                              "gi"
                            ),
                            n = e.replace(/ /g, ""),
                            i = t.exec(n);
                          return (i && i[1]) || null;
                        })(
                          null === (o = (i = A).getHtml) || void 0 === o
                            ? void 0
                            : o.call(i)
                        ),
                        v = !!g,
                        f = l.pbjsTargetting || {},
                        y = f.hb_bidder,
                        w = f.hb_adomain,
                        b = (function (e) {
                          var t,
                            n = { cpm: 0 };
                          if (void 0 === window.pbjs || !re()) return n;
                          var i = window.pbjs.getAllWinningBids() || [];
                          return (
                            (
                              (null ===
                                (t =
                                  window.pbjs.getBidResponsesForAdUnitCode(
                                    e
                                  )) || void 0 === t
                                ? void 0
                                : t.bids) || []
                            ).forEach(function (e) {
                              !i.find(function (t) {
                                return t.adId === e.adId;
                              }) &&
                                e.cpm > n.cpm &&
                                (n = e);
                            }),
                            n
                          );
                        })(l.adUnitPath),
                        k = t.isEmpty,
                        Z = parseFloat(f.hb_pb);
                      isNaN(Z) && (Z = void 0);
                      var E = {
                        size: l.size,
                        opportunityId: l.opportunityId,
                        refresh: l.refreshNumber > 0,
                        refreshNumber: l.refreshNumber,
                        refreshType:
                          (null === (s = l.criteria) || void 0 === s
                            ? void 0
                            : s.refreshType) || "",
                        duringGameplay:
                          null === (d = l.duringGameplay) || void 0 === d
                            ? void 0
                            : d.call(l),
                        adUnitPath: l.adUnitPath,
                        prebidBid: Z,
                        prebidBidder: y,
                        prebidWon: v,
                        prebidSecondBid: b.cpm > 0 ? b.cpm : void 0,
                        prebidSecondBidder: b.bidder,
                        dfpIsBackfill: p,
                        dfpLineItemId: h,
                        dfpCampaignId: m,
                        isEmpty: k,
                        adDomain: w,
                        platformAd: l.platformAd,
                      };
                      l.onDisplayRendered && l.onDisplayRendered(k),
                        k && e.callOnCanDestroy(l.id),
                        k && l.backfillHouseads
                          ? e.requestHouseAd(l, E)
                          : a.Z.track(r.Z.tracking.ads.display.impression, E);
                    }
                  }),
                  window.googletag
                    .pubads()
                    .addEventListener("impressionViewable", function (t) {
                      var n,
                        i,
                        o,
                        s,
                        d = t.slot.getSlotElementId();
                      ((null ===
                        (i =
                          null === (n = null == t ? void 0 : t.slot) ||
                          void 0 === n
                            ? void 0
                            : n.getAdUnitPath()) || void 0 === i
                        ? void 0
                        : i.includes("ingame_rewarded_google")) ||
                        (null ===
                          (s =
                            null === (o = null == t ? void 0 : t.slot) ||
                            void 0 === o
                              ? void 0
                              : o.getAdUnitPath()) || void 0 === s
                          ? void 0
                          : s.includes("sanghan_rweb_ad_unit"))) &&
                        a.Z.track(r.Z.tracking.ads.rewardedWeb.impression),
                        setTimeout(function () {
                          e.callOnCanDestroy(d);
                        }, 1e3 * Math.random());
                    });
              });
            }),
            (e.prototype.validateDisplaySettings = function (e) {
              return (0, D.Z)() || (0, j.Z)()
                ? ["320x50"].includes(e)
                : [
                    "970x250",
                    "300x250",
                    "728x90",
                    "160x600",
                    "320x50",
                  ].includes(e);
            }),
            (e.prototype.getDisplaySlotConfig = function (e, t, n) {
              var i = s.Z.device,
                o = t.split("x").map(function (e) {
                  return parseInt(e, 10);
                }),
                r = this.getDisplaySlotID(e);
              if (r) {
                var a = this.slotMap.get(r);
                if (a && a.width === o[0] && a.height === o[1])
                  return a.refreshNumber++, a;
                this.clearAd(e);
              }
              var c = "/".concat(R, "/debug-display/debug-display-").concat(t);
              d.Z.debug ||
                (c = s.Z.isPokiIframe
                  ? "/"
                      .concat(R, "/")
                      .concat(i, "_ingame_")
                      .concat(t, "/")
                      .concat(s.Z.siteID, "_")
                      .concat(i, "_ingame_")
                      .concat(t)
                  : n ||
                    "/"
                      .concat(R, "/external_")
                      .concat(i, "_display_ingame/external_")
                      .concat(i, "_ingame_")
                      .concat(t));
              var l = "poki-".concat(M()),
                A = document.createElement("div");
              return (
                (A.id = l),
                (A.className = "poki-ad-slot"),
                (A.style.width = "".concat(o[0], "px")),
                (A.style.height = "".concat(o[1], "px")),
                (A.style.overflow = "hidden"),
                (A.style.position = "relative"),
                A.setAttribute("data-poki-ad-size", t),
                {
                  id: l,
                  adUnitPath: c,
                  size: t,
                  width: o[0],
                  height: o[1],
                  refreshNumber: 0,
                  onCanDestroyCalled: !1,
                  backfillHouseads: !1,
                  innerAdContainer: A,
                  criteria: {},
                  platformAd: !1,
                }
              );
            }),
            (e.prototype.renderAd = function (e) {
              var t,
                n = this,
                i = e.container,
                o = e.size,
                r = e.opportunityId,
                a = e.criteria,
                s = void 0 === a ? {} : a,
                c = e.adUnitPath,
                l = void 0 === c ? "" : c,
                A = e.duringGameplay,
                u =
                  void 0 === A
                    ? function () {
                        return !1;
                      }
                    : A,
                p = e.onCanDestroy,
                h = void 0 === p ? function () {} : p,
                m = e.onDisplayRendered,
                g = void 0 === m ? function () {} : m,
                v = e.backfillHouseads,
                f = void 0 !== v && v,
                y = e.platformAd,
                w = void 0 !== y && y,
                b = this.getDisplaySlotConfig(i, o, l);
              (b.backfillHouseads = f),
                (b.criteria = s),
                (b.platformAd = w),
                this.slotMap.set(b.id, b),
                (b.opportunityId = r),
                (b.duringGameplay = u),
                (b.onDisplayRendered = g),
                (b.onCanDestroy = h);
              var k = null;
              b.refreshNumber > 0 && (k = b.innerAdContainer),
                k ||
                  (i.appendChild(b.innerAdContainer),
                  i.setAttribute("data-poki-ad-id", b.id)),
                (b.intersectionObserver = new window.IntersectionObserver(
                  function (e) {
                    var t;
                    e[0].isIntersecting &&
                      (null === (t = b.intersectionObserver) ||
                        void 0 === t ||
                        t.disconnect(),
                      setTimeout(function () {
                        n.callOnCanDestroy(b.id);
                      }, 6e3),
                      window.googletag.cmd.push(function () {
                        var e,
                          t,
                          i = n.slotMap.get(b.id);
                        i &&
                          i.opportunityId === r &&
                          (n.setupGPT(b, s),
                          d.Z.debug
                            ? n.requestHouseAd(b, {
                                opportunityId: b.opportunityId,
                                refresh: b.refreshNumber > 0,
                                refreshNumber: b.refreshNumber,
                                refreshType:
                                  (null === (e = b.criteria) || void 0 === e
                                    ? void 0
                                    : e.refreshType) || "",
                                duringGameplay:
                                  null === (t = b.duringGameplay) ||
                                  void 0 === t
                                    ? void 0
                                    : t.call(b),
                                adUnitPath: b.adUnitPath,
                                platformAd: b.platformAd,
                              })
                            : n.requestAd(b));
                      }));
                  },
                  { threshold: 0.5 }
                )),
                null === (t = b.intersectionObserver) ||
                  void 0 === t ||
                  t.disconnect(),
                b.intersectionObserver.observe(b.innerAdContainer);
            }),
            (e.prototype.setupGPT = function (e, t) {
              var n;
              e.gptSlot ||
                (160 === e.width && 600 === e.height
                  ? (e.gptSlot = window.googletag
                      .defineSlot(
                        e.adUnitPath,
                        [[e.width, e.height], "fluid"],
                        e.id
                      )
                      .addService(window.googletag.pubads()))
                  : (e.gptSlot = window.googletag
                      .defineSlot(e.adUnitPath, [e.width, e.height], e.id)
                      .addService(window.googletag.pubads()))),
                window.googletag.enableServices(),
                null === (n = e.gptSlot) || void 0 === n || n.clearTargeting(),
                Object.keys(t).forEach(function (n) {
                  var i,
                    o = t[n];
                  "" !== o &&
                    (null === (i = e.gptSlot) ||
                      void 0 === i ||
                      i.setTargeting(n, o));
                });
            }),
            (e.prototype.clearAd = function (e) {
              var t,
                n = this.getDisplaySlotID(e);
              if (n) {
                var i = this.slotMap.get(n) || null;
                if (i) {
                  for (
                    i.onCanDestroy &&
                      !i.onCanDestroyCalled &&
                      console.warn(
                        "destroyAd called without waiting for onCanDestroy"
                      ),
                      a.Z.track(r.Z.tracking.screen.destroyAd, {
                        opportunityId: i.opportunityId,
                        okToDestroy: i.onCanDestroyCalled,
                        platformAd: i.platformAd,
                      }),
                      null === (t = i.intersectionObserver) ||
                        void 0 === t ||
                        t.disconnect(),
                      i.gptSlot && googletag.destroySlots([i.gptSlot]);
                    e.lastChild;

                  )
                    e.removeChild(e.lastChild);
                  e.removeAttribute("data-poki-ad-id"),
                    this.slotMap.delete(i.id);
                }
              } else
                console.error("destroyAd called on a container without ad");
            }),
            (e.prototype.getDisplaySlotID = function (e) {
              if (!e) return null;
              var t = e.getAttribute("data-poki-ad-id");
              return t || null;
            }),
            e
          );
        })();
        const rt = ot;
        var at,
          st =
            ((at = function (e, t) {
              return (
                (at =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (e, t) {
                      e.__proto__ = t;
                    }) ||
                  function (e, t) {
                    for (var n in t)
                      Object.prototype.hasOwnProperty.call(t, n) &&
                        (e[n] = t[n]);
                  }),
                at(e, t)
              );
            }),
            function (e, t) {
              if ("function" != typeof t && null !== t)
                throw new TypeError(
                  "Class extends value " +
                    String(t) +
                    " is not a constructor or null"
                );
              function n() {
                this.constructor = e;
              }
              at(e, t),
                (e.prototype =
                  null === t
                    ? Object.create(t)
                    : ((n.prototype = t.prototype), new n()));
            }),
          dt = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t.waitUntilReady = function (e) {
                  window.pbjs.que.push(function () {
                    e();
                  });
                }),
                (t.requestAd = function (e) {
                  (0, q.Z)({
                    event: "request",
                    size: e.size,
                    opportunityId: e.opportunityId,
                    adUnitPath: e.adUnitPath,
                  });
                  var n = 1,
                    i = function () {
                      --n > 0 || t.allBidsBack(e.id);
                    };
                  if (window.apstag) {
                    n++;
                    try {
                      window.apstag.fetchBids(
                        {
                          slots: [
                            {
                              slotName: e.adUnitPath,
                              slotID: e.id,
                              sizes: [[e.width, e.height]],
                            },
                          ],
                          timeout: 1500,
                        },
                        function (t) {
                          t && t.length > 0 && (e.amznTargetting = t[0]), i();
                        }
                      );
                    } catch (e) {
                      i();
                    }
                  }
                  window.pbjs.requestBids({
                    adUnitCodes: [e.adUnitPath],
                    bidsBackHandler: function () {
                      (e.pbjsTargetting =
                        window.pbjs.getAdserverTargetingForAdUnitCode([
                          e.adUnitPath,
                        ])),
                        i();
                    },
                  });
                }),
                (t.setupGPT = function (e, t) {}),
                (t.setupSlotRenderEndedListener = function () {}),
                t
              );
            }
            return (
              st(t, e),
              (t.prototype.allBidsBack = function (e) {
                var t,
                  n,
                  i,
                  o,
                  s = this,
                  d = this.slotMap.get(e);
                if (d) {
                  var c = document.createElement("iframe");
                  c.setAttribute("frameborder", "0"),
                    c.setAttribute("scrolling", "no"),
                    c.setAttribute("marginheight", "0"),
                    c.setAttribute("marginwidth", "0"),
                    c.setAttribute("topmargin", "0"),
                    c.setAttribute("leftmargin", "0"),
                    c.setAttribute("allowtransparency", "true"),
                    c.setAttribute("width", "".concat(d.width)),
                    c.setAttribute("height", "".concat(d.height));
                  var l = document.getElementById(d.id);
                  if (l) {
                    l.appendChild(c);
                    var A =
                      null === (t = null == c ? void 0 : c.contentWindow) ||
                      void 0 === t
                        ? void 0
                        : t.document;
                    if (!A)
                      return (
                        console.error(
                          "Display error - iframe injection for ad failed",
                          e
                        ),
                        void this.clearAd(l.parentNode)
                      );
                    var u = !0,
                      p = d.pbjsTargetting.hb_bidder,
                      h = parseFloat(d.pbjsTargetting.hb_pb);
                    isNaN(h) && (h = 0);
                    var m,
                      g,
                      v =
                        ((m =
                          null ===
                            (n = null == d ? void 0 : d.amznTargetting) ||
                          void 0 === n
                            ? void 0
                            : n.amznbid),
                        ee[m] || 0);
                    v > h
                      ? ((g =
                          null ===
                            (i = null == d ? void 0 : d.amznTargetting) ||
                          void 0 === i
                            ? void 0
                            : i.amnzp),
                        (p = te[g] || "Amazon"),
                        (h = v),
                        (u = !1),
                        this.renderAMZNAd(d.id, l, A))
                      : this.renderPrebidAd(d.id, l, A);
                    var f = !p;
                    a.Z.track(r.Z.tracking.ads.display.impression, {
                      size: d.size,
                      opportunityId: d.opportunityId,
                      duringGameplay:
                        null === (o = d.duringGameplay) || void 0 === o
                          ? void 0
                          : o.call(d),
                      adUnitPath: d.adUnitPath,
                      prebidBid: h,
                      prebidBidder: p,
                      preBidWon: u,
                      dfpIsBackfill: !1,
                      dfpLineItemId: void 0,
                      dfpCampaignId: void 0,
                      adDomain: d.pbjsTargetting.hb_adomain,
                      isEmpty: f,
                    }),
                      (0, q.Z)({
                        event: "impression",
                        size: d.size,
                        opportunityId: d.opportunityId,
                        adUnitPath: d.adUnitPath,
                        bidder: p,
                        bid: h,
                      }),
                      d.onDisplayRendered && d.onDisplayRendered(f),
                      f
                        ? this.callOnCanDestroy(d.id)
                        : ((d.intersectionObserver = new IntersectionObserver(
                            function (e) {
                              e.forEach(function (e) {
                                e.isIntersecting
                                  ? d.intersectingTimer ||
                                    (d.intersectingTimer = setTimeout(
                                      function () {
                                        var t;
                                        null === (t = d.intersectionObserver) ||
                                          void 0 === t ||
                                          t.unobserve(e.target),
                                          (0, q.Z)({
                                            event: "viewable",
                                            size: d.size,
                                            opportunityId: d.opportunityId,
                                            adUnitPath: d.adUnitPath,
                                            bidder: p,
                                            bid: h,
                                          }),
                                          s.callOnCanDestroy(d.id);
                                      },
                                      1e3
                                    ))
                                  : d.intersectingTimer &&
                                    (clearTimeout(d.intersectingTimer),
                                    (d.intersectingTimer = void 0));
                              });
                            },
                            { threshold: 0.5 }
                          )),
                          d.intersectionObserver.observe(l));
                  } else
                    console.error("Display error - container not found", e);
                }
              }),
              (t.prototype.renderPrebidAd = function (e, t, n) {
                var i = this.slotMap.get(e);
                if (i)
                  return i.pbjsTargetting.hb_adid
                    ? void window.pbjs.renderAd(n, i.pbjsTargetting.hb_adid)
                    : (console.error(
                        "Display info - prebid nothing to render",
                        e,
                        i.pbjsTargetting
                      ),
                      void this.clearAd(t.parentNode));
              }),
              (t.prototype.renderAMZNAd = function (e, t, n) {
                var i,
                  o,
                  r = this.slotMap.get(e);
                if (r)
                  return (
                    null === (i = null == r ? void 0 : r.amznTargetting) ||
                    void 0 === i
                      ? void 0
                      : i.amzniid
                  )
                    ? void window.apstag.renderImp(
                        n,
                        null === (o = null == r ? void 0 : r.amznTargetting) ||
                          void 0 === o
                          ? void 0
                          : o.amzniid
                      )
                    : (console.error(
                        "Display info - amazon nothing to render",
                        e,
                        r.pbjsTargetting
                      ),
                      void this.clearAd(t.parentNode));
              }),
              t
            );
          })(rt);
        const ct = dt;
        n(640);
        var lt = function () {
            return (
              (lt =
                Object.assign ||
                function (e) {
                  for (var t, n = 1, i = arguments.length; n < i; n++)
                    for (var o in (t = arguments[n]))
                      Object.prototype.hasOwnProperty.call(t, o) &&
                        (e[o] = t[o]);
                  return e;
                }),
              lt.apply(this, arguments)
            );
          },
          At = function (e, t, n) {
            if (n || 2 === arguments.length)
              for (var i, o = 0, r = t.length; o < r; o++)
                (!i && o in t) ||
                  (i || (i = Array.prototype.slice.call(t, 0, o)),
                  (i[o] = t[o]));
            return e.concat(i || Array.prototype.slice.call(t));
          },
          ut = (function () {
            function e() {
              var e = this;
              (this.autoStartOnReady = !1),
                (this.criteria = {}),
                (this.handlers = {}),
                (this.initializingPromise = null),
                (this.isInitialized = !1),
                (this.sdkBooted = !1),
                (this.startAdEnabled = !1),
                (this.startStartAdsAfterTimerOnInit = !1),
                (this.initOptions = {}),
                (this.adSettings = {
                  blocklist: [],
                  countryExclusion: [],
                  bidderLimitation: {},
                }),
                (this.adReady = !1),
                (this.sdkImaError = !1),
                (this.displayOnly = !1),
                (this.sdkNotBootedButCalled = function () {
                  console.error("The Poki SDK has not yet been initialized");
                }),
                (this.genericCriteria = function () {
                  var t = {};
                  return (
                    (t.tag = s.Z.tag),
                    (t.tag_site = "".concat(s.Z.tag, "|").concat(s.Z.siteID)),
                    (t.site_id = encodeURIComponent(s.Z.siteID)),
                    (t.categories = encodeURIComponent(s.Z.categories)),
                    s.Z.experiment &&
                      (t.experiment = encodeURIComponent(s.Z.experiment)),
                    s.Z.specialCondition &&
                    e.specialConditions &&
                    e.specialConditions.includes(s.Z.specialCondition)
                      ? "landing" === s.Z.specialCondition
                        ? (t.p4d_game_id_cond = "".concat(s.Z.gameID, "|l"))
                        : "crosspromo" === s.Z.specialCondition
                        ? (t.p4d_game_id_cond = "".concat(s.Z.gameID, "|cp"))
                        : (t.p4d_game_id = s.Z.gameID)
                      : (t.p4d_game_id = s.Z.gameID),
                    t
                  );
                }),
                (this.display = ge() ? new ct() : new rt());
            }
            return (
              (e.prototype.init = function (e) {
                if ((void 0 === e && (e = {}), "undefined" != typeof window)) {
                  var t = e.onReady,
                    n = void 0 === t ? null : t,
                    i = e.onAdblocked,
                    o = void 0 === i ? null : i;
                  return (
                    (this.initOptions = e),
                    n && this.registerHandler("onReady", n),
                    o && this.registerHandler("onAdblocked", o),
                    this.isInitialized
                      ? console.error("Poki SDK has already been initialized")
                      : (this.initializingPromise ||
                          (this.initializingPromise =
                            this.loadMonetizationCore()),
                        this.initializingPromise)
                  );
                }
              }),
              (e.prototype.loadMonetizationCore = function () {
                var e = this,
                  t = this.initOptions,
                  i = t.prebid,
                  o = void 0 === i ? {} : i,
                  c = t.a9,
                  l = void 0 === c ? {} : c,
                  A = t.volume,
                  u = void 0 === A ? 1 : A,
                  p = t.waterfallRetries,
                  h = t.wrapper,
                  m = t.debug,
                  g = void 0 === m ? void 0 : m,
                  v = t.logging,
                  f = void 0 === v ? void 0 : v,
                  y = t.displayOnly,
                  k = void 0 !== y && y,
                  Z = t.nonPersonalized,
                  E = void 0 !== Z && Z;
                (this.displayOnly = k),
                  (window.googletag = window.googletag || { cmd: [] }),
                  (window.pbjs = window.pbjs || { que: [] }),
                  d.Z.init(g, f),
                  this.setupDefaultEvents(),
                  a.Z.setupDefaultEvents(),
                  w(),
                  window.addEventListener("resize", this.resize.bind(this), !1);
                var I = lt({}, L),
                  x = Ke;
                (d.Z.debug || s.Z.isPlayground) &&
                  (x = function () {
                    return Promise.resolve();
                  });
                var C = s.Z.ccpaApplies,
                  _ =
                    void 0 !== this.initOptions.isCCPA
                      ? this.initOptions.isCCPA
                      : "" !== C
                      ? "1" === C
                      : void 0,
                  S = $e,
                  T = (this.initOptions.country || s.Z.country).toUpperCase();
                T &&
                  void 0 !== _ &&
                  (S = function () {
                    return Promise.resolve({ ISO: T, ccpaApplies: _ });
                  });
                var z = [x(), S()],
                  M = At(At([], z, !0), [nt()], !1);
                return (
                  M.push(
                    (0, P.Z)(
                      "https://securepubads.g.doubleclick.net/tag/js/gpt.js"
                    )
                  ),
                  k ||
                    M.push(
                      (0, P.Z)(
                        "https://imasdk.googleapis.com/js/sdkloader/ima3.js"
                      )
                    ),
                  s.Z.childDirected || E
                    ? (s.Z.childDirected && this.display.enforceChildSafety(),
                      (0, s.w)("nonPersonalized", "true"),
                      this.display.enforceNonPersonalized())
                    : M.push(
                        (0, P.Z)("https://a.poki.com/prebid/prebid7.22.0.js"),
                        (0, P.Z)("https://c.amazon-adsystem.com/aax2/apstag.js")
                      ),
                  this.display.setupSlotRenderEndedListener(),
                  (Promise.allSettled =
                    Promise.allSettled ||
                    function (e) {
                      return Promise.all(
                        e.map(function (e) {
                          return e
                            .then(function (e) {
                              return { status: "fulfilled", value: e };
                            })
                            .catch(function (e) {
                              return { status: "rejected", reason: e };
                            });
                        })
                      );
                    }),
                  Promise.allSettled(M)
                    .then(function (t) {
                      var i, c, A;
                      try {
                        var m = t[0],
                          g = t[1],
                          v = t[2],
                          f = t[3],
                          y = t[4];
                        if ("fulfilled" === m.status) {
                          var w = m.value;
                          if (w) {
                            s.Z.gameID || (0, s.w)("gameID", w.gameID),
                              w.cachedContentGameID &&
                                (0, s.w)(
                                  "contentGameID",
                                  w.cachedContentGameID
                                ),
                              (I.adTiming = w.adTiming),
                              (e.specialConditions = w.specialConditions);
                            var Z = (function (e) {
                              var t,
                                n = s.Z.playtest;
                              if (n) return n;
                              if (
                                (n = null == e ? void 0 : e.playtestLobbyID)
                              ) {
                                var i =
                                  "4g" ===
                                    (null === (t = navigator.connection) ||
                                    void 0 === t
                                      ? void 0
                                      : t.effectiveType) &&
                                  !(0, D.Z)() &&
                                  !(0, j.Z)() &&
                                  s.Z.isPokiIframe &&
                                  !B &&
                                  "GB" !== s.Z.country;
                                return (
                                  a.Z.track(r.Z.tracking.playtest.showModal, {
                                    show: i,
                                  }),
                                  i ? n : null
                                );
                              }
                            })(w);
                            Z &&
                              n
                                .e(725)
                                .then(n.bind(n, 725))
                                .then(function (e) {
                                  (0, e.initPlaytest)(w, Z);
                                });
                          }
                          if (
                            !(
                              (w && w.gameID) ||
                              d.Z.debug ||
                              (null === window || void 0 === window
                                ? void 0
                                : window.isPokiPlayground) ||
                              "test" ===
                                (null ===
                                  (c =
                                    null ===
                                      (i =
                                        null === window || void 0 === window
                                          ? void 0
                                          : window.process) || void 0 === i
                                      ? void 0
                                      : i.env) || void 0 === c
                                  ? void 0
                                  : c.NODE_ENV)
                            )
                          ) {
                            var E =
                              "background-color: red; border-radius: 3px; color: white; padding: 1px 5px";
                            console.error(
                              "%cWARNING",
                              E,
                              "❗ This game is being played on an unauthorized site!"
                            ),
                              console.error(
                                "%cWARNING",
                                E,
                                "❗ This game is only allowed to be played on poki.com"
                              ),
                              console.error(
                                "%cWARNING",
                                E,
                                "❗ If you are the owner of this website, remove this game. Consider this a DMCA Takedown notice."
                              );
                          }
                        }
                        var x = { ISO: "ZZ", ccpaApplies: !1 };
                        if (
                          ("fulfilled" === g.status && (x = g.value),
                          (0, s.w)(
                            "country",
                            (
                              T ||
                              (null == x ? void 0 : x.ISO) ||
                              "ZZ"
                            ).toUpperCase()
                          ),
                          (0, s.w)("gdprApplies", (0, Qe.M)(s.Z.country)),
                          (0, s.w)(
                            "ccpaApplies",
                            void 0 === _
                              ? (null == x ? void 0 : x.ccpaApplies) || !1
                              : _
                          ),
                          b(),
                          "fulfilled" === v.status)
                        ) {
                          var C = v.value;
                          C && (e.adSettings = C);
                        }
                        if (
                          ((A = e.adSettings.blocklist),
                          (ie = A || []),
                          "rejected" === f.status)
                        )
                          return void G.Z.dispatchEvent(r.Z.adblocked);
                        if (
                          (ue(o, e.adSettings.bidderLimitation),
                          he(l, e.adSettings.bidderLimitation),
                          "desktop" !== we &&
                            window.googletag.cmd.push(function () {
                              googletag
                                .pubads()
                                .addEventListener(
                                  "rewardedSlotReady",
                                  function (e) {
                                    a.Z.track(
                                      r.Z.tracking.ads.rewardedWeb.ready
                                    ),
                                      e.makeRewardedVisible();
                                  }
                                ),
                                googletag
                                  .pubads()
                                  .addEventListener(
                                    "rewardedSlotGranted",
                                    function () {
                                      fe = !0;
                                    }
                                  ),
                                googletag
                                  .pubads()
                                  .addEventListener(
                                    "rewardedSlotClosed",
                                    function () {
                                      fe
                                        ? a.Z.track(
                                            r.Z.tracking.ads.rewardedWeb
                                              .closedGranted
                                          )
                                        : a.Z.track(
                                            r.Z.tracking.ads.rewardedWeb
                                              .closedDeclined
                                          ),
                                        G.Z.dispatchEvent(r.Z.ads.completed, {
                                          rewardAllowed: fe,
                                        });
                                    }
                                  ),
                                googletag
                                  .pubads()
                                  .addEventListener(
                                    "slotRenderEnded",
                                    function (e) {
                                      var t;
                                      be ===
                                        (null ===
                                          (t = null == e ? void 0 : e.slot) ||
                                        void 0 === t
                                          ? void 0
                                          : t.getAdUnitPath()) &&
                                        e.isEmpty &&
                                        (a.Z.track(
                                          r.Z.tracking.ads.rewardedWeb.empty
                                        ),
                                        G.Z.dispatchEvent(
                                          r.Z.ads.video.startHouseAdFlow
                                        ));
                                    }
                                  ),
                                googletag
                                  .pubads()
                                  .addEventListener(
                                    "slotRequested",
                                    function (e) {
                                      e ||
                                        (a.Z.track(
                                          r.Z.tracking.ads.rewardedWeb.empty
                                        ),
                                        G.Z.dispatchEvent(
                                          r.Z.ads.video.startHouseAdFlow
                                        ));
                                    }
                                  );
                            }),
                          !k && "rejected" === y.status)
                        )
                          return void G.Z.dispatchEvent(r.Z.adblocked);
                        var S = s.Z.forceAd;
                        S
                          ? ((I.adTiming = {
                              preroll: !0,
                              timeBetweenAds: 12e4,
                              timePerTry: 7e3,
                              startAdsAfter: 0,
                            }),
                            (I.customCriteria = lt(lt({}, I.customCriteria), {
                              force_ad: S,
                            })))
                          : I.adTiming ||
                            (I.adTiming = {
                              preroll: !0,
                              timeBetweenAds: 0,
                              timePerTry: 7e3,
                              startAdsAfter: 0,
                            }),
                          d.Z.debug && (I.adTiming.startAdsAfter = 0),
                          e.enableSettings(I),
                          (e.playerSkin = new Ue({ wrapper: h })),
                          (e.ima = new We(u)),
                          e.playerSkin.setupEvents(e),
                          e.startStartAdsAfterTimerOnInit &&
                            e.adTimings.startStartAdsAfterTimer(),
                          (e.waterfall = new Ee(e.ima, {
                            timing: e.adTimings,
                            totalRetries: p,
                          })),
                          (e.isInitialized = !0),
                          G.Z.dispatchEvent(r.Z.ready);
                      } catch (e) {
                        G.Z.dispatchEvent(r.Z.adblocked);
                      }
                    })
                    .catch(function () {
                      G.Z.dispatchEvent(r.Z.adblocked);
                    })
                );
              }),
              (e.prototype.requestAd = function (e) {
                void 0 === e && (e = {});
                var t = e.autoStart,
                  n = void 0 === t || t,
                  i = e.onFinish,
                  o = void 0 === i ? null : i,
                  d = e.onStart,
                  c = void 0 === d ? null : d,
                  l = e.position,
                  A = void 0 === l ? null : l,
                  u = { opportunityId: M(), position: A };
                if (
                  (a.Z.track(
                    A === r.Z.ads.position.rewarded
                      ? r.Z.tracking.screen.rewardedBreak
                      : r.Z.tracking.screen.commercialBreak,
                    lt(lt({}, e.rewardedKVs), u)
                  ),
                  (this.autoStartOnReady = !1 !== n),
                  o && this.registerHandler("onFinish", o),
                  c && this.registerHandler("onStart", c),
                  this.displayOnly)
                )
                  G.Z.dispatchEvent(
                    r.Z.ads.error,
                    lt(lt({}, u), { message: "Video disabled" })
                  );
                else if (this.ima && !this.sdkImaError) {
                  if (!this.sdkBooted)
                    return (
                      G.Z.dispatchEvent(
                        r.Z.ads.error,
                        lt(lt({}, u), {
                          message: "Requesting ad on unbooted SDK",
                        })
                      ),
                      void this.sdkNotBootedButCalled()
                    );
                  if (
                    (!(0, D.Z)() && !(0, j.Z)()) ||
                    A === r.Z.ads.position.rewarded
                  )
                    if (null !== A && (0, z.Z)(A, r.Z.ads.position))
                      if (S())
                        G.Z.dispatchEvent(
                          r.Z.ads.error,
                          lt(lt({}, u), {
                            messaage:
                              "No TCFv2 CMP detected, please contact developersupport@poki.com for more information",
                          })
                        );
                      else if (T())
                        G.Z.dispatchEvent(
                          r.Z.ads.error,
                          lt(lt({}, u), {
                            messaage:
                              "No USP detected, please contact developersupport@poki.com for more information",
                          })
                        );
                      else if (
                        this.ima.isAdRunning() ||
                        this.waterfall.isRunning()
                      )
                        G.Z.dispatchEvent(r.Z.ads.busy, u);
                      else if (this.adReady)
                        G.Z.dispatchEvent(r.Z.ads.ready, u);
                      else if (
                        A !== r.Z.ads.position.preroll ||
                        this.adTimings.prerollPossible()
                      )
                        if (
                          A === r.Z.ads.position.rewarded ||
                          this.adTimings.requestPossible()
                        )
                          if (
                            A !== r.Z.ads.position.rewarded &&
                            this.adSettings.countryExclusion.includes(
                              s.Z.country
                            )
                          )
                            G.Z.dispatchEvent(
                              r.Z.ads.limit,
                              lt(lt({}, u), {
                                reason: r.Z.info.messages.disabled,
                              })
                            );
                          else {
                            G.Z.clearVideoDataAnnotations(),
                              G.Z.setVideoDataAnnotations(u);
                            var p = lt(
                              lt(lt({}, this.genericCriteria()), this.criteria),
                              {
                                position: A,
                                ab: Math.round(Math.random()).toString(),
                              }
                            );
                            this.playerSkin.show(),
                              this.resize(),
                              this.waterfall.start(p, A);
                          }
                        else
                          G.Z.dispatchEvent(
                            r.Z.ads.limit,
                            lt(lt({}, u), {
                              reason: r.Z.info.messages.timeLimit,
                            })
                          );
                      else
                        G.Z.dispatchEvent(
                          r.Z.ads.limit,
                          lt(lt({}, u), {
                            reason: r.Z.info.messages.prerollLimit,
                          })
                        );
                    else console.error("POKI-SDK: Invalid position");
                  else
                    G.Z.dispatchEvent(
                      r.Z.ads.error,
                      lt(lt({}, u), {
                        message: "Interstitials are disabled on mobile",
                      })
                    );
                } else
                  G.Z.dispatchEvent(
                    r.Z.ads.error,
                    lt(lt({}, u), { message: "Bot, IMA or Adblocker error" })
                  );
              }),
              (e.prototype.displayAd = function (e) {
                var t = e.container,
                  n = e.size;
                if (S())
                  G.Z.dispatchEvent(r.Z.ads.error, {
                    message:
                      "No TCFv2 CMP detected, please contact developersupport@poki.com for more information",
                  });
                else if (T())
                  G.Z.dispatchEvent(r.Z.ads.error, {
                    message:
                      "No USP detected, please contact developersupport@poki.com for more information",
                  });
                else if (n) {
                  if (!this.sdkBooted)
                    return (
                      G.Z.dispatchEvent(r.Z.ads.error, {
                        message: "Requesting ad on unbooted SDK",
                      }),
                      void this.sdkNotBootedButCalled()
                    );
                  if (t)
                    if (void 0 !== window.googletag)
                      if (
                        this.adSettings.countryExclusion.includes(s.Z.country)
                      )
                        G.Z.dispatchEvent(r.Z.ads.limit, {
                          reason: r.Z.info.messages.disabled,
                        });
                      else {
                        if (!this.display.validateDisplaySettings(n))
                          return G.Z.dispatchEvent(r.Z.ads.error, {
                            reason: "Display size ".concat(
                              n,
                              " is not supported on this device"
                            ),
                          });
                        (e.criteria = lt(
                          lt(lt({}, this.genericCriteria()), this.criteria),
                          e.criteria || {}
                        )),
                          this.display.renderAd(e);
                      }
                    else
                      G.Z.dispatchEvent(r.Z.ads.error, {
                        message: "Adblocker has been detected",
                      });
                  else
                    G.Z.dispatchEvent(r.Z.ads.error, {
                      message: "Provided container does not exist",
                    });
                } else
                  G.Z.dispatchEvent(r.Z.ads.error, {
                    message:
                      "No ad size given, usage: displayAd(<container>, <size>)",
                  });
              }),
              (e.prototype.destroyAd = function (e) {
                if (!this.sdkBooted)
                  return (
                    console.error("Attempting destroyAd on unbooted SDK"),
                    void this.sdkNotBootedButCalled()
                  );
                void 0 !== window.googletag
                  ? this.adSettings.countryExclusion.includes(s.Z.country) ||
                    ((e = e || document.body), this.display.clearAd(e))
                  : console.error("Adblocker has been detected");
              }),
              (e.prototype.startStartAdsAfterTimer = function () {
                this.sdkBooted && !this.sdkImaError
                  ? this.adTimings.startStartAdsAfterTimer()
                  : (this.startStartAdsAfterTimerOnInit = !0);
              }),
              (e.prototype.muteAd = function () {
                if (!this.sdkBooted) return this.sdkNotBootedButCalled();
                this.sdkImaError || this.displayOnly || this.ima.muteAd();
              }),
              (e.prototype.isAdBlocked = function () {
                return this.sdkImaError;
              }),
              (e.prototype.setVolume = function (e) {
                if (!this.sdkBooted) return this.sdkNotBootedButCalled();
                this.sdkImaError || this.displayOnly || this.ima.setVolume(e);
              }),
              (e.prototype.forcePreroll = function () {
                var e = this.adTimings.prerollPossible;
                (this.adTimings.prerollPossible = function () {
                  return !0;
                }),
                  this.requestAd({ position: r.Z.ads.position.preroll }),
                  (this.adTimings.prerollPossible = e);
              }),
              (e.prototype.resumeAd = function () {
                if (!this.sdkBooted) return this.sdkNotBootedButCalled();
                this.sdkImaError ||
                  this.displayOnly ||
                  (this.playerSkin.hidePauseButton(), this.ima.resumeAd());
              }),
              (e.prototype.startAdClicked = function () {
                if (!this.sdkBooted) return this.sdkNotBootedButCalled();
                this.sdkImaError ||
                  this.displayOnly ||
                  ("undefined" != typeof navigator &&
                    /(iPad|iPhone|iPod)/gi.test(navigator.userAgent) &&
                    this.startAdEnabled &&
                    ((this.startAdEnabled = !1),
                    this.playerSkin.hideStartAdButton(),
                    this.ima.startIOSPlayback()));
              }),
              (e.prototype.enableSettings = function (e) {
                (this.criteria = lt({}, e.customCriteria)),
                  (this.adTimings = new N(e.adTiming));
              }),
              (e.prototype.resize = function () {
                var e = this;
                if (!this.sdkBooted) return this.sdkNotBootedButCalled();
                if (!this.sdkImaError && !this.displayOnly) {
                  var t = this.playerSkin.getVideoBounds();
                  0 !== t.width && 0 !== t.height
                    ? this.ima.resize(t.width, t.height)
                    : setTimeout(function () {
                        e.resize();
                      }, 100);
                }
              }),
              (e.prototype.startAd = function () {
                if (!this.sdkBooted) return this.sdkNotBootedButCalled();
                this.sdkImaError ||
                  this.displayOnly ||
                  (this.adReady
                    ? (this.resize(), this.ima.startPlayback())
                    : G.Z.dispatchEvent(r.Z.ads.error, {
                        message: "No ads ready to start",
                      }));
              }),
              (e.prototype.stopAd = function () {
                if (!this.sdkBooted) return this.sdkNotBootedButCalled();
                this.sdkImaError ||
                  this.displayOnly ||
                  (this.waterfall.stopWaterfall(),
                  this.ima.stopPlayback(),
                  this.playerSkin.hide());
              }),
              (e.prototype.registerHandler = function (e, t) {
                this.handlers[e] = t;
              }),
              (e.prototype.callHandler = function (e) {
                for (var t = [], n = 1; n < arguments.length; n++)
                  t[n - 1] = arguments[n];
                "function" == typeof this.handlers[e] && this.handlers[e](t);
              }),
              (e.prototype.setupDefaultEvents = function () {
                var e = this;
                G.Z.addEventListener(r.Z.ready, function () {
                  (e.sdkBooted = !0), e.callHandler("onReady");
                }),
                  G.Z.addEventListener(r.Z.adblocked, function () {
                    (e.sdkBooted = !0),
                      (e.sdkImaError = !0),
                      e.callHandler("onAdblocked");
                  }),
                  G.Z.addEventListener(r.Z.ads.ready, function () {
                    (e.adReady = !0), e.autoStartOnReady && e.startAd();
                  }),
                  G.Z.addEventListener(r.Z.ads.started, function () {
                    e.playerSkin.hideSpinner(),
                      e.callHandler("onStart", { type: r.Z.ads.limit });
                  }),
                  G.Z.addEventListener(r.Z.ads.video.paused, function () {
                    e.playerSkin.showPauseButton();
                  }),
                  G.Z.addEventListener(r.Z.ads.limit, function () {
                    e.callHandler("onFinish", {
                      type: r.Z.ads.limit,
                      rewardAllowed: !1,
                    });
                  }),
                  G.Z.addEventListener(r.Z.ads.stopped, function () {
                    e.callHandler("onFinish", {
                      type: r.Z.ads.stopped,
                      rewardAllowed: !1,
                    });
                  }),
                  G.Z.addEventListener(r.Z.ads.error, function (t) {
                    e.callHandler("onFinish", {
                      type: r.Z.ads.error,
                      rewardAllowed: !!t.rewardAllowed,
                    });
                  }),
                  G.Z.addEventListener(r.Z.ads.busy, function () {
                    e.callHandler("onFinish", {
                      type: r.Z.ads.busy,
                      rewardAllowed: !1,
                    });
                  }),
                  G.Z.addEventListener(r.Z.ads.completed, function (t) {
                    e.callHandler("onFinish", {
                      type: r.Z.ads.completed,
                      rewardAllowed: !!t.rewardAllowed,
                    });
                  }),
                  [
                    r.Z.ads.limit,
                    r.Z.ads.stopped,
                    r.Z.ads.error,
                    r.Z.ads.completed,
                  ].forEach(function (t) {
                    G.Z.addEventListener(t, function () {
                      e.playerSkin && e.playerSkin.hide(), (e.adReady = !1);
                    });
                  });
              }),
              e
            );
          })();
        const pt = ut;
        var ht = n(84);
        function mt(e) {
          switch (Object.prototype.toString.call(e)) {
            case "[object Error]":
            case "[object Exception]":
            case "[object DOMException]":
              return !0;
            default:
              return e instanceof Error;
          }
        }
        var gt = "poki_erruid",
          vt = Date.now(),
          ft = A(gt);
        function yt() {
          return (
            ft || ((ft = Math.random().toString(36).substr(2, 9)), u(gt, ft)),
            ft
          );
        }
        function wt(e) {
          if ("CN" !== s.Z.country)
            if (s.Z.gameID) {
              if (!(Date.now() < vt))
                try {
                  var t = JSON.stringify({
                      gid: s.Z.gameID,
                      vid: s.Z.versionID,
                      ve: 7,
                      n: e.name,
                      m: e.message,
                      s: JSON.stringify(e.stack),
                      ui: yt(),
                    }),
                    n = "https://t.poki.io/ge";
                  if (navigator.sendBeacon) navigator.sendBeacon(n, t);
                  else {
                    var i = new XMLHttpRequest();
                    i.open("POST", n, !0), i.send(t);
                  }
                  vt = Date.now() + 100;
                } catch (e) {
                  console.error(e);
                }
            } else console.log(e);
        }
        "undefined" == typeof window ||
          s.Z.isPlayground ||
          ((o().remoteFetching = !1),
          o().report.subscribe(function (e) {
            if ("Script error." === e.message && window.pokiLastCatch) {
              var t = window.pokiLastCatch;
              window.pokiLastCatch = null;
              try {
                o().report(t);
              } catch (e) {}
            } else wt(e);
          }),
          window.addEventListener("unhandledrejection", function (e) {
            if (mt(e.reason))
              try {
                o().report(e.reason);
              } catch (e) {}
            else
              wt({
                name: "unhandledrejection",
                message: JSON.stringify(e.reason),
              });
          }));
        function bt(e) {
          return Math.round(100 * e) / 100;
        }
        var kt = (function () {
            function e() {
              var e = this;
              (this.seconds = []),
                (this.frameCounter = 0),
                Math.random() > 0.01 ||
                  (window.requestAnimationFrame &&
                    -1 !==
                      window.requestAnimationFrame
                        .toString()
                        .indexOf("[native code]") &&
                    ((this.nextSecond = performance.now() + 1e3),
                    window.requestAnimationFrame(function () {
                      e.frame();
                    })));
            }
            return (
              (e.prototype.frame = function () {
                for (
                  var e = this, t = performance.now();
                  t >= this.nextSecond;

                )
                  this.seconds.unshift(this.frameCounter),
                    this.seconds.length > 10 && this.seconds.pop(),
                    (this.frameCounter = 0),
                    (this.nextSecond += 1e3);
                this.frameCounter++,
                  window.requestAnimationFrame(function () {
                    e.frame();
                  });
              }),
              (e.prototype.stats = function () {
                var e = this;
                if (0 !== this.seconds.length) {
                  var t = Math.min.apply(Math, this.seconds),
                    n = Math.max.apply(Math, this.seconds),
                    i = bt(
                      this.seconds.reduce(function (e, t) {
                        return e + t;
                      }, 0) / this.seconds.length
                    ),
                    o = bt(
                      this.seconds
                        .slice(1)
                        .map(function (t, n) {
                          return Math.abs(t - e.seconds[n]);
                        })
                        .reduce(function (e, t) {
                          return e + t;
                        }, 0) /
                        (this.seconds.length - 1)
                    );
                  return ""
                    .concat(t, "|")
                    .concat(n, "|")
                    .concat(i, "|")
                    .concat(o);
                }
              }),
              e
            );
          })(),
          Zt = function () {
            return (
              (Zt =
                Object.assign ||
                function (e) {
                  for (var t, n = 1, i = arguments.length; n < i; n++)
                    for (var o in (t = arguments[n]))
                      Object.prototype.hasOwnProperty.call(t, o) &&
                        (e[o] = t[o]);
                  return e;
                }),
              Zt.apply(this, arguments)
            );
          },
          Et = function (e, t, n, i) {
            return new (n || (n = Promise))(function (o, r) {
              function a(e) {
                try {
                  d(i.next(e));
                } catch (e) {
                  r(e);
                }
              }
              function s(e) {
                try {
                  d(i.throw(e));
                } catch (e) {
                  r(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? o(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(a, s);
              }
              d((i = i.apply(e, t || [])).next());
            });
          },
          It = function (e, t) {
            var n,
              i,
              o,
              r,
              a = {
                label: 0,
                sent: function () {
                  if (1 & o[0]) throw o[1];
                  return o[1];
                },
                trys: [],
                ops: [],
              };
            return (
              (r = { next: s(0), throw: s(1), return: s(2) }),
              "function" == typeof Symbol &&
                (r[Symbol.iterator] = function () {
                  return this;
                }),
              r
            );
            function s(s) {
              return function (d) {
                return (function (s) {
                  if (n) throw new TypeError("Generator is already executing.");
                  for (; r && ((r = 0), s[0] && (a = 0)), a; )
                    try {
                      if (
                        ((n = 1),
                        i &&
                          (o =
                            2 & s[0]
                              ? i.return
                              : s[0]
                              ? i.throw || ((o = i.return) && o.call(i), 0)
                              : i.next) &&
                          !(o = o.call(i, s[1])).done)
                      )
                        return o;
                      switch (((i = 0), o && (s = [2 & s[0], o.value]), s[0])) {
                        case 0:
                        case 1:
                          o = s;
                          break;
                        case 4:
                          return a.label++, { value: s[1], done: !1 };
                        case 5:
                          a.label++, (i = s[1]), (s = [0]);
                          continue;
                        case 7:
                          (s = a.ops.pop()), a.trys.pop();
                          continue;
                        default:
                          if (
                            !((o = a.trys),
                            (o = o.length > 0 && o[o.length - 1]) ||
                              (6 !== s[0] && 2 !== s[0]))
                          ) {
                            a = 0;
                            continue;
                          }
                          if (
                            3 === s[0] &&
                            (!o || (s[1] > o[0] && s[1] < o[3]))
                          ) {
                            a.label = s[1];
                            break;
                          }
                          if (6 === s[0] && a.label < o[1]) {
                            (a.label = o[1]), (o = s);
                            break;
                          }
                          if (o && a.label < o[2]) {
                            (a.label = o[2]), a.ops.push(s);
                            break;
                          }
                          o[2] && a.ops.pop(), a.trys.pop();
                          continue;
                      }
                      s = t.call(e, a);
                    } catch (e) {
                      (s = [6, e]), (i = 0);
                    } finally {
                      n = o = 0;
                    }
                  if (5 & s[0]) throw s[1];
                  return { value: s[0] ? s[1] : void 0, done: !0 };
                })([s, d]);
              };
            }
          },
          xt = (function () {
            function e() {
              var t = this;
              (this.gameStarted = !1),
                (this.duringGameplay = !1),
                (this.fpsStats = new kt()),
                (this.gameCanvas = null),
                (this.lastInteractionTime = 0),
                (this.asyncScreenshotLoader = function () {
                  window.addEventListener(
                    "message",
                    function (e) {
                      return Et(t, void 0, void 0, function () {
                        var t;
                        return It(this, function (i) {
                          switch (i.label) {
                            case 0:
                              return "pokiGenerateScreenshot" !== e.data.type
                                ? [3, 2]
                                : [
                                    4,
                                    Promise.all([n.e(813), n.e(206)]).then(
                                      n.bind(n, 206)
                                    ),
                                  ];
                            case 1:
                              return (
                                (0,
                                i.sent().takeAndUploadScreenshotWithFrameData)(
                                  e.data
                                ),
                                [3, 7]
                              );
                            case 2:
                              return "pokiGenerateRawScreenshot" !== e.data.type
                                ? [3, 4]
                                : [
                                    4,
                                    Promise.all([n.e(813), n.e(206)]).then(
                                      n.bind(n, 206)
                                    ),
                                  ];
                            case 3:
                              return (0, i.sent().takeRawScreenshot)(), [3, 7];
                            case 4:
                              return "pokiUploadScreenshot" !== e.data.type
                                ? [3, 7]
                                : [
                                    4,
                                    Promise.all([n.e(813), n.e(206)]).then(
                                      n.bind(n, 206)
                                    ),
                                  ];
                            case 5:
                              return [
                                4,
                                (0, i.sent().uploadScreenshot)(e.data),
                              ];
                            case 6:
                              (t = i.sent()),
                                ht.Z.sendMessage(
                                  r.Z.message.sendUploadScreenshot,
                                  { data: { screenshot: t } }
                                ),
                                (i.label = 7);
                            case 7:
                              return [2];
                          }
                        });
                      });
                    },
                    !1
                  );
                }),
                (this.initWithVideoHB = function () {
                  return t.init();
                }),
                (this.setDebug = function (e) {
                  void 0 === e && (e = !0);
                  var t = window.location.hostname;
                  t.endsWith("poki-gdn.com") || "qa-files.poki.com" === t
                    ? e && a.Z.track(r.Z.tracking.debugTrueInProduction)
                    : ((d.Z.debug = e), (d.Z.log = null != e ? e : d.Z.log));
                }),
                (this.setLogging = function (e) {
                  d.Z.log = e;
                }),
                (this.gameLoadingFinished = function () {
                  var e, t, n, i, o;
                  try {
                    (n = performance
                      .getEntriesByType("resource")
                      .map(function (e) {
                        return e.transferSize;
                      })
                      .reduce(function (e, t) {
                        return e + t;
                      })),
                      (n +=
                        performance.getEntriesByType("navigation")[0]
                          .transferSize);
                  } catch (e) {}
                  a.Z.track(r.Z.tracking.screen.gameLoadingFinished, {
                    transferSize: n,
                    trackers: ((i = window),
                    (o = []),
                    ("function" != typeof i.ga &&
                      "function" != typeof i.gtag) ||
                      o.push("ga"),
                    i.mixpanel &&
                      "function" == typeof i.mixpanel.track &&
                      o.push("mixpanel"),
                    "function" == typeof i.GameAnalytics &&
                      o.push("gameanalytics"),
                    (i.kongregateAPI || i.kongregate) && o.push("kongregate"),
                    i.FlurryAgent && o.push("flurry"),
                    i.Countly && o.push("countly"),
                    i.amplitude && o.push("amplitude"),
                    o).join(","),
                    error_user_id: yt(),
                    now:
                      Math.round(
                        null ===
                          (t =
                            null === (e = window.performance) || void 0 === e
                              ? void 0
                              : e.now) || void 0 === t
                          ? void 0
                          : t.call(e)
                      ) || void 0,
                  });
                }),
                (this.gameplayStart = function (e) {
                  (t.duringGameplay = !0),
                    t.gameStarted ||
                      ((t.gameStarted = !0),
                      a.Z.track(r.Z.tracking.screen.firstRound),
                      t.monetization.startStartAdsAfterTimer()),
                    a.Z.track(
                      r.Z.tracking.screen.gameplayStart,
                      Zt(Zt({}, e), { fps: t.fpsStats.stats() })
                    ),
                    clearTimeout(t.playerActiveTimeout),
                    (t.playerActiveTimeout = setTimeout(function () {
                      t.gameCanvas &&
                        t.gameCanvas.addEventListener(
                          "pointermove",
                          t.playerIsActiveEvent
                        ),
                        window.addEventListener(
                          "pointermove",
                          t.playerIsActiveEvent
                        ),
                        document.addEventListener(
                          "keydown",
                          t.playerIsActiveEvent
                        );
                    }, 6e5));
                }),
                (this.gameplayStop = function (e) {
                  (t.duringGameplay = !1),
                    a.Z.track(
                      r.Z.tracking.screen.gameplayStop,
                      Zt(Zt({}, e), { fps: t.fpsStats.stats() })
                    ),
                    clearTimeout(t.playerActiveTimeout),
                    t.gameCanvas &&
                      t.gameCanvas.removeEventListener(
                        "pointermove",
                        t.playerIsActiveEvent
                      ),
                    window.removeEventListener(
                      "pointermove",
                      t.playerIsActiveEvent
                    ),
                    document.removeEventListener(
                      "keydown",
                      t.playerIsActiveEvent
                    );
                }),
                (this.roundStart = function (e) {
                  void 0 === e && (e = ""),
                    (e = String(e)),
                    a.Z.track(r.Z.tracking.screen.roundStart, {
                      identifier: e,
                    });
                }),
                (this.roundEnd = function (e) {
                  void 0 === e && (e = ""),
                    (e = String(e)),
                    a.Z.track(r.Z.tracking.screen.roundEnd, { identifier: e });
                }),
                (this.customEvent = function (e, n, i) {
                  void 0 === i && (i = {}),
                    e && n
                      ? ((e = String(e)),
                        (n = String(n)),
                        (i = Zt({}, i)),
                        a.Z.track(r.Z.tracking.custom, {
                          eventNoun: e,
                          eventVerb: n,
                          eventData: i,
                        }))
                      : t.error(
                          "customEvent",
                          "customEvent needs at least a noun and a verb"
                        );
                }),
                (this.commercialBreak = function (e) {
                  return new Promise(function (n) {
                    var i = t.gameStarted
                      ? r.Z.ads.position.midroll
                      : r.Z.ads.position.preroll;
                    t.monetization.requestAd({
                      position: i,
                      onFinish: n,
                      onStart: e,
                    });
                  });
                }),
                (this.rewardedBreak = function (e, n, i, o) {
                  return new Promise(function (a) {
                    var s,
                      d = {};
                    "function" == typeof e
                      ? ((s = e),
                        void 0 !== n && (d.category = n),
                        void 0 !== i && (d.details = i),
                        void 0 !== o && (d.placement = o))
                      : (void 0 !== e && (d.category = e),
                        void 0 !== n && (d.details = n),
                        void 0 !== i && (d.placement = i)),
                      setTimeout(function () {
                        d.category &&
                          performance.now() - t.lastInteractionTime < 500 &&
                          (d.from = t.lastInteractionEvent);
                        var e = r.Z.ads.position.rewarded;
                        t.monetization.requestAd({
                          position: e,
                          onFinish: function (e) {
                            e.length > 0 ? a(!!e[0].rewardAllowed) : a(!1);
                          },
                          onStart: s,
                          rewardedKVs: d,
                        });
                      }, 0);
                  });
                }),
                (this.displayAd = function (e, n, i, o) {
                  var s = M();
                  a.Z.track(r.Z.tracking.screen.displayAd, {
                    size: n,
                    opportunityId: s,
                    duringGameplay: t.duringGameplay,
                  });
                  var d = {
                    container: e,
                    opportunityId: s,
                    size: n,
                    duringGameplay: function () {
                      return t.duringGameplay;
                    },
                    onCanDestroy: i,
                    onDisplayRendered: o,
                  };
                  t.monetization.displayAd(d);
                }),
                (this.isAdBlocked = function () {
                  return t.monetization.isAdBlocked();
                }),
                (this.muteAd = function () {
                  t.monetization.muteAd();
                }),
                (this.logError = function (e) {
                  t.captureError(e);
                }),
                (this.setPlaytestCanvas = function (t) {
                  e.playtestCanvas = t;
                }),
                (this.getIsoLanguage = function () {
                  return (0, U.Z)("iso_lang");
                }),
                (this.shareableURL = function (e) {
                  return (
                    void 0 === e && (e = {}),
                    new Promise(function (t, n) {
                      var i = new URLSearchParams(),
                        o = Object.keys(e);
                      if (s.Z.isPokiIframe) {
                        var a = (0, U.Z)("poki_url");
                        o.forEach(function (t) {
                          void 0 !== e[t] &&
                            null !== e[t] &&
                            i.set("gd".concat(t), e[t]);
                        }),
                          t("".concat(a, "?").concat(i.toString())),
                          ht.Z.sendMessage(r.Z.message.setPokiURLParams, {
                            params: e,
                          });
                      } else
                        window.self === window.top
                          ? (o.forEach(function (t) {
                              void 0 !== e[t] &&
                                null !== e[t] &&
                                i.set("".concat(t), e[t]);
                            }),
                            t(
                              ""
                                .concat(window.location.origin)
                                .concat(window.location.pathname, "?")
                                .concat(i.toString())
                            ))
                          : n(
                              new Error(
                                "shareableURL only works on Poki or a top level frame"
                              )
                            );
                    })
                  );
                }),
                (this.getURLParam = function (e) {
                  return (0, U.Z)("gd".concat(e)) || (0, U.Z)(e);
                }),
                (this.captureError = function (e) {
                  try {
                    mt(e) ? i.report(e) : i.report(new Error(e));
                  } catch (e) {}
                }),
                (this.getLanguage = function () {
                  return navigator.language.toLowerCase().split("-")[0];
                }),
                (this.generateScreenshot = function () {
                  return Et(t, void 0, void 0, function () {
                    return It(this, function (e) {
                      switch (e.label) {
                        case 0:
                          return [
                            4,
                            Promise.all([n.e(813), n.e(206)]).then(
                              n.bind(n, 206)
                            ),
                          ];
                        case 1:
                          return [2, (0, e.sent().takeAndUploadScreenshot)()];
                      }
                    });
                  });
                }),
                (this.enableEventTracking = function (e) {
                  window.top === window && a.Z.setupObserverWithCMP(e || 0);
                }),
                (this.error = function (e, t) {
                  console.error("PokiSDK.".concat(e, ": ").concat(t));
                }),
                (this.playerIsActiveEvent = function () {
                  t.gameCanvas &&
                    t.gameCanvas.removeEventListener(
                      "pointermove",
                      t.playerIsActiveEvent
                    ),
                    window.removeEventListener(
                      "pointermove",
                      t.playerIsActiveEvent
                    ),
                    document.removeEventListener(
                      "keydown",
                      t.playerIsActiveEvent
                    ),
                    a.Z.track(r.Z.tracking.screen.playerActive),
                    (t.playerActiveTimeout = setTimeout(function () {
                      t.gameCanvas &&
                        t.gameCanvas.addEventListener(
                          "pointermove",
                          t.playerIsActiveEvent
                        ),
                        window.addEventListener(
                          "pointermove",
                          t.playerIsActiveEvent
                        ),
                        document.addEventListener(
                          "keydown",
                          t.playerIsActiveEvent
                        );
                    }, 6e5));
                }),
                (this.interactionEvent = function (e) {
                  "mousedown" === e.type
                    ? (t.lastInteractionEvent = "mousedown")
                    : "pointerdown" === e.type
                    ? (t.lastInteractionEvent = "pointerdown")
                    : "keydown" === e.type &&
                      (t.lastInteractionEvent = "keydown-".concat(e.code)),
                    (t.lastInteractionTime = performance.now());
                }),
                (this.setDebugTouchOverlayController = function () {}),
                (this.gameInteractive = function () {}),
                (this.gameLoadingProgress = function () {}),
                (this.gameLoadingStart = function () {}),
                (this.getLeaderboard = function () {
                  return Promise.resolve([]);
                }),
                (this.happyTime = function () {}),
                (this.sendHighscore = function () {}),
                (this.setPlayerAge = function () {}),
                (this.__pokiInternal__playgroundPlatformAd = function (
                  e,
                  n,
                  i,
                  o
                ) {
                  var s = M();
                  a.Z.track(r.Z.tracking.screen.displayAd, {
                    size: i,
                    opportunityId: s,
                    platformAd: !0,
                  });
                  var d = {
                    container: e,
                    opportunityId: s,
                    size: i,
                    adUnitPath: n,
                    criteria: o,
                    backfillHouseads: !0,
                    platformAd: !0,
                    duringGameplay: function () {
                      return !1;
                    },
                  };
                  t.monetization.displayAd(d);
                }),
                (this.__pokiInternal__setRuntimeInformation = function (e) {
                  void 0 === e && (e = {}),
                    Object.keys(e).forEach(function (t) {
                      (0, s.w)(t, e[t]);
                    });
                }),
                (this.monetization = new pt()),
                (this.SDK = this.monetization);
            }
            return (
              (e.prototype.init = function (t) {
                var n = this;
                if (
                  (void 0 === t && (t = {}),
                  t.startupParams &&
                    this.__pokiInternal__setRuntimeInformation(t.startupParams),
                  (this.gameCanvas = e.getGameCanvas()),
                  this.gameCanvas)
                )
                  this.gameCanvas.addEventListener(
                    "pointerdown",
                    this.interactionEvent
                  );
                else
                  var i = 240,
                    o = setInterval(function () {
                      (n.gameCanvas = e.getGameCanvas()),
                        n.gameCanvas &&
                          (clearInterval(o),
                          n.gameCanvas.addEventListener(
                            "pointerdown",
                            n.interactionEvent
                          )),
                        0 == --i && clearInterval(o);
                    }, 500);
                return (
                  window.addEventListener("pointerdown", this.interactionEvent),
                  window.addEventListener("mousedown", this.interactionEvent),
                  document.addEventListener("keydown", this.interactionEvent),
                  new Promise(function (e, i) {
                    n.monetization.init(
                      Zt(
                        {
                          onReady: function () {
                            n.monetization.setVolume(0.6),
                              (0, U.Z)("preroll") &&
                                n.monetization.forcePreroll(),
                              e();
                          },
                          onAdblocked: i,
                        },
                        t
                      )
                    ),
                      n.asyncScreenshotLoader(),
                      ht.Z.sendMessage(r.Z.message.sdkDetails, {
                        version: "2.341.3",
                      });
                  })
                );
              }),
              (e.prototype.destroyAd = function (e) {
                this.monetization.destroyAd(e);
              }),
              (e.prototype.setVolume = function (e) {
                this.monetization.setVolume(e);
              }),
              (e.getGameCanvas = function () {
                var t = e.playtestCanvas;
                if (t) return t;
                var n = null,
                  i = 0;
                return (
                  Array.from(document.querySelectorAll("canvas")).forEach(
                    function (e) {
                      var t = getComputedStyle(e),
                        o = t.width,
                        r = t.height,
                        a = t.display,
                        s = t.visibility,
                        d = parseInt(o, 10) * parseInt(r, 10);
                      "none" !== a &&
                        "visible" === s &&
                        d > i &&
                        ((i = d), (n = e));
                    }
                  ),
                  n
                );
              }),
              e
            );
          })();
        const Ct = xt;
      },
      84: (e, t, n) => {
        "use strict";
        n.d(t, { Z: () => a });
        var i = n(583),
          o = n(992),
          r = n(888);
        const a = (function () {
          function e() {}
          return (
            (e.sendMessage = function (e, t) {
              var n = window.parent;
              if (!(0, o.Z)(e, i.Z.message)) {
                var a = Object.keys(i.Z.message).map(function (e) {
                  return "poki.message.".concat(e);
                });
                throw new TypeError(
                  "Argument 'type' must be one of ".concat(a.join(", "))
                );
              }
              var s = t || {};
              r.Z.gameID &&
                r.Z.versionID &&
                (s.pokifordevs = {
                  game_id: r.Z.gameID,
                  game_version_id: r.Z.versionID,
                }),
                n.postMessage({ type: e, content: s }, "*");
            }),
            e
          );
        })();
      },
      58: (e, t, n) => {
        "use strict";
        n.d(t, { Z: () => r });
        var i = n(298),
          o = function () {
            return (
              (o =
                Object.assign ||
                function (e) {
                  for (var t, n = 1, i = arguments.length; n < i; n++)
                    for (var o in (t = arguments[n]))
                      Object.prototype.hasOwnProperty.call(t, o) &&
                        (e[o] = t[o]);
                  return e;
                }),
              o.apply(this, arguments)
            );
          };
        const r = (function () {
          function e() {}
          return (
            (e.clearEventListeners = function () {
              this.listeners = {};
            }),
            (e.removeEventListener = function (e, t) {
              if (Object.prototype.hasOwnProperty.call(this.listeners, e)) {
                var n = this.listeners[e].indexOf(t);
                -1 !== n && this.listeners[e].splice(n, 1);
              }
            }),
            (e.addEventListener = function (e, t, n) {
              var i = this;
              if (
                (void 0 === n && (n = !1),
                (n = !!n),
                Object.prototype.hasOwnProperty.call(this.listeners, e) ||
                  (this.listeners[e] = []),
                n)
              ) {
                var o = function (n) {
                  i.removeEventListener.bind(i)(e, o), t(n);
                };
                this.listeners[e].push(o);
              } else this.listeners[e].push(t);
            }),
            (e.dispatchEvent = function (e, t) {
              var n, r;
              void 0 === t && (t = {}),
                i.Z.debug &&
                  "test" !==
                    (null ===
                      (r =
                        null ===
                          (n =
                            null === window || void 0 === window
                              ? void 0
                              : window.process) || void 0 === n
                          ? void 0
                          : n.env) || void 0 === r
                      ? void 0
                      : r.NODE_ENV) &&
                  console.info(e, t);
              for (
                var a = Object.keys(this.listeners), s = 0;
                s < a.length;
                s++
              ) {
                var d = a[s];
                if (e === d)
                  for (var c = this.listeners[d], l = 0; l < c.length; l++)
                    c[l](o(o({}, this.dataAnnotations), t));
              }
            }),
            (e.setVideoDataAnnotations = function (e) {
              this.dataAnnotations = o(o({}, this.dataAnnotations), e);
            }),
            (e.getVideoDataAnnotations = function () {
              return this.dataAnnotations;
            }),
            (e.clearVideoDataAnnotations = function () {
              this.dataAnnotations = {};
            }),
            (e.listeners = {}),
            (e.dataAnnotations = {}),
            e
          );
        })();
      },
      453: (e, t, n) => {
        "use strict";
        function i(e) {
          var t = new RegExp("".concat(e, "=([^;]+)(?:;|$)")).exec(
            document.cookie
          );
          return t ? t[1] : "";
        }
        function o(e, t, n) {
          document.cookie = ""
            .concat(e, "=")
            .concat(t, "; path=/; samesite=lax; max-age=")
            .concat(Math.min(n || 15552e3, 15552e3));
        }
        function r() {
          for (var e = Math.floor(Date.now() / 1e3), t = "", n = 0; n < 4; n++)
            (t = String.fromCharCode(255 & e) + t), (e >>= 8);
          if (window.crypto && crypto.getRandomValues && Uint32Array) {
            var i = new Uint32Array(12);
            crypto.getRandomValues(i);
            for (var o = 0; o < 12; o++) t += String.fromCharCode(255 & i[o]);
          } else
            for (var r = 0; r < 12; r++)
              t += String.fromCharCode(Math.floor(256 * Math.random()));
          return btoa(t)
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=/g, "");
        }
        n.d(t, { Z: () => x });
        function a(e, t, n) {
          console.error(e);
          var i = [
            { k: "where", v: t },
            {
              k: "error",
              v:
                e.name && e.message
                  ? "".concat(e.name, ": ").concat(e.message)
                  : JSON.stringify(e),
            },
          ];
          if (void 0 !== n) {
            var o = n;
            "string" != typeof e && (o = JSON.stringify(e)),
              i.push({ k: "extra", v: o });
          }
          !(function (e, t) {
            if (navigator.sendBeacon) {
              var n = navigator.sendBeacon.bind(navigator);
              try {
                if (n(e, t)) return;
              } catch (e) {
                console.error(e);
              }
            }
            try {
              var i =
                "XMLHttpRequest" in window
                  ? new XMLHttpRequest()
                  : new ActiveXObject("Microsoft.XMLHTTP");
              i.open("POST", e, !0),
                i.setRequestHeader("Content-Type", "text/plain"),
                i.send(t);
            } catch (e) {}
          })(
            "https://t.poki.io/l",
            JSON.stringify({ c: "observer-error", ve: 7, d: i })
          );
        }
        window._pokiUserGlobalName = window._pokiUserGlobalName || "user";
        var s = "poki_session";
        function d(e) {
          return !(
            !e ||
            !(e && e.page && e.landing_page && e.previous_page) ||
            !e.tab_id ||
            !e.expire ||
            Date.now() > e.expire ||
            e.expire > Date.now() + 18e5
          );
        }
        function c() {
          var e = null;
          d(window[window._pokiSessionGlobalName]) &&
            (e = window[window._pokiSessionGlobalName]);
          try {
            var t = JSON.parse(sessionStorage.getItem(s));
            d(t) && (!e || t.depth > e.depth) && (e = t);
          } catch (e) {
            try {
              a(e, "getTabSession", sessionStorage.getItem(s));
            } catch (t) {
              a(e, "getTabSession", t);
            }
          }
          return e;
        }
        function l() {
          var e = c();
          return e ? e.tab_id : r();
        }
        function A() {
          var e = 0,
            t = c();
          t && (e = t.depth);
          try {
            var n = JSON.parse(i(s) || null);
            d(n) && (e = Math.max(e, n.depth));
          } catch (e) {
            var o = null;
            try {
              o = i(s) || null;
            } catch (e) {}
            a(e, "getSessionDepth", o);
          }
          return e;
        }
        function u() {
          try {
            var e = i("ses_cnt");
            return (e && parseInt(e, 10)) || 0;
          } catch (e) {
            return 0;
          }
        }
        window._pokiSessionGlobalName =
          window._pokiSessionGlobalName || "session";
        var p = n(583),
          h = n(84),
          m = n(298),
          g = function (e) {
            var t = new Array();
            return (
              Object.keys(e).forEach(function (n) {
                "object" == typeof e[n]
                  ? (t = t.concat(g(e[n])))
                  : t.push(e[n]);
              }),
              t
            );
          };
        const v = g;
        var f = n(902),
          y = n(699),
          w = n(888),
          b = n(58),
          k = function () {
            return (
              (k =
                Object.assign ||
                function (e) {
                  for (var t, n = 1, i = arguments.length; n < i; n++)
                    for (var o in (t = arguments[n]))
                      Object.prototype.hasOwnProperty.call(t, o) &&
                        (e[o] = t[o]);
                  return e;
                }),
              k.apply(this, arguments)
            );
          },
          Z = v(p.Z.tracking),
          E = window,
          I = (function () {
            function e() {}
            return (
              (e.track = function (t, n) {
                var i, o;
                if ((void 0 === n && (n = {}), -1 === Z.indexOf(t)))
                  throw new TypeError(
                    "Invalid 'event', must be one of ".concat(Z.join(", "))
                  );
                if ("object" != typeof n)
                  throw new TypeError("Invalid data, must be an object");
                var r = b.Z.getVideoDataAnnotations();
                if (null == r ? void 0 : r.pokiAdServer)
                  switch (t) {
                    case p.Z.tracking.ads.status.impression:
                      (0, f.Z)(
                        k(k({}, n), {
                          event: "video-impression",
                          creativeId: null == n ? void 0 : n.creativeId,
                        })
                      );
                      break;
                    case p.Z.tracking.ads.video.error:
                      (0, f.Z)(
                        k(k({}, n), {
                          event: "video-error",
                          errorCode: null == n ? void 0 : n.errorCode,
                        })
                      );
                      break;
                    case p.Z.tracking.ads.video.loaderError:
                      (0, f.Z)(
                        k(k({}, n), {
                          event: "video-adsloader-error",
                          errorCode: null == n ? void 0 : n.errorCode,
                        })
                      );
                      break;
                    case p.Z.tracking.ads.status.completed:
                      (0, f.Z)(k(k({}, n), { event: "video-complete" }));
                  }
                if (
                  (t.includes("pokiTrackingRewardedWeb") && (n = r), m.Z.log)
                ) {
                  if (
                    "test" ===
                    (null ===
                      (o =
                        null ===
                          (i =
                            null === window || void 0 === window
                              ? void 0
                              : window.process) || void 0 === i
                          ? void 0
                          : i.env) || void 0 === o
                      ? void 0
                      : o.NODE_ENV)
                  )
                    return;
                  Object.keys(n).length
                    ? console.info(
                        "%cPOKI_TRACKER:%c Tracked event '".concat(
                          t,
                          "' with data:"
                        ),
                        "font-weight: bold",
                        "",
                        n
                      )
                    : console.info(
                        "%cPOKI_TRACKER:%c Tracked event '".concat(t, "'"),
                        "font-weight: bold",
                        ""
                      );
                }
                e.playtestMessageCallback({ event: t, data: n }),
                  e.logToObserver
                    ? e.pushEvent("sdk", "message", {
                        content: {
                          event: t,
                          data: n,
                          pokifordevs: {
                            game_id: w.Z.gameID,
                            game_version_id: void 0,
                          },
                        },
                        type: p.Z.message.event,
                        origin: "game",
                      })
                    : h.Z.sendMessage(p.Z.message.event, { event: t, data: n });
              }),
              (e.setMessageCallback = function (t) {
                e.playtestMessageCallback = t;
              }),
              (e.setupDefaultEvents = function () {
                var t,
                  n =
                    (((t = {})[p.Z.ready] =
                      p.Z.tracking.sdk.status.initialized),
                    (t[p.Z.adblocked] = p.Z.tracking.sdk.status.failed),
                    (t[p.Z.ads.busy] = p.Z.tracking.ads.status.busy),
                    (t[p.Z.ads.completed] = p.Z.tracking.ads.status.completed),
                    (t[p.Z.ads.error] = p.Z.tracking.ads.status.error),
                    (t[p.Z.ads.impression] =
                      p.Z.tracking.ads.status.impression),
                    (t[p.Z.ads.limit] = p.Z.tracking.ads.status.limit),
                    (t[p.Z.ads.ready] = p.Z.tracking.ads.status.ready),
                    (t[p.Z.ads.requested] = p.Z.tracking.ads.status.requested),
                    (t[p.Z.ads.prebidRequested] =
                      p.Z.tracking.ads.status.prebidRequested),
                    (t[p.Z.ads.skipped] = p.Z.tracking.ads.status.skipped),
                    (t[p.Z.ads.started] = p.Z.tracking.ads.status.started),
                    (t[p.Z.ads.video.clicked] = p.Z.tracking.ads.video.clicked),
                    (t[p.Z.ads.video.error] = p.Z.tracking.ads.video.error),
                    (t[p.Z.ads.video.loaderError] =
                      p.Z.tracking.ads.video.loaderError),
                    (t[p.Z.ads.video.buffering] =
                      p.Z.tracking.ads.status.buffering),
                    (t[p.Z.ads.video.progress] =
                      p.Z.tracking.ads.video.progress),
                    (t[p.Z.ads.video.paused] = p.Z.tracking.ads.video.paused),
                    (t[p.Z.ads.video.resumed] = p.Z.tracking.ads.video.resumed),
                    (t[p.Z.tracking.screen.gameplayStart] =
                      p.Z.tracking.screen.gameplayStart),
                    (t[p.Z.tracking.screen.gameplayStop] =
                      p.Z.tracking.screen.gameplayStop),
                    (t[p.Z.tracking.screen.commercialBreak] =
                      p.Z.tracking.screen.commercialBreak),
                    (t[p.Z.tracking.screen.rewardedBreak] =
                      p.Z.tracking.screen.rewardedBreak),
                    t);
                Object.keys(n).forEach(function (t) {
                  b.Z.addEventListener(t, function (i) {
                    e.track(n[t], i);
                  });
                });
              }),
              (e.pushEvent = function (e, t, n) {
                E.pokiGTM.push({
                  event: "".concat(e, "-").concat(t),
                  eventNoun: e,
                  eventVerb: t,
                  eventData: n || {},
                });
              }),
              (e.setRequireConsent = function (t) {
                (e.cmpRequired = t), e.setupObserverIfCMP();
              }),
              (e.setupObserverWithCMP = function (t) {
                (e.cmpIndex = t), e.setupObserverIfCMP();
              }),
              (e.setupObserverIfCMP = function () {
                if (void 0 !== e.cmpRequired && void 0 !== e.cmpIndex)
                  if (e.cmpRequired) {
                    if (!window.__tcfapi)
                      return void console.error(
                        "POKI-SDK: enableEventTracking: a CMP is required but no CMP is present."
                      );
                    window.__tcfapi("addEventListener", 2, function (t, n) {
                      !n ||
                        ("tcloaded" !== t.eventStatus &&
                          "useractioncomplete" !== t.eventStatus) ||
                        (window.__tcfapi(
                          "getNonIABVendorConsents",
                          2,
                          function (t) {
                            t &&
                              t.nonIabVendorConsents &&
                              t.nonIabVendorConsents[e.cmpIndex || 0] &&
                              e.setupObserver();
                          }
                        ),
                        window.__tcfapi(
                          "removeEventListener",
                          2,
                          function () {},
                          t.listenerId
                        ));
                    });
                  } else e.setupObserver();
              }),
              (e.setupObserver = function () {
                (E._pokiSessionGlobalName = "pokiSession"),
                  (E._pokiUserGlobalName = "pokiUser"),
                  (E._pokiContextGlobalName = "pokiContext"),
                  (E._pokiTrackerGlobalName = "pokiTracker"),
                  (function (e, t, n) {
                    var p = null;
                    try {
                      d((p = c()))
                        ? ((p.previous_page.path = p.page.path),
                          (p.previous_page.type = p.page.type),
                          (p.previous_page.id = p.page.id),
                          (p.previous_page.start = p.page.start),
                          (p.previous_page.pageview_id = p.page.pageview_id),
                          (p.page.path = e),
                          (p.page.type = t),
                          (p.page.id = n),
                          (p.page.start = Date.now()),
                          (p.page.pageview_id = r()),
                          (p.depth = A() + 1),
                          (p.expire = Date.now() + 18e5))
                        : (p = (function (e, t, n) {
                            try {
                              var c = JSON.parse(i(s) || null);
                              if (d(c))
                                return (
                                  (c.previous_page.path = c.page.path),
                                  (c.previous_page.type = c.page.type),
                                  (c.previous_page.id = c.page.id),
                                  (c.previous_page.start = c.page.start),
                                  (c.previous_page.pageview_id =
                                    c.page.pageview_id),
                                  (c.page.path = e),
                                  (c.page.type = t),
                                  (c.page.id = n),
                                  (c.page.start = Date.now()),
                                  (c.page.pageview_id = r()),
                                  (c.depth = A() + 1),
                                  (c.expire = Date.now() + 18e5),
                                  (c.tab_id = l()),
                                  o(s, JSON.stringify(c)),
                                  c
                                );
                            } catch (e) {
                              var p = null;
                              try {
                                p = i(s) || null;
                              } catch (e) {}
                              a(e, "getSessionDepth", p);
                            }
                            var h = r();
                            return {
                              id: r(),
                              expire: Date.now() + 18e5,
                              tab_id: l(),
                              depth: 1,
                              count: u() + 1,
                              page: {
                                path: e,
                                type: t,
                                id: n,
                                start: Date.now(),
                                pageview_id: h,
                              },
                              previous_page: {},
                              landing_page: {
                                path: e,
                                type: t,
                                id: n,
                                start: Date.now(),
                                pageview_id: h,
                              },
                            };
                          })(e, t, n));
                      try {
                        o("ses_cnt", p.count);
                      } catch (e) {
                        a(e, "updateSession-3");
                      }
                      p.count > 1 &&
                        (function () {
                          try {
                            o("uid_new", "0"),
                              sessionStorage.setItem("uid_new", "0");
                          } catch (e) {}
                          window[window._pokiUserGlobalName] &&
                            (window[window._pokiUserGlobalName].is_new = !1);
                        })();
                      var h = JSON.stringify(p);
                      try {
                        sessionStorage.setItem(s, h);
                      } catch (e) {
                        a(e, "updateSession-1");
                      }
                      window[window._pokiSessionGlobalName] = p;
                      try {
                        o(s, h);
                      } catch (e) {
                        a(e, "updateSession-4");
                      }
                    } catch (e) {
                      a(e, "updateSession-2");
                    }
                  })(window.location.pathname, "external", w.Z.contentGameID),
                  (function () {
                    var e,
                      t,
                      n =
                        null === (e = window[window._pokiUserGlobalName]) ||
                        void 0 === e
                          ? void 0
                          : e.id,
                      a =
                        (null === (t = window[window._pokiUserGlobalName]) ||
                        void 0 === t
                          ? void 0
                          : t.is_new) || !1;
                    if (!n)
                      try {
                        (n = sessionStorage.getItem("uid")),
                          (a = "1" === sessionStorage.getItem("uid_new"));
                      } catch (e) {}
                    n || ((n = i("uid")), (a = "1" === i("uid_new"))),
                      n || ((n = r()), (a = !0)),
                      o("uid", n),
                      o("uid_new", a ? "1" : "0");
                    try {
                      sessionStorage.setItem("uid", n),
                        sessionStorage.setItem("uid_new", a ? "1" : "0");
                    } catch (e) {}
                    window[window._pokiUserGlobalName] = { id: n, is_new: a };
                  })(),
                  (E[E._pokiContextGlobalName] = {
                    tag: null,
                    site: {
                      id: null,
                      domain: window.location.hostname,
                      prefix: "",
                    },
                    page: {
                      id: w.Z.contentGameID,
                      type: "external",
                      path: window.location.pathname,
                    },
                    user: E[E._pokiUserGlobalName],
                    session: E[E._pokiSessionGlobalName],
                  }),
                  (E.pokiGTM = E.pokiGTM || []),
                  (0, y.Z)("https://a.poki.com/observer/t2.js"),
                  (e.logToObserver = !0);
              }),
              (e.logToObserver = !1),
              (e.cmpRequired = void 0),
              (e.cmpIndex = void 0),
              (e.playtestMessageCallback = function () {}),
              e
            );
          })();
        const x = I;
      },
      662: (e, t, n) => {
        "use strict";
        n.d(t, { D: () => o, M: () => r });
        var i = [
            "AT",
            "BE",
            "BG",
            "HR",
            "CY",
            "CZ",
            "DK",
            "EE",
            "FI",
            "FR",
            "DE",
            "GR",
            "GB",
            "HU",
            "IE",
            "IT",
            "LV",
            "LT",
            "LU",
            "MT",
            "NL",
            "PL",
            "PT",
            "RO",
            "SK",
            "SI",
            "ES",
            "SE",
            "IS",
            "LI",
            "NO",
          ],
          o = "ZZ";
        function r(e) {
          return i.includes(e);
        }
      },
      298: (e, t, n) => {
        "use strict";
        n.d(t, { Z: () => o });
        var i = n(888);
        const o = (function () {
          function e() {}
          return (
            (e.debug = !1),
            (e.log = !1),
            (e.init = function (t, n) {
              var o,
                r,
                a = window.location.hostname;
              void 0 === t &&
                ("test" ===
                (null ===
                  (r =
                    null ===
                      (o =
                        null === window || void 0 === window
                          ? void 0
                          : window.process) || void 0 === o
                      ? void 0
                      : o.env) || void 0 === r
                  ? void 0
                  : r.NODE_ENV)
                  ? ((t = !1), void 0 === n && (n = !1))
                  : "localhost" === a || "127.0.0.1" === a || "[::1]" === a
                  ? ((t = !0), void 0 === n && (n = !1))
                  : ((t = !1), void 0 === n && (n = !1))),
                a.endsWith(".poki-gdn.com")
                  ? ((t = !1), (n = !1))
                  : ("qa-files.poki.com" !== a &&
                      "inspector-uploads.poki-user-content.com" !== a) ||
                    ((t = !0), (n = !0)),
                i.Z.debugMode && (t = !0),
                i.Z.logMode && (n = !0),
                void 0 === n && (n = t),
                (e.debug = t),
                (e.log = n);
            }),
            e
          );
        })();
      },
      906: (e, t, n) => {
        "use strict";
        n.d(t, { Z: () => i });
        const i = function (e, t) {
          var n;
          if ("undefined" == typeof window && !t) return "";
          e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
          var i = new RegExp("(?:[\\?&]|^)".concat(e, "=([^&#]*)")).exec(
            t ||
              (null ===
                (n =
                  null === window || void 0 === window
                    ? void 0
                    : window.location) || void 0 === n
                ? void 0
                : n.search) ||
              ""
          );
          return null === i ? "" : decodeURIComponent(i[1].replace(/\+/g, " "));
        };
      },
      640: () => {
        var e = document.createElement("style");
        (e.innerHTML = "\n\t".concat(
          "\n\tcanvas{\n\t\ttouch-action: none;\n\t\t-webkit-touch-callout: none;\n\t\t-webkit-user-select: none;\n\t\t-moz-user-select: none;\n\t\t-ms-user-select: none;\n\t\tuser-select: none;\n\t}\n",
          "\n"
        )),
          document.head.appendChild(e);
      },
      893: (e, t, n) => {
        "use strict";
        n.d(t, { Z: () => i });
        const i = function () {
          return (
            "undefined" != typeof navigator &&
            /(?:phone|windows\s+phone|ipod|blackberry|(?:android|bb\d+|meego|silk|googlebot) .+? mobile|palm|windows\s+ce|opera\smini|avantgo|mobilesafari|docomo)/i.test(
              navigator.userAgent
            )
          );
        };
      },
      573: (e, t, n) => {
        "use strict";
        n.d(t, { Z: () => i });
        const i = function () {
          return (
            "undefined" != typeof navigator &&
            /(?:ipad|playbook|(?:android|bb\d+|meego|silk)(?! .+? mobile))/i.test(
              navigator.userAgent
            )
          );
        };
      },
      699: (e, t, n) => {
        "use strict";
        n.d(t, { Z: () => i });
        const i = function (e) {
          return new Promise(function (t, n) {
            var i = document.createElement("script");
            (i.type = "text/javascript"), (i.async = !0), (i.src = e);
            var o = function () {
              (i.readyState &&
                "loaded" !== i.readyState &&
                "complete" !== i.readyState) ||
                (t(), (i.onload = null), (i.onreadystatechange = null));
            };
            (i.onload = o),
              (i.onreadystatechange = o),
              (i.onerror = n),
              document.head.appendChild(i);
          });
        };
      },
      902: (e, t, n) => {
        "use strict";
        n.d(t, { Z: () => s });
        var i = n(298),
          o = n(888),
          r = n(58),
          a = function () {
            return (
              (a =
                Object.assign ||
                function (e) {
                  for (var t, n = 1, i = arguments.length; n < i; n++)
                    for (var o in (t = arguments[n]))
                      Object.prototype.hasOwnProperty.call(t, o) &&
                        (e[o] = t[o]);
                  return e;
                }),
              a.apply(this, arguments)
            );
          };
        const s = function (e) {
          var t;
          if ("undefined" != typeof window && "undefined" != typeof fetch) {
            var n = r.Z.getVideoDataAnnotations(),
              s = e.size;
            (null === (t = e.event) || void 0 === t
              ? void 0
              : t.startsWith("video-")) && (s = "640x360v");
            var d = a(a({}, e), {
              size: s,
              opportunity_id: e.opportunityId || n.opportunityId,
              ad_unit_path: e.adUnitPath || n.adUnitPath,
              p4d_game_id: o.Z.gameID,
              p4d_version_id: o.Z.versionID,
              bidder: e.bidder || n.bidder,
              bid: e.bid || n.bid || 0,
              error_code: e.errorCode,
              creative_id: e.creativeId || n.creativeId,
              experiment: o.Z.experiment,
            });
            i.Z.debug
              ? console.log("PokiAdServer Tracking: ", d)
              : fetch("https://t.poki.io/adserver", {
                  method: "POST",
                  mode: "no-cors",
                  body: JSON.stringify(d),
                });
          }
        };
      },
      888: (e, t, n) => {
        "use strict";
        n.d(t, { Z: () => l, w: () => c });
        var i = n(662),
          o = n(906),
          r = n(893),
          a = n(573);
        var s = (0, o.Z)("url_referrer") || "",
          d = {
            bot: "1" === (0, o.Z)("bot"),
            categories: (0, o.Z)("categories") || "",
            device: (0, r.Z)() ? "mobile" : (0, a.Z)() ? "tablet" : "desktop",
            experiment: (0, o.Z)("experiment") || "",
            forceAd: (0, o.Z)("force_ad") || !1,
            isPokiIframe: (parseInt((0, o.Z)("site_id"), 10) || 0) > 0,
            siteID: parseInt((0, o.Z)("site_id"), 10) || 0,
            tag: (0, o.Z)("tag") || "",
            versionID: (0, o.Z)("game_version_id"),
            debugMode: "true" === (0, o.Z)("pokiDebug"),
            logMode: "" !== (0, o.Z)("pokiLogging"),
            playtest: (0, o.Z)("playtest"),
            testVideos: "true" === (0, o.Z)("testVideos"),
            referrer: s,
            isPlayground: !!window.isPokiPlayground,
            ccpaApplies: (0, o.Z)("ccpaApplies"),
            childDirected: ["kiloo.com"].some(function (e) {
              return s.includes(e);
            }),
            country: ((0, o.Z)("country") || "").toUpperCase(),
            gameID: (0, o.Z)("game_id"),
            gdprApplies: (0, i.M)(((0, o.Z)("country") || "").toUpperCase()),
            nonPersonalized: !1,
            contentGameID: void 0,
            specialCondition: (0, o.Z)("special_condition"),
          },
          c = function (e, t) {
            d[e] = t;
          };
        const l = d;
      },
      992: (e, t, n) => {
        "use strict";
        n.d(t, { Z: () => i });
        const i = function (e, t) {
          var n = !1;
          return (
            Object.keys(t).forEach(function (i) {
              t[i] === e && (n = !0);
            }),
            n
          );
        };
      },
    },
    r = {};
  function a(e) {
    var t = r[e];
    if (void 0 !== t) return t.exports;
    var n = (r[e] = { exports: {} });
    return o[e].call(n.exports, n, n.exports, a), n.exports;
  }
  (a.m = o),
    (a.n = (e) => {
      var t = e && e.__esModule ? () => e.default : () => e;
      return a.d(t, { a: t }), t;
    }),
    (t = Object.getPrototypeOf
      ? (e) => Object.getPrototypeOf(e)
      : (e) => e.__proto__),
    (a.t = function (n, i) {
      if ((1 & i && (n = this(n)), 8 & i)) return n;
      if ("object" == typeof n && n) {
        if (4 & i && n.__esModule) return n;
        if (16 & i && "function" == typeof n.then) return n;
      }
      var o = Object.create(null);
      a.r(o);
      var r = {};
      e = e || [null, t({}), t([]), t(t)];
      for (var s = 2 & i && n; "object" == typeof s && !~e.indexOf(s); s = t(s))
        Object.getOwnPropertyNames(s).forEach((e) => (r[e] = () => n[e]));
      return (r.default = () => n), a.d(o, r), o;
    }),
    (a.d = (e, t) => {
      for (var n in t)
        a.o(t, n) &&
          !a.o(e, n) &&
          Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
    }),
    (a.f = {}),
    (a.e = (e) =>
      Promise.all(Object.keys(a.f).reduce((t, n) => (a.f[n](e, t), t), []))),
    (a.u = (e) => e + "-v2.341.3.js"),
    (a.g = (function () {
      if ("object" == typeof globalThis) return globalThis;
      try {
        return this || new Function("return this")();
      } catch (e) {
        if ("object" == typeof window) return window;
      }
    })()),
    (a.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
    (n = {}),
    (i = "@poki/poki-sdk:"),
    (a.l = (e, t, o, r) => {
      if (n[e]) n[e].push(t);
      else {
        var s, d;
        if (void 0 !== o)
          for (
            var c = document.getElementsByTagName("script"), l = 0;
            l < c.length;
            l++
          ) {
            var A = c[l];
            if (
              A.getAttribute("src") == e ||
              A.getAttribute("data-webpack") == i + o
            ) {
              s = A;
              break;
            }
          }
        s ||
          ((d = !0),
          ((s = document.createElement("script")).charset = "utf-8"),
          (s.timeout = 120),
          a.nc && s.setAttribute("nonce", a.nc),
          s.setAttribute("data-webpack", i + o),
          (s.src = e)),
          (n[e] = [t]);
        var u = (t, i) => {
            (s.onerror = s.onload = null), clearTimeout(p);
            var o = n[e];
            if (
              (delete n[e],
              s.parentNode && s.parentNode.removeChild(s),
              o && o.forEach((e) => e(i)),
              t)
            )
              return t(i);
          },
          p = setTimeout(
            u.bind(null, void 0, { type: "timeout", target: s }),
            12e4
          );
        (s.onerror = u.bind(null, s.onerror)),
          (s.onload = u.bind(null, s.onload)),
          d && document.head.appendChild(s);
      }
    }),
    (a.r = (e) => {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (() => {
      var e;
      a.g.importScripts && (e = a.g.location + "");
      var t = a.g.document;
      if (!e && t && (t.currentScript && (e = t.currentScript.src), !e)) {
        var n = t.getElementsByTagName("script");
        n.length && (e = n[n.length - 1].src);
      }
      if (!e)
        throw new Error(
          "Automatic publicPath is not supported in this browser"
        );
      (e = e
        .replace(/#.*$/, "")
        .replace(/\?.*$/, "")
        .replace(/\/[^\/]+$/, "/")),
        (a.p = e);
    })(),
    (() => {
      var e = { 702: 0 };
      a.f.j = (t, n) => {
        var i = a.o(e, t) ? e[t] : void 0;
        if (0 !== i)
          if (i) n.push(i[2]);
          else {
            var o = new Promise((n, o) => (i = e[t] = [n, o]));
            n.push((i[2] = o));
            var r = a.p + a.u(t),
              s = new Error();
            a.l(
              r,
              (n) => {
                if (a.o(e, t) && (0 !== (i = e[t]) && (e[t] = void 0), i)) {
                  var o = n && ("load" === n.type ? "missing" : n.type),
                    r = n && n.target && n.target.src;
                  (s.message =
                    "Loading chunk " + t + " failed.\n(" + o + ": " + r + ")"),
                    (s.name = "ChunkLoadError"),
                    (s.type = o),
                    (s.request = r),
                    i[1](s);
                }
              },
              "chunk-" + t,
              t
            );
          }
      };
      var t = (t, n) => {
          var i,
            o,
            [r, s, d] = n,
            c = 0;
          if (r.some((t) => 0 !== e[t])) {
            for (i in s) a.o(s, i) && (a.m[i] = s[i]);
            if (d) d(a);
          }
          for (t && t(n); c < r.length; c++)
            (o = r[c]), a.o(e, o) && e[o] && e[o][0](), (e[o] = 0);
        },
        n = (self.webpackChunk_poki_poki_sdk =
          self.webpackChunk_poki_poki_sdk || []);
      n.forEach(t.bind(null, 0)), (n.push = t.bind(null, n.push.bind(n)));
    })(),
    (() => {
      "use strict";
      var e = new (a(735).Z)();
      for (var t in e) window.PokiSDK[t] = e[t];
    })();
})();
