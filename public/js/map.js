//==================지도 api======================================
// 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
var mapContainer;
var mapOption;
var map;
let nowIndex;
let tabForm;
let form;

// 소요시간 계산 함수
function duration(distance) {
    let distanceText;
    if (distance >= 1000) {
        distanceText = `(약 ${distance / 1000}km)`;
    } else {
        distanceText = `(약 ${distance}m)`;
    }
    if (distance >= 15000) {
        return `소요시간 ${(distance / 250 / 60).toFixed(0)}시간 ${((distance / 250) % 60).toFixed(
            0
        )}분 ${distanceText}`;
    } else {
        return `소요시간 ${((distance / 250) % 60).toFixed(0)}분 ${distanceText}`;
    }
}

function makeMap(id) {
    nowIndex = id;
    form = tabForm.querySelectorAll('.detail-schedule')[id - 1];
    if (document.querySelector('.map')) {
        document.querySelector('.map').remove(); //지도 지우기
    }
    const div = document.createElement('div');
    div.className = 'map';
    form.querySelector('.map_box').insertAdjacentElement('beforeend', div);
    mapContainer = document.querySelector('.map'); // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
    };

    // 지도를 생성합니다
    map = new kakao.maps.Map(mapContainer, mapOption);
}

//출발지와 도착지를 담는 배열입니다.
let array = [];
//array배열에 정보를 담은 객체 넣어주기
let obj = { x: 0, y: 0, place_name: '' };
// 출발지와 도착지 사이의 거리를 담는 변수입니다.
let distance = 0;
// 출발지 도착지 배열 담는 함수
function pushArray(obj, array) {
    array.push(obj);
    console.log(obj);
}
//좌표 입력받아서 거리 계산하는 함수
function getDistance(lat1, lng1, lat2, lng2) {
    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lng2 - lng1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = (R * c).toFixed(1) * 1000; // Distance in km
    return d;
}

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places();

//검색하는 함수입니다.
async function keyword(id) {
    console.log('first');
    form = tabForm.querySelectorAll('.detail-schedule')[id - 1];
    form.querySelector('.map').classList.remove('hide');
    map.relayout();
    var place_name = form.querySelector('.place_name').value;
    ps.keywordSearch(place_name, placesSearchCB);
    nowIndex = id;
}

// 키워드 검색 완료 시 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        var bounds = new kakao.maps.LatLngBounds();

        for (var i = 0; i < data.length; i++) {
            displayMarker(data[i]);
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
    }
}
// 지도에 마커를 표시하는 함수입니다
function displayMarker(place) {
    // 마커를 생성하고 지도에 표시합니다
    var marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
    });
    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'click', function () {
        // console.log(place.x);
        form.querySelector('.select').innerHTML = place.place_name;
        form.querySelector('.select').classList.add('active');
        // `<div>위치 : ${place.place_name}<br>위도 : ${place.y} <br> 경도 :${place.x} </div>`;
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name, '</div>');
        infowindow.open(map, marker);
        //좌표 담는 객체 안에 x,y로 저장합니다.
        form.querySelector('.obj_x').value = place.x;
        form.querySelector('.obj_y').value = place.y;
        form.querySelector('.obj_place_name').value = place.place_name;
        obj = {
            x: place.x,
            y: place.y,
            place_name: place.place_name,
        };
        pushArray(obj, array);
        const prevForm = tabForm.querySelectorAll('.detail-schedule')[nowIndex - 2];
        if (nowIndex >= 2 && prevForm.querySelector('.obj_x').value) {
            console.log('두개의 좌표 사이의 거리 측정 시작');
            distance = getDistance(
                prevForm.querySelector('.obj_x').value,
                prevForm.querySelector('.obj_y').value,
                form.querySelector('.obj_x').value,
                form.querySelector('.obj_y').value
            );
            form.querySelector('.result').innerHTML = duration(distance);
            form.querySelector('.result').classList.add('active');
            form.querySelector('.distance').value = distance;
        }
        if (nowIndex >= 2 && nowIndex < tabForm.querySelectorAll('.detail-schedule').length) {
            const nextForm = tabForm.querySelectorAll('.detail-schedule')[nowIndex];
            if (nextForm.querySelector('.obj_x').value) {
                distance = getDistance(
                    form.querySelector('.obj_x').value,
                    form.querySelector('.obj_y').value,
                    nextForm.querySelector('.obj_x').value,
                    nextForm.querySelector('.obj_y').value
                );
                nextForm.querySelector('.result').innerHTML = duration(distance);
                form.querySelector('.distance').value = distance;
            }
        }
    });
}

// 마커 이름 클릭 이벤트
function selectFunc() {
    form.querySelector('.place_name').value = form.querySelector('.select').textContent;
    document.querySelector('.map').remove(); //지도 지우기
    form.querySelector('.select').textContent = '';
    form.querySelector('.select').classList.remove('active');
}

//========================================================================

//==================여행 세부일정 js ======================================
// 바로 실행 함수
let timeHtml;
let minHtml;
(async function () {
    try {
        // 사용자 인증
        const res = await axios({
            method: 'GET',
            url: '/api/member/find',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        for (let i = 0; i < 12; i++) {
            timeHtml += `<option value="${String(i + 1).padStart(2, '0')}">${String(i + 1).padStart(2, '0')}</option>`;
        }
        for (let i = 0; 5 * i < 60; i++) {
            minHtml += `<option value="${String(i * 5).padStart(2, '0')}">${String(i * 5).padStart(2, '0')}</option>`;
        }
        if (localStorage.getItem('groupId')) {
            // 그룹아이디로 소요일 불러오기
            const res2 = await axios({
                method: 'GET',
                url: '/api/schedule/findGroup',
                params: {
                    id: localStorage.getItem('groupId'),
                },
            });
            // 베스트 일정에서 넘어 온 경우 베스트 아이디의 일정 불러오기
            let roadId;
            if (localStorage.getItem('bestId')) {
                roadId = localStorage.getItem('bestId');
            } else {
                roadId = localStorage.getItem('groupId');
            }
            const res3 = await axios({
                method: 'GET',
                url: '/api/schedule/detail',
                params: {
                    groupId: roadId,
                },
            });
            const tabMenu = document.querySelector('.tab_menu');
            const { dueDate } = res2.data.result;
            // 탭 생성
            for (let i = 0; i < dueDate; i++) {
                const html = `
				<li class="rectrip_cnt" onclick="tabFunc(${i + 1})">
				<a href="#none">${i + 1}일차</a>
				</li>
				`;
                tabMenu.insertAdjacentHTML('beforeend', html);
                const formDiv = document.createElement('div');
                formDiv.classList.add('schedule-form');
                formDiv.classList.add('hide');
                document.querySelector('#wrap').appendChild(formDiv);
                let html2 = `
					<div class="detail-schedule">
						<input type="hidden" class="category" value="${i + 1}" />
						<div class="result"></div>
						<div class="input_wrap">
							<input type="number" class="index" value="1" readonly disabled />
							<button type="button" onclick="deleteFunc(${i + 1}, 1)" class="btn_delete"></button>
						</div>
						<div class="time_box">
							<select name="divide" class="divide">
								<option value="am">오전</option>
								<option value="pm">오후</option>
							</select>
							<select name="time" class="time">${timeHtml}</select>
							<select name="minute" class="minute">${minHtml}</select>
						</div>
						<div class="input_wrap">
							<input class="place_name" placeholder="장소를 입력하세요" onfocus="makeMap(1)" onkeyup="if(window.event.keyCode == 13) {keyword(1)}" />
							<button type="button hidden" onclick="keyword(1)" value="검색" class="btn_holder btn_marker" readonly/>
						</div>
						<div class="select" onclick="selectFunc()"></div>
						<div class="map_box"></div>
						<input type="hidden" class="obj_x" />
						<input type="hidden" class="obj_y" />
						<input type="hidden" class="obj_place_name" />
						<input type="hidden" class="distance" />
						<input type="text" class="detailMemo" placeholder="메모" />
					</div>
				`;
                // 탭에 맞춰 내용 추가
                // 수정(해당 그룹아이디의 해당 카테고리 값이 없을 때)
                if (res3.data.result.length) {
                    let num = 0;
                    for (let j = 0; j < res3.data.result.length; j++) {
                        const { detailOrder, arrTime, category, detailMemo, distance, place } = res3.data.result[j];
                        if (category == i + 1) {
                            html2 = `
							<div class="detail-schedule">
								<input type="hidden" class="category" value="${i + 1}" />
								<div class="result active">${duration(distance)}</div>
								<div class="input_wrap">
									<input type="number" class="index" value="${detailOrder}" readonly disabled/>
									<button type="button" onclick="deleteFunc(${category}, ${num + 1})" class="btn_delete"></button>
								</div>
								<div class="time_box">
									<select name="divide" class="divide">
										<option value="am">오전</option>
										<option value="pm">오후</option>
									</select>
									<select name="time" class="time">${timeHtml}</select>
									<select name="minute" class="minute">${minHtml}</select>
								</div>
								<div class="input_wrap">
									<input class="place_name" placeholder="장소를 입력하세요" onfocus="makeMap(${num + 1})" value="${
                                place.place_name
                            }" onkeyup="if(window.event.keyCode == 13) {keyword(${num + 1})}" />
									<button type="button" onclick="keyword(${num + 1})" value="검색" class="btn_holder btn_marker" />
								</div>
								<div class="select" onclick="selectFunc()"></div>
								<div class="map_box"></div>
								<input type="hidden" class="obj_x" value="${place.x}" />
								<input type="hidden" class="obj_y" value="${place.y}" />
								<input type="hidden" class="obj_place_name" value="${place.place_name}" />
								<input type="hidden" class="distance" value="${distance}" />
								<input type="text" class="detailMemo" placeholder="메모" value="${detailMemo}" />
							</div>
							`;
                            document.querySelectorAll('.schedule-form')[i].insertAdjacentHTML('beforeend', html2);
                            // 시간 불러오기
                            const timeBox = document
                                .querySelectorAll('.schedule-form')
                                [i].querySelectorAll('.detail-schedule')
                                [num].querySelector('.time_box');
                            const [arrH, arrM, _] = arrTime.split(':');
                            timeBox.querySelector('.minute').value = arrM;
                            if ((Number(arrH) >= 0) & (Number(arrH) < 12)) {
                                timeBox.querySelector('.divide').value = 'am';
                                if (Number(arrH) === 0) {
                                    timeBox.querySelector('.time').value = '12';
                                } else {
                                    timeBox.querySelector('.time').value = arrH;
                                }
                            } else {
                                timeBox.querySelector('.divide').value = 'pm';
                                if (Number(arrH) === 12) {
                                    timeBox.querySelector('.time').value = '12';
                                } else {
                                    timeBox.querySelector('.time').value = String(Number(arrH) - 12).padStart(2, '0');
                                }
                            }
                            num++;
                        }
                    }
                    if (num === 0) {
                        document.querySelectorAll('.schedule-form')[i].insertAdjacentHTML('beforeend', html2);
                    }
                } else {
                    document.querySelectorAll('.schedule-form')[i].insertAdjacentHTML('beforeend', html2);
                }
                if (i === 0) {
                    document.querySelector('.rectrip_cnt').classList.add('on');
                    document.querySelector('.schedule-form').classList.remove('hide');
                }
                for (let k = 0; k < document.querySelectorAll('.schedule-form').length; k++) {
                    document.querySelectorAll('.schedule-form')[k].querySelectorAll('.result')[0].hidden = true;
                    document.querySelectorAll('.schedule-form')[k].querySelectorAll('.btn_delete')[0].hidden = true;
                }
            }
            localStorage.setItem('category', 1);
            tabForm = document.querySelectorAll('.schedule-form')[0];
            form = tabForm.querySelectorAll('.detail-schedule')[0];
        } else {
            location.href = document.referrer;
        }
    } catch (error) {
        console.log(error);
        document.location.href = '/';
    }
})();

// 시간 선택 박스 생성 변수

function makeSelect() {}

// 탭 버튼 클릭
function tabFunc(i) {
    localStorage.setItem('category', i);
    tabForm = document.querySelectorAll('.schedule-form')[i - 1];
    const tabBtn = document.getElementsByClassName('rectrip_cnt');
    const tabBox = document.getElementsByClassName('schedule-form');
    for (let j = 0; j < tabBtn.length; j++) {
        if (j === i - 1) {
            tabBtn[j].classList.add('on');
            tabBox[j].classList.remove('hide');
        } else {
            tabBtn[j].classList.remove('on');
            tabBox[j].classList.add('hide');
        }
    }
}

// 삭제 버튼
function deleteFunc(tab, id) {
    tabForm = document.querySelectorAll('.schedule-form')[tab - 1];
    form = tabForm.querySelectorAll('.detail-schedule')[id - 1];
    form.remove();
    console.log();
    for (let i = id; i <= tabForm.querySelectorAll('.detail-schedule').length; i++) {
        form = tabForm.querySelectorAll('.detail-schedule')[i - 1];
        const prevForm = tabForm.querySelectorAll('.detail-schedule')[i - 2];
        form.querySelector('.index').value = i;
        form.querySelector('.btn_delete').setAttribute('onclick', `deleteFunc(${tab}, ${i})`);
        form.querySelector('.place_name').setAttribute('onfocus', `makeMap(${i})`);
        form.querySelector('.place_name').setAttribute('onkeyup', `if(window.event.keyCode == 13) {keyword(${i})}`);
        form.querySelector('.btn_marker').setAttribute('onclick', `keyword(${i})`);
        if (form.querySelector('.obj_x').value) {
            const newDistance = getDistance(
                prevForm.querySelector('.obj_x').value,
                prevForm.querySelector('.obj_y').value,
                form.querySelector('.obj_x').value,
                form.querySelector('.obj_y').value
            );
            form.querySelector('.result').textContent = duration(newDistance);
            form.querySelector('.distance').value = newDistance;
        }
    }
}

//일정 추가하기
let tabIndex;
function insert() {
    tabIndex = tabForm.getElementsByClassName('detail-schedule').length + 1;
    // var target = tabForm.querySelectorAll('.schedule-form');
    var addCode = `
		<div class="detail-schedule">
			<input type="hidden" class="category" value="${localStorage.getItem('category')}" />
			<div class="result"></div>
            <div class="input_wrap">
                <input type="number" class="index" value="${tabIndex}" readonly disabled />
                <button type="button" onclick="deleteFunc(${localStorage.getItem(
                    'category'
                )}, ${tabIndex})" class="btn_delete"></button>
            </div>
			<div class="time_box">
				<select name="divide" class="divide">
					<option value="am">오전</option>
					<option value="pm">오후</option>
				</select>
				<select name="time" class="time">${timeHtml}</select>
				<select name="minute" class="minute">${minHtml}</select>
			</div>
			<div class="input_wrap">
				<input class="place_name" onfocus="makeMap(${tabIndex})" onkeyup="if(window.event.keyCode == 13) {keyword(${tabIndex})}" />
				<button type="button" onclick="keyword(${tabIndex})" value="검색" class="btn_holder btn_marker" />
			</div>
			<div class="select" onclick="selectFunc()"></div>
			<div class="map_box"></div>
			<input type="hidden" class="obj_x" />
			<input type="hidden" class="obj_y" />
			<input type="hidden" class="obj_place_name" />
			<input type="hidden" class="distance" />
			<input type="text" class="detailMemo" placeholder="메모" />
		</div>`;
    tabForm.insertAdjacentHTML('beforeend', addCode);
    // makeMap();
}
async function register() {
    if (!confirm('일정을 등록하시겠습니까?')) {
        return;
    }
    const require = document.querySelectorAll('.place_name');
    for (let i = 0; i < require.length; i++) {
        if (!require[i].value) {
            alert('모든 일정을 등록해주세요.');
            const tabNum = require[i].parentElement.parentElement.firstElementChild.value;
            tabFunc(tabNum);
            console.log(tabNum);
            require[i].focus();
            return;
        }
    }
    try {
        const content = document.querySelectorAll('.detail-schedule');
        console.log(content);
        for (let i = 0; i < content.length; i++) {
            const category = Number(content[i].querySelector('.category').value);
            const tabLength = document
                .querySelectorAll('.schedule-form')
                [category - 1].querySelectorAll('.detail-schedule').length;
            // 거리
            let nowDistance;
            if (content[i].querySelector('.distance').value) {
                nowDistance = content[i].querySelector('.distance').value;
            } else {
                nowDistance = 0;
            }
            // 시간
            let arrTime;
            const arrDiv = content[i].querySelector('.divide').value;
            const arrH = content[i].querySelector('.time').value;
            const arrM = content[i].querySelector('.minute').value;
            if (arrDiv === 'am' && arrH === '12') {
                arrTime = `00:${arrM}:00`;
            } else if (arrDiv === 'pm' && arrH != '12') {
                arrTime = `${Number(arrH) + 12}:${arrM}:00`;
            } else {
                arrTime = `${arrH}:${arrM}:00`;
            }
            // 데이터
            const data = {
                category,
                detailOrder: Number(content[i].querySelector('.index').value),
                arrTime,
                place: {
                    x: content[i].querySelector('.obj_x').value,
                    y: content[i].querySelector('.obj_y').value,
                    place_name: content[i].querySelector('.obj_place_name').value,
                },
                distance: nowDistance,
                detailMemo: content[i].querySelector('.detailMemo').value,
                groupId: localStorage.getItem('groupId'),
                tabLength,
            };
            console.log(tabLength);
            const res = await axios({
                method: 'POST',
                url: '/api/schedule/detailWrite',
                data,
            });
            console.log(res);
        }
        document.location.href = '/tripdetail';
    } catch (error) {
        alert('모든 일정을 입력해주세요');
    }
}

//========================================================================
