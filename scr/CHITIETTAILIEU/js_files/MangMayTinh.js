// Phần nội dung
document.addEventListener("DOMContentLoaded", () => {
    const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const content = header.nextElementSibling; // Lấy phần nội dung kế tiếp
            const icon = header.querySelector("i");

            // Toggle hiển thị/ẩn phần nội dung
            if (content.style.display === "block") 
            {
                content.style.display = "none";
                icon.classList.remove("fa-minus");
                icon.classList.add("fa-plus");
            } 
            else 
            {
                content.style.display = "block";
                icon.classList.remove("fa-plus");
                icon.classList.add("fa-minus");
            }
        });
    });
});

// Xử lý đánh giá sao
let soSao = 0;
const stars = document.querySelectorAll('#saodanhgia i');

stars.forEach(star => {
    star.addEventListener('click', () => {
        soSao = parseInt(star.dataset.rating);

        // Reset tất cả sao về trạng thái chưa chọn
        stars.forEach(s => s.className = 'fa-regular fa-star');

        // Tô màu các sao được chọn
        for (let i = 0; i < soSao; i++) {
            stars[i].className = 'fa-solid fa-star';
        }
    });
});

// Mảng chứa danh sách đánh giá
let danhGiaList = [];

// Hàm để lưu đánh giá vào localStorage
function luuDanhGia() {
    localStorage.setItem('danhGiaList', JSON.stringify(danhGiaList));
}

// Hàm để tải đánh giá từ localStorage
function taiDanhGia() {
    const danhGiaDaLuu = localStorage.getItem('danhGiaList');
    if (danhGiaDaLuu) {
        danhGiaList = JSON.parse(danhGiaDaLuu);
    } else {
        // Dữ liệu mẫu nếu chưa có dữ liệu
        danhGiaList = [
            {
                user: 'Nguyễn Văn A',
                date: '01/03/2024',
                stars: 5,
                content: 'Tài liệu rất hữu ích và dễ hiểu!'
            },
            {
                user: 'Trần Thị B',
                date: '29/02/2024',
                stars: 4,
                content: 'Nội dung khá tốt, nhưng cần bổ sung thêm ví dụ.'
            }
        ];
        luuDanhGia(); // Lưu dữ liệu mẫu vào localStorage
    }
}

// Gửi đánh giá mới
function guiDanhGia() {
    const noiDung = document.getElementById('txtDanhGia').value.trim();

    if (soSao === 0) {
        alert('Vui lòng chọn số sao đánh giá!');
        return;
    }

    if (noiDung === '') {
        alert('Vui lòng nhập nội dung đánh giá!');
        return;
    }

    // Lấy thông tin người dùng từ localStorage (nếu có)
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || { username: 'Người dùng ẩn danh' };

    // Tạo đối tượng đánh giá mới
    const danhGiaMoi = {
        user: userInfo.username,
        date: new Date().toLocaleDateString('vi-VN'),
        stars: soSao,
        content: noiDung
    };

    // Thêm vào danh sách và lưu
    danhGiaList.unshift(danhGiaMoi);
    luuDanhGia();

    // Hiển thị lại danh sách đánh giá
    hienThiDanhGia();

    // Reset form
    soSao = 0;
    stars.forEach(s => s.className = 'fa-regular fa-star');
    document.getElementById('txtDanhGia').value = '';

    alert('Cảm ơn bạn đã đánh giá!');
}

// Hiển thị danh sách đánh giá
function hienThiDanhGia() {
    const danhGiaContainer = document.querySelector('.danhgia-list');
    danhGiaContainer.innerHTML = '';

    danhGiaList.forEach(danhGia => {
        const danhGiaHTML = `
            <div class="danhgia-item">
                <div class="danhgia-header">
                    <span class="danhgia-user">${danhGia.user}</span>
                    <span class="danhgia-date">${danhGia.date}</span>
                </div>
                <div class="danhgia-stars">
                    ${taoSao(danhGia.stars)}
                </div>
                <div class="danhgia-content">
                    ${danhGia.content}
                </div>
            </div>
        `;
        danhGiaContainer.innerHTML += danhGiaHTML;
    });
}

// Tạo biểu tượng sao cho mỗi đánh giá
function taoSao(soLuong) {
    let saoHTML = '';
    for (let i = 0; i < 5; i++) {
        if (i < soLuong) {
            saoHTML += '<i class="fa-solid fa-star"></i>';
        } else {
            saoHTML += '<i class="fa-regular fa-star"></i>';
        }
    }
    return saoHTML;
}

// Khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    taiDanhGia(); // Tải đánh giá từ localStorage
    hienThiDanhGia(); // Hiển thị đánh giá
});

// Video
const videoContainer = document.querySelector('.video-container');
const modal = document.getElementById('videoModal');
const closeBtn = document.querySelector('.close');
const iframe = modal.querySelector('iframe');
const videoUrl = "https://www.youtube.com/embed/nCJUq2VT-yg?si=RriOBflwDz6aAJu2";

videoContainer.addEventListener('click', () => {
    modal.style.display = "block";
    iframe.src = videoUrl;
});

closeBtn.addEventListener('click', () => {
    modal.style.display = "none";
    iframe.src = "";
});

window.addEventListener('click', (e) => {
    if (e.target == modal) 
    {
        modal.style.display = "none";
        iframe.src = "";
    }
});