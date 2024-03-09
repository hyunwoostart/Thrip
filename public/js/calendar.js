var currentDate = new Date();
var currentMonth = currentDate.getMonth();
var currentYear = currentDate.getFullYear();
var year = currentYear;
var month = currentMonth;
var departureDate;
var arrivalDate;
const selectYear = document.querySelector('#selectYear');
const selectMonth = document.querySelector('#selectMonth');
let groupMember = [];
let bestId;
let groupId;

//연도와 월 select에 option 만드는 함수
function makeSelect() {
    //현재 년과 월을 사용해서 셀렉트 박스의 option 목록 동적 생성
    // 년도 선택
    for (var i = currentYear; i <= currentYear + 50; i++) {
        // option element 생성
        const yearOption = document.createElement('option');
        yearOption.setAttribute('value', i);
        yearOption.setAttribute('id', i);
        yearOption.innerText = i;
        selectYear.appendChild(yearOption);
        document
            .getElementById(currentYear)
            .setAttribute('selected', 'selected');
    }
    // 월 선택
    for (var i = 1; i <= 12; i++) {
        // option element 생성
        const monthOption = document.createElement('option');
        monthOption.setAttribute('value', i);
        monthOption.setAttribute('id', i);
        monthOption.innerText = i;
        selectMonth.appendChild(monthOption);
        var m = (currentMonth + 1).toString();
        var element = document.getElementById(m);
        if (element) {
            element.setAttribute('selected', 'selected');
        }
    }
}

//이번 달 달력 그리기
calendar_box = document.getElementById('calendar');
//달력 만드는 함수
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

    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        lastDate = last[1] = 29;
    }

    var lastDate = last[month]; //현재 월에 마지막이 몇일인지 구합니다.
    var row = Math.ceil((theDay + lastDate) / 7); //필요한 행수
    calendar_box.innerHTML = '<h2>' + year + '.' + (month + 1) + '</h2>';

    //문자결합 연산자를 사용해 요일이 나오는 행을 생성
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
                calendar += '<td class ="none">  </td>';
            } else {
                // 오늘 날짜에 대한 스타일 적용
                if (nowY === year && nowM === month && dNum === nowD) {
                    calendar += `<td id="today" class="date">${dNum}</td>`;
                } else {
                    calendar += `<td class="date">${dNum}</td>`;
                }
                dNum++;
            }
        }
        calendar += '<tr>';
    }
    calendar_box.innerHTML = calendar;
}

//연도 변경하면 달력 다시 그리는 함수
selectYear.addEventListener('change', () => {
    year = selectYear.options[selectYear.selectedIndex].value;
    m = Number(selectMonth.options[selectMonth.selectedIndex].value);
    month = m - 1;
    printCalendar(year, month);
    getSelectedDate();
});
//월 변경하면 달력 다시 그리는 함수
selectMonth.addEventListener('change', () => {
    year = selectYear.options[selectYear.selectedIndex].value;
    m = Number(selectMonth.options[selectMonth.selectedIndex].value);
    month = m - 1;
    printCalendar(year, month);
    getSelectedDate();
});
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
    changeSelected(year, month);
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
    changeSelected(year, month);
    getSelectedDate();
});
//selected 자동 변경 함수
// prettier-ignore
function changeSelected(year, month) {
    // 이미 selected 된 연도와 월
    const selectedMonthOption = selectMonth.querySelector('option[selected="selected"]');
    const selectedYearOption = selectYear.querySelector('option[selected="selected"]');
    // 변경해야할 연도와 월
    const targetYear = document.getElementById(year);
    const targetMonth = document.getElementById(month+1);
    selectedMonthOption.removeAttribute('selected');
    selectedYearOption.removeAttribute('selected');
    targetYear.setAttribute('selected', 'selected');
    targetMonth.setAttribute('selected', 'selected');
    console.log(targetYear, targetMonth)
}

//날짜 선택해서 띄우기
var selectedDate = {};
async function getSelectedDate() {
    return new Promise((resolve) => {
        var table = document.getElementById('calendar_table');
        table.addEventListener('click', (e) => {
            //전에 active 되있는게 있다면 지우기
            var active = document.querySelector('.active');
            if (active) {
                active.classList.remove('active');
            }
            var dList = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            if (!e.target.classList.contains('none')) {
                if (e.target.tagName === 'TD') {
                    e.target.classList.add('active');
                    var date = e.target.innerText;
                    var day = dList[e.target.cellIndex];
                    var m = month;
                    selectedDate = { year, m, date, day };
                    resolve(selectedDate);
                }
            }
        });
    });
}

//함수 실행
printCalendar(year, month);
makeSelect();
getSelectedDate();
let dep = {};
let arr = {};
let depDate;
let arrDate;
//prettier-ignore
function selectDep() {
    //출발일 선택
    depDate = `${selectedDate.year}-${String(selectedDate.m + 1).padStart(2,'0')}-${String(selectedDate.date).padStart(2, '0')}`;
    document.querySelector('#selectDep').classList.add('hide');
    document.querySelector('#selectArr').classList.remove('hide');
    dep = {year: selectedDate.year,m: selectedDate.m,date: Number(selectedDate.date)};
    console.log('dep', dep);
    var active = document.querySelector('.active');
    if (active) {
        active.classList.remove('active');
        active.classList.add('on');
    }
}
//prettier-ignore
function selectArr() {
    //도착일 선택
    arrDate = `${selectedDate.year}-${String(selectedDate.m + 1).padStart(2,'0')}-${String(selectedDate.date).padStart(2, '0')}`;
    console.log(arrDate);
    arr = {year: selectedDate.year,m: selectedDate.m,date: Number(selectedDate.date)};
    //창 맨 위에 일정 띄우기
    document.querySelector('.depDate').textContent = `${String(dep.m + 1).padStart(2, '0')}월 ${String(dep.date).padStart(2, '0')}일`;
    document.querySelector('.arrDate').textContent = `${String(arr.m + 1).padStart(2, '0')}월 ${String(arr.date).padStart(2, '0')}일`;

    document.querySelector('#selectArr').classList.add('hide');
    document.querySelector('.container_calendar').classList.add('hide');
    document.querySelector('.container_schedule').classList.remove('hide');
}
//prettier-ignore
function selectReset() {
    depDate = '';
    arrDate = '';
    document.querySelector('.container_schedule').classList.add('hide');
    document.querySelector('#selectDep').classList.remove('hide');
    document.querySelector('.container_calendar').classList.remove('hide');
}
document
    .querySelector('#searchBtn')
    .addEventListener('click', async function (e) {
        e.preventDefault();
        const res = await axios({
            method: 'GET',
            url: '/api/member/findId',
            params: {
                userId: document.querySelector('#memberSearch').value,
            },
        });
        const resultBox = document.querySelector('.search_result');
        resultBox.innerHTML = '';
        for (let i = 0; i < res.data.result.length; i++) {
            const { id, userId } = res.data.result[i];
            const html = `
			<button type="button" onclick="addId(${id})" class="result_id" id="resultBtn${id}">${userId}</button>
			`;
            resultBox.insertAdjacentHTML('beforeend', html);
            if (groupMember.includes(id)) {
                document.querySelector(`#resultBtn${id}`).classList.add('on');
            }
        }
    });

(async function () {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/member/find',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const { id } = res.data.result;
        groupMember.push(id);
    } catch (error) {
        document.location.href = '/login';
    }
    if (localStorage.getItem('bestId')) {
        bestId = localStorage.getItem('bestId');
        const res = await axios({
            method: 'GET',
            url: '/api/schedule/findGroup',
            params: {
                id: bestId,
            },
        });
        document.querySelector('#groupName').value = res.data.result.groupName;
    } else if (localStorage.getItem('groupId')) {
        groupId = localStorage.getItem('groupId');
        const res = await axios({
            method: 'GET',
            url: '/api/schedule/findGroup',
            params: {
                id: groupId,
            },
        });
        const { depDate, arrDate, groupName, groupMemo } = res.data.result;
        const [transDep, _] = depDate.split('T');
        const [depY, depM, depD] = transDep.split('-');
        const [transArr, __] = arrDate.split('T');
        const [arrY, arrM, arrD] = transArr.split('-');

        groupMember = res.data.result.groupMember;
        dep = {
            year: Number(depY),
            m: Number(depM) + 1,
            date: Number(depD),
        };
        arr = {
            year: Number(arrY),
            m: Number(arrM) + 1,
            date: Number(arrD),
        };

        document.querySelector('#selectArr').classList.add('hide');
        document.querySelector('.container_calendar').classList.add('hide');
        document.querySelector('.container_schedule').classList.remove('hide');
        document.querySelector('.depDate').textContent = `${dep.m}월 ${depD}일`;
        document.querySelector('.arrDate').textContent = `${arr.m}월 ${arrD}일`;
        document.querySelector('#groupName').value = groupName;
        document.querySelector('#groupMemo').value = groupMemo;
    }
})();

function addId(i) {
    if (groupMember.includes(i)) {
        groupMember = groupMember.filter((id) => id != i);
        document.querySelector(`#resultBtn${i}`).classList.remove('on');
    } else {
        groupMember.push(i);
        document.querySelector(`#resultBtn${i}`).classList.add('on');
    }
    console.log(groupMember);
}

async function register() {
    const stDate = new Date(dep.year, dep.m, dep.date);
    const endDate = new Date(arr.year, arr.m, arr.date);
    console.log('stDate', stDate, 'endDate', endDate);
    const dueDate =
        (endDate.getTime() - stDate.getTime()) / (1000 * 60 * 60 * 24);
    const data = {
        depDate,
        arrDate,
        dueDate: dueDate + 1,
        groupName: document.querySelector('#groupName').value,
        groupMember,
        groupMemo: document.querySelector('#groupMemo').value,
    };
    if (groupId && !bestId) {
        data.id = groupId;
    }
    const res = await axios({
        method: 'POST',
        url: '/api/schedule/groupWrite',
        data,
    });
    localStorage.setItem('groupId', res.data.result.id);
    document.location.href = '/map';
}
