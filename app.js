const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

document.addEventListener("DOMContentLoaded", () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const section = $("#vision");
  const stage = $("#nexplaStage");
  // V7: pronounced, dependency-free cinematic scroll controller.
  // The scene is intentionally staged: objects enter, converge, the core activates,
  // action appears, then the system expands into a platform.
  const hero=section;
  const setScene=(p)=>{
    if(!hero || !stage) return;
    const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
    const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
    const progress=clamp((window.innerHeight-hero.getBoundingClientRect().top)/
      Math.max(1,hero.getBoundingClientRect().height-window.innerHeight));
    const cards=$$(".spatial-card"), nodes=$$(".spatial-node"), rings=$$(".spatial-ring");
    const core=$(".spatial-core"), streams=$$(".stream");

    // 0 → .24: establish the fragmented system.
    // .24 → .46: pull context toward the core.
    // .46 → .68: activate intelligence.
    // .68 → .84: show action.
    // .84 → 1: expand into platform.
    const scene=progress<.24?1:progress<.46?2:progress<.68?3:progress<.84?4:5;
    stage.dataset.scene=scene;

    const convergence=ease(clamp((progress-.20)/.30));
    cards.forEach((card,i)=>{
      const a=(i/cards.length)*Math.PI*2;
      const pull=convergence*42;
      card.style.setProperty("--sx",`${Math.cos(a)*pull}px`);
      card.style.setProperty("--sy",`${Math.sin(a)*pull*.72}px`);
      card.style.transform=`translate(var(--sx),var(--sy)) scale(${1-convergence*.18})`;
    });

    nodes.forEach((node,i)=>{
      const a=(i/nodes.length)*Math.PI*2;
      const pull=ease(clamp((progress-.22)/.34))*28;
      node.style.transform=`translate(${Math.cos(a)*pull}px,${Math.sin(a)*pull*.72}px)`;
      node.style.opacity=String(1-ease(clamp((progress-.52)/.15))*.72);
    });

    if(core){
      const active=ease(clamp((progress-.39)/.23));
      const action=ease(clamp((progress-.64)/.20));
      const scale=1+active*.20-action*.05;
      core.style.transform=`translate(-50%,-50%) scale(${scale})`;
      core.style.setProperty("--glow",`${active}`);
      core.style.boxShadow=`0 0 0 ${32+active*28}px rgba(16,104,96,${.025+active*.025}),
        0 ${24+active*18}px ${70+active*35}px rgba(16,104,96,${.13+active*.10})`;
    }

    streams.forEach((s,i)=>{
      const on=ease(clamp((progress-(.38+i*.015))/.22));
      s.style.opacity=String(.08+on*.82);
      s.style.transformOrigin="left center";
      s.style.scale=String(.6+on*.8);
    });

    const state=$("#v6State"), headline=$("#v6Headline"), subline=$("#v6Subline");
    const copy=[
      ["THE SOFTWARE ALREADY KNOWS THE BUSINESS","Context already exists.","Inventory · Orders · Customers · Workflows"],
      ["CONTEXT BECOMES CONNECTED","The context comes together.","Data · Workflows · Customers · Business logic"],
      ["INTELLIGENCE LAYER ACTIVE","Understand · Decide · Execute.","Not just answers. Action inside the workflow."],
      ["ACTION INSIDE THE WORKFLOW","From insight to action.","The system can do the work."],
      ["BUILT FOR THE ECOSYSTEM","Start with ERP. Build beyond it.","ERP · Intelligence · APIs · Agents · Services"]
    ];
    const c=copy[scene-1];
    if(state)state.textContent=c[0];
    if(headline)headline.textContent=c[1];
    if(subline)subline.textContent=c[2];

    // Make the transition itself visible: typography and scene gain/lose emphasis.
    const textBlock=hero.querySelector(".hero-copy");
    if(textBlock){
      textBlock.style.transform=`translateY(${progress*-34}px)`;
      textBlock.style.opacity=String(1-Math.max(0,(progress-.56)/.25)*.55);
    }
  };
  window.addEventListener("scroll",setScene,{passive:true});
  window.addEventListener("resize",setScene,{passive:true});
  setScene();

  // Lightweight canvas signal field. It is additive, never required for the scene.
  const canvas=$("#nexplaCanvas");
  if(canvas){
    const ctx=canvas.getContext("2d");
    if(ctx){
      const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let w=0,h=0,d=1,t=0;
      const resize=()=>{
        const r=canvas.getBoundingClientRect();
        d=Math.min(devicePixelRatio||1,2);w=r.width;h=r.height;
        canvas.width=Math.max(1,Math.round(w*d));canvas.height=Math.max(1,Math.round(h*d));
        ctx.setTransform(d,0,0,d,0,0);
      };
      resize();window.addEventListener("resize",resize,{passive:true});
      const draw=()=>{
        t+=.012;ctx.clearRect(0,0,w,h);
        const cx=w*.67,cy=h*.51;
        ctx.strokeStyle="rgba(16,104,96,.08)";ctx.lineWidth=1;ctx.setLineDash([2,10]);
        ctx.beginPath();ctx.ellipse(cx,cy,Math.min(w,h)*.30,Math.min(w,h)*.20,Math.sin(t*.08)*.08,0,Math.PI*2);ctx.stroke();
        ctx.setLineDash([]);
        for(let i=0;i<30;i++){
          const a=i*.61+t*.13, rr=Math.min(w,h)*(.14+(i%7)*.024);
          ctx.fillStyle="rgba(16,104,96,.10)";
          ctx.beginPath();ctx.arc(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr*.72,1.3+(i%3)*.45,0,Math.PI*2);ctx.fill();
        }
        if(!reduce)requestAnimationFrame(draw);
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
