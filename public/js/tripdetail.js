const groupNameBox = document.querySelector('.main_txt h3');
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
    const { dueDate, groupName } = res2.data.result;
    groupNameBox.textContent = groupName;
    console.log(dueDate, groupName);
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
            const { category, arrTime, detailMemo, groupId, distance, place } =
                res.data.result[i];
            const showTime = arrTime.substring(0, 5);
            if (j === category - 1) {
                var hour = (distance * 4) / 60;
                var min = (distance * 4) % 60;
                html = `
                <li class="list_box" onclick="openBox(${j}, ${k},${place.x},${
                    place.y
                })">
                    <div class="list_detail">
                        <strong>${place.place_name}</strong>
                        <span>${showTime}</span>
                        <i class="ico_accord"></i>
                        <div class="map_cnt">
                            <div class="maps"></div>
                            <p>다음 장소까지 이동 시간 <span>${hour.toFixed(
                                0
                            )}</span>시간 <span>${min.toFixed(0)}</span>분</p>
                        </div>
                    </div>
                </li>
                `;
                nowBox.insertAdjacentHTML('beforeend', html);
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
            console.log('index', index);
            listElement.classList.toggle('open');
            const allOpenMaps = document.getElementsByClassName('on');
            for (const allOpenMap of allOpenMaps) {
                console.log(allOpenMap);
            }
            // var mapElement = document.querySelectorAll('#map');
            // if (mapElement) {
            //     mapElement.parentNode.removeChild(mapElement);
            // }
        }
    });
    // 현재 열린 지도 삭제
    if (openMaps[list]) {
        console.log(openBox[list].box);
        removeMap(list, openMaps[list].box);
        openMaps[list] = null;
    }
}
function openBox(list, box, x, y) {
    if (openMaps[list]) {
        const allLists = document.querySelectorAll('.detail_wrap');
        allLists.forEach((listElement, index) => {
            if (index !== list) {
                listElement.classList.toggle('open');
            }
        });
        removeMap(list, openMaps[list].box);
        openMaps[list] = null;
    }
    const nowList = document.querySelectorAll('.detail_wrap')[list];
    const nowBox = nowList.querySelectorAll('.list_box')[box];

    // 현재 클릭한 리스트의 지도 열기
    if (!nowBox.classList.contains('on')) {
        nowBox.classList.add('on');
        openMaps[list] = { box, x, y }; // 열린 지도의 정보 저장
        console.log('maps add:', list, openMaps);
        openMap(list, box, x, y);
    } else {
        nowBox.classList.remove('on');
    }
}
function openMap(list, box, place_x, place_y) {
    var place_x = place_x;
    var place_y = place_y;
    const nowList = document.querySelectorAll('.detail_wrap')[list];
    const nowBox = nowList.querySelectorAll('.list_box')[box];
    if (nowBox.classList.contains('on')) {
        html = `<div id="map" style="width:400px;height:200px;"></div>`;
        nowBox.insertAdjacentHTML('beforeend', html);
    }
    var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
    //지도를 생성할 때 필요한 기본 옵션
    var options = {
        center: new kakao.maps.LatLng(place_y, place_x), //지도의 중심좌표.
        level: 2, //지도의 레벨(확대, 축소 정도)
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
    console.log('List', nowList);
    console.log('Box', nowBox);

    // 현재 열린 지도가 있는 경우에만 삭제
    if (nowBox && nowBox.classList.contains('on')) {
        var mapElement = nowBox.querySelector('#map');
        if (mapElement) {
            mapElement.parentNode.removeChild(mapElement);
        }
    }
}
