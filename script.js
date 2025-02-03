class AlgorithmVisualiser {
  constructor() {
    this.array = [];
    this.bars = [];
    this.originalArray = [];
    this.numbers = [];
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
    this.restoreButton = document.getElementById("restore-array");
    this.startButton = document.getElementById("start");

    // Event listeners
    this.generateButton.addEventListener("click", () => this.generateArray());
    this.startButton.addEventListener("click", () => this.startSorting());
    this.restoreButton.addEventListener("click", () => this.restoreArray());
    window.addEventListener("resize", () => this.renderBars());
    this.speedInput.addEventListener(
      "change",
      (e) => (this.animationSpeed = e.target.value)
    );

    this.generateArray();
  }

  generateArray() {
    const size = parseInt(this.arraySizeInput.value);
    const uniqueNumbers = new Set();

    while (uniqueNumbers.size < size) {
      const ranNum = Math.floor(Math.random() * 99) + 1;
      uniqueNumbers.add(ranNum);
    }

    this.array = Array.from(uniqueNumbers);
    this.originalArray = [...this.array];
    this.renderBars();
    this.reset();
  }

  restoreArray() {
    if (!this.isRunning) {
      this.array = [...this.originalArray];
      this.renderBars();
      this.reset();
      this.restoreButton.disabled = true;
    }
  }

  finishSorting() {
    this.isRunning = false;
    this.generateButton.disabled = false;
    this.bars.forEach((bar) => bar.classList.add("is-sorted"));
    this.restoreButton.disabled = false;
  }

  renderBars() {
    this.barsContainer.innerHTML = "";
    this.bars = [];
    this.numbers = [];

    const containerWidth = this.barsContainer.offsetWidth;
    const minBarWidth = 20;
    const maxBarWidth = 50;
    const maxBars = Math.floor(containerWidth / minBarWidth);
    const displayedArray = this.array.slice(0, maxBars);

    displayedArray.forEach((value) => {
      const barContainer = document.createElement("div");
      barContainer.className = "bar-container";

      const bar = document.createElement("div");
      bar.className = "sorting-bar";

      const barWidth = Math.min(
        Math.max(containerWidth / displayedArray.length - 2, minBarWidth),
        maxBarWidth
      );
      bar.style.height = `${value * 2}px`;
      bar.style.width = `${barWidth}px`;

      const numberLabel = document.createElement("div");
      numberLabel.className = "number-label";
      numberLabel.textContent = `${value}`;

      const fontSize = Math.min(barWidth * 0.6, 18);
      numberLabel.style.fontSize = `${Math.max(fontSize, 12)}px`;

      barContainer.appendChild(bar);
      barContainer.appendChild(numberLabel);
      this.barsContainer.appendChild(barContainer);

      this.bars.push(bar);
      this.numbers.push(numberLabel);
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

  async mergeSort(left, right) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      await this.mergeSort(left, mid);
      await this.mergeSort(mid + 1, right);
      await this.merge(left, mid, right);
    }
  }

  async merge(left, mid, right) {
    const leftArr = this.array.slice(left, mid + 1);
    const rightArr = this.array.slice(mid + 1, right + 1);
    const tempBars = this.bars.slice(left, right + 1);

    let i = 0,
      j = 0,
      k = left;

    // Move bars upward
    tempBars.forEach((bar) => (bar.style.transform = "translateY(-10px)"));
    await this.wait();

    while (i < leftArr.length && j < rightArr.length) {
      this.bars[k].classList.add("is-comparing");
      await this.wait();

      this.comparisons++;
      document.getElementById("comparisons").textContent = this.comparisons;

      if (leftArr[i] <= rightArr[j]) {
        this.array[k] = leftArr[i];
        this.updateBar(k, left + i);
        i++;
      } else {
        this.array[k] = rightArr[j];
        this.updateBar(k, mid + 1 + j);
        j++;
      }
      this.bars[k].classList.remove("is-comparing");
      k++;
    }

    while (i < leftArr.length) {
      this.array[k] = leftArr[i];
      this.updateBar(k, left + i);
      i++;
      k++;
    }

    while (j < rightArr.length) {
      this.array[k] = rightArr[j];
      this.updateBar(k, mid + 1 + j);
      j++;
      k++;
    }

    // moves bars back to original pos
    tempBars.forEach((bar) => (bar.style.transform = "translateY(0)"));
    tempBars.forEach((bar) => bar.classList.add("is-sorted"));
    await this.wait();
  }

  updateBar(index) {
    this.bars[index].style.height = `${this.array[index] * 2}px`;
    this.numbers[index].textContent = this.array[index];
  }

  async swap(i, j) {
    this.swaps++;
    document.getElementById("swaps").textContent = this.swaps;

    const temp = this.array[i];
    this.array[i] = this.array[j];
    this.array[j] = temp;

    this.bars[i].style.height = `${this.array[i] * 2}px`;
    this.bars[j].style.height = `${this.array[j] * 2}px`;

    this.numbers[i].textContent = this.array[i];
    this.numbers[j].textContent = this.array[j];

    await this.wait();
  }

  async quickSort(low, high) {
    if (low < high) {
      const pivotIndex = await this.partition(low, high);

      await this.quickSort(low, pivotIndex - 1);
      await this.quickSort(pivotIndex + 1, high);
    } else if (low === high) {
      this.bars[low].classList.add("is-sorted");
    }
  }

  async partition(low, high) {
    const pivot = this.array[high];
    this.bars[high].classList.add("is-pivot");
    let i = low - 1;

    for (let j = low; j < high; j++) {
      this.bars[j].classList.add("is-comparing");
      await this.wait();

      this.comparisons++;
      document.getElementById("comparisons").textContent = this.comparisons;

      if (this.array[j] < pivot) {
        i++;
        await this.swap(i, j);
      }

      this.bars[j].classList.remove("is-comparing");
    }

    await this.swap(i + 1, high);
    this.bars[high].classList.remove("is-pivot");
    this.bars[i + 1].classList.add("is-sorted");

    return i + 1;
  }

  wait() {
    return new Promise((resolve) => setTimeout(resolve, this.animationSpeed));
  }

  reset() {
    this.isRunning = false;
    this.comparisons = 0;
    this.swaps = 0;
    document.getElementById("comparisons").textContent = "0";
    document.getElementById("swaps").textContent = "0";
    this.startButton.disabled = false;
    this.generateButton.disabled = false;
    this.restoreButton.disabled = true;
    this.bars.forEach((bar) =>
      bar.classList.remove("is-comparing", "is-sorted", "is-pivot")
    );
  }
}

class LoadingScreen {
  constructor(onComplete) {
    this.bars = [];
    this.container = document.getElementById("loading-bars");
    this.onComplete = onComplete;
    this.createBars();
  }

  startAnimation() {
    this.animateBubbleSort();
  }

  createBars() {
    this.bars = Array.from(
      { length: 10 },
      () => Math.floor(Math.random() * 99) + 1
    );
    this.bars.forEach((height) => {
      const bar = document.createElement("div");
      bar.className = "loading-bar";
      bar.style.height = `${height * 2}px`;
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

    this.barElements[i].style.height = `${this.bars[i] * 2}px`;
    this.barElements[j].style.height = `${this.bars[j] * 2}px`;
  }

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async hideLoadingScreen() {
    await this.wait(500);
    document.getElementById("loading-screen").style.display = "none";
    document.querySelector(".app-container").style.display = "block";
    if (this.onComplete) this.onComplete();
  }
}

class AppInitialiser {
  constructor() {
    this.loadingScreen = null;
    this.visualiser = null;
    this.init();
  }

  init() {
    this.loadingScreen = new LoadingScreen(() => {
      this.visualiser = new AlgorithmVisualiser();
    });
    this.loadingScreen.startAnimation();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.app = new AppInitialiser();
});
