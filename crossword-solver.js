// Crossword Solver App

let wordList = []
let debounceTimer = null

// DOM Elements
const patternInput = document.getElementById("patternInput")
const clearBtn = document.getElementById("clearBtn")
const solveBtn = document.getElementById("solveBtn")
const lengthFilter = document.getElementById("lengthFilter")
const startsWithFilter = document.getElementById("startsWithFilter")
const loading = document.getElementById("loading")
const resultsContainer = document.getElementById("resultsContainer")
const resultsCount = document.getElementById("resultsCount")
const resultsGrid = document.getElementById("resultsGrid")
const emptyState = document.getElementById("emptyState")
const noResults = document.getElementById("noResults")
const copyAllBtn = document.getElementById("copyAllBtn")
const themeToggle = document.getElementById("themeToggle")
const mobileMenuToggle = document.getElementById("mobileMenuToggle")
const mobileNav = document.getElementById("mobileNav")
const toast = document.getElementById("toast")
const toastMessage = document.getElementById("toastMessage")

// Initialize
async function init() {
  await loadWordList()
  setupEventListeners()
  initTheme()
}

// Load word list
async function loadWordList() {
  try {
    const response = await fetch("/public/words.txt")
    if (response.ok) {
      const text = await response.text()
      wordList = text
        .split("\n")
        .map((word) => word.trim().toLowerCase())
        .filter((word) => word.length >= 2)
    } else {
      wordList = getDefaultWordList()
    }
  } catch (error) {
    wordList = getDefaultWordList()
  }
}

// Default word list
function getDefaultWordList() {
  return [
    "cat",
    "cot",
    "cut",
    "car",
    "cap",
    "cup",
    "cop",
    "cab",
    "can",
    "bat",
    "hat",
    "mat",
    "rat",
    "sat",
    "pat",
    "fat",
    "vat",
    "dog",
    "log",
    "fog",
    "hog",
    "jog",
    "bog",
    "cog",
    "run",
    "sun",
    "fun",
    "gun",
    "bun",
    "pun",
    "nun",
    "word",
    "work",
    "worm",
    "worn",
    "world",
    "words",
    "about",
    "above",
    "abuse",
    "actor",
    "acute",
  ]
}

// Setup event listeners
function setupEventListeners() {
  patternInput.addEventListener("input", () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(solveCrossword, 300)
  })

  patternInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      clearTimeout(debounceTimer)
      solveCrossword()
    }
  })

  clearBtn.addEventListener("click", () => {
    patternInput.value = ""
    resetUI()
  })

  solveBtn.addEventListener("click", solveCrossword)
  lengthFilter.addEventListener("change", solveCrossword)
  startsWithFilter.addEventListener("input", solveCrossword)
  copyAllBtn.addEventListener("click", copyAllWords)
  themeToggle.addEventListener("click", toggleTheme)
  mobileMenuToggle.addEventListener("click", () => {
    mobileNav.classList.toggle("active")
  })
}

// Solve crossword
function solveCrossword() {
  const pattern = patternInput.value.trim().toLowerCase()

  if (!pattern) {
    resetUI()
    return
  }

  showLoading()

  setTimeout(() => {
    const results = findMatches(pattern)
    displayResults(results)
  }, 100)
}

// Find matches
function findMatches(pattern) {
  const regex = new RegExp("^" + pattern.replace(/\?/g, ".") + "$", "i")
  let matches = wordList.filter((word) => regex.test(word))

  // Apply filters
  const lengthFilterValue = lengthFilter.value
  const startsWithValue = startsWithFilter.value.toLowerCase().trim()

  if (lengthFilterValue !== "all") {
    matches = matches.filter((word) => word.length === Number.parseInt(lengthFilterValue))
  }

  if (startsWithValue) {
    matches = matches.filter((word) => word.startsWith(startsWithValue))
  }

  // Sort by length descending, then alphabetically
  matches.sort((a, b) => {
    if (b.length !== a.length) return b.length - a.length
    return a.localeCompare(b)
  })

  return matches
}

// Display results
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

  // Update length filter
  updateLengthFilter(results)

  // Update count
  resultsCount.textContent = results.length

  // Find longest words
  const maxLength = Math.max(...results.map((w) => w.length))

  // Build results grid
  resultsGrid.innerHTML = results
    .map(
      (word) => `
        <div class="word-card ${word.length === maxLength ? "longest" : ""}">
            <div class="word-info">
                <span class="word-text">${word}</span>
                <span class="word-length">${word.length}</span>
            </div>
            <button class="copy-btn" data-word="${word}" aria-label="Copy ${word}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                </svg>
            </button>
        </div>
    `,
    )
    .join("")

  // Add copy listeners
  resultsGrid.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => copyWord(btn.dataset.word, btn))
  })
}

// Update length filter
function updateLengthFilter(results) {
  const lengths = [...new Set(results.map((w) => w.length))].sort((a, b) => b - a)
  const currentValue = lengthFilter.value

  lengthFilter.innerHTML = '<option value="all">All lengths</option>'
  lengths.forEach((len) => {
    const option = document.createElement("option")
    option.value = len
    option.textContent = `${len} letters`
    lengthFilter.appendChild(option)
  })

  if (currentValue !== "all" && lengths.includes(Number.parseInt(currentValue))) {
    lengthFilter.value = currentValue
  }
}

// Copy word
async function copyWord(word, btn) {
  try {
    await navigator.clipboard.writeText(word)
    btn.classList.add("copied")
    showToast(`"${word}" copied!`)
    setTimeout(() => btn.classList.remove("copied"), 2000)
  } catch (err) {
    showToast("Failed to copy")
  }
}

// Copy all words
async function copyAllWords() {
  const words = Array.from(resultsGrid.querySelectorAll(".word-text")).map((el) => el.textContent)
  try {
    await navigator.clipboard.writeText(words.join("\n"))
    showToast(`${words.length} words copied!`)
  } catch (err) {
    showToast("Failed to copy")
  }
}

// Show/Hide loading
function showLoading() {
  loading.classList.add("active")
  resultsContainer.classList.remove("active")
  emptyState.classList.add("hidden")
  noResults.classList.add("hidden")
}

function hideLoading() {
  loading.classList.remove("active")
}

// Reset UI
function resetUI() {
  resultsContainer.classList.remove("active")
  noResults.classList.add("hidden")
  emptyState.classList.remove("hidden")
}

// Toast
function showToast(message) {
  toastMessage.textContent = message
  toast.classList.add("active")
  setTimeout(() => toast.classList.remove("active"), 3000)
}

// Theme
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

// Initialize
init()
