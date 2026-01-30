(function () {
  const root = document.documentElement;
  const yearEl = document.getElementById("year");
  const navToggle = document.querySelector(".nav__toggle");
  const navMenu = document.getElementById("navMenu");
  const themeBtn = document.querySelector(".themeBtn");
  const toast = document.querySelector(".toast");

  // Year
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Theme
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "light" || storedTheme === "dark") {
    root.setAttribute("data-theme", storedTheme);
  }

  function setTheme(next) {
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    const icon = document.querySelector(".themeBtn__icon");
    if (icon) icon.textContent = next === "light" ? "☀" : "☾";
  }

  if (themeBtn) {
    // set initial icon
    const current = root.getAttribute("data-theme") || "dark";
    const icon = document.querySelector(".themeBtn__icon");
    if (icon) icon.textContent = current === "light" ? "☀" : "☾";

    themeBtn.addEventListener("click", () => {
      const currentTheme = root.getAttribute("data-theme") || "dark";
      setTheme(currentTheme === "light" ? "dark" : "light");
    });
  }

  // Mobile menu
  function closeMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("isOpen");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("isOpen");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu when clicking a link
    navMenu.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.tagName === "A") closeMenu();
    });

    // Close menu on Escape
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Close menu on outside click
    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!navMenu.classList.contains("isOpen")) return;
      if (t === navToggle || navToggle.contains(t)) return;
      if (navMenu.contains(t)) return;
      closeMenu();
    });
  }

  // Copy to clipboard (email)
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copied: ${text}`);
    } catch (err) {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      showToast(ok ? `Copied: ${text}` : "Copy failed");
    }
  }

  let toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.textContent = "";
    }, 2400);
  }

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-copy");
      if (text) copyText(text);
    });
  });
})();
