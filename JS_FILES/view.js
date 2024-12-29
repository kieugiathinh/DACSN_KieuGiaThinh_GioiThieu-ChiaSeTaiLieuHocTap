function View_DSTT(event) {
    event.preventDefault(); // Ngăn không điều hướng ngay lập tức

    // Lấy ID tài liệu từ thuộc tính `data-id`
    const documentElement = event.currentTarget.closest('.document');
    const documentId = documentElement.getAttribute('data-id');

    // Lấy số lượt xem hiện tại từ localStorage (nếu có)
    let views = JSON.parse(localStorage.getItem('views')) || {}; // Tải danh sách lượt xem từ localStorage
    views[documentId] = (views[documentId] || 999) + 1; // Tăng lượt xem cho tài liệu hiện tại (mặc định là 999)

    // Lưu lại số lượt xem vào localStorage
    localStorage.setItem('views', JSON.stringify(views));

    // Hiển thị số lượt xem mới trên giao diện
    const viewCountElement = documentElement.querySelector('#viewCount');
    if (viewCountElement) {
        viewCountElement.innerHTML = `<i class="fa-solid fa-eye"></i> ${views[documentId]}`;
    }

    // Chuyển hướng đến trang chi tiết (nếu muốn)
    window.location.href = event.currentTarget.href;
}
// Thêm các tài liệu khác ở đây

// ********

// Khi tải lại trang, cập nhật số lượt xem từ localStorage
document.addEventListener('DOMContentLoaded', () => {
    const views = JSON.parse(localStorage.getItem('views')) || {};
    document.querySelectorAll('.document').forEach(doc => {
        const documentId = doc.getAttribute('data-id');
        const viewCountElement = doc.querySelector('#viewCount');
        if (viewCountElement && views[documentId] !== undefined) {
            viewCountElement.innerHTML = `<i class="fa-solid fa-eye"></i> ${views[documentId]}`;
        }
    });
});
