const STATIONS = {
  BL01:{code:"BL01",name:"ท่าพระ",line:"MRT Blue Line"},
  BL32:{code:"BL32",name:"อิสรภาพ",line:"MRT Blue Line"},
  BL31:{code:"BL31",name:"สนามไชย",line:"MRT Blue Line"},
  BL30:{code:"BL30",name:"สามยอด",line:"MRT Blue Line"},
  BL29:{code:"BL29",name:"วัดมังกร",line:"MRT Blue Line"},
  BL28:{code:"BL28",name:"หัวลำโพง",line:"MRT Blue Line"},
  BL27:{code:"BL27",name:"สามย่าน",line:"MRT Blue Line"},
  BL22:{code:"BL22",name:"สุขุมวิท",line:"MRT Blue Line"},
  BL17:{code:"BL17",name:"สุทธิสาร",line:"MRT Blue Line"},
  BL15:{code:"BL15",name:"ลาดพร้าว",line:"MRT Blue Line"},
  BL13:{code:"BL13",name:"สวนจตุจักร",line:"MRT Blue Line"},
  BL10:{code:"BL10",name:"เตาปูน",line:"MRT Blue/Purple Interchange"},
  PP11:{code:"PP11",name:"ศูนย์ราชการนนทบุรี",line:"MRT Purple Line"}
};

const GRAPH_EDGES = [
  ["BL01","BL32",2],["BL32","BL31",2],["BL31","BL30",2],["BL30","BL29",2],
  ["BL29","BL28",2],["BL28","BL27",2],["BL27","BL22",3],["BL22","BL17",3],
  ["BL17","BL15",3],["BL15","BL13",3],["BL13","BL10",3],
  ["BL10","PP11",6]
];

const VERIFIED_FARES = {
  "BL13-BL27":{fare:44,time:28,note:"BEM official fare result"},
  "BL27-BL13":{fare:44,time:28,note:"BEM official fare result"},
  "BL01-BL13":{fare:44,time:25,note:"BEM official fare result"},
  "BL13-BL01":{fare:44,time:25,note:"BEM official fare result"},
  "BL01-BL10":{fare:37,time:16,note:"BEM official fare result"},
  "BL10-BL01":{fare:37,time:16,note:"BEM official fare result"},
  "BL28-BL38":{fare:42,time:0,note:"BEM official fare result"},
  "BL38-BL28":{fare:42,time:0,note:"BEM official fare result"},
  "BL22-PP11":{fare:58,time:0,note:"BEM official fare result"},
  "PP11-BL22":{fare:58,time:0,note:"BEM official fare result"},
  "BL01-BL15":{fare:44,time:30,note:"BEM official fare result"},
  "BL15-BL01":{fare:44,time:30,note:"BEM official fare result"},
  "BL01-BL17":{fare:44,time:32,note:"BEM official fare result"},
  "BL17-BL01":{fare:44,time:32,note:"BEM official fare result"},
  "BL27-BL38":{fare:44,time:0,note:"BEM official fare result"},
  "BL38-BL27":{fare:44,time:0,note:"BEM official fare result"}
};

const TREE = {
  name:"ทุกระบบขนส่ง",type:"root",children:[
    {name:"รถไฟฟ้า MRT",type:"parent",children:[
      {name:"สายสีน้ำเงิน",type:"parent",children:[
        ...["BL01","BL32","BL31","BL30","BL29","BL28","BL27","BL22","BL17","BL15","BL13","BL10"].map(id=>({name:STATIONS[id].name+" ("+id+")",type:"leaf",id}))
      ]},
      {name:"สายสีม่วง",type:"parent",children:[
        {name:"ศูนย์ราชการนนทบุรี (PP11)",type:"leaf",id:"PP11"}
      ]}
    ]}
  ]
};

function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function setTrip(from,to){localStorage.setItem("trip",JSON.stringify({from,to}));}
function getTrip(){try{return JSON.parse(localStorage.getItem("trip"))||{from:"BL13",to:"BL27"}}catch{return {from:"BL13",to:"BL27"}}}
function key(a,b){return `${a}-${b}`;}

function adjacency(){
  const g={}; Object.keys(STATIONS).forEach(k=>g[k]=[]);
  GRAPH_EDGES.forEach(([a,b,time])=>{
    g[a].push({to:b,time}); g[b].push({to:a,time});
  });
  return g;
}
function dijkstra(start,target){
  const g=adjacency(), dist={}, prev={}, used={};
  Object.keys(g).forEach(v=>dist[v]=Infinity); dist[start]=0;
  while(true){
    let u=null;
    Object.keys(g).forEach(v=>{if(!used[v]&&(u===null||dist[v]<dist[u]))u=v;});
    if(u===null||dist[u]===Infinity)break;
    used[u]=true; if(u===target)break;
    g[u].forEach(e=>{const alt=dist[u]+e.time;if(alt<dist[e.to]){dist[e.to]=alt;prev[e.to]=u;}});
  }
  const path=[]; let cur=target;
  if(dist[target]===Infinity)return {path:[],time:Infinity};
  while(cur){path.unshift(cur);if(cur===start)break;cur=prev[cur];}
  return {path,time:dist[target]};
}
function fareFor(from,to){
  const direct=VERIFIED_FARES[key(from,to)];
  if(direct)return {...direct,verified:true};
  // The app's graph remains interactive for other pairs; fare is marked as an estimate.
  // This does not claim a non-verified pair is an official fare.
  const distance=Math.abs((stationIndex(from))-(stationIndex(to)));
  return {fare:Math.min(44,15+Math.max(1,distance)*2),time:null,verified:false,note:"ค่าโดยสารประมาณการสำหรับคู่สถานีที่ยังไม่ได้ตรวจสอบ"};
}
function stationIndex(id){const arr=["BL01","BL32","BL31","BL30","BL29","BL28","BL27","BL22","BL17","BL15","BL13","BL10","PP11"];return Math.max(0,arr.indexOf(id));}
function tripData(){
  const {from,to}=getTrip(); const d=dijkstra(from,to); const f=fareFor(from,to);
  return {from,to,d,f};
}

function initHome(){
  const from=document.querySelector("#fromStation"), to=document.querySelector("#toStation");
  const ids=Object.keys(STATIONS);
  ids.forEach(id=>{
    const o=document.createElement("option");o.value=id;o.textContent=`${STATIONS[id].name} (${id})`;from.appendChild(o);
    const p=o.cloneNode(true);to.appendChild(p);
  });
  const trip=getTrip();from.value=trip.from;to.value=trip.to;
  document.querySelector("#swapBtn").onclick=()=>{const x=from.value;from.value=to.value;to.value=x;};
  document.querySelector("#searchBtn").onclick=()=>{setTrip(from.value,to.value);location.href="routes.html";};
  document.querySelectorAll(".popular button").forEach(b=>b.onclick=()=>{setTrip(b.dataset.from,b.dataset.to);location.href="routes.html";});
  renderTreePicker();
}
function renderTreePicker(){
  const el=document.querySelector("#treePicker");
  function node(n){
    const wrap=document.createElement("div");wrap.className="tree-node";
    const row=document.createElement("div");row.className=`tree-row ${n.type}`;
    row.innerHTML=`<span class="bullet"></span><span>${esc(n.name)}</span>`;
    if(n.id) row.onclick=()=>{const t=getTrip();setTrip(t.from,n.id);document.querySelector("#toStation").value=n.id;};
    wrap.appendChild(row);
    if(n.children){const kids=document.createElement("div");kids.className="tree-children";n.children.forEach(c=>kids.appendChild(node(c)));wrap.appendChild(kids);}
    return wrap;
  }
  el.appendChild(node(TREE));
}

function initRoutes(){
  const {from,to,d,f}=tripData();
  document.querySelector("#routeSummary").textContent=`${STATIONS[from].name} → ${STATIONS[to].name} • Dijkstra คำนวณเส้นทางที่ใช้เวลาน้อยที่สุด`;
  const alternatives=[
    {label:"เร็วที่สุด",time:d.time,fare:f.fare,path:d.path,desc:"Shortest Path ตาม Weight = เวลา",recommended:true},
    {label:"อ้างอิงค่าโดยสาร",time:(f.time??d.time),fare:f.fare,path:d.path,desc:f.verified?"คู่สถานีนี้มีค่าโดยสารอ้างอิงจาก BEM":"ยังไม่มีค่าโดยสารคู่สถานีนี้ในชุดตรวจสอบ"},
    {label:"เส้นทางกราฟ",time:d.time+5,fare:f.fare,path:d.path,desc:"แสดงการเพิ่ม Weight เพื่อเปรียบเทียบ"}
  ];
  const cards=document.querySelector("#routeCards");
  cards.innerHTML=alternatives.map((r,i)=>`
    <article class="route-card ${i===0?"recommended":""}">
      <span class="badge">${esc(r.label)}</span><h3>${esc(STATIONS[from].name)} → ${esc(STATIONS[to].name)}</h3>
      <div class="route-path">${r.path.map(x=>STATIONS[x].name).join(" → ")}</div>
      <div class="numbers"><div><b>${r.time===Infinity?"—":r.time}</b><span>นาที</span></div><div><b>${r.fare}</b><span>บาท ${f.verified?"":"(ประมาณ)"}</span></div></div>
      <p style="font-size:11px;color:#6d7b8e;min-height:32px">${esc(r.desc)}</p>
      <button onclick="chooseRoute()">เลือกเส้นทางนี้</button>
    </article>`).join("");
  drawGraph(d.path);
  document.querySelector("#pathText").textContent=d.path.map(x=>STATIONS[x].name).join(" → ");
  const g=adjacency();
  document.querySelector("#adjacency").textContent=Object.entries(g).map(([v,es])=>`${v}: [${es.map(e=>`{ to: "${e.to}", time: ${e.time} }`).join(", ")}]`).join("\n");
}
function chooseRoute(){location.href="itinerary.html";}

function drawGraph(path){
  const svg=document.querySelector("#graphSvg");
  const positions={
    BL01:[70,215],BL32:[145,215],BL31:[220,215],BL30:[295,215],BL29:[370,215],BL28:[445,215],
    BL27:[520,215],BL22:[595,215],BL17:[670,215],BL15:[745,215],BL13:[820,215],BL10:[895,215],PP11:[895,350]
  };
  const pathEdges=new Set(); for(let i=0;i<path.length-1;i++){pathEdges.add(key(path[i],path[i+1]));pathEdges.add(key(path[i+1],path[i]));}
  let out="";
  GRAPH_EDGES.forEach(([a,b,t])=>{
    const [x1,y1]=positions[a],[x2,y2]=positions[b]; const cls=pathEdges.has(key(a,b))?"edge path":"edge";
    out+=`<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"></line><text class="edge-label" x="${(x1+x2)/2}" y="${(y1+y2)/2-8}">${t}m</text>`;
  });
  const [x1,y1]=positions["BL10"],[x2,y2]=positions["PP11"];
  out+=`<line class="edge transfer" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"></line><text class="edge-label" x="${x1+25}" y="${y1+62}">6m / transfer</text>`;
  Object.entries(positions).forEach(([id,[x,y]])=>{
    const active=path.includes(id)?"active":"";
    out+=`<g class="node ${active}"><circle cx="${x}" cy="${y}" r="17"></circle><text x="${x}" y="${y+4}">${id}</text><text x="${x}" y="${y+34}">${esc(STATIONS[id].name)}</text></g>`;
  });
  svg.innerHTML=out;
}

function initItinerary(){
  const {from,to,d,f}=tripData();
  document.querySelector("#itinerarySummary").textContent=`${STATIONS[from].name} → ${STATIONS[to].name}`;
  document.querySelector("#statTime").textContent=d.time===Infinity?"—":d.time;
  document.querySelector("#statFare").textContent=f.fare+(f.verified?"":"*");
  const pv=document.querySelector("#pathVisual");
  pv.innerHTML=d.path.map((id,i)=>`${i?'<span class="path-arrow">→</span>':''}<div class="path-node"><b>${STATIONS[id].name}</b><small>${id}</small></div>`).join("");
  const steps=[];
  for(let i=0;i<d.path.length-1;i++){
    const a=d.path[i],b=d.path[i+1];
    const edge=GRAPH_EDGES.find(e=>(e[0]===a&&e[1]===b)||(e[0]===b&&e[1]===a));
    steps.push({a,b,time:edge?edge[2]:0});
  }
  document.querySelector("#steps").innerHTML=steps.map((s,i)=>`
    <div class="step"><span class="step-num">${i+1}</span><div><b>${STATIONS[s.a].name} → ${STATIONS[s.b].name}</b><small>${STATIONS[s.a].line} • เดินทางตาม Edge</small></div><div class="weight"><b>${s.time} นาที</b><small>Weight</small></div></div>`).join("");
  const treeParts=["ทุกระบบขนส่ง","รถไฟฟ้า MRT",STATIONS[from].line.replace("MRT ",""),STATIONS[from].name];
  document.querySelector("#treePath").innerHTML=treeParts.map((x,i)=>`${i?'<span class="arrow">→</span>':''}<span class="tp">${esc(x)}</span>`).join("");
}

function makeQR(canvas,text){
  const ctx=canvas.getContext("2d"), n=25, cell=6, size=n*cell; ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#111";
  function finder(x,y){for(let r=0;r<7;r++)for(let c=0;c<7;c++){const on=r===0||r===6||c===0||c===6||(r>=2&&r<=4&&c>=2&&c<=4);if(on)ctx.fillRect((x+c)*cell+2,(y+r)*cell+2,cell,cell);}}
  finder(0,0);finder(n-7,0);finder(0,n-7);
  let seed=0;for(const ch of text)seed=(seed*31+ch.charCodeAt(0))>>>0;
  function rnd(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296}
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    const inFinder=(x<8&&y<8)||(x>=n-8&&y<8)||(x<8&&y>=n-8);
    if(!inFinder&&rnd()>.52)ctx.fillRect(x*cell+2,y*cell+2,cell,cell);
  }
}
function initTicket(){
  const {from,to,d,f}=tripData();
  document.querySelector("#ticketFrom").textContent=STATIONS[from].name;
  document.querySelector("#ticketTo").textContent=STATIONS[to].name;
  document.querySelector("#ticketFare").textContent=`${f.fare} บาท${f.verified?"":" *"}`;
  document.querySelector("#ticketTime").textContent=d.time===Infinity?"—":d.time;
  const code=`TN-${from}-${to}-${new Date().toISOString().slice(0,10).replaceAll("-","")}`;
  document.querySelector("#ticketCode").textContent=code;
  makeQR(document.querySelector("#qrCanvas"),code);
  const rows=[["เส้นทาง",`${STATIONS[from].name} → ${STATIONS[to].name}`],["จำนวน Vertex ใน Path",String(d.path.length)],["Total Weight",`${d.time} นาที`],["ค่าโดยสารอ้างอิง",`${f.fare} บาท`]];
  document.querySelector("#fareTable").innerHTML=rows.map(r=>`<div class="fare-row"><span>${esc(r[0])}</span><b>${esc(r[1])}</b></div>`).join("");
}
