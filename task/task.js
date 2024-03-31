const btnResult = document.querySelector(".result");
const diagrams = document.querySelectorAll(".canvas");
const inputA = document.querySelector("#inputA");
const inputB = document.querySelector("#inputB");
const inputN = document.querySelector("#inputN");

const btnClear = document.querySelector(".clear");
const clearContainer = document.querySelector(".clear-container");

const Aiken = function (a, b, n) {
  if (a == "") {
    a = 0;
  }
  if (b == "") {
    b = 5;
  }
  if (n == "") {
    n = 11;
  }
  if (
    isNaN(a) ||
    isNaN(b) ||
    isNaN(n) ||
    a >= b ||
    n < 2 ||
    n > 1000 ||
    a < -100 ||
    b > 100 ||
    a > 100 ||
    b < -100 ||
    inputA.value.includes(".") ||
    inputA.value.includes(",") ||
    inputB.value.includes(".") ||
    inputB.value.includes(",") ||
    inputN.value.includes(".") ||
    inputN.value.includes(",")
  ) {
    alert("Введіть коректні дані");
    window.location.reload();
    return;
  }
  const h = (b - a) / (n - 1);
  const iksy = Array.from({ length: n }, (_, i) => a + i * h);
  const y = iksy.map((x) => Math.exp(Math.cos(x)));
  const getInterpolatedValue = function (x) {
    const buffer = [...y];
    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        buffer[j] =
          ((x - iksy[i]) * buffer[j] - (x - iksy[j]) * buffer[i]) /
          (iksy[j] - iksy[i]);
      }
    }
    return buffer[n - 1];
  };
  const yPoli = iksy.map((x) => getInterpolatedValue(x));
  const delta = iksy.map((x) =>
    Math.abs(Math.exp(Math.cos(x)) - getInterpolatedValue(x))
  );
  return { iksy, y, yPoli, delta };
};

//Canvas
btnResult.addEventListener("click", () => {
  diagrams.forEach((element) => {
    element.style.display = "block";
  });
  clearContainer.style.display = "flex";
  btnResult.disabled = true;
  const a = Number(inputA.value);
  const b = Number(inputB.value);
  const n = Number(inputN.value);
  console.log(a, b, n);

  const { iksy, y, yPoli, delta } = Aiken(a, b, n);
  const ctx = document.querySelector("#diagram").getContext("2d");
  const ctx2 = document.querySelector("#diagram2").getContext("2d");
  const ctx3 = document.querySelector("#diagram3").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: iksy,
      datasets: [
        {
          label: "Exp(cos(x))",
          data: y,
          borderColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
            Math.random() * 256
          )}, ${Math.floor(Math.random() * 256)}, 1)`,
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  new Chart(ctx2, {
    type: "line",
    data: {
      labels: iksy,
      datasets: [
        {
          label: "Інтерполяція",
          data: yPoli,
          borderColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
            Math.random() * 256
          )}, ${Math.floor(Math.random() * 256)}, 1)`,

          borderWidth: 2,
          tension: 0.4,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  new Chart(ctx3, {
    type: "line",
    data: {
      labels: iksy,
      datasets: [
        {
          label: "Похибка",
          data: delta,
          borderColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
            Math.random() * 256
          )}, ${Math.floor(Math.random() * 256)}, 1)`,
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});

btnClear.addEventListener("click", () => {
  window.location.reload();
});
