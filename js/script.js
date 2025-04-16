// Mobile Menu Functionality
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const closeSidebar = document.querySelector('.close-sidebar');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');

// Toggle sidebar
mobileMenuToggle.addEventListener('click', () => {
    sidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('active');
    document.body.style.overflow = '';
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        !mobileMenuToggle.contains(e.target)) {
        sidebar.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
        document.body.style.overflow = '';
    }
}); 