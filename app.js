const scrollTopBtn = document.getElementById("scrollTopBtn");
const contactCta = document.getElementById("contactCta");
const contactSection = document.getElementById("contact");
const contactPhone = document.getElementById("contactPhone");
const whatsappBtn = document.getElementById("whatsappBtn");
const heroSection = document.querySelector(".hero");
const counterNodes = document.querySelectorAll(".counter-value");
const ringNodes = document.querySelectorAll(".ring-progress");
const siteFooter = document.getElementById("siteFooter");
const footerSmoothLinks = document.querySelectorAll(".footer-smooth-link");
const subscribeForm = document.getElementById("footerSubscribeForm");
const subscribeToast = document.getElementById("subscribeToast");
const discoverServicesBtn = document.getElementById("discoverServicesBtn");
const servicesSection = document.getElementById("services");
const discoverMoreBtn = document.getElementById("discoverMoreBtn");
const serviceAccordionCards = document.querySelectorAll(".service-accordion-card");
const servicesPortrait = document.getElementById("servicesPortrait");
const impactDiscoverBtn = document.getElementById("impactDiscoverBtn");
const impactMetricCards = document.querySelectorAll(".impact-metric-card");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const contactForm = document.getElementById("contactForm");

if (window.AOS) {
  AOS.init({
    once: true,
    duration: 950,
    easing: "ease-out-cubic",
  });
}

function toggleScrollTopButton() {
  if (window.scrollY > 260) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
}

function animateCounter(node) {
  const target = Number(node.dataset.target || 0);
  if (!target || node.dataset.done === "true") {
    return;
  }

  const duration = 1200;
  const startTime = performance.now();

  function step(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(target * eased);
    const suffix = node.dataset.suffix || "";
    node.textContent = `${value.toLocaleString()}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      node.textContent = `${target.toLocaleString()}${suffix}`;
      node.dataset.done = "true";
    }
  }

  requestAnimationFrame(step);
}

function animateRing(node) {
  if (node.dataset.done === "true") {
    return;
  }

  const gradientStroke = node.dataset.gradient;
  if (gradientStroke) {
    node.style.stroke = gradientStroke;
  }

  const progress = Math.min(Math.max(Number(node.dataset.progress || 0), 0), 100);
  const radius = Number(node.getAttribute("r"));
  const circumference = 2 * Math.PI * radius;
  node.style.strokeDasharray = String(circumference);
  node.style.strokeDashoffset = String(circumference);

  requestAnimationFrame(() => {
    node.style.strokeDashoffset = String(circumference * (1 - progress / 100));
  });

  node.dataset.done = "true";
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      if (entry.target.classList.contains("counter-value")) {
        animateCounter(entry.target);
      }

      if (entry.target.classList.contains("ring-progress")) {
        animateRing(entry.target);
      }

      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.35 }
);

counterNodes.forEach((node) => observer.observe(node));
ringNodes.forEach((node) => observer.observe(node));

window.addEventListener("scroll", () => {
  toggleScrollTopButton();

  if (heroSection) {
    const parallaxOffset = window.scrollY * 0.35;
    heroSection.style.backgroundPosition = `center calc(50% + ${parallaxOffset}px)`;
  }
});

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (contactCta) {
  contactCta.addEventListener("click", () => {
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

if (discoverServicesBtn && servicesSection) {
  discoverServicesBtn.addEventListener("click", () => {
    servicesSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

if (discoverMoreBtn && siteFooter) {
  discoverMoreBtn.addEventListener("click", () => {
    siteFooter.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

if (impactDiscoverBtn && siteFooter) {
  impactDiscoverBtn.addEventListener("click", () => {
    siteFooter.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

serviceAccordionCards.forEach((item) => {
  const toggleBtn = item.querySelector(".service-accordion-toggle");
  if (!toggleBtn) {
    return;
  }

  toggleBtn.addEventListener("click", () => {
    const isActive = item.classList.contains("active");
    item.classList.toggle("active", !isActive);
    toggleBtn.setAttribute("aria-expanded", String(!isActive));

    const isDigitalGrowth = item.closest(".digital-growth-col");
    if (servicesPortrait && !isActive && isDigitalGrowth) {
      servicesPortrait.classList.add("glow");
      setTimeout(() => {
        servicesPortrait.classList.remove("glow");
      }, 450);
    }
  });
});

impactMetricCards.forEach((card) => {
  const toggleBtn = card.querySelector(".impact-metric-toggle");
  if (!toggleBtn) {
    return;
  }

  toggleBtn.addEventListener("click", () => {
    const isActive = card.classList.contains("active");
    impactMetricCards.forEach((currentCard) => {
      currentCard.classList.remove("active");
      const btn = currentCard.querySelector(".impact-metric-toggle");
      btn?.setAttribute("aria-expanded", "false");
    });

    if (!isActive) {
      card.classList.add("active");
      toggleBtn.setAttribute("aria-expanded", "true");
    }
  });
});

if (whatsappBtn && contactPhone) {
  const rawPhone = contactPhone.dataset.whatsapp || contactPhone.textContent || "";
  const whatsappNumber = rawPhone.replace(/\D/g, "");
  if (whatsappNumber) {
    whatsappBtn.href = `https://wa.me/${whatsappNumber}`;
  }
}

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nameInput = contactForm.querySelector("#contactName");
    const emailInput = contactForm.querySelector("#contactEmail");
    const messageInput = contactForm.querySelector("#contactMessage");
    const messageNodeClass = "contact-form-message";
    const oldMessage = contactForm.querySelector(`.${messageNodeClass}`);
    oldMessage?.remove();

    const nameValue = nameInput?.value.trim() || "";
    const emailValue = emailInput?.value.trim() || "";
    const messageValue = messageInput?.value.trim() || "";
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

    if (!nameValue || !emailOk || !messageValue) {
      const errorMessage = document.createElement("p");
      errorMessage.className = messageNodeClass;
      errorMessage.style.color = "#ffb8b8";
      errorMessage.textContent = "Please enter valid name, email, and message.";
      contactForm.appendChild(errorMessage);
      if (!nameValue) {
        nameInput?.focus();
      } else if (!emailOk) {
        emailInput?.focus();
      } else {
        messageInput?.focus();
      }
      return;
    }

    try {
      const submitBtn = contactForm.querySelector("button[type='submit']");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameValue,
          email: emailValue,
          message: messageValue,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to send.");
      }

      const successMessage = document.createElement("p");
      successMessage.className = messageNodeClass;
      successMessage.textContent = "✓ Thank you. Your message has been sent.";
      contactForm.appendChild(successMessage);

      nameInput.value = "";
      emailInput.value = "";
      messageInput.value = "";

      setTimeout(() => {
        successMessage.remove();
      }, 2600);
    } catch (error) {
      const errorMessage = document.createElement("p");
      errorMessage.className = messageNodeClass;
      errorMessage.style.color = "#ffb8b8";
      errorMessage.textContent = error?.message || "Unable to send right now. Please try again.";
      contactForm.appendChild(errorMessage);
    } finally {
      const submitBtn = contactForm.querySelector("button[type='submit']");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    }
  });
}

footerSmoothLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || !targetId.startsWith("#")) {
      return;
    }

    const targetNode = document.querySelector(targetId);
    if (!targetNode) {
      return;
    }

    event.preventDefault();
    targetNode.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

if (siteFooter) {
  const footerLinks = siteFooter.querySelectorAll(".footer-column a");
  footerLinks.forEach((link, index) => {
    link.style.transitionDelay = `${index * 45}ms`;
  });

  const footerObserver = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          siteFooter.classList.add("footer-visible");
          observerInstance.disconnect();
        }
      });
    },
    { threshold: 0.18 }
  );

  footerObserver.observe(siteFooter);
}

if (subscribeForm) {
  subscribeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailInput = subscribeForm.querySelector("input[type='email']");
    if (!emailInput || !emailInput.value.trim()) {
      emailInput?.focus();
      return;
    }

    subscribeForm.classList.add("subscribed");
    emailInput.value = "";

    if (subscribeToast) {
      subscribeToast.classList.add("show");
      setTimeout(() => {
        subscribeToast.classList.remove("show");
      }, 1800);
    }

    setTimeout(() => {
      subscribeForm.classList.remove("subscribed");
    }, 2200);
  });
}

const isLocalDev = ["localhost", "127.0.0.1"].includes(window.location.hostname);
if (isLocalDev && contactForm) {
  const devBtn = document.createElement("button");
  devBtn.type = "button";
  devBtn.className = "dev-test-email-btn";
  devBtn.textContent = "Send Test Email (Dev)";
  contactForm.insertAdjacentElement("afterend", devBtn);

  devBtn.addEventListener("click", async () => {
    const oldMessage = contactForm.querySelector(".contact-form-message");
    oldMessage?.remove();

    devBtn.disabled = true;
    devBtn.textContent = "Testing...";

    try {
      const response = await fetch("/api/test-email", { method: "POST" });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to send test email.");
      }

      const successMessage = document.createElement("p");
      successMessage.className = "contact-form-message";
      successMessage.textContent = "✓ Test email sent successfully.";
      contactForm.appendChild(successMessage);
    } catch (error) {
      const errorMessage = document.createElement("p");
      errorMessage.className = "contact-form-message";
      errorMessage.style.color = "#ffb8b8";
      errorMessage.textContent = "Test email failed. Check .env SMTP settings.";
      contactForm.appendChild(errorMessage);
    } finally {
      devBtn.disabled = false;
      devBtn.textContent = "Send Test Email (Dev)";
    }
  });
}

toggleScrollTopButton();

if (navToggle && navMenu) {
  const closeMenu = () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    navMenu.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.contains("open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    if (navMenu.contains(target) || navToggle.contains(target)) {
      return;
    }

    closeMenu();
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });
}
