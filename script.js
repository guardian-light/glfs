const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
const loader = document.querySelector(".page-loader");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const scrollToPageTop = () => {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
};

scrollToPageTop();
window.addEventListener("pageshow", scrollToPageTop);

if (toggle && links) {
  const closeMenu = () => {
    links.classList.remove("open");
    toggle.classList.remove("open");
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      closeMenu();
    }
  });
}

document.body.classList.add("loading-active");

const hideLoader = () => {
  if (!loader) {
    document.body.classList.remove("loading-active");
    return;
  }

  loader.classList.add("is-hidden");
  document.body.classList.remove("loading-active");
};

window.addEventListener("load", () => {
  window.setTimeout(hideLoader, reduceMotion ? 0 : 700);
  startCounters();
  setupScrollVideos();
  setupScrollReveal();
  setupFaqTabs();
  setupMapClipboardToast();
  setupBackToTop();
  setupCreatorEgg();
});

window.setTimeout(hideLoader, 1800);

document.querySelectorAll('a[href$=".html"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (!href || link.target || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    document.body.classList.add("is-leaving");
    window.setTimeout(() => {
      window.location.href = href;
    }, reduceMotion ? 0 : 220);
  });
});

function startCounters() {
  const counters = document.querySelectorAll(".stat strong");

  counters.forEach((counter) => {
    const target = Number(counter.textContent.replace(/,/g, ""));

    if (!Number.isFinite(target)) {
      return;
    }

    if (reduceMotion) {
      counter.textContent = target.toLocaleString();
      return;
    }

    const duration = 2600;
    const startingValue = Math.max(1, Math.floor(target * 0.18));
    const start = performance.now();

    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = startingValue + (target - startingValue) * eased;
      counter.textContent = Math.round(current).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    counter.textContent = startingValue.toLocaleString();
    requestAnimationFrame(update);
  });
}

function setupScrollVideos() {
  const videos = document.querySelectorAll(".scroll-video");

  if (!videos.length) {
    return;
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    videos.forEach((video) => {
      video.loop = true;
      video.controls = true;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        video.loop = true;

        if (entry.isIntersecting) {
          video.play().catch(() => {
            video.controls = true;
          });
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.45 }
  );

  videos.forEach((video) => observer.observe(video));
}

function setupScrollReveal() {
  const revealItems = document.querySelectorAll(
    "main .hero > *, .stats .stat, .section-head, .original-map-shell, .ne-map-card, .card, .faq-item, .mosaic-photo, .mosaic-panel, .process-card, .split > *, .video-frame, .contact-box, .location"
  );

  revealItems.forEach((item, index) => {
    item.classList.add("reveal-right");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 80}ms`);
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

function setupFaqTabs() {
  const tabs = document.querySelectorAll("[data-faq-target]");
  const panels = document.querySelectorAll("[data-faq-panel]");
  const tabList = document.querySelector(".faq-tabs");

  if (!tabs.length || !panels.length) {
    return;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.faqTarget;
      tabList?.classList.add("has-selection");

      tabs.forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      });

      panels.forEach((panel) => {
        const isActive = panel.id === targetId;
        panel.classList.toggle("active", isActive);
        if (!isActive) {
          panel.querySelectorAll("details[open]").forEach((item) => {
            item.open = false;
          });
        }
      });
    });
  });
}

function setupCreatorEgg() {
  const egg = document.querySelector(".creator-egg");

  if (!egg) {
    return;
  }

  let toast = document.querySelector(".creator-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "creator-toast";
    toast.setAttribute("role", "status");
    toast.textContent = "Made by Ashton Willard";
    document.body.appendChild(toast);
  }

  egg.addEventListener("click", () => {
    toast.classList.add("show");
    window.setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  });
}

function setupMapClipboardToast() {
  let toast = document.querySelector(".clipboard-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "clipboard-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.textContent = "Copied to Clipboard";
  }

  if (toast.parentElement !== document.body) {
    document.body.appendChild(toast);
  }

  let toastTimer;

  window.addEventListener("message", (event) => {
    if (event.data?.type !== "glfs-map-copied") {
      return;
    }

    clearTimeout(toastTimer);
    toast.classList.add("show");
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 1800);
  });
}

function setupBackToTop() {
  const button = document.createElement("button");
  button.className = "back-to-top";
  button.type = "button";
  button.setAttribute("aria-label", "Back to top");
  button.textContent = "↑";
  document.body.appendChild(button);

  const toggleButton = () => {
    button.classList.toggle("show", window.scrollY > 520);
  };

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  toggleButton();
  window.addEventListener("scroll", toggleButton, { passive: true });
}
