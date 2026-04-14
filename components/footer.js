// footer.js
document.addEventListener('DOMContentLoaded', () => {
    const footerHTML = `
    <footer class="footer" id="about">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-widget">
                    <h4 class="widget-title">About</h4>
                    <p class="widget-text">Word Unscrambler is a free, fast, and powerful tool to help you find all possible English words from scrambled letters. Perfect for word games, puzzles, and expanding your vocabulary.</p>
                    <div class="social-links">
                        <a href="https://github.com/word-unscrambler/word-unscrambler.github.io.git" class="social-link" aria-label="GitHub">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                                <path d="M9 18c-4.51 2-5-2-7-2"></path>
                            </svg>
                        </a>
                    </div>
                </div>

                <div class="footer-widget">
                    <h4 class="widget-title">Tools</h4>
                    <ul class="widget-links">
                        <li><a href="/">Word Unscrambler</a></li>
                        <li><a href="/crossword-solver">Crossword Solver</a></li>
                        <li><a href="/jumble-solver">Jumble Solver</a></li>
                        <li><a href="/rhyming-dictionary">Rhyming Dictionary</a></li>
                        <li><a href="/thesaurus">Thesaurus</a></li>
                        <li><a href="/word-search-solver">Word Search Solver</a></li>
                        <li><a href="/hangman">Hangman Game</a></li>
                        <li><a href="/anagram-solver">Anagram Solver</a></li>
                    </ul>
                </div>

                <div class="footer-widget">
                    <h4 class="widget-title">Pages</h4>
                    <ul class="widget-links">
                        <li><a href="/about">About</a></li>
                        <li><a href="/privacy-policy">Privacy Policy</a></li>
                        <li><a href="/terms-of-service">Terms of Service</a></li>
                        <li><a href="/contact">Contact</a></li>
                        <li><a href="/blog">Blog</a></li>
                    </ul>
                </div>

                <div class="footer-widget">
                    <h4 class="widget-title">Subscribe</h4>
                    <p class="widget-text">Get updates on new features and word lists.</p>
                    <form class="subscribe-form" id="subscribeForm">
                        <input type="email" placeholder="Enter your email" class="subscribe-input" required>
                        <button type="submit" class="subscribe-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>

            <div class="footer-bottom">
                <div class="footer-logo">
                    <img src="/logo.png" alt="Word Unscrambler Logo" class="logo-icon-img" width="32" height="32">
                    <span>UNSCRAMBLER</span>
                </div>
                <p class="copyright">&copy; ${new Date().getFullYear()} Word Unscrambler. All rights reserved.</p>
            </div>
        </div>
    </footer>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
});
