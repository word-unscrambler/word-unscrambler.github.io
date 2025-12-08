// Rhyming Dictionary App

let wordList = []
let debounceTimer = null

const wordInput = document.getElementById("wordInput")
const clearBtn = document.getElementById("clearBtn")
const findBtn = document.getElementById("findBtn")
const syllableFilter = document.getElementById("syllableFilter")
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

// Common rhyme endings
const rhymeEndings = [
  "at",
  "ate",
  "ight",
  "ite",
  "ound",
  "ound",
  "ay",
  "ey",
  "ee",
  "ea",
  "ow",
  "ew",
  "ue",
  "oo",
  "tion",
  "sion",
  "ing",
  "ang",
  "ung",
  "ong",
  "ack",
  "eck",
  "ick",
  "ock",
  "uck",
  "all",
  "ell",
  "ill",
  "oll",
  "ull",
  "am",
  "em",
  "im",
  "om",
  "um",
  "an",
  "en",
  "in",
  "on",
  "un",
  "ap",
  "ep",
  "ip",
  "op",
  "up",
  "ar",
  "er",
  "ir",
  "or",
  "ur",
  "ast",
  "est",
  "ist",
  "ost",
  "ust",
  "ake",
  "ike",
  "oke",
  "uke",
  "ame",
  "ime",
  "ome",
  "ume",
  "ane",
  "ine",
  "one",
  "une",
  "ear",
  "eer",
  "air",
  "are",
  "ore",
  "ure",
  "ire",
  "oy",
  "oil",
  "oin",
  "oise",
]

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
    "bat",
    "hat",
    "mat",
    "rat",
    "sat",
    "fat",
    "pat",
    "vat",
    "flat",
    "that",
    "chat",
    "splat",
    "day",
    "say",
    "way",
    "may",
    "pay",
    "play",
    "stay",
    "gray",
    "pray",
    "spray",
    "night",
    "light",
    "right",
    "sight",
    "might",
    "fight",
    "bright",
    "flight",
    "love",
    "dove",
    "above",
    "shove",
    "glove",
    "time",
    "rhyme",
    "climb",
    "dime",
    "lime",
    "chime",
    "prime",
    "slime",
  ]
}

function setupEventListeners() {
  wordInput.addEventListener("input", () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(findRhymes, 300)
  })

  wordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      clearTimeout(debounceTimer)
      findRhymes()
    }
  })

  clearBtn.addEventListener("click", () => {
    wordInput.value = ""
    resetUI()
  })

  findBtn.addEventListener("click", findRhymes)
  syllableFilter.addEventListener("change", findRhymes)
  copyAllBtn.addEventListener("click", copyAllWords)
  themeToggle.addEventListener("click", toggleTheme)
  mobileMenuToggle.addEventListener("click", () => mobileNav.classList.toggle("active"))
}

function findRhymes() {
  const word = wordInput.value.trim().toLowerCase()

  if (!word) {
    resetUI()
    return
  }

  showLoading()

  setTimeout(() => {
    const results = getRhymingWords(word)
    displayResults(results, word)
  }, 100)
}

function getRhymingWords(word) {
  // Find the rhyme ending of the input word
  let rhymeEnd = ""

  // Try to find matching ending (longer endings first)
  const sortedEndings = [...rhymeEndings].sort((a, b) => b.length - a.length)
  for (const ending of sortedEndings) {
    if (word.endsWith(ending)) {
      rhymeEnd = ending
      break
    }
  }

  // If no common ending found, use last 2-3 characters
  if (!rhymeEnd) {
    rhymeEnd = word.length >= 3 ? word.slice(-3) : word.slice(-2)
  }

  // Find words with same ending
  let rhymes = wordList.filter((w) => {
    if (w === word) return false
    return w.endsWith(rhymeEnd) || w.endsWith(word.slice(-2))
  })

  // Apply syllable filter
  const syllableValue = syllableFilter.value
  if (syllableValue !== "all") {
    rhymes = rhymes.filter((w) => {
      const syllables = countSyllables(w)
      if (syllableValue === "1") return syllables === 1
      if (syllableValue === "2") return syllables === 2
      if (syllableValue === "3") return syllables >= 3
      return true
    })
  }

  // Sort alphabetically
  rhymes.sort((a, b) => a.localeCompare(b))

  return rhymes
}

function countSyllables(word) {
  word = word.toLowerCase()
  if (word.length <= 3) return 1
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
  word = word.replace(/^y/, "")
  const matches = word.match(/[aeiouy]{1,2}/g)
  return matches ? matches.length : 1
}

function displayResults(results, inputWord) {
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
      (word) => `
        <div class="word-card">
            <div class="word-info">
                <span class="word-text">${word}</span>
                <span class="word-length">${countSyllables(word)} syl</span>
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
    showToast(`${words.length} rhymes copied!`)
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
