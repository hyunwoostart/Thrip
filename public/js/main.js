let scheduleIndex = [];
// 로그인 여부 확인
(async function () {
    if (localStorage.getItem('token')) {
        try {
            // 사용자 인증
            const res = await axios({
                method: 'GET',
                url: '/api/member/find',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            // 내 여행 데이터 불러오기
            const { mySchedule } = res.data.result;
            if (mySchedule) {
                for (i = 0; i < mySchedule.length; i++) {
                    const res2 = await axios({
                        method: 'GET',
                        url: '/api/schedule/findGroup',
                        params: {
                            id: mySchedule[i],
                        },
                    });
                    const now = new Date();
                    const YEAR = now.getFullYear();
                    const MONTH = now.getMonth();
                    const DATE = now.getDate();
                    const depM = Number(res2.data.result.depDate.substring(5, 7));
                    const depD = Number(res2.data.result.depDate.substring(8, 10));
                    const arrY = Number(res2.data.result.arrDate.substring(0, 4));
                    const arrM = Number(res2.data.result.arrDate.substring(5, 7));
                    const arrD = Number(res2.data.result.arrDate.substring(8, 10));
                    console.log(arrY, arrM, arrD);
                    if (arrY >= YEAR && arrM >= MONTH && arrD >= DATE) {
                        scheduleIndex.push(res2.data.result.id);
                        console.log(scheduleIndex);
                    }
                    console.log(scheduleIndex);
                }
                if (scheduleIndex.length >= 2) {
                    document.querySelector('.container_upcoming h3').textContent = `다가오는 여행 일정`;
                }
                for (let j = 0; j < scheduleIndex.length; j++) {
                    const res3 = await axios({
                        method: 'GET',
                        url: '/api/schedule/findGroup',
                        params: {
                            id: scheduleIndex[j],
                        },
                    });
                    const res4 = await axios({
                        mehod: 'GET',
                        url: '/api/schedule/detail',
                        params: {
                            groupId: scheduleIndex[j],
                        },
                    });
                    const { groupName, depDate, arrDate } = res3.data.result;
                    console.log(groupName);
                    if (j === 0) {
                        document.querySelector('.trip_schedule').addEventListener('click', () => {
                            localStorage.setItem('groupId', scheduleIndex[j]);
                            document.location.href = '/tripdetail';
                        });
                        document.querySelector('.trip_schedule h3').textContent = groupName;
                        document.querySelector('.trip_schedule span').textContent = `${depDate.substring(
                            5,
                            7
                        )}월 ${depDate.substring(8, 10)}일 ~ ${arrDate.substring(5, 7)}월 ${arrDate.substring(
                            8,
                            10
                        )}일`;
                        for (let k = 0; k < res4.data.result.length; k++) {
                            console.log(k);
                            const { category, detailOrder, arrTime, place } = res4.data.result[k];
                            if (category === 1) {
                                const p = document.createElement('p');
                                p.textContent = `${arrTime.substring(0, 5)} ${place.place_name}`;
                                document.querySelector('.trip_schedule').appendChild(p);
                                console.log(p);
                            }
                        }
                        const res5 = await axios({
                            method: 'GET',
                            url: '/api/schedule/findChk',
                            params: {
                                groupId: scheduleIndex[j],
                            },
                        });
                        console.log(res5.data.result);
                        if (res5.data.result.length != 0) {
                            const h3 = document.createElement('h3');
                            h3.textContent = `${groupName} 체크리스트`;
                            document.querySelector('.trip_supplies').appendChild(h3);
                            for (let k = 0; k < res5.data.result.length; k++) {
                                const { id, listName, isActive } = res5.data.result[k];
                                console.log(listName);
                                let chkHtml;
                                if (Boolean(isActive)) {
                                    chkHtml = `
													<div class="input_chk" onclick="isChecked(${id})">
														<input type="checkbox" class="checklist" id="check${id}" name="check${id}" checked />
														<label for="check${id}">${listName}</label>
														<input type="hidden" id="${id}" />
													</div>
													`;
                                } else {
                                    chkHtml = `
													<div class="input_chk" onclick="isChecked(${id})">
														<input type="checkbox" class="checklist" id="check${id}" name="check${id}" />
														<label for="check${id}">${listName}</label>
														<input type="hidden" id="${id}" />
													</div>
													`;
                                }
                                document.querySelector('.trip_supplies').insertAdjacentHTML('beforeend', chkHtml);
                            }
                        }
                    } else {
                        const upcoming = document.querySelector('.container_upcoming ul');
                        ucHtml = `
									<li onclick="goDetail(${scheduleIndex[j]})">
										<div class="trip_schedule">
											<strong>${groupName}</strong>
											<span>${depDate.substring(5, 7)}월 ${depDate.substring(8, 10)}일 ~ ${arrDate.substring(5, 7)}월 ${arrDate.substring(
                            8,
                            10
                        )}일</span>
										</div>
									</li>
									`;
                        upcoming.insertAdjacentHTML('beforeend', ucHtml);
                    }
                }
            }
        } catch (error) {
            localStorage.clear();
            info.addEventListener('click', () => {
                document.location.href = '/login';
            });
        }
    }
})();
// 체크리스트 클릭
async function isChecked(id) {
    const res = await axios({
        method: 'PATCH',
        url: '/api/schedule/updateChk',
        data: {
            id,
            isActive: Number(document.querySelector(`#check${id}`).checked),
        },
    });
}
// 일정 생성
function newSchedule() {
    localStorage.removeItem('groupId');
    document.location.href = '/calendar';
}
// 여행 일정 클릭
function goDetail(id) {
    localStorage.setItem('groupId', id);
    document.location.href = '/tripdetail';
}
/* 탭메뉴 스크립트 */
document.addEventListener('DOMContentLoaded', function () {
    // 모든 컨테이너 숨기기
    let containers = document.querySelectorAll('.tab_cnt > div');
    containers.forEach(function (container) {
        container.style.display = 'none';
    });
    // 기본
    showRectripCnt(); // 추천 컨테이너 표시

    // 탭 메뉴 클릭 이벤트 처리
    document.querySelectorAll('.tab_menu li').forEach(function (item) {
        item.addEventListener('click', function () {
            // 모든 탭 메뉴 항목의 'on' 클래스 제거
            document.querySelectorAll('.tab_menu li').forEach((tab) => tab.classList.remove('on'));
            // 클릭한 탭 메뉴 항목에 'on' 클래스 추가
            this.classList.add('on');

            // 내 여행 탭을 클릭했는지 확인
            if (this.classList.contains('mytrip_cnt')) {
                hideContainers(); // 모든 컨테이너 숨기기
                // 내 여행 컨테이너 표시
                document
                    .querySelectorAll('.container_trip, .container_upcoming')
                    .forEach((container) => (container.style.display = 'block'));
            } else if (this.classList.contains('rectrip_cnt')) {
                hideContainers();
                showRectripCnt();
            }
        });
    });

    // 모든 컨테이너 숨기는 함수
    function hideContainers() {
        document.querySelectorAll('.tab_cnt > div').forEach((container) => (container.style.display = 'none'));
    }

    // 추천 컨테이너 표시하는 함수
    function showRectripCnt() {
        document
            .querySelectorAll('.container_rec, .container_category, .container_best')
            .forEach((container) => (container.style.display = 'block'));
    }
});

/* 추천 여행지 스와이퍼 슬라이드*/
var swiper = new Swiper('.my_swiper', {
    slidesPerView: 2,
    spaceBetween: 20,
    // centeredSlides: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    speed: 1500,
    loop: true,
    /*
                              breakpoints: {
                              748: {
                                  slidesPerView: 3,
                                  spaceBetween: 250,
                              },
                              1060: {
                                  slidesPerView: 3,
                                  spaceBetween: 350,
                              },
                              1500: {
                                  slidesPerView: 4,
                                  spaceBetween: 350,
                              },
                              1700: {
                                  slidesPerView: 4,
                                  spaceBetween: 350,
                              },
                              */
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});
// 페이지 로드 시 스와이퍼 초기화 (임시주석)
// document.addEventListener('DOMContentLoaded', function () {
//     initSwiper();
// });

// 탭 메뉴 클릭 시 스와이퍼 다시 초기화
document.querySelectorAll('.tab_menu').forEach(function (tab) {
    tab.addEventListener('click', function () {
        // initSwiper();
    });
});

/* 하단 메뉴 스크립트 */
function toggleOn() {
    if (!this.classList.contains('on')) {
        // 현재 요소에 'on' 클래스를 추가하고, 다른 형제 요소들은 'on' 클래스를 제거
        this.classList.add('on');
        document.querySelectorAll('.btn_wrap ul li').forEach(function (li) {
            if (li !== this) {
                li.classList.remove('on');
            }
        }, this);
    }
}

document.querySelectorAll('.btn_wrap ul li').forEach(function (li) {
    li.addEventListener('click', toggleOn);
});
