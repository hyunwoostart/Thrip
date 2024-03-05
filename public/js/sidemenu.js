const hamBtn = document.querySelector('.ico_ham');
const menuSide = document.querySelector('.menu_side');
const closeBtn = document.querySelector('.btn_close');

hamBtn.addEventListener('click', () => {
    event.preventDefault();
    menuSide.style.display = 'block';
    document.body.style.overflow = 'hidden';
    // menuSide.classList.add('dimed');
});

closeBtn.addEventListener('click', () => {
    event.preventDefault();
    menuSide.style.display = 'none';
    document.body.style.overflow = 'auto';
    // menuSide.classList.remove('dimed');
});

// 모달 바깥 영역 클릭 시 모달 닫기
document.addEventListener('click', (event) => {
    if (!menuSide.contains(event.target) && event.target !== hamBtn) {
        menuSide.style.display = 'none';
        // document.body.classList.remove('dimed'); // 딤처리 클래스 제거
    }
});

// 모달 내부 클릭 시 모달 닫힘 방지
menuSide.addEventListener('click', (event) => {
    event.stopPropagation();
});