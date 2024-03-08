// 여행 목록
const list = document.querySelector('#upcoming ul');
const prevList = document.querySelector('#prev ul');
const dates = [];
const depObject = [];
const arrObject = [];
let myId;
(async function () {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/member/find',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        myId = res.data.result.id;
        if (res.data.result.mySchedule[0]) {
            const res2 = await axios({
                method: 'GET',
                url: '/api/schedule/scheduleList',
                params: { id: res.data.result.id },
            });
            let count = 0;
            for (let i = 0; i < res2.data.result.length; i++) {
                const { groupName, depDate, arrDate, id } = res2.data.result[i];
                const now = new Date();
                const YEAR = now.getFullYear();
                const MONTH = now.getMonth() + 1;
                const DATE = now.getDate();
                const depY = Number(depDate.substring(0, 4));
                const depM = Number(depDate.substring(5, 7));
                const depD = Number(depDate.substring(8, 10));
                const arrY = Number(arrDate.substring(0, 4));
                const arrM = Number(arrDate.substring(5, 7));
                const arrD = Number(arrDate.substring(8, 10));
                dates.push({ groupName, depDate, arrDate, id });
                depObject.push({ year: depY, month: depM - 1, day: depD });
                arrObject.push({ year: arrY, month: arrM - 1, arrDay: arrD });
                const html = `
				<li>
					<div class="trip_schedule">
						<div onclick="goDetail(${id})">
							<strong>${groupName}</strong>
							<span>${depY}.${depM}.${depD} - ${arrY}.${arrM}.${arrD}</span>
						</div>
                        <div class="input_wrap">
                            <button type="button" class="btn_delete" onclick="removeGroup(${id}, '${groupName}')"></button>
                        </div>
                        <div class="trip_memo">
                            <p></p>
                        </div>
					</div>
				</li>
				`;
                if (arrY >= YEAR && arrM >= MONTH && arrD >= DATE) {
                    list.insertAdjacentHTML('beforeend', html);
                } else {
                    prevList.insertAdjacentHTML('beforeend', html);
                    count++;
                }
            }
            if (count != 0) {
                document.querySelector('#prev h3').textContent = '지난 여행 일정';
            }
        }
    } catch (error) {
        // document.location.href = '/login';
    }
    calendarInit();
})();
function goDetail(id) {
    localStorage.setItem('groupId', id);
    document.location.href = '/tripdetail';
}
function insert() {
    localStorage.removeItem('groupId');
    document.location.href = '/calendar';
}
async function removeGroup(index, name) {
    if (!confirm(`${name} 일정을 삭제하시겠습니까?`)) {
        return;
    } else {
        const res = await axios({
            method: 'PATCH',
            url: '/api/schedule/removeGroup',
            data: {
                memberId: myId,
                groupId: index,
            },
        });
        if (res.data.success) {
            alert(`${res.data.result} 일정 삭제가 완료되었습니다.`);
            document.location.reload();
        }
    }
}

//달력
// prettier-ignore
function calendarInit() {
    function selected() {
        for (let d = 0; d < depObject.length; d++) {
            if (year === depObject[d].year && month === depObject[d].month) {
                for (let i = depObject[d].day; i <= arrObject[d].arrDay; i++) {
                    var a = document.getElementById(i);
                    a.innerHTML+=`<span class="material-symbols-outlined" style="font-size: 14px;">fiber_manual_record</span>`
                }
            }
        }
    }
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth();
    var currentYear = currentDate.getFullYear();
    var year = currentYear;
    var month = currentMonth;
    calendar_box = document.getElementById('calendar');
    function printCalendar(year, month) {
        var date = new Date(); //날짜 객체 생성
        var nowY = date.getFullYear(); //현재 연도
        var nowM = date.getMonth(); //현재 월
        var nowD = date.getDate(); //현재 일
        // 기본으로는 현재 연도와 달로 설정해 놓는다.
        year = year != undefined ? year : nowY;
        month = month != undefined ? month : nowM;
        var theDate = new Date(year, month, 1);
        var theDay = theDate.getDay() + 1;
        var last = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
            lastDate = last[1] = 29;

        var lastDate = last[month]; //현재 월에 마지막이 몇일인지 구한다.
        var row = Math.ceil((theDay + lastDate) / 7); //필요한 행수
        var yearMonthBox = document.getElementById('yearMonthBox');
        yearMonthBox.innerHTML = '<h1>' + year + '.' + (month + 1) + '</h1>';
        var calendar = "<table id=calendar_table border='1'>";
        calendar += '<tr>';
        calendar += '<th>SUN</th>';
        calendar += '<th>MON</th>';
        calendar += '<th>TUE</th>';
        calendar += '<th>WED</th>';
        calendar += '<th>THU</th>';
        calendar += '<th>FRI</th>';
        calendar += '<th>SAT</th>';
        calendar += '</tr>';
        var dNum = 1;
        //이중 for문을 이용해 달력 테이블을 생성
        for (var i = 1; i <= row; i++) {
            //행 생성 (tr 태그 생성)
            calendar += '<tr>';
            for (var k = 1; k <= 7; k++) {
                if ((i == 1 && k < theDay) || dNum > lastDate) {
                    calendar += '<td>  </td>';
                } else {
                    // 오늘 날짜에 대한 스타일 적용
                    if (nowY === year && nowM === month && dNum === nowD) {
                        calendar +=
                            `<td id='today' class='date '>` + dNum + '</td>';
                    } else {
                        calendar += `<td id ='${dNum}' class = 'date'>${dNum}</td>`;
                    }
                    dNum++;
                }
            }
            calendar += '<tr>';
        }
        calendar_box.innerHTML = calendar;
    }
    printCalendar(year, month);
    selected();

    // 이전달로 이동
    $('.go-prev').on('click', function () {
        if (month === 0) {
            year = year - 1;
            month = 11;
        } else {
            month = month - 1;
        }
        console.log(year, month);
        printCalendar(year, month);
        selected();
    });
    // 다음달로 이동
    $('.go-next').on('click', function () {
        if (month === 11) {
            year = year + 1;
            month = 0;
        } else {
            month = month + 1;
        }
        console.log(year, month);
        printCalendar(year, month);
        selected();
    });
}
