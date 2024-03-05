// 여행 목록
const list = document.querySelector('.container_upcoming ul');
const dates = [];
const depObject = [];
const arrObject = [];
(async function () {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/member/find',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
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
                const { groupName, depDate, arrDate, id } = res2.data.result;
                dates.push({ groupName, depDate, arrDate, id });
                var d = new Date(depDate);
                console.log(d.getMonth());
                const html = `
                        <li>
                            <div class="trip_schedule">
                                <div onclick="goDetail(${id})">
                                    <strong>${groupName}</strong>
                                    <span>${depDate} - ${arrDate}</span>
                                </div>
                            </div>
                        </li>
                        `;
                list.insertAdjacentHTML('beforeend', html);
            }
            for (i = 0; i < dates.length; i++) {
                const dep = new Date(dates[i].depDate);
                const year = dep.getFullYear();
                const month = dep.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
                const day = dep.getDate();
                depObject.push({ year, month, day });

                const arr = new Date(dates[i].arrDate);
                const arrYear = arr.getFullYear();
                const arrMonth = arr.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
                const arrDay = arr.getDate();
                arrObject.push({ arrYear, arrMonth, arrDay });
            }
            calendarInit();
        }
    } catch (error) {
        document.location.href = '/login';
    }
})();
function goDetail(id) {
    localStorage.setItem('groupId', id);
    document.location.href = '/tripdetail';
}
function insert() {
    localStorage.removeItem('groupId');
    document.location.href = '/calendar';
}

//달력
/*
달력 렌더링 할 때 필요한 정보 목록 

현재 월(초기값 : 현재 시간)
금월 마지막일 날짜와 요일
전월 마지막일 날짜와 요일
*/
function active() {
    var activeElements = document.getElementsByClassName('active');
    const dot = `<span class="material-symbols-outlined" style="font-size: 14px;">
    fiber_manual_record
    </span>`;
    for (var i = 0; i < activeElements.length; i++) {
        activeElements[i].insertAdjacentHTML('beforeend', dot);
    }
}

function calendarInit() {
    function selected() {
        for (let d = 0; d < depObject.length; d++) {
            if (
                currentYear === depObject[d].year &&
                currentMonth === depObject[d].month
            ) {
                console.log(true);
                for (let i = depObject[d].day; i <= arrObject[d].arrDay; i++) {
                    var a = document.getElementsByClassName(i);
                    a[0].classList.add('active');
                }
            }
        }
    }

    // // 날짜 정보 가져오기
    var date = new Date(); // 현재 날짜(로컬 기준) 가져오기
    var utc = date.getTime() + date.getTimezoneOffset() * 60 * 1000; // uct 표준시 도출
    var kstGap = 9 * 60 * 60 * 1000; // 한국 kst 기준시간 더하기
    var today = new Date(utc + kstGap); // 한국 시간으로 date 객체 만들기(오늘)

    var thisMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );
    // 달력에서 표기하는 날짜 객체

    var currentYear = thisMonth.getFullYear(); // 달력에서 표기하는 연
    var currentMonth = thisMonth.getMonth(); // 달력에서 표기하는 월
    var currentDate = thisMonth.getDate(); // 달력에서 표기하는 일

    // 캘린더 렌더링
    renderCalender(thisMonth);

    function renderCalender(thisMonth) {
        // 렌더링을 위한 데이터 정리
        currentYear = thisMonth.getFullYear();
        currentMonth = thisMonth.getMonth();
        currentDate = thisMonth.getDate();

        // 이전 달의 마지막 날 날짜와 요일 구하기
        var startDay = new Date(currentYear, currentMonth, 0);
        var prevDate = startDay.getDate();
        var prevDay = startDay.getDay();

        // 이번 달의 마지막날 날짜와 요일 구하기
        var endDay = new Date(currentYear, currentMonth + 1, 0);
        var nextDate = endDay.getDate();
        var nextDay = endDay.getDay();

        // console.log(prevDate, prevDay, nextDate, nextDay);

        // 현재 월 표기
        $('.year-month').text(currentYear + '.' + (currentMonth + 1));

        // 렌더링 html 요소 생성
        calendar = document.querySelector('.dates');
        calendar.innerHTML = '';

        // 지난달
        for (var i = prevDate - prevDay + 1; i <= prevDate; i++) {
            calendar.innerHTML =
                calendar.innerHTML +
                '<div class="day prev disable ' +
                i +
                '">' +
                i +
                '</div>';
        }
        // 이번달
        for (var i = 1; i <= nextDate; i++) {
            calendar.innerHTML =
                calendar.innerHTML +
                '<div class="day current ' +
                i +
                '">' +
                i +
                '</div>';
        }
        // 다음달
        for (var i = 1; i <= (7 - nextDay == 7 ? 0 : 7 - nextDay); i++) {
            calendar.innerHTML =
                calendar.innerHTML +
                '<div class="day next disable ' +
                i +
                '">' +
                i +
                '</div>';
        }

        // 오늘 날짜 표기
        if (today.getMonth() == currentMonth) {
            todayDate = today.getDate();
            var currentMonthDate = document.querySelectorAll('.dates .current');
            currentMonthDate[todayDate - 1].classList.add('today');
        }
        selected();
        active();
    }

    // 이전달로 이동
    $('.go-prev').on('click', function () {
        thisMonth = new Date(currentYear, currentMonth - 1, 1);
        renderCalender(thisMonth);
    });

    // 다음달로 이동
    $('.go-next').on('click', function () {
        thisMonth = new Date(currentYear, currentMonth + 1, 1);
        renderCalender(thisMonth);
    });
}
