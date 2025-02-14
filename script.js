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
    this.defaultSize = 16;
    this.codeDisplay = new CodeDisplay(".code-display");

    // DOM elements
    this.barsContainer = document.getElementById("bars-container");
    this.algorithmSelect = document.getElementById("algorithm-select");
    this.arraySizeInput = document.getElementById("array-size");
    this.speedInput = document.getElementById("animation-speed");
    this.startButton = document.getElementById("start");
    this.sizeButtons = {
      small: document.getElementById("size-small"),
      medium: document.getElementById("size-medium"),
      large: document.getElementById("size-large"),
    };

    // Event listeners
    this.startButton.addEventListener("click", () => this.startSorting());
    window.addEventListener("resize", () => this.renderBars());
    this.algorithmSelect.addEventListener("change", (e) => {
      this.codeDisplay.updateCode(e.target.value);
    });
    this.speedInput.addEventListener("change", (e) => {
      this.animationSpeed = 501 - e.target.value;
    });
    const sizes = { small: 8, medium: 16, large: 32 }; // im so clever for this
    Object.keys(this.sizeButtons).forEach((key) => {
      this.sizeButtons[key].addEventListener("click", () =>
        this.generateArray(sizes[key])
      );
    });

    this.generateArray(this.defaultSize);
  }

  async updateCodeLine(lineNumber) {
    this.codeDisplay.updateCode(this.algorithmSelect.value, lineNumber);
    await this.wait();
  }

  generateArray(size) {
    if (this.isRunning) return;
    const uniqueNumbers = new Set();
    while (uniqueNumbers.size < size) {
      uniqueNumbers.add(Math.floor(Math.random() * 99) + 1);
    }
    this.array = Array.from(uniqueNumbers);
    this.originalArray = [...this.array];
    this.renderBars();
    this.reset();
  }

  finishSorting() {
    this.isRunning = false;
    this.toggleButtons(true);
    this.startButton.disabled = true;
    this.bars.forEach((bar) => bar.classList.add("is-sorted"));
  }

  renderBars() {
    this.barsContainer.innerHTML = "";
    this.bars = [];
    this.numbers = [];

    const containerWidth = this.barsContainer.offsetWidth;
    const minBarWidth = 20;
    const maxBarWidth = 30;
    const maxBars = Math.floor(containerWidth / minBarWidth);
    const displayedArray = this.array.slice(0, maxBars);

    displayedArray.forEach((value) => {
      const barContainer = this.createBarContainer(
        value,
        containerWidth,
        displayedArray.length,
        minBarWidth,
        maxBarWidth
      );
      this.barsContainer.appendChild(barContainer);
    });
  }

  createBarContainer(
    value,
    containerWidth,
    displayedArrayLength,
    minBarWidth,
    maxBarWidth
  ) {
    const barContainer = document.createElement("div");
    barContainer.className = "bar-container";

    const bar = document.createElement("div");
    bar.className = "sorting-bar";

    const barWidth = Math.min(
      Math.max(containerWidth / displayedArrayLength - 2, minBarWidth),
      maxBarWidth
    );
    bar.style.height = `${value * 2}px`;
    bar.style.width = `${barWidth}px`;

    const numberLabel = document.createElement("div");
    numberLabel.className = "number-label";
    numberLabel.textContent = `${value}`;
    numberLabel.style.fontSize = `${Math.max(
      Math.min(barWidth * 0.6, 18),
      12
    )}px`;

    barContainer.appendChild(bar);
    barContainer.appendChild(numberLabel);

    this.bars.push(bar);
    this.numbers.push(numberLabel);
    return barContainer;
  }

  async startSorting() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.toggleButtons(false);

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

  toggleButtons(enable) {
    Object.values(this.sizeButtons).forEach(
      (button) => (button.disabled = !enable)
    );
    this.startButton.disabled = !enable;
  }

  async bubbleSort() {
    await this.updateCodeLine(0);
    for (let i = 0; i < this.array.length; i++) {
      await this.updateCodeLine(1);
      for (let j = 0; j < this.array.length - i - 1; j++) {
        await this.updateCodeLine(2);
        await this.updateCodeLine(3);
        await this.compareAndSwap(j, j + 1);
      }
      this.bars[this.array.length - i - 1].classList.add("is-sorted");
    }
  }

  async compareAndSwap(i, j) {
    this.bars[i].classList.add("is-comparing");
    this.bars[j].classList.add("is-comparing");
    await this.wait();

    this.comparisons++;
    document.getElementById("comparisons").textContent = this.comparisons;

    if (this.array[i] > this.array[j]) {
      await this.updateCodeLine(4);
      await this.swap(i, j);
    }

    this.bars[i].classList.remove("is-comparing");
    this.bars[j].classList.remove("is-comparing");
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
    this.toggleButtons(true);
    this.bars.forEach((bar) =>
      bar.classList.remove("is-comparing", "is-sorted", "is-pivot")
    );
  }
}

class LoadingScreen {
  constructor(onComplete) {
    this.container = document.getElementById("loading-bars");
    this.onComplete = onComplete;
    this.createBars();
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
    this.loadingScreen.animateBubbleSort();
  }
}

class CodeDisplay {
  constructor(containerId) {
    this.container = document.querySelector(containerId);
    this.currentAlgorithm = "bubble";
    this.currentLine = -1;
    this.activeTab = "javascript";
    this.codeContainer = null;
    this.tabButtons = new Map();

    this.codeImplementations = {
      bubble: {
        javascript: `BubbleSort(array) {
  for i -> 0 to arrayLength 
    for j -> 0 to (arrayLength - i - 1)
      if arr[j] > arr[j + 1]
        swap(arr[j], arr[j + 1])
}`,
        python: `def bubble_sort(arr):
  for n in range(len(arr) - 1, 0, -1):
    swapped = False  
      for i in range(n):
          if arr[i] > arr[i + 1]:
              arr[i], arr[i + 1] = arr[i + 1], arr[i]
              swapped = True`,
      },
    };

    this.init();
  }

  init() {
    this.createTabsUI();
    this.updateCodeDisplay();
  }

  createTabsUI() {
    const tabsContainer = document.createElement("div");
    tabsContainer.className = "code-tabs";

    const tabsList = document.createElement("div");
    tabsList.className = "tabs-list";

    ["javascript", "python"].forEach((lang) => {
      // add to the list to add a tab
      const tab = document.createElement("button");
      tab.className = `tab-button ${lang === this.activeTab ? "active" : ""}`;
      tab.textContent = lang.charAt(0).toUpperCase() + lang.slice(1);
      tab.addEventListener("click", () => this.switchTab(lang));
      this.tabButtons.set(lang, tab);
      tabsList.appendChild(tab);
    });

    this.codeContainer = document.createElement("div");
    this.codeContainer.className = "code-container";

    tabsContainer.appendChild(tabsList);
    tabsContainer.appendChild(this.codeContainer);
    this.container.appendChild(tabsContainer);
  }

  switchTab(lang) {
    if (this.activeTab === lang) return;

    this.activeTab = lang;
    this.tabButtons.forEach((button, key) => {
      button.classList.toggle("active", key === lang);
    });
    this.updateCodeDisplay();
  }

  updateCode(algorithm, lineNumber = -1) {
    this.currentAlgorithm = algorithm;
    this.currentLine = lineNumber;
    this.updateCodeDisplay();
  }

  updateCodeDisplay() {
    if (!this.codeContainer) return;

    const code =
      this.codeImplementations[this.currentAlgorithm]?.[this.activeTab];

    const lines = code.split("\n");

    this.codeContainer.innerHTML = "";
    const pre = document.createElement("pre");
    const codeElement = document.createElement("code");
    codeElement.className = `language`;

    lines.forEach((line, index) => {
      const lineDiv = document.createElement("div");
      lineDiv.className = "code-line";
      if (index === this.currentLine) {
        lineDiv.classList.add("current-line");
      }
      lineDiv.textContent = line;
      codeElement.appendChild(lineDiv);
    });

    pre.appendChild(codeElement);
    this.codeContainer.appendChild(pre);
  }

  destroy() {
    this.tabButtons.clear();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const visualiserTab = document.querySelector(".visualiser-tab");
  const controlPanelTab = document.querySelector(".control-panel-tab");
  const codeDisplayTab = document.querySelector(".code-display-tab");

  function setupTabInteraction() {
    const height = window.innerHeight; // width variable unused and unloved. RIP

    // reset all initial positions
    visualiserTab.style.left = "0";
    visualiserTab.style.top = "0";
    visualiserTab.style.width = "100%";
    visualiserTab.style.height = `${height / 2}px`;

    controlPanelTab.style.left = "0";
    controlPanelTab.style.top = `${height / 2}px`;
    controlPanelTab.style.width = "50%";
    controlPanelTab.style.height = `${height / 2}px`;

    codeDisplayTab.style.left = "50%";
    codeDisplayTab.style.top = `${height / 2}px`;
    codeDisplayTab.style.width = "50%";
    codeDisplayTab.style.height = `${height / 2}px`;

    tabs.forEach((tab) => {
      const existingButton = tab.querySelector(".tab-focus-btn");
      if (existingButton) {
        existingButton.remove();
      }

      const focusButton = document.createElement("button");
      focusButton.textContent = "Focus";
      focusButton.classList.add("tab-focus-btn");
      focusButton.style.position = "absolute";
      focusButton.style.top = "10px";
      focusButton.style.right = "10px";

      const isInTopHalf =
        tab.style.top === "0px" && tab.style.height === `${height / 2}px`;
      focusButton.style.display = isInTopHalf ? "none" : "block";

      tab.appendChild(focusButton);

      focusButton.addEventListener("click", () => {
        if (tab.style.top === "0px" && tab.style.height === `${height / 2}px`) {
          setupTabInteraction();
          return;
        }

        tabs.forEach((t) => {
          const button = t.querySelector(".tab-focus-btn");
          button.style.display = "block";
        });

        focusButton.style.display = "none";
        const halfHeight = height / 2;

        const setTabStyle = (tab, left, top, width, height) => {
          tab.style.left = left;
          tab.style.top = top;
          tab.style.width = width;
          tab.style.height = height;
        };

        const setLayout = (activeTab) => {
          setTabStyle(activeTab, "0", "0", "100%", `${halfHeight}px`);

          const bottomTabs = [
            visualiserTab,
            controlPanelTab,
            codeDisplayTab,
          ].filter((tab) => tab !== activeTab);

          setTabStyle(
            bottomTabs[0],
            "0",
            `${halfHeight}px`,
            "50%",
            `${halfHeight}px`
          );
          setTabStyle(
            bottomTabs[1],
            "50%",
            `${halfHeight}px`,
            "50%",
            `${halfHeight}px`
          );
        };

        // Usage
        setLayout(tab);
      });
    });
  }

  setupTabInteraction();
  window.addEventListener("resize", setupTabInteraction);
});

document.addEventListener("DOMContentLoaded", () => {
  window.app = new AppInitialiser();
});
