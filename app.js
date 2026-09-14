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
