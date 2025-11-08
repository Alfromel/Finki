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
            thumbnail: "https://www.betanoticias.com/wp-content/uploads/2014/02/bolivia-tv.jpg",
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
    let currentChannelIndex = 0;
    let tvRemoteEnabled = false;

    // Initialize the app
    function initApp() {
        setupEventListeners();
        renderChannels();
        showSection('home');
        setupAutoFullscreen();
        setupTVRemote();
        setupBackButtonHandler();
    }

    // Setup TV Remote functionality
    function setupTVRemote() {
        // Solicitar permiso para leer comandos del control remoto (si es necesario)
        if (navigator.tv || navigator.remoteControl) {
            // API para dispositivos TV (si está disponible)
            console.log('TV Remote API disponible');
        }
        
        // Para navegadores web normales, usamos eventos de teclado
        console.log('TV Remote configurado - Usa las flechas para cambiar canales');
    }

    // Setup back button handler
    function setupBackButtonHandler() {
        // Manejar el botón de retroceso del navegador
        window.addEventListener('popstate', function(event) {
            if (isFullscreen) {
                // Si está en pantalla completa, salir de ella en lugar de cerrar la página
                exitFullscreen();
                event.preventDefault();
                // Reemplazar el estado para evitar que el back button cierre la página
                window.history.pushState(null, null, window.location.href);
            }
        });

        // Prevenir que el back button cierre la aplicación
        window.history.pushState(null, null, window.location.href);
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
        
        // Keyboard controls mejorados para TV Remote
        document.addEventListener('keydown', handleKeyboard);
        
        // Touch events para controles táctiles
        document.addEventListener('touchstart', handleTouchStart, false);
        document.addEventListener('touchmove', handleTouchMove, false);
    }

    // Touch controls para cambiar canales
    let xDown = null;
    let yDown = null;

    function handleTouchStart(evt) {
        if (!isFullscreen) return;
        
        const firstTouch = evt.touches[0];
        xDown = firstTouch.clientX;
        yDown = firstTouch.clientY;
    }

    function handleTouchMove(evt) {
        if (!xDown || !yDown || !isFullscreen) return;

        const xUp = evt.touches[0].clientX;
        const yUp = evt.touches[0].clientY;

        const xDiff = xDown - xUp;
        const yDiff = yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            // Deslizamiento horizontal - cambiar canal
            if (xDiff > 0) {
                // Deslizamiento izquierda - canal siguiente
                changeChannel(1);
            } else {
                // Deslizamiento derecha - canal anterior
                changeChannel(-1);
            }
        }

        // Reset values
        xDown = null;
        yDown = null;
    }

    // Handle keyboard - mejorado para controles de TV
    function handleKeyboard(e) {
        if (isFullscreen) {
            switch(e.key) {
                case 'Escape':
                case 'Backspace':
                    exitFullscreen();
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    // Canal anterior
                    changeChannel(-1);
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    // Canal siguiente
                    changeChannel(1);
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                    // Volumen arriba (podría implementarse)
                    break;
                case 'ArrowDown':
                    // Volumen abajo (podría implementarse)
                    break;
                case ' ':
                case 'Enter':
                    // Play/Pause (podría implementarse)
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    // Cambio directo a canal por número
                    const channelNumber = parseInt(e.key);
                    if (channelNumber <= channels.length) {
                        changeToChannel(channelNumber - 1);
                    }
                    e.preventDefault();
                    break;
            }
        } else {
            // Controles cuando no está en pantalla completa
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowRight':
                case 'ArrowUp':
                case 'ArrowDown':
                    // Navegación en la interfaz principal
                    break;
            }
        }
    }

    // Cambiar canal (dirección: -1 para anterior, 1 para siguiente)
    function changeChannel(direction) {
        currentChannelIndex += direction;
        
        // Circular through channels
        if (currentChannelIndex < 0) {
            currentChannelIndex = channels.length - 1;
        } else if (currentChannelIndex >= channels.length) {
            currentChannelIndex = 0;
        }
        
        playChannelFullscreen(channels[currentChannelIndex]);
        
        // Mostrar notificación de cambio de canal
        showChannelChangeNotification(channels[currentChannelIndex].title);
    }

    // Cambiar a canal específico
    function changeToChannel(index) {
        if (index >= 0 && index < channels.length) {
            currentChannelIndex = index;
            playChannelFullscreen(channels[currentChannelIndex]);
            showChannelChangeNotification(channels[currentChannelIndex].title);
        }
    }

    // Mostrar notificación de cambio de canal
    function showChannelChangeNotification(channelName) {
        // Remover notificación anterior si existe
        const existingNotification = document.querySelector('.channel-change-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Crear nueva notificación
        const notification = document.createElement('div');
        notification.className = 'channel-change-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="channel-number">${currentChannelIndex + 1}</span>
                <span class="channel-name">${channelName}</span>
            </div>
        `;
        
        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-size: 18px;
            z-index: 10000;
            transition: opacity 0.3s ease;
            display: flex;
            align-items: center;
            gap: 15px;
        `;
        
        const notificationContent = notification.querySelector('.notification-content');
        notificationContent.style.cssText = `
            display: flex;
            align-items: center;
            gap: 15px;
        `;
        
        const channelNumber = notification.querySelector('.channel-number');
        channelNumber.style.cssText = `
            background: #e74c3c;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remover después de 2 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 2000);
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
        currentChannelIndex = channels.findIndex(ch => ch.id === currentChannel.id);
        
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen error:', err);
            });
        }
        
        // Agregar controles de TV en pantalla completa
        addTVControls();
    }

    // Agregar controles de TV en pantalla completa
    function addTVControls() {
        // Remover controles anteriores si existen
        const existingControls = document.querySelector('.tv-controls-overlay');
        if (existingControls) {
            existingControls.remove();
        }
        
        const controls = document.createElement('div');
        controls.className = 'tv-controls-overlay';
        controls.innerHTML = `
            <div class="tv-controls-info">
                <div class="current-channel">${currentChannel.title}</div>
                <div class="tv-instructions">
                    ← → Cambiar canal | ESC Salir | 1-${channels.length} Canal directo
                </div>
            </div>
        `;
        
        // Estilos para los controles
        controls.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 10px;
            font-size: 14px;
            z-index: 9999;
            text-align: center;
            transition: opacity 0.3s ease;
        `;
        
        const channelInfo = controls.querySelector('.current-channel');
        channelInfo.style.cssText = `
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
        `;
        
        const instructions = controls.querySelector('.tv-instructions');
        instructions.style.cssText = `
            font-size: 12px;
            opacity: 0.8;
        `;
        
        fullscreenPlayer.appendChild(controls);
        
        // Auto-ocultar controles después de 5 segundos
        setTimeout(() => {
            controls.style.opacity = '0';
        }, 5000);
        
        // Mostrar controles al mover el mouse/tocar
        fullscreenPlayer.addEventListener('mousemove', showTVControls);
        fullscreenPlayer.addEventListener('touchstart', showTVControls);
        
        function showTVControls() {
            controls.style.opacity = '1';
            setTimeout(() => {
                controls.style.opacity = '0';
            }, 5000);
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
        
        // Remover controles de TV
        const controls = document.querySelector('.tv-controls-overlay');
        if (controls) {
            controls.remove();
        }
        
        // Remover event listeners de controles
        fullscreenPlayer.removeEventListener('mousemove', showTVControls);
        fullscreenPlayer.removeEventListener('touchstart', showTVControls);
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
                <span class="channel-number">${index + 1}</span>
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
        currentChannelIndex = channels.findIndex(ch => ch.id === channel.id);
        fullscreenIframeContainer.innerHTML = channel.iframeCode;
    }

    // Initialize the app
    initApp();
});
