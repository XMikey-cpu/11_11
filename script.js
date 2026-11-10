// Small, dependency-free interactions for the 11:11 experience.
const reasonGrid = document.getElementById("reasonGrid");
const photoGrid = document.getElementById("photoGrid");

SITE_CONTENT.reasons.forEach((reason, index) => {
  const card = document.createElement("button");
  card.className = "reason-card reveal";
  card.type = "button";
  card.setAttribute("aria-expanded", "false");
  card.innerHTML = `<span class="reason-star">✧</span><span class="reason-title">${index + 1}. ${escapeHTML(reason.title)}</span><span class="reason-text">${escapeHTML(reason.message)}</span>`;
  card.addEventListener("click", () => {
    const opening = !card.classList.contains("open");
    card.classList.toggle("open", opening);
    card.setAttribute("aria-expanded", String(opening));
    card.querySelector(".reason-star").textContent = opening ? "✦" : "✧";
  });
  reasonGrid.appendChild(card);
});

SITE_CONTENT.photos.forEach((photo, index) => {
  const card = document.createElement("div");
  card.className = "photo-card reveal";
  card.style.setProperty("--tilt", `${[-2.2, 1.8, -1][index % 3]}deg`);
  card.innerHTML = `<div class="photo-inner"><img src="${escapeAttr(photo.src)}" alt="${escapeAttr(photo.alt)}" loading="lazy"></div><div class="photo-caption">${escapeHTML(photo.caption)}</div>`;
  const img = card.querySelector("img");
  img.addEventListener("error", () => {
    const fallback = document.createElement("div");
    fallback.className = "photo-placeholder";
    fallback.innerHTML = "<span>♡</span><small>Photo could not be loaded</small>";
    card.querySelector(".photo-inner").appendChild(fallback);
  });
  card.addEventListener("click", () => {
    const image = card.querySelector("img");
    if (image) openLightbox(image.src, image.alt);
  });
  photoGrid.appendChild(card);
});

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function escapeAttr(value) { return escapeHTML(value); }

function openLightbox(src, alt) {
  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.innerHTML = `<button aria-label="Close image" class="lightbox-close">×</button><img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}">`;
  Object.assign(overlay.style, {position:"fixed",inset:"0",zIndex:"20",background:"rgba(45,30,55,.88)",display:"grid",placeItems:"center",padding:"24px",backdropFilter:"blur(10px)"});
  const image = overlay.querySelector("img");
  Object.assign(image.style,{maxWidth:"min(90vw,900px)",maxHeight:"82vh",objectFit:"contain",borderRadius:"8px",boxShadow:"0 20px 80px #1b1020"});
  const close = () => overlay.remove();
  overlay.addEventListener("click", e => { if(e.target === overlay || e.target.classList.contains("lightbox-close")) close(); });
  const closeBtn = overlay.querySelector("button");
  Object.assign(closeBtn.style,{position:"absolute",top:"20px",right:"25px",border:"0",background:"transparent",color:"white",fontSize:"36px",cursor:"pointer"});
  document.body.appendChild(overlay);
  document.addEventListener("keydown", function esc(e){ if(e.key==="Escape"){close();document.removeEventListener("keydown",esc);} });
}

const sparkleLayer = document.querySelector(".sparkle-layer");
for (let i = 0; i < 38; i++) {
  const star = document.createElement("span");
  star.className = "sparkle";
  star.textContent = i % 3 === 0 ? "✦" : "✧";
  star.style.left = `${Math.random()*100}%`;
  star.style.top = `${Math.random()*100}%`;
  star.style.setProperty("--dur", `${2.5+Math.random()*4}s`);
  star.style.setProperty("--delay", `${Math.random()*5}s`);
  star.style.fontSize = `${8+Math.random()*12}px`;
  sparkleLayer.appendChild(star);
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){entry.target.classList.add("visible");revealObserver.unobserve(entry.target);}
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
// Newly-created cards also receive reveal animation.
document.querySelectorAll(".reason-card,.photo-card").forEach(el => revealObserver.observe(el));

const music = document.getElementById("backgroundMusic");
const musicSource = document.getElementById("musicSource");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");
musicSource.src = SITE_CONTENT.musicPath;
music.load();
musicToggle.addEventListener("click", async () => {
  if (!SITE_CONTENT.musicPath || SITE_CONTENT.musicPath.includes("placeholder")) {
    musicLabel.textContent = "Add your song in content.js";
    return;
  }
  if (music.paused) {
    try { await music.play(); musicToggle.setAttribute("aria-pressed","true"); musicLabel.textContent="Pause our song"; }
    catch { musicLabel.textContent="Tap to play"; }
  } else {
    music.pause(); musicToggle.setAttribute("aria-pressed","false"); musicLabel.textContent="Play our song";
  }
});

document.getElementById("surpriseBtn").addEventListener("click", () => {
  const message = document.getElementById("surpriseMessage");
  message.classList.toggle("show");
  document.getElementById("surpriseBtn").innerHTML = message.classList.contains("show") ? "Keep this little note close <span>♡</span>" : "Open your little surprise <span>♡</span>";
});
document.getElementById("wishBtn").addEventListener("click", () => {
  const confirm = document.getElementById("wishConfirm");
  confirm.textContent = "Wish made. It was you. It will be you. ✧";
  for(let i=0;i<22;i++){
    const burst=document.createElement("span");
    burst.textContent=["✦","✧","♡"][i%3];
    Object.assign(burst.style,{position:"fixed",left:`${35+Math.random()*30}%`,top:`${35+Math.random()*25}%`,zIndex:"30",pointerEvents:"none",fontSize:`${12+Math.random()*18}px`,color:"#b982b6",transition:"transform 1.4s ease,opacity 1.4s ease"});
    document.body.appendChild(burst);
    requestAnimationFrame(()=>{burst.style.transform=`translate(${(Math.random()-.5)*500}px,${(Math.random()-.5)*450}px) rotate(${Math.random()*180}deg)`;burst.style.opacity="0";});
    setTimeout(()=>burst.remove(),1500);
  }
});
