// 현재 날짜를 나타내는 Date 객체 생성
var currentDate = new Date();

// 현재 월을 가져옴
var currentMonth = currentDate.getMonth();

// 현재 연도를 가져옴
var currentYear = currentDate.getFullYear();

//사용자가 선택한 연도와 달 입력 받는 변수
var year = currentYear;
var month = currentMonth;

// 일자와 요일
var departureDate;
var arrivalDate;

const selectYear = document.querySelector('#selectYear');
const selectMonth = document.querySelector('#selectMonth');

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
    //① 현재 날짜와 현재 달에 1일의 날짜 객체를 생성합니다.
    var date = new Date(); //날짜 객체 생성
    var nowY = date.getFullYear(); //현재 연도
    var nowM = date.getMonth(); //현재 월
    var nowD = date.getDate(); //현재 일
    // 기본으로는 현재 연도와 달로 설정해 놓는다.
    year = year != undefined ? year : nowY;
    month = month != undefined ? month : nowM;
    console.log(year, month);

    /* 현재 월의 1일에 요일을 구합니다. 그럼 그달 달력에 첫 번째 줄 빈칸의 개수를 구할 수 있습니다.*/
    var theDate = new Date(year, month, 1);
    var theDay = theDate.getDay() + 1;

    //② 현재 월에 마지막 일을 구해야 합니다.

    //1월부터 12월까지 마지막 일을 배열로 저장함.
    var last = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    /*현재 연도가 윤년(4년 주기이고 100년 주기는 제외합니다.
                또는 400년 주기)일경우 2월에 마지막 날짜는 29가 되어야 합니다.*/
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
        lastDate = last[1] = 29;

    var lastDate = last[month]; //현재 월에 마지막이 몇일인지 구합니다.

    //③ 현재 월의 달력에 필요한 행의 개수를 구합니다.
    var row = Math.ceil((theDay + lastDate) / 7); //필요한 행수

    //④ 달력 년도/월 표기 및  달력 테이블 생성
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

    // console.log(nowD);

    var dNum = 1;
    //이중 for문을 이용해 달력 테이블을 생성
    for (var i = 1; i <= row; i++) {
        //행 생성 (tr 태그 생성)
        calendar += '<tr>';

        for (var k = 1; k <= 7; k++) {
            //열 생성 (td 태그 생성)
            /*행이 첫 줄이고 현재 월의 1일의 요일 이전은 모두 빈열로 표기하고 날짜가 마지막 일보다 크면 빈열로 표기됩니다.*/
            // console.log(k);
            if ((i == 1 && k < theDay) || dNum > lastDate) {
                calendar += '<td>  </td>';
            } else {
                // 오늘 날짜에 대한 스타일 적용
                if (dNum === nowD) {
                    calendar +=
                        `<td id='today' class='date '>` + dNum + '</td>';
                } else {
                    calendar += '<td class="date">' + dNum + '</td>';
                }
                dNum++;
            }
        }
        calendar += '<tr>';
    }

    //⑤ 문자로 결합된 달력 테이블을 문서에 출력
    calendar_box.innerHTML = calendar;
}

//연도 변경하면 달력 다시 그리는 함수
selectYear.addEventListener('change', () => {
    year = selectYear.options[selectYear.selectedIndex].value;
    m = Number(selectMonth.options[selectMonth.selectedIndex].value);
    month = m - 1;
    printCalendar(year, month);
});
//월 변경하면 달력 다시 그리는 함수
selectMonth.addEventListener('change', () => {
    year = selectYear.options[selectYear.selectedIndex].value;
    m = Number(selectMonth.options[selectMonth.selectedIndex].value);
    month = m - 1;
    printCalendar(year, month);
});

//날짜 선택해서 띄우기
var selectedDate = {};
async function getSelectedDate() {
    return new Promise((resolve) => {
        var table = document.getElementById('calendar_table');
        table.addEventListener('click', (e) => {
            var active = document.querySelector('.active');
            if (active) {
                active.classList.remove('active');
            }
            var dList = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            if (e.target.tagName === 'TD') {
                e.target.classList.add('active');
                var date = e.target.innerText;
                var day = dList[e.target.cellIndex];
                var m = month;
                selectedDate = { year, m, date, day };
                resolve(selectedDate);
                console.log(selectedDate);
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
function selectDep() {
    //출발일 선택
    depDate = `${selectedDate.year}-${String(selectedDate.m + 1).padStart(
        2,
        '0'
    )}-${String(selectedDate.date).padStart(2, '0')}`;
    console.log('depDate', depDate);
    document.querySelector('#selectDep').classList.add('hide');
    document.querySelector('#selectArr').classList.remove('hide');
    dep = {
        year: selectedDate.year,
        m: selectedDate.m,
        date: Number(selectedDate.date),
    };
    console.log('dep', dep);
    var active = document.querySelector('.active');
    if (active) {
        active.classList.remove('active');
        active.classList.add('on');
        console.log(active.classList);
    }
}
function selectArr() {
    //도착일 선택
    arrDate = `${selectedDate.year}-${String(selectedDate.m + 1).padStart(
        2,
        '0'
    )}-${String(selectedDate.date).padStart(2, '0')}`;
    console.log(arrDate);
    arr = {
        year: selectedDate.year,
        m: selectedDate.m,
        date: Number(selectedDate.date),
    };

    //창 맨 위에 일정 띄우기
    document.querySelector('.depDate').textContent = `${String(
        dep.m + 1
    ).padStart(2, '0')}월 ${String(dep.date).padStart(2, '0')}일`;
    document.querySelector('.arrDate').textContent = `${String(
        arr.m + 1
    ).padStart(2, '0')}월 ${String(arr.date).padStart(2, '0')}일`;

    document.querySelector('#selectArr').classList.add('hide');
    document.querySelector('.container_calendar').classList.add('hide');
    document.querySelector('.container_schedule').classList.remove('hide');
}
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
        console.log('res', res.data.result);
        const resultBox = document.querySelector('.search_result');
        resultBox.innerHTML = '';
        for (let i = 0; i < res.data.result.length; i++) {
            const { id, userId } = res.data.result[i];
            const html = `
		<button type="button" onclick="addId(${id})" class="result_id">${userId}</button>
		`;
            resultBox.insertAdjacentHTML('beforeend', html);
        }
    });

let groupMember = [];
let bestId;
let groupId;
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
        console.log(res.data.result);
        const { depDate, arrDate, groupName, groupMemo } = res.data.result;
        const [transDep, _] = depDate.split('T');
        const [depY, depM, depD] = transDep.split('-');
        console.log(depY, depM, depD);
        const [transArr, __] = arrDate.split('T');
        const [arrY, arrM, arrD] = transArr.split('-');
        console.log(arrY, arrM, arrD);
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
    groupMember.push(i);
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
