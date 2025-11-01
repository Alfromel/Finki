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
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const fullscreenPlayer = document.getElementById('fullscreen-player');
    const fullscreenIframeContainer = document.getElementById('fullscreen-iframe-container');

    // Channel data with the 3 Dailymotion iframes
    const channels = [
        {
            id: 1,
            title: "RED UNO",
            category: "entretenimiento",
            country: "Bolivia",
            language: "Español",
            description: "Canal líder de entretenimiento en Bolivia con programación variada",
            thumbnail: "https://yt3.googleusercontent.com/Z9-5VuT1xqHWp_QJ3JvLD-PZlYQt_subNOfi-Lz-qYN75iaFP2r0oK7qclcnP4o9biLIo6qQROA=s900-c-k-c0x00ffffff-no-rj",
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
            title: "UNITEL",
            category: "entretenimiento",
            country: "Bolivia",
            language: "Español",
            description: "Canal de televisión boliviano con programación nacional e internacional",
            thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOdEfaOkHFy6LeOzD_hgc1vDvrwDf0OPf45g&s",
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
            title: "ATB",
            category: "entretenimiento",
            country: "Bolivia",
            language: "Español",
            description: "Canal de televisión boliviano con noticias y entretenimiento",
            thumbnail: "https://play-lh.googleusercontent.com/sgL9elaLnROZ-njx1G5n7PyIcYWvaUuIsjecWtTOAY275giwquEG_J07ETmJbxfBFNaX",
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

    // Initialize the app
    function initApp() {
        // Setup event listeners
        setupEventListeners();
        
        // Render channels
        renderChannels();
        
        // Set default section
        showSection('home');
        
        // Auto enter fullscreen on channel play
        setupAutoFullscreen();
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
        
        // Fullscreen button
        fullscreenBtn.addEventListener('click', toggleFullscreen);
        
        // Keyboard controls for fullscreen
        document.addEventListener('keydown', handleFullscreenKeyboard);
    }

    // Setup auto fullscreen functionality
    function setupAutoFullscreen() {
        // Auto enter fullscreen when a channel starts playing
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && fullscreenIframeContainer.children.length > 0) {
                    enterFullscreen();
                }
            });
        });
        
        observer.observe(fullscreenIframeContainer, { childList: true });
    }

    // Enter fullscreen mode
    function enterFullscreen() {
        fullscreenPlayer.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Enter browser fullscreen
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        }
    }

    // Exit fullscreen mode
    function exitFullscreen() {
        fullscreenPlayer.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Exit browser fullscreen
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        
        // Clear fullscreen iframe
        fullscreenIframeContainer.innerHTML = '';
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

    // Handle keyboard in fullscreen
    function handleFullscreenKeyboard(e) {
        if (!fullscreenPlayer.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                exitFullscreen();
                e.preventDefault();
                break;
        }
    }

    // Open settings modal
    function openSettings() {
        settingsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close settings modal
    function closeSettings() {
        settingsModal.classList.remove('active');
        document.body.style.overflow = 'auto';
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
        
        channels.forEach((channel, index) => {
            const channelCard = createChannelCard(channel, index);
            channelsGrid.appendChild(channelCard);
            
            const fullChannelCard = createChannelCard(channel, index);
            allChannelsGrid.appendChild(fullChannelCard);
        });
    }

    // Create channel card element
    function createChannelCard(channel, index) {
        const card = document.createElement('div');
        card.className = 'channel-card';
        card.dataset.id = channel.id;
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="channel-thumbnail">
                <img src="${channel.thumbnail}" alt="${channel.title}" loading="lazy">
                <span class="channel-live-badge">EN VIVO</span>
            </div>
            <div class="channel-title">${channel.title}</div>
        `;
        
        // Single click for instant fullscreen play
        card.addEventListener('click', function() {
            playChannelFullscreen(channel, index);
        });
        
        return card;
    }

    // Play channel in fullscreen
    function playChannelFullscreen(channel, index) {
        currentChannel = channel;
        
        // Update featured channel info
        currentChannelTitle.textContent = channel.title;
        currentChannelDescription.textContent = channel.description;
        
        // Load iframe in fullscreen container
        fullscreenIframeContainer.innerHTML = channel.iframeCode;
        
        // Show notification
        showNotification(`Reproduciendo: ${channel.title}`);
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

    // Initialize the app
    initApp();
});
