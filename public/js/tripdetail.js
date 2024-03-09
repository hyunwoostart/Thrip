const groupNameBox = document.querySelector('.main_txt h3');
const title = document.querySelector('title');
console.log(title);
const list = document.querySelector('.container_tripdetail');
(async function () {
    const res = await axios({
        method: 'GET',
        url: '/api/schedule/detail',
        params: {
            groupId: localStorage.getItem('groupId'),
        },
    });
    const res2 = await axios({
        method: 'GET',
        url: '/api/schedule/findGroup',
        params: {
            id: localStorage.getItem('groupId'),
        },
    });
    const { dueDate, groupName, recCount } = res2.data.result;
    if (document.querySelector('#recCount')) {
        document.querySelector('#recCount').textContent = recCount;
    }
    groupNameBox.textContent = groupName;
    for (let j = 0; j < dueDate; j++) {
        let k = 0;
        const listBox = `
        <ul class="detail_wrap">
            <li class="category" onclick="openCategory(${j})">${j + 1}일차</li>
        </ul>`;
        list.insertAdjacentHTML('beforeend', listBox);
        for (let i = 0; i < res.data.result.length; i++) {
            const nowBox = document.querySelectorAll('.detail_wrap')[j];
            // console.log(res.data.result[i]);
            const { category, arrTime, distance, detailMemo, place } =
                res.data.result[i];
            const showTime = arrTime.substring(0, 5);
            if (j === category - 1) {
                let distanceHtml;
                if (i < res.data.result.length) {
                    let hour = distance / 250 / 60;
                    let min = (distance / 250) % 60;
                    let newDistance;
                    if (distance >= 1000) {
                        newDistance = `(약 ${distance / 1000}km)`;
                    } else {
                        newDistance = `(약 ${distance}m)`;
                    }
                    if (hour >= 1) {
                        distanceHtml = `다음 장소까지 이동 시간 <span>${hour.toFixed(
                            0
                        )}</span>시간 <span>${min.toFixed(
                            0
                        )}</span>분 ${newDistance}`;
                    } else {
                        distanceHtml = `다음 장소까지 이동 시간 <span>${min.toFixed(
                            0
                        )}</span>분 ${newDistance}`;
                    }
                }
                html = `
                <li class="list_box" onclick="openBox(${j}, ${k},${place.x},${place.y})">
					<div class="list_detail">
						<strong>${place.place_name}</strong>
						<span>${showTime}</span>
						<i class="ico_accord"></i>
						<div class="map_cnt">
							<p class="distance_text"></p>
							<div class="maps"></div>
						</div>
					</div>
				</li>
				`;
                nowBox.insertAdjacentHTML('beforeend', html);
                if (detailMemo) {
                    const memo = document.createElement('p');
                    memo.className = 'list_memo hide';
                    memo.textContent = detailMemo;
                    nowBox
                        .querySelectorAll('.list_detail')
                        [k].querySelector('.ico_accord')
                        .after(memo);
                }
                if (nowBox.querySelectorAll('.distance_text')[k - 1]) {
                    nowBox.querySelectorAll('.distance_text')[k - 1].innerHTML =
                        distanceHtml;
                }

                k++;
            }
        }
    }
})();
function goChecklist() {
    document.location.href = '/checklist';
}
function goEdit() {
    document.location.href = '/calendar';
}

let openMaps = []; // 열린 지도의 배열
function openCategory(list) {
    const allLists = document.querySelectorAll('.detail_wrap');
    allLists.forEach((listElement, index) => {
        if (index === list) {
            listElement.classList.toggle('open');
        }
    });
    var mapOpened = document.querySelector('.on');
    if (mapOpened) {
        mapOpened.classList.remove('on');
        removeMapVer2(mapOpened);
    }
}
function openBox(list, box, x, y) {
    const nowList = document.querySelectorAll('.detail_wrap')[list];
    const nowBox = nowList.querySelectorAll('.list_box')[box];
    var mapOpened = document.querySelector('.on');
    console.log(mapOpened);
    // if (mapOpened) {
    //     console.log('mapOpened');
    //     removeMapVer2(mapOpened);
    //     mapOpened.classList.remove('on');
    //     console.log(mapOpened);
    // }
    if (nowBox.classList.contains('on')) {
        // 선택한 박스의 지도가 틀어져있다면 지도를 닫는다.
        nowBox.classList.remove('on');
        if (nowBox.querySelector('.list_memo')) {
            nowBox.querySelector('.list_memo').classList.add('hide');
        }
        removeMap(list, box);
    } else {
        // 선택한 박스의 지도가 닫혀있다면
        // 나머지 박스 중에 지도가 열려있다면 지도를 닫고
        var b = nowList.querySelector('.on');
        var mapOpened = document.querySelector('.on');
        if (b) {
            b.classList.remove('on');
            removeMapVer2(mapOpened);
        }
        for (
            let i = 0;
            i < document.querySelectorAll('.list_memo').length;
            i++
        ) {
            document.querySelectorAll('.list_memo')[i].classList.add('hide');
        }
        // 선택한 박스의 지도만 연다.
        nowBox.classList.add('on');
        if (nowBox.querySelector('.list_memo')) {
            nowBox.querySelector('.list_memo').classList.remove('hide');
        }
        openMap(list, box, x, y);
    }
}

function openMap(list, box, place_x, place_y) {
    var place_x = place_x;
    var place_y = place_y;
    const nowList = document.querySelectorAll('.detail_wrap')[list];
    const nowBox = nowList.querySelectorAll('.list_box')[box];
    if (nowBox.classList.contains('on')) {
        html = `<div id="map" style="height:200px;"></div>`;
        nowBox.insertAdjacentHTML('beforeend', html);
    } else {
        // on 삭제 시 removeMap() 실행
        removeMap(list, box);
    }
    var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
    //지도를 생성할 때 필요한 기본 옵션
    var options = {
        center: new kakao.maps.LatLng(place_y, place_x), //지도의 중심좌표.
        level: 3, //지도의 레벨(확대, 축소 정도)
    };
    var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
    var markerPosition = new kakao.maps.LatLng(place_y, place_x);

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
        position: markerPosition,
    });

    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);
}
function removeMap(list, box) {
    const nowList = document.querySelectorAll('.detail_wrap')[list];
    const nowBox = nowList.querySelectorAll('.list_box')[box];
    var mapElement = nowBox.querySelector('#map');
    if (mapElement) {
        mapElement.parentNode.removeChild(mapElement);
    }
}
function removeMapVer2(open) {
    var openmap = open.querySelector('#map');
    if (openmap) {
        openmap.parentNode.removeChild(openmap);
    }
}
