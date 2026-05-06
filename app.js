const contactForm = document.getElementById("contactForm");

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
      return;
    }

    try {
      const submitBtn = contactForm.querySelector("button[type='submit']");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      // ✅ Updated backend URL
      const response = await fetch("https://prime-it-services-production.up.railway.app/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      setTimeout(() => successMessage.remove(), 2600);
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
