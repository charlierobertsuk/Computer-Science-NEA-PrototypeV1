# Computer Science NEA - Prototype V1: Very Awesome Algorithm Visualiser (VAAV)

Welcome to the repository for **Prototype V1** of my Computer Science NEA (Non-Exam Assessment) project! This project is an interactive web-based application called the **Very Awesome Algorithm Visualiser (VAAV)**, designed to help users visualise and understand how sorting algorithms work through dynamic animations and code step-throughs.

## About This Project

This prototype is the first functional version of my NEA, developed to meet the requirements of my Computer Science coursework. The goal is to create an educational tool that visualises sorting algorithms (Bubble Sort, Merge Sort, and Quick Sort) with a focus on usability, interactivity, and clear presentation of algorithmic processes.

### Objectives
- Demonstrate sorting algorithms visually using animated bars.
- Provide real-time statistics (comparisons and swaps) and code execution highlights.
- Allow users to customise array size and animation speed for a tailored experience.
- Build a foundation for further enhancements in future prototypes.

### Technologies Used
- **HTML**: Structure of the web application.
- **CSS**: Styling with a custom dark theme inspired by MonkeyType, including responsive design.
- **JavaScript**: Core logic for algorithm implementation, animations, and interactivity.
- **Tools**: Developed using Visual Studio Code and Git for version control.

## Features
This prototype includes the following features:
- **Sorting Visualisation**: Animated bars represent array elements, with colors indicating states (unsorted, comparing, sorted, pivot).
- **Algorithm Selection**: Choose between Bubble Sort, Merge Sort, and Quick Sort via a dropdown menu.
- **Array Size Options**: Select from small (8), medium (16), or large (32) arrays.
- **Speed Control**: Adjust animation speed using a slider (1ms to 500ms delay).
- **Statistics**: Real-time display of comparisons and swaps during sorting.
- **Code Display**: View pseudo-code for the selected algorithm, with the current line highlighted during execution.
- **Loading Animation**: A bubble sort animation on startup before the main app loads.
- **Responsive Tabs**: Three resisable tabs for the visualiser, control panel, and code/stats display.

## Files Included
- `index.html`: The main structure of the application.
- `styles.css`: Custom styling with a dark theme and responsive design.
- `script.js`: JavaScript logic for sorting algorithms, animations, and UI interactions.

## How to Run the Prototype
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/charlierobertsuk/Computer-Science-NEA-PrototypeV1.git
   ```
2. **Open the Project**:
   - Navigate to the project folder.
   - Open `index.html` in a modern web browser (e.g., Chrome, Firefox).
3. **Interact with the Visualiser**:
   - Select an algorithm, array size, and speed.
   - Click "Start Sorting" to see the visualisation in action.

*(No additional setup or dependencies are required—just a browser!)*

## Current Limitations
As this is Prototype V1, it’s still a work in progress. Known limitations include:
- Limited algorithm support (only Bubble, Merge, and Quick Sort).
- Basic error handling and no pause/reset functionality during sorting.
- Code display is static pseudo-code (JavaScript and Python tabs) and not fully synchronised with every step.
- Responsiveness could be improved for smaller mobile screens.

These will be addressed in future iterations based on testing and feedback.

## Next Steps
- Add more sorting algorithms (e.g., Insertion Sort, Heap Sort).
- Implement pause, step-through, and reset functionality.
- Enhance mobile responsiveness and accessibility.
- Improve code display to show actual running JavaScript code alongside animations.
- Optimise performance for larger array sizes.
