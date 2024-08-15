(()=>{var ze=new BroadcastChannel("savedQueryChannel");function Ke(e){ze.postMessage({queries:e})}function We(e){ze.addEventListener("message",e)}var Ze=new BroadcastChannel("metadataChannel");function Ye(e){Ze.postMessage(e)}function Je(e){Ze.addEventListener("message",e)}var p="data-name",L="data-bad-media",Q="data-dupe",D="data-duration",j="data-quality",z="data-tag-count",C="data-file-size",Xe="vqStorage";var F=null,et=[];function tt(e){console.log("storage init");let t=indexedDB.open(Xe,4);t.onupgradeneeded=async n=>{console.log(`onupgradeneeded old=${n.oldVersion} new=${n.newVersion}`);let r=t.result;switch(n.oldVersion){case 0:console.log("Creating new DB"),r.createObjectStore("tags",{});case 1:console.log("Upgrading to version 2"),r.createObjectStore("previews",{});case 2:console.log("Upgrading to version 3"),r.createObjectStore("misc",{});case 3:console.log("Upgrading to version 4"),r.createObjectStore("metadata",{}),et.push(vn)}},t.onerror=n=>{F=null,e(!1)},t.onsuccess=async n=>{F=t.result;for(let r of et)console.log("Running upgrade function"),await r(F);e(!0)}}function f(){if(!F)throw"DB not initialized";return F}async function vn(e){return new Promise((t,n)=>{let r=e.transaction(["tags","metadata"],"readwrite"),o=r.objectStore("tags").openCursor(),a=r.objectStore("metadata"),i=[];o.onsuccess=async l=>{let s=o.result;if(s){let c={contentHash:s.key,tags:s.value.tags};i.push(new Promise((w,T)=>{let $=a.put({metadata:c},s.key);$.onsuccess=()=>w(),$.onerror=T})),s.continue()}else await Promise.all(i),t()},o.onerror=l=>{n(new Error("Could not open tags cursor"))}})}var me=new Map,nt=1;function rt(e){me.set(nt,e),nt++}var P=new Map;function S(e){let t=P.get(e)||{contentHash:e,tags:[],scenes:[]};return t.scenes=t.scenes||[],t.tags=t.tags||[],t}function ot(e){let t=e.data.md;P.set(t.contentHash,t),me.forEach(n=>{n(t)})}function Tn(e,t){at(e,t),me.forEach(n=>{n(t)}),Ye({md:t})}function at(e,t){P.set(e,t),f().transaction("metadata","readwrite").objectStore("metadata").put({metadata:t},e)}function it(){return new Promise((e,t)=>{let r=f().transaction("metadata","readonly").objectStore("metadata").getAll();r.onerror=o=>{t(new Error("Failed to initialize metadata"))},r.onsuccess=o=>{for(let a of r.result)P.set(a.metadata.contentHash,a.metadata);e()}})}function x(e,t){let n=structuredClone(S(e)),r=t(n);r!==void 0&&Tn(e,r)}async function st(){try{let e={types:[{description:"Exported tags",accept:{"application/json":[".json"]}}],suggestedName:"exported-metadata.json"},n=await(await globalThis.showSaveFilePicker(e)).createWritable(),r=[];P.forEach((a,i)=>{r.push(a)});let o=new Blob([JSON.stringify({metadata:r})],{type:"application/json"});await n.write(o),await n.close()}catch(e){return console.log("export error:",e),!1}return!0}async function ct(){try{let e={types:[{description:"Metadata",accept:{"application/json":[".json"]}}],multiple:!1},[t]=await globalThis.showOpenFilePicker(e),r=await(await t.getFile()).arrayBuffer(),o=new Uint8Array(r),i=new TextDecoder("utf-8").decode(o),s=JSON.parse(i).metadata;for(let c of s)console.log(`updating metadata for ${c.contentHash}`),at(c.contentHash,c);return!0}catch(e){return console.log("import error:",e),!1}}var Sn=624,bn=1e4;function ge(e,t,n){let r={};function o(){c.style.width=`${Sn}px`,r.width=c.videoWidth,r.height=c.videoHeight,r.duration=c.duration}function a(T){if(w!==0&&(clearTimeout(w),w=0),c.removeEventListener("error",s,!1),c.removeEventListener("canplay",l,!1),c.removeEventListener("loadedmetadata",o,!1),c.src="",T&&(r.image=T,T.size<1200&&t.retries>0)){--t.retries,typeof t.specificTime=="number"&&(t.specificTime+=1/30),ge(e,t,n);return}n(r)}function i(){c.removeEventListener("seeked",i,!1),Mn(c,a)}function l(){c.removeEventListener("canplay",l,!1),c.pause(),t.specificTime||(t.specificTime=c.duration/2),c.addEventListener("seeked",i),c.currentTime=t.specificTime}function s(){a(null)}let c=document.getElementById("generator");c.addEventListener("canplay",l,!1),c.addEventListener("loadedmetadata",o,!1),c.addEventListener("error",s,!1),c.src=e;let w=setTimeout(s,bn);c.pause()}function Mn(e,t){let n=document.getElementById("canvas"),r=e.offsetWidth,o=e.offsetHeight;n.width=r,n.height=o;let a=e.offsetWidth,i=e.offsetHeight,l=n.getContext("2d",{willReadFrequently:!0});if(!l){t(null);return}l.imageSmoothingEnabled=!0,l.imageSmoothingQuality="high",l.drawImage(e,0,0,a,i),n.toBlob(t,"image/webp",.5)}var Z=0,U=0;function lt(e,t){let n=document.getElementById("progress-container"),r=document.getElementById("progress");U==0&&(n.style.opacity="1"),Z+=t,U+=e,r.value=Z,r.max=U,Z>=U&&(n.style.opacity="0",U=0,Z=0)}function dt(e,t){let r=f().transaction("previews").objectStore("previews").get(e);r.onsuccess=o=>{t(r.result)}}var O=[],pe=!1;function ut(e,t){ye(e,void 0,t)}function ye(e,t,n){lt(1,0),O.push({file:e,specificTime:t,callback:n,processing:!1}),O.length==1&&he()}function Ee(e,t){f().transaction("previews","readwrite").objectStore("previews").put(t,e)}function mt(){pe=!0}function ft(){pe=!1;let e=O[0];e&&!e.processing&&he()}function he(){if(pe)return;let e=O[0];e&&(e.processing=!0,wn(e.file,e.specificTime,t=>{O.shift(),e.callback(t),he()}))}function wn(e,t,n){let r=URL.createObjectURL(e);ge(r,{specificTime:t,retries:t===void 0?1:3},i=>{URL.revokeObjectURL(r),lt(0,1),n(i)})}function gt(e,t){for(let n of e)if(t>=n.start&&t<n.start+n.length)return n}function Cn(e,t){return!(e.start+e.length<=t.start||t.start+t.length<=e.start)}function pt(e,t){let n=[];for(let r of t)Cn(e,r)||n.push(r);for(let r=0;r<n.length;r++)if(e.start<n[r].start)return n.splice(r,0,e),n;return n.push(e),n}function y(e){for(;e.hasChildNodes();)e.removeChild(e.lastChild)}function Dn(e){return[...new Uint8Array(e)].map(t=>t.toString(16).padStart(2,"0")).join("")}async function yt(e){let n=null;if(e.size<3*1024)n=await e.arrayBuffer();else{n=new ArrayBuffer(3*1024+8);let r=new BigUint64Array(n);r[0]=BigInt(e.size);let o=Math.floor((e.size-1024)/2),a=e.slice(0,1024).arrayBuffer(),i=e.slice(o,o+1024).arrayBuffer(),l=e.slice(e.size-1024,e.size).arrayBuffer(),s=new Uint8Array(n);s.set(new Uint8Array(await a),8),s.set(new Uint8Array(await i),8+1024),s.set(new Uint8Array(await l),8+2*1024)}return Dn(await crypto.subtle.digest("SHA-256",n))}function Et(e){let t=3735928559,n=1103547991;for(let r=0,o;r<e.length;r++)o=e.charCodeAt(r),t=Math.imul(t^o,2654435761),n=Math.imul(n^o,1597334677);return t=Math.imul(t^t>>>16,2246822507)^Math.imul(n^n>>>13,3266489909),n=Math.imul(n^n>>>16,2246822507)^Math.imul(t^t>>>13,3266489909),(n>>>0).toString(16).padStart(8,"0")+(t>>>0).toString(16).padStart(8,"0")}function ht(e){if(e<1024)return`${e.toFixed()} B`;let t=["kB","MB","GB","TB","PB"],n=-1;do e/=1024,++n;while(Math.round(Math.abs(e)*100)/100>=1024&&n<t.length-1);return`${e.toFixed(2)} ${t[n]}`}function Te(e,t,n){let r=n*(1-t/2);if(r==0||r==1)return[e,0,r];let o=(n-r)/Math.min(r,1-r);return[e,o,r]}function Se(e,t,n){return`hsl(${e} ${t*100}% ${n*100}%`}var vt={};function be(e){let t=vt[e];if(t)return t;let n=Et(e),r=($,je,hn)=>je+$*(hn-je),o=r(parseInt(n.substr(7,3),16)/4096*360,0,360),a=r(parseInt(n.substr(2,2),16)/255,.4,.8),i=r(parseInt(n.substr(4,2),16)/255,.2,.4),l=Math.min(a*.8,1),s=Math.min(i*3,1),c=Math.min(a*.8,1),w=Math.min(i*4,1),T={bkg:Se(...Te(o,a,i)),border:Se(...Te(o,l,s)),text:Se(...Te(o,c,w))};return vt[e]=T,T}var b={};function St(){b={}}function xn(e){b[e]=b[e]+1||1}function An(e){--b[e]==0&&delete b[e]}function Me(e){let t=[];for(let n of Object.keys(b))n.startsWith(e)&&n!=e&&t.push(n);return t.sort((n,r)=>b[r]-b[n]),t}function Bn(e){let t=e?.parentElement?.parentElement;if(!t)throw"tagContainer without parent";return t.id}function bt(e){let t=Bn(e);t&&x(t,n=>(n.tags=Mt(e),n))}function Y(e){return e.childNodes[0].textContent||""}function Mt(e){let t=[],n=e.children;for(let r=1;r<n.length;++r)t.push(Y(n[r]));return t}function kn(e,t){return e.length!=t.length?!1:e.every((n,r)=>n===t[r])}function Ie(e,t){let n=Mt(e);if(!kn(n,t)){for(let r of n)Ct(e,r);for(let r of t)wt(e,r)}}function we(e,t){let n=document.createElement("span");n.className="tag",n.textContent=e;let r=be(e);if(n.style.background=r.bkg,n.style.borderColor=r.border,n.style.color=r.text,n.addEventListener("click",o=>{o.stopPropagation()}),!t||!t.displayOnly){let o=document.createElement("span");o.className="tag-delete",o.textContent="x",o.addEventListener("click",Un),n.appendChild(o)}return n}function It(e){return e.trim().toLowerCase()}function Fn(e,t){t=It(t);let n=e.children;for(let r=1;r<n.length;++r)if(t===Y(n[r]))return!0;return!1}function wt(e,t){xn(t),e.appendChild(we(t)),Le(e)}function Tt(e,t){let n=It(t||"");n!==""&&(Fn(e,n)||(wt(e,n),bt(e)))}function Pn(e){let t=e.currentTarget;if(!t.classList.contains("tag-add"))return;let n=t.parentElement;if(!n)throw"event on unparented tagContainer";switch(e.key){case"Escape":t.textContent="+",t.blur();break;case"Tab":t.textContent==""||t.textContent=="+"?(t.textContent="+",t.blur()):(Tt(n,t.textContent),t.textContent="",setTimeout(()=>{t.focus()},0)),e.preventDefault();break;case"Enter":Tt(n,t.textContent),t.textContent="+",t.blur();break}e.stopPropagation()}function Lt(){let e=document.createElement("span");e.className="tag-add",e.textContent="+",e.contentEditable="true",e.setAttribute("spellcheck","false"),e.setAttribute("tabindex","-1"),e.addEventListener("click",n=>{e.textContent="",n.stopPropagation()}),e.addEventListener("focusout",n=>{e.textContent="+"}),e.addEventListener("keydown",Pn);let t=document.createElement("div");return t.className="tag-container",t.appendChild(e),Le(t),t}function Le(e){let t=e.querySelectorAll(".tag").length,n=e?.parentElement?.parentElement;n&&n.setAttribute(z,`${t}`)}function Ct(e,t){An(t);for(let n of e.children)if(t===Y(n)){e.removeChild(n),Le(e);break}}function Un(e){if(!e.currentTarget)return;e.stopPropagation();let n=e.currentTarget.parentElement;if(!n)return;let r=Y(n),o=n.parentElement;if(!o)throw"unparented tagDelete";Ct(o,r),bt(o)}function h(){return document.getElementById("search-entry")}function Dt(e){let t=document.getElementsByClassName("entry");if(e){let n=Qn(e);for(let r of t){let o=r;qn(o,n)?o.style.display="":o.style.display="none"}}else for(let n of t){let r=n;r.getAttribute(L)||(r.style.display="")}}function On(e){return Number.parseInt(e.getAttribute(D)||"0")}function _n(e){return Number.parseInt(e.getAttribute(j)||"0")}function Nn(e){return Number.parseInt(e.getAttribute(z)||"0")}function Rn(e){return Number.parseInt(e.getAttribute(C)||"0")/(1024*1024)}function Vn(e){return Number.parseInt(e.getAttribute(C)||"0")/(1024*1024*1024)}function qn(e,t){if(e.getAttribute(L))return!1;for(let r of t.scalarMatchers)if(!r(e))return!1;if((e.getAttribute(p)||"").toLowerCase().indexOf(t.freetext)===-1)return!1;if(t.includeTags.length||t.excludeTags.length){let o=S(e.id).tags;for(let a of t.includeTags)if(o.indexOf(a)===-1)return!1;for(let a of t.excludeTags)if(o.indexOf(a)!==-1)return!1}return!0}function Gn(e){let t=e.match(/^(>=|>|=|<|<=)([0-9]+)([ptmg]?)$/);if(!t)return;let n=On;t[3]=="p"?n=_n:t[3]=="t"?n=Nn:t[3]=="m"?n=Rn:t[3]=="g"&&(n=Vn);let r=Number.parseInt(t[2]);switch(t[1]){case">=":return o=>n(o)>=r;case">":return o=>n(o)>r;case"=":return o=>n(o)==r;case"<":return o=>n(o)<r;case"<=":return o=>n(o)<=r}}function $n(e,t){let n=Gn(e);return n?(t.scalarMatchers.push(n),!0):!1}function Qn(e){let t={freetext:"",includeTags:[],excludeTags:[],scalarMatchers:[]},n=e.slice(-1);(n=="+"||n=="-")&&(e=e.slice(0,-1));let r=[];for(let o of e.trim().toLowerCase().split(" "))o[0]=="+"&&o.length>=2?t.includeTags.push(o.substring(1)):o[0]=="-"&&o.length>=2?t.excludeTags.push(o.substring(1)):$n(o,t)||r.push(o);return t.freetext=r.join(" "),t}function xt(e,t){let n=t;if(n==e.length||e[n]==" "){for(;n--&&e[n]!=" ";)if((e[n]=="+"||e[n]=="-")&&(n==0||e[n-1]==" "))return e.substring(n+1,t)}}function J(){let e=h();Dt(e.value.trim().toLowerCase()),Pt(),Ut()}function At(){let e=h(),t=document.getElementById("completion");if(y(t),e.selectionStart!=e.selectionEnd){A();return}let n=!1,r=xt(e.value,e.selectionStart||0);if(r!==void 0){let o=Me(r);if(o.length>0){n=!0;for(let a of o)t.appendChild(we(a,{displayOnly:!0}));zn()}}n||A()}function Bt(e){if(e.key==="Tab"){let t=h();if(t.selectionStart==t.selectionEnd){let n=t.selectionStart||0,r=xt(t.value,n);if(r!==void 0){let o=Me(r);if(o.length===1){let a=o[0].substring(r.length)+" ";t.setRangeText(a);let i=n+a.length;t.setSelectionRange(i,i),J(),e.preventDefault(),A()}}}}else setTimeout(At,0)}function kt(e){At()}function Ft(e){let t=h();Pt(),Ut(),Dt(t.value.trim().toLowerCase())}function Pt(){let e=h(),t=document.getElementById("clear-search");t.style.visibility=e.value.length===0?"hidden":"visible"}function Ut(){let e=h(),t=document.getElementById("save-search");e.value.length===0?t.setAttribute("disabled",""):t.removeAttribute("disabled")}function Ot(){qt("")}function jn(e,t){let n=e.id+"--mirror",r=document.getElementById(n);if(!r){r=document.createElement("div"),r.id=n;let a=getComputedStyle(e),i=r.style;i.position="absolute",i.visibility="hidden",i.overflow="hidden",i.width=a.width,i.height=a.height,i.paddingTop=a.paddingTop,i.paddingRight=a.paddingRight,i.paddingBottom=a.paddingBottom,i.paddingLeft=a.paddingLeft,i.fontFamily=a.fontFamily,i.fontStyle=a.fontStyle,i.fontVariant=a.fontVariant,i.fontWeight=a.fontWeight,i.fontSize=a.fontSize,i.textAlign=a.textAlign,document.body.appendChild(r)}r.textContent=e.value.substring(0,t).replace(/\s/g,"\xA0");let o=document.createElement("span");return o.textContent=".",r.appendChild(o),o.offsetLeft}function zn(){let e=h(),t=document.getElementById("completion"),n=jn(e,e.selectionStart||0),r=-e.scrollLeft+n+10,o=e.offsetWidth-r-10;t.style.left=`${e.offsetLeft+r}px`,t.style.top=`${e.offsetTop+4}px`,t.style.width=`${o}px`,t.style.display="block"}function A(){let e=document.getElementById("completion");e.style.display="none",y(e)}function _t(){let e=document.getElementById("save-query-name");e.value="";let t=document.getElementById("save-query-query");t.value=h().value.trim(),document.getElementById("save-query-dialog").showModal()}function Ce(){let e=document.getElementById("save-query-name"),t=document.getElementById("save-query-query"),n=e.value.trim(),r=t.value.trim();n!==""&&r!==""&&(De(n,r),He())}var Nt="storedQueries";function Rt(){let t=f().transaction("misc").objectStore("misc").get(Nt);t.onsuccess=n=>{let r=t.result||[];for(let o of r)De(o.name,o.search)}}function He(){let e=[],t=document.getElementById("saved-searches");for(let o of t.children){let a=o.getAttribute(p),i=o.getAttribute("data-search");!a||!i||e.push({name:a,search:i})}f().transaction("misc","readwrite").objectStore("misc").put(e,Nt),Ke(e)}function Vt(e){e.key==="Enter"&&Ce()}function qt(e){let t=h();t.value=e,t.dispatchEvent(new Event("change"))}function Kn(e){e.dataTransfer&&(e.dataTransfer.effectAllowed="move")}function Wn(e,t){let n=document.elementFromPoint(e,t);if(n){if(n.classList.contains("ss"))return n;if(n.classList.contains("ss-del")||n.classList.contains("ss-name"))return n.parentElement}return null}function Zn(e){let t=e.target;if(!t)return;let n=t.parentElement,r=Wn(e.clientX,e.clientY);if(r&&r.parentElement===n){if(r!==t){let o=r.offsetHeight;e.clientY>r.offsetTop+o/2?n.insertBefore(t,r.nextSibling):n.insertBefore(t,r)}}else{let o=n.getBoundingClientRect();e.clientX>=o.left&&e.clientX<o.right&&(e.clientY<o.top&&t!==n.firstChild?n.insertBefore(t,n.firstChild):e.clientY>=o.bottom&&t!==n.lastChild&&n.appendChild(t))}e.preventDefault(),e.stopPropagation()}function Yn(e){e.dataTransfer&&(e.dataTransfer.effectAllowed="move"),e.preventDefault(),e.stopPropagation()}function Jn(e){He(),e.preventDefault(),e.stopPropagation()}function De(e,t){let n=document.createElement("div");n.className="ss",n.setAttribute(p,e),n.setAttribute("data-search",t),n.setAttribute("draggable","true"),n.addEventListener("dragstart",Kn),n.addEventListener("drag",Zn),n.addEventListener("dragover",Yn),n.addEventListener("dragend",Jn);let r=document.createElement("button");r.className="ss-del",r.setAttribute("tabindex","-1"),r.title="Delete query",r.addEventListener("click",()=>{a.removeChild(n),He()}),n.appendChild(r);let o=document.createElement("span");o.className="ss-name",o.textContent=e,o.title=t,o.addEventListener("click",()=>{qt(t)}),n.appendChild(o);let a=document.getElementById("saved-searches");a.appendChild(n)}function Gt(e){let t=document.getElementById("saved-searches");y(t);for(let n of e.data.queries)De(n.name,n.search)}var X=class{constructor(t){this.current=0;this.q=[];this.maxConcurrency=t}run(t){this.q.push(t),this.tryRun()}tryRun(){if(this.current<this.maxConcurrency){let t=this.q.shift();t!==void 0&&(this.current++,t().then(()=>{this.current--,this.tryRun()}))}}};var ee=0;function M(e,t=7e3){$t(e,"info",t)}function I(e,t=7e3){$t(e,"error",t)}function $t(e,t,n){let r=document.getElementById("toast");r.setAttribute("data-kind",t),r.style.pointerEvents="auto",r.style.opacity="1";let o=document.getElementById("toast-msg");o.textContent=e,ee!==0&&(clearTimeout(ee),ee=0),ee=setTimeout(te,n)}function te(){let e=document.getElementById("toast");e.style.pointerEvents="none",e.style.opacity="0"}var Jt=["avi","m4v","mkv","mov","mp4","mpeg","mpeg4","ogg","ogv","webm","wmv"];function nr(e){let t=e.substr(e.lastIndexOf(".")+1).toLowerCase();return Jt.indexOf(t)>=0}var Qt=["shuffle","by_name","by_file_size","by_duration"],Xt="settings",d={sortMode:"by_name",loopSingle:!1,hideDupes:!1,previewOnHover:!1},m=null;function rr(e){let t=0;return typeof e=="string"&&(t=Math.max(0,Qt.indexOf(e))),Qt[t]}function or(e){let n=f().transaction("misc").objectStore("misc").get(Xt);n.onsuccess=r=>{let o=n.result;o&&(d.sortMode=rr(o.sortMode),d.loopSingle=!!o.loopSingle,d.hideDupes=!!o.hideDupes,d.previewOnHover=!!o.previewOnHover),e()},n.onerror=()=>{I("Error loading preferences"),e()}}function Ue(){let t=f().transaction("misc","readwrite").objectStore("misc"),n={loopSingle:d.loopSingle,sortMode:d.sortMode,hideDupes:d.hideDupes,previewOnHover:d.previewOnHover};t.put(n,Xt).onsuccess=()=>{console.log("settings saved",n)}}function u(){return document.getElementById("video-player")}function le(){return document.getElementById("video-container")}function Oe(){return document.getElementById("entries")}function _e(){return document.getElementById("gallery-container")}function en(e){return e?.getAttribute(p)||""}function Ne(e){return e.querySelector(".entry-image")}function tn(e){rn(),ke=null,m=e,u().pause(),de(e,t=>{ar(URL.createObjectURL(t)),qe(e)})}function G(){return m?document.getElementById(m):null}function de(e,t){let n=k[e];if(n){t(n);return}}function ar(e){let t=u();t.src&&(URL.revokeObjectURL(t.src),t.src=""),t.autoplay=!0,t.src=e}function ir(e){let t=e.lastIndexOf(".");if(t==-1)return e;let n=e.substr(t+1).toLowerCase();return Jt.indexOf(n)==-1?e:e.substr(0,t)}function nn(e){return e.getElementsByTagName("img")[0]}var v=null,H=0,Ae=3;function sr(e){if(e<30)return 4;if(e>3600)return 15;let a=(e-30)/(3600-30);return Math.floor(Math.sqrt(a)*(15-4)+4)}function cr(e,t){let n=sr(e);if(n*(t+3)>e)return[];let o=e/n,a=[],i=o;for(let l=1;l<n;++l)a.push(i),i+=o;return a}function rn(){if(v){nn(v).style.display="";for(let e of v.getElementsByTagName("video")){let t=e.src;e.pause(),e.src="",e.remove(),URL.revokeObjectURL(t)}H&&(clearTimeout(H),H=0),v=null}}var se=[],oe=0;function on(){if(H=0,v){let e=v.getElementsByTagName("video");if(e.length!=1)return;let t=e[0];t.currentTime=se[oe],H=setTimeout(on,Ae*1e3),++oe==se.length&&(oe=0)}}function lr(e){if(v||H||!e.parentElement)return;v=e;let t=e.parentElement.id,n=nn(e),r=Math.floor(n.offsetHeight);t&&de(t,o=>{let a=URL.createObjectURL(o);if(v!=e){URL.revokeObjectURL(a);return}let i=document.createElement("video");i.style.height=`${r}px`,i.style.display="none",i.muted=!0,i.autoplay=!0,i.loop=!0,e.appendChild(i),i.src=a,i.addEventListener("loadedmetadata",()=>{n.style.display="none",i.style.display="",oe=0,se=cr(i.duration,Ae),se.length>0&&(H=setTimeout(on,Ae*1e3))},!1)})}var Be=null,ae=0;function dr(e){d.previewOnHover&&(Be=e.target,ae=setTimeout(()=>{Be==e.target&&lr(e.target)},500))}function ur(e){Be=null,ae!==0&&(clearTimeout(ae),ae=0),rn()}function mr(e){let t=ir(e),n=document.createElement("div");n.className="entry",n.addEventListener("click",vr),n.setAttribute(p,t);let r=document.createElement("div");r.className="entry-preview",r.addEventListener("mouseenter",dr),r.addEventListener("mouseleave",ur);let o=document.createElement("img");o.className="entry-image",r.appendChild(o),r.appendChild(Lt());let a=document.createElement("div");a.className="duration-badge",r.appendChild(a);let i=document.createElement("div");i.className="quality-badge",r.appendChild(i);let l=document.createElement("div");l.className="file-size-badge",r.appendChild(l),n.appendChild(r);let s=document.createElement("div");return s.className="entry-title",s.textContent=t,n.appendChild(s),n}function fr(){let e=Oe(),t=[...e.children];for(let n=t.length-1;n>0;n--){let r=Math.floor(Math.random()*(n+1));[t[n],t[r]]=[t[r],t[n]]}t.forEach(n=>{e.appendChild(n)})}var gr=(e,t)=>{let n=e.getAttribute(p)||"",r=t.getAttribute(p)||"";return n.localeCompare(r)},pr=(e,t)=>{let n=Number.parseInt(e.getAttribute(C)||"0")||0,r=Number.parseInt(t.getAttribute(C)||"0")||0;return n-r},yr=(e,t)=>{let n=Number.parseFloat(e.getAttribute(D)||"0")||0,r=Number.parseFloat(t.getAttribute(D)||"0")||0;return n-r};function xe(e){let t=Oe(),n=[...t.children];n.sort(e),n.forEach(r=>{t.appendChild(r)})}var Re={shuffle:{icon:"url(./assets/shuffle-icon.svg)",tooltip:"Shuffle",radio:"arrange-shuffle",func:()=>{fr()}},by_name:{icon:"url(./assets/sort-icon.svg)",tooltip:"Sort by name",radio:"arrange-sort-az",func:()=>{xe(gr)}},by_file_size:{icon:"url(./assets/sort-by-size.svg)",tooltip:"Sort by size",radio:"arrange-sort-size",func:()=>{xe(pr)}},by_duration:{icon:"url(./assets/sort-by-duration.svg)",tooltip:"Sort by duration",radio:"arrange-sort-duration",func:()=>{xe(yr)}}};function an(){Re[d.sortMode].func()}function sn(){let e=document.getElementById("shuffle-button"),t=Re[d.sortMode];e.style.backgroundImage=t.icon,e.title=t.tooltip}function cn(){let e=document.getElementById("loop-button"),t=u();d.loopSingle?(e.classList.remove("disabled"),e.title="Loop single on",t.setAttribute("loop","")):(e.classList.add("disabled"),e.title="Loop single off",t.removeAttribute("loop"))}function Ve(){return _e().style.display!=="none"}var _=0,Er=4e3,N=0,hr=2e3;function V(e){if(e&&e.info){jt();let n=document.getElementById("osd-info"),r=document.createElement("span");r.textContent=e.info,n.appendChild(r),N&&(clearTimeout(N),N=0),N=setTimeout(()=>{jt(),N=0},hr)}let t=document.getElementById("osd-container");t.style.opacity="1.0",_&&(clearTimeout(_),_=0),_=setTimeout(()=>{t.style.opacity="0",_=0},Er)}function jt(){let e=document.getElementById("osd-info");y(e)}function ln(){let e=document.getElementById("osd-container");e.style.opacity="0"}function qe(e){let t=document.getElementById(e);if(t){let n=document.getElementById("osd-title");y(n);let r=document.createElement("span");r.textContent=en(t),n.appendChild(r);let o=document.getElementById("osd-tags");y(o);let a=S(e);if(a){for(let l of a.tags){let s=be(l),c=document.createElement("span");c.textContent=l,c.className="tag",c.style.background=s.bkg,c.style.borderColor=s.border,c.style.color=s.text,o.appendChild(c)}let i=document.getElementById("osd-sections");i.style.display=a.scenes.length>0?"block":"none",y(i);for(let l of a.scenes){let s=document.createElement("div");s.textContent=l.name,s.className="osd-section",s.style.left=`${l.start*100}%`,s.style.width=`${l.length*100}%`,i.appendChild(s)}}}}async function vr(e){if(!e.currentTarget)return;e.preventDefault(),e.stopPropagation();let t=e.currentTarget;if(t.getAttribute(L))return;let n=u();if(t==G())try{await n.play()}catch(r){console.log("Error playing video",r),un()}else le().style.background="",tn(t.id)}function Tr(){if(u().src){Sr();let t=G();if(t&&"mediaSession"in navigator){let n=Ne(t),r={title:en(t),artist:"VideoQueen",artwork:[{src:n.src,sizes:`${n.naturalWidth}x${n.naturalHeight}`,type:"image/webp"}]};navigator.mediaSession.metadata=new MediaMetadata(r)}}}function dn(){let e=u();e.paused||e.pause(),_e().style.display="block",document.getElementById("sidebar").style.display="block",le().style.display="none",document.getElementById("progress-container").style.display="",ln(),ft()}function Sr(){Ve()&&(_e().style.display="none",document.getElementById("sidebar").style.display="none",le().style.display="block",document.getElementById("progress-container").style.display="none",te()),mt()}function un(){let e=u();I(`Error playing video: ${e.error?e.error.message:""}`)}function zt(e,t){return String(e).padStart(t,"0")}function Ge(e){e=Math.floor(e);let t=Math.floor(e/3600),n=Math.floor(e%3600/60),r=e%60,o=zt(r,2);if(t){let a=zt(n,2);return`${t}:${a}:${o}`}return`${n}:${o}`}var ce,ne=0;function br(){let e=u();if(e.duration){if(ce){V({info:`Scene: ${ce}`});return}let t=Ge(e.currentTime),n=Math.round(e.currentTime/e.duration*100);V({info:`Time: ${t} (${n}%)`})}}function Mr(){let e=u();V({info:`Volume: ${Math.round(e.volume*100)}%`})}function Ir(){let e=u();V({info:`Speed: ${Math.round(e.playbackRate*100)}%`})}function wr(){Fe()}function Lr(){let e=u();if(e.src&&e.paused&&m){let t=e.currentTime,n=m;dn();let r=document.getElementById(n);if(!r)return;de(n,function(o){ye(o,t,a=>{if(a.image){let l=Ne(r).src;Pe(r,a),URL.revokeObjectURL(l),Ee(n,a),x(n,s=>(s.thumbnailTime=t,s))}})})}}async function Kt(){if(document.fullscreenElement)document.exitFullscreen();else try{await le().requestFullscreen()}catch(e){console.log("fullscreen failed: ",e)}}function Wt(e,t){t.paused&&!t.error?t.play():t.pause()}var ke=null,R=0;function $e(e,t,n){if(n==1&&g){let r=e.duration*g.start,o=e.duration*(g.start+g.length);console.log(`Searching to ${t}, start=${r}, end=${o}`),(t<r||t>=o)&&(M("Exiting loop",1e3),g=void 0)}e.currentTime=t}function E(e,t){let n=parseInt(e.key);ke===n?(R+=.01,R>=1&&(R=0)):R=n/10,ke=n,$e(t,t.duration*R,1)}function B(e,t={}){return(n,r)=>{if(!t.pauseOnly||r.paused){let o=n.shiftKey&&t.shiftDelta?t.shiftDelta:e,a=r.currentTime;$e(r,Math.max(Math.min(a+o,r.duration),0),1)}}}var q,g;function Cr(e,t){if(!t.paused){I("Pause video before marking start of scene",3e3);return}q=t.currentTime/t.duration,M(`Marked start of scene at ${Ge(t.currentTime)}`,3e3)}function Hr(e,t){if(!t.paused){I("Pause video before marking end of scene",3e3);return}if(q===void 0){I("Mark start of scene before marking end",3e3);return}if(t.currentTime/t.duration-q<=0){I("Scene end must be after the start",3e3);return}document.getElementById("name-scene-dialog").showModal()}function Dr(){if(console.log("HELLO, scene confirm!"),q===void 0||!m)return;let e=u(),t=q,n=e.currentTime/e.duration,r=n-t,a=document.getElementById("save-scene-name").value.trim();a!==""&&(x(m,i=>(i.scenes=pt({start:t,length:r,name:a},i.scenes),i)),M(`Adding scene between ${t.toFixed(2)} and ${n.toFixed(2)}`,3e3),qe(m))}function xr(e){if(!g)return;let t=u();t.currentTime/t.duration>g.start+g.length&&$e(t,g.start*t.duration,2)}function Ar(e){if(!m)return;let t=e.currentTime/e.duration,n=S(m);return gt(n.scenes,t)}function Br(e,t){g=Ar(t),g&&(console.log("Will try to loop"),t.currentTime=g.start*t.duration)}function kr(e,t){if(!m)return;let n=S(m);if(n.scenes.length===0)return;let r=a=>{ce=a.name,ne&&clearTimeout(ne),ne=setTimeout(()=>{ce="",ne=0},500),t.currentTime=a.start*t.duration,t.paused&&!t.error&&t.play()},o=t.currentTime/t.duration;for(let a of n.scenes)if(a.start>o){r(a);return}r(n.scenes[0])}var Fr={Enter:Kt,f:Kt,t:Lr,p:Zt,n:Fe,PageUp:Zt,PageDown:Fe,A:qr,a:Vr,"[":Cr,"]":Hr,L:Br,s:kr,0:E,1:E,2:E,3:E,4:E,5:E,6:E,7:E,8:E,9:E,j:B(-10),l:B(10),",":B(-1/30,{pauseOnly:!0}),".":B(1/30,{pauseOnly:!0}),ArrowLeft:B(-5,{shiftDelta:-30}),ArrowRight:B(5,{shiftDelta:30})," ":Wt,k:Wt,Escape:(e,t)=>{t.paused||t.pause(),dn()},"=":(e,t)=>{t.playbackRate=1},ArrowUp:(e,t)=>{t.volume=Math.min(t.volume+.1,1)},ArrowDown:(e,t)=>{t.volume=Math.max(t.volume-.1,0)},i:()=>{G()&&V()},d:()=>{m&&x(m,e=>{let t="delete",r=e.tags.indexOf(t);return r==-1?(M(`Added '${t}' tag`,3e3),e.tags.push(t)):(M(`Removed '${t}' tag`,3e3),e.tags.splice(r,1)),e})}};function Pr(e){if(document.activeElement&&document.activeElement.tagName==="INPUT")return;if(Ve()){if(e.code==="Escape"){let n=u();n.paused&&n.src&&!n.error&&n.play(),e.preventDefault(),e.stopPropagation()}e.key==="k"&&e.ctrlKey&&(document.getElementById("search-entry").focus(),e.preventDefault(),e.stopPropagation());return}let t=Fr[e.key];t&&(t(e,u()),e.preventDefault(),e.stopPropagation())}function Ur(){d.loopSingle=!d.loopSingle,cn(),Ue()}function re(e){d.sortMode=e,sn(),an(),Ue()}function Or(){let e=document.getElementById("sort-dropdown-content");console.log("got dropdown",e),e.classList.toggle("show-dropdown");let t=Re[d.sortMode],n=document.getElementById(t.radio);n.checked=!0}function _r(e){if(!Ve()){let t=u();t.volume=Math.max(Math.min(t.volume+e.deltaY/560,1),0)}}function Nr(){let e=[],t=document.getElementsByClassName("entry");for(let n of t){let r=n;r.style.display!=="none"&&e.push(r)}return e}function mn(){return e=>!0}function Rr(e){return t=>fn(t)==e}function Qe(e,t){let n=Nr(),r=G();if(!r)return;let o=n.indexOf(r);if(!(o<0))for(let a=0;a!=n.length-1;++a){o=e?o<n.length-1?o+1:0:o>0?o-1:n.length-1;let i=n[o];if(!(i.getAttribute(L)||i.getAttribute(Q))&&t(i)){ln(),tn(i.id);break}}}function Fe(){Qe(!0,mn())}function Zt(){Qe(!1,mn())}function fn(e){let t=e.getAttribute(p)||"";if(t=="")return"";let n=t.indexOf("-");return n==-1?"":t.substr(0,n).trim().toLowerCase()}function gn(e){let t=G();if(!t)return;let n=fn(t);n!=""&&Qe(e,Rr(n))}function Vr(){gn(!0)}function qr(){gn(!1)}function Pe(e,t){let n=Ne(e),r=Object.keys(k).length;if(ie<r&&(ie++,ie==r&&$r()),t.unsupported)e.setAttribute(L,"true"),e.style.display="none";else{let o=e.querySelector(".duration-badge");o.textContent=Ge(t.duration),e.setAttribute(D,`${t.duration}`),e.setAttribute(j,`${t.height}`);let a=e.querySelector(".quality-badge");a.textContent=`${t.width}x${t.height}`,n.src=URL.createObjectURL(t.image)}}function Gr(e,t){dt(e,n=>{if(n){Pe(t,n);return}de(e,r=>{ut(r,o=>{o.image||(o={unsupported:!0}),Pe(t,o),Ee(e,o)})})})}var k={},ie=0;async function pn(e){document.getElementById("initial-view").style.display="none",St(),k={},ie=0;for(let r of document.getElementsByClassName("entry-image")){let o=r;URL.revokeObjectURL(o.src)}let t=Oe();y(t);let n=new X(64);for(let r of e){if(!nr(r.name))continue;let o=mr(r.name);t.appendChild(o),n.run(()=>yt(r).then(a=>{if(document.getElementById(a)){let l=o.querySelector(".entry-preview");if(l){l.setAttribute(Q,"true"),o.setAttribute(Q,"true");let c=document.createElement("div");c.className="dupe-badge",c.textContent=`Dupe of ${k[a].name}`,l.append(c)}let s=o.querySelector(".tag-container");s&&s.remove()}else{o.setAttribute("id",a),o.setAttribute(C,`${r.size}`);let l=o.querySelector(".file-size-badge");l.textContent=ht(r.size);let s=o.querySelector(".tag-container"),c=S(a);Ie(s,c.tags),k[a]=r}Gr(a,o)}))}}function $r(){an(),J()}function yn(){let e=Object.values(k);e.length>0&&pn(e)}async function Qr(e){e.preventDefault();let t=await st();document.getElementById("settings-dialog").close(),t&&M("Metadata exported")}async function jr(e){e.preventDefault();let t=await ct();document.getElementById("settings-dialog").close(),yn(),t&&M("Metadata imported")}function zr(){A()}function Kr(e){if(!(e.target instanceof Element&&e.target.matches("#shuffle-button")))for(let t of document.getElementsByClassName("sort-dropdown-content"))t.classList.remove("show-dropdown")}function Wr(e){let t=e.target,n=document.getElementById("top-gradient-mask"),r=document.getElementById("bottom-gradient-mask");t.scrollTop==0?n.style.opacity="0":n.style.opacity="1",t.scrollTop>=t.scrollHeight-t.offsetHeight-2?r.style.opacity="0":r.style.opacity="1"}async function Yt(e){let t={id:"boop",mode:"read",startIn:"videos"};try{let n=await globalThis.showDirectoryPicker(t),r=[],o=async i=>{for await(let[l,s]of i.entries())s.kind==="file"?r.push(s.getFile()):s.kind==="directory"&&await o(s)};await o(n);let a=await Promise.all(r);pn(a)}catch(n){console.log("errol: ",n)}}function Zr(){let e=document.getElementById("sidebar");e.setAttribute("data-flash","true"),setTimeout(()=>{e.removeAttribute("data-flash")},500),Ce()}function En(){if(d.hideDupes){let e=new CSSStyleSheet;e.replaceSync('.entry[data-dupe="true"] { display: none; }'),document.adoptedStyleSheets=[e]}else document.adoptedStyleSheets=[]}function Yr(){let e=document.getElementById("settings-hide-dupes");e.checked=d.hideDupes;let t=document.getElementById("settings-preview-video");t.checked=d.previewOnHover,document.getElementById("settings-dialog").showModal()}function Jr(){let e=document.getElementById("settings-hide-dupes");e.checked!==d.hideDupes&&(d.hideDupes=e.checked,En());let t=document.getElementById("settings-preview-video");d.previewOnHover=t.checked,Ue()}function Xr(e){let t=document.getElementById(e.contentHash);if(!t)return;let n=t.querySelector(".tag-container");n&&Ie(n,e.tags),e.contentHash==m&&qe(e.contentHash)}async function eo(){if("serviceWorker"in navigator)try{let e=await navigator.serviceWorker.register("service-worker.js",{scope:"./"});e.installing?console.log("Service worker installing"):e.waiting?console.log("Service worker installed"):e.active&&console.log("Service worker active")}catch(e){console.error(`Registration failed with ${e}`)}}globalThis.addEventListener("load",function(){globalThis.addEventListener("keydown",Pr,{capture:!0});let e=document.getElementById("search-entry");e.addEventListener("input",J),e.addEventListener("blur",A),e.addEventListener("change",Ft),e.addEventListener("keydown",Bt),e.addEventListener("focus",kt);let t=u();t.addEventListener("play",Tr,!1),t.addEventListener("error",un,!1),t.addEventListener("seeking",br,!1),t.addEventListener("volumechange",Mr,!1),t.addEventListener("ratechange",Ir,!1),t.addEventListener("ended",wr,!1),t.addEventListener("timeupdate",xr,!1),document.addEventListener("dragover",function(n){n.dataTransfer&&(n.dataTransfer.dropEffect="none"),n.preventDefault()},!1),document.addEventListener("drop",function(n){n.preventDefault()},!1),document.addEventListener("wheel",_r,!1),document.getElementById("gallery-view").addEventListener("scroll",Wr),document.getElementById("save-query-dialog").addEventListener("keydown",Vt),document.getElementById("loop-button").addEventListener("click",Ur),document.getElementById("shuffle-button").addEventListener("click",Or),document.getElementById("clear-search").addEventListener("click",Ot),document.getElementById("save-search").addEventListener("click",_t),document.getElementById("save-query-confirm").addEventListener("click",Zr),document.getElementById("saved-searches").addEventListener("dragover",n=>{n.preventDefault(),n.stopPropagation()}),document.getElementById("settings").addEventListener("click",Yr),document.getElementById("settings-confirm").addEventListener("click",Jr),document.getElementById("settings-export-tags").addEventListener("click",Qr),document.getElementById("settings-import-tags").addEventListener("click",jr),document.getElementById("open-folder").addEventListener("click",Yt),document.getElementById("initial-open-folder").addEventListener("click",Yt),document.getElementById("save-query-confirm").addEventListener("click",Dr),document.getElementById("arrange-shuffle").addEventListener("click",()=>re("shuffle")),document.getElementById("arrange-sort-az").addEventListener("click",()=>re("by_name")),document.getElementById("arrange-sort-size").addEventListener("click",()=>re("by_file_size")),document.getElementById("arrange-sort-duration").addEventListener("click",()=>re("by_duration")),document.getElementById("toast-close").addEventListener("click",te),globalThis.addEventListener("resize",zr),globalThis.addEventListener("click",Kr),eo(),rt(Xr),We(Gt),Je(ot),tt(n=>{n?it().then(()=>{Rt(),or(()=>{sn(),cn(),En(),yn()})}):I("Error opening IndexedDB")})});})();
