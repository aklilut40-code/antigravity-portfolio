// Create floating particles background
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 4 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.opacity = Math.random() * 0.5;
        particlesContainer.appendChild(particle);
    }
}

// Navigation active link highlighting
function setupNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Mobile hamburger menu
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}

// Download counter with localStorage
function initDownloadCounters() {
    for (let i = 1; i <= 4; i++) {
        const count = localStorage.getItem(`downloadCount${i}`);
        const element = document.getElementById(`downloadCount${i}`);
        if (element) {
            element.textContent = count ? parseInt(count) : 0;
        }
    }
}

// Download PDF function
window.downloadPDF = function(filename, cardId) {
    // Increment download count
    const currentCount = localStorage.getItem(`downloadCount${cardId}`) || 0;
    const newCount = parseInt(currentCount) + 1;
    localStorage.setItem(`downloadCount${cardId}`, newCount);
    
    // Update display
    const countElement = document.getElementById(`downloadCount${cardId}`);
    if (countElement) {
        countElement.textContent = newCount;
    }
    
    // Create download link
    const link = document.createElement('a');
    link.href = `pdfs/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    showNotification('Download started! Check your downloads folder.');
};

// Notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #6C63FF;
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        z-index: 10000;
        animation: fadeInOut 2s ease;
        font-family: inherit;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// AI Chat functionality
function setupChat() {
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatSend = document.getElementById('chatSend');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (chatToggle) {
        chatToggle.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
        });
    }
    
    if (chatClose) {
        chatClose.addEventListener('click', () => {
            chatWindow.classList.remove('active');
        });
    }
    
    // AI responses
    const aiResponses = {
        skills: "Aklilu specializes in Full-Stack Development (React, Node.js), Mobile Apps (React Native), and AI/ML (Python, TensorFlow, OpenAI).",
        projects: "His main projects include 4 Developer Roadmaps (downloaded 1000+ times), an AI Chat Assistant, and Cross-Platform Mobile Apps.",
        roadmaps: "He created 4 free developer roadmaps: Website Development, Web App Development, Mobile Development, and AI/ML. All available for download!",
        experience: "Aklilu is a passionate Software Engineer who loves building applications that defy gravity and help others learn.",
        contact: "You can reach Aklilu via GitHub (github.com/aklilut40-code), LinkedIn, or the contact form on this page.",
        default: "I'm Aklilu's AI assistant! Ask me about his skills, projects, roadmaps, experience, or how to contact him."
    };
    
    function getAIResponse(question) {
        const lowerQuestion = question.toLowerCase();
        
        if (lowerQuestion.includes('skill') || lowerQuestion.includes('tech') || lowerQuestion.includes('stack')) {
            return aiResponses.skills;
        } else if (lowerQuestion.includes('project') || lowerQuestion.includes('work') || lowerQuestion.includes('made')) {
            return aiResponses.projects;
        } else if (lowerQuestion.includes('roadmap') || lowerQuestion.includes('pdf') || lowerQuestion.includes('download')) {
            return aiResponses.roadmaps;
        } else if (lowerQuestion.includes('experience') || lowerQuestion.includes('background') || lowerQuestion.includes('about')) {
            return aiResponses.experience;
        } else if (lowerQuestion.includes('contact') || lowerQuestion.includes('email') || lowerQuestion.includes('reach')) {
            return aiResponses.contact;
        } else {
            return aiResponses.default;
        }
    }
    
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        messageDiv.innerHTML = `
            ${!isUser ? '<i class="fas fa-robot"></i>' : ''}
            <div class="message-text">${text}</div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function sendMessage() {
        const question = chatInput.value.trim();
        if (!question) return;
        
        addMessage(question, true);
        chatInput.value = '';
        
        // Simulate AI thinking
        setTimeout(() => {
            const response = getAIResponse(question);
            addMessage(response, false);
        }, 500);
    }
    
    if (chatSend) {
        chatSend.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

// Smooth scroll for anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                // Close mobile menu if open
                const navMenu = document.getElementById('navMenu');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });
}

// Contact form handling
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Thank you! I\'ll get back to you soon.');
            form.reset();
        });
    }
}

// Intersection Observer for animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.roadmap-card, .project-card, .contact-item, .contact-form').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    setupNavigation();
    setupMobileMenu();
    initDownloadCounters();
    setupChat();
    setupSmoothScroll();
    setupContactForm();
    setupScrollAnimations();
    
    // Add CSS animation for notification
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
            15% { opacity: 1; transform: translateX(-50%) translateY(0); }
            85% { opacity: 1; transform: translateX(-50%) translateY(0); }
            100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
});