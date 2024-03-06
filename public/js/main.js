let scheduleIndex = [];
let contentWidth;
let contentHieght;
(async function () {
    // 로그인 여부 확인
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
                        document.querySelector('.trip_schedule span').textContent = `${Number(
                            depDate.substring(5, 7)
                        )}월 ${Number(depDate.substring(8, 10))}일 ~ ${Number(arrDate.substring(5, 7))}월 ${Number(
                            arrDate.substring(8, 10)
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
						<li class="swiper-slide" onclick="goDetail(${scheduleIndex[j]})">
							<div class="trip_schedule">
								<strong>${groupName}</strong>
								<span>${Number(depDate.substring(5, 7))}월 ${Number(depDate.substring(8, 10))}일 ~ ${Number(
                            arrDate.substring(5, 7)
                        )}월 ${Number(arrDate.substring(8, 10))}일</span>
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

    // 슬라이드 정보 불러오기
    const res = await axios({
        method: 'GET',
        url: '/api/recommend/slideList',
    });
    console.log(res.data.result);
    for (let i = 0; i < res.data.result.length; i++) {
        const { id, place, memo } = res.data.result[i];
        console.log(res.data.result[i]);

        const html = `
		<li class="swiper-slide">
			<div class="rec_cnt">
				<img src="../public/img/main/img_rectrip${id}.jpg" alt="${place}" />
				<div class="rec_txt">
					<strong>${place}</strong>
					<p>${memo}</p>
				</div>
			</div>
		</li>
		`;
        document.querySelector('.swiper-wrapper').insertAdjacentHTML('beforeend', html);
    }

    /* 추천 여행지 스와이퍼 슬라이드 */
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
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    /* 다가오는 여행 일정/ BEST 여행일정 - 스와이퍼 슬라이드 */
    var swiper = new Swiper('.def_swiper', {
        speed: 1500,
        loop: false,
        slidesPerView: 'auto', // 각 슬라이드의 너비를 자동으로 계산
    
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    // 슬라이드 높이 맞추기
    contentWidth = document.querySelector('.swiper-slide').style.width;
    contentHieght = parseFloat(contentWidth.split('px')[0]) * 1.4;
    const recCnt = document.querySelectorAll('.rec_cnt');
    for (let i = 0; i < recCnt.length; i++) {
        recCnt[i].style.height = `${contentHieght}px`;
    }
})();
// 윈도우 사이즈 변경 시 슬라이드 높이 변경
window.addEventListener('resize', () => {
    contentWidth = document.querySelector('.swiper-slide').style.width;
    contentHieght = parseFloat(contentWidth.split('px')[0]) * 1.4;
    const recCnt = document.querySelectorAll('.rec_cnt');
    for (let i = 0; i < recCnt.length; i++) {
        recCnt[i].style.height = `${contentHieght}px`;
    }
});
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
    // 초기화 함수 호출
    updateLayout();

    // 화면 크기 변경 시 레이아웃 업데이트
    window.addEventListener('resize', updateLayout);

    function updateLayout() {
        const screenWidth = window.innerWidth;

        if (screenWidth < 1024) {
            // 탭 메뉴 보이기
            const tabMenu = document.querySelector('.tab_menu');
            if (tabMenu) {
                tabMenu.style.display = 'flex';
            }

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

            // 기본 탭 선택
            const defaultTab = document.querySelector('.tab_menu li.on');
            if (defaultTab) {
                defaultTab.click();
            }
        } else {
            // 탭 메뉴 숨기기
            const tabMenu = document.querySelector('.tab_menu');
            if (tabMenu) {
                tabMenu.style.display = 'none';
            }

            // 모든 컨테이너 표시
            let containers = document.querySelectorAll('.tab_cnt > div');
            containers.forEach(function (container) {
                container.style.display = 'block';
            });
        }
    }

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


// 페이지 로드 시 스와이퍼 초기화 (임시주석)
// document.addEventListener('DOMContentLoaded', function () {
//     initSwiper();
// });

// 탭 메뉴 클릭 시 스와이퍼 다시 초기화
document.querySelectorAll('.tab_menu').forEach(function (tab) {
    tab.addEventListener('click', function () {
        initSwiper();
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
//오늘을 기준으로 일주일 캘린더 만들기
function makeCalender() {
    let calendarTable = document.querySelector('#trip_calendar_table');
    const today = new Date();
    //요일(오늘을 기준으로 요일 배열 재배치)
    const dayArr = ['일', '월', '화', '수', '목', '금', '토'];
    const day = today.getDay();
    let slicedPart = dayArr.splice(0, day + 1);
    dayArr.push(...slicedPart);
    const thead = ` <thead>
    <tr>
        <th>${dayArr[0]}</th>
        <th>${dayArr[1]}</th>
        <th>${dayArr[2]}</th>
        <th>${dayArr[3]}</th>
        <th>${dayArr[4]}</th>
        <th>${dayArr[5]}</th>
        <th>${dayArr[6]}</th>
    </tr>
    </thead>`;
    calendarTable.insertAdjacentHTML('beforeend', thead);
    //날짜(오늘을 기준으로 7일동안의 날짜 배치)
    const dates = [];
    for (let i = 1; i <= 6; i++) {
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + i);
        dates[i] = nextDay;
    }
    dates[0] = today;
    const tbody = `<tbody>
    <tr>
        <td>${dates[0].getDate()}</td>
        <td>${dates[1].getDate()}</td>
        <td>${dates[2].getDate()}</td>
        <td>${dates[3].getDate()}</td>
        <td>${dates[4].getDate()}</td>
        <td>${dates[5].getDate()}</td>
        <td>${dates[6].getDate()}</td>
    </tr>
    </tbody>`;
    calendarTable.insertAdjacentHTML('beforeend', tbody);
}
makeCalender();
