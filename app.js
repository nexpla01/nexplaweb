const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

document.addEventListener("DOMContentLoaded", () => {

  // Living Nexpla intelligence network: deterministic, lightweight, no external library.
  const networkRoot = document.getElementById("heroNetwork");
  const linesLayer = document.getElementById("networkLines");
  const nodesLayer = document.getElementById("networkNodes");
  const particlesLayer = document.getElementById("networkParticles");
  if (networkRoot && linesLayer && nodesLayer && particlesLayer) {
    const NS = "http://www.w3.org/2000/svg";
    const cx = 310, cy = 310;
    const nodes = [
      {x:158,y:170,r:21,key:"ERP"},
      {x:458,y:155,r:18,key:"DATA"},
      {x:500,y:340,r:20,key:"AI"},
      {x:390,y:485,r:18,key:"ECOSYSTEM"},
      {x:135,y:390,r:17,key:"WORKFLOWS"},
      {x:310,y:82,r:9,key:"context"},
      {x:560,y:245,r:7,key:"signal"},
      {x:235,y:525,r:8,key:"data"},
      {x:75,y:275,r:7,key:"workflow"},
      {x:420,y:70,r:6,key:"agent"}
    ];
    const edges = [
      [0,1],[0,4],[0,5],[1,2],[1,9],[2,3],[2,6],[3,4],[3,7],[4,5],[4,8],[5,9],[0,9],[1,5]
    ];
    const lineEls = edges.map((e,i)=>{
      const a=nodes[e[0]],b=nodes[e[1]];
      const l=document.createElementNS(NS,"line");
      l.setAttribute("x1",a.x);l.setAttribute("y1",a.y);l.setAttribute("x2",b.x);l.setAttribute("y2",b.y);
      l.classList.add("network-line"); if(i<5) l.classList.add("strong");
      l.style.animationDelay=`-${i*.31}s`; linesLayer.appendChild(l); return l;
    });
    nodes.forEach((n,i)=>{
      const g=document.createElementNS(NS,"g"); g.classList.add("node-group");
      const c=document.createElementNS(NS,"circle"); c.setAttribute("cx",n.x);c.setAttribute("cy",n.y);c.setAttribute("r",n.r); c.classList.add("network-node");
      if(i>4) c.classList.add("network-node-core");
      const inner=document.createElementNS(NS,"circle"); inner.setAttribute("cx",n.x);inner.setAttribute("cy",n.y);inner.setAttribute("r",Math.max(2.2,n.r*.22)); inner.setAttribute("fill","#106860");
      g.appendChild(c);g.appendChild(inner);nodesLayer.appendChild(g);
      g.style.animation=`nodeFloat ${3.2 + (i%4)*.45}s ease-in-out infinite`;
      g.style.animationDelay=`-${i*.27}s`;
    });
    for(let i=0;i<22;i++){
      const p=document.createElementNS(NS,"circle");
      p.classList.add("network-particle");
      p.setAttribute("r", i%4===0?2.4:1.3);
      const a=(i*137.5)*Math.PI/180, rad=105+(i%7)*27;
      p.dataset.baseX=cx+Math.cos(a)*rad; p.dataset.baseY=cy+Math.sin(a)*rad;
      p.dataset.phase=i*.7; p.dataset.rad=rad; p.dataset.angle=a;
      particlesLayer.appendChild(p);
    }
    let t=0, mx=0, my=0, tx=0, ty=0;
    networkRoot.addEventListener("pointermove", e=>{
      const r=networkRoot.getBoundingClientRect();
      tx=((e.clientX-r.left)/r.width-.5)*12;
      ty=((e.clientY-r.top)/r.height-.5)*12;
    });
    networkRoot.addEventListener("pointerleave",()=>{tx=0;ty=0});
    const animate=()=>{
      t+=.006; mx+=(tx-mx)*.045; my+=(ty-my)*.045;
      networkRoot.style.transform=`perspective(900px) rotateX(${-my*.28}deg) rotateY(${mx*.28}deg)`;
      [...particlesLayer.children].forEach((p,i)=>{
        const base=+p.dataset.rad, ang=+p.dataset.angle, phase=+p.dataset.phase;
        const a=ang+t*(i%2?0.32:-0.23);
        const rr=base+Math.sin(t*1.7+phase)*7;
        p.setAttribute("cx",cx+Math.cos(a)*rr); p.setAttribute("cy",cy+Math.sin(a)*rr);
        p.style.opacity=.22+.28*(.5+.5*Math.sin(t*2+phase));
      });
      requestAnimationFrame(animate);
    };
    const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(!reduce) requestAnimationFrame(animate);
  }

  // V4 cinematic hero: a continuous story from fragmented context to intelligence.
  const hero = document.getElementById("heroNetwork");
  const storyLines = document.getElementById("storyLines");
  const storyNodes = document.getElementById("storyNodes");
  const storySignals = document.getElementById("storySignals");
  const sceneState = document.getElementById("sceneState");
  const sceneMetric = document.getElementById("sceneMetric");
  const sceneMetricValue = document.getElementById("sceneMetricValue");
  if(hero && storyLines && storyNodes && storySignals){
    const NS="http://www.w3.org/2000/svg", cx=350, cy=300;
    const nodes=[
      {x:110,y:145,r:17,key:"inventory"},{x:225,y:82,r:14,key:"orders"},{x:475,y:86,r:15,key:"customers"},
      {x:590,y:155,r:17,key:"purchases"},{x:610,y:385,r:15,key:"collections"},{x:475,y:510,r:16,key:"workflows"},
      {x:225,y:515,r:14,key:"finance"},{x:95,y:385,r:16,key:"distribution"}
    ];
    const edges=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[0,7],[1,7],[2,5],[3,5],[4,6],[0,2]];
    edges.forEach((e,i)=>{const a=nodes[e[0]],b=nodes[e[1]],l=document.createElementNS(NS,"line");l.setAttribute("x1",a.x);l.setAttribute("y1",a.y);l.setAttribute("x2",b.x);l.setAttribute("y2",b.y);l.classList.add("story-line");if(i%3===0)l.classList.add("hot");l.style.animationDelay=`-${i*.19}s`;storyLines.appendChild(l)});
    nodes.forEach((n,i)=>{const g=document.createElementNS(NS,"g");g.classList.add("story-node-group");const c=document.createElementNS(NS,"circle");c.setAttribute("cx",n.x);c.setAttribute("cy",n.y);c.setAttribute("r",n.r);c.classList.add("story-node");const d=document.createElementNS(NS,"circle");d.setAttribute("cx",n.x);d.setAttribute("cy",n.y);d.setAttribute("r",3.2);d.classList.add("story-node-dot");g.append(c,d);g.style.animation=`nodeFloat ${3.5+(i%4)*.35}s ease-in-out infinite`;g.style.animationDelay=`-${i*.25}s`;storyNodes.appendChild(g)});
    for(let i=0;i<16;i++){const p=document.createElementNS(NS,"circle");p.setAttribute("r",i%3===0?2.6:1.5);p.classList.add("story-signal");p.dataset.i=i;p.dataset.a=(i/16)*Math.PI*2;p.dataset.r=155+(i%5)*22;storySignals.appendChild(p)}
    let t=0,mx=0,my=0,tx=0,ty=0;
    hero.addEventListener("pointermove",e=>{const r=hero.getBoundingClientRect();tx=((e.clientX-r.left)/r.width-.5)*10;ty=((e.clientY-r.top)/r.height-.5)*8});
    hero.addEventListener("pointerleave",()=>{tx=0;ty=0});
    const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animateHero=()=>{t+=.008;mx+=(tx-mx)*.04;my+=(ty-my)*.04;document.querySelector(".hero-story-svg").style.transform=`perspective(1000px) rotateX(${-my*.35}deg) rotateY(${mx*.35}deg)`;document.querySelector(".hero-scene-backdrop").style.transform=`translate(${mx*.35}px,${my*.25}px)`;[...storySignals.children].forEach((p,i)=>{const a=+p.dataset.a+t*(i%2?.22:-.17),r=+p.dataset.r+Math.sin(t*1.5+i)*8;p.setAttribute("cx",cx+Math.cos(a)*r);p.setAttribute("cy",cy+Math.sin(a)*r);p.style.opacity=.25+.4*(.5+.5*Math.sin(t*2+i))});if(!reduce)requestAnimationFrame(animateHero)};
    if(!reduce)requestAnimationFrame(animateHero);

    const setStage=(stage)=>{hero.classList.remove("hero-scene-stage-2","hero-scene-stage-3","hero-scene-stage-4");if(stage>1)hero.classList.add(`hero-scene-stage-${stage}`);const copy={1:["CONNECTING THE ECOSYSTEM","YEARS OF PHARMA CONTEXT","→ ONE INTELLIGENCE LAYER"],2:["CONTEXT BECOMES VISIBLE","DATA · WORKFLOWS · CUSTOMERS","→ A SHARED UNDERSTANDING"],3:["INTELLIGENCE LAYER ACTIVE","UNDERSTAND · DECIDE · EXECUTE","→ ACTION, NOT JUST ANSWERS"],4:["BUILT FOR THE ECOSYSTEM","ERP · INTELLIGENCE · PLATFORM","→ OTHERS BUILD ON IT"]}[stage];if(copy){sceneState.textContent=copy[0];sceneMetric.textContent=copy[1];sceneMetricValue.textContent=copy[2]}};
    let lastStage=1;
    const updateStage=()=>{const rect=hero.getBoundingClientRect(),p=Math.max(0,Math.min(1,(window.innerHeight*.72-rect.top)/(rect.height*.95)));const stage=p<.25?1:p<.52?2:p<.78?3:4;if(stage!==lastStage){lastStage=stage;setStage(stage)}};
    window.addEventListener("scroll",updateStage,{passive:true});updateStage();
  }


  // V6 — real spatial scene: Three.js + GSAP ScrollTrigger + DOM/WebGL sync.
  // The scene is deliberately sparse: scroll changes the composition, not just scale.
  if (window.THREE && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const section = document.querySelector('.cinematic-hero');
    const canvas = document.getElementById('nexplaCanvas');
    const stage = document.getElementById('nexplaStage');
    if (section && canvas && stage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:'high-performance'});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
      renderer.setClearColor(0xffffff, 0);
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-6,6,4.2,-4.2,.1,100);
      camera.position.z=20;

      const group = new THREE.Group();
      scene.add(group);
      const network = new THREE.Group();
      group.add(network);
      const points=[];
      const base=[[-3.3,1.6],[-2.7,-.5],[-1.9,-2.0],[2.8,1.7],[3.2,.1],[2.5,-1.9],[-.2,2.5],[.2,-2.55]];
      base.forEach((p,i)=>{
        const geo=new THREE.CircleGeometry(i<6?.085:.065,24);
        const mat=new THREE.MeshBasicMaterial({color:i<6?0x106860:0x6fa6a0,transparent:true,opacity:i<6?.85:.55});
        const m=new THREE.Mesh(geo,mat);m.position.set(p[0],p[1],0);m.userData={baseX:p[0],baseY:p[1],i};network.add(m);points.push(m);
      });
      const lineMat=new THREE.LineBasicMaterial({color:0x74aaa4,transparent:true,opacity:.24});
      const lineGroup=new THREE.Group(); network.add(lineGroup);
      const edgePairs=[[0,6],[6,3],[3,4],[4,5],[5,7],[7,2],[2,1],[1,0],[6,7],[1,6],[4,7]];
      const lines=[];
      edgePairs.forEach(([a,b])=>{
        const g=new THREE.BufferGeometry().setFromPoints([points[a].position.clone(),points[b].position.clone()]);
        const l=new THREE.Line(g,lineMat.clone());lineGroup.add(l);lines.push(l);
      });
      // Fine particles give depth without turning the scene into a noisy starfield.
      const particleCount=100, arr=new Float32Array(particleCount*3);
      for(let i=0;i<particleCount;i++){const a=Math.random()*Math.PI*2,r=2+Math.random()*3.2;arr[i*3]=Math.cos(a)*r;arr[i*3+1]=Math.sin(a)*r*.72;arr[i*3+2]=(Math.random()-.5)*.2}
      const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(arr,3));
      const pm=new THREE.PointsMaterial({color:0x6fa6a0,size:.025,transparent:true,opacity:.42,sizeAttenuation:true});
      const particles=new THREE.Points(pg,pm);network.add(particles);
      const glow=new THREE.Mesh(new THREE.CircleGeometry(2.1,64),new THREE.MeshBasicMaterial({color:0x106860,transparent:true,opacity:.055,depthWrite:false}));group.add(glow);
      const core=new THREE.Mesh(new THREE.CircleGeometry(.82,64),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.98}));group.add(core);
      const coreRing=new THREE.Mesh(new THREE.RingGeometry(.82,.84,64),new THREE.MeshBasicMaterial({color:0x106860,transparent:true,opacity:.5,side:THREE.DoubleSide}));group.add(coreRing);
      let logo;
      new THREE.TextureLoader().load('assets/nexpla-icon.png',tex=>{
        const mat=new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false});
        logo=new THREE.Sprite(mat);logo.scale.set(1.0,1.0,1);logo.position.z=.2;group.add(logo);
      });
      const actionGroup=new THREE.Group();actionGroup.position.set(2.0,-.1,.3);actionGroup.scale.set(.001,.001,.001);scene.add(actionGroup);

      const resize=()=>{const r=stage.getBoundingClientRect();const w=Math.max(1,r.width),h=Math.max(1,r.height),aspect=w/h;const view=4.2;camera.top=view;camera.bottom=-view;camera.left=-view*aspect;camera.right=view*aspect;camera.updateProjectionMatrix();renderer.setSize(w,h,false)};
      resize();window.addEventListener('resize',resize,{passive:true});
      let mouseX=0,mouseY=0,smx=0,smy=0;stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();mouseX=((e.clientX-r.left)/r.width-.5)*.28;mouseY=((e.clientY-r.top)/r.height-.5)*.22});stage.addEventListener('pointerleave',()=>{mouseX=0;mouseY=0});
      const render=()=>{smx+=(mouseX-smx)*.04;smy+=(mouseY-smy)*.04;network.rotation.y=smx;network.rotation.x=smy;particles.rotation.z+=.00035;glow.scale.setScalar(1+Math.sin(performance.now()*.0012)*.035);coreRing.rotation.z+=.001;renderer.render(scene,camera);requestAnimationFrame(render)};render();

      const $v=s=>stage.querySelector(s); const chips=gsap.utils.toArray(stage.querySelectorAll('.data-card-v6'));
      const copy=$v('.hero-copy-v6'),ui=$v('.stage-ui'),headline=$v('#v6Headline'),subline=$v('#v6Subline'),state=$v('#v6State');
      const legacy=$v('#legacyUI'),action=$v('#actionUI'),transform=$v('#transformPill'),platform=$v('#platformPill'),scrollCue=$v('.stage-scroll');
      gsap.set(chips,{opacity:0,y:18,scale:.94});gsap.set(ui,{opacity:0,y:18});gsap.set(legacy,{opacity:0});gsap.set(action,{opacity:0});gsap.set(transform,{opacity:0,y:15});gsap.set(platform,{opacity:0,y:15});
      const tl=gsap.timeline({scrollTrigger:{trigger:section,start:'top top',end:'bottom bottom',scrub:1.05}});
      // 0–22%: establish the world.
      tl.to(copy,{opacity:1,duration:.5},0)
        .to(ui,{opacity:1,y:0,duration:.6},.05)
        .to(chips,{opacity:.9,y:0,scale:1,duration:.7,stagger:.06},.08)
        .to(network.scale,{x:1,y:1,z:1,duration:.7},0)
        // 22–42%: fragments connect and converge.
        .to(chips,{x:0,y:0,opacity:.25,scale:.82,duration:1.1,stagger:.03},.95)
        .to(copy,{opacity:.22,x:-35,duration:.8},1.0)
        .to(network.scale,{x:1.13,y:1.13,z:1.13,duration:1},1.05)
        .to(camera.position,{x:.35,y:.05,z:18.3,duration:1},1.05)
        .call(()=>{state.textContent='CONTEXT BECOMES VISIBLE';headline.textContent='The context already exists.';subline.textContent='Data · Workflows · Customers · Business logic'},[],1.2)
        // 42–62%: enter intelligence layer.
        .to(legacy,{opacity:1,y:0,duration:.7},1.78)
        .call(()=>{state.textContent='SYSTEM OF RECORD';headline.textContent='The software already knows the business.';subline.textContent='A familiar system. Decades of operational context.'},[],1.8)
        .to(ui,{y:-25,opacity:.7,duration:.6},1.9)
        .to(network.scale,{x:1.48,y:1.48,z:1.48,duration:1.2},1.95)
        .to(glow.scale,{x:1.25,y:1.25,z:1.25,duration:1},2.0)
        .to(core.scale,{x:1.15,y:1.15,z:1.15,duration:1},2.0)
        .to(legacy,{opacity:.12,y:-20,duration:.65},2.12)
        .to(transform,{opacity:1,y:0,duration:.7},2.25)
        .call(()=>{state.textContent='INTELLIGENCE LAYER ACTIVE';headline.textContent='Understand · Decide · Execute.';subline.textContent='Not just answers. Action inside the workflow.'},[],2.3)
        // 62–80%: the spatial network morphs into the action UI.
        .to(transform,{opacity:0,y:-12,duration:.5},3.0)
        .to(network.scale,{x:1.7,y:1.7,z:1.7,duration:.8},3.0)
        .to(action,{opacity:1,x:0,y:0,duration:1},3.05)
        .to(ui,{opacity:0,y:-35,duration:.5},3.1)
        .to(core.scale,{x:.82,y:.82,z:.82,duration:.7},3.15)
        .call(()=>{state.textContent='ACTION INSIDE THE WORKFLOW';headline.textContent='From insight to action.';subline.textContent='The system can do the work.'},[],3.35)
        // 80–100%: pull back and reveal platform.
        .to(action,{opacity:.15,x:0,y:-20,scale:.86,duration:.8},4.0)
        .to(network.scale,{x:1.05,y:1.05,z:1.05,duration:1.1},4.0)
        .to(camera.position,{x:0,y:0,z:20,duration:1.1},4.0)
        .to(platform,{opacity:1,y:0,duration:.7},4.25)
        .to(copy,{opacity:0,x:-70,duration:.8},4.15)
        .call(()=>{state.textContent='BUILT FOR THE ECOSYSTEM';headline.textContent='Start with ERP. Build beyond it.';subline.textContent='ERP · Intelligence · APIs · Agents · Services'},[],4.35)
        .to(scrollCue,{opacity:0,duration:.4},4.3);
      // Text/canvas sync: the DOM remains crisp while the WebGL layer moves underneath it.
    }
  } else {
    document.documentElement.classList.add('motion-fallback');
  }

  $("#year").textContent = new Date().getFullYear();

  // Scroll progress
  const progress = $("#scrollProgress");
  const updateProgress = () => {
    const h = document.documentElement;
    const pct = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  };
  window.addEventListener("scroll", updateProgress, {passive:true});
  updateProgress();

  // Reveal on scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  $$(".reveal").forEach(el => io.observe(el));

  // Mobile menu
  const mobileMenu = $("#mobileMenu"), mobileNav = $("#mobileNav");
  mobileMenu.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("open");
    mobileMenu.setAttribute("aria-expanded", open);
  });
  $$("#mobileNav a, #mobileNav button").forEach(el => el.addEventListener("click", () => mobileNav.classList.remove("open")));

  // Partner modal
  const modal = $("#partnerModal");
  const openPartner = () => { modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); document.body.classList.add("modal-open"); };
  const closePartner = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); document.body.classList.remove("modal-open"); };
  $$("[data-open-partner]").forEach(el => el.addEventListener("click", openPartner));
  $("#closePartner").addEventListener("click", closePartner);
  modal.addEventListener("click", e => { if(e.target === modal) closePartner(); });
  document.addEventListener("keydown", e => { if(e.key === "Escape"){ closePartner(); closeAsk(); }});

  $("#partnerForm").addEventListener("submit", e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Nexpla confidential enquiry — ${data.get("company")}`);
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nCompany: ${data.get("company")}\nRole: ${data.get("role")}\nEmail: ${data.get("email")}\n\nWhat they want to explore:\n${data.get("message") || "(not specified)"}`
    );
    $("#formSuccess").classList.add("show");
    window.setTimeout(() => { window.location.href = `mailto:rc@nexpla.com?subject=${subject}&body=${body}`; }, 350);
  });

  // AI demo workflows
  const workflows = {
    collections: {
      prompt: "Show me today’s outstanding payments from my top 20 distributors.",
      value: "₹18.4L", label: "Total Outstanding", secondary:"7",
      intro:"Here’s what I found.", success:"Purchase order created successfully."
    },
    inventory: {
      prompt: "Which SKUs are at risk of stock-out this week?",
      value: "18", label: "SKUs At Risk", secondary:"6",
      intro:"I found 18 SKUs that need attention.", success:"Replenishment recommendations prepared."
    },
    procurement: {
      prompt: "What should we reorder today based on demand and current stock?",
      value: "₹12.8L", label: "Recommended Purchase", secondary:"24",
      intro:"Here’s the recommended purchase plan.", success:"Draft purchase orders prepared for review."
    },
    action: {
      prompt: "Create a purchase order for ABC Pharma for 5,000 units of Amoxicillin 250mg.",
      value: "5,000", label: "Units Ready", secondary:"1",
      intro:"I can complete that action for you.", success:"Purchase order created successfully."
    }
  };
  $$(".ai-mode").forEach(btn => btn.addEventListener("click", () => {
    $$(".ai-mode").forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    const d = workflows[btn.dataset.workflow];
    $("#userPrompt").textContent = d.prompt;
    $("#responseValue").textContent = d.value;
    $("#responseLabel").textContent = d.label;
    $("#responseSecondary").textContent = d.secondary;
    $("#responseIntro").textContent = d.intro;
    $("#successText").textContent = d.success;
  }));

  // Workflow cards
  const workflowQuestions = {
    Inventory:"Which SKUs are at risk of stock-out this week?",
    Procurement:"What should we reorder today?",
    Sales:"Which orders need attention right now?",
    Distribution:"Which deliveries are delayed?",
    Collections:"Which distributors should we follow up with today?",
    Finance:"What changed in cash flow this week?",
    Orders:"Create the next priority purchase order.",
    Compliance:"Which exceptions need attention?"
  };
  $$(".workflow-card").forEach(card => card.addEventListener("click", () => {
    $$(".workflow-card").forEach(x => x.classList.remove("active"));
    card.classList.add("active");
    const name = card.dataset.detail;
    $("#workflowAnswer b").textContent = `“${workflowQuestions[name]}”`;
  }));

  // Ask Nexpla mini-assistant
  const askPanel = $("#askPanel"), askFab = $("#askFab"), askMessages = $("#askMessages"), askInput = $("#askInput");
  const openAsk = () => { askPanel.classList.add("open"); askPanel.setAttribute("aria-hidden","false"); setTimeout(()=>askInput.focus(),120); };
  const closeAsk = () => { askPanel.classList.remove("open"); askPanel.setAttribute("aria-hidden","true"); };
  askFab.addEventListener("click", () => askPanel.classList.contains("open") ? closeAsk() : openAsk());
  $("#closeAsk").addEventListener("click", closeAsk);

  const answers = [
    {
      keys:["why pharma","pharma"],
      text:"Pharma is a deeply embedded, fragmented software ecosystem. The opportunity is not simply to replace it — it is to make the software, workflows and data that already run the industry intelligent."
    },
    {
      keys:["why start","erp"],
      text:"ERP sits at the centre of day-to-day operations. It carries customer relationships, years of data, embedded workflows and domain context. That makes it the right foundation for an AI-native transformation."
    },
    {
      keys:["platform","intelligent layer","work"],
      text:"Nexpla builds an intelligent layer on top of the ERP: Understand, Decide, Execute. Over time that layer exposes APIs, agents and services that other businesses and ecosystem partners can build on."
    },
    {
      keys:["hard to enter","ecosystem","barrier","neutral"],
      text:"The barrier is not only technology. Pharma software is trusted, deeply embedded and fragmented across many platforms. Nexpla builds from inside the ecosystem by partnering with established ERP businesses."
    }
  ];
  function getAnswer(q){
    const lower = q.toLowerCase();
    const hit = answers.find(a => a.keys.some(k => lower.includes(k)));
    return hit ? hit.text : "Nexpla is building the intelligence layer for Pharma — partnering with the software that already runs the industry and bringing AI to the workflows, data and business context inside it. Try asking “Why Pharma?”, “Why start with ERP?”, or “How does the platform work?”";
  }
  function addMsg(text, cls){
    const div = document.createElement("div");
    div.className = cls;
    div.textContent = text;
    askMessages.appendChild(div);
    askMessages.scrollTop = askMessages.scrollHeight;
  }
  function ask(q){
    if(!q.trim()) return;
    addMsg(q, "user-msg");
    setTimeout(()=>addMsg(getAnswer(q), "assistant-msg"), 280);
  }
  $("#askForm").addEventListener("submit", e => { e.preventDefault(); ask(askInput.value); askInput.value=""; });
  $$(".suggestions button").forEach(b => b.addEventListener("click", () => ask(b.textContent)));
});
