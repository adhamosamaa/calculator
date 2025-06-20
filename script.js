let subjectsByYearAndTerm = {};

fetch("subjects.json")
    .then((res) => res.json())
    .then((data) => {
        subjectsByYearAndTerm = data;
    })
    .catch((error) => {
        console.error("حدث خطأ أثناء تحميل ملف المواد:", error);
    });

function loadSubjects() {
    const year = document.getElementById("year").value;
    const term = document.getElementById("term").value;
    const sectionWrapper = document.getElementById("section-wrapper");
    const sectionSelect = document.getElementById("section");
    const container = document.getElementById("subjects");

    // تحديث توزيع الحقول
    updateFieldLayout(year);

    container.innerHTML = "";

    let subjects = [];

    if (year === "4") {
        const section = sectionSelect.value;
        if (
            subjectsByYearAndTerm[year] &&
            subjectsByYearAndTerm[year][section] &&
            subjectsByYearAndTerm[year][section][term]
        ) {
            subjects = subjectsByYearAndTerm[year][section][term];
        }
    } else {
        if (
            subjectsByYearAndTerm[year] &&
            subjectsByYearAndTerm[year][term]
        ) {
            subjects = subjectsByYearAndTerm[year][term];
        }
    }

    subjects.forEach(subject => {
        const subjectEl = document.createElement("div");
        subjectEl.className = "col-md-3 col-sm-6 mb-3";
        subjectEl.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <label class="form-label">${subject}</label>
                    <input type="number" min="0" max="20" class="form-control grade" placeholder="ادخل الدرجة من 20" oninput="validateGrade(this)">
                    <small class="warning text-danger d-none"></small>
                </div>
            </div>
        `;
        container.appendChild(subjectEl);
    });
}

// ✅ دالة لتحديث توزيع الحقول حسب الفرقة
function updateFieldLayout(year) {
    const yearCol = document.getElementById("year-col");
    const termCol = document.getElementById("term-col");
    const sectionWrapper = document.getElementById("section-wrapper");

    if (year === "4") {
        // إظهار القسم وتوزيع الأعمدة على 3
        sectionWrapper.style.display = "block";
        sectionWrapper.classList.remove("d-none");
        sectionWrapper.classList.add("col-md-4");

        yearCol.classList.remove("col-md-6");
        yearCol.classList.add("col-md-4");

        termCol.classList.remove("col-md-6");
        termCol.classList.add("col-md-4");
    } else {
        // إخفاء القسم وتوزيع الأعمدة على 2
        sectionWrapper.style.display = "none";
        sectionWrapper.classList.remove("col-md-4");
        sectionWrapper.classList.add("d-none");

        yearCol.classList.remove("col-md-4");
        yearCol.classList.add("col-md-6");

        termCol.classList.remove("col-md-4");
        termCol.classList.add("col-md-6");
    }
}

function validateGrade(input) {
    const value = parseFloat(input.value);
    const warning = input.nextElementSibling;

    if (isNaN(value)) {
        warning.classList.add("d-none");
        return;
    }

    if (value > 20) {
        input.value = 20;
        warning.textContent = "الحد الأقصى هو 20";
        warning.classList.remove("d-none");
    } else if (value < 0) {
        input.value = 0;
        warning.textContent = "الحد الأدنى هو 0";
        warning.classList.remove("d-none");
    } else {
        warning.classList.add("d-none");
    }
}

function calculateGrade() {
    const grades = document.querySelectorAll(".grade");
    const resultBox = document.getElementById("result");

    let total = 0;
    let count = 0;
    let isValid = true;

    grades.forEach((input) => {
        const warning = input.nextElementSibling;
        const val = parseFloat(input.value);

        if (isNaN(val) || val < 0 || val > 20) {
            warning.textContent = "درجة غير صالحة";
            warning.classList.remove("d-none");
            input.classList.add("is-invalid");
            isValid = false;
        } else {
            warning.classList.add("d-none");
            input.classList.remove("is-invalid");
            total += val;
            count++;
        }
    });

    if (!isValid) {
        resultBox.innerText = "يوجد خطأ في إدخال الدرجات. من فضلك صححها.";
        resultBox.className = "alert alert-danger mt-3";
        return;
    }

    if (count === 0) {
        resultBox.innerText = "من فضلك ادخل الدرجات أولًا.";
        resultBox.className = "alert alert-warning mt-3";
        return;
    }

    const avg = (total / (count * 20)) * 100;
    let gradeText = "";
    let gradeClass = "";

    if (avg >= 90) {
        gradeText = "امتياز";
        gradeClass = "success";
    } else if (avg >= 80) {
        gradeText = "جيد جدًا";
        gradeClass = "info";
    } else if (avg >= 65) {
        gradeText = "جيد";
        gradeClass = "primary";
    } else if (avg >= 50) {
        gradeText = "مقبول";
        gradeClass = "warning";
    } else {
        gradeText = "راسب";
        gradeClass = "danger";
    }

    const maxTotal = count * 20;

    resultBox.className = `alert alert-${gradeClass} mt-3`;
    resultBox.innerText = `النسبة: ${avg.toFixed(2)}% - التقدير: ${gradeText} - المجموع: ${total} من ${maxTotal}`;
}
