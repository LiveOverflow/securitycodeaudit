import{d as y,r as v,b2 as w,e as d,o as l,c as i,a as p,t as s,f as u,w as g,F as m,j as V,h as k,bt as P,l as _}from"./index.09b2e381.js";import{_ as b}from"./plugin-vue_export-helper.21dcd24c.js";function C(e){switch(e){case"../paths/python/Python1.ts":return P(()=>import("./Python1.52e4c0b3.js"),[]);default:return new Promise(function(n,a){(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(a.bind(null,new Error("Unknown variable dynamic import: "+e)))})}}const $=y({props:{path:{type:String,required:!0},page:{type:String,required:!0}},setup(e){const n=v(void 0),a=()=>{C(`../paths/${e.path}/${e.page}.ts`).then(t=>{n.value=t.default}).catch(()=>{n.value=void 0})};w(()=>e.page+e.path,async(t,o)=>{a()});var h=t=>{const o=new RegExp("(?:"+t.name+"\\s*|^)\\s*\\((.*?)\\)").exec(t.toString().replace(/\n/g,""));if(o?.length&&o?.length>1){const r=o[1].replace(/\/\*.*?\*\//g,"").replace(/ /g,"");if(r.length>0)return r.split(",")}return[]};return a(),{challenge:n,args:h}}}),E={class:"content"},R=_(" Python1 "),q=_(" Python2 "),N={key:0};function S(e,n,a,h,t,o){const r=d("router-link"),f=d("RouterView");return l(),i(m,null,[p("div",E,[p("h1",null,"This is an challenge page for "+s(e.path)+" on page "+s(e.page),1),p("div",null,[u(r,{to:{name:"path",params:{path:"python",page:"Python1"}}},{default:g(()=>[R]),_:1}),u(r,{to:{name:"path",params:{path:"python",page:"Python2"}}},{default:g(()=>[q]),_:1})]),e.challenge?(l(),i("div",N,[p("pre",null,s(e.challenge.code),1),(l(!0),i(m,null,V(e.challenge.solve,c=>(l(),i("button",{key:c.name,class:"bg-green px-4 py-1 rounded rounded-sm"},s(c.name)+": "+s(e.args(c)),1))),128))])):k("",!0)]),u(f)],64)}var B=b($,[["render",S]]);export{B as default};