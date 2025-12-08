// Jumble Solver App

let wordList = []
let debounceTimer = null

const jumbleInput = document.getElementById("jumbleInput")
const clearBtn = document.getElementById("clearBtn")
const solveBtn = document.getElementById("solveBtn")
const exactLength = document.getElementById("exactLength")
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

async function init() {
  await loadWordList()
  setupEventListeners()
  initTheme()
}

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

function getDefaultWordList() {
  return [
    "cat",
    "act",
    "car",
    "arc",
    "rat",
    "tar",
    "art",
    "dog",
    "god",
    "ate",
    "eat",
    "tea",
    "eta",
    "tap",
    "pat",
    "apt",
    "top",
    "pot",
    "opt",
    "stop",
    "tops",
    "pots",
    "opts",
    "spot",
    "post",
  ]
}

function setupEventListeners() {
  jumbleInput.addEventListener("input", () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(solveJumble, 300)
  })

  jumbleInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      clearTimeout(debounceTimer)
      solveJumble()
    }
  })

  clearBtn.addEventListener("click", () => {
    jumbleInput.value = ""
    resetUI()
  })

  solveBtn.addEventListener("click", solveJumble)
  exactLength.addEventListener("input", solveJumble)
  copyAllBtn.addEventListener("click", copyAllWords)
  themeToggle.addEventListener("click", toggleTheme)
  mobileMenuToggle.addEventListener("click", () => mobileNav.classList.toggle("active"))
}

function solveJumble() {
  const letters = jumbleInput.value
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "")

  if (!letters) {
    resetUI()
    return
  }

  showLoading()

  setTimeout(() => {
    const results = findAnagrams(letters)
    displayResults(results)
  }, 100)
}

function findAnagrams(letters) {
  const sortedInput = letters.split("").sort().join("")
  const exactLen = exactLength.value ? Number.parseInt(exactLength.value) : null

  const matches = wordList.filter((word) => {
    if (word.length > letters.length) return false
    if (exactLen && word.length !== exactLen) return false

    // Check if word can be formed from letters
    const lettersCopy = letters.split("")
    for (const char of word) {
      const idx = lettersCopy.indexOf(char)
      if (idx === -1) return false
      lettersCopy.splice(idx, 1)
    }
    return true
  })

  // Prioritize exact length matches
  matches.sort((a, b) => {
    if (b.length !== a.length) return b.length - a.length
    return a.localeCompare(b)
  })

  return matches
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

  const maxLength = Math.max(...results.map((w) => w.length))

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

  resultsGrid.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => copyWord(btn.dataset.word, btn))
  })
}

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

async function copyAllWords() {
  const words = Array.from(resultsGrid.querySelectorAll(".word-text")).map((el) => el.textContent)
  try {
    await navigator.clipboard.writeText(words.join("\n"))
    showToast(`${words.length} words copied!`)
  } catch (err) {
    showToast("Failed to copy")
  }
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

function resetUI() {
  resultsContainer.classList.remove("active")
  noResults.classList.add("hidden")
  emptyState.classList.remove("hidden")
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
