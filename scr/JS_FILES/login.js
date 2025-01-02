// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    GoogleAuthProvider, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzULbw7o8LBG8JGcDMj7Be3C4JFEIr19o",
  authDomain: "login-8efac.firebaseapp.com",
  projectId: "login-8efac",
  storageBucket: "login-8efac.firebasestorage.app",
  messagingSenderId: "2495094564",
  appId: "1:2495094564:web:ad5e61335dff8377cf1db1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const provider = new GoogleAuthProvider();

// Đăng nhập bằng GG
const googleLogin = document.getElementById("btnGG");
if (googleLogin) {
    googleLogin.addEventListener("click", function () {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                console.log("Google User:", user);
                window.location.href = "index.htm";
            })
            .catch((error) => {
                console.error("Google Login Error:", error.message);
                alert("Google Login failed: " + error.message);
            });
    });
}

//Đăng ký bằng Email + Mật khẩu
const signUpButton = document.getElementById('signUp');
if (signUpButton) {
    signUpButton.addEventListener('click', (event) => {
        event.preventDefault();
        const email = document.getElementById('rEmail').value;
        const password = document.getElementById('rPassword').value;
        const cpassword = document.getElementById('cPassword').value;

        if (password !== cpassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }
        
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                set(ref(database, 'users/' + user.uid), {
                    email: email,
                    password: password,
                });

                alert("Đăng ký thành công!");
                window.location.href = 'dangnhap.htm';
            })
            .catch((error) => {
                console.error("Sign Up Error:", error.message);
                alert("Đăng ký thất bại: " + error.message);
            });
    });
}


//Đăng nhập bằng Email + Mật khẩu
const signInButton = document.getElementById('signIn');
if (signInButton) {
    signInButton.addEventListener('click', (event) => {
        event.preventDefault();
        const email = document.getElementById('email_field').value;
        const password = document.getElementById('password_field').value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                localStorage.setItem('loggedInUserId', user.uid);
                const dt = new Date();
                update(ref(database, 'users/' + user.uid), { last_login: dt });
                alert("Đăng nhập thành công!");
                window.location.href = 'index.htm';
            })
            .catch((error) => {
                console.error("Sign In Error:", error.message);
                alert("Đăng nhập thất bại: Tài khoản hoặc mật khẩu không đúng.");
            });
    });
}

onAuthStateChanged(auth, (user) => {
    const userAccountDiv = document.getElementById('user-account');
    const loggedInAccountDiv = document.getElementById('logged-in-account');
    const userNameSpan = document.getElementById('user-name');
    const logoutButton = document.getElementById('logout-button');

    if (user) {
        // Nếu người dùng đã đăng nhập
        const displayName = user.displayName || "Người dùng";
        userAccountDiv.style.display = 'none';
        loggedInAccountDiv.style.display = 'block';
        userNameSpan.textContent = `Xin chào ${displayName}!`;

        // Xử lý sự kiện đăng xuất
        logoutButton.addEventListener('click', () => {
            auth.signOut().then(() => {
                alert("Đăng xuất thành công!");
                window.location.reload(); // Tải lại trang sau khi đăng xuất
            }).catch((error) => {
                console.error("Logout Error:", error.message);
            });
        });
    } else {
        // Nếu chưa có người dùng đăng nhập
        userAccountDiv.style.display = 'block'; // Hiển thị thẻ chưa đăng nhập
        loggedInAccountDiv.style.display = 'none'; // Ẩn thẻ đã đăng nhập
    }
});

// Account
document.getElementById('btn-user').addEventListener('click', function () {
    const dropdownMenu = document.getElementById('dropdown-menu');
    // Toggle hiển thị menu
    if (dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '') 
    {
        dropdownMenu.style.display = 'block';
    } 
    else 
    {
        dropdownMenu.style.display = 'none';
    }
});

// Ẩn menu khi click bên ngoài
document.addEventListener('click', function (event) {
    const btnUser = document.getElementById('btn-user');
    const dropdownMenu = document.getElementById('dropdown-menu');
    if (!btnUser.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.style.display = 'none';
    }
});

// Xử lý sự kiện khi nhấn vào các nút trong menu
document.getElementById('upload-docs').addEventListener('click', function () {
    window.location.href = "upload.htm";
});

// document.getElementById('logout-button').addEventListener('click', function () {
//     alert('Bạn đã đăng xuất!');
// });

document.getElementById('like-document').addEventListener('click', function () {
    window.location.href = "likedocument.htm";
});