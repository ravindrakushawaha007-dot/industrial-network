/**
 * Hammerwold Skill Network - Frontend Logic
 * File: js/script.js
 */

// 1. THEME MANAGEMENT (Dark/Light Mode)
const ThemeModule = {
    init() {
        const savedTheme = localStorage.getItem('hw-theme') || 'light';
        this.setTheme(savedTheme);
    },
    toggle() {
        const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        this.setTheme(newTheme);
    },
    setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('hw-theme', theme);
    }
};

// 2. UI COMPONENTS (Dropdowns & Modals)
const UIModule = {
    init() {
        this.setupDropdowns();
    },
    setupDropdowns() {
        const notifBtn = document.querySelector('.notification-trigger');
        const notifMenu = document.querySelector('.dropdown-content');

        if (notifBtn && notifMenu) {
            notifBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                notifMenu.style.display = notifMenu.style.display === 'block' ? 'none' : 'block';
            });
        }

        // Close dropdowns when clicking outside
        window.addEventListener('click', () => {
            if (notifMenu) notifMenu.style.display = 'none';
        });
    },
    updateCounter(elementId, count) {
        const el = document.getElementById(elementId);
        if (el) el.textContent = count;
    }
};

// 3. POST & FEED SYSTEM
const PostModule = {
    posts: [],
    
    createPost(category, content, media) {
        const newPost = {
            id: Date.now(),
            author: "Ravi Mourya", // Future: Get from Auth
            category,
            content,
            likes: 0,
            timestamp: new Date().toLocaleDateString()
        };
        
        this.posts.unshift(newPost);
        this.renderFeed();
        console.log("Post Published to Hammerwold:", newPost);
    },

    renderFeed(filter = 'All') {
        const feedContainer = document.getElementById('skill-feed');
        if (!feedContainer) return;

        const filtered = filter === 'All' ? this.posts : this.posts.filter(p => p.category === filter);
        
        feedContainer.innerHTML = filtered.map(post => `
            <div class="card skill-post-card" data-id="${post.id}">
                <span class="skill-tag">#${post.category}</span>
                <p>${post.content}</p>
                <div class="flex justify-between items-center mt-4">
                    <span class="text-xs text-gray-500">${post.author} • ${post.timestamp}</span>
                    <button onclick="PostModule.handleLike(${post.id})" class="btn-like">
                        ❤️ <span class="like-count">${post.likes}</span>
                    </button>
                </div>
            </div>
        `).join('');
    },

    handleLike(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.likes++;
            this.renderFeed();
            // Future: Firebase Update call here
        }
    }
};

// 4. SOCIAL & SEARCH
const SocialModule = {
    followCreator(creatorId) {
        console.log(`Following user: ${creatorId}`);
        // Logic for updating the 'Following' list in Firestore
        alert("You are now following this creator!");
    },

    handleSearch(query) {
        console.log(`Searching Hammerwold for: ${query}`);
        // Logic to filter PostModule.posts based on query
    }
};

// 5. AUTH INTERACTION
const AuthModule = {
    login(email, password) {
        // Future: Integration with firebase.auth()
        console.log("Attempting login for:", email);
        window.location.href = 'dashboard.html';
    },
    logout() {
        console.log("User logged out");
        window.location.href = 'login.html';
    }
};

// INITIALIZE ALL MODULES
document.addEventListener('DOMContentLoaded', () => {
    ThemeModule.init();
    UIModule.init();

    // Setup Create Post Form if on that page
    const postForm = document.getElementById('create-post-form');
    if (postForm) {
        postForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const category = document.getElementById('post-category').value;
            const content = document.getElementById('post-content').value;
            PostModule.createPost(category, content);
            postForm.reset();
        });
    }

    // Setup Search Bar if exists
    const searchInput = document.getElementById('main-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            SocialModule.handleSearch(e.target.value);
        });
    }
});
