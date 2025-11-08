document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const body = document.body;
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn = document.getElementById('close-settings');
    const footerNavBtns = document.querySelectorAll('.footer-nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    const channelsGrid = document.getElementById('channels-grid');
    const allChannelsGrid = document.getElementById('all-channels-grid');
    const fullscreenPlayer = document.getElementById('fullscreen-player');
    const fullscreenIframeContainer = document.getElementById('fullscreen-iframe-container');

    // Channel data
    const channels = [
        {
            id: 1,
            title: "BOLIVIA TV",
            thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoskG3KjD4M1Jjk_VAnkCuTjAQSxlpZhwKYQ&s",
            iframeCode: `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;"><iframe src="https://geo.dailymotion.com/player.html?video=x9nzqpo" style="width:100%; height:100%; position:absolute; left:0px; top:0px; overflow:hidden; border:none;" allowfullscreen title="Dailymotion Video Player" allow="web-share"></iframe></div>`
        },
        {
            id: 2,
            title: "RED UNO",
            thumbnail: "https://yt3.googleusercontent.com/Z9-5VuT1xqHWp_QJ3JvLD-PZlYQt_subNOfi-Lz-qYN75iaFP2r0oK7qclcnP4o9biLIo6qQROA=s900-c-k-c0x00ffffff-no-rj",
            iframeCode: `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
                <iframe src="https://geo.dailymotion.com/player.html?video=x9n2qyk"
                    style="width:100%; height:100%; position:absolute; left:0px; top:0px; overflow:hidden; border:none;"
                    allowfullscreen
                    title="Dailymotion Video Player"
                    allow="web-share">
                </iframe>
            </div>`
        },
        {
            id: 3,
            title: "UNITEL",
            thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOdEfaOkHFy6LeOzD_hgc1vDvrwDf0OPf45g&s",
            iframeCode: `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;"><iframe src="https://geo.dailymotion.com/player.html?video=x9onjrk" style="width:100%; height:100%; position:absolute; left:0px; top:0px; overflow:hidden; border:none;" allowfullscreen title="Dailymotion Video Player" allow="web-share"></iframe></div>`
        },
        {
            id: 4,
            title: "ATB",
            thumbnail: "https://play-lh.googleusercontent.com/sgL9elaLnROZ-njx1G5n7PyIcYWvaUuIsjecWtTOAY275giwquEG_J07ETmJbxfBFNaX",
            iframeCode: `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
                <iframe src="https://geo.dailymotion.com/player.html?video=x84eirw"
                    style="width:100%; height:100%; position:absolute; left:0px; top:0px; overflow:hidden; border:none;"
                    allowfullscreen
                    title="Dailymotion Video Player"
                    allow="web-share">
                </iframe>
            </div>`
        }
    ];
    
    // Current playing channel
    let currentChannel = null;
    let isFullscreen = false;

    // Initialize the app
    function initApp() {
        setupEventListeners();
        renderChannels();
        showSection('home');
        setupAutoFullscreen();
    }

    // Setup event listeners
    function setupEventListeners() {
        settingsBtn.addEventListener('click', openSettings);
        closeSettingsBtn.addEventListener('click', closeSettings);
        
        footerNavBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const section = this.dataset.section;
                showSection(section);
                setActiveFooterNav(this);
            });
        });
        
        // Keyboard controls
        document.addEventListener('keydown', handleKeyboard);
    }

    // Handle keyboard
    function handleKeyboard(e) {
        if (isFullscreen) {
            switch(e.key) {
                case 'Escape':
                case 'Backspace':
                    exitFullscreen();
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    // Puedes agregar navegación entre canales aquí si quieres
                    break;
                case 'ArrowRight':
                    // Puedes agregar navegación entre canales aquí si quieres
                    break;
            }
        }
    }

    // Setup auto fullscreen functionality
    function setupAutoFullscreen() {
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
        isFullscreen = true;
        
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen error:', err);
            });
        }
    }

    // Exit fullscreen mode
    function exitFullscreen() {
        fullscreenPlayer.classList.remove('active');
        document.body.style.overflow = 'auto';
        isFullscreen = false;
        
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        
        fullscreenIframeContainer.innerHTML = '';
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
        
        card.innerHTML = `
            <div class="channel-thumbnail">
                <img src="${channel.thumbnail}" alt="${channel.title}" loading="lazy">
                <span class="channel-live-badge">EN VIVO</span>
            </div>
            <div class="channel-title">${channel.title}</div>
        `;
        
        // Click para reproducir en pantalla completa
        card.addEventListener('click', function() {
            playChannelFullscreen(channel);
        });
        
        return card;
    }

    // Play channel in fullscreen
    function playChannelFullscreen(channel) {
        currentChannel = channel;
        fullscreenIframeContainer.innerHTML = channel.iframeCode;
    }

    // Initialize the app
    initApp();
});
