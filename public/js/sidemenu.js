const hamBtn = document.querySelector('.ico_ham');
const menuSide = document.querySelector('.menu_side');
const closeBtn = document.querySelector('.btn_close');

// 사용자 인증
(async function () {
    const info = document.querySelector('.my_info');
    const myName = document.querySelector('.menu_side .info_txt');
    const editBtn = document.querySelector('.btn_retouch');
    const logoutBtn = document.querySelector('.btn_logout');
    if (!localStorage.getItem('token')) {
        console.log(`cjdma`);
        editBtn.hidden = true;
        logoutBtn.hidden = true;
        info.addEventListener('click', () => {
            document.location.href = '/login';
        });
    } else {
        try {
            const res = await axios({
                method: 'GET',
                url: '/api/member/find',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log(res.data);
            editBtn.hidden = false;
            logoutBtn.hidden = false;
            myName.textContent = res.data.result.username;
        } catch (error) {
            editBtn.hidden = true;
            info.addEventListener('click', () => {
                document.location.href = '/login';
            });
        }
    }
})();

// 개인정보 수정
function editFunc() {
    document.location.href = '/myPage';
}

// 로그아웃
function logoutFunc() {
    localStorage.clear();
    document.location.reload();
}

hamBtn.addEventListener('click', (event) => {
    event.preventDefault();
    menuSide.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

closeBtn.addEventListener('click', (event) => {
    event.preventDefault();
    menuSide.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// 모달 바깥 영역 클릭 시 모달 닫기
document.addEventListener('click', (event) => {
    if (!menuSide.contains(event.target) && event.target !== hamBtn) {
        menuSide.style.display = 'none';
    }
});

// 모달 내부 클릭 시 모달 닫힘 방지
menuSide.addEventListener('click', (event) => {
    event.stopPropagation();
});
