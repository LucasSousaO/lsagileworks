(() => {
  const root = document.documentElement;

  // =========================
  // Helpers
  // =========================
  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

  // =========================
  // Year
  // =========================
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // =========================
  // THEME (default LIGHT)
  // - Default: light
  // - If user already chose before, respect localStorage
  // =========================
  const THEME_KEY = "ls_theme";
  const storedTheme = localStorage.getItem(THEME_KEY);
  const initialTheme = (storedTheme === "dark" || storedTheme === "light") ? storedTheme : "light";
  root.setAttribute("data-theme", initialTheme);

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);

    // Optional: update icon state via CSS hook
    root.setAttribute("data-theme", theme);
    const btn = $(".themeBtn");
    if (btn) btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  const themeBtn = $(".themeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "light";
      setTheme(current === "light" ? "dark" : "light");
    });
    // accessibility hint
    themeBtn.setAttribute("aria-pressed", initialTheme === "dark" ? "true" : "false");
  }

  // =========================
  // MOBILE MENU
  // =========================
  const navToggle = $(".nav__toggle");
  const navMenu = $("#navMenu");

  function openMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.add("isOpen");
    navToggle.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("isOpen");
    navToggle.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    if (!navMenu || !navToggle) return;
    const isOpen = navMenu.classList.toggle("isOpen");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", toggleMenu);

    // Close when clicking a nav link
    navMenu.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.tagName === "A") closeMenu();
    });

    // Close on ESC
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!navMenu.classList.contains("isOpen")) return;

      const target = e.target;
      const clickInsideMenu = navMenu.contains(target);
      const clickOnToggle = navToggle.contains(target);

      if (!clickInsideMenu && !clickOnToggle) closeMenu();
    });
  }

  // =========================
  // COPY TO CLIPBOARD (data-copy)
  // Works for buttons, spans, links, etc.
  // =========================
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        ta.style.top = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
      } catch (_) {
        return false;
      }
    }
  }

  function flashCopied(el, ok) {
    const original = el.textContent;
    const label = ok ? "Copied ✓" : "Copy failed";
    el.textContent = label;
    el.classList.add(ok ? "isCopied" : "isCopyFail");
    setTimeout(() => {
      el.textContent = original;
      el.classList.remove("isCopied", "isCopyFail");
    }, 1400);
  }

  $$("[data-copy]").forEach((el) => {
    const text = el.getAttribute("data-copy");
    if (!text) return;

    const handler = async (e) => {
      // prevent anchor without href from jumping
      e.preventDefault?.();
      const ok = await copyToClipboard(text);
      flashCopied(el, ok);
    };

    el.addEventListener("click", handler);

    // keyboard support when element is not a button
    if (el.tagName !== "BUTTON") {
      el.setAttribute("role", el.getAttribute("role") || "button");
      el.setAttribute("tabindex", el.getAttribute("tabindex") || "0");
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handler(e);
        }
      });
    }
  });

  // =========================
  // i18n (EN/PT)
  // - Default: browser language
  // - Persist: localStorage
  // =========================
  const LANG_KEY = "ls_lang";

  const dict = {
    en: {
      "nav.impact": "Impact",
      "nav.tools": "Tools",
      "nav.contact": "Contact",

      "hero.eyebrow": "Remote contractor • Global teams",
      "hero.title": "Project Management",
      "hero.lead": "Supporting engineering teams to deliver complex initiatives with predictability and transparency.",
      "hero.ctaContact": "Contact",
      "hero.ctaCv": "Download CV",
      "hero.linkLinkedin": "LinkedIn",
      "hero.linkWhatsapp": "WhatsApp",

      "meta.rolesK": "Roles",
      "meta.focusK": "Focus",

      "impact.title": "Selected impact",
      "impact.sub": "How I help organizations turn delivery complexity into clarity and predictable outcomes.",
      "impact.b1": "Led delivery execution for remote engineering teams, ensuring clarity, flow, and realistic commitments.",
      "impact.b2": "Coordinated cross-team planning and dependencies, aligning execution with strategic business objectives.",
      "impact.b3": "Improved delivery predictability through execution tracking and data-driven metrics (Lead Time, Cycle Time, Predictability, CFD).",
      "impact.b4": "Supported leadership with clear delivery narratives, highlighting risks, trade-offs, and execution insights to enable informed decisions.",

      "tools.title": "Tools & Metrics",
      "tools.sub": "Practical, hands-on experience.",

      "profile.availK": "Availability",
      "profile.availV": "Remote contractor (PJ)",

      "lvl.advanced": "Advanced",
      "lvl.proficient": "Proficient",
    },

    pt: {
      "nav.impact": "Impacto",
      "nav.tools": "Ferramentas",
      "nav.contact": "Contato",

      "hero.eyebrow": "Contrato PJ remoto • Times globais",
      "hero.title": "Gestão de Projetos",
      "hero.lead": "Apoio times de engenharia a entregar iniciativas complexas com previsibilidade e transparência.",
      "hero.ctaContact": "Contato",
      "hero.ctaCv": "Baixar CV",
      "hero.linkLinkedin": "LinkedIn",
      "hero.linkWhatsapp": "WhatsApp",

      "meta.rolesK": "Papéis",
      "meta.focusK": "Foco",

      "impact.title": "Principais entregas",
      "impact.sub": "Como eu transformo complexidade de delivery em clareza e resultados previsíveis.",
      "impact.b1": "Conduzi a execução de delivery para times remotos de engenharia, garantindo clareza, fluxo e compromissos realistas.",
      "impact.b2": "Coordenei planejamento e dependências entre times, alinhando execução aos objetivos estratégicos do negócio.",
      "impact.b3": "Melhorei previsibilidade usando acompanhamento de execução e métricas (Lead Time, Cycle Time, Predictability, CFD).",
      "impact.b4": "Dei suporte à liderança com narrativas claras, riscos, trade-offs e insights para decisões mais informadas.",

      "tools.title": "Ferramentas & Métricas",
      "tools.sub": "Experiência prática e aplicada.",

      "profile.availK": "Disponibilidade",
      "profile.availV": "Contrato PJ remoto",

      "lvl.advanced": "Avançado",
      "lvl.proficient": "Proficiente",
    }
  };

  function detectBrowserLang() {
    const lang = (navigator.language || "en").toLowerCase();
    return lang.startsWith("pt") ? "pt" : "en";
  }

  function applyLang(lang) {
    const strings = dict[lang] || dict.en;

    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      if (strings[key]) el.textContent = strings[key];
    });

    // Update html lang attribute
    document.documentElement.setAttribute("lang", lang === "pt" ? "pt-BR" : "en");

    // Update pressed state
    $$(".langBtn").forEach((btn) => {
      const isActive = btn.getAttribute("data-lang") === lang;
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    localStorage.setItem(LANG_KEY, lang);
  }

  const storedLang = localStorage.getItem(LANG_KEY);
  const initialLang = (storedLang === "pt" || storedLang === "en") ? storedLang : detectBrowserLang();

  $$(".langBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      if (lang) applyLang(lang);
    });
  });

  applyLang(initialLang);
})();
