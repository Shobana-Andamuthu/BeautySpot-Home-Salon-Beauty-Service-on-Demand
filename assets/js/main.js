/* =========================================================
   BeautySpot — Main JavaScript
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Mobile Menu ---------- */
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  if (menuToggle && mobileNav) {
    function toggleMobileNav(open) {
      mobileNav.classList.toggle("open", open);
      menuToggle.classList.toggle("active", open);
      document.body.classList.toggle("menu-open", open);
      document.documentElement.classList.toggle("menu-open", open);
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    menuToggle.addEventListener("click", function () {
      const open = !mobileNav.classList.contains("open");
      toggleMobileNav(open);
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (!link.classList.contains("mobile-drop-toggle")) {
          toggleMobileNav(false);
        }
      });
    });

    // Prevent background scrolling on touch devices when mobile nav is active
    document.addEventListener("touchmove", function (e) {
      if (document.body.classList.contains("menu-open")) {
        if (!e.target.closest(".mobile-nav")) {
          e.preventDefault();
        }
      }
    }, { passive: false });
  }

  /* ---------- Mobile Home Dropdown ---------- */
  document.querySelectorAll(".mobile-drop-toggle").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const sub = btn.nextElementSibling;
      if (sub && sub.classList.contains("mobile-sub")) {
        const isOpen = sub.classList.toggle("open");
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
        const icon = btn.querySelector("i");
        if (icon) {
          icon.className = isOpen ? "bi bi-chevron-up" : "bi bi-chevron-down";
        }
      }
    });
  });

  /* ---------- Desktop Home Dropdown (click for touch) ---------- */
  document.querySelectorAll(".nav-desktop > li.has-dropdown > a").forEach(function (trigger) {
    trigger.addEventListener("click", function (e) {
      if (window.matchMedia("(hover: none)").matches || window.innerWidth < 1024) {
        e.preventDefault();
        const parent = trigger.parentElement;
        parent.classList.toggle("open");
        document.querySelectorAll(".nav-desktop > li.has-dropdown").forEach(function (li) {
          if (li !== parent) li.classList.remove("open");
        });
      }
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".has-dropdown")) {
      document.querySelectorAll(".nav-desktop > li.has-dropdown").forEach(function (li) {
        li.classList.remove("open");
      });
    }
  });

  /* ---------- Scroll Reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal-on-scroll");
  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ---------- Counter Animation ---------- */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (c) {
      cio.observe(c);
    });
  }

  /* ---------- Preloader Handler (Requirement 12) ---------- */
  function hidePreloader() {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.style.opacity = "0";
      preloader.style.visibility = "hidden";
      setTimeout(function () {
        if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 300);
    }
  }
  if (document.readyState === "complete" || document.readyState === "interactive") {
    hidePreloader();
  } else {
    document.addEventListener("DOMContentLoaded", hidePreloader);
    window.addEventListener("load", hidePreloader);
  }
  setTimeout(hidePreloader, 400);

  /* ---------- Back to Top Button ---------- */
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    }, { passive: true });

    backToTopBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Service Filter & Pagination ---------- */
  document.querySelectorAll(".filter-bar").forEach(function (bar) {
    const buttons = bar.querySelectorAll(".filter-btn");
    const targetSel = bar.getAttribute("data-target");

    function applyFilter(filter) {
      const items = targetSel
        ? Array.from(document.querySelectorAll(targetSel))
        : Array.from(document.querySelectorAll(".service-cat-card, .service-tile[data-category]"));

      const matchingItems = [];

      items.forEach(function (item) {
        const cat = item.getAttribute("data-category") || item.getAttribute("data-status");
        if (filter === "all" || cat === filter) {
          matchingItems.push(item);
        } else {
          item.style.setProperty("display", "none", "important");
        }
      });

      const hairSec = document.getElementById("hair-services");
      const skinSec = document.getElementById("skin-services");
      const nailsBridalSec = document.getElementById("nails-bridal");

      if (hairSec) hairSec.style.display = "none";
      if (skinSec) skinSec.style.display = "none";
      if (nailsBridalSec) nailsBridalSec.style.display = "none";

      // If services pagination wrapper exists, run pagination
      if (document.getElementById("servicesPagination")) {
        renderServicesPagination(matchingItems);
      } else {
        matchingItems.forEach(function (item) {
          if (item.tagName === "TR") {
            item.style.setProperty("display", "table-row", "important");
          } else if (item.classList.contains("price-card-col") || item.classList.contains("col-lg-3") || item.classList.contains("col-md-6")) {
            item.style.setProperty("display", "block", "important");
          } else {
            item.style.setProperty("display", "flex", "important");
          }
          item.style.opacity = "1";
          item.classList.add("visible");
        });
      }
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        const filter = btn.getAttribute("data-filter");
        applyFilter(filter);
      });
    });

    // Execute immediately on DOM ready
    const initialBtn = bar.querySelector(".filter-btn.active") || bar.querySelector(".filter-btn");
    if (initialBtn) {
      applyFilter(initialBtn.getAttribute("data-filter") || "all");
    } else {
      applyFilter("all");
    }
  });

  /* ---------- Multi-step Booking ---------- */
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    let currentStep = 1;
    const totalSteps = 6;
    const panels = bookingForm.querySelectorAll(".booking-panel");
    const indicators = document.querySelectorAll(".booking-step-indicator");
    const bookingData = {
      service: "",
      price: "",
      date: "",
      time: "",
      address: "",
      city: "",
      pincode: "",
      notes: ""
    };

    function showStep(step) {
      currentStep = step;
      panels.forEach(function (p) {
        p.classList.toggle("active", parseInt(p.getAttribute("data-step"), 10) === step);
      });
      indicators.forEach(function (ind) {
        const s = parseInt(ind.getAttribute("data-step"), 10);
        ind.classList.toggle("active", s === step);
        ind.classList.toggle("done", s < step);
      });
      window.scrollTo({ top: bookingForm.offsetTop - 100, behavior: "smooth" });
    }

    function validateStep(step) {
      if (step === 1 && !bookingData.service) {
        alert("Please select a service.");
        return false;
      }
      if (step === 2) {
        const dateInput = document.getElementById("bookingDate");
        if (!dateInput || !dateInput.value) {
          alert("Please choose a date.");
          return false;
        }
        bookingData.date = dateInput.value;
      }
      if (step === 3 && !bookingData.time) {
        alert("Please select a time slot.");
        return false;
      }
      if (step === 4) {
        const address = document.getElementById("bookingAddress");
        const city = document.getElementById("bookingCity");
        const pin = document.getElementById("bookingPin");
        if (!address.value.trim() || !city.value.trim() || !pin.value.trim()) {
          alert("Please fill in your complete address.");
          return false;
        }
        bookingData.address = address.value.trim();
        bookingData.city = city.value.trim();
        bookingData.pincode = pin.value.trim();
        bookingData.notes = (document.getElementById("bookingNotes").value || "").trim();
      }
      return true;
    }

    function updateReview() {
      const map = {
        revService: bookingData.service,
        revDate: bookingData.date,
        revTime: bookingData.time,
        revAddress: bookingData.address + ", " + bookingData.city + " — " + bookingData.pincode,
        revPrice: bookingData.price
      };
      Object.keys(map).forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.textContent = map[id] || "—";
      });
    }

    bookingForm.querySelectorAll(".service-option").forEach(function (opt) {
      opt.addEventListener("click", function () {
        bookingForm.querySelectorAll(".service-option").forEach(function (o) {
          o.classList.remove("selected");
        });
        opt.classList.add("selected");
        bookingData.service = opt.getAttribute("data-service");
        bookingData.price = opt.getAttribute("data-price");
      });
    });

    bookingForm.querySelectorAll(".time-slot").forEach(function (slot) {
      slot.addEventListener("click", function () {
        bookingForm.querySelectorAll(".time-slot").forEach(function (s) {
          s.classList.remove("selected");
        });
        slot.classList.add("selected");
        bookingData.time = slot.getAttribute("data-time");
      });
    });

    bookingForm.querySelectorAll("[data-next]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!validateStep(currentStep)) return;
        if (currentStep === 4) updateReview();
        if (currentStep < totalSteps) showStep(currentStep + 1);
      });
    });

    bookingForm.querySelectorAll("[data-prev]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (currentStep > 1) showStep(currentStep - 1);
      });
    });

    const confirmBtn = document.getElementById("confirmBooking");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", function () {
        try {
          sessionStorage.setItem("bs_booking", JSON.stringify(bookingData));
        } catch (e) {}
        window.location.href = "booking-success.html";
      });
    }

    const dateInput = document.getElementById("bookingDate");
    if (dateInput) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      dateInput.min = yyyy + "-" + mm + "-" + dd;
    }
  }

  /* ---------- Booking Success hydrate ---------- */
  if (document.body.classList.contains("page-booking-success")) {
    try {
      const raw = sessionStorage.getItem("bs_booking");
      if (raw) {
        const data = JSON.parse(raw);
        const set = function (id, val) {
          const el = document.getElementById(id);
          if (el && val) el.textContent = val;
        };
        set("successService", data.service);
        set("successDate", data.date);
        set("successTime", data.time);
        set("successAddress", data.address + (data.city ? ", " + data.city : ""));
      }
    } catch (e) {}
  }

  /* ---------- Dashboard Tabs ---------- */
  function activateDashPanel(target) {
    if (!target) return;
    document.querySelectorAll(".dash-nav button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-panel") === target);
    });
    document.querySelectorAll(".dash-panel").forEach(function (p) {
      p.classList.toggle("active", p.id === target);
    });
  }

  document.querySelectorAll(".dash-nav button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      activateDashPanel(btn.getAttribute("data-panel"));
    });
  });

  document.querySelectorAll("[data-panel-jump]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      activateDashPanel(btn.getAttribute("data-panel-jump"));
    });
  });

  /* ---------- Tracking Demo ---------- */
  const trackDemo = document.getElementById("startTrackDemo");
  if (trackDemo) {
    const steps = document.querySelectorAll("#trackTimeline .track-step");
    let idx = 0;
    trackDemo.addEventListener("click", function () {
      idx = 0;
      steps.forEach(function (s) {
        s.classList.remove("done", "active");
      });
      const eta = document.getElementById("trackEta");
      const statusLabel = document.getElementById("trackStatusLabel");
      const interval = setInterval(function () {
        if (idx > 0) steps[idx - 1].classList.remove("active");
        if (idx > 0) steps[idx - 1].classList.add("done");
        if (idx < steps.length) {
          steps[idx].classList.add("active");
          if (statusLabel) statusLabel.textContent = steps[idx].getAttribute("data-label");
          if (eta) {
            const remaining = Math.max(0, 18 - idx * 3);
            eta.textContent = remaining === 0 ? "Arrived" : remaining + " minutes";
          }
          idx++;
        } else {
          clearInterval(interval);
          steps[steps.length - 1].classList.add("done");
          steps[steps.length - 1].classList.remove("active");
        }
      }, 1200);
    });
  }

  /* ---------- Invoice Print ---------- */
  const printBtn = document.getElementById("printInvoice");
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }

  /* ---------- Password Visibility Toggle ---------- */
  document.querySelectorAll(".password-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const targetSel = btn.getAttribute("data-toggle-target");
      const input = targetSel ? document.querySelector(targetSel) : btn.previousElementSibling;
      if (!input) return;
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      const icon = btn.querySelector("i");
      if (icon) {
        icon.className = isHidden ? "bi bi-eye-slash" : "bi bi-eye";
      }
      btn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    });
  });

  /* ---------- Form Validation ---------- */
  document.querySelectorAll("form[data-validate]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll("[required]").forEach(function (field) {
        if (!field.value.trim()) {
          field.classList.add("is-invalid");
          valid = false;
        } else {
          field.classList.remove("is-invalid");
        }
        if (field.type === "email" && field.value) {
          const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
          if (!ok) {
            field.classList.add("is-invalid");
            valid = false;
          }
        }
        if (field.type === "password" && field.hasAttribute("data-match")) {
          const other = document.querySelector(field.getAttribute("data-match"));
          if (other && field.value !== other.value) {
            field.classList.add("is-invalid");
            valid = false;
          }
        }
      });

      if (valid) {
        const alertBox = form.querySelector(".alert-success-custom");
        if (alertBox) {
          alertBox.classList.add("show");
          alertBox.textContent = form.getAttribute("data-success") || "Submitted successfully!";
        }
        if (form.getAttribute("data-redirect")) {
          setTimeout(function () {
            window.location.href = form.getAttribute("data-redirect");
          }, 900);
        } else {
          form.reset();
        }
      }
    });

    form.querySelectorAll("[required]").forEach(function (field) {
      field.addEventListener("input", function () {
        field.classList.remove("is-invalid");
      });
    });
  });

  /* ---------- Quick Book (Home 2) ---------- */
  const quickBook = document.getElementById("quickBookForm");
  if (quickBook) {
    quickBook.addEventListener("submit", function (e) {
      e.preventDefault();
      window.location.href = "booking.html";
    });
  }

  /* ---------- Active Nav Highlight ---------- */
  const rawPath = window.location.pathname.split("/").pop() || "index.html";
  const currentPath = (rawPath === "" || rawPath === "/") ? "index.html" : rawPath;

  // Desktop active links
  document.querySelectorAll(".nav-desktop > li > a").forEach(function (a) {
    const href = a.getAttribute("href");
    if (href === currentPath) {
      a.classList.add("active");
    }
    if ((currentPath === "index.html" || currentPath === "home-2.html") && a.classList.contains("nav-home-trigger")) {
      a.classList.add("active");
    }
  });

  document.querySelectorAll(".nav-dropdown a").forEach(function (a) {
    if (a.getAttribute("href") === currentPath) {
      a.classList.add("active");
    }
  });

  // Mobile & Tablet active links
  const mobileHomeToggle = document.querySelector(".mobile-drop-toggle");
  if (currentPath === "index.html" || currentPath === "home-2.html") {
    if (mobileHomeToggle) {
      mobileHomeToggle.classList.add("active");
      const sub = mobileHomeToggle.nextElementSibling;
      if (sub && sub.classList.contains("mobile-sub")) {
        sub.classList.add("open");
        mobileHomeToggle.setAttribute("aria-expanded", "true");
        const icon = mobileHomeToggle.querySelector("i");
        if (icon) icon.className = "bi bi-chevron-up";
      }
    }
  }

  document.querySelectorAll(".mobile-nav a").forEach(function (a) {
    const href = a.getAttribute("href");
    if (href && href === currentPath) {
      a.classList.add("active");
      const parentSub = a.closest(".mobile-sub");
      if (parentSub) {
        const toggleBtn = parentSub.previousElementSibling;
        if (toggleBtn && toggleBtn.classList.contains("mobile-drop-toggle")) {
          toggleBtn.classList.add("active");
        }
      }
    }
  });

  /* ---------- Header shadow on scroll ---------- */
  const header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener(
      "scroll",
      function () {
        header.style.boxShadow = window.scrollY > 20 ? "0 4px 20px rgba(36,32,36,0.06)" : "none";
      },
      { passive: true }
    );
  }

  /* ---------- Theme & RTL Direction Toggles ---------- */
  function updateToggleControls() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const isRtl = document.documentElement.getAttribute("dir") === "rtl";

    document.querySelectorAll(".theme-toggle i").forEach(function (icon) {
      icon.className = isDark ? "bi bi-sun" : "bi bi-moon-stars";
    });

    document.querySelectorAll(".rtl-toggle .rtl-label").forEach(function (label) {
      label.textContent = isRtl ? "LTR" : "RTL";
    });
  }

  updateToggleControls();

  document.addEventListener("click", function (e) {
    const themeBtn = e.target.closest(".theme-toggle");
    if (themeBtn) {
      const currentDark = document.documentElement.getAttribute("data-theme") === "dark";
      const nextTheme = currentDark ? "light" : "dark";
      if (nextTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
      try {
        localStorage.setItem("bs_theme", nextTheme);
      } catch (err) {}
      updateToggleControls();
    }

    const rtlBtn = e.target.closest(".rtl-toggle");
    if (rtlBtn) {
      const currentRtl = document.documentElement.getAttribute("dir") === "rtl";
      const nextDir = currentRtl ? "ltr" : "rtl";
      document.documentElement.setAttribute("dir", nextDir);
      try {
        localStorage.setItem("bs_dir", nextDir);
      } catch (err) {}
      updateToggleControls();
    }
  });
  /* ---------- Dynamic Auth Navbar State, Page Protection & Login Flow ---------- */
  function updateAuthNavState() {
    const isLoggedIn = localStorage.getItem("bs_user_logged_in") === "true";
    const headerLoginLinks = document.querySelectorAll(".header-login");
    const mobileLoginLinks = document.querySelectorAll(".mobile-nav a[href='login.html'], .mobile-nav a[href='customer-dashboard.html']");

    if (isLoggedIn) {
      headerLoginLinks.forEach(function (link) {
        link.textContent = "My Account";
        link.href = "customer-dashboard.html";
      });
      mobileLoginLinks.forEach(function (link) {
        if (link.textContent.trim() === "Login" || link.textContent.trim() === "My Account") {
          link.textContent = "My Account";
          link.href = "customer-dashboard.html";
        }
      });
    } else {
      headerLoginLinks.forEach(function (link) {
        link.textContent = "Login";
        link.href = "login.html";
      });
      mobileLoginLinks.forEach(function (link) {
        if (link.textContent.trim() === "Login" || link.textContent.trim() === "My Account") {
          link.textContent = "Login";
          link.href = "login.html";
        }
      });
    }
  }

  // Check login state for page-specific redirects
  const userIsLoggedIn = localStorage.getItem("bs_user_logged_in") === "true";
  const authCurrentPath = window.location.pathname.toLowerCase();

  // 1. If user is ALREADY logged in and visits login.html or register.html -> redirect directly to customer-dashboard.html
  if (userIsLoggedIn && (authCurrentPath.endsWith("/login.html") || authCurrentPath.endsWith("/register.html"))) {
    window.location.href = "customer-dashboard.html";
  }

  // 2. If user is NOT logged in and visits customer-dashboard.html -> redirect directly to login.html
  if (!userIsLoggedIn && authCurrentPath.endsWith("/customer-dashboard.html")) {
    window.location.href = "login.html";
  }

  updateAuthNavState();

  /* ---------- Login Form Handler ---------- */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const emailInput = document.getElementById("loginEmail");
      const passInput = document.getElementById("loginPassword");
      const alertSuccess = document.getElementById("loginAlertSuccess");
      const alertError = document.getElementById("loginAlertError");

      let isValid = true;
      let errorMessage = "Please enter valid credentials.";

      // Reset validation states
      if (emailInput) emailInput.classList.remove("is-invalid");
      if (passInput) passInput.classList.remove("is-invalid");
      if (alertSuccess) alertSuccess.classList.add("d-none");
      if (alertError) alertError.classList.add("d-none");

      const emailValue = emailInput ? emailInput.value.trim() : "";
      const passValue = passInput ? passInput.value.trim() : "";

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailValue || !emailRegex.test(emailValue)) {
        if (emailInput) emailInput.classList.add("is-invalid");
        isValid = false;
        errorMessage = "Please enter a valid email address.";
      }

      if (!passValue || passValue.length < 4) {
        if (passInput) passInput.classList.add("is-invalid");
        isValid = false;
        if (isValid === false && emailValue && emailRegex.test(emailValue)) {
          errorMessage = "Please enter your password (at least 4 characters).";
        }
      }

      if (!isValid) {
        if (alertError) {
          alertError.textContent = errorMessage;
          alertError.classList.remove("d-none");
        }
        return false;
      }

      // Valid Credentials -> Set Auth State & Redirect to Dashboard
      try {
        localStorage.setItem("bs_user_logged_in", "true");
      } catch (err) {}

      updateAuthNavState();

      if (alertSuccess) {
        alertSuccess.classList.remove("d-none");
        alertSuccess.textContent = "Login successful! Redirecting to Dashboard...";
      }

      setTimeout(function () {
        window.location.href = "customer-dashboard.html";
      }, 400);
    });
  }

  /* ---------- Registration Form Handler ---------- */
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const nameInput = document.getElementById("regName");
      const emailInput = document.getElementById("regEmail");
      const phoneInput = document.getElementById("regPhone");
      const passInput = document.getElementById("regPassword");
      const termsCheck = document.getElementById("termsCheck");
      const alertSuccess = document.getElementById("regAlertSuccess");
      const alertError = document.getElementById("regAlertError");
      const termsFeedback = document.getElementById("termsFeedback");

      let isValid = true;

      // Reset
      [nameInput, emailInput, phoneInput, passInput].forEach(function (inp) {
        if (inp) inp.classList.remove("is-invalid");
      });
      if (alertSuccess) alertSuccess.classList.add("d-none");
      if (alertError) alertError.classList.add("d-none");
      if (termsFeedback) termsFeedback.style.setProperty("display", "none", "important");

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nameInput || !nameInput.value.trim()) {
        if (nameInput) nameInput.classList.add("is-invalid");
        isValid = false;
      }
      if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
        if (emailInput) emailInput.classList.add("is-invalid");
        isValid = false;
      }
      if (!phoneInput || !phoneInput.value.trim()) {
        if (phoneInput) phoneInput.classList.add("is-invalid");
        isValid = false;
      }
      if (!passInput || passInput.value.trim().length < 8) {
        if (passInput) passInput.classList.add("is-invalid");
        isValid = false;
      }
      if (!termsCheck || !termsCheck.checked) {
        if (termsFeedback) termsFeedback.style.setProperty("display", "block", "important");
        isValid = false;
      }

      if (!isValid) {
        if (alertError) {
          alertError.classList.remove("d-none");
        }
        return false;
      }

      try {
        localStorage.setItem("bs_user_logged_in", "true");
      } catch (err) {}

      updateAuthNavState();

      if (alertSuccess) {
        alertSuccess.classList.remove("d-none");
      }

      setTimeout(function () {
        window.location.href = "customer-dashboard.html";
      }, 400);
    });
  }

  /* ---------- Logout Handler ---------- */
  document.addEventListener("click", function (e) {
    const logoutBtn = e.target.closest("#dashLogoutBtn, #sidebarLogoutBtn, .logout-btn");
    if (logoutBtn) {
      e.preventDefault();
      try {
        localStorage.removeItem("bs_user_logged_in");
      } catch (err) {}
      updateAuthNavState();
      window.location.href = "login.html";
    }
  });

  /* ---------- Services Category Cards Pagination ---------- */
  function renderServicesPagination(matchingItems) {
    const wrap = document.getElementById("servicesPagination");
    if (!wrap) return;

    // Ensure all category cards in grid are hidden first
    document.querySelectorAll(".service-cat-card").forEach(function (card) {
      card.style.setProperty("display", "none", "important");
    });

    const itemsPerPage = 8;
    let currentPage = 1;
    const totalItems = matchingItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    function showPage(page) {
      currentPage = page;
      wrap.setAttribute("data-page", page);

      // Hide all matching items first
      matchingItems.forEach(function (item) {
        item.style.setProperty("display", "none", "important");
      });

      const startIdx = (page - 1) * itemsPerPage;
      const endIdx = page * itemsPerPage;

      matchingItems.forEach(function (item, idx) {
        if (idx >= startIdx && idx < endIdx) {
          item.style.setProperty("display", "flex", "important");
          item.style.opacity = "1";
          item.classList.add("visible");
        } else {
          item.style.setProperty("display", "none", "important");
        }
      });

      renderControls();
    }

    function renderControls() {
      if (totalPages <= 1) {
        wrap.innerHTML = "";
        return;
      }

      let html = '<div class="pagination-controls">';

      // Prev Button
      html += '<button type="button" class="page-btn page-prev" ' + (currentPage === 1 ? 'disabled' : '') + '><i class="bi bi-chevron-left"></i> Prev</button>';

      // Page Numbers
      for (let i = 1; i <= totalPages; i++) {
        html += '<button type="button" class="page-btn page-num ' + (i === currentPage ? 'active' : '') + '" data-page-num="' + i + '">' + i + '</button>';
      }

      // Next Button
      html += '<button type="button" class="page-btn page-next" ' + (currentPage === totalPages ? 'disabled' : '') + '>Next <i class="bi bi-chevron-right"></i></button>';

      html += '</div>';

      const startCount = (currentPage - 1) * itemsPerPage + 1;
      const endCount = Math.min(currentPage * itemsPerPage, totalItems);
      html += '<div class="page-info">Showing ' + startCount + '–' + endCount + ' of ' + totalItems + ' category treatments</div>';

      wrap.innerHTML = html;

      // Event listeners via delegation with stopPropagation & preventDefault
      wrap.onclick = function (e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }

        const btn = e.target ? e.target.closest(".page-btn") : null;
        if (!btn || btn.disabled || btn.hasAttribute("disabled")) return false;

        if (btn.classList.contains("page-prev")) {
          if (currentPage > 1) {
            showPage(currentPage - 1);
            scrollToServices();
          }
        } else if (btn.classList.contains("page-next")) {
          if (currentPage < totalPages) {
            showPage(currentPage + 1);
            scrollToServices();
          }
        } else if (btn.classList.contains("page-num")) {
          const p = parseInt(btn.getAttribute("data-page-num"), 10);
          if (p && p !== currentPage) {
            showPage(p);
            scrollToServices();
          }
        }
        return false;
      };
    }

    function scrollToServices() {
      const grid = document.querySelector(".services-editorial");
      if (grid) {
        const topPos = grid.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top: topPos, behavior: "smooth" });
      }
    }

    showPage(currentPage);
  }

  /* ---------- Pricing Plan Billing Toggle & Estimator ---------- */
  const planBillingToggle = document.getElementById("pricingBillingToggle");
  if (planBillingToggle) {
    const btns = planBillingToggle.querySelectorAll(".toggle-btn");
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        btns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        const cycle = btn.getAttribute("data-cycle");
        document.querySelectorAll(".plan-card").forEach(function (card) {
          const priceEl = card.querySelector(".plan-price-val");
          const cycleEl = card.querySelector(".plan-cycle-val");
          if (priceEl && cycleEl) {
            const monthlyPrice = priceEl.getAttribute("data-monthly");
            const annualPrice = priceEl.getAttribute("data-annual");
            if (cycle === "annual") {
              priceEl.textContent = annualPrice;
              cycleEl.textContent = "/mo (billed annually)";
            } else {
              priceEl.textContent = monthlyPrice;
              cycleEl.textContent = "/mo";
            }
          }
        });
      });
    });
  }

  // Interactive Package Estimator Calculator on pricing.html
  const estimatorForm = document.getElementById("packageEstimatorForm");
  if (estimatorForm) {
    function updateEstimatorTotal() {
      let total = 0;
      let count = 0;
      let durationMinutes = 0;

      estimatorForm.querySelectorAll("input[type='checkbox']:checked").forEach(function (cb) {
        total += parseInt(cb.getAttribute("data-price"), 10) || 0;
        durationMinutes += parseInt(cb.getAttribute("data-time"), 10) || 0;
        count++;
      });

      // Discount: 15% off if 3 or more selected
      let discount = 0;
      if (count >= 3) {
        discount = Math.round(total * 0.15);
      }

      const finalPrice = total - discount;

      const subtotalEl = document.getElementById("estSubtotal");
      const discountEl = document.getElementById("estDiscount");
      const totalEl = document.getElementById("estTotal");
      const countEl = document.getElementById("estCount");
      const durationEl = document.getElementById("estDuration");

      if (subtotalEl) subtotalEl.textContent = "₹" + total;
      if (discountEl) discountEl.textContent = discount > 0 ? "-₹" + discount + " (15% Package Discount)" : "₹0";
      if (totalEl) totalEl.textContent = "₹" + finalPrice;
      if (countEl) countEl.textContent = count + " service" + (count === 1 ? "" : "s") + " selected";
      if (durationEl) durationEl.textContent = durationMinutes + " mins total";
    }

    estimatorForm.querySelectorAll("input[type='checkbox']").forEach(function (cb) {
      cb.addEventListener("change", function () {
        const parent = cb.closest(".estimator-item");
        if (parent) parent.classList.toggle("selected", cb.checked);
        updateEstimatorTotal();
      });
    });

    updateEstimatorTotal();
  }
})();


