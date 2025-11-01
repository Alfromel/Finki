:root {
  --primary-color: #ff0000;
  --primary-dark: #cc0000;
  --primary-light: #ff3333;
  --bg-dark: #000000;
  --bg-darker: #0a0a0a;
  --bg-card: #1a1a1a;
  --text-light: #ffffff;
  --text-gray: #cccccc;
  --accent-red: #ff3333;
  --shadow: 0 4px 12px rgba(255, 0, 0, 0.3);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', sans-serif;
  background-color: var(--bg-dark);
  color: var(--text-light);
  line-height: 1.6;
  overflow-x: hidden;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header Styles */
.app-header {
  background: linear-gradient(to right, var(--bg-darker), var(--bg-card));
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--primary-color);
  box-shadow: var(--shadow);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 40px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 40px;
  height: 40px;
  background: var(--primary-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.logo-text {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: 24px;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.main-nav ul {
  display: flex;
  list-style: none;
  gap: 30px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.nav-item i {
  font-size: 20px;
  color: var(--text-gray);
}

.nav-item span {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-gray);
}

.nav-item.active {
  background-color: var(--primary-color);
}

.nav-item.active i,
.nav-item.active span {
  color: white;
}

.nav-item:hover {
  background-color: var(--bg-card);
}

.coming-soon {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--primary-color);
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-container {
  display: flex;
  background: var(--bg-card);
  border-radius: 25px;
  overflow: hidden;
  border: 1px solid #333;
}

.search-input {
  background: transparent;
  border: none;
  padding: 10px 15px;
  color: white;
  width: 200px;
  outline: none;
}

.search-btn {
  background: var(--primary-color);
  border: none;
  padding: 10px 15px;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

.search-btn:hover {
  background: var(--primary-dark);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.settings-btn {
  background: var(--bg-card);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-gray);
  cursor: pointer;
  transition: all 0.3s;
}

.settings-btn:hover {
  color: var(--primary-color);
  background: #222;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 20px;
}

.content-section {
  display: none;
}

.content-section.active {
  display: block;
}

.section-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 20px;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Featured Container */
.featured-container {
  margin-bottom: 40px;
}

.featured-channel {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  background: var(--bg-card);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: var(--shadow);
  border: 1px solid #333;
}

.channel-info {
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.channel-info h2 {
  color: var(--primary-color);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.channel-info h1 {
  font-size: 32px;
  margin-bottom: 15px;
  font-weight: 700;
}

.channel-info p {
  color: var(--text-gray);
  margin-bottom: 15px;
  line-height: 1.5;
}

.channel-player {
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.player-placeholder {
  text-align: center;
  color: var(--text-gray);
}

.player-placeholder i {
  font-size: 60px;
  margin-bottom: 15px;
  color: #333;
}

/* Channels Grid */
.channels-grid, .full-channels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.channel-card {
  background: var(--bg-card);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #333;
}

.channel-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow);
  border-color: var(--primary-color);
}

.channel-thumbnail {
  position: relative;
  height: 120px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.channel-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.channel-live-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--primary-color);
  color: white;
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 10px;
  font-weight: bold;
}

.channel-title {
  padding: 15px;
  font-weight: 600;
  text-align: center;
}

/* Coming Soon Sections */
.coming-full-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
}

.coming-full-content {
  text-align: center;
  max-width: 500px;
}

.coming-full-content i {
  font-size: 80px;
  color: #333;
  margin-bottom: 20px;
}

.coming-full-content h2 {
  font-size: 28px;
  margin-bottom: 15px;
  color: var(--primary-color);
}

.coming-full-content p {
  color: var(--text-gray);
  margin-bottom: 20px;
}

.coming-badge {
  background: var(--primary-color);
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Footer */
.app-footer {
  background: var(--bg-darker);
  border-top: 1px solid #333;
  padding: 15px 0;
}

.footer-nav {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.footer-nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: var(--text-gray);
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s;
}

.footer-nav-btn i {
  font-size: 20px;
}

.footer-nav-btn span {
  font-size: 12px;
  font-weight: 500;
}

.footer-nav-btn.active {
  color: var(--primary-color);
}

.footer-nav-btn:hover {
  background: var(--bg-card);
}

/* Fullscreen Player */
.fullscreen-player {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  z-index: 2000;
  display: none;
}

.fullscreen-player.active {
  display: block;
}

.fullscreen-player iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Modal */
.tv-modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  align-items: center;
  justify-content: center;
}

.tv-modal.active {
  display: flex;
}

.modal-content {
  background: var(--bg-card);
  border-radius: 15px;
  width: 90%;
  max-width: 600px;
  padding: 30px;
  box-shadow: var(--shadow);
  border: 1px solid #333;
}

.modal-content h2 {
  color: var(--primary-color);
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.settings-section {
  margin-bottom: 25px;
}

.settings-section h3 {
  margin-bottom: 15px;
  color: var(--text-light);
}

.fullscreen-btn {
  width: 100%;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.fullscreen-btn:hover {
  background: var(--primary-dark);
}

.modal-actions {
  margin-top: 25px;
  text-align: center;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 30px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: var(--primary-dark);
}

/* Focus styles for TV mode */
.focused {
  outline: 3px solid var(--primary-color);
  outline-offset: 2px;
}

/* Notification */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--primary-color);
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: var(--shadow);
  transform: translateX(150%);
  transition: transform 0.3s ease;
  z-index: 1001;
}

.notification.show {
  transform: translateX(0);
}

/* Responsive */
@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }
  
  .header-left {
    flex-direction: column;
    gap: 15px;
    width: 100%;
  }
  
  .main-nav ul {
    justify-content: center;
    width: 100%;
  }
  
  .featured-channel {
    grid-template-columns: 1fr;
  }
  
  .channels-grid, .full-channels-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .footer-nav {
    gap: 20px;
  }
}
