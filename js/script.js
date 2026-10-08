
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
/* ==============================================================
   TÍNH NĂNG 1: LUYỆN NÓI HSKK (Web Speech API)
============================================================== */
function startSpeaking() {
    const btnText = document.getElementById('btn-speak-text');
    const recordDot = document.getElementById('record-dot');
    const resultBox = document.getElementById('speech-result');
    const userSpoken = document.getElementById('user-spoken-text');
    const feedbackMsg = document.getElementById('feedback-msg');

    // Kiểm tra trình duyệt có hỗ trợ nhận diện giọng nói không
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!window.SpeechRecognition) {
        alert("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói. Vui lòng dùng Google Chrome trên máy tính hoặc điện thoại.");
        return;
    }

    const recognition = new window.SpeechRecognition();
    recognition.lang = 'zh-CN'; // Set ngôn ngữ là Tiếng Trung
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function() {
        btnText.innerText = "Đang nghe... Vui lòng nói";
        recordDot.classList.add('scale-150', 'bg-green-500'); // Đổi màu hiệu ứng khi đang thu âm
        recordDot.classList.remove('bg-red-500');
    };

    recognition.onspeechend = function() {
        recognition.stop();
        btnText.innerText = "Đang xử lý...";
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        const targetPhrase = "你好中国"; // Câu mục tiêu (bỏ dấu phẩy để dễ so sánh)
        const cleanTranscript = transcript.replace(/[.,!?，。！？]/g, ""); // Xóa dấu câu khi nói

        // Hiển thị box kết quả
        resultBox.classList.remove('hidden');
        userSpoken.innerText = transcript;

        // So sánh chuỗi đơn giản
        if (cleanTranscript.includes("你好") || cleanTranscript.includes("中国") || cleanTranscript === targetPhrase) {
            feedbackMsg.innerText = "Tuyệt vời! Phát âm của bạn rất tốt (95/100 điểm).";
            feedbackMsg.className = "text-sm mt-2 font-medium text-green-600";
        } else {
            feedbackMsg.innerText = "Chưa chính xác lắm. Cố gắng nhấn rõ thanh điệu hơn nhé!";
            feedbackMsg.className = "text-sm mt-2 font-medium text-[#D4937B]";
        }

        // Reset nút
        btnText.innerText = "Nhấn để thử lại";
        recordDot.classList.remove('scale-150', 'bg-green-500');
        recordDot.classList.add('bg-red-500');
    };

    recognition.onerror = function(event) {
        alert("Lỗi nhận diện: " + event.error + ". Hãy đảm bảo bạn đã cấp quyền sử dụng Micro cho trang web.");
        btnText.innerText = "Nhấn để luyện nói";
        recordDot.classList.remove('scale-150', 'bg-green-500');
        recordDot.classList.add('bg-red-500');
    };

    recognition.start();
}


/* ==============================================================
   TÍNH NĂNG 2: CÔNG CỤ PHIÊN DỊCH (DEMO DICTIONARY)
============================================================== */
let isViToZh = true; // Cờ theo dõi hướng dịch: Mặc định Việt -> Trung

function swapLanguage() {
    isViToZh = !isViToZh;
    document.getElementById('lang-from').innerText = isViToZh ? "Việt" : "Trung";
    document.getElementById('lang-to').innerText = isViToZh ? "Trung" : "Việt";
    
    // Đảo đổi nội dung giữa ô nhập và ô kết quả
    const inputArea = document.getElementById('trans-input');
    const outputArea = document.getElementById('trans-output');
    const temp = inputArea.value;
    inputArea.value = outputArea.value;
    outputArea.value = temp;
}

function clearText() {
    document.getElementById('trans-input').value = "";
    document.getElementById('trans-output').value = "";
}

function copyTranslation() {
    const text = document.getElementById('trans-output').value;
    if(text) {
        navigator.clipboard.writeText(text);
        alert("Đã sao chép bản dịch!");
    }
}

// Từ điển thu nhỏ giả lập API Dịch thuật
const dictViToZh = {
    "xin chào": "你好",
    "cảm ơn": "谢谢",
    "tôi yêu bạn": "我爱你",
    "tạm biệt": "再见",
    "trung quốc": "中国",
    "xin chào trung quốc": "你好，中国"
};

const dictZhToVi = {
    "你好": "Xin chào",
    "谢谢": "Cảm ơn",
    "我爱你": "Tôi yêu bạn",
    "再见": "Tạm biệt",
    "中国": "Trung Quốc",
    "你好中国": "Xin chào Trung Quốc"
};

function doTranslate() {
    const input = document.getElementById('trans-input').value.trim().toLowerCase();
    const outputBox = document.getElementById('trans-output');
    
    if(!input) {
        outputBox.value = "";
        return;
    }

    let result = "";
    
    // So sánh dữ liệu trong từ điển giả lập
    if (isViToZh) {
        result = dictViToZh[input];
    } else {
        // Nếu là tiếng Trung, xóa khoảng trắng thừa trước khi tra
        const cleanInput = input.replace(/\s+/g, '');
        result = dictZhToVi[cleanInput];
    }

    // Nếu tìm thấy trong từ điển thì in ra, nếu không thì báo lỗi (Vì chưa có API thật)
    if (result) {
        outputBox.value = result;
    } else {
        outputBox.value = "[Bản Demo] Hệ thống dịch thuật thực tế cần tích hợp Google Translate API hoặc Baidu API. Vui lòng thử các từ khóa: Xin chào, Cảm ơn, Tạm biệt, Trung Quốc.";
    }
}
