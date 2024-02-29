// 현재 날짜를 나타내는 Date 객체 생성
var currentDate = new Date();

// 현재 월을 가져옴
var currentMonth = currentDate.getMonth();
var currentMonthName = currentMonth + 1 + '월';

// 현재 연도를 가져옴
var currentYear = currentDate.getFullYear();
var currentYearName = currentYear + '년';

//사용자가 선택한 연도와 달 입력 받는 변수
// 기본으로는 현재 연도와 달로 설정해 놓는다.
var year;
var month;
// 일자와 요일
var departureDate;
var arrivalDate;

const selectYear = document.querySelector('#select-year');
const selectMonth = document.querySelector('#select-month');

//선택한 연도와 월 변수에 저장하는 함수 & 선택한 연도와 월에 따라 달력 다르게 표시
async function changeYear() {
    year = selectYear.options[selectYear.selectedIndex].value;
    console.log(year);
    await printCalendar(year, month);
    await runGetSelectedDate();
}
async function changeMonth() {
    month = selectMonth.options[selectMonth.selectedIndex].value;
    console.log(month);
    await printCalendar(year, month - 1);
    await runGetSelectedDate();
}

function printYearMonth() {
    //현재 년과 월을 사용해서 셀렉트 박스의 option 목록 동적 생성
    // 년도 선택
    isYearOptionExisted = false;
    selectYear.addEventListener('focus', () => {
        if (!isYearOptionExisted) {
            isYearOptionExisted = true;
            for (var i = currentYear; i <= currentYear + 50; i++) {
                // option element 생성
                const yearOption = document.createElement('option');
                yearOption.setAttribute('value', i);
                yearOption.innerText = i;
                selectYear.appendChild(yearOption);
            }
        }
        changeYear();
    });
    // 월 선택
    isMonthOptionExisted = false;
    selectMonth.addEventListener('focus', () => {
        if (!isMonthOptionExisted) {
            isMonthOptionExisted = true;
            for (var i = 1; i <= 12; i++) {
                // option element 생성
                const monthOption = document.createElement('option');
                monthOption.setAttribute('value', i);
                monthOption.innerText = i;
                selectMonth.appendChild(monthOption);
            }
        }
        changeMonth();
    });
}

//이번 달 달력 그리기
calendar_box = document.getElementById('calendar');

function printCalendar() {
    //① 현재 날짜와 현재 달에 1일의 날짜 객체를 생성합니다.
    var date = new Date(); //날짜 객체 생성
    var nowY = date.getFullYear(); //현재 연도
    var nowM = date.getMonth(); //현재 월
    var nowD = date.getDate(); //현재 일

    year = year != undefined ? year : nowY;
    month = month != undefined ? month : nowM;
    console.log(year, month);

    /* 현재 월의 1일에 요일을 구합니다. 그럼 그달 달력에 첫 번째 줄 빈칸의 개수를 구할 수 있습니다.*/
    var theDate = new Date(year, month, 1);
    var theDay = theDate.getDay();

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
    calendar += '<th>MON</th>';
    calendar += '<th>TUE</th>';
    calendar += '<th>WED</th>';
    calendar += '<th>THU</th>';
    calendar += '<th>FRI</th>';
    calendar += '<th>SAT</th>';
    calendar += '<th>SUN</th>';
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
                // console.log(prevLastDate);
                calendar += '<td> 고민중.. </td>';
            } else {
                // 오늘 날짜에 대한 스타일 적용
                if (dNum === nowD) {
                    calendar += "<td id='today' class='date'>" + dNum + '</td>';
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

//날짜 선택해서 띄우기
async function getSelectedDate() {
    return new Promise((resolve) => {
        var selectedDate = {};

        var table = document.getElementById('calendar_table');
        table.addEventListener('click', (e) => {
            var dList = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

            if (e.target.tagName === 'TD') {
                var date = e.target.innerText;
                var day = dList[e.target.cellIndex];
                var m = month + 1;
                selectedDate = { year, m, date, day };
                // Resolve the promise with the selectedDate object
                resolve(selectedDate);
            }
        });
    });
}

// // selectedDate = { year, m, date, day } 입력받는다.
async function runGetSelectedDate() {
    var departureDate = await getSelectedDate();
    console.log('dep', departureDate);
    if (departureDate) {
        var arrivalDate = await getSelectedDate();
        console.log('arr', arrivalDate);
    }
}

//함수 실행
printYearMonth();
printCalendar();
runGetSelectedDate();
