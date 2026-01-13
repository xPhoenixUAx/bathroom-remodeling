// Main JS: menu toggle, form validation, lightbox
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", nav.classList.contains("open"));
    });
  }
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href.length > 1) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        if (nav.classList.contains("open")) nav.classList.remove("open");
      }
    });
  });
  // Simple form validation
  document.querySelectorAll("form[data-validate]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      const name = form.querySelector('[name="name"]');
      const phone = form.querySelector('[name="phone"]');
      const email = form.querySelector('[name="email"]');
      let ok = true;
      if (name && name.value.trim() === "") {
        ok = false;
        name.classList.add("error");
      }
      if (phone && phone.value.trim() === "") {
        ok = false;
        phone.classList.add("error");
      }
      if (
        email &&
        email.value.trim() !== "" &&
        !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)
      ) {
        ok = false;
        email.classList.add("error");
      }
      if (!ok) {
        e.preventDefault();
        alert("Please complete required fields.");
      }
    });
  });
  // Lightbox & small UX helpers (delegation)
  document.addEventListener("click", function (e) {
    const target = e.target.closest("[data-lightbox]");
    if (target) {
      e.preventDefault();
      openLightbox(
        target.getAttribute("data-lightbox-src") ||
          target.getAttribute("href") ||
          target.src
      );
    }
  });

  function openLightbox(src) {
    let overlay = document.querySelector(".lb-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "lb-overlay";
      overlay.style.cssText =
        "position:fixed;inset:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:120";
      const img = document.createElement("img");
      img.style.maxWidth = "90%";
      img.style.maxHeight = "90%";
      img.alt = "Enlarged project image";
      overlay.appendChild(img);
      overlay.addEventListener("click", () => overlay.remove());
      document.body.appendChild(overlay);
    }
    const img = overlay.querySelector("img");
    img.src = src;
  }

  // Graceful form submit UX for demo (prevents navigation when action is '#')
  document.addEventListener("submit", function (e) {
    const form = e.target;
    if (form.tagName.toLowerCase() !== "form") return;
    if (form.getAttribute("action") === "#") {
      e.preventDefault();
      // small success state
      const btn = form.querySelector("button[type=submit]");
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = "Sending…";
        btn.disabled = true;
        setTimeout(() => {
          btn.innerHTML = "Sent — we will contact you";
          btn.classList.add("sent");
          setTimeout(() => {
            btn.innerHTML = orig;
            btn.disabled = false;
            btn.classList.remove("sent");
          }, 3000);
        }, 900);
      }
    }
  });

  // Optional pointer-based tilt for .card elements (subtle 3D parallax)
  (function addCardTilt() {
    try {
      const supportsTilt =
        !("ontouchstart" in window) &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
      if (!supportsTilt) return;
      const cards = document.querySelectorAll(".card");
      cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width;
          const py = (e.clientY - rect.top) / rect.height;
          const rotY = (px - 0.5) * 14; // -7..7
          const rotX = (0.5 - py) * 8; // -4..4
          card.style.transform = `translateY(-10px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        });
        card.addEventListener("mouseleave", () => {
          card.style.transform = "";
        });
        card.addEventListener(
          "touchstart",
          () => {
            card.style.transition = "transform 150ms";
          },
          { passive: true }
        );
      });
    } catch (err) {
      // fail silently
      console.warn("card tilt init failed", err);
    }
  })();

  // Cookie banner: inject, link to cookie.html, and handle Accept/Decline
  (function cookieBanner() {
    try {
      const key = "luxurybath_cookie_consent";
      const val = localStorage.getItem(key);
      if (val === "accepted" || val === "declined") return;

      const banner = document.createElement("div");
      banner.className = "cookie-banner";
      banner.innerHTML = `
        <div class="cookie-text">We use cookies to enhance your browsing experience and analyze site traffic. By continuing to use our website, you consent to our use of cookies. <a href="cookie.html">Learn more</a></div>
        <div class="cookie-actions">
          <button class="cookie-decline">Decline</button>
          <button class="cookie-accept">Accept</button>
        </div>`;

      document.body.appendChild(banner);
      // animate in
      requestAnimationFrame(() => banner.classList.add("show"));

      function close(state) {
        try {
          localStorage.setItem(key, state);
        } catch (e) {
          // ignore storage errors
        }
        banner.classList.remove("show");
        setTimeout(() => banner.remove(), 320);
      }

      banner
        .querySelector(".cookie-accept")
        .addEventListener("click", function () {
          close("accepted");
        });
      banner
        .querySelector(".cookie-decline")
        .addEventListener("click", function () {
          close("declined");
        });
    } catch (err) {
      // fail silently — non-critical
      console.warn("cookie banner init failed", err);
    }
  })();
  // Services list toggle: show/hide extra service cards
  (function servicesToggle() {
    const toggle = document.querySelector(".toggle-services");
    const list = document.getElementById("services-list");
    if (!toggle || !list) return;
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      const expanded = list.classList.toggle("expanded");
      toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
      const label = toggle.querySelector("span");
      if (label)
        label.textContent = expanded
          ? "See fewer services"
          : "See all services";
    });
  })();

  // blog enhancements removed — blog page deprecated
});
