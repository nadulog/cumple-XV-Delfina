(() => {
  const EVENT_START = "2027-10-03T21:00:00-03:00";
  const EVENT_END = "2027-10-04T05:15:00-03:00";
  const PLAYLIST_URL = "PEGAR_AQUI_EL_LINK_DE_LA_PLAYLIST";
  const target = new Date(EVENT_START).getTime();
  const units = Object.fromEntries([...document.querySelectorAll("[data-unit]")].map(node => [node.dataset.unit, node]));

  function tick() {
    const total = Math.max(0, target - Date.now());
    const seconds = Math.floor(total / 1000);
    const values = {
      days: String(Math.floor(seconds / 86400)).padStart(3, "0"),
      hours: String(Math.floor(seconds / 3600) % 24).padStart(2, "0"),
      minutes: String(Math.floor(seconds / 60) % 60).padStart(2, "0"),
      seconds: String(seconds % 60).padStart(2, "0")
    };
    Object.entries(values).forEach(([unit, value]) => {
      if (units[unit].textContent === value) return;
      units[unit].textContent = value;
      units[unit].classList.remove("tick-pop");
      void units[unit].offsetWidth;
      units[unit].classList.add("tick-pop");
    });
  }
  tick();
  setInterval(tick, 1000);

  const discovery = document.querySelector(".discovery");
  const stage = document.querySelector(".kiss-stage");
  const progress = document.querySelector(".progress");
  const skip = document.querySelector(".skip");
  const kissAssets = ["assets/beso-blanco.png", "assets/beso-azul.png", "assets/beso-plateado.png"];
  let count = 0;
  let isRevealed = false;

  function reveal() {
    if (isRevealed) return;
    isRevealed = true;
    progress.textContent = "3 DE 3";
    discovery.querySelectorAll(".kiss").forEach((kiss, i) => {
      kiss.style.transition = `opacity .2s ${i * .04}s, transform .28s ${i * .04}s`;
      kiss.style.opacity = "0";
      kiss.style.transform += ` scale(.5)`;
    });
    discovery.classList.add("revealed");
    stage.setAttribute("aria-hidden", "true");
    document.querySelector(".final-date").setAttribute("aria-hidden", "false");
  }

  function placeKiss(event) {
    if (isRevealed || count === 3 || event.target.closest(".skip")) return;
    const rect = stage.getBoundingClientRect();
    const kiss = document.createElement("img");
    kiss.className = "kiss";
    kiss.src = kissAssets[count];
    kiss.alt = "";
    kiss.draggable = false;
    kiss.style.left = `${event.clientX - rect.left}px`;
    kiss.style.top = `${event.clientY - rect.top}px`;
    kiss.style.setProperty("--angle", `${[-8, 7, -3][count]}deg`);
    stage.appendChild(kiss);
    count += 1;
    progress.textContent = `${count} DE 3`;
    if (count === 3) setTimeout(reveal, 320);
  }
  stage.addEventListener("pointerup", placeKiss);
  stage.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    const rect = stage.getBoundingClientRect();
    placeKiss({ clientX: rect.left + rect.width * (.35 + count * .15), clientY: rect.top + rect.height * .68, target: stage });
  });
  skip.addEventListener("pointerup", event => { event.stopPropagation(); reveal(); });

  const utc = iso => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Delfina XV//ES", "BEGIN:VEVENT", "UID:delfina-xv-20271003@invitacion", `DTSTART:${utc(EVENT_START)}`, `DTEND:${utc(EVENT_END)}`, "SUMMARY:Mis XV de Delfina", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  document.querySelector(".calendar-hotspot").href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));

  const giftModal = document.querySelector(".gift-modal");
  const openGifts = document.querySelector("[data-open-gifts]");
  const closeGifts = document.querySelector("[data-close-gifts]");
  const copyAlias = document.querySelector("[data-copy-alias]");
  const copyStatus = document.querySelector(".copy-status");
  openGifts.addEventListener("click", () => giftModal.showModal());
  closeGifts.addEventListener("click", () => giftModal.close());
  giftModal.addEventListener("click", event => {
    if (event.target === giftModal) giftModal.close();
  });
  copyAlias.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("delfi.dapice.xv");
      copyStatus.textContent = "ALIAS COPIADO";
    } catch {
      copyStatus.textContent = "ALIAS: delfi.dapice.xv";
    }
  });

  const musicPanel = document.querySelector(".music-panel");
  const playlistButton = document.querySelector(".playlist-button");
  playlistButton.href = PLAYLIST_URL;
  const musicObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => musicPanel.classList.toggle("is-visible", entry.isIntersecting));
  }, { threshold: 0.05 });
  musicObserver.observe(musicPanel);
})();
