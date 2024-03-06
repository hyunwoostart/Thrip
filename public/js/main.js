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
                let count = 0;
                const res2 = await axios({
                    method: 'GET',
                    url: '/api/schedule/scheduleList',
                    params: { id: mySchedule },
                });
                for (let i = 0; i < res2.data.result.length; i++) {
                    const { id, depDate, arrDate, groupName } = res2.data.result[i];
                    const now = new Date();
                    const YEAR = now.getFullYear();
                    const MONTH = now.getMonth() + 1;
                    const DATE = now.getDate();
                    const depM = Number(depDate.substring(5, 7));
                    const depD = Number(depDate.substring(8, 10));
                    const arrY = Number(arrDate.substring(0, 4));
                    const arrM = Number(arrDate.substring(5, 7));
                    const arrD = Number(arrDate.substring(8, 10));
                    if (arrY >= YEAR && arrM >= MONTH && arrD >= DATE) {
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
                                const h3 = document.createElement('h3');
                                h3.textContent = `${groupName} 체크리스트`;
                                document.querySelector('.trip_supplies').appendChild(h3);
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
                                    document.querySelector('.trip_supplies').insertAdjacentHTML('beforeend', chkHtml);
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

    // 슬라이드 높이 맞추기
    contentWidth = document.querySelector('.swiper-slide').style.width;
    contentHieght = parseFloat(contentWidth.split('px')[0]) * 1.4;
    const recCnt = document.querySelectorAll('.rec_cnt');
    for (let i = 0; i < recCnt.length; i++) {
        recCnt[i].style.height = `${contentHieght}px`;
    }

    // 여행 일정 정보 불러오기
    const bestRes = await axios({
        method: 'GET',
        url: '/api/schedule/best',
    });
    for (let i = 0; i < bestRes.data.result.length; i++) {
        const { id, groupName, dueDate } = bestRes.data.result[i];
        const bestHtml = `
		<li>
			<div class="best_cnt" onclick="best(${id})">
				<img
					src="../public/img/main/img_best01.png"
					alt=""
				/>
				<div class="best_txt">
					<div>
						<strong>${groupName}</strong>
						<span>${dueDate - 1}박 ${dueDate}일 일정</span>
					</div>
					<div class="rate_view">
						<p>
							<span>4.7<i></i></span>
						</p>
					</div>
				</div>
			</div>
		</li>`;
        document.querySelector('.container_best ul').insertAdjacentHTML('beforeend', bestHtml);
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
// BEST 여행 일정 클릭
function best(id) {
    localStorage.setItem('groupId', id);
    document.location.href = '/bestdetail';
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
