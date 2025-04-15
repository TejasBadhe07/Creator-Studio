// Content Queue Management
class ContentQueue {
    constructor() {
        this.queueItems = [];
        this.currentFilter = 'all';
        this.initializeEventListeners();
        this.initializeStyles();
    }

    initializeStyles() {
        // Add styles only if they don't exist
        if (!document.querySelector('#schedule-styles')) {
            const style = document.createElement('style');
            style.id = 'schedule-styles';
            style.textContent = `
                .content-type-selector,
                .platform-selector,
                .schedule-options {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                    gap: 1rem;
                    margin-top: 0.5rem;
                }

                .type-option,
                .platform-option,
                .schedule-option {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    border: 2px solid var(--border-color);
                    border-radius: var(--border-radius);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .type-option i,
                .platform-option i,
                .schedule-option i {
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                    color: var(--text-light);
                }

                .type-option.selected,
                .platform-option.selected,
                .schedule-option.selected {
                    border-color: var(--primary);
                    background: rgba(99, 102, 241, 0.1);
                }

                .type-option:hover,
                .platform-option:hover,
                .schedule-option:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--card-shadow);
                }

                .error-message {
                    background: var(--danger);
                    color: white;
                    padding: 0.75rem;
                    border-radius: var(--border-radius);
                    margin-bottom: 1rem;
                    animation: fadeIn 0.3s ease;
                }

                textarea {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius);
                    background: var(--background-light);
                    resize: vertical;
                }

                .schedule-datetime {
                    margin-top: 1rem;
                }

                .schedule-datetime input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius);
                    background: var(--background-light);
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }

                @keyframes slideIn {
                    from { transform: translateX(-20px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }

                .modal-content {
                    background: var(--card-bg);
                    border-radius: var(--border-radius);
                    width: 90%;
                    max-width: 500px;
                    box-shadow: var(--card-shadow);
                }

                .modal-header {
                    padding: 1rem;
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .modal-body {
                    padding: 1rem;
                }

                .modal-footer {
                    padding: 1rem;
                    border-top: 1px solid var(--border-color);
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                }

                .form-group {
                    margin-bottom: 1rem;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: var(--text-light);
                }

                .form-group input,
                .form-group select {
                    width: 100%;
                    padding: 0.5rem;
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius);
                    background: var(--background-light);
                }
            `;
            document.head.appendChild(style);
        }
    }

    initializeEventListeners() {
        console.log('Initializing event listeners...');
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => this.filterContent(btn.dataset.filter));
        });

        // Add Content button
        const addButton = document.getElementById('addToQueue');
        console.log('Add button found:', addButton);
        
        if (addButton) {
            addButton.addEventListener('click', () => {
                console.log('Add Content button clicked');
                this.showAddContentModal();
            });
        } else {
            console.error('Add Content button not found!');
        }

        // Calendar navigation
        const prevMonthBtn = document.getElementById('prevMonth');
        const nextMonthBtn = document.getElementById('nextMonth');
        
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => this.navigateMonth('prev'));
        }
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => this.navigateMonth('next'));
        }
    }

    filterContent(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        // Filter queue items
        const queueItems = document.querySelectorAll('.queue-item');
        queueItems.forEach(item => {
            const status = item.querySelector('.content-status').textContent.toLowerCase();
            const shouldShow = filter === 'all' || status === filter;
            item.style.display = shouldShow ? 'flex' : 'none';
            
            // Add animation
            if (shouldShow) {
                item.style.animation = 'fadeIn 0.3s ease';
            }
        });
    }

    showAddContentModal() {
        console.log('Showing add content modal...');
        
        // Check if modal already exists
        if (document.querySelector('.modal')) {
            console.log('Modal already exists, removing old one');
            document.querySelector('.modal').remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add New Content</h3>
                    <button class="close-modal"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <form id="addContentForm">
                        <div class="form-group">
                            <label>Content Type</label>
                            <div class="content-type-selector">
                                <div class="type-option" data-type="text">
                                    <i class="fas fa-file-alt"></i>
                                    <span>Text Post</span>
                                </div>
                                <div class="type-option" data-type="image">
                                    <i class="fas fa-image"></i>
                                    <span>Image Post</span>
                                </div>
                                <div class="type-option" data-type="video">
                                    <i class="fas fa-video"></i>
                                    <span>Video Post</span>
                                </div>
                            </div>
                            <input type="hidden" name="contentType" required>
                        </div>
                        <div class="form-group">
                            <label>Title</label>
                            <input type="text" name="title" required placeholder="Enter content title">
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea name="description" rows="3" placeholder="Enter content description"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Platforms</label>
                            <div class="platform-selector">
                                <div class="platform-option" data-platform="twitter">
                                    <i class="fab fa-twitter"></i>
                                    <span>Twitter</span>
                                </div>
                                <div class="platform-option" data-platform="instagram">
                                    <i class="fab fa-instagram"></i>
                                    <span>Instagram</span>
                                </div>
                                <div class="platform-option" data-platform="facebook">
                                    <i class="fab fa-facebook"></i>
                                    <span>Facebook</span>
                                </div>
                                <div class="platform-option" data-platform="linkedin">
                                    <i class="fab fa-linkedin"></i>
                                    <span>LinkedIn</span>
                                </div>
                            </div>
                            <input type="hidden" name="platforms" required>
                        </div>
                        <div class="form-group">
                            <label>Schedule Time</label>
                            <div class="schedule-options">
                                <div class="schedule-option" data-schedule="now">
                                    <i class="fas fa-bolt"></i>
                                    <span>Post Now</span>
                                </div>
                                <div class="schedule-option" data-schedule="later">
                                    <i class="fas fa-clock"></i>
                                    <span>Schedule Later</span>
                                </div>
                            </div>
                            <div class="schedule-datetime" style="display: none;">
                                <input type="datetime-local" name="scheduleTime">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" id="cancelAdd">Cancel</button>
                    <button class="btn-primary" id="saveContent">Save Content</button>
                </div>
            </div>
        `;

        console.log('Appending modal to body...');
        document.body.appendChild(modal);

        // Initialize modal interactions
        this.initializeModalInteractions(modal);

        // Add event listeners for modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            console.log('Close modal clicked');
            this.closeModal(modal);
        });
        
        modal.querySelector('#cancelAdd').addEventListener('click', () => {
            console.log('Cancel button clicked');
            this.closeModal(modal);
        });
        
        modal.querySelector('#saveContent').addEventListener('click', () => {
            console.log('Save content clicked');
            this.saveContent(modal);
        });

        // Add click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                console.log('Clicked outside modal');
                this.closeModal(modal);
            }
        });
    }

    initializeModalInteractions(modal) {
        // Content type selection
        const typeOptions = modal.querySelectorAll('.type-option');
        typeOptions.forEach(option => {
            option.addEventListener('click', () => {
                typeOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                modal.querySelector('input[name="contentType"]').value = option.dataset.type;
            });
        });

        // Platform selection
        const platformOptions = modal.querySelectorAll('.platform-option');
        platformOptions.forEach(option => {
            option.addEventListener('click', () => {
                option.classList.toggle('selected');
                const selectedPlatforms = Array.from(modal.querySelectorAll('.platform-option.selected'))
                    .map(opt => opt.dataset.platform);
                modal.querySelector('input[name="platforms"]').value = selectedPlatforms.join(',');
            });
        });

        // Schedule options
        const scheduleOptions = modal.querySelectorAll('.schedule-option');
        const datetimeInput = modal.querySelector('.schedule-datetime');
        
        scheduleOptions.forEach(option => {
            option.addEventListener('click', () => {
                scheduleOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                
                if (option.dataset.schedule === 'later') {
                    datetimeInput.style.display = 'block';
                } else {
                    datetimeInput.style.display = 'none';
                }
            });
        });
    }

    closeModal(modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }

    saveContent(modal) {
        const form = modal.querySelector('#addContentForm');
        const formData = new FormData(form);
        
        // Validate form
        if (!this.validateForm(formData)) {
            return;
        }
        
        // Create new queue item
        const newItem = {
            id: Date.now(),
            type: formData.get('contentType'),
            title: formData.get('title'),
            description: formData.get('description'),
            platforms: formData.get('platforms').split(','),
            scheduleTime: formData.get('scheduleTime') ? new Date(formData.get('scheduleTime')) : new Date(),
            status: 'draft'
        };

        this.queueItems.push(newItem);
        this.addQueueItemToDOM(newItem);
        this.closeModal(modal);
    }

    validateForm(formData) {
        // Basic validation
        if (!formData.get('contentType')) {
            this.showError('Please select a content type');
            return false;
        }
        if (!formData.get('title')) {
            this.showError('Please enter a title');
            return false;
        }
        if (!formData.get('platforms')) {
            this.showError('Please select at least one platform');
            return false;
        }
        return true;
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        document.querySelector('.modal-body').prepend(errorDiv);
        
        setTimeout(() => {
            errorDiv.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
    }

    addQueueItemToDOM(item) {
        const queueList = document.querySelector('.queue-list');
        const platforms = item.platforms.map(platform => 
            `<span class="platform-tag">${platform}</span>`
        ).join('');

        const queueItem = document.createElement('div');
        queueItem.className = 'queue-item';
        queueItem.innerHTML = `
            <div class="queue-content">
                <div class="content-type">
                    <i class="fas fa-${this.getContentTypeIcon(item.type)}"></i>
                </div>
                <div class="queue-details">
                    <h4>${item.title}</h4>
                    <p class="queue-meta">
                        <span class="schedule-time">${this.formatDate(item.scheduleTime)}</span>
                        <span class="content-status ${item.status}">${item.status}</span>
                    </p>
                    <div class="content-platforms">
                        ${platforms}
                    </div>
                </div>
            </div>
            <div class="queue-actions">
                <button class="btn-icon" title="Edit" onclick="contentQueue.editItem(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" title="Reschedule" onclick="contentQueue.rescheduleItem(${item.id})">
                    <i class="fas fa-calendar-alt"></i>
                </button>
                <button class="btn-icon" title="Delete" onclick="contentQueue.deleteItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        queueList.appendChild(queueItem);
        queueItem.style.animation = 'slideIn 0.3s ease';
    }

    getContentTypeIcon(type) {
        const icons = {
            text: 'file-alt',
            image: 'image',
            video: 'video'
        };
        return icons[type] || 'file-alt';
    }

    formatDate(date) {
        return new Date(date).toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    editItem(id) {
        const item = this.queueItems.find(item => item.id === id);
        if (item) {
            // Show edit modal with pre-filled data
            this.showEditModal(item);
        }
    }

    rescheduleItem(id) {
        const item = this.queueItems.find(item => item.id === id);
        if (item) {
            // Show reschedule modal
            this.showRescheduleModal(item);
        }
    }

    deleteItem(id) {
        const item = this.queueItems.find(item => item.id === id);
        if (item) {
            // Show confirmation modal
            this.showDeleteConfirmation(item);
        }
    }

    navigateMonth(direction) {
        if (direction === 'prev') {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        } else {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        }
        this.updateCalendarHeader();
        this.renderCalendarDays();
    }
}

// Calendar Management
class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.initializeCalendar();
    }

    initializeCalendar() {
        this.updateCalendarHeader();
        this.renderCalendarDays();
    }

    updateCalendarHeader() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
        const currentMonth = monthNames[this.currentDate.getMonth()];
        const currentYear = this.currentDate.getFullYear();
        
        document.querySelector('.current-month').textContent = `${currentMonth} ${currentYear}`;
    }

    renderCalendarDays() {
        const calendarDays = document.querySelector('.calendar-days');
        calendarDays.innerHTML = '';

        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendarDays.appendChild(emptyCell);
        }

        // Add days of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            dayCell.textContent = day;

            // Add today's date highlight
            const today = new Date();
            if (day === today.getDate() && 
                this.currentDate.getMonth() === today.getMonth() && 
                this.currentDate.getFullYear() === today.getFullYear()) {
                dayCell.classList.add('today');
            }

            // Add click event
            dayCell.addEventListener('click', () => this.handleDayClick(day));

            calendarDays.appendChild(dayCell);
        }
    }

    handleDayClick(day) {
        const clickedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
        console.log('Selected date:', clickedDate);
        // Here you can add logic to show content scheduled for this day
    }

    navigateMonth(direction) {
        if (direction === 'prev') {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        } else {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        }
        this.updateCalendarHeader();
        this.renderCalendarDays();
    }
}

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    // Wait for GSAP to be fully loaded
    if (typeof gsap !== 'undefined') {
        gsap.config({
            nullTargetWarn: false
        });
    }

    const contentQueue = new ContentQueue();
    const calendar = new Calendar();

    // Initialize GSAP animations safely
    if (typeof gsap !== 'undefined') {
        gsap.from('.queue-item', {
            duration: 0.5,
            opacity: 0,
            y: 20,
            stagger: 0.1,
            ease: 'power2.out'
        });

        gsap.from('.calendar-day', {
            duration: 0.3,
            opacity: 0,
            scale: 0.8,
            stagger: 0.02,
            ease: 'back.out(1.7)'
        });
    }
}); 