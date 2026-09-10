function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$1 = Symbol.for("react.element"), n$1 = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v$1 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
function A$1(a) {
  if (null === a || "object" !== typeof a) return null;
  a = z$1 && a[z$1] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var B$1 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$1 = Object.assign, D$1 = {};
function E$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function(a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a, b, "setState");
};
E$1.prototype.forceUpdate = function(a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F() {
}
F.prototype = E$1.prototype;
function G$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
var H$1 = G$1.prototype = new F();
H$1.constructor = G$1;
C$1(H$1, E$1.prototype);
H$1.isPureReactComponent = true;
var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
function M$1(a, b, e) {
  var d, c = {}, k2 = null, h = null;
  if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b) J.call(b, d) && !L$1.hasOwnProperty(d) && (c[d] = b[d]);
  var g = arguments.length - 2;
  if (1 === g) c.children = e;
  else if (1 < g) {
    for (var f2 = Array(g), m2 = 0; m2 < g; m2++) f2[m2] = arguments[m2 + 2];
    c.children = f2;
  }
  if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
  return { $$typeof: l$1, type: a, key: k2, ref: h, props: c, _owner: K$1.current };
}
function N$1(a, b) {
  return { $$typeof: l$1, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function O$1(a) {
  return "object" === typeof a && null !== a && a.$$typeof === l$1;
}
function escape(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
var P$1 = /\/+/g;
function Q$1(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function R$1(a, b, e, d, c) {
  var k2 = typeof a;
  if ("undefined" === k2 || "boolean" === k2) a = null;
  var h = false;
  if (null === a) h = true;
  else switch (k2) {
    case "string":
    case "number":
      h = true;
      break;
    case "object":
      switch (a.$$typeof) {
        case l$1:
        case n$1:
          h = true;
      }
  }
  if (h) return h = a, c = c(h), a = "" === d ? "." + Q$1(h, 0) : d, I$1(c) ? (e = "", null != a && (e = a.replace(P$1, "$&/") + "/"), R$1(c, b, e, "", function(a2) {
    return a2;
  })) : null != c && (O$1(c) && (c = N$1(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P$1, "$&/") + "/") + a)), b.push(c)), 1;
  h = 0;
  d = "" === d ? "." : d + ":";
  if (I$1(a)) for (var g = 0; g < a.length; g++) {
    k2 = a[g];
    var f2 = d + Q$1(k2, g);
    h += R$1(k2, b, e, f2, c);
  }
  else if (f2 = A$1(a), "function" === typeof f2) for (a = f2.call(a), g = 0; !(k2 = a.next()).done; ) k2 = k2.value, f2 = d + Q$1(k2, g++), h += R$1(k2, b, e, f2, c);
  else if ("object" === k2) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h;
}
function S$1(a, b, e) {
  if (null == a) return a;
  var d = [], c = 0;
  R$1(a, d, "", "", function(a2) {
    return b.call(e, a2, c++);
  });
  return d;
}
function T$1(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
    }, function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status) return a._result.default;
  throw a._result;
}
var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
function X$2() {
  throw Error("act(...) is not supported in production builds of React.");
}
react_production_min.Children = { map: S$1, forEach: function(a, b, e) {
  S$1(a, function() {
    b.apply(this, arguments);
  }, e);
}, count: function(a) {
  var b = 0;
  S$1(a, function() {
    b++;
  });
  return b;
}, toArray: function(a) {
  return S$1(a, function(a2) {
    return a2;
  }) || [];
}, only: function(a) {
  if (!O$1(a)) throw Error("React.Children.only expected to receive a single React element child.");
  return a;
} };
react_production_min.Component = E$1;
react_production_min.Fragment = p$2;
react_production_min.Profiler = r;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$1;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.act = X$2;
react_production_min.cloneElement = function(a, b, e) {
  if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
  var d = C$1({}, a.props), c = a.key, k2 = a.ref, h = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k2 = b.ref, h = K$1.current);
    void 0 !== b.key && (c = "" + b.key);
    if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
    for (f2 in b) J.call(b, f2) && !L$1.hasOwnProperty(f2) && (d[f2] = void 0 === b[f2] && void 0 !== g ? g[f2] : b[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2) d.children = e;
  else if (1 < f2) {
    g = Array(f2);
    for (var m2 = 0; m2 < f2; m2++) g[m2] = arguments[m2 + 2];
    d.children = g;
  }
  return { $$typeof: l$1, type: a.type, key: c, ref: k2, props: d, _owner: h };
};
react_production_min.createContext = function(a) {
  a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a.Provider = { $$typeof: t, _context: a };
  return a.Consumer = a;
};
react_production_min.createElement = M$1;
react_production_min.createFactory = function(a) {
  var b = M$1.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a) {
  return { $$typeof: v$1, render: a };
};
react_production_min.isValidElement = O$1;
react_production_min.lazy = function(a) {
  return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T$1 };
};
react_production_min.memo = function(a, b) {
  return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
};
react_production_min.startTransition = function(a) {
  var b = V$1.transition;
  V$1.transition = {};
  try {
    a();
  } finally {
    V$1.transition = b;
  }
};
react_production_min.unstable_act = X$2;
react_production_min.useCallback = function(a, b) {
  return U$1.current.useCallback(a, b);
};
react_production_min.useContext = function(a) {
  return U$1.current.useContext(a);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a) {
  return U$1.current.useDeferredValue(a);
};
react_production_min.useEffect = function(a, b) {
  return U$1.current.useEffect(a, b);
};
react_production_min.useId = function() {
  return U$1.current.useId();
};
react_production_min.useImperativeHandle = function(a, b, e) {
  return U$1.current.useImperativeHandle(a, b, e);
};
react_production_min.useInsertionEffect = function(a, b) {
  return U$1.current.useInsertionEffect(a, b);
};
react_production_min.useLayoutEffect = function(a, b) {
  return U$1.current.useLayoutEffect(a, b);
};
react_production_min.useMemo = function(a, b) {
  return U$1.current.useMemo(a, b);
};
react_production_min.useReducer = function(a, b, e) {
  return U$1.current.useReducer(a, b, e);
};
react_production_min.useRef = function(a) {
  return U$1.current.useRef(a);
};
react_production_min.useState = function(a) {
  return U$1.current.useState(a);
};
react_production_min.useSyncExternalStore = function(a, b, e) {
  return U$1.current.useSyncExternalStore(a, b, e);
};
react_production_min.useTransition = function() {
  return U$1.current.useTransition();
};
react_production_min.version = "18.3.1";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
const React$2 = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = reactExports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m$1.call(a, b) && !p$1.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports) {
  function f2(a, b) {
    var c = a.length;
    a.push(b);
    a: for (; 0 < c; ) {
      var d = c - 1 >>> 1, e = a[d];
      if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
      else break a;
    }
  }
  function h(a) {
    return 0 === a.length ? null : a[0];
  }
  function k2(a) {
    if (0 === a.length) return null;
    var b = a[0], c = a.pop();
    if (c !== b) {
      a[0] = c;
      a: for (var d = 0, e = a.length, w2 = e >>> 1; d < w2; ) {
        var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
        if (0 > g(C2, c)) n2 < e && 0 > g(x2, C2) ? (a[d] = x2, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
        else if (n2 < e && 0 > g(x2, c)) a[d] = x2, a[n2] = c, d = n2;
        else break a;
      }
    }
    return b;
  }
  function g(a, b) {
    var c = a.sortIndex - b.sortIndex;
    return 0 !== c ? c : a.id - b.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a) {
    for (var b = h(t2); null !== b; ) {
      if (null === b.callback) k2(t2);
      else if (b.startTime <= a) k2(t2), b.sortIndex = b.expirationTime, f2(r2, b);
      else break;
      b = h(t2);
    }
  }
  function H2(a) {
    B2 = false;
    G2(a);
    if (!A2) if (null !== h(r2)) A2 = true, I2(J2);
    else {
      var b = h(t2);
      null !== b && K2(H2, b.startTime - a);
    }
  }
  function J2(a, b) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c = y2;
    try {
      G2(b);
      for (v2 = h(r2); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
        var d = v2.callback;
        if ("function" === typeof d) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e = d(v2.expirationTime <= b);
          b = exports.unstable_now();
          "function" === typeof e ? v2.callback = e : v2 === h(r2) && k2(r2);
          G2(b);
        } else k2(r2);
        v2 = h(r2);
      }
      if (null !== v2) var w2 = true;
      else {
        var m2 = h(t2);
        null !== m2 && K2(H2, m2.startTime - b);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a = exports.unstable_now();
      Q2 = a;
      var b = true;
      try {
        b = O2(true, a);
      } finally {
        b ? S2() : (N2 = false, O2 = null);
      }
    } else N2 = false;
  }
  var S2;
  if ("function" === typeof F2) S2 = function() {
    F2(R2);
  };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else S2 = function() {
    D2(R2, 0);
  };
  function I2(a) {
    O2 = a;
    N2 || (N2 = true, S2());
  }
  function K2(a, b) {
    L2 = D2(function() {
      a(exports.unstable_now());
    }, b);
  }
  exports.unstable_IdlePriority = 5;
  exports.unstable_ImmediatePriority = 1;
  exports.unstable_LowPriority = 4;
  exports.unstable_NormalPriority = 3;
  exports.unstable_Profiling = null;
  exports.unstable_UserBlockingPriority = 2;
  exports.unstable_cancelCallback = function(a) {
    a.callback = null;
  };
  exports.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports.unstable_forceFrameRate = function(a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  exports.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports.unstable_getFirstCallbackNode = function() {
    return h(r2);
  };
  exports.unstable_next = function(a) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b = 3;
        break;
      default:
        b = y2;
    }
    var c = y2;
    y2 = b;
    try {
      return a();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_pauseExecution = function() {
  };
  exports.unstable_requestPaint = function() {
  };
  exports.unstable_runWithPriority = function(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var c = y2;
    y2 = a;
    try {
      return b();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_scheduleCallback = function(a, b, c) {
    var d = exports.unstable_now();
    "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
    switch (a) {
      case 1:
        var e = -1;
        break;
      case 2:
        e = 250;
        break;
      case 5:
        e = 1073741823;
        break;
      case 4:
        e = 1e4;
        break;
      default:
        e = 5e3;
    }
    e = c + e;
    a = { id: u2++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
    c > d ? (a.sortIndex = c, f2(t2, a), null === h(r2) && a === h(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
    return a;
  };
  exports.unstable_shouldYield = M2;
  exports.unstable_wrapCallback = function(a) {
    var b = y2;
    return function() {
      var c = y2;
      y2 = b;
      try {
        return a.apply(this, arguments);
      } finally {
        y2 = c;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a, b) {
  ha(a, b);
  ha(a + "Capture", b);
}
function ha(a, b) {
  ea[a] = b;
  for (a = 0; a < b.length; a++) da.add(b[a]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a) {
  if (ja.call(ma, a)) return true;
  if (ja.call(la, a)) return false;
  if (ka.test(a)) return ma[a] = true;
  la[a] = true;
  return false;
}
function pa(a, b, c, d) {
  if (null !== c && 0 === c.type) return false;
  switch (typeof b) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d) return false;
      if (null !== c) return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;
    default:
      return false;
  }
}
function qa(a, b, c, d) {
  if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
  if (d) return false;
  if (null !== c) switch (c.type) {
    case 3:
      return !b;
    case 4:
      return false === b;
    case 5:
      return isNaN(b);
    case 6:
      return isNaN(b) || 1 > b;
  }
  return false;
}
function v(a, b, c, d, e, f2, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f2;
  this.removeEmptyString = g;
}
var z = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
  z[a] = new v(a, 0, false, a, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
  var b = a[0];
  z[b] = new v(b, 1, false, a[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
  z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
  z[a] = new v(a, 2, false, a, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
  z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a) {
  z[a] = new v(a, 3, true, a, null, false, false);
});
["capture", "download"].forEach(function(a) {
  z[a] = new v(a, 4, false, a, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a) {
  z[a] = new v(a, 6, false, a, null, false, false);
});
["rowSpan", "start"].forEach(function(a) {
  z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a) {
  return a[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
  var b = a.replace(
    ra,
    sa
  );
  z[b] = new v(b, 1, false, a, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
});
z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
});
function ta(a, b, c, d) {
  var e = z.hasOwnProperty(b) ? z[b] : null;
  if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a) {
  if (null === a || "object" !== typeof a) return null;
  a = Ja && a[Ja] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var A = Object.assign, La;
function Ma(a) {
  if (void 0 === La) try {
    throw Error();
  } catch (c) {
    var b = c.stack.trim().match(/\n( *(at )?)/);
    La = b && b[1] || "";
  }
  return "\n" + La + a;
}
var Na = false;
function Oa(a, b) {
  if (!a || Na) return "";
  Na = true;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b) if (b = function() {
      throw Error();
    }, Object.defineProperty(b.prototype, "props", { set: function() {
      throw Error();
    } }), "object" === typeof Reflect && Reflect.construct) {
      try {
        Reflect.construct(b, []);
      } catch (l2) {
        var d = l2;
      }
      Reflect.construct(a, [], b);
    } else {
      try {
        b.call();
      } catch (l2) {
        d = l2;
      }
      a.call(b.prototype);
    }
    else {
      try {
        throw Error();
      } catch (l2) {
        d = l2;
      }
      a();
    }
  } catch (l2) {
    if (l2 && d && "string" === typeof l2.stack) {
      for (var e = l2.stack.split("\n"), f2 = d.stack.split("\n"), g = e.length - 1, h = f2.length - 1; 1 <= g && 0 <= h && e[g] !== f2[h]; ) h--;
      for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f2[h]) {
        if (1 !== g || 1 !== h) {
          do
            if (g--, h--, 0 > h || e[g] !== f2[h]) {
              var k2 = "\n" + e[g].replace(" at new ", " at ");
              a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
              return k2;
            }
          while (1 <= g && 0 <= h);
        }
        break;
      }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c;
  }
  return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
}
function Pa(a) {
  switch (a.tag) {
    case 5:
      return Ma(a.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a = Oa(a.type, false), a;
    case 11:
      return a = Oa(a.type.render, false), a;
    case 1:
      return a = Oa(a.type, true), a;
    default:
      return "";
  }
}
function Qa(a) {
  if (null == a) return null;
  if ("function" === typeof a) return a.displayName || a.name || null;
  if ("string" === typeof a) return a;
  switch (a) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a) switch (a.$$typeof) {
    case Ca:
      return (a.displayName || "Context") + ".Consumer";
    case Ba:
      return (a._context.displayName || "Context") + ".Provider";
    case Da:
      var b = a.render;
      a = a.displayName;
      a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      return a;
    case Ga:
      return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
    case Ha:
      b = a._payload;
      a = a._init;
      try {
        return Qa(a(b));
      } catch (c) {
      }
  }
  return null;
}
function Ra(a) {
  var b = a.type;
  switch (a.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b.displayName || "Context") + ".Consumer";
    case 10:
      return (b._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b);
    case 8:
      return b === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b) return b.displayName || b.name || null;
      if ("string" === typeof b) return b;
  }
  return null;
}
function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a;
    case "object":
      return a;
    default:
      return "";
  }
}
function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}
function Ua(a) {
  var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e = c.get, f2 = c.set;
    Object.defineProperty(a, b, { configurable: true, get: function() {
      return e.call(this);
    }, set: function(a2) {
      d = "" + a2;
      f2.call(this, a2);
    } });
    Object.defineProperty(a, b, { enumerable: c.enumerable });
    return { getValue: function() {
      return d;
    }, setValue: function(a2) {
      d = "" + a2;
    }, stopTracking: function() {
      a._valueTracker = null;
      delete a[b];
    } };
  }
}
function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}
function Wa(a) {
  if (!a) return false;
  var b = a._valueTracker;
  if (!b) return true;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), true) : false;
}
function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a) return null;
  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}
function Ya(a, b) {
  var c = b.checked;
  return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
}
function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
}
function ab(a, b) {
  b = b.checked;
  null != b && ta(a, "checked", b, false);
}
function bb(a, b) {
  ab(a, b);
  var c = Sa(b.value), d = b.type;
  if (null != c) if ("number" === d) {
    if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
  } else a.value !== "" + c && (a.value = "" + c);
  else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}
function db(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }
  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}
function cb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}
var eb = Array.isArray;
function fb(a, b, c, d) {
  a = a.options;
  if (b) {
    b = {};
    for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
    for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
  } else {
    c = "" + Sa(c);
    b = null;
    for (e = 0; e < a.length; e++) {
      if (a[e].value === c) {
        a[e].selected = true;
        d && (a[e].defaultSelected = true);
        return;
      }
      null !== b || a[e].disabled || (b = a[e]);
    }
    null !== b && (b.selected = true);
  }
}
function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
  return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
}
function hb(a, b) {
  var c = b.value;
  if (null == c) {
    c = b.children;
    b = b.defaultValue;
    if (null != c) {
      if (null != b) throw Error(p(92));
      if (eb(c)) {
        if (1 < c.length) throw Error(p(93));
        c = c[0];
      }
      b = c;
    }
    null == b && (b = "");
    c = b;
  }
  a._wrapperState = { initialValue: Sa(c) };
}
function ib(a, b) {
  var c = Sa(b.value), d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}
function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}
function kb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}
var mb, nb = function(a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
    MSApp.execUnsafeLocalFunction(function() {
      return a(b, c, d, e);
    });
  } : a;
}(function(a, b) {
  if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
    for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
    for (; b.firstChild; ) a.appendChild(b.firstChild);
  }
});
function ob(a, b) {
  if (b) {
    var c = a.firstChild;
    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }
  a.textContent = b;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a) {
  qb.forEach(function(b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    pb[b] = pb[a];
  });
});
function rb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
}
function sb(a, b) {
  a = a.style;
  for (var c in b) if (b.hasOwnProperty(c)) {
    var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
    "float" === c && (c = "cssFloat");
    d ? a.setProperty(c, e) : a[c] = e;
  }
}
var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a, b) {
  if (b) {
    if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children) throw Error(p(60));
      if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
    }
    if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
  }
}
function vb(a, b) {
  if (-1 === a.indexOf("-")) return "string" === typeof b.is;
  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}
var yb = null, zb = null, Ab = null;
function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb) throw Error(p(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}
function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}
function Fb() {
  if (zb) {
    var a = zb, b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
  }
}
function Gb(a, b) {
  return a(b);
}
function Hb() {
}
var Ib = false;
function Jb(a, b, c) {
  if (Ib) return a(b, c);
  Ib = true;
  try {
    return Gb(a, b, c);
  } finally {
    if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
  }
}
function Kb(a, b) {
  var c = a.stateNode;
  if (null === c) return null;
  var d = Db(c);
  if (null === d) return null;
  c = d[b];
  a: switch (b) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
      a = !d;
      break a;
    default:
      a = false;
  }
  if (a) return null;
  if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
  return c;
}
var Lb = false;
if (ia) try {
  var Mb = {};
  Object.defineProperty(Mb, "passive", { get: function() {
    Lb = true;
  } });
  window.addEventListener("test", Mb, Mb);
  window.removeEventListener("test", Mb, Mb);
} catch (a) {
  Lb = false;
}
function Nb(a, b, c, d, e, f2, g, h, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b.apply(c, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
  Ob = true;
  Pb = a;
} };
function Tb(a, b, c, d, e, f2, g, h, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a, b, c, d, e, f2, g, h, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else throw Error(p(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a) {
  var b = a, c = a;
  if (a.alternate) for (; b.return; ) b = b.return;
  else {
    a = b;
    do
      b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
    while (a);
  }
  return 3 === b.tag ? c : null;
}
function Wb(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b) return b.dehydrated;
  }
  return null;
}
function Xb(a) {
  if (Vb(a) !== a) throw Error(p(188));
}
function Yb(a) {
  var b = a.alternate;
  if (!b) {
    b = Vb(a);
    if (null === b) throw Error(p(188));
    return b !== a ? null : a;
  }
  for (var c = a, d = b; ; ) {
    var e = c.return;
    if (null === e) break;
    var f2 = e.alternate;
    if (null === f2) {
      d = e.return;
      if (null !== d) {
        c = d;
        continue;
      }
      break;
    }
    if (e.child === f2.child) {
      for (f2 = e.child; f2; ) {
        if (f2 === c) return Xb(e), a;
        if (f2 === d) return Xb(e), b;
        f2 = f2.sibling;
      }
      throw Error(p(188));
    }
    if (c.return !== d.return) c = e, d = f2;
    else {
      for (var g = false, h = e.child; h; ) {
        if (h === c) {
          g = true;
          c = e;
          d = f2;
          break;
        }
        if (h === d) {
          g = true;
          d = e;
          c = f2;
          break;
        }
        h = h.sibling;
      }
      if (!g) {
        for (h = f2.child; h; ) {
          if (h === c) {
            g = true;
            c = f2;
            d = e;
            break;
          }
          if (h === d) {
            g = true;
            d = f2;
            c = e;
            break;
          }
          h = h.sibling;
        }
        if (!g) throw Error(p(189));
      }
    }
    if (c.alternate !== d) throw Error(p(190));
  }
  if (3 !== c.tag) throw Error(p(188));
  return c.stateNode.current === c ? a : b;
}
function Zb(a) {
  a = Yb(a);
  return null !== a ? $b(a) : null;
}
function $b(a) {
  if (5 === a.tag || 6 === a.tag) return a;
  for (a = a.child; null !== a; ) {
    var b = $b(a);
    if (null !== b) return b;
    a = a.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a) {
  if (lc && "function" === typeof lc.onCommitFiberRoot) try {
    lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
  } catch (b) {
  }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a) {
  switch (a & -a) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a;
  }
}
function uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c) return 0;
  var d = 0, e = a.suspendedLanes, f2 = a.pingedLanes, g = c & 268435455;
  if (0 !== g) {
    var h = g & ~e;
    0 !== h ? d = tc(h) : (f2 &= g, 0 !== f2 && (d = tc(f2)));
  } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f2 && (d = tc(f2));
  if (0 === d) return 0;
  if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f2 = b & -b, e >= f2 || 16 === e && 0 !== (f2 & 4194240))) return b;
  0 !== (d & 4) && (d |= c & 16);
  b = a.entangledLanes;
  if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
  return d;
}
function vc(a, b) {
  switch (a) {
    case 1:
    case 2:
    case 4:
      return b + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a, b) {
  for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
    var g = 31 - oc(f2), h = 1 << g, k2 = e[g];
    if (-1 === k2) {
      if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
    } else k2 <= b && (a.expiredLanes |= h);
    f2 &= ~h;
  }
}
function xc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a;
}
function zc(a) {
  for (var b = [], c = 0; 31 > c; c++) b.push(a);
  return b;
}
function Ac(a, b, c) {
  a.pendingLanes |= b;
  536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
  a = a.eventTimes;
  b = 31 - oc(b);
  a[b] = c;
}
function Bc(a, b) {
  var c = a.pendingLanes & ~b;
  a.pendingLanes = b;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= b;
  a.mutableReadLanes &= b;
  a.entangledLanes &= b;
  b = a.entanglements;
  var d = a.eventTimes;
  for (a = a.expirationTimes; 0 < c; ) {
    var e = 31 - oc(c), f2 = 1 << e;
    b[e] = 0;
    d[e] = -1;
    a[e] = -1;
    c &= ~f2;
  }
}
function Cc(a, b) {
  var c = a.entangledLanes |= b;
  for (a = a.entanglements; c; ) {
    var d = 31 - oc(c), e = 1 << d;
    e & b | a[d] & b && (a[d] |= b);
    c &= ~e;
  }
}
var C = 0;
function Dc(a) {
  a &= -a;
  return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b.pointerId);
  }
}
function Tc(a, b, c, d, e, f2) {
  if (null === a || a.nativeEvent !== f2) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f2, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e && -1 === b.indexOf(e) && b.push(e);
  return a;
}
function Uc(a, b, c, d, e) {
  switch (b) {
    case "focusin":
      return Lc = Tc(Lc, a, b, c, d, e), true;
    case "dragenter":
      return Mc = Tc(Mc, a, b, c, d, e), true;
    case "mouseover":
      return Nc = Tc(Nc, a, b, c, d, e), true;
    case "pointerover":
      var f2 = e.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a, b, c, d, e));
      return true;
    case "gotpointercapture":
      return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b, c, d, e)), true;
  }
  return false;
}
function Vc(a) {
  var b = Wc(a.target);
  if (null !== b) {
    var c = Vb(b);
    if (null !== c) {
      if (b = c.tag, 13 === b) {
        if (b = Wb(c), null !== b) {
          a.blockedOn = b;
          Ic(a.priority, function() {
            Gc(c);
          });
          return;
        }
      } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
        a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a.blockedOn = null;
}
function Xc(a) {
  if (null !== a.blockedOn) return false;
  for (var b = a.targetContainers; 0 < b.length; ) {
    var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null === c) {
      c = a.nativeEvent;
      var d = new c.constructor(c.type, c);
      wb = d;
      c.target.dispatchEvent(d);
      wb = null;
    } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
    b.shift();
  }
  return true;
}
function Zc(a, b, c) {
  Xc(a) && c.delete(b);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a, b) {
  a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a) {
  function b(b2) {
    return ad(b2, a);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a);
    for (var c = 1; c < Kc.length; c++) {
      var d = Kc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a);
  null !== Mc && ad(Mc, a);
  null !== Nc && ad(Nc, a);
  Oc.forEach(b);
  Pc.forEach(b);
  for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
  for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 1, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function gd(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 4, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function fd(a, b, c, d) {
  if (dd) {
    var e = Yc(a, b, c, d);
    if (null === e) hd(a, b, d, id, c), Sc(a, d);
    else if (Uc(e, a, b, c, d)) d.stopPropagation();
    else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
      for (; null !== e; ) {
        var f2 = Cb(e);
        null !== f2 && Ec(f2);
        f2 = Yc(a, b, c, d);
        null === f2 && hd(a, b, d, id, c);
        if (f2 === e) break;
        e = f2;
      }
      null !== e && d.stopPropagation();
    } else hd(a, b, d, null, c);
  }
}
var id = null;
function Yc(a, b, c, d) {
  id = null;
  a = xb(d);
  a = Wc(a);
  if (null !== a) if (b = Vb(a), null === b) a = null;
  else if (c = b.tag, 13 === c) {
    a = Wb(b);
    if (null !== a) return a;
    a = null;
  } else if (3 === c) {
    if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
    a = null;
  } else b !== a && (a = null);
  id = a;
  return null;
}
function jd(a) {
  switch (a) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md) return md;
  var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
  for (a = 0; a < c && b[a] === e[a]; a++) ;
  var g = c - a;
  for (d = 1; d <= g && b[c - d] === e[f2 - d]; d++) ;
  return md = e.slice(a, 1 < d ? 1 - d : void 0);
}
function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a) {
  function b(b2, d, e, f2, g) {
    this._reactName = b2;
    this._targetInst = e;
    this.type = d;
    this.nativeEvent = f2;
    this.target = g;
    this.currentTarget = null;
    for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f2) : f2[c]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A(b.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a2 = this.nativeEvent;
    a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a2 = this.nativeEvent;
    a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
  return a.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
  return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
}, movementX: function(a) {
  if ("movementX" in a) return a.movementX;
  a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
  return wd;
}, movementY: function(a) {
  return "movementY" in a ? a.movementY : xd;
} }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
  return "clipboardData" in a ? a.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, { key: function(a) {
  if (a.key) {
    var b = Md[a.key] || a.key;
    if ("Unidentified" !== b) return b;
  }
  return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
  return "keypress" === a.type ? od(a) : 0;
}, keyCode: function(a) {
  return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
}, which: function(a) {
  return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
} }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
  deltaX: function(a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function(a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
function ge(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);
    case "keydown":
      return 229 !== b.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}
var ie = false;
function je(a, b) {
  switch (a) {
    case "compositionend":
      return he(b);
    case "keypress":
      if (32 !== b.which) return null;
      fe = true;
      return ee;
    case "textInput":
      return a = b.data, a === ee && fe ? null : a;
    default:
      return null;
  }
}
function ke(a, b) {
  if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
  switch (a) {
    case "paste":
      return null;
    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length) return b.char;
        if (b.which) return String.fromCharCode(b.which);
      }
      return null;
    case "compositionend":
      return de && "ko" !== b.locale ? null : b.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
}
function ne(a, b, c, d) {
  Eb(d);
  b = oe(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
}
var pe = null, qe = null;
function re(a) {
  se(a, 0);
}
function te(a) {
  var b = ue(a);
  if (Wa(b)) return a;
}
function ve(a, b) {
  if ("change" === a) return b;
}
var we = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }
    xe = ye;
  } else xe = false;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}
function Be(a) {
  if ("value" === a.propertyName && te(qe)) {
    var b = [];
    ne(b, qe, a, xb(a));
    Jb(re, b);
  }
}
function Ce(a, b, c) {
  "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
}
function De(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
}
function Ee(a, b) {
  if ("click" === a) return te(b);
}
function Fe(a, b) {
  if ("input" === a || "change" === a) return te(b);
}
function Ge(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var He = "function" === typeof Object.is ? Object.is : Ge;
function Ie(a, b) {
  if (He(a, b)) return true;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
  var c = Object.keys(a), d = Object.keys(b);
  if (c.length !== d.length) return false;
  for (d = 0; d < c.length; d++) {
    var e = c[d];
    if (!ja.call(b, e) || !He(a[e], b[e])) return false;
  }
  return true;
}
function Je(a) {
  for (; a && a.firstChild; ) a = a.firstChild;
  return a;
}
function Ke(a, b) {
  var c = Je(a);
  a = 0;
  for (var d; c; ) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b) return { node: c, offset: b - a };
      a = d;
    }
    a: {
      for (; c; ) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }
        c = c.parentNode;
      }
      c = void 0;
    }
    c = Je(c);
  }
}
function Le(a, b) {
  return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
}
function Me() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = false;
    }
    if (c) a = b.contentWindow;
    else break;
    b = Xa(a.document);
  }
  return b;
}
function Ne(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}
function Oe(a) {
  var b = Me(), c = a.focusedElem, d = a.selectionRange;
  if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
    if (null !== d && Ne(c)) {
      if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
      else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
        a = a.getSelection();
        var e = c.textContent.length, f2 = Math.min(d.start, e);
        d = void 0 === d.end ? f2 : Math.min(d.end, e);
        !a.extend && f2 > d && (e = d, d = f2, f2 = e);
        e = Ke(c, f2);
        var g = Ke(
          c,
          d
        );
        e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f2 > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
      }
    }
    b = [];
    for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
    "function" === typeof c.focus && c.focus();
    for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
}
function Ve(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a) {
  if (Xe[a]) return Xe[a];
  if (!We[a]) return a;
  var b = We[a], c;
  for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
  return a;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a, b) {
  df.set(a, b);
  fa(b, [a]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Ub(d, b, void 0, a);
  a.currentTarget = null;
}
function se(a, b) {
  b = 0 !== (b & 4);
  for (var c = 0; c < a.length; c++) {
    var d = a[c], e = d.event;
    d = d.listeners;
    a: {
      var f2 = void 0;
      if (b) for (var g = d.length - 1; 0 <= g; g--) {
        var h = d[g], k2 = h.instance, l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
      else for (g = 0; g < d.length; g++) {
        h = d[g];
        k2 = h.instance;
        l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
    }
  }
  if (Qb) throw a = Rb, Qb = false, Rb = null, a;
}
function D(a, b) {
  var c = b[of];
  void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
  var d = a + "__bubble";
  c.has(d) || (pf(b, a, 2, false), c.add(d));
}
function qf(a, b, c) {
  var d = 0;
  b && (d |= 4);
  pf(c, a, d, b);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a) {
  if (!a[rf]) {
    a[rf] = true;
    da.forEach(function(b2) {
      "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
    });
    var b = 9 === a.nodeType ? a : a.ownerDocument;
    null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
  }
}
function pf(a, b, c, d) {
  switch (jd(b)) {
    case 1:
      var e = ed;
      break;
    case 4:
      e = gd;
      break;
    default:
      e = fd;
  }
  c = e.bind(null, b, c, a);
  e = void 0;
  !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
  d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
}
function hd(a, b, c, d, e) {
  var f2 = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
    if (null === d) return;
    var g = d.tag;
    if (3 === g || 4 === g) {
      var h = d.stateNode.containerInfo;
      if (h === e || 8 === h.nodeType && h.parentNode === e) break;
      if (4 === g) for (g = d.return; null !== g; ) {
        var k2 = g.tag;
        if (3 === k2 || 4 === k2) {
          if (k2 = g.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e) return;
        }
        g = g.return;
      }
      for (; null !== h; ) {
        g = Wc(h);
        if (null === g) return;
        k2 = g.tag;
        if (5 === k2 || 6 === k2) {
          d = f2 = g;
          continue a;
        }
        h = h.parentNode;
      }
    }
    d = d.return;
  }
  Jb(function() {
    var d2 = f2, e2 = xb(c), g2 = [];
    a: {
      var h2 = df.get(a);
      if (void 0 !== h2) {
        var k3 = td, n2 = a;
        switch (a) {
          case "keypress":
            if (0 === od(c)) break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c.button) break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h2 ? h2 + "Capture" : null : h2;
        t2 = [];
        for (var w2 = d2, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2) break;
          w2 = w2.return;
        }
        0 < t2.length && (h2 = new k3(h2, n2, null, c, e2), g2.push({ event: h2, listeners: t2 }));
      }
    }
    if (0 === (b & 7)) {
      a: {
        h2 = "mouseover" === a || "pointerover" === a;
        k3 = "mouseout" === a || "pointerout" === a;
        if (h2 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf])) break a;
        if (k3 || h2) {
          h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
          if (k3) {
            if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
          } else k3 = null, n2 = d2;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a || "pointerover" === a) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h2 : ue(k3);
            u2 = null == n2 ? h2 : ue(n2);
            h2 = new t2(F2, w2 + "leave", k3, c, e2);
            h2.target = J2;
            h2.relatedTarget = u2;
            F2 = null;
            Wc(e2) === d2 && (t2 = new t2(x2, w2 + "enter", n2, c, e2), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2) b: {
              t2 = k3;
              x2 = n2;
              w2 = 0;
              for (u2 = t2; u2; u2 = vf(u2)) w2++;
              u2 = 0;
              for (F2 = x2; F2; F2 = vf(F2)) u2++;
              for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
              for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
              for (; w2--; ) {
                if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                t2 = vf(t2);
                x2 = vf(x2);
              }
              t2 = null;
            }
            else t2 = null;
            null !== k3 && wf(g2, h2, k3, t2, false);
            null !== n2 && null !== J2 && wf(g2, J2, n2, t2, true);
          }
        }
      }
      a: {
        h2 = d2 ? ue(d2) : window;
        k3 = h2.nodeName && h2.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h2.type) var na = ve;
        else if (me(h2)) if (we) na = Fe;
        else {
          na = De;
          var xa = Ce;
        }
        else (k3 = h2.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
        if (na && (na = na(a, d2))) {
          ne(g2, na, c, e2);
          break a;
        }
        xa && xa(a, h2, d2);
        "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
      }
      xa = d2 ? ue(d2) : window;
      switch (a) {
        case "focusin":
          if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
          break;
        case "focusout":
          Se = Re = Qe = null;
          break;
        case "mousedown":
          Te = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = false;
          Ue(g2, c, e2);
          break;
        case "selectionchange":
          if (Pe) break;
        case "keydown":
        case "keyup":
          Ue(g2, c, e2);
      }
      var $a;
      if (ae) b: {
        switch (a) {
          case "compositionstart":
            var ba = "onCompositionStart";
            break b;
          case "compositionend":
            ba = "onCompositionEnd";
            break b;
          case "compositionupdate":
            ba = "onCompositionUpdate";
            break b;
        }
        ba = void 0;
      }
      else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
      ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
    }
    se(g2, b);
  });
}
function tf(a, b, c) {
  return { instance: a, listener: b, currentTarget: c };
}
function oe(a, b) {
  for (var c = b + "Capture", d = []; null !== a; ) {
    var e = a, f2 = e.stateNode;
    5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a, c), null != f2 && d.unshift(tf(a, f2, e)), f2 = Kb(a, b), null != f2 && d.push(tf(a, f2, e)));
    a = a.return;
  }
  return d;
}
function vf(a) {
  if (null === a) return null;
  do
    a = a.return;
  while (a && 5 !== a.tag);
  return a ? a : null;
}
function wf(a, b, c, d, e) {
  for (var f2 = b._reactName, g = []; null !== c && c !== d; ) {
    var h = c, k2 = h.alternate, l2 = h.stateNode;
    if (null !== k2 && k2 === d) break;
    5 === h.tag && null !== l2 && (h = l2, e ? (k2 = Kb(c, f2), null != k2 && g.unshift(tf(c, k2, h))) : e || (k2 = Kb(c, f2), null != k2 && g.push(tf(c, k2, h))));
    c = c.return;
  }
  0 !== g.length && a.push({ event: b, listeners: g });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a) {
  return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
}
function Af(a, b, c) {
  b = zf(b);
  if (zf(a) !== b && c) throw Error(p(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a, b) {
  return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
  return Hf.resolve(null).then(a).catch(If);
} : Ff;
function If(a) {
  setTimeout(function() {
    throw a;
  });
}
function Kf(a, b) {
  var c = b, d = 0;
  do {
    var e = c.nextSibling;
    a.removeChild(c);
    if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
      if (0 === d) {
        a.removeChild(e);
        bd(b);
        return;
      }
      d--;
    } else "$" !== c && "$?" !== c && "$!" !== c || d++;
    c = e;
  } while (c);
  bd(b);
}
function Lf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b) break;
    if (8 === b) {
      b = a.data;
      if ("$" === b || "$!" === b || "$?" === b) break;
      if ("/$" === b) return null;
    }
  }
  return a;
}
function Mf(a) {
  a = a.previousSibling;
  for (var b = 0; a; ) {
    if (8 === a.nodeType) {
      var c = a.data;
      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b) return a;
        b--;
      } else "/$" === c && b++;
    }
    a = a.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a) {
  var b = a[Of];
  if (b) return b;
  for (var c = a.parentNode; c; ) {
    if (b = c[uf] || c[Of]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
        if (c = a[Of]) return c;
        a = Mf(a);
      }
      return b;
    }
    a = c;
    c = a.parentNode;
  }
  return null;
}
function Cb(a) {
  a = a[Of] || a[uf];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}
function ue(a) {
  if (5 === a.tag || 6 === a.tag) return a.stateNode;
  throw Error(p(33));
}
function Db(a) {
  return a[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a) {
  return { current: a };
}
function E(a) {
  0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G(a, b) {
  Tf++;
  Sf[Tf] = a.current;
  a.current = b;
}
var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a, b) {
  var c = a.type.contextTypes;
  if (!c) return Vf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
  var e = {}, f2;
  for (f2 in c) e[f2] = b[f2];
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
  return e;
}
function Zf(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}
function $f() {
  E(Wf);
  E(H);
}
function ag(a, b, c) {
  if (H.current !== Vf) throw Error(p(168));
  G(H, b);
  G(Wf, c);
}
function bg(a, b, c) {
  var d = a.stateNode;
  b = b.childContextTypes;
  if ("function" !== typeof d.getChildContext) return c;
  d = d.getChildContext();
  for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
  return A({}, c, d);
}
function cg(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H.current;
  G(H, a);
  G(Wf, Wf.current);
  return true;
}
function dg(a, b, c) {
  var d = a.stateNode;
  if (!d) throw Error(p(169));
  c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
  G(Wf, c);
}
var eg = null, fg = false, gg = false;
function hg(a) {
  null === eg ? eg = [a] : eg.push(a);
}
function ig(a) {
  fg = true;
  hg(a);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a = 0, b = C;
    try {
      var c = eg;
      for (C = 1; a < c.length; a++) {
        var d = c[a];
        do
          d = d(true);
        while (null !== d);
      }
      eg = null;
      fg = false;
    } catch (e) {
      throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
    } finally {
      C = b, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a, b) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a;
  ng = b;
}
function ug(a, b, c) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a;
  var d = rg;
  a = sg;
  var e = 32 - oc(d) - 1;
  d &= ~(1 << e);
  c += 1;
  var f2 = 32 - oc(b) + e;
  if (30 < f2) {
    var g = e - e % 5;
    f2 = (d & (1 << g) - 1).toString(32);
    d >>= g;
    e -= g;
    rg = 1 << 32 - oc(b) + e | c << e | d;
    sg = f2 + a;
  } else rg = 1 << f2 | c << e | d, sg = a;
}
function vg(a) {
  null !== a.return && (tg(a, 1), ug(a, 1, 0));
}
function wg(a) {
  for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I = false, zg = null;
function Ag(a, b) {
  var c = Bg(5, null, null, 0);
  c.elementType = "DELETED";
  c.stateNode = b;
  c.return = a;
  b = a.deletions;
  null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
}
function Cg(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
    case 13:
      return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a) {
  return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
}
function Eg(a) {
  if (I) {
    var b = yg;
    if (b) {
      var c = b;
      if (!Cg(a, b)) {
        if (Dg(a)) throw Error(p(418));
        b = Lf(c.nextSibling);
        var d = xg;
        b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
      }
    } else {
      if (Dg(a)) throw Error(p(418));
      a.flags = a.flags & -4097 | 2;
      I = false;
      xg = a;
    }
  }
}
function Fg(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
  xg = a;
}
function Gg(a) {
  if (a !== xg) return false;
  if (!I) return Fg(a), I = true, false;
  var b;
  (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
  if (b && (b = yg)) {
    if (Dg(a)) throw Hg(), Error(p(418));
    for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
  }
  Fg(a);
  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a) throw Error(p(317));
    a: {
      a = a.nextSibling;
      for (b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("/$" === c) {
            if (0 === b) {
              yg = Lf(a.nextSibling);
              break a;
            }
            b--;
          } else "$" !== c && "$!" !== c && "$?" !== c || b++;
        }
        a = a.nextSibling;
      }
      yg = null;
    }
  } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a = yg; a; ) a = Lf(a.nextSibling);
}
function Ig() {
  yg = xg = null;
  I = false;
}
function Jg(a) {
  null === zg ? zg = [a] : zg.push(a);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a, b, c) {
  a = c.ref;
  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;
      if (c) {
        if (1 !== c.tag) throw Error(p(309));
        var d = c.stateNode;
      }
      if (!d) throw Error(p(147, a));
      var e = d, f2 = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f2) return b.ref;
      b = function(a2) {
        var b2 = e.refs;
        null === a2 ? delete b2[f2] : b2[f2] = a2;
      };
      b._stringRef = f2;
      return b;
    }
    if ("string" !== typeof a) throw Error(p(284));
    if (!c._owner) throw Error(p(290, a));
  }
  return a;
}
function Mg(a, b) {
  a = Object.prototype.toString.call(b);
  throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
}
function Ng(a) {
  var b = a._init;
  return b(a._payload);
}
function Og(a) {
  function b(b2, c2) {
    if (a) {
      var d2 = b2.deletions;
      null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
    }
  }
  function c(c2, d2) {
    if (!a) return null;
    for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
    return null;
  }
  function d(a2, b2) {
    for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
    return a2;
  }
  function e(a2, b2) {
    a2 = Pg(a2, b2);
    a2.index = 0;
    a2.sibling = null;
    return a2;
  }
  function f2(b2, c2, d2) {
    b2.index = d2;
    if (!a) return b2.flags |= 1048576, c2;
    d2 = b2.alternate;
    if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
    b2.flags |= 2;
    return c2;
  }
  function g(b2) {
    a && null === b2.alternate && (b2.flags |= 2);
    return b2;
  }
  function h(a2, b2, c2, d2) {
    if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function k2(a2, b2, c2, d2) {
    var f3 = c2.type;
    if (f3 === ya) return m2(a2, b2, c2.props.children, d2, c2.key);
    if (null !== b2 && (b2.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
    d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
    d2.ref = Lg(a2, b2, c2);
    d2.return = a2;
    return d2;
  }
  function l2(a2, b2, c2, d2) {
    if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2.children || []);
    b2.return = a2;
    return b2;
  }
  function m2(a2, b2, c2, d2, f3) {
    if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f3), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function q2(a2, b2, c2) {
    if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
    if ("object" === typeof b2 && null !== b2) {
      switch (b2.$$typeof) {
        case va:
          return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
        case wa:
          return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
        case Ha:
          var d2 = b2._init;
          return q2(a2, d2(b2._payload), c2);
      }
      if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
      Mg(a2, b2);
    }
    return null;
  }
  function r2(a2, b2, c2, d2) {
    var e2 = null !== b2 ? b2.key : null;
    if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case va:
          return c2.key === e2 ? k2(a2, b2, c2, d2) : null;
        case wa:
          return c2.key === e2 ? l2(a2, b2, c2, d2) : null;
        case Ha:
          return e2 = c2._init, r2(
            a2,
            b2,
            e2(c2._payload),
            d2
          );
      }
      if (eb(c2) || Ka(c2)) return null !== e2 ? null : m2(a2, b2, c2, d2, null);
      Mg(a2, c2);
    }
    return null;
  }
  function y2(a2, b2, c2, d2, e2) {
    if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
    if ("object" === typeof d2 && null !== d2) {
      switch (d2.$$typeof) {
        case va:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e2);
        case wa:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e2);
        case Ha:
          var f3 = d2._init;
          return y2(a2, b2, c2, f3(d2._payload), e2);
      }
      if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m2(b2, a2, d2, e2, null);
      Mg(b2, d2);
    }
    return null;
  }
  function n2(e2, g2, h2, k3) {
    for (var l3 = null, m3 = null, u2 = g2, w2 = g2 = 0, x2 = null; null !== u2 && w2 < h2.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e2, u2, h2[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a && u2 && null === n3.alternate && b(e2, u2);
      g2 = f2(n3, g2, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h2.length) return c(e2, u2), I && tg(e2, w2), l3;
    if (null === u2) {
      for (; w2 < h2.length; w2++) u2 = q2(e2, h2[w2], k3), null !== u2 && (g2 = f2(u2, g2, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I && tg(e2, w2);
      return l3;
    }
    for (u2 = d(e2, u2); w2 < h2.length; w2++) x2 = y2(u2, e2, w2, h2[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g2 = f2(x2, g2, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a && u2.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function t2(e2, g2, h2, k3) {
    var l3 = Ka(h2);
    if ("function" !== typeof l3) throw Error(p(150));
    h2 = l3.call(h2);
    if (null == h2) throw Error(p(151));
    for (var u2 = l3 = null, m3 = g2, w2 = g2 = 0, x2 = null, n3 = h2.next(); null !== m3 && !n3.done; w2++, n3 = h2.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e2, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a && m3 && null === t3.alternate && b(e2, m3);
      g2 = f2(t3, g2, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done) return c(
      e2,
      m3
    ), I && tg(e2, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h2.next()) n3 = q2(e2, n3.value, k3), null !== n3 && (g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I && tg(e2, w2);
      return l3;
    }
    for (m3 = d(e2, m3); !n3.done; w2++, n3 = h2.next()) n3 = y2(m3, e2, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a && m3.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function J2(a2, d2, f3, h2) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d2; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c(a2, l3.sibling);
                    d2 = e(l3, f3.props.children);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                  c(a2, l3.sibling);
                  d2 = e(l3, f3.props);
                  d2.ref = Lg(a2, l3, f3);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                }
                c(a2, l3);
                break;
              } else b(a2, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d2 = Tg(f3.props.children, a2.mode, h2, f3.key), d2.return = a2, a2 = d2) : (h2 = Rg(f3.type, f3.key, f3.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f3), h2.return = a2, a2 = h2);
          }
          return g(a2);
        case wa:
          a: {
            for (l3 = f3.key; null !== d2; ) {
              if (d2.key === l3) if (4 === d2.tag && d2.stateNode.containerInfo === f3.containerInfo && d2.stateNode.implementation === f3.implementation) {
                c(a2, d2.sibling);
                d2 = e(d2, f3.children || []);
                d2.return = a2;
                a2 = d2;
                break a;
              } else {
                c(a2, d2);
                break;
              }
              else b(a2, d2);
              d2 = d2.sibling;
            }
            d2 = Sg(f3, a2.mode, h2);
            d2.return = a2;
            a2 = d2;
          }
          return g(a2);
        case Ha:
          return l3 = f3._init, J2(a2, d2, l3(f3._payload), h2);
      }
      if (eb(f3)) return n2(a2, d2, f3, h2);
      if (Ka(f3)) return t2(a2, d2, f3, h2);
      Mg(a2, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f3), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f3, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
  }
  return J2;
}
var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
function $g() {
  Zg = Yg = Xg = null;
}
function ah(a) {
  var b = Wg.current;
  E(Wg);
  a._currentValue = b;
}
function bh(a, b, c) {
  for (; null !== a; ) {
    var d = a.alternate;
    (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
    if (a === c) break;
    a = a.return;
  }
}
function ch(a, b) {
  Xg = a;
  Zg = Yg = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
}
function eh(a) {
  var b = a._currentValue;
  if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
    if (null === Xg) throw Error(p(308));
    Yg = a;
    Xg.dependencies = { lanes: 0, firstContext: a };
  } else Yg = Yg.next = a;
  return b;
}
var fh = null;
function gh(a) {
  null === fh ? fh = [a] : fh.push(a);
}
function hh(a, b, c, d) {
  var e = b.interleaved;
  null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
  b.interleaved = c;
  return ih(a, d);
}
function ih(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;
  for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
  return 3 === c.tag ? c.stateNode : null;
}
var jh = false;
function kh(a) {
  a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function lh(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
}
function mh(a, b) {
  return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
}
function nh(a, b, c) {
  var d = a.updateQueue;
  if (null === d) return null;
  d = d.shared;
  if (0 !== (K & 2)) {
    var e = d.pending;
    null === e ? b.next = b : (b.next = e.next, e.next = b);
    d.pending = b;
    return ih(a, c);
  }
  e = d.interleaved;
  null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
  d.interleaved = b;
  return ih(a, c);
}
function oh(a, b, c) {
  b = b.updateQueue;
  if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
function ph(a, b) {
  var c = a.updateQueue, d = a.alternate;
  if (null !== d && (d = d.updateQueue, c === d)) {
    var e = null, f2 = null;
    c = c.firstBaseUpdate;
    if (null !== c) {
      do {
        var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
        null === f2 ? e = f2 = g : f2 = f2.next = g;
        c = c.next;
      } while (null !== c);
      null === f2 ? e = f2 = b : f2 = f2.next = b;
    } else e = f2 = b;
    c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d.shared, effects: d.effects };
    a.updateQueue = c;
    return;
  }
  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}
function qh(a, b, c, d) {
  var e = a.updateQueue;
  jh = false;
  var f2 = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
  if (null !== h) {
    e.shared.pending = null;
    var k2 = h, l2 = k2.next;
    k2.next = null;
    null === g ? f2 = l2 : g.next = l2;
    g = k2;
    var m2 = a.alternate;
    null !== m2 && (m2 = m2.updateQueue, h = m2.lastBaseUpdate, h !== g && (null === h ? m2.firstBaseUpdate = l2 : h.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e.baseState;
    g = 0;
    m2 = l2 = k2 = null;
    h = f2;
    do {
      var r2 = h.lane, y2 = h.eventTime;
      if ((d & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h.tag,
          payload: h.payload,
          callback: h.callback,
          next: null
        });
        a: {
          var n2 = a, t2 = h;
          r2 = b;
          y2 = c;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2) break a;
              q2 = A({}, q2, r2);
              break a;
            case 2:
              jh = true;
          }
        }
        null !== h.callback && 0 !== h.lane && (a.flags |= 64, r2 = e.effects, null === r2 ? e.effects = [h] : r2.push(h));
      } else y2 = { eventTime: y2, lane: r2, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g |= r2;
      h = h.next;
      if (null === h) if (h = e.shared.pending, null === h) break;
      else r2 = h, h = r2.next, r2.next = null, e.lastBaseUpdate = r2, e.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e.baseState = k2;
    e.firstBaseUpdate = l2;
    e.lastBaseUpdate = m2;
    b = e.shared.interleaved;
    if (null !== b) {
      e = b;
      do
        g |= e.lane, e = e.next;
      while (e !== b);
    } else null === f2 && (e.shared.lanes = 0);
    rh |= g;
    a.lanes = g;
    a.memoizedState = q2;
  }
}
function sh(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a) for (b = 0; b < a.length; b++) {
    var d = a[b], e = d.callback;
    if (null !== e) {
      d.callback = null;
      d = c;
      if ("function" !== typeof e) throw Error(p(191, e));
      e.call(d);
    }
  }
}
var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
function xh(a) {
  if (a === th) throw Error(p(174));
  return a;
}
function yh(a, b) {
  G(wh, b);
  G(vh, a);
  G(uh, th);
  a = b.nodeType;
  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
      break;
    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
  }
  E(uh);
  G(uh, b);
}
function zh() {
  E(uh);
  E(vh);
  E(wh);
}
function Ah(a) {
  xh(wh.current);
  var b = xh(uh.current);
  var c = lb(b, a.type);
  b !== c && (G(vh, a), G(uh, c));
}
function Bh(a) {
  vh.current === a && (E(uh), E(vh));
}
var L = Uf(0);
function Ch(a) {
  for (var b = a; null !== b; ) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 128)) return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }
    if (b === a) break;
    for (; null === b.sibling; ) {
      if (null === b.return || b.return === a) return null;
      b = b.return;
    }
    b.sibling.return = b.return;
    b = b.sibling;
  }
  return null;
}
var Dh = [];
function Eh() {
  for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
  Dh.length = 0;
}
var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
function P() {
  throw Error(p(321));
}
function Mh(a, b) {
  if (null === b) return false;
  for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
  return true;
}
function Nh(a, b, c, d, e, f2) {
  Hh = f2;
  M = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
  a = c(d, e);
  if (Jh) {
    f2 = 0;
    do {
      Jh = false;
      Kh = 0;
      if (25 <= f2) throw Error(p(301));
      f2 += 1;
      O = N = null;
      b.updateQueue = null;
      Fh.current = Qh;
      a = c(d, e);
    } while (Jh);
  }
  Fh.current = Rh;
  b = null !== N && null !== N.next;
  Hh = 0;
  O = N = M = null;
  Ih = false;
  if (b) throw Error(p(300));
  return a;
}
function Sh() {
  var a = 0 !== Kh;
  Kh = 0;
  return a;
}
function Th() {
  var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === O ? M.memoizedState = O = a : O = O.next = a;
  return O;
}
function Uh() {
  if (null === N) {
    var a = M.alternate;
    a = null !== a ? a.memoizedState : null;
  } else a = N.next;
  var b = null === O ? M.memoizedState : O.next;
  if (null !== b) O = b, N = a;
  else {
    if (null === a) throw Error(p(310));
    N = a;
    a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
    null === O ? M.memoizedState = O = a : O = O.next = a;
  }
  return O;
}
function Vh(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function Wh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = N, e = d.baseQueue, f2 = c.pending;
  if (null !== f2) {
    if (null !== e) {
      var g = e.next;
      e.next = f2.next;
      f2.next = g;
    }
    d.baseQueue = e = f2;
    c.pending = null;
  }
  if (null !== e) {
    f2 = e.next;
    d = d.baseState;
    var h = g = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h = k2 = q2, g = d) : k2 = k2.next = q2;
        M.lanes |= m2;
        rh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g = d : k2.next = h;
    He(d, b.memoizedState) || (dh = true);
    b.memoizedState = d;
    b.baseState = g;
    b.baseQueue = k2;
    c.lastRenderedState = d;
  }
  a = c.interleaved;
  if (null !== a) {
    e = a;
    do
      f2 = e.lane, M.lanes |= f2, rh |= f2, e = e.next;
    while (e !== a);
  } else null === e && (c.lanes = 0);
  return [b.memoizedState, c.dispatch];
}
function Xh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch, e = c.pending, f2 = b.memoizedState;
  if (null !== e) {
    c.pending = null;
    var g = e = e.next;
    do
      f2 = a(f2, g.action), g = g.next;
    while (g !== e);
    He(f2, b.memoizedState) || (dh = true);
    b.memoizedState = f2;
    null === b.baseQueue && (b.baseState = f2);
    c.lastRenderedState = f2;
  }
  return [f2, d];
}
function Yh() {
}
function Zh(a, b) {
  var c = M, d = Uh(), e = b(), f2 = !He(d.memoizedState, e);
  f2 && (d.memoizedState = e, dh = true);
  d = d.queue;
  $h(ai.bind(null, c, d, a), [a]);
  if (d.getSnapshot !== b || f2 || null !== O && O.memoizedState.tag & 1) {
    c.flags |= 2048;
    bi(9, ci.bind(null, c, d, e, b), void 0, null);
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(c, b, e);
  }
  return e;
}
function di(a, b, c) {
  a.flags |= 16384;
  a = { getSnapshot: b, value: c };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
}
function ci(a, b, c, d) {
  b.value = c;
  b.getSnapshot = d;
  ei(b) && fi(a);
}
function ai(a, b, c) {
  return c(function() {
    ei(b) && fi(a);
  });
}
function ei(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var c = b();
    return !He(a, c);
  } catch (d) {
    return true;
  }
}
function fi(a) {
  var b = ih(a, 1);
  null !== b && gi(b, a, 1, -1);
}
function hi(a) {
  var b = Th();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
  b.queue = a;
  a = a.dispatch = ii.bind(null, M, a);
  return [b.memoizedState, a];
}
function bi(a, b, c, d) {
  a = { tag: a, create: b, destroy: c, deps: d, next: null };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}
function ji() {
  return Uh().memoizedState;
}
function ki(a, b, c, d) {
  var e = Th();
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
}
function li(a, b, c, d) {
  var e = Uh();
  d = void 0 === d ? null : d;
  var f2 = void 0;
  if (null !== N) {
    var g = N.memoizedState;
    f2 = g.destroy;
    if (null !== d && Mh(d, g.deps)) {
      e.memoizedState = bi(b, c, f2, d);
      return;
    }
  }
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, f2, d);
}
function mi(a, b) {
  return ki(8390656, 8, a, b);
}
function $h(a, b) {
  return li(2048, 8, a, b);
}
function ni(a, b) {
  return li(4, 2, a, b);
}
function oi(a, b) {
  return li(4, 4, a, b);
}
function pi(a, b) {
  if ("function" === typeof b) return a = a(), b(a), function() {
    b(null);
  };
  if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
    b.current = null;
  };
}
function qi(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return li(4, 4, pi.bind(null, b, a), c);
}
function ri() {
}
function si(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  c.memoizedState = [a, b];
  return a;
}
function ti(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}
function ui(a, b, c) {
  if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
  He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
  return b;
}
function vi(a, b) {
  var c = C;
  C = 0 !== c && 4 > c ? c : 4;
  a(true);
  var d = Gh.transition;
  Gh.transition = {};
  try {
    a(false), b();
  } finally {
    C = c, Gh.transition = d;
  }
}
function wi() {
  return Uh().memoizedState;
}
function xi(a, b, c) {
  var d = yi(a);
  c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, c);
  else if (c = hh(a, b, c, d), null !== c) {
    var e = R();
    gi(c, a, d, e);
    Bi(c, b, d);
  }
}
function ii(a, b, c) {
  var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, e);
  else {
    var f2 = a.alternate;
    if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b.lastRenderedReducer, null !== f2)) try {
      var g = b.lastRenderedState, h = f2(g, c);
      e.hasEagerState = true;
      e.eagerState = h;
      if (He(h, g)) {
        var k2 = b.interleaved;
        null === k2 ? (e.next = e, gh(b)) : (e.next = k2.next, k2.next = e);
        b.interleaved = e;
        return;
      }
    } catch (l2) {
    } finally {
    }
    c = hh(a, b, e, d);
    null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
  }
}
function zi(a) {
  var b = a.alternate;
  return a === M || null !== b && b === M;
}
function Ai(a, b) {
  Jh = Ih = true;
  var c = a.pending;
  null === c ? b.next = b : (b.next = c.next, c.next = b);
  a.pending = b;
}
function Bi(a, b, c) {
  if (0 !== (c & 4194240)) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b) {
  Th().memoizedState = [a, void 0 === b ? null : b];
  return a;
}, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ki(
    4194308,
    4,
    pi.bind(null, b, a),
    c
  );
}, useLayoutEffect: function(a, b) {
  return ki(4194308, 4, a, b);
}, useInsertionEffect: function(a, b) {
  return ki(4, 2, a, b);
}, useMemo: function(a, b) {
  var c = Th();
  b = void 0 === b ? null : b;
  a = a();
  c.memoizedState = [a, b];
  return a;
}, useReducer: function(a, b, c) {
  var d = Th();
  b = void 0 !== c ? c(b) : b;
  d.memoizedState = d.baseState = b;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
  d.queue = a;
  a = a.dispatch = xi.bind(null, M, a);
  return [d.memoizedState, a];
}, useRef: function(a) {
  var b = Th();
  a = { current: a };
  return b.memoizedState = a;
}, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
  return Th().memoizedState = a;
}, useTransition: function() {
  var a = hi(false), b = a[0];
  a = vi.bind(null, a[1]);
  Th().memoizedState = a;
  return [b, a];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a, b, c) {
  var d = M, e = Th();
  if (I) {
    if (void 0 === c) throw Error(p(407));
    c = c();
  } else {
    c = b();
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(d, b, c);
  }
  e.memoizedState = c;
  var f2 = { value: c, getSnapshot: b };
  e.queue = f2;
  mi(ai.bind(
    null,
    d,
    f2,
    a
  ), [a]);
  d.flags |= 2048;
  bi(9, ci.bind(null, d, f2, c, b), void 0, null);
  return c;
}, useId: function() {
  var a = Th(), b = Q.identifierPrefix;
  if (I) {
    var c = sg;
    var d = rg;
    c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
    b = ":" + b + "R" + c;
    c = Kh++;
    0 < c && (b += "H" + c.toString(32));
    b += ":";
  } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
  return a.memoizedState = b;
}, unstable_isNewReconciler: false }, Ph = {
  readContext: eh,
  useCallback: si,
  useContext: eh,
  useEffect: $h,
  useImperativeHandle: qi,
  useInsertionEffect: ni,
  useLayoutEffect: oi,
  useMemo: ti,
  useReducer: Wh,
  useRef: ji,
  useState: function() {
    return Wh(Vh);
  },
  useDebugValue: ri,
  useDeferredValue: function(a) {
    var b = Uh();
    return ui(b, N.memoizedState, a);
  },
  useTransition: function() {
    var a = Wh(Vh)[0], b = Uh().memoizedState;
    return [a, b];
  },
  useMutableSource: Yh,
  useSyncExternalStore: Zh,
  useId: wi,
  unstable_isNewReconciler: false
}, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
  return Xh(Vh);
}, useDebugValue: ri, useDeferredValue: function(a) {
  var b = Uh();
  return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
}, useTransition: function() {
  var a = Xh(Vh)[0], b = Uh().memoizedState;
  return [a, b];
}, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
function Ci(a, b) {
  if (a && a.defaultProps) {
    b = A({}, b);
    a = a.defaultProps;
    for (var c in a) void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
function Di(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : A({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}
var Ei = { isMounted: function(a) {
  return (a = a._reactInternals) ? Vb(a) === a : false;
}, enqueueSetState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueReplaceState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.tag = 1;
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueForceUpdate: function(a, b) {
  a = a._reactInternals;
  var c = R(), d = yi(a), e = mh(c, d);
  e.tag = 2;
  void 0 !== b && null !== b && (e.callback = b);
  b = nh(a, e, d);
  null !== b && (gi(b, a, d, c), oh(b, a, d));
} };
function Fi(a, b, c, d, e, f2, g) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f2, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f2) : true;
}
function Gi(a, b, c) {
  var d = false, e = Vf;
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f2 = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
  b = new b(c, f2);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = Ei;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f2);
  return b;
}
function Hi(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
}
function Ii(a, b, c, d) {
  var e = a.stateNode;
  e.props = c;
  e.state = a.memoizedState;
  e.refs = {};
  kh(a);
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? e.context = eh(f2) : (f2 = Zf(b) ? Xf : H.current, e.context = Yf(a, f2));
  e.state = a.memoizedState;
  f2 = b.getDerivedStateFromProps;
  "function" === typeof f2 && (Di(a, b, f2, c), e.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
  "function" === typeof e.componentDidMount && (a.flags |= 4194308);
}
function Ji(a, b) {
  try {
    var c = "", d = b;
    do
      c += Pa(d), d = d.return;
    while (d);
    var e = c;
  } catch (f2) {
    e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a, source: b, stack: e, digest: null };
}
function Ki(a, b, c) {
  return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
}
function Li(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function() {
      throw c;
    });
  }
}
var Mi = "function" === typeof WeakMap ? WeakMap : Map;
function Ni(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  c.payload = { element: null };
  var d = b.value;
  c.callback = function() {
    Oi || (Oi = true, Pi = d);
    Li(a, b);
  };
  return c;
}
function Qi(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;
  if ("function" === typeof d) {
    var e = b.value;
    c.payload = function() {
      return d(e);
    };
    c.callback = function() {
      Li(a, b);
    };
  }
  var f2 = a.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c.callback = function() {
    Li(a, b);
    "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
    var c2 = b.stack;
    this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
  });
  return c;
}
function Si(a, b, c) {
  var d = a.pingCache;
  if (null === d) {
    d = a.pingCache = new Mi();
    var e = /* @__PURE__ */ new Set();
    d.set(b, e);
  } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
  e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
}
function Ui(a) {
  do {
    var b;
    if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
    if (b) return a;
    a = a.return;
  } while (null !== a);
  return null;
}
function Vi(a, b, c, d, e) {
  if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
  a.flags |= 65536;
  a.lanes = e;
  return a;
}
var Wi = ua.ReactCurrentOwner, dh = false;
function Xi(a, b, c, d) {
  b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
}
function Yi(a, b, c, d, e) {
  c = c.render;
  var f2 = b.ref;
  ch(b, e);
  d = Nh(a, b, c, d, f2, e);
  c = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && c && vg(b);
  b.flags |= 1;
  Xi(a, b, d, e);
  return b.child;
}
function $i(a, b, c, d, e) {
  if (null === a) {
    var f2 = c.type;
    if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f2, bj(a, b, f2, d, e);
    a = Rg(c.type, null, d, b, b.mode, e);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  f2 = a.child;
  if (0 === (a.lanes & e)) {
    var g = f2.memoizedProps;
    c = c.compare;
    c = null !== c ? c : Ie;
    if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
  }
  b.flags |= 1;
  a = Pg(f2, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}
function bj(a, b, c, d, e) {
  if (null !== a) {
    var f2 = a.memoizedProps;
    if (Ie(f2, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f2, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
    else return b.lanes = a.lanes, Zi(a, b, e);
  }
  return cj(a, b, c, d, e);
}
function dj(a, b, c) {
  var d = b.pendingProps, e = d.children, f2 = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
  else {
    if (0 === (c & 1073741824)) return a = null !== f2 ? f2.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
    b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
    d = null !== f2 ? f2.baseLanes : c;
    G(ej, fj);
    fj |= d;
  }
  else null !== f2 ? (d = f2.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
  Xi(a, b, e, c);
  return b.child;
}
function gj(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
}
function cj(a, b, c, d, e) {
  var f2 = Zf(c) ? Xf : H.current;
  f2 = Yf(b, f2);
  ch(b, e);
  c = Nh(a, b, c, d, f2, e);
  d = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && d && vg(b);
  b.flags |= 1;
  Xi(a, b, c, e);
  return b.child;
}
function hj(a, b, c, d, e) {
  if (Zf(c)) {
    var f2 = true;
    cg(b);
  } else f2 = false;
  ch(b, e);
  if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
  else if (null === a) {
    var g = b.stateNode, h = b.memoizedProps;
    g.props = h;
    var k2 = g.context, l2 = c.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c) ? Xf : H.current, l2 = Yf(b, l2));
    var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k2 !== l2) && Hi(b, g, d, l2);
    jh = false;
    var r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    k2 = b.memoizedState;
    h !== d || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b, c, m2, d), k2 = b.memoizedState), (h = jh || Fi(b, c, h, d, r2, k2, l2)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g.props = d, g.state = k2, g.context = l2, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
  } else {
    g = b.stateNode;
    lh(a, b);
    h = b.memoizedProps;
    l2 = b.type === b.elementType ? h : Ci(b.type, h);
    g.props = l2;
    q2 = b.pendingProps;
    r2 = g.context;
    k2 = c.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c) ? Xf : H.current, k2 = Yf(b, k2));
    var y2 = c.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q2 || r2 !== k2) && Hi(b, g, d, k2);
    jh = false;
    r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    var n2 = b.memoizedState;
    h !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b, c, y2, d), n2 = b.memoizedState), (l2 = jh || Fi(b, c, l2, d, r2, n2, k2) || false) ? (m2 || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n2, k2), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g.props = d, g.state = n2, g.context = k2, d = l2) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), d = false);
  }
  return jj(a, b, c, d, f2, e);
}
function jj(a, b, c, d, e, f2) {
  gj(a, b);
  var g = 0 !== (b.flags & 128);
  if (!d && !g) return e && dg(b, c, false), Zi(a, b, f2);
  d = b.stateNode;
  Wi.current = b;
  var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g ? (b.child = Ug(b, a.child, null, f2), b.child = Ug(b, null, h, f2)) : Xi(a, b, h, f2);
  b.memoizedState = d.state;
  e && dg(b, c, true);
  return b.child;
}
function kj(a) {
  var b = a.stateNode;
  b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
  yh(a, b.containerInfo);
}
function lj(a, b, c, d, e) {
  Ig();
  Jg(e);
  b.flags |= 256;
  Xi(a, b, c, d);
  return b.child;
}
var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
function nj(a) {
  return { baseLanes: a, cachePool: null, transitions: null };
}
function oj(a, b, c) {
  var d = b.pendingProps, e = L.current, f2 = false, g = 0 !== (b.flags & 128), h;
  (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
  if (h) f2 = true, b.flags &= -129;
  else if (null === a || null !== a.memoizedState) e |= 1;
  G(L, e & 1);
  if (null === a) {
    Eg(b);
    a = b.memoizedState;
    if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
    g = d.children;
    a = d.fallback;
    return f2 ? (d = b.mode, f2 = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g) : f2 = pj(g, d, 0, null), a = Tg(a, d, c, null), f2.return = b, a.return = b, f2.sibling = a, b.child = f2, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
  }
  e = a.memoizedState;
  if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
  if (f2) {
    f2 = d.fallback;
    g = b.mode;
    e = a.child;
    h = e.sibling;
    var k2 = { mode: "hidden", children: d.children };
    0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = Pg(e, k2), d.subtreeFlags = e.subtreeFlags & 14680064);
    null !== h ? f2 = Pg(h, f2) : (f2 = Tg(f2, g, c, null), f2.flags |= 2);
    f2.return = b;
    d.return = b;
    d.sibling = f2;
    b.child = d;
    d = f2;
    f2 = b.child;
    g = a.child.memoizedState;
    g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
    f2.memoizedState = g;
    f2.childLanes = a.childLanes & ~c;
    b.memoizedState = mj;
    return d;
  }
  f2 = a.child;
  a = f2.sibling;
  d = Pg(f2, { mode: "visible", children: d.children });
  0 === (b.mode & 1) && (d.lanes = c);
  d.return = b;
  d.sibling = null;
  null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
  b.child = d;
  b.memoizedState = null;
  return d;
}
function qj(a, b) {
  b = pj({ mode: "visible", children: b }, a.mode, 0, null);
  b.return = a;
  return a.child = b;
}
function sj(a, b, c, d) {
  null !== d && Jg(d);
  Ug(b, a.child, null, c);
  a = qj(b, b.pendingProps.children);
  a.flags |= 2;
  b.memoizedState = null;
  return a;
}
function rj(a, b, c, d, e, f2, g) {
  if (c) {
    if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
    if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
    f2 = d.fallback;
    e = b.mode;
    d = pj({ mode: "visible", children: d.children }, e, 0, null);
    f2 = Tg(f2, e, g, null);
    f2.flags |= 2;
    d.return = b;
    f2.return = b;
    d.sibling = f2;
    b.child = d;
    0 !== (b.mode & 1) && Ug(b, a.child, null, g);
    b.child.memoizedState = nj(g);
    b.memoizedState = mj;
    return f2;
  }
  if (0 === (b.mode & 1)) return sj(a, b, g, null);
  if ("$!" === e.data) {
    d = e.nextSibling && e.nextSibling.dataset;
    if (d) var h = d.dgst;
    d = h;
    f2 = Error(p(419));
    d = Ki(f2, d, void 0);
    return sj(a, b, g, d);
  }
  h = 0 !== (g & a.childLanes);
  if (dh || h) {
    d = Q;
    if (null !== d) {
      switch (g & -g) {
        case 4:
          e = 2;
          break;
        case 16:
          e = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e = 32;
          break;
        case 536870912:
          e = 268435456;
          break;
        default:
          e = 0;
      }
      e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
      0 !== e && e !== f2.retryLane && (f2.retryLane = e, ih(a, e), gi(d, a, e, -1));
    }
    tj();
    d = Ki(Error(p(421)));
    return sj(a, b, g, d);
  }
  if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
  a = f2.treeContext;
  yg = Lf(e.nextSibling);
  xg = b;
  I = true;
  zg = null;
  null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
  b = qj(b, d.children);
  b.flags |= 4096;
  return b;
}
function vj(a, b, c) {
  a.lanes |= b;
  var d = a.alternate;
  null !== d && (d.lanes |= b);
  bh(a.return, b, c);
}
function wj(a, b, c, d, e) {
  var f2 = a.memoizedState;
  null === f2 ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f2.isBackwards = b, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d, f2.tail = c, f2.tailMode = e);
}
function xj(a, b, c) {
  var d = b.pendingProps, e = d.revealOrder, f2 = d.tail;
  Xi(a, b, d.children, c);
  d = L.current;
  if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
  else {
    if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
      if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
      else if (19 === a.tag) vj(a, c, b);
      else if (null !== a.child) {
        a.child.return = a;
        a = a.child;
        continue;
      }
      if (a === b) break a;
      for (; null === a.sibling; ) {
        if (null === a.return || a.return === b) break a;
        a = a.return;
      }
      a.sibling.return = a.return;
      a = a.sibling;
    }
    d &= 1;
  }
  G(L, d);
  if (0 === (b.mode & 1)) b.memoizedState = null;
  else switch (e) {
    case "forwards":
      c = b.child;
      for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
      c = e;
      null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
      wj(b, false, e, c, f2);
      break;
    case "backwards":
      c = null;
      e = b.child;
      for (b.child = null; null !== e; ) {
        a = e.alternate;
        if (null !== a && null === Ch(a)) {
          b.child = e;
          break;
        }
        a = e.sibling;
        e.sibling = c;
        c = e;
        e = a;
      }
      wj(b, true, c, null, f2);
      break;
    case "together":
      wj(b, false, null, null, void 0);
      break;
    default:
      b.memoizedState = null;
  }
  return b.child;
}
function ij(a, b) {
  0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
}
function Zi(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  rh |= b.lanes;
  if (0 === (c & b.childLanes)) return null;
  if (null !== a && b.child !== a.child) throw Error(p(153));
  if (null !== b.child) {
    a = b.child;
    c = Pg(a, a.pendingProps);
    b.child = c;
    for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
    c.sibling = null;
  }
  return b.child;
}
function yj(a, b, c) {
  switch (b.tag) {
    case 3:
      kj(b);
      Ig();
      break;
    case 5:
      Ah(b);
      break;
    case 1:
      Zf(b.type) && cg(b);
      break;
    case 4:
      yh(b, b.stateNode.containerInfo);
      break;
    case 10:
      var d = b.type._context, e = b.memoizedProps.value;
      G(Wg, d._currentValue);
      d._currentValue = e;
      break;
    case 13:
      d = b.memoizedState;
      if (null !== d) {
        if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
        if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
        G(L, L.current & 1);
        a = Zi(a, b, c);
        return null !== a ? a.sibling : null;
      }
      G(L, L.current & 1);
      break;
    case 19:
      d = 0 !== (c & b.childLanes);
      if (0 !== (a.flags & 128)) {
        if (d) return xj(a, b, c);
        b.flags |= 128;
      }
      e = b.memoizedState;
      null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
      G(L, L.current);
      if (d) break;
      else return null;
    case 22:
    case 23:
      return b.lanes = 0, dj(a, b, c);
  }
  return Zi(a, b, c);
}
var zj, Aj, Bj, Cj;
zj = function(a, b) {
  for (var c = b.child; null !== c; ) {
    if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
    else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b) break;
    for (; null === c.sibling; ) {
      if (null === c.return || c.return === b) return;
      c = c.return;
    }
    c.sibling.return = c.return;
    c = c.sibling;
  }
};
Aj = function() {
};
Bj = function(a, b, c, d) {
  var e = a.memoizedProps;
  if (e !== d) {
    a = b.stateNode;
    xh(uh.current);
    var f2 = null;
    switch (c) {
      case "input":
        e = Ya(a, e);
        d = Ya(a, d);
        f2 = [];
        break;
      case "select":
        e = A({}, e, { value: void 0 });
        d = A({}, d, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e = gb(a, e);
        d = gb(a, d);
        f2 = [];
        break;
      default:
        "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
    }
    ub(c, d);
    var g;
    c = null;
    for (l2 in e) if (!d.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2]) if ("style" === l2) {
      var h = e[l2];
      for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
    } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d) {
      var k2 = d[l2];
      h = null != e ? e[l2] : void 0;
      if (d.hasOwnProperty(l2) && k2 !== h && (null != k2 || null != h)) if ("style" === l2) if (h) {
        for (g in h) !h.hasOwnProperty(g) || k2 && k2.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
        for (g in k2) k2.hasOwnProperty(g) && h[g] !== k2[g] && (c || (c = {}), c[g] = k2[g]);
      } else c || (f2 || (f2 = []), f2.push(
        l2,
        c
      )), c = k2;
      else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h = h ? h.__html : void 0, null != k2 && h !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f2 || h === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c && (f2 = f2 || []).push("style", c);
    var l2 = f2;
    if (b.updateQueue = l2) b.flags |= 4;
  }
};
Cj = function(a, b, c, d) {
  c !== d && (b.flags |= 4);
};
function Dj(a, b) {
  if (!I) switch (a.tailMode) {
    case "hidden":
      b = a.tail;
      for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
      null === c ? a.tail = null : c.sibling = null;
      break;
    case "collapsed":
      c = a.tail;
      for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
      null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
  }
}
function S(a) {
  var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
  if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
  else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
  a.subtreeFlags |= d;
  a.childLanes = c;
  return b;
}
function Ej(a, b, c) {
  var d = b.pendingProps;
  wg(b);
  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S(b), null;
    case 1:
      return Zf(b.type) && $f(), S(b), null;
    case 3:
      d = b.stateNode;
      zh();
      E(Wf);
      E(H);
      Eh();
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
      Aj(a, b);
      S(b);
      return null;
    case 5:
      Bh(b);
      var e = xh(wh.current);
      c = b.type;
      if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      else {
        if (!d) {
          if (null === b.stateNode) throw Error(p(166));
          S(b);
          return null;
        }
        a = xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.type;
          var f2 = b.memoizedProps;
          d[Of] = b;
          d[Pf] = f2;
          a = 0 !== (b.mode & 1);
          switch (c) {
            case "dialog":
              D("cancel", d);
              D("close", d);
              break;
            case "iframe":
            case "object":
            case "embed":
              D("load", d);
              break;
            case "video":
            case "audio":
              for (e = 0; e < lf.length; e++) D(lf[e], d);
              break;
            case "source":
              D("error", d);
              break;
            case "img":
            case "image":
            case "link":
              D(
                "error",
                d
              );
              D("load", d);
              break;
            case "details":
              D("toggle", d);
              break;
            case "input":
              Za(d, f2);
              D("invalid", d);
              break;
            case "select":
              d._wrapperState = { wasMultiple: !!f2.multiple };
              D("invalid", d);
              break;
            case "textarea":
              hb(d, f2), D("invalid", d);
          }
          ub(c, f2);
          e = null;
          for (var g in f2) if (f2.hasOwnProperty(g)) {
            var h = f2[g];
            "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f2.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f2.suppressHydrationWarning && Af(
              d.textContent,
              h,
              a
            ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
          }
          switch (c) {
            case "input":
              Va(d);
              db(d, f2, true);
              break;
            case "textarea":
              Va(d);
              jb(d);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d.onclick = Bf);
          }
          d = e;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g = 9 === e.nodeType ? e : e.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
          "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
          a[Of] = b;
          a[Pf] = d;
          zj(a, b, false, false);
          b.stateNode = a;
          a: {
            g = vb(c, d);
            switch (c) {
              case "dialog":
                D("cancel", a);
                D("close", a);
                e = d;
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", a);
                e = d;
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++) D(lf[e], a);
                e = d;
                break;
              case "source":
                D("error", a);
                e = d;
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  a
                );
                D("load", a);
                e = d;
                break;
              case "details":
                D("toggle", a);
                e = d;
                break;
              case "input":
                Za(a, d);
                e = Ya(a, d);
                D("invalid", a);
                break;
              case "option":
                e = d;
                break;
              case "select":
                a._wrapperState = { wasMultiple: !!d.multiple };
                e = A({}, d, { value: void 0 });
                D("invalid", a);
                break;
              case "textarea":
                hb(a, d);
                e = gb(a, d);
                D("invalid", a);
                break;
              default:
                e = d;
            }
            ub(c, e);
            h = e;
            for (f2 in h) if (h.hasOwnProperty(f2)) {
              var k2 = h[f2];
              "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D("scroll", a) : null != k2 && ta(a, f2, k2, g));
            }
            switch (c) {
              case "input":
                Va(a);
                db(a, d, false);
                break;
              case "textarea":
                Va(a);
                jb(a);
                break;
              case "option":
                null != d.value && a.setAttribute("value", "" + Sa(d.value));
                break;
              case "select":
                a.multiple = !!d.multiple;
                f2 = d.value;
                null != f2 ? fb(a, !!d.multiple, f2, false) : null != d.defaultValue && fb(
                  a,
                  !!d.multiple,
                  d.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e.onClick && (a.onclick = Bf);
            }
            switch (c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d = !!d.autoFocus;
                break a;
              case "img":
                d = true;
                break a;
              default:
                d = false;
            }
          }
          d && (b.flags |= 4);
        }
        null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      }
      S(b);
      return null;
    case 6:
      if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
      else {
        if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
        c = xh(wh.current);
        xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.memoizedProps;
          d[Of] = b;
          if (f2 = d.nodeValue !== c) {
            if (a = xg, null !== a) switch (a.tag) {
              case 3:
                Af(d.nodeValue, c, 0 !== (a.mode & 1));
                break;
              case 5:
                true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
            }
          }
          f2 && (b.flags |= 4);
        } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
      }
      S(b);
      return null;
    case 13:
      E(L);
      d = b.memoizedState;
      if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
        if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f2 = false;
        else if (f2 = Gg(b), null !== d && null !== d.dehydrated) {
          if (null === a) {
            if (!f2) throw Error(p(318));
            f2 = b.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2) throw Error(p(317));
            f2[Of] = b;
          } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
          S(b);
          f2 = false;
        } else null !== zg && (Fj(zg), zg = null), f2 = true;
        if (!f2) return b.flags & 65536 ? b : null;
      }
      if (0 !== (b.flags & 128)) return b.lanes = c, b;
      d = null !== d;
      d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
      null !== b.updateQueue && (b.flags |= 4);
      S(b);
      return null;
    case 4:
      return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
    case 10:
      return ah(b.type._context), S(b), null;
    case 17:
      return Zf(b.type) && $f(), S(b), null;
    case 19:
      E(L);
      f2 = b.memoizedState;
      if (null === f2) return S(b), null;
      d = 0 !== (b.flags & 128);
      g = f2.rendering;
      if (null === g) if (d) Dj(f2, false);
      else {
        if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
          g = Ch(a);
          if (null !== g) {
            b.flags |= 128;
            Dj(f2, false);
            d = g.updateQueue;
            null !== d && (b.updateQueue = d, b.flags |= 4);
            b.subtreeFlags = 0;
            d = c;
            for (c = b.child; null !== c; ) f2 = c, a = d, f2.flags &= 14680066, g = f2.alternate, null === g ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g.childLanes, f2.lanes = g.lanes, f2.child = g.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g.memoizedProps, f2.memoizedState = g.memoizedState, f2.updateQueue = g.updateQueue, f2.type = g.type, a = g.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
            G(L, L.current & 1 | 2);
            return b.child;
          }
          a = a.sibling;
        }
        null !== f2.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
      }
      else {
        if (!d) if (a = Ch(g), null !== a) {
          if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g.alternate && !I) return S(b), null;
        } else 2 * B() - f2.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
        f2.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f2.last, null !== c ? c.sibling = g : b.child = g, f2.last = g);
      }
      if (null !== f2.tail) return b = f2.tail, f2.rendering = b, f2.tail = b.sibling, f2.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
      S(b);
      return null;
    case 22:
    case 23:
      return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p(156, b.tag));
}
function Ij(a, b) {
  wg(b);
  switch (b.tag) {
    case 1:
      return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 3:
      return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
    case 5:
      return Bh(b), null;
    case 13:
      E(L);
      a = b.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        if (null === b.alternate) throw Error(p(340));
        Ig();
      }
      a = b.flags;
      return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 19:
      return E(L), null;
    case 4:
      return zh(), null;
    case 10:
      return ah(b.type._context), null;
    case 22:
    case 23:
      return Hj(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Jj = false, U = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Lj(a, b) {
  var c = a.ref;
  if (null !== c) if ("function" === typeof c) try {
    c(null);
  } catch (d) {
    W(a, b, d);
  }
  else c.current = null;
}
function Mj(a, b, c) {
  try {
    c();
  } catch (d) {
    W(a, b, d);
  }
}
var Nj = false;
function Oj(a, b) {
  Cf = dd;
  a = Me();
  if (Ne(a)) {
    if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
    else a: {
      c = (c = a.ownerDocument) && c.defaultView || window;
      var d = c.getSelection && c.getSelection();
      if (d && 0 !== d.rangeCount) {
        c = d.anchorNode;
        var e = d.anchorOffset, f2 = d.focusNode;
        d = d.focusOffset;
        try {
          c.nodeType, f2.nodeType;
        } catch (F2) {
          c = null;
          break a;
        }
        var g = 0, h = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
        b: for (; ; ) {
          for (var y2; ; ) {
            q2 !== c || 0 !== e && 3 !== q2.nodeType || (h = g + e);
            q2 !== f2 || 0 !== d && 3 !== q2.nodeType || (k2 = g + d);
            3 === q2.nodeType && (g += q2.nodeValue.length);
            if (null === (y2 = q2.firstChild)) break;
            r2 = q2;
            q2 = y2;
          }
          for (; ; ) {
            if (q2 === a) break b;
            r2 === c && ++l2 === e && (h = g);
            r2 === f2 && ++m2 === d && (k2 = g);
            if (null !== (y2 = q2.nextSibling)) break;
            q2 = r2;
            r2 = q2.parentNode;
          }
          q2 = y2;
        }
        c = -1 === h || -1 === k2 ? null : { start: h, end: k2 };
      } else c = null;
    }
    c = c || { start: 0, end: 0 };
  } else c = null;
  Df = { focusedElem: a, selectionRange: c };
  dd = false;
  for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
  else for (; null !== V; ) {
    b = V;
    try {
      var n2 = b.alternate;
      if (0 !== (b.flags & 1024)) switch (b.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (null !== n2) {
            var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b.stateNode, w2 = x2.getSnapshotBeforeUpdate(b.elementType === b.type ? t2 : Ci(b.type, t2), J2);
            x2.__reactInternalSnapshotBeforeUpdate = w2;
          }
          break;
        case 3:
          var u2 = b.stateNode.containerInfo;
          1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(p(163));
      }
    } catch (F2) {
      W(b, b.return, F2);
    }
    a = b.sibling;
    if (null !== a) {
      a.return = b.return;
      V = a;
      break;
    }
    V = b.return;
  }
  n2 = Nj;
  Nj = false;
  return n2;
}
function Pj(a, b, c) {
  var d = b.updateQueue;
  d = null !== d ? d.lastEffect : null;
  if (null !== d) {
    var e = d = d.next;
    do {
      if ((e.tag & a) === a) {
        var f2 = e.destroy;
        e.destroy = void 0;
        void 0 !== f2 && Mj(b, c, f2);
      }
      e = e.next;
    } while (e !== d);
  }
}
function Qj(a, b) {
  b = b.updateQueue;
  b = null !== b ? b.lastEffect : null;
  if (null !== b) {
    var c = b = b.next;
    do {
      if ((c.tag & a) === a) {
        var d = c.create;
        c.destroy = d();
      }
      c = c.next;
    } while (c !== b);
  }
}
function Rj(a) {
  var b = a.ref;
  if (null !== b) {
    var c = a.stateNode;
    switch (a.tag) {
      case 5:
        a = c;
        break;
      default:
        a = c;
    }
    "function" === typeof b ? b(a) : b.current = a;
  }
}
function Sj(a) {
  var b = a.alternate;
  null !== b && (a.alternate = null, Sj(b));
  a.child = null;
  a.deletions = null;
  a.sibling = null;
  5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
  a.stateNode = null;
  a.return = null;
  a.dependencies = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.stateNode = null;
  a.updateQueue = null;
}
function Tj(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}
function Uj(a) {
  a: for (; ; ) {
    for (; null === a.sibling; ) {
      if (null === a.return || Tj(a.return)) return null;
      a = a.return;
    }
    a.sibling.return = a.return;
    for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
      if (a.flags & 2) continue a;
      if (null === a.child || 4 === a.tag) continue a;
      else a.child.return = a, a = a.child;
    }
    if (!(a.flags & 2)) return a.stateNode;
  }
}
function Vj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
  else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
}
function Wj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
  else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
}
var X$1 = null, Xj = false;
function Yj(a, b, c) {
  for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
}
function Zj(a, b, c) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
    lc.onCommitFiberUnmount(kc, c);
  } catch (h) {
  }
  switch (c.tag) {
    case 5:
      U || Lj(c, b);
    case 6:
      var d = X$1, e = Xj;
      X$1 = null;
      Yj(a, b, c);
      X$1 = d;
      Xj = e;
      null !== X$1 && (Xj ? (a = X$1, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X$1.removeChild(c.stateNode));
      break;
    case 18:
      null !== X$1 && (Xj ? (a = X$1, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X$1, c.stateNode));
      break;
    case 4:
      d = X$1;
      e = Xj;
      X$1 = c.stateNode.containerInfo;
      Xj = true;
      Yj(a, b, c);
      X$1 = d;
      Xj = e;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
        e = d = d.next;
        do {
          var f2 = e, g = f2.destroy;
          f2 = f2.tag;
          void 0 !== g && (0 !== (f2 & 2) ? Mj(c, b, g) : 0 !== (f2 & 4) && Mj(c, b, g));
          e = e.next;
        } while (e !== d);
      }
      Yj(a, b, c);
      break;
    case 1:
      if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
        d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
      } catch (h) {
        W(c, b, h);
      }
      Yj(a, b, c);
      break;
    case 21:
      Yj(a, b, c);
      break;
    case 22:
      c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
      break;
    default:
      Yj(a, b, c);
  }
}
function ak(a) {
  var b = a.updateQueue;
  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Kj());
    b.forEach(function(b2) {
      var d = bk.bind(null, a, b2);
      c.has(b2) || (c.add(b2), b2.then(d, d));
    });
  }
}
function ck(a, b) {
  var c = b.deletions;
  if (null !== c) for (var d = 0; d < c.length; d++) {
    var e = c[d];
    try {
      var f2 = a, g = b, h = g;
      a: for (; null !== h; ) {
        switch (h.tag) {
          case 5:
            X$1 = h.stateNode;
            Xj = false;
            break a;
          case 3:
            X$1 = h.stateNode.containerInfo;
            Xj = true;
            break a;
          case 4:
            X$1 = h.stateNode.containerInfo;
            Xj = true;
            break a;
        }
        h = h.return;
      }
      if (null === X$1) throw Error(p(160));
      Zj(f2, g, e);
      X$1 = null;
      Xj = false;
      var k2 = e.alternate;
      null !== k2 && (k2.return = null);
      e.return = null;
    } catch (l2) {
      W(e, b, l2);
    }
  }
  if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
}
function dk(a, b) {
  var c = a.alternate, d = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      ck(b, a);
      ek(a);
      if (d & 4) {
        try {
          Pj(3, a, a.return), Qj(3, a);
        } catch (t2) {
          W(a, a.return, t2);
        }
        try {
          Pj(5, a, a.return);
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 1:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      break;
    case 5:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      if (a.flags & 32) {
        var e = a.stateNode;
        try {
          ob(e, "");
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      if (d & 4 && (e = a.stateNode, null != e)) {
        var f2 = a.memoizedProps, g = null !== c ? c.memoizedProps : f2, h = a.type, k2 = a.updateQueue;
        a.updateQueue = null;
        if (null !== k2) try {
          "input" === h && "radio" === f2.type && null != f2.name && ab(e, f2);
          vb(h, g);
          var l2 = vb(h, f2);
          for (g = 0; g < k2.length; g += 2) {
            var m2 = k2[g], q2 = k2[g + 1];
            "style" === m2 ? sb(e, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e, q2) : "children" === m2 ? ob(e, q2) : ta(e, m2, q2, l2);
          }
          switch (h) {
            case "input":
              bb(e, f2);
              break;
            case "textarea":
              ib(e, f2);
              break;
            case "select":
              var r2 = e._wrapperState.wasMultiple;
              e._wrapperState.wasMultiple = !!f2.multiple;
              var y2 = f2.value;
              null != y2 ? fb(e, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                e,
                !!f2.multiple,
                f2.defaultValue,
                true
              ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
          }
          e[Pf] = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 6:
      ck(b, a);
      ek(a);
      if (d & 4) {
        if (null === a.stateNode) throw Error(p(162));
        e = a.stateNode;
        f2 = a.memoizedProps;
        try {
          e.nodeValue = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 3:
      ck(b, a);
      ek(a);
      if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
        bd(b.containerInfo);
      } catch (t2) {
        W(a, a.return, t2);
      }
      break;
    case 4:
      ck(b, a);
      ek(a);
      break;
    case 13:
      ck(b, a);
      ek(a);
      e = a.child;
      e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
      d & 4 && ak(a);
      break;
    case 22:
      m2 = null !== c && null !== c.memoizedState;
      a.mode & 1 ? (U = (l2 = U) || m2, ck(b, a), U = l2) : ck(b, a);
      ek(a);
      if (d & 8192) {
        l2 = null !== a.memoizedState;
        if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
          for (q2 = V = m2; null !== V; ) {
            r2 = V;
            y2 = r2.child;
            switch (r2.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Pj(4, r2, r2.return);
                break;
              case 1:
                Lj(r2, r2.return);
                var n2 = r2.stateNode;
                if ("function" === typeof n2.componentWillUnmount) {
                  d = r2;
                  c = r2.return;
                  try {
                    b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                  } catch (t2) {
                    W(d, c, t2);
                  }
                }
                break;
              case 5:
                Lj(r2, r2.return);
                break;
              case 22:
                if (null !== r2.memoizedState) {
                  gk(q2);
                  continue;
                }
            }
            null !== y2 ? (y2.return = r2, V = y2) : gk(q2);
          }
          m2 = m2.sibling;
        }
        a: for (m2 = null, q2 = a; ; ) {
          if (5 === q2.tag) {
            if (null === m2) {
              m2 = q2;
              try {
                e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h = q2.stateNode, k2 = q2.memoizedProps.style, g = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h.style.display = rb("display", g));
              } catch (t2) {
                W(a, a.return, t2);
              }
            }
          } else if (6 === q2.tag) {
            if (null === m2) try {
              q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
            } catch (t2) {
              W(a, a.return, t2);
            }
          } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
            q2.child.return = q2;
            q2 = q2.child;
            continue;
          }
          if (q2 === a) break a;
          for (; null === q2.sibling; ) {
            if (null === q2.return || q2.return === a) break a;
            m2 === q2 && (m2 = null);
            q2 = q2.return;
          }
          m2 === q2 && (m2 = null);
          q2.sibling.return = q2.return;
          q2 = q2.sibling;
        }
      }
      break;
    case 19:
      ck(b, a);
      ek(a);
      d & 4 && ak(a);
      break;
    case 21:
      break;
    default:
      ck(
        b,
        a
      ), ek(a);
  }
}
function ek(a) {
  var b = a.flags;
  if (b & 2) {
    try {
      a: {
        for (var c = a.return; null !== c; ) {
          if (Tj(c)) {
            var d = c;
            break a;
          }
          c = c.return;
        }
        throw Error(p(160));
      }
      switch (d.tag) {
        case 5:
          var e = d.stateNode;
          d.flags & 32 && (ob(e, ""), d.flags &= -33);
          var f2 = Uj(a);
          Wj(a, f2, e);
          break;
        case 3:
        case 4:
          var g = d.stateNode.containerInfo, h = Uj(a);
          Vj(a, h, g);
          break;
        default:
          throw Error(p(161));
      }
    } catch (k2) {
      W(a, a.return, k2);
    }
    a.flags &= -3;
  }
  b & 4096 && (a.flags &= -4097);
}
function hk(a, b, c) {
  V = a;
  ik(a);
}
function ik(a, b, c) {
  for (var d = 0 !== (a.mode & 1); null !== V; ) {
    var e = V, f2 = e.child;
    if (22 === e.tag && d) {
      var g = null !== e.memoizedState || Jj;
      if (!g) {
        var h = e.alternate, k2 = null !== h && null !== h.memoizedState || U;
        h = Jj;
        var l2 = U;
        Jj = g;
        if ((U = k2) && !l2) for (V = e; null !== V; ) g = V, k2 = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k2 ? (k2.return = g, V = k2) : jk(e);
        for (; null !== f2; ) V = f2, ik(f2), f2 = f2.sibling;
        V = e;
        Jj = h;
        U = l2;
      }
      kk(a);
    } else 0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V = f2) : kk(a);
  }
}
function kk(a) {
  for (; null !== V; ) {
    var b = V;
    if (0 !== (b.flags & 8772)) {
      var c = b.alternate;
      try {
        if (0 !== (b.flags & 8772)) switch (b.tag) {
          case 0:
          case 11:
          case 15:
            U || Qj(5, b);
            break;
          case 1:
            var d = b.stateNode;
            if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
            else {
              var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
              d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
            }
            var f2 = b.updateQueue;
            null !== f2 && sh(b, f2, d);
            break;
          case 3:
            var g = b.updateQueue;
            if (null !== g) {
              c = null;
              if (null !== b.child) switch (b.child.tag) {
                case 5:
                  c = b.child.stateNode;
                  break;
                case 1:
                  c = b.child.stateNode;
              }
              sh(b, g, c);
            }
            break;
          case 5:
            var h = b.stateNode;
            if (null === c && b.flags & 4) {
              c = h;
              var k2 = b.memoizedProps;
              switch (b.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  k2.autoFocus && c.focus();
                  break;
                case "img":
                  k2.src && (c.src = k2.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (null === b.memoizedState) {
              var l2 = b.alternate;
              if (null !== l2) {
                var m2 = l2.memoizedState;
                if (null !== m2) {
                  var q2 = m2.dehydrated;
                  null !== q2 && bd(q2);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(p(163));
        }
        U || b.flags & 512 && Rj(b);
      } catch (r2) {
        W(b, b.return, r2);
      }
    }
    if (b === a) {
      V = null;
      break;
    }
    c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function gk(a) {
  for (; null !== V; ) {
    var b = V;
    if (b === a) {
      V = null;
      break;
    }
    var c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function jk(a) {
  for (; null !== V; ) {
    var b = V;
    try {
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          var c = b.return;
          try {
            Qj(4, b);
          } catch (k2) {
            W(b, c, k2);
          }
          break;
        case 1:
          var d = b.stateNode;
          if ("function" === typeof d.componentDidMount) {
            var e = b.return;
            try {
              d.componentDidMount();
            } catch (k2) {
              W(b, e, k2);
            }
          }
          var f2 = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, f2, k2);
          }
          break;
        case 5:
          var g = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, g, k2);
          }
      }
    } catch (k2) {
      W(b, b.return, k2);
    }
    if (b === a) {
      V = null;
      break;
    }
    var h = b.sibling;
    if (null !== h) {
      h.return = b.return;
      V = h;
      break;
    }
    V = b.return;
  }
}
var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
function R() {
  return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
}
function yi(a) {
  if (0 === (a.mode & 1)) return 1;
  if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
  if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
  a = C;
  if (0 !== a) return a;
  a = window.event;
  a = void 0 === a ? 16 : jd(a.type);
  return a;
}
function gi(a, b, c, d) {
  if (50 < yk) throw yk = 0, zk = null, Error(p(185));
  Ac(a, c, d);
  if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
}
function Dk(a, b) {
  var c = a.callbackNode;
  wc(a, b);
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
  else if (b = d & -d, a.callbackPriority !== b) {
    null != c && bc(c);
    if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
      0 === (K & 6) && jg();
    }), c = null;
    else {
      switch (Dc(d)) {
        case 1:
          c = fc;
          break;
        case 4:
          c = gc;
          break;
        case 16:
          c = hc;
          break;
        case 536870912:
          c = jc;
          break;
        default:
          c = hc;
      }
      c = Fk(c, Gk.bind(null, a));
    }
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}
function Gk(a, b) {
  Ak = -1;
  Bk = 0;
  if (0 !== (K & 6)) throw Error(p(327));
  var c = a.callbackNode;
  if (Hk() && a.callbackNode !== c) return null;
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) return null;
  if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
  else {
    b = d;
    var e = K;
    K |= 2;
    var f2 = Jk();
    if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
    do
      try {
        Lk();
        break;
      } catch (h) {
        Mk(a, h);
      }
    while (1);
    $g();
    mk.current = f2;
    K = e;
    null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
  }
  if (0 !== b) {
    2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
    if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
    if (6 === b) Ck(a, d);
    else {
      e = a.current.alternate;
      if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f2 = xc(a), 0 !== f2 && (d = f2, b = Nk(a, f2))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
      a.finishedWork = e;
      a.finishedLanes = d;
      switch (b) {
        case 0:
        case 1:
          throw Error(p(345));
        case 2:
          Pk(a, tk, uk);
          break;
        case 3:
          Ck(a, d);
          if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
            if (0 !== uc(a, 0)) break;
            e = a.suspendedLanes;
            if ((e & d) !== d) {
              R();
              a.pingedLanes |= a.suspendedLanes & e;
              break;
            }
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 4:
          Ck(a, d);
          if ((d & 4194240) === d) break;
          b = a.eventTimes;
          for (e = -1; 0 < d; ) {
            var g = 31 - oc(d);
            f2 = 1 << g;
            g = b[g];
            g > e && (e = g);
            d &= ~f2;
          }
          d = e;
          d = B() - d;
          d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
          if (10 < d) {
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 5:
          Pk(a, tk, uk);
          break;
        default:
          throw Error(p(329));
      }
    }
  }
  Dk(a, B());
  return a.callbackNode === c ? Gk.bind(null, a) : null;
}
function Nk(a, b) {
  var c = sk;
  a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
  a = Ik(a, b);
  2 !== a && (b = tk, tk = c, null !== b && Fj(b));
  return a;
}
function Fj(a) {
  null === tk ? tk = a : tk.push.apply(tk, a);
}
function Ok(a) {
  for (var b = a; ; ) {
    if (b.flags & 16384) {
      var c = b.updateQueue;
      if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
        var e = c[d], f2 = e.getSnapshot;
        e = e.value;
        try {
          if (!He(f2(), e)) return false;
        } catch (g) {
          return false;
        }
      }
    }
    c = b.child;
    if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
    else {
      if (b === a) break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a) return true;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
  }
  return true;
}
function Ck(a, b) {
  b &= ~rk;
  b &= ~qk;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;
  for (a = a.expirationTimes; 0 < b; ) {
    var c = 31 - oc(b), d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}
function Ek(a) {
  if (0 !== (K & 6)) throw Error(p(327));
  Hk();
  var b = uc(a, 0);
  if (0 === (b & 1)) return Dk(a, B()), null;
  var c = Ik(a, b);
  if (0 !== a.tag && 2 === c) {
    var d = xc(a);
    0 !== d && (b = d, c = Nk(a, d));
  }
  if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
  if (6 === c) throw Error(p(345));
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Pk(a, tk, uk);
  Dk(a, B());
  return null;
}
function Qk(a, b) {
  var c = K;
  K |= 1;
  try {
    return a(b);
  } finally {
    K = c, 0 === K && (Gj = B() + 500, fg && jg());
  }
}
function Rk(a) {
  null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
  var b = K;
  K |= 1;
  var c = ok.transition, d = C;
  try {
    if (ok.transition = null, C = 1, a) return a();
  } finally {
    C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
  }
}
function Hj() {
  fj = ej.current;
  E(ej);
}
function Kk(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, Gf(c));
  if (null !== Y) for (c = Y.return; null !== c; ) {
    var d = c;
    wg(d);
    switch (d.tag) {
      case 1:
        d = d.type.childContextTypes;
        null !== d && void 0 !== d && $f();
        break;
      case 3:
        zh();
        E(Wf);
        E(H);
        Eh();
        break;
      case 5:
        Bh(d);
        break;
      case 4:
        zh();
        break;
      case 13:
        E(L);
        break;
      case 19:
        E(L);
        break;
      case 10:
        ah(d.type._context);
        break;
      case 22:
      case 23:
        Hj();
    }
    c = c.return;
  }
  Q = a;
  Y = a = Pg(a.current, null);
  Z = fj = b;
  T = 0;
  pk = null;
  rk = qk = rh = 0;
  tk = sk = null;
  if (null !== fh) {
    for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
      c.interleaved = null;
      var e = d.next, f2 = c.pending;
      if (null !== f2) {
        var g = f2.next;
        f2.next = e;
        d.next = g;
      }
      c.pending = d;
    }
    fh = null;
  }
  return a;
}
function Mk(a, b) {
  do {
    var c = Y;
    try {
      $g();
      Fh.current = Rh;
      if (Ih) {
        for (var d = M.memoizedState; null !== d; ) {
          var e = d.queue;
          null !== e && (e.pending = null);
          d = d.next;
        }
        Ih = false;
      }
      Hh = 0;
      O = N = M = null;
      Jh = false;
      Kh = 0;
      nk.current = null;
      if (null === c || null === c.return) {
        T = 1;
        pk = b;
        Y = null;
        break;
      }
      a: {
        var f2 = a, g = c.return, h = c, k2 = b;
        b = Z;
        h.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Ui(g);
          if (null !== y2) {
            y2.flags &= -257;
            Vi(y2, g, h, f2, b);
            y2.mode & 1 && Si(f2, l2, b);
            b = y2;
            k2 = l2;
            var n2 = b.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b.updateQueue = t2;
            } else n2.add(k2);
            break a;
          } else {
            if (0 === (b & 1)) {
              Si(f2, l2, b);
              tj();
              break a;
            }
            k2 = Error(p(426));
          }
        } else if (I && h.mode & 1) {
          var J2 = Ui(g);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Vi(J2, g, h, f2, b);
            Jg(Ji(k2, h));
            break a;
          }
        }
        f2 = k2 = Ji(k2, h);
        4 !== T && (T = 2);
        null === sk ? sk = [f2] : sk.push(f2);
        f2 = g;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b &= -b;
              f2.lanes |= b;
              var x2 = Ni(f2, k2, b);
              ph(f2, x2);
              break a;
            case 1:
              h = k2;
              var w2 = f2.type, u2 = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                f2.flags |= 65536;
                b &= -b;
                f2.lanes |= b;
                var F2 = Qi(f2, h, b);
                ph(f2, F2);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Sk(c);
    } catch (na) {
      b = na;
      Y === c && null !== c && (Y = c = c.return);
      continue;
    }
    break;
  } while (1);
}
function Jk() {
  var a = mk.current;
  mk.current = Rh;
  return null === a ? Rh : a;
}
function tj() {
  if (0 === T || 3 === T || 2 === T) T = 4;
  null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
}
function Ik(a, b) {
  var c = K;
  K |= 2;
  var d = Jk();
  if (Q !== a || Z !== b) uk = null, Kk(a, b);
  do
    try {
      Tk();
      break;
    } catch (e) {
      Mk(a, e);
    }
  while (1);
  $g();
  K = c;
  mk.current = d;
  if (null !== Y) throw Error(p(261));
  Q = null;
  Z = 0;
  return T;
}
function Tk() {
  for (; null !== Y; ) Uk(Y);
}
function Lk() {
  for (; null !== Y && !cc(); ) Uk(Y);
}
function Uk(a) {
  var b = Vk(a.alternate, a, fj);
  a.memoizedProps = a.pendingProps;
  null === b ? Sk(a) : Y = b;
  nk.current = null;
}
function Sk(a) {
  var b = a;
  do {
    var c = b.alternate;
    a = b.return;
    if (0 === (b.flags & 32768)) {
      if (c = Ej(c, b, fj), null !== c) {
        Y = c;
        return;
      }
    } else {
      c = Ij(c, b);
      if (null !== c) {
        c.flags &= 32767;
        Y = c;
        return;
      }
      if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
      else {
        T = 6;
        Y = null;
        return;
      }
    }
    b = b.sibling;
    if (null !== b) {
      Y = b;
      return;
    }
    Y = b = a;
  } while (null !== b);
  0 === T && (T = 5);
}
function Pk(a, b, c) {
  var d = C, e = ok.transition;
  try {
    ok.transition = null, C = 1, Wk(a, b, c, d);
  } finally {
    ok.transition = e, C = d;
  }
  return null;
}
function Wk(a, b, c, d) {
  do
    Hk();
  while (null !== wk);
  if (0 !== (K & 6)) throw Error(p(327));
  c = a.finishedWork;
  var e = a.finishedLanes;
  if (null === c) return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current) throw Error(p(177));
  a.callbackNode = null;
  a.callbackPriority = 0;
  var f2 = c.lanes | c.childLanes;
  Bc(a, f2);
  a === Q && (Y = Q = null, Z = 0);
  0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
    Hk();
    return null;
  }));
  f2 = 0 !== (c.flags & 15990);
  if (0 !== (c.subtreeFlags & 15990) || f2) {
    f2 = ok.transition;
    ok.transition = null;
    var g = C;
    C = 1;
    var h = K;
    K |= 4;
    nk.current = null;
    Oj(a, c);
    dk(c, a);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a.current = c;
    hk(c);
    dc();
    K = h;
    C = g;
    ok.transition = f2;
  } else a.current = c;
  vk && (vk = false, wk = a, xk = e);
  f2 = a.pendingLanes;
  0 === f2 && (Ri = null);
  mc(c.stateNode);
  Dk(a, B());
  if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
  if (Oi) throw Oi = false, a = Pi, Pi = null, a;
  0 !== (xk & 1) && 0 !== a.tag && Hk();
  f2 = a.pendingLanes;
  0 !== (f2 & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
  jg();
  return null;
}
function Hk() {
  if (null !== wk) {
    var a = Dc(xk), b = ok.transition, c = C;
    try {
      ok.transition = null;
      C = 16 > a ? 16 : a;
      if (null === wk) var d = false;
      else {
        a = wk;
        wk = null;
        xk = 0;
        if (0 !== (K & 6)) throw Error(p(331));
        var e = K;
        K |= 4;
        for (V = a.current; null !== V; ) {
          var f2 = V, g = f2.child;
          if (0 !== (V.flags & 16)) {
            var h = f2.deletions;
            if (null !== h) {
              for (var k2 = 0; k2 < h.length; k2++) {
                var l2 = h[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2) q2.return = m2, V = q2;
                  else for (; null !== V; ) {
                    m2 = V;
                    var r2 = m2.sibling, y2 = m2.return;
                    Sj(m2);
                    if (m2 === l2) {
                      V = null;
                      break;
                    }
                    if (null !== r2) {
                      r2.return = y2;
                      V = r2;
                      break;
                    }
                    V = y2;
                  }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g) g.return = f2, V = g;
          else b: for (; null !== V; ) {
            f2 = V;
            if (0 !== (f2.flags & 2048)) switch (f2.tag) {
              case 0:
              case 11:
              case 15:
                Pj(9, f2, f2.return);
            }
            var x2 = f2.sibling;
            if (null !== x2) {
              x2.return = f2.return;
              V = x2;
              break b;
            }
            V = f2.return;
          }
        }
        var w2 = a.current;
        for (V = w2; null !== V; ) {
          g = V;
          var u2 = g.child;
          if (0 !== (g.subtreeFlags & 2064) && null !== u2) u2.return = g, V = u2;
          else b: for (g = w2; null !== V; ) {
            h = V;
            if (0 !== (h.flags & 2048)) try {
              switch (h.tag) {
                case 0:
                case 11:
                case 15:
                  Qj(9, h);
              }
            } catch (na) {
              W(h, h.return, na);
            }
            if (h === g) {
              V = null;
              break b;
            }
            var F2 = h.sibling;
            if (null !== F2) {
              F2.return = h.return;
              V = F2;
              break b;
            }
            V = h.return;
          }
        }
        K = e;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
          lc.onPostCommitFiberRoot(kc, a);
        } catch (na) {
        }
        d = true;
      }
      return d;
    } finally {
      C = c, ok.transition = b;
    }
  }
  return false;
}
function Xk(a, b, c) {
  b = Ji(c, b);
  b = Ni(a, b, 1);
  a = nh(a, b, 1);
  b = R();
  null !== a && (Ac(a, 1, b), Dk(a, b));
}
function W(a, b, c) {
  if (3 === a.tag) Xk(a, a, c);
  else for (; null !== b; ) {
    if (3 === b.tag) {
      Xk(b, a, c);
      break;
    } else if (1 === b.tag) {
      var d = b.stateNode;
      if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
        a = Ji(c, a);
        a = Qi(b, a, 1);
        b = nh(b, a, 1);
        a = R();
        null !== b && (Ac(b, 1, a), Dk(b, a));
        break;
      }
    }
    b = b.return;
  }
}
function Ti(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = R();
  a.pingedLanes |= a.suspendedLanes & c;
  Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
  Dk(a, b);
}
function Yk(a, b) {
  0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c = R();
  a = ih(a, b);
  null !== a && (Ac(a, b, c), Dk(a, c));
}
function uj(a) {
  var b = a.memoizedState, c = 0;
  null !== b && (c = b.retryLane);
  Yk(a, c);
}
function bk(a, b) {
  var c = 0;
  switch (a.tag) {
    case 13:
      var d = a.stateNode;
      var e = a.memoizedState;
      null !== e && (c = e.retryLane);
      break;
    case 19:
      d = a.stateNode;
      break;
    default:
      throw Error(p(314));
  }
  null !== d && d.delete(b);
  Yk(a, c);
}
var Vk;
Vk = function(a, b, c) {
  if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
  else {
    if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
    dh = 0 !== (a.flags & 131072) ? true : false;
  }
  else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
  b.lanes = 0;
  switch (b.tag) {
    case 2:
      var d = b.type;
      ij(a, b);
      a = b.pendingProps;
      var e = Yf(b, H.current);
      ch(b, c);
      e = Nh(null, b, d, a, e, c);
      var f2 = Sh();
      b.flags |= 1;
      "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f2 = true, cg(b)) : f2 = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f2, c)) : (b.tag = 0, I && f2 && vg(b), Xi(null, b, e, c), b = b.child);
      return b;
    case 16:
      d = b.elementType;
      a: {
        ij(a, b);
        a = b.pendingProps;
        e = d._init;
        d = e(d._payload);
        b.type = d;
        e = b.tag = Zk(d);
        a = Ci(d, a);
        switch (e) {
          case 0:
            b = cj(null, b, d, a, c);
            break a;
          case 1:
            b = hj(null, b, d, a, c);
            break a;
          case 11:
            b = Yi(null, b, d, a, c);
            break a;
          case 14:
            b = $i(null, b, d, Ci(d.type, a), c);
            break a;
        }
        throw Error(p(
          306,
          d,
          ""
        ));
      }
      return b;
    case 0:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
    case 1:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
    case 3:
      a: {
        kj(b);
        if (null === a) throw Error(p(387));
        d = b.pendingProps;
        f2 = b.memoizedState;
        e = f2.element;
        lh(a, b);
        qh(b, d, null, c);
        var g = b.memoizedState;
        d = g.element;
        if (f2.isDehydrated) if (f2 = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f2, b.memoizedState = f2, b.flags & 256) {
          e = Ji(Error(p(423)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else if (d !== e) {
          e = Ji(Error(p(424)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
        else {
          Ig();
          if (d === e) {
            b = Zi(a, b, c);
            break a;
          }
          Xi(a, b, d, c);
        }
        b = b.child;
      }
      return b;
    case 5:
      return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f2 = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f2 && Ef(d, f2) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
    case 6:
      return null === a && Eg(b), null;
    case 13:
      return oj(a, b, c);
    case 4:
      return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
    case 11:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
    case 7:
      return Xi(a, b, b.pendingProps, c), b.child;
    case 8:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 12:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 10:
      a: {
        d = b.type._context;
        e = b.pendingProps;
        f2 = b.memoizedProps;
        g = e.value;
        G(Wg, d._currentValue);
        d._currentValue = g;
        if (null !== f2) if (He(f2.value, g)) {
          if (f2.children === e.children && !Wf.current) {
            b = Zi(a, b, c);
            break a;
          }
        } else for (f2 = b.child, null !== f2 && (f2.return = b); null !== f2; ) {
          var h = f2.dependencies;
          if (null !== h) {
            g = f2.child;
            for (var k2 = h.firstContext; null !== k2; ) {
              if (k2.context === d) {
                if (1 === f2.tag) {
                  k2 = mh(-1, c & -c);
                  k2.tag = 2;
                  var l2 = f2.updateQueue;
                  if (null !== l2) {
                    l2 = l2.shared;
                    var m2 = l2.pending;
                    null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                    l2.pending = k2;
                  }
                }
                f2.lanes |= c;
                k2 = f2.alternate;
                null !== k2 && (k2.lanes |= c);
                bh(
                  f2.return,
                  c,
                  b
                );
                h.lanes |= c;
                break;
              }
              k2 = k2.next;
            }
          } else if (10 === f2.tag) g = f2.type === b.type ? null : f2.child;
          else if (18 === f2.tag) {
            g = f2.return;
            if (null === g) throw Error(p(341));
            g.lanes |= c;
            h = g.alternate;
            null !== h && (h.lanes |= c);
            bh(g, c, b);
            g = f2.sibling;
          } else g = f2.child;
          if (null !== g) g.return = f2;
          else for (g = f2; null !== g; ) {
            if (g === b) {
              g = null;
              break;
            }
            f2 = g.sibling;
            if (null !== f2) {
              f2.return = g.return;
              g = f2;
              break;
            }
            g = g.return;
          }
          f2 = g;
        }
        Xi(a, b, e.children, c);
        b = b.child;
      }
      return b;
    case 9:
      return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
    case 14:
      return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
    case 15:
      return bj(a, b, b.type, b.pendingProps, c);
    case 17:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
    case 19:
      return xj(a, b, c);
    case 22:
      return dj(a, b, c);
  }
  throw Error(p(156, b.tag));
};
function Fk(a, b) {
  return ac(a, b);
}
function $k(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a, b, c, d) {
  return new $k(a, b, c, d);
}
function aj(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}
function Zk(a) {
  if ("function" === typeof a) return aj(a) ? 1 : 0;
  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Da) return 11;
    if (a === Ga) return 14;
  }
  return 2;
}
function Pg(a, b) {
  var c = a.alternate;
  null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
  c.flags = a.flags & 14680064;
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}
function Rg(a, b, c, d, e, f2) {
  var g = 2;
  d = a;
  if ("function" === typeof a) aj(a) && (g = 1);
  else if ("string" === typeof a) g = 5;
  else a: switch (a) {
    case ya:
      return Tg(c.children, e, f2, b);
    case za:
      g = 8;
      e |= 8;
      break;
    case Aa:
      return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f2, a;
    case Ea:
      return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f2, a;
    case Fa:
      return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f2, a;
    case Ia:
      return pj(c, e, f2, b);
    default:
      if ("object" === typeof a && null !== a) switch (a.$$typeof) {
        case Ba:
          g = 10;
          break a;
        case Ca:
          g = 9;
          break a;
        case Da:
          g = 11;
          break a;
        case Ga:
          g = 14;
          break a;
        case Ha:
          g = 16;
          d = null;
          break a;
      }
      throw Error(p(130, null == a ? a : typeof a, ""));
  }
  b = Bg(g, c, b, e);
  b.elementType = a;
  b.type = d;
  b.lanes = f2;
  return b;
}
function Tg(a, b, c, d) {
  a = Bg(7, a, d, b);
  a.lanes = c;
  return a;
}
function pj(a, b, c, d) {
  a = Bg(22, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  a.stateNode = { isHidden: false };
  return a;
}
function Qg(a, b, c) {
  a = Bg(6, a, null, b);
  a.lanes = c;
  return a;
}
function Sg(a, b, c) {
  b = Bg(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
  return b;
}
function al(a, b, c, d, e) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d;
  this.onRecoverableError = e;
  this.mutableSourceEagerHydrationData = null;
}
function bl(a, b, c, d, e, f2, g, h, k2) {
  a = new al(a, b, c, h, k2);
  1 === b ? (b = 1, true === f2 && (b |= 8)) : b = 0;
  f2 = Bg(3, null, null, b);
  a.current = f2;
  f2.stateNode = a;
  f2.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  kh(f2);
  return a;
}
function cl(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
}
function dl(a) {
  if (!a) return Vf;
  a = a._reactInternals;
  a: {
    if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
    var b = a;
    do {
      switch (b.tag) {
        case 3:
          b = b.stateNode.context;
          break a;
        case 1:
          if (Zf(b.type)) {
            b = b.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b = b.return;
    } while (null !== b);
    throw Error(p(171));
  }
  if (1 === a.tag) {
    var c = a.type;
    if (Zf(c)) return bg(a, c, b);
  }
  return b;
}
function el(a, b, c, d, e, f2, g, h, k2) {
  a = bl(c, d, true, a, e, f2, g, h, k2);
  a.context = dl(null);
  c = a.current;
  d = R();
  e = yi(c);
  f2 = mh(d, e);
  f2.callback = void 0 !== b && null !== b ? b : null;
  nh(c, f2, e);
  a.current.lanes = e;
  Ac(a, e, d);
  Dk(a, d);
  return a;
}
function fl(a, b, c, d) {
  var e = b.current, f2 = R(), g = yi(e);
  c = dl(c);
  null === b.context ? b.context = c : b.pendingContext = c;
  b = mh(f2, g);
  b.payload = { element: a };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  a = nh(e, b, g);
  null !== a && (gi(a, e, g, f2), oh(a, e, g));
  return g;
}
function gl(a) {
  a = a.current;
  if (!a.child) return null;
  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;
    default:
      return a.child.stateNode;
  }
}
function hl(a, b) {
  a = a.memoizedState;
  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}
function il(a, b) {
  hl(a, b);
  (a = a.alternate) && hl(a, b);
}
function jl() {
  return null;
}
var kl = "function" === typeof reportError ? reportError : function(a) {
  console.error(a);
};
function ll(a) {
  this._internalRoot = a;
}
ml.prototype.render = ll.prototype.render = function(a) {
  var b = this._internalRoot;
  if (null === b) throw Error(p(409));
  fl(a, b, null, null);
};
ml.prototype.unmount = ll.prototype.unmount = function() {
  var a = this._internalRoot;
  if (null !== a) {
    this._internalRoot = null;
    var b = a.containerInfo;
    Rk(function() {
      fl(null, a, null, null);
    });
    b[uf] = null;
  }
};
function ml(a) {
  this._internalRoot = a;
}
ml.prototype.unstable_scheduleHydration = function(a) {
  if (a) {
    var b = Hc();
    a = { blockedOn: null, target: a, priority: b };
    for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
    Qc.splice(c, 0, a);
    0 === c && Vc(a);
  }
};
function nl(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
}
function ol(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}
function pl() {
}
function ql(a, b, c, d, e) {
  if (e) {
    if ("function" === typeof d) {
      var f2 = d;
      d = function() {
        var a2 = gl(g);
        f2.call(a2);
      };
    }
    var g = el(b, d, a, 0, null, false, false, "", pl);
    a._reactRootContainer = g;
    a[uf] = g.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Rk();
    return g;
  }
  for (; e = a.lastChild; ) a.removeChild(e);
  if ("function" === typeof d) {
    var h = d;
    d = function() {
      var a2 = gl(k2);
      h.call(a2);
    };
  }
  var k2 = bl(a, 0, false, null, null, false, false, "", pl);
  a._reactRootContainer = k2;
  a[uf] = k2.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  Rk(function() {
    fl(b, k2, c, d);
  });
  return k2;
}
function rl(a, b, c, d, e) {
  var f2 = c._reactRootContainer;
  if (f2) {
    var g = f2;
    if ("function" === typeof e) {
      var h = e;
      e = function() {
        var a2 = gl(g);
        h.call(a2);
      };
    }
    fl(b, g, a, e);
  } else g = ql(c, b, a, e, d);
  return gl(g);
}
Ec = function(a) {
  switch (a.tag) {
    case 3:
      var b = a.stateNode;
      if (b.current.memoizedState.isDehydrated) {
        var c = tc(b.pendingLanes);
        0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
      }
      break;
    case 13:
      Rk(function() {
        var b2 = ih(a, 1);
        if (null !== b2) {
          var c2 = R();
          gi(b2, a, 1, c2);
        }
      }), il(a, 1);
  }
};
Fc = function(a) {
  if (13 === a.tag) {
    var b = ih(a, 134217728);
    if (null !== b) {
      var c = R();
      gi(b, a, 134217728, c);
    }
    il(a, 134217728);
  }
};
Gc = function(a) {
  if (13 === a.tag) {
    var b = yi(a), c = ih(a, b);
    if (null !== c) {
      var d = R();
      gi(c, a, b, d);
    }
    il(a, b);
  }
};
Hc = function() {
  return C;
};
Ic = function(a, b) {
  var c = C;
  try {
    return C = a, b();
  } finally {
    C = c;
  }
};
yb = function(a, b, c) {
  switch (b) {
    case "input":
      bb(a, c);
      b = c.name;
      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode; ) c = c.parentNode;
        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
        for (b = 0; b < c.length; b++) {
          var d = c[b];
          if (d !== a && d.form === a.form) {
            var e = Db(d);
            if (!e) throw Error(p(90));
            Wa(d);
            bb(d, e);
          }
        }
      }
      break;
    case "textarea":
      ib(a, c);
      break;
    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, false);
  }
};
Gb = Qk;
Hb = Rk;
var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
  a = Zb(a);
  return null === a ? null : a.stateNode;
}, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!vl.isDisabled && vl.supportsFiber) try {
    kc = vl.inject(ul), lc = vl;
  } catch (a) {
  }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
reactDom_production_min.createPortal = function(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!nl(b)) throw Error(p(200));
  return cl(a, b, null, c);
};
reactDom_production_min.createRoot = function(a, b) {
  if (!nl(a)) throw Error(p(299));
  var c = false, d = "", e = kl;
  null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
  b = bl(a, 1, false, null, null, c, false, d, e);
  a[uf] = b.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  return new ll(b);
};
reactDom_production_min.findDOMNode = function(a) {
  if (null == a) return null;
  if (1 === a.nodeType) return a;
  var b = a._reactInternals;
  if (void 0 === b) {
    if ("function" === typeof a.render) throw Error(p(188));
    a = Object.keys(a).join(",");
    throw Error(p(268, a));
  }
  a = Zb(b);
  a = null === a ? null : a.stateNode;
  return a;
};
reactDom_production_min.flushSync = function(a) {
  return Rk(a);
};
reactDom_production_min.hydrate = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, true, c);
};
reactDom_production_min.hydrateRoot = function(a, b, c) {
  if (!nl(a)) throw Error(p(405));
  var d = null != c && c.hydratedSources || null, e = false, f2 = "", g = kl;
  null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f2 = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
  b = el(b, null, a, 1, null != c ? c : null, e, false, f2, g);
  a[uf] = b.current;
  sf(a);
  if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
    c,
    e
  );
  return new ml(b);
};
reactDom_production_min.render = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, false, c);
};
reactDom_production_min.unmountComponentAtNode = function(a) {
  if (!ol(a)) throw Error(p(40));
  return a._reactRootContainer ? (Rk(function() {
    rl(null, null, a, false, function() {
      a._reactRootContainer = null;
      a[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
  if (!ol(c)) throw Error(p(200));
  if (null == a || void 0 === a._reactInternals) throw Error(p(38));
  return rl(a, b, c, false, d);
};
reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
var createRoot;
var m = reactDomExports;
{
  createRoot = m.createRoot;
  m.hydrateRoot;
}
const __vite_import_meta_env__$1 = {};
const createStoreImpl = (createState) => {
  let state;
  const listeners2 = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners2.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners2.add(listener);
    return () => listeners2.delete(listener);
  };
  const destroy = () => {
    if ((__vite_import_meta_env__$1 ? "production" : void 0) !== "production") {
      console.warn(
        "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
      );
    }
    listeners2.clear();
  };
  const api = { setState, getState, getInitialState, subscribe, destroy };
  const initialState = state = createState(setState, getState, api);
  return api;
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
var withSelector = { exports: {} };
var withSelector_production = {};
var shim$2 = { exports: {} };
var useSyncExternalStoreShim_production = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React$1 = reactExports;
function is$1(x2, y2) {
  return x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
}
var objectIs$1 = "function" === typeof Object.is ? Object.is : is$1, useState = React$1.useState, useEffect$1 = React$1.useEffect, useLayoutEffect = React$1.useLayoutEffect, useDebugValue$2 = React$1.useDebugValue;
function useSyncExternalStore$2(subscribe, getSnapshot) {
  var value = getSnapshot(), _useState = useState({ inst: { value, getSnapshot } }), inst = _useState[0].inst, forceUpdate = _useState[1];
  useLayoutEffect(
    function() {
      inst.value = value;
      inst.getSnapshot = getSnapshot;
      checkIfSnapshotChanged(inst) && forceUpdate({ inst });
    },
    [subscribe, value, getSnapshot]
  );
  useEffect$1(
    function() {
      checkIfSnapshotChanged(inst) && forceUpdate({ inst });
      return subscribe(function() {
        checkIfSnapshotChanged(inst) && forceUpdate({ inst });
      });
    },
    [subscribe]
  );
  useDebugValue$2(value);
  return value;
}
function checkIfSnapshotChanged(inst) {
  var latestGetSnapshot = inst.getSnapshot;
  inst = inst.value;
  try {
    var nextValue = latestGetSnapshot();
    return !objectIs$1(inst, nextValue);
  } catch (error) {
    return true;
  }
}
function useSyncExternalStore$1(subscribe, getSnapshot) {
  return getSnapshot();
}
var shim$1 = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
useSyncExternalStoreShim_production.useSyncExternalStore = void 0 !== React$1.useSyncExternalStore ? React$1.useSyncExternalStore : shim$1;
{
  shim$2.exports = useSyncExternalStoreShim_production;
}
var shimExports = shim$2.exports;
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React = reactExports, shim = shimExports;
function is(x2, y2) {
  return x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
}
var objectIs = "function" === typeof Object.is ? Object.is : is, useSyncExternalStore = shim.useSyncExternalStore, useRef = React.useRef, useEffect = React.useEffect, useMemo = React.useMemo, useDebugValue$1 = React.useDebugValue;
withSelector_production.useSyncExternalStoreWithSelector = function(subscribe, getSnapshot, getServerSnapshot, selector, isEqual2) {
  var instRef = useRef(null);
  if (null === instRef.current) {
    var inst = { hasValue: false, value: null };
    instRef.current = inst;
  } else inst = instRef.current;
  instRef = useMemo(
    function() {
      function memoizedSelector(nextSnapshot) {
        if (!hasMemo) {
          hasMemo = true;
          memoizedSnapshot = nextSnapshot;
          nextSnapshot = selector(nextSnapshot);
          if (void 0 !== isEqual2 && inst.hasValue) {
            var currentSelection = inst.value;
            if (isEqual2(currentSelection, nextSnapshot))
              return memoizedSelection = currentSelection;
          }
          return memoizedSelection = nextSnapshot;
        }
        currentSelection = memoizedSelection;
        if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
        var nextSelection = selector(nextSnapshot);
        if (void 0 !== isEqual2 && isEqual2(currentSelection, nextSelection))
          return memoizedSnapshot = nextSnapshot, currentSelection;
        memoizedSnapshot = nextSnapshot;
        return memoizedSelection = nextSelection;
      }
      var hasMemo = false, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
      return [
        function() {
          return memoizedSelector(getSnapshot());
        },
        null === maybeGetServerSnapshot ? void 0 : function() {
          return memoizedSelector(maybeGetServerSnapshot());
        }
      ];
    },
    [getSnapshot, getServerSnapshot, selector, isEqual2]
  );
  var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
  useEffect(
    function() {
      inst.hasValue = true;
      inst.value = value;
    },
    [value]
  );
  useDebugValue$1(value);
  return value;
};
{
  withSelector.exports = withSelector_production;
}
var withSelectorExports = withSelector.exports;
const useSyncExternalStoreExports = /* @__PURE__ */ getDefaultExportFromCjs(withSelectorExports);
const __vite_import_meta_env__ = {};
const { useDebugValue } = React$2;
const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports;
let didWarnAboutEqualityFn = false;
const identity = (arg) => arg;
function useStore$1(api, selector = identity, equalityFn) {
  if ((__vite_import_meta_env__ ? "production" : void 0) !== "production" && equalityFn && !didWarnAboutEqualityFn) {
    console.warn(
      "[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"
    );
    didWarnAboutEqualityFn = true;
  }
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getServerState || api.getInitialState,
    selector,
    equalityFn
  );
  useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  if ((__vite_import_meta_env__ ? "production" : void 0) !== "production" && typeof createState !== "function") {
    console.warn(
      "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`."
    );
  }
  const api = typeof createState === "function" ? createStore(createState) : createState;
  const useBoundStore = (selector, equalityFn) => useStore$1(api, selector, equalityFn);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create$1 = (createState) => createState ? createImpl(createState) : createImpl;
const READING_THEMES = [
  // ===== 暗色主题 =====
  {
    id: "dark-plus",
    name: "Dark+ (默认暗色)",
    mode: "dark",
    colors: { "--rt-bg": "#1e1e1e", "--rt-fg": "#d4d4d4", "--rt-heading": "#e0e0e0", "--rt-link": "#569cd6", "--rt-meta": "#808080", "--rt-blockquote-bg": "#2a2a2a", "--rt-blockquote-border": "#569cd6", "--rt-blockquote-fg": "#a0a0a0", "--rt-code-bg": "#2d2d2d", "--rt-code-fg": "#d4d4d4", "--rt-table-border": "#3e3e3e", "--rt-th-bg": "#2a2a2a", "--rt-hr": "#3e3e3e", "--rt-img-bg": "#2a2a2a" }
  },
  {
    id: "monokai",
    name: "Monokai",
    mode: "dark",
    colors: { "--rt-bg": "#272822", "--rt-fg": "#f8f8f2", "--rt-heading": "#f8f8f0", "--rt-link": "#66d9ef", "--rt-meta": "#75715e", "--rt-blockquote-bg": "#3e3d32", "--rt-blockquote-border": "#a6e22e", "--rt-blockquote-fg": "#cfcfc2", "--rt-code-bg": "#3e3d32", "--rt-code-fg": "#f8f8f2", "--rt-table-border": "#49483e", "--rt-th-bg": "#3e3d32", "--rt-hr": "#49483e", "--rt-img-bg": "#3e3d32" }
  },
  {
    id: "one-dark-pro",
    name: "One Dark Pro",
    mode: "dark",
    colors: { "--rt-bg": "#282c34", "--rt-fg": "#abb2bf", "--rt-heading": "#e5c07b", "--rt-link": "#61afef", "--rt-meta": "#5c6370", "--rt-blockquote-bg": "#2c313a", "--rt-blockquote-border": "#528bff", "--rt-blockquote-fg": "#828997", "--rt-code-bg": "#2c313a", "--rt-code-fg": "#abb2bf", "--rt-table-border": "#3e4451", "--rt-th-bg": "#2c313a", "--rt-hr": "#3e4451", "--rt-img-bg": "#2c313a" }
  },
  {
    id: "dracula",
    name: "Dracula",
    mode: "dark",
    colors: { "--rt-bg": "#282a36", "--rt-fg": "#f8f8f2", "--rt-heading": "#ff79c6", "--rt-link": "#8be9fd", "--rt-meta": "#6272a4", "--rt-blockquote-bg": "#44475a", "--rt-blockquote-border": "#ff79c6", "--rt-blockquote-fg": "#cfcfc2", "--rt-code-bg": "#383a4a", "--rt-code-fg": "#f8f8f2", "--rt-table-border": "#44475a", "--rt-th-bg": "#383a4a", "--rt-hr": "#44475a", "--rt-img-bg": "#383a4a" }
  },
  {
    id: "nord",
    name: "Nord",
    mode: "dark",
    colors: { "--rt-bg": "#2e3440", "--rt-fg": "#d8dee9", "--rt-heading": "#88c0d0", "--rt-link": "#81a1c1", "--rt-meta": "#4c566a", "--rt-blockquote-bg": "#3b4252", "--rt-blockquote-border": "#88c0d0", "--rt-blockquote-fg": "#a8b4c4", "--rt-code-bg": "#3b4252", "--rt-code-fg": "#d8dee9", "--rt-table-border": "#434c5e", "--rt-th-bg": "#3b4252", "--rt-hr": "#434c5e", "--rt-img-bg": "#3b4252" }
  },
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    mode: "dark",
    colors: { "--rt-bg": "#1a1b26", "--rt-fg": "#c0caf5", "--rt-heading": "#7aa2f7", "--rt-link": "#7dcfff", "--rt-meta": "#565f89", "--rt-blockquote-bg": "#24283b", "--rt-blockquote-border": "#7aa2f7", "--rt-blockquote-fg": "#a9b1d6", "--rt-code-bg": "#1f2335", "--rt-code-fg": "#c0caf5", "--rt-table-border": "#292e42", "--rt-th-bg": "#24283b", "--rt-hr": "#292e42", "--rt-img-bg": "#24283b" }
  },
  {
    id: "catppuccin-mocha",
    name: "Catppuccin Mocha",
    mode: "dark",
    colors: { "--rt-bg": "#1e1e2e", "--rt-fg": "#cdd6f4", "--rt-heading": "#cba6f7", "--rt-link": "#89b4fa", "--rt-meta": "#585b70", "--rt-blockquote-bg": "#313244", "--rt-blockquote-border": "#cba6f7", "--rt-blockquote-fg": "#bac2de", "--rt-code-bg": "#313244", "--rt-code-fg": "#cdd6f4", "--rt-table-border": "#45475a", "--rt-th-bg": "#313244", "--rt-hr": "#45475a", "--rt-img-bg": "#313244" }
  },
  {
    id: "github-dark",
    name: "GitHub Dark",
    mode: "dark",
    colors: { "--rt-bg": "#0d1117", "--rt-fg": "#e6edf3", "--rt-heading": "#79c0ff", "--rt-link": "#58a6ff", "--rt-meta": "#8b949e", "--rt-blockquote-bg": "#161b22", "--rt-blockquote-border": "#58a6ff", "--rt-blockquote-fg": "#c9d1d9", "--rt-code-bg": "#161b22", "--rt-code-fg": "#e6edf3", "--rt-table-border": "#30363d", "--rt-th-bg": "#161b22", "--rt-hr": "#30363d", "--rt-img-bg": "#161b22" }
  },
  {
    id: "solarized-dark",
    name: "Solarized Dark",
    mode: "dark",
    colors: { "--rt-bg": "#002b36", "--rt-fg": "#839496", "--rt-heading": "#b58900", "--rt-link": "#268bd2", "--rt-meta": "#586e75", "--rt-blockquote-bg": "#073642", "--rt-blockquote-border": "#268bd2", "--rt-blockquote-fg": "#93a1a1", "--rt-code-bg": "#073642", "--rt-code-fg": "#839496", "--rt-table-border": "#003b48", "--rt-th-bg": "#073642", "--rt-hr": "#003b48", "--rt-img-bg": "#073642" }
  },
  {
    id: "gruvbox-dark",
    name: "Gruvbox Dark",
    mode: "dark",
    colors: { "--rt-bg": "#282828", "--rt-fg": "#ebdbb2", "--rt-heading": "#fabd2f", "--rt-link": "#83a598", "--rt-meta": "#7c6f64", "--rt-blockquote-bg": "#3c3836", "--rt-blockquote-border": "#b8bb26", "--rt-blockquote-fg": "#d5c4a1", "--rt-code-bg": "#3c3836", "--rt-code-fg": "#ebdbb2", "--rt-table-border": "#504945", "--rt-th-bg": "#3c3836", "--rt-hr": "#504945", "--rt-img-bg": "#3c3836" }
  },
  {
    id: "ayu-dark",
    name: "Ayu Dark",
    mode: "dark",
    colors: { "--rt-bg": "#1a1e29", "--rt-fg": "#bfbab0", "--rt-heading": "#ffd580", "--rt-link": "#59c2ff", "--rt-meta": "#6b717d", "--rt-blockquote-bg": "#242936", "--rt-blockquote-border": "#ffd580", "--rt-blockquote-fg": "#a9a59b", "--rt-code-bg": "#232834", "--rt-code-fg": "#bfbab0", "--rt-table-border": "#2f3543", "--rt-th-bg": "#242936", "--rt-hr": "#2f3543", "--rt-img-bg": "#242936" }
  },
  {
    id: "night-owl",
    name: "Night Owl",
    mode: "dark",
    colors: { "--rt-bg": "#011627", "--rt-fg": "#d6deeb", "--rt-heading": "#c792ea", "--rt-link": "#82aaff", "--rt-meta": "#5f7e97", "--rt-blockquote-bg": "#0e293f", "--rt-blockquote-border": "#c792ea", "--rt-blockquote-fg": "#aebac7", "--rt-code-bg": "#0b2941", "--rt-code-fg": "#d6deeb", "--rt-table-border": "#1d3b53", "--rt-th-bg": "#0e293f", "--rt-hr": "#1d3b53", "--rt-img-bg": "#0e293f" }
  },
  {
    id: "palenight",
    name: "Palenight",
    mode: "dark",
    colors: { "--rt-bg": "#292d3e", "--rt-fg": "#a6accd", "--rt-heading": "#c792ea", "--rt-link": "#82aaff", "--rt-meta": "#676e95", "--rt-blockquote-bg": "#333747", "--rt-blockquote-border": "#c792ea", "--rt-blockquote-fg": "#8b92b5", "--rt-code-bg": "#31364a", "--rt-code-fg": "#a6accd", "--rt-table-border": "#434863", "--rt-th-bg": "#333747", "--rt-hr": "#434863", "--rt-img-bg": "#333747" }
  },
  {
    id: "material-darker",
    name: "Material Darker",
    mode: "dark",
    colors: { "--rt-bg": "#212121", "--rt-fg": "#eeffff", "--rt-heading": "#ffcb6b", "--rt-link": "#82aaff", "--rt-meta": "#616161", "--rt-blockquote-bg": "#303030", "--rt-blockquote-border": "#ffcb6b", "--rt-blockquote-fg": "#b2ccd6", "--rt-code-bg": "#2e2e2e", "--rt-code-fg": "#eeffff", "--rt-table-border": "#424242", "--rt-th-bg": "#303030", "--rt-hr": "#424242", "--rt-img-bg": "#303030" }
  },
  {
    id: "synthwave-84",
    name: "SynthWave '84",
    mode: "dark",
    colors: { "--rt-bg": "#262335", "--rt-fg": "#d4d4d4", "--rt-heading": "#f92aad", "--rt-link": "#36f9f6", "--rt-meta": "#5b4c8c", "--rt-blockquote-bg": "#362f44", "--rt-blockquote-border": "#f92aad", "--rt-blockquote-fg": "#a8a8b8", "--rt-code-bg": "#342c45", "--rt-code-fg": "#d4d4d4", "--rt-table-border": "#434052", "--rt-th-bg": "#362f44", "--rt-hr": "#434052", "--rt-img-bg": "#362f44" }
  },
  {
    id: "cobalt2",
    name: "Cobalt2",
    mode: "dark",
    colors: { "--rt-bg": "#193549", "--rt-fg": "#ffffff", "--rt-heading": "#ffc600", "--rt-link": "#0088ff", "--rt-meta": "#5b7e9a", "--rt-blockquote-bg": "#1f4060", "--rt-blockquote-border": "#ffc600", "--rt-blockquote-fg": "#c8d6e5", "--rt-code-bg": "#1b3d57", "--rt-code-fg": "#ffffff", "--rt-table-border": "#234d6e", "--rt-th-bg": "#1f4060", "--rt-hr": "#234d6e", "--rt-img-bg": "#1f4060" }
  },
  {
    id: "shades-of-purple",
    name: "Shades of Purple",
    mode: "dark",
    colors: { "--rt-bg": "#2d2b55", "--rt-fg": "#ffffff", "--rt-heading": "#ffd700", "--rt-link": "#fad000", "--rt-meta": "#7e76b5", "--rt-blockquote-bg": "#3f3d6e", "--rt-blockquote-border": "#a599e9", "--rt-blockquote-fg": "#d4d0f0", "--rt-code-bg": "#3a3864", "--rt-code-fg": "#ffffff", "--rt-table-border": "#4d4b7c", "--rt-th-bg": "#3f3d6e", "--rt-hr": "#4d4b7c", "--rt-img-bg": "#3f3d6e" }
  },
  {
    id: "horizon",
    name: "Horizon",
    mode: "dark",
    colors: { "--rt-bg": "#1c1e26", "--rt-fg": "#d5d8da", "--rt-heading": "#e95678", "--rt-link": "#26bbd9", "--rt-meta": "#6c6f93", "--rt-blockquote-bg": "#2a2d3b", "--rt-blockquote-border": "#e95678", "--rt-blockquote-fg": "#b1b4c2", "--rt-code-bg": "#252837", "--rt-code-fg": "#d5d8da", "--rt-table-border": "#3a3d4d", "--rt-th-bg": "#2a2d3b", "--rt-hr": "#3a3d4d", "--rt-img-bg": "#2a2d3b" }
  },
  {
    id: "atom-one-dark",
    name: "Atom One Dark",
    mode: "dark",
    colors: { "--rt-bg": "#282c34", "--rt-fg": "#abb2bf", "--rt-heading": "#e5c07b", "--rt-link": "#61afef", "--rt-meta": "#636d83", "--rt-blockquote-bg": "#2c313c", "--rt-blockquote-border": "#98c379", "--rt-blockquote-fg": "#939ba9", "--rt-code-bg": "#21252b", "--rt-code-fg": "#abb2bf", "--rt-table-border": "#3e4451", "--rt-th-bg": "#2c313c", "--rt-hr": "#3e4451", "--rt-img-bg": "#2c313c" }
  },
  {
    id: "panda",
    name: "Panda",
    mode: "dark",
    colors: { "--rt-bg": "#292a2b", "--rt-fg": "#e6e6e6", "--rt-heading": "#ffb86c", "--rt-link": "#45a9f9", "--rt-meta": "#6b6b6b", "--rt-blockquote-bg": "#383a3b", "--rt-blockquote-border": "#ffb86c", "--rt-blockquote-fg": "#c0c0c0", "--rt-code-bg": "#363839", "--rt-code-fg": "#e6e6e6", "--rt-table-border": "#454748", "--rt-th-bg": "#383a3b", "--rt-hr": "#454748", "--rt-img-bg": "#383a3b" }
  },
  {
    id: "kanagawa",
    name: "Kanagawa",
    mode: "dark",
    colors: { "--rt-bg": "#1f1f28", "--rt-fg": "#dcd7ba", "--rt-heading": "#e6c384", "--rt-link": "#7e9cd8", "--rt-meta": "#727169", "--rt-blockquote-bg": "#2a2a37", "--rt-blockquote-border": "#e6c384", "--rt-blockquote-fg": "#c0bca0", "--rt-code-bg": "#252535", "--rt-code-fg": "#dcd7ba", "--rt-table-border": "#3a3a4a", "--rt-th-bg": "#2a2a37", "--rt-hr": "#3a3a4a", "--rt-img-bg": "#2a2a37" }
  },
  // ===== 亮色主题 =====
  {
    id: "light-plus",
    name: "Light+ (默认亮色)",
    mode: "light",
    colors: { "--rt-bg": "#ffffff", "--rt-fg": "#333333", "--rt-heading": "#000000", "--rt-link": "#007acc", "--rt-meta": "#999999", "--rt-blockquote-bg": "#f5f5f5", "--rt-blockquote-border": "#007acc", "--rt-blockquote-fg": "#666666", "--rt-code-bg": "#f3f3f3", "--rt-code-fg": "#333333", "--rt-table-border": "#d9d9d9", "--rt-th-bg": "#f0f0f0", "--rt-hr": "#d9d9d9", "--rt-img-bg": "#f0f0f0" }
  },
  {
    id: "github-light",
    name: "GitHub Light",
    mode: "light",
    colors: { "--rt-bg": "#ffffff", "--rt-fg": "#24292e", "--rt-heading": "#000000", "--rt-link": "#0366d6", "--rt-meta": "#6a737d", "--rt-blockquote-bg": "#f6f8fa", "--rt-blockquote-border": "#0366d6", "--rt-blockquote-fg": "#666666", "--rt-code-bg": "#f6f8fa", "--rt-code-fg": "#24292e", "--rt-table-border": "#e1e4e8", "--rt-th-bg": "#f6f8fa", "--rt-hr": "#e1e4e8", "--rt-img-bg": "#f6f8fa" }
  },
  {
    id: "solarized-light",
    name: "Solarized Light",
    mode: "light",
    colors: { "--rt-bg": "#fdf6e3", "--rt-fg": "#657b83", "--rt-heading": "#b58900", "--rt-link": "#268bd2", "--rt-meta": "#93a1a1", "--rt-blockquote-bg": "#eee8d5", "--rt-blockquote-border": "#268bd2", "--rt-blockquote-fg": "#586e75", "--rt-code-bg": "#eee8d5", "--rt-code-fg": "#657b83", "--rt-table-border": "#dbd2bd", "--rt-th-bg": "#eee8d5", "--rt-hr": "#dbd2bd", "--rt-img-bg": "#eee8d5" }
  },
  {
    id: "gruvbox-light",
    name: "Gruvbox Light",
    mode: "light",
    colors: { "--rt-bg": "#fbf1c7", "--rt-fg": "#3c3836", "--rt-heading": "#b57614", "--rt-link": "#076678", "--rt-meta": "#928374", "--rt-blockquote-bg": "#f2e5bc", "--rt-blockquote-border": "#98971a", "--rt-blockquote-fg": "#665c54", "--rt-code-bg": "#f2e5bc", "--rt-code-fg": "#3c3836", "--rt-table-border": "#ebdbb2", "--rt-th-bg": "#f2e5bc", "--rt-hr": "#ebdbb2", "--rt-img-bg": "#f2e5bc" }
  },
  {
    id: "catppuccin-latte",
    name: "Catppuccin Latte",
    mode: "light",
    colors: { "--rt-bg": "#eff1f5", "--rt-fg": "#4c4f69", "--rt-heading": "#8839ef", "--rt-link": "#1e66f5", "--rt-meta": "#9ca0b0", "--rt-blockquote-bg": "#e6e9ef", "--rt-blockquote-border": "#8839ef", "--rt-blockquote-fg": "#585b70", "--rt-code-bg": "#e6e9ef", "--rt-code-fg": "#4c4f69", "--rt-table-border": "#ccd0da", "--rt-th-bg": "#e6e9ef", "--rt-hr": "#ccd0da", "--rt-img-bg": "#e6e9ef" }
  },
  {
    id: "ayu-light",
    name: "Ayu Light",
    mode: "light",
    colors: { "--rt-bg": "#fafafa", "--rt-fg": "#5c6166", "--rt-heading": "#fa8d3e", "--rt-link": "#399ee6", "--rt-meta": "#abb0b6", "--rt-blockquote-bg": "#f0f0f0", "--rt-blockquote-border": "#fa8d3e", "--rt-blockquote-fg": "#6c7178", "--rt-code-bg": "#f0f0f0", "--rt-code-fg": "#5c6166", "--rt-table-border": "#e0e0e0", "--rt-th-bg": "#f0f0f0", "--rt-hr": "#e0e0e0", "--rt-img-bg": "#f0f0f0" }
  },
  {
    id: "material-lighter",
    name: "Material Lighter",
    mode: "light",
    colors: { "--rt-bg": "#fafafa", "--rt-fg": "#546e7a", "--rt-heading": "#e53935", "--rt-link": "#39adb5", "--rt-meta": "#999999", "--rt-blockquote-bg": "#f0f0f0", "--rt-blockquote-border": "#90a4ae", "--rt-blockquote-fg": "#6e839a", "--rt-code-bg": "#f0f0f0", "--rt-code-fg": "#546e7a", "--rt-table-border": "#e0e0e0", "--rt-th-bg": "#f0f0f0", "--rt-hr": "#e0e0e0", "--rt-img-bg": "#f0f0f0" }
  },
  {
    id: "atom-one-light",
    name: "Atom One Light",
    mode: "light",
    colors: { "--rt-bg": "#fafafa", "--rt-fg": "#383a42", "--rt-heading": "#e45649", "--rt-link": "#4078f2", "--rt-meta": "#a0a1a7", "--rt-blockquote-bg": "#f0f0f0", "--rt-blockquote-border": "#50a14f", "--rt-blockquote-fg": "#696c77", "--rt-code-bg": "#eaeaeb", "--rt-code-fg": "#383a42", "--rt-table-border": "#e0e0e0", "--rt-th-bg": "#f0f0f0", "--rt-hr": "#e0e0e0", "--rt-img-bg": "#f0f0f0" }
  }
];
const FOLLOW_UI_ID = "__follow_ui__";
function getReadingThemeById(id2) {
  return READING_THEMES.find((t2) => t2.id === id2) ?? getCustomReadingThemes().find((t2) => t2.id === id2);
}
function getAllReadingThemes() {
  return [...READING_THEMES, ...getCustomReadingThemes()];
}
const CUSTOM_RT_KEY = "capybara:custom-reading-themes";
function getCustomReadingThemes() {
  try {
    const raw = localStorage.getItem(CUSTOM_RT_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
function saveCustomReadingThemes(themes) {
  localStorage.setItem(CUSTOM_RT_KEY, JSON.stringify(themes));
}
function upsertCustomReadingTheme(theme) {
  const themes = getCustomReadingThemes();
  const idx = themes.findIndex((t2) => t2.id === theme.id);
  if (idx >= 0) themes[idx] = theme;
  else themes.push(theme);
  saveCustomReadingThemes(themes);
}
function deleteCustomReadingTheme(id2) {
  saveCustomReadingThemes(getCustomReadingThemes().filter((t2) => t2.id !== id2));
}
const DEFAULT_UI_STACK = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif";
const DEFAULT_MONO_STACK = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const SETTING_KEYS = {
  theme: "theme",
  colorTheme: "color_theme",
  fontFamily: "font_family",
  fontScale: "font_scale",
  fontWeight: "font_weight",
  readingTheme: "reading_theme"
};
const DEFAULT_APPEARANCE = {
  theme: "system",
  colorTheme: "none",
  fontFamily: "",
  fontScale: 1,
  fontWeight: "normal",
  readingTheme: FOLLOW_UI_ID
};
const THEME_OPTIONS = [
  { key: "system", label: "跟随系统" },
  { key: "light", label: "亮色" },
  { key: "dark", label: "暗色" }
];
const COLOR_THEMES = [
  { key: "azure", label: "晴空蓝", preview: "linear-gradient(135deg,#0a64d6,#7fc3ff)" },
  { key: "claude", label: "陶土暖", preview: "linear-gradient(135deg,#d97757,#faf9f5)" },
  { key: "ocean", label: "碧海青", preview: "linear-gradient(135deg,#0b6a9e,#7dd3fc)" },
  { key: "snow-cinnabar", label: "朱砂赤", preview: "linear-gradient(135deg,#984933,#c36a50)" },
  { key: "vibrant", label: "青碧绿", preview: "linear-gradient(135deg,#2d3436,#3aaba6)" }
];
const KNOWN_COLOR_THEME_KEYS = /* @__PURE__ */ new Set([
  ...COLOR_THEMES.map((s) => s.key)
]);
const FONT_WEIGHTS = { thin: 300, normal: 400, bold: 700 };
const FONT_WEIGHT_VALUE = (w2) => FONT_WEIGHTS[w2] ?? 400;
function uiFontStack(family) {
  const f2 = family.trim();
  if (!f2) return DEFAULT_UI_STACK;
  return `"${f2}", ${DEFAULT_UI_STACK}`;
}
function persistAppearance(patch) {
  for (const [key, value] of Object.entries(patch)) {
    const settingKey = SETTING_KEYS[key];
    if (settingKey && value !== void 0) {
      void window.capybara.invoke("settings:set", settingKey, String(value));
    }
  }
}
const APPEARANCE_CACHE_KEY = "capybara:appearance";
function cacheAppearance(a) {
  try {
    localStorage.setItem(APPEARANCE_CACHE_KEY, JSON.stringify(a));
  } catch {
  }
}
function resolveDark(theme) {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function applyAppearance(a) {
  const root = document.documentElement;
  root.classList.toggle("dark", resolveDark(a.theme));
  root.style.colorScheme = resolveDark(a.theme) ? "dark" : "light";
  if (a.colorTheme === "none") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", a.colorTheme);
  }
  root.style.setProperty("--font-scale", String(a.fontScale));
  const stack = uiFontStack(a.fontFamily);
  root.style.setProperty("--font-reading", stack);
  root.style.setProperty("--font-ui", stack);
  root.style.setProperty("--font-weight", String(FONT_WEIGHT_VALUE(a.fontWeight)));
  let styleEl = document.getElementById("font-override");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "font-override";
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = `
    html, body, input, textarea, select, button,
    .reader-content, .reader-content.reading {
      font-family: ${stack} !important;
    }
    code, pre, .feed-header .keys, .feed-row .fr-url, .diag-mono {
      font-family: ${DEFAULT_MONO_STACK} !important;
    }
  `;
  cacheAppearance(a);
  applyReadingTheme(a.readingTheme);
}
function applyReadingTheme(themeId) {
  const root = document.documentElement;
  if (themeId === FOLLOW_UI_ID || !themeId) {
    root.removeAttribute("data-reading-theme");
    return;
  }
  const theme = getReadingThemeById(themeId);
  if (!theme) return;
  root.setAttribute("data-reading-theme", themeId);
  root.setAttribute("data-reading-mode", theme.mode);
  for (const [key, value] of Object.entries(theme.colors)) {
    root.style.setProperty(key, value);
  }
}
function bootAppearance() {
  let a = null;
  try {
    const raw = localStorage.getItem(APPEARANCE_CACHE_KEY);
    if (raw) a = JSON.parse(raw);
    if (a) {
      if (!a.readingTheme) a.readingTheme = FOLLOW_UI_ID;
      if (!a.colorTheme || a.colorTheme !== "none" && !KNOWN_COLOR_THEME_KEYS.has(a.colorTheme)) a.colorTheme = DEFAULT_APPEARANCE.colorTheme;
    }
  } catch {
    a = null;
  }
  applyAppearance(a ?? DEFAULT_APPEARANCE);
}
function watchSystemTheme(onChange) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => onChange();
  mq.addEventListener?.("change", handler);
  return () => mq.removeEventListener?.("change", handler);
}
const SHORTCUT_GROUPS = [
  {
    title: "通用",
    items: [
      { key: "openSettings", label: "打开系统配置", desc: "打开设置窗口" },
      { key: "focusSearch", label: "聚焦搜索", desc: "光标移到搜索框" },
      { key: "refresh", label: "刷新全部源", desc: "立即刷新所有订阅源" },
      { key: "quickAdd", label: "新建条目", desc: "打开快速添加" },
      { key: "help", label: "快捷键帮助", desc: "打开本配置页" },
      { key: "close", label: "关闭 / 返回", desc: "关闭弹层、返回列表" }
    ]
  },
  {
    title: "视图切换",
    items: [
      { key: "goRss", label: "RSS", desc: "切到 RSS 未读" },
      { key: "goLater", label: "稍后读", desc: "切到稍后读" },
      { key: "goFavorite", label: "已收藏", desc: "切到已收藏" },
      { key: "goArchived", label: "归档", desc: "切到归档" },
      { key: "goAll", label: "全部条目", desc: "切到全部" },
      { key: "toggleBoard", label: "切换白板", desc: "进入 / 退出白板" }
    ]
  },
  {
    title: "条目操作",
    items: [
      { key: "nextItem", label: "下一条", desc: "在列表中下移选择" },
      { key: "prevItem", label: "上一条", desc: "在列表中上移选择" },
      { key: "archiveItem", label: "归档", desc: "归档当前条目" },
      { key: "laterItem", label: "稍后读", desc: "标为稍后读" },
      { key: "favoriteItem", label: "收藏", desc: "收藏当前条目" },
      { key: "openLink", label: "打开原文", desc: "用浏览器打开当前条目链接" }
    ]
  }
];
const DEFAULT_SHORTCUTS = {
  openSettings: "Mod+,",
  focusSearch: "Mod+F",
  refresh: "Mod+R",
  quickAdd: "Mod+N",
  goRss: "Mod+1",
  goLater: "Mod+2",
  goFavorite: "Mod+3",
  goArchived: "Mod+4",
  goAll: "Mod+5",
  toggleBoard: "Mod+B",
  nextItem: "j",
  prevItem: "k",
  archiveItem: "e",
  laterItem: "l",
  favoriteItem: "f",
  openLink: "o",
  help: "Mod+/",
  close: "Escape"
};
function eventToCombo(e) {
  const mod = e.metaKey || e.ctrlKey;
  const shift = e.shiftKey;
  const alt = e.altKey;
  const parts = [];
  if (mod) parts.push("Mod");
  if (shift) parts.push("Shift");
  if (alt) parts.push("Alt");
  let key = e.key;
  if (key === " ") key = "Space";
  if (key.length === 1) key = key.toUpperCase();
  parts.push(key);
  return parts.join("+");
}
const SYM = {
  Mod: "⌘",
  Shift: "⇧",
  Alt: "⌥",
  ",": ",",
  ".": ".",
  "/": "/",
  Space: "空格",
  Escape: "Esc",
  Enter: "↩"
};
function formatCombo(combo) {
  const parts = combo.split("+");
  return parts.map((p2) => SYM[p2] ?? p2).join(parts.length > 1 ? " " : "");
}
function isGlobalCombo(combo) {
  return combo.includes("Mod");
}
function parseShortcuts(raw) {
  const out = { ...DEFAULT_SHORTCUTS };
  if (!raw) return out;
  try {
    const obj = JSON.parse(raw);
    for (const k2 of Object.keys(DEFAULT_SHORTCUTS)) {
      if (typeof obj[k2] === "string" && obj[k2].trim()) out[k2] = obj[k2].trim();
    }
  } catch {
  }
  return out;
}
const registry$1 = /* @__PURE__ */ new Map();
let activeMap$1 = null;
const BUILTIN_META$1 = [
  { id: "crystal", label: "Crystal 水晶", preview: ["tap", "toggle", "complete", "open", "delete"], builtIn: true }
];
const CRYSTAL_MAP = {
  tap: [
    { type: "noise", duration: 8e-3, gain: 0.04, frequency: 3600, filter: "highpass" }
  ],
  toggle: [
    { type: "noise", duration: 9e-3, gain: 0.026, frequency: 2800 },
    { type: "tone", frequency: 680, endFrequency: 510, duration: 0.07, gain: 0.024 }
  ],
  open: [
    { type: "tone", frequency: 360, endFrequency: 580, duration: 0.12, gain: 0.034, oscillator: "triangle" },
    { type: "tone", at: 0.045, frequency: 720, duration: 0.1, gain: 0.016 }
  ],
  delete: [
    { type: "tone", frequency: 310, endFrequency: 175, duration: 0.1, gain: 0.03, oscillator: "triangle" },
    { type: "noise", duration: 0.016, gain: 0.018, frequency: 1200 }
  ],
  lift: [
    { type: "tone", frequency: 440, endFrequency: 560, duration: 0.075, gain: 0.022, oscillator: "triangle" }
  ],
  drop: [
    { type: "tone", frequency: 300, endFrequency: 235, duration: 0.085, gain: 0.03, oscillator: "triangle" },
    { type: "noise", duration: 0.01, gain: 0.018, frequency: 1900 }
  ],
  complete: [
    { type: "tone", at: 0, frequency: 523.25, duration: 0.16, gain: 0.024, oscillator: "triangle" },
    { type: "tone", at: 0.07, frequency: 659.25, duration: 0.16, gain: 0.024, oscillator: "triangle" },
    { type: "tone", at: 0.14, frequency: 783.99, duration: 0.34, gain: 0.032, oscillator: "triangle" }
  ],
  style: [
    { type: "tone", frequency: 620, endFrequency: 820, duration: 0.13, gain: 0.022, oscillator: "sine" },
    { type: "tone", at: 0.025, frequency: 1240, endFrequency: 1320, duration: 0.16, gain: 9e-3 }
  ],
  hover: [
    { type: "tone", frequency: 1800, endFrequency: 2400, duration: 0.04, gain: 0.012, oscillator: "sine" },
    { type: "noise", duration: 6e-3, gain: 8e-3, frequency: 4800, filter: "highpass" }
  ],
  mark: [
    { type: "tone", frequency: 520, endFrequency: 660, duration: 0.1, gain: 0.026, oscillator: "triangle" },
    { type: "tone", at: 0.04, frequency: 880, duration: 0.08, gain: 0.014, oscillator: "triangle" }
  ]
};
registry$1.set("crystal", { map: CRYSTAL_MAP, meta: BUILTIN_META$1[0] });
function setSoundTheme(id2) {
  const entry = registry$1.get(id2);
  if (!entry) return;
  activeMap$1 = entry.map;
}
function resolveSoundCue(cue) {
  if (activeMap$1 && activeMap$1[cue]) return activeMap$1[cue];
  return CRYSTAL_MAP[cue] ?? [];
}
let context = null;
let master = null;
let lastPlayedAt = 0;
let enabled = false;
let volume = 0.7;
function setSoundEnabled(value) {
  enabled = value;
  if (value) void ensureAudio();
}
function setSoundVolume(value) {
  volume = Math.min(1, Math.max(0, value));
  if (master && context) master.gain.value = volume;
}
let audioReady = false;
function ensureAudio() {
  try {
    if (!context) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      context = new Ctor({ latencyHint: "balanced" });
      context.addEventListener("statechange", () => {
        audioReady = context?.state === "running";
      });
    }
    if (!master) {
      master = context.createGain();
      master.gain.value = volume;
      master.connect(context.destination);
    }
    if (context.state === "suspended") {
      void context.resume().then(() => {
        audioReady = true;
      });
    }
    return { ctx: context, out: master };
  } catch {
    return null;
  }
}
function tone(ctx, destination, options) {
  const start = ctx.currentTime + (options.at ?? 0);
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = options.oscillator ?? "sine";
  osc.frequency.setValueAtTime(options.frequency, start);
  if (options.endFrequency) {
    osc.frequency.exponentialRampToValueAtTime(options.endFrequency, start + options.duration);
  }
  const peak = options.gain ?? 0.025;
  g.gain.setValueAtTime(1e-4, start);
  g.gain.linearRampToValueAtTime(peak, start + 6e-3);
  g.gain.exponentialRampToValueAtTime(1e-4, start + options.duration);
  osc.connect(g);
  g.connect(destination);
  osc.onended = () => {
    osc.disconnect();
    g.disconnect();
  };
  osc.start(start);
  osc.stop(start + options.duration + 0.02);
}
function noise(ctx, destination, options) {
  const start = ctx.currentTime + (options.at ?? 0);
  const length = Math.max(1, Math.floor(ctx.sampleRate * options.duration));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (length * 0.18));
  }
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const g = ctx.createGain();
  source.buffer = buffer;
  filter.type = options.filter ?? "bandpass";
  filter.frequency.value = options.frequency;
  filter.Q.value = 2.2;
  g.gain.value = options.gain;
  source.connect(filter);
  filter.connect(g);
  g.connect(destination);
  source.onended = () => {
    source.disconnect();
    filter.disconnect();
    g.disconnect();
  };
  source.start(start);
}
function playSound(cue) {
  if (!enabled || typeof AudioContext === "undefined") return;
  const now2 = performance.now();
  if (now2 - lastPlayedAt < 28) return;
  lastPlayedAt = now2;
  const audio = ensureAudio();
  if (!audio) return;
  const { ctx, out: destination } = audio;
  try {
    const configs = resolveSoundCue(cue);
    for (const cfg of configs) {
      if (cfg.type === "tone") {
        tone(ctx, destination, cfg);
      } else {
        noise(ctx, destination, cfg);
      }
    }
  } catch {
  }
}
function primeAudio() {
  if (context && audioReady) return;
  ensureAudio();
}
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};
const LucideContext = reactExports.createContext({});
const useLucideContext = () => reactExports.useContext(LucideContext);
const Icon$1 = reactExports.forwardRef(
  ({ color, size: size2, strokeWidth, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref) => {
    const {
      size: contextSize = 24,
      strokeWidth: contextStrokeWidth = 2,
      absoluteStrokeWidth: contextAbsoluteStrokeWidth = false,
      color: contextColor = "currentColor",
      className: contextClass = ""
    } = useLucideContext() ?? {};
    const calculatedStrokeWidth = absoluteStrokeWidth ?? contextAbsoluteStrokeWidth ? Number(strokeWidth ?? contextStrokeWidth) * 24 / Number(size2 ?? contextSize) : strokeWidth ?? contextStrokeWidth;
    return reactExports.createElement(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size2 ?? contextSize ?? defaultAttributes.width,
        height: size2 ?? contextSize ?? defaultAttributes.height,
        stroke: color ?? contextColor,
        strokeWidth: calculatedStrokeWidth,
        className: mergeClasses("lucide", contextClass, className),
        ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon$1, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$V = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$V);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$U = [
  ["rect", { width: "6", height: "16", x: "4", y: "2", rx: "2", key: "z5wdxg" }],
  ["rect", { width: "6", height: "9", x: "14", y: "9", rx: "2", key: "um7a8w" }],
  ["path", { d: "M22 22H2", key: "19qnx5" }]
];
const AlignEndHorizontal = createLucideIcon("align-end-horizontal", __iconNode$U);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$T = [
  ["rect", { width: "16", height: "6", x: "2", y: "4", rx: "2", key: "10wcwx" }],
  ["rect", { width: "9", height: "6", x: "9", y: "14", rx: "2", key: "4p5bwg" }],
  ["path", { d: "M22 22V2", key: "12ipfv" }]
];
const AlignEndVertical = createLucideIcon("align-end-vertical", __iconNode$T);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$S = [
  ["rect", { width: "6", height: "10", x: "9", y: "7", rx: "2", key: "yn7j0q" }],
  ["path", { d: "M4 22V2", key: "tsjzd3" }],
  ["path", { d: "M20 22V2", key: "1bnhr8" }]
];
const AlignHorizontalSpaceAround = createLucideIcon("align-horizontal-space-around", __iconNode$S);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$R = [
  ["rect", { width: "6", height: "16", x: "4", y: "6", rx: "2", key: "1n4dg1" }],
  ["rect", { width: "6", height: "9", x: "14", y: "6", rx: "2", key: "17khns" }],
  ["path", { d: "M22 2H2", key: "fhrpnj" }]
];
const AlignStartHorizontal = createLucideIcon("align-start-horizontal", __iconNode$R);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$Q = [
  ["rect", { width: "9", height: "6", x: "6", y: "14", rx: "2", key: "lpm2y7" }],
  ["rect", { width: "16", height: "6", x: "6", y: "4", rx: "2", key: "rdj6ps" }],
  ["path", { d: "M2 2v20", key: "1ivd8o" }]
];
const AlignStartVertical = createLucideIcon("align-start-vertical", __iconNode$Q);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$P = [
  ["rect", { width: "10", height: "6", x: "7", y: "9", rx: "2", key: "b1zbii" }],
  ["path", { d: "M22 20H2", key: "1p1f7z" }],
  ["path", { d: "M22 4H2", key: "1b7qnq" }]
];
const AlignVerticalSpaceAround = createLucideIcon("align-vertical-space-around", __iconNode$P);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$O = [
  ["rect", { width: "20", height: "5", x: "2", y: "3", rx: "1", key: "1wp1u1" }],
  ["path", { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8", key: "1s80jp" }],
  ["path", { d: "M10 12h4", key: "a56b0p" }]
];
const Archive = createLucideIcon("archive", __iconNode$O);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$N = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$N);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$M = [
  ["path", { d: "M12 5v16", key: "1f6ucr" }],
  [
    "path",
    {
      d: "M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z",
      key: "1fyvmf"
    }
  ]
];
const BookOpen = createLucideIcon("book-open", __iconNode$M);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$L = [
  [
    "path",
    {
      d: "M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z",
      key: "oz39mx"
    }
  ]
];
const Bookmark = createLucideIcon("bookmark", __iconNode$L);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$K = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode$K);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$J = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$J);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$I = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$I);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$H = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
];
const Clock = createLucideIcon("clock", __iconNode$H);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$G = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$G);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$F = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const EyeOff = createLucideIcon("eye-off", __iconNode$F);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$E = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode$E);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$D = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      key: "1oefj6"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$D);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$C = [
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
      key: "1kt360"
    }
  ]
];
const Folder = createLucideIcon("folder", __iconNode$C);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$B = [
  ["line", { x1: "22", x2: "2", y1: "6", y2: "6", key: "15w7dq" }],
  ["line", { x1: "22", x2: "2", y1: "18", y2: "18", key: "1ip48p" }],
  ["line", { x1: "6", x2: "6", y1: "2", y2: "22", key: "a2lnyx" }],
  ["line", { x1: "18", x2: "18", y1: "2", y2: "22", key: "8vb6jd" }]
];
const Frame = createLucideIcon("frame", __iconNode$B);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$A = [
  [
    "path",
    {
      d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
      key: "mvr1a0"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode$A);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$z = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
const Image = createLucideIcon("image", __iconNode$z);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$y = [
  ["polyline", { points: "22 12 16 12 14 15 10 15 8 12 2 12", key: "o97t9d" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "oot6mr"
    }
  ]
];
const Inbox = createLucideIcon("inbox", __iconNode$y);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$x = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode$x);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$w = [
  ["path", { d: "M10 8h.01", key: "1r9ogq" }],
  ["path", { d: "M12 12h.01", key: "1mp3jc" }],
  ["path", { d: "M14 8h.01", key: "1primd" }],
  ["path", { d: "M16 12h.01", key: "1l6xoz" }],
  ["path", { d: "M18 8h.01", key: "emo2bl" }],
  ["path", { d: "M6 8h.01", key: "x9i8wu" }],
  ["path", { d: "M7 16h10", key: "wp8him" }],
  ["path", { d: "M8 12h.01", key: "czm47f" }],
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2", key: "18n3k1" }]
];
const Keyboard = createLucideIcon("keyboard", __iconNode$w);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$v = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
];
const LayoutGrid = createLucideIcon("layout-grid", __iconNode$v);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$u = [
  ["path", { d: "m16 6 4 14", key: "ji33uf" }],
  ["path", { d: "M12 6v14", key: "1n7gus" }],
  ["path", { d: "M8 8v12", key: "1gg7y9" }],
  ["path", { d: "M4 4v16", key: "6qkkli" }]
];
const Library = createLucideIcon("library", __iconNode$u);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$t = [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
  ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }]
];
const Link2 = createLucideIcon("link-2", __iconNode$t);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$s = [
  ["path", { d: "M3 5h.01", key: "18ugdj" }],
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M3 19h.01", key: "noohij" }],
  ["path", { d: "M8 5h13", key: "1pao27" }],
  ["path", { d: "M8 12h13", key: "1za7za" }],
  ["path", { d: "M8 19h13", key: "m83p4d" }]
];
const List = createLucideIcon("list", __iconNode$s);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$r = [
  [
    "path",
    {
      d: "M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z",
      key: "1jhwl8"
    }
  ],
  ["path", { d: "m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10", key: "1qfld7" }]
];
const MailOpen = createLucideIcon("mail-open", __iconNode$r);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$q = [
  ["path", { d: "M8 3H5a2 2 0 0 0-2 2v3", key: "1dcmit" }],
  ["path", { d: "M21 8V5a2 2 0 0 0-2-2h-3", key: "1e4gt3" }],
  ["path", { d: "M3 16v3a2 2 0 0 0 2 2h3", key: "wsl5sc" }],
  ["path", { d: "M16 21h3a2 2 0 0 0 2-2v-3", key: "18trek" }]
];
const Maximize = createLucideIcon("maximize", __iconNode$q);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$p = [
  ["path", { d: "M12 17v4", key: "1riwvh" }],
  ["path", { d: "M18 11a6 6 0 00-3-5.197", key: "1lvu40" }],
  ["path", { d: "M2 11a10 10 0 015-8.662", key: "bida4p" }],
  ["path", { d: "M22 11a10 10 0 00-5-8.662", key: "idvinr" }],
  ["path", { d: "M6 11a6 6 0 013-5.197", key: "17n2ii" }],
  ["path", { d: "M9 21h6", key: "1udhl7" }],
  ["rect", { x: "10", y: "9", width: "4", height: "8", rx: "2", key: "1l8p2f" }]
];
const MicSignal = createLucideIcon("mic-signal", __iconNode$p);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$o = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode$o);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$n = [
  ["path", { d: "M9 18V5l12-2v13", key: "1jmyc2" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["circle", { cx: "18", cy: "16", r: "3", key: "1hluhg" }]
];
const Music = createLucideIcon("music", __iconNode$n);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$m = [
  [
    "path",
    {
      d: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",
      key: "e79jfc"
    }
  ],
  ["circle", { cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor", key: "1okk4w" }],
  ["circle", { cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor", key: "f64h9f" }],
  ["circle", { cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor", key: "qy21gx" }],
  ["circle", { cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor", key: "fotxhn" }]
];
const Palette = createLucideIcon("palette", __iconNode$m);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$l = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }],
  ["path", { d: "m16 15-3-3 3-3", key: "14y99z" }]
];
const PanelLeftClose = createLucideIcon("panel-left-close", __iconNode$l);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$k = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }],
  ["path", { d: "m14 9 3 3-3 3", key: "8010ee" }]
];
const PanelLeftOpen = createLucideIcon("panel-left-open", __iconNode$k);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$j = [
  [
    "path",
    {
      d: "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",
      key: "1miecu"
    }
  ]
];
const Paperclip = createLucideIcon("paperclip", __iconNode$j);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$i = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode$i);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$h = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$h);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$g = [
  [
    "path",
    {
      d: "M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
      key: "rib7q0"
    }
  ],
  [
    "path",
    {
      d: "M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
      key: "1ymkrd"
    }
  ]
];
const Quote = createLucideIcon("quote", __iconNode$g);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$f = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$f);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$e = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M21 9H3", key: "1338ky" }],
  ["path", { d: "M21 15H3", key: "9uk58r" }]
];
const Rows3 = createLucideIcon("rows-3", __iconNode$e);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$d = [
  ["path", { d: "M4 11a9 9 0 0 1 9 9", key: "pv89mb" }],
  ["path", { d: "M4 4a16 16 0 0 1 16 16", key: "k0647b" }],
  ["circle", { cx: "5", cy: "19", r: "1", key: "bfqh0e" }]
];
const Rss = createLucideIcon("rss", __iconNode$d);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$c = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$c);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$b = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode$b);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$a = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode$a);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$9 = [
  ["path", { d: "m18 14 4 4-4 4", key: "10pe0f" }],
  ["path", { d: "m18 2 4 4-4 4", key: "pucp1d" }],
  ["path", { d: "M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22", key: "1ailkh" }],
  ["path", { d: "M2 6h1.972a4 4 0 0 1 3.6 2.2", key: "km57vx" }],
  ["path", { d: "M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45", key: "os18l9" }]
];
const Shuffle = createLucideIcon("shuffle", __iconNode$9);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$8 = [
  [
    "path",
    {
      d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
      key: "1s2grr"
    }
  ],
  ["path", { d: "M20 2v4", key: "1rf3ol" }],
  ["path", { d: "M22 4h-4", key: "gwowj6" }],
  ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode$8);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode$7);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  [
    "path",
    {
      d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
      key: "vktsd0"
    }
  ],
  ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor", key: "kqv944" }]
];
const Tag = createLucideIcon("tag", __iconNode$6);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode$5);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M12 4v16", key: "1654pz" }],
  ["path", { d: "M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2", key: "e0r10z" }],
  ["path", { d: "M9 20h6", key: "s66wpe" }]
];
const Type = createLucideIcon("type", __iconNode$4);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M9 14 4 9l5-5", key: "102s5s" }],
  ["path", { d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11", key: "f3b9sd" }]
];
const Undo2 = createLucideIcon("undo-2", __iconNode$3);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode$2);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
      key: "ftymec"
    }
  ],
  ["rect", { x: "2", y: "6", width: "14", height: "12", rx: "2", key: "158x01" }]
];
const Video = createLucideIcon("video", __iconNode$1);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
function BrandGithub({ size: size2 = 24, color = "currentColor", className, style, ...rest }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: size2,
      height: size2,
      viewBox: "0 0 24 24",
      fill: color,
      className,
      style,
      "aria-hidden": "true",
      ...rest,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" })
    }
  );
}
function BrandTwitter({ size: size2 = 24, color = "currentColor", className, style, ...rest }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: size2,
      height: size2,
      viewBox: "0 0 24 24",
      fill: color,
      className,
      style,
      "aria-hidden": "true",
      ...rest,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" })
    }
  );
}
const LUCIDE_ICON_MAP = {
  rss: Rss,
  read: MailOpen,
  inbox: Inbox,
  later: Clock,
  favorite: Star,
  archived: Archive,
  all: Library,
  podcast: MicSignal,
  video: Video,
  settings: Settings,
  search: Search,
  gallery: Image,
  board: LayoutGrid,
  writer: FileText,
  plus: Plus,
  refresh: RefreshCw,
  type: Type,
  link: Link2,
  image: Image,
  file: Paperclip,
  ref: Quote,
  minus: Minus,
  close: X,
  edit: Pencil,
  eyeOff: EyeOff,
  eye: Eye,
  bookmark: Bookmark,
  send: Send,
  tag: Tag,
  trash: Trash2,
  check: Check,
  external: ExternalLink,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  upload: Upload,
  book: BookOpen,
  github: BrandGithub,
  twitter: BrandTwitter,
  palette: Palette,
  music: Music,
  keyboard: Keyboard,
  undo: Undo2,
  info: Info,
  activity: Activity,
  maximize: Maximize,
  list: List,
  rows: Rows3,
  panelLeftClose: PanelLeftClose,
  panelLeftOpen: PanelLeftOpen,
  heart: Heart,
  sparkles: Sparkles,
  alignLeft: AlignStartVertical,
  alignRight: AlignEndVertical,
  alignTop: AlignStartHorizontal,
  alignBottom: AlignEndHorizontal,
  distributeH: AlignHorizontalSpaceAround,
  distributeV: AlignVerticalSpaceAround,
  star: Star,
  frame: Frame,
  folder: Folder,
  shuffle: Shuffle,
  arrowLeft: ArrowLeft
};
const registry = /* @__PURE__ */ new Map();
let activeMap = LUCIDE_ICON_MAP;
const listeners = /* @__PURE__ */ new Set();
const BUILTIN_META = [
  { id: "default", label: "Lucide 线性", preview: ["rss", "star", "settings", "trash", "search"], builtIn: true }
];
registry.set("default", { map: LUCIDE_ICON_MAP, meta: BUILTIN_META[0] });
function setIconTheme(id2) {
  const entry = registry.get(id2);
  if (!entry) return;
  activeMap = entry.map;
  listeners.forEach((fn) => fn());
}
function getIconThemeMap() {
  return activeMap;
}
function resolveIcon(name) {
  return activeMap[name] ?? LUCIDE_ICON_MAP[name] ?? LUCIDE_ICON_MAP["info"];
}
function onIconThemeChange(fn) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
const BUILTIN_BUNDLES = [
  {
    id: "default",
    label: "默认套装",
    iconTheme: "default",
    soundTheme: "crystal",
    description: "Lucide 线性图标 + Crystal 水晶音效",
    builtIn: true
  }
];
const bundleRegistry = /* @__PURE__ */ new Map();
for (const b of BUILTIN_BUNDLES) bundleRegistry.set(b.id, b);
function listThemeBundles() {
  return [...bundleRegistry.values()];
}
function applyThemeBundle(id2) {
  const bundle = bundleRegistry.get(id2);
  if (!bundle) return void 0;
  if (bundle.iconTheme) setIconTheme(bundle.iconTheme);
  if (bundle.soundTheme) setSoundTheme(bundle.soundTheme);
  return bundle;
}
const PAGE_SIZE$1 = 15;
const emptyCounts = { rss: 0, podcast: 0, video: 0, later: 0, favorite: 0, archived: 0, all: 0 };
const useStore = create$1((set, get) => ({
  screen: "library",
  view: "all",
  items: [],
  itemsPage: 0,
  itemsDone: false,
  itemsLoadingMore: false,
  counts: emptyCounts,
  sourceCounts: {},
  feeds: [],
  boards: [],
  quickAddOpen: false,
  cmdkOpen: false,
  activeBoardId: null,
  activeSourceType: null,
  activeFeed: null,
  cards: [],
  links: [],
  toast: "",
  zenMode: false,
  ghSyncing: false,
  ghSyncError: "",
  bookmarkTree: [],
  bookmarkLoading: false,
  activeBookmarkFolderId: null,
  activeBookmarkLink: null,
  bookmarkRandomLink: null,
  aiClassifying: false,
  appearance: DEFAULT_APPEARANCE,
  soundEnabled: false,
  soundVolume: 0.7,
  logo: "默认.png",
  themeBundleId: "default",
  developerMode: false,
  netLog: [],
  dbPath: "",
  settingsTab: "appearance",
  settingsOpen: false,
  shortcuts: { ...DEFAULT_SHORTCUTS },
  setScreen: (screen) => {
    set({ screen });
    if (screen === "board") void get().loadBoards();
    if (screen === "bookmarks") void get().loadBookmarkTree();
  },
  setView: (view) => {
    set({ view, selectedId: null, activeSourceType: null, activeFeed: null, screen: "library" });
    void get().load();
  },
  setSourceType: (t2) => {
    set({ activeSourceType: t2, view: "all", selectedId: null, activeFeed: null, screen: "library" });
    void get().load();
  },
  setSearch: (search) => {
    set({ search });
    void get().load();
  },
  setQuickAddOpen: (quickAddOpen) => set({ quickAddOpen }),
  setCmdkOpen: (cmdkOpen) => set({ cmdkOpen }),
  setActiveFeed: (name) => {
    const next = get().activeFeed === name ? null : name;
    set({ activeFeed: next, selectedId: null });
    void get().load();
  },
  showToast: (msg) => {
    set({ toast: msg });
    setTimeout(() => {
      if (get().toast === msg) set({ toast: "" });
    }, 1800);
  },
  toggleZenMode: () => set((s) => ({ zenMode: !s.zenMode })),
  exitZenMode: () => set({ zenMode: false }),
  load: async () => {
    const { view, search, activeSourceType, activeFeed } = get();
    try {
      const [counts, sourceCounts, page0] = await Promise.all([
        window.capybara.invoke("items:counts"),
        window.capybara.invoke("items:sourceCounts"),
        window.capybara.invoke("items:listPage", view, search, activeSourceType, activeFeed, 0, PAGE_SIZE$1)
      ]);
      set({ items: page0, itemsPage: 0, itemsDone: page0.length < PAGE_SIZE$1, itemsLoadingMore: false, counts, sourceCounts });
    } catch (e) {
      const msg = e.message || String(e);
      console.error("[load] 失败:", msg, { view, activeSourceType, activeFeed });
      get().showToast("加载失败：" + msg);
    }
  },
  loadMoreItems: async () => {
    const { itemsDone, itemsLoadingMore, itemsPage, view, search, activeSourceType, activeFeed } = get();
    if (itemsDone || itemsLoadingMore) return;
    set({ itemsLoadingMore: true });
    try {
      const more = await window.capybara.invoke("items:listPage", view, search, activeSourceType, activeFeed, itemsPage + 1, PAGE_SIZE$1);
      if (more.length < PAGE_SIZE$1) set({ itemsDone: true });
      if (more.length > 0) {
        const existing = new Set(get().items.map((i) => i.id));
        const merged = get().items.concat(more.filter((i) => !existing.has(i.id)));
        set({ items: merged, itemsPage: get().itemsPage + 1 });
      }
    } finally {
      set({ itemsLoadingMore: false });
    }
  },
  loadFeeds: async () => {
    set({ feeds: await window.capybara.invoke("feeds:list") });
  },
  loadBoards: async () => {
    set({ boards: await window.capybara.invoke("boards:list") });
  },
  // 点击条目仅选中、打开阅读面板，不再自动标记已读（已读需手动点「已读」图标或「标为已读」）
  select: (id2) => {
    set({ selectedId: id2 });
  },
  moveSelection: (delta) => {
    const { items, selectedId } = get();
    if (!items.length) return;
    const idx = items.findIndex((i) => i.id === selectedId);
    const next = idx === -1 ? 0 : Math.min(items.length - 1, Math.max(0, idx + delta));
    get().select(items[next].id);
  },
  setStatus: async (id2, status) => {
    const item = get().items.find((i) => i.id === id2);
    const canceling = item != null && item.status === status && status !== "inbox";
    const effective = canceling ? "inbox" : status;
    const label = canceling ? { favorite: "已取消收藏", later: "已取消稍后读", archived: "已取消归档" }[status] : { favorite: "已收藏", later: "已稍后读", archived: "已归档", inbox: "已退回收集箱" }[status];
    try {
      const counts = await window.capybara.invoke("items:updateStatus", id2, effective);
      set({ counts });
      const { items } = get();
      const next = items.filter((i) => i.id !== id2);
      const removedIdx = items.findIndex((i) => i.id === id2);
      const nextSel = next[Math.min(removedIdx, next.length - 1)];
      set({ items: get().view === "all" ? items : next, selectedId: nextSel?.id ?? null });
      if (label) {
        get().showToast(label);
        playSound("mark");
      }
    } catch (e) {
      get().showToast("操作失败：" + e.message);
    }
  },
  quickAdd: async (url) => {
    await window.capybara.invoke("items:quickAdd", url);
    set({ quickAddOpen: false });
    await get().load();
  },
  refreshAll: async () => {
    await window.capybara.invoke("sources:refreshAll");
    await Promise.all([get().load(), get().loadFeeds()]);
    const bad = get().feeds.find((f2) => f2.error_count > 0);
    if (bad) get().showToast("无法获取数据：" + (bad.last_error || "未知错误"));
  },
  addFeed: async (type, name, url, scheduleMin, kind) => {
    const existed = get().feeds.some((f2) => f2.url === url);
    try {
      const feed = await window.capybara.invoke("feeds:add", type, name, url, scheduleMin, kind ?? "article");
      await get().loadFeeds();
      if (existed) {
        get().showToast("该 RSS 源已存在，已跳过");
        return;
      }
      if (feed?.id) await get().refreshFeed(feed.id);
      else get().showToast("添加失败：地址可能无效");
    } catch (e) {
      get().showToast("添加失败：" + e.message);
    }
  },
  addManyFeeds: async (list) => {
    const n2 = await window.capybara.invoke("feeds:addMany", list);
    await get().loadFeeds();
    if (n2 > 0) await get().refreshAll();
    return n2;
  },
  deleteFeed: async (id2) => {
    await window.capybara.invoke("feeds:delete", id2);
    await get().loadFeeds();
  },
  refreshFeed: async (id2) => {
    const n2 = await window.capybara.invoke("feeds:refresh", id2);
    if (n2 < 0) {
      const bad = get().feeds.find((f2) => f2.id === id2);
      get().showToast("无法获取数据：" + (bad?.last_error || "未知错误"));
    }
    await Promise.all([get().load(), get().loadFeeds()]);
  },
  markAllRead: async (view) => {
    const counts = await window.capybara.invoke("items:markAllRead", view);
    set({ counts });
    playSound("complete");
    await get().load();
  },
  clearInbox: async () => {
    const counts = await window.capybara.invoke("items:clearInbox");
    set({ counts });
    playSound("complete");
    await get().load();
  },
  openInBrowser: (url, origin) => {
    if (url) {
      void window.capybara.invoke("shell:openExternal", url);
      playSound("open");
    }
  },
  deleteItem: async (id2) => {
    playSound("delete");
    await window.capybara.invoke("items:delete", id2);
    set({ items: get().items.filter((i) => i.id !== id2), selectedId: get().selectedId === id2 ? null : get().selectedId });
    await get().load();
  },
  toggleRead: async (id2) => {
    const it = get().items.find((i) => i.id === id2);
    const next = !it?.is_read;
    await window.capybara.invoke("items:setRead", id2, next);
    set({ items: get().items.map((i) => i.id === id2 ? { ...i, is_read: next ? 1 : 0 } : i) });
    if (get().view === "rss" && next) void get().load();
  },
  openBoard: async (id2) => {
    const [cards, links] = await Promise.all([
      window.capybara.invoke("boards:cards", id2),
      window.capybara.invoke("boards:links", id2)
    ]);
    set({ activeBoardId: id2, cards, links, screen: "board" });
  },
  createBoard: async () => {
    const b = await window.capybara.invoke("boards:create", "未命名白板");
    set({ activeBoardId: b.id, cards: [], screen: "board" });
    await get().loadBoards();
  },
  addRefCard: (itemId, x2, y2) => {
    const it = get().items.find((i) => i.id === itemId);
    const pos = x2 != null && y2 != null ? { x: x2, y: y2 } : get().autoPos();
    void get().addCard({
      kind: "ref",
      item_id: itemId,
      x: pos.x,
      y: pos.y,
      w: 240,
      h: 140,
      title: it?.title ?? "",
      body: it?.summary ?? ""
    });
  },
  addCard: async (partial) => {
    const id2 = get().activeBoardId;
    if (id2 == null) {
      get().showToast("请先打开一个白板");
      throw new Error("no active board");
    }
    const card = await window.capybara.invoke("boards:addCard", {
      board_id: id2,
      kind: partial.kind ?? "text",
      item_id: partial.item_id ?? null,
      x: partial.x ?? 80,
      y: partial.y ?? 80,
      w: partial.w ?? 240,
      h: partial.h ?? 140,
      title: partial.title ?? "",
      body: partial.body ?? "",
      payload: partial.payload ?? "{}",
      _sourcePath: partial._sourcePath
    });
    set({ cards: [...get().cards, card] });
    playSound("lift");
    return card;
  },
  updateCard: async (cid, patch) => {
    const card = await window.capybara.invoke("boards:updateCard", cid, {
      title: patch.title,
      body: patch.body,
      payload: patch.payload,
      w: patch.w,
      h: patch.h,
      kind: patch.kind,
      item_id: patch.item_id
    }, patch._sourcePath);
    set({ cards: get().cards.map((c) => c.id === cid ? card : c) });
  },
  moveCard: async (cid, x2, y2) => {
    await window.capybara.invoke("boards:moveCard", cid, x2, y2);
    set({ cards: get().cards.map((c) => c.id === cid ? { ...c, x: x2, y: y2 } : c) });
  },
  deleteCard: async (cid) => {
    await window.capybara.invoke("boards:deleteCard", cid);
    set({ cards: get().cards.filter((c) => c.id !== cid), links: get().links.filter((l2) => l2.from_id !== cid && l2.to_id !== cid) });
  },
  loadLinks: async (boardId) => {
    set({ links: await window.capybara.invoke("boards:links", boardId) });
  },
  addLink: async (fromId, toId) => {
    const id2 = get().activeBoardId;
    if (id2 == null) return;
    const link = await window.capybara.invoke("boards:addLink", id2, fromId, toId);
    if (link) set({ links: [...get().links, link] });
    else get().showToast("已存在该连线");
  },
  deleteLink: async (lid) => {
    await window.capybara.invoke("boards:deleteLink", lid);
    set({ links: get().links.filter((l2) => l2.id !== lid) });
  },
  updateLink: async (lid, label) => {
    await window.capybara.invoke("boards:updateLink", lid, label);
    set({ links: get().links.map((l2) => l2.id === lid ? { ...l2, label } : l2) });
  },
  autoPos: () => {
    const cards = get().cards;
    const W2 = 240, H2 = 140, gap = 24, ox = 40, oy = 40, cols = 4;
    for (let row = 0; row < 60; row++) {
      for (let col = 0; col < cols; col++) {
        const x2 = ox + col * (W2 + gap), y2 = oy + row * (H2 + gap);
        const hit = cards.some((c) => c.x < x2 + W2 && x2 < c.x + W2 && c.y < y2 + H2 && y2 < c.y + H2);
        if (!hit) return { x: x2, y: y2 };
      }
    }
    return { x: ox, y: oy };
  },
  renameBoard: async (id2, name) => {
    try {
      await window.capybara.invoke("boards:rename", id2, name);
      set({ boards: get().boards.map((b) => b.id === id2 ? { ...b, name } : b) });
    } catch (err) {
      get().showToast("重命名失败：" + (err instanceof Error ? err.message : String(err)));
    }
  },
  deleteBoard: async (id2) => {
    await window.capybara.invoke("boards:delete", id2);
    const boards = get().boards.filter((b) => b.id !== id2);
    const wasActive = get().activeBoardId === id2;
    set({
      boards,
      activeBoardId: wasActive ? null : get().activeBoardId,
      screen: wasActive ? "library" : get().screen,
      cards: wasActive ? [] : get().cards,
      links: wasActive ? [] : get().links
    });
  },
  fetchGithubStars: async (username) => {
    set({ ghSyncing: true, ghSyncError: "" });
    try {
      const r2 = await window.capybara.invoke("github:fetchStars", username);
      await get().load();
      if (r2.added > 0) {
        set({ toast: `GitHub Star 已同步，新增 ${r2.added} 条` });
        setTimeout(() => {
          if (get().toast === `GitHub Star 已同步，新增 ${r2.added} 条`) set({ toast: "" });
        }, 3e3);
      } else {
        set({ toast: "GitHub Star 已是最新" });
        setTimeout(() => {
          if (get().toast === "GitHub Star 已是最新") set({ toast: "" });
        }, 2e3);
      }
      return r2;
    } catch (e) {
      const msg = e.message || "GitHub Star 同步失败";
      set({ ghSyncError: msg });
      throw e;
    } finally {
      set({ ghSyncing: false });
    }
  },
  retryGithubStars: async () => {
    const username = await window.capybara.invoke("settings:get", "github_stars_user");
    if (!username?.trim()) {
      get().showToast("未配置 GitHub 用户名，请先在设置中填写");
      return;
    }
    try {
      await get().fetchGithubStars(username.trim());
    } catch (e) {
      get().showToast("同步失败：" + (e.message || "未知错误"));
    }
  },
  importTwitterBookmarks: async () => {
    const r2 = await window.capybara.invoke("twitter:importBookmarks");
    await get().load();
    return r2;
  },
  initAppearance: async () => {
    const boot = await window.capybara.invoke("app:bootstrap");
    const a = boot.appearance;
    applyAppearance(a);
    setSoundEnabled(boot.soundEnabled);
    setSoundVolume(boot.soundVolume);
    set({ appearance: a, soundEnabled: boot.soundEnabled, soundVolume: boot.soundVolume, shortcuts: parseShortcuts(boot.shortcuts), developerMode: boot.developerMode, logo: boot.logo || "默认.png" });
    const bundleId = boot.themeBundle || "default";
    applyThemeBundle(bundleId);
    set({ themeBundleId: bundleId });
    void window.capybara.invoke("settings:getDbPath").then((p2) => {
      if (typeof p2 === "string") set({ dbPath: p2 });
    });
    watchSystemTheme(() => {
      if (get().appearance.theme === "system") applyAppearance(get().appearance);
    });
    window.capybara.onNetLog((entry) => {
      if (!get().developerMode) return;
      const next = get().netLog.concat(entry);
      if (next.length > 300) next.splice(0, next.length - 300);
      set({ netLog: next });
    });
  },
  setDeveloperMode: (v2) => {
    void window.capybara.invoke("settings:set", "developer_mode", v2 ? "1" : "0");
    void window.capybara.invoke("devtools:toggle");
    set({ developerMode: v2 });
  },
  setDbPath: async (pathVal) => {
    const r2 = await window.capybara.invoke("settings:setDbPath", pathVal);
    if (r2.ok) set({ dbPath: pathVal });
    return r2;
  },
  updateAppearance: (patch) => {
    const next = { ...get().appearance, ...patch };
    persistAppearance(patch);
    applyAppearance(next);
    set({ appearance: next });
    playSound("style");
  },
  setSoundEnabled: (enabled2) => {
    setSoundEnabled(enabled2);
    void window.capybara.invoke("settings:set", "sound_enabled", enabled2 ? "1" : "0");
    set({ soundEnabled: enabled2 });
    if (enabled2) playSound("toggle");
  },
  setSoundVolume: (v2) => {
    setSoundVolume(v2);
    void window.capybara.invoke("settings:set", "sound_volume", String(v2));
    set({ soundVolume: v2 });
  },
  setThemeBundle: (id2) => {
    const bundle = applyThemeBundle(id2);
    if (!bundle) return;
    void window.capybara.invoke("settings:set", "theme_bundle", id2);
    set({ themeBundleId: id2 });
    playSound("style");
  },
  setLogo: (id2) => {
    void window.capybara.invoke("app:setLogo", id2);
    set({ logo: id2 });
    playSound("style");
  },
  setSettingsTab: (t2) => set({ settingsTab: t2 }),
  openSettings: (tab) => {
    if (tab) set({ settingsTab: tab });
    set({ settingsOpen: true });
  },
  closeSettings: () => set({ settingsOpen: false }),
  setShortcuts: (next) => {
    void window.capybara.invoke("settings:set", "shortcuts", JSON.stringify(next));
    set({ shortcuts: next });
  },
  resetShortcuts: () => {
    void window.capybara.invoke("settings:set", "shortcuts", JSON.stringify(DEFAULT_SHORTCUTS));
    set({ shortcuts: { ...DEFAULT_SHORTCUTS } });
  },
  purge: async (keepDays, maxItems) => {
    const r2 = await window.capybara.invoke("settings:purge", keepDays, maxItems);
    playSound("complete");
    get().showToast(`已清理 ${r2.purged} 条归档内容`);
    await get().load();
  },
  // ===== 浏览器收藏夹 =====
  loadBookmarkTree: async () => {
    set({ bookmarkLoading: true });
    try {
      const tree = await window.capybara.invoke("bookmarks:tree");
      set({ bookmarkTree: tree });
    } finally {
      set({ bookmarkLoading: false });
    }
  },
  setBookmarkFolder: (folderId) => {
    set({ activeBookmarkFolderId: folderId, activeBookmarkLink: null, bookmarkRandomLink: null });
  },
  selectBookmarkLink: (link) => {
    set({ activeBookmarkLink: link, bookmarkRandomLink: null });
  },
  importBookmarks: async () => {
    try {
      const r2 = await window.capybara.invoke("bookmarks:import");
      await get().loadBookmarkTree();
      if (r2.total === 0) {
        get().showToast("未解析到任何书签，请检查文件格式是否为浏览器导出的 HTML");
      } else {
        set({ activeBookmarkFolderId: 1, activeBookmarkLink: null, bookmarkRandomLink: null });
        get().showToast(`已导入 ${r2.added} 个书签（共 ${r2.total} 个，${r2.folders} 个文件夹）`);
      }
      return r2;
    } catch (e) {
      get().showToast("导入失败：" + e.message);
      throw e;
    }
  },
  createBookmarkFolder: async (parentId, title) => {
    await window.capybara.invoke("bookmarks:createFolder", parentId, title);
    await get().loadBookmarkTree();
  },
  renameBookmarkFolder: async (id2, title) => {
    await window.capybara.invoke("bookmarks:renameFolder", id2, title);
    await get().loadBookmarkTree();
  },
  deleteBookmarkFolder: async (id2) => {
    await window.capybara.invoke("bookmarks:deleteFolder", id2);
    await get().loadBookmarkTree();
    get().showToast("已删除文件夹");
  },
  deleteBookmarkLink: async (id2) => {
    await window.capybara.invoke("bookmarks:deleteLink", id2);
    await get().loadBookmarkTree();
    if (get().activeBookmarkLink?.id === id2) set({ activeBookmarkLink: null });
    get().showToast("已删除书签");
  },
  bookmarkRandomWalk: async () => {
    const tree = get().bookmarkTree;
    if (!tree.length) return;
    const allLinks = [];
    const collect = (nodes) => {
      for (const node of nodes) {
        allLinks.push(...node.links);
        collect(node.children);
      }
    };
    collect(tree);
    if (allLinks.length === 0) {
      get().showToast("暂无书签");
      return;
    }
    const random = allLinks[Math.floor(Math.random() * allLinks.length)];
    set({ bookmarkRandomLink: random, activeBookmarkLink: random });
    get().showToast(`🎲 ${random.title.slice(0, 20)}`);
  },
  aiClassifyBookmarks: async () => {
    set({ aiClassifying: true });
    try {
      const r2 = await window.capybara.invoke("bookmarks:aiClassify");
      if (r2.ok) {
        get().showToast(`AI 已归类 ${r2.classified} 个书签`);
        await get().loadBookmarkTree();
      } else {
        get().showToast(`归类失败：${r2.error}`);
      }
      return r2;
    } finally {
      set({ aiClassifying: false });
    }
  }
}));
function Icon({ name, size: size2 = 16, strokeWidth = 1.75, className, style, ...rest }) {
  reactExports.useSyncExternalStore(onIconThemeChange, getIconThemeMap, getIconThemeMap);
  const C2 = resolveIcon(name);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(C2, { size: size2, strokeWidth, className, style, ...rest });
}
const DRAG_THRESHOLD = 5;
function press(handler) {
  let startX = 0;
  let startY = 0;
  let active = false;
  return {
    onPointerDown: (e) => {
      if (e.button !== 0) return;
      startX = e.clientX;
      startY = e.clientY;
      active = true;
    },
    onPointerUp: (e) => {
      if (!active || e.button !== 0) return;
      active = false;
      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);
      if (dx <= DRAG_THRESHOLD && dy <= DRAG_THRESHOLD) {
        e.preventDefault();
        handler(e);
      }
    },
    // 键盘兜底：Enter / Space 触发（不影响 Tab 聚焦）
    onClick: (e) => {
      if (e.detail === 0) handler(e);
    }
  };
}
function pressBtn(handler) {
  return {
    onPointerDown: (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      handler(e);
    }
  };
}
const NAV = [
  { key: "rss", label: "RSS", icon: "rss" },
  { key: "podcast", label: "播客", icon: "podcast" },
  { key: "video", label: "视频", icon: "video" },
  { key: "later", label: "稍后读", icon: "later" },
  { key: "favorite", label: "已收藏", icon: "favorite" },
  { key: "all", label: "全部条目", icon: "all" }
];
const COLLECT = [
  { key: "rss", label: "RSS", icon: "rss" },
  { key: "podcast", label: "播客", icon: "podcast" },
  { key: "video", label: "视频", icon: "video" },
  { key: "later", label: "稍后阅读", icon: "later" },
  { key: "favorite", label: "收藏", icon: "favorite" }
];
function Section({ id: id2, title, collapsedSec, onToggle, action, children }) {
  const open = !collapsedSec[id2];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sec", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sec-head", ...press(() => onToggle(id2)), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: open ? "chevronDown" : "chevronRight", size: 13 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sec-title", children: title }),
      action
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-body", children })
  ] });
}
function Sidebar({ collapsed = false, style, dragging = false }) {
  const { screen, setScreen, setView, view, activeSourceType, setSourceType, counts, sourceCounts, boards, createBoard, openSettings, settingsOpen, ghSyncing, ghSyncError, retryGithubStars } = useStore();
  const [editingBoard, setEditingBoard] = reactExports.useState(null);
  const [boardName, setBoardName] = reactExports.useState("");
  const renameInputRef = reactExports.useRef(null);
  const [collapsedSec, setCollapsedSec] = reactExports.useState({});
  reactExports.useEffect(() => {
    if (editingBoard != null && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [editingBoard]);
  reactExports.useEffect(() => {
    void window.capybara.invoke("settings:get", "sidebar_collapsed").then((r2) => {
      if (r2) {
        try {
          setCollapsedSec(JSON.parse(r2));
        } catch {
        }
      }
    });
  }, []);
  const toggleSec = (id2) => {
    const next = { ...collapsedSec, [id2]: !collapsedSec[id2] };
    setCollapsedSec(next);
    void window.capybara.invoke("settings:set", "sidebar_collapsed", JSON.stringify(next));
  };
  const commitRename = (id2) => {
    void useStore.getState().renameBoard(id2, boardName.trim() || "未命名白板");
    setEditingBoard(null);
  };
  const removeBoard = async (id2) => {
    await useStore.getState().deleteBoard(id2);
    useStore.getState().showToast("已删除白板");
  };
  if (collapsed) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: `sidebar collapsed ${dragging ? "dragging" : ""}`, style, title: "展开侧栏请向右拖动分隔条", children: [
      NAV.map((n2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: `rail-btn ${screen === "library" && view === n2.key && !activeSourceType ? "active" : ""}`,
          title: `${n2.label}（${counts[n2.key] || 0}）`,
          ...pressBtn(() => setView(n2.key)),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rail-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: n2.icon, size: 19 }) })
        },
        n2.key
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `rail-btn ${activeSourceType === "github" ? "active" : ""}`, title: `GitHub ★（${sourceCounts["github"] || 0}）${ghSyncing ? " · 同步中…" : ghSyncError ? ` · 同步失败：${ghSyncError}` : ""}`, ...pressBtn(() => ghSyncError ? retryGithubStars() : setSourceType("github")), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rail-icon", children: ghSyncing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "refresh", size: 19, className: "spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "github", size: 19 }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `rail-btn ${activeSourceType === "x_bookmark" ? "active" : ""}`, title: `Twitter 书签（${sourceCounts["x_bookmark"] || 0}）`, ...pressBtn(() => setSourceType("x_bookmark")), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rail-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "twitter", size: 19 }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `rail-btn ${screen === "bookmarks" ? "active" : ""}`, title: "浏览器收藏夹", ...pressBtn(() => setScreen("bookmarks")), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rail-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "bookmark", size: 19 }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rail-sep" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `rail-btn ${screen === "board" ? "active" : ""}`, title: "白板", ...pressBtn(() => setScreen("board")), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rail-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "board", size: 19 }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "rail-btn", title: "新建白板", ...pressBtn(() => void createBoard()), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rail-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "plus", size: 19 }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rail-sep" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `rail-btn ${settingsOpen ? "active" : ""}`, title: "系统配置", ...pressBtn(() => openSettings()), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rail-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "settings", size: 19 }) }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: `sidebar ${dragging ? "dragging" : ""}`, style, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "nav-group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `nav-group-title ${screen === "library" && view === "all" && !activeSourceType ? "active" : ""}`,
          role: "button",
          tabIndex: 0,
          ...press(() => setView("all")),
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setView("all");
            }
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "side-ico", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "all", size: 16 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "全部" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "count", children: counts["all"] || "" })
          ]
        }
      ),
      COLLECT.map((n2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          role: "button",
          tabIndex: 0,
          className: `side-item ${screen === "library" && view === n2.key && !activeSourceType ? "active" : ""}`,
          ...press(() => setView(n2.key)),
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setView(n2.key);
            }
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "side-ico", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: n2.icon, size: 16 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: n2.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "count", children: counts[n2.key] || "" })
          ]
        },
        n2.key
      ))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nav-sep" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `side-item ${activeSourceType === "github" ? "active" : ""}`,
        role: "button",
        tabIndex: 0,
        ...press(() => setSourceType("github")),
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setSourceType("github");
          }
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "side-ico", children: ghSyncing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "refresh", size: 16, className: "spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "github", size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "GitHub ★" }),
          ghSyncing ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gh-sync-status", children: "同步中…" }) : ghSyncError ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gh-sync-retry", title: `同步失败：${ghSyncError}，点击重试`, onClick: (e) => {
            e.stopPropagation();
            void retryGithubStars();
          }, children: "失败·重试" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "count", children: sourceCounts["github"] || "" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nav-sep" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `side-item ${activeSourceType === "x_bookmark" ? "active" : ""}`,
        role: "button",
        tabIndex: 0,
        ...press(() => setSourceType("x_bookmark")),
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setSourceType("x_bookmark");
          }
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "side-ico", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "twitter", size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "书签" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "count", children: sourceCounts["x_bookmark"] || "" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nav-sep" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `side-item ${screen === "bookmarks" ? "active" : ""}`,
        role: "button",
        tabIndex: 0,
        ...press(() => setScreen("bookmarks")),
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setScreen("bookmarks");
          }
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "side-ico", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "bookmark", size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "收藏夹" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nav-sep" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Section,
      {
        id: "board",
        title: "白板",
        collapsedSec,
        onToggle: toggleSec,
        action: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sec-add", title: "新建白板", onClick: (e) => {
          e.stopPropagation();
          void createBoard();
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "plus", size: 13 }) }),
        children: [
          boards.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "side-item disabled", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "暂无白板" }) }),
          boards.map((b) => {
            const isActive = screen === "board" && useStore.getState().activeBoardId === b.id;
            const isEditing = editingBoard === b.id;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `side-item ${isActive ? "active" : ""}`,
                onClick: () => {
                  if (!isEditing) void useStore.getState().openBoard(b.id);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "side-ico", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "board", size: 16 }) }),
                  isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      ref: renameInputRef,
                      className: "side-rename",
                      value: boardName,
                      onClick: (e) => e.stopPropagation(),
                      onChange: (e) => setBoardName(e.target.value),
                      onBlur: () => commitRename(b.id),
                      onKeyDown: (e) => {
                        if (e.key === "Enter") commitRename(b.id);
                        if (e.key === "Escape") setEditingBoard(null);
                      }
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "side-label", children: (b.name || "未命名白板").slice(0, 14) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "side-actions", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "side-act", title: "重命名", onClick: (e) => {
                      e.stopPropagation();
                      setEditingBoard(b.id);
                      setBoardName(b.name || "未命名白板");
                    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "edit", size: 13 }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "side-act danger", title: "删除白板", onClick: (e) => {
                      e.stopPropagation();
                      void removeBoard(b.id);
                    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "trash", size: 13 }) })
                  ] })
                ]
              },
              b.id
            );
          })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `side-item sys-item ${settingsOpen ? "active" : ""}`,
        role: "button",
        tabIndex: 0,
        ...press(() => openSettings()),
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openSettings();
          }
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "side-ico", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "settings", size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "系统设置" })
        ]
      }
    )
  ] });
}
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n2) {
    for (var e = 1; e < arguments.length; e++) {
      var t2 = arguments[e];
      for (var r2 in t2) ({}).hasOwnProperty.call(t2, r2) && (n2[r2] = t2[r2]);
    }
    return n2;
  }, _extends.apply(null, arguments);
}
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function _setPrototypeOf(t2, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t3, e2) {
    return t3.__proto__ = e2, t3;
  }, _setPrototypeOf(t2, e);
}
function _inheritsLoose(t2, o) {
  t2.prototype = Object.create(o.prototype), t2.prototype.constructor = t2, _setPrototypeOf(t2, o);
}
var safeIsNaN = Number.isNaN || function ponyfill(value) {
  return typeof value === "number" && value !== value;
};
function isEqual(first, second) {
  if (first === second) {
    return true;
  }
  if (safeIsNaN(first) && safeIsNaN(second)) {
    return true;
  }
  return false;
}
function areInputsEqual(newInputs, lastInputs) {
  if (newInputs.length !== lastInputs.length) {
    return false;
  }
  for (var i = 0; i < newInputs.length; i++) {
    if (!isEqual(newInputs[i], lastInputs[i])) {
      return false;
    }
  }
  return true;
}
function memoizeOne(resultFn, isEqual2) {
  if (isEqual2 === void 0) {
    isEqual2 = areInputsEqual;
  }
  var lastThis;
  var lastArgs = [];
  var lastResult;
  var calledOnce = false;
  function memoized() {
    var newArgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      newArgs[_i] = arguments[_i];
    }
    if (calledOnce && lastThis === this && isEqual2(newArgs, lastArgs)) {
      return lastResult;
    }
    lastResult = resultFn.apply(this, newArgs);
    calledOnce = true;
    lastThis = this;
    lastArgs = newArgs;
    return lastResult;
  }
  return memoized;
}
var hasNativePerformanceNow = typeof performance === "object" && typeof performance.now === "function";
var now = hasNativePerformanceNow ? function() {
  return performance.now();
} : function() {
  return Date.now();
};
function cancelTimeout(timeoutID) {
  cancelAnimationFrame(timeoutID.id);
}
function requestTimeout(callback, delay) {
  var start = now();
  function tick() {
    if (now() - start >= delay) {
      callback.call(null);
    } else {
      timeoutID.id = requestAnimationFrame(tick);
    }
  }
  var timeoutID = {
    id: requestAnimationFrame(tick)
  };
  return timeoutID;
}
var size = -1;
function getScrollbarSize(recalculate) {
  if (recalculate === void 0) {
    recalculate = false;
  }
  if (size === -1 || recalculate) {
    var div = document.createElement("div");
    var style = div.style;
    style.width = "50px";
    style.height = "50px";
    style.overflow = "scroll";
    document.body.appendChild(div);
    size = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);
  }
  return size;
}
var cachedRTLResult = null;
function getRTLOffsetType(recalculate) {
  if (recalculate === void 0) {
    recalculate = false;
  }
  if (cachedRTLResult === null || recalculate) {
    var outerDiv = document.createElement("div");
    var outerStyle = outerDiv.style;
    outerStyle.width = "50px";
    outerStyle.height = "50px";
    outerStyle.overflow = "scroll";
    outerStyle.direction = "rtl";
    var innerDiv = document.createElement("div");
    var innerStyle = innerDiv.style;
    innerStyle.width = "100px";
    innerStyle.height = "100px";
    outerDiv.appendChild(innerDiv);
    document.body.appendChild(outerDiv);
    if (outerDiv.scrollLeft > 0) {
      cachedRTLResult = "positive-descending";
    } else {
      outerDiv.scrollLeft = 1;
      if (outerDiv.scrollLeft === 0) {
        cachedRTLResult = "negative";
      } else {
        cachedRTLResult = "positive-ascending";
      }
    }
    document.body.removeChild(outerDiv);
    return cachedRTLResult;
  }
  return cachedRTLResult;
}
var IS_SCROLLING_DEBOUNCE_INTERVAL$1 = 150;
var defaultItemKey$1 = function defaultItemKey3(index, data) {
  return index;
};
function createListComponent(_ref2) {
  var _class;
  var getItemOffset3 = _ref2.getItemOffset, getEstimatedTotalSize4 = _ref2.getEstimatedTotalSize, getItemSize3 = _ref2.getItemSize, getOffsetForIndexAndAlignment5 = _ref2.getOffsetForIndexAndAlignment, getStartIndexForOffset3 = _ref2.getStartIndexForOffset, getStopIndexForStartIndex3 = _ref2.getStopIndexForStartIndex, initInstanceProps5 = _ref2.initInstanceProps, shouldResetStyleCacheOnItemSizeChange = _ref2.shouldResetStyleCacheOnItemSizeChange, validateProps5 = _ref2.validateProps;
  return _class = /* @__PURE__ */ function(_PureComponent) {
    _inheritsLoose(List2, _PureComponent);
    function List2(props) {
      var _this;
      _this = _PureComponent.call(this, props) || this;
      _this._instanceProps = initInstanceProps5(_this.props, _assertThisInitialized(_this));
      _this._outerRef = void 0;
      _this._resetIsScrollingTimeoutId = null;
      _this.state = {
        instance: _assertThisInitialized(_this),
        isScrolling: false,
        scrollDirection: "forward",
        scrollOffset: typeof _this.props.initialScrollOffset === "number" ? _this.props.initialScrollOffset : 0,
        scrollUpdateWasRequested: false
      };
      _this._callOnItemsRendered = void 0;
      _this._callOnItemsRendered = memoizeOne(function(overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex) {
        return _this.props.onItemsRendered({
          overscanStartIndex,
          overscanStopIndex,
          visibleStartIndex,
          visibleStopIndex
        });
      });
      _this._callOnScroll = void 0;
      _this._callOnScroll = memoizeOne(function(scrollDirection, scrollOffset, scrollUpdateWasRequested) {
        return _this.props.onScroll({
          scrollDirection,
          scrollOffset,
          scrollUpdateWasRequested
        });
      });
      _this._getItemStyle = void 0;
      _this._getItemStyle = function(index) {
        var _this$props = _this.props, direction = _this$props.direction, itemSize = _this$props.itemSize, layout = _this$props.layout;
        var itemStyleCache = _this._getItemStyleCache(shouldResetStyleCacheOnItemSizeChange && itemSize, shouldResetStyleCacheOnItemSizeChange && layout, shouldResetStyleCacheOnItemSizeChange && direction);
        var style;
        if (itemStyleCache.hasOwnProperty(index)) {
          style = itemStyleCache[index];
        } else {
          var _offset = getItemOffset3(_this.props, index, _this._instanceProps);
          var size2 = getItemSize3(_this.props, index, _this._instanceProps);
          var isHorizontal = direction === "horizontal" || layout === "horizontal";
          var isRtl = direction === "rtl";
          var offsetHorizontal = isHorizontal ? _offset : 0;
          itemStyleCache[index] = style = {
            position: "absolute",
            left: isRtl ? void 0 : offsetHorizontal,
            right: isRtl ? offsetHorizontal : void 0,
            top: !isHorizontal ? _offset : 0,
            height: !isHorizontal ? size2 : "100%",
            width: isHorizontal ? size2 : "100%"
          };
        }
        return style;
      };
      _this._getItemStyleCache = void 0;
      _this._getItemStyleCache = memoizeOne(function(_, __, ___) {
        return {};
      });
      _this._onScrollHorizontal = function(event) {
        var _event$currentTarget = event.currentTarget, clientWidth = _event$currentTarget.clientWidth, scrollLeft = _event$currentTarget.scrollLeft, scrollWidth = _event$currentTarget.scrollWidth;
        _this.setState(function(prevState) {
          if (prevState.scrollOffset === scrollLeft) {
            return null;
          }
          var direction = _this.props.direction;
          var scrollOffset = scrollLeft;
          if (direction === "rtl") {
            switch (getRTLOffsetType()) {
              case "negative":
                scrollOffset = -scrollLeft;
                break;
              case "positive-descending":
                scrollOffset = scrollWidth - clientWidth - scrollLeft;
                break;
            }
          }
          scrollOffset = Math.max(0, Math.min(scrollOffset, scrollWidth - clientWidth));
          return {
            isScrolling: true,
            scrollDirection: prevState.scrollOffset < scrollOffset ? "forward" : "backward",
            scrollOffset,
            scrollUpdateWasRequested: false
          };
        }, _this._resetIsScrollingDebounced);
      };
      _this._onScrollVertical = function(event) {
        var _event$currentTarget2 = event.currentTarget, clientHeight = _event$currentTarget2.clientHeight, scrollHeight = _event$currentTarget2.scrollHeight, scrollTop = _event$currentTarget2.scrollTop;
        _this.setState(function(prevState) {
          if (prevState.scrollOffset === scrollTop) {
            return null;
          }
          var scrollOffset = Math.max(0, Math.min(scrollTop, scrollHeight - clientHeight));
          return {
            isScrolling: true,
            scrollDirection: prevState.scrollOffset < scrollOffset ? "forward" : "backward",
            scrollOffset,
            scrollUpdateWasRequested: false
          };
        }, _this._resetIsScrollingDebounced);
      };
      _this._outerRefSetter = function(ref) {
        var outerRef = _this.props.outerRef;
        _this._outerRef = ref;
        if (typeof outerRef === "function") {
          outerRef(ref);
        } else if (outerRef != null && typeof outerRef === "object" && outerRef.hasOwnProperty("current")) {
          outerRef.current = ref;
        }
      };
      _this._resetIsScrollingDebounced = function() {
        if (_this._resetIsScrollingTimeoutId !== null) {
          cancelTimeout(_this._resetIsScrollingTimeoutId);
        }
        _this._resetIsScrollingTimeoutId = requestTimeout(_this._resetIsScrolling, IS_SCROLLING_DEBOUNCE_INTERVAL$1);
      };
      _this._resetIsScrolling = function() {
        _this._resetIsScrollingTimeoutId = null;
        _this.setState({
          isScrolling: false
        }, function() {
          _this._getItemStyleCache(-1, null);
        });
      };
      return _this;
    }
    List2.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
      validateSharedProps$1(nextProps, prevState);
      validateProps5(nextProps);
      return null;
    };
    var _proto = List2.prototype;
    _proto.scrollTo = function scrollTo(scrollOffset) {
      scrollOffset = Math.max(0, scrollOffset);
      this.setState(function(prevState) {
        if (prevState.scrollOffset === scrollOffset) {
          return null;
        }
        return {
          scrollDirection: prevState.scrollOffset < scrollOffset ? "forward" : "backward",
          scrollOffset,
          scrollUpdateWasRequested: true
        };
      }, this._resetIsScrollingDebounced);
    };
    _proto.scrollToItem = function scrollToItem(index, align) {
      if (align === void 0) {
        align = "auto";
      }
      var _this$props2 = this.props, itemCount = _this$props2.itemCount, layout = _this$props2.layout;
      var scrollOffset = this.state.scrollOffset;
      index = Math.max(0, Math.min(index, itemCount - 1));
      var scrollbarSize = 0;
      if (this._outerRef) {
        var outerRef = this._outerRef;
        if (layout === "vertical") {
          scrollbarSize = outerRef.scrollWidth > outerRef.clientWidth ? getScrollbarSize() : 0;
        } else {
          scrollbarSize = outerRef.scrollHeight > outerRef.clientHeight ? getScrollbarSize() : 0;
        }
      }
      this.scrollTo(getOffsetForIndexAndAlignment5(this.props, index, align, scrollOffset, this._instanceProps, scrollbarSize));
    };
    _proto.componentDidMount = function componentDidMount() {
      var _this$props3 = this.props, direction = _this$props3.direction, initialScrollOffset = _this$props3.initialScrollOffset, layout = _this$props3.layout;
      if (typeof initialScrollOffset === "number" && this._outerRef != null) {
        var outerRef = this._outerRef;
        if (direction === "horizontal" || layout === "horizontal") {
          outerRef.scrollLeft = initialScrollOffset;
        } else {
          outerRef.scrollTop = initialScrollOffset;
        }
      }
      this._callPropsCallbacks();
    };
    _proto.componentDidUpdate = function componentDidUpdate() {
      var _this$props4 = this.props, direction = _this$props4.direction, layout = _this$props4.layout;
      var _this$state = this.state, scrollOffset = _this$state.scrollOffset, scrollUpdateWasRequested = _this$state.scrollUpdateWasRequested;
      if (scrollUpdateWasRequested && this._outerRef != null) {
        var outerRef = this._outerRef;
        if (direction === "horizontal" || layout === "horizontal") {
          if (direction === "rtl") {
            switch (getRTLOffsetType()) {
              case "negative":
                outerRef.scrollLeft = -scrollOffset;
                break;
              case "positive-ascending":
                outerRef.scrollLeft = scrollOffset;
                break;
              default:
                var clientWidth = outerRef.clientWidth, scrollWidth = outerRef.scrollWidth;
                outerRef.scrollLeft = scrollWidth - clientWidth - scrollOffset;
                break;
            }
          } else {
            outerRef.scrollLeft = scrollOffset;
          }
        } else {
          outerRef.scrollTop = scrollOffset;
        }
      }
      this._callPropsCallbacks();
    };
    _proto.componentWillUnmount = function componentWillUnmount() {
      if (this._resetIsScrollingTimeoutId !== null) {
        cancelTimeout(this._resetIsScrollingTimeoutId);
      }
    };
    _proto.render = function render() {
      var _this$props5 = this.props, children = _this$props5.children, className = _this$props5.className, direction = _this$props5.direction, height = _this$props5.height, innerRef = _this$props5.innerRef, innerElementType = _this$props5.innerElementType, innerTagName = _this$props5.innerTagName, itemCount = _this$props5.itemCount, itemData = _this$props5.itemData, _this$props5$itemKey = _this$props5.itemKey, itemKey = _this$props5$itemKey === void 0 ? defaultItemKey$1 : _this$props5$itemKey, layout = _this$props5.layout, outerElementType = _this$props5.outerElementType, outerTagName = _this$props5.outerTagName, style = _this$props5.style, useIsScrolling = _this$props5.useIsScrolling, width = _this$props5.width;
      var isScrolling = this.state.isScrolling;
      var isHorizontal = direction === "horizontal" || layout === "horizontal";
      var onScroll = isHorizontal ? this._onScrollHorizontal : this._onScrollVertical;
      var _this$_getRangeToRend = this._getRangeToRender(), startIndex = _this$_getRangeToRend[0], stopIndex = _this$_getRangeToRend[1];
      var items = [];
      if (itemCount > 0) {
        for (var _index = startIndex; _index <= stopIndex; _index++) {
          items.push(reactExports.createElement(children, {
            data: itemData,
            key: itemKey(_index, itemData),
            index: _index,
            isScrolling: useIsScrolling ? isScrolling : void 0,
            style: this._getItemStyle(_index)
          }));
        }
      }
      var estimatedTotalSize = getEstimatedTotalSize4(this.props, this._instanceProps);
      return reactExports.createElement(outerElementType || outerTagName || "div", {
        className,
        onScroll,
        ref: this._outerRefSetter,
        style: _extends({
          position: "relative",
          height,
          width,
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          willChange: "transform",
          direction
        }, style)
      }, reactExports.createElement(innerElementType || innerTagName || "div", {
        children: items,
        ref: innerRef,
        style: {
          height: isHorizontal ? "100%" : estimatedTotalSize,
          pointerEvents: isScrolling ? "none" : void 0,
          width: isHorizontal ? estimatedTotalSize : "100%"
        }
      }));
    };
    _proto._callPropsCallbacks = function _callPropsCallbacks() {
      if (typeof this.props.onItemsRendered === "function") {
        var itemCount = this.props.itemCount;
        if (itemCount > 0) {
          var _this$_getRangeToRend2 = this._getRangeToRender(), _overscanStartIndex = _this$_getRangeToRend2[0], _overscanStopIndex = _this$_getRangeToRend2[1], _visibleStartIndex = _this$_getRangeToRend2[2], _visibleStopIndex = _this$_getRangeToRend2[3];
          this._callOnItemsRendered(_overscanStartIndex, _overscanStopIndex, _visibleStartIndex, _visibleStopIndex);
        }
      }
      if (typeof this.props.onScroll === "function") {
        var _this$state2 = this.state, _scrollDirection = _this$state2.scrollDirection, _scrollOffset = _this$state2.scrollOffset, _scrollUpdateWasRequested = _this$state2.scrollUpdateWasRequested;
        this._callOnScroll(_scrollDirection, _scrollOffset, _scrollUpdateWasRequested);
      }
    };
    _proto._getRangeToRender = function _getRangeToRender() {
      var _this$props6 = this.props, itemCount = _this$props6.itemCount, overscanCount = _this$props6.overscanCount;
      var _this$state3 = this.state, isScrolling = _this$state3.isScrolling, scrollDirection = _this$state3.scrollDirection, scrollOffset = _this$state3.scrollOffset;
      if (itemCount === 0) {
        return [0, 0, 0, 0];
      }
      var startIndex = getStartIndexForOffset3(this.props, scrollOffset, this._instanceProps);
      var stopIndex = getStopIndexForStartIndex3(this.props, startIndex, scrollOffset, this._instanceProps);
      var overscanBackward = !isScrolling || scrollDirection === "backward" ? Math.max(1, overscanCount) : 1;
      var overscanForward = !isScrolling || scrollDirection === "forward" ? Math.max(1, overscanCount) : 1;
      return [Math.max(0, startIndex - overscanBackward), Math.max(0, Math.min(itemCount - 1, stopIndex + overscanForward)), startIndex, stopIndex];
    };
    return List2;
  }(reactExports.PureComponent), _class.defaultProps = {
    direction: "ltr",
    itemData: void 0,
    layout: "vertical",
    overscanCount: 2,
    useIsScrolling: false
  }, _class;
}
var validateSharedProps$1 = function validateSharedProps3(_ref2, _ref3) {
  _ref2.children;
  _ref2.direction;
  _ref2.height;
  _ref2.layout;
  _ref2.innerTagName;
  _ref2.outerTagName;
  _ref2.width;
  _ref3.instance;
};
var FixedSizeList = /* @__PURE__ */ createListComponent({
  getItemOffset: function getItemOffset2(_ref2, index) {
    var itemSize = _ref2.itemSize;
    return index * itemSize;
  },
  getItemSize: function getItemSize2(_ref2, index) {
    var itemSize = _ref2.itemSize;
    return itemSize;
  },
  getEstimatedTotalSize: function getEstimatedTotalSize3(_ref3) {
    var itemCount = _ref3.itemCount, itemSize = _ref3.itemSize;
    return itemSize * itemCount;
  },
  getOffsetForIndexAndAlignment: function getOffsetForIndexAndAlignment4(_ref4, index, align, scrollOffset, instanceProps, scrollbarSize) {
    var direction = _ref4.direction, height = _ref4.height, itemCount = _ref4.itemCount, itemSize = _ref4.itemSize, layout = _ref4.layout, width = _ref4.width;
    var isHorizontal = direction === "horizontal" || layout === "horizontal";
    var size2 = isHorizontal ? width : height;
    var lastItemOffset = Math.max(0, itemCount * itemSize - size2);
    var maxOffset = Math.min(lastItemOffset, index * itemSize);
    var minOffset = Math.max(0, index * itemSize - size2 + itemSize + scrollbarSize);
    if (align === "smart") {
      if (scrollOffset >= minOffset - size2 && scrollOffset <= maxOffset + size2) {
        align = "auto";
      } else {
        align = "center";
      }
    }
    switch (align) {
      case "start":
        return maxOffset;
      case "end":
        return minOffset;
      case "center": {
        var middleOffset = Math.round(minOffset + (maxOffset - minOffset) / 2);
        if (middleOffset < Math.ceil(size2 / 2)) {
          return 0;
        } else if (middleOffset > lastItemOffset + Math.floor(size2 / 2)) {
          return lastItemOffset;
        } else {
          return middleOffset;
        }
      }
      case "auto":
      default:
        if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
          return scrollOffset;
        } else if (scrollOffset < minOffset) {
          return minOffset;
        } else {
          return maxOffset;
        }
    }
  },
  getStartIndexForOffset: function getStartIndexForOffset2(_ref5, offset) {
    var itemCount = _ref5.itemCount, itemSize = _ref5.itemSize;
    return Math.max(0, Math.min(itemCount - 1, Math.floor(offset / itemSize)));
  },
  getStopIndexForStartIndex: function getStopIndexForStartIndex2(_ref6, startIndex, scrollOffset) {
    var direction = _ref6.direction, height = _ref6.height, itemCount = _ref6.itemCount, itemSize = _ref6.itemSize, layout = _ref6.layout, width = _ref6.width;
    var isHorizontal = direction === "horizontal" || layout === "horizontal";
    var offset = startIndex * itemSize;
    var size2 = isHorizontal ? width : height;
    var numVisibleItems = Math.ceil((size2 + scrollOffset - offset) / itemSize);
    return Math.max(0, Math.min(
      itemCount - 1,
      startIndex + numVisibleItems - 1
      // -1 is because stop index is inclusive
    ));
  },
  initInstanceProps: function initInstanceProps4(props) {
  },
  shouldResetStyleCacheOnItemSizeChange: true,
  validateProps: function validateProps4(_ref7) {
    _ref7.itemSize;
  }
});
/*! @license DOMPurify 3.4.13 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.13/LICENSE */
function _arrayLikeToArray(r2, a) {
  (null == a || a > r2.length) && (a = r2.length);
  for (var e = 0, n2 = Array(a); e < a; e++) n2[e] = r2[e];
  return n2;
}
function _arrayWithHoles(r2) {
  if (Array.isArray(r2)) return r2;
}
function _iterableToArrayLimit(r2, l2) {
  var t2 = null == r2 ? null : "undefined" != typeof Symbol && r2[Symbol.iterator] || r2["@@iterator"];
  if (null != t2) {
    var e, n2, i, u2, a = [], f2 = true, o = false;
    try {
      if (i = (t2 = t2.call(r2)).next, 0 === l2) ;
      else for (; !(f2 = (e = i.call(t2)).done) && (a.push(e.value), a.length !== l2); f2 = true) ;
    } catch (r3) {
      o = true, n2 = r3;
    } finally {
      try {
        if (!f2 && null != t2.return && (u2 = t2.return(), Object(u2) !== u2)) return;
      } finally {
        if (o) throw n2;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(r2, e) {
  return _arrayWithHoles(r2) || _iterableToArrayLimit(r2, e) || _unsupportedIterableToArray(r2, e) || _nonIterableRest();
}
function _unsupportedIterableToArray(r2, a) {
  if (r2) {
    if ("string" == typeof r2) return _arrayLikeToArray(r2, a);
    var t2 = {}.toString.call(r2).slice(8, -1);
    return "Object" === t2 && r2.constructor && (t2 = r2.constructor.name), "Map" === t2 || "Set" === t2 ? Array.from(r2) : "Arguments" === t2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t2) ? _arrayLikeToArray(r2, a) : void 0;
  }
}
const entries = Object.entries, setPrototypeOf = Object.setPrototypeOf, isFrozen = Object.isFrozen, getPrototypeOf = Object.getPrototypeOf, getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
let freeze = Object.freeze, seal = Object.seal, create = Object.create;
let _ref = typeof Reflect !== "undefined" && Reflect, apply = _ref.apply, construct = _ref.construct;
if (!freeze) {
  freeze = function freeze2(x2) {
    return x2;
  };
}
if (!seal) {
  seal = function seal2(x2) {
    return x2;
  };
}
if (!apply) {
  apply = function apply2(func, thisArg) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    return func.apply(thisArg, args);
  };
}
if (!construct) {
  construct = function construct2(Func) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    return new Func(...args);
  };
}
const arrayForEach = unapply(Array.prototype.forEach);
const arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
const arrayPop = unapply(Array.prototype.pop);
const arrayPush = unapply(Array.prototype.push);
const arraySplice = unapply(Array.prototype.splice);
const arrayIsArray = Array.isArray;
const stringToLowerCase = unapply(String.prototype.toLowerCase);
const stringToString = unapply(String.prototype.toString);
const stringMatch = unapply(String.prototype.match);
const stringReplace = unapply(String.prototype.replace);
const stringIndexOf = unapply(String.prototype.indexOf);
const stringTrim = unapply(String.prototype.trim);
const numberToString = unapply(Number.prototype.toString);
const booleanToString = unapply(Boolean.prototype.toString);
const bigintToString = typeof BigInt === "undefined" ? null : unapply(BigInt.prototype.toString);
const symbolToString = typeof Symbol === "undefined" ? null : unapply(Symbol.prototype.toString);
const objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
const objectToString = unapply(Object.prototype.toString);
const regExpTest = unapply(RegExp.prototype.test);
const typeErrorCreate = unconstruct(TypeError);
function unapply(func) {
  return function(thisArg) {
    if (thisArg instanceof RegExp) {
      thisArg.lastIndex = 0;
    }
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    return apply(func, thisArg, args);
  };
}
function unconstruct(Func) {
  return function() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return construct(Func, args);
  };
}
function addToSet(set, array) {
  let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
  if (setPrototypeOf) {
    setPrototypeOf(set, null);
  }
  if (!arrayIsArray(array)) {
    return set;
  }
  let l2 = array.length;
  while (l2--) {
    let element = array[l2];
    if (typeof element === "string") {
      const lcElement = transformCaseFunc(element);
      if (lcElement !== element) {
        if (!isFrozen(array)) {
          array[l2] = lcElement;
        }
        element = lcElement;
      }
    }
    set[element] = true;
  }
  return set;
}
function cleanArray(array) {
  for (let index = 0; index < array.length; index++) {
    const isPropertyExist = objectHasOwnProperty(array, index);
    if (!isPropertyExist) {
      array[index] = null;
    }
  }
  return array;
}
function clone(object) {
  const newObject = create(null);
  for (const _ref2 of entries(object)) {
    var _ref3 = _slicedToArray(_ref2, 2);
    const property = _ref3[0];
    const value = _ref3[1];
    const isPropertyExist = objectHasOwnProperty(object, property);
    if (isPropertyExist) {
      if (arrayIsArray(value)) {
        newObject[property] = cleanArray(value);
      } else if (value && typeof value === "object" && value.constructor === Object) {
        newObject[property] = clone(value);
      } else {
        newObject[property] = value;
      }
    }
  }
  return newObject;
}
function stringifyValue(value) {
  switch (typeof value) {
    case "string": {
      return value;
    }
    case "number": {
      return numberToString(value);
    }
    case "boolean": {
      return booleanToString(value);
    }
    case "bigint": {
      return bigintToString ? bigintToString(value) : "0";
    }
    case "symbol": {
      return symbolToString ? symbolToString(value) : "Symbol()";
    }
    case "undefined": {
      return objectToString(value);
    }
    case "function":
    case "object": {
      if (value === null) {
        return objectToString(value);
      }
      const valueAsRecord = value;
      const valueToString = lookupGetter(valueAsRecord, "toString");
      if (typeof valueToString === "function") {
        const stringified = valueToString(valueAsRecord);
        return typeof stringified === "string" ? stringified : objectToString(stringified);
      }
      return objectToString(value);
    }
    default: {
      return objectToString(value);
    }
  }
}
function lookupGetter(object, prop) {
  while (object !== null) {
    const desc = getOwnPropertyDescriptor(object, prop);
    if (desc) {
      if (desc.get) {
        return unapply(desc.get);
      }
      if (typeof desc.value === "function") {
        return unapply(desc.value);
      }
    }
    object = getPrototypeOf(object);
  }
  function fallbackValue() {
    return null;
  }
  return fallbackValue;
}
function isRegex(value) {
  try {
    regExpTest(value, "");
    return true;
  } catch (_unused) {
    return false;
  }
}
const html$1 = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
const svg$1 = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
const svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
const svgDisallowed = freeze(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
const mathMl$1 = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]);
const mathMlDisallowed = freeze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
const text = freeze(["#text"]);
const html = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "command", "commandfor", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns"]);
const svg = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dominant-baseline", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-orientation", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
const mathMl = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnalign", "columnlines", "columnspacing", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lquote", "lspace", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
const xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
const MUSTACHE_EXPR = seal(/{{[\w\W]*|^[\w\W]*}}/g);
const ERB_EXPR = seal(/<%[\w\W]*|^[\w\W]*%>/g);
const TMPLIT_EXPR = seal(/\${[\w\W]*/g);
const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
const ARIA_ATTR = seal(/^aria-[\-\w]+$/);
const IS_ALLOWED_URI = seal(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
);
const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
const ATTR_WHITESPACE = seal(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
);
const DOCTYPE_NAME = seal(/^html$/i);
const CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
const ELEMENT_MARKUP_PROBE = seal(/<[/\w!]/g);
const COMMENT_MARKUP_PROBE = seal(/<[/\w]/g);
const FALLBACK_TAG_CLOSE = seal(/<\/no(script|embed|frames)/i);
const SELF_CLOSING_TAG = seal(/\/>/i);
const NODE_TYPE = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  // Deprecated
  entityNode: 6,
  // Deprecated
  processingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12
  // Deprecated
};
const getGlobal = function getGlobal2() {
  return typeof window === "undefined" ? null : window;
};
const _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, purifyHostElement) {
  if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") {
    return null;
  }
  let suffix = null;
  const ATTR_NAME = "data-tt-policy-suffix";
  if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
    suffix = purifyHostElement.getAttribute(ATTR_NAME);
  }
  const policyName = "dompurify" + (suffix ? "#" + suffix : "");
  try {
    return trustedTypes.createPolicy(policyName, {
      createHTML(html2) {
        return html2;
      },
      createScriptURL(scriptUrl) {
        return scriptUrl;
      }
    });
  } catch (_) {
    console.warn("TrustedTypes policy " + policyName + " could not be created.");
    return null;
  }
};
const _createHooksMap = function _createHooksMap2() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
const _resolveSetOption = function _resolveSetOption2(cfg, key, fallback, options) {
  return objectHasOwnProperty(cfg, key) && arrayIsArray(cfg[key]) ? addToSet(options.base ? clone(options.base) : {}, cfg[key], options.transform) : fallback;
};
function createDOMPurify() {
  let window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
  const DOMPurify = (root) => createDOMPurify(root);
  DOMPurify.version = "3.4.13";
  DOMPurify.removed = [];
  if (!window2 || !window2.document || window2.document.nodeType !== NODE_TYPE.document || !window2.Element) {
    DOMPurify.isSupported = false;
    return DOMPurify;
  }
  let document2 = window2.document;
  const originalDocument = document2;
  const currentScript = originalDocument.currentScript;
  window2.DocumentFragment;
  const HTMLTemplateElement = window2.HTMLTemplateElement, Node = window2.Node, Element = window2.Element, NodeFilter = window2.NodeFilter, _window$NamedNodeMap = window2.NamedNodeMap;
  _window$NamedNodeMap === void 0 ? window2.NamedNodeMap || window2.MozNamedAttrMap : _window$NamedNodeMap;
  window2.HTMLFormElement;
  const DOMParser2 = window2.DOMParser, trustedTypes = window2.trustedTypes;
  const ElementPrototype = Element.prototype;
  const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
  const remove = lookupGetter(ElementPrototype, "remove");
  const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
  const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
  const getParentNode = lookupGetter(ElementPrototype, "parentNode");
  const getShadowRoot = lookupGetter(ElementPrototype, "shadowRoot");
  const getAttributes = lookupGetter(ElementPrototype, "attributes");
  const getNodeType = Node && Node.prototype ? lookupGetter(Node.prototype, "nodeType") : null;
  const getNodeName = Node && Node.prototype ? lookupGetter(Node.prototype, "nodeName") : null;
  const getOwnerDocument = Node && Node.prototype ? lookupGetter(Node.prototype, "ownerDocument") : null;
  if (typeof HTMLTemplateElement === "function") {
    const template = document2.createElement("template");
    if (template.content && template.content.ownerDocument) {
      document2 = template.content.ownerDocument;
    }
  }
  let trustedTypesPolicy;
  let emptyHTML = "";
  let defaultTrustedTypesPolicy;
  let defaultTrustedTypesPolicyResolved = false;
  let IN_TRUSTED_TYPES_POLICY = 0;
  const _assertNotInTrustedTypesPolicy = function _assertNotInTrustedTypesPolicy2() {
    if (IN_TRUSTED_TYPES_POLICY > 0) {
      throw typeErrorCreate('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
    }
  };
  const _createTrustedHTML = function _createTrustedHTML2(html2) {
    _assertNotInTrustedTypesPolicy();
    IN_TRUSTED_TYPES_POLICY++;
    try {
      return trustedTypesPolicy.createHTML(html2);
    } finally {
      IN_TRUSTED_TYPES_POLICY--;
    }
  };
  const _createTrustedScriptURL = function _createTrustedScriptURL2(scriptUrl) {
    _assertNotInTrustedTypesPolicy();
    IN_TRUSTED_TYPES_POLICY++;
    try {
      return trustedTypesPolicy.createScriptURL(scriptUrl);
    } finally {
      IN_TRUSTED_TYPES_POLICY--;
    }
  };
  const _getDefaultTrustedTypesPolicy = function _getDefaultTrustedTypesPolicy2() {
    if (!defaultTrustedTypesPolicyResolved) {
      defaultTrustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
      defaultTrustedTypesPolicyResolved = true;
    }
    return defaultTrustedTypesPolicy;
  };
  const _document = document2, implementation = _document.implementation, createNodeIterator = _document.createNodeIterator, createDocumentFragment = _document.createDocumentFragment, getElementsByTagName = _document.getElementsByTagName;
  const importNode = originalDocument.importNode;
  let hooks = _createHooksMap();
  DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
  const MUSTACHE_EXPR$1 = MUSTACHE_EXPR, ERB_EXPR$1 = ERB_EXPR, TMPLIT_EXPR$1 = TMPLIT_EXPR, DATA_ATTR$1 = DATA_ATTR, ARIA_ATTR$1 = ARIA_ATTR, IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA, ATTR_WHITESPACE$1 = ATTR_WHITESPACE, CUSTOM_ELEMENT$1 = CUSTOM_ELEMENT;
  let IS_ALLOWED_URI$1 = IS_ALLOWED_URI;
  let ALLOWED_TAGS = null;
  const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
  let ALLOWED_ATTR = null;
  const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
  let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
    tagNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: false
    }
  }));
  let FORBID_TAGS = null;
  let FORBID_ATTR = null;
  const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
    tagCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    }
  }));
  let ALLOW_ARIA_ATTR = true;
  let ALLOW_DATA_ATTR = true;
  let ALLOW_UNKNOWN_PROTOCOLS = false;
  let ALLOW_SELF_CLOSE_IN_ATTR = true;
  let SAFE_FOR_TEMPLATES = false;
  let SAFE_FOR_XML = true;
  let WHOLE_DOCUMENT = false;
  let SET_CONFIG = false;
  let SET_CONFIG_ALLOWED_TAGS = null;
  let SET_CONFIG_ALLOWED_ATTR = null;
  let FORCE_BODY = false;
  let RETURN_DOM = false;
  let RETURN_DOM_FRAGMENT = false;
  let RETURN_TRUSTED_TYPE = false;
  let SANITIZE_DOM = true;
  let SANITIZE_NAMED_PROPS = false;
  const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
  let KEEP_CONTENT = true;
  let IN_PLACE = false;
  let USE_PROFILES = {};
  let FORBID_CONTENTS = null;
  const DEFAULT_FORBID_CONTENTS = addToSet({}, [
    "annotation-xml",
    "audio",
    "colgroup",
    "desc",
    "foreignobject",
    "head",
    "iframe",
    "math",
    "mi",
    "mn",
    "mo",
    "ms",
    "mtext",
    "noembed",
    "noframes",
    "noscript",
    "plaintext",
    "script",
    // <selectedcontent> mirrors the selected <option>'s subtree, cloned by
    // the UA (customizable <select>) — including any on* handlers — and the
    // engine re-mirrors synchronously whenever a removal changes which
    // option/selectedcontent is current, even inside DOMPurify's inert
    // DOMParser document. Hoisting its children on removal re-inserts a fresh
    // mirror target ahead of the walk, which the engine refills, looping
    // forever (DoS) and amplifying output. Dropping its content on removal
    // (rather than hoisting) breaks that cascade; the content is a duplicate
    // of the option, which is sanitized on its own. See campaign-3 F1/F6.
    "selectedcontent",
    "style",
    "svg",
    "template",
    "thead",
    "title",
    "video",
    "xmp"
  ]);
  let DATA_URI_TAGS = null;
  const DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
  let URI_SAFE_ATTRIBUTES = null;
  const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]);
  const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
  let NAMESPACE = HTML_NAMESPACE;
  let IS_EMPTY_INPUT = false;
  let ALLOWED_NAMESPACES = null;
  const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
  const DEFAULT_MATHML_TEXT_INTEGRATION_POINTS = freeze(["mi", "mo", "mn", "ms", "mtext"]);
  let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS);
  const DEFAULT_HTML_INTEGRATION_POINTS = freeze(["annotation-xml"]);
  let HTML_INTEGRATION_POINTS = addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS);
  const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ["title", "style", "font", "a", "script"]);
  let PARSER_MEDIA_TYPE = null;
  const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
  const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
  let transformCaseFunc = null;
  let CONFIG = null;
  const formElement = document2.createElement("form");
  const isRegexOrFunction = function isRegexOrFunction2(testValue) {
    return testValue instanceof RegExp || testValue instanceof Function;
  };
  const _parseConfig = function _parseConfig2() {
    let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (CONFIG && CONFIG === cfg) {
      return;
    }
    if (!cfg || typeof cfg !== "object") {
      cfg = {};
    }
    cfg = clone(cfg);
    PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
    SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
    transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
    ALLOWED_TAGS = _resolveSetOption(cfg, "ALLOWED_TAGS", DEFAULT_ALLOWED_TAGS, {
      transform: transformCaseFunc
    });
    ALLOWED_ATTR = _resolveSetOption(cfg, "ALLOWED_ATTR", DEFAULT_ALLOWED_ATTR, {
      transform: transformCaseFunc
    });
    ALLOWED_NAMESPACES = _resolveSetOption(cfg, "ALLOWED_NAMESPACES", DEFAULT_ALLOWED_NAMESPACES, {
      transform: stringToString
    });
    URI_SAFE_ATTRIBUTES = _resolveSetOption(cfg, "ADD_URI_SAFE_ATTR", DEFAULT_URI_SAFE_ATTRIBUTES, {
      transform: transformCaseFunc,
      base: DEFAULT_URI_SAFE_ATTRIBUTES
    });
    DATA_URI_TAGS = _resolveSetOption(cfg, "ADD_DATA_URI_TAGS", DEFAULT_DATA_URI_TAGS, {
      transform: transformCaseFunc,
      base: DEFAULT_DATA_URI_TAGS
    });
    FORBID_CONTENTS = _resolveSetOption(cfg, "FORBID_CONTENTS", DEFAULT_FORBID_CONTENTS, {
      transform: transformCaseFunc
    });
    FORBID_TAGS = _resolveSetOption(cfg, "FORBID_TAGS", clone({}), {
      transform: transformCaseFunc
    });
    FORBID_ATTR = _resolveSetOption(cfg, "FORBID_ATTR", clone({}), {
      transform: transformCaseFunc
    });
    USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES && typeof cfg.USE_PROFILES === "object" ? clone(cfg.USE_PROFILES) : cfg.USE_PROFILES : false;
    ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
    ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
    ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
    ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
    SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
    SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
    WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
    RETURN_DOM = cfg.RETURN_DOM || false;
    RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
    RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
    FORCE_BODY = cfg.FORCE_BODY || false;
    SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
    SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
    KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
    IN_PLACE = cfg.IN_PLACE || false;
    IS_ALLOWED_URI$1 = isRegex(cfg.ALLOWED_URI_REGEXP) ? cfg.ALLOWED_URI_REGEXP : IS_ALLOWED_URI;
    NAMESPACE = typeof cfg.NAMESPACE === "string" ? cfg.NAMESPACE : HTML_NAMESPACE;
    MATHML_TEXT_INTEGRATION_POINTS = objectHasOwnProperty(cfg, "MATHML_TEXT_INTEGRATION_POINTS") && cfg.MATHML_TEXT_INTEGRATION_POINTS && typeof cfg.MATHML_TEXT_INTEGRATION_POINTS === "object" ? clone(cfg.MATHML_TEXT_INTEGRATION_POINTS) : addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS);
    HTML_INTEGRATION_POINTS = objectHasOwnProperty(cfg, "HTML_INTEGRATION_POINTS") && cfg.HTML_INTEGRATION_POINTS && typeof cfg.HTML_INTEGRATION_POINTS === "object" ? clone(cfg.HTML_INTEGRATION_POINTS) : addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS);
    const customElementHandling = objectHasOwnProperty(cfg, "CUSTOM_ELEMENT_HANDLING") && cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING === "object" ? clone(cfg.CUSTOM_ELEMENT_HANDLING) : create(null);
    CUSTOM_ELEMENT_HANDLING = create(null);
    if (objectHasOwnProperty(customElementHandling, "tagNameCheck") && isRegexOrFunction(customElementHandling.tagNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.tagNameCheck = customElementHandling.tagNameCheck;
    }
    if (objectHasOwnProperty(customElementHandling, "attributeNameCheck") && isRegexOrFunction(customElementHandling.attributeNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.attributeNameCheck = customElementHandling.attributeNameCheck;
    }
    if (objectHasOwnProperty(customElementHandling, "allowCustomizedBuiltInElements") && typeof customElementHandling.allowCustomizedBuiltInElements === "boolean") {
      CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = customElementHandling.allowCustomizedBuiltInElements;
    }
    seal(CUSTOM_ELEMENT_HANDLING);
    if (SAFE_FOR_TEMPLATES) {
      ALLOW_DATA_ATTR = false;
    }
    if (RETURN_DOM_FRAGMENT) {
      RETURN_DOM = true;
    }
    if (USE_PROFILES) {
      ALLOWED_TAGS = addToSet({}, text);
      ALLOWED_ATTR = create(null);
      if (USE_PROFILES.html === true) {
        addToSet(ALLOWED_TAGS, html$1);
        addToSet(ALLOWED_ATTR, html);
      }
      if (USE_PROFILES.svg === true) {
        addToSet(ALLOWED_TAGS, svg$1);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.svgFilters === true) {
        addToSet(ALLOWED_TAGS, svgFilters);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.mathMl === true) {
        addToSet(ALLOWED_TAGS, mathMl$1);
        addToSet(ALLOWED_ATTR, mathMl);
        addToSet(ALLOWED_ATTR, xml);
      }
    }
    EXTRA_ELEMENT_HANDLING.tagCheck = null;
    EXTRA_ELEMENT_HANDLING.attributeCheck = null;
    if (objectHasOwnProperty(cfg, "ADD_TAGS")) {
      if (typeof cfg.ADD_TAGS === "function") {
        EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
      } else if (arrayIsArray(cfg.ADD_TAGS)) {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
          ALLOWED_TAGS = clone(ALLOWED_TAGS);
        }
        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
      }
    }
    if (objectHasOwnProperty(cfg, "ADD_ATTR")) {
      if (typeof cfg.ADD_ATTR === "function") {
        EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
      } else if (arrayIsArray(cfg.ADD_ATTR)) {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
          ALLOWED_ATTR = clone(ALLOWED_ATTR);
        }
        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
      }
    }
    if (objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") && arrayIsArray(cfg.ADD_URI_SAFE_ATTR)) {
      addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
    }
    if (objectHasOwnProperty(cfg, "FORBID_CONTENTS") && arrayIsArray(cfg.FORBID_CONTENTS)) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
    }
    if (objectHasOwnProperty(cfg, "ADD_FORBID_CONTENTS") && arrayIsArray(cfg.ADD_FORBID_CONTENTS)) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
    }
    if (KEEP_CONTENT) {
      ALLOWED_TAGS["#text"] = true;
    }
    if (WHOLE_DOCUMENT) {
      addToSet(ALLOWED_TAGS, ["html", "head", "body"]);
    }
    if (ALLOWED_TAGS.table) {
      addToSet(ALLOWED_TAGS, ["tbody"]);
      delete FORBID_TAGS.tbody;
    }
    if (cfg.TRUSTED_TYPES_POLICY) {
      if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      }
      if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      }
      const previousTrustedTypesPolicy = trustedTypesPolicy;
      trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
      try {
        emptyHTML = _createTrustedHTML("");
      } catch (error) {
        trustedTypesPolicy = previousTrustedTypesPolicy;
        throw error;
      }
    } else if (cfg.TRUSTED_TYPES_POLICY === null) {
      trustedTypesPolicy = void 0;
      emptyHTML = "";
    } else {
      if (trustedTypesPolicy === void 0) {
        trustedTypesPolicy = _getDefaultTrustedTypesPolicy();
      }
      if (trustedTypesPolicy && typeof emptyHTML === "string") {
        emptyHTML = _createTrustedHTML("");
      }
    }
    if (freeze) {
      freeze(cfg);
    }
    CONFIG = cfg;
  };
  const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
  const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
  const _checkSvgNamespace = function _checkSvgNamespace2(tagName, parent, parentTagName) {
    if (parent.namespaceURI === HTML_NAMESPACE) {
      return tagName === "svg";
    }
    if (parent.namespaceURI === MATHML_NAMESPACE) {
      return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
    }
    return Boolean(ALL_SVG_TAGS[tagName]);
  };
  const _checkMathMlNamespace = function _checkMathMlNamespace2(tagName, parent, parentTagName) {
    if (parent.namespaceURI === HTML_NAMESPACE) {
      return tagName === "math";
    }
    if (parent.namespaceURI === SVG_NAMESPACE) {
      return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
    }
    return Boolean(ALL_MATHML_TAGS[tagName]);
  };
  const _checkHtmlNamespace = function _checkHtmlNamespace2(tagName, parent, parentTagName) {
    if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
      return false;
    }
    if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
      return false;
    }
    return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
  };
  const _checkValidNamespace = function _checkValidNamespace2(element) {
    let parent = getParentNode(element);
    if (!parent || !parent.tagName) {
      parent = {
        namespaceURI: NAMESPACE,
        tagName: "template"
      };
    }
    const tagName = stringToLowerCase(element.tagName);
    const parentTagName = stringToLowerCase(parent.tagName);
    if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
      return false;
    }
    if (element.namespaceURI === SVG_NAMESPACE) {
      return _checkSvgNamespace(tagName, parent, parentTagName);
    }
    if (element.namespaceURI === MATHML_NAMESPACE) {
      return _checkMathMlNamespace(tagName, parent, parentTagName);
    }
    if (element.namespaceURI === HTML_NAMESPACE) {
      return _checkHtmlNamespace(tagName, parent, parentTagName);
    }
    if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) {
      return true;
    }
    return false;
  };
  const _forceRemove = function _forceRemove2(node) {
    arrayPush(DOMPurify.removed, {
      element: node
    });
    try {
      getParentNode(node).removeChild(node);
    } catch (_) {
      remove(node);
      if (!getParentNode(node)) {
        throw typeErrorCreate("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
      }
    }
  };
  const _neutralizeRoot = function _neutralizeRoot2(root) {
    _neutralizeSubtree(root);
    const childNodes = getChildNodes(root);
    if (childNodes) {
      const snapshot = [];
      arrayForEach(childNodes, (child) => {
        arrayPush(snapshot, child);
      });
      arrayForEach(snapshot, (child) => {
        try {
          remove(child);
        } catch (_) {
        }
      });
    }
    const attributes = getAttributes(root);
    if (attributes) {
      for (let i = attributes.length - 1; i >= 0; --i) {
        const attribute = attributes[i];
        const name = attribute && attribute.name;
        if (typeof name === "string") {
          try {
            root.removeAttribute(name);
          } catch (_) {
          }
        }
      }
    }
  };
  const _removeAttribute = function _removeAttribute2(name, element) {
    try {
      arrayPush(DOMPurify.removed, {
        attribute: element.getAttributeNode(name),
        from: element
      });
    } catch (_) {
      arrayPush(DOMPurify.removed, {
        attribute: null,
        from: element
      });
    }
    element.removeAttribute(name);
    if (name === "is") {
      if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
        try {
          _forceRemove(element);
        } catch (_) {
        }
      } else {
        try {
          element.setAttribute(name, "");
        } catch (_) {
        }
      }
    }
  };
  const _stripDisallowedAttributes = function _stripDisallowedAttributes2(element) {
    const attributes = getAttributes(element);
    if (!attributes) {
      return;
    }
    for (let i = attributes.length - 1; i >= 0; --i) {
      const attribute = attributes[i];
      const name = attribute && attribute.name;
      if (typeof name !== "string" || ALLOWED_ATTR[transformCaseFunc(name)]) {
        continue;
      }
      try {
        element.removeAttribute(name);
      } catch (_) {
      }
    }
  };
  const _neutralizeSubtree = function _neutralizeSubtree2(root) {
    const stack = [root];
    while (stack.length > 0) {
      const node = stack.pop();
      const nodeType = getNodeType ? getNodeType(node) : node.nodeType;
      if (nodeType === NODE_TYPE.element) {
        _stripDisallowedAttributes(node);
      }
      const childNodes = getChildNodes(node);
      if (childNodes) {
        for (let i = childNodes.length - 1; i >= 0; --i) {
          stack.push(childNodes[i]);
        }
      }
    }
  };
  const _neutralizePatchLinkage = function _neutralizePatchLinkage2(root) {
    if (!SAFE_FOR_XML) {
      return;
    }
    const stack = [root];
    while (stack.length > 0) {
      const node = stack.pop();
      const nodeType = getNodeType ? getNodeType(node) : node.nodeType;
      if (nodeType === NODE_TYPE.processingInstruction || nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, node.data)) {
        try {
          remove(node);
        } catch (_) {
        }
        continue;
      }
      if (nodeType === NODE_TYPE.element) {
        const element = node;
        const lcTag = transformCaseFunc(getNodeName ? getNodeName(node) : node.nodeName);
        try {
          if (element.hasAttribute && element.hasAttribute("patchsrc")) {
            element.removeAttribute("patchsrc");
          }
          if (element.hasAttribute && element.hasAttribute("for") && lcTag !== "label" && lcTag !== "output") {
            element.removeAttribute("for");
          }
        } catch (_) {
        }
      }
      const childNodes = getChildNodes(node);
      if (childNodes) {
        for (let i = childNodes.length - 1; i >= 0; --i) {
          stack.push(childNodes[i]);
        }
      }
    }
  };
  const _initDocument = function _initDocument2(dirty) {
    let doc = null;
    let leadingWhitespace = null;
    if (FORCE_BODY) {
      dirty = "<remove></remove>" + dirty;
    } else {
      const matches = stringMatch(dirty, /^[\r\n\t ]+/);
      leadingWhitespace = matches && matches[0];
    }
    if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) {
      dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
    }
    const dirtyPayload = trustedTypesPolicy ? _createTrustedHTML(dirty) : dirty;
    if (NAMESPACE === HTML_NAMESPACE) {
      try {
        doc = new DOMParser2().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
      } catch (_) {
      }
    }
    if (!doc || !doc.documentElement) {
      doc = implementation.createDocument(NAMESPACE, "template", null);
      try {
        doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
      } catch (_) {
      }
    }
    const body = doc.body || doc.documentElement;
    if (dirty && leadingWhitespace) {
      body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
    }
    if (NAMESPACE === HTML_NAMESPACE) {
      return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
    }
    return WHOLE_DOCUMENT ? doc.documentElement : body;
  };
  const _createNodeIterator = function _createNodeIterator2(root) {
    const doc = getOwnerDocument ? getOwnerDocument(root) : root.ownerDocument;
    return createNodeIterator.call(
      doc || root,
      root,
      // eslint-disable-next-line no-bitwise
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION,
      null
    );
  };
  const _stripTemplateExpressions = function _stripTemplateExpressions2(value) {
    value = stringReplace(value, MUSTACHE_EXPR$1, " ");
    value = stringReplace(value, ERB_EXPR$1, " ");
    value = stringReplace(value, TMPLIT_EXPR$1, " ");
    return value;
  };
  const _scrubTemplateExpressions2 = function _scrubTemplateExpressions(node) {
    var _node$querySelectorAl;
    node.normalize();
    const doc = getOwnerDocument ? getOwnerDocument(node) : node.ownerDocument;
    const walker = createNodeIterator.call(
      doc || node,
      node,
      // eslint-disable-next-line no-bitwise
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_CDATA_SECTION | NodeFilter.SHOW_PROCESSING_INSTRUCTION,
      null
    );
    let currentNode = walker.nextNode();
    while (currentNode) {
      currentNode.data = _stripTemplateExpressions(currentNode.data);
      currentNode = walker.nextNode();
    }
    const templates = (_node$querySelectorAl = node.querySelectorAll) === null || _node$querySelectorAl === void 0 ? void 0 : _node$querySelectorAl.call(node, "template");
    if (templates) {
      arrayForEach(templates, (tmpl) => {
        if (_isDocumentFragment(tmpl.content)) {
          _scrubTemplateExpressions2(tmpl.content);
        }
      });
    }
  };
  const _isClobbered = function _isClobbered2(element) {
    const realTagName = getNodeName ? getNodeName(element) : null;
    if (typeof realTagName !== "string") {
      return false;
    }
    if (transformCaseFunc(realTagName) !== "form") {
      return false;
    }
    return typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || // Realm-safe NamedNodeMap detection: equality against the cached
    // prototype getter. Clobbered .attributes (e.g. <input name="attributes">)
    // makes the direct read diverge from the cached read; a clean form
    // (same-realm OR foreign-realm) has both reads pointing at the same
    // canonical NamedNodeMap.
    element.attributes !== getAttributes(element) || typeof element.removeAttribute !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function" || // NodeType clobbering probe. Cached Node.prototype.nodeType getter
    // returns the integer 1 for any Element regardless of realm; direct
    // read on a clobbered form (e.g. <input name="nodeType">) returns
    // the named child element. Cheap addition — nodeType is read from
    // an internal slot, no serialization cost — and removes a residual
    // clobbering surface used by several mXSS / PI / comment branches
    // in _sanitizeElements that compare currentNode.nodeType directly.
    element.nodeType !== getNodeType(element) || // HTMLFormElement has [LegacyOverrideBuiltIns]: a descendant named
    // "childNodes" shadows the prototype getter. Direct reads of
    // form.childNodes from a clobbered form return the named child
    // instead of the real NodeList, so any walk that reads it directly
    // skips the form's real children. Compare the direct read to the
    // cached Node.prototype getter — when the form's named-property
    // getter intercepts the read, the two values differ and we flag
    // the form. This catches every clobbering child type (input,
    // select, etc.) regardless of whether the named child happens to
    // carry a numeric .length, which a typeof-based probe would miss
    // (e.g. HTMLSelectElement.length is a defined unsigned-long).
    element.childNodes !== getChildNodes(element);
  };
  const _isDocumentFragment = function _isDocumentFragment2(value) {
    if (!getNodeType || typeof value !== "object" || value === null) {
      return false;
    }
    try {
      return getNodeType(value) === NODE_TYPE.documentFragment;
    } catch (_) {
      return false;
    }
  };
  const _isNode = function _isNode2(value) {
    if (!getNodeType || typeof value !== "object" || value === null) {
      return false;
    }
    try {
      return typeof getNodeType(value) === "number";
    } catch (_) {
      return false;
    }
  };
  function _executeHooks(hooks2, currentNode, data) {
    if (hooks2.length === 0) {
      return;
    }
    arrayForEach(hooks2, (hook) => {
      hook.call(DOMPurify, currentNode, data, CONFIG);
    });
  }
  const _isUnsafeNode = function _isUnsafeNode2(currentNode, tagName) {
    if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.textContent) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.innerHTML)) {
      return true;
    }
    if (SAFE_FOR_XML && currentNode.namespaceURI === HTML_NAMESPACE && tagName === "style" && _isNode(currentNode.firstElementChild)) {
      return true;
    }
    if (currentNode.nodeType === NODE_TYPE.processingInstruction) {
      return true;
    }
    if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, currentNode.data)) {
      return true;
    }
    return false;
  };
  const _sanitizeDisallowedNode = function _sanitizeDisallowedNode2(currentNode, tagName, root) {
    if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
      if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
        return false;
      }
      if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
        return false;
      }
    }
    if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
      const parentNode = getParentNode(currentNode);
      const childNodes = getChildNodes(currentNode);
      if (childNodes && parentNode) {
        const childCount = childNodes.length;
        for (let i = childCount - 1; i >= 0; --i) {
          const hoisted = currentNode === root ? cloneNode(childNodes[i], true) : childNodes[i];
          parentNode.insertBefore(hoisted, getNextSibling(currentNode));
        }
      }
    }
    _forceRemove(currentNode);
    return true;
  };
  const _forkSharedAllowlist = function _forkSharedAllowlist2(hookList, set, defaultSet, setConfigSet) {
    if (hookList.length === 0) {
      return set;
    }
    return set === defaultSet || set === setConfigSet ? clone(set) : set;
  };
  const _sanitizeElements = function _sanitizeElements2(currentNode, root) {
    _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
    if (currentNode !== root && getParentNode(currentNode) === null) {
      if (IN_PLACE) {
        _neutralizeSubtree(currentNode);
      }
      return true;
    }
    if (_isClobbered(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    const tagName = transformCaseFunc(getNodeName ? getNodeName(currentNode) : currentNode.nodeName);
    ALLOWED_TAGS = _forkSharedAllowlist(hooks.uponSanitizeElement, ALLOWED_TAGS, DEFAULT_ALLOWED_TAGS, SET_CONFIG_ALLOWED_TAGS);
    _executeHooks(hooks.uponSanitizeElement, currentNode, {
      tagName,
      allowedTags: ALLOWED_TAGS
    });
    if (currentNode !== root && getParentNode(currentNode) === null) {
      if (IN_PLACE) {
        _neutralizeSubtree(currentNode);
      }
      return true;
    }
    if (_isUnsafeNode(currentNode, tagName)) {
      _forceRemove(currentNode);
      return true;
    }
    if (FORBID_TAGS[tagName] || !(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && !ALLOWED_TAGS[tagName]) {
      const removed = _sanitizeDisallowedNode(currentNode, tagName, root);
      if (removed === false) {
        _executeHooks(hooks.afterSanitizeElements, currentNode, null);
      }
      return removed;
    }
    const nt = getNodeType ? getNodeType(currentNode) : currentNode.nodeType;
    if (nt === NODE_TYPE.element && !_checkValidNamespace(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(FALLBACK_TAG_CLOSE, currentNode.innerHTML)) {
      _forceRemove(currentNode);
      return true;
    }
    if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
      const content = _stripTemplateExpressions(currentNode.textContent);
      if (currentNode.textContent !== content) {
        arrayPush(DOMPurify.removed, {
          element: currentNode.cloneNode()
        });
        currentNode.textContent = content;
      }
    }
    _executeHooks(hooks.afterSanitizeElements, currentNode, null);
    return false;
  };
  const _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
    if (FORBID_ATTR[lcName]) {
      return false;
    }
    if (SAFE_FOR_XML && lcName === "patchsrc") {
      return false;
    }
    if (SAFE_FOR_XML && lcName === "for" && lcTag !== "label" && lcTag !== "output") {
      return false;
    }
    if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) {
      return false;
    }
    const nameIsPermitted = ALLOWED_ATTR[lcName] || EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag);
    if (ALLOW_DATA_ATTR && regExpTest(DATA_ATTR$1, lcName)) ;
    else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName)) ;
    else if (!nameIsPermitted) {
      if (
        // First condition does a very basic check if a) it's basically a valid custom element tagname AND
        // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
        _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName, lcTag)) || // Alternative, second condition checks if it's an `is`-attribute, AND
        // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))
      ) ;
      else {
        return false;
      }
    } else if (URI_SAFE_ATTRIBUTES[lcName]) ;
    else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE$1, ""))) ;
    else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) ;
    else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$1, stringReplace(value, ATTR_WHITESPACE$1, ""))) ;
    else if (value) {
      return false;
    } else ;
    return true;
  };
  const RESERVED_CUSTOM_ELEMENT_NAMES = addToSet({}, ["annotation-xml", "color-profile", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "missing-glyph"]);
  const _isBasicCustomElement = function _isBasicCustomElement2(tagName) {
    return !RESERVED_CUSTOM_ELEMENT_NAMES[stringToLowerCase(tagName)] && regExpTest(CUSTOM_ELEMENT$1, tagName);
  };
  const _applyTrustedTypesToAttribute = function _applyTrustedTypesToAttribute2(lcTag, lcName, namespaceURI, value) {
    if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function" && !namespaceURI) {
      switch (trustedTypes.getAttributeType(lcTag, lcName)) {
        case "TrustedHTML": {
          return _createTrustedHTML(value);
        }
        case "TrustedScriptURL": {
          return _createTrustedScriptURL(value);
        }
      }
    }
    return value;
  };
  const _setAttributeValue = function _setAttributeValue2(currentNode, name, namespaceURI, value) {
    try {
      if (namespaceURI) {
        currentNode.setAttributeNS(namespaceURI, name, value);
      } else {
        currentNode.setAttribute(name, value);
      }
      if (_isClobbered(currentNode)) {
        _forceRemove(currentNode);
      } else {
        arrayPop(DOMPurify.removed);
      }
    } catch (_) {
      _removeAttribute(name, currentNode);
    }
  };
  const _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
    _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
    const attributes = currentNode.attributes;
    if (!attributes || _isClobbered(currentNode)) {
      return;
    }
    ALLOWED_ATTR = _forkSharedAllowlist(hooks.uponSanitizeAttribute, ALLOWED_ATTR, DEFAULT_ALLOWED_ATTR, SET_CONFIG_ALLOWED_ATTR);
    const hookEvent = {
      attrName: "",
      attrValue: "",
      keepAttr: true,
      allowedAttributes: ALLOWED_ATTR,
      forceKeepAttr: void 0
    };
    let l2 = attributes.length;
    const lcTag = transformCaseFunc(currentNode.nodeName);
    while (l2--) {
      const attr = attributes[l2];
      const name = attr.name, namespaceURI = attr.namespaceURI, attrValue = attr.value;
      const lcName = transformCaseFunc(name);
      const initValue = attrValue;
      let value = name === "value" ? initValue : stringTrim(initValue);
      hookEvent.attrName = lcName;
      hookEvent.attrValue = value;
      hookEvent.keepAttr = true;
      hookEvent.forceKeepAttr = void 0;
      _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
      value = hookEvent.attrValue;
      if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name") && stringIndexOf(value, SANITIZE_NAMED_PROPS_PREFIX) !== 0) {
        _removeAttribute(name, currentNode);
        value = SANITIZE_NAMED_PROPS_PREFIX + value;
      }
      if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (lcName === "attributename" && stringMatch(value, "href")) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (hookEvent.forceKeepAttr) {
        continue;
      }
      if (!hookEvent.keepAttr) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(SELF_CLOSING_TAG, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (SAFE_FOR_TEMPLATES) {
        value = _stripTemplateExpressions(value);
      }
      if (!_isValidAttribute(lcTag, lcName, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      value = _applyTrustedTypesToAttribute(lcTag, lcName, namespaceURI, value);
      if (value !== initValue) {
        _setAttributeValue(currentNode, name, namespaceURI, value);
      }
    }
    _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
  };
  const _sanitizeShadowDOM2 = function _sanitizeShadowDOM(fragment) {
    let shadowNode = null;
    const shadowIterator = _createNodeIterator(fragment);
    _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
    while (shadowNode = shadowIterator.nextNode()) {
      _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
      _sanitizeElements(shadowNode, fragment);
      _sanitizeAttributes(shadowNode);
      if (_isDocumentFragment(shadowNode.content)) {
        _sanitizeShadowDOM2(shadowNode.content);
      }
      const shadowNodeType = getNodeType ? getNodeType(shadowNode) : shadowNode.nodeType;
      if (shadowNodeType === NODE_TYPE.element) {
        const innerSr = getShadowRoot(shadowNode);
        if (_isDocumentFragment(innerSr)) {
          _sanitizeAttachedShadowRoots(innerSr);
          _sanitizeShadowDOM2(innerSr);
        }
      }
    }
    _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
  };
  const _sanitizeAttachedShadowRoots = function _sanitizeAttachedShadowRoots2(root) {
    const stack = [{
      node: root,
      shadow: null
    }];
    while (stack.length > 0) {
      const item = stack.pop();
      if (item.shadow) {
        _sanitizeShadowDOM2(item.shadow);
        continue;
      }
      const node = item.node;
      const nodeType = getNodeType ? getNodeType(node) : node.nodeType;
      const isElement = nodeType === NODE_TYPE.element;
      const childNodes = getChildNodes(node);
      if (childNodes) {
        for (let i = childNodes.length - 1; i >= 0; --i) {
          stack.push({
            node: childNodes[i],
            shadow: null
          });
        }
      }
      if (isElement) {
        const rootName = getNodeName ? getNodeName(node) : null;
        if (typeof rootName === "string" && transformCaseFunc(rootName) === "template") {
          const content = node.content;
          if (_isDocumentFragment(content)) {
            stack.push({
              node: content,
              shadow: null
            });
          }
        }
      }
      if (isElement) {
        const sr = getShadowRoot(node);
        if (_isDocumentFragment(sr)) {
          stack.push({
            node: null,
            shadow: sr
          }, {
            node: sr,
            shadow: null
          });
        }
      }
    }
  };
  DOMPurify.sanitize = function(dirty) {
    let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let body = null;
    let importedNode = null;
    let currentNode = null;
    let returnNode = null;
    IS_EMPTY_INPUT = !dirty;
    if (IS_EMPTY_INPUT) {
      dirty = "<!-->";
    }
    if (typeof dirty !== "string" && !_isNode(dirty)) {
      dirty = stringifyValue(dirty);
      if (typeof dirty !== "string") {
        throw typeErrorCreate("dirty is not a string, aborting");
      }
    }
    if (!DOMPurify.isSupported) {
      return dirty;
    }
    if (SET_CONFIG) {
      ALLOWED_TAGS = SET_CONFIG_ALLOWED_TAGS;
      ALLOWED_ATTR = SET_CONFIG_ALLOWED_ATTR;
    } else {
      _parseConfig(cfg);
    }
    if (hooks.uponSanitizeElement.length > 0 || hooks.uponSanitizeAttribute.length > 0) {
      ALLOWED_TAGS = clone(ALLOWED_TAGS);
    }
    if (hooks.uponSanitizeAttribute.length > 0) {
      ALLOWED_ATTR = clone(ALLOWED_ATTR);
    }
    DOMPurify.removed = [];
    const inPlace = IN_PLACE && typeof dirty !== "string" && _isNode(dirty);
    if (inPlace) {
      _neutralizePatchLinkage(dirty);
      const nn = getNodeName ? getNodeName(dirty) : dirty.nodeName;
      if (typeof nn === "string") {
        const tagName = transformCaseFunc(nn);
        if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
          _neutralizeRoot(dirty);
          throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
        }
      }
      if (_isClobbered(dirty)) {
        _neutralizeRoot(dirty);
        throw typeErrorCreate("root node is clobbered and cannot be sanitized in-place");
      }
      try {
        _sanitizeAttachedShadowRoots(dirty);
      } catch (error) {
        _neutralizeRoot(dirty);
        throw error;
      }
    } else if (_isNode(dirty)) {
      body = _initDocument("<!---->");
      importedNode = body.ownerDocument.importNode(dirty, true);
      if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") {
        body = importedNode;
      } else if (importedNode.nodeName === "HTML") {
        body = importedNode;
      } else {
        body.appendChild(importedNode);
      }
      _sanitizeAttachedShadowRoots(importedNode);
    } else {
      if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
      dirty.indexOf("<") === -1) {
        return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(dirty) : dirty;
      }
      body = _initDocument(dirty);
      if (!body) {
        return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
      }
    }
    if (body && FORCE_BODY) {
      _forceRemove(body.firstChild);
    }
    const walkRoot = inPlace ? dirty : body;
    try {
      const nodeIterator = _createNodeIterator(walkRoot);
      while (currentNode = nodeIterator.nextNode()) {
        _sanitizeElements(currentNode, walkRoot);
        _sanitizeAttributes(currentNode);
        if (_isDocumentFragment(currentNode.content)) {
          _sanitizeShadowDOM2(currentNode.content);
        }
      }
    } catch (error) {
      if (inPlace) {
        _neutralizeRoot(dirty);
        arrayForEach(DOMPurify.removed, (entry) => {
          if (entry.element) {
            _neutralizeSubtree(entry.element);
          }
        });
      }
      throw error;
    }
    if (inPlace) {
      arrayForEach(DOMPurify.removed, (entry) => {
        if (entry.element) {
          _neutralizeSubtree(entry.element);
        }
      });
      if (SAFE_FOR_TEMPLATES) {
        _scrubTemplateExpressions2(dirty);
      }
      return dirty;
    }
    if (RETURN_DOM) {
      if (SAFE_FOR_TEMPLATES) {
        _scrubTemplateExpressions2(body);
      }
      if (RETURN_DOM_FRAGMENT) {
        returnNode = createDocumentFragment.call(body.ownerDocument);
        while (body.firstChild) {
          returnNode.appendChild(body.firstChild);
        }
      } else {
        returnNode = body;
      }
      if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
        returnNode = importNode.call(originalDocument, returnNode, true);
      }
      return returnNode;
    }
    let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
    if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
      serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
    }
    if (SAFE_FOR_TEMPLATES) {
      serializedHTML = _stripTemplateExpressions(serializedHTML);
    }
    return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(serializedHTML) : serializedHTML;
  };
  DOMPurify.setConfig = function() {
    let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    _parseConfig(cfg);
    SET_CONFIG = true;
    SET_CONFIG_ALLOWED_TAGS = ALLOWED_TAGS;
    SET_CONFIG_ALLOWED_ATTR = ALLOWED_ATTR;
  };
  DOMPurify.clearConfig = function() {
    CONFIG = null;
    SET_CONFIG = false;
    SET_CONFIG_ALLOWED_TAGS = null;
    SET_CONFIG_ALLOWED_ATTR = null;
    trustedTypesPolicy = defaultTrustedTypesPolicy;
    emptyHTML = "";
  };
  DOMPurify.isValidAttribute = function(tag, attr, value) {
    if (!CONFIG) {
      _parseConfig({});
    }
    const lcTag = transformCaseFunc(tag);
    const lcName = transformCaseFunc(attr);
    return _isValidAttribute(lcTag, lcName, value);
  };
  DOMPurify.addHook = function(entryPoint, hookFunction) {
    if (typeof hookFunction !== "function") {
      return;
    }
    if (!objectHasOwnProperty(hooks, entryPoint)) {
      return;
    }
    arrayPush(hooks[entryPoint], hookFunction);
  };
  DOMPurify.removeHook = function(entryPoint, hookFunction) {
    if (!objectHasOwnProperty(hooks, entryPoint)) {
      return void 0;
    }
    if (hookFunction !== void 0) {
      const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
      return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
    }
    return arrayPop(hooks[entryPoint]);
  };
  DOMPurify.removeHooks = function(entryPoint) {
    if (!objectHasOwnProperty(hooks, entryPoint)) {
      return;
    }
    hooks[entryPoint] = [];
  };
  DOMPurify.removeAllHooks = function() {
    hooks = _createHooksMap();
  };
  return DOMPurify;
}
var purify = createDOMPurify();
function plainTextFromHtml(raw) {
  if (!raw) return "";
  const div = document.createElement("div");
  div.innerHTML = raw.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&amp;/g, "&");
  return (div.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 300);
}
let workerPromise;
function getWorker() {
  if (workerPromise === void 0) {
    workerPromise = new Promise((resolve) => {
      try {
        const w2 = new Worker(
          new URL(
            /* @vite-ignore */
            "" + new URL("article-cleaner.worker-Cyvlqnu5.js", import.meta.url).href,
            import.meta.url
          ),
          { type: "module" }
        );
        resolve(w2);
      } catch {
        console.warn("[reader] Web Worker 不可用，回退到主线程清洗");
        resolve(null);
      }
    });
  }
  return workerPromise;
}
async function cleanArticleHtml(raw) {
  if (!raw || !raw.trim()) return "";
  const worker = await getWorker();
  if (!worker) return renderArticleHtml(raw);
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve(renderArticleHtml(raw));
    }, 3e3);
    worker.onmessage = (e) => {
      clearTimeout(timer);
      resolve(e.data || "");
    };
    worker.onerror = () => {
      clearTimeout(timer);
      resolve(renderArticleHtml(raw));
    };
    worker.postMessage({ html: raw });
  });
}
const LAZY_SRC_ATTRS = ["data-src", "data-original", "data-lazy-src", "data-true-src", "data-srcset", "data-lazy-srcset"];
const PLACEHOLDER_RE = /^(data:image\/(gif|png|svg\+xml);base64,)/i;
function isPlaceholder(src) {
  if (!src) return true;
  return PLACEHOLDER_RE.test(src) || src.trim() === "";
}
function renderArticleHtml(raw) {
  if (!raw || !raw.trim()) return "";
  let doc;
  try {
    doc = new DOMParser().parseFromString(raw, "text/html");
  } catch {
    return purify.sanitize(raw);
  }
  doc.querySelectorAll("*").forEach((el2) => {
    el2.removeAttribute("style");
    el2.removeAttribute("class");
    Array.from(el2.attributes).forEach((attr) => {
      const n2 = attr.name.toLowerCase();
      if (n2.startsWith("data-") && n2 !== "data-zoom") el2.removeAttribute(attr.name);
    });
  });
  doc.querySelectorAll("img").forEach((img) => {
    if (isPlaceholder(img.getAttribute("src"))) {
      for (const a of LAZY_SRC_ATTRS) {
        const v2 = img.getAttribute(a)?.trim();
        if (v2 && !v2.startsWith("data:")) {
          img.setAttribute("src", v2);
          break;
        }
      }
    }
    img.removeAttribute("width");
    img.removeAttribute("height");
    img.setAttribute("loading", "lazy");
    img.setAttribute("decoding", "async");
    img.setAttribute("referrerpolicy", "no-referrer");
    img.setAttribute("data-zoom", "1");
  });
  doc.querySelectorAll("a[href]").forEach((a) => {
    a.setAttribute("rel", "noopener noreferrer");
    a.setAttribute("target", "_blank");
  });
  doc.querySelectorAll("iframe").forEach((f2) => {
    const src = f2.getAttribute("src")?.trim() ?? "";
    const p2 = doc.createElement("p");
    p2.className = "embed-fallback";
    if (src && /^https?:/i.test(src)) {
      const a = doc.createElement("a");
      a.href = src;
      a.textContent = "查看嵌入内容（视频 / 外链）";
      p2.appendChild(a);
    } else {
      p2.textContent = "（已省略嵌入内容）";
    }
    f2.replaceWith(p2);
  });
  doc.querySelectorAll("p, div, section, article, span").forEach((el2) => {
    const hasMedia = el2.querySelector("img, video, picture, figure, blockquote, pre, table, a, iframe");
    if (!hasMedia && !(el2.textContent ?? "").trim()) el2.remove();
  });
  const body = doc.body?.innerHTML ?? "";
  return purify.sanitize(body, {
    FORBID_TAGS: ["style", "script", "noscript", "iframe", "form", "input", "button", "textarea", "select", "canvas"],
    FORBID_ATTR: ["style", "class", "id", "onerror", "onload", "onclick", "onmouseover", "onerror"],
    ADD_ATTR: ["target", "rel", "loading", "decoding", "referrerpolicy", "data-zoom"]
  });
}
function extractPreviewFromHeading(h) {
  const MAX = 120;
  const parts = [];
  let total = 0;
  let n2 = h.nextElementSibling;
  while (n2 && total < MAX) {
    if (/^H[1-6]$/.test(n2.tagName)) break;
    const txt = (n2.textContent ?? "").replace(/\s+/g, " ").trim();
    if (txt) {
      parts.push(txt);
      total += txt.length;
    }
    n2 = n2.nextElementSibling;
  }
  const merged = parts.join("\n").trim();
  return merged.length > MAX ? merged.slice(0, MAX).trimEnd() + "…" : merged;
}
function extractSectionLength(h) {
  let total = 0;
  let n2 = h.nextElementSibling;
  while (n2) {
    if (/^H[1-6]$/.test(n2.tagName)) break;
    const txt = (n2.textContent ?? "").replace(/\s+/g, " ").trim();
    if (txt) total += txt.length;
    n2 = n2.nextElementSibling;
  }
  return total;
}
function buildToc(rawHtml) {
  if (!rawHtml || !rawHtml.trim()) return { html: rawHtml, toc: [] };
  let doc;
  try {
    doc = new DOMParser().parseFromString(rawHtml, "text/html");
  } catch {
    return { html: rawHtml, toc: [] };
  }
  const heads = Array.from(doc.querySelectorAll("h1, h2, h3, h4, h5, h6"));
  const toc = [];
  const seen = /* @__PURE__ */ new Map();
  if (heads.length >= 2) {
    heads.forEach((h, i) => {
      const text2 = (h.textContent ?? "").replace(/\s+/g, " ").trim();
      if (!text2) return;
      const level = Number(h.tagName[1]) || 1;
      if (level < 2 && heads.length > 2) return;
      let base = text2.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "");
      if (!base) base = `h${i}`;
      const used = seen.get(base) ?? 0;
      const slug = used > 0 ? `${base}-${used}` : base;
      seen.set(base, used + 1);
      const id2 = `toc-${slug}`;
      h.setAttribute("id", id2);
      const preview = extractPreviewFromHeading(h);
      const sectionChars = extractSectionLength(h);
      toc.push({ id: id2, text: text2, level, preview, sectionChars });
    });
  }
  if (toc.length < 2) {
    toc.length = 0;
    const blocks = Array.from(doc.querySelectorAll("p, blockquote, pre, li, article > div, section > div"));
    const validBlocks = blocks.filter((b) => {
      const t2 = (b.textContent ?? "").replace(/\s+/g, " ").trim();
      return t2.length >= 18;
    });
    const step = validBlocks.length > 20 ? Math.ceil(validBlocks.length / 16) : 1;
    validBlocks.forEach((b, i) => {
      if (i % step !== 0 && i !== validBlocks.length - 1) return;
      const fullText = (b.textContent ?? "").replace(/\s+/g, " ").trim();
      if (!fullText) return;
      const firstSentenceMatch = fullText.match(/^([^。！？.!?\n]{6,38}[。！？.!?\n]?)/);
      const title = firstSentenceMatch ? firstSentenceMatch[1].trim() : fullText.slice(0, 32).trim() + (fullText.length > 32 ? "…" : "");
      const rest = fullText.slice(title.length).trim() || fullText;
      const preview = rest.length > 120 ? rest.slice(0, 120).trimEnd() + "…" : rest;
      const id2 = `toc-p-${i}`;
      b.setAttribute("id", id2);
      toc.push({
        id: id2,
        text: title,
        level: 2,
        preview: preview !== title ? preview : "",
        sectionChars: fullText.length
      });
    });
  }
  const html2 = doc.body?.innerHTML ?? rawHtml;
  return { html: html2, toc };
}
const SOURCE_LABEL = {
  rss: "RSS",
  x: "X",
  wechat: "公众号",
  tophub: "热榜",
  github: "GitHub",
  x_bookmark: "X书签",
  manual: "手动"
};
function relTime(iso) {
  if (!iso) return "";
  const d = new Date(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z");
  const m2 = Math.floor((Date.now() - d.getTime()) / 6e4);
  if (m2 < 1) return "刚刚";
  if (m2 < 60) return `${m2} 分钟前`;
  const h = Math.floor(m2 / 60);
  if (h < 24) return `${h} 小时前`;
  return `${Math.floor(h / 24)} 天前`;
}
function isFallbackPubDate(pub, fetch) {
  if (!pub || !fetch) return false;
  try {
    const pd2 = new Date(pub.includes("T") ? pub : pub.replace(" ", "T") + "Z");
    const fd2 = new Date(fetch.includes("T") ? fetch : fetch.replace(" ", "T") + "Z");
    return Math.abs(pd2.getTime() - fd2.getTime()) < 6e4;
  } catch {
    return false;
  }
}
const ITEM_SIZE = 164;
const LIST_ITEM_SIZE = 88;
function Row({ index, style, data }) {
  const item = data.items[index];
  const later = item.status === "later";
  const fav = item.status === "favorite";
  const read = item.is_read === 1;
  const stop = (e) => {
    e.stopPropagation();
  };
  const open = (e) => {
    e.stopPropagation();
    e.preventDefault();
    data.onOpen(item.url);
  };
  const toggleRead = (e) => {
    e.stopPropagation();
    e.preventDefault();
    data.onToggleRead(item.id);
  };
  const laterFn = (e) => {
    e.stopPropagation();
    e.preventDefault();
    data.onLater(item.id);
  };
  const favFn = (e) => {
    e.stopPropagation();
    e.preventDefault();
    data.onFavorite(item.id);
  };
  const del = (e) => {
    e.stopPropagation();
    e.preventDefault();
    data.onDelete(item.id);
  };
  const dragProps = {
    draggable: true,
    onDragStart: (e) => {
      e.dataTransfer.setData("application/x-item-id", String(item.id));
      e.dataTransfer.effectAllowed = "copy";
    }
  };
  if (data.mode === "list") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `list-row beam-border ${data.selectedId === item.id ? "selected" : ""} ${read ? "" : "unread"}`,
        ...dragProps,
        ...press(() => data.onSelect(item.id)),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-top", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `list-badge ${item.source_type}`, children: SOURCE_LABEL[item.source_type] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `list-time${isFallbackPubDate(item.published_at, item.fetched_at) ? " time-fallback" : ""}`, title: isFallbackPubDate(item.published_at, item.fetched_at) ? "采集时间（无发布日期）" : "", children: isFallbackPubDate(item.published_at, item.fetched_at) ? `采集 ${relTime(item.fetched_at)}` : relTime(item.published_at || item.fetched_at) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "list-title", children: item.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-actions", onClick: stop, onDragStart: stop, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "act", "data-act": "open", title: "用系统默认浏览器打开", onPointerDown: open, onClick: stop, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "external", size: 14 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `act ${read ? "on" : ""}`, "data-act": "read", title: read ? "标记为未读" : "标记为已读", onPointerDown: toggleRead, onClick: stop, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "check", size: 14 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `act ${later ? "on" : ""}`, "data-act": "later", title: "稍后读", onPointerDown: laterFn, onClick: stop, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "later", size: 14 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `act ${fav ? "on" : ""}`, "data-act": "fav", title: "收藏", onPointerDown: favFn, onClick: stop, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "favorite", size: 14, fill: fav ? "currentColor" : "none" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "act danger", title: "删除", onPointerDown: del, onClick: stop, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "trash", size: 14 }) })
          ] })
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `card beam-border ${data.selectedId === item.id ? "selected" : ""} ${read ? "" : "unread"}`,
      ...dragProps,
      ...press(() => data.onSelect(item.id)),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-meta", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `badge ${item.source_type}`, children: [
            SOURCE_LABEL[item.source_type],
            " · ",
            item.source_name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `card-time${isFallbackPubDate(item.published_at, item.fetched_at) ? " time-fallback" : ""}`, title: isFallbackPubDate(item.published_at, item.fetched_at) ? "采集时间（无发布日期）" : "", children: isFallbackPubDate(item.published_at, item.fetched_at) ? `采集 ${relTime(item.fetched_at)}` : relTime(item.published_at || item.fetched_at) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "card-title", children: item.title }),
        item.summary && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "card-summary", children: plainTextFromHtml(item.summary) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-actions", onClick: stop, onDragStart: stop, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "act", "data-act": "open", title: "用系统默认浏览器打开", onPointerDown: open, onClick: stop, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "external", size: 15 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `act ${read ? "on" : ""}`, "data-act": "read", title: read ? "标记为未读" : "标记为已读", onPointerDown: toggleRead, onClick: stop, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "check", size: 15 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `act ${later ? "on" : ""}`, "data-act": "later", title: "稍后读", onPointerDown: laterFn, onClick: stop, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "later", size: 15 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `act ${fav ? "on" : ""}`, "data-act": "fav", title: "收藏", onPointerDown: favFn, onClick: stop, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "favorite", size: 15, fill: fav ? "currentColor" : "none" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "act danger", title: "删除", onPointerDown: del, onClick: stop, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "trash", size: 15 }) })
        ] })
      ]
    }
  ) });
}
function ItemList() {
  const {
    items,
    selectedId,
    select,
    view,
    activeSourceType,
    markAllRead,
    clearInbox,
    showToast,
    openInBrowser,
    toggleRead,
    setStatus,
    deleteItem,
    feeds,
    itemsLoadingMore,
    itemsDone,
    loadMoreItems
  } = useStore();
  const viewLabel = { rss: "RSS", podcast: "播客", video: "视频", later: "稍后读", favorite: "已收藏", archived: "归档", all: "全部条目" }[view];
  const sourceLabelMap = { github: "GitHub ★", x_bookmark: "Twitter 书签" };
  const headerLabel = activeSourceType ? sourceLabelMap[activeSourceType] || SOURCE_LABEL[activeSourceType] || "来源" : viewLabel;
  const rssErrFeeds = feeds.filter((f2) => f2.error_count > 0 && f2.type === "rss");
  const showFetchError = view === "rss" && !activeSourceType && rssErrFeeds.length > 0;
  const emptyTitle = view === "rss" ? "RSS 为空" : "暂无条目";
  const emptyHint = view === "rss" ? "按 N 收集一个链接，或左侧「来源管理」添加订阅源。" : "当前视图没有条目。";
  const wrapRef = reactExports.useRef(null);
  const scrollTimerRef = reactExports.useRef(0);
  const [height, setHeight] = reactExports.useState(400);
  const [listMode, setListMode] = reactExports.useState("card");
  reactExports.useEffect(() => {
    void window.capybara.invoke("settings:get", "list_mode").then((r2) => {
      if (r2 === "list") setListMode("list");
    });
  }, []);
  const setListModeAndPersist = (m2) => {
    setListMode(m2);
    void window.capybara.invoke("settings:set", "list_mode", m2);
  };
  reactExports.useEffect(() => {
    const el2 = wrapRef.current;
    if (!el2) return;
    const ro = new ResizeObserver((entries2) => {
      setHeight(Math.max(120, entries2[0].contentRect.height));
    });
    ro.observe(el2);
    return () => ro.disconnect();
  }, []);
  const FOOTER_H = 44;
  const listHeight = Math.max(80, height - FOOTER_H);
  const onListScroll = ({ scrollOffset }) => {
    const el2 = wrapRef.current;
    if (el2) {
      el2.classList.add("is-scrolling");
      window.clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = window.setTimeout(() => el2.classList.remove("is-scrolling"), 900);
    }
    if (itemsDone || itemsLoadingMore || items.length === 0) return;
    const rowH = listMode === "list" ? LIST_ITEM_SIZE : ITEM_SIZE;
    const total = items.length * rowH;
    if (scrollOffset + listHeight >= total - rowH * 0.8) void loadMoreItems();
  };
  const onClear = () => {
    if (view !== "rss") {
      showToast("仅「RSS」可清空");
      return;
    }
    void clearInbox();
  };
  const rowData = {
    items,
    selectedId,
    mode: listMode,
    onSelect: (id2) => select(id2, { click: true }),
    onOpen: (url) => openInBrowser(url),
    onToggleRead: (id2) => void toggleRead(id2),
    onLater: (id2) => void setStatus(id2, "later"),
    onFavorite: (id2) => void setStatus(id2, "favorite"),
    onDelete: (id2) => void deleteItem(id2)
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "feed", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "feed-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "title", children: headerLabel }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "feed-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "feed-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-toggle", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: listMode === "card" ? "active" : "",
              title: "卡片视图",
              ...pressBtn(() => setListModeAndPersist("card")),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "board", size: 15 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: listMode === "list" ? "active" : "",
              title: "列表视图",
              ...pressBtn(() => setListModeAndPersist("list")),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "list", size: 15 })
            }
          )
        ] }),
        (view === "rss" || view === "podcast" || view === "video") && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "mini", title: `把${viewLabel}未读全部标为已读`, ...pressBtn(() => void markAllRead(view)), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "check", size: 13 }),
            " 标为已读"
          ] }),
          view === "rss" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "mini", title: "清空 RSS（保留收藏与白板引用）", ...pressBtn(() => onClear()), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "trash", size: 13 }),
            " 清空"
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "feed-list", ref: wrapRef, children: items.length === 0 ? showFetchError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "empty-title", children: "无法获取数据" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "以下订阅源抓取失败，请检查网络或源地址：" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "err-list", children: rssErrFeeds.map((f2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: f2.name || f2.url }),
        "：",
        f2.last_error || "未知错误"
      ] }, f2.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-hint", children: "可在「来源管理」手动刷新单个源，或检查是否需要代理 / VPN。" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "empty-title", children: emptyTitle }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: emptyHint })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FixedSizeList,
        {
          height: listHeight,
          width: "100%",
          itemCount: items.length,
          itemSize: listMode === "list" ? LIST_ITEM_SIZE : ITEM_SIZE,
          itemData: rowData,
          overscanCount: 6,
          onScroll: onListScroll,
          children: Row
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "feed-footer", children: itemsLoadingMore ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "spin" }),
        " 加载中…"
      ] }) : itemsDone ? `已显示全部 ${items.length} 条` : `已显示 ${items.length} 条 · 滚动到底部加载更多` })
    ] }) })
  ] });
}
function fmtDuration(sec) {
  if (!sec || sec < 0) return "";
  const s = Math.floor(sec % 60);
  const m2 = Math.floor(sec / 60 % 60);
  const h = Math.floor(sec / 3600);
  const mm = String(m2).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${m2}:${ss}`;
}
function ReaderPane() {
  const { selectedId, openInBrowser, appearance, updateAppearance, toggleZenMode } = useStore();
  const [item, setItem] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [noImg, setNoImg] = reactExports.useState(false);
  const [lightbox, setLightbox] = reactExports.useState(null);
  const [cleanHtml, setCleanHtml] = reactExports.useState("");
  const bodyRef = reactExports.useRef(null);
  const [activeId, setActiveId] = reactExports.useState("");
  const [tip, setTip] = reactExports.useState(null);
  const [fetchingReadme, setFetchingReadme] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (selectedId == null) {
      setItem(null);
      return;
    }
    let alive = true;
    setLoading(true);
    window.capybara.invoke("items:get", selectedId).then((r2) => {
      if (alive) {
        setItem(r2 ?? null);
        setLoading(false);
      }
    }).catch(() => {
      if (alive) setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [selectedId]);
  reactExports.useEffect(() => {
    if (!item || item.source_type !== "github") return;
    if (item.content_html) return;
    let alive = true;
    setFetchingReadme(true);
    window.capybara.invoke("github:fetchReadme", item.id).then((r2) => {
      if (!alive) return;
      const { html: html22 } = r2;
      if (html22) {
        setItem((prev) => prev ? { ...prev, content_html: html22 } : prev);
      }
      setFetchingReadme(false);
    }).catch(() => {
      if (alive) setFetchingReadme(false);
    });
    return () => {
      alive = false;
    };
  }, [item]);
  reactExports.useEffect(() => {
    if (!item) {
      setCleanHtml("");
      return;
    }
    const html22 = item.content_html;
    if (!html22) {
      setCleanHtml("");
      return;
    }
    let alive = true;
    void cleanArticleHtml(html22).then((clean) => {
      if (alive) setCleanHtml(clean);
    });
    return () => {
      alive = false;
    };
  }, [item]);
  reactExports.useEffect(() => {
    void window.capybara.invoke("settings:get", "reader_noimg").then((r2) => setNoImg(r2 === "1"));
  }, [selectedId]);
  const { html: html2, toc } = reactExports.useMemo(() => {
    const raw = cleanHtml || (item?.content_html ? renderArticleHtml(item.content_html) : "");
    if (!raw) return { html: "", toc: [] };
    return buildToc(raw);
  }, [cleanHtml, item]);
  const scrollToHeading = (id2) => {
    const body = bodyRef.current;
    if (!body) return;
    const el2 = body.querySelector(`#${CSS.escape(id2)}`);
    if (!el2) return;
    const top = el2.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop - 18;
    body.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    setActiveId(id2);
  };
  reactExports.useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    if (toc.length === 0) {
      setActiveId("");
      return;
    }
    let raf = 0;
    const compute = () => {
      raf = 0;
      const bTop = body.getBoundingClientRect().top;
      const threshold = 110;
      let cur = toc[0]?.id || "";
      for (const h of toc) {
        const el2 = body.querySelector(`#${CSS.escape(h.id)}`);
        if (!el2) continue;
        const rel = el2.getBoundingClientRect().top - bTop;
        if (rel - threshold <= 0) cur = h.id;
        else break;
      }
      setActiveId((prev) => prev === cur ? prev : cur);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    body.addEventListener("scroll", onScroll, { passive: true });
    compute();
    return () => {
      body.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [toc]);
  if (selectedId == null || !item) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "reader", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reader-empty", children: [
      "选择左侧条目开始阅读 · J/K 快速浏览",
      loading ? " · 加载中…" : ""
    ] }) });
  }
  const showReadmeLoading = item.source_type === "github" && !html2 && fetchingReadme;
  const toggleNoImg = () => {
    const v2 = !noImg;
    setNoImg(v2);
    void window.capybara.invoke("settings:set", "reader_noimg", v2 ? "1" : "0");
  };
  const onContentClick = (e) => {
    const img = e.target.closest("img[data-zoom]");
    if (img && img.getAttribute("src")) {
      e.preventDefault();
      setLightbox(img.getAttribute("src"));
      return;
    }
    const a = e.target.closest("a");
    if (a && a.getAttribute("href")) {
      e.preventDefault();
      openInBrowser(a.getAttribute("href"), { x: e.clientX, y: e.clientY });
    }
  };
  const contentClass = `reader-content ${noImg ? "no-img" : ""}`;
  const allThemes = getAllReadingThemes();
  const darkThemes = allThemes.filter((t2) => t2.mode === "dark");
  const lightThemes = allThemes.filter((t2) => t2.mode === "light");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "reader", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reader-bar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "rb-toggle", onClick: toggleZenMode, title: "专注模式：隐藏侧栏与列表，全屏阅读", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "maximize", size: 14 }),
        " 专注"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `rb-toggle ${noImg ? "on" : ""}`, onClick: toggleNoImg, title: "隐藏正文中的图片 / 视频，纯文字阅读", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: noImg ? "eye" : "eyeOff", size: 14 }),
        " 无图模式"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rb-spacer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          className: "rb-theme-select",
          value: appearance.readingTheme || FOLLOW_UI_ID,
          onChange: (e) => updateAppearance({ readingTheme: e.target.value }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: FOLLOW_UI_ID, children: "🎨 跟随界面" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("optgroup", { label: "── 暗色主题 ──", children: darkThemes.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t2.id, children: t2.name }, t2.id)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("optgroup", { label: "── 亮色主题 ──", children: lightThemes.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t2.id, children: t2.name }, t2.id)) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reader-body-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reader-body", ref: bodyRef, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "reader-title-link", href: item.url, onClick: (e) => {
          e.preventDefault();
          openInBrowser(item.url, { x: e.clientX, y: e.clientY });
        }, title: "用系统默认浏览器打开", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "reader-title", children: item.title }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reader-meta", children: item.author || item.source_name }),
        item.kind === "podcast" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "media-podcast", children: [
          item.media_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("audio", { controls: true, src: item.media_url, className: "podcast-player", preload: "none" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "media-empty", children: "该期暂无音频链接" }),
          item.duration > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "podcast-meta", children: [
            "时长 ",
            fmtDuration(item.duration)
          ] }),
          html2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: contentClass, onClick: onContentClick, dangerouslySetInnerHTML: { __html: html2 } }),
          item.transcript && /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "podcast-transcript", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { children: "转录文稿（ASR）" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "podcast-transcript-body", children: item.transcript })
          ] })
        ] }) : item.kind === "video" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "media-video", children: [
          item.media_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "video-frame", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "iframe",
            {
              src: item.media_url,
              title: item.title,
              allowFullScreen: true,
              allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
              referrerPolicy: "no-referrer"
            }
          ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "video-fallback", href: item.url, onClick: (e) => {
            e.preventDefault();
            openInBrowser(item.url, { x: e.clientX, y: e.clientY });
          }, children: "无法内嵌播放，用浏览器打开" }),
          html2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: contentClass, onClick: onContentClick, dangerouslySetInnerHTML: { __html: html2 } })
        ] }) : html2 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: contentClass, onClick: onContentClick, dangerouslySetInnerHTML: { __html: html2 } }) : showReadmeLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${contentClass} plain`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--text-2)" }, children: "正在从 GitHub 拉取 README…" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${contentClass} plain`, onClick: onContentClick, children: plainTextFromHtml(item.content_text || item.summary) || "（无正文快照，等待采集器抓取全文）" }),
        lightbox && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lightbox", onClick: () => setLightbox(null), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: lightbox, alt: "", onClick: (e) => e.stopPropagation() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "lightbox-hint", children: "点击任意处关闭" })
        ] })
      ] }),
      toc.length > 0 && (() => {
        const tipHead = tip ? toc.find((t2) => t2.id === tip.id) : null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "reader-toc-rail", "aria-label": "正文快速跳转", onMouseLeave: () => setTip(null), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reader-toc-track", children: toc.map((h) => {
            const w2 = Math.max(12, Math.min(30, 12 + Math.floor(h.sectionChars / 60)));
            const isActive = activeId === h.id;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: `toc-tick ${isActive ? "is-active" : ""}`,
                style: { "--tick-w": `${w2}px` },
                "aria-label": h.text,
                "aria-current": isActive ? "true" : void 0,
                onMouseEnter: (e) => {
                  const btn = e.currentTarget;
                  const rail = btn.closest(".reader-toc-rail");
                  if (btn && rail) {
                    const br = btn.getBoundingClientRect();
                    const rr = rail.getBoundingClientRect();
                    setTip({ id: h.id, top: br.top - rr.top + br.height / 2 });
                  }
                },
                onFocus: (e) => {
                  const btn = e.currentTarget;
                  const rail = btn.closest(".reader-toc-rail");
                  if (btn && rail) {
                    const br = btn.getBoundingClientRect();
                    const rr = rail.getBoundingClientRect();
                    setTip({ id: h.id, top: br.top - rr.top + br.height / 2 });
                  }
                },
                onBlur: () => setTip(null),
                onClick: () => {
                  setTip(null);
                  scrollToHeading(h.id);
                }
              },
              h.id
            );
          }) }),
          tipHead && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toc-rail-tooltip", style: { top: `${tip.top}px` }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "toc-rail-tooltip__title", children: tipHead.text }),
            tipHead.preview && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "toc-rail-tooltip__preview", children: tipHead.preview })
          ] })
        ] });
      })()
    ] })
  ] });
}
function QuickAdd() {
  const { quickAddOpen, setQuickAddOpen, quickAdd } = useStore();
  const [url, setUrl] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (quickAddOpen) {
      setUrl("");
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [quickAddOpen]);
  if (!quickAddOpen) return null;
  const submit = async () => {
    if (!url.trim() || busy) return;
    setBusy(true);
    await quickAdd(url.trim());
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-mask", ...press(() => setQuickAddOpen(false)), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal", onClick: (e) => e.stopPropagation(), onPointerDown: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "modal-title", children: "快速收集" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: inputRef,
        placeholder: "粘贴 URL，回车收入 RSS…",
        value: url,
        onChange: (e) => setUrl(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Enter") void submit();
          if (e.key === "Escape") setQuickAddOpen(false);
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-foot", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ...pressBtn(() => setQuickAddOpen(false)), children: "取消" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ...pressBtn(() => void submit()), disabled: busy, children: busy ? "抓取中…" : "收集" })
    ] })
  ] }) });
}
let searchTimer = null;
function CommandSearch() {
  const { cmdkOpen, setCmdkOpen, setSearch, select, setSourceType, setView } = useStore();
  const [query, setQuery] = reactExports.useState("");
  const [results, setResults] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [activeIndex, setActiveIndex] = reactExports.useState(0);
  const inputRef = reactExports.useRef(null);
  const listRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (cmdkOpen) {
      setQuery("");
      setResults([]);
      setActiveIndex(0);
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [cmdkOpen]);
  reactExports.useEffect(() => {
    if (!cmdkOpen) return;
    if (searchTimer) clearTimeout(searchTimer);
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    searchTimer = setTimeout(async () => {
      try {
        const rows = await window.capybara.invoke("items:list", "all", query.trim(), "__search_all__", null);
        setResults(rows.slice(0, 50));
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 200);
    return () => {
      if (searchTimer) clearTimeout(searchTimer);
    };
  }, [query, cmdkOpen]);
  reactExports.useEffect(() => {
    const el2 = listRef.current?.querySelector(`[data-idx="${activeIndex}"]`);
    el2?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);
  const handleSelect = reactExports.useCallback((item) => {
    if (item.source_type === "github") {
      setSourceType("github");
    } else if (item.source_type === "x_bookmark") {
      setSourceType("x_bookmark");
    } else {
      setSourceType(null);
      setView("all");
    }
    setSearch("");
    setTimeout(() => select(item.id, { click: true }), 50);
    setCmdkOpen(false);
  }, [setSourceType, setView, setSearch, select, setCmdkOpen]);
  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[activeIndex];
      if (item) handleSelect(item);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setCmdkOpen(false);
    }
  };
  if (!cmdkOpen) return null;
  const typeLabel = (t2) => {
    const map = { github: "GitHub", x_bookmark: "Twitter", rss: "RSS", wechat: "微信", tophub: "热榜", manual: "手动" };
    return map[t2] || t2;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cmdk-mask", ...press(() => setCmdkOpen(false)), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cmdk-panel", onPointerDown: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cmdk-input-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "search", size: 18 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: inputRef,
          className: "cmdk-input",
          placeholder: "搜索条目…",
          value: query,
          onChange: (e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          },
          onKeyDown
        }
      ),
      loading && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "refresh", size: 16, className: "spin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "cmdk-kbd", children: "ESC" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cmdk-results", ref: listRef, children: [
      results.length === 0 && !loading && query.trim() && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cmdk-empty", children: [
        "未找到「",
        query,
        "」相关条目"
      ] }),
      results.length === 0 && !loading && !query.trim() && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cmdk-empty", children: "输入关键词搜索全部条目" }),
      results.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-idx": i,
          className: `cmdk-item ${i === activeIndex ? "active" : ""}`,
          onMouseEnter: () => setActiveIndex(i),
          onClick: () => handleSelect(item),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cmdk-item-type", children: typeLabel(item.source_type) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cmdk-item-body", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cmdk-item-title", children: item.title }),
              item.summary && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cmdk-item-summary", children: item.summary.slice(0, 80) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cmdk-item-source", children: item.source_name })
          ]
        },
        item.id
      ))
    ] })
  ] }) });
}
function fmtSize$1(n2) {
  if (!n2) return "";
  if (n2 < 1024) return `${n2} B`;
  if (n2 < 1024 * 1024) return `${(n2 / 1024).toFixed(1)} KB`;
  return `${(n2 / 1024 / 1024).toFixed(1)} MB`;
}
function CardEditor({ card, itemMap, onClose, onSave, onDelete, onOpenItem }) {
  const p2 = card.payload ? JSON.parse(card.payload) : {};
  const [title, setTitle] = reactExports.useState(card.title);
  const [body, setBody] = reactExports.useState(card.body);
  const [url, setUrl] = reactExports.useState(p2.url ?? "");
  const [note, setNote] = reactExports.useState(p2.note ?? card.body ?? "");
  const fileRef = reactExports.useRef(null);
  const assetSrc = p2.localPath ? `local-path://${p2.localPath}` : p2.file ? `board-asset://${p2.file}` : p2.url || "";
  reactExports.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const [linkFetching, setLinkFetching] = reactExports.useState(false);
  const saveText = () => onSave({ title, body });
  const saveLink = async () => {
    let preview = {};
    if (url && /^https?:\/\//.test(url)) {
      setLinkFetching(true);
      try {
        const r2 = await window.capybara.invoke("boards:fetchLinkPreview", url);
        if (r2) preview = { previewTitle: r2.title, previewDesc: r2.desc, previewImage: r2.image, previewSite: r2.site };
      } catch {
      }
      setLinkFetching(false);
    }
    onSave({ title, body: note, payload: JSON.stringify({ url, note, ...preview }) });
    useStore.getState().showToast(preview.previewTitle ? "链接预览已抓取" : "链接已保存");
  };
  const saveAsset = (sourcePath) => {
    const newPayload = JSON.stringify({ ...p2, note });
    const patch = { body: note, payload: newPayload };
    if (sourcePath) patch._sourcePath = sourcePath;
    onSave(patch);
  };
  const onReplace = (e) => {
    const f2 = e.target.files?.[0];
    if (!f2) return;
    const path = window.capybara.getPathForFile(f2);
    saveAsset(path);
    e.target.value = "";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-mask", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal card-editor", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-title", children: [
      "编辑卡片",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "card-kind-badge", children: card.kind })
    ] }),
    card.kind === "ref" && (() => {
      const it = card.item_id != null ? itemMap[card.item_id] : void 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ref-edit", children: it ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ref-edit-title", children: it.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "ref-edit-src", children: [
          it.source_name,
          " · ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: it.url, target: "_blank", rel: "noreferrer", onClick: (e) => e.stopPropagation(), children: it.url })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ref-edit-sum", children: it.summary || "（无摘要）" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          if (card.item_id != null) onOpenItem(card.item_id);
        }, children: "在阅读面板打开" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ref-edit-sum", children: "引用的条目已被删除。" }) });
    })(),
    card.kind === "text" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "edit-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "edit-title", placeholder: "标题（可选）", value: title, onChange: (e) => setTitle(e.target.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "edit-text", placeholder: "写点什么…", value: body, onChange: (e) => setBody(e.target.value) })
    ] }),
    card.kind === "link" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "edit-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "edit-title", placeholder: "标题", value: title, onChange: (e) => setTitle(e.target.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "edit-url", placeholder: "https://…", value: url, onChange: (e) => setUrl(e.target.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "edit-text", placeholder: "备注 / 描述（可选）", value: note, onChange: (e) => setNote(e.target.value) }),
      url && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "edit-open-link", href: url, target: "_blank", rel: "noreferrer", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "external", size: 13 }),
        " 打开链接"
      ] })
    ] }),
    (card.kind === "image" || card.kind === "video" || card.kind === "file") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "edit-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "asset-preview", children: [
        card.kind === "image" && assetSrc && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: assetSrc, alt: p2.name || title }),
        card.kind === "video" && assetSrc && /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: assetSrc, controls: true, preload: "metadata" }),
        card.kind === "video" && !assetSrc && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ref-edit-sum", children: "视频文件不可用" }),
        card.kind === "file" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "file-meta", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "file-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "file", size: 20 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p2.name || title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "file-size", children: fmtSize$1(p2.size) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => void window.capybara.invoke("boards:openFile", p2.file), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "external", size: 13 }),
            " 用默认程序打开"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "edit-text", placeholder: "备注（可选）", value: note, onChange: (e) => setNote(e.target.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "replace-btn", onClick: () => fileRef.current?.click(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "upload", size: 13 }),
        " 替换文件…"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", hidden: true, onChange: onReplace })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-foot", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "danger", onClick: () => {
        onDelete();
        onClose();
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "trash", size: 14 }),
        " 删除卡片"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "primary", disabled: linkFetching, onClick: async () => {
        if (card.kind === "text") saveText();
        else if (card.kind === "link") await saveLink();
        else saveAsset();
        onClose();
      }, children: linkFetching ? "抓取中…" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "check", size: 14 }),
        " 保存"
      ] }) })
    ] })
  ] }) });
}
const CARD_TYPES = [
  { kind: "text", label: "文本", icon: "type", desc: "一段想法或笔记" },
  { kind: "link", label: "链接", icon: "link", desc: "收藏一个网页" },
  { kind: "image", label: "图片", icon: "image", desc: "本地或远程图片" },
  { kind: "video", label: "视频", icon: "video", desc: "本地视频片段" },
  { kind: "file", label: "文件", icon: "file", desc: "任意本地文件" },
  { kind: "ref", label: "引用条目", icon: "ref", desc: "从信息流引用" }
];
function fmtSize(n2) {
  if (!n2) return "";
  if (n2 < 1024) return `${n2} B`;
  if (n2 < 1024 * 1024) return `${(n2 / 1024).toFixed(1)} KB`;
  return `${(n2 / 1024 / 1024).toFixed(1)} MB`;
}
function safeParse(p2) {
  try {
    return p2 ? JSON.parse(p2) : {};
  } catch {
    return {};
  }
}
const NO_PAN = "button, a, input, textarea, .board-toolbar, .board-center-palette, .card-edit, .card-del, .card-link-dot";
function BoardView() {
  const { cards, links, activeBoardId, boards, createBoard, addRefCard, addCard, moveCard, deleteCard, showToast, addLink, deleteLink, updateLink, renameBoard, deleteBoard, autoPos } = useStore();
  const [itemMap, setItemMap] = reactExports.useState({});
  const [pan, setPan] = reactExports.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = reactExports.useState(1);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [linking, setLinking] = reactExports.useState(null);
  const [linkCursor, setLinkCursor] = reactExports.useState(null);
  const [hoveredId, setHoveredId] = reactExports.useState(null);
  const [pickerOpen, setPickerOpen] = reactExports.useState(false);
  const [pickerItems, setPickerItems] = reactExports.useState([]);
  const [pickerQ, setPickerQ] = reactExports.useState("");
  const [editingName, setEditingName] = reactExports.useState(false);
  const [nameDraft, setNameDraft] = reactExports.useState("");
  const [editingLinkId, setEditingLinkId] = reactExports.useState(null);
  const [linkLabelDraft, setLinkLabelDraft] = reactExports.useState("");
  const [selectedIds, setSelectedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [selectBox, setSelectBox] = reactExports.useState(null);
  const selectBoxRef = reactExports.useRef(null);
  const clipboardRef = reactExports.useRef([]);
  const undoStack = reactExports.useRef([]);
  const redoStack = reactExports.useRef([]);
  const [localPos, setLocalPos] = reactExports.useState({});
  const rafRef = reactExports.useRef(null);
  const dragRef = reactExports.useRef(
    { mode: null, sx: 0, sy: 0, ox: 0, oy: 0, moved: false }
  );
  const linkRef = reactExports.useRef(null);
  const canvasRef = reactExports.useRef(null);
  const fileRef = reactExports.useRef(null);
  const pendingKind = reactExports.useRef(null);
  const cardHeightsRef = reactExports.useRef({});
  const [, heightTick] = reactExports.useState(0);
  reactExports.useEffect(() => {
    window.capybara.invoke("items:list", "all", "").then((r2) => {
      const map = {};
      for (const it of r2) map[it.id] = it;
      setItemMap(map);
    });
  }, []);
  const posOf = (c) => localPos[c.id] ?? { x: c.x, y: c.y };
  const onWheel = (e) => {
    e.preventDefault();
    setZoom((z2) => Math.min(2.5, Math.max(0.3, z2 * (e.deltaY > 0 ? 0.9 : 1.1))));
  };
  const startPan = (e) => {
    const t2 = e.target;
    if (t2.closest(NO_PAN)) return;
    if (linkRef.current) return;
    if (t2.closest(".board-card")) return;
    if (e.shiftKey) {
      const rect = canvasRef.current.getBoundingClientRect();
      const sx = (e.clientX - rect.left - pan.x) / zoom;
      const sy = (e.clientY - rect.top - pan.y) / zoom;
      dragRef.current = { mode: "select", sx: e.clientX, sy: e.clientY, ox: sx, oy: sy, moved: false };
      setSelectBox({ x: sx, y: sy, w: 0, h: 0 });
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }
    setSelectedIds(/* @__PURE__ */ new Set());
    dragRef.current = { mode: "pan", sx: e.clientX, sy: e.clientY, ox: pan.x, oy: pan.y, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e) => {
    if (linkRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setLinkCursor({ x: (e.clientX - rect.left - pan.x) / zoom, y: (e.clientY - rect.top - pan.y) / zoom });
      return;
    }
    const d = dragRef.current;
    if (d.mode === "pan") setPan({ x: d.ox + (e.clientX - d.sx), y: d.oy + (e.clientY - d.sy) });
    else if (d.mode === "select") {
      const rect = canvasRef.current.getBoundingClientRect();
      const cx = (e.clientX - rect.left - pan.x) / zoom;
      const cy = (e.clientY - rect.top - pan.y) / zoom;
      const x2 = Math.min(d.ox, cx), y2 = Math.min(d.oy, cy);
      const w2 = Math.abs(cx - d.ox), h = Math.abs(cy - d.oy);
      const box = { x: x2, y: y2, w: w2, h };
      selectBoxRef.current = box;
      setSelectBox(box);
    } else if (d.mode === "node" && d.id != null) {
      d.moved = true;
      const nx = d.ox + (e.clientX - d.sx) / zoom;
      const ny = d.oy + (e.clientY - d.sy) / zoom;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const id2 = d.id;
      rafRef.current = requestAnimationFrame(() => setLocalPos((prev) => ({ ...prev, [id2]: { x: nx, y: ny } })));
    }
  };
  const endDrag = async (e) => {
    if (linkRef.current) {
      const from = linkRef.current.fromId;
      linkRef.current = null;
      setLinking(null);
      setLinkCursor(null);
      const el2 = document.elementFromPoint(e.clientX, e.clientY)?.closest(".board-card");
      const toId = el2?.getAttribute("data-card-id");
      if (toId && Number(toId) !== from) {
        void addLink(from, Number(toId));
        showToast("已建立连线");
      }
      return;
    }
    const d = dragRef.current;
    if (d.mode === "node" && d.id != null && d.moved) {
      const p2 = localPos[d.id];
      dragRef.current = { mode: null, sx: 0, sy: 0, ox: 0, oy: 0, moved: false };
      if (p2) {
        await moveCard(d.id, p2.x, p2.y);
      }
      setLocalPos((prev) => {
        const n2 = { ...prev };
        delete n2[d.id];
        return n2;
      });
      return;
    }
    if (d.mode === "select" && selectBoxRef.current) {
      const box = selectBoxRef.current;
      const hit = cards.filter((c) => {
        const p2 = posOf(c);
        const h = cardHeightsRef.current[c.id] || c.h;
        return p2.x < box.x + box.w && p2.x + c.w > box.x && p2.y < box.y + box.h && p2.y + h > box.y;
      });
      setSelectedIds(new Set(hit.map((c) => c.id)));
      setSelectBox(null);
      selectBoxRef.current = null;
    }
    dragRef.current = { mode: null, sx: 0, sy: 0, ox: 0, oy: 0, moved: false };
  };
  const expandFromDot = async (fromCard, side) => {
    const offset = 280;
    const fp = posOf(fromCard);
    let nx = fp.x, ny = fp.y;
    if (side === "right") nx += offset;
    else if (side === "left") nx -= offset;
    else if (side === "bottom") ny += offset + 60;
    else if (side === "top") ny -= offset + 60;
    const newCard = await addCard({ kind: "text", x: nx, y: ny, title: "", body: "" });
    await addLink(fromCard.id, newCard.id);
    setEditingId(newCard.id);
    showToast("已创建新卡片并连线");
  };
  const alignSelected = (type) => {
    const sel = cards.filter((c) => selectedIds.has(c.id));
    if (sel.length < 2) return;
    if (type === "left") {
      const min = Math.min(...sel.map((c) => c.x));
      sel.forEach((c) => void moveCard(c.id, min, c.y));
    } else if (type === "right") {
      const max = Math.max(...sel.map((c) => c.x + c.w));
      sel.forEach((c) => void moveCard(c.id, max - c.w, c.y));
    } else if (type === "top") {
      const min = Math.min(...sel.map((c) => c.y));
      sel.forEach((c) => void moveCard(c.id, c.x, min));
    } else if (type === "bottom") {
      const max = Math.max(...sel.map((c) => c.y + (cardHeightsRef.current[c.id] || c.h)));
      sel.forEach((c) => void moveCard(c.id, c.x, max - (cardHeightsRef.current[c.id] || c.h)));
    }
    showToast(`已${type === "left" ? "左" : type === "right" ? "右" : type === "top" ? "上" : "下"}对齐`);
  };
  const distributeSelected = (dir) => {
    const sel = cards.filter((c) => selectedIds.has(c.id));
    if (sel.length < 3) return;
    if (dir === "h") {
      const sorted = [...sel].sort((a, b) => a.x - b.x);
      const totalW = sorted.reduce((s, c) => s + c.w, 0);
      const gap = (sorted[sorted.length - 1].x + sorted[sorted.length - 1].w - sorted[0].x - totalW) / (sorted.length - 1);
      let x2 = sorted[0].x;
      sorted.forEach((c) => {
        void moveCard(c.id, x2, c.y);
        x2 += c.w + gap;
      });
    } else {
      const sorted = [...sel].sort((a, b) => a.y - b.y);
      const totalH = sorted.reduce((s, c) => s + (cardHeightsRef.current[c.id] || c.h), 0);
      const gap = (sorted[sorted.length - 1].y + (cardHeightsRef.current[sorted[sorted.length - 1].id] || sorted[sorted.length - 1].h) - sorted[0].y - totalH) / (sorted.length - 1);
      let y2 = sorted[0].y;
      sorted.forEach((c) => {
        void moveCard(c.id, c.x, y2);
        y2 += (cardHeightsRef.current[c.id] || c.h) + gap;
      });
    }
    showToast("已等距分布");
  };
  const selectedIdsRef = reactExports.useRef(/* @__PURE__ */ new Set());
  selectedIdsRef.current = selectedIds;
  const cardsRef = reactExports.useRef(cards);
  cardsRef.current = cards;
  const linksRef = reactExports.useRef(links);
  linksRef.current = links;
  const executeUndo = (action) => {
    if (action.type === "delete") {
      action.cards.forEach((c) => {
        void addCard({ kind: c.kind, x: c.x, y: c.y, w: c.w, h: c.h, title: c.title, body: c.body, payload: c.payload, item_id: c.item_id ?? void 0 });
      });
      showToast("已撤销删除");
    } else if (action.type === "move") {
      action.cards.forEach((c) => {
        void moveCard(c.id, c.x, c.y);
      });
      showToast("已撤销移动");
    }
  };
  const executeRedo = (action) => {
    if (action.type === "delete") {
      action.cards.forEach((c) => {
        void deleteCard(c.id);
      });
      showToast("已重做删除");
    } else if (action.type === "move") {
      const newCoords = action.newCoords;
      if (newCoords) newCoords.forEach((nc2) => {
        void moveCard(nc2.id, nc2.x, nc2.y);
      });
      showToast("已重做移动");
    }
  };
  reactExports.useEffect(() => {
    const onKey = (e) => {
      if (editingId != null || editingName || pickerOpen) return;
      const target = e.target;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if (e.key === "Escape") {
        setSelectedIds(/* @__PURE__ */ new Set());
        setLinking(null);
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "a") {
        e.preventDefault();
        setSelectedIds(new Set(cardsRef.current.map((c) => c.id)));
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        const action = undoStack.current.pop();
        if (action) {
          redoStack.current.push(action);
          executeUndo(action);
        }
        return;
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === "z" && e.shiftKey || e.key === "y")) {
        e.preventDefault();
        const action = redoStack.current.pop();
        if (action) {
          undoStack.current.push(action);
          executeRedo(action);
        }
        return;
      }
      const sel = selectedIdsRef.current;
      if (sel.size === 0) return;
      const ids = [...sel];
      const curCards = cardsRef.current;
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        const deleted = ids.map((id2) => curCards.find((c) => c.id === id2)).filter(Boolean);
        const deletedLinks = linksRef.current.filter((l2) => ids.includes(l2.from_id) || ids.includes(l2.to_id));
        undoStack.current.push({ type: "delete", cards: deleted, links: deletedLinks });
        ids.forEach((id2) => void deleteCard(id2));
        setSelectedIds(/* @__PURE__ */ new Set());
        showToast(`已删除 ${ids.length} 个卡片`);
        return;
      }
      if (e.key === "Enter" && ids.length === 1) {
        e.preventDefault();
        setEditingId(ids[0]);
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "c") {
        e.preventDefault();
        clipboardRef.current = ids.map((id2) => curCards.find((c) => c.id === id2)).filter(Boolean);
        showToast(`已复制 ${ids.length} 个卡片`);
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "v") {
        e.preventDefault();
        const clip = clipboardRef.current;
        clip.forEach((c) => {
          void addCard({ kind: c.kind, x: c.x + 30, y: c.y + 30, title: c.title, body: c.body, payload: c.payload, item_id: c.item_id ?? void 0 });
        });
        showToast(`已粘贴 ${clip.length} 个卡片`);
        return;
      }
      const step = e.shiftKey ? 20 : 5;
      let dx = 0, dy = 0;
      if (e.key === "ArrowLeft") dx = -step;
      else if (e.key === "ArrowRight") dx = step;
      else if (e.key === "ArrowUp") dy = -step;
      else if (e.key === "ArrowDown") dy = step;
      if (dx !== 0 || dy !== 0) {
        e.preventDefault();
        const oldCoords = ids.map((id2) => {
          const c = curCards.find((x2) => x2.id === id2);
          return c ? { id: id2, x: c.x, y: c.y } : null;
        }).filter(Boolean);
        const newCoords = oldCoords.map((oc2) => ({ id: oc2.id, x: oc2.x + dx, y: oc2.y + dy }));
        undoStack.current.push({ type: "move", cards: ids.map((id2) => {
          const c = curCards.find((x2) => x2.id === id2);
          return c;
        }).map((c) => ({ ...c })), ...{ newCoords } });
        newCoords.forEach((nc2) => {
          void moveCard(nc2.id, nc2.x, nc2.y);
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editingId, editingName, pickerOpen]);
  const startNodeDrag = (e, card) => {
    const t2 = e.target;
    if (t2.closest("a,button,input,textarea,.card-del,.card-edit,.card-link-dot")) return;
    e.stopPropagation();
    if (e.shiftKey || e.metaKey || e.ctrlKey) {
      setSelectedIds((prev) => {
        const n2 = new Set(prev);
        if (n2.has(card.id)) n2.delete(card.id);
        else n2.add(card.id);
        return n2;
      });
    } else if (!selectedIds.has(card.id)) {
      setSelectedIds(/* @__PURE__ */ new Set([card.id]));
    }
    dragRef.current = { mode: "node", id: card.id, sx: e.clientX, sy: e.clientY, ox: card.x, oy: card.y, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const startLink = (e, card) => {
    e.stopPropagation();
    linkRef.current = { fromId: card.id };
    setLinking(card.id);
    canvasRef.current?.setPointerCapture(e.pointerId);
  };
  const dropPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: (e.clientX - rect.left - pan.x) / zoom, y: (e.clientY - rect.top - pan.y) / zoom };
  };
  const onDrop = (e) => {
    e.preventDefault();
    const itemId = Number(e.dataTransfer.getData("application/x-item-id"));
    if (itemId) {
      const { x: x22, y: y22 } = dropPos(e);
      addRefCard(itemId, x22 - 120, y22 - 65);
      showToast("已放入白板");
      return;
    }
    const files = Array.from(e.dataTransfer.files);
    const { x: x2, y: y2 } = dropPos(e);
    files.forEach((f2, i) => {
      const path = window.capybara.getPathForFile(f2);
      const kind = f2.type.startsWith("image/") ? "image" : f2.type.startsWith("video/") ? "video" : f2.type.startsWith("audio/") ? "video" : "file";
      void addCard({ kind, _sourcePath: path, title: f2.name, x: x2 + i * 24, y: y2 + i * 24 });
    });
    if (files.length) showToast(`已添加 ${files.length} 个附件`);
  };
  const onPickType = (kind) => {
    const pos = autoPos();
    if (kind === "ref") {
      void openPicker();
      return;
    }
    if (kind === "image" || kind === "video" || kind === "file") {
      pendingKind.current = kind;
      fileRef.current?.click();
      return;
    }
    void addCard({ kind, x: pos.x, y: pos.y, title: "", body: "" }).then((c) => setEditingId(c.id));
  };
  const onFileChosen = (e) => {
    const f2 = e.target.files?.[0];
    e.target.value = "";
    const kind = pendingKind.current;
    if (!f2 || !kind) return;
    const path = window.capybara.getPathForFile(f2);
    const pos = autoPos();
    void addCard({ kind, _sourcePath: path, title: f2.name, x: pos.x, y: pos.y }).then((c) => setEditingId(c.id));
  };
  const openPicker = async () => {
    setPickerOpen(true);
    const list = await window.capybara.invoke("items:list", "all", "");
    setPickerItems(list);
  };
  const pickItem = (it) => {
    const pos = autoPos();
    setPickerOpen(false);
    addRefCard(it.id, pos.x, pos.y);
    showToast("已引用条目");
  };
  const fit = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };
  const fitAll = () => {
    if (cards.length === 0 || !canvasRef.current) {
      setPan({ x: 0, y: 0 });
      setZoom(1);
      return;
    }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const c of cards) {
      const p2 = posOf(c);
      const h = cardHeightsRef.current[c.id] || c.h;
      if (p2.x < minX) minX = p2.x;
      if (p2.y < minY) minY = p2.y;
      if (p2.x + c.w > maxX) maxX = p2.x + c.w;
      if (p2.y + h > maxY) maxY = p2.y + h;
    }
    const rect = canvasRef.current.getBoundingClientRect();
    const pad = 40;
    const availW = rect.width - pad * 2;
    const availH = rect.height - pad * 2;
    const contentW = maxX - minX;
    const contentH = maxY - minY;
    const scale = Math.min(availW / contentW, availH / contentH, 1.5);
    const z2 = Math.max(0.3, Math.min(2.5, scale));
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    setZoom(z2);
    setPan({ x: rect.width / 2 - cx * z2, y: rect.height / 2 - cy * z2 });
  };
  const nameRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (editingName && nameRef.current) {
      nameRef.current.focus();
      nameRef.current.select();
    }
  }, [editingName]);
  const openItemInReader = (itemId) => {
    useStore.getState().select(itemId);
    useStore.getState().setScreen("library");
    setEditingId(null);
  };
  const beginEditLink = (lk2) => {
    setEditingLinkId(lk2.id);
    setLinkLabelDraft(lk2.label || "");
  };
  const commitEditLink = () => {
    if (editingLinkId != null) {
      void updateLink(editingLinkId, linkLabelDraft.trim());
      showToast("已更新连线说明");
    }
    setEditingLinkId(null);
  };
  const cardsView = reactExports.useMemo(() => cards.map((c) => ({ card: c, p: safeParse(c.payload) })), [cards]);
  const cardMap = reactExports.useMemo(() => new Map(cardsView.map((cv) => [cv.card.id, cv])), [cardsView]);
  const center = (c) => {
    const p2 = posOf(c);
    const h = cardHeightsRef.current[c.id] || c.h;
    return { x: p2.x + c.w / 2, y: p2.y + h / 2 };
  };
  const linkMid = (a, b) => {
    const ca2 = center(a), cb2 = center(b);
    return { x: (ca2.x + cb2.x) / 2, y: (ca2.y + cb2.y) / 2 };
  };
  const edgeAnchor = (from, to) => {
    const fp = posOf(from);
    const tp = posOf(to);
    const fh2 = cardHeightsRef.current[from.id] || from.h;
    const th2 = cardHeightsRef.current[to.id] || to.h;
    const fcx = fp.x + from.w / 2, fcy = fp.y + fh2 / 2;
    const tcx = tp.x + to.w / 2, tcy = tp.y + th2 / 2;
    const dx = tcx - fcx, dy = tcy - fcy;
    if (Math.abs(dx) >= Math.abs(dy)) {
      const side2 = dx >= 0 ? "right" : "left";
      return { x: dx >= 0 ? fp.x + from.w : fp.x, y: fcy, side: side2 };
    }
    const side = dy >= 0 ? "bottom" : "top";
    return { x: fcx, y: dy >= 0 ? fp.y + fh2 : fp.y, side };
  };
  const tangentOut = (a) => {
    switch (a.side) {
      case "right":
        return { x: 1, y: 0 };
      case "left":
        return { x: -1, y: 0 };
      case "bottom":
        return { x: 0, y: 1 };
      case "top":
        return { x: 0, y: -1 };
    }
  };
  if (!activeBoardId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "board-empty", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "be-art", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "board", size: 40, strokeWidth: 1.4 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "empty-title", children: "还没有打开白板" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "在左侧「白板 ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "plus", size: 12 }),
        "」新建一个，用来把收藏条目、文本、图片、链接、文件、视频摆开组织成领域认知"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "primary", onClick: () => void createBoard(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "plus", size: 15 }),
        " 新建白板"
      ] })
    ] });
  }
  const board = boards.find((b) => b.id === activeBoardId);
  const linkingFrom = linking != null ? cardMap.get(linking)?.card : void 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "board", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", hidden: true, onChange: onFileChosen }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "board-canvas",
        ref: canvasRef,
        onWheel,
        onPointerDown: startPan,
        onPointerMove: onMove,
        onPointerUp: endDrag,
        onPointerLeave: endDrag,
        onDragOver: (e) => e.preventDefault(),
        onDrop,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "board-layer", style: { transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "board-edges", width: "100%", height: "100%", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("marker", { id: "arrow", markerWidth: "10", markerHeight: "10", refX: "8", refY: "3", orient: "auto", markerUnits: "strokeWidth", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M0,0 L8,3 L0,6 Z", fill: "var(--accent-info)" }) }) }),
              links.map((lk2) => {
                const a = cardMap.get(lk2.from_id)?.card, b = cardMap.get(lk2.to_id)?.card;
                if (!a || !b) return null;
                const sa2 = edgeAnchor(a, b), sb2 = edgeAnchor(b, a);
                const ta2 = tangentOut(sa2), tb2 = tangentOut(sb2);
                const dist = Math.hypot(sb2.x - sa2.x, sb2.y - sa2.y);
                const reach = Math.max(40, dist * 0.4);
                const cp1 = { x: sa2.x + ta2.x * reach, y: sa2.y + ta2.y * reach };
                const cp2 = { x: sb2.x + tb2.x * reach, y: sb2.y + tb2.y * reach };
                const mid = { x: (sa2.x + sb2.x) / 2, y: (sa2.y + sb2.y) / 2 };
                const isEditing = editingLinkId === lk2.id;
                const d = `M ${sa2.x} ${sa2.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${sb2.x} ${sb2.y}`;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: "edge", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d, className: "edge-hit-wide", fill: "none" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d, className: "edge-line", markerEnd: "url(#arrow)", fill: "none" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "circle",
                    {
                      className: "edge-del",
                      cx: mid.x,
                      cy: mid.y,
                      r: 9,
                      onClick: (e) => {
                        e.stopPropagation();
                        void deleteLink(lk2.id);
                        showToast("已删除连线");
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "删除连线" })
                    }
                  ),
                  lk2.label && !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsx("text", { className: "edge-label", x: mid.x, y: mid.y - 12, onClick: (e) => {
                    e.stopPropagation();
                    beginEditLink(lk2);
                  }, children: lk2.label })
                ] }, lk2.id);
              }),
              linkingFrom && linkCursor && (() => {
                const anyOther = cardsView.find((cv) => cv.card.id !== linkingFrom.id);
                const sa2 = anyOther ? edgeAnchor(linkingFrom, anyOther.card) : center(linkingFrom);
                return /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: `M ${sa2.x} ${sa2.y} L ${linkCursor.x} ${linkCursor.y}`, className: "edge-temp" });
              })()
            ] }),
            selectBox && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "board-select-box", style: { left: selectBox.x, top: selectBox.y, width: selectBox.w, height: selectBox.h } }),
            cardsView.map(({ card, p: p2 }) => {
              const pos = posOf(card);
              const it = card.item_id != null ? itemMap[card.item_id] : void 0;
              const assetSrc = p2.localPath ? `local-path://${p2.localPath}` : p2.file ? `board-asset://${p2.file}` : p2.url || "";
              const isSelected = selectedIds.has(card.id);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-card-id": card.id,
                  className: `board-card kind-${card.kind} ${isSelected ? "card-selected" : ""}`,
                  style: { left: pos.x, top: pos.y, width: card.w },
                  ref: (el2) => {
                    if (!el2) return;
                    const h = el2.offsetHeight;
                    if (cardHeightsRef.current[card.id] !== h) {
                      cardHeightsRef.current[card.id] = h;
                      heightTick((t2) => t2 + 1 & 65535);
                    }
                  },
                  onPointerDown: (e) => startNodeDrag(e, card),
                  onDoubleClick: () => setEditingId(card.id),
                  onMouseEnter: () => setHoveredId(card.id),
                  onMouseLeave: () => setHoveredId((prev) => prev === card.id ? null : prev),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "card-edit", title: "编辑", onPointerDown: (e) => e.stopPropagation(), onClick: (e) => {
                      e.stopPropagation();
                      setEditingId(card.id);
                    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "edit", size: 13 }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "card-del", title: "删除", onPointerDown: (e) => e.stopPropagation(), onClick: (e) => {
                      e.stopPropagation();
                      void deleteCard(card.id);
                    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 13 }) }),
                    (hoveredId === card.id || isSelected || linking != null) && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "card-link-dot card-link-top",
                          title: "点击创建新卡片",
                          onPointerDown: (e) => startLink(e, card),
                          onClick: (e) => {
                            e.stopPropagation();
                            if (!linkRef.current) void expandFromDot(card, "top");
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "card-link-dot card-link-right",
                          title: "点击创建新卡片",
                          onPointerDown: (e) => startLink(e, card),
                          onClick: (e) => {
                            e.stopPropagation();
                            if (!linkRef.current) void expandFromDot(card, "right");
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "card-link-dot card-link-bottom",
                          title: "点击创建新卡片",
                          onPointerDown: (e) => startLink(e, card),
                          onClick: (e) => {
                            e.stopPropagation();
                            if (!linkRef.current) void expandFromDot(card, "bottom");
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "card-link-dot card-link-left",
                          title: "点击创建新卡片",
                          onPointerDown: (e) => startLink(e, card),
                          onClick: (e) => {
                            e.stopPropagation();
                            if (!linkRef.current) void expandFromDot(card, "left");
                          }
                        }
                      )
                    ] }),
                    card.kind === "ref" && (it ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "bc-kind", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "ref", size: 12 }),
                        " 引用 · ",
                        it.source_name
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "bc-title", children: card.title || it.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "bc-summary", children: card.body || it.summary || "（无摘要）" })
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "bc-title", children: card.title || `条目 #${card.item_id}（已删除）` })),
                    card.kind === "text" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "bc-kind", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "type", size: 12 }),
                        " 文本"
                      ] }),
                      card.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "bc-title", children: card.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "bc-summary", children: card.body || "（空）" })
                    ] }),
                    card.kind === "link" && p2.url && (p2.previewTitle || p2.previewImage) && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "bc-kind", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "link", size: 12 }),
                        " 链接"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "link-card", href: p2.url, target: "_blank", rel: "noreferrer", onClick: (e) => e.stopPropagation(), children: [
                        p2.previewImage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "link-card-cover", style: { backgroundImage: `url(${p2.previewImage})` } }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "link-card-body", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "link-card-title", children: p2.previewTitle || card.title || p2.url }),
                          p2.previewDesc && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "link-card-desc", children: p2.previewDesc }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "link-card-site", children: p2.previewSite || (() => {
                            try {
                              return new URL(p2.url).hostname;
                            } catch {
                              return "";
                            }
                          })() })
                        ] })
                      ] }),
                      card.body && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "bc-summary", children: card.body })
                    ] }),
                    card.kind === "link" && p2.url && !p2.previewTitle && !p2.previewImage && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "bc-kind", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "link", size: 12 }),
                        " 链接"
                      ] }),
                      card.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "bc-title", children: card.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "bc-link", href: p2.url, target: "_blank", rel: "noreferrer", onClick: (e) => e.stopPropagation(), children: p2.url }),
                      card.body && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "bc-summary", children: card.body })
                    ] }),
                    card.kind === "image" && assetSrc && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "bc-kind", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "image", size: 12 }),
                        " 图片"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          className: "bc-media",
                          src: assetSrc,
                          alt: p2.name || card.title,
                          draggable: false
                        }
                      ),
                      p2.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "bc-fname", children: p2.name })
                    ] }),
                    card.kind === "image" && !assetSrc && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "bc-kind", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "image", size: 12 }),
                        " 图片"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "bc-summary", children: "（图片加载中或不可用）" })
                    ] }),
                    card.kind === "video" && assetSrc && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "bc-kind", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "video", size: 12 }),
                        " 视频"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("video", { className: "bc-media", src: assetSrc, controls: true, preload: "metadata" })
                    ] }),
                    card.kind === "video" && !assetSrc && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "bc-kind", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "video", size: 12 }),
                        " 视频"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "bc-summary", children: "（视频加载中或不可用）" })
                    ] }),
                    card.kind === "file" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "bc-kind", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "file", size: 12 }),
                        " 文件"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "bc-title", children: p2.name || card.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "bc-fname", children: fmtSize(p2.size) })
                    ] })
                  ]
                },
                card.id
              );
            })
          ] }),
          editingLinkId != null && (() => {
            const lk2 = links.find((l2) => l2.id === editingLinkId);
            if (!lk2) return null;
            const a = cardMap.get(lk2.from_id)?.card, b = cardMap.get(lk2.to_id)?.card;
            if (!a || !b) return null;
            const m2 = linkMid(a, b);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: "link-label-input",
                autoFocus: true,
                style: { left: pan.x + m2.x * zoom, top: pan.y + m2.y * zoom },
                value: linkLabelDraft,
                placeholder: "连线说明（可选）",
                onChange: (e) => setLinkLabelDraft(e.target.value),
                onBlur: commitEditLink,
                onKeyDown: (e) => {
                  if (e.key === "Enter") commitEditLink();
                  if (e.key === "Escape") setEditingLinkId(null);
                }
              }
            );
          })()
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "board-dock", onPointerDown: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dock-group", children: CARD_TYPES.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "dock-item", title: t2.desc, onClick: () => onPickType(t2.kind), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: t2.icon, size: 18 }) }, t2.kind)) }),
      selectedIds.size >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dock-group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "dock-item", title: "左对齐", onClick: () => alignSelected("left"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "alignLeft", size: 18 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "dock-item", title: "右对齐", onClick: () => alignSelected("right"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "alignRight", size: 18 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "dock-item", title: "上对齐", onClick: () => alignSelected("top"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "alignTop", size: 18 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "dock-item", title: "下对齐", onClick: () => alignSelected("bottom"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "alignBottom", size: 18 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "dock-item", title: "水平等距", onClick: () => distributeSelected("h"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "distributeH", size: 18 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "dock-item", title: "垂直等距", onClick: () => distributeSelected("v"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "distributeV", size: 18 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dock-group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "dock-item", title: "缩小", onClick: () => setZoom((z2) => Math.max(0.3, z2 - 0.15)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "minus", size: 18 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "dock-item", title: "放大", onClick: () => setZoom((z2) => Math.min(2.5, z2 + 0.15)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "plus", size: 18 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "dock-item", title: "还原视图", onClick: fit, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "maximize", size: 18 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "dock-item", title: "自适应全部卡片", onClick: fitAll, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "frame", size: 18 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dock-group", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "dock-item danger", title: "删除白板", onClick: () => {
        if (activeBoardId == null) return;
        if (!confirm("确定要删除「" + (board?.name ?? "白板") + "」吗？此操作不可撤销。")) return;
        void deleteBoard(activeBoardId);
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "trash", size: 18 }) }) })
    ] }),
    editingId != null && (() => {
      const cv = cardsView.find((c) => c.card.id === editingId);
      if (!cv) return null;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        CardEditor,
        {
          card: cv.card,
          itemMap,
          onClose: () => setEditingId(null),
          onSave: (patch) => {
            void useStore.getState().updateCard(cv.card.id, patch);
          },
          onDelete: () => {
            void deleteCard(cv.card.id);
          },
          onOpenItem: openItemInReader
        }
      );
    })(),
    pickerOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-mask", onClick: () => setPickerOpen(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-title", children: "引用条目" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "picker-search", placeholder: "搜索标题 / 摘要…", value: pickerQ, onChange: (e) => setPickerQ(e.target.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "picker-list", children: pickerItems.filter((it) => !pickerQ || (it.title + it.summary).toLowerCase().includes(pickerQ.toLowerCase())).slice(0, 200).map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "picker-item", onClick: () => pickItem(it), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pi-title", children: it.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pi-src", children: it.source_name })
      ] }, it.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-foot", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPickerOpen(false), children: "取消" }) })
    ] }) })
  ] });
}
const PAGE_SIZE = 9;
const KIND_LABEL$2 = { article: "图文", podcast: "播客", video: "视频" };
function DiscoverPanel() {
  const { addFeed, showToast } = useStore();
  const [roles, setRoles] = reactExports.useState([]);
  const [tags, setTags] = reactExports.useState([]);
  const [roleId, setRoleId] = reactExports.useState(0);
  const [selTags, setSelTags] = reactExports.useState([]);
  const [lang, setLang] = reactExports.useState("all");
  const [keyword, setKeyword] = reactExports.useState("");
  const [rows, setRows] = reactExports.useState([]);
  const [total, setTotal] = reactExports.useState(0);
  const [page, setPage] = reactExports.useState(0);
  const [pageInput, setPageInput] = reactExports.useState("1");
  const [thumbPct, setThumbPct] = reactExports.useState(0);
  const [loaded, setLoaded] = reactExports.useState(false);
  const [picking, setPicking] = reactExports.useState(null);
  const [pickKind, setPickKind] = reactExports.useState("article");
  const [adding, setAdding] = reactExports.useState(false);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const tickCount = totalPages <= 20 ? totalPages : 20;
  const dragRatio = Math.max(0, Math.min(1, thumbPct / 100));
  const currentTick = Math.min(tickCount - 1, Math.max(0, Math.round(dragRatio * (tickCount - 1))));
  const roleGroups = reactExports.useMemo(() => {
    const m2 = /* @__PURE__ */ new Map();
    for (const r2 of roles) {
      const list = m2.get(r2.domain) ?? [];
      list.push(r2);
      m2.set(r2.domain, list);
    }
    return [...m2.entries()];
  }, [roles]);
  reactExports.useEffect(() => {
    void window.capybara.invoke("discover:roles").then(setRoles);
    void window.capybara.invoke("discover:tags").then(setTags);
  }, []);
  const query = async (p2) => {
    try {
      const r2 = await window.capybara.invoke("discover:feeds", {
        roleIds: roleId ? [roleId] : [],
        tags: selTags,
        languages: lang === "all" ? [] : [lang],
        keyword: keyword.trim() || void 0,
        page: p2,
        pageSize: PAGE_SIZE
      });
      setRows(r2.rows);
      setTotal(r2.total);
      setPage(p2);
      setPageInput(String(p2 + 1));
      const tp = r2.total > 0 ? Math.min(100, p2 / Math.max(1, Math.ceil(r2.total / PAGE_SIZE) - 1) * 100) : 0;
      setThumbPct(tp);
      setLoaded(true);
    } catch (e) {
      showToast("筛选失败：" + e.message);
    }
  };
  reactExports.useEffect(() => {
    void query(0);
  }, [roleId, selTags, lang]);
  const toggle = (arr, v2, set) => {
    set(arr.includes(v2) ? arr.filter((x2) => x2 !== v2) : [...arr, v2]);
  };
  const doAdd = async (feed) => {
    setAdding(true);
    try {
      await addFeed("rss", feed.title, feed.xml_url, 120, pickKind);
      showToast(`已添加「${feed.title}」为${KIND_LABEL$2[pickKind]}`);
      setPicking(null);
      setRows((prev) => prev.map((x2) => x2.id === feed.id ? { ...x2, subscribed: 1 } : x2));
    } catch (e) {
      showToast("添加失败：" + e.message);
    } finally {
      setAdding(false);
    }
  };
  const gotoPage = () => {
    const n2 = parseInt(pageInput, 10);
    if (isNaN(n2)) {
      setPageInput(String(page + 1));
      return;
    }
    const target = Math.max(1, Math.min(totalPages, n2)) - 1;
    if (target !== page) void query(target);
    else setPageInput(String(page + 1));
  };
  const trackRef = reactExports.useRef(null);
  const rafRef = reactExports.useRef(null);
  const pendingPct = reactExports.useRef(0);
  const scheduleThumb = (pct) => {
    pendingPct.current = pct;
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const p2 = pendingPct.current;
      setThumbPct(p2);
      setPageInput(String(Math.round(p2 / 100 * (totalPages - 1)) + 1));
    });
  };
  const seekToClientX = (clientX, final) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const PAD = 6;
    const usable = rect.width - PAD * 2;
    const ratio = usable > 0 ? Math.max(0, Math.min(1, (clientX - rect.left - PAD) / usable)) : 0;
    scheduleThumb(ratio * 100);
    if (final) {
      const target = Math.round(ratio * (totalPages - 1));
      if (target !== page) void query(target);
    }
  };
  const onTrackPointerDown = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    seekToClientX(e.clientX, false);
    const onMove = (em) => seekToClientX(em.clientX, false);
    const onUp = (eu) => {
      seekToClientX(eu.clientX, true);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };
  const tickCls = (i) => i === currentTick ? "pager-tick current" : "pager-tick";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "src-label", children: [
      "信源发现（",
      loaded ? total : "…",
      " 个候选源）"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-grid-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "discover-role", children: "按用户角色筛选" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: "discover-role", value: roleId, onChange: (e) => setRoleId(Number(e.target.value)), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 0, children: "全部角色" }),
          roleGroups.map(([domain, list]) => /* @__PURE__ */ jsxRuntimeExports.jsx("optgroup", { label: domain, children: list.map((r2) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r2.id, children: r2.name }, r2.id)) }, domain))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "discover-keyword", children: "搜索" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "disc-search", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "discover-keyword",
              placeholder: "标题 / 网址 / 描述关键词",
              value: keyword,
              onChange: (e) => setKeyword(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") void query(0);
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => void query(0), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "search", size: 13 }),
            " 搜索"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-field", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "分类标签" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "disc-chips", children: tags.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: `chip ${selTags.includes(t2) ? "active" : ""}`, onClick: () => toggle(selTags, t2, setSelTags), children: t2 }, t2)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-field", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "语言" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "disc-chips", children: [["all", "全部"], ["zh", "中文"], ["en", "英文"]].map(([v2, l2]) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: `chip ${lang === v2 ? "active" : ""}`, onClick: () => setLang(v2), children: l2 }, v2)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "disc-grid", children: [
      !loaded && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-hint", children: "加载中…" }),
      loaded && rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-hint", children: "无匹配结果，试试放宽筛选条件。" }),
      rows.map((f2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `disc-card ${f2.subscribed ? "added" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "feed-info", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "feed-title", children: f2.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "feed-url", children: f2.xml_url }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fr-tags", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge", children: [
              f2.source_type,
              " · ",
              f2.tier
            ] }),
            f2.tags.slice(0, 4).map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge", children: t2 }, t2))
          ] })
        ] }),
        f2.subscribed ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "feed-mark", children: "已订阅" }) : picking === f2.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "discover-pick", onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "seg seg-3way", children: ["article", "podcast", "video"].map((k2) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: `seg-btn ${pickKind === k2 ? "active" : ""}`, onClick: () => setPickKind(k2), children: KIND_LABEL$2[k2] }, k2)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "discover-confirm", onClick: () => void doAdd(f2), disabled: adding, children: adding ? "添加中…" : "确认" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "discover-cancel", onClick: () => setPicking(null), children: "取消" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "chip add-one", onClick: () => {
          setPicking(f2.id);
          setPickKind("article");
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "plus", size: 13 }),
          " 添加"
        ] })
      ] }, f2.id))
    ] }),
    totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "feed-pager", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pager-track", ref: trackRef, onPointerDown: onTrackPointerDown, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pager-ticks", "aria-hidden": "true", children: Array.from({ length: tickCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: tickCls(i) }, i)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "pager-jump",
          type: "number",
          min: 1,
          max: totalPages,
          value: pageInput,
          onChange: (e) => setPageInput(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter") gotoPage();
          },
          onBlur: gotoPage,
          title: `精确跳转：1 - ${totalPages}`
        }
      )
    ] })
  ] });
}
const KIND_LABEL$1 = { article: "图文", podcast: "播客", video: "视频" };
function RssManager() {
  const { feeds, addFeed, deleteFeed, refreshFeed, showToast } = useStore();
  const [rssMethod, setRssMethod] = reactExports.useState("add");
  const [name, setName] = reactExports.useState("");
  const [url, setUrl] = reactExports.useState("");
  const [schedule, setSchedule] = reactExports.useState(120);
  const [kind, setKind] = reactExports.useState("article");
  const [opmlMsg, setOpmlMsg] = reactExports.useState("");
  const [validating, setValidating] = reactExports.useState(false);
  const submit = async () => {
    if (!url.trim()) {
      showToast("请填写 RSS 地址");
      return;
    }
    setValidating(true);
    try {
      const v2 = await window.capybara.invoke("feeds:validate", url.trim());
      if (!v2.valid) {
        showToast("验证失败：" + (v2.error || "无法解析"));
        return;
      }
      const finalName = name.trim() || v2.title || url.trim();
      await addFeed("rss", finalName, url.trim(), schedule, kind);
      showToast("已添加「" + finalName + "」");
      setName("");
      setUrl("");
      setSchedule(120);
      setKind("article");
    } catch (e) {
      showToast("添加失败：" + e.message);
    } finally {
      setValidating(false);
    }
  };
  const importOpml = async () => {
    setOpmlMsg("选择文件中…");
    try {
      const r2 = await window.capybara.invoke("feeds:importOpml", kind);
      if (r2.total === 0) {
        setOpmlMsg("已取消或未选择文件");
        return;
      }
      await useStore.getState().loadFeeds();
      setOpmlMsg(`导入完成：新增 ${r2.added} / 跳过重复 ${r2.skipped}（共 ${r2.total}）`);
    } catch (e) {
      setOpmlMsg("失败：" + e.message);
    }
  };
  const [errId, setErrId] = reactExports.useState(null);
  const [confirmUnsub, setConfirmUnsub] = reactExports.useState(null);
  const handleUnsubscribe = (f2) => {
    if (confirmUnsub === f2.id) {
      void deleteFeed(f2.id);
      setConfirmUnsub(null);
      showToast(`已取消订阅「${f2.name || f2.url}」`);
    } else {
      setConfirmUnsub(f2.id);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-scroll", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "subs-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "RSS 订阅管理" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "src-3way", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "seg seg-3way", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: `seg-btn ${kind === "article" ? "active" : ""}`, onClick: () => setKind("article"), children: "图文" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: `seg-btn ${kind === "podcast" ? "active" : ""}`, onClick: () => setKind("podcast"), children: "播客" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: `seg-btn ${kind === "video" ? "active" : ""}`, onClick: () => setKind("video"), children: "视频" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "src-3way", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "seg seg-2way", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `seg-btn ${rssMethod === "add" ? "active" : ""}`, onClick: () => setRssMethod("add"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "plus", size: 13 }),
            " 手动添加"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `seg-btn ${rssMethod === "import" ? "active" : ""}`, onClick: () => setRssMethod("import"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "upload", size: 13 }),
            " 导入 OPML"
          ] })
        ] }) }),
        rssMethod === "add" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-form", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "rss-name", children: "源名称（可选，留空自动识别）" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "rss-name", placeholder: "chaordex.com", value: name, onChange: (e) => setName(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "rss-url", children: "URL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "rss-url", placeholder: "RSS feed 地址", value: url, onChange: (e) => setUrl(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "rss-schedule", children: "刷新频率" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-field-cell", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "rss-schedule", type: "number", min: 5, value: schedule, onChange: (e) => setSchedule(Number(e.target.value)), className: "src-num" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "src-unit", children: "分钟" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-field src-actions-field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": "true" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "src-actions src-actions-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => void submit(), disabled: validating, children: validating ? "验证中…" : "添加" }) })
          ] })
        ] }),
        rssMethod === "import" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-form", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-hint", children: "支持 OPML / XML 格式。导入时自动验证，无效源跳过，已存在的不重复添加。" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-actions", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => void importOpml(), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "inbox", size: 13 }),
              " 选择 OPML 文件"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "src-hint", children: opmlMsg })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "src-label", children: [
          "已订阅（",
          feeds.length,
          "）"
        ] }),
        feeds.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-hint", children: "暂无订阅源。手动粘贴 RSS feed 地址或导入 OPML 文件。" }),
        feeds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "subs-wrap", children: feeds.map((f2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "feed-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `badge ${f2.kind ?? "article"}`, children: KIND_LABEL$1[f2.kind ?? "article"] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fr-info", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fr-name", children: f2.name || f2.url }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fr-url-line", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fr-url", children: f2.url }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "fr-open", type: "button", title: "在浏览器中打开", onClick: () => void window.capybara.invoke("shell:openExternal", f2.url), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "external", size: 13 }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fr-state", title: f2.error_count > 0 ? f2.last_error || "未知错误" : "", style: f2.error_count > 0 ? { color: "var(--card-accent)" } : void 0, children: f2.error_count > 0 ? f2.last_error || "错误" : f2.last_fetched_at ? "正常" : "未抓取" }),
          f2.error_count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "feed-err-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "feed-err-info", title: "查看错误详情", onClick: () => setErrId(errId === f2.id ? null : f2.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "info", size: 14 }) }),
            errId === f2.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "feed-err-pop", onClick: (e) => e.stopPropagation(), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "feed-err-head", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "抓取错误详情" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "feed-err-x", onClick: () => setErrId(null), children: "×" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "feed-err-row", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "feed-err-k", children: "源名称" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "feed-err-v", children: f2.name || f2.url })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "feed-err-row", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "feed-err-k", children: "URL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "feed-err-v feed-err-url", children: f2.url })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "feed-err-row", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "feed-err-k", children: "失败次数" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "feed-err-v", children: f2.error_count })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "feed-err-msg", children: f2.last_error || "（无具体错误信息）" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => void refreshFeed(f2.id), children: "刷新" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: confirmUnsub === f2.id ? "unsub-confirm" : "unsub-btn",
              title: confirmUnsub === f2.id ? "再次点击确认取消订阅" : "取消订阅",
              onClick: () => handleUnsubscribe(f2),
              onMouseLeave: () => {
                if (confirmUnsub === f2.id) setConfirmUnsub(null);
              },
              children: confirmUnsub === f2.id ? "确认取消？" : "取消订阅"
            }
          )
        ] }, f2.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DiscoverPanel, {})
  ] });
}
function GithubStarManager() {
  const { fetchGithubStars, showToast } = useStore();
  const [tokenInput, setTokenInput] = reactExports.useState("");
  const [hasToken, setHasToken] = reactExports.useState(false);
  const [ghUser, setGhUser] = reactExports.useState("");
  const [clientId, setClientId] = reactExports.useState("");
  const [ghMsg, setGhMsg] = reactExports.useState("");
  const [loggingIn, setLoggingIn] = reactExports.useState(false);
  const [userCode, setUserCode] = reactExports.useState("");
  const [fetching, setFetching] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(null);
  const progressCb = reactExports.useRef(() => {
  });
  progressCb.current = (p2) => setProgress(p2);
  reactExports.useEffect(() => {
    void window.capybara.invoke("settings:get", "github_stars_user").then((r2) => setGhUser(r2 || ""));
    void window.capybara.invoke("settings:get", "github_client_id").then((r2) => setClientId(r2 || ""));
    void window.capybara.invoke("github:tokenStatus").then((r2) => setHasToken(Boolean(r2?.has)));
    window.capybara.onGithubProgress((p2) => progressCb.current(p2));
  }, []);
  const deviceLogin = async () => {
    if (!clientId.trim()) {
      setGhMsg("请先填写 OAuth Client ID");
      return;
    }
    await window.capybara.invoke("settings:set", "github_client_id", clientId.trim());
    setLoggingIn(true);
    setUserCode("");
    setGhMsg("正在获取验证码…");
    try {
      const { user_code } = await window.capybara.invoke("github:deviceLogin");
      setUserCode(user_code);
      setGhMsg("验证码已复制到剪贴板，请粘贴到 GitHub 页面并授权");
      const { login } = await window.capybara.invoke("github:pollLogin");
      await window.capybara.invoke("settings:set", "github_stars_user", login);
      setHasToken(true);
      setGhUser(login);
      setUserCode("");
      setGhMsg(`已通过 OAuth 登录为 ${login}`);
      showToast("GitHub 登录成功");
    } catch (e) {
      setGhMsg("登录失败：" + e.message);
      setUserCode("");
    } finally {
      setLoggingIn(false);
    }
  };
  const saveToken = async () => {
    await window.capybara.invoke("github:setToken", tokenInput);
    const r2 = await window.capybara.invoke("github:tokenStatus");
    setHasToken(Boolean(r2?.has));
    setTokenInput("");
    setGhMsg(tokenInput ? "Token 已加密保存" : "已清除 Token");
  };
  const fetchStars = async () => {
    if (!ghUser.trim()) {
      setGhMsg("请填写 GitHub 用户名");
      return;
    }
    setFetching(true);
    setProgress(null);
    setGhMsg("拉取中…");
    try {
      const r2 = await fetchGithubStars(ghUser.trim());
      setGhMsg(`已拉取 ${r2.total} 个 Star / 新增 ${r2.added} 条`);
      showToast("GitHub ★ 已更新");
    } catch (e) {
      setGhMsg("失败：" + e.message);
    } finally {
      setFetching(false);
      setProgress(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-scroll", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "GitHub Star 管理" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-hint", children: "填入 GitHub 用户名，拉取你 starred 的仓库作为阅读条目（按 star 时间倒序，无条数上限）。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "github-user", children: "用户名" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "github-user", placeholder: "例如 torvalds", value: ghUser, onChange: (e) => setGhUser(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-field src-actions-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": "true" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => void fetchStars(), disabled: fetching, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "github", size: 14 }),
            " ",
            fetching ? "拉取中…" : "拉取 Star"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "src-hint src-grow", children: fetching && progress ? `拉取中… 已获取 ${progress.fetched} 个（第 ${progress.page} 页）` : ghMsg || (hasToken ? "已授权（Token 加密存储）" : "未设置 Token（公开 API 速率 60 次/小时）") })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "一键登录（推荐）" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "src-hint", children: [
        "OAuth Device Flow 免粘贴 Token：点击后打开 GitHub 授权页，验证码自动复制到剪贴板。需先在 ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://github.com/settings/developers", target: "_blank", rel: "noreferrer", children: "GitHub 开发者设置" }),
        " 创建 OAuth App（启用 Device Flow）并填入 Client ID。"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-grid-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "github-clientid", children: "OAuth Client ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "github-clientid", placeholder: "Iv1.xxxx…（OAuth App 的 Client ID）", value: clientId, onChange: (e) => setClientId(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "github-login-btn", children: "授权状态" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-actions", id: "github-login-btn", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => void deviceLogin(), disabled: loggingIn, children: loggingIn ? "等待浏览器授权…" : "一键登录 GitHub" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "src-hint", children: hasToken ? "✓ 已授权" : "未授权" })
          ] })
        ] })
      ] }),
      userCode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "验证码" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "github-code-display", children: userCode })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "手动 Token（备选）" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "src-hint", children: [
        "粘贴 personal access token（",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://github.com/settings/tokens?type=beta", target: "_blank", rel: "noreferrer", children: "在此创建" }),
        "，勾选只读 public 权限即可）。保存后用系统钥匙串加密存储，留空保存即清除。"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "github-token", children: "Token" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "github-token", type: "password", placeholder: hasToken ? "已加密保存（留空保存 = 清除）" : "ghp_...（可选）", value: tokenInput, onChange: (e) => setTokenInput(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-field src-actions-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": "true" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => void saveToken(), children: "保存 Token" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "src-hint src-grow", children: hasToken ? "Token 已加密存储" : "" })
        ] })
      ] })
    ] })
  ] });
}
function TwitterBookmarkManager() {
  const { importTwitterBookmarks, showToast } = useStore();
  const [twMsg, setTwMsg] = reactExports.useState("");
  const importBookmarks = async () => {
    setTwMsg("选择文件中…");
    try {
      const r2 = await importTwitterBookmarks();
      if (r2.total === 0) {
        setTwMsg("已取消或未选择文件");
        return;
      }
      setTwMsg(`导入完成：新增 ${r2.added} / 共 ${r2.total} 条`);
      showToast("X 书签已更新");
    } catch (e) {
      setTwMsg("失败：" + e.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "set-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "X 书签管理" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-hint", children: "X 官方 API 读取书签需付费 OAuth 凭证，本地无法实时拉取。请从 X 导出书签文件后在此导入。支持 JSON 数组或 CSV（含 url / text / author / created_at 等字段）。" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => void importBookmarks(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "twitter", size: 14 }),
        " 导入书签文件"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "src-hint src-grow", children: twMsg })
    ] })
  ] }) });
}
const PAGE = 100;
function DbView() {
  const [tables, setTables] = reactExports.useState(null);
  const [tablesErr, setTablesErr] = reactExports.useState("");
  const [active, setActive] = reactExports.useState(null);
  const [data, setData] = reactExports.useState(null);
  const [page, setPage] = reactExports.useState(0);
  const [loading, setLoading] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState("");
  reactExports.useEffect(() => {
    void window.capybara.invoke("db:tables").then((r2) => setTables(r2)).catch((e) => setTablesErr(String(e?.message || e || "未知错误")));
  }, []);
  const openTable = async (name) => {
    setActive(name);
    setPage(0);
    setErr("");
    setData(null);
    await loadRows(name, 0);
  };
  const loadRows = async (name, p2) => {
    setLoading(true);
    try {
      const r2 = await window.capybara.invoke("db:rows", name, PAGE, p2 * PAGE);
      setData(r2);
      setPage(p2);
    } catch (e) {
      setErr(String(e?.message || e || "未知错误"));
    } finally {
      setLoading(false);
    }
  };
  if (tables === null && !tablesErr) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "set-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "set-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-hint", children: "读取数据库表结构中…" }) }) });
  }
  if (tablesErr) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "set-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "set-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "src-warn", children: [
      "⚠ 读取失败：",
      tablesErr
    ] }) }) });
  }
  if (active && data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "set-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-head-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "src-label", children: [
          active,
          " · 共 ",
          data.rows.length,
          " 行/页（第 ",
          page + 1,
          " 页）"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "mini-btn", onClick: () => {
          setActive(null);
          setData(null);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "chevronRight", size: 13 }),
          " 返回表列表"
        ] })
      ] }),
      err && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "src-warn", children: [
        "⚠ ",
        err
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "db-table-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "db-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: data.columns.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: c }, c)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: data.rows.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: data.columns.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: renderCell(row[c]) }, c)) }, i)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-actions", style: { marginTop: 10 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: page === 0 || loading, onClick: () => void loadRows(active, page - 1), children: "上一页" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: data.rows.length < PAGE || loading, onClick: () => void loadRows(active, page + 1), children: "下一页" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "src-hint src-grow", children: loading ? "加载中…" : `显示 ${data.rows.length} 行` })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "set-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "数据库数据查看" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "src-hint", children: [
      "读取本地 SQLite 文件（",
      tables.length,
      " 张表）。点击任意表查看其结构与数据，便于排查问题。"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "db-tables", children: tables.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "db-table-row", onClick: () => void openTable(t2.name), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "db-tname", children: t2.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "db-tcount", children: [
        t2.rowCount,
        " 行"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "db-tcols", children: t2.columns.map((c) => c.name + (c.pk ? "*" : "")).join(", ") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "chevronRight", size: 14 })
    ] }, t2.name)) })
  ] }) });
}
function renderCell(v2) {
  if (v2 === null || v2 === void 0) return "";
  if (typeof v2 === "object") {
    try {
      return JSON.stringify(v2);
    } catch {
      return String(v2);
    }
  }
  return String(v2);
}
const dispMs = (ms) => ms < 1e3 ? `${ms}ms` : `${(ms / 1e3).toFixed(1)}s`;
const dispStatus = (s) => s === 0 ? "网络错误" : s === 304 ? "304 未修改" : `${s} OK`;
function DiagPanel() {
  const { feeds, load, loadFeeds, showToast } = useStore();
  const [step1Status, setStep1Status] = reactExports.useState("idle");
  const [step2Status, setStep2Status] = reactExports.useState("idle");
  const [step3Status, setStep3Status] = reactExports.useState("idle");
  const [purgeResult, setPurgeResult] = reactExports.useState(null);
  const [purgeDays, setPurgeDays] = reactExports.useState(90);
  const [purgeMax, setPurgeMax] = reactExports.useState(2e3);
  const [selectedFeedId, setSelectedFeedId] = reactExports.useState(0);
  const [singleNormal, setSingleNormal] = reactExports.useState(null);
  const [singleForce, setSingleForce] = reactExports.useState(null);
  const [allNormal, setAllNormal] = reactExports.useState(null);
  const [allForce, setAllForce] = reactExports.useState(null);
  const runStep1 = async () => {
    setStep1Status("running");
    setPurgeResult(null);
    try {
      const r2 = await window.capybara.invoke("diag:testPurge", purgeDays, purgeMax);
      setPurgeResult(r2);
      await loadFeeds();
      await load();
      setStep1Status("done");
    } catch (e) {
      showToast("诊断失败：" + e.message);
      setStep1Status("idle");
    }
  };
  const runStep2Normal = async () => {
    if (!selectedFeedId) {
      showToast("请先选择订阅源");
      return;
    }
    setStep2Status("running");
    setSingleNormal(null);
    setSingleForce(null);
    try {
      const r2 = await window.capybara.invoke("diag:testRefreshOne", selectedFeedId);
      setSingleNormal(r2);
      await loadFeeds();
      await load();
    } catch (e) {
      showToast("普通刷新失败：" + e.message);
    }
    setStep2Status("idle");
  };
  const runStep2Force = async () => {
    if (!selectedFeedId) {
      showToast("请先选择订阅源");
      return;
    }
    setStep2Status("running");
    try {
      const r2 = await window.capybara.invoke("diag:testForceOne", selectedFeedId);
      setSingleForce(r2);
      await loadFeeds();
      await load();
      setStep2Status("done");
    } catch (e) {
      showToast("强制刷新失败：" + e.message);
      setStep2Status("idle");
    }
  };
  const runStep3Normal = async () => {
    setStep3Status("running");
    setAllNormal(null);
    setAllForce(null);
    try {
      const r2 = await window.capybara.invoke("diag:testRefreshAll");
      setAllNormal(r2);
      await loadFeeds();
      await load();
    } catch (e) {
      showToast("全量刷新失败：" + e.message);
    }
    setStep3Status("idle");
  };
  const runStep3Force = async () => {
    setStep3Status("running");
    try {
      const r2 = await window.capybara.invoke("diag:testForceAll");
      setAllForce(r2);
      await loadFeeds();
      await load();
      setStep3Status("done");
    } catch (e) {
      showToast("强制全量刷新失败：" + e.message);
      setStep3Status("idle");
    }
  };
  const conclusion = () => {
    const lines = [];
    if (purgeResult?.etagWarning) {
      lines.push("⚠ 清空数据后 feeds 表仍保留 etag/last_modified 缓存头，下一次刷新会携带这些头 → 服务器可能返回 304，导致「刷新无效」");
    }
    if (singleNormal?.log?.conditionalMatch) {
      lines.push("⚠ 单源刷新命中 etag 匹配（HTTP 304 或 etag 未变+无新条目），服务器告知「未修改」，未下载新内容");
      if (singleForce?.log && singleForce.log.itemsNew > 0) {
        lines.push(`✓ 强制刷新（清除 etag 后请求）成功拉取 ${singleForce.log.itemsNew} 条新数据，证明服务器有新内容，仅因 etag 缓存拦截`);
      }
    }
    if (allNormal) {
      const c304 = allNormal.logs.filter((l2) => l2.conditionalMatch).length;
      const errs = allNormal.logs.filter((l2) => l2.httpStatus === 0 || l2.error).length;
      if (c304 > 0) lines.push(`⚠ 全量刷新中 ${c304}/${allNormal.logs.length} 个源因 etag 匹配跳过下载（304）`);
      if (errs > 0) lines.push(`⚠ 全量刷新中 ${errs} 个源请求失败（网络/解析错误）`);
      if (c304 === 0 && errs === 0) lines.push("✓ 全量刷新正常，所有源均返回 200 且有新数据");
    }
    if (lines.length === 0) lines.push("请执行上述诊断步骤以生成结论");
    return lines;
  };
  const renderLog = (entry, idx) => {
    if (!entry) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "diag-empty", children: "（无读取信息）" });
    const ok2 = entry.httpStatus === 200 && !entry.error && entry.itemsNew > 0;
    const warn = entry.conditionalMatch;
    const err = entry.httpStatus === 0 || !!entry.error;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `diag-log ${ok2 ? "ok" : warn ? "warn" : err ? "err" : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "diag-log-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "diag-log-label", children: "请求" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "GET → ",
          dispStatus(entry.httpStatus)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "diag-log-time", children: dispMs(entry.durationMs) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "diag-log-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "diag-log-label", children: "条目" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "前 ",
          entry.itemsBefore,
          " → 后 ",
          entry.itemsAfter,
          "（新增 ",
          entry.itemsNew,
          " 条）"
        ] })
      ] }),
      entry.conditionalMatch && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "diag-log-row warn-text", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "diag-log-label", children: "缓存" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          'etag 匹配: "',
          entry.etagUsed?.slice(0, 20),
          entry.etagUsed && entry.etagUsed.length > 20 ? "…" : "",
          '" → 服务器返回 304 或内容无变化，未下载'
        ] })
      ] }),
      entry.etagReturned && !entry.conditionalMatch && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "diag-log-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "diag-log-label", children: "新 etag" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "diag-mono", children: [
          entry.etagReturned.slice(0, 40),
          entry.etagReturned.length > 40 ? "…" : ""
        ] })
      ] }),
      entry.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "diag-log-row err-text", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "diag-log-label", children: "错误" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: entry.error })
      ] })
    ] }, 0);
  };
  const renderFeedRow = (s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "diag-feed-row", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "diag-feed-name", children: s.name }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "diag-mono dim", children: [
      s.itemCount,
      " 条"
    ] }),
    s.etag && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "diag-tag", children: "etag" }),
    s.lastModified && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "diag-tag", children: "lm" }),
    s.errorCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "diag-tag err-tag", children: [
      "错误×",
      s.errorCount
    ] })
  ] }, s.id);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "diag-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "diag-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "activity", size: 18 }),
      " 刷新诊断"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "diag-step", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "diag-step-num", children: "1" }),
        " 清空本地存储验证"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "diag-step-controls", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          "保留天数 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: purgeDays, onChange: (e) => setPurgeDays(Number(e.target.value)), className: "diag-input" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          "最大条目 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: purgeMax, onChange: (e) => setPurgeMax(Number(e.target.value)), className: "diag-input" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: runStep1, disabled: step1Status === "running", className: "diag-btn", children: step1Status === "running" ? "执行中…" : "执行清空" })
      ] }),
      purgeResult && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `diag-result ${purgeResult.etagWarning ? "warn-box" : "ok-box"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "diag-result-row", children: [
          "清空前: ",
          purgeResult.snapshotBefore.totalItems,
          " 条项目"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "diag-result-row", children: [
          "清空后: ",
          purgeResult.snapshotAfter.totalItems,
          " 条项目（删除 ",
          purgeResult.purgedItems,
          " 条）"
        ] }),
        purgeResult.etagWarning && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "diag-result-row warn-text", children: [
          "⚠ 检测到 feeds 表仍有 etag/last_modified 缓存头，下次刷新时可能命中 304 跳过下载。",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "原因：清空仅删除 items 表数据，未清除 feeds 表的条件请求缓存。"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "diag-details", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { children: "源状态快照（清空前）" }),
          purgeResult.snapshotBefore.feeds.map(renderFeedRow)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "diag-step", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "diag-step-num", children: "2" }),
        " 单源刷新诊断"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "diag-step-controls", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: selectedFeedId, onChange: (e) => setSelectedFeedId(Number(e.target.value)), className: "diag-select", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 0, children: "-- 选择订阅源 --" }),
          feeds.filter((f2) => f2.enabled !== 0).map((f2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: f2.id, children: [
            f2.name,
            " (",
            f2.type,
            ")"
          ] }, f2.id))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: runStep2Normal, disabled: step2Status === "running" || !selectedFeedId, className: "diag-btn", children: "普通刷新" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: runStep2Force, disabled: step2Status === "running" || !selectedFeedId, className: "diag-btn force", children: "强制刷新（清 etag）" })
      ] }),
      singleNormal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "diag-step-result", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "diag-subtitle", children: "普通刷新（保留 etag）" }),
        renderLog(singleNormal.log)
      ] }),
      singleForce && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "diag-step-result", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "diag-subtitle", children: "强制刷新（已清除 etag）" }),
        renderLog(singleForce.log)
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "diag-step", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "diag-step-num", children: "3" }),
        " 全量刷新诊断"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "diag-step-controls", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: runStep3Normal, disabled: step3Status === "running", className: "diag-btn", children: "普通全量刷新" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: runStep3Force, disabled: step3Status === "running", className: "diag-btn force", children: "强制全量刷新（清全部 etag）" })
      ] }),
      allNormal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "diag-step-result", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "diag-subtitle", children: [
          "全量刷新结果（",
          allNormal.logs.length,
          " 个源）"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "diag-all-grid", children: allNormal.logs.map((l2, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `diag-all-card ${l2.conditionalMatch ? "warn-card" : l2.httpStatus === 0 || l2.error ? "err-card" : "ok-card"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "diag-all-name", children: l2.feedName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "diag-all-stat", children: dispStatus(l2.httpStatus) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "diag-all-stat", children: l2.itemsNew > 0 ? `+${l2.itemsNew} 条` : "无新增" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "diag-all-stat dim", children: dispMs(l2.durationMs) }),
          l2.conditionalMatch && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "diag-all-stat warn-text", children: "etag 匹配" }),
          l2.error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "diag-all-stat err-text", children: l2.error })
        ] }, i)) })
      ] }),
      allForce && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "diag-step-result", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "diag-subtitle", children: [
          "强制全量刷新结果（",
          allForce.logs.length,
          " 个源）"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "diag-all-grid", children: allForce.logs.map((l2, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `diag-all-card ${l2.conditionalMatch ? "warn-card" : l2.httpStatus === 0 || l2.error ? "err-card" : "ok-card"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "diag-all-name", children: l2.feedName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "diag-all-stat", children: dispStatus(l2.httpStatus) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "diag-all-stat", children: l2.itemsNew > 0 ? `+${l2.itemsNew} 条` : "无新增" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "diag-all-stat dim", children: dispMs(l2.durationMs) }),
          l2.error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "diag-all-stat err-text", children: l2.error })
        ] }, i)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FontDiagSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "diag-conclusion", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "📋 诊断结论" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: conclusion().map((line, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: line }, i)) })
    ] })
  ] });
}
function FontDiagSection() {
  const { appearance, updateAppearance, showToast } = useStore();
  const [fontList, setFontList] = reactExports.useState([]);
  const [scanning, setScanning] = reactExports.useState(false);
  const [currentFont, setCurrentFont] = reactExports.useState("");
  reactExports.useEffect(() => {
    setCurrentFont(appearance.fontFamily || "系统默认");
  }, [appearance.fontFamily]);
  const rescanFonts = async () => {
    setScanning(true);
    try {
      const list = await window.capybara.invoke("app:fontListRefresh");
      setFontList(list);
      showToast(`已重新扫描，共 ${list.length} 个可用字体`);
    } catch {
      showToast("字体扫描失败");
    }
    setScanning(false);
  };
  const resetFont = () => {
    updateAppearance({ fontFamily: "" });
    showToast("已清除字体设置，恢复系统默认");
  };
  const testFont = async (font) => {
    updateAppearance({ fontFamily: font });
    setTimeout(() => {
      const computed = window.getComputedStyle(document.body).fontFamily;
      const expected = `"${font}"`;
      const matched = computed.startsWith(expected) || computed.includes(font);
      showToast(matched ? `✓ "${font}" 已生效` : `⚠ "${font}" 可能未生效（computed: ${computed.slice(0, 60)}）`);
    }, 100);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "diag-step", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "diag-step-num", children: "⚙" }),
      " 字体诊断"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "diag-step-controls", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "diag-result-row", children: [
        "当前字体: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: currentFont })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: rescanFonts, disabled: scanning, className: "diag-btn", children: scanning ? "扫描中…" : "重新扫描系统字体" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: resetFont, className: "diag-btn force", children: "清除字体设置" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "diag-step-controls", style: { marginTop: 8 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value: appearance.fontFamily,
          onChange: (e) => testFont(e.target.value),
          className: "diag-select",
          style: { maxWidth: 260 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "系统默认" }),
            (fontList.length > 0 ? fontList : []).map((f2) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: f2, children: f2 }, f2))
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "diag-mono dim", children: "选择字体后会自动应用并检测是否生效" })
    ] }),
    fontList.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "diag-details", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("summary", { children: [
        "可用字体列表（",
        fontList.length,
        " 个）"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4px 12px", fontSize: 12 }, children: fontList.map((f2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "diag-mono",
          style: { cursor: "pointer", padding: "2px 4px", borderRadius: 4 },
          onClick: () => testFont(f2),
          title: `点击测试 "${f2}"`,
          children: f2
        },
        f2
      )) })
    ] })
  ] });
}
const THUMB_WIDTH = 22;
const THUMB_HEIGHT = 12;
const TRACK_HEIGHT = 16;
const TRACK_INSET = (TRACK_HEIGHT - THUMB_HEIGHT) / 2;
const DsSlider = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  formatValue,
  showTicks = false,
  disabled = false,
  className = "",
  style,
  "aria-label": ariaLabel
}) => {
  const containerRef = reactExports.useRef(null);
  const rafRef = reactExports.useRef(null);
  const pendingClientXRef = reactExports.useRef(null);
  const dragCleanupRef = reactExports.useRef(null);
  const onChangeRef = reactExports.useRef(onChange);
  const [dragging, setDragging] = reactExports.useState(false);
  const [hovering, setHovering] = reactExports.useState(false);
  const [focused, setFocused] = reactExports.useState(false);
  reactExports.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  reactExports.useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      pendingClientXRef.current = null;
      dragCleanupRef.current?.();
    };
  }, []);
  const clampedValue = Math.max(min, Math.min(max, value));
  const pct = max > min ? Math.max(0, Math.min(100, (clampedValue - min) / (max - min) * 100)) : 0;
  const insetTravelWidth = THUMB_WIDTH + TRACK_INSET * 2;
  const positionAt = reactExports.useCallback(
    (positionPct) => {
      const insetOffset = (0.5 - positionPct / 100) * insetTravelWidth;
      return `calc(${positionPct}% ${insetOffset < 0 ? "-" : "+"} ${Math.abs(insetOffset)}px)`;
    },
    [insetTravelWidth]
  );
  const thumbLeft = positionAt(pct);
  const activeTrackInsetOffset = (1 - pct / 100) * insetTravelWidth;
  const activeTrackWidth = `calc(${pct}% + ${activeTrackInsetOffset}px)`;
  const intervalCount = step > 0 ? Math.floor((max - min) / step) : 0;
  const tickStride = Math.max(1, Math.ceil(intervalCount / 20));
  const tickValues = showTicks && intervalCount > 1 ? Array.from({ length: Math.floor((intervalCount - 1) / tickStride) }, (_, index) => {
    const tickIndex = (index + 1) * tickStride;
    return parseFloat((min + tickIndex * step).toPrecision(10));
  }).filter((tickValue) => tickValue < max) : [];
  const snap = reactExports.useCallback(
    (raw) => {
      const stepped = Math.round((raw - min) / step) * step + min;
      return Math.max(min, Math.min(max, parseFloat(stepped.toPrecision(10))));
    },
    [min, max, step]
  );
  const handlePointerDown = (e) => {
    if (disabled) return;
    const container = containerRef.current;
    if (!container) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    dragCleanupRef.current?.();
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    pendingClientXRef.current = null;
    const rect = container.getBoundingClientRect();
    const travelWidth = rect.width - THUMB_WIDTH - TRACK_INSET * 2;
    let lastEmittedValue = null;
    const emit = (clientX) => {
      const ratio = travelWidth <= 0 ? 0 : Math.max(0, Math.min(1, (clientX - rect.left - THUMB_WIDTH / 2 - TRACK_INSET) / travelWidth));
      const nextValue = snap(min + ratio * (max - min));
      if (nextValue === lastEmittedValue) return;
      lastEmittedValue = nextValue;
      onChangeRef.current(nextValue);
    };
    const flushPending = () => {
      const pendingClientX = pendingClientXRef.current;
      pendingClientXRef.current = null;
      if (pendingClientX !== null) emit(pendingClientX);
    };
    const onMove = (ev) => {
      pendingClientXRef.current = ev.clientX;
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        flushPending();
      });
    };
    const cleanup = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (dragCleanupRef.current === cleanup) dragCleanupRef.current = null;
    };
    const onUp = () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      flushPending();
      cleanup();
      setDragging(false);
    };
    dragCleanupRef.current = cleanup;
    emit(e.clientX);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };
  const handleKeyDown = (e) => {
    if (disabled) return;
    let nextValue = clampedValue;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      nextValue = snap(clampedValue - step);
      e.preventDefault();
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      nextValue = snap(clampedValue + step);
      e.preventDefault();
    } else if (e.key === "PageDown") {
      nextValue = snap(clampedValue - step * 2);
      e.preventDefault();
    } else if (e.key === "PageUp") {
      nextValue = snap(clampedValue + step * 2);
      e.preventDefault();
    } else if (e.key === "Home") {
      nextValue = min;
      e.preventDefault();
    } else if (e.key === "End") {
      nextValue = max;
      e.preventDefault();
    }
    if (nextValue !== clampedValue) {
      onChangeRef.current(nextValue);
    }
  };
  const tooltipText = formatValue ? formatValue(clampedValue) : String(clampedValue);
  const isTooltipVisible = dragging || hovering;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `ds-slider-wrapper ${className}`,
      style: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        ...style
      },
      children: [
        label && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              color: "var(--ds-text-secondary, #666)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
              formatValue && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatValue(clampedValue) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            ref: containerRef,
            role: "slider",
            tabIndex: disabled ? -1 : 0,
            "aria-label": ariaLabel || label || "滑块",
            "aria-valuemin": min,
            "aria-valuemax": max,
            "aria-valuenow": clampedValue,
            "aria-disabled": disabled,
            onPointerDown: handlePointerDown,
            onPointerEnter: () => setHovering(true),
            onPointerLeave: () => setHovering(false),
            onKeyDown: handleKeyDown,
            onFocus: () => setFocused(true),
            onBlur: () => setFocused(false),
            className: "ds-slider-container",
            style: {
              position: "relative",
              width: "100%",
              height: 24,
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.4 : 1,
              userSelect: "none",
              touchAction: "none",
              outline: "none"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-slot": "slider-track",
                  style: {
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    height: TRACK_HEIGHT,
                    borderRadius: 9999,
                    overflow: "hidden",
                    pointerEvents: "none",
                    backgroundColor: "var(--ds-on-surface, rgba(127, 127, 127, 0.12))",
                    boxShadow: focused ? "0 0 0 2px var(--ds-brand-primary, #0a84ff)" : "none",
                    transition: "box-shadow var(--ds-motion-swift, 180ms ease)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        "data-slot": "slider-track-active",
                        style: {
                          position: "absolute",
                          left: 0,
                          top: 0,
                          height: "100%",
                          borderRadius: 9999,
                          width: activeTrackWidth,
                          backgroundColor: "var(--ds-brand-primary, var(--card-accent, #0a84ff))",
                          transition: dragging ? "none" : "width var(--ds-motion-spring, 240ms cubic-bezier(0.34, 1.3, 0.64, 1))"
                        }
                      }
                    ),
                    tickValues.map((tickValue) => {
                      const tickPct = (tickValue - min) / (max - min) * 100;
                      const active = tickValue <= clampedValue;
                      return /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          "data-slot": "slider-tick",
                          "data-value": tickValue,
                          "data-active": active,
                          style: {
                            position: "absolute",
                            top: "50%",
                            left: positionAt(tickPct),
                            transform: "translate(-50%, -50%)",
                            width: 2,
                            height: 6,
                            borderRadius: 9999,
                            zIndex: 1,
                            pointerEvents: "none",
                            backgroundColor: active ? "color-mix(in srgb, var(--ds-brand-primary-text, #ffffff) 52%, transparent)" : "color-mix(in srgb, var(--ds-text-primary, #000000) 18%, transparent)"
                          }
                        },
                        tickValue
                      );
                    })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-slot": "slider-thumb-positioner",
                  style: {
                    position: "absolute",
                    top: "50%",
                    left: thumbLeft,
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                    zIndex: 2,
                    transition: dragging ? "none" : "left var(--ds-motion-spring, 240ms cubic-bezier(0.34, 1.3, 0.64, 1))"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          position: "absolute",
                          bottom: "calc(100% + 8px)",
                          left: "50%",
                          transform: `translateX(-50%) scale(${isTooltipVisible ? 1 : 0.8})`,
                          opacity: isTooltipVisible ? 1 : 0,
                          pointerEvents: "none",
                          transition: "opacity var(--ds-motion-swift, 180ms ease), transform var(--ds-motion-swift, 180ms ease)",
                          backgroundColor: "var(--ds-surface-100, #ffffff)",
                          color: "var(--ds-text-primary, #181b19)",
                          padding: "2px 7px",
                          borderRadius: "var(--ds-radius-sm, 6px)",
                          fontSize: "11px",
                          fontWeight: 600,
                          fontVariantNumeric: "tabular-nums",
                          boxShadow: "var(--ds-elevation-200, 0 3px 10px rgba(0, 0, 0, 0.15))",
                          border: "0.5px solid var(--ds-divider, rgba(0,0,0,0.08))",
                          whiteSpace: "nowrap",
                          zIndex: 10
                        },
                        children: [
                          tooltipText,
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                position: "absolute",
                                top: "100%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: 0,
                                height: 0,
                                borderLeft: "4px solid transparent",
                                borderRight: "4px solid transparent",
                                borderTop: "4px solid var(--ds-surface-100, #ffffff)"
                              }
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        "data-slot": "slider-thumb",
                        style: {
                          width: THUMB_WIDTH,
                          height: THUMB_HEIGHT,
                          boxSizing: "border-box",
                          borderRadius: 9999,
                          backgroundColor: "var(--ds-surface-100, #ffffff)",
                          boxShadow: dragging ? "var(--ds-elevation-200, 0 4px 12px rgba(0,0,0,0.25))" : "0 0.5px 2px rgba(0, 0, 0, 0.2), inset 0 0.5px 0.5px #ffffff",
                          transform: dragging ? "scale(1.5)" : "scale(1)",
                          transition: "transform var(--ds-motion-spring, 240ms cubic-bezier(0.34, 1.3, 0.64, 1)), box-shadow var(--ds-motion-spring, 240ms cubic-bezier(0.34, 1.3, 0.64, 1))"
                        }
                      }
                    )
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
};
const FONT_BASE_PX = 14;
const FONT_MIN_PX = 13;
const FONT_MAX_PX = 24;
class TabErrorBoundary extends reactExports.Component {
  state = { err: null };
  static getDerivedStateFromError(err) {
    return { err };
  }
  render() {
    if (this.state.err) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "set-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "src-warn", children: [
          "该设置项加载出错：",
          this.state.err.message
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mini-btn", onClick: () => this.setState({ err: null }), children: "重试" })
      ] }) });
    }
    return this.props.children;
  }
}
const TABS = [
  { key: "appearance", label: "外观", icon: "palette" },
  { key: "rss", label: "RSS 订阅", icon: "rss" },
  { key: "github", label: "GitHub Star", icon: "github" },
  { key: "twitter", label: "X 书签", icon: "twitter" },
  { key: "actions", label: "数据管理", icon: "archived" },
  { key: "ai", label: "AI 模型", icon: "sparkles" },
  { key: "shortcuts", label: "快捷键", icon: "keyboard" },
  { key: "data", label: "数据查看", icon: "book" },
  { key: "diag", label: "刷新诊断", icon: "activity" },
  { key: "thanks", label: "致谢", icon: "heart" }
];
function SettingsView() {
  const { settingsTab, setSettingsTab, refreshAll, closeSettings } = useStore();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-modal-mask", ...press(() => closeSettings()), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "settings settings-modal", onClick: (e) => e.stopPropagation(), onPointerDown: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "settings-nav", children: TABS.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `set-nav ${settingsTab === t2.key ? "active" : ""}`, ...pressBtn(() => setSettingsTab(t2.key)), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: t2.icon, size: 16 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t2.label })
    ] }, t2.key)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-panel", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabErrorBoundary, { children: [
      settingsTab === "appearance" && /* @__PURE__ */ jsxRuntimeExports.jsx(AppearanceTab, {}),
      settingsTab === "rss" && /* @__PURE__ */ jsxRuntimeExports.jsx(RssManager, {}),
      settingsTab === "github" && /* @__PURE__ */ jsxRuntimeExports.jsx(GithubStarManager, {}),
      settingsTab === "twitter" && /* @__PURE__ */ jsxRuntimeExports.jsx(TwitterBookmarkManager, {}),
      settingsTab === "actions" && /* @__PURE__ */ jsxRuntimeExports.jsx(ActionsTab, { onRefresh: refreshAll }),
      settingsTab === "ai" && /* @__PURE__ */ jsxRuntimeExports.jsx(AiModelTab, {}),
      settingsTab === "shortcuts" && /* @__PURE__ */ jsxRuntimeExports.jsx(ShortcutsTab, {}),
      settingsTab === "data" && /* @__PURE__ */ jsxRuntimeExports.jsx(DbView, {}),
      settingsTab === "diag" && /* @__PURE__ */ jsxRuntimeExports.jsx(DiagPanel, {}),
      settingsTab === "thanks" && /* @__PURE__ */ jsxRuntimeExports.jsx(ThanksTab, {})
    ] }, settingsTab) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "settings-close", title: "关闭设置", ...pressBtn(() => closeSettings()), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 16 }) })
  ] }) });
}
function AppearanceTab() {
  const { appearance, soundEnabled, soundVolume, updateAppearance, setSoundEnabled: setSoundEnabled2, setSoundVolume: setSoundVolume2, logo, setLogo, showToast, themeBundleId, setThemeBundle } = useStore();
  const [systemFonts, setSystemFonts] = reactExports.useState([]);
  const [logos, setLogos] = reactExports.useState([]);
  const styleGridRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    window.capybara.invoke("app:fontList").then((list) => setSystemFonts(list)).catch(() => {
    });
  }, []);
  reactExports.useEffect(() => {
    window.capybara.invoke("app:logoList").then((list) => setLogos(list)).catch(() => {
    });
  }, []);
  const setTheme = (theme) => updateAppearance({ theme });
  const setColorTheme = (colorTheme) => updateAppearance({ colorTheme });
  const setFontWeight = (w2) => updateAppearance({ fontWeight: w2 });
  const setReadingTheme = (id2) => updateAppearance({ readingTheme: id2 });
  const fontPx = Math.min(FONT_MAX_PX, Math.max(FONT_MIN_PX, Math.round(appearance.fontScale * FONT_BASE_PX)));
  const setFontPx = (px) => {
    const clamped = Math.min(FONT_MAX_PX, Math.max(FONT_MIN_PX, px));
    updateAppearance({ fontScale: clamped / FONT_BASE_PX });
  };
  const [, themeTick] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const grid = styleGridRef.current;
    if (!grid) return;
    const active = grid.querySelector(".style-opt.active");
    active?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [appearance.colorTheme]);
  const currentStyle = appearance.colorTheme === "none" ? { label: "默认", preview: "linear-gradient(135deg,#f1f0eb,#d8d6ce)" } : COLOR_THEMES.find((s) => s.key === appearance.colorTheme) ?? { label: "默认", preview: "linear-gradient(135deg,#f1f0eb,#d8d6ce)" };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-scroll", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-head-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "主题套装" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cur-chip", children: listThemeBundles().find((b) => b.id === themeBundleId)?.label || "自定义" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-hint", children: "一键切换图标风格 + 音效风格，全局即时生效。后续接入新素材包后会在此列出可选套装。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bundle-grid", children: [
        listThemeBundles().map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: `bundle-opt ${themeBundleId === b.id ? "active" : ""}`,
            onClick: () => setThemeBundle(b.id),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bundle-preview", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "sparkles", size: 20 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "music", size: 16 })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bundle-info", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bundle-name", children: b.label }),
                b.description && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bundle-desc", children: b.description })
              ] })
            ]
          },
          b.id
        )),
        themeBundleId === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bundle-opt active", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bundle-preview", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "sparkles", size: 20 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "music", size: 16 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bundle-info", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bundle-name", children: "自定义" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bundle-desc", children: "图标与音效来自不同主题" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "主题" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "seg", children: THEME_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `seg-btn ${appearance.theme === o.key ? "active" : ""}`, onClick: () => setTheme(o.key), children: o.label }, o.key)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-head-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "UI 配色" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "cur-chip", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cur-swatch", style: { background: currentStyle.preview } }),
          currentStyle.label
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-hint", children: "界面整面配色：选择后主强调色（按钮/选中态/聚焦环）随之切换。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "style-grid", ref: styleGridRef, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: `style-opt ${appearance.colorTheme === "none" ? "active" : ""}`,
            onClick: (e) => {
              setColorTheme("none");
              e.currentTarget.focus();
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "style-preview", style: { background: "linear-gradient(135deg,#f1f0eb,#d8d6ce)" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "style-name", children: "默认" })
            ]
          }
        ),
        COLOR_THEMES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: `style-opt ${appearance.colorTheme === s.key ? "active" : ""}`,
            onClick: (e) => {
              setColorTheme(s.key);
              e.currentTarget.focus();
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "style-preview", style: { background: s.preview } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "style-name", children: s.label })
            ]
          },
          s.key
        ))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "字体" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "src-row", style: { marginBottom: 10 }, children: [
        "全局字体",
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: appearance.fontFamily,
            onChange: (e) => updateAppearance({ fontFamily: e.target.value }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "系统默认" }),
              systemFonts.map((f2) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: f2, children: f2 }, f2))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-row", style: { marginBottom: 6, justifyContent: "space-between" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "字号" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fs-pill", "aria-live": "polite", children: [
          fontPx,
          "px"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-size-slider-wrap", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fs-label-min", children: "小" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DsSlider,
          {
            min: FONT_MIN_PX,
            max: FONT_MAX_PX,
            step: 1,
            value: fontPx,
            onChange: setFontPx,
            formatValue: (v2) => `${v2}px`,
            showTicks: true,
            className: "flex-1",
            "aria-label": "字号"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fs-label-max", children: "大" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "font-preview-box",
          style: {
            padding: "10px 14px",
            borderRadius: "var(--ds-radius-md, 12px)",
            backgroundColor: "var(--ds-on-surface, rgba(127, 127, 127, 0.06))",
            fontSize: `${fontPx}px`,
            fontFamily: uiFontStack(appearance.fontFamily),
            fontWeight: appearance.fontWeight === "thin" ? 300 : appearance.fontWeight === "bold" ? 700 : 400,
            marginBottom: 10,
            transition: "font-size var(--ds-motion-soft, 240ms ease)"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--ds-text-primary)", lineHeight: 1.6, margin: 0 }, children: "这是字号预览效果：敏捷捕获，从容阅读。沉淀个人知识管道。" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "src-row", children: [
        "字重",
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "seg", children: ["thin", "normal", "bold"].map((w2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `seg-btn ${appearance.fontWeight === w2 ? "active" : ""}`,
            style: { fontWeight: w2 === "thin" ? 300 : w2 === "bold" ? 700 : 400 },
            onClick: () => setFontWeight(w2),
            children: w2 === "thin" ? "细" : w2 === "normal" ? "正常" : "粗"
          },
          w2
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-hint", children: "全局字体从系统已安装的全部字体中选择，字号为全局基础字号（13–18px，默认 14px），作用于全部界面与阅读正文。" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "src-head-row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "阅读配色" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-hint", children: "选择后仅改变正文阅读区域的配色，不影响左侧列表和设置等界面。新增配色只能通过「导入配色」加载 JSON 文件（含 name / mode / colors）。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "src-actions", style: { marginBottom: 10 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: async () => {
        const r2 = await window.capybara.invoke("readingTheme:import");
        if (!r2.ok) {
          if (r2.error && r2.error !== "已取消") showToast("导入失败：" + r2.error);
          return;
        }
        const id2 = `custom-${Date.now()}`;
        upsertCustomReadingTheme({ id: id2, name: r2.theme.name, mode: r2.theme.mode, colors: r2.theme.colors });
        setReadingTheme(id2);
        themeTick((t2) => t2 + 1);
        showToast("已导入配色：" + r2.theme.name);
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "upload", size: 14 }),
        " 导入配色"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-theme-grid", children: renderReadingThemes(appearance.readingTheme, (id2) => setReadingTheme(id2)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "src-head-row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "应用图标" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-hint", children: "切换应用在 Dock 中显示的图标。将 PNG 图标放入 build/logos 目录后会自动出现在这里（建议 1024×1024，文件名作为图标名）。" }),
      logos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-hint", children: "暂无内置图标，请将 PNG 文件放入 build/logos 目录。" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "logo-grid", children: logos.map((l2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: `logo-opt ${logo === l2.id ? "active" : ""}`,
          onClick: () => setLogo(l2.id),
          title: l2.name,
          children: [
            l2.thumb ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "logo-preview", src: l2.thumb, alt: l2.name }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "logo-preview logo-fallback" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "logo-name", children: l2.name })
          ]
        },
        l2.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "音效" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "switch-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "启用界面音效" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `switch ${soundEnabled ? "on" : ""}`,
            role: "switch",
            "aria-checked": soundEnabled,
            ...pressBtn(() => setSoundEnabled2(!soundEnabled)),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "knob" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-row", style: { marginBottom: 6, justifyContent: "space-between" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "音量" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fs-pill", "aria-live": "polite", children: [
          Math.round(soundVolume * 100),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-size-slider-wrap", style: { marginBottom: 4 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fs-label-min", children: "小" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DsSlider,
          {
            min: 0,
            max: 100,
            step: 1,
            value: Math.round(soundVolume * 100),
            disabled: !soundEnabled,
            onChange: (v2) => setSoundVolume2(v2 / 100),
            formatValue: (v2) => `${v2}%`,
            showTicks: false,
            className: "flex-1",
            "aria-label": "音量"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fs-label-max", children: "大" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-hint", children: "克制的合成音：点击、切换、收藏、打开外链等交互反馈。首次需一次点击以解锁音频。" })
    ] })
  ] });
}
function ShortcutsTab() {
  const { shortcuts, setShortcuts, resetShortcuts } = useStore();
  const [recording, setRecording] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!recording) return;
    const onKey = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.key === "Escape") {
        setRecording(null);
        return;
      }
      const combo = eventToCombo(e);
      setShortcuts({ ...shortcuts, [recording]: combo });
      setRecording(null);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [recording, shortcuts, setShortcuts]);
  const conflicts = /* @__PURE__ */ new Set();
  const seen = /* @__PURE__ */ new Map();
  for (const a of Object.keys(shortcuts)) {
    const c = shortcuts[a];
    if (seen.has(c)) {
      conflicts.add(c);
      conflicts.add(shortcuts[seen.get(c)]);
    } else seen.set(c, a);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "set-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-head-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "快捷键" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "mini-btn", onClick: () => resetShortcuts(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "refresh", size: 13 }),
        " 全部重置"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-hint", children: "点击「录制」后按下想要的组合键即可重新绑定；带 ⌘ 的全局快捷键在输入框聚焦时也生效，单键快捷键仅在非输入状态生效。" }),
    conflicts.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "src-warn", children: [
      "⚠ 存在重复绑定：",
      [...conflicts].map((c) => formatCombo(c)).join("、")
    ] }),
    SHORTCUT_GROUPS.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sc-group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sc-group-title", children: g.title }),
      g.items.map((it) => {
        const combo = shortcuts[it.key];
        const isRec = recording === it.key;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `sc-row ${conflicts.has(combo) ? "conflict" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sc-meta", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sc-label", children: it.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sc-desc", children: it.desc })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sc-actions", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: `sc-combo ${isRec ? "rec" : ""}`,
                onClick: () => setRecording(isRec ? null : it.key),
                children: isRec ? "按下新快捷键…" : formatCombo(combo)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "sc-reset",
                title: "恢复默认",
                onClick: () => setShortcuts({ ...shortcuts, [it.key]: DEFAULT_SHORTCUTS[it.key] }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "undo", size: 13 })
              }
            )
          ] })
        ] }, it.key);
      })
    ] }, g.title))
  ] }) });
}
function AiModelTab() {
  const { showToast } = useStore();
  const [providers, setProviders] = reactExports.useState([]);
  const [providerId, setProviderId] = reactExports.useState("deepseek");
  const [baseUrl, setBaseUrl] = reactExports.useState("");
  const [apiKey, setApiKey] = reactExports.useState("");
  const [model, setModel] = reactExports.useState("");
  const [configured, setConfigured] = reactExports.useState(false);
  const [testing, setTesting] = reactExports.useState(false);
  const [testResult, setTestResult] = reactExports.useState(null);
  reactExports.useEffect(() => {
    void (async () => {
      const ps = await window.capybara.invoke("llm:providers");
      setProviders(ps);
      const cfg = await window.capybara.invoke("llm:config");
      setProviderId(cfg.providerId || "deepseek");
      setBaseUrl(cfg.baseUrl);
      setApiKey("");
      setModel(cfg.model);
      setConfigured(cfg.configured);
    })();
  }, []);
  const onProviderChange = (id2) => {
    setProviderId(id2);
    const p2 = providers.find((x2) => x2.id === id2);
    if (p2) {
      setBaseUrl(p2.baseUrl);
      setModel(p2.defaultModel);
    }
  };
  const save = async () => {
    await window.capybara.invoke("llm:saveConfig", providerId, baseUrl, apiKey, model);
    const cfg = await window.capybara.invoke("llm:config");
    setConfigured(cfg.configured);
    setApiKey("");
    showToast("AI 模型配置已保存");
  };
  const test = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const r2 = await window.capybara.invoke("llm:test");
      setTestResult(r2);
      showToast(r2.ok ? "测试成功" : "测试失败");
    } catch (e) {
      setTestResult({ ok: false, content: "", error: e.message });
    } finally {
      setTesting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-scroll", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "AI 模型" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-hint", children: "配置在线大语言模型，用于收藏夹自动归类等 AI 功能。支持国内主流模型厂商，统一走 OpenAI 兼容接口。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-grid-2", style: { marginTop: 12 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "src-row", children: [
          "模型厂商",
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "src-select", value: providerId, onChange: (e) => onProviderChange(e.target.value), children: providers.map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p2.id, children: p2.label }, p2.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "src-row", children: [
          "模型名",
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", className: "src-input", value: model, placeholder: "如 deepseek-chat", onChange: (e) => setModel(e.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "src-row", style: { marginTop: 12 }, children: [
        "API Base URL",
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", className: "src-input", value: baseUrl, placeholder: "https://api.deepseek.com/v1", onChange: (e) => setBaseUrl(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "src-row", style: { marginTop: 12 }, children: [
        "API Key",
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", className: "src-input", value: apiKey, placeholder: configured ? "已配置（输入新值覆盖）" : "sk-...", onChange: (e) => setApiKey(e.target.value) })
      ] }),
      (() => {
        const p2 = providers.find((x2) => x2.id === providerId);
        return p2 && p2.website ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "src-hint", style: { marginTop: 8 }, children: [
          "获取 API Key： ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", onClick: (e) => {
            e.preventDefault();
            void window.capybara.invoke("shell:openExternal", p2.website);
          }, children: p2.keyHint })
        ] }) : null;
      })(),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-actions", style: { marginTop: 16 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => void save(), disabled: !baseUrl || !model || !apiKey, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "check", size: 14 }),
          " 保存配置"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => void test(), disabled: testing || !configured && !apiKey, children: [
          testing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "refresh", size: 14, className: "spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "sparkles", size: 14 }),
          testing ? "测试中…" : "测试连接"
        ] }),
        configured && !apiKey && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "src-hint", children: "✓ 已配置" })
      ] }),
      testResult && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `src-card ${testResult.ok ? "ok-box" : "warn-box"}`, style: { marginTop: 12, padding: 12, borderRadius: 8 }, children: testResult.ok ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "✅ 连接成功！模型返回：",
        testResult.content.slice(0, 100)
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "❌ 连接失败：",
        testResult.error
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "使用说明" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { style: { paddingLeft: 16, fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "AI 模型配置后，可在收藏夹页面点击「AI 归类」按钮自动分类书签" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "所有请求通过 Electron net.fetch 发出，尊重系统代理设置" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "API Key 存储在本地 SQLite 数据库，不会上传到任何服务器" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "支持 DeepSeek、通义千问、智谱 GLM、Moonshot 等国内主流厂商" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "选择「自定义」可对接任何 OpenAI 兼容接口" })
      ] })
    ] })
  ] });
}
function ActionsTab({ onRefresh }) {
  const { clearInbox, purge, showToast, developerMode, setDeveloperMode, dbPath, setDbPath } = useStore();
  const [msg, setMsg] = reactExports.useState("");
  const [keepDays, setKeepDays] = reactExports.useState(90);
  const [maxItems, setMaxItems] = reactExports.useState(2e3);
  const [dbPathInput, setDbPathInput] = reactExports.useState(dbPath);
  const [dbPathMsg, setDbPathMsg] = reactExports.useState("");
  const refresh = async () => {
    setMsg("刷新中…");
    await onRefresh();
    setMsg("已触发全部源刷新");
    showToast("已开始刷新");
  };
  const clear = async () => {
    await clearInbox();
    setMsg("RSS 已清空");
    showToast("RSS 已清空");
  };
  const doPurge = async () => {
    await purge(keepDays, maxItems);
    setMsg(`已按保留策略清理（保留 ${keepDays} 天内的归档，单库上限 ${maxItems} 条）`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-scroll", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "开发者模式" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-hint", children: "开启后自动打开 DevTools 并在界面右下角显示网络诊断面板（每个 RSS 请求的状态 / 耗时 / 字节 / 错误），便于排查「无法获取数据」。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "switch-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "启用开发者模式（含网络诊断）" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `switch ${developerMode ? "on" : ""}`, onClick: () => setDeveloperMode(!developerMode), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "knob" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "数据库文件路径" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "src-hint", children: [
        "设置自定义数据库文件路径（例如 .db 文件路径或目录）。设置后",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "需重启应用" }),
        "生效。 可用于导入/导出数据库分享给他人，或从备份恢复。"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-row", style: { gap: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: dbPathInput ?? "",
            placeholder: dbPath || "使用默认路径 (~/Library/Application Support/capybara/capybara.db)",
            onChange: (e) => setDbPathInput(e.target.value),
            style: { flex: 1 }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
          const r2 = await setDbPath(dbPathInput ?? "");
          if (r2.ok) {
            setDbPathMsg(dbPathInput ? "已保存，重启后生效" : "已恢复默认路径，重启后生效");
            setDbPathInput(dbPathInput);
          } else {
            setDbPathMsg("失败：" + (r2.error ?? "未知错误"));
          }
        }, children: "保存" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { title: "浏览选择数据库文件", onClick: async () => {
          const p2 = await window.capybara.invoke("settings:pickDbPath");
          if (p2) setDbPathInput(p2);
        }, children: "浏览…" })
      ] }),
      dbPathMsg && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `src-hint ${dbPathMsg.includes("失败") ? "src-warn" : ""}`, style: { marginTop: 6 }, children: dbPathMsg }),
      dbPath ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "src-hint", style: { marginTop: 4 }, children: [
        "当前自定义路径：",
        dbPath
      ] }) : null
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "数据操作" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => void refresh(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "refresh", size: 14 }),
          " 立即刷新全部源"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => void clear(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "trash", size: 14 }),
          " 清空 RSS"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "src-hint src-grow", children: msg })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "配置导入/导出（JSON）" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-hint", children: "导出所有设置项（外观、配色、订阅源列表等）为 JSON 文件，可在另一台电脑或重装后恢复。导入时自动跳过已存在的订阅源。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: async () => {
          const ok2 = await window.capybara.invoke("settings:export");
          showToast(ok2 ? "配置已导出" : "已取消导出");
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "upload", size: 14 }),
          " 导出配置"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: async () => {
          const r2 = await window.capybara.invoke("settings:import");
          if (r2.ok) {
            showToast(`已导入 ${r2.imported ?? 0} 项设置，请重启应用生效`);
            void useStore.getState().initAppearance();
          } else {
            showToast("导入失败：" + (r2.error || "未知错误"));
          }
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "bookmark", size: 14 }),
          " 导入配置"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "性能 · 保留策略" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-hint", children: "仅清理「已归档」且抓取时间早于阈值的条目，以及单库总量超出上限时最旧的归档；RSS / 稍后读 / 收藏永不被自动清理。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "src-grid-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "src-row", children: [
          "保留归档",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "src-unit", children: "不少于" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              min: 0,
              max: 3650,
              value: keepDays,
              className: "src-num",
              onChange: (e) => setKeepDays(Math.max(0, Number(e.target.value) || 0))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "src-unit", children: "天" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "src-row", children: [
          "单库上限",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              min: 100,
              max: 1e5,
              value: maxItems,
              className: "src-num",
              onChange: (e) => setMaxItems(Math.max(100, Number(e.target.value) || 100))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "src-unit", children: "条" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "src-actions", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => void doPurge(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "trash", size: 14 }),
        " 立即清理"
      ] }) })
    ] })
  ] });
}
function renderReadingThemes(activeId, onSelect) {
  const all = getAllReadingThemes();
  const darkThemes = all.filter((t2) => t2.mode === "dark");
  const lightThemes = all.filter((t2) => t2.mode === "light");
  const isCustom = (id2) => READING_THEMES.every((bt) => bt.id !== id2) && id2 !== FOLLOW_UI_ID;
  const renderGroup = (label, themes, showFollow) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rt-group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "rt-group-label", children: [
      label,
      "主题（",
      themes.length + (showFollow ? 1 : 0),
      " 套）"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rt-grid", children: [
      showFollow && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: `rt-chip ${activeId === FOLLOW_UI_ID ? "active" : ""}`,
          onClick: () => onSelect(FOLLOW_UI_ID),
          title: "跟随界面配色",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rt-swatch", style: { background: "var(--color-background-primary)", border: "1px solid var(--color-border-secondary)" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rt-name", children: "跟随界面" })
          ]
        }
      ),
      themes.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rt-chip-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: `rt-chip ${activeId === t2.id ? "active" : ""}`,
            onClick: () => onSelect(t2.id),
            title: t2.name,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rt-swatch multi", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { background: t2.colors["--rt-bg"] } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { background: t2.colors["--rt-heading"] } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { background: t2.colors["--rt-link"] } })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rt-name", children: t2.name.replace(/\(.*\)/, "").trim() })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rt-chip-actions", children: isCustom(t2.id) && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "danger", title: "删除", onClick: (e) => {
          e.stopPropagation();
          deleteCustomReadingTheme(t2.id);
          onSelect(FOLLOW_UI_ID);
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "trash", size: 14 }) }) })
      ] }, t2.id))
    ] })
  ] }, label);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    renderGroup("暗色", darkThemes, true),
    renderGroup("亮色", lightThemes, false)
  ] });
}
const THANKS_CARDS = [
  {
    icon: "sparkles",
    accent: "#10a37f",
    title: "ChatGPT · OpenAI",
    desc: "感谢 OpenAI ChatGPT 在交互思路、文案润色与开发过程中的启发与协作——大量界面决策与自动化脚本受益于与其的对话。",
    url: "https://openai.com/chatgpt"
  },
  {
    icon: "palette",
    accent: "#6c5ce7",
    title: "NewMax",
    desc: "感谢 NewMax 的设计语言参考：配色体系、间距节奏与组件规范为 Capybara 的视觉风格提供了重要借鉴。",
    url: ""
  }
];
const OSS_GROUPS = [
  {
    title: "运行时框架",
    items: [
      { name: "Electron", version: "^37.2.0", license: "MIT", role: "跨平台桌面运行时" },
      { name: "Node.js · node:sqlite", version: "内置", license: "MIT", role: "本地数据库存储" }
    ]
  },
  {
    title: "界面与状态",
    items: [
      { name: "React", version: "^18.3.1", license: "MIT", role: "UI 框架" },
      { name: "React DOM", version: "^18.3.1", license: "MIT", role: "DOM 渲染" },
      { name: "react-window", version: "^1.8.11", license: "MIT", role: "长列表虚拟滚动" },
      { name: "zustand", version: "^4.5.5", license: "MIT", role: "轻量状态管理" },
      { name: "lucide-react", version: "^1.28.0", license: "ISC", role: "线性图标集" }
    ]
  },
  {
    title: "内容解析",
    items: [
      { name: "rss-parser", version: "^3.13.0", license: "MIT", role: "RSS / Atom 订阅解析" },
      { name: "@mozilla/readability", version: "^0.6.0", license: "Apache-2.0", role: "正文内容提取" },
      { name: "cheerio", version: "^1.2.0", license: "MIT", role: "服务端 HTML 解析" },
      { name: "linkedom", version: "^0.18.13", license: "MIT", role: "轻量 DOM 实现" },
      { name: "dompurify", version: "^3.4.13", license: "MPL-2.0", role: "HTML 安全净化" }
    ]
  },
  {
    title: "富文本编辑",
    items: [
      { name: "@tiptap/core", version: "^3.29.2", license: "MIT", role: "富文本编辑器内核" },
      { name: "@tiptap/pm", version: "^3.29.2", license: "MIT", role: "ProseMirror 适配" },
      { name: "@tiptap/react", version: "^3.29.2", license: "MIT", role: "React 绑定" },
      { name: "@tiptap/starter-kit", version: "^3.29.2", license: "MIT", role: "基础功能套件" }
    ]
  },
  {
    title: "构建与开发",
    items: [
      { name: "electron-vite", version: "^2.3.0", license: "MIT", role: "Electron 构建管线" },
      { name: "vite", version: "^5.4.11", license: "MIT", role: "前端构建工具" },
      { name: "typescript", version: "^5.6.3", license: "Apache-2.0", role: "类型系统" },
      { name: "electron-builder", version: "^25.1.8", license: "MIT", role: "应用打包 / DMG" },
      { name: "sharp", version: "^0.35.3", license: "Apache-2.0", role: "图片处理" },
      { name: "@vitejs/plugin-react", version: "^4.3.4", license: "MIT", role: "React 插件" }
    ]
  }
];
function ThanksTab() {
  const [ver, setVer] = reactExports.useState("");
  reactExports.useEffect(() => {
    window.capybara.invoke("app:version").then((v2) => setVer(v2 || "")).catch(() => {
    });
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-scroll", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card thanks-hero", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "thanks-hero-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "heart", size: 22 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "thanks-hero-text", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "thanks-title", children: "致谢" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "thanks-sub", children: [
          "Capybara 是一款个人知识管线桌面客户端",
          ver ? `，当前版本 ${ver}` : "",
          "。它站在开源社区与优秀产品设计者的肩膀之上。 本页列出构建它所用的开源软件，并向给予设计启发与开发辅助的产品致以谢意。"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "src-head-row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "设计风格致谢" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-hint", children: "以下产品的设计语言为 Capybara 的界面与交互提供了重要参考。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "thanks-cards", children: THANKS_CARDS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "thanks-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "thanks-card-icon", style: { background: `color-mix(in srgb, ${c.accent} 14%, transparent)`, color: c.accent }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: c.icon, size: 20 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "thanks-card-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "thanks-card-title", children: c.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "thanks-card-desc", children: c.desc }),
          c.url && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              className: "thanks-card-link",
              href: c.url,
              onClick: (e) => {
                e.preventDefault();
                void window.capybara.invoke("shell:openExternal", c.url);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "external", size: 13 }),
                " 访问官网 ↗"
              ]
            }
          )
        ] })
      ] }, c.title)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "src-head-row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-label", children: "开源软件清单" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "src-hint", children: "Capybara 基于以下开源项目构建（按用途分组）。许可证信息以各项目官方声明为准。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "oss-list", children: OSS_GROUPS.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "oss-group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "oss-group-title", children: g.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "oss-table", children: g.items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "oss-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "oss-name", children: it.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "oss-ver", children: it.version }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "oss-lic", children: it.license }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "oss-role", children: it.role })
        ] }, it.name)) })
      ] }, g.title)) })
    ] })
  ] });
}
const FEED_PALETTE = [
  "#378add",
  // 蓝
  "#1f9e8f",
  // 青
  "#7f77dd",
  // 紫
  "#d85a30",
  // 橙
  "#d4537e",
  // 粉
  "#1d9e75",
  // 绿
  "#c9a227",
  // 金
  "#2b8a9e",
  // 蓝绿
  "#9b5de5",
  // 亮紫
  "#e07a3f",
  // 暖橙
  "#3a86c8",
  // 海蓝
  "#cf5b7e",
  // 玫红
  "#5a8f3c",
  // 橄榄绿
  "#b5651d"
  // 赭石
];
function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
function feedColor(name) {
  const key = (name || "").trim();
  if (!key) return FEED_PALETTE[0];
  return FEED_PALETTE[hashString(key) % FEED_PALETTE.length];
}
const KIND_LABEL = { article: "图文", podcast: "播客", video: "视频" };
function FeedsPanel({ width = 188 }) {
  const { feeds, view, activeFeed, setActiveFeed, refreshFeed, refreshAll, deleteFeed, showToast } = useStore();
  const rssFeeds = feeds.filter((f2) => {
    if (f2.type !== "rss") return false;
    const kind = f2.kind ?? "article";
    if (view === "rss") return kind === "article";
    if (view === "podcast") return kind === "podcast";
    if (view === "video") return kind === "video";
    return true;
  });
  const style = { width, flexShrink: 0 };
  const [refreshingId, setRefreshingId] = reactExports.useState(null);
  const refreshOne = async (id2) => {
    setRefreshingId(id2);
    try {
      await refreshFeed(id2);
    } finally {
      setRefreshingId(null);
    }
  };
  const refreshAllFeeds = async () => {
    setRefreshingId("all");
    try {
      await refreshAll();
    } finally {
      setRefreshingId(null);
    }
  };
  const [confirmUnsub, setConfirmUnsub] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "feeds-panel", style, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "feeds-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "订阅源" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: `feed-refresh-all ${refreshingId === "all" ? "spinning" : ""}`,
          title: "立即刷新全部源",
          ...pressBtn(() => void refreshAllFeeds()),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "refresh", size: 13 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "feeds-list", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: `feed-item ${activeFeed == null ? "active" : ""}`,
          ...pressBtn(() => setActiveFeed(null)),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "feed-dot all" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "feed-name", children: "全部" })
          ]
        }
      ),
      ["article", "podcast", "video"].map((kind) => {
        const group = rssFeeds.filter((f2) => (f2.kind ?? "article") === kind);
        if (group.length === 0) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "feeds-group-label", children: KIND_LABEL[kind] }),
          group.map((f2) => {
            const err = f2.error_count > 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `feed-item ${activeFeed === f2.name ? "active" : ""} ${err ? "err" : ""}`,
                title: err ? `${f2.name}
${f2.last_error || "未知错误"}` : f2.name,
                ...press(() => setActiveFeed(activeFeed === f2.name ? null : f2.name)),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "feed-dot", style: { background: feedColor(f2.name) } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "feed-name", children: f2.name }),
                  err && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "feed-err-dot", "aria-label": "抓取失败" }),
                  confirmUnsub === f2.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "feed-unsub-confirm", onPointerDown: (e) => e.stopPropagation(), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        className: "feed-unsub-cancel",
                        title: "取消",
                        onPointerDown: (e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setConfirmUnsub(null);
                        },
                        children: "取消"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        className: "feed-unsub-ok",
                        title: "确认删除订阅",
                        onPointerDown: (e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          void deleteFeed(f2.id);
                          setConfirmUnsub(null);
                          showToast(`已取消订阅「${f2.name || f2.url}」`);
                        },
                        children: "确定"
                      }
                    )
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      className: "feed-refresh",
                      title: "只刷新此源",
                      onPointerDown: (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        void refreshOne(f2.id);
                      },
                      onClick: (e) => e.stopPropagation(),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "refresh", size: 12 })
                    }
                  ),
                  confirmUnsub !== f2.id && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      className: "feed-unsub",
                      title: "取消订阅",
                      onPointerDown: (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setConfirmUnsub(f2.id);
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "trash", size: 12 })
                    }
                  )
                ]
              },
              f2.id
            );
          })
        ] }, kind);
      }),
      rssFeeds.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "feeds-empty", children: "暂无 RSS 订阅源" })
    ] })
  ] });
}
function FolderNode({ node, depth, activeFolderId, onSelect, onRename, onDelete }) {
  const [expanded, setExpanded] = reactExports.useState(depth < 2);
  const [editing, setEditing] = reactExports.useState(false);
  const [editTitle, setEditTitle] = reactExports.useState(node.folder.title);
  const [confirmDel, setConfirmDel] = reactExports.useState(false);
  const isActive = activeFolderId === node.folder.id;
  const isRoot = node.folder.id <= 1;
  const commitRename = () => {
    const t2 = editTitle.trim();
    if (t2 && t2 !== node.folder.title) onRename(node.folder.id, t2);
    setEditing(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bm-node", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `bm-folder-row ${isActive ? "active" : ""}`,
        style: { paddingLeft: 8 + depth * 12 },
        role: "button",
        tabIndex: 0,
        ...press(() => onSelect(node.folder.id)),
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(node.folder.id);
          }
        },
        children: [
          node.children.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bm-toggle", ...pressBtn((e) => {
            e.stopPropagation();
            setExpanded((v2) => !v2);
          }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: expanded ? "chevronDown" : "chevronRight", size: 12 }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bm-toggle-placeholder" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bm-folder-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: isRoot ? "bookmark" : "folder", size: 14 }) }),
          editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "bm-rename-input",
              value: editTitle,
              autoFocus: true,
              onPointerDown: (e) => e.stopPropagation(),
              onChange: (e) => setEditTitle(e.target.value),
              onBlur: commitRename,
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitRename();
                }
                if (e.key === "Escape") {
                  setEditTitle(node.folder.title);
                  setEditing(false);
                }
              }
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bm-folder-name", onPointerDown: (e) => {
            if (e.detail === 2) {
              e.stopPropagation();
              setEditing(true);
            }
          }, children: node.folder.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bm-count", children: node.linkCount || "" }),
          !isRoot && !editing && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bm-folder-del", title: "删除文件夹", ...pressBtn((e) => {
            e.stopPropagation();
            setConfirmDel(true);
          }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "trash", size: 11 }) }),
          confirmDel && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bm-del-confirm", onPointerDown: (e) => e.stopPropagation(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bm-del-cancel", onPointerDown: (e) => {
              e.stopPropagation();
              e.preventDefault();
              setConfirmDel(false);
            }, children: "取消" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bm-del-ok", onPointerDown: (e) => {
              e.stopPropagation();
              e.preventDefault();
              onDelete(node.folder.id);
              setConfirmDel(false);
            }, children: "删除" })
          ] })
        ]
      }
    ),
    expanded && node.children.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bm-children", children: node.children.map((child) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      FolderNode,
      {
        node: child,
        depth: depth + 1,
        activeFolderId,
        onSelect,
        onRename,
        onDelete
      },
      child.folder.id
    )) }),
    expanded && node.links.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bm-links-inline", children: node.links.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(LinkRow, { link, depth: depth + 1 }, link.id)) })
  ] });
}
function LinkRow({ link, depth }) {
  const { selectBookmarkLink, activeBookmarkLink, openInBrowser, deleteBookmarkLink } = useStore();
  const isActive = activeBookmarkLink?.id === link.id;
  const [confirmDel, setConfirmDel] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `bm-link-row ${isActive ? "active" : ""}`,
      style: { paddingLeft: 8 + depth * 12 + 16 },
      ...press(() => selectBookmarkLink(link)),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bm-link-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "link", size: 12 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bm-link-title", title: link.url, children: link.title }),
        link.ai_category && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bm-ai-tag", title: link.ai_category, children: link.ai_category.split(" > ")[0] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bm-link-del", title: "删除", ...pressBtn((e) => {
          e.stopPropagation();
          setConfirmDel(true);
        }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "trash", size: 10 }) }),
        confirmDel && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bm-del-confirm", onPointerDown: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bm-del-cancel", onPointerDown: (e) => {
            e.stopPropagation();
            e.preventDefault();
            setConfirmDel(false);
          }, children: "取消" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bm-del-ok", onPointerDown: (e) => {
            e.stopPropagation();
            e.preventDefault();
            void deleteBookmarkLink(link.id);
            setConfirmDel(false);
          }, children: "删除" })
        ] })
      ]
    }
  );
}
function LinkList({ links }) {
  const { selectBookmarkLink, activeBookmarkLink, openInBrowser, deleteBookmarkLink } = useStore();
  const [confirmDel, setConfirmDel] = reactExports.useState(null);
  if (links.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bm-empty", children: "此文件夹暂无链接" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bm-link-list", children: links.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `bm-card ${activeBookmarkLink?.id === link.id ? "active" : ""}`,
      ...press(() => selectBookmarkLink(link)),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bm-card-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bm-card-favicon", children: link.icon ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: link.icon, alt: "", className: "bm-favicon-img" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "link", size: 14 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bm-card-title", title: link.title, children: link.title })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bm-card-url", title: link.url, children: link.url }),
        link.ai_category && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bm-card-ai", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "sparkles", size: 11 }),
          " ",
          link.ai_category
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bm-card-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "bm-card-open", title: "在浏览器中打开", onClick: () => openInBrowser(link.url), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "external", size: 12 }),
            " 打开"
          ] }),
          confirmDel === link.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bm-del-confirm", onPointerDown: (e) => e.stopPropagation(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bm-del-cancel", onPointerDown: (e) => {
              e.stopPropagation();
              e.preventDefault();
              setConfirmDel(null);
            }, children: "取消" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bm-del-ok", onPointerDown: (e) => {
              e.stopPropagation();
              e.preventDefault();
              void deleteBookmarkLink(link.id);
              setConfirmDel(null);
            }, children: "删除" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bm-card-del", title: "删除", ...pressBtn((e) => {
            e.stopPropagation();
            setConfirmDel(link.id);
          }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "trash", size: 12 }) })
        ] })
      ]
    },
    link.id
  )) });
}
function findFolderNode(nodes, folderId) {
  for (const node of nodes) {
    if (node.folder.id === folderId) return node;
    const found = findFolderNode(node.children, folderId);
    if (found) return found;
  }
  return null;
}
function collectLinksFromFolder(nodes, folderId) {
  const node = findFolderNode(nodes, folderId);
  return node ? node.links : [];
}
function RandomWalkCard({ link }) {
  const { openInBrowser, selectBookmarkLink } = useStore();
  if (!link) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bm-random-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bm-random-badge", children: "🎲 随机漫步" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bm-card-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bm-card-favicon", children: link.icon ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: link.icon, alt: "", className: "bm-favicon-img" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "link", size: 16 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bm-card-title", children: link.title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bm-card-url", children: link.url }),
    link.ai_category && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bm-card-ai", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "sparkles", size: 11 }),
      " ",
      link.ai_category
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bm-card-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "bm-card-open", onClick: () => openInBrowser(link.url), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "external", size: 12 }),
        " 打开链接"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "bm-card-open", onClick: () => selectBookmarkLink(link), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "info", size: 12 }),
        " 详情"
      ] })
    ] })
  ] });
}
function BookmarkView() {
  const {
    bookmarkTree,
    bookmarkLoading,
    activeBookmarkFolderId,
    activeBookmarkLink,
    bookmarkRandomLink,
    aiClassifying,
    setBookmarkFolder,
    selectBookmarkLink,
    importBookmarks,
    renameBookmarkFolder,
    deleteBookmarkFolder,
    bookmarkRandomWalk,
    aiClassifyBookmarks,
    openInBrowser
  } = useStore();
  reactExports.useEffect(() => {
    void (async () => {
      if (bookmarkTree.length === 0) {
        await useStore.getState().loadBookmarkTree();
      }
    })();
  }, [bookmarkTree.length]);
  const currentLinks = reactExports.useMemo(() => {
    if (activeBookmarkFolderId == null) return [];
    return collectLinksFromFolder(bookmarkTree, activeBookmarkFolderId);
  }, [bookmarkTree, activeBookmarkFolderId]);
  const totalCount = reactExports.useMemo(() => {
    const count = (nodes) => nodes.reduce((sum, n2) => sum + n2.links.length + count(n2.children), 0);
    return count(bookmarkTree);
  }, [bookmarkTree]);
  const treeW = 260;
  const treeStyle = { width: treeW, flexShrink: 0 };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bm-view", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "bm-tree-panel", style: treeStyle, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bm-tree-head", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "收藏夹" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bm-total-count", children: totalCount || "" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bm-tree-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "bm-action-btn", title: "导入浏览器收藏夹", ...pressBtn(() => void importBookmarks()), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "upload", size: 13 }),
          " 导入"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "bm-action-btn", title: "随机漫步", ...pressBtn(() => void bookmarkRandomWalk()), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "shuffle", size: 13 }),
          " 随机"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "bm-action-btn",
            title: "AI 自动归类",
            disabled: aiClassifying,
            ...pressBtn(() => void aiClassifyBookmarks()),
            children: [
              aiClassifying ? /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "refresh", size: 13, className: "spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "sparkles", size: 13 }),
              aiClassifying ? "归类中" : "AI 归类"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bm-tree-body", children: bookmarkLoading && bookmarkTree.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bm-loading", children: "加载中…" }) : bookmarkTree.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bm-empty-tree", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "暂无收藏夹" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "bm-empty-hint", children: "点击上方「导入」按钮，选择浏览器导出的 bookmarks.html 文件" })
      ] }) : bookmarkTree.map((node) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        FolderNode,
        {
          node,
          depth: 0,
          activeFolderId: activeBookmarkFolderId,
          onSelect: setBookmarkFolder,
          onRename: renameBookmarkFolder,
          onDelete: deleteBookmarkFolder
        },
        node.folder.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bm-content", children: bookmarkRandomLink ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bm-random-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bm-random-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "🎲 随机漫步" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "bm-action-btn", ...pressBtn(() => void bookmarkRandomWalk()), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "refresh", size: 13 }),
          " 换一个"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RandomWalkCard, { link: bookmarkRandomLink })
    ] }) : activeBookmarkLink ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bm-detail-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bm-detail-header", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "bm-back", ...pressBtn(() => selectBookmarkLink(null)), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrowLeft", size: 14 }),
        " 返回"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bm-detail-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "bm-detail-title", children: activeBookmarkLink.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bm-detail-url", children: activeBookmarkLink.url }),
        activeBookmarkLink.ai_category && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bm-card-ai", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "sparkles", size: 12 }),
          " ",
          activeBookmarkLink.ai_category
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bm-card-actions", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "bm-card-open", onClick: () => openInBrowser(activeBookmarkLink.url), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "external", size: 14 }),
          " 在浏览器中打开"
        ] }) })
      ] })
    ] }) : activeBookmarkFolderId != null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bm-folder-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bm-folder-header", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
        "链接列表（",
        currentLinks.length,
        "）"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LinkList, { links: currentLinks })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bm-placeholder", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bm-placeholder-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "bookmark", size: 48 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "选择一个文件夹查看书签" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "bm-placeholder-hint", children: "或点击「随机」按钮，发现遗忘的宝藏" })
    ] }) })
  ] });
}
class ErrorBoundary extends reactExports.Component {
  state = { err: null };
  static getDerivedStateFromError(err) {
    return { err };
  }
  render() {
    if (this.state.err) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 40, color: "var(--color-text-primary)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "界面出错" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: { whiteSpace: "pre-wrap", color: "var(--color-text-warning)" }, children: String(this.state.err?.stack || this.state.err) })
    ] });
    return this.props.children;
  }
}
function App() {
  const { screen, load, loadFeeds, loadBoards, moveSelection, setStatus, selectedId, items, setQuickAddOpen, setCmdkOpen, toast: toastMsg, view, activeSourceType, developerMode, zenMode, exitZenMode, settingsOpen, closeSettings } = useStore();
  const dragRef = reactExports.useRef(null);
  const [sideW, setSideW] = reactExports.useState(196);
  const [listW, setListW] = reactExports.useState(320);
  const [feedW, setFeedW] = reactExports.useState(188);
  const [sideCollapsed, setSideCollapsed] = reactExports.useState(false);
  const [sideHidden, setSideHidden] = reactExports.useState(false);
  const [dragging, setDragging] = reactExports.useState(false);
  const [version, setVersion] = reactExports.useState("");
  reactExports.useEffect(() => {
    void load();
    void loadFeeds();
    void loadBoards();
    void useStore.getState().initAppearance();
    void window.capybara.invoke("settings:get", "side_w").then((r2) => {
      const n2 = Number(r2);
      if (n2 >= 120) setSideW(n2);
    });
    void window.capybara.invoke("settings:get", "list_w").then((r2) => {
      const n2 = Number(r2);
      if (n2 >= 260) setListW(n2);
    });
    void window.capybara.invoke("settings:get", "feed_w").then((r2) => {
      const n2 = Number(r2);
      if (n2 >= 140) setFeedW(n2);
    });
    void window.capybara.invoke("settings:get", "side_collapsed").then((r2) => {
      if (r2 === "1") setSideCollapsed(true);
    });
    void window.capybara.invoke("app:version").then((r2) => setVersion(r2 || ""));
    void (async () => {
      try {
        const [{ has }, ghUser] = await Promise.all([
          window.capybara.invoke("github:tokenStatus"),
          window.capybara.invoke("settings:get", "github_stars_user")
        ]);
        if (has && ghUser?.trim()) {
          await useStore.getState().fetchGithubStars(ghUser.trim());
        }
      } catch {
      }
    })();
  }, [load, loadFeeds, loadBoards]);
  reactExports.useEffect(() => {
    const onDown = (e) => {
      const s = useStore.getState();
      if (!s.soundEnabled) return;
      primeAudio();
      const t2 = e.target;
      if (t2.closest('button, a, [role="button"], .side-item, .card, .chip, .tag-chip, .rail-btn, .bc-title')) {
        playSound("tap");
      }
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);
  reactExports.useEffect(() => {
    const cb2 = () => {
      void useStore.getState().load();
      void useStore.getState().loadFeeds();
    };
    window.capybara.onSourcesUpdated(cb2);
  }, []);
  reactExports.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdkOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setCmdkOpen]);
  reactExports.useEffect(() => {
    const runAction = (action, st) => {
      const item = st.items.find((i) => i.id === st.selectedId);
      switch (action) {
        case "openSettings":
          st.openSettings("appearance");
          break;
        case "focusSearch":
          setCmdkOpen(true);
          break;
        case "refresh":
          void st.refreshAll();
          break;
        case "quickAdd":
          st.setQuickAddOpen(true);
          break;
        case "goRss":
          st.setView("rss");
          break;
        case "goLater":
          st.setView("later");
          break;
        case "goFavorite":
          st.setView("favorite");
          break;
        case "goArchived":
          st.setView("archived");
          break;
        case "goAll":
          st.setView("all");
          break;
        case "toggleBoard":
          if (st.screen === "board") st.setScreen("library");
          else if (st.boards.length) void st.openBoard(st.boards[0].id);
          else void st.createBoard();
          break;
        case "nextItem":
          st.moveSelection(1);
          break;
        case "prevItem":
          st.moveSelection(-1);
          break;
        case "archiveItem":
          if (item) void st.setStatus(item.id, "archived");
          break;
        case "laterItem":
          if (item) void st.setStatus(item.id, "later");
          break;
        case "favoriteItem":
          if (item) void st.setStatus(item.id, "favorite");
          break;
        case "openLink":
          if (item) st.openInBrowser(item.url);
          break;
        case "help":
          st.openSettings("shortcuts");
          break;
        case "close":
          document.activeElement?.blur?.();
          if (st.settingsOpen) st.closeSettings();
          if (st.quickAddOpen) st.setQuickAddOpen(false);
          break;
      }
    };
    const onKey = (e) => {
      const target = e.target;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if (e.key === "Escape") {
        target.blur?.();
        const st2 = useStore.getState();
        if (st2.zenMode) {
          st2.exitZenMode();
          e.preventDefault();
          return;
        }
        if (st2.settingsOpen) st2.closeSettings();
        if (st2.quickAddOpen) st2.setQuickAddOpen(false);
        e.preventDefault();
        return;
      }
      if (e.key === "/" && !typing) {
        e.preventDefault();
        setCmdkOpen(true);
        return;
      }
      const st = useStore.getState();
      const combo = eventToCombo(e);
      const byCombo = /* @__PURE__ */ new Map();
      for (const k2 of Object.keys(st.shortcuts)) byCombo.set(st.shortcuts[k2], k2);
      const action = byCombo.get(combo);
      if (!action) return;
      if (!isGlobalCombo(combo) && typing) return;
      e.preventDefault();
      runAction(action, st);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const onDividerDown = (which) => (e) => {
    dragRef.current = { which, startX: e.clientX, startW: which === "side" ? sideW : which === "feed" ? feedW : listW };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onDividerMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    if (d.which === "side") {
      const nw = d.startW + dx;
      if (nw <= 96) {
        setSideCollapsed(true);
        setSideW(56);
      } else {
        setSideCollapsed(false);
        setSideW(Math.min(320, Math.max(130, nw)));
      }
    } else if (d.which === "feed") {
      setFeedW(Math.min(280, Math.max(140, d.startW + dx)));
    } else {
      setListW(Math.min(400, Math.max(260, d.startW + dx)));
    }
  };
  const onDividerUp = () => {
    const d = dragRef.current;
    dragRef.current = null;
    setDragging(false);
    if (!d) return;
    void window.capybara.invoke("settings:set", "side_w", String(sideW));
    void window.capybara.invoke("settings:set", "list_w", String(listW));
    void window.capybara.invoke("settings:set", "feed_w", String(feedW));
    void window.capybara.invoke("settings:set", "side_collapsed", sideCollapsed ? "1" : "0");
  };
  const sidebarStyle = { width: sideCollapsed ? 56 : sideW };
  const showFeeds = activeSourceType == null && view !== "archived";
  const isZen = zenMode && screen === "library";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "app", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "titlebar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "titlebar-hamburger",
          title: sideHidden ? "展开侧边栏" : "收起侧边栏",
          ...pressBtn(() => setSideHidden((v2) => !v2)),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: sideHidden ? "panelLeftOpen" : "panelLeftClose", size: 16 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hint", children: version || "v0.7.6" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "main", children: [
      !isZen && !sideHidden && /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, { collapsed: sideCollapsed, style: sidebarStyle, dragging }),
      !isZen && !sideHidden && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divider v", onPointerDown: onDividerDown("side"), onPointerMove: onDividerMove, onPointerUp: onDividerUp }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "content", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ErrorBoundary, { children: [
        screen === "library" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          !isZen && showFeeds && /* @__PURE__ */ jsxRuntimeExports.jsx(FeedsPanel, { width: feedW }),
          !isZen && showFeeds && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divider v", onPointerDown: onDividerDown("feed"), onPointerMove: onDividerMove, onPointerUp: onDividerUp }),
          !isZen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "list-pane", style: { width: listW }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemList, {}) }),
          !isZen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divider v", onPointerDown: onDividerDown("list"), onPointerMove: onDividerMove, onPointerUp: onDividerUp }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ReaderPane, {})
        ] }),
        screen === "board" && /* @__PURE__ */ jsxRuntimeExports.jsx(BoardView, {}),
        screen === "bookmarks" && /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkView, {})
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(QuickAdd, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CommandSearch, {}),
    settingsOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsView, {}) }),
    toastMsg && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "toast", children: toastMsg }),
    developerMode && /* @__PURE__ */ jsxRuntimeExports.jsx(NetPanel, {})
  ] });
}
function NetPanel() {
  const { netLog, setDeveloperMode } = useStore();
  const shown = netLog.slice(-80).reverse();
  const failed = netLog.filter((e) => !e.ok).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "net-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "net-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "网络诊断",
        netLog.length ? ` · ${netLog.length} 条` : "",
        failed ? /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { className: "net-bad", children: [
          " · ",
          failed,
          " 失败"
        ] }) : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "net-db", title: "查看数据库", onClick: () => useStore.getState().openSettings("data"), children: "数据库查看 →" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "net-close", title: "关闭开发者模式", onClick: () => setDeveloperMode(false), children: "×" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "net-body", children: [
      shown.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "net-empty", children: "暂无请求。点「立即刷新全部源」或等待调度器抓取即可看到日志。" }),
      shown.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `net-row ${e.ok ? "" : "fail"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "net-status", children: e.ok ? e.status || "OK" : e.status || "ERR" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "net-method", children: e.method || "GET" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "net-url", title: e.url, children: e.url }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "net-meta", children: [
          e.ms,
          "ms · ",
          e.bytes,
          "B"
        ] }),
        e.error && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "net-err", title: e.error, children: e.error })
      ] }, e.time + "-" + i))
    ] })
  ] });
}
bootAppearance();
createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React$2.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);
