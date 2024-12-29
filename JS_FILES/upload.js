import { getFirestore, addDoc, collection, getDocs, query, orderBy, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyA7F_aMoPHbsYQzAbi7qm6vnEnmoXGrQnw",
    authDomain: "learningwithgiathinh-37eb0.firebaseapp.com",
    projectId: "learningwithgiathinh-37eb0",
    storageBucket: "learningwithgiathinh-37eb0.firebasestorage.app",
    messagingSenderId: "77972767462",
    appId: "1:77972767462:web:4a90b813745266ec3db127",
    measurementId: "G-Y41D2HF1ZJ"
  };

async function loadDocuments() {
  const uploadedFilesDiv = document.getElementById("uploadedFiles");
  uploadedFilesDiv.innerHTML = '';

  try {
    const q = query(collection(db, "documents"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const docId = doc.id;
      displayUploadedFile(data.title, data.description, data.fileURL, docId);
    });
  } catch (error) {
    console.error("Lỗi khi tải danh sách tài liệu:", error);
  }
}

function displayUploadedFile(title, description, fileURL, docId) {
  const uploadedFilesDiv = document.getElementById("uploadedFiles");
  
  const fileDiv = document.createElement("div");
  fileDiv.className = "uploaded-file";

  fileDiv.innerHTML = `
    <h3>${title}</h3>
    <p>${description}</p>
    <div class="file-actions">
      <a href="${fileURL}" target="_blank" class="view-btn">
        Xem tài liệu
      </a>
      <button class="share-btn" onclick="shareDocument('${fileURL}', '${title}')">
        Chia sẻ
      </button>
      <button class="delete-btn" onclick="window.deleteDocument('${docId}', '${fileURL}')">
        Xóa
      </button>
    </div>
  `;

  uploadedFilesDiv.appendChild(fileDiv);
}

// Gọi hàm loadDocuments khi trang web được tải
document.addEventListener('DOMContentLoaded', loadDocuments);

// Khởi tạo Firebase Storage
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

// Thêm event listener cho form upload
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const category = document.getElementById('category').value;
  const file = document.getElementById('file').files[0];
  const status = document.getElementById('status');
  
  if (!file) {
    alert('Vui lòng chọn file để upload!');
    return;
  }

  // Tạo reference cho file trong storage
  const storageRef = ref(storage, `documents/${Date.now()}_${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  // Theo dõi tiến trình upload
  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      status.textContent = `Đang tải lên: ${progress.toFixed(2)}%`;
    },
    (error) => {
      console.error('Lỗi khi tải lên:', error);
      status.textContent = 'Tải lên thất bại!';
    },
    async () => {
      // Upload hoàn thành
      const fileURL = await getDownloadURL(uploadTask.snapshot.ref);
      
      try {
        // Lưu metadata vào Firestore
        await addDoc(collection(db, 'documents'), {
          title,
          description,
          category,
          fileURL,
          timestamp: new Date()
        });
        
        // Hiển thị file mới upload
        displayUploadedFile(title, description, fileURL);
        
        // Reset form
        document.getElementById('uploadForm').reset();
        status.textContent = 'Tải lên thành công!';
        
        // Tải lại danh sách tài liệu
        loadDocuments();
      } catch (err) {
        console.error('Lỗi khi lưu metadata:', err);
        status.textContent = 'Lưu metadata thất bại!';
      }
    }
  );
});

// Thêm hàm xóa tài liệu
async function deleteDocument(docId, fileURL) {
  // Hiển thị hộp thoại xác nhận
  if (confirm('Bạn có chắc chắn muốn xóa tài liệu này không?')) {
    try {
      // Xóa document từ Firestore
      await deleteDoc(doc(db, "documents", docId));
      
      // Xóa file từ Storage
      const fileRef = ref(storage, fileURL);
      await deleteObject(fileRef);

      // Tải lại danh sách tài liệu
      loadDocuments();
      
      alert('Đã xóa tài liệu thành công!');
    } catch (error) {
      console.error("Lỗi khi xóa tài liệu:", error);
      alert('Có lỗi xảy ra khi xóa tài liệu!');
    }
  }
}

// Thêm hàm vào window object để có thể gọi từ onclick
window.deleteDocument = deleteDocument;

// Thêm hàm chia sẻ tài liệu
async function shareDocument(fileURL, title) {
    try {
        if (navigator.share) {
            await navigator.share({
                title: title,
                text: 'Xem tài liệu này: ',
                url: fileURL
            });
        } else {
            const tempInput = document.createElement('input');
            document.body.appendChild(tempInput);
            tempInput.value = fileURL;
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            alert('Đã sao chép đường dẫn tài liệu vào clipboard!');
        }
    } catch (error) {
        console.error('Lỗi khi chia sẻ:', error);
        alert('Có lỗi xảy ra khi chia sẻ tài liệu!');
    }
}

// Thêm vào window object
window.shareDocument = shareDocument;

// Hàm hiển thị file trong danh sách
// function displayFile(file) {
//     const fileCard = document.createElement('div');
//     fileCard.className = 'file-card';
    
//     fileCard.innerHTML = `
//         <div class="file-name">${file.name}</div>
//         <div class="file-size">${formatFileSize(file.size)}</div>
//         <div class="file-actions">
//             <a href="${file.downloadUrl}" class="download-btn" download>
//                 <span class="icon">⬇️</span>
//                 Tải xuống
//             </a>
//         </div>
//     `;
    
//     document.getElementById('uploadedFiles').appendChild(fileCard);
// }


// Hàm hiển thị file trong danh sách
// function displayFile(file) {
//   const fileCard = document.createElement('div');
//   fileCard.className = 'file-card';
  
//   fileCard.innerHTML = `
//       <div class="file-card-content">
//           <div class="file-name">${file.name}</div>
//           <div class="file-size">${formatFileSize(file.size)}</div>
//           <div class="file-actions">
//               <a href="${file.downloadUrl}" class="download-btn" download>
//                   <span class="icon">⬇️</span>
//                   Tải xuống
//               </a>
//           </div>
//       </div>
//   `;
  
//   // Thêm thẻ file vào phần tử chứa
//   document.getElementById('uploadedFiles').appendChild(fileCard);
// }


// // Hàm format kích thước file
// function formatFileSize(bytes) {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// }

// Hàm xử lý tải file
// async function downloadFile(fileUrl, fileName) {
//     try {
//         const response = await fetch(fileUrl);
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = fileName;
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
//     } catch (error) {
//         console.error('Lỗi khi tải file:', error);
//         alert('Có lỗi xảy ra khi tải file. Vui lòng thử lại sau.');
//     }
// }

async function downloadFile(fileUrl, fileName) {
  try {
    // Gửi request tải file
    const response = await fetch(fileUrl);

    // Kiểm tra xem request có thành công hay không
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Chuyển response thành Blob
    const blob = await response.blob();

    // Tạo object URL cho file Blob
    const url = URL.createObjectURL(blob);

    // Tạo thẻ <a> để thực hiện tải xuống
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    // Thu hồi object URL để giải phóng bộ nhớ
    URL.revokeObjectURL(url);

    // Xóa thẻ <a> khỏi DOM
    document.body.removeChild(a);

    alert('Tải file thành công!');
  } catch (error) {
    console.error('Lỗi khi tải file:', error);
    alert('Có lỗi xảy ra khi tải file. Vui lòng thử lại sau.');
  }
}
