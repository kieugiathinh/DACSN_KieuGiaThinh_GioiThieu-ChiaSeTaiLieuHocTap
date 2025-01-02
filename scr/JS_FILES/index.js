
let images = document.querySelector('.ads-items');
let imgs = document.querySelectorAll('.ads-items img');
let totallength = imgs.length;
let btnPrev = document.querySelector('.prev');
let btnNext = document.querySelector('.next');
let current = 0;

let ChangeSlide = () =>{
    if(current == totallength-1){
        current = 0;
        let width = imgs[0].offsetWidth
        images.style.transform = `translateX(0px)`
        document.querySelector('.active').classList.remove('active')
        document.querySelector('.index-item-'+current).classList.add('active')
    }
    else{
        current++;
        let width = imgs[0].offsetWidth
        images.style.transform = `translateX(${width*-1*current}px)`
        document.querySelector('.active').classList.remove('active')
        document.querySelector('.index-item-'+current).classList.add('active')
    }
}

let Change = setInterval(ChangeSlide, 4000);

btnNext.addEventListener('click', ()=>{
    clearInterval(Change);
    ChangeSlide();
    Change = setInterval(ChangeSlide, 4000);
})

btnPrev.addEventListener('click', ()=>{
    clearInterval(Change);
    if(current == 0){
        current = totallength-1;
        let width = imgs[0].offsetWidth
        images.style.transform = `translateX(${width*-1*current}px)`
        document.querySelector('.active').classList.remove('active')
        document.querySelector('.index-item-'+current).classList.add('active')
    }
    else{
        current--;
        let width = imgs[0].offsetWidth
        images.style.transform = `translateX(${width*-1*current}px)`
        document.querySelector('.active').classList.remove('active')
        document.querySelector('.index-item-'+current).classList.add('active')
    }
    Change = setInterval(ChangeSlide, 4000); 
})



document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("myModal");
    var trailerLinks = document.querySelectorAll(".btn-trailer");
    var trailerVideo = document.getElementById("trailerVideo");

    trailerLinks.forEach(function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            var videoUrl = this.getAttribute("data-video");
            trailerVideo.src = videoUrl; 
            modal.style.display = "block"; 
        });
    });

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            trailerVideo.src = "";
        }
    }
});


// Back to top
// Lấy nút Back to Top
const backToTopButton = document.getElementById("backToTop");

// Hiển thị nút khi người dùng cuộn xuống
window.onscroll = function() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
};

// Cuộn mượt lên đầu trang khi nhấn nút
backToTopButton.addEventListener("click", function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


