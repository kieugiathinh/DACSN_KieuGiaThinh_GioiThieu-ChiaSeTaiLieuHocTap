// // Thêm hàm tìm kiếm
// function searchDocuments() {
//     const searchInput = document.querySelector('.heading--search__iptSearch input');
//     const documents = document.querySelectorAll('.document');
//     const searchResults = document.createElement('div');
//     searchResults.className = 'search-results';
    
//     // Xóa kết quả tìm kiếm cũ nếu có
//     const oldResults = document.querySelector('.search-results');
//     if (oldResults) {
//         oldResults.remove();
//     }

//     // Chỉ hiển thị kết quả khi có nhập từ khóa
//     if (searchInput.value.trim() !== '') {
//         const searchTerm = searchInput.value.toLowerCase();
//         const matchedDocuments = Array.from(documents).filter(doc => {
//             const title = doc.querySelector('.document--content p').textContent.toLowerCase();
//             return title.includes(searchTerm);
//         });

//         // Tạo và hiển thị kết quả tìm kiếm
//         if (matchedDocuments.length > 0) {
//             searchResults.innerHTML = matchedDocuments.map(doc => {
//                 const title = doc.querySelector('.document--content p').textContent;
//                 const imgSrc = doc.querySelector('.document--image img').src;
//                 return `
//                     <div class="search-item">
//                         <img src="${imgSrc}" alt="${title}">
//                         <span>${title}</span>
//                     </div>
//                 `;
//             }).join('');

//             // Thêm sự kiện click cho mỗi kết quả tìm kiếm
//             searchResults.querySelectorAll('.search-item').forEach((item, index) => {
//                 item.addEventListener('click', () => {
//                     window.location.href = matchedDocuments[index].querySelector('a').href;
//                 });
//             });
//         } else {
//             searchResults.innerHTML = '<div class="no-results">Không tìm thấy kết quả</div>';
//         }

//         // Hiển thị kết quả tìm kiếm
//         const searchContainer = document.querySelector('.heading--search');
//         searchContainer.appendChild(searchResults);
//     }
// }
// // Thêm sự kiện cho ô tìm kiếm
// document.addEventListener('DOMContentLoaded', () => {
//     const searchInput = document.querySelector('.heading--search__iptSearch input');
//     const searchIcon = document.querySelector('.heading--search__kinhlup');

//     // Xử lý sự kiện khi nhập
//     searchInput.addEventListener('input', searchDocuments);

//     // Xử lý sự kiện khi click vào icon tìm kiếm
//     searchIcon.addEventListener('click', searchDocuments);

//     // Ẩn kết quả tìm kiếm khi click ra ngoài
//     document.addEventListener('click', (e) => {
//         if (!e.target.closest('.heading--search')) {
//             const searchResults = document.querySelector('.search-results');
//             if (searchResults) {
//                 searchResults.remove();
//             }
//         }
//     });
// });


// Thêm hàm tìm kiếm
function searchDocuments() {
    const searchInput = document.querySelector('.heading--search__iptSearch input');
    const currentPath = window.location.pathname;
    let documents;
    
    // Xác định documents dựa vào trang hiện tại
    if (currentPath.includes('math.htm') || currentPath.includes('all.htm') || currentPath.includes('contact.htm') || currentPath.includes('csbm.htm') || currentPath.includes('csdl.htm') || currentPath.includes('dksd.htm') || currentPath.includes('index.htm') || currentPath.includes('intro.htm') || currentPath.includes('ktmt.htm') || currentPath.includes('math.htm') || currentPath.includes('other.htm') || currentPath.includes('likedocument.htm')) 
    {
        // Lấy tất cả tài liệu từ trang math và all
        const mathDocuments = document.querySelectorAll('.document');
        
        // Tạo một XMLHttpRequest để lấy nội dung từ trang all.htm
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/HTML_FILES/all.htm', false); // Sử dụng synchronous request
        xhr.send();
        
        if (xhr.status === 200) {
            const parser = new DOMParser();
            const allDoc = parser.parseFromString(xhr.responseText, 'text/html');
            const allDocuments = allDoc.querySelectorAll('.document');
            
            // Kết hợp cả hai mảng documents
            // documents = [...mathDocuments, ...allDocuments];
            documents = [...allDocuments];
        } else 
        {
            documents = mathDocuments;
        }
    } 
    else 
    {
        documents = document.querySelectorAll('.document');
    }

    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    
    // Xóa kết quả tìm kiếm cũ nếu có
    const oldResults = document.querySelector('.search-results');
    if (oldResults) {
        oldResults.remove();
    }

    // Chỉ hiển thị kết quả khi có nhập từ khóa
    if (searchInput.value.trim() !== '') {
        const searchTerm = searchInput.value.toLowerCase();
        const matchedDocuments = Array.from(documents).filter(doc => {
            const title = doc.querySelector('.document--content p').textContent.toLowerCase();
            return title.includes(searchTerm);
        });

        // Tạo và hiển thị kết quả tìm kiếm
        if (matchedDocuments.length > 0) {
            // Loại bỏ các kết quả trùng lặp dựa trên tiêu đề
            const uniqueResults = matchedDocuments.filter((doc, index, self) =>
                index === self.findIndex((d) =>
                    d.querySelector('.document--content p').textContent ===
                    doc.querySelector('.document--content p').textContent
                )
            );

            searchResults.innerHTML = uniqueResults.map(doc => {
                const title = doc.querySelector('.document--content p').textContent;
                const imgSrc = doc.querySelector('.document--image img').src;
                return `
                    <div class="search-item">
                        <img src="${imgSrc}" alt="${title}">
                        <span>${title}</span>
                    </div>
                `;
            }).join('');

            // Thêm sự kiện click cho mỗi kết quả tìm kiếm
            searchResults.querySelectorAll('.search-item').forEach((item, index) => {
                item.addEventListener('click', () => {
                    const originalLink = uniqueResults[index].querySelector('a').href;
                    window.location.href = originalLink;
                });
            });
        } else {
            searchResults.innerHTML = '<div class="no-results">Không tìm thấy kết quả</div>';
        }

        // Hiển thị kết quả tìm kiếm
        const searchContainer = document.querySelector('.heading--search');
        searchContainer.appendChild(searchResults);
    }
}
// Thêm sự kiện cho ô tìm kiếm
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.heading--search__iptSearch input');
    const searchIcon = document.querySelector('.heading--search__kinhlup');

    // Xử lý sự kiện khi nhập
    searchInput.addEventListener('input', searchDocuments);

    // Xử lý sự kiện khi click vào icon tìm kiếm
    searchIcon.addEventListener('click', searchDocuments);

    // Ẩn kết quả tìm kiếm khi click ra ngoài
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.heading--search')) {
            const searchResults = document.querySelector('.search-results');
            if (searchResults) {
                searchResults.remove();
            }
        }
    });
});