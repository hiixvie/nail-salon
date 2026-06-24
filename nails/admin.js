// ===== LOGIN FUNCTIONALITY =====
const loginForm = document.getElementById('login-form');
const loginPage = document.getElementById('login-page');
const adminDashboard = document.getElementById('admin-dashboard');
const loginError = document.getElementById('login-error');

// Check if already logged in
if (localStorage.getItem('adminLoggedIn') === 'true') {
    showDashboard();
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        // Simple validation (in production, use proper authentication)
        if (username === 'admin' && password === 'grace2024') {
            localStorage.setItem('adminLoggedIn', 'true');
            showDashboard();
            showToast('Welcome back!', 'success');
        } else {
            loginError.textContent = 'Invalid username or password';
            showToast('Login failed', 'error');
        }
    });
}

function showDashboard() {
    loginPage.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
    loadDashboardData();
}

// Logout functionality
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminLoggedIn');
        adminDashboard.classList.add('hidden');
        loginPage.classList.remove('hidden');
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
        showToast('Logged out successfully', 'success');
    });
}

// ===== SIDEBAR TOGGLE =====
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });
}

// ===== NAVIGATION =====
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');
const pageTitle = document.getElementById('page-title');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        
        // Update nav items
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Show corresponding section
        sections.forEach(sec => {
            sec.classList.toggle('active', sec.id === `${section}-section`);
        });
        
        // Update page title
        const titleMap = {
            'dashboard': 'Dashboard',
            'appointments': 'Appointments',
            'services': 'Services',
            'portfolio': 'Portfolio',
            'messages': 'Messages',
            'settings': 'Settings'
        };
        if (pageTitle) pageTitle.textContent = titleMap[section] || 'Dashboard';
        
        // Close sidebar on mobile
        if (window.innerWidth <= 992) {
            sidebar.classList.remove('show');
        }
    });
});

// Card link navigation
const cardLinks = document.querySelectorAll('.card-link');
cardLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        const navItem = document.querySelector(`.nav-item[data-section="${section}"]`);
        if (navItem) navItem.click();
    });
});

// ===== MAIN SECTION TABS =====
const tabs = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.appointments-list-container');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        filterAppointments(target);
    });
});

function filterAppointments(status) {
    const items = document.querySelectorAll('.appointment-item');
    items.forEach(item => {
        if (status === 'all') {
            item.style.display = 'flex';
        } else {
            const itemStatus = item.dataset.status;
            item.style.display = itemStatus === status ? 'flex' : 'none';
        }
    });
}

// ===== SETTINGS TABS =====
const settingsTabs = document.querySelectorAll('.settings-tab');
const settingsPanels = document.querySelectorAll('.settings-panel');
settingsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.settings;
        settingsTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        settingsPanels.forEach(panel => {
            panel.classList.toggle('active', panel.id === `settings-${target}`);
        });
    });
});

// ===== MODAL FUNCTIONS =====
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
        });
    }
});

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ===== PORTFOLIO DELETE =====
document.querySelectorAll('.portfolio-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = btn.closest('.portfolio-item');
        if (!item) return;
        if (confirm('Delete this portfolio item?')) {
            item.remove();
            showToast('Portfolio item deleted', 'warning');
        }
    });
});

// ===== SERVICES EDIT & DELETE =====
document.querySelectorAll('.service-card').forEach(card => {
    // Add edit and delete buttons dynamically if not present
    if (!card.querySelector('.btn-edit')) {
        const actions = document.createElement('div');
        actions.className = 'service-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-primary btn-sm btn-edit';
        editBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> Edit';
        actions.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm btn-delete';
        deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Delete';
        actions.appendChild(deleteBtn);

        card.querySelector('.service-content').appendChild(actions);

        // Edit
        editBtn.addEventListener('click', () => {
            const name = prompt('Enter new service name:', card.querySelector('.service-name')?.textContent || '');
            const price = prompt('Enter new price:', card.querySelector('.service-price')?.textContent || '');
            if (name) card.querySelector('.service-name').textContent = name;
            if (price) card.querySelector('.service-price').textContent = price;
            showToast('Service updated', 'success');
        });

        // Delete
        deleteBtn.addEventListener('click', () => {
            if (confirm('Delete this service?')) {
                card.remove();
                showToast('Service deleted', 'warning');
            }
        });
    }
});

// ===== APPOINTMENTS EDIT & DELETE =====
document.querySelectorAll('.appointment-item').forEach(item => {
    // Add buttons if not exist
    if (!item.querySelector('.btn-edit')) {
        const actionsDiv = document.createElement('div');
        actionsDiv.style.display = 'flex';
        actionsDiv.style.gap = '8px';
        actionsDiv.style.marginLeft = 'auto';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-primary btn-sm btn-edit';
        editBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
        actionsDiv.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm btn-delete';
        deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        actionsDiv.appendChild(deleteBtn);

        item.appendChild(actionsDiv);

        editBtn.addEventListener('click', () => {
            const nameEl = item.querySelector('.appointment-name');
            const detailsEl = item.querySelector('.appointment-details');
            const newName = prompt('Edit client name:', nameEl?.textContent || '');
            const newDetails = prompt('Edit details:', detailsEl?.textContent || '');
            if (newName) nameEl.textContent = newName;
            if (newDetails) detailsEl.textContent = newDetails;
            showToast('Appointment updated', 'success');
        });

        deleteBtn.addEventListener('click', () => {
            if (confirm('Delete this appointment?')) {
                item.remove();
                showToast('Appointment deleted', 'warning');
            }
        });
    }
});

// ===== MESSAGES =====
document.querySelectorAll('.message-item').forEach(item => {
    item.addEventListener('click', () => {
        item.classList.remove('unread');
        const body = item.querySelector('.message-body');
        if (body) body.classList.toggle('active');
    });
});

// ===== CURRENT DATE =====
function setCurrentDate() {
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('en-US', options);
    }
}

// ===== DATA MANAGEMENT SYSTEM =====
const DB_KEY = 'gelxbygrace_data';

// Default data structure
const defaultData = {
    appointments: [],
    messages: [],
    clients: [],
    services: []
};

// Initialize database
function initDB() {
    const existing = localStorage.getItem(DB_KEY);
    if (!existing) {
        localStorage.setItem(DB_KEY, JSON.stringify(defaultData));
    }
    return getDB();
}

function getDB() {
    return JSON.parse(localStorage.getItem(DB_KEY) || JSON.stringify(defaultData));
}

function saveDB(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ===== DASHBOARD DATA WITH REAL CALCULATIONS =====
function loadDashboardData() {
    setCurrentDate();
    
    const data = getDB();
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = data.appointments.filter(apt => apt.date === today);
    
    // Calculate stats from actual data
    const pending = data.appointments.filter(apt => apt.status === 'pending').length;
    const confirmed = data.appointments.filter(apt => apt.status === 'confirmed').length;
    const completed = data.appointments.filter(apt => apt.status === 'completed').length;
    const uniqueClients = [...new Set(data.appointments.map(apt => apt.clientPhone))].length;
    
    // Update stats
    const pendingStat = document.getElementById('stat-pending');
    const confirmedStat = document.getElementById('stat-confirmed');
    const completedStat = document.getElementById('stat-completed');
    const clientsStat = document.getElementById('stat-clients');
    
    if (pendingStat) pendingStat.textContent = pending;
    if (confirmedStat) confirmedStat.textContent = confirmed;
    if (completedStat) completedStat.textContent = completed;
    if (clientsStat) clientsStat.textContent = uniqueClients;
    
    // Update messages badge with count of pending bookings + unread messages
    const messagesBadge = document.getElementById('messages-badge');
    const unreadMessages = data.messages.filter(m => !m.read).length;
    const totalNotifications = pending + unreadMessages;
    if (messagesBadge) {
        messagesBadge.textContent = totalNotifications;
        messagesBadge.style.display = totalNotifications > 0 ? 'flex' : 'none';
    }
    
    // Load today's appointments
    loadTodayAppointments(todayAppointments);
    
    // Load recent messages
    loadRecentMessages(data.messages);
    
    // Load calendar with appointments
    updateCalendar();
    
    // Load appointments list
    renderAppointmentsList(data.appointments);
}

// ===== TODAY'S APPOINTMENTS =====
function loadTodayAppointments(appointments) {
    const todayList = document.getElementById('today-appointments');
    if (!todayList) return;
    
    if (appointments.length === 0) {
        todayList.innerHTML = '<div class="empty-state"><p>No appointments today</p></div>';
        return;
    }
    
    todayList.innerHTML = appointments.map(apt => `
        <div class="appointment-item" data-id="${apt.id}" data-status="${apt.status}">
            <div class="appointment-avatar">${apt.clientName.charAt(0)}</div>
            <div class="appointment-info">
                <div class="appointment-name">${apt.clientName}</div>
                <div class="appointment-details">${apt.time} - ${apt.service}</div>
            </div>
            <span class="appointment-status ${apt.status}">${apt.status}</span>
        </div>
    `).join('');
    
    // Add click handlers
    todayList.querySelectorAll('.appointment-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.dataset.id;
            showAppointmentDetail(id);
        });
    });
}

// ===== RECENT MESSAGES =====
function loadRecentMessages(messages) {
    const messagesList = document.getElementById('recent-messages');
    if (!messagesList) return;
    
    const recentMessages = messages.slice(-5).reverse();
    
    if (recentMessages.length === 0) {
        messagesList.innerHTML = '<div class="empty-state"><p>No messages yet</p></div>';
        return;
    }
    
    messagesList.innerHTML = recentMessages.map(msg => `
        <div class="message-item ${msg.read ? '' : 'unread'}" data-id="${msg.id}">
            <div class="message-avatar">${msg.clientName.charAt(0)}</div>
            <div class="message-content">
                <div class="message-name">
                    ${msg.clientName}
                    <span class="message-time">${formatTimeAgo(msg.createdAt)}</span>
                </div>
                <div class="message-preview">${msg.message.substring(0, 50)}...</div>
            </div>
        </div>
    `).join('');
    
    // Add click handlers
    messagesList.querySelectorAll('.message-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.dataset.id;
            markMessageAsRead(id);
        });
    });
}

function formatTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' min ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
    return Math.floor(seconds / 86400) + ' days ago';
}

function markMessageAsRead(id) {
    const data = getDB();
    const msgIndex = data.messages.findIndex(m => m.id === id);
    if (msgIndex > -1) {
        data.messages[msgIndex].read = true;
        saveDB(data);
        loadDashboardData();
    }
}

// ===== APPOINTMENTS CRUD OPERATIONS =====
function addAppointment(appointment) {
    const data = getDB();
    const newAppointment = {
        id: generateId(),
        ...appointment,
        status: 'pending',
        createdAt: Date.now()
    };
    data.appointments.push(newAppointment);
    saveDB(data);
    return newAppointment;
}

function updateAppointment(id, updates) {
    const data = getDB();
    const index = data.appointments.findIndex(apt => apt.id === id);
    if (index > -1) {
        data.appointments[index] = { ...data.appointments[index], ...updates };
        saveDB(data);
        return data.appointments[index];
    }
    return null;
}

function deleteAppointment(id) {
    const data = getDB();
    data.appointments = data.appointments.filter(apt => apt.id !== id);
    saveDB(data);
}

function getAppointment(id) {
    const data = getDB();
    return data.appointments.find(apt => apt.id === id);
}

// ===== APPOINTMENTS LIST RENDERING =====
function renderAppointmentsList(appointments, filterStatus = 'all') {
    const listContainer = document.getElementById('appointments-list');
    if (!listContainer) return;
    
    let filtered = appointments;
    if (filterStatus !== 'all') {
        filtered = appointments.filter(apt => apt.status === filterStatus);
    }
    
    // Sort by date and time
    filtered.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
    });
    
    if (filtered.length === 0) {
        listContainer.innerHTML = '<div class="empty-state"><p>No appointments found</p></div>';
        return;
    }
    
    listContainer.innerHTML = filtered.map(apt => `
        <div class="appointment-item" data-id="${apt.id}" data-status="${apt.status}">
            <div class="appointment-avatar">${apt.clientName.charAt(0)}</div>
            <div class="appointment-info">
                <div class="appointment-name">${apt.clientName}</div>
                <div class="appointment-details">${apt.date} at ${apt.time} - ${apt.service}</div>
                <div class="appointment-contact">${apt.clientPhone} | ${apt.clientEmail || 'No email'}</div>
            </div>
            <span class="appointment-status ${apt.status}">${apt.status}</span>
            <div class="appointment-actions">
                <button class="btn btn-sm btn-primary" onclick="showAppointmentDetail('${apt.id}')">View</button>
                <button class="btn btn-sm btn-danger" onclick="confirmDeleteAppointment('${apt.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function confirmDeleteAppointment(id) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        deleteAppointment(id);
        loadDashboardData();
        showToast('Appointment deleted', 'warning');
    }
}

// ===== APPOINTMENT DETAIL MODAL =====
function showAppointmentDetail(id) {
    const apt = getAppointment(id);
    if (!apt) return;
    
    const modal = document.getElementById('appointment-modal');
    const modalBody = document.getElementById('appointment-modal-body');
    const modalFooter = document.getElementById('appointment-modal-footer');
    
    if (!modal || !modalBody || !modalFooter) return;
    
    modalBody.innerHTML = `
        <div class="appointment-detail">
            <p><strong>Client:</strong> ${apt.clientName}</p>
            <p><strong>Phone:</strong> ${apt.clientPhone}</p>
            <p><strong>Email:</strong> ${apt.clientEmail || 'N/A'}</p>
            <p><strong>Service:</strong> ${apt.service}</p>
            <p><strong>Date:</strong> ${apt.date}</p>
            <p><strong>Time:</strong> ${apt.time}</p>
            <p><strong>Status:</strong> <span class="appointment-status ${apt.status}">${apt.status}</span></p>
            ${apt.notes ? `<p><strong>Notes:</strong> ${apt.notes}</p>` : ''}
        </div>
    `;
    
    let buttons = '';
    if (apt.status === 'pending') {
        buttons += `<button class="btn btn-success" onclick="updateAppointmentStatus('${apt.id}', 'confirmed')">Confirm</button>`;
    }
    if (apt.status === 'confirmed') {
        buttons += `<button class="btn btn-primary" onclick="updateAppointmentStatus('${apt.id}', 'completed')">Mark Complete</button>`;
    }
    if (apt.status !== 'completed' && apt.status !== 'rejected') {
        buttons += `<button class="btn btn-danger" onclick="updateAppointmentStatus('${apt.id}', 'rejected')">Reject</button>`;
    }
    buttons += `<button class="btn btn-secondary" onclick="closeModal('appointment-modal')">Close</button>`;
    
    modalFooter.innerHTML = buttons;
    modal.classList.add('show');
}

function updateAppointmentStatus(id, status) {
    updateAppointment(id, { status });
    closeModal('appointment-modal');
    loadDashboardData();
    showToast(`Appointment ${status}`, 'success');
}

// ===== CALENDAR WITH APPOINTMENTS =====
function updateCalendar() {
    const monthDisplay = document.getElementById('current-month');
    const calendarGrid = document.getElementById('calendar-grid');
    
    if (!monthDisplay || !calendarGrid) return;
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    monthDisplay.textContent = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Get appointments for this month
    const data = getDB();
    const monthAppointments = data.appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate.getFullYear() === year && aptDate.getMonth() === month;
    });
    
    // Day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let html = days.map(day => `<div class="calendar-day-header">${day}</div>`).join('');
    
    // Get first day of month and total days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    // Previous month days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
        html += `<div class="calendar-day other-month">${prevMonthDays - i}</div>`;
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const dayAppointments = monthAppointments.filter(apt => apt.date === dateStr);
        const isToday = year === today.getFullYear() && month === today.getMonth() && i === today.getDate();
        const hasAppointments = dayAppointments.length > 0;
        
        html += `<div class="calendar-day ${isToday ? 'today' : ''} ${hasAppointments ? 'has-appointments' : ''}" 
                     data-date="${dateStr}" onclick="showDayAppointments('${dateStr}')">${i}</div>`;
    }
    
    // Next month days
    const remainingDays = 42 - (firstDay + daysInMonth);
    for (let i = 1; i <= remainingDays; i++) {
        html += `<div class="calendar-day other-month">${i}</div>`;
    }
    
    calendarGrid.innerHTML = html;
}

function showDayAppointments(dateStr) {
    const data = getDB();
    const dayAppointments = data.appointments.filter(apt => apt.date === dateStr);
    
    // Switch to appointments tab and filter
    const appointmentsTab = document.querySelector('.tab-btn[data-tab="all"]');
    if (appointmentsTab) {
        tabs.forEach(t => t.classList.remove('active'));
        appointmentsTab.classList.add('active');
    }
    
    // Update list title
    const listTitle = document.getElementById('appointments-list-title');
    if (listTitle) {
        const formattedDate = new Date(dateStr).toLocaleDateString('en-US', { 
            weekday: 'long', month: 'long', day: 'numeric' 
        });
        listTitle.textContent = `Appointments for ${formattedDate}`;
    }
    
    // Render appointments for this day
    const listContainer = document.getElementById('appointments-list');
    if (listContainer && dayAppointments.length > 0) {
        renderAppointmentsList(dayAppointments);
    } else if (listContainer) {
        listContainer.innerHTML = '<div class="empty-state"><p>No appointments on this day</p></div>';
    }
}

// ===== EXPORT APPOINTMENTS TO CSV =====
function exportAppointmentsToCSV() {
    const data = getDB();
    const appointments = data.appointments;
    
    if (appointments.length === 0) {
        showToast('No appointments to export', 'error');
        return;
    }
    
    // CSV headers
    const headers = ['Client Name', 'Phone', 'Email', 'Service', 'Date', 'Time', 'Status', 'Notes', 'Created'];
    
    // CSV rows
    const rows = appointments.map(apt => [
        apt.clientName,
        apt.clientPhone,
        apt.clientEmail || '',
        apt.service,
        apt.date,
        apt.time,
        apt.status,
        apt.notes || '',
        new Date(apt.createdAt).toLocaleDateString()
    ]);
    
    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `appointments_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Appointments exported to CSV', 'success');
}

// ===== FILTER APPOINTMENTS BY TAB =====
function filterAppointments(status) {
    const data = getDB();
    renderAppointmentsList(data.appointments, status);
    
    const listTitle = document.getElementById('appointments-list-title');
    if (listTitle) {
        if (status === 'all') {
            listTitle.textContent = 'All Appointments';
        } else {
            listTitle.textContent = `${status.charAt(0).toUpperCase() + status.slice(1)} Appointments`;
        }
    }
}

// ===== ADD APPOINTMENT FORM =====
function showAddAppointmentForm() {
    const modal = document.getElementById('appointment-modal');
    const modalBody = document.getElementById('appointment-modal-body');
    const modalFooter = document.getElementById('appointment-modal-footer');
    
    if (!modal || !modalBody || !modalFooter) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    modalBody.innerHTML = `
        <form id="add-appointment-form">
            <div class="form-group">
                <label>Client Name *</label>
                <input type="text" id="apt-client-name" required placeholder="Enter client name">
            </div>
            <div class="form-group">
                <label>Phone Number *</label>
                <input type="tel" id="apt-client-phone" required placeholder="Enter phone number">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="apt-client-email" placeholder="Enter email address">
            </div>
            <div class="form-group">
                <label>Service *</label>
                <input type="text" id="apt-service" required placeholder="e.g., Gel Manicure">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Date *</label>
                    <input type="date" id="apt-date" required value="${today}">
                </div>
                <div class="form-group">
                    <label>Time *</label>
                    <input type="time" id="apt-time" required>
                </div>
            </div>
            <div class="form-group">
                <label>Notes</label>
                <textarea id="apt-notes" rows="3" placeholder="Any special requests or notes"></textarea>
            </div>
        </form>
    `;
    
    modalFooter.innerHTML = `
        <button class="btn btn-secondary" onclick="closeModal('appointment-modal')">Cancel</button>
        <button class="btn btn-primary" onclick="saveNewAppointment()">Save Appointment</button>
    `;
    
    modal.classList.add('show');
}

function saveNewAppointment() {
    const name = document.getElementById('apt-client-name').value;
    const phone = document.getElementById('apt-client-phone').value;
    const email = document.getElementById('apt-client-email').value;
    const service = document.getElementById('apt-service').value;
    const date = document.getElementById('apt-date').value;
    const time = document.getElementById('apt-time').value;
    const notes = document.getElementById('apt-notes').value;
    
    if (!name || !phone || !service || !date || !time) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    addAppointment({
        clientName: name,
        clientPhone: phone,
        clientEmail: email,
        service: service,
        date: date,
        time: time,
        notes: notes
    });
    
    closeModal('appointment-modal');
    loadDashboardData();
    showToast('Appointment added successfully', 'success');
}

// ===== SAMPLE DATA FOR DEMO =====
function loadSampleData() {
    const data = getDB();
    
    if (data.appointments.length === 0) {
        // Add sample appointments
        const today = new Date();
        const sampleAppointments = [
            { clientName: 'Sarah Johnson', clientPhone: '555-0101', clientEmail: 'sarah@email.com', service: 'Gel Manicure', date: formatDate(today), time: '10:00', status: 'pending' },
            { clientName: 'Emily Davis', clientPhone: '555-0102', clientEmail: 'emily@email.com', service: 'Pedicure', date: formatDate(today), time: '11:30', status: 'confirmed' },
            { clientName: 'Jessica Wilson', clientPhone: '555-0103', clientEmail: 'jessica@email.com', service: 'Nail Art', date: formatDate(today), time: '14:00', status: 'pending' },
            { clientName: 'Ashley Brown', clientPhone: '555-0104', clientEmail: 'ashley@email.com', service: 'Gel Extensions', date: formatDate(addDays(today, 1)), time: '09:00', status: 'pending' },
            { clientName: 'Rachel Green', clientPhone: '555-0105', clientEmail: 'rachel@email.com', service: 'Manicure', date: formatDate(addDays(today, 2)), time: '15:00', status: 'confirmed' },
            { clientName: 'Monica Geller', clientPhone: '555-0106', clientEmail: 'monica@email.com', service: 'Gel Manicure', date: formatDate(addDays(today, -1)), time: '11:00', status: 'completed' },
            { clientName: 'Phoebe Buffay', clientPhone: '555-0107', clientEmail: 'phoebe@email.com', service: 'Spa Pedicure', date: formatDate(addDays(today, -2)), time: '13:00', status: 'completed' }
        ];
        
        sampleAppointments.forEach(apt => addAppointment(apt));
    }
    
    if (data.messages.length === 0) {
        // Add sample messages
        const sampleMessages = [
            { clientName: 'Ashley Brown', clientEmail: 'ashley@email.com', subject: 'Appointment Request', message: 'Hi! I wanted to book an appointment for next week. What times are available?', read: false },
            { clientName: 'Rachel Green', clientEmail: 'rachel@email.com', subject: 'Thank You', message: 'Thank you so much for my nails! They look amazing and lasted forever. Will definitely be back!', read: true },
            { clientName: 'Monica Geller', clientEmail: 'monica@email.com', subject: 'Question about services', message: 'Hi, I was wondering if you offer shellac nails? I would love to try them.', read: false }
        ];
        
        sampleMessages.forEach((msg, index) => {
            data.messages.push({
                id: generateId(),
                ...msg,
                replied: false,
                createdAt: Date.now() - (index * 3600000)
            });
        });
        saveDB(data);
    }
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize day toggles
    ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach(day => {
        toggleDay(day);
    });
    
    // Initialize database
    initDB();
    
    // Load sample data for demo
    loadSampleData();
    
    // Initialize add appointment button
    initAppointmentButtons();
    
    // Load dashboard data (this will also initialize calendar and appointments list)
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
    }
});

// ===== ADD SERVICE =====
const addServiceBtn = document.getElementById('add-service-btn');
if (addServiceBtn) {
    addServiceBtn.addEventListener('click', () => {
        const modal = document.getElementById('service-modal');
        const title = document.getElementById('service-modal-title');
        if (modal) {
            modal.classList.add('show');
            title.textContent = 'Add Service';
            document.getElementById('service-form').reset();
            document.getElementById('service-id').value = '';
            document.getElementById('service-image-preview').innerHTML = '';
        }
    });
}

function saveService() {
    const name = document.getElementById('service-name').value;
    const description = document.getElementById('service-description').value;
    const price = document.getElementById('service-price').value;
    const imageUrl = document.getElementById('service-image-url').value;
    
    if (!name || !price) {
        showToast('Please fill in required fields', 'error');
        return;
    }
    
    const servicesGrid = document.getElementById('services-grid');
    if (servicesGrid) {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.innerHTML = `
            ${imageUrl ? `<img src="${imageUrl}" alt="${name}" class="service-image">` : '<div class="service-image" style="background: var(--primary-light); display: flex; align-items: center; justify-content: center;"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div>'}
            <div class="service-content">
                <h3 class="service-name">${name}</h3>
                <p class="service-description">${description || 'No description'}</p>
                <p class="service-price">${price}</p>
            </div>
        `;
        servicesGrid.appendChild(serviceCard);
        
        // Add edit/delete buttons
        const actions = document.createElement('div');
        actions.className = 'service-actions';
        actions.innerHTML = `
            <button class="btn btn-primary btn-sm btn-edit">Edit</button>
            <button class="btn btn-danger btn-sm btn-delete">Delete</button>
        `;
        serviceCard.querySelector('.service-content').appendChild(actions);
        
        // Add event listeners
        actions.querySelector('.btn-edit').addEventListener('click', () => {
            const newName = prompt('Enter new service name:', name);
            const newPrice = prompt('Enter new price:', price);
            if (newName) serviceCard.querySelector('.service-name').textContent = newName;
            if (newPrice) serviceCard.querySelector('.service-price').textContent = newPrice;
            showToast('Service updated', 'success');
        });
        
        actions.querySelector('.btn-delete').addEventListener('click', () => {
            if (confirm('Delete this service?')) {
                serviceCard.remove();
                showToast('Service deleted', 'warning');
            }
        });
    }
    
    closeModal('service-modal');
    showToast('Service added successfully', 'success');
}

// ===== ADD PORTFOLIO =====
const addPortfolioBtn = document.getElementById('add-portfolio-btn');
if (addPortfolioBtn) {
    addPortfolioBtn.addEventListener('click', () => {
        const modal = document.getElementById('portfolio-modal');
        if (modal) {
            modal.classList.add('show');
            document.getElementById('portfolio-form').reset();
            document.getElementById('portfolio-id').value = '';
            document.getElementById('portfolio-image-preview').innerHTML = '';
        }
    });
}

function previewPortfolioImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('portfolio-image-preview');
            if (preview) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            }
            document.getElementById('portfolio-image-url').value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function savePortfolioItem() {
    const imageInput = document.getElementById('portfolio-image');
    const caption = document.getElementById('portfolio-caption').value;
    
    if (!imageInput.files[0]) {
        showToast('Please select an image', 'error');
        return;
    }
    
    const portfolioGrid = document.getElementById('portfolio-grid');
    if (portfolioGrid) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const portfolioItem = document.createElement('div');
            portfolioItem.className = 'portfolio-item';
            portfolioItem.innerHTML = `
                <img src="${e.target.result}" alt="${caption || 'Portfolio Image'}">
                ${caption ? `<div class="portfolio-overlay"><p class="portfolio-caption">${caption}</p></div>` : ''}
                <button class="portfolio-delete">&times;</button>
            `;
            portfolioGrid.appendChild(portfolioItem);
            
            // Add delete functionality
            portfolioItem.querySelector('.portfolio-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Delete this portfolio item?')) {
                    portfolioItem.remove();
                    showToast('Portfolio item deleted', 'warning');
                }
            });
        };
        reader.readAsDataURL(imageInput.files[0]);
    }
    
    closeModal('portfolio-modal');
    showToast('Portfolio image added', 'success');
}

// ===== SEND REPLY =====
function sendReply() {
    const replyMessage = document.getElementById('reply-message').value;
    if (!replyMessage.trim()) {
        showToast('Please enter a message', 'error');
        return;
    }
    
    // In a real app, this would send to a server
    showToast('Reply sent successfully!', 'success');
    closeModal('reply-modal');
    document.getElementById('reply-form').reset();
}

// ===== TOGGLE DAY (for business hours) =====
function toggleDay(day) {
    const closedCheckbox = document.getElementById(`${day}-closed`);
    const openTime = document.getElementById(`${day}-open`);
    const closeTime = document.getElementById(`${day}-close`);
    
    if (closedCheckbox && openTime && closeTime) {
        if (closedCheckbox.checked) {
            openTime.disabled = true;
            closeTime.disabled = true;
            openTime.value = '';
            closeTime.value = '';
        } else {
            openTime.disabled = false;
            closeTime.disabled = false;
            if (!openTime.value) openTime.value = '10:00';
            if (!closeTime.value) closeTime.value = '19:00';
        }
    }
}

// ===== SETTINGS FORMS =====
const hoursForm = document.getElementById('hours-form');
if (hoursForm) {
    hoursForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Business hours saved!', 'success');
    });
}

const holidayForm = document.getElementById('holiday-form');
if (holidayForm) {
    holidayForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('holiday-name').value;
        const date = document.getElementById('holiday-date').value;
        
        if (name && date) {
            const holidaysList = document.getElementById('holidays-list');
            if (holidaysList) {
                const holidayItem = document.createElement('div');
                holidayItem.className = 'holiday-item';
                holidayItem.innerHTML = `
                    <span class="holiday-name">${name}</span>
                    <span class="holiday-date">${new Date(date).toLocaleDateString()}</span>
                `;
                holidaysList.appendChild(holidayItem);
            }
            holidayForm.reset();
            showToast('Holiday added!', 'success');
        }
    });
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Contact information saved!', 'success');
    });
}

const policyForm = document.getElementById('policy-form');
if (policyForm) {
    policyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Policies saved!', 'success');
    });
}

const securityForm = document.getElementById('security-form');
if (securityForm) {
    securityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Security settings updated!', 'success');
    });
}

// ===== CALENDAR NAVIGATION =====
const prevMonth = document.getElementById('prev-month');
const nextMonth = document.getElementById('next-month');
let currentMonth = new Date();

if (prevMonth) {
    prevMonth.addEventListener('click', () => {
        currentMonth.setMonth(currentMonth.getMonth() - 1);
        updateCalendar();
    });
}

if (nextMonth) {
    nextMonth.addEventListener('click', () => {
        currentMonth.setMonth(currentMonth.getMonth() + 1);
        updateCalendar();
    });
}

// ===== EXPORT APPOINTMENTS =====
const exportBtn = document.getElementById('export-appointments');
if (exportBtn) {
    exportBtn.addEventListener('click', () => {
        exportAppointmentsToCSV();
    });
}

// ===== ADD APPOINTMENT BUTTON =====
function initAppointmentButtons() {
    // Check if add appointment button exists, if not create one
    let addAptBtn = document.querySelector('.add-appointment-btn');
    if (!addAptBtn) {
        const sectionHeader = document.querySelector('#appointments-section .section-header');
        if (sectionHeader) {
            addAptBtn = document.createElement('button');
            addAptBtn.className = 'btn btn-primary add-appointment-btn';
            addAptBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Add Appointment';
            addAptBtn.onclick = showAddAppointmentForm;
            sectionHeader.appendChild(addAptBtn);
        }
    }
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize day toggles
    ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach(day => {
        toggleDay(day);
    });
    
    // Initialize database
    initDB();
    
    // Load sample data for demo
    loadSampleData();
    
    // Initialize add appointment button
    initAppointmentButtons();
    
    // Load dashboard data (this will also initialize calendar and appointments list)
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
    }
});

