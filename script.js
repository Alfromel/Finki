document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const body = document.body;
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn = document.getElementById('close-settings');
    const navItems = document.querySelectorAll('.nav-item');
    const footerNavBtns = document.querySelectorAll('.footer-nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    const channelsGrid = document.getElementById('channels-grid');
    const allChannelsGrid = document.getElementById('all-channels-grid');
    const mainPlayer = document.getElementById('main-player');
    const currentChannelTitle = document.getElementById('current-channel-title');
    const currentChannelDescription = document.getElementById('current-channel-description');
    const channelModal = document.getElementById('channel-modal');
    const modalPlayer = document.getElementById('modal-player');
    const modalChannelTitle = document.getElementById('modal-channel-title');
    const modalChannelDescription = document.getElementById('modal-channel-description');
    const modalChannelCountry = document.getElementById('modal-channel-country');
    const modalChannelLanguage = document.getElementById('modal-channel-language');
    const modalChannelCategory = document.getElementById('modal-channel-category');
    const modalClose = document.querySelector('.modal-close');
    const btnPlay = document.querySelector('.btn-play');
    const btnFav = document.querySelector('.btn-fav');
    const modalPlay = document.querySelector('.modal-play');
    const modalFav = document.querySelector('.modal-fav');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const modeOptions = document.querySelectorAll('.mode-option');
    const themeOptions = document.querySelectorAll('.theme-option');

    // Channel data with the 3 Dailymotion iframes
    const channels = [
        {
            id: 1,
            title: "Canal Premium 1",
            category: "entretenimiento",
            country: "Internacional",
            language: "Español",
            thumbnail: "https://via.placeholder.com/300x169/1e3a8a/ffffff?text=Canal+1",
            iframeCode: `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
                <iframe src="https://geo.dailymotion.com/player.html?video=x9n2qyk"
                    style="width:100%; height:100%; position:absolute; left:0px; top:0px; overflow:hidden; border:none;"
                    allowfullscreen
                    title="Dailymotion Video Player"
                    allow="web-share">
                </iframe>
            </div>`,
            isFavorite: false
        },
        {
            id: 2,
            title: "Canal Premium 2",
            category: "entretenimiento",
            country: "Internacional",
            language: "Español",
            thumbnail: "https://via.placeholder.com/300x169/1e3a8a/ffffff?text=Canal+2",
            iframeCode: `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
                <iframe src="https://geo.dailymotion.com/player.html?video=x8eimg9"
                    style="width:100%; height:100%; position:absolute; left:0px; top:0px; overflow:hidden; border:none;"
                    allowfullscreen
                    title="Dailymotion Video Player"
                    allow="web-share">
                </iframe>
            </div>`,
            isFavorite: false
        },
        {
            id: 3,
            title: "Canal Premium 3",
            category: "entretenimiento",
            country: "Internacional",
            language: "Español",
            thumbnail: "https://via.placeholder.com/300x169/1e3a8a/ffffff?text=Canal+3",
            iframeCode: `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
                <iframe src="https://geo.dailymotion.com/player.html?video=x84eirw"
                    style="width:100%; height:100%; position:absolute; left:0px; top:0px; overflow:hidden; border:none;"
                    allowfullscreen
                    title="Dailymotion Video Player"
                    allow="web-share">
                </iframe>
            </div>`,
            isFavorite: false
        }
    ];
    
    // Current playing channel
    let currentChannel = null;
    // Current focused element for TV mode
    let currentFocus = null;
    // All focusable elements
    let focusableElements = [];

    // Initialize the app
    function initApp() {
        // Load preferences
        loadPreferences();
        
        // Setup event listeners
        setupEventListeners();
        
        // Render channels
        renderChannels();
        
        // Set default section
        showSection('home');
        
        // Initialize TV mode navigation if needed
        if (body.classList.contains('tv-mode')) {
            initTVNavigation();
        }
    }

    // Load preferences from localStorage
    function loadPreferences() {
        // Load theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        
        // Load mode
        const savedMode = localStorage.getItem('mode') || 'tv';
        setMode(savedMode);
    }

    // Setup event listeners
    function setupEventListeners() {
        // Settings button
        settingsBtn.addEventListener('click', openSettings);
        closeSettingsBtn.addEventListener('click', closeSettings);
        
        // Navigation items
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                const section = this.dataset.section;
                showSection(section);
                setActiveNav(this);
            });
        });
        
        // Footer navigation
        footerNavBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const section = this.dataset.section;
                showSection(section);
                setActiveFooterNav(this);
            });
        });
        
        // Mode options
        modeOptions.forEach(option => {
            option.addEventListener('click', function() {
                const mode = this.dataset.mode;
                setMode(mode);
                highlightSelectedOption(this, modeOptions);
            });
        });
        
        // Theme options
        themeOptions.forEach(option => {
            option.addEventListener('click', function() {
                const theme = this.dataset.theme;
                setTheme(theme);
                highlightSelectedOption(this, themeOptions);
            });
        });
        
        // Fullscreen button
        fullscreenBtn.addEventListener('click', toggleFullscreen);
        
        // Channel click events are set in renderChannels()
        
        // Modal close
        modalClose.addEventListener('click', closeModal);
        
        // Play buttons
        btnPlay.addEventListener('click', playCurrentChannel);
        modalPlay.addEventListener('click', function() {
            playCurrentChannel();
            closeModal();
        });
        
        // Favorite buttons
        btnFav.addEventListener('click', toggleCurrentFavorite);
        modalFav.addEventListener('click', toggleCurrentFavorite);
        
        // Keyboard navigation for TV mode
        document.addEventListener('keydown', handleRemoteNavigation);
    }

    // Set application theme
    function setTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light-theme');
            body.setAttribute('data-theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.setAttribute('data-theme', 'dark');
        }
        localStorage.setItem('theme', theme);
    }

    // Set application mode (tv, mobile, desktop)
    function setMode(mode) {
        // Remove all mode classes first
        body.classList.remove('tv-mode', 'mobile-mode', 'desktop-mode');
        
        // Add the selected mode class
        body.classList.add(`${mode}-mode`);
        localStorage.setItem('mode', mode);
        
        // Reinitialize TV navigation if needed
        if (mode === 'tv') {
            initTVNavigation();
        }
    }

    // Highlight selected option in settings
    function highlightSelectedOption(selected, options) {
        options.forEach(option => {
            option.classList.remove('active');
        });
        selected.classList.add('active');
    }

    // Open settings modal
    function openSettings() {
        settingsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Highlight current settings
        highlightCurrentSettings();
    }

    // Highlight current settings in modal
    function highlightCurrentSettings() {
        // Highlight current mode
        const currentMode = body.classList.contains('tv-mode') ? 'tv' : 
                          body.classList.contains('mobile-mode') ? 'mobile' : 'desktop';
        document.querySelector(`.mode-option[data-mode="${currentMode}"]`).classList.add('active');
        
        // Highlight current theme
        const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
        document.querySelector(`.theme-option[data-theme="${currentTheme}"]`).classList.add('active');
    }

    // Close settings modal
    function closeSettings() {
        settingsModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Toggle fullscreen
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // Show selected section
    function showSection(sectionId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        document.getElementById(`${sectionId}-section`).classList.add('active');
    }

    // Set active navigation item
    function setActiveNav(activeItem) {
        navItems.forEach(item => {
            item.classList.remove('active');
        });
        
        activeItem.classList.add('active');
    }

    // Set active footer navigation
    function setActiveFooterNav(activeItem) {
        footerNavBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        
        activeItem.classList.add('active');
    }

    // Render channels to the grids
    function renderChannels() {
        channelsGrid.innerHTML = '';
        allChannelsGrid.innerHTML = '';
        
        channels.forEach(channel => {
            const channelCard = createChannelCard(channel);
            channelsGrid.appendChild(channelCard);
            
            const fullChannelCard = createChannelCard(channel);
            allChannelsGrid.appendChild(fullChannelCard);
        });
    }

    // Create channel card element
    function createChannelCard(channel) {
        const card = document.createElement('div');
        card.className = 'channel-card';
        card.dataset.id = channel.id;
        
        card.innerHTML = `
            <div class="channel-thumbnail">
                <img src="${channel.thumbnail}" alt="${channel.title}" loading="lazy">
                <span class="channel-live-badge">EN VIVO</span>
            </div>
            <div class="channel-title">${channel.title}</div>
        `;
        
        card.addEventListener('click', function() {
            openChannelModal(channel);
        });
        
        return card;
    }

    // Open channel modal
    function openChannelModal(channel) {
        currentChannel = channel;
        
        modalChannelTitle.textContent = channel.title;
        modalChannelDescription.textContent = channel.description;
        modalChannelCountry.textContent = channel.country;
        modalChannelLanguage.textContent = channel.language;
        modalChannelCategory.textContent = channel.category;
        
        // Update favorite button state
        updateFavoriteButtons();
        
        // Load iframe
        modalPlayer.innerHTML = channel.iframeCode;
        
        // Show modal
        channelModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    function closeModal() {
        channelModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Play current channel in main player
    function playCurrentChannel() {
        if (!currentChannel) return;
        
        currentChannelTitle.textContent = currentChannel.title;
        currentChannelDescription.textContent = currentChannel.description;
        
        // Load iframe
        mainPlayer.innerHTML = currentChannel.iframeCode;
        
        // Update favorite button state
        updateFavoriteButtons();
    }

    // Toggle favorite status for current channel
    function toggleCurrentFavorite() {
        if (!currentChannel) return;
        
        currentChannel.isFavorite = !currentChannel.isFavorite;
        updateFavoriteButtons();
        
        // Show notification
        showNotification(
            currentChannel.isFavorite 
                ? `Añadido a favoritos: ${currentChannel.title}` 
                : `Eliminado de favoritos: ${currentChannel.title}`
        );
    }

    // Update favorite buttons state
    function updateFavoriteButtons() {
        if (!currentChannel) return;
        
        const favIcons = document.querySelectorAll('.fa-heart');
        favIcons.forEach(icon => {
            if (currentChannel.isFavorite) {
                icon.classList.add('fas');
                icon.classList.remove('far');
            } else {
                icon.classList.add('far');
                icon.classList.remove('fas');
            }
        });
    }

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // TV Mode Navigation Functions
    function initTVNavigation() {
        // Get all focusable elements
        focusableElements = Array.from(document.querySelectorAll('.nav-item, .channel-card, .footer-nav-btn, .mode-option, .theme-option, .btn-play, .btn-fav, .modal-btn'));
        
        // Set initial focus
        if (focusableElements.length > 0) {
            currentFocus = focusableElements[0];
            currentFocus.classList.add('focused');
        }
    }

    function handleRemoteNavigation(e) {
        if (!body.classList.contains('tv-mode')) return;
        
        switch (e.key) {
            case 'ArrowUp':
                navigate('up');
                e.preventDefault();
                break;
            case 'ArrowDown':
                navigate('down');
                e.preventDefault();
                break;
            case 'ArrowLeft':
                navigate('left');
                e.preventDefault();
                break;
            case 'ArrowRight':
                navigate('right');
                e.preventDefault();
                break;
            case 'Enter':
                if (currentFocus) {
                    currentFocus.click();
                    e.preventDefault();
                }
                break;
            case 'Backspace':
                if (settingsModal.classList.contains('active')) {
                    closeSettings();
                    e.preventDefault();
                } else if (channelModal.classList.contains('active')) {
                    closeModal();
                    e.preventDefault();
                }
                break;
        }
    }

    function navigate(direction) {
        if (!currentFocus) return;
        
        // Remove focus from current element
        currentFocus.classList.remove('focused');
        
        // Get current position
        const currentIndex = focusableElements.indexOf(currentFocus);
        let newIndex = currentIndex;
        
        // Calculate new index based on direction
        switch (direction) {
            case 'up':
                newIndex = Math.max(0, currentIndex - 1);
                break;
            case 'down':
                newIndex = Math.min(focusableElements.length - 1, currentIndex + 1);
                break;
            case 'left':
                newIndex = Math.max(0, currentIndex - 1);
                break;
            case 'right':
                newIndex = Math.min(focusableElements.length - 1, currentIndex + 1);
                break;
        }
        
        // Ensure new index is valid
        if (newIndex >= 0 && newIndex < focusableElements.length) {
            currentFocus = focusableElements[newIndex];
            currentFocus.classList.add('focused');
            currentFocus.focus();
            
            // Scroll into view if needed
            currentFocus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            // If no valid new index, keep focus on current element
            currentFocus.classList.add('focused');
        }
    }

    // Initialize the app
    initApp();
});
