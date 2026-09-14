const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

document.addEventListener("DOMContentLoaded", () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const section = $("#vision");
  const stage = $("#nexplaStage");
  // V6.2: dependency-free scroll narrative.
  // The DOM spatial scene is always visible. Canvas adds motion when supported.
  const setScene = p => {
    const cards = $$(".spatial-card");
    cards.forEach((c,i)=>{
      const angle=(i/cards.length)*Math.PI*2;
      const active=Math.min(1,Math.max(0,(p-.12)/.32));
      const pull=Math.max(0,active-.55);
      c.style.transform=`translate(${Math.cos(angle)*pull*35}px,${Math.sin(angle)*pull*24}px)`;
      c.style.opacity=String(1-Math.max(0,(p-.56)/.18)*.72);
    });
    const core=$(".spatial-core");
    if(core){
      const active=Math.min(1,Math.max(0,(p-.34)/.3));
      core.style.transform=`translate(-50%,-50%) scale(${1+active*.16})`;
      core.style.boxShadow=`0 0 0 ${32+active*18}px rgba(16,104,96,.025),0 ${24+active*12}px ${70+active*25}px rgba(16,104,96,${.13+active*.06})`;
    }
    const state=$("#v6State"),headline=$("#v6Headline"),subline=$("#v6Subline");
    const copy=[
      ["THE SOFTWARE ALREADY KNOWS THE BUSINESS","Context already exists.","Inventory · Orders · Customers · Workflows"],
      ["CONTEXT BECOMES CONNECTED","The context comes together.","Data · Workflows · Customers · Business logic"],
      ["INTELLIGENCE LAYER ACTIVE","Understand · Decide · Execute.","Not just answers. Action inside the workflow."],
      ["ACTION INSIDE THE WORKFLOW","From insight to action.","The system can do the work."],
      ["BUILT FOR THE ECOSYSTEM","Start with ERP. Build beyond it.","ERP · Intelligence · APIs · Agents · Services"]
    ];
    const idx=p<.22?0:p<.43?1:p<.66?2:p<.82?3:4;
    if(state)state.textContent=copy[idx][0];
    if(headline)headline.textContent=copy[idx][1];
    if(subline)subline.textContent=copy[idx][2];
  };

  const hero=$("#vision");
  const onScroll=()=>{
    if(!hero)return;
    const r=hero.getBoundingClientRect();
    const p=Math.max(0,Math.min(1,(window.innerHeight-r.top)/(r.height-window.innerHeight)));
    setScene(p);
  };
  window.addEventListener("scroll",onScroll,{passive:true});
  window.addEventListener("resize",onScroll,{passive:true});
  onScroll();

  const canvas=$("#nexplaCanvas");
  if(canvas){
    const ctx=canvas.getContext("2d");
    if(ctx){
      const resize=()=>{const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(r.width*d));canvas.height=Math.max(1,Math.round(r.height*d));ctx.setTransform(d,0,0,d,0,0)};
      resize();window.addEventListener("resize",resize,{passive:true});
      let t=0;
      const draw=()=>{
        t+=.012;const r=canvas.getBoundingClientRect(),w=r.width,h=r.height,cx=w*.67,cy=h*.51;
        ctx.clearRect(0,0,w,h);ctx.strokeStyle="rgba(16,104,96,.10)";ctx.lineWidth=1;ctx.setLineDash([2,9]);
        ctx.beginPath();ctx.ellipse(cx,cy,Math.min(w,h)*.29,Math.min(w,h)*.19,Math.sin(t*.1),0,Math.PI*2);ctx.stroke();
        ctx.setLineDash([]);
        for(let i=0;i<20;i++){const a=i*.73+t*.15,rr=Math.min(w,h)*(.18+(i%5)*.025);ctx.fillStyle="rgba(16,104,96,.16)";ctx.beginPath();ctx.arc(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr*.72,1.5,0,Math.PI*2);ctx.fill()}
        if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches)requestAnimationFrame(draw);
      };
      draw();
    }
  }

  // Page interactions outside the cinematic scene.
  $("#year").textContent = new Date().getFullYear();

  const progress = $("#scrollProgress");
  const updateProgress = () => {
    const h=document.documentElement;
    const pct=h.scrollTop/Math.max(1,h.scrollHeight-h.clientHeight)*100;
    progress.style.width=`${Math.min(100,Math.max(0,pct))}%`;
  };
  window.addEventListener("scroll",updateProgress,{passive:true});updateProgress();

  const io=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("visible");io.unobserve(entry.target);}
    });
  },{threshold:.12});
  $$(".reveal").forEach(el=>io.observe(el));

  const mobileMenu=$("#mobileMenu"),mobileNav=$("#mobileNav");
  if(mobileMenu&&mobileNav){
    mobileMenu.addEventListener("click",()=>{
      const open=mobileNav.classList.toggle("open");
      mobileMenu.setAttribute("aria-expanded",open);
    });
    $$("#mobileNav a,#mobileNav button").forEach(el=>el.addEventListener("click",()=>mobileNav.classList.remove("open")));
  }

  const modal=$("#partnerModal");
  const openPartner=()=>{modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open")};
  const closePartner=()=>{modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open")};
  $$("[data-open-partner]").forEach(el=>el.addEventListener("click",openPartner));
  if($("#closePartner"))$("#closePartner").addEventListener("click",closePartner);
  if(modal)modal.addEventListener("click",e=>{if(e.target===modal)closePartner()});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){closePartner();closeAsk?.()}});

  if($("#partnerForm")){
    $("#partnerForm").addEventListener("submit",e=>{
      e.preventDefault();
      const data=new FormData(e.currentTarget);
      const subject=encodeURIComponent(`Nexpla confidential enquiry — ${data.get("company")}`);
      const body=encodeURIComponent(`Name: ${data.get("name")}\nCompany: ${data.get("company")}\nRole: ${data.get("role")}\nEmail: ${data.get("email")}\n\nWhat they want to explore:\n${data.get("message") || "(not specified)"}`);
      $("#formSuccess").classList.add("show");
      setTimeout(()=>{window.location.href=`mailto:rc@nexpla.com?subject=${subject}&body=${body}`},350);
    });
  }

  const workflows={
    collections:{prompt:"Show me today’s outstanding payments from my top 20 distributors.",value:"₹18.4L",label:"Total Outstanding",secondary:"7",intro:"Here’s what I found.",success:"Purchase order created successfully."},
    inventory:{prompt:"Which SKUs are at risk of stock-out this week?",value:"18",label:"SKUs At Risk",secondary:"6",intro:"I found 18 SKUs that need attention.",success:"Replenishment recommendations prepared."},
    procurement:{prompt:"What should we reorder today based on demand and current stock?",value:"₹12.8L",label:"Recommended Purchase",secondary:"24",intro:"Here’s the recommended purchase plan.",success:"Draft purchase orders prepared for review."},
    action:{prompt:"Create a purchase order for ABC Pharma for 5,000 units of Amoxicillin 250mg.",value:"5,000",label:"Units Ready",secondary:"1",intro:"I can complete that action for you.",success:"Purchase order created successfully."}
  };
  $$(".ai-mode").forEach(btn=>btn.addEventListener("click",()=>{
    $$(".ai-mode").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
    const d=workflows[btn.dataset.workflow];
    $("#userPrompt").textContent=d.prompt;$("#responseValue").textContent=d.value;$("#responseLabel").textContent=d.label;
    $("#responseSecondary").textContent=d.secondary;$("#responseIntro").textContent=d.intro;$("#successText").textContent=d.success;
    const win=document.querySelector(".ai-window");if(win){win.classList.remove("ai-thinking");void win.offsetWidth;win.classList.add("ai-thinking");setTimeout(()=>win.classList.remove("ai-thinking"),900)}
  }));

  const workflowQuestions={
    Inventory:"Which SKUs are at risk of stock-out this week?",Procurement:"What should we reorder today?",Sales:"Which orders need attention right now?",
    Distribution:"Which deliveries are delayed?",Collections:"Which distributors should we follow up with today?",Finance:"What changed in cash flow this week?",
    Orders:"Create the next priority purchase order.",Compliance:"Which exceptions need attention?"
  };
  $$(".workflow-card").forEach(card=>card.addEventListener("click",()=>{
    $$(".workflow-card").forEach(x=>x.classList.remove("active"));card.classList.add("active");
    const name=card.dataset.detail;if($("#workflowAnswer b"))$("#workflowAnswer b").textContent=`“${workflowQuestions[name]}”`;
  }));

  const askPanel=$("#askPanel"),askFab=$("#askFab"),askMessages=$("#askMessages"),askInput=$("#askInput");
  const openAsk=()=>{askPanel.classList.add("open");askPanel.setAttribute("aria-hidden","false");setTimeout(()=>askInput?.focus(),120)};
  const closeAsk=()=>{askPanel.classList.remove("open");askPanel.setAttribute("aria-hidden","true")};
  if(askFab)askFab.addEventListener("click",()=>askPanel.classList.contains("open")?closeAsk():openAsk());
  if($("#askClose"))$("#askClose").addEventListener("click",closeAsk);
  if($("#askForm"))$("#askForm").addEventListener("submit",e=>{
    e.preventDefault();const q=(askInput.value||"").trim();if(!q)return;
    const user=document.createElement("div");user.className="ask-msg user";user.textContent=q;askMessages.appendChild(user);
    const reply=document.createElement("div");reply.className="ask-msg assistant";reply.innerHTML="<span>✦</span><div>Ask me about pharma workflows, the intelligence layer, or how Nexpla connects ERP context into action.</div>";askMessages.appendChild(reply);
    askInput.value="";askMessages.scrollTop=askMessages.scrollHeight;
  });
});
