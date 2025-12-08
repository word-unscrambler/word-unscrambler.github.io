// Thesaurus App

// Simple thesaurus data
const thesaurusData = {
  happy: {
    synonyms: ["joyful", "cheerful", "content", "delighted", "pleased", "glad", "elated", "merry"],
    antonyms: ["sad", "unhappy", "miserable", "depressed", "gloomy"],
  },
  sad: {
    synonyms: ["unhappy", "sorrowful", "melancholy", "gloomy", "depressed", "downcast", "dejected"],
    antonyms: ["happy", "joyful", "cheerful", "elated"],
  },
  big: {
    synonyms: ["large", "huge", "enormous", "massive", "giant", "vast", "immense", "grand"],
    antonyms: ["small", "tiny", "little", "miniature"],
  },
  small: {
    synonyms: ["tiny", "little", "miniature", "compact", "petite", "minute", "microscopic"],
    antonyms: ["big", "large", "huge", "enormous"],
  },
  fast: {
    synonyms: ["quick", "rapid", "swift", "speedy", "hasty", "brisk", "fleet"],
    antonyms: ["slow", "sluggish", "leisurely"],
  },
  slow: {
    synonyms: ["sluggish", "leisurely", "unhurried", "gradual", "lazy", "plodding"],
    antonyms: ["fast", "quick", "rapid", "swift"],
  },
  good: {
    synonyms: ["excellent", "great", "fine", "wonderful", "superb", "outstanding", "pleasant"],
    antonyms: ["bad", "poor", "terrible", "awful"],
  },
  bad: {
    synonyms: ["terrible", "awful", "poor", "dreadful", "horrible", "unpleasant", "inferior"],
    antonyms: ["good", "excellent", "great", "wonderful"],
  },
  beautiful: {
    synonyms: ["gorgeous", "stunning", "lovely", "attractive", "pretty", "elegant", "handsome"],
    antonyms: ["ugly", "unattractive", "hideous"],
  },
  ugly: {
    synonyms: ["unattractive", "hideous", "unsightly", "grotesque", "homely"],
    antonyms: ["beautiful", "gorgeous", "lovely", "attractive"],
  },
  smart: {
    synonyms: ["intelligent", "clever", "bright", "brilliant", "wise", "sharp", "astute"],
    antonyms: ["stupid", "dumb", "foolish", "ignorant"],
  },
  easy: {
    synonyms: ["simple", "effortless", "straightforward", "uncomplicated", "basic"],
    antonyms: ["hard", "difficult", "challenging", "complex"],
  },
  hard: {
    synonyms: ["difficult", "challenging", "tough", "demanding", "complex", "arduous"],
    antonyms: ["easy", "simple", "effortless"],
  },
  hot: {
    synonyms: ["warm", "heated", "burning", "scorching", "boiling", "fiery"],
    antonyms: ["cold", "cool", "freezing", "chilly"],
  },
  cold: { synonyms: ["cool", "chilly", "freezing", "icy", "frigid", "frosty"], antonyms: ["hot", "warm", "heated"] },
  new: {
    synonyms: ["fresh", "modern", "recent", "novel", "latest", "current"],
    antonyms: ["old", "ancient", "outdated", "vintage"],
  },
  old: {
    synonyms: ["ancient", "aged", "elderly", "vintage", "antique", "mature"],
    antonyms: ["new", "young", "fresh", "modern"],
  },
  strong: {
    synonyms: ["powerful", "mighty", "robust", "sturdy", "tough", "muscular"],
    antonyms: ["weak", "feeble", "frail"],
  },
  weak: {
    synonyms: ["feeble", "frail", "fragile", "delicate", "powerless"],
    antonyms: ["strong", "powerful", "mighty", "robust"],
  },
  love: {
    synonyms: ["adore", "cherish", "treasure", "worship", "idolize", "fancy"],
    antonyms: ["hate", "despise", "loathe", "detest"],
  },
  hate: {
    synonyms: ["despise", "loathe", "detest", "abhor", "dislike"],
    antonyms: ["love", "adore", "cherish", "like"],
  },
  rich: {
    synonyms: ["wealthy", "affluent", "prosperous", "loaded", "well-off"],
    antonyms: ["poor", "broke", "destitute", "impoverished"],
  },
  poor: {
    synonyms: ["destitute", "impoverished", "needy", "broke", "penniless"],
    antonyms: ["rich", "wealthy", "affluent", "prosperous"],
  },
  begin: {
    synonyms: ["start", "commence", "initiate", "launch", "open"],
    antonyms: ["end", "finish", "conclude", "stop"],
  },
  end: {
    synonyms: ["finish", "conclude", "terminate", "complete", "close"],
    antonyms: ["begin", "start", "commence", "open"],
  },
  bright: {
    synonyms: ["brilliant", "radiant", "luminous", "vivid", "shining", "gleaming"],
    antonyms: ["dark", "dim", "dull", "gloomy"],
  },
  dark: {
    synonyms: ["dim", "shadowy", "gloomy", "murky", "black", "unlit"],
    antonyms: ["bright", "light", "luminous", "radiant"],
  },
  clean: {
    synonyms: ["spotless", "tidy", "neat", "pure", "sanitary", "pristine"],
    antonyms: ["dirty", "filthy", "messy", "grimy"],
  },
  dirty: {
    synonyms: ["filthy", "grimy", "messy", "soiled", "unclean", "muddy"],
    antonyms: ["clean", "spotless", "tidy", "pure"],
  },
}

let debounceTimer = null

const wordInput = document.getElementById("wordInput")
const clearBtn = document.getElementById("clearBtn")
const findBtn = document.getElementById("findBtn")
const loading = document.getElementById("loading")
const resultsContainer = document.getElementById("resultsContainer")
const synonymsGrid = document.getElementById("synonymsGrid")
const antonymsGrid = document.getElementById("antonymsGrid")
const synonymsCount = document.getElementById("synonymsCount")
const antonymsCount = document.getElementById("antonymsCount")
const synonymsSection = document.getElementById("synonymsSection")
const antonymsSection = document.getElementById("antonymsSection")
const emptyState = document.getElementById("emptyState")
const noResults = document.getElementById("noResults")
const themeToggle = document.getElementById("themeToggle")
const mobileMenuToggle = document.getElementById("mobileMenuToggle")
const mobileNav = document.getElementById("mobileNav")
const toast = document.getElementById("toast")
const toastMessage = document.getElementById("toastMessage")

function init() {
  setupEventListeners()
  initTheme()
}

function setupEventListeners() {
  wordInput.addEventListener("input", () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(findSynonyms, 300)
  })

  wordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      clearTimeout(debounceTimer)
      findSynonyms()
    }
  })

  clearBtn.addEventListener("click", () => {
    wordInput.value = ""
    resetUI()
  })

  findBtn.addEventListener("click", findSynonyms)
  themeToggle.addEventListener("click", toggleTheme)
  mobileMenuToggle.addEventListener("click", () => mobileNav.classList.toggle("active"))
}

function findSynonyms() {
  const word = wordInput.value.trim().toLowerCase()

  if (!word) {
    resetUI()
    return
  }

  showLoading()

  setTimeout(() => {
    const results = thesaurusData[word]
    displayResults(results, word)
  }, 100)
}

function displayResults(results, word) {
  hideLoading()

  if (!results) {
    emptyState.classList.add("hidden")
    resultsContainer.classList.remove("active")
    noResults.classList.remove("hidden")
    return
  }

  emptyState.classList.add("hidden")
  noResults.classList.add("hidden")
  resultsContainer.classList.add("active")

  // Display synonyms
  const synonyms = results.synonyms || []
  synonymsCount.textContent = synonyms.length
  synonymsGrid.innerHTML = synonyms
    .map(
      (syn) => `
        <div class="word-card">
            <div class="word-info">
                <span class="word-text">${syn}</span>
            </div>
            <button class="copy-btn" data-word="${syn}" aria-label="Copy ${syn}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                </svg>
            </button>
        </div>
    `,
    )
    .join("")

  // Display antonyms
  const antonyms = results.antonyms || []
  antonymsCount.textContent = antonyms.length
  antonymsGrid.innerHTML = antonyms
    .map(
      (ant) => `
        <div class="word-card antonym-card">
            <div class="word-info">
                <span class="word-text">${ant}</span>
            </div>
            <button class="copy-btn" data-word="${ant}" aria-label="Copy ${ant}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                </svg>
            </button>
        </div>
    `,
    )
    .join("")

  // Show/hide sections
  synonymsSection.style.display = synonyms.length ? "block" : "none"
  antonymsSection.style.display = antonyms.length ? "block" : "none"

  // Add copy listeners
  document.querySelectorAll(".copy-btn").forEach((btn) => {
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
