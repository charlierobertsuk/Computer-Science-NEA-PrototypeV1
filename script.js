class AlgorithmVisualiser {
  // Defines properties and methods of objects without having to do a bunch of it manualy
  constructor() {
    this.array = [];
    this.bars = [];
    this.isRunning = false;
    this.comparisons = 0;
    this.swaps = 0;
    this.animationSpeed = 100;

    // DOM elements
    this.barsContainer = document.getElementById("bars-container");
    this.algorithmSelect = document.getElementById("algorithm-select");
    this.arraySizeInput = document.getElementById("array-size");
    this.speedInput = document.getElementById("animation-speed");
    this.generateButton = document.getElementById("generate-array");
    this.startButton = document.getElementById("start");

    // Event listeners
    this.generateButton.addEventListener("click", () => this.generateArray());
    this.startButton.addEventListener("click", () => this.startSorting());
    this.speedInput.addEventListener(
      "change",
      (e) => (this.animationSpeed = e.target.value)
    );

    // Init
    this.generateArray();
  }

  generateArray() {
    const size = parseInt(this.arraySizeInput.value); // parses a string into an intager for the size value
    const uniqueNumbers = new Set(); // a set only contains unique values and removes duplicates

    while (uniqueNumbers.size < size) {
      // while the list has been shortened by duplicates then generate new numbers
      const ranNum = Math.floor(Math.random() * 250) + 10; // Should be random values between 10 and 260
      uniqueNumbers.add(ranNum);
    }

    this.array = Array.from(uniqueNumbers);
    this.renderBars();
    this.reset();
  }

  renderBars() {
    this.barsContainer.innerHTML = "";
    this.bars = [];
    this.numbers = [];

    this.array.forEach((value) => {
      const barContainer = document.createElement("div");
      barContainer.className = "bar-container";

      const bar = document.createElement("div");
      bar.className = "sorting-bar";
      bar.style.height = `${value}px`; // height of the bar is the same as the value in the array

      const number = document.createElement("div");
      number.className = "number-label";
      number.textContent = value; // visualises the number for the users benifit

      // Adds all the bar container content
      barContainer.appendChild(bar);
      barContainer.appendChild(number);
      this.barsContainer.appendChild(barContainer);

      this.bars.push(bar);
      this.numbers.push(number);
    });
  }

  async startSorting() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.startButton.disabled = true;
    this.generateButton.disabled = true;

    switch (this.algorithmSelect.value) {
      case "bubble":
        await this.bubbleSort();
        break;
      case "merge":
        await this.mergeSort(0, this.array.length - 1);
        break;
      case "quick":
        await this.quickSort(0, this.array.length - 1);
        break;
    }

    this.finishSorting();
  }

  async bubbleSort() {
    for (let i = 0; i < this.array.length; i++) {
      for (let j = 0; j < this.array.length - i - 1; j++) {
        this.bars[j].classList.add("is-comparing");
        this.bars[j + 1].classList.add("is-comparing");
        await this.wait();

        this.comparisons++;
        document.getElementById("comparisons").textContent = this.comparisons;

        if (this.array[j] > this.array[j + 1]) {
          await this.swap(j, j + 1);
        }

        this.bars[j].classList.remove("is-comparing");
        this.bars[j + 1].classList.remove("is-comparing");
      }
      this.bars[this.array.length - i - 1].classList.add("is-sorted");
    }
  }

  // Merge Sort

  async swap(i, j) {
    this.swaps++;
    document.getElementById("swaps").textContent = this.swaps;

    const temp = this.array[i];
    this.array[i] = this.array[j];
    this.array[j] = temp;

    this.bars[i].style.height = `${this.array[i]}px`;
    this.bars[j].style.height = `${this.array[j]}px`;

    this.numbers[i].textContent = this.array[i];
    this.numbers[j].textContent = this.array[j];

    this.numbers[i].classList.add("number-transition");
    this.numbers[j].classList.add("number-transition");

    await this.wait();

    this.numbers[i].classList.remove("number-transition");
    this.numbers[j].classList.remove("number-transition");
  }

  wait() {
    // waits at the set animation speed time
    return new Promise((resolve) => setTimeout(resolve, this.animationSpeed));
  }

  reset() {
    // resets all changed values
    this.isRunning = false;
    this.comparisons = 0;
    this.swaps = 0;
    document.getElementById("comparisons").textContent = "0";
    document.getElementById("swaps").textContent = "0";
    this.startButton.disabled = false;
    this.generateButton.disabled = false;
    this.bars.forEach((bar) => {
      bar.classList.remove("is-comparing", "is-sorted");
    });
  }

  finishSorting() {
    // stops when done sorting
    this.isRunning = false;
    this.generateButton.disabled = false;
    this.bars.forEach((bar) => bar.classList.add("is-sorted"));
  }
}

class LoadingScreen {
  // awsome loading screen simulates a 10 bar bubble sort whilst the site loads
  constructor(onComplete) {
    this.bars = [];
    this.container = document.getElementById("loading-bars");
    this.onComplete = onComplete;
    this.createBars();
    this.animateBubbleSort();
  }

  createBars() {
    this.bars = Array.from(
      { length: 10 },
      () => Math.floor(Math.random() * 250) + 10
    );
    this.bars.forEach((height) => {
      const bar = document.createElement("div");
      bar.className = "loading-bar";
      bar.style.height = `${height}px`;
      this.container.appendChild(bar);
    });
    this.barElements = Array.from(this.container.children);
  }

  async animateBubbleSort() {
    for (let i = 0; i < this.bars.length; i++) {
      for (let j = 0; j < this.bars.length - i - 1; j++) {
        this.barElements[j].classList.add("is-comparing");
        this.barElements[j + 1].classList.add("is-comparing");
        await this.wait(50);

        if (this.bars[j] > this.bars[j + 1]) {
          this.swapBars(j, j + 1);
        }

        this.barElements[j].classList.remove("is-comparing");
        this.barElements[j + 1].classList.remove("is-comparing");
      }
      this.barElements[this.bars.length - i - 1].classList.add("is-sorted");
    }

    this.hideLoadingScreen();
  }

  swapBars(i, j) {
    const temp = this.bars[i];
    this.bars[i] = this.bars[j];
    this.bars[j] = temp;

    this.barElements[i].style.height = `${this.bars[i]}px`;
    this.barElements[j].style.height = `${this.bars[j]}px`;
  }

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async hideLoadingScreen() {
    await new Promise((r) => setTimeout(r, 500)); // wait so user can see the end result
    document.getElementById("loading-screen").style.display = "none";
    document.querySelector(".app-container").style.display = "block";
    this.onComplete();
    document.body.style.overflow = "auto";
  }
}

window.addEventListener("load", () => {
  // loads loading screen and content when site is loading
  new LoadingScreen(() => {
    new AlgorithmVisualiser();
  });
});
