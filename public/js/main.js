let scheduleIndex = [];
let contentWidth;
let contentHieght;
let depObject = [];
let arrObject = [];
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
            document.querySelector('.login_wrap .username_txt').textContent = res.data.result.username + ' 님';
            document.querySelectorAll('.login_on')[0].classList.remove('hide');
            document.querySelectorAll('.login_on')[1].classList.remove('hide');
            document.querySelectorAll('.login_off')[0].classList.add('hide');
            document.querySelectorAll('.login_off')[1].classList.add('hide');
            // 내 여행 데이터 불러오기
            if (res.data.result.mySchedule[0]) {
                let count = 0;
                const res2 = await axios({
                    method: 'GET',
                    url: '/api/schedule/scheduleList',
                    params: { id: res.data.result.id },
                });
                for (let i = 0; i < res2.data.result.length; i++) {
                    const { id, depDate, arrDate, groupName } = res2.data.result[i];

                    const now = new Date();
                    const YEAR = now.getFullYear();
                    const MONTH = now.getMonth() + 1;
                    const DATE = now.getDate();
                    const depY = Number(arrDate.substring(0, 4));
                    const depM = Number(depDate.substring(5, 7));
                    const depD = Number(depDate.substring(8, 10));
                    const arrY = Number(arrDate.substring(0, 4));
                    const arrM = Number(arrDate.substring(5, 7));
                    const arrD = Number(arrDate.substring(8, 10));
                    depObject.push({ year: depY, month: depM - 1, day: depD });
                    arrObject.push({ year: arrY, month: arrM - 1, arrDay: arrD });
                    if (arrY >= YEAR && (arrM > MONTH || (arrM === MONTH && arrD >= DATE))) {
                        scheduleIndex.push(id);
                        if (count === 0) {
                            const res3 = await axios({
                                method: 'GET',
                                url: '/api/schedule/detail',
                                params: {
                                    groupId: id,
                                },
                            });
                            document.querySelector('.trip_schedule').addEventListener('click', () => {
                                localStorage.setItem('groupId', id);
                                document.location.href = '/tripdetail';
                            });
                            document.querySelector('.trip_schedule h3').textContent = groupName;
                            document.querySelector(
                                '.trip_schedule span'
                            ).textContent = `${depM}월 ${depD}일 ~ ${arrM}월 ${arrD}일`;
                            for (let k = 0; k < res3.data.result.length; k++) {
                                const { category, arrTime, place } = res3.data.result[k];
                                if (category === 1) {
                                    const p = document.createElement('p');
                                    p.textContent = `${arrTime.substring(0, 5)} ${place.place_name}`;
                                    document.querySelector('.trip_schedule').appendChild(p);
                                }
                            }
                            const res4 = await axios({
                                method: 'GET',
                                url: '/api/schedule/findChk',
                                params: {
                                    groupId: id,
                                },
                            });
                            if (res4.data.result.length != 0) {
                                const div = document.createElement('div');
                                div.className = 'trip_supplies';
                                const h3 = document.createElement('h3');
                                h3.textContent = `${groupName} 체크리스트`;
                                div.appendChild(h3);
                                for (let k = 0; k < res4.data.result.length; k++) {
                                    const { id, listName, isActive } = res4.data.result[k];
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
                                    div.insertAdjacentHTML('beforeend', chkHtml);
                                    document.querySelector('.trip_box').appendChild(div);
                                }
                            }
                        } else {
                            const upcoming = document.querySelector('.container_upcoming ul');
                            ucHtml = `
                            <li onclick="goDetail(${id})">
                                <div class="trip_schedule">
                                    <strong>${groupName}</strong>
                                    <span>${depM}월 ${depD}일 ~ ${arrM}월 ${arrD}일</span>
                                </div>
                            </li>
                            `;
                            upcoming.insertAdjacentHTML('beforeend', ucHtml);
                        }
                        count++;
                    }
                    if (count >= 2) {
                        document.querySelector('.container_upcoming h3').textContent = `다가오는 여행 일정`;
                    }
                }
            }
        } catch (error) {
            const info = document.querySelector('.my_info');
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
    for (let i = 0; i < res.data.result.length; i++) {
        const { id, place, memo } = res.data.result[i];
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
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        speed: 1200,
        loop: true,
        loopAdditionalSlides: 1,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            764: {
                slidesPerView: 2,
            },
        },
    });

    // 여행 일정 정보 불러오기
    const bestRes = await axios({
        method: 'GET',
        url: '/api/schedule/best',
    });
    for (let i = 0; i < bestRes.data.result.length; i++) {
        const { id, groupName, dueDate, recCount } = bestRes.data.result[i];
        const bestHtml = `
		<li>
			<div class="best_cnt" onclick="best(${id})">
				<img
					src="../public/img/main/img_best0${i + 1}.jpg"
					alt=""
				/>
				<div class="best_txt">
					<div>
						<strong>${groupName}</strong>
						<span>${dueDate - 1}박 ${dueDate}일 일정</span>
					</div>
					<div class="rate_view">
						<p>
							<span><i></i>${recCount}</span>
						</p>
					</div>
				</div>
			</div>
		</li>`;
        document.querySelector('.container_best ul').insertAdjacentHTML('beforeend', bestHtml);
    }
    makeCalender();
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
// BEST 여행 일정 클릭
function best(id) {
    localStorage.setItem('groupId', id);
    document.location.href = '/bestdetail';
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
                            .querySelectorAll('.container_trip, .container_upcoming, .main_bg')
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
//오늘을 기준으로 일주일 캘린더 만들기
function makeCalender() {
    let calendarTable = document.querySelector('#trip_calendar_table');
    const today = new Date();
    //요일(오늘을 기준으로 요일 배열 재배치)
    const dayArr = ['일', '월', '화', '수', '목', '금', '토'];
    const day = today.getDay();
    let slicedPart = dayArr.splice(0, day + 1);
    dayArr.push(...slicedPart);
    const thead = `
    <div class="trip_calendar_line">
        <p class="calTit calCont">${dayArr[0]}</p>
        <p class="calTit calCont">${dayArr[1]}</p>
        <p class="calTit calCont">${dayArr[2]}</p>
        <p class="calTit calCont">${dayArr[3]}</p>
        <p class="calTit calCont">${dayArr[4]}</p>
        <p class="calTit calCont">${dayArr[5]}</p>
        <p class="calTit calCont">${dayArr[6]}</p>
    </div>`;
    calendarTable.insertAdjacentHTML('beforeend', thead);
    //날짜(오늘을 기준으로 7일동안의 날짜 배치)
    const dates = [];
    for (let i = 1; i <= 6; i++) {
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + i);
        dates[i] = nextDay;
    }
    dates[0] = today;
    const tbody = `
    <div class="trip_calendar_line">
        <p class="calDate calCont" id="calDate${dates[0].getDate()}">${dates[0].getDate()}</p>
        <p class="calDate calCont" id="calDate${dates[1].getDate()}">${dates[1].getDate()}</p>
        <p class="calDate calCont" id="calDate${dates[2].getDate()}">${dates[2].getDate()}</p>
        <p class="calDate calCont" id="calDate${dates[3].getDate()}">${dates[3].getDate()}</p>
        <p class="calDate calCont" id="calDate${dates[4].getDate()}">${dates[4].getDate()}</p>
        <p class="calDate calCont" id="calDate${dates[5].getDate()}">${dates[5].getDate()}</p>
        <p class="calDate calCont" id="calDate${dates[6].getDate()}">${dates[6].getDate()}</p>
    </div>`;
    calendarTable.insertAdjacentHTML('beforeend', tbody);
    if (depObject[0]) {
        for (let i = 0; i < dates.length; i++) {
            const calY = dates[i].getFullYear();
            const calM = dates[i].getMonth();
            const calD = dates[i].getDate();
            for (let d = 0; d < depObject.length; d++) {
                if (depObject[d].year != arrObject[d].year) {
                    if (
                        calY === depObject[d].year &&
                        (calM > depObject[d].month || (calM = depObject[d].month && calD >= depObject[d].day))
                    ) {
                        document.querySelector(`#calDate${calD}`).classList.add('on');
                    } else if (
                        calY === arrObject[d].year &&
                        (calM < arrObject[d].month || (calM = arrObject[d].month && calD <= arrObject[d].day))
                    ) {
                        document.querySelector(`#calDate${calD}`).classList.add('on');
                    }
                } else if (depObject[d].month != arrObject[d].month) {
                    if (calM === depObject[d].month && calD >= depObject[d].day) {
                        document.querySelector(`#calDate${calD}`).classList.add('on');
                    } else if (calM === arrObject[d].month && calD <= arrObject[d].arrDay) {
                        document.querySelector(`#calDate${calD}`).classList.add('on');
                    }
                } else {
                    if (calM === depObject[d].month && calD >= depObject[d].day && calD <= arrObject[d].arrDay) {
                        document.querySelector(`#calDate${calD}`).classList.add('on');
                    }
                }
            }
        }
    }
}
