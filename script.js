/* Oak & Steel: navigation, booking flow, small page details */
lucide.createIcons();
const header = document.querySelector(".site-header"),
  menu = document.querySelector(".menu-toggle"),
  nav = document.querySelector("nav");
addEventListener("scroll", () =>
  header.classList.toggle("scrolled", scrollY > 25),
);
menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  }),
);
// The wordmark and post-booking link are always a clear route home.
document.querySelectorAll('a[href="#top"]').forEach((link) =>
  link.addEventListener("click", (event) => {
    event.preventDefault();
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    window.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, "", "#top");
  }),
);
const reveal = new IntersectionObserver(
  (items) =>
    items.forEach((i) => {
      if (i.isIntersecting) {
        i.target.classList.add("visible");
        reveal.unobserve(i.target);
      }
    }),
  { threshold: 0.14 },
);
document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));
const form = document.querySelector("#bookingForm"),
  steps = [...document.querySelectorAll(".step")],
  progress = [...document.querySelectorAll(".progress span")],
  error = document.querySelector(".form-error");
let current = 0;
function validate() {
  const step = steps[current];
  if (current < 2) {
    return !!step.querySelector("input:checked");
  }
  if (current === 2)
    return (
      document.querySelector("#date").value &&
      document.querySelector("#time").value
    );
  return [...step.querySelectorAll("input")].every((input) =>
    input.checkValidity(),
  );
}
function go(to) {
  if (to > current && !validate()) {
    error.textContent =
      current === 2
        ? "Choose a date and an available time."
        : "Please make a selection before continuing.";
    return;
  }
  error.textContent = "";
  steps[current].classList.remove("active");
  progress[current].classList.remove("active");
  current = to;
  steps[current].classList.add("active");
  progress[current].classList.add("active");
  document
    .querySelector(".booking-panel")
    .scrollIntoView({ behavior: "smooth", block: "nearest" });
}
form
  .querySelectorAll(".next")
  .forEach((b) => b.addEventListener("click", () => go(current + 1)));
form
  .querySelectorAll(".back")
  .forEach((b) => b.addEventListener("click", () => go(current - 1)));
document.querySelectorAll("[data-service]").forEach((btn) =>
  btn.addEventListener("click", () => {
    const input = form.querySelector(`[value="${btn.dataset.service}"]`);
    input.checked = true;
    document.querySelector("#booking").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => go(1), 450);
  }),
);
const date = document.querySelector("#date");
date.min = new Date().toISOString().slice(0, 10);
date.value = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
document.querySelectorAll(".time-slots button:not(:disabled)").forEach((btn) =>
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".time-slots button")
      .forEach((x) => x.classList.remove("selected"));
    btn.classList.add("selected");
    document.querySelector("#time").value = btn.textContent;
  }),
);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validate()) {
    error.textContent = "Please complete your contact details.";
    return;
  }
  const d = new FormData(form),
    pretty = new Date(d.get("date") + "T12:00:00").toLocaleDateString("en-CA", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  form
    .querySelectorAll(".step,.progress")
    .forEach((e) => (e.style.display = "none"));
  const c = document.querySelector(".confirmation");
  document.querySelector("#confirmation-text").textContent =
    `${d.get("service")} with ${d.get("barber")} on ${pretty} at ${d.get("time")}. A confirmation is on its way to ${d.get("email")}.`;
  c.classList.add("show");
});
const notes = [
  [
    "“Marcus gives a great cut without turning it into a performance. I’m in and out, and I always feel put together.”",
    "— Daniel R., Roncesvalles",
  ],
  [
    "“A genuinely nice room to spend an hour in. Jordan listened, and the fade is exactly what I wanted.”",
    "— Kyle M., Little Portugal",
  ],
  [
    "“The booking is easy, the coffee is good, and Theo somehow makes a cleanup feel like a reset.”",
    "— Aiden P., Trinity Bellwoods",
  ],
];
let note = 0;
function quote(dir) {
  note = (note + dir + notes.length) % notes.length;
  document.querySelector("#quote").textContent = notes[note][0];
  document.querySelector("#quote-author").textContent = notes[note][1];
}
document.querySelector(".quote-next").onclick = () => quote(1);
document.querySelector(".quote-prev").onclick = () => quote(-1);
document.querySelector(".contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  e.currentTarget.querySelector(".contact-success").textContent =
    "Thanks — we’ll be in touch shortly.";
  e.currentTarget.reset();
});
