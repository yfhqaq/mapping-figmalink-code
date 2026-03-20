import ke from "react";
import { AlignCenterOutlined as ir } from "@ant-design/icons";
import { ModuleTypes as or, useSt as ur } from "@spotter/lowcode-common";
import { SptTabWithBadge as cr } from "@spotter/ui";
import { ModuleAssembleRender as Pe } from "@spotter/lowcode-core";
var Z = { exports: {} }, D = {};
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var H, we;
function Se() {
  if (we)
    return H;
  we = 1;
  var b = Object.getOwnPropertySymbols, C = Object.prototype.hasOwnProperty, h = Object.prototype.propertyIsEnumerable;
  function O(E) {
    if (E == null)
      throw new TypeError("Object.assign cannot be called with null or undefined");
    return Object(E);
  }
  function j() {
    try {
      if (!Object.assign)
        return !1;
      var E = new String("abc");
      if (E[5] = "de", Object.getOwnPropertyNames(E)[0] === "5")
        return !1;
      for (var y = {}, f = 0; f < 10; f++)
        y["_" + String.fromCharCode(f)] = f;
      var l = Object.getOwnPropertyNames(y).map(function(c) {
        return y[c];
      });
      if (l.join("") !== "0123456789")
        return !1;
      var s = {};
      return "abcdefghijklmnopqrst".split("").forEach(function(c) {
        s[c] = c;
      }), Object.keys(Object.assign({}, s)).join("") === "abcdefghijklmnopqrst";
    } catch {
      return !1;
    }
  }
  return H = j() ? Object.assign : function(E, y) {
    for (var f, l = O(E), s, c = 1; c < arguments.length; c++) {
      f = Object(arguments[c]);
      for (var g in f)
        C.call(f, g) && (l[g] = f[g]);
      if (b) {
        s = b(f);
        for (var _ = 0; _ < s.length; _++)
          h.call(f, s[_]) && (l[s[_]] = f[s[_]]);
      }
    }
    return l;
  }, H;
}
/** @license React v17.0.2
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var xe;
function fr() {
  if (xe)
    return D;
  xe = 1, Se();
  var b = ke, C = 60103;
  if (D.Fragment = 60107, typeof Symbol == "function" && Symbol.for) {
    var h = Symbol.for;
    C = h("react.element"), D.Fragment = h("react.fragment");
  }
  var O = b.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, j = Object.prototype.hasOwnProperty, E = { key: !0, ref: !0, __self: !0, __source: !0 };
  function y(f, l, s) {
    var c, g = {}, _ = null, P = null;
    s !== void 0 && (_ = "" + s), l.key !== void 0 && (_ = "" + l.key), l.ref !== void 0 && (P = l.ref);
    for (c in l)
      j.call(l, c) && !E.hasOwnProperty(c) && (g[c] = l[c]);
    if (f && f.defaultProps)
      for (c in l = f.defaultProps, l)
        g[c] === void 0 && (g[c] = l[c]);
    return { $$typeof: C, type: f, key: _, ref: P, props: g, _owner: O.current };
  }
  return D.jsx = y, D.jsxs = y, D;
}
var X = {};
/** @license React v17.0.2
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ce;
function sr() {
  return Ce || (Ce = 1, function(b) {
    process.env.NODE_ENV !== "production" && function() {
      var C = ke, h = Se(), O = 60103, j = 60106;
      b.Fragment = 60107;
      var E = 60108, y = 60114, f = 60109, l = 60110, s = 60112, c = 60113, g = 60120, _ = 60115, P = 60116, Y = 60121, Q = 60122, ee = 60117, re = 60129, te = 60131;
      if (typeof Symbol == "function" && Symbol.for) {
        var v = Symbol.for;
        O = v("react.element"), j = v("react.portal"), b.Fragment = v("react.fragment"), E = v("react.strict_mode"), y = v("react.profiler"), f = v("react.provider"), l = v("react.context"), s = v("react.forward_ref"), c = v("react.suspense"), g = v("react.suspense_list"), _ = v("react.memo"), P = v("react.lazy"), Y = v("react.block"), Q = v("react.server.block"), ee = v("react.fundamental"), v("react.scope"), v("react.opaque.id"), re = v("react.debug_trace_mode"), v("react.offscreen"), te = v("react.legacy_hidden");
      }
      var ne = typeof Symbol == "function" && Symbol.iterator, Ae = "@@iterator";
      function De(e) {
        if (e === null || typeof e != "object")
          return null;
        var r = ne && e[ne] || e[Ae];
        return typeof r == "function" ? r : null;
      }
      var k = C.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      function m(e) {
        {
          for (var r = arguments.length, t = new Array(r > 1 ? r - 1 : 0), n = 1; n < r; n++)
            t[n - 1] = arguments[n];
          Ie("error", e, t);
        }
      }
      function Ie(e, r, t) {
        {
          var n = k.ReactDebugCurrentFrame, o = n.getStackAddendum();
          o !== "" && (r += "%s", t = t.concat([o]));
          var u = t.map(function(i) {
            return "" + i;
          });
          u.unshift("Warning: " + r), Function.prototype.apply.call(console[e], console, u);
        }
      }
      var We = !1;
      function Ye(e) {
        return !!(typeof e == "string" || typeof e == "function" || e === b.Fragment || e === y || e === re || e === E || e === c || e === g || e === te || We || typeof e == "object" && e !== null && (e.$$typeof === P || e.$$typeof === _ || e.$$typeof === f || e.$$typeof === l || e.$$typeof === s || e.$$typeof === ee || e.$$typeof === Y || e[0] === Q));
      }
      function $e(e, r, t) {
        var n = r.displayName || r.name || "";
        return e.displayName || (n !== "" ? t + "(" + n + ")" : t);
      }
      function ae(e) {
        return e.displayName || "Context";
      }
      function T(e) {
        if (e == null)
          return null;
        if (typeof e.tag == "number" && m("Received an unexpected object in getComponentName(). This is likely a bug in React. Please file an issue."), typeof e == "function")
          return e.displayName || e.name || null;
        if (typeof e == "string")
          return e;
        switch (e) {
          case b.Fragment:
            return "Fragment";
          case j:
            return "Portal";
          case y:
            return "Profiler";
          case E:
            return "StrictMode";
          case c:
            return "Suspense";
          case g:
            return "SuspenseList";
        }
        if (typeof e == "object")
          switch (e.$$typeof) {
            case l:
              var r = e;
              return ae(r) + ".Consumer";
            case f:
              var t = e;
              return ae(t._context) + ".Provider";
            case s:
              return $e(e, e.render, "ForwardRef");
            case _:
              return T(e.type);
            case Y:
              return T(e._render);
            case P: {
              var n = e, o = n._payload, u = n._init;
              try {
                return T(u(o));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var I = 0, ie, oe, ue, ce, fe, se, le;
      function de() {
      }
      de.__reactDisabledLog = !0;
      function Me() {
        {
          if (I === 0) {
            ie = console.log, oe = console.info, ue = console.warn, ce = console.error, fe = console.group, se = console.groupCollapsed, le = console.groupEnd;
            var e = {
              configurable: !0,
              enumerable: !0,
              value: de,
              writable: !0
            };
            Object.defineProperties(console, {
              info: e,
              log: e,
              warn: e,
              error: e,
              group: e,
              groupCollapsed: e,
              groupEnd: e
            });
          }
          I++;
        }
      }
      function Le() {
        {
          if (I--, I === 0) {
            var e = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: h({}, e, {
                value: ie
              }),
              info: h({}, e, {
                value: oe
              }),
              warn: h({}, e, {
                value: ue
              }),
              error: h({}, e, {
                value: ce
              }),
              group: h({}, e, {
                value: fe
              }),
              groupCollapsed: h({}, e, {
                value: se
              }),
              groupEnd: h({}, e, {
                value: le
              })
            });
          }
          I < 0 && m("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var N = k.ReactCurrentDispatcher, V;
      function $(e, r, t) {
        {
          if (V === void 0)
            try {
              throw Error();
            } catch (o) {
              var n = o.stack.trim().match(/\n( *(at )?)/);
              V = n && n[1] || "";
            }
          return `
` + V + e;
        }
      }
      var B = !1, M;
      {
        var Fe = typeof WeakMap == "function" ? WeakMap : Map;
        M = new Fe();
      }
      function ve(e, r) {
        if (!e || B)
          return "";
        {
          var t = M.get(e);
          if (t !== void 0)
            return t;
        }
        var n;
        B = !0;
        var o = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var u;
        u = N.current, N.current = null, Me();
        try {
          if (r) {
            var i = function() {
              throw Error();
            };
            if (Object.defineProperty(i.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(i, []);
              } catch (x) {
                n = x;
              }
              Reflect.construct(e, [], i);
            } else {
              try {
                i.call();
              } catch (x) {
                n = x;
              }
              e.call(i.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (x) {
              n = x;
            }
            e();
          }
        } catch (x) {
          if (x && n && typeof x.stack == "string") {
            for (var a = x.stack.split(`
`), R = n.stack.split(`
`), d = a.length - 1, p = R.length - 1; d >= 1 && p >= 0 && a[d] !== R[p]; )
              p--;
            for (; d >= 1 && p >= 0; d--, p--)
              if (a[d] !== R[p]) {
                if (d !== 1 || p !== 1)
                  do
                    if (d--, p--, p < 0 || a[d] !== R[p]) {
                      var w = `
` + a[d].replace(" at new ", " at ");
                      return typeof e == "function" && M.set(e, w), w;
                    }
                  while (d >= 1 && p >= 0);
                break;
              }
          }
        } finally {
          B = !1, N.current = u, Le(), Error.prepareStackTrace = o;
        }
        var A = e ? e.displayName || e.name : "", je = A ? $(A) : "";
        return typeof e == "function" && M.set(e, je), je;
      }
      function pe(e, r, t) {
        return ve(e, !1);
      }
      function Ue(e) {
        var r = e.prototype;
        return !!(r && r.isReactComponent);
      }
      function L(e, r, t) {
        if (e == null)
          return "";
        if (typeof e == "function")
          return ve(e, Ue(e));
        if (typeof e == "string")
          return $(e);
        switch (e) {
          case c:
            return $("Suspense");
          case g:
            return $("SuspenseList");
        }
        if (typeof e == "object")
          switch (e.$$typeof) {
            case s:
              return pe(e.render);
            case _:
              return L(e.type, r, t);
            case Y:
              return pe(e._render);
            case P: {
              var n = e, o = n._payload, u = n._init;
              try {
                return L(u(o), r, t);
              } catch {
              }
            }
          }
        return "";
      }
      var ge = {}, _e = k.ReactDebugCurrentFrame;
      function F(e) {
        if (e) {
          var r = e._owner, t = L(e.type, e._source, r ? r.type : null);
          _e.setExtraStackFrame(t);
        } else
          _e.setExtraStackFrame(null);
      }
      function Ne(e, r, t, n, o) {
        {
          var u = Function.call.bind(Object.prototype.hasOwnProperty);
          for (var i in e)
            if (u(e, i)) {
              var a = void 0;
              try {
                if (typeof e[i] != "function") {
                  var R = Error((n || "React class") + ": " + t + " type `" + i + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[i] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw R.name = "Invariant Violation", R;
                }
                a = e[i](r, i, n, t, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (d) {
                a = d;
              }
              a && !(a instanceof Error) && (F(o), m("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", n || "React class", t, i, typeof a), F(null)), a instanceof Error && !(a.message in ge) && (ge[a.message] = !0, F(o), m("Failed %s type: %s", t, a.message), F(null));
            }
        }
      }
      var W = k.ReactCurrentOwner, q = Object.prototype.hasOwnProperty, Ve = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, Ee, he, G;
      G = {};
      function Be(e) {
        if (q.call(e, "ref")) {
          var r = Object.getOwnPropertyDescriptor(e, "ref").get;
          if (r && r.isReactWarning)
            return !1;
        }
        return e.ref !== void 0;
      }
      function qe(e) {
        if (q.call(e, "key")) {
          var r = Object.getOwnPropertyDescriptor(e, "key").get;
          if (r && r.isReactWarning)
            return !1;
        }
        return e.key !== void 0;
      }
      function Ge(e, r) {
        if (typeof e.ref == "string" && W.current && r && W.current.stateNode !== r) {
          var t = T(W.current.type);
          G[t] || (m('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', T(W.current.type), e.ref), G[t] = !0);
        }
      }
      function Ke(e, r) {
        {
          var t = function() {
            Ee || (Ee = !0, m("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
          };
          t.isReactWarning = !0, Object.defineProperty(e, "key", {
            get: t,
            configurable: !0
          });
        }
      }
      function Je(e, r) {
        {
          var t = function() {
            he || (he = !0, m("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
          };
          t.isReactWarning = !0, Object.defineProperty(e, "ref", {
            get: t,
            configurable: !0
          });
        }
      }
      var ze = function(e, r, t, n, o, u, i) {
        var a = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: O,
          // Built-in properties that belong on the element
          type: e,
          key: r,
          ref: t,
          props: i,
          // Record the component responsible for creating this element.
          _owner: u
        };
        return a._store = {}, Object.defineProperty(a._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(a, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: n
        }), Object.defineProperty(a, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: o
        }), Object.freeze && (Object.freeze(a.props), Object.freeze(a)), a;
      };
      function He(e, r, t, n, o) {
        {
          var u, i = {}, a = null, R = null;
          t !== void 0 && (a = "" + t), qe(r) && (a = "" + r.key), Be(r) && (R = r.ref, Ge(r, o));
          for (u in r)
            q.call(r, u) && !Ve.hasOwnProperty(u) && (i[u] = r[u]);
          if (e && e.defaultProps) {
            var d = e.defaultProps;
            for (u in d)
              i[u] === void 0 && (i[u] = d[u]);
          }
          if (a || R) {
            var p = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
            a && Ke(i, p), R && Je(i, p);
          }
          return ze(e, a, R, o, n, W.current, i);
        }
      }
      var K = k.ReactCurrentOwner, Re = k.ReactDebugCurrentFrame;
      function S(e) {
        if (e) {
          var r = e._owner, t = L(e.type, e._source, r ? r.type : null);
          Re.setExtraStackFrame(t);
        } else
          Re.setExtraStackFrame(null);
      }
      var J;
      J = !1;
      function z(e) {
        return typeof e == "object" && e !== null && e.$$typeof === O;
      }
      function be() {
        {
          if (K.current) {
            var e = T(K.current.type);
            if (e)
              return `

Check the render method of \`` + e + "`.";
          }
          return "";
        }
      }
      function Xe(e) {
        {
          if (e !== void 0) {
            var r = e.fileName.replace(/^.*[\\\/]/, ""), t = e.lineNumber;
            return `

Check your code at ` + r + ":" + t + ".";
          }
          return "";
        }
      }
      var me = {};
      function Ze(e) {
        {
          var r = be();
          if (!r) {
            var t = typeof e == "string" ? e : e.displayName || e.name;
            t && (r = `

Check the top-level render call using <` + t + ">.");
          }
          return r;
        }
      }
      function ye(e, r) {
        {
          if (!e._store || e._store.validated || e.key != null)
            return;
          e._store.validated = !0;
          var t = Ze(r);
          if (me[t])
            return;
          me[t] = !0;
          var n = "";
          e && e._owner && e._owner !== K.current && (n = " It was passed a child from " + T(e._owner.type) + "."), S(e), m('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', t, n), S(null);
        }
      }
      function Oe(e, r) {
        {
          if (typeof e != "object")
            return;
          if (Array.isArray(e))
            for (var t = 0; t < e.length; t++) {
              var n = e[t];
              z(n) && ye(n, r);
            }
          else if (z(e))
            e._store && (e._store.validated = !0);
          else if (e) {
            var o = De(e);
            if (typeof o == "function" && o !== e.entries)
              for (var u = o.call(e), i; !(i = u.next()).done; )
                z(i.value) && ye(i.value, r);
          }
        }
      }
      function Qe(e) {
        {
          var r = e.type;
          if (r == null || typeof r == "string")
            return;
          var t;
          if (typeof r == "function")
            t = r.propTypes;
          else if (typeof r == "object" && (r.$$typeof === s || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          r.$$typeof === _))
            t = r.propTypes;
          else
            return;
          if (t) {
            var n = T(r);
            Ne(t, e.props, "prop", n, e);
          } else if (r.PropTypes !== void 0 && !J) {
            J = !0;
            var o = T(r);
            m("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", o || "Unknown");
          }
          typeof r.getDefaultProps == "function" && !r.getDefaultProps.isReactClassApproved && m("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function er(e) {
        {
          for (var r = Object.keys(e.props), t = 0; t < r.length; t++) {
            var n = r[t];
            if (n !== "children" && n !== "key") {
              S(e), m("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", n), S(null);
              break;
            }
          }
          e.ref !== null && (S(e), m("Invalid attribute `ref` supplied to `React.Fragment`."), S(null));
        }
      }
      function Te(e, r, t, n, o, u) {
        {
          var i = Ye(e);
          if (!i) {
            var a = "";
            (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (a += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
            var R = Xe(o);
            R ? a += R : a += be();
            var d;
            e === null ? d = "null" : Array.isArray(e) ? d = "array" : e !== void 0 && e.$$typeof === O ? (d = "<" + (T(e.type) || "Unknown") + " />", a = " Did you accidentally export a JSX literal instead of a component?") : d = typeof e, m("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", d, a);
          }
          var p = He(e, r, t, o, u);
          if (p == null)
            return p;
          if (i) {
            var w = r.children;
            if (w !== void 0)
              if (n)
                if (Array.isArray(w)) {
                  for (var A = 0; A < w.length; A++)
                    Oe(w[A], e);
                  Object.freeze && Object.freeze(w);
                } else
                  m("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
              else
                Oe(w, e);
          }
          return e === b.Fragment ? er(p) : Qe(p), p;
        }
      }
      function rr(e, r, t) {
        return Te(e, r, t, !0);
      }
      function tr(e, r, t) {
        return Te(e, r, t, !1);
      }
      var nr = tr, ar = rr;
      b.jsx = nr, b.jsxs = ar;
    }();
  }(X)), X;
}
process.env.NODE_ENV === "production" ? Z.exports = fr() : Z.exports = sr();
var U = Z.exports;
const lr = () => ({
  componentType: or.TabWithBadge,
  description: "统一标签页组件TabWithBadge",
  icon: () => /* @__PURE__ */ U.jsx(ir, {}),
  version: "0.0.1",
  name: "标签页",
  docUrl: ""
});
const dr = (b) => {
  ur();
  const { config: C, updateCardInfo: h, editModel: O, curModuleKey: j } = b, { children: E, key: y, tabs: f } = { ...C }, l = [
    ...E.map((s, c) => {
      var _;
      const g = (_ = f.filter((P) => P.parentKey === s.key)) == null ? void 0 : _[0];
      return console.log(g, "============="), {
        key: s.key,
        label: /* @__PURE__ */ U.jsx(
          Pe,
          {
            curModuleKey: j,
            editModel: O,
            updateCardInfo: h,
            parentId: s.key,
            pageContents: [s],
            moduleProps: {}
          },
          s.key
        ),
        children: /* @__PURE__ */ U.jsx(
          Pe,
          {
            curModuleKey: j,
            editModel: O,
            updateCardInfo: h,
            parentId: g.key,
            pageContents: [g],
            moduleProps: {}
          },
          g.key
        )
      };
    })
  ];
  return /* @__PURE__ */ U.jsx(
    cr,
    {
      items: l
    }
  );
}, vr = lr(), pr = {
  moduleFunctional: dr
}, br = {
  components: pr,
  moduleInfo: vr
};
export {
  br as sptTabWithBadgeModule
};
//# sourceMappingURL=index.mjs.map
