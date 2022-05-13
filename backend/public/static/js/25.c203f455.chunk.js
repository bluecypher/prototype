/*! For license information please see 25.c203f455.chunk.js.LICENSE.txt */
(this["webpackJsonp@minimal/material-kit-react"]=this["webpackJsonp@minimal/material-kit-react"]||[]).push([[25],{143:function(e,t,n){"use strict";var i=n(6),r=n(150),o=n(4),a=n.n(o),s=n(51),c=n(0),u=n(108),h=n(2),f=["children","title"],d=Object(c.forwardRef)((function(e,t){var n=e.children,o=e.title,a=void 0===o?"":o,c=Object(r.a)(e,f);return Object(h.jsxs)(u.a,Object(i.a)(Object(i.a)({ref:t},c),{},{children:[Object(h.jsx)(s.a,{children:Object(h.jsx)("title",{children:a})}),n]}))}));d.propTypes={children:a.a.node.isRequired,title:a.a.string},t.a=d},147:function(e,t,n){"use strict";t.parse=function(e,t){if("string"!==typeof e)throw new TypeError("argument str must be a string");for(var n={},r=t||{},a=e.split(o),c=r.decode||i,u=0;u<a.length;u++){var h=a[u],f=h.indexOf("=");if(!(f<0)){var d=h.substr(0,f).trim(),l=h.substr(++f,h.length).trim();'"'==l[0]&&(l=l.slice(1,-1)),void 0==n[d]&&(n[d]=s(l,c))}}return n},t.serialize=function(e,t,n){var i=n||{},o=i.encode||r;if("function"!==typeof o)throw new TypeError("option encode is invalid");if(!a.test(e))throw new TypeError("argument name is invalid");var s=o(t);if(s&&!a.test(s))throw new TypeError("argument val is invalid");var c=e+"="+s;if(null!=i.maxAge){var u=i.maxAge-0;if(isNaN(u))throw new Error("maxAge should be a Number");c+="; Max-Age="+Math.floor(u)}if(i.domain){if(!a.test(i.domain))throw new TypeError("option domain is invalid");c+="; Domain="+i.domain}if(i.path){if(!a.test(i.path))throw new TypeError("option path is invalid");c+="; Path="+i.path}if(i.expires){if("function"!==typeof i.expires.toUTCString)throw new TypeError("option expires is invalid");c+="; Expires="+i.expires.toUTCString()}i.httpOnly&&(c+="; HttpOnly");i.secure&&(c+="; Secure");if(i.sameSite){switch("string"===typeof i.sameSite?i.sameSite.toLowerCase():i.sameSite){case!0:c+="; SameSite=Strict";break;case"lax":c+="; SameSite=Lax";break;case"strict":c+="; SameSite=Strict";break;case"none":c+="; SameSite=None";break;default:throw new TypeError("option sameSite is invalid")}}return c};var i=decodeURIComponent,r=encodeURIComponent,o=/; */,a=/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;function s(e,t){try{return t(e)}catch(n){return e}}},378:function(e,t,n){"use strict";n.d(t,"a",(function(){return h}));var i=n(0),r=n(147);function o(e,t){void 0===t&&(t={});var n=function(e){if(e&&"j"===e[0]&&":"===e[1])return e.substr(2);return e}(e);if(function(e,t){return"undefined"===typeof t&&(t=!e||"{"!==e[0]&&"["!==e[0]&&'"'!==e[0]),!t}(n,t.doNotParse))try{return JSON.parse(n)}catch(i){}return e}var a=function(){return(a=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e}).apply(this,arguments)},s=function(){function e(e,t){var n=this;this.changeListeners=[],this.HAS_DOCUMENT_COOKIE=!1,this.cookies=function(e,t){return"string"===typeof e?r.parse(e,t):"object"===typeof e&&null!==e?e:{}}(e,t),new Promise((function(){n.HAS_DOCUMENT_COOKIE="object"===typeof document&&"string"===typeof document.cookie})).catch((function(){}))}return e.prototype._updateBrowserValues=function(e){this.HAS_DOCUMENT_COOKIE&&(this.cookies=r.parse(document.cookie,e))},e.prototype._emitChange=function(e){for(var t=0;t<this.changeListeners.length;++t)this.changeListeners[t](e)},e.prototype.get=function(e,t,n){return void 0===t&&(t={}),this._updateBrowserValues(n),o(this.cookies[e],t)},e.prototype.getAll=function(e,t){void 0===e&&(e={}),this._updateBrowserValues(t);var n={};for(var i in this.cookies)n[i]=o(this.cookies[i],e);return n},e.prototype.set=function(e,t,n){var i;"object"===typeof t&&(t=JSON.stringify(t)),this.cookies=a(a({},this.cookies),((i={})[e]=t,i)),this.HAS_DOCUMENT_COOKIE&&(document.cookie=r.serialize(e,t,n)),this._emitChange({name:e,value:t,options:n})},e.prototype.remove=function(e,t){var n=t=a(a({},t),{expires:new Date(1970,1,1,0,0,1),maxAge:0});this.cookies=a({},this.cookies),delete this.cookies[e],this.HAS_DOCUMENT_COOKIE&&(document.cookie=r.serialize(e,"",n)),this._emitChange({name:e,value:void 0,options:t})},e.prototype.addChangeListener=function(e){this.changeListeners.push(e)},e.prototype.removeChangeListener=function(e){var t=this.changeListeners.indexOf(e);t>=0&&this.changeListeners.splice(t,1)},e}(),c=i.createContext(new s),u=(c.Provider,c.Consumer,c);function h(e){var t=Object(i.useContext)(u);if(!t)throw new Error("Missing <CookiesProvider>");var n=t.getAll(),r=Object(i.useState)(n),o=r[0],a=r[1],s=Object(i.useRef)(o);return"undefined"!==typeof window&&"undefined"!==typeof window.document&&"undefined"!==typeof window.document.createElement&&Object(i.useLayoutEffect)((function(){function n(){var n=t.getAll();(function(e,t,n){if(!e)return!0;for(var i=0,r=e;i<r.length;i++){var o=r[i];if(t[o]!==n[o])return!0}return!1})(e||null,n,s.current)&&a(n),s.current=n}return t.addChangeListener(n),function(){t.removeChangeListener(n)}}),[t]),[o,Object(i.useMemo)((function(){return t.set.bind(t)}),[t]),Object(i.useMemo)((function(){return t.remove.bind(t)}),[t])]}},678:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return O}));var i=n(17),r=n(0),o=n(378),a=n(5),s=n(50),c=n(583),u=n(108),h=n(504),f=n(568),d=n(212),l=n.n(d),p=n(143),j=n(2);function O(){var e=Object(r.useState)(0),t=Object(i.a)(e,2),n=t[0],d=t[1],O=Object(r.useState)(0),b=Object(i.a)(O,2),m=b[0],v=b[1],y=Object(o.a)(),g=Object(i.a)(y,1)[0],w=Object(s.c)((function(e){return e.profileReducer.id})),x=Object(a.h)();return Object(r.useEffect)((function(){l.a.post("/users/workTillToday/",{id:w}).then((function(e){Object.keys(g).length?(console.log("res data:",e.data),e.data.map((function(e){return"O"===e.mode?d(e.amnt):v(e.amnt),e}))):x("/sessionExpired")})).catch((function(e){console.log("err",e)}))}),[w]),Object(j.jsx)(p.a,{title:"Work Done Today",children:Object(j.jsxs)(c.a,{maxWidth:"xl",children:[Object(j.jsx)(u.a,{sx:{pb:5},children:Object(j.jsx)(h.a,{variant:"h4",children:"Work done till day"})}),Object(j.jsxs)(f.a,{spacing:2,children:[Object(j.jsx)(h.a,{alignSelf:"center",variant:"h6",children:"Payment Collection"}),Object(j.jsxs)(f.a,{direction:"row",justifyContent:"space-between",children:[Object(j.jsx)(h.a,{variant:"h6",children:"Online"}),Object(j.jsxs)(h.a,{variant:"h6",children:["\u20b9",n]})]}),Object(j.jsxs)(f.a,{direction:"row",justifyContent:"space-between",children:[Object(j.jsx)(h.a,{variant:"h6",children:"Cash"}),Object(j.jsxs)(h.a,{variant:"h6",children:["\u20b9",m]})]}),Object(j.jsx)("hr",{}),Object(j.jsxs)(f.a,{direction:"row",justifyContent:"space-between",children:[Object(j.jsx)(h.a,{variant:"h6",children:"Total"}),Object(j.jsxs)(h.a,{variant:"h6",children:["\u20b9",n+m]})]})]})]})})}}}]);
//# sourceMappingURL=25.c203f455.chunk.js.map