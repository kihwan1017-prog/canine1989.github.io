/* 진입 fade-up, FAQ 아코디언, 헤더 스크롤 상태 */

(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 푸터 연도
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // 스크롤 시 헤더 구분선
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // 섹션 진입 fade-up
  const revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // 모바일 메뉴 토글
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (navToggle && nav) {
    const closeNav = () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.addEventListener("click", () => {
      const willOpen = navToggle.getAttribute("aria-expanded") !== "true";
      nav.classList.toggle("is-open", willOpen);
      navToggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 640) closeNav();
    });
  }

  // FAQ 아코디언 — 한 번에 하나만 열림
  const faqRoot = document.querySelector("[data-faq]");
  if (!faqRoot) return;

  const items = Array.from(faqRoot.querySelectorAll(".faq__item"));

  items.forEach((item) => {
    const trigger = item.querySelector(".faq__trigger");
    const panel = item.querySelector(".faq__panel");
    if (!trigger || !panel) return;

    trigger.addEventListener("click", () => {
      const willOpen = trigger.getAttribute("aria-expanded") !== "true";

      items.forEach((other) => {
        const otherTrigger = other.querySelector(".faq__trigger");
        const otherPanel = other.querySelector(".faq__panel");
        if (!otherTrigger || !otherPanel) return;
        otherTrigger.setAttribute("aria-expanded", "false");
        otherPanel.hidden = true;
      });

      if (willOpen) {
        trigger.setAttribute("aria-expanded", "true");
        panel.hidden = false;
      }
    });
  });
})();
