(()=>{var ze=new BroadcastChannel("savedQueryChannel");function Ke(e){ze.postMessage({queries:e})}function We(e){ze.addEventListener("message",e)}var p="data-name",L="data-bad-media",$="data-dupe",x="data-duration",G="data-quality",Q="data-tag-count",D="data-file-size",Ye="vqStorage";var P=null,Je=[];function Xe(e){console.log("storage init");let t=indexedDB.open(Ye,4);t.onupgradeneeded=async n=>{console.log(`onupgradeneeded old=${n.oldVersion} new=${n.newVersion}`);let r=t.result;switch(n.oldVersion){case 0:console.log("Creating new DB"),r.createObjectStore("tags",{});case 1:console.log("Upgrading to version 2"),r.createObjectStore("previews",{});case 2:console.log("Upgrading to version 3"),r.createObjectStore("misc",{});case 3:console.log("Upgrading to version 4"),r.createObjectStore("metadata",{}),Je.push(fn)}},t.onerror=n=>{P=null,e(!1)},t.onsuccess=async n=>{P=t.result;for(let r of Je)console.log("Running upgrade function"),await r(P);e(!0)}}function f(){if(!P)throw"DB not initialized";return P}async function fn(e){return new Promise((t,n)=>{let r=e.transaction(["tags","metadata"],"readwrite"),o=r.objectStore("tags").openCursor(),i=r.objectStore("metadata"),a=[];o.onsuccess=async l=>{let s=o.result;if(s){let c={contentHash:s.key,tags:s.value.tags};a.push(new Promise((h,S)=>{let q=i.put({metadata:c},s.key);q.onsuccess=()=>h(),q.onerror=S})),s.continue()}else await Promise.all(a),t()},o.onerror=l=>{n(new Error("Could not open tags cursor"))}})}var K=new Map;function C(e){let t=K.get(e)||{contentHash:e,tags:[],scenes:[]};return t.scenes=t.scenes||[],t.tags=t.tags||[],t}function fe(e,t){et(e,t)}function et(e,t){K.set(e,t),f().transaction("metadata","readwrite").objectStore("metadata").put({metadata:t},e)}function tt(){return new Promise((e,t)=>{let r=f().transaction("metadata","readonly").objectStore("metadata").getAll();r.onerror=o=>{t(new Error("Failed to initialize metadata"))},r.onsuccess=o=>{for(let i of r.result)K.set(i.metadata.contentHash,i.metadata);e()}})}function W(e,t){let n=t(C(e));n!==void 0&&(console.log(`updating metadata for ${e}`),fe(e,n))}async function nt(){try{let e={types:[{description:"Exported tags",accept:{"application/json":[".json"]}}],suggestedName:"exported-metadata.json"},n=await(await globalThis.showSaveFilePicker(e)).createWritable(),r=[];K.forEach((i,a)=>{r.push(i)});let o=new Blob([JSON.stringify({metadata:r})],{type:"application/json"});await n.write(o),await n.close()}catch(e){return console.log("export error:",e),!1}return!0}async function rt(){try{let e={types:[{description:"Metadata",accept:{"application/json":[".json"]}}],multiple:!1},[t]=await globalThis.showOpenFilePicker(e),r=await(await t.getFile()).arrayBuffer(),o=new Uint8Array(r),a=new TextDecoder("utf-8").decode(o),s=JSON.parse(a).metadata;for(let c of s)console.log(`updating metadata for ${c.contentHash}`),et(c.contentHash,c);return!0}catch(e){return console.log("import error:",e),!1}}var gn=624,pn=1e4;function ge(e,t,n){let r={};function o(){c.style.width=`${gn}px`,r.width=c.videoWidth,r.height=c.videoHeight,r.duration=c.duration}function i(S){if(h!==0&&(clearTimeout(h),h=0),c.removeEventListener("error",s,!1),c.removeEventListener("canplay",l,!1),c.removeEventListener("loadedmetadata",o,!1),c.src="",S&&(r.image=S,S.size<1200&&t.retries>0)){--t.retries,typeof t.specificTime=="number"&&(t.specificTime+=1/30),ge(e,t,n);return}n(r)}function a(){c.removeEventListener("seeked",a,!1),yn(c,i)}function l(){c.removeEventListener("canplay",l,!1),c.pause(),t.specificTime||(t.specificTime=c.duration/2),c.addEventListener("seeked",a),c.currentTime=t.specificTime}function s(){i(null)}let c=document.getElementById("generator");c.addEventListener("canplay",l,!1),c.addEventListener("loadedmetadata",o,!1),c.addEventListener("error",s,!1),c.src=e;let h=setTimeout(s,pn);c.pause()}function yn(e,t){let n=document.getElementById("canvas"),r=e.offsetWidth,o=e.offsetHeight;n.width=r,n.height=o;let i=e.offsetWidth,a=e.offsetHeight,l=n.getContext("2d",{willReadFrequently:!0});if(!l){t(null);return}l.imageSmoothingEnabled=!0,l.imageSmoothingQuality="high",l.drawImage(e,0,0,i,a),n.toBlob(t,"image/webp",.5)}var Z=0,O=0;function it(e,t){let n=document.getElementById("progress-container"),r=document.getElementById("progress");O==0&&(n.style.opacity="1"),Z+=t,O+=e,r.value=Z,r.max=O,Z>=O&&(n.style.opacity="0",O=0,Z=0)}function at(e,t){let r=f().transaction("previews").objectStore("previews").get(e);r.onsuccess=o=>{t(r.result)}}var U=[],pe=!1;function st(e,t){ye(e,void 0,t)}function ye(e,t,n){it(1,0),U.push({file:e,specificTime:t,callback:n,processing:!1}),U.length==1&&he()}function Ee(e,t){f().transaction("previews","readwrite").objectStore("previews").put(t,e)}function ct(){pe=!0}function lt(){pe=!1;let e=U[0];e&&!e.processing&&he()}function he(){if(pe)return;let e=U[0];e&&(e.processing=!0,hn(e.file,e.specificTime,t=>{U.shift(),e.callback(t),he()}))}function hn(e,t,n){let r=URL.createObjectURL(e);ge(r,{specificTime:t,retries:t===void 0?1:3},a=>{URL.revokeObjectURL(r),it(0,1),n(a)})}function dt(e,t){for(let n of e)if(t>=n.start&&t<n.start+n.length)return n}function vn(e,t){return!(e.start+e.length<=t.start||t.start+t.length<=e.start)}function ut(e,t){let n=[];for(let r of t)vn(e,r)||n.push(r);for(let r=0;r<n.length;r++)if(e.start<n[r].start)return n.splice(r,0,e),n;return n.push(e),n}function y(e){for(;e.hasChildNodes();)e.removeChild(e.lastChild)}function bn(e){return[...new Uint8Array(e)].map(t=>t.toString(16).padStart(2,"0")).join("")}async function mt(e){let n=null;if(e.size<3*1024)n=await e.arrayBuffer();else{n=new ArrayBuffer(3*1024+8);let r=new BigUint64Array(n);r[0]=BigInt(e.size);let o=Math.floor((e.size-1024)/2),i=e.slice(0,1024).arrayBuffer(),a=e.slice(o,o+1024).arrayBuffer(),l=e.slice(e.size-1024,e.size).arrayBuffer(),s=new Uint8Array(n);s.set(new Uint8Array(await i),8),s.set(new Uint8Array(await a),8+1024),s.set(new Uint8Array(await l),8+2*1024)}return bn(await crypto.subtle.digest("SHA-256",n))}function ft(e){let t=3735928559,n=1103547991;for(let r=0,o;r<e.length;r++)o=e.charCodeAt(r),t=Math.imul(t^o,2654435761),n=Math.imul(n^o,1597334677);return t=Math.imul(t^t>>>16,2246822507)^Math.imul(n^n>>>13,3266489909),n=Math.imul(n^n>>>16,2246822507)^Math.imul(t^t>>>13,3266489909),(n>>>0).toString(16).padStart(8,"0")+(t>>>0).toString(16).padStart(8,"0")}function gt(e){if(e<1024)return`${e.toFixed()} B`;let t=["kB","MB","GB","TB","PB"],n=-1;do e/=1024,++n;while(Math.round(Math.abs(e)*100)/100>=1024&&n<t.length-1);return`${e.toFixed(2)} ${t[n]}`}function ve(e,t,n){let r=n*(1-t/2);if(r==0||r==1)return[e,0,r];let o=(n-r)/Math.min(r,1-r);return[e,o,r]}function Se(e,t,n){return`hsl(${e} ${t*100}% ${n*100}%`}var pt={};function be(e){let t=pt[e];if(t)return t;let n=ft(e),r=(q,je,mn)=>je+q*(mn-je),o=r(parseInt(n.substr(7,3),16)/4096*360,0,360),i=r(parseInt(n.substr(2,2),16)/255,.4,.8),a=r(parseInt(n.substr(4,2),16)/255,.2,.4),l=Math.min(i*.8,1),s=Math.min(a*3,1),c=Math.min(i*.8,1),h=Math.min(a*4,1),S={bkg:Se(...ve(o,i,a)),border:Se(...ve(o,l,s)),text:Se(...ve(o,c,h))};return pt[e]=S,S}var b={};function Et(){b={}}function In(e){b[e]=b[e]+1||1}function Mn(e){--b[e]==0&&delete b[e]}function Ie(e){let t=[];for(let n of Object.keys(b))n.startsWith(e)&&n!=e&&t.push(n);return t.sort((n,r)=>b[r]-b[n]),t}function wn(e){let t=e?.parentElement?.parentElement;if(!t)throw"tagContainer without parent";return t.id}function Y(e){let t=wn(e);t&&W(t,n=>(n.tags=Me(e),n))}function J(e){return e.childNodes[0].textContent||""}function Me(e){let t=[],n=e.children;for(let r=1;r<n.length;++r)t.push(J(n[r]));return t}function we(e,t){let n=document.createElement("span");n.className="tag",n.textContent=e;let r=be(e);if(n.style.background=r.bkg,n.style.borderColor=r.border,n.style.color=r.text,n.addEventListener("click",o=>{o.stopPropagation()}),!t||!t.displayOnly){let o=document.createElement("span");o.className="tag-delete",o.textContent="x",o.addEventListener("click",Dn),n.appendChild(o)}return n}function ht(e){return e.trim().toLowerCase()}function Le(e,t){t=ht(t);let n=e.children;for(let r=1;r<n.length;++r)if(t===J(n[r]))return!0;return!1}function X(e,t){In(t),e.appendChild(we(t)),De(e)}function yt(e,t){let n=ht(t||"");n!==""&&(Le(e,n)||(X(e,n),Y(e)))}function Ln(e){let t=e.currentTarget;if(!t.classList.contains("tag-add"))return;let n=t.parentElement;if(!n)throw"event on unparented tagContainer";switch(e.key){case"Escape":t.textContent="+",t.blur();break;case"Tab":t.textContent==""||t.textContent=="+"?(t.textContent="+",t.blur()):(yt(n,t.textContent),t.textContent="",setTimeout(()=>{t.focus()},0)),e.preventDefault();break;case"Enter":yt(n,t.textContent),t.textContent="+",t.blur();break}e.stopPropagation()}function Tt(){let e=document.createElement("span");e.className="tag-add",e.textContent="+",e.contentEditable="true",e.setAttribute("spellcheck","false"),e.setAttribute("tabindex","-1"),e.addEventListener("click",n=>{e.textContent="",n.stopPropagation()}),e.addEventListener("focusout",n=>{e.textContent="+"}),e.addEventListener("keydown",Ln);let t=document.createElement("div");return t.className="tag-container",t.appendChild(e),De(t),t}function De(e){let t=e.querySelectorAll(".tag").length,n=e?.parentElement?.parentElement;n&&n.setAttribute(Q,`${t}`)}function Ce(e,t){Mn(t);for(let n of e.children)if(t===J(n)){e.removeChild(n),De(e);break}}function Dn(e){if(!e.currentTarget)return;e.stopPropagation();let n=e.currentTarget.parentElement;if(!n)return;let r=J(n),o=n.parentElement;if(!o)throw"unparented tagDelete";Ce(o,r),Y(o)}function T(){return document.getElementById("search-entry")}function St(e){let t=document.getElementsByClassName("entry");if(e){let n=On(e);for(let r of t){let o=r;Fn(o,n)?o.style.display="":o.style.display="none"}}else for(let n of t){let r=n;r.getAttribute(L)||(r.style.display="")}}function Cn(e){return Number.parseInt(e.getAttribute(x)||"0")}function Hn(e){return Number.parseInt(e.getAttribute(G)||"0")}function xn(e){return Number.parseInt(e.getAttribute(Q)||"0")}function An(e){return Number.parseInt(e.getAttribute(D)||"0")/(1024*1024)}function Bn(e){return Number.parseInt(e.getAttribute(D)||"0")/(1024*1024*1024)}function Fn(e,t){if(e.getAttribute(L))return!1;for(let r of t.scalarMatchers)if(!r(e))return!1;if((e.getAttribute(p)||"").toLowerCase().indexOf(t.freetext)===-1)return!1;if(t.includeTags.length||t.excludeTags.length){let r=e.querySelector(".tag-container"),o=r?Me(r):[];for(let i of t.includeTags)if(o.indexOf(i)===-1)return!1;for(let i of t.excludeTags)if(o.indexOf(i)!==-1)return!1}return!0}function kn(e){let t=e.match(/^(>=|>|=|<|<=)([0-9]+)([ptmg]?)$/);if(!t)return;let n=Cn;t[3]=="p"?n=Hn:t[3]=="t"?n=xn:t[3]=="m"?n=An:t[3]=="g"&&(n=Bn);let r=Number.parseInt(t[2]);switch(t[1]){case">=":return o=>n(o)>=r;case">":return o=>n(o)>r;case"=":return o=>n(o)==r;case"<":return o=>n(o)<r;case"<=":return o=>n(o)<=r}}function Pn(e,t){let n=kn(e);return n?(t.scalarMatchers.push(n),!0):!1}function On(e){let t={freetext:"",includeTags:[],excludeTags:[],scalarMatchers:[]},n=e.slice(-1);(n=="+"||n=="-")&&(e=e.slice(0,-1));let r=[];for(let o of e.trim().toLowerCase().split(" "))o[0]=="+"&&o.length>=2?t.includeTags.push(o.substring(1)):o[0]=="-"&&o.length>=2?t.excludeTags.push(o.substring(1)):Pn(o,t)||r.push(o);return t.freetext=r.join(" "),t}function bt(e,t){let n=t;if(n==e.length||e[n]==" "){for(;n--&&e[n]!=" ";)if((e[n]=="+"||e[n]=="-")&&(n==0||e[n-1]==" "))return e.substring(n+1,t)}}function ee(){let e=T();St(e.value.trim().toLowerCase()),Dt(),Ct()}function It(){let e=T(),t=document.getElementById("completion");if(y(t),e.selectionStart!=e.selectionEnd){A();return}let n=!1,r=bt(e.value,e.selectionStart||0);if(r!==void 0){let o=Ie(r);if(o.length>0){n=!0;for(let i of o)t.appendChild(we(i,{displayOnly:!0}));_n()}}n||A()}function Mt(e){if(e.key==="Tab"){let t=T();if(t.selectionStart==t.selectionEnd){let n=t.selectionStart||0,r=bt(t.value,n);if(r!==void 0){let o=Ie(r);if(o.length===1){let i=o[0].substring(r.length)+" ";t.setRangeText(i);let a=n+i.length;t.setSelectionRange(a,a),ee(),e.preventDefault(),A()}}}}else setTimeout(It,0)}function wt(e){It()}function Lt(e){let t=T();Dt(),Ct(),St(t.value.trim().toLowerCase())}function Dt(){let e=T(),t=document.getElementById("clear-search");t.style.visibility=e.value.length===0?"hidden":"visible"}function Ct(){let e=T(),t=document.getElementById("save-search");e.value.length===0?t.setAttribute("disabled",""):t.removeAttribute("disabled")}function Ht(){kt("")}function Un(e,t){let n=e.id+"--mirror",r=document.getElementById(n);if(!r){r=document.createElement("div"),r.id=n;let i=getComputedStyle(e),a=r.style;a.position="absolute",a.visibility="hidden",a.overflow="hidden",a.width=i.width,a.height=i.height,a.paddingTop=i.paddingTop,a.paddingRight=i.paddingRight,a.paddingBottom=i.paddingBottom,a.paddingLeft=i.paddingLeft,a.fontFamily=i.fontFamily,a.fontStyle=i.fontStyle,a.fontVariant=i.fontVariant,a.fontWeight=i.fontWeight,a.fontSize=i.fontSize,a.textAlign=i.textAlign,document.body.appendChild(r)}r.textContent=e.value.substring(0,t).replace(/\s/g,"\xA0");let o=document.createElement("span");return o.textContent=".",r.appendChild(o),o.offsetLeft}function _n(){let e=T(),t=document.getElementById("completion"),n=Un(e,e.selectionStart||0),r=-e.scrollLeft+n+10,o=e.offsetWidth-r-10;t.style.left=`${e.offsetLeft+r}px`,t.style.top=`${e.offsetTop+4}px`,t.style.width=`${o}px`,t.style.display="block"}function A(){let e=document.getElementById("completion");e.style.display="none",y(e)}function xt(){let e=document.getElementById("save-query-name");e.value="";let t=document.getElementById("save-query-query");t.value=T().value.trim(),document.getElementById("save-query-dialog").showModal()}function He(){let e=document.getElementById("save-query-name"),t=document.getElementById("save-query-query"),n=e.value.trim(),r=t.value.trim();n!==""&&r!==""&&(Ae(n,r),xe())}var At="storedQueries";function Bt(){let t=f().transaction("misc").objectStore("misc").get(At);t.onsuccess=n=>{let r=t.result||[];for(let o of r)Ae(o.name,o.search)}}function xe(){let e=[],t=document.getElementById("saved-searches");for(let o of t.children){let i=o.getAttribute(p),a=o.getAttribute("data-search");!i||!a||e.push({name:i,search:a})}f().transaction("misc","readwrite").objectStore("misc").put(e,At),Ke(e)}function Ft(e){e.key==="Enter"&&He()}function kt(e){let t=T();t.value=e,t.dispatchEvent(new Event("change"))}function Nn(e){e.dataTransfer&&(e.dataTransfer.effectAllowed="move")}function Rn(e,t){let n=document.elementFromPoint(e,t);if(n){if(n.classList.contains("ss"))return n;if(n.classList.contains("ss-del")||n.classList.contains("ss-name"))return n.parentElement}return null}function Vn(e){let t=e.target;if(!t)return;let n=t.parentElement,r=Rn(e.clientX,e.clientY);if(r&&r.parentElement===n){if(r!==t){let o=r.offsetHeight;e.clientY>r.offsetTop+o/2?n.insertBefore(t,r.nextSibling):n.insertBefore(t,r)}}else{let o=n.getBoundingClientRect();e.clientX>=o.left&&e.clientX<o.right&&(e.clientY<o.top&&t!==n.firstChild?n.insertBefore(t,n.firstChild):e.clientY>=o.bottom&&t!==n.lastChild&&n.appendChild(t))}e.preventDefault(),e.stopPropagation()}function qn(e){e.dataTransfer&&(e.dataTransfer.effectAllowed="move"),e.preventDefault(),e.stopPropagation()}function $n(e){xe(),e.preventDefault(),e.stopPropagation()}function Ae(e,t){let n=document.createElement("div");n.className="ss",n.setAttribute(p,e),n.setAttribute("data-search",t),n.setAttribute("draggable","true"),n.addEventListener("dragstart",Nn),n.addEventListener("drag",Vn),n.addEventListener("dragover",qn),n.addEventListener("dragend",$n);let r=document.createElement("button");r.className="ss-del",r.setAttribute("tabindex","-1"),r.title="Delete query",r.addEventListener("click",()=>{i.removeChild(n),xe()}),n.appendChild(r);let o=document.createElement("span");o.className="ss-name",o.textContent=e,o.title=t,o.addEventListener("click",()=>{kt(t)}),n.appendChild(o);let i=document.getElementById("saved-searches");i.appendChild(n)}function Pt(e){let t=document.getElementById("saved-searches");y(t);for(let n of e.data.queries)Ae(n.name,n.search)}var te=class{constructor(t){this.current=0;this.q=[];this.maxConcurrency=t}run(t){this.q.push(t),this.tryRun()}tryRun(){if(this.current<this.maxConcurrency){let t=this.q.shift();t!==void 0&&(this.current++,t().then(()=>{this.current--,this.tryRun()}))}}};var ne=0;function I(e,t=7e3){Ot(e,"info",t)}function M(e,t=7e3){Ot(e,"error",t)}function Ot(e,t,n){let r=document.getElementById("toast");r.setAttribute("data-kind",t),r.style.pointerEvents="auto",r.style.opacity="1";let o=document.getElementById("toast-msg");o.textContent=e,ne!==0&&(clearTimeout(ne),ne=0),ne=setTimeout(re,n)}function re(){let e=document.getElementById("toast");e.style.pointerEvents="none",e.style.opacity="0"}var Gt=["avi","m4v","mkv","mov","mp4","mpeg","mpeg4","ogg","ogv","webm","wmv"];function zn(e){let t=e.substr(e.lastIndexOf(".")+1).toLowerCase();return Gt.indexOf(t)>=0}var Ut=["shuffle","by_name","by_file_size","by_duration"],Qt="settings",d={sortMode:"by_name",loopSingle:!1,hideDupes:!1,previewOnHover:!1},m=null;function Kn(e){let t=0;return typeof e=="string"&&(t=Math.max(0,Ut.indexOf(e))),Ut[t]}function Wn(e){let n=f().transaction("misc").objectStore("misc").get(Qt);n.onsuccess=r=>{let o=n.result;o&&(d.sortMode=Kn(o.sortMode),d.loopSingle=!!o.loopSingle,d.hideDupes=!!o.hideDupes,d.previewOnHover=!!o.previewOnHover),e()},n.onerror=()=>{M("Error loading preferences"),e()}}function _e(){let t=f().transaction("misc","readwrite").objectStore("misc"),n={loopSingle:d.loopSingle,sortMode:d.sortMode,hideDupes:d.hideDupes,previewOnHover:d.previewOnHover};t.put(n,Qt).onsuccess=()=>{console.log("settings saved",n)}}function u(){return document.getElementById("video-player")}function ue(){return document.getElementById("video-container")}function Ne(){return document.getElementById("entries")}function Re(){return document.getElementById("gallery-container")}function jt(e){return e?.getAttribute(p)||""}function Ve(e){return e.querySelector(".entry-image")}function zt(e){Wt(),Pe=null,m=e,u().pause(),me(e,t=>{Zn(URL.createObjectURL(t)),tn(e)})}function k(){return m?document.getElementById(m):null}function me(e,t){let n=F[e];if(n){t(n);return}}function Zn(e){let t=u();t.src&&(URL.revokeObjectURL(t.src),t.src=""),t.autoplay=!0,t.src=e}function Yn(e){let t=e.lastIndexOf(".");if(t==-1)return e;let n=e.substr(t+1).toLowerCase();return Gt.indexOf(n)==-1?e:e.substr(0,t)}function Kt(e){return e.getElementsByTagName("img")[0]}var v=null,H=0,Fe=3;function Jn(e){if(e<30)return 4;if(e>3600)return 15;let i=(e-30)/(3600-30);return Math.floor(Math.sqrt(i)*(15-4)+4)}function Xn(e,t){let n=Jn(e);if(n*(t+3)>e)return[];let o=e/n,i=[],a=o;for(let l=1;l<n;++l)i.push(a),a+=o;return i}function Wt(){if(v){Kt(v).style.display="";for(let e of v.getElementsByTagName("video")){let t=e.src;e.pause(),e.src="",e.remove(),URL.revokeObjectURL(t)}H&&(clearTimeout(H),H=0),v=null}}var le=[],ae=0;function Zt(){if(H=0,v){let e=v.getElementsByTagName("video");if(e.length!=1)return;let t=e[0];t.currentTime=le[ae],H=setTimeout(Zt,Fe*1e3),++ae==le.length&&(ae=0)}}function er(e){if(v||H||!e.parentElement)return;v=e;let t=e.parentElement.id,n=Kt(e),r=Math.floor(n.offsetHeight);t&&me(t,o=>{let i=URL.createObjectURL(o);if(v!=e){URL.revokeObjectURL(i);return}let a=document.createElement("video");a.style.height=`${r}px`,a.style.display="none",a.muted=!0,a.autoplay=!0,a.loop=!0,e.appendChild(a),a.src=i,a.addEventListener("loadedmetadata",()=>{n.style.display="none",a.style.display="",ae=0,le=Xn(a.duration,Fe),le.length>0&&(H=setTimeout(Zt,Fe*1e3))},!1)})}var ke=null,se=0;function tr(e){d.previewOnHover&&(ke=e.target,se=setTimeout(()=>{ke==e.target&&er(e.target)},500))}function nr(e){ke=null,se!==0&&(clearTimeout(se),se=0),Wt()}function rr(e){let t=Yn(e),n=document.createElement("div");n.className="entry",n.addEventListener("click",dr),n.setAttribute(p,t);let r=document.createElement("div");r.className="entry-preview",r.addEventListener("mouseenter",tr),r.addEventListener("mouseleave",nr);let o=document.createElement("img");o.className="entry-image",r.appendChild(o),r.appendChild(Tt());let i=document.createElement("div");i.className="duration-badge",r.appendChild(i);let a=document.createElement("div");a.className="quality-badge",r.appendChild(a);let l=document.createElement("div");l.className="file-size-badge",r.appendChild(l),n.appendChild(r);let s=document.createElement("div");return s.className="entry-title",s.textContent=t,n.appendChild(s),n}function or(){let e=Ne(),t=[...e.children];for(let n=t.length-1;n>0;n--){let r=Math.floor(Math.random()*(n+1));[t[n],t[r]]=[t[r],t[n]]}t.forEach(n=>{e.appendChild(n)})}var ir=(e,t)=>{let n=e.getAttribute(p)||"",r=t.getAttribute(p)||"";return n.localeCompare(r)},ar=(e,t)=>{let n=Number.parseInt(e.getAttribute(D)||"0")||0,r=Number.parseInt(t.getAttribute(D)||"0")||0;return n-r},sr=(e,t)=>{let n=Number.parseFloat(e.getAttribute(x)||"0")||0,r=Number.parseFloat(t.getAttribute(x)||"0")||0;return n-r};function Be(e){let t=Ne(),n=[...t.children];n.sort(e),n.forEach(r=>{t.appendChild(r)})}var qe={shuffle:{icon:"url(./assets/shuffle-icon.svg)",tooltip:"Shuffle",radio:"arrange-shuffle",func:()=>{or()}},by_name:{icon:"url(./assets/sort-icon.svg)",tooltip:"Sort by name",radio:"arrange-sort-az",func:()=>{Be(ir)}},by_file_size:{icon:"url(./assets/sort-by-size.svg)",tooltip:"Sort by size",radio:"arrange-sort-size",func:()=>{Be(ar)}},by_duration:{icon:"url(./assets/sort-by-duration.svg)",tooltip:"Sort by duration",radio:"arrange-sort-duration",func:()=>{Be(sr)}}};function Yt(){qe[d.sortMode].func()}function Jt(){let e=document.getElementById("shuffle-button"),t=qe[d.sortMode];e.style.backgroundImage=t.icon,e.title=t.tooltip}function Xt(){let e=document.getElementById("loop-button"),t=u();d.loopSingle?(e.classList.remove("disabled"),e.title="Loop single on",t.setAttribute("loop","")):(e.classList.add("disabled"),e.title="Loop single off",t.removeAttribute("loop"))}function $e(){return Re().style.display!=="none"}var _=0,cr=4e3,N=0,lr=2e3;function V(e){if(e&&e.info){_t();let n=document.getElementById("osd-info"),r=document.createElement("span");r.textContent=e.info,n.appendChild(r),N&&(clearTimeout(N),N=0),N=setTimeout(()=>{_t(),N=0},lr)}let t=document.getElementById("osd-container");t.style.opacity="1.0",_&&(clearTimeout(_),_=0),_=setTimeout(()=>{t.style.opacity="0",_=0},cr)}function _t(){let e=document.getElementById("osd-info");y(e)}function en(){let e=document.getElementById("osd-container");e.style.opacity="0"}function tn(e){let t=document.getElementById(e);if(t){let n=document.getElementById("osd-title");y(n);let r=document.createElement("span");r.textContent=jt(t),n.appendChild(r);let o=document.getElementById("osd-tags");y(o);let i=C(e);if(i){for(let l of i.tags){let s=be(l),c=document.createElement("span");c.textContent=l,c.className="tag",c.style.background=s.bkg,c.style.borderColor=s.border,c.style.color=s.text,o.appendChild(c)}let a=document.getElementById("osd-sections");a.style.display=i.scenes.length>0?"block":"none",y(a);for(let l of i.scenes){let s=document.createElement("div");s.textContent=l.name,s.className="osd-section",s.style.left=`${l.start*100}%`,s.style.width=`${l.length*100}%`,a.appendChild(s)}}}}async function dr(e){if(!e.currentTarget)return;e.preventDefault(),e.stopPropagation();let t=e.currentTarget;if(t.getAttribute(L))return;let n=u();if(t==k())try{await n.play()}catch(r){console.log("Error playing video",r),rn()}else ue().style.background="",zt(t.id)}function ur(){if(u().src){mr();let t=k();if(t&&"mediaSession"in navigator){let n=Ve(t),r={title:jt(t),artist:"VideoQueen",artwork:[{src:n.src,sizes:`${n.naturalWidth}x${n.naturalHeight}`,type:"image/webp"}]};navigator.mediaSession.metadata=new MediaMetadata(r)}}}function nn(){let e=u();e.paused||e.pause(),Re().style.display="block",document.getElementById("sidebar").style.display="block",ue().style.display="none",document.getElementById("progress-container").style.display="",en(),lt()}function mr(){$e()&&(Re().style.display="none",document.getElementById("sidebar").style.display="none",ue().style.display="block",document.getElementById("progress-container").style.display="none",re()),ct()}function rn(){let e=u();M(`Error playing video: ${e.error?e.error.message:""}`)}function Nt(e,t){return String(e).padStart(t,"0")}function on(e){e=Math.floor(e);let t=Math.floor(e/3600),n=Math.floor(e%3600/60),r=e%60,o=Nt(r,2);if(t){let i=Nt(n,2);return`${t}:${i}:${o}`}return`${n}:${o}`}var de,oe=0;function fr(){let e=u();if(e.duration){if(de){V({info:`Scene: ${de}`});return}let t=on(e.currentTime),n=Math.round(e.currentTime/e.duration*100);V({info:`Time: ${t} (${n}%)`})}}function gr(){let e=u();V({info:`Volume: ${Math.round(e.volume*100)}%`})}function pr(){let e=u();V({info:`Speed: ${Math.round(e.playbackRate*100)}%`})}function yr(){Oe()}function Er(){let e=u();if(e.src&&e.paused&&m){let t=e.currentTime,n=m;nn();let r=document.getElementById(n);if(!r)return;me(n,function(o){ye(o,t,i=>{if(i.image){let l=Ve(r).src;Ue(r,i),URL.revokeObjectURL(l),Ee(n,i),W(n,s=>(s.thumbnailTime=t,s))}})})}}async function Rt(){if(document.fullscreenElement)document.exitFullscreen();else try{await ue().requestFullscreen()}catch(e){console.log("fullscreen failed: ",e)}}function Vt(e,t){t.paused&&!t.error?t.play():t.pause()}var Pe=null,R=0;function Ge(e,t,n){if(n==1&&g){let r=e.duration*g.start,o=e.duration*(g.start+g.length);console.log(`Searching to ${t}, start=${r}, end=${o}`),(t<r||t>=o)&&(I("Exiting loop",1e3),g=void 0)}e.currentTime=t}function E(e,t){let n=parseInt(e.key);Pe===n?(R+=.01,R>=1&&(R=0)):R=n/10,Pe=n,Ge(t,t.duration*R,1)}function B(e,t={}){return(n,r)=>{if(!t.pauseOnly||r.paused){let o=n.shiftKey&&t.shiftDelta?t.shiftDelta:e,i=r.currentTime;Ge(r,Math.max(Math.min(i+o,r.duration),0),1)}}}var w,g;function hr(e,t){if(!t.paused){M("Pause video before marking start of scene",3e3);return}w=t.currentTime/t.duration,I(`Marked start of scene at ${w.toFixed(2)}`,3e3)}function Tr(e,t){if(!t.paused){M("Pause video before marking end of scene",3e3);return}if(w===void 0){M("Mark start of scene before marking end",3e3);return}if(t.currentTime/t.duration-w<=0){M("Scene end must be after the start",3e3);return}document.getElementById("name-scene-dialog").showModal()}function vr(){if(console.log("HELLO, scene confirm!"),w===void 0||!m)return;let e=u(),t=e.currentTime/e.duration,n=t-w,o=document.getElementById("save-scene-name").value.trim();if(o==="")return;let i=C(m);i.scenes=ut({start:w,length:n,name:o},i.scenes),fe(m,i),I(`Adding scene between ${w.toFixed(2)} and ${t.toFixed(2)}`,3e3),tn(m)}function Sr(e){if(!g)return;let t=u();t.currentTime/t.duration>g.start+g.length&&Ge(t,g.start*t.duration,2)}function br(e){if(!m)return;let t=e.currentTime/e.duration,n=C(m);return dt(n.scenes,t)}function Ir(e,t){g=br(t),g&&(console.log("Will try to loop"),t.currentTime=g.start*t.duration)}function Mr(e,t){if(!m)return;let n=C(m);if(n.scenes.length===0)return;let r=i=>{de=i.name,oe&&clearTimeout(oe),oe=setTimeout(()=>{de="",oe=0},500),t.currentTime=i.start*t.duration,t.paused&&!t.error&&t.play()},o=t.currentTime/t.duration;for(let i of n.scenes)if(i.start>o){r(i);return}r(n.scenes[0])}var wr={Enter:Rt,f:Rt,t:Er,p:qt,n:Oe,PageUp:qt,PageDown:Oe,A:Fr,a:Br,"[":hr,"]":Tr,L:Ir,s:Mr,0:E,1:E,2:E,3:E,4:E,5:E,6:E,7:E,8:E,9:E,j:B(-10),l:B(10),",":B(-1/30,{pauseOnly:!0}),".":B(1/30,{pauseOnly:!0}),ArrowLeft:B(-5,{shiftDelta:-30}),ArrowRight:B(5,{shiftDelta:30})," ":Vt,k:Vt,Escape:(e,t)=>{t.paused||t.pause(),nn()},"=":(e,t)=>{t.playbackRate=1},ArrowUp:(e,t)=>{t.volume=Math.min(t.volume+.1,1)},ArrowDown:(e,t)=>{t.volume=Math.max(t.volume-.1,0)},i:()=>{k()&&V()},d:()=>{let e=k();if(e){let t=e.querySelector(".tag-container");if(t){let n="delete";Le(t,n)?(I(`Removed '${n}' tag`,3e3),Ce(t,n)):(I(`Added '${n}' tag`,3e3),X(t,n)),Y(t)}}}};function Lr(e){if(document.activeElement&&document.activeElement.tagName==="INPUT")return;if($e()){if(e.code==="Escape"){let n=u();n.paused&&n.src&&!n.error&&n.play(),e.preventDefault(),e.stopPropagation()}e.key==="k"&&e.ctrlKey&&(document.getElementById("search-entry").focus(),e.preventDefault(),e.stopPropagation());return}let t=wr[e.key];t&&(t(e,u()),e.preventDefault(),e.stopPropagation())}function Dr(){d.loopSingle=!d.loopSingle,Xt(),_e()}function ie(e){d.sortMode=e,Jt(),Yt(),_e()}function Cr(){let e=document.getElementById("sort-dropdown-content");console.log("got dropdown",e),e.classList.toggle("show-dropdown");let t=qe[d.sortMode],n=document.getElementById(t.radio);n.checked=!0}function Hr(e){if(!$e()){let t=u();t.volume=Math.max(Math.min(t.volume+e.deltaY/560,1),0)}}function xr(){let e=[],t=document.getElementsByClassName("entry");for(let n of t){let r=n;r.style.display!=="none"&&e.push(r)}return e}function an(){return e=>!0}function Ar(e){return t=>sn(t)==e}function Qe(e,t){let n=xr(),r=k();if(!r)return;let o=n.indexOf(r);if(!(o<0))for(let i=0;i!=n.length-1;++i){o=e?o<n.length-1?o+1:0:o>0?o-1:n.length-1;let a=n[o];if(!(a.getAttribute(L)||a.getAttribute($))&&t(a)){en(),zt(a.id);break}}}function Oe(){Qe(!0,an())}function qt(){Qe(!1,an())}function sn(e){let t=e.getAttribute(p)||"";if(t=="")return"";let n=t.indexOf("-");return n==-1?"":t.substr(0,n).trim().toLowerCase()}function cn(e){let t=k();if(!t)return;let n=sn(t);n!=""&&Qe(e,Ar(n))}function Br(){cn(!0)}function Fr(){cn(!1)}function Ue(e,t){let n=Ve(e),r=Object.keys(F).length;if(ce<r&&(ce++,ce==r&&Pr()),t.unsupported)e.setAttribute(L,"true"),e.style.display="none";else{let o=e.querySelector(".duration-badge");o.textContent=on(t.duration),e.setAttribute(x,`${t.duration}`),e.setAttribute(G,`${t.height}`);let i=e.querySelector(".quality-badge");i.textContent=`${t.width}x${t.height}`,n.src=URL.createObjectURL(t.image)}}function kr(e,t){at(e,n=>{if(n){Ue(t,n);return}me(e,r=>{st(r,o=>{o.image||(o={unsupported:!0}),Ue(t,o),Ee(e,o)})})})}var F={},ce=0;async function ln(e){document.getElementById("initial-view").style.display="none",Et(),F={},ce=0;for(let r of document.getElementsByClassName("entry-image")){let o=r;URL.revokeObjectURL(o.src)}let t=Ne();y(t);let n=new te(64);for(let r of e){if(!zn(r.name))continue;let o=rr(r.name);t.appendChild(o),n.run(()=>mt(r).then(i=>{if(document.getElementById(i)){let l=o.querySelector(".entry-preview");if(l){l.setAttribute($,"true"),o.setAttribute($,"true");let c=document.createElement("div");c.className="dupe-badge",c.textContent=`Dupe of ${F[i].name}`,l.append(c)}let s=o.querySelector(".tag-container");s&&s.remove()}else{o.setAttribute("id",i),o.setAttribute(D,`${r.size}`);let l=o.querySelector(".file-size-badge");l.textContent=gt(r.size);let s=o.querySelector(".tag-container"),c=C(i);for(let h of c.tags)X(s,h);F[i]=r}kr(i,o)}))}}function Pr(){Yt(),ee()}function dn(){let e=Object.values(F);e.length>0&&ln(e)}async function Or(e){e.preventDefault();let t=await nt();document.getElementById("settings-dialog").close(),t&&I("Metadata exported")}async function Ur(e){e.preventDefault();let t=await rt();document.getElementById("settings-dialog").close(),dn(),t&&I("Metadata imported")}function _r(){A()}function Nr(e){if(!(e.target instanceof Element&&e.target.matches("#shuffle-button")))for(let t of document.getElementsByClassName("sort-dropdown-content"))t.classList.remove("show-dropdown")}function Rr(e){let t=e.target,n=document.getElementById("top-gradient-mask"),r=document.getElementById("bottom-gradient-mask");t.scrollTop==0?n.style.opacity="0":n.style.opacity="1",t.scrollTop>=t.scrollHeight-t.offsetHeight-2?r.style.opacity="0":r.style.opacity="1"}async function $t(e){let t={id:"boop",mode:"read",startIn:"videos"};try{let n=await globalThis.showDirectoryPicker(t),r=[],o=async a=>{for await(let[l,s]of a.entries())s.kind==="file"?r.push(s.getFile()):s.kind==="directory"&&await o(s)};await o(n);let i=await Promise.all(r);ln(i)}catch(n){console.log("errol: ",n)}}function Vr(){let e=document.getElementById("sidebar");e.setAttribute("data-flash","true"),setTimeout(()=>{e.removeAttribute("data-flash")},500),He()}function un(){if(d.hideDupes){let e=new CSSStyleSheet;e.replaceSync('.entry[data-dupe="true"] { display: none; }'),document.adoptedStyleSheets=[e]}else document.adoptedStyleSheets=[]}function qr(){let e=document.getElementById("settings-hide-dupes");e.checked=d.hideDupes;let t=document.getElementById("settings-preview-video");t.checked=d.previewOnHover,document.getElementById("settings-dialog").showModal()}function $r(){let e=document.getElementById("settings-hide-dupes");e.checked!==d.hideDupes&&(d.hideDupes=e.checked,un());let t=document.getElementById("settings-preview-video");d.previewOnHover=t.checked,_e()}async function Gr(){if("serviceWorker"in navigator)try{let e=await navigator.serviceWorker.register("service-worker.js",{scope:"./"});e.installing?console.log("Service worker installing"):e.waiting?console.log("Service worker installed"):e.active&&console.log("Service worker active")}catch(e){console.error(`Registration failed with ${e}`)}}globalThis.addEventListener("load",function(){globalThis.addEventListener("keydown",Lr,{capture:!0});let e=document.getElementById("search-entry");e.addEventListener("input",ee),e.addEventListener("blur",A),e.addEventListener("change",Lt),e.addEventListener("keydown",Mt),e.addEventListener("focus",wt);let t=u();t.addEventListener("play",ur,!1),t.addEventListener("error",rn,!1),t.addEventListener("seeking",fr,!1),t.addEventListener("volumechange",gr,!1),t.addEventListener("ratechange",pr,!1),t.addEventListener("ended",yr,!1),t.addEventListener("timeupdate",Sr,!1),document.addEventListener("dragover",function(n){n.dataTransfer&&(n.dataTransfer.dropEffect="none"),n.preventDefault()},!1),document.addEventListener("drop",function(n){n.preventDefault()},!1),document.addEventListener("wheel",Hr,!1),document.getElementById("gallery-view").addEventListener("scroll",Rr),document.getElementById("save-query-dialog").addEventListener("keydown",Ft),document.getElementById("loop-button").addEventListener("click",Dr),document.getElementById("shuffle-button").addEventListener("click",Cr),document.getElementById("clear-search").addEventListener("click",Ht),document.getElementById("save-search").addEventListener("click",xt),document.getElementById("save-query-confirm").addEventListener("click",Vr),document.getElementById("saved-searches").addEventListener("dragover",n=>{n.preventDefault(),n.stopPropagation()}),document.getElementById("settings").addEventListener("click",qr),document.getElementById("settings-confirm").addEventListener("click",$r),document.getElementById("settings-export-tags").addEventListener("click",Or),document.getElementById("settings-import-tags").addEventListener("click",Ur),document.getElementById("open-folder").addEventListener("click",$t),document.getElementById("initial-open-folder").addEventListener("click",$t),document.getElementById("save-query-confirm").addEventListener("click",vr),document.getElementById("arrange-shuffle").addEventListener("click",()=>ie("shuffle")),document.getElementById("arrange-sort-az").addEventListener("click",()=>ie("by_name")),document.getElementById("arrange-sort-size").addEventListener("click",()=>ie("by_file_size")),document.getElementById("arrange-sort-duration").addEventListener("click",()=>ie("by_duration")),document.getElementById("toast-close").addEventListener("click",re),globalThis.addEventListener("resize",_r),globalThis.addEventListener("click",Nr),Gr(),We(Pt),Xe(n=>{n?tt().then(()=>{Bt(),Wn(()=>{Jt(),Xt(),un(),dn()})}):M("Error opening IndexedDB")})});})();
