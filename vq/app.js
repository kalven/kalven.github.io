(()=>{var Ge=new BroadcastChannel("metadataChannel");function $e(e){Ge.postMessage(e)}function ze(e){Ge.addEventListener("message",e)}var v="data-name",I="data-bad-media",q="data-dupe",H="data-file-size",Ke="vqStorage";var B=null,We=[];function qe(e){console.log("storage init");let t=indexedDB.open(Ke,4);t.onupgradeneeded=async n=>{console.log(`onupgradeneeded old=${n.oldVersion} new=${n.newVersion}`);let r=t.result;switch(n.oldVersion){case 0:console.log("Creating new DB"),r.createObjectStore("tags",{});case 1:console.log("Upgrading to version 2"),r.createObjectStore("previews",{});case 2:console.log("Upgrading to version 3"),r.createObjectStore("misc",{});case 3:console.log("Upgrading to version 4"),r.createObjectStore("metadata",{}),We.push(sn)}},t.onerror=n=>{B=null,e(!1)},t.onsuccess=async n=>{B=t.result;for(let r of We)console.log("Running upgrade function"),await r(B);e(!0)}}function y(){if(!B)throw"DB not initialized";return B}async function sn(e){return new Promise((t,n)=>{let r=e.transaction(["tags","metadata"],"readwrite"),o=r.objectStore("tags").openCursor(),i=r.objectStore("metadata"),a=[];o.onsuccess=async s=>{let c=o.result;if(c){let l={contentHash:c.key,tags:c.value.tags};a.push(new Promise((w,h)=>{let W=i.put({metadata:l},c.key);W.onsuccess=()=>w(),W.onerror=h})),c.continue()}else await Promise.all(a),t()},o.onerror=s=>{n(new Error("Could not open tags cursor"))}})}var me=new Map,Qe=1;function Ze(e){me.set(Qe,e),Qe++}var A=new Map;function g(e){let t=A.get(e)||{contentHash:e,tags:[],scenes:[]};return t.scenes=t.scenes||[],t.tags=t.tags||[],t}function Je(e){let t=e.data.md;A.set(t.contentHash,t),me.forEach(n=>{n(t)})}function cn(e,t){Ye(e,t),me.forEach(n=>{n(t)}),$e({md:t})}function Ye(e,t){A.set(e,t),y().transaction("metadata","readwrite").objectStore("metadata").put({metadata:t},e)}function Xe(){return new Promise((e,t)=>{let r=y().transaction("metadata","readonly").objectStore("metadata").getAll();r.onerror=o=>{t(new Error("Failed to initialize metadata"))},r.onsuccess=o=>{for(let i of r.result)A.set(i.metadata.contentHash,i.metadata);e()}})}function C(e,t){let n=structuredClone(g(e)),r=t(n);r!==void 0&&cn(e,r)}async function et(){try{let e={types:[{description:"Exported tags",accept:{"application/json":[".json"]}}],suggestedName:"exported-metadata.json"},n=await(await globalThis.showSaveFilePicker(e)).createWritable(),r=[];A.forEach((i,a)=>{r.push(i)});let o=new Blob([JSON.stringify({metadata:r})],{type:"application/json"});await n.write(o),await n.close()}catch(e){return console.log("export error:",e),!1}return!0}async function tt(){try{let e={types:[{description:"Metadata",accept:{"application/json":[".json"]}}],multiple:!1},[t]=await globalThis.showOpenFilePicker(e),r=await(await t.getFile()).arrayBuffer(),o=new Uint8Array(r),a=new TextDecoder("utf-8").decode(o),c=JSON.parse(a).metadata;for(let l of c)console.log(`updating metadata for ${l.contentHash}`),Ye(l.contentHash,l);return!0}catch(e){return console.log("import error:",e),!1}}var ln=624,dn=1e4;function ge(e,t,n){let r={};function o(){l.style.width=`${ln}px`,r.width=l.videoWidth,r.height=l.videoHeight,r.duration=l.duration}function i(h){if(w!==0&&(clearTimeout(w),w=0),l.removeEventListener("error",c,!1),l.removeEventListener("canplay",s,!1),l.removeEventListener("loadedmetadata",o,!1),l.src="",h&&(r.image=h,h.size<1200&&t.retries>0)){--t.retries,typeof t.specificTime=="number"&&(t.specificTime+=1/30),ge(e,t,n);return}n(r)}function a(){l.removeEventListener("seeked",a,!1),un(l,i)}function s(){l.removeEventListener("canplay",s,!1),l.pause(),t.specificTime||(t.specificTime=l.duration/2),l.addEventListener("seeked",a),l.currentTime=t.specificTime}function c(){i(null)}let l=document.getElementById("generator");l.addEventListener("canplay",s,!1),l.addEventListener("loadedmetadata",o,!1),l.addEventListener("error",c,!1),l.src=e;let w=setTimeout(c,dn);l.pause()}function un(e,t){let n=document.getElementById("canvas"),r=e.offsetWidth,o=e.offsetHeight;n.width=r,n.height=o;let i=e.offsetWidth,a=e.offsetHeight,s=n.getContext("2d",{willReadFrequently:!0});if(!s){t(null);return}s.imageSmoothingEnabled=!0,s.imageSmoothingQuality="high",s.drawImage(e,0,0,i,a),n.toBlob(t,"image/webp",.5)}var nt=new Map;function F(e){return nt.get(e)||{duration:0,width:0,height:0}}function rt(e,t){let n={duration:t&&t.duration||0,width:t&&t.width||0,height:t&&t.height||0};nt.set(e,n)}var Q=0,O=0;function ot(e,t){let n=document.getElementById("progress-container"),r=document.getElementById("progress");O==0&&(n.style.opacity="1"),Q+=t,O+=e,r.value=Q,r.max=O,Q>=O&&(n.style.opacity="0",O=0,Q=0)}function it(e,t){let r=y().transaction("previews").objectStore("previews").get(e);r.onsuccess=o=>{rt(e,r.result),t(r.result)}}var U=[],pe=!1;function at(e,t,n){ye(e,t,void 0,n)}function ye(e,t,n,r){ot(1,0),U.push({contentHash:e,file:t,specificTime:n,callback:r,processing:!1}),U.length==1&&he()}function Ee(e,t){y().transaction("previews","readwrite").objectStore("previews").put(t,e)}function st(){pe=!0}function ct(){pe=!1;let e=U[0];e&&!e.processing&&he()}function he(){if(pe)return;let e=U[0];e&&(e.processing=!0,fn(e.contentHash,e.file,e.specificTime,t=>{U.shift(),e.callback(t),he()}))}function fn(e,t,n,r){let o=URL.createObjectURL(t);ge(o,{specificTime:n,retries:n===void 0?1:3},s=>{URL.revokeObjectURL(o),ot(0,1),rt(e,s),r(s)})}function dt(e,t){for(let n of e)if(t>=n.start&&t<n.start+n.length)return n}function gn(e,t){return!(e.start+e.length<=t.start||t.start+t.length<=e.start)}function ut(e,t){let n=[];for(let r of t)gn(e,r)||n.push(r);for(let r=0;r<n.length;r++)if(e.start<n[r].start)return n.splice(r,0,e),n;return n.push(e),n}function T(e){for(;e.hasChildNodes();)e.removeChild(e.lastChild)}function _(e,t){T(e);let n=document.createElement("span");n.textContent=t,e.appendChild(n)}function yn(e){return[...new Uint8Array(e)].map(t=>t.toString(16).padStart(2,"0")).join("")}async function mt(e){let n=null;if(e.size<3*1024)n=await e.arrayBuffer();else{n=new ArrayBuffer(3*1024+8);let r=new BigUint64Array(n);r[0]=BigInt(e.size);let o=Math.floor((e.size-1024)/2),i=e.slice(0,1024).arrayBuffer(),a=e.slice(o,o+1024).arrayBuffer(),s=e.slice(e.size-1024,e.size).arrayBuffer(),c=new Uint8Array(n);c.set(new Uint8Array(await i),8),c.set(new Uint8Array(await a),1032),c.set(new Uint8Array(await s),8+2*1024)}return yn(await crypto.subtle.digest("SHA-256",n))}function ft(e){let t=3735928559,n=1103547991;for(let r=0,o;r<e.length;r++)o=e.charCodeAt(r),t=Math.imul(t^o,2654435761),n=Math.imul(n^o,1597334677);return t=Math.imul(t^t>>>16,2246822507)^Math.imul(n^n>>>13,3266489909),n=Math.imul(n^n>>>16,2246822507)^Math.imul(t^t>>>13,3266489909),(n>>>0).toString(16).padStart(8,"0")+(t>>>0).toString(16).padStart(8,"0")}function gt(e){if(e<1024)return`${e.toFixed()} B`;let t=["kB","MB","GB","TB","PB"],n=-1;do e/=1024,++n;while(Math.round(Math.abs(e)*100)/100>=1024&&n<t.length-1);return`${e.toFixed(2)} ${t[n]}`}function Te(e,t,n){let r=n*(1-t/2);if(r==0||r==1)return[e,0,r];let o=(n-r)/Math.min(r,1-r);return[e,o,r]}function Se(e,t,n){return`hsl(${e} ${t*100}% ${n*100}%`}var pt={};function be(e){let t=pt[e];if(t)return t;let n=ft(e),r=(W,Ve,an)=>Ve+W*(an-Ve),o=r(parseInt(n.substr(7,3),16)/4096*360,0,360),i=r(parseInt(n.substr(2,2),16)/255,.4,.8),a=r(parseInt(n.substr(4,2),16)/255,.2,.4),s=Math.min(i*.8,1),c=Math.min(a*3,1),l=Math.min(i*.8,1),w=Math.min(a*4,1),h={bkg:Se(...Te(o,i,a)),border:Se(...Te(o,s,c)),text:Se(...Te(o,l,w))};return pt[e]=h,h}var S={};function Et(){S={}}function En(e){S[e]=S[e]+1||1}function hn(e){--S[e]==0&&delete S[e]}function Me(e){let t=[];for(let n of Object.keys(S))n.startsWith(e)&&n!=e&&t.push(n);return t.sort((n,r)=>S[r]-S[n]),t}function vn(e){let t=e?.parentElement?.parentElement;if(!t)throw"tagContainer without parent";return t.id}function ht(e){let t=vn(e);t&&C(t,n=>(n.tags=vt(e),n))}function Z(e){return e.childNodes[0].textContent||""}function vt(e){let t=[],n=e.children;for(let r=1;r<n.length;++r)t.push(Z(n[r]));return t}function Tn(e,t){return e.length!=t.length?!1:e.every((n,r)=>n===t[r])}function we(e,t){let n=vt(e);if(!Tn(n,t)){for(let r of n)Mt(e,r);for(let r of t)St(e,r)}}function Ie(e,t){let n=document.createElement("span");n.className="tag",n.textContent=e;let r=be(e);if(n.style.background=r.bkg,n.style.borderColor=r.border,n.style.color=r.text,n.addEventListener("click",o=>{o.stopPropagation()}),!t||!t.displayOnly){let o=document.createElement("span");o.className="tag-delete",o.textContent="x",o.addEventListener("click",Mn),n.appendChild(o)}return n}function Tt(e){return e.trim().toLowerCase()}function Sn(e,t){t=Tt(t);let n=e.children;for(let r=1;r<n.length;++r)if(t===Z(n[r]))return!0;return!1}function St(e,t){En(t),e.appendChild(Ie(t))}function yt(e,t){let n=Tt(t||"");n!==""&&(Sn(e,n)||(St(e,n),ht(e)))}function bn(e){let t=e.currentTarget;if(!t.classList.contains("tag-add"))return;let n=t.parentElement;if(!n)throw"event on unparented tagContainer";switch(e.key){case"Escape":t.textContent="+",t.blur();break;case"Tab":t.textContent==""||t.textContent=="+"?(t.textContent="+",t.blur()):(yt(n,t.textContent),t.textContent="",setTimeout(()=>{t.focus()},0)),e.preventDefault();break;case"Enter":yt(n,t.textContent),t.textContent="+",t.blur();break}e.stopPropagation()}function bt(){let e=document.createElement("span");e.className="tag-add",e.textContent="+",e.contentEditable="true",e.setAttribute("spellcheck","false"),e.setAttribute("tabindex","-1"),e.addEventListener("click",n=>{e.textContent="",n.stopPropagation()}),e.addEventListener("focusout",n=>{e.textContent="+"}),e.addEventListener("keydown",bn);let t=document.createElement("div");return t.className="tag-container",t.appendChild(e),t}function Mt(e,t){hn(t);for(let n of e.children)if(t===Z(n)){e.removeChild(n);break}}function Mn(e){if(!e.currentTarget)return;e.stopPropagation();let n=e.currentTarget.parentElement;if(!n)return;let r=Z(n),o=n.parentElement;if(!o)throw"unparented tagDelete";Mt(o,r),ht(o)}function L(){return document.getElementById("search-entry")}function It(e){let t=document.getElementsByClassName("entry"),n=0;if(e){let o=Pn(e);for(let i of t){let a=i;Fn(a,o)?(a.style.display="",++n):a.style.display="none"}}else for(let o of t){let i=o;i.getAttribute(I)||(i.style.display="",++n)}let r=document.getElementById("video-count");_(r,`${n}`)}function wn(e){return F(e.id).duration}function In(e){return F(e.id).height}function Hn(e){return g(e.id).tags.length}function Ln(e){return g(e.id).scenes.length}function xn(e){return Number.parseInt(e.getAttribute(H)||"0")/(1024*1024)}function Cn(e){return Number.parseInt(e.getAttribute(H)||"0")/(1024*1024*1024)}function Fn(e,t){if(e.getAttribute(I))return!1;for(let r of t.scalarMatchers)if(!r(e))return!1;if((e.getAttribute(v)||"").toLowerCase().indexOf(t.freetext)===-1)return!1;if(t.includeTags.length||t.excludeTags.length){let r=g(e.id);for(let o of t.includeTags)if(r.tags.indexOf(o)===-1)return!1;for(let o of t.excludeTags)if(r.tags.indexOf(o)!==-1)return!1}return!0}function kn(e){let t=e.match(/^(>=|>|=|<|<=)([0-9]+)([ptsmg]?)$/);if(!t)return;let n=wn;t[3]=="p"?n=In:t[3]=="t"?n=Hn:t[3]=="s"?n=Ln:t[3]=="m"?n=xn:t[3]=="g"&&(n=Cn);let r=Number.parseInt(t[2]);switch(t[1]){case">=":return o=>n(o)>=r;case">":return o=>n(o)>r;case"=":return o=>n(o)==r;case"<":return o=>n(o)<r;case"<=":return o=>n(o)<=r}}function Dn(e,t){let n=kn(e);return n?(t.scalarMatchers.push(n),!0):!1}function Pn(e){let t={freetext:"",includeTags:[],excludeTags:[],scalarMatchers:[]},n=e.slice(-1);(n=="+"||n=="-")&&(e=e.slice(0,-1));let r=[];for(let o of e.trim().toLowerCase().split(" "))o[0]=="+"&&o.length>=2?t.includeTags.push(o.substring(1)):o[0]=="-"&&o.length>=2?t.excludeTags.push(o.substring(1)):Dn(o,t)||r.push(o);return t.freetext=r.join(" "),t}function Ht(e,t){let n=t;if(n==e.length||e[n]==" "){for(;n--&&e[n]!=" ";)if((e[n]=="+"||e[n]=="-")&&(n==0||e[n-1]==" "))return e.substring(n+1,t)}}function J(){let e=L();It(e.value.trim().toLowerCase()),kt()}function Lt(){let e=L(),t=document.getElementById("completion");if(T(t),e.selectionStart!=e.selectionEnd){k();return}let n=!1,r=Ht(e.value,e.selectionStart||0);if(r!==void 0){let o=Me(r);if(o.length>0){n=!0;for(let i of o)t.appendChild(Ie(i,{displayOnly:!0}));An()}}n||k()}function xt(e){if(e.key==="Tab"){let t=L();if(t.selectionStart==t.selectionEnd){let n=t.selectionStart||0,r=Ht(t.value,n);if(r!==void 0){let o=Me(r);if(o.length===1){let i=o[0].substring(r.length)+" ";t.setRangeText(i);let a=n+i.length;t.setSelectionRange(a,a),J(),e.preventDefault(),k()}}}}else setTimeout(Lt,0)}function Ct(e){Lt()}function Ft(e){let t=L();kt(),It(t.value.trim().toLowerCase())}function kt(){let e=L(),t=document.getElementById("clear-search");t.style.visibility=e.value.length===0?"hidden":"visible"}function Dt(){On("")}function Bn(e,t){let n=e.id+"--mirror",r=document.getElementById(n);if(!r){r=document.createElement("div"),r.id=n;let i=getComputedStyle(e),a=r.style;a.position="absolute",a.visibility="hidden",a.overflow="hidden",a.width=i.width,a.height=i.height,a.paddingTop=i.paddingTop,a.paddingRight=i.paddingRight,a.paddingBottom=i.paddingBottom,a.paddingLeft=i.paddingLeft,a.fontFamily=i.fontFamily,a.fontStyle=i.fontStyle,a.fontVariant=i.fontVariant,a.fontWeight=i.fontWeight,a.fontSize=i.fontSize,a.textAlign=i.textAlign,document.body.appendChild(r)}r.textContent=e.value.substring(0,t).replace(/\s/g,"\xA0");let o=document.createElement("span");return o.textContent=".",r.appendChild(o),o.offsetLeft}function An(){let e=L(),t=document.getElementById("completion"),n=Bn(e,e.selectionStart||0),r=-e.scrollLeft+n+10,o=e.offsetWidth-r-10;t.style.left=`${e.offsetLeft+r}px`,t.style.top=`${e.offsetTop+4}px`,t.style.width=`${o}px`,t.style.display="block"}function k(){let e=document.getElementById("completion");e.style.display="none",T(e)}function On(e){let t=L();t.value=e,t.dispatchEvent(new Event("change"))}var Y=class{maxConcurrency;current=0;q=[];constructor(t){this.maxConcurrency=t}run(t){this.q.push(t),this.tryRun()}tryRun(){if(this.current<this.maxConcurrency){let t=this.q.shift();t!==void 0&&(this.current++,t().then(()=>{this.current--,this.tryRun()}))}}};var X=0;function b(e,t=7e3){Pt(e,"info",t)}function M(e,t=7e3){Pt(e,"error",t)}function Pt(e,t,n){let r=document.getElementById("toast");r.setAttribute("data-kind",t),r.style.pointerEvents="auto",r.style.opacity="1";let o=document.getElementById("toast-msg");o.textContent=e,X!==0&&(clearTimeout(X),X=0),X=setTimeout(ee,n)}function ee(){let e=document.getElementById("toast");e.style.pointerEvents="none",e.style.opacity="0"}var Rt=["avi","m4v","mkv","mov","mp4","mpeg","mpeg4","ogg","ogv","webm","wmv"];function Rn(e){let t=e.substr(e.lastIndexOf(".")+1).toLowerCase();return Rt.indexOf(t)>=0}var Bt=["shuffle","by_name","by_file_size","by_duration"],Vt="settings",d={sortMode:"by_name",loopSingle:!1,hideDupes:!1,previewOnHover:!1},u=null;function Vn(e){let t=0;return typeof e=="string"&&(t=Math.max(0,Bt.indexOf(e))),Bt[t]}function Gn(e){let n=y().transaction("misc").objectStore("misc").get(Vt);n.onsuccess=r=>{let o=n.result;o&&(d.sortMode=Vn(o.sortMode),d.loopSingle=!!o.loopSingle,d.hideDupes=!!o.hideDupes,d.previewOnHover=!!o.previewOnHover),e()},n.onerror=()=>{M("Error loading preferences"),e()}}function Pe(){let t=y().transaction("misc","readwrite").objectStore("misc"),n={loopSingle:d.loopSingle,sortMode:d.sortMode,hideDupes:d.hideDupes,previewOnHover:d.previewOnHover};t.put(n,Vt).onsuccess=()=>{console.log("settings saved",n)}}function m(){return document.getElementById("video-player")}function se(){return document.getElementById("video-container")}function Be(){return document.getElementById("entries")}function Ae(){return document.getElementById("gallery-container")}function Gt(e){return e?.getAttribute(v)||""}function Oe(e){return e.querySelector(".entry-image")}function $t(e){jt(),Fe=null,u=e,m().pause(),ce(e,t=>{$n(URL.createObjectURL(t)),Ne(e)})}function K(){return u?document.getElementById(u):null}function ce(e,t){let n=P[e];if(n){t(n);return}}function $n(e){let t=m();t.src&&(URL.revokeObjectURL(t.src),t.src=""),t.autoplay=!0,t.src=e}function zn(e){let t=e.lastIndexOf(".");if(t==-1)return e;let n=e.substr(t+1).toLowerCase();return Rt.indexOf(n)==-1?e:e.substr(0,t)}function zt(e){return e.getElementsByTagName("img")[0]}var E=null,x=0,Le=3;function jn(e){if(e<30)return 4;if(e>3600)return 15;let i=(e-30)/3570;return Math.floor(Math.sqrt(i)*11+4)}function Kn(e,t){let n=jn(e);if(n*(t+3)>e)return[];let o=e/n,i=[],a=o;for(let s=1;s<n;++s)i.push(a),a+=o;return i}function jt(){if(E){zt(E).style.display="";for(let e of E.getElementsByTagName("video")){let t=e.src;e.pause(),e.src="",e.remove(),URL.revokeObjectURL(t)}x&&(clearTimeout(x),x=0),E=null}}var ie=[],ne=0;function Kt(){if(x=0,E){let e=E.getElementsByTagName("video");if(e.length!=1)return;let t=e[0];t.currentTime=ie[ne],x=setTimeout(Kt,Le*1e3),++ne==ie.length&&(ne=0)}}function Wn(e){if(E||x||!e.parentElement)return;E=e;let t=e.parentElement.id,n=zt(e),r=Math.floor(n.offsetHeight);t&&ce(t,o=>{let i=URL.createObjectURL(o);if(E!=e){URL.revokeObjectURL(i);return}let a=document.createElement("video");a.style.height=`${r}px`,a.style.display="none",a.muted=!0,a.autoplay=!0,a.loop=!0,e.appendChild(a),a.src=i,a.addEventListener("loadedmetadata",()=>{n.style.display="none",a.style.display="",ne=0,ie=Kn(a.duration,Le),ie.length>0&&(x=setTimeout(Kt,Le*1e3))},!1)})}var xe=null,re=0;function qn(e){d.previewOnHover&&(xe=e.target,re=setTimeout(()=>{xe==e.target&&Wn(e.target)},500))}function Qn(e){xe=null,re!==0&&(clearTimeout(re),re=0),jt()}function Zn(e){let t=zn(e),n=document.createElement("div");n.className="entry",n.addEventListener("click",rr),n.setAttribute(v,t);let r=document.createElement("div");r.className="entry-preview",r.addEventListener("mouseenter",qn),r.addEventListener("mouseleave",Qn);let o=document.createElement("img");o.className="entry-image",r.appendChild(o),r.appendChild(bt());let i=document.createElement("div");i.className="duration-badge",r.appendChild(i);let a=document.createElement("div");a.className="quality-badge",r.appendChild(a);let s=document.createElement("div");s.className="file-size-badge",r.appendChild(s),n.appendChild(r);let c=document.createElement("div");return c.className="entry-title",c.textContent=t,n.appendChild(c),n}function Jn(){let e=Be(),t=[...e.children];for(let n=t.length-1;n>0;n--){let r=Math.floor(Math.random()*(n+1));[t[n],t[r]]=[t[r],t[n]]}t.forEach(n=>{e.appendChild(n)})}var Yn=(e,t)=>{let n=e.getAttribute(v)||"",r=t.getAttribute(v)||"";return n.localeCompare(r)},Xn=(e,t)=>{let n=Number.parseInt(e.getAttribute(H)||"0")||0,r=Number.parseInt(t.getAttribute(H)||"0")||0;return n-r},er=(e,t)=>{let n=F(e.id).duration,r=F(t.id).duration;return n-r};function He(e){let t=Be(),n=[...t.children];n.sort(e),n.forEach(r=>{t.appendChild(r)})}var Ue={shuffle:{icon:"url(./assets/shuffle-icon.svg)",tooltip:"Shuffle",radio:"arrange-shuffle",func:()=>{Jn()}},by_name:{icon:"url(./assets/sort-icon.svg)",tooltip:"Sort by name",radio:"arrange-sort-az",func:()=>{He(Yn)}},by_file_size:{icon:"url(./assets/sort-by-size.svg)",tooltip:"Sort by size",radio:"arrange-sort-size",func:()=>{He(Xn)}},by_duration:{icon:"url(./assets/sort-by-duration.svg)",tooltip:"Sort by duration",radio:"arrange-sort-duration",func:()=>{He(er)}}};function Wt(){Ue[d.sortMode].func()}function qt(){let e=document.getElementById("shuffle-button"),t=Ue[d.sortMode];e.style.backgroundImage=t.icon,e.title=t.tooltip}function Qt(){let e=document.getElementById("loop-button"),t=m();d.loopSingle?(e.classList.remove("disabled"),e.title="Loop single on",t.setAttribute("loop","")):(e.classList.add("disabled"),e.title="Loop single off",t.removeAttribute("loop"))}function _e(){return Ae().style.display!=="none"}var N=0,tr=4e3,R=0,nr=5e3;function Ce(e,t){let n=document.getElementById(e);_(n,t)}function $(e){e&&e.info&&(Ce("osd-info1",e.info),R&&(clearTimeout(R),R=0),R=setTimeout(()=>{Ce("osd-info1",""),R=0},nr));let t=document.getElementById("osd-container");t.style.opacity="1.0",N&&(clearTimeout(N),N=0),N=setTimeout(()=>{t.style.opacity="0",N=0},tr)}function Zt(){let e=document.getElementById("osd-container");e.style.opacity="0"}function Ne(e){let t=document.getElementById(e);if(t){let n=document.getElementById("osd-title");_(n,Gt(t));let r=document.getElementById("osd-tags");T(r);let o=g(e);if(o){for(let a of o.tags){let s=be(a),c=document.createElement("span");c.textContent=a,c.className="tag",c.style.background=s.bkg,c.style.borderColor=s.border,c.style.color=s.text,r.appendChild(c)}let i=document.getElementById("osd-sections");i.style.display=o.scenes.length>0?"block":"none",T(i);for(let a of o.scenes){let s=document.createElement("div");s.textContent=a.name,s.className="osd-section",s.style.left=`${a.start*100}%`,s.style.width=`${a.length*100}%`,i.appendChild(s)}}}}async function rr(e){if(!e.currentTarget)return;e.preventDefault(),e.stopPropagation();let t=e.currentTarget;if(t.getAttribute(I))return;let n=m();if(t==K())try{await n.play()}catch(r){console.log("Error playing video",r),Yt()}else se().style.background="",$t(t.id)}function or(){if(m().src){ir();let t=K();if(t&&"mediaSession"in navigator){let n=Oe(t),r={title:Gt(t),artist:"VideoQueen",artwork:[{src:n.src,sizes:`${n.naturalWidth}x${n.naturalHeight}`,type:"image/webp"}]};navigator.mediaSession.metadata=new MediaMetadata(r)}}}function Jt(){let e=m();e.paused||e.pause(),Ae().style.display="block",se().style.display="none",document.getElementById("progress-container").style.display="",Zt(),ct()}function ir(){_e()&&(Ae().style.display="none",se().style.display="block",document.getElementById("progress-container").style.display="none",ee()),st()}function Yt(){let e=m();M(`Error playing video: ${e.error?e.error.message:""}`)}function At(e,t){return String(e).padStart(t,"0")}function z(e){e=Math.floor(e);let t=Math.floor(e/3600),n=Math.floor(e%3600/60),r=e%60,o=At(r,2);if(t){let i=At(n,2);return`${t}:${i}:${o}`}return`${n}:${o}`}var ae,te=0;function ar(){if(m().duration){if(ae){$({info:`Scene: ${ae}`});return}$()}}function sr(){let e=m();$({info:`Volume: ${Math.round(e.volume*100)}%`})}function cr(){let e=m();$({info:`Speed: ${Math.round(e.playbackRate*100)}%`})}function lr(){ke()}function dr(){let e=m();if(e.src&&e.paused&&u){let t=e.currentTime,n=u;Jt();let r=document.getElementById(n);if(!r)return;ce(n,function(o){ye(n,o,t,i=>{if(i.image){let s=Oe(r).src;De(r,i),URL.revokeObjectURL(s),Ee(n,i),C(n,c=>(c.thumbnailTime=t,c))}})})}}async function Ot(){if(document.fullscreenElement)document.exitFullscreen();else try{await se().requestFullscreen()}catch(e){console.log("fullscreen failed: ",e)}}function Ut(e,t){t.paused&&!t.error?t.play():t.pause()}var Fe=null,V=0;function le(e,t,n){if(n==1&&f){let r=e.duration*f.start,o=e.duration*(f.start+f.length);(t<r||t>=o)&&(b("Exiting loop",1e3),f=void 0)}e.currentTime=t}function p(e,t){let n=parseInt(e.key);Fe===n?(V+=.01,V>=1&&(V=0)):V=n/10,Fe=n,le(t,t.duration*V,1)}function ur(e,t){if(!u)return;let n=g(u),r=t.duration*.5;typeof n.thumbnailTime=="number"&&(r=n.thumbnailTime),le(t,r,1)}function D(e,t={}){return(n,r)=>{if(!t.pauseOnly||r.paused){let o=n.shiftKey&&t.shiftDelta?t.shiftDelta:e,i=r.currentTime;le(r,Math.max(Math.min(i+o,r.duration),0),1)}}}var j,f;function mr(e,t){if(!t.paused){M("Pause video before marking start of scene",3e3);return}j=t.currentTime/t.duration,b(`Marked start of scene at ${z(t.currentTime)}`,3e3)}function fr(e,t){if(!t.paused){M("Pause video before marking end of scene",3e3);return}if(j===void 0){M("Mark start of scene before marking end",3e3);return}if(t.currentTime/t.duration-j<=0){M("Scene end must be after the start",3e3);return}document.getElementById("name-scene-dialog").showModal()}function gr(){if(j===void 0||!u)return;let e=m(),t=j,n=e.currentTime/e.duration,r=n-t,i=document.getElementById("save-scene-name").value.trim();i!==""&&(C(u,a=>(a.scenes=ut({start:t,length:r,name:i},a.scenes),a)),b(`Adding scene between ${z(t*e.duration)} and ${z(n*e.duration)}`,3e3),Ne(u))}function pr(e){let t=m(),n=t.currentTime/t.duration,r=z(t.currentTime),o=Math.round(n*100);Ce("osd-info2",`Time: ${r} (${o}%)`),f&&n>f.start+f.length&&le(t,f.start*t.duration,2)}function yr(e){if(!u)return;let t=e.currentTime/e.duration,n=g(u);return dt(n.scenes,t)}function Er(e,t){f=yr(t),f&&(console.log("Will try to loop"),t.currentTime=f.start*t.duration)}function hr(e,t){if(!u)return;let n=g(u);if(n.scenes.length===0)return;let r=i=>{ae=i.name,te&&clearTimeout(te),te=setTimeout(()=>{ae="",te=0},500),t.currentTime=i.start*t.duration,t.paused&&!t.error&&t.play()},o=t.currentTime/t.duration;for(let i of n.scenes)if(i.start>o){r(i);return}r(n.scenes[0])}var vr={Enter:Ot,f:Ot,t:dr,p:_t,n:ke,PageUp:_t,PageDown:ke,A:Lr,a:Hr,"[":mr,"]":fr,L:Er,s:hr,0:p,1:p,2:p,3:p,4:p,5:p,6:p,7:p,8:p,9:p,j:D(-10),l:D(10),",":D(-1/30,{pauseOnly:!0}),".":D(1/30,{pauseOnly:!0}),ArrowLeft:D(-5,{shiftDelta:-30}),ArrowRight:D(5,{shiftDelta:30}),z:ur," ":Ut,k:Ut,Escape:(e,t)=>{t.paused||t.pause(),Jt()},"=":(e,t)=>{t.playbackRate=1},ArrowUp:(e,t)=>{t.volume=Math.min(t.volume+.1,1)},ArrowDown:(e,t)=>{t.volume=Math.max(t.volume-.1,0)},i:()=>{K()&&$()},d:()=>{u&&C(u,e=>{let t="delete",r=e.tags.indexOf(t);return r==-1?(b(`Added '${t}' tag`,3e3),e.tags.push(t)):(b(`Removed '${t}' tag`,3e3),e.tags.splice(r,1)),e})}};function Tr(e){if(document.activeElement&&document.activeElement.tagName==="INPUT")return;if(_e()){if(e.code==="Escape"){let n=m();n.paused&&n.src&&!n.error&&n.play(),e.preventDefault(),e.stopPropagation()}e.key==="k"&&e.ctrlKey&&(document.getElementById("search-entry").focus(),e.preventDefault(),e.stopPropagation()),e.key==="r"&&e.ctrlKey&&(G("shuffle"),e.preventDefault(),e.stopPropagation());return}let t=vr[e.key];t&&(t(e,m()),e.preventDefault(),e.stopPropagation())}function Sr(){d.loopSingle=!d.loopSingle,Qt(),Pe()}function G(e){d.sortMode=e,qt(),Wt(),Pe()}function br(){let e=document.getElementById("sort-dropdown-content");console.log("got dropdown",e),e.classList.toggle("show-dropdown");let t=Ue[d.sortMode],n=document.getElementById(t.radio);n.checked=!0}function Mr(e){if(!_e()){let t=m();t.volume=Math.max(Math.min(t.volume+e.deltaY/560,1),0)}}function wr(){let e=[],t=document.getElementsByClassName("entry");for(let n of t){let r=n;r.style.display!=="none"&&e.push(r)}return e}function Xt(){return e=>!0}function Ir(e){return t=>en(t)==e}function Re(e,t){let n=wr(),r=K();if(!r)return;let o=n.indexOf(r);if(!(o<0))for(let i=0;i!=n.length-1;++i){o=e?o<n.length-1?o+1:0:o>0?o-1:n.length-1;let a=n[o];if(!(a.getAttribute(I)||a.getAttribute(q))&&t(a)){Zt(),$t(a.id);break}}}function ke(){Re(!0,Xt())}function _t(){Re(!1,Xt())}function en(e){let t=e.getAttribute(v)||"";if(t=="")return"";let n=t.indexOf("-");return n==-1?"":t.substr(0,n).trim().toLowerCase()}function tn(e){let t=K();if(!t)return;let n=en(t);n!=""&&Re(e,Ir(n))}function Hr(){tn(!0)}function Lr(){tn(!1)}function De(e,t){let n=Oe(e),r=Object.keys(P).length;if(oe<r&&(oe++,oe==r&&Cr()),t.unsupported)e.setAttribute(I,"true"),e.style.display="none";else{let o=e.querySelector(".duration-badge");o.textContent=z(t.duration);let i=e.querySelector(".quality-badge");i.textContent=`${t.width}x${t.height}`,n.src=URL.createObjectURL(t.image)}}function xr(e,t){it(e,n=>{if(n){De(t,n);return}ce(e,r=>{at(e,r,o=>{o.image||(o={unsupported:!0}),De(t,o),Ee(e,o)})})})}var P={},oe=0;async function nn(e){document.getElementById("initial-view").style.display="none",Et(),P={},oe=0;for(let r of document.getElementsByClassName("entry-image")){let o=r;URL.revokeObjectURL(o.src)}let t=Be();T(t);let n=new Y(64);for(let r of e){if(!Rn(r.name))continue;let o=Zn(r.name);t.appendChild(o),n.run(()=>mt(r).then(i=>{if(document.getElementById(i)){let s=o.querySelector(".entry-preview");if(s){s.setAttribute(q,"true"),o.setAttribute(q,"true");let l=document.createElement("div");l.className="dupe-badge",l.textContent=`Dupe of ${P[i].name}`,s.append(l)}let c=o.querySelector(".tag-container");c&&c.remove()}else{o.setAttribute("id",i),o.setAttribute(H,`${r.size}`);let s=o.querySelector(".file-size-badge");s.textContent=gt(r.size);let c=o.querySelector(".tag-container"),l=g(i);we(c,l.tags),P[i]=r}xr(i,o)}))}}function Cr(){Wt(),J()}function rn(){let e=Object.values(P);e.length>0&&nn(e)}async function Fr(e){e.preventDefault();let t=await et();document.getElementById("settings-dialog").close(),t&&b("Metadata exported")}async function kr(e){e.preventDefault();let t=await tt();document.getElementById("settings-dialog").close(),rn(),t&&b("Metadata imported")}function Dr(){k()}function Pr(e){if(!(e.target instanceof Element&&e.target.matches("#shuffle-button")))for(let t of document.getElementsByClassName("sort-dropdown-content"))t.classList.remove("show-dropdown")}function Br(e){let t=e.target,n=document.getElementById("top-gradient-mask"),r=document.getElementById("bottom-gradient-mask");t.scrollTop==0?n.style.opacity="0":n.style.opacity="1",t.scrollTop>=t.scrollHeight-t.offsetHeight-2?r.style.opacity="0":r.style.opacity="1"}async function Nt(e){let t={id:"boop",mode:"read",startIn:"videos"};try{let n=await globalThis.showDirectoryPicker(t),r=[],o=async a=>{for await(let[s,c]of a.entries())c.kind==="file"?r.push(c.getFile()):c.kind==="directory"&&await o(c)};await o(n);let i=await Promise.all(r);nn(i)}catch(n){console.log("errol: ",n)}}function on(){if(d.hideDupes){let e=new CSSStyleSheet;e.replaceSync('.entry[data-dupe="true"] { display: none; }'),document.adoptedStyleSheets=[e]}else document.adoptedStyleSheets=[]}function Ar(){let e=document.getElementById("settings-hide-dupes");e.checked=d.hideDupes;let t=document.getElementById("settings-preview-video");t.checked=d.previewOnHover,document.getElementById("settings-dialog").showModal()}function Or(){let e=document.getElementById("settings-hide-dupes");e.checked!==d.hideDupes&&(d.hideDupes=e.checked,on());let t=document.getElementById("settings-preview-video");d.previewOnHover=t.checked,Pe()}function Ur(e){let t=document.getElementById(e.contentHash);if(!t)return;let n=t.querySelector(".tag-container");n&&we(n,e.tags),e.contentHash==u&&Ne(e.contentHash)}async function _r(){if("serviceWorker"in navigator)try{let e=await navigator.serviceWorker.register("service-worker.js",{scope:"./"});e.installing?console.log("Service worker installing"):e.waiting?console.log("Service worker installed"):e.active&&console.log("Service worker active")}catch(e){console.error(`Registration failed with ${e}`)}}globalThis.addEventListener("load",function(){globalThis.addEventListener("keydown",Tr,{capture:!0});let e=document.getElementById("search-entry");e.addEventListener("input",J),e.addEventListener("blur",k),e.addEventListener("change",Ft),e.addEventListener("keydown",xt),e.addEventListener("focus",Ct);let t=m();t.addEventListener("play",or,!1),t.addEventListener("error",Yt,!1),t.addEventListener("seeking",ar,!1),t.addEventListener("volumechange",sr,!1),t.addEventListener("ratechange",cr,!1),t.addEventListener("ended",lr,!1),t.addEventListener("timeupdate",pr,!1),document.addEventListener("dragover",function(n){n.dataTransfer&&(n.dataTransfer.dropEffect="none"),n.preventDefault()},!1),document.addEventListener("drop",function(n){n.preventDefault()},!1),document.addEventListener("wheel",Mr,!1),document.getElementById("gallery-view").addEventListener("scroll",Br),document.getElementById("loop-button").addEventListener("click",Sr),document.getElementById("shuffle-button").addEventListener("click",br),document.getElementById("clear-search").addEventListener("click",Dt),document.getElementById("settings").addEventListener("click",Ar),document.getElementById("settings-confirm").addEventListener("click",Or),document.getElementById("settings-export-tags").addEventListener("click",Fr),document.getElementById("settings-import-tags").addEventListener("click",kr),document.getElementById("open-folder").addEventListener("click",Nt),document.getElementById("initial-open-folder").addEventListener("click",Nt),document.getElementById("save-query-confirm").addEventListener("click",gr),document.getElementById("arrange-shuffle").addEventListener("click",()=>G("shuffle")),document.getElementById("arrange-sort-az").addEventListener("click",()=>G("by_name")),document.getElementById("arrange-sort-size").addEventListener("click",()=>G("by_file_size")),document.getElementById("arrange-sort-duration").addEventListener("click",()=>G("by_duration")),document.getElementById("toast-close").addEventListener("click",ee),globalThis.addEventListener("resize",Dr),globalThis.addEventListener("click",Pr),_r(),Ze(Ur),ze(Je),qe(n=>{n?Xe().then(()=>{Gn(()=>{qt(),Qt(),on(),rn()})}):M("Error opening IndexedDB")})});})();
