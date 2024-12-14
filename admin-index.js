function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.toggle-btn');
    sidebar.classList.toggle('expanded');
    toggleBtn.classList.toggle('rotate');
}
