
document.addEventListener('DOMContentLoaded', () => {
    updateLoginStatus();
});

// Toggle Menu Mobile (Nút 3 gạch)
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        menu.classList.add('animate-slide-down');
    } else {
        menu.classList.add('hidden');
        menu.classList.remove('animate-slide-down');
    }
}

function updateLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userName = localStorage.getItem('userName') || "Người dùng";
    const userText = document.getElementById('user-status-text');
    const userIcon = document.getElementById('user-status-icon');
    const loginBtn = userText?.parentElement;
    
    if (userText && userIcon) {
        if (isLoggedIn) {
            userText.innerText = userName + " (Đăng xuất)"; 
            userIcon.innerText = "✓";
            if(loginBtn) {
                loginBtn.classList.add('bg-[#E8F3EE]', 'border-[#A8BCA1]', 'text-[#1B2A24]');
                loginBtn.classList.remove('bg-white');
            }
        } else {
            userText.innerText = "Đăng nhập"; 
            userIcon.innerText = "👤";
            if(loginBtn) {
                loginBtn.classList.remove('bg-[#E8F3EE]', 'border-[#A8BCA1]', 'text-[#1B2A24]');
                loginBtn.classList.add('bg-white');
            }
        }
    }
}

function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
    document.getElementById(id).classList.add('flex');
}
function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
    document.getElementById(id).classList.remove('flex');
}

function switchToRegister() { closeModal('loginModal'); openModal('registerModal'); }
function switchToLogin() { closeModal('registerModal'); openModal('loginModal'); }

function openLogin() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?")) {
            doLogout();
        }
    } else {
        openModal('loginModal');
    }
}

function doLogin() {
    const email = document.getElementById('loginEmail')?.value;
    if (!email) { alert("Vui lòng nhập email!"); return; }
    localStorage.setItem('isLoggedIn', 'true');
    const nameFromEmail = email.split('@')[0];
    localStorage.setItem('userName', nameFromEmail);
    updateLoginStatus();
    closeModal('loginModal');
}

function loginWithGoogle() {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', 'Nguyễn Duy Khánh'); 
    updateLoginStatus();
    closeModal('loginModal');
}

function doRegister() {
    const name = document.getElementById('regName')?.value;
    const email = document.getElementById('regEmail')?.value;
    const password = document.getElementById('regPassword')?.value;
    if (!name || !email || !password) { alert("Vui lòng điền đầy đủ thông tin!"); return; }
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', name);
    updateLoginStatus();
    closeModal('registerModal');
}

function doLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    updateLoginStatus();
}

let selectedCourse = null;
let selectedPrice = null;
function buyCourse(courseName, price) {
    if(localStorage.getItem('isLoggedIn') !== 'true') {
        alert("Vui lòng đăng nhập trước khi mua khóa học!");
        openModal('loginModal');
        return;
    }
    selectedCourse = courseName;
    selectedPrice = price;
    document.getElementById('checkoutCourseName').innerText = courseName;
    document.getElementById('checkoutPrice').innerText = price;
    openModal('checkoutModal');
}
function processPayment() {
    alert(`Thanh toán thành công khoá học:\n${selectedCourse}\nSố tiền: ${selectedPrice}\nCảm ơn bạn đã tin tưởng TQ!`);
    closeModal('checkoutModal');
}
