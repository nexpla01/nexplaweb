const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

document.addEventListener("DOMContentLoaded", () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const section = $("#vision");
  const stage = $("#nexplaStage");
  const canvas = $("#nexplaCanvas");

  // ---------------------------------------------------------
  // V6.1: robust spatial canvas
  // No WebGL dependency. This guarantees the hero renders even
  // if a CDN/WebGL context is unavailable.
  // ---------------------------------------------------------
  if (section && stage && canvas) {
    const ctx = canvas.getContext("2d", {alpha:true});
    const DPR = () => Math.min(window.devicePixelRatio || 1, 2);
    let W=0,H=0,dpr=1, raf=0, scrollP=0, targetX=0, targetY=0, mx=0, my=0;

    const items = [
      {label:"INVENTORY", value:"12,480 SKUs", x:.06,y:.22, size:1},
      {label:"ORDERS", value:"342 PENDING", x:.04,y:.60, size:.92},
      {label:"CUSTOMERS", value:"3,300+", x:.22,y:.82, size:.86},
      {label:"PURCHASES", value:"₹12.8L", x:.76,y:.20, size:.96},
      {label:"COLLECTIONS", value:"₹18.4L", x:.88,y:.59, size:.9},
      {label:"WORKFLOWS", value:"ACTIVE", x:.73,y:.84, size:.82}
    ];
    const core = {x:.52,y:.51};

    const resize = () => {
      const r = stage.getBoundingClientRect();
      W = Math.max(1,r.width); H = Math.max(1,r.height); dpr=DPR();
      canvas.width=Math.round(W*dpr); canvas.height=Math.round(H*dpr);
      canvas.style.width=W+"px"; canvas.style.height=H+"px";
      ctx.setTransform(dpr,0,0,dpr,0,0);
    };
    resize();
    window.addEventListener("resize",resize,{passive:true});

    stage.addEventListener("pointermove", e=>{
      const r=stage.getBoundingClientRect();
      targetX=((e.clientX-r.left)/r.width-.5);
      targetY=((e.clientY-r.top)/r.height-.5);
    });
    stage.addEventListener("pointerleave",()=>{targetX=0;targetY=0});

    const lerp=(a,b,t)=>a+(b-a)*t;
    const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
    const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
    const rgba=(a)=>`rgba(16,104,96,${a})`;

    function roundRect(x,y,w,h,r){
      const rr=Math.min(r,w/2,h/2);
      ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);
      ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();
    }

    function drawCard(item, phase, time){
      // Context cards contract toward the core between 0.25 and 0.48.
      const converge=ease(clamp((phase-.23)/.25));
      const x0=item.x*W, y0=item.y*H;
      const cx=core.x*W, cy=core.y*H;
      const wobble=reduce?0:Math.sin(time*.0009+item.x*9)*4;
      const x=lerp(x0,cx+(x0-cx)*.10,converge)+mx*10;
      const y=lerp(y0,cy+(y0-cy)*.10,converge)+my*8+wobble*(1-converge);
      const scale=lerp(item.size, .65, converge);
      const w=126*scale,h=55*scale;
      const alpha=lerp(.92,.10,clamp((phase-.50)/.13));
      if(alpha<=.01)return;

      ctx.save();
      ctx.globalAlpha=alpha;
      ctx.shadowColor=rgba(.09);ctx.shadowBlur=20;ctx.shadowOffsetY=9;
      roundRect(x-w/2,y-h/2,w,h,12);
      ctx.fillStyle="rgba(255,255,255,.94)";ctx.fill();
      ctx.shadowColor="transparent";ctx.strokeStyle=rgba(.16);ctx.lineWidth=1;ctx.stroke();
      ctx.fillStyle="#8a9692";ctx.font=`700 ${Math.max(7,8*scale)}px Inter,Arial`;
      ctx.letterSpacing="1px";
      ctx.fillText(item.label,x-w/2+12,y-4);
      ctx.fillStyle="#202725";ctx.font=`700 ${Math.max(10,11*scale)}px Inter,Arial`;
      ctx.fillText(item.value,x-w/2+12,y+13);
      ctx.restore();
    }

    function drawLine(a,b,phase,time,i){
      const conv=ease(clamp((phase-.18)/.32));
      const ax=lerp(a.x*W,core.x*W,conv), ay=lerp(a.y*H,core.y*H,conv);
      const bx=lerp(b.x*W,core.x*W,conv), by=lerp(b.y*H,core.y*H,conv);
      const alpha=.08+.18*conv;
      ctx.save();ctx.strokeStyle=rgba(alpha);ctx.lineWidth=i%3===0?1.5:1;
      ctx.setLineDash([2,8]);ctx.lineDashOffset=-time*.018*(i%2?1:-1);
      ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();ctx.restore();
    }

    function drawCore(phase,time){
      const cx=core.x*W,cy=core.y*H;
      const active=ease(clamp((phase-.43)/.25));
      const action=ease(clamp((phase-.63)/.20));
      const r=72+active*18;
      const pulse=reduce?0:Math.sin(time*.002)*4;

      const grad=ctx.createRadialGradient(cx,cy,0,cx,cy,r*3.8);
      grad.addColorStop(0,rgba(.15));grad.addColorStop(.35,rgba(.055));grad.addColorStop(1,"rgba(16,104,96,0)");
      ctx.fillStyle=grad;ctx.beginPath();ctx.arc(cx,cy,r*3.8,0,Math.PI*2);ctx.fill();

      ctx.save();
      ctx.strokeStyle=rgba(.16+.18*active);ctx.setLineDash([2,8]);ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(cx,cy,r+20+pulse,0,Math.PI*2);ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle="rgba(255,255,255,.97)";ctx.strokeStyle=rgba(.35+.18*active);ctx.lineWidth=1.3;
      ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();ctx.stroke();

      // Build the icon from a field of small dots.
      for(let i=0;i<25;i++){
        const ang=i*2.399+time*.00015*(1+active*3);
        const rr=12+(i%6)*7;
        const px=cx+Math.cos(ang)*rr,py=cy+Math.sin(ang)*rr;
        ctx.fillStyle="#090A0B";ctx.beginPath();ctx.arc(px,py,1.8+(i%4)*.7,0,Math.PI*2);ctx.fill();
      }
      ctx.restore();

      if(active>.35){
        ctx.save();ctx.globalAlpha=active;
        ctx.fillStyle="#106860";ctx.font="800 8px Inter,Arial";ctx.textAlign="center";
        ctx.fillText("INTELLIGENCE LAYER",cx,cy+r+38);
        ctx.fillStyle="#697672";ctx.font="600 7px Inter,Arial";
        ctx.fillText("UNDERSTAND  ·  DECIDE  ·  EXECUTE",cx,cy+r+51);
        ctx.restore();
      }

      if(action>.2){
        const aw=300,ah=188, ax=cx+W*.12, ay=cy-40;
        ctx.save();ctx.globalAlpha=action;ctx.shadowColor=rgba(.11);ctx.shadowBlur=35;ctx.shadowOffsetY=18;
        roundRect(ax-aw/2,ay-ah/2,aw,ah,18);ctx.fillStyle="rgba(255,255,255,.97)";ctx.fill();
        ctx.shadowColor="transparent";ctx.strokeStyle=rgba(.2);ctx.stroke();
        ctx.fillStyle="#65716d";ctx.font="700 8px Inter,Arial";ctx.fillText("NEXPLA   •   INTELLIGENCE",ax-aw/2+18,ay-ah/2+25);
        roundRect(ax-aw/2+18,ay-ah/2+42,aw-36,54,12);ctx.fillStyle="#f3f7f6";ctx.fill();
        ctx.fillStyle="#47534f";ctx.font="500 11px Inter,Arial";
        ctx.fillText("Which distributors are likely to",ax-aw/2+32,ay-ah/2+66);
        ctx.fillText("run out of stock next week?",ax-aw/2+32,ay-ah/2+82);
        ctx.fillStyle="#106860";ctx.font="800 8px Inter,Arial";ctx.fillText("ANALYSIS COMPLETE",ax-aw/2+18,ay+24);
        ctx.fillStyle="#202725";ctx.font="800 23px Barlow Condensed,Arial";ctx.fillText("14 distributors at risk",ax-aw/2+18,ay+48);
        roundRect(ax-aw/2+18,ay+61,aw-36,32,9);ctx.fillStyle="#106860";ctx.fill();
        ctx.fillStyle="#fff";ctx.font="800 8px Inter,Arial";ctx.fillText("EXECUTE RECOMMENDATION  →",ax-aw/2+31,ay+81);
        ctx.restore();
      }
    }

    function draw(time){
      ctx.clearRect(0,0,W,H);
      mx=lerp(mx,targetX,.035);my=lerp(my,targetY,.035);
      const p=scrollP;
      const cx=core.x*W,cy=core.y*H;
      const ringR=Math.min(W,H)*.31;

      // Fine spatial field.
      ctx.save();
      for(let i=0;i<36;i++){
        const a=i*.71+time*.00012, r=ringR+(i%5)*28;
        const x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r*.72;
        ctx.fillStyle=rgba(.08);ctx.beginPath();ctx.arc(x+mx*8,y+my*6,1.4,0,Math.PI*2);ctx.fill();
      }
      ctx.restore();

      const edges=[[0,1],[1,3],[3,4],[4,5],[5,2],[2,0],[0,7],[7,6],[6,3]];
      edges.forEach((e,i)=>drawLine(items[e[0]],items[e[1]],p,time,i));
      items.forEach(it=>drawCard(it,p,time));
      drawCore(p,time);

      // Outgoing platform signals after the action moment.
      const out=ease(clamp((p-.78)/.18));
      if(out>.01){
        ctx.save();ctx.globalAlpha=out;
        const labels=["APIs","AGENTS","SERVICES"];
        labels.forEach((label,i)=>{
          const y=cy-70+i*70, x=cx+W*.23;
          ctx.strokeStyle=rgba(.24);ctx.setLineDash([3,7]);ctx.beginPath();ctx.moveTo(cx+80,y);ctx.lineTo(x-40,y);ctx.stroke();
          ctx.setLineDash([]);roundRect(x-35,y-16,70,32,16);ctx.fillStyle="#fff";ctx.fill();ctx.strokeStyle=rgba(.2);ctx.stroke();
          ctx.fillStyle="#106860";ctx.font="800 8px Inter,Arial";ctx.textAlign="center";ctx.fillText(label,x,y+3);
        });
        ctx.restore();
      }
      if(!reduce)raf=requestAnimationFrame(draw);
    }

    // GSAP controls the narrative. If GSAP fails, native scroll still updates it.
    const setProgress = p => { scrollP=clamp(p); };
    if(window.gsap && window.ScrollTrigger && !reduce){
      gsap.registerPlugin(ScrollTrigger);
      gsap.to({p:0},{p:1,duration:1,ease:"none",scrollTrigger:{
        trigger:section,start:"top top",end:"bottom bottom",scrub:1,
        onUpdate:self=>setProgress(self.progress)
      }});
    } else {
      const update=()=>{
        const r=section.getBoundingClientRect();
        setProgress((window.innerHeight-r.top)/(r.height-window.innerHeight));
      };
      window.addEventListener("scroll",update,{passive:true});update();
    }
    if(reduce){
      scrollP=.46;
      draw(performance.now());
    } else {
      raf=requestAnimationFrame(draw);
    }

    // Stage text is HTML so it stays crisp while the spatial scene moves.
    const state=$("#v6State"),headline=$("#v6Headline"),subline=$("#v6Subline");
    const copy=[
      ["THE SOFTWARE ALREADY KNOWS THE BUSINESS","Context already exists.","Inventory · Orders · Customers · Workflows"],
      ["CONTEXT BECOMES CONNECTED","The context comes together.","Data · Workflows · Customers · Business logic"],
      ["INTELLIGENCE LAYER ACTIVE","Understand · Decide · Execute.","Not just answers. Action inside the workflow."],
      ["ACTION INSIDE THE WORKFLOW","From insight to action.","The system can do the work."],
      ["BUILT FOR THE ECOSYSTEM","Start with ERP. Build beyond it.","ERP · Intelligence · APIs · Agents · Services"]
    ];
    let last=-1;
    const updateCopy=()=>{
      const p=scrollP;
      const idx=p<.22?0:p<.43?1:p<.66?2:p<.82?3:4;
      if(idx===last)return;last=idx;
      state.textContent=copy[idx][0];headline.textContent=copy[idx][1];subline.textContent=copy[idx][2];
      stage.dataset.scene=idx+1;
    };
    setInterval(updateCopy,120);
    updateCopy();
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
