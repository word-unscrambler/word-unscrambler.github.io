// Word Unscrambler App

// State
let wordList = []
let debounceTimer = null
const isLoading = false

// DOM Elements
const scrambledInput = document.getElementById("scrambledInput")
const clearBtn = document.getElementById("clearBtn")
const unscrambleBtn = document.getElementById("unscrambleBtn")
const lengthFilter = document.getElementById("lengthFilter")
const containsFilter = document.getElementById("containsFilter")
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
const subscribeForm = document.getElementById("subscribeForm")

// Initialize
async function init() {
  await loadWordList()
  setupEventListeners()
  initTheme()
}

// Load word list from file
async function loadWordList() {
  try {
    const response = await fetch("/public/words.txt")
    if (response.ok) {
      const text = await response.text()
      wordList = text.split("\n").map(word => word.trim().toLowerCase()).filter(word => word.length > 0)
    } else {
      console.error("Failed to load word list:", response.statusText)
    }
  } catch (error) {
    console.error("Error loading word list:", error)
  }
}

// Utility function to get character frequency map
function getCharFrequency(word) {
  const freq = {}
  for (const char of word) {
    freq[char] = (freq[char] || 0) + 1
  }
  return freq
}

// Core Unscrambling Logic
function unscrambleWords() {
  const scrambled = scrambledInput.value.toLowerCase().replace(/[^a-z]/g, '')
  const minLength = parseInt(lengthFilter.value) || 2
  const requiredLetters = containsFilter.value.toLowerCase().replace(/[^a-z]/g, '')

  if (!scrambled) {
    showEmptyState()
    return
  }

  // Show loading indicator
  loading.classList.remove("hidden")
  unscrambleBtn.disabled = true

  // Debounce the heavy computation
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const scrambledFreq = getCharFrequency(scrambled)
    const requiredFreq = getCharFrequency(requiredLetters)

    let allResults = []

    for (const word of wordList) {
      // 1. Check minimum length
      if (word.length < minLength || word.length > scrambled.length) {
        continue
      }

      // 2. Check required letters
      if (requiredLetters.length > 0) {
        let passesRequired = true
        const wordFreq = getCharFrequency(word)

        for (const [char, count] of Object.entries(requiredFreq)) {
          if ((wordFreq[char] || 0) < count) {
            passesRequired = false
            break
          }
        }
        if (!passesRequired) {
          continue
        }
      }

      // 3. Check if word can be formed from scrambled letters
      const wordFreq = getCharFrequency(word)
      let canForm = true
      for (const [char, count] of Object.entries(wordFreq)) {
        if ((scrambledFreq[char] || 0) < count) {
          canForm = false
          break
        }
      }

      if (canForm) {
        allResults.push(word)
      }
    }

    renderResults(allResults)

    // Hide loading indicator
    loading.classList.add("hidden")
    unscrambleBtn.disabled = false
  }, 300)
}

// Render Results
function renderResults(results) {
  resultsGrid.innerHTML = ''
  
  if (results.length === 0) {
    showNoResults()
    return
  }
  
  // Group words by length
  const groupedResults = results.reduce((acc, word) => {
    const len = word.length
    if (!acc[len]) {
      acc[len] = []
    }
    acc[len].push(word)
    return acc
  }, {})

  // Sort lengths descending
  const sortedLengths = Object.keys(groupedResults).sort((a, b) => b - a)

  sortedLengths.forEach(len => {
    const words = groupedResults[len]
    words.sort() // Sort words alphabetically within each group

    const groupDiv = document.createElement('div')
    groupDiv.classList.add('word-group')
    
    const title = document.createElement('h4')
    title.textContent = `${len} Letters`
    groupDiv.appendChild(title)
    
    const list = document.createElement('ul')
    words.forEach(word => {
      const listItem = document.createElement('li')
      listItem.textContent = word
      list.appendChild(listItem)
    })
    groupDiv.appendChild(list)
    resultsGrid.appendChild(groupDiv)
  })

  // Update count and show container
  resultsCount.textContent = results.length
  showResults()
}

// Event Handlers
function handleInput() {
    // Force lowercase and remove non-alphabetic characters
    let value = scrambledInput.value.toLowerCase().replace(/[^a-z]/g, '')
    scrambledInput.value = value
    unscrambleWords()
}

function handleClear() {
  scrambledInput.value = ''
  lengthFilter.value = 2
  containsFilter.value = ''
  showEmptyState()
}

function handleCopyAll() {
    const words = Array.from(resultsGrid.querySelectorAll('li')).map(li => li.textContent);
    if (words.length > 0) {
        const textToCopy = words.join('\n');
        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast("Copied all words to clipboard!")
        }).catch(err => {
            console.error('Could not copy text: ', err)
        });
    }
}

// Setup Listeners
function setupEventListeners() {
  scrambledInput.addEventListener("input", handleInput)
  clearBtn.addEventListener("click", handleClear)
  unscrambleBtn.addEventListener("click", unscrambleWords)
  lengthFilter.addEventListener("input", unscrambleWords)
  containsFilter.addEventListener("input", unscrambleWords)
  copyAllBtn.addEventListener("click", handleCopyAll)
  themeToggle.addEventListener("click", toggleTheme)
  mobileMenuToggle.addEventListener("click", toggleMobileMenu)
  subscribeForm.addEventListener("submit", handleSubscribe)
}

// State Management
function showResults() {
  resultsContainer.classList.add("active")
  emptyState.classList.add("hidden")
  noResults.classList.add("hidden")
}

function showEmptyState() {
  resultsContainer.classList.remove("active")
  emptyState.classList.remove("hidden")
  noResults.classList.add("hidden")
  allResults = []
}

function showNoResults() {
  resultsContainer.classList.remove("active")
  emptyState.classList.add("hidden")
  noResults.classList.remove("hidden")
}

// Toast notification
function showToast(message) {
  toastMessage.textContent = message
  toast.classList.add("active")

  setTimeout(() => {
    toast.classList.remove("active")
  }, 3000)
}

// Theme handling
function initTheme() {
  const savedTheme = localStorage.getItem("theme")
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme)
  } else if (prefersDark) {
    document.documentElement.setAttribute("data-theme", "dark")
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  document.documentElement.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
}

// Mobile menu
function toggleMobileMenu() {
  mobileNav.classList.toggle("active")
}

// Subscribe form (Placeholder/Demonstration)
function handleSubscribe(e) {
  e.preventDefault()
  const email = e.target.querySelector('input[type="email"]').value
  
  // In a real application, you would send the email to a server
  console.log(`Subscribing with email: ${email}`)
  showToast(`Thank you for subscribing, ${email.split('@')[0]}!`)
  e.target.reset()
}

// Start the application
init()
