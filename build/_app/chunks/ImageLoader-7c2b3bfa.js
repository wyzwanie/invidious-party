import{S as t,i as s,s as e,X as n,e as r,c as o,a as i,d as l,b as c,f as a,Y as p,v as d,r as u,z as f,a1 as $,I as h,K as m,D as g,k as v,l as w,n as x,E as z,F as b,N as E,j as I,m as y,o as B,w as L,B as j,u as M}from"./vendor-78501628.js";import{i as N,c as D}from"./helper-986d7f78.js";const H=t=>({intersecting:1&t}),O=t=>({intersecting:t[0]});function R(t){let s,e;const f=t[8].default,$=n(f,t,t[7],O);return{c(){s=r("div"),$&&$.c(),this.h()},l(t){s=o(t,"DIV",{class:!0});var e=i(s);$&&$.l(e),e.forEach(l),this.h()},h(){c(s,"class","svelte-505hyj")},m(n,r){a(n,s,r),$&&$.m(s,null),t[9](s),e=!0},p(t,[s]){$&&$.p&&(!e||129&s)&&p($,f,t,t[7],s,H,O)},i(t){e||(d($,t),e=!0)},o(t){u($,t),e=!1},d(e){e&&l(s),$&&$.d(e),t[9](null)}}}function k(t,s,e){let n,{$$slots:r={},$$scope:o}=s,{once:i=!1}=s,{top:l=0}=s,{bottom:c=0}=s,{left:a=0}=s,{right:p=0}=s,d=!1;return f((()=>{if("undefined"!=typeof IntersectionObserver){const t=new IntersectionObserver((s=>{e(0,d=s[0].isIntersecting),d&&i&&t.unobserve(n)}),{rootMargin:`${c}px ${a}px ${l}px ${p}px`});return t.observe(n),()=>t.unobserve(n)}function t(){const s=n.getBoundingClientRect();e(0,d=s.bottom+c>0&&s.right+p>0&&s.top-l<window.innerHeight&&s.left-a<window.innerWidth),d&&i&&window.removeEventListener("scroll",t)}return window.addEventListener("scroll",t),()=>window.removeEventListener("scroll",t)})),t.$$set=t=>{"once"in t&&e(2,i=t.once),"top"in t&&e(3,l=t.top),"bottom"in t&&e(4,c=t.bottom),"left"in t&&e(5,a=t.left),"right"in t&&e(6,p=t.right),"$$scope"in t&&e(7,o=t.$$scope)},[d,n,i,l,c,a,p,o,r,function(t){$[t?"unshift":"push"]((()=>{n=t,e(1,n)}))}]}class C extends t{constructor(t){super(),s(this,t,k,R,e,{once:2,top:3,bottom:4,left:5,right:6})}}function F(t){let s,e,n;return{c(){s=h("svg"),e=h("rect"),this.h()},l(t){s=o(t,"svg",{viewBox:!0,class:!0},1);var n=i(s);e=o(n,"rect",{width:!0,height:!0,fill:!0,class:!0},1),i(e).forEach(l),n.forEach(l),this.h()},h(){c(e,"width","100%"),c(e,"height","100%"),c(e,"fill","var(--text-100)"),c(e,"class","svelte-1o3of5r"),c(s,"viewBox",n="0 0 "+t[2].split("x")[0]+" "+t[2].split("x")[1]),c(s,"class","svelte-1o3of5r"),m(s,"loaded",t[3])},m(t,n){a(t,s,n),g(s,e)},p(t,e){4&e&&n!==(n="0 0 "+t[2].split("x")[0]+" "+t[2].split("x")[1])&&c(s,"viewBox",n),8&e&&m(s,"loaded",t[3])},d(t){t&&l(s)}}}function G(t){let s,e,n,i,p,d,u=!t[3]&&F(t);return{c(){s=r("img"),n=v(),u&&u.c(),i=w(),this.h()},l(t){s=o(t,"IMG",{src:!0,alt:!0,loading:!0,class:!0}),n=x(t),u&&u.l(t),i=w(),this.h()},h(){s.src!==(e=t[0])&&c(s,"src",e),c(s,"alt",t[1]),c(s,"loading","lazy"),c(s,"class","svelte-1o3of5r"),m(s,"loaded",t[3])},m(e,r){a(e,s,r),t[6](s),a(e,n,r),u&&u.m(e,r),a(e,i,r),p||(d=z(s,"error",t[5]),p=!0)},p(t,[n]){1&n&&s.src!==(e=t[0])&&c(s,"src",e),2&n&&c(s,"alt",t[1]),8&n&&m(s,"loaded",t[3]),t[3]?u&&(u.d(1),u=null):u?u.p(t,n):(u=F(t),u.c(),u.m(i.parentNode,i))},i:b,o:b,d(e){e&&l(s),t[6](null),e&&l(n),u&&u.d(e),e&&l(i),p=!1,d()}}}function K(t,s,e){let n;E(t,N,(t=>e(7,n=t)));let r,{src:o}=s,{alt:i}=s,{size:l="320x180"}=s,c=!1;f((()=>{e(4,r.onload=()=>e(3,c=!0),r)}));return t.$$set=t=>{"src"in t&&e(0,o=t.src),"alt"in t&&e(1,i=t.alt),"size"in t&&e(2,l=t.size)},[o,i,l,c,r,()=>{console.log("replacing");const t=r.src,s=new URL(t).host;e(4,r.src=`https://${D(n)}${t.split(s)[1]}`,r)},function(t){$[t?"unshift":"push"]((()=>{r=t,e(4,r)}))}]}class S extends t{constructor(t){super(),s(this,t,K,G,e,{src:0,alt:1,size:2})}}function T(t){let s,e;return s=new S({props:{alt:t[1],src:t[0],size:t[2]}}),{c(){I(s.$$.fragment)},l(t){y(s.$$.fragment,t)},m(t,n){B(s,t,n),e=!0},p(t,e){const n={};2&e&&(n.alt=t[1]),1&e&&(n.src=t[0]),4&e&&(n.size=t[2]),s.$set(n)},i(t){e||(d(s.$$.fragment,t),e=!0)},o(t){u(s.$$.fragment,t),e=!1},d(t){L(s,t)}}}function U(t){let s,e,n=(t[4]||t[3])&&T(t);return{c(){n&&n.c(),s=w()},l(t){n&&n.l(t),s=w()},m(t,r){n&&n.m(t,r),a(t,s,r),e=!0},p(t,e){t[4]||t[3]?n?(n.p(t,e),24&e&&d(n,1)):(n=T(t),n.c(),d(n,1),n.m(s.parentNode,s)):n&&(j(),u(n,1,1,(()=>{n=null})),M())},i(t){e||(d(n),e=!0)},o(t){u(n),e=!1},d(t){n&&n.d(t),t&&l(s)}}}function V(t){let s,e;return s=new C({props:{once:!0,$$slots:{default:[U,({intersecting:t})=>({4:t}),({intersecting:t})=>t?16:0]},$$scope:{ctx:t}}}),{c(){I(s.$$.fragment)},l(t){y(s.$$.fragment,t)},m(t,n){B(s,t,n),e=!0},p(t,[e]){const n={};63&e&&(n.$$scope={dirty:e,ctx:t}),s.$set(n)},i(t){e||(d(s.$$.fragment,t),e=!0)},o(t){u(s.$$.fragment,t),e=!1},d(t){L(s,t)}}}function W(t,s,e){let{src:n}=s,{alt:r}=s,{size:o}=s,i=!1;return f((()=>{"loading"in HTMLImageElement.prototype&&e(3,i=!0)})),t.$$set=t=>{"src"in t&&e(0,n=t.src),"alt"in t&&e(1,r=t.alt),"size"in t&&e(2,o=t.size)},[n,r,o,i]}class X extends t{constructor(t){super(),s(this,t,W,V,e,{src:0,alt:1,size:2})}}export{X as I};
//# sourceMappingURL=ImageLoader-7c2b3bfa.js.map
