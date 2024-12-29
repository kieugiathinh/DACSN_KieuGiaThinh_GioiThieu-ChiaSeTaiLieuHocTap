document.addEventListener('DOMContentLoaded', function() {
    // Xử lý nút thích
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const newsId = this.dataset.id;
            const likeCount = this.querySelector('span');
            const icon = this.querySelector('i');

            if (this.classList.contains('liked')) {
                // Bỏ thích
                this.classList.remove('liked');
                icon.classList.remove('fas');
                icon.classList.add('far');
                let count = parseInt(likeCount.textContent);
                likeCount.textContent = (count - 1).toString();
                removeLikedNews(newsId);
            } else {
                // Thích
                this.classList.add('liked');
                icon.classList.remove('far');
                icon.classList.add('fas');
                let count = parseInt(likeCount.textContent);
                likeCount.textContent = (count + 1).toString();
                saveLikedNews(newsId);
            }
        });
    });

    // Lưu tin tức đã thích vào localStorage
    function saveLikedNews(newsId) {
        let likedNews = JSON.parse(localStorage.getItem('likedNews') || '[]');
        if (!likedNews.includes(newsId)) {
            likedNews.push(newsId);
            localStorage.setItem('likedNews', JSON.stringify(likedNews));
        }
    }

    // Xóa tin tức khỏi danh sách đã thích
    function removeLikedNews(newsId) {
        let likedNews = JSON.parse(localStorage.getItem('likedNews') || '[]');
        likedNews = likedNews.filter(id => id !== newsId);
        localStorage.setItem('likedNews', JSON.stringify(likedNews));
    }

    // Khôi phục trạng thái thích từ localStorage
    function restoreLikedState() {
        const likedNews = JSON.parse(localStorage.getItem('likedNews') || '[]');
        likeButtons.forEach(button => {
            const newsId = button.dataset.id;
            if (likedNews.includes(newsId)) {
                button.classList.add('liked');
                const icon = button.querySelector('i');
                icon.classList.remove('far');
                icon.classList.add('fas');
            }
        });
    }
});