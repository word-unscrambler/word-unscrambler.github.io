// Anagram Solver App

class AnagramSolver {
    constructor() {
        this.wordList = [];
        this.commonWords = new Set();
        this.debounceTimer = null;
        
        // DOM Elements
        this.anagramInput = document.getElementById('anagramInput');
        this.clearBtn = document.getElementById('clearBtn');
        this.solveBtn = document.getElementById('solveBtn');
        this.minLength = document.getElementById('minLength');
        this.maxLength = document.getElementById('maxLength');
        this.sortBy = document.getElementById('sortBy');
        this.patternInput = document.getElementById('patternInput');
        this.advancedToggle = document.getElementById('advancedToggle');
        this.advancedContent = document.getElementById('advancedContent');
        this.loadingAnagrams = document.getElementById('loadingAnagrams');
        this.anagramResults = document.getElementById('anagramResults');
        this.noAnagrams = document.getElementById('noAnagrams');
        this.inputLetters = document.getElementById('inputLetters');
        this.anagramsFound = document.getElementById('anagramsFound');
        this.uniqueLetters = document.getElementById('uniqueLetters');
        this.longestWord = document.getElementById('longestWord');
        this.anagramStats = document.getElementById('anagramStats');
        this.exampleButtons = document.querySelectorAll('.example-btn');
        this.themeToggle = document.getElementById('themeToggle');
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.mobileNav = document.getElementById('mobileNav');
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toastMessage');
        
        this.init();
    }
    
    async init() {
        await this.loadWordList();
        await this.loadCommonWords();
        this.setupEventListeners();
        this.initTheme();
        this.updateExample();
    }
    
    async loadWordList() {
        try {
            const response = await fetch('/public/words.txt');
            if (response.ok) {
                const text = await response.text();
                this.wordList = text
                    .split('\n')
                    .map(word => word.trim().toLowerCase())
                    .filter(word => word.length >= 2 && word.length <= 15 && /^[a-z]+$/.test(word));
                
                // If no words loaded, use default words
                if (this.wordList.length === 0) {
                    this.wordList = this.getDefaultWordList();
                }
            } else {
                this.wordList = this.getDefaultWordList();
            }
        } catch (error) {
            console.error('Error loading word list:', error);
            this.wordList = this.getDefaultWordList();
        }
    }
    
    async loadCommonWords() {
        // Common English words for highlighting
        this.commonWords = new Set([
            'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
            'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
            'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
            'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
            'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
            'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
            'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
            'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
            'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
            'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
        ]);
    }
    
    getDefaultWordList() {
        return [
            'cat', 'act', 'car', 'arc', 'rat', 'tar', 'art',
            'dog', 'god', 'ate', 'eat', 'tea', 'eta',
            'tap', 'pat', 'apt', 'top', 'pot', 'opt',
            'stop', 'tops', 'pots', 'opts', 'spot', 'post',
            'listen', 'silent', 'enlist', 'tinsel',
            'triangle', 'integrals', 'relating', 'altering',
            'dictionary', 'indicatory',
            'earth', 'heart', 'hater', 'rathe', 'hearts',
            'stone', 'notes', 'onset', 'tones',
            'share', 'shear', 'hears', 'rheas',
            'angel', 'angle', 'glean', 'genal',
            'fried', 'fired', 'redif', 'rider',
            'pears', 'parse', 'spare', 'spear', 'reaps',
            'leapt', 'petal', 'plate', 'pleat', 'tepal',
            'cares', 'races', 'scare', 'acres', 'carse'
        ];
    }
    
    setupEventListeners() {
        // Input handling with debounce
        this.anagramInput.addEventListener('input', () => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => this.solveAnagrams(), 300);
        });
        
        this.anagramInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                clearTimeout(this.debounceTimer);
                this.solveAnagrams();
            }
        });
        
        this.clearBtn.addEventListener('click', () => {
            this.anagramInput.value = '';
            this.resetUI();
        });
        
        this.solveBtn.addEventListener('click', () => this.solveAnagrams());
        
        // Filter changes
        this.minLength.addEventListener('change', () => this.solveAnagrams());
        this.maxLength.addEventListener('change', () => this.solveAnagrams());
        this.sortBy.addEventListener('change', () => this.solveAnagrams());
        this.patternInput.addEventListener('input', () => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => this.solveAnagrams(), 300);
        });
        
        // Advanced options toggle
        this.advancedToggle.addEventListener('click', () => {
            const isExpanded = this.advancedContent.classList.contains('active');
            this.advancedContent.classList.toggle('active');
            
            const icon = this.advancedToggle.querySelector('svg');
            icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
        });
        
        // Example buttons
        this.exampleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const letters = btn.dataset.letters;
                this.anagramInput.value = letters;
                this.solveAnagrams();
            });
        });
        
        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Mobile menu toggle
        this.mobileMenuToggle.addEventListener('click', () => {
            this.mobileNav.classList.toggle('active');
        });
    }
    
    solveAnagrams() {
        const letters = this.anagramInput.value
            .trim()
            .toLowerCase()
            .replace(/[^a-z?]/g, '');
        
        if (!letters) {
            this.resetUI();
            return;
        }
        
        this.showLoading();
        
        // Use setTimeout to ensure UI updates before heavy computation
        setTimeout(() => {
            const results = this.findAnagrams(letters);
            this.displayResults(results, letters);
        }, 50);
    }
    
    findAnagrams(letters) {
        const minLength = parseInt(this.minLength.value);
        const maxLength = parseInt(this.maxLength.value);
        const pattern = this.patternInput.value.toLowerCase().trim();
        const usePattern = pattern.length > 0;
        
        // Prepare letter counts
        const letterCounts = {};
        const lettersWithoutWildcards = letters.replace(/\?/g, '');
        
        for (const char of lettersWithoutWildcards) {
            letterCounts[char] = (letterCounts[char] || 0) + 1;
        }
        
        const wildcardCount = (letters.match(/\?/g) || []).length;
        
        // Find matching words
        const matches = [];
        
        for (const word of this.wordList) {
            // Check length constraints
            if (word.length < minLength || word.length > maxLength) continue;
            
            // Check pattern if specified
            if (usePattern && word.length === pattern.length) {
                let patternMatch = true;
                for (let i = 0; i < pattern.length; i++) {
                    if (pattern[i] !== '?' && pattern[i] !== word[i]) {
                        patternMatch = false;
                        break;
                    }
                }
                if (!patternMatch) continue;
            }
            
            // Check if word can be formed from letters
            const wordLetterCounts = {};
            for (const char of word) {
                wordLetterCounts[char] = (wordLetterCounts[char] || 0) + 1;
            }
            
            let canForm = true;
            let usedWildcards = 0;
            
            for (const [char, count] of Object.entries(wordLetterCounts)) {
                const available = (letterCounts[char] || 0);
                if (count > available) {
                    const needed = count - available;
                    if (usedWildcards + needed <= wildcardCount) {
                        usedWildcards += needed;
                    } else {
                        canForm = false;
                        break;
                    }
                }
            }
            
            if (canForm) {
                matches.push(word);
            }
        }
        
        // Sort results
        return this.sortResults(matches);
    }
    
    sortResults(results) {
        const sortMethod = this.sortBy.value;
        
        switch (sortMethod) {
            case 'length':
                // Sort by length (descending), then alphabetical
                return results.sort((a, b) => {
                    if (b.length !== a.length) return b.length - a.length;
                    return a.localeCompare(b);
                });
                
            case 'alphabetical':
                // Sort alphabetically
                return results.sort((a, b) => a.localeCompare(b));
                
            case 'common':
                // Sort by common words first, then length
                return results.sort((a, b) => {
                    const aIsCommon = this.commonWords.has(a);
                    const bIsCommon = this.commonWords.has(b);
                    
                    if (aIsCommon && !bIsCommon) return -1;
                    if (!aIsCommon && bIsCommon) return 1;
                    
                    // If both common or both uncommon, sort by length
                    if (b.length !== a.length) return b.length - a.length;
                    return a.localeCompare(b);
                });
                
            default:
                return results;
        }
    }
    
    displayResults(results, originalLetters) {
        this.hideLoading();
        
        if (results.length === 0) {
            this.anagramResults.innerHTML = '';
            this.noAnagrams.classList.remove('hidden');
            this.updateStats([], originalLetters);
            return;
        }
        
        this.noAnagrams.classList.add('hidden');
        
        // Group results by length
        const groupedResults = {};
        results.forEach(word => {
            const length = word.length;
            if (!groupedResults[length]) {
                groupedResults[length] = [];
            }
            groupedResults[length].push(word);
        });
        
        // Update stats
        this.updateStats(results, originalLetters);
        
        // Sort groups by length (descending)
        const sortedLengths = Object.keys(groupedResults).sort((a, b) => b - a);
        
        // Generate HTML
        let html = '';
        
        sortedLengths.forEach(length => {
            const words = groupedResults[length];
            const isCompleteAnagram = length === originalLetters.replace(/\?/g, '').length;
            
            html += `
                <div class="anagram-group">
                    <div class="group-title">
                        ${length}-letter words ${isCompleteAnagram ? '⭐' : ''}
                        <span style="font-size: 12px; color: var(--text-muted); margin-left: 8px;">
                            (${words.length})
                        </span>
                    </div>
                    <ul class="anagram-list">
                        ${words.map(word => `
                            <li class="anagram-item ${this.commonWords.has(word) ? 'highlight' : ''}"
                                data-word="${word}"
                                title="${this.commonWords.has(word) ? 'Common word' : ''}">
                                ${word}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        });
        
        this.anagramResults.innerHTML = html;
        this.anagramsFound.textContent = results.length;
        
        // Add click handlers to copy words
        this.anagramResults.querySelectorAll('.anagram-item').forEach(item => {
            item.addEventListener('click', () => this.copyWord(item.dataset.word));
        });
    }
    
    updateStats(results, originalLetters) {
        const letters = originalLetters.replace(/\?/g, '');
        
        // Update basic stats
        this.inputLetters.textContent = letters.length;
        
        const uniqueLetters = new Set(letters.split('')).size;
        this.uniqueLetters.textContent = uniqueLetters;
        
        // Find longest word
        const longest = results.length > 0 
            ? results.reduce((a, b) => a.length > b.length ? a : b)
            : '-';
        this.longestWord.textContent = longest;
        
        // Generate detailed stats
        if (results.length > 0) {
            const stats = this.calculateStats(results);
            this.displayDetailedStats(stats);
        } else {
            this.anagramStats.innerHTML = '';
        }
    }
    
    calculateStats(results) {
        const stats = {
            total: results.length,
            byLength: {},
            commonWords: 0,
            averageLength: 0,
            completeAnagrams: 0
        };
        
        let totalLength = 0;
        
        results.forEach(word => {
            // Count by length
            const length = word.length;
            stats.byLength[length] = (stats.byLength[length] || 0) + 1;
            
            // Count common words
            if (this.commonWords.has(word)) {
                stats.commonWords++;
            }
            
            totalLength += length;
        });
        
        stats.averageLength = totalLength / results.length;
        
        // Sort lengths by count
        stats.sortedLengths = Object.entries(stats.byLength)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3); // Top 3 lengths
        
        return stats;
    }
    
    displayDetailedStats(stats) {
        let html = `
            <div class="stat-item">
                <div class="stat-icon">📊</div>
                <div class="stat-text">
                    <span class="stat-number">${stats.total}</span> words found
                </div>
            </div>
            
            <div class="stat-item">
                <div class="stat-icon">📏</div>
                <div class="stat-text">
                    Avg length: <span class="stat-number">${stats.averageLength.toFixed(1)}</span>
                </div>
            </div>
            
            <div class="stat-item">
                <div class="stat-icon">⭐</div>
                <div class="stat-text">
                    <span class="stat-number">${stats.commonWords}</span> common words
                </div>
            </div>
        `;
        
        // Add top lengths
        if (stats.sortedLengths.length > 0) {
            html += `
                <div class="stat-item">
                    <div class="stat-icon">🔢</div>
                    <div class="stat-text">
                        Top lengths: ${stats.sortedLengths.map(([len, count]) => 
                            `<span class="stat-number">${len}</span> (${count})`
                        ).join(', ')}
                    </div>
                </div>
            `;
        }
        
        this.anagramStats.innerHTML = html;
    }
    
    async copyWord(word) {
        try {
            await navigator.clipboard.writeText(word);
            this.showToast(`"${word}" copied to clipboard!`);
        } catch (err) {
            this.showToast('Failed to copy word');
        }
    }
    
    showLoading() {
        this.loadingAnagrams.classList.add('active');
        this.anagramResults.innerHTML = '';
        this.noAnagrams.classList.add('hidden');
    }
    
    hideLoading() {
        this.loadingAnagrams.classList.remove('active');
    }
    
    resetUI() {
        this.anagramResults.innerHTML = '';
        this.noAnagrams.classList.add('hidden');
        this.inputLetters.textContent = '0';
        this.anagramsFound.textContent = '0';
        this.uniqueLetters.textContent = '0';
        this.longestWord.textContent = '-';
        this.anagramStats.innerHTML = '';
    }
    
    showToast(message) {
        this.toastMessage.textContent = message;
        this.toast.classList.add('active');
        
        setTimeout(() => {
            this.toast.classList.remove('active');
        }, 3000);
    }
    
    updateExample() {
        // Update example buttons with random anagrams
        this.exampleButtons.forEach(btn => {
            const letters = btn.dataset.letters;
            const anagrams = this.findAnagrams(letters).slice(0, 3);
            
            if (anagrams.length > 0) {
                const exampleWord = btn.querySelector('.example-word');
                if (exampleWord) {
                    // Show one of the found anagrams as example
                    const randomAnagram = anagrams[Math.floor(Math.random() * anagrams.length)];
                    exampleWord.textContent = randomAnagram;
                }
            }
        });
    }
    
    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const app = new AnagramSolver();
});
