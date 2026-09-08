/* global Swiper */

(function () {
  "use strict";

  function init() {
    // Accordion
    // ----------------------------------------
    const accordions = document.querySelectorAll("[data-accordion]");
    accordions.forEach((header) => {
      header.addEventListener("click", () => {
        const accordionItem = header.parentElement;
        accordionItem.classList.toggle("active");
      });
    });

    // Glow card: halo corail qui suit le curseur sur la bordure
    // ----------------------------------------
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".glow-card").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        });
      });
    }

    // Filter bar (pages catégories : filtre les boxes produit)
    // ----------------------------------------
    const filterBar = document.querySelector("[data-filter-bar]");
    if (filterBar) {
      const pills = filterBar.querySelectorAll("[data-filter-group]");
      const resetBtn = filterBar.querySelector("[data-filter-reset]");
      const countEl = filterBar.querySelector("[data-filter-count]");
      const boxes = document.querySelectorAll(".product-box");

      const activeByGroup = () => {
        const map = {};
        pills.forEach((pill) => {
          if (pill.getAttribute("aria-pressed") === "true") {
            const group = pill.dataset.filterGroup;
            if (!map[group]) map[group] = [];
            map[group].push(pill.dataset.filterValue);
          }
        });
        return map;
      };

      const applyFilters = () => {
        const active = activeByGroup();
        const groupIds = Object.keys(active);
        let visible = 0;
        boxes.forEach((box) => {
          const matches = groupIds.every((groupId) => {
            const tokens = (box.getAttribute(`data-${groupId}`) || "").split(
              /\s+/,
            );
            return active[groupId].some((value) => tokens.includes(value));
          });
          // Toggle via le style inline plutôt qu'une classe : une classe
          // "hidden" perd face à l'utilitaire Tailwind `flex`/`grid` déjà
          // présent sur la box selon l'ordre des couches CSS générées, alors
          // qu'un style inline gagne toujours sur les règles de feuille de
          // style.
          box.style.display = matches ? "" : "none";
          if (matches) visible += 1;
        });
        if (countEl) {
          countEl.textContent = `${visible} produit${visible === 1 ? "" : "s"} affiché${visible === 1 ? "" : "s"}`;
        }
      };

      pills.forEach((pill) => {
        pill.addEventListener("click", () => {
          const pressed = pill.getAttribute("aria-pressed") === "true";
          pill.setAttribute("aria-pressed", pressed ? "false" : "true");
          applyFilters();
        });
      });

      resetBtn?.addEventListener("click", () => {
        pills.forEach((pill) => pill.setAttribute("aria-pressed", "false"));
        applyFilters();
      });
    }

    // Tab
    // ----------------------------------------
    function setActiveTab(tabGroup, tabName) {
      const tabsNav = tabGroup.querySelector("[data-tab-nav]");
      const tabsContent = tabGroup.querySelector("[data-tab-content]");
      if (!tabsNav || !tabsContent) return;

      tabsNav.querySelectorAll("[data-tab]").forEach((tabNavItem) => {
        tabNavItem.classList.remove("active");
      });
      tabsContent.querySelectorAll("[data-tab-panel]").forEach((tabPane) => {
        tabPane.classList.remove("active");
      });

      const selectedTabNavItem = tabsNav.querySelector(
        `[data-tab="${tabName}"]`,
      );
      if (selectedTabNavItem) selectedTabNavItem.classList.add("active");
      const selectedTabPane = tabsContent.querySelector(
        `[data-tab-panel="${tabName}"]`,
      );
      if (selectedTabPane) selectedTabPane.classList.add("active");
    }

    const tabGroups = document.querySelectorAll("[data-tab-group]");
    tabGroups.forEach((tabGroup) => {
      const tabsNav = tabGroup.querySelector("[data-tab-nav]");
      if (!tabsNav) return;
      const tabsNavItem = tabsNav.querySelectorAll("[data-tab]");
      if (!tabsNavItem.length) return;
      const activeTabName = tabsNavItem[0].getAttribute("data-tab");
      setActiveTab(tabGroup, activeTabName);

      tabsNavItem.forEach((tabNavItem) => {
        tabNavItem.addEventListener("click", () => {
          const tabName = tabNavItem.dataset.tab;
          setActiveTab(tabGroup, tabName);
        });
      });
    });

    const tablist = document.querySelectorAll("[data-tab-nav] [data-tab]");
    function tabsHandler(event) {
      let index = Array.from(tablist).indexOf(event.currentTarget);
      let numbTabs = tablist.length;
      let nextId;
      if (numbTabs > 1) {
        if (event.key === "ArrowRight") {
          nextId = tablist[(index + 1) % numbTabs];
          nextId.focus();
          nextId.click();
        }
        if (event.key === "ArrowLeft") {
          nextId = tablist[(index - 1 + numbTabs) % numbTabs];
          nextId.focus();
          nextId.click();
        }
      }
    }
    tablist.forEach(function (tab) {
      tab.addEventListener("keydown", tabsHandler);
    });

    // Modal
    // ----------------------------------------
    const openModalButtons = document.querySelectorAll("[data-modal-open]");
    const closeModalButtons = document.querySelectorAll("[data-modal-close]");

    function openModal(modal) {
      if (!modal) return;
      const overlay = modal.querySelector("[data-modal-overlay]");
      modal.style.display = "block";
      if (overlay) overlay.style.display = "block";
    }

    function closeModal(modal) {
      if (!modal) return;
      const overlay = modal.querySelector("[data-modal-overlay]");
      modal.style.display = "none";
      if (overlay) overlay.style.display = "none";
    }

    openModalButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const modal = button.nextElementSibling;
        openModal(modal);
      });
    });

    closeModalButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const modal = button.closest("[data-modal]");
        closeModal(modal);
      });
    });

    // Starred Box
    const mainFeatureStarred = document.querySelectorAll("[data-is-starred]");
    mainFeatureStarred.forEach((el) => {
      const isStarred = el.getAttribute("data-is-starred");
      el.style.display = isStarred === "true" ? "block" : "none";
    });

    // BN Cards indent on desktop
    const bnCardsLayout = () => {
      const bnCards = document.querySelectorAll("[data-bn-card]");
      bnCards.forEach((card) => {
        const cardNumber = card.getAttribute("data-bn-card");
        if (cardNumber) {
          if (window.innerWidth > 1280) {
            card.style.marginInline = `${(cardNumber - 1) * 38}px`;
          } else {
            card.style.marginInline = "0px";
          }
        }
      });
    };
    window.addEventListener("resize", bnCardsLayout);
    bnCardsLayout();

    // Comparison Row - randomize images
    const comparisonRows = document.querySelectorAll(
      "[data-comparison-row-images-path]",
    );
    comparisonRows.forEach((row) => {
      const images = JSON.parse(row.dataset.comparisonRowImagesPath);
      const container = row;
      container.innerHTML = "";
      images.sort(() => 0.5 - Math.random());
      images.slice(0, Math.floor(Math.random() * 4) + 2).forEach((imgPath) => {
        const img = document.createElement("img");
        img.src = imgPath;
        img.alt = "Comparison Image";
        img.draggable = false;
        img.className = "max-h-12";
        container.appendChild(img);
      });
    });

    // Testimonial Videos - play/pause on click
    const videoContainers = document.querySelectorAll(
      "[data-testimonial-video]",
    );
    videoContainers.forEach((container) => {
      const video = container.querySelector("video");
      const toggleBtn = container.querySelector("button");
      if (!video || !toggleBtn) return;

      toggleBtn.addEventListener("click", () => {
        if (video.paused) {
          toggleBtn.setAttribute("aria-label", "Pause Video");
          toggleBtn.style.opacity = "0";
          video.play();
        } else {
          toggleBtn.setAttribute("aria-label", "Play Video");
          toggleBtn.classList.add("bg-dark/40");
          toggleBtn.style.opacity = "1";
          video.pause();
        }
      });
    });

    // Header: soft shadow on scroll
    // ----------------------------------------
    const header = document.querySelector(".header");
    if (header) {
      const updateScrolled = () => {
        header.classList.toggle("is-scrolled", window.scrollY > 8);
      };
      window.addEventListener("scroll", updateScrolled, { passive: true });
      updateScrolled();
    }

    // Menu burger « push-down » (tablette + mobile)
    // Le menu s'ouvre dans le flux et pousse le contenu vers le bas ; à la
    // fermeture, tout remonte. Ce n'est pas un overlay : pas de verrou de
    // scroll, pas de piège à focus (les liens révélés suivent naturellement
    // le bouton dans l'ordre de tabulation).
    // ----------------------------------------
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navCollapse = document.getElementById("nav-collapse");

    // Point de rupture desktop (Tailwind `xl` = 80rem). En dessous (tablette
    // + mobile) le menu horizontal est remplacé par le menu burger.
    const NAV_DESKTOP_MIN = 1280;

    const firstMenuLink = () =>
      navMenu ? navMenu.querySelector("a.nav-link, a") : null;

    // Hauteur réelle du menu (mesurée sur le <ul>, jamais contraint en hauteur).
    const menuHeight = () => (navMenu ? navMenu.scrollHeight : 0);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let navAnim = null;

    // Fige l'état de repos du conteneur d'après la classe `menu-open` :
    // ouvert = hauteur libre + overflow visible (halos de focus non rognés),
    // fermé = hauteur 0 + overflow caché.
    const finalizeCollapse = () => {
      if (!navCollapse) return;
      const open = header.classList.contains("menu-open");
      navCollapse.style.maxHeight = open ? "none" : "0px";
      navCollapse.style.overflow = open ? "visible" : "hidden";
    };

    // Anime la hauteur du conteneur (Web Animations API : fiable là où une
    // transition CSS sur max-height se comporte mal quand le display change).
    // La poussée du contenu de la page suit naturellement.
    const animateCollapse = (open) => {
      if (!navCollapse) return;
      if (navAnim) navAnim.cancel();

      const from = navCollapse.getBoundingClientRect().height;
      const target = open ? menuHeight() : 0;

      navCollapse.style.overflow = "hidden";
      navCollapse.style.maxHeight = target + "px";

      if (prefersReducedMotion) {
        finalizeCollapse();
        return;
      }

      navAnim = navCollapse.animate(
        [{ maxHeight: from + "px" }, { maxHeight: target + "px" }],
        { duration: 320, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
      );
      navAnim.onfinish = () => {
        navAnim = null;
        finalizeCollapse();
      };
    };

    const closeMobileMenu = ({ restoreFocus = false } = {}) => {
      if (!header || !navToggle) return;
      if (!header.classList.contains("menu-open")) return;
      animateCollapse(false);
      header.classList.remove("menu-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Ouvrir le menu");
      if (restoreFocus) navToggle.focus();
    };

    const openMobileMenu = () => {
      if (!header || !navToggle) return;
      header.classList.add("menu-open");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Fermer le menu");
      animateCollapse(true);
      // Focus géré : on amène le focus sur le premier lien une fois le
      // déroulé lancé (le menu reste dans le flux, on ne piège pas Tab).
      const first = firstMenuLink();
      if (first) window.setTimeout(() => first.focus({ preventScroll: true }), 60);
    };

    if (header && navToggle) {
      navToggle.addEventListener("click", () => {
        if (header.classList.contains("menu-open")) {
          closeMobileMenu({ restoreFocus: true });
        } else {
          openMobileMenu();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && header.classList.contains("menu-open")) {
          closeMobileMenu({ restoreFocus: true });
        }
      });

      // Fermeture au clic en dehors de l'en-tête.
      document.addEventListener("click", (e) => {
        if (!header.classList.contains("menu-open")) return;
        if (!header.contains(e.target)) closeMobileMenu();
      });

      // Fermeture au clic sur un lien / sur le bouton « Comparer ».
      navMenu
        ?.querySelectorAll("a.nav-link, .nav-cta-mobile a")
        .forEach((link) => {
          link.addEventListener("click", () => closeMobileMenu());
        });

      window.addEventListener("resize", () => {
        if (window.innerWidth >= NAV_DESKTOP_MIN) {
          closeMobileMenu();
        } else if (header.classList.contains("menu-open") && !navAnim) {
          // Menu ouvert : hauteur libre, il suit le contenu quoi qu'il arrive.
          finalizeCollapse();
        }
      });
    }

    // Dropdown submenus in the nav (click for touch/keyboard; hover via CSS)
    // ----------------------------------------
    document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
      const toggle = dropdown.querySelector(".nav-dropdown-toggle");
      const list = dropdown.querySelector(".nav-dropdown-list");
      if (!toggle || !list) return;

      toggle.addEventListener("click", () => {
        const isOpen = list.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });

      dropdown.addEventListener("focusout", (e) => {
        if (!dropdown.contains(e.relatedTarget)) {
          list.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    });

    document.addEventListener("click", (e) => {
      document.querySelectorAll(".nav-dropdown-list.open").forEach((list) => {
        const dropdown = list.closest(".nav-dropdown");
        if (dropdown && !dropdown.contains(e.target)) {
          list.classList.remove("open");
          dropdown
            .querySelector(".nav-dropdown-toggle")
            ?.setAttribute("aria-expanded", "false");
        }
      });
    });

    // Animated nav cursor: a pill slides behind the hovered/focused link,
    // width/height/position read straight off the link's own box
    // (offsetLeft/offsetWidth/offsetTop/offsetHeight). The targeted link
    // gets a "cursor-over" class (white text + mix-blend-mode: difference)
    // so it auto-inverts as the pill slides underneath. Desktop only, off
    // when the user prefers reduced motion.
    // ----------------------------------------
    if (navMenu) {
      const cursor = document.getElementById("nav-cursor");
      const prefersMotion = window.matchMedia(
        "(prefers-reduced-motion: no-preference)",
      ).matches;

      if (cursor && prefersMotion) {
        const links = Array.from(navMenu.querySelectorAll(".nav-link"));
        const getActiveLink = () =>
          links.find((link) => link.classList.contains("active")) || null;

        const moveCursorTo = (el) => {
          links.forEach((link) => link.classList.remove("cursor-over"));

          if (!el) {
            cursor.style.opacity = "0";
            return;
          }

          cursor.style.width = `${el.offsetWidth}px`;
          cursor.style.height = `${el.offsetHeight}px`;
          cursor.style.transform = `translate(${el.offsetLeft}px, ${el.offsetTop}px)`;
          cursor.style.opacity = "1";
          el.classList.add("cursor-over");
        };

        // Place without transition on first paint / resize so it doesn't
        // slide in from the left edge.
        const placeCursorInstantly = (el) => {
          cursor.style.transition = "none";
          moveCursorTo(el);
          void cursor.offsetWidth;
          cursor.style.transition = "";
        };

        if (window.innerWidth >= 1280) {
          placeCursorInstantly(getActiveLink());
        }

        links.forEach((link) => {
          link.addEventListener("mouseenter", () => moveCursorTo(link));
          link.addEventListener("focus", () => moveCursorTo(link));
        });

        navMenu.addEventListener("mouseleave", () =>
          moveCursorTo(getActiveLink()),
        );
        navMenu.addEventListener("focusout", (e) => {
          if (!navMenu.contains(e.relatedTarget)) {
            moveCursorTo(getActiveLink());
          }
        });

        window.addEventListener("resize", () => {
          if (window.innerWidth >= 1280) {
            placeCursorInstantly(getActiveLink());
          } else {
            cursor.style.opacity = "0";
            links.forEach((link) => link.classList.remove("cursor-over"));
          }
        });
      }
    }
  }

  // Run immediately — scripts are at end of body, DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
