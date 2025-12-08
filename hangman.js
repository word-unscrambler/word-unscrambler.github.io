// Hangman Game

class HangmanGame {
    constructor() {
        this.wordList = [];
        this.currentWord = '';
        this.guessedLetters = new Set();
        this.wrongGuesses = 0;
        this.maxWrongGuesses = 6;
        this.gameActive = false;
        this.gameWon = false;
        this.gameLost = false;
        this.hintsUsed = 0;
        this.maxHints = 2;
        this.wordsPlayed = 0;
        this.wordsSolved = 0;
        this.currentCategory = 'all';
        
        // DOM Elements
        this.wordDisplay = document.getElementById('wordDisplay');
        this.keyboard = document.getElementById('keyboard');
        this.wrongGuessesEl = document.getElementById('wrongGuesses');
        this.remainingLettersEl = document.getElementById('remainingLetters');
        this.wordsPlayedEl = document.getElementById('wordsPlayed');
        this.wordsSolvedEl = document.getElementById('wordsSolved');
        this.gameMessage = document.getElementById('gameMessage');
        this.messageText = document.getElementById('messageText');
        this.correctWord = document.getElementById('correctWord');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.hintBtn = document.getElementById('hintBtn');
        this.hintText = document.getElementById('hintText');
        this.wordCategory = document.getElementById('wordCategory');
        
        // Hangman parts
        this.hangmanParts = [
            document.getElementById('hangmanHead'),
            document.getElementById('hangmanBody'),
            document.getElementById('hangmanLeftArm'),
            document.getElementById('hangmanRightArm'),
            document.getElementById('hangmanLeftLeg'),
            document.getElementById('hangmanRightLeg')
        ];
        
        // Category buttons
        this.categoryButtons = document.querySelectorAll('.category-btn');
        
        this.init();
    }
    
    async init() {
        await this.loadWordList();
        this.setupEventListeners();
        this.createKeyboard();
        this.startNewGame();
        this.initTheme();
        this.updateStats();
    }
    
    async loadWordList() {
        try {
            const response = await fetch('/public/words.txt');
            if (response.ok) {
                const text = await response.text();
                this.wordList = text
                    .split('\n')
                    .map(word => word.trim().toLowerCase())
                    .filter(word => word.length >= 3 && word.length <= 12 && /^[a-z]+$/.test(word));
                
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
    
    getDefaultWordList() {
        return [
            'hangman', 'javascript', 'programming', 'computer', 'keyboard',
            'monitor', 'internet', 'website', 'browser', 'developer',
            'algorithm', 'database', 'function', 'variable', 'constant',
            'syntax', 'framework', 'library', 'interface', 'network',
            'security', 'encryption', 'authentication', 'validation',
            'iteration', 'recursion', 'abstraction', 'polymorphism',
            'inheritance', 'encapsulation', 'debugging', 'compilation',
            'execution', 'deployment', 'maintenance', 'documentation',
            'optimization', 'configuration', 'implementation', 'integration'
        ].map(word => word.toLowerCase());
    }
    
    setupEventListeners() {
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.hintBtn.addEventListener('click', () => this.giveHint());
        
        // Category buttons
        this.categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.categoryButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCategory = btn.dataset.category;
                this.wordCategory.textContent = `Category: ${btn.textContent}`;
                this.startNewGame();
            });
        });
        
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', this.toggleTheme);
        
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');
        mobileMenuToggle.addEventListener('click', () => mobileNav.classList.toggle('active'));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (!this.gameActive || this.gameWon || this.gameLost) return;
            
            const key = e.key.toLowerCase();
            if (key >= 'a' && key <= 'z') {
                this.guessLetter(key);
            } else if (key === 'enter') {
                this.startNewGame();
            } else if (key === 'h' && !e.ctrlKey) {
                this.giveHint();
            }
        });
    }
    
    createKeyboard() {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        this.keyboard.innerHTML = '';
        
        for (let letter of letters) {
            const button = document.createElement('button');
            button.className = 'letter-btn';
            button.textContent = letter;
            button.dataset.letter = letter;
            button.addEventListener('click', () => this.guessLetter(letter));
            this.keyboard.appendChild(button);
        }
    }
    
    getFilteredWordList() {
        switch (this.currentCategory) {
            case 'easy':
                return this.wordList.filter(word => word.length >= 3 && word.length <= 5);
            case 'medium':
                return this.wordList.filter(word => word.length >= 6 && word.length <= 8);
            case 'hard':
                return this.wordList.filter(word => word.length >= 9);
            default:
                return this.wordList;
        }
    }
    
    getRandomWord() {
        const filteredList = this.getFilteredWordList();
        if (filteredList.length === 0) return this.wordList[Math.floor(Math.random() * this.wordList.length)];
        return filteredList[Math.floor(Math.random() * filteredList.length)];
    }
    
    startNewGame() {
        this.currentWord = this.getRandomWord();
        this.guessedLetters.clear();
        this.wrongGuesses = 0;
        this.gameActive = true;
        this.gameWon = false;
        this.gameLost = false;
        this.hintsUsed = 0;
        
        // Reset hangman figure
        this.hangmanParts.forEach(part => part.style.display = 'none');
        
        // Reset UI
        this.gameMessage.className = 'game-message';
        this.updateWordDisplay();
        this.updateKeyboard();
        this.updateHangman();
        this.updateStats();
        this.hintText.textContent = '';
        this.hintBtn.disabled = false;
        
        // Update game stats
        this.wordsPlayed++;
        this.wordsPlayedEl.textContent = this.wordsPlayed;
        
        // Log for debugging (can be removed)
        console.log('New word:', this.currentWord);
    }
    
    updateWordDisplay() {
        this.wordDisplay.innerHTML = '';
        
        for (let letter of this.currentWord) {
            const span = document.createElement('span');
            span.className = 'letter-slot';
            
            if (this.guessedLetters.has(letter) || this.gameLost) {
                span.textContent = letter;
                span.classList.add('revealed');
            } else {
                span.textContent = '_';
            }
            
            this.wordDisplay.appendChild(span);
        }
        
        // Check if all letters have been guessed
        const allLettersGuessed = [...this.currentWord].every(letter => 
            this.guessedLetters.has(letter)
        );
        
        if (allLettersGuessed && this.gameActive) {
            this.winGame();
        }
    }
    
    updateKeyboard() {
        const buttons = this.keyboard.querySelectorAll('.letter-btn');
        buttons.forEach(button => {
            const letter = button.dataset.letter;
            
            if (this.guessedLetters.has(letter)) {
                if (this.currentWord.includes(letter)) {
                    button.className = 'letter-btn correct';
                } else {
                    button.className = 'letter-btn incorrect';
                }
                button.disabled = true;
            } else {
                button.className = 'letter-btn';
                button.disabled = !this.gameActive || this.gameWon || this.gameLost;
            }
        });
        
        // Update remaining letters count
        const remaining = 26 - this.guessedLetters.size;
        this.remainingLettersEl.textContent = remaining;
    }
    
    updateHangman() {
        this.wrongGuessesEl.textContent = this.wrongGuesses;
        
        // Show hangman parts based on wrong guesses
        for (let i = 0; i < this.wrongGuesses; i++) {
            if (i < this.hangmanParts.length) {
                this.hangmanParts[i].style.display = 'block';
            }
        }
        
        // Check if game is lost
        if (this.wrongGuesses >= this.maxWrongGuesses && this.gameActive) {
            this.loseGame();
        }
    }
    
    updateStats() {
        this.wrongGuessesEl.textContent = this.wrongGuesses;
        this.remainingLettersEl.textContent = 26 - this.guessedLetters.size;
        this.wordsPlayedEl.textContent = this.wordsPlayed;
        this.wordsSolvedEl.textContent = this.wordsSolved;
    }
    
    guessLetter(letter) {
        if (!this.gameActive || this.gameWon || this.gameLost) return;
        if (this.guessedLetters.has(letter)) return;
        
        this.guessedLetters.add(letter);
        
        if (this.currentWord.includes(letter)) {
            // Correct guess
            this.updateWordDisplay();
        } else {
            // Wrong guess
            this.wrongGuesses++;
            this.updateHangman();
        }
        
        this.updateKeyboard();
    }
    
    giveHint() {
        if (!this.gameActive || this.gameWon || this.gameLost) return;
        if (this.hintsUsed >= this.maxHints) return;
        
        // Find a letter in the word that hasn't been guessed yet
        const unguessedLetters = [...this.currentWord].filter(letter => 
            !this.guessedLetters.has(letter)
        );
        
        if (unguessedLetters.length === 0) return;
        
        // Pick a random unguessed letter
        const hintLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
        this.guessLetter(hintLetter);
        
        this.hintsUsed++;
        this.hintText.textContent = `Hint used! ${this.maxHints - this.hintsUsed} hint(s) remaining.`;
        
        // Disable hint button if no hints left
        if (this.hintsUsed >= this.maxHints) {
            this.hintBtn.disabled = true;
        }
    }
    
    winGame() {
        this.gameActive = false;
        this.gameWon = true;
        this.wordsSolved++;
        
        this.messageText.textContent = 'Congratulations! You won!';
        this.correctWord.textContent = this.currentWord;
        this.gameMessage.className = 'game-message win';
        
        // Celebrate with a small animation
        this.celebrateWin();
        
        this.updateStats();
    }
    
    loseGame() {
        this.gameActive = false;
        this.gameLost = true;
        
        this.messageText.textContent = 'Game Over! You lost.';
        this.correctWord.textContent = this.currentWord;
        this.gameMessage.className = 'game-message lose';
        
        // Reveal all letters
        this.updateWordDisplay();
        this.updateKeyboard();
        
        this.updateStats();
    }
    
    celebrateWin() {
        const letters = this.wordDisplay.querySelectorAll('.letter-slot');
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.style.transform = 'scale(1.2)';
                letter.style.color = 'var(--highlight)';
                
                setTimeout(() => {
                    letter.style.transform = 'scale(1)';
                }, 200);
            }, index * 100);
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

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new HangmanGame();
});