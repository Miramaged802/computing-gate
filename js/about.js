function toggleMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  if (mobileMenu.style.display === "flex") {
    mobileMenu.style.display = "none";
  } else {
    mobileMenu.style.display = "flex";
  }
}

function activateTimeline(index) {
  const numbers = document.querySelectorAll(".timeline-number");
  const items = document.querySelectorAll(".timeline-item");

  numbers.forEach((number, i) => {
    if (i === index) {
      number.classList.add("active");
    } else {
      number.classList.remove("active");
    }
  });

  items.forEach((item, i) => {
    if (i === index) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

function activateCard(index) {
  const numbers = document.querySelectorAll(".timeline-number");
  const cards = document.querySelectorAll(".timeline-card");

  numbers.forEach((num, i) => {
    num.classList.toggle("active", i === index);
  });

  cards.forEach((card, i) => {
    card.classList.toggle("active", i === index);
  });
}

const teamContainer = document.getElementById("teamContainer");

fetch("https://admin.azsystems.tech/api/teams")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((member) => {
      const card = document.createElement("div");
      card.classList.add("team-member");

      // روابط السوشيال... لو مش موجودة في الـ API، نحطها #
      const facebookLink = member.facebook ? member.facebook : "#";
      const twitterLink = member.twitter ? member.twitter : "#";
      const linkedinLink = member.linkedin ? member.linkedin : "#";
      const githubLink = member.github ? member.github : "#";

      // صورة الشخص
      const imagePath = `https://admin.azsystems.tech/${member.image}`;

      // بناء الكارت
      card.innerHTML = `
          <div class="member-photo">
            <img src="${imagePath}" alt="${member.name_ar}" />
          </div>
          <div class="member-name">${member.name_ar}</div>
          <div class="member-role">${member.job_title_ar}</div>
          <div class="social-icons">
            <a href="${facebookLink}" target="_blank"><i class='bx bxl-facebook'></i></a>
            <a href="${twitterLink}" target="_blank"><i class='bx bxl-twitter'></i></a>
            <a href="${linkedinLink}" target="_blank"><i class='bx bxl-linkedin'></i></a>
            <a href="${githubLink}" target="_blank"><i class='bx bxl-github'></i></a>
          </div>
        `;
      teamContainer.appendChild(card);
    });
  })
  .catch((err) => console.error("Error fetching team data:", err));

const faqContainer = document.getElementById("faqContainer");
const tabs = document.querySelectorAll(".tab");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const type = tab.getAttribute("data-type");
    fetchFAQs(type);
  });
});

async function fetchFAQs(type = "design") {
  faqContainer.innerHTML =
    "<p style='text-align:center;'>جاري تحميل الأسئلة...</p>";

  try {
    const response = await fetch(
      `https://admin.azsystems.tech/api/faqs?type=${type}`
    );
    const data = await response.json();

    if (!data.faqs || data.faqs.length === 0) {
      faqContainer.innerHTML =
        "<p style='text-align:center;'>لا توجد أسئلة متاحة.</p>";
      return;
    }

    renderFAQs(data.faqs);
  } catch (error) {
    console.error("❌ Error fetching FAQs:", error);
    faqContainer.innerHTML =
      "<p style='text-align:center;'>حدث خطأ أثناء تحميل الأسئلة.</p>";
  }
}

function renderFAQs(faqs) {
  faqContainer.innerHTML = "";

  faqs.forEach((faq) => {
    const faqItem = document.createElement("div");
    faqItem.classList.add("faq-item");

    faqItem.innerHTML = `
          <div class="faq-question">
            <div class="question-text">${faq.question_ar}</div>
            <div class="toggle-btn">+</div>
          </div>
          <div class="faq-answer">${faq.answer_ar}</div>
        `;

    const toggleBtn = faqItem.querySelector(".toggle-btn");
    const questionDiv = faqItem.querySelector(".faq-question");
    const answerDiv = faqItem.querySelector(".faq-answer");

    questionDiv.addEventListener("click", () => {
      const allFaqItems = document.querySelectorAll(".faq-item");

      allFaqItems.forEach((item) => {
        if (item !== faqItem) {
          item.classList.remove("active");
          item.querySelector(".toggle-btn").textContent = "+";
          item.querySelector(".faq-answer").style.maxHeight = null;
          item.querySelector(".faq-answer").style.padding = "0 20px";
        }
      });

      const isActive = faqItem.classList.contains("active");

      if (isActive) {
        faqItem.classList.remove("active");
        toggleBtn.textContent = "+";
        answerDiv.style.maxHeight = null;
        answerDiv.style.padding = "0 20px";
      } else {
        faqItem.classList.add("active");
        toggleBtn.textContent = "−";
        answerDiv.style.maxHeight = answerDiv.scrollHeight + "20px";
        answerDiv.style.padding = "15px 20px";
      }
    });

    faqContainer.appendChild(faqItem);
  });
}

fetchFAQs("design");
