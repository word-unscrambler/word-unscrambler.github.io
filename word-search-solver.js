// Word Search Solver App

const gridInput = document.getElementById("gridInput")
const wordsInput = document.getElementById("wordsInput")
const solveBtn = document.getElementById("solveBtn")
const loading = document.getElementById("loading")
const resultsContainer = document.getElementById("resultsContainer")
const resultsCount = document.getElementById("resultsCount")
const resultsGrid = document.getElementById("resultsGrid")
const emptyState = document.getElementById("emptyState")
const noResults = document.getElementById("noResults")
const themeToggle = document.getElementById("themeToggle")
const mobileMenuToggle = document.getElementById("mobileMenuToggle")
const mobileNav = document.getElementById("mobileNav")
const toast = document.getElementById("toast")
const toastMessage = document.getElementById("toastMessage")

// Directions for word search
const directions = [
  { name: "Right", dr: 0, dc: 1 },
  { name: "Left", dr: 0, dc: -1 },
  { name: "Down", dr: 1, dc: 0 },
  { name: "Up", dr: -1, dc: 0 },
  { name: "Down-Right", dr: 1, dc: 1 },
  { name: "Down-Left", dr: 1, dc: -1 },
  { name: "Up-Right", dr: -1, dc: 1 },
  { name: "Up-Left", dr: -1, dc: -1 },
]

function init() {
  setupEventListeners()
  initTheme()
}

function setupEventListeners() {
  solveBtn.addEventListener("click", solveWordSearch)
  themeToggle.addEventListener("click", toggleTheme)
  mobileMenuToggle.addEventListener("click", () => mobileNav.classList.toggle("active"))
}

function solveWordSearch() {
  const gridText = gridInput.value.trim()
  const wordsText = wordsInput.value.trim()

  if (!gridText || !wordsText) {
    showToast("Please enter both grid and words")
    return
  }

  showLoading()

  setTimeout(() => {
    const grid = parseGrid(gridText)
    const words = wordsText
      .split("\n")
      .map((w) => w.trim().toUpperCase())
      .filter((w) => w.length > 0)

    const results = findWords(grid, words)
    displayResults(results)
  }, 100)
}

function parseGrid(text) {
  return text
    .split("\n")
    .map((row) => row.trim().toUpperCase().replace(/\s/g, ""))
    .filter((row) => row.length > 0)
    .map((row) => row.split(""))
}

function findWords(grid, words) {
  const found = []

  for (const word of words) {
    const result = findWord(grid, word)
    if (result) {
      found.push(result)
    }
  }

  return found
}

function findWord(grid, word) {
  const rows = grid.length
  if (rows === 0) return null
  const cols = grid[0].length

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === word[0]) {
        for (const dir of directions) {
          if (checkDirection(grid, word, r, c, dir.dr, dir.dc)) {
            return {
              word: word,
              startRow: r + 1,
              startCol: c + 1,
              direction: dir.name,
              endRow: r + (word.length - 1) * dir.dr + 1,
              endCol: c + (word.length - 1) * dir.dc + 1,
            }
          }
        }
      }
    }
  }

  return null
}

function checkDirection(grid, word, startR, startC, dr, dc) {
  const rows = grid.length
  const cols = grid[0].length

  for (let i = 0; i < word.length; i++) {
    const r = startR + i * dr
    const c = startC + i * dc

    if (r < 0 || r >= rows || c < 0 || c >= cols) return false
    if (grid[r][c] !== word[i]) return false
  }

  return true
}

function displayResults(results) {
  hideLoading()

  if (results.length === 0) {
    emptyState.classList.add("hidden")
    resultsContainer.classList.remove("active")
    noResults.classList.remove("hidden")
    return
  }

  emptyState.classList.add("hidden")
  noResults.classList.add("hidden")
  resultsContainer.classList.add("active")

  resultsCount.textContent = results.length

  resultsGrid.innerHTML = results
    .map(
      (result) => `
        <div class="word-card longest">
            <div class="word-search-info">
                <span class="word-text">${result.word}</span>
                <span class="word-location">
                    Row ${result.startRow}, Col ${result.startCol} → ${result.direction}
                </span>
            </div>
        </div>
    `,
    )
    .join("")
}

function showLoading() {
  loading.classList.add("active")
  resultsContainer.classList.remove("active")
  emptyState.classList.add("hidden")
  noResults.classList.add("hidden")
}

function hideLoading() {
  loading.classList.remove("active")
}

function showToast(message) {
  toastMessage.textContent = message
  toast.classList.add("active")
  setTimeout(() => toast.classList.remove("active"), 3000)
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme)
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.setAttribute("data-theme", "dark")
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"
  document.documentElement.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
}

init()
