(function(){
            "use strict";

            // ----- ELEMENTS -----
            const gridInput = document.getElementById("gridInput");
            const wordsInput = document.getElementById("wordsInput");
            const solveBtn = document.getElementById("solveBtn");
            const loading = document.getElementById("loading");
            const resultsContainer = document.getElementById("resultsContainer");
            const resultsCount = document.getElementById("resultsCount");
            const resultsGrid = document.getElementById("resultsGrid");
            const emptyState = document.getElementById("emptyState");
            const noResults = document.getElementById("noResults");
            const themeToggle = document.getElementById("themeToggle");
            const mobileMenuToggle = document.getElementById("mobileMenuToggle");
            const mobileNav = document.getElementById("mobileNav");
            const toast = document.getElementById("toast");
            const toastMessage = document.getElementById("toastMessage");

            // ----- DIRECTIONS (8-way) -----
            const directions = [
                { name: "Right", dr: 0, dc: 1 },
                { name: "Left", dr: 0, dc: -1 },
                { name: "Down", dr: 1, dc: 0 },
                { name: "Up", dr: -1, dc: 0 },
                { name: "Down-Right", dr: 1, dc: 1 },
                { name: "Down-Left", dr: 1, dc: -1 },
                { name: "Up-Right", dr: -1, dc: 1 },
                { name: "Up-Left", dr: -1, dc: -1 }
            ];

            // ----- UTILS: Toast, theme, mobile menu (safe checks)-----
            function showToast(msg) {
                if (!toast || !toastMessage) return;
                toastMessage.textContent = msg;
                toast.classList.add("active");
                setTimeout(() => toast.classList.remove("active"), 2800);
            }

            function initTheme() {
                const saved = localStorage.getItem("theme");
                if (saved) document.documentElement.setAttribute("data-theme", saved);
                else if (window.matchMedia("(prefers-color-scheme: dark)").matches) 
                    document.documentElement.setAttribute("data-theme", "dark");
            }
            function toggleTheme() {
                const current = document.documentElement.getAttribute("data-theme");
                const next = current === "dark" ? "light" : "dark";
                document.documentElement.setAttribute("data-theme", next);
                localStorage.setItem("theme", next);
            }

            // ----- SOLVER CORE -----
            function parseGrid(text) {
                return text.split('\n')
                    .map(row => row.trim().toUpperCase().replace(/\s/g, ''))
                    .filter(row => row.length > 0)
                    .map(row => row.split(''));
            }

            function checkDirection(grid, word, startR, startC, dr, dc) {
                const rows = grid.length;
                const cols = rows ? grid[0].length : 0;
                for (let i = 0; i < word.length; i++) {
                    const r = startR + i * dr;
                    const c = startC + i * dc;
                    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
                    if (grid[r][c] !== word[i]) return false;
                }
                return true;
            }

            function findWord(grid, word) {
                const rows = grid.length;
                if (!rows) return null;
                const cols = grid[0].length;
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        if (grid[r][c] === word[0]) {
                            for (let dir of directions) {
                                if (checkDirection(grid, word, r, c, dir.dr, dir.dc)) {
                                    return {
                                        word: word,
                                        startRow: r + 1,
                                        startCol: c + 1,
                                        direction: dir.name,
                                        endRow: r + (word.length - 1) * dir.dr + 1,
                                        endCol: c + (word.length - 1) * dir.dc + 1
                                    };
                                }
                            }
                        }
                    }
                }
                return null;
            }

            function findWords(grid, wordList) {
                return wordList.map(w => findWord(grid, w)).filter(res => res !== null);
            }

            // ----- DISPLAY -----
            function displayResults(foundWords) {
                hideLoading();
                if (!foundWords.length) {
                    emptyState.classList.add("hidden");
                    resultsContainer.classList.remove("active");
                    noResults.classList.remove("hidden");
                    return;
                }
                emptyState.classList.add("hidden");
                noResults.classList.add("hidden");
                resultsContainer.classList.add("active");
                resultsCount.textContent = foundWords.length;

                resultsGrid.innerHTML = foundWords.map(result => `
                    <div class="word-card">
                        <span class="word-text">${result.word}</span>
                        <span class="word-location">Row ${result.startRow}, Col ${result.startCol} → ${result.direction}</span>
                    </div>
                `).join('');
            }

            function showLoading() {
                loading.classList.add("active");
                resultsContainer.classList.remove("active");
                emptyState.classList.add("hidden");
                noResults.classList.add("hidden");
            }
            function hideLoading() {
                loading.classList.remove("active");
            }

            // ----- SOLVE ACTION -----
            function solveWordSearch() {
                const gridText = gridInput.value.trim();
                const wordsText = wordsInput.value.trim();

                if (!gridText || !wordsText) {
                    showToast("Please fill in both grid and words");
                    return;
                }

                showLoading();
                
                // small delay for smooth spinner
                setTimeout(() => {
                    try {
                        const grid = parseGrid(gridText);
                        if (grid.length === 0) throw new Error("Grid is empty");
                        const words = wordsText.split('\n')
                            .map(w => w.trim().toUpperCase())
                            .filter(w => w.length > 0);
                        
                        const results = findWords(grid, words);
                        displayResults(results);
                        if (results.length === 0) showToast("No words found");
                        else showToast(`Found ${results.length} word${results.length>1?'s':''}`);
                    } catch (e) {
                        hideLoading();
                        showToast("Invalid grid format");
                        console.warn(e);
                    }
                }, 80);
            }

            // ----- EVENT LISTENERS (with existence checks)-----
            function bindEvents() {
                if (solveBtn) solveBtn.addEventListener("click", solveWordSearch);
                if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
                if (mobileMenuToggle && mobileNav) {
                    mobileMenuToggle.addEventListener("click", () => mobileNav.classList.toggle("active"));
                }
                // allow enter? optional
            }

            // Initialize
            initTheme();
            bindEvents();

            // Prefill example works, also ensure empty state shown correctly on load
            window.addEventListener('DOMContentLoaded', () => {
                // If grid/words are prefilled, but we don't auto-solve. Keep empty state visible.
                if (gridInput.value.trim() && wordsInput.value.trim()) {
                    // optionally we can keep empty hidden? But we'll let user click.
                }
            });

            // expose for console (optional)
            window.solveWordSearch = solveWordSearch;
        })();
