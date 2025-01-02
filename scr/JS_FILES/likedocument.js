function likeDocument(event) {
    event.stopPropagation(); // Ngăn sự kiện lan lên các phần tử cha

    // Lấy ID tài liệu từ `data-id`
    const documentElement = event.target.closest('.document');
    const documentId = documentElement.getAttribute('data-id');
    const documentTitle = documentElement.querySelector('.document--content p').textContent.trim();
    const documentImage = documentElement.querySelector('.document--image img').src;
    const documentLink = documentElement.querySelector('.document--image a').href;

    // Lấy nút thích và số lượt thích hiện tại
    const likeButton = documentElement.querySelector('#likeButton');
    let likes = JSON.parse(localStorage.getItem('likes')) || {}; // Danh sách trạng thái thích
    let likeCounts = JSON.parse(localStorage.getItem('likeCounts')) || {}; // Số lượt thích
    let likedDocuments = JSON.parse(localStorage.getItem('likedDocuments')) || []; // Danh sách tài liệu đã thích

    // Cài mặc định số lượt thích là 911 nếu chưa có dữ liệu trong localStorage
    if (!likeCounts[documentId]) {
        likeCounts[documentId] = 911; // Số lượt thích mặc định
    }

    // Kiểm tra và cập nhật trạng thái "thích"
    if (likes[documentId]) {
        // Nếu đã thích, bỏ thích
        delete likes[documentId];
        likeCounts[documentId]--; // Giảm số lượt thích
        likeButton.innerHTML = `<i class="fa-regular fa-heart"></i> ${likeCounts[documentId]}`;

        // Xóa tài liệu khỏi danh sách tài liệu đã thích
        likedDocuments = likedDocuments.filter(doc => doc.id !== documentId);
    } else {
        // Nếu chưa thích, thêm thích
        likes[documentId] = true;
        likeCounts[documentId]++; // Tăng số lượt thích
        likeButton.innerHTML = `<i class="fa-solid fa-heart"></i> ${likeCounts[documentId]}`;

        // Thêm tài liệu vào danh sách tài liệu đã thích
        likedDocuments.push({
            id: documentId,
            title: documentTitle,
            image: documentImage,
            link: documentLink
        });
    }

    // Lưu lại vào localStorage
    localStorage.setItem('likes', JSON.stringify(likes));
    localStorage.setItem('likeCounts', JSON.stringify(likeCounts));
    localStorage.setItem('likedDocuments', JSON.stringify(likedDocuments));

    // Cập nhật danh sách tài liệu đã thích
    loadLikedDocuments();
}

// Hàm hiển thị danh sách tài liệu đã thích
function loadLikedDocuments() {
    const likedDocumentsDiv = document.querySelector('.like-documents');
    const likedDocuments = JSON.parse(localStorage.getItem('likedDocuments')) || [];

    likedDocumentsDiv.innerHTML = likedDocuments.map(doc => `
        <div class="document">
            <div class="document--image">
                <a href="${doc.link}">
                    <img src="${doc.image}" alt="${doc.title}">
                </a>
            </div>
            <div class="document--content">
                <a href="${doc.link}">
                    <p>${doc.title}</p>
                </a>
            </div>
        </div>
    `).join('');
}

// Khi tải lại trang, khôi phục trạng thái từ localStorage
document.addEventListener('DOMContentLoaded', () => {
    const likes = JSON.parse(localStorage.getItem('likes')) || {};
    const likeCounts = JSON.parse(localStorage.getItem('likeCounts')) || {};

    document.querySelectorAll('.document').forEach(doc => {
        const documentId = doc.getAttribute('data-id');
        const likeButton = doc.querySelector('#likeButton');

        if (likeButton) {
            // Cài mặc định số lượt thích là 911 nếu chưa có dữ liệu
            if (!likeCounts[documentId]) {
                likeCounts[documentId] = 911; // Số lượt thích mặc định
            }

            // Hiển thị trạng thái "thích" hoặc "chưa thích"
            const currentLikes = likeCounts[documentId];
            if (likes[documentId]) {
                // Hiển thị nút đã thích
                likeButton.innerHTML = `<i class="fa-solid fa-heart"></i> ${currentLikes}`;
            } else {
                // Hiển thị nút chưa thích
                likeButton.innerHTML = `<i class="fa-regular fa-heart"></i> ${currentLikes}`;
            }
        }
    });

    // Lưu lại số lượt thích mặc định (để tránh mất dữ liệu)
    localStorage.setItem('likeCounts', JSON.stringify(likeCounts));

    // Hiển thị danh sách tài liệu đã thích
    loadLikedDocuments();
});
