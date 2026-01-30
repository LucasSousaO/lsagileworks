const root = document.documentElement;
const year = document.getElementById("year");
year.textContent = new Date().getFullYear();

// THEME — default LIGHT
const storedTheme = localStorage.getItem("theme");
root.setAttribute("data-theme", storedTheme || "light");

document.querySelector(".themeBtn").onclick = () => {
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
};

// LANGUAGE
const dict = {
  en:{
    "nav.impact":"Impact",
    "nav.tools":"Tools",
    "nav.contact":"Contact",
    "hero.ctaContact":"Contact",
    "hero.ctaCv":"Download CV",
    "impact.title":"Selected impact",
    "tools.title":"Tools & Metrics",
    "contact.title":"Contact"
  },
  pt:{
    "nav.impact":"Impacto",
    "nav.tools":"Ferramentas",
    "nav.contact":"Contato",
    "hero.ctaContact":"Contato",
    "hero.ctaCv":"Baixar CV",
    "impact.title":"Impactos",
    "tools.title":"Ferramentas & Métricas",
    "contact.title":"Contato"
  }
};

const lang = localStorage.getItem("lang") || (navigator.language.startsWith("pt") ? "pt" : "en");
localStorage.setItem("lang", lang);

document.querySelectorAll("[data-i18n]").forEach(el=>{
  el.textContent = dict[lang][el.dataset.i18n];
});

document.querySelectorAll(".langBtn").forEach(btn=>{
  btn.onclick = ()=>location.reload(localStorage.setItem("lang", btn.dataset.lang));
});
