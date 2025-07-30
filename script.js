document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');
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
    
    // Channel data with the 3 Dailymotion iframes
    const channels = [
        {
            id: 1,
            title: "Canal Premium 1",
            description: "Transmisión en vivo de contenido premium las 24 horas. Disfruta de la mejor programación internacional sin interrupciones.",
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
            description: "Lo mejor del entretenimiento internacional sin cortes. Programación variada para toda la familia.",
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
            description: "Variedad de programas y contenido exclusivo para toda la familia. Transmisiones en alta calidad las 24 horas.",
            category: "entretenimiento",
            country: "Internacional",
            language: "Español",
            thumbnail: "",
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
        // Load theme preference
        loadTheme();
        
        // Setup event listeners
        setupEventListeners();
        
        // Render channels
        renderChannels();
        
        // Set default section
        showSection('home');
    }
    
    // Load theme preference from localStorage
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        body.setAttribute('data-theme', savedTheme);
        
        if (savedTheme === 'light') {
            body.classList.add('light-theme');
        } else {
            body.classList.remove('light-theme');
        }
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);
        
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
    }
    
    // Toggle theme between dark and light
    function toggleTheme() {
        body.classList.toggle('light-theme');
        
        if (body.classList.contains('light-theme')) {
            body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
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
    
    // Initialize the app
    initApp();
});