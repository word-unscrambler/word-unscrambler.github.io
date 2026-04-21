// header.js
document.addEventListener('DOMContentLoaded', () => {
    const headerHTML = `
    <header class="header">
        <div class="container header-content">
            <a href="/" class="logo">
                <img src="/logo.png" alt="Word Unscrambler Logo" class="logo-icon-img" width="32" height="32">
                <span class="logo-text">UNSCRAMBLER</span>
            </a>
            <nav class="nav">
                <div class="nav-dropdown">
                    <button class="nav-link nav-dropdown-btn">
                        Tools
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="m6 9 6 6 6-6"/>
                        </svg>
                    </button>
                    <div class="nav-dropdown-content">
                        <a href="/">Word Unscrambler</a>
                        <a href="/crossword-solver">Crossword Solver</a>
                        <a href="/jumble-solver">Jumble Solver</a>
                        <a href="/rhyming-dictionary">Rhyming Dictionary</a>
                        <a href="/thesaurus">Thesaurus</a>
                        <a href="/word-search-solver">Word Search Solver</a>
                        <a href="/hangman">Hangman Game</a>
                        <a href="/anagram-solver">Anagram Solver</a>
                    </div>
                </div>                
                <a href="#features" class="nav-link">Features</a>
                <a href="#how-it-works" class="nav-link">How It Works</a>
                <a href="blog" class="nav-link">Blog</a>
                <a href="#about" class="nav-link">About</a>
            </nav>
            <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
                <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="4"></circle>
                    <path d="M12 2v2"></path>
                    <path d="M12 20v2"></path>
                    <path d="m4.93 4.93 1.41 1.41"></path>
                    <path d="m17.66 17.66 1.41 1.41"></path>
                    <path d="M2 12h2"></path>
                    <path d="M20 12h2"></path>
                    <path d="m6.34 17.66-1.41 1.41"></path>
                    <path d="m19.07 4.93-1.41 1.41"></path>
                </svg>
                <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                </svg>
            </button>
            <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle menu">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="4" x2="20" y1="12" y2="12"></line>
                    <line x1="4" x2="20" y1="6" y2="6"></line>
                    <line x1="4" x2="20" y1="18" y2="18"></line>
                </svg>
            </button>
        </div>
    </header>

    <nav class="mobile-nav" id="mobileNav">
        <span class="mobile-nav-section">Tools</span>
        <a href="/" class="mobile-nav-link">Word Unscrambler</a>
        <a href="/crossword-solver" class="mobile-nav-link">Crossword Solver</a>
        <a href="/jumble-solver" class="mobile-nav-link">Jumble Solver</a>
        <a href="/rhyming-dictionary" class="mobile-nav-link">Rhyming Dictionary</a>
        <a href="/thesaurus" class="mobile-nav-link">Thesaurus</a>
        <a href="/word-search-solver" class="mobile-nav-link">Word Search Solver</a>
        <a href="/hangman." class="mobile-nav-link">Hangman Game</a>
        <a href="/anagram-solver" class="mobile-nav-link">Anagram Solver</a>
        <span class="mobile-nav-section">Navigation</span>
        <a href="#features" class="mobile-nav-link">Features</a>
        <a href="#how-it-works" class="mobile-nav-link">How It Works</a>
        <a href="blog" class="mobile-nav-link">Blog</a>
        <a href="#about" class="mobile-nav-link">About</a>
    </nav>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);
});
