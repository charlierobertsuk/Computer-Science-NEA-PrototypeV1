class AlgorithmVisualiser {
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

    // Bind event listeners
    this.generateButton.addEventListener("click", () => this.generateArray());
    this.startButton.addEventListener("click", () => this.startSorting());
    this.speedInput.addEventListener(
      "change",
      (e) => (this.animationSpeed = e.target.value)
    );

    // Initialise
    this.generateArray();
  }

  generateArray() {
    const size = parseInt(this.arraySizeInput.value);
    this.array = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 250) + 10
    );
    this.renderBars();
    this.reset();
  }

  renderBars() {
    this.barsContainer.innerHTML = "";
    this.bars = this.array.map((value) => {
      const bar = document.createElement("div");
      bar.className = "sorting-bar";
      bar.style.height = `${value}px`;
      this.barsContainer.appendChild(bar);
      return bar;
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

  async swap(i, j) {
    this.swaps++;
    document.getElementById("swaps").textContent = this.swaps;

    const temp = this.array[i];
    this.array[i] = this.array[j];
    this.array[j] = temp;

    this.bars[i].style.height = `${this.array[i]}px`;
    this.bars[j].style.height = `${this.array[j]}px`;

    await this.wait();
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
    this.bars.forEach((bar) => {
      bar.classList.remove("is-comparing", "is-sorted");
    });
  }

  finishSorting() {
    this.isRunning = false;
    this.generateButton.disabled = false;
    this.bars.forEach((bar) => bar.classList.add("is-sorted"));
  }
}

window.addEventListener("load", () => {
  new AlgorithmVisualiser();
});
