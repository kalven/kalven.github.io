(()=>{var Re=new BroadcastChannel("metadataChannel");function Ve(e){Re.postMessage(e)}function Ge(e){Re.addEventListener("message",e)}var T="data-name",I="data-bad-media",W="data-dupe",H="data-file-size",je="vqStorage";var B=null,ze=[];function Ke(e){console.log("storage init");let t=indexedDB.open(je,4);t.onupgradeneeded=async n=>{console.log(`onupgradeneeded old=${n.oldVersion} new=${n.newVersion}`);let r=t.result;switch(n.oldVersion){case 0:console.log("Creating new DB"),r.createObjectStore("tags",{});case 1:console.log("Upgrading to version 2"),r.createObjectStore("previews",{});case 2:console.log("Upgrading to version 3"),r.createObjectStore("misc",{});case 3:console.log("Upgrading to version 4"),r.createObjectStore("metadata",{}),ze.push(an)}},t.onerror=n=>{B=null,e(!1)},t.onsuccess=async n=>{B=t.result;for(let r of ze)console.log("Running upgrade function"),await r(B);e(!0)}}function p(){if(!B)throw"DB not initialized";return B}async function an(e){return new Promise((t,n)=>{let r=e.transaction(["tags","metadata"],"readwrite"),o=r.objectStore("tags").openCursor(),i=r.objectStore("metadata"),a=[];o.onsuccess=async l=>{let s=o.result;if(s){let c={contentHash:s.key,tags:s.value.tags};a.push(new Promise((w,v)=>{let K=i.put({metadata:c},s.key);K.onsuccess=()=>w(),K.onerror=v})),s.continue()}else await Promise.all(a),t()},o.onerror=l=>{n(new Error("Could not open tags cursor"))}})}var de=new Map,We=1;function qe(e){de.set(We,e),We++}var A=new Map;function y(e){let t=A.get(e)||{contentHash:e,tags:[],scenes:[]};return t.scenes=t.scenes||[],t.tags=t.tags||[],t}function Qe(e){let t=e.data.md;A.set(t.contentHash,t),de.forEach(n=>{n(t)})}function sn(e,t){Ze(e,t),de.forEach(n=>{n(t)}),Ve({md:t})}function Ze(e,t){A.set(e,t),p().transaction("metadata","readwrite").objectStore("metadata").put({metadata:t},e)}function Je(){return new Promise((e,t)=>{let r=p().transaction("metadata","readonly").objectStore("metadata").getAll();r.onerror=o=>{t(new Error("Failed to initialize metadata"))},r.onsuccess=o=>{for(let i of r.result)A.set(i.metadata.contentHash,i.metadata);e()}})}function x(e,t){let n=structuredClone(y(e)),r=t(n);r!==void 0&&sn(e,r)}async function Ye(){try{let e={types:[{description:"Exported tags",accept:{"application/json":[".json"]}}],suggestedName:"exported-metadata.json"},n=await(await globalThis.showSaveFilePicker(e)).createWritable(),r=[];A.forEach((i,a)=>{r.push(i)});let o=new Blob([JSON.stringify({metadata:r})],{type:"application/json"});await n.write(o),await n.close()}catch(e){return console.log("export error:",e),!1}return!0}async function Xe(){try{let e={types:[{description:"Metadata",accept:{"application/json":[".json"]}}],multiple:!1},[t]=await globalThis.showOpenFilePicker(e),r=await(await t.getFile()).arrayBuffer(),o=new Uint8Array(r),a=new TextDecoder("utf-8").decode(o),s=JSON.parse(a).metadata;for(let c of s)console.log(`updating metadata for ${c.contentHash}`),Ze(c.contentHash,c);return!0}catch(e){return console.log("import error:",e),!1}}var cn=624,ln=1e4;function me(e,t,n){let r={};function o(){c.style.width=`${cn}px`,r.width=c.videoWidth,r.height=c.videoHeight,r.duration=c.duration}function i(v){if(w!==0&&(clearTimeout(w),w=0),c.removeEventListener("error",s,!1),c.removeEventListener("canplay",l,!1),c.removeEventListener("loadedmetadata",o,!1),c.src="",v&&(r.image=v,v.size<1200&&t.retries>0)){--t.retries,typeof t.specificTime=="number"&&(t.specificTime+=1/30),me(e,t,n);return}n(r)}function a(){c.removeEventListener("seeked",a,!1),dn(c,i)}function l(){c.removeEventListener("canplay",l,!1),c.pause(),t.specificTime||(t.specificTime=c.duration/2),c.addEventListener("seeked",a),c.currentTime=t.specificTime}function s(){i(null)}let c=document.getElementById("generator");c.addEventListener("canplay",l,!1),c.addEventListener("loadedmetadata",o,!1),c.addEventListener("error",s,!1),c.src=e;let w=setTimeout(s,ln);c.pause()}function dn(e,t){let n=document.getElementById("canvas"),r=e.offsetWidth,o=e.offsetHeight;n.width=r,n.height=o;let i=e.offsetWidth,a=e.offsetHeight,l=n.getContext("2d",{willReadFrequently:!0});if(!l){t(null);return}l.imageSmoothingEnabled=!0,l.imageSmoothingQuality="high",l.drawImage(e,0,0,i,a),n.toBlob(t,"image/webp",.5)}var et=new Map;function F(e){return et.get(e)||{duration:0,width:0,height:0}}function tt(e,t){let n={duration:t&&t.duration||0,width:t&&t.width||0,height:t&&t.height||0};et.set(e,n)}var q=0,O=0;function nt(e,t){let n=document.getElementById("progress-container"),r=document.getElementById("progress");O==0&&(n.style.opacity="1"),q+=t,O+=e,r.value=q,r.max=O,q>=O&&(n.style.opacity="0",O=0,q=0)}function rt(e,t){let r=p().transaction("previews").objectStore("previews").get(e);r.onsuccess=o=>{tt(e,r.result),t(r.result)}}var U=[],fe=!1;function ot(e,t,n){ge(e,t,void 0,n)}function ge(e,t,n,r){nt(1,0),U.push({contentHash:e,file:t,specificTime:n,callback:r,processing:!1}),U.length==1&&ye()}function pe(e,t){p().transaction("previews","readwrite").objectStore("previews").put(t,e)}function it(){fe=!0}function at(){fe=!1;let e=U[0];e&&!e.processing&&ye()}function ye(){if(fe)return;let e=U[0];e&&(e.processing=!0,mn(e.contentHash,e.file,e.specificTime,t=>{U.shift(),e.callback(t),ye()}))}function mn(e,t,n,r){let o=URL.createObjectURL(t);me(o,{specificTime:n,retries:n===void 0?1:3},l=>{URL.revokeObjectURL(o),nt(0,1),tt(e,l),r(l)})}function ct(e,t){for(let n of e)if(t>=n.start&&t<n.start+n.length)return n}function fn(e,t){return!(e.start+e.length<=t.start||t.start+t.length<=e.start)}function lt(e,t){let n=[];for(let r of t)fn(e,r)||n.push(r);for(let r=0;r<n.length;r++)if(e.start<n[r].start)return n.splice(r,0,e),n;return n.push(e),n}function E(e){for(;e.hasChildNodes();)e.removeChild(e.lastChild)}function pn(e){return[...new Uint8Array(e)].map(t=>t.toString(16).padStart(2,"0")).join("")}async function dt(e){let n=null;if(e.size<3*1024)n=await e.arrayBuffer();else{n=new ArrayBuffer(3*1024+8);let r=new BigUint64Array(n);r[0]=BigInt(e.size);let o=Math.floor((e.size-1024)/2),i=e.slice(0,1024).arrayBuffer(),a=e.slice(o,o+1024).arrayBuffer(),l=e.slice(e.size-1024,e.size).arrayBuffer(),s=new Uint8Array(n);s.set(new Uint8Array(await i),8),s.set(new Uint8Array(await a),1032),s.set(new Uint8Array(await l),8+2*1024)}return pn(await crypto.subtle.digest("SHA-256",n))}function ut(e){let t=3735928559,n=1103547991;for(let r=0,o;r<e.length;r++)o=e.charCodeAt(r),t=Math.imul(t^o,2654435761),n=Math.imul(n^o,1597334677);return t=Math.imul(t^t>>>16,2246822507)^Math.imul(n^n>>>13,3266489909),n=Math.imul(n^n>>>16,2246822507)^Math.imul(t^t>>>13,3266489909),(n>>>0).toString(16).padStart(8,"0")+(t>>>0).toString(16).padStart(8,"0")}function mt(e){if(e<1024)return`${e.toFixed()} B`;let t=["kB","MB","GB","TB","PB"],n=-1;do e/=1024,++n;while(Math.round(Math.abs(e)*100)/100>=1024&&n<t.length-1);return`${e.toFixed(2)} ${t[n]}`}function he(e,t,n){let r=n*(1-t/2);if(r==0||r==1)return[e,0,r];let o=(n-r)/Math.min(r,1-r);return[e,o,r]}function ve(e,t,n){return`hsl(${e} ${t*100}% ${n*100}%`}var ft={};function Te(e){let t=ft[e];if(t)return t;let n=ut(e),r=(K,Ne,on)=>Ne+K*(on-Ne),o=r(parseInt(n.substr(7,3),16)/4096*360,0,360),i=r(parseInt(n.substr(2,2),16)/255,.4,.8),a=r(parseInt(n.substr(4,2),16)/255,.2,.4),l=Math.min(i*.8,1),s=Math.min(a*3,1),c=Math.min(i*.8,1),w=Math.min(a*4,1),v={bkg:ve(...he(o,i,a)),border:ve(...he(o,l,s)),text:ve(...he(o,c,w))};return ft[e]=v,v}var S={};function pt(){S={}}function yn(e){S[e]=S[e]+1||1}function En(e){--S[e]==0&&delete S[e]}function Se(e){let t=[];for(let n of Object.keys(S))n.startsWith(e)&&n!=e&&t.push(n);return t.sort((n,r)=>S[r]-S[n]),t}function hn(e){let t=e?.parentElement?.parentElement;if(!t)throw"tagContainer without parent";return t.id}function yt(e){let t=hn(e);t&&x(t,n=>(n.tags=Et(e),n))}function Q(e){return e.childNodes[0].textContent||""}function Et(e){let t=[],n=e.children;for(let r=1;r<n.length;++r)t.push(Q(n[r]));return t}function vn(e,t){return e.length!=t.length?!1:e.every((n,r)=>n===t[r])}function be(e,t){let n=Et(e);if(!vn(n,t)){for(let r of n)St(e,r);for(let r of t)vt(e,r)}}function Me(e,t){let n=document.createElement("span");n.className="tag",n.textContent=e;let r=Te(e);if(n.style.background=r.bkg,n.style.borderColor=r.border,n.style.color=r.text,n.addEventListener("click",o=>{o.stopPropagation()}),!t||!t.displayOnly){let o=document.createElement("span");o.className="tag-delete",o.textContent="x",o.addEventListener("click",bn),n.appendChild(o)}return n}function ht(e){return e.trim().toLowerCase()}function Tn(e,t){t=ht(t);let n=e.children;for(let r=1;r<n.length;++r)if(t===Q(n[r]))return!0;return!1}function vt(e,t){yn(t),e.appendChild(Me(t))}function gt(e,t){let n=ht(t||"");n!==""&&(Tn(e,n)||(vt(e,n),yt(e)))}function Sn(e){let t=e.currentTarget;if(!t.classList.contains("tag-add"))return;let n=t.parentElement;if(!n)throw"event on unparented tagContainer";switch(e.key){case"Escape":t.textContent="+",t.blur();break;case"Tab":t.textContent==""||t.textContent=="+"?(t.textContent="+",t.blur()):(gt(n,t.textContent),t.textContent="",setTimeout(()=>{t.focus()},0)),e.preventDefault();break;case"Enter":gt(n,t.textContent),t.textContent="+",t.blur();break}e.stopPropagation()}function Tt(){let e=document.createElement("span");e.className="tag-add",e.textContent="+",e.contentEditable="true",e.setAttribute("spellcheck","false"),e.setAttribute("tabindex","-1"),e.addEventListener("click",n=>{e.textContent="",n.stopPropagation()}),e.addEventListener("focusout",n=>{e.textContent="+"}),e.addEventListener("keydown",Sn);let t=document.createElement("div");return t.className="tag-container",t.appendChild(e),t}function St(e,t){En(t);for(let n of e.children)if(t===Q(n)){e.removeChild(n);break}}function bn(e){if(!e.currentTarget)return;e.stopPropagation();let n=e.currentTarget.parentElement;if(!n)return;let r=Q(n),o=n.parentElement;if(!o)throw"unparented tagDelete";St(o,r),yt(o)}function L(){return document.getElementById("search-entry")}function Mt(e){let t=document.getElementsByClassName("entry");if(e){let n=Dn(e);for(let r of t){let o=r;Cn(o,n)?o.style.display="":o.style.display="none"}}else for(let n of t){let r=n;r.getAttribute(I)||(r.style.display="")}}function Mn(e){return F(e.id).duration}function wn(e){return F(e.id).height}function In(e){return y(e.id).tags.length}function Hn(e){return Number.parseInt(e.getAttribute(H)||"0")/(1024*1024)}function Ln(e){return Number.parseInt(e.getAttribute(H)||"0")/(1024*1024*1024)}function Cn(e,t){if(e.getAttribute(I))return!1;for(let r of t.scalarMatchers)if(!r(e))return!1;if((e.getAttribute(T)||"").toLowerCase().indexOf(t.freetext)===-1)return!1;if(t.includeTags.length||t.excludeTags.length){let r=y(e.id);for(let o of t.includeTags)if(r.tags.indexOf(o)===-1)return!1;for(let o of t.excludeTags)if(r.tags.indexOf(o)!==-1)return!1}return!0}function xn(e){let t=e.match(/^(>=|>|=|<|<=)([0-9]+)([ptmg]?)$/);if(!t)return;let n=Mn;t[3]=="p"?n=wn:t[3]=="t"?n=In:t[3]=="m"?n=Hn:t[3]=="g"&&(n=Ln);let r=Number.parseInt(t[2]);switch(t[1]){case">=":return o=>n(o)>=r;case">":return o=>n(o)>r;case"=":return o=>n(o)==r;case"<":return o=>n(o)<r;case"<=":return o=>n(o)<=r}}function Fn(e,t){let n=xn(e);return n?(t.scalarMatchers.push(n),!0):!1}function Dn(e){let t={freetext:"",includeTags:[],excludeTags:[],scalarMatchers:[]},n=e.slice(-1);(n=="+"||n=="-")&&(e=e.slice(0,-1));let r=[];for(let o of e.trim().toLowerCase().split(" "))o[0]=="+"&&o.length>=2?t.includeTags.push(o.substring(1)):o[0]=="-"&&o.length>=2?t.excludeTags.push(o.substring(1)):Fn(o,t)||r.push(o);return t.freetext=r.join(" "),t}function wt(e,t){let n=t;if(n==e.length||e[n]==" "){for(;n--&&e[n]!=" ";)if((e[n]=="+"||e[n]=="-")&&(n==0||e[n-1]==" "))return e.substring(n+1,t)}}function Z(){let e=L();Mt(e.value.trim().toLowerCase()),xt()}function It(){let e=L(),t=document.getElementById("completion");if(E(t),e.selectionStart!=e.selectionEnd){D();return}let n=!1,r=wt(e.value,e.selectionStart||0);if(r!==void 0){let o=Se(r);if(o.length>0){n=!0;for(let i of o)t.appendChild(Me(i,{displayOnly:!0}));Pn()}}n||D()}function Ht(e){if(e.key==="Tab"){let t=L();if(t.selectionStart==t.selectionEnd){let n=t.selectionStart||0,r=wt(t.value,n);if(r!==void 0){let o=Se(r);if(o.length===1){let i=o[0].substring(r.length)+" ";t.setRangeText(i);let a=n+i.length;t.setSelectionRange(a,a),Z(),e.preventDefault(),D()}}}}else setTimeout(It,0)}function Lt(e){It()}function Ct(e){let t=L();xt(),Mt(t.value.trim().toLowerCase())}function xt(){let e=L(),t=document.getElementById("clear-search");t.style.visibility=e.value.length===0?"hidden":"visible"}function Ft(){Bn("")}function kn(e,t){let n=e.id+"--mirror",r=document.getElementById(n);if(!r){r=document.createElement("div"),r.id=n;let i=getComputedStyle(e),a=r.style;a.position="absolute",a.visibility="hidden",a.overflow="hidden",a.width=i.width,a.height=i.height,a.paddingTop=i.paddingTop,a.paddingRight=i.paddingRight,a.paddingBottom=i.paddingBottom,a.paddingLeft=i.paddingLeft,a.fontFamily=i.fontFamily,a.fontStyle=i.fontStyle,a.fontVariant=i.fontVariant,a.fontWeight=i.fontWeight,a.fontSize=i.fontSize,a.textAlign=i.textAlign,document.body.appendChild(r)}r.textContent=e.value.substring(0,t).replace(/\s/g,"\xA0");let o=document.createElement("span");return o.textContent=".",r.appendChild(o),o.offsetLeft}function Pn(){let e=L(),t=document.getElementById("completion"),n=kn(e,e.selectionStart||0),r=-e.scrollLeft+n+10,o=e.offsetWidth-r-10;t.style.left=`${e.offsetLeft+r}px`,t.style.top=`${e.offsetTop+4}px`,t.style.width=`${o}px`,t.style.display="block"}function D(){let e=document.getElementById("completion");e.style.display="none",E(e)}function Bn(e){let t=L();t.value=e,t.dispatchEvent(new Event("change"))}var J=class{maxConcurrency;current=0;q=[];constructor(t){this.maxConcurrency=t}run(t){this.q.push(t),this.tryRun()}tryRun(){if(this.current<this.maxConcurrency){let t=this.q.shift();t!==void 0&&(this.current++,t().then(()=>{this.current--,this.tryRun()}))}}};var Y=0;function b(e,t=7e3){Dt(e,"info",t)}function M(e,t=7e3){Dt(e,"error",t)}function Dt(e,t,n){let r=document.getElementById("toast");r.setAttribute("data-kind",t),r.style.pointerEvents="auto",r.style.opacity="1";let o=document.getElementById("toast-msg");o.textContent=e,Y!==0&&(clearTimeout(Y),Y=0),Y=setTimeout(X,n)}function X(){let e=document.getElementById("toast");e.style.pointerEvents="none",e.style.opacity="0"}var Nt=["avi","m4v","mkv","mov","mp4","mpeg","mpeg4","ogg","ogv","webm","wmv"];function _n(e){let t=e.substr(e.lastIndexOf(".")+1).toLowerCase();return Nt.indexOf(t)>=0}var kt=["shuffle","by_name","by_file_size","by_duration"],Rt="settings",d={sortMode:"by_name",loopSingle:!1,hideDupes:!1,previewOnHover:!1},m=null;function Nn(e){let t=0;return typeof e=="string"&&(t=Math.max(0,kt.indexOf(e))),kt[t]}function Rn(e){let n=p().transaction("misc").objectStore("misc").get(Rt);n.onsuccess=r=>{let o=n.result;o&&(d.sortMode=Nn(o.sortMode),d.loopSingle=!!o.loopSingle,d.hideDupes=!!o.hideDupes,d.previewOnHover=!!o.previewOnHover),e()},n.onerror=()=>{M("Error loading preferences"),e()}}function Fe(){let t=p().transaction("misc","readwrite").objectStore("misc"),n={loopSingle:d.loopSingle,sortMode:d.sortMode,hideDupes:d.hideDupes,previewOnHover:d.previewOnHover};t.put(n,Rt).onsuccess=()=>{console.log("settings saved",n)}}function u(){return document.getElementById("video-player")}function ae(){return document.getElementById("video-container")}function De(){return document.getElementById("entries")}function ke(){return document.getElementById("gallery-container")}function Vt(e){return e?.getAttribute(T)||""}function Pe(e){return e.querySelector(".entry-image")}function Gt(e){jt(),Le=null,m=e,u().pause(),se(e,t=>{Vn(URL.createObjectURL(t)),Oe(e)})}function z(){return m?document.getElementById(m):null}function se(e,t){let n=P[e];if(n){t(n);return}}function Vn(e){let t=u();t.src&&(URL.revokeObjectURL(t.src),t.src=""),t.autoplay=!0,t.src=e}function Gn(e){let t=e.lastIndexOf(".");if(t==-1)return e;let n=e.substr(t+1).toLowerCase();return Nt.indexOf(n)==-1?e:e.substr(0,t)}function $t(e){return e.getElementsByTagName("img")[0]}var h=null,C=0,Ie=3;function $n(e){if(e<30)return 4;if(e>3600)return 15;let i=(e-30)/3570;return Math.floor(Math.sqrt(i)*11+4)}function jn(e,t){let n=$n(e);if(n*(t+3)>e)return[];let o=e/n,i=[],a=o;for(let l=1;l<n;++l)i.push(a),a+=o;return i}function jt(){if(h){$t(h).style.display="";for(let e of h.getElementsByTagName("video")){let t=e.src;e.pause(),e.src="",e.remove(),URL.revokeObjectURL(t)}C&&(clearTimeout(C),C=0),h=null}}var oe=[],te=0;function zt(){if(C=0,h){let e=h.getElementsByTagName("video");if(e.length!=1)return;let t=e[0];t.currentTime=oe[te],C=setTimeout(zt,Ie*1e3),++te==oe.length&&(te=0)}}function zn(e){if(h||C||!e.parentElement)return;h=e;let t=e.parentElement.id,n=$t(e),r=Math.floor(n.offsetHeight);t&&se(t,o=>{let i=URL.createObjectURL(o);if(h!=e){URL.revokeObjectURL(i);return}let a=document.createElement("video");a.style.height=`${r}px`,a.style.display="none",a.muted=!0,a.autoplay=!0,a.loop=!0,e.appendChild(a),a.src=i,a.addEventListener("loadedmetadata",()=>{n.style.display="none",a.style.display="",te=0,oe=jn(a.duration,Ie),oe.length>0&&(C=setTimeout(zt,Ie*1e3))},!1)})}var He=null,ne=0;function Kn(e){d.previewOnHover&&(He=e.target,ne=setTimeout(()=>{He==e.target&&zn(e.target)},500))}function Wn(e){He=null,ne!==0&&(clearTimeout(ne),ne=0),jt()}function qn(e){let t=Gn(e),n=document.createElement("div");n.className="entry",n.addEventListener("click",tr),n.setAttribute(T,t);let r=document.createElement("div");r.className="entry-preview",r.addEventListener("mouseenter",Kn),r.addEventListener("mouseleave",Wn);let o=document.createElement("img");o.className="entry-image",r.appendChild(o),r.appendChild(Tt());let i=document.createElement("div");i.className="duration-badge",r.appendChild(i);let a=document.createElement("div");a.className="quality-badge",r.appendChild(a);let l=document.createElement("div");l.className="file-size-badge",r.appendChild(l),n.appendChild(r);let s=document.createElement("div");return s.className="entry-title",s.textContent=t,n.appendChild(s),n}function Qn(){let e=De(),t=[...e.children];for(let n=t.length-1;n>0;n--){let r=Math.floor(Math.random()*(n+1));[t[n],t[r]]=[t[r],t[n]]}t.forEach(n=>{e.appendChild(n)})}var Zn=(e,t)=>{let n=e.getAttribute(T)||"",r=t.getAttribute(T)||"";return n.localeCompare(r)},Jn=(e,t)=>{let n=Number.parseInt(e.getAttribute(H)||"0")||0,r=Number.parseInt(t.getAttribute(H)||"0")||0;return n-r},Yn=(e,t)=>{let n=F(e.id).duration,r=F(t.id).duration;return n-r};function we(e){let t=De(),n=[...t.children];n.sort(e),n.forEach(r=>{t.appendChild(r)})}var Be={shuffle:{icon:"url(./assets/shuffle-icon.svg)",tooltip:"Shuffle",radio:"arrange-shuffle",func:()=>{Qn()}},by_name:{icon:"url(./assets/sort-icon.svg)",tooltip:"Sort by name",radio:"arrange-sort-az",func:()=>{we(Zn)}},by_file_size:{icon:"url(./assets/sort-by-size.svg)",tooltip:"Sort by size",radio:"arrange-sort-size",func:()=>{we(Jn)}},by_duration:{icon:"url(./assets/sort-by-duration.svg)",tooltip:"Sort by duration",radio:"arrange-sort-duration",func:()=>{we(Yn)}}};function Kt(){Be[d.sortMode].func()}function Wt(){let e=document.getElementById("shuffle-button"),t=Be[d.sortMode];e.style.backgroundImage=t.icon,e.title=t.tooltip}function qt(){let e=document.getElementById("loop-button"),t=u();d.loopSingle?(e.classList.remove("disabled"),e.title="Loop single on",t.setAttribute("loop","")):(e.classList.add("disabled"),e.title="Loop single off",t.removeAttribute("loop"))}function Ae(){return ke().style.display!=="none"}var _=0,Xn=4e3,N=0,er=2e3;function G(e){if(e&&e.info){Pt();let n=document.getElementById("osd-info"),r=document.createElement("span");r.textContent=e.info,n.appendChild(r),N&&(clearTimeout(N),N=0),N=setTimeout(()=>{Pt(),N=0},er)}let t=document.getElementById("osd-container");t.style.opacity="1.0",_&&(clearTimeout(_),_=0),_=setTimeout(()=>{t.style.opacity="0",_=0},Xn)}function Pt(){let e=document.getElementById("osd-info");E(e)}function Qt(){let e=document.getElementById("osd-container");e.style.opacity="0"}function Oe(e){let t=document.getElementById(e);if(t){let n=document.getElementById("osd-title");E(n);let r=document.createElement("span");r.textContent=Vt(t),n.appendChild(r);let o=document.getElementById("osd-tags");E(o);let i=y(e);if(i){for(let l of i.tags){let s=Te(l),c=document.createElement("span");c.textContent=l,c.className="tag",c.style.background=s.bkg,c.style.borderColor=s.border,c.style.color=s.text,o.appendChild(c)}let a=document.getElementById("osd-sections");a.style.display=i.scenes.length>0?"block":"none",E(a);for(let l of i.scenes){let s=document.createElement("div");s.textContent=l.name,s.className="osd-section",s.style.left=`${l.start*100}%`,s.style.width=`${l.length*100}%`,a.appendChild(s)}}}}async function tr(e){if(!e.currentTarget)return;e.preventDefault(),e.stopPropagation();let t=e.currentTarget;if(t.getAttribute(I))return;let n=u();if(t==z())try{await n.play()}catch(r){console.log("Error playing video",r),Jt()}else ae().style.background="",Gt(t.id)}function nr(){if(u().src){rr();let t=z();if(t&&"mediaSession"in navigator){let n=Pe(t),r={title:Vt(t),artist:"VideoQueen",artwork:[{src:n.src,sizes:`${n.naturalWidth}x${n.naturalHeight}`,type:"image/webp"}]};navigator.mediaSession.metadata=new MediaMetadata(r)}}}function Zt(){let e=u();e.paused||e.pause(),ke().style.display="block",ae().style.display="none",document.getElementById("progress-container").style.display="",Qt(),at()}function rr(){Ae()&&(ke().style.display="none",ae().style.display="block",document.getElementById("progress-container").style.display="none",X()),it()}function Jt(){let e=u();M(`Error playing video: ${e.error?e.error.message:""}`)}function Bt(e,t){return String(e).padStart(t,"0")}function $(e){e=Math.floor(e);let t=Math.floor(e/3600),n=Math.floor(e%3600/60),r=e%60,o=Bt(r,2);if(t){let i=Bt(n,2);return`${t}:${i}:${o}`}return`${n}:${o}`}var ie,ee=0;function or(){let e=u();if(e.duration){if(ie){G({info:`Scene: ${ie}`});return}let t=$(e.currentTime),n=Math.round(e.currentTime/e.duration*100);G({info:`Time: ${t} (${n}%)`})}}function ir(){let e=u();G({info:`Volume: ${Math.round(e.volume*100)}%`})}function ar(){let e=u();G({info:`Speed: ${Math.round(e.playbackRate*100)}%`})}function sr(){Ce()}function cr(){let e=u();if(e.src&&e.paused&&m){let t=e.currentTime,n=m;Zt();let r=document.getElementById(n);if(!r)return;se(n,function(o){ge(n,o,t,i=>{if(i.image){let l=Pe(r).src;xe(r,i),URL.revokeObjectURL(l),pe(n,i),x(n,s=>(s.thumbnailTime=t,s))}})})}}async function At(){if(document.fullscreenElement)document.exitFullscreen();else try{await ae().requestFullscreen()}catch(e){console.log("fullscreen failed: ",e)}}function Ot(e,t){t.paused&&!t.error?t.play():t.pause()}var Le=null,R=0;function Ue(e,t,n){if(n==1&&f){let r=e.duration*f.start,o=e.duration*(f.start+f.length);console.log(`Searching to ${t}, start=${r}, end=${o}`),(t<r||t>=o)&&(b("Exiting loop",1e3),f=void 0)}e.currentTime=t}function g(e,t){let n=parseInt(e.key);Le===n?(R+=.01,R>=1&&(R=0)):R=n/10,Le=n,Ue(t,t.duration*R,1)}function k(e,t={}){return(n,r)=>{if(!t.pauseOnly||r.paused){let o=n.shiftKey&&t.shiftDelta?t.shiftDelta:e,i=r.currentTime;Ue(r,Math.max(Math.min(i+o,r.duration),0),1)}}}var j,f;function lr(e,t){if(!t.paused){M("Pause video before marking start of scene",3e3);return}j=t.currentTime/t.duration,b(`Marked start of scene at ${$(t.currentTime)}`,3e3)}function dr(e,t){if(!t.paused){M("Pause video before marking end of scene",3e3);return}if(j===void 0){M("Mark start of scene before marking end",3e3);return}if(t.currentTime/t.duration-j<=0){M("Scene end must be after the start",3e3);return}document.getElementById("name-scene-dialog").showModal()}function ur(){if(j===void 0||!m)return;let e=u(),t=j,n=e.currentTime/e.duration,r=n-t,i=document.getElementById("save-scene-name").value.trim();i!==""&&(x(m,a=>(a.scenes=lt({start:t,length:r,name:i},a.scenes),a)),b(`Adding scene between ${$(t*e.duration)} and ${$(n*e.duration)}`,3e3),Oe(m))}function mr(e){if(!f)return;let t=u();t.currentTime/t.duration>f.start+f.length&&Ue(t,f.start*t.duration,2)}function fr(e){if(!m)return;let t=e.currentTime/e.duration,n=y(m);return ct(n.scenes,t)}function gr(e,t){f=fr(t),f&&(console.log("Will try to loop"),t.currentTime=f.start*t.duration)}function pr(e,t){if(!m)return;let n=y(m);if(n.scenes.length===0)return;let r=i=>{ie=i.name,ee&&clearTimeout(ee),ee=setTimeout(()=>{ie="",ee=0},500),t.currentTime=i.start*t.duration,t.paused&&!t.error&&t.play()},o=t.currentTime/t.duration;for(let i of n.scenes)if(i.start>o){r(i);return}r(n.scenes[0])}var yr={Enter:At,f:At,t:cr,p:Ut,n:Ce,PageUp:Ut,PageDown:Ce,A:wr,a:Mr,"[":lr,"]":dr,L:gr,s:pr,0:g,1:g,2:g,3:g,4:g,5:g,6:g,7:g,8:g,9:g,j:k(-10),l:k(10),",":k(-1/30,{pauseOnly:!0}),".":k(1/30,{pauseOnly:!0}),ArrowLeft:k(-5,{shiftDelta:-30}),ArrowRight:k(5,{shiftDelta:30})," ":Ot,k:Ot,Escape:(e,t)=>{t.paused||t.pause(),Zt()},"=":(e,t)=>{t.playbackRate=1},ArrowUp:(e,t)=>{t.volume=Math.min(t.volume+.1,1)},ArrowDown:(e,t)=>{t.volume=Math.max(t.volume-.1,0)},i:()=>{z()&&G()},d:()=>{m&&x(m,e=>{let t="delete",r=e.tags.indexOf(t);return r==-1?(b(`Added '${t}' tag`,3e3),e.tags.push(t)):(b(`Removed '${t}' tag`,3e3),e.tags.splice(r,1)),e})}};function Er(e){if(document.activeElement&&document.activeElement.tagName==="INPUT")return;if(Ae()){if(e.code==="Escape"){let n=u();n.paused&&n.src&&!n.error&&n.play(),e.preventDefault(),e.stopPropagation()}e.key==="k"&&e.ctrlKey&&(document.getElementById("search-entry").focus(),e.preventDefault(),e.stopPropagation()),e.key==="r"&&(V("shuffle"),e.preventDefault(),e.stopPropagation());return}let t=yr[e.key];t&&(t(e,u()),e.preventDefault(),e.stopPropagation())}function hr(){d.loopSingle=!d.loopSingle,qt(),Fe()}function V(e){d.sortMode=e,Wt(),Kt(),Fe()}function vr(){let e=document.getElementById("sort-dropdown-content");console.log("got dropdown",e),e.classList.toggle("show-dropdown");let t=Be[d.sortMode],n=document.getElementById(t.radio);n.checked=!0}function Tr(e){if(!Ae()){let t=u();t.volume=Math.max(Math.min(t.volume+e.deltaY/560,1),0)}}function Sr(){let e=[],t=document.getElementsByClassName("entry");for(let n of t){let r=n;r.style.display!=="none"&&e.push(r)}return e}function Yt(){return e=>!0}function br(e){return t=>Xt(t)==e}function _e(e,t){let n=Sr(),r=z();if(!r)return;let o=n.indexOf(r);if(!(o<0))for(let i=0;i!=n.length-1;++i){o=e?o<n.length-1?o+1:0:o>0?o-1:n.length-1;let a=n[o];if(!(a.getAttribute(I)||a.getAttribute(W))&&t(a)){Qt(),Gt(a.id);break}}}function Ce(){_e(!0,Yt())}function Ut(){_e(!1,Yt())}function Xt(e){let t=e.getAttribute(T)||"";if(t=="")return"";let n=t.indexOf("-");return n==-1?"":t.substr(0,n).trim().toLowerCase()}function en(e){let t=z();if(!t)return;let n=Xt(t);n!=""&&_e(e,br(n))}function Mr(){en(!0)}function wr(){en(!1)}function xe(e,t){let n=Pe(e),r=Object.keys(P).length;if(re<r&&(re++,re==r&&Hr()),t.unsupported)e.setAttribute(I,"true"),e.style.display="none";else{let o=e.querySelector(".duration-badge");o.textContent=$(t.duration);let i=e.querySelector(".quality-badge");i.textContent=`${t.width}x${t.height}`,n.src=URL.createObjectURL(t.image)}}function Ir(e,t){rt(e,n=>{if(n){xe(t,n);return}se(e,r=>{ot(e,r,o=>{o.image||(o={unsupported:!0}),xe(t,o),pe(e,o)})})})}var P={},re=0;async function tn(e){document.getElementById("initial-view").style.display="none",pt(),P={},re=0;for(let r of document.getElementsByClassName("entry-image")){let o=r;URL.revokeObjectURL(o.src)}let t=De();E(t);let n=new J(64);for(let r of e){if(!_n(r.name))continue;let o=qn(r.name);t.appendChild(o),n.run(()=>dt(r).then(i=>{if(document.getElementById(i)){let l=o.querySelector(".entry-preview");if(l){l.setAttribute(W,"true"),o.setAttribute(W,"true");let c=document.createElement("div");c.className="dupe-badge",c.textContent=`Dupe of ${P[i].name}`,l.append(c)}let s=o.querySelector(".tag-container");s&&s.remove()}else{o.setAttribute("id",i),o.setAttribute(H,`${r.size}`);let l=o.querySelector(".file-size-badge");l.textContent=mt(r.size);let s=o.querySelector(".tag-container"),c=y(i);be(s,c.tags),P[i]=r}Ir(i,o)}))}}function Hr(){Kt(),Z()}function nn(){let e=Object.values(P);e.length>0&&tn(e)}async function Lr(e){e.preventDefault();let t=await Ye();document.getElementById("settings-dialog").close(),t&&b("Metadata exported")}async function Cr(e){e.preventDefault();let t=await Xe();document.getElementById("settings-dialog").close(),nn(),t&&b("Metadata imported")}function xr(){D()}function Fr(e){if(!(e.target instanceof Element&&e.target.matches("#shuffle-button")))for(let t of document.getElementsByClassName("sort-dropdown-content"))t.classList.remove("show-dropdown")}function Dr(e){let t=e.target,n=document.getElementById("top-gradient-mask"),r=document.getElementById("bottom-gradient-mask");t.scrollTop==0?n.style.opacity="0":n.style.opacity="1",t.scrollTop>=t.scrollHeight-t.offsetHeight-2?r.style.opacity="0":r.style.opacity="1"}async function _t(e){let t={id:"boop",mode:"read",startIn:"videos"};try{let n=await globalThis.showDirectoryPicker(t),r=[],o=async a=>{for await(let[l,s]of a.entries())s.kind==="file"?r.push(s.getFile()):s.kind==="directory"&&await o(s)};await o(n);let i=await Promise.all(r);tn(i)}catch(n){console.log("errol: ",n)}}function rn(){if(d.hideDupes){let e=new CSSStyleSheet;e.replaceSync('.entry[data-dupe="true"] { display: none; }'),document.adoptedStyleSheets=[e]}else document.adoptedStyleSheets=[]}function kr(){let e=document.getElementById("settings-hide-dupes");e.checked=d.hideDupes;let t=document.getElementById("settings-preview-video");t.checked=d.previewOnHover,document.getElementById("settings-dialog").showModal()}function Pr(){let e=document.getElementById("settings-hide-dupes");e.checked!==d.hideDupes&&(d.hideDupes=e.checked,rn());let t=document.getElementById("settings-preview-video");d.previewOnHover=t.checked,Fe()}function Br(e){let t=document.getElementById(e.contentHash);if(!t)return;let n=t.querySelector(".tag-container");n&&be(n,e.tags),e.contentHash==m&&Oe(e.contentHash)}async function Ar(){if("serviceWorker"in navigator)try{let e=await navigator.serviceWorker.register("service-worker.js",{scope:"./"});e.installing?console.log("Service worker installing"):e.waiting?console.log("Service worker installed"):e.active&&console.log("Service worker active")}catch(e){console.error(`Registration failed with ${e}`)}}globalThis.addEventListener("load",function(){globalThis.addEventListener("keydown",Er,{capture:!0});let e=document.getElementById("search-entry");e.addEventListener("input",Z),e.addEventListener("blur",D),e.addEventListener("change",Ct),e.addEventListener("keydown",Ht),e.addEventListener("focus",Lt);let t=u();t.addEventListener("play",nr,!1),t.addEventListener("error",Jt,!1),t.addEventListener("seeking",or,!1),t.addEventListener("volumechange",ir,!1),t.addEventListener("ratechange",ar,!1),t.addEventListener("ended",sr,!1),t.addEventListener("timeupdate",mr,!1),document.addEventListener("dragover",function(n){n.dataTransfer&&(n.dataTransfer.dropEffect="none"),n.preventDefault()},!1),document.addEventListener("drop",function(n){n.preventDefault()},!1),document.addEventListener("wheel",Tr,!1),document.getElementById("gallery-view").addEventListener("scroll",Dr),document.getElementById("loop-button").addEventListener("click",hr),document.getElementById("shuffle-button").addEventListener("click",vr),document.getElementById("clear-search").addEventListener("click",Ft),document.getElementById("settings").addEventListener("click",kr),document.getElementById("settings-confirm").addEventListener("click",Pr),document.getElementById("settings-export-tags").addEventListener("click",Lr),document.getElementById("settings-import-tags").addEventListener("click",Cr),document.getElementById("open-folder").addEventListener("click",_t),document.getElementById("initial-open-folder").addEventListener("click",_t),document.getElementById("save-query-confirm").addEventListener("click",ur),document.getElementById("arrange-shuffle").addEventListener("click",()=>V("shuffle")),document.getElementById("arrange-sort-az").addEventListener("click",()=>V("by_name")),document.getElementById("arrange-sort-size").addEventListener("click",()=>V("by_file_size")),document.getElementById("arrange-sort-duration").addEventListener("click",()=>V("by_duration")),document.getElementById("toast-close").addEventListener("click",X),globalThis.addEventListener("resize",xr),globalThis.addEventListener("click",Fr),Ar(),qe(Br),Ge(Qe),Ke(n=>{n?Je().then(()=>{Rn(()=>{Wt(),qt(),rn(),nn()})}):M("Error opening IndexedDB")})});})();
