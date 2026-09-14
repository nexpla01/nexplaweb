const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

document.addEventListener("DOMContentLoaded", () => {
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
