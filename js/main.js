function toggleMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  if (mobileMenu.style.display === "flex") {
    mobileMenu.style.display = "none";
  } else {
    mobileMenu.style.display = "flex";
  }
}




const track = document.querySelector(".slider-track");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const cards = document.querySelectorAll(".service-card");

let currentIndex = 0;

// تحديد إذا الموقع RTL ولا LTR
const isRTL = document.documentElement.dir === "rtl";

// حساب عدد الكروت الظاهرة بناءً على حجم الشاشة
const getCardsPerView = () => {
  if (window.innerWidth >= 1024) {
    return 3;
  } else if (window.innerWidth >= 768) {
    return 2;
  } else {
    return 1;
  }
};

// حساب العرض الفعلي للكارت مع الهامش
const getCardWidth = () => {
  const card = cards[0];
  const style = window.getComputedStyle(card);
  const margin = parseFloat(isRTL ? style.marginLeft : style.marginRight) || 0;
  return card.offsetWidth + margin;
};

// تحديث السلايدر بناءً على index
const updateSlider = () => {
  const cardWidth = getCardWidth();
  const moveX = currentIndex * cardWidth;

  track.style.transition = "transform 0.4s ease";

  if (isRTL) {
    // لو RTL يتحرك لليمين
    track.style.transform = `translateX(${moveX}px)`;
  } else {
    // لو LTR يتحرك لليسار
    track.style.transform = `translateX(-${moveX}px)`;
  }
};

// حركة زر السابق
prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateSlider();
  }
});

// حركة زر التالي
nextBtn.addEventListener("click", () => {
  const cardsPerView = getCardsPerView();
  const maxIndex = cards.length - cardsPerView;

  if (currentIndex < maxIndex) {
    currentIndex++;
    updateSlider();
  }
});

// عند تغيير حجم الشاشة
window.addEventListener("resize", () => {
  updateSlider();
});

// أول تشغيل: تأكد يبدأ من أول كارت
currentIndex = 0;
updateSlider();



const container = document.getElementById("digitalProjectContainer");
const tabs = document.querySelectorAll(".digital-tab");
let currentInd = 0;
let projects = [];

tabs.forEach((tab) => {
  tab.onclick = () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    currentInd = 0;
    fetchProjects(tab.dataset.type);
  };
});

async function fetchProjects(type) {
  container.innerHTML = "جاري تحميل المشاريع...";
  const res = await fetch(
    `https://admin.azsystems.tech/api/projects?type=${type}&count=10`
  );
  const data = await res.json();
  projects = data.data.map((p, index) => ({
    ...p,
    currentPhotoIndex: 0,
    originalIndex: index,
  }));
  renderProjects();
}

function projectsPerView() {
  return window.innerWidth <= 768 ? 1 : 2;
}

function renderProjects() {
  let content = "";
  const perView = projectsPerView();
  const displayProjects = projects.slice(
    currentInd * perView,
    currentInd * perView + perView
  );

  if (!displayProjects.length) {
    container.innerHTML = "لا توجد مشاريع متاحة.";
    return;
  }

  displayProjects.forEach((p) => {
    const photoSlice = p.photos.slice(
      p.currentPhotoIndex,
      p.currentPhotoIndex + 2
    );
    content += `
      <div class="digital-project-card">
        <div class="digital-project-header">
          <h3 class="digital-project-title">${p.name_ar}</h3>
          <button class="digital-btn-view">عرض المشروع</button>
        </div>
        <p>${p.description_ar}</p>
        <div class="digital-tags">
          <span class="digital-tag">العميل: ${p.customer_name_ar}</span>
          <span class="digital-tag">الفئة: ${p.section_ar}</span>
          <span class="digital-tag">النوع: ${p.type}</span>
        </div>
        <div class="digital-project-images">
          ${photoSlice
            .map(
              (photo) =>
                `<img src="https://admin.azsystems.tech/${photo.photo}">`
            )
            .join("")}
        </div>
        <div class="digital-slider-buttons">
         <div class ="button-container">
          <button class="digital-prev-photo" data-original-index="${
            p.originalIndex
          }" ${
      p.currentPhotoIndex === 0 ? "disabled" : ""
    }><i class='bx bx-chevron-right'></i></button>
          <button class="digital-next-photo" data-original-index="${
            p.originalIndex
          }" ${
      p.currentPhotoIndex + 2 >= p.photos.length ? "disabled" : ""
    }><i class='bx bx-chevron-left'></i></button>
        </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = content;

  document.querySelectorAll(".digital-next-photo").forEach((btn) => {
    btn.onclick = (e) => {
      // Use currentTarget instead of target to always get the button
      const button = e.currentTarget;
      const idx = button.dataset.originalIndex;
      if (projects[idx].currentPhotoIndex + 2 < projects[idx].photos.length) {
        projects[idx].currentPhotoIndex += 2;
        renderProjects();
      }
    };
  });

  document.querySelectorAll(".digital-prev-photo").forEach((btn) => {
    btn.onclick = (e) => {
      // Use currentTarget instead of target to always get the button
      const button = e.currentTarget;
      const idx = button.dataset.originalIndex;
      if (projects[idx].currentPhotoIndex > 0) {
        projects[idx].currentPhotoIndex -= 2;
        renderProjects();
      }
    };
  });
}

digitalNextBtn.onclick = () => {
  if ((currentInd + 1) * projectsPerView() < projects.length) {
    currentInd++;
    renderProjects();
  }
};

digitalPrevBtn.onclick = () => {
  if (currentInd > 0) {
    currentInd--;
    renderProjects();
  }
};

window.onresize = () => {
  currentInd = 0;
  renderProjects();
};

window.onload = () => fetchProjects("design");


const faqContainer = document.getElementById("faqContainer");
const tabsfqa = document.querySelectorAll(".tab");
tabsfqa.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabsfqa.forEach((t) => t.classList.remove("active"));
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







  const slider = document.getElementById("testimonialSlider");
  const card = slider.querySelectorAll(".review-card");
  const nextBn = document.getElementById("nextBn");
  const prevBn = document.getElementById("prevBn");

  let current = 0;

  function getCardPerPage() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
  }

  function update() {
    const cardWidth = card[0].offsetWidth + 20;
    const cardPerPage = getCardPerPage();
    const maxInd = Math.max(0, card.length - cardPerPage);
    current = Math.min(current, maxInd);
    slider.style.transform = `translateX(${current * cardWidth}px)`;
  }

  nextBn.addEventListener("click", () => {
    const cardsPerPage = getCardPerPage();
    const maxIndex = Math.max(0, card.length - cardsPerPage);
    if (current < maxIndex) {
      current++;
      update();
    }
  });

  prevBn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      update();
    }
  });

  window.addEventListener("resize", update);
  window.addEventListener("load", update);









      document
        .getElementById("contactForm")
        .addEventListener("submit", async function (e) {
          e.preventDefault();

          const firstName = document.getElementById("firstName").value;
          const lastName = document.getElementById("lastName").value;
          const fullName = firstName + " " + lastName;
          const email = document.getElementById("email").value;
          const phone = document.getElementById("phone").value;
          const message = document.getElementById("message").value;

          const apiUrl = `https://127.0.0.1:8000/api/contact?name=${encodeURIComponent(
            fullName
          )}&phone=${encodeURIComponent(
            phone
          )}&subject=ContactForm&message=${encodeURIComponent(
            message
          )}&email=${encodeURIComponent(email)}`;

          try {
            const response = await fetch(apiUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              alert("تم إرسال رسالتك بنجاح!");
              document.getElementById("contactForm").reset();
            } else {
              alert("حدث خطأ أثناء إرسال الرسالة.");
            }
          } catch (error) {
            console.error(error);
            alert("حدث خطأ، تأكد من تشغيل السيرفر.");
          }
        });