// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.setAttribute('data-theme', 
        body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    );
    themeToggle.innerHTML = body.getAttribute('data-theme') === 'dark' 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
});

// Initialize GSAP animations
gsap.from('.welcome-section', {
    duration: 1,
    y: -50,
    opacity: 0,
    ease: 'power3.out'
});

// Performance Chart
let performanceChart;
const chartData = {
    week: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        views: [1200, 1900, 1500, 2100, 1800, 2500, 2200],
        engagement: [800, 1200, 900, 1400, 1100, 1800, 1500]
    },
    month: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        views: [8500, 9200, 8800, 9500],
        engagement: [5500, 6200, 5800, 6500]
    },
    year: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        views: [32000, 35000, 38000, 40000],
        engagement: [22000, 25000, 28000, 30000]
    }
};

function initChart(period = 'week') {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    const data = chartData[period];
    
    if (performanceChart) {
        performanceChart.destroy();
    }
    
    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Views',
                    data: data.views,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Engagement',
                    data: data.engagement,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Chart Period Toggle
document.querySelectorAll('.chart-actions button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.chart-actions button.active').classList.remove('active');
        button.classList.add('active');
        initChart(button.dataset.period);
    });
});

// Initialize Chart
initChart();

// Calendar Generation
function generateCalendar() {
    const calendarGrid = document.querySelector('.calendar-grid');
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get first day of month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    // Clear previous calendar
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Add empty cells for days before first day
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyCell);
    }
    
    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.textContent = day;
        
        // Highlight today
        if (day === today.getDate()) {
            dayCell.classList.add('today');
        }
        
        // Add random content indicators
        if (Math.random() > 0.7) {
            const contentIndicator = document.createElement('div');
            contentIndicator.className = 'content-indicator';
            dayCell.appendChild(contentIndicator);
            
            // Add tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = `${Math.floor(Math.random() * 5) + 1} posts scheduled`;
            dayCell.appendChild(tooltip);
            
            // Show tooltip on hover
            dayCell.addEventListener('mouseenter', () => {
                tooltip.classList.add('show');
            });
            
            dayCell.addEventListener('mouseleave', () => {
                tooltip.classList.remove('show');
            });
        }
        
        calendarGrid.appendChild(dayCell);
    }
}

// Initialize calendar
generateCalendar();

// Notification Badge Animation
const notificationBadge = document.querySelector('.notification-badge');
if (notificationBadge) {
    gsap.to(notificationBadge, {
        scale: 1.2,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
    });
}

// Search Bar Focus Effect
const searchBar = document.querySelector('.search-bar input');
searchBar.addEventListener('focus', () => {
    gsap.to('.search-bar', {
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out'
    });
});

searchBar.addEventListener('blur', () => {
    gsap.to('.search-bar', {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
    });
});

// Mobile Menu Toggle
const mobileMenuToggle = document.createElement('button');
mobileMenuToggle.className = 'mobile-menu-toggle';
mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
document.querySelector('.top-bar').prepend(mobileMenuToggle);

mobileMenuToggle.addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

// Add hover effects to cards
document.querySelectorAll('.stat-card, .suggestion-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Add click effects to buttons
document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('click', () => {
        gsap.to(button, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
    });
});

// Add smooth scroll to navigation links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: target,
                    offsetY: 100
                },
                ease: 'power2.inOut'
            });
        }
    });
});

// Navigation
function handleNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const contentSections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link
            link.parentElement.classList.add('active');
            
            // Show corresponding section
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Animate the section entrance
                gsap.from(targetSection, {
                    duration: 0.5,
                    y: 50,
                    opacity: 0,
                    ease: 'power3.out'
                });
                
                // Close mobile menu if open
                document.querySelector('.sidebar').classList.remove('active');
            }
        });
    });
}

// Initialize navigation
handleNavigation();

// Analytics Chart
let analyticsChart;
function initAnalyticsChart() {
    const ctx = document.getElementById('analyticsChart').getContext('2d');
    
    // Sample data with more realistic values
    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        likes: [1200, 1900, 1500, 2100, 1800, 2500, 2200],
        comments: [800, 1200, 900, 1400, 1100, 1800, 1500]
    };
    
    // Calculate max value for better scaling
    const maxValue = Math.max(...data.likes, ...data.comments);
    const yAxisMax = Math.ceil(maxValue / 1000) * 1000;
    
    analyticsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Likes',
                    data: data.likes,
                    backgroundColor: 'rgba(99, 102, 241, 0.7)',
                    borderColor: '#6366f1',
                    borderWidth: 2,
                    borderRadius: 6,
                    barThickness: 20,
                    maxBarThickness: 30
                },
                {
                    label: 'Comments',
                    data: data.comments,
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderColor: '#10b981',
                    borderWidth: 2,
                    borderRadius: 6,
                    barThickness: 20,
                    maxBarThickness: 30
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: yAxisMax,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return value >= 1000 ? (value / 1000) + 'K' : value;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Analytics Chart Period Toggle
document.querySelectorAll('.chart-actions button[data-period]').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.chart-actions button.active').classList.remove('active');
        button.classList.add('active');
        updateAnalyticsChart(button.dataset.period);
    });
});

// Export Analytics Data
document.getElementById('exportAnalytics').addEventListener('click', () => {
    const analyticsData = {
        engagement: {
            labels: analyticsChart.data.labels,
            datasets: analyticsChart.data.datasets.map(dataset => ({
                label: dataset.label,
                data: dataset.data
            }))
        },
        demographics: {
            age: ageChart.data,
            gender: genderChart.data,
            location: Array.from(document.querySelectorAll('.location-item')).map(item => ({
                location: item.querySelector('span:first-child').textContent,
                percentage: item.querySelector('.location-percentage').textContent
            }))
        }
    };

    const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Initialize Demographics Charts
function initDemographicsCharts() {
    // Age Distribution Chart
    const ageCtx = document.getElementById('ageChart').getContext('2d');
    ageChart = new Chart(ageCtx, {
        type: 'doughnut',
        data: {
            labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
            datasets: [{
                data: [25, 35, 20, 15, 5],
                backgroundColor: [
                    '#6366f1',
                    '#8b5cf6',
                    '#ec4899',
                    '#f59e0b',
                    '#10b981'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Gender Distribution Chart
    const genderCtx = document.getElementById('genderChart').getContext('2d');
    genderChart = new Chart(genderCtx, {
        type: 'pie',
        data: {
            labels: ['Male', 'Female', 'Other'],
            datasets: [{
                data: [45, 50, 5],
                backgroundColor: [
                    '#6366f1',
                    '#ec4899',
                    '#10b981'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Content Performance Filters
document.querySelectorAll('.performance-filters button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.performance-filters button.active').classList.remove('active');
        button.classList.add('active');
        filterPerformanceItems(button.dataset.type);
    });
});

function filterPerformanceItems(type) {
    const items = document.querySelectorAll('.performance-item');
    items.forEach(item => {
        if (type === 'all') {
            item.style.display = 'flex';
        } else {
            const itemType = item.querySelector('.content-info i').className.includes(type) ? type : 'other';
            item.style.display = itemType === type ? 'flex' : 'none';
        }
    });
}

// Initialize analytics when section is shown
document.getElementById('analytics').addEventListener('transitionend', () => {
    if (document.getElementById('analytics').classList.contains('active')) {
        initAnalyticsChart();
        initDemographicsCharts();
    }
});

// Content Editors
function initializeEditors() {
    const editorButtons = document.querySelectorAll('[data-editor]');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Open editor modals
    editorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const editorType = button.dataset.editor;
            const modal = document.getElementById(`${editorType}Editor`);
            
            // Animate modal opening
            gsap.to(modal, {
                display: 'flex',
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            // Animate modal content
            gsap.from(modal.querySelector('.modal-content'), {
                y: 50,
                opacity: 0,
                duration: 0.3,
                delay: 0.1,
                ease: 'power2.out'
            });
            
            modal.classList.add('active');
        });
    });
    
    // Close editor modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.editor-modal');
            
            gsap.to(modal, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    modal.classList.remove('active');
                    modal.style.display = 'none';
                }
            });
        });
    });
    
    // Initialize Text Editor
    initTextEditor();
    
    // Initialize Image Editor
    initImageEditor();
    
    // Initialize Video Editor
    initVideoEditor();
}

// Text Editor
function initTextEditor() {
    const toolbar = document.querySelector('.editor-toolbar');
    const editorContent = document.querySelector('.editor-content');
    
    if (!toolbar || !editorContent) return;
    
    toolbar.addEventListener('click', (e) => {
        const button = e.target.closest('.toolbar-btn');
        if (!button) return;
        
        const command = button.dataset.command;
        
        if (command) {
            e.preventDefault();
            document.execCommand(command, false, null);
            button.classList.toggle('active');
        }
    });
    
    // AI Suggestions
    const suggestionChips = document.querySelectorAll('.suggestion-chip');
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Simulate AI processing
            chip.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            setTimeout(() => {
                chip.innerHTML = chip.textContent;
                // Show success message
                const toast = document.createElement('div');
                toast.className = 'toast success';
                toast.textContent = 'Content optimized!';
                document.body.appendChild(toast);
                
                gsap.to(toast, {
                    opacity: 0,
                    y: -20,
                    duration: 0.3,
                    delay: 2,
                    onComplete: () => toast.remove()
                });
            }, 1500);
        });
    });
}

// Image Editor
function initImageEditor() {
    const imageUpload = document.getElementById('imageUpload');
    const fileInput = imageUpload.querySelector('input[type="file"]');
    const previewArea = document.querySelector('.image-preview');
    const previewImage = document.getElementById('previewImage');
    
    if (!imageUpload || !fileInput || !previewArea || !previewImage) return;
    
    // Handle file upload
    imageUpload.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                imageUpload.style.display = 'none';
                previewArea.style.display = 'block';
                
                // Animate preview
                gsap.from(previewArea, {
                    opacity: 0,
                    y: 20,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Image controls
    const sliderControl = document.querySelector('.slider-control input');
    if (sliderControl) {
        sliderControl.addEventListener('input', (e) => {
            const value = e.target.value;
            previewImage.style.filter = `brightness(${value}%)`;
        });
    }
}

// Video Editor
function initVideoEditor() {
    const videoUpload = document.getElementById('videoUpload');
    const fileInput = videoUpload.querySelector('input[type="file"]');
    const previewArea = document.querySelector('.video-preview');
    const previewVideo = document.getElementById('previewVideo');
    
    if (!videoUpload || !fileInput || !previewArea || !previewVideo) return;
    
    // Handle file upload
    videoUpload.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            previewVideo.src = url;
            videoUpload.style.display = 'none';
            previewArea.style.display = 'block';
            
            // Animate preview
            gsap.from(previewArea, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    });
    
    // Video timeline
    const timeline = document.querySelector('.video-timeline');
    const timelineHandle = document.querySelector('.timeline-handle');
    
    if (timeline && timelineHandle) {
        previewVideo.addEventListener('timeupdate', () => {
            const progress = (previewVideo.currentTime / previewVideo.duration) * 100;
            timelineHandle.style.left = `${progress}%`;
        });
        
        timeline.addEventListener('click', (e) => {
            const rect = timeline.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const progress = x / rect.width;
            previewVideo.currentTime = progress * previewVideo.duration;
        });
    }
}

// Initialize editors
initializeEditors();

// Add toast styles
const style = document.createElement('style');
style.textContent = `
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background-color: var(--success);
        color: white;
        border-radius: var(--border-radius);
        box-shadow: var(--card-shadow);
        z-index: 1100;
    }
`;
document.head.appendChild(style); 