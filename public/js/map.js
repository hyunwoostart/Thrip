// 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
    };

// 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

//출발지와 도착지를 담는 배열입니다.
let array = [];
//array배열에 정보를 담은 객체 넣어주기
let obj = { x: 0, y: 0, place_name: '' };
// 출발지와 도착지 사이의 거리를 담는 변수입니다.
let distance = 0;
// 출발지 도착지 배열 담는 함수
function pushArray(obj, array) {
    array.push(obj);
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
    var d = (R * c).toFixed(1); // Distance in km
    return d;
}

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places();

//검색하는 함수입니다.
function keyword() {
    var place_name = document.getElementById('place_name').value;
    ps.keywordSearch(place_name, placesSearchCB);
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
        document.getElementById(
            'select'
        ).innerHTML = `<div>위치 : ${place.place_name}<br>위도 : ${place.y} <br> 경도 :${place.x} </div>`;
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name, '</div>');
        infowindow.open(map, marker);
        //좌표 담는 객체 안에 x,y로 저장합니다.
        obj = {
            x: place.x,
            y: place.y,
            place_name: place.place_name,
        };
        pushArray(obj, array);
        if (array.length >= 2) {
            document.getElementById('select').innerHTML = `<div>${
                array[array.length - 2].place_name
            } ----거리 측정 중----> ${array[array.length - 1].place_name} </div>`;
            console.log('두개의 좌표 사이의 거리 측정 시작');
            distance = getDistance(
                array[array.length - 2].x,
                array[array.length - 2].y,
                array[array.length - 1].x,
                array[array.length - 1].y
            );
            console.log(distance);
            document.getElementById('result').innerHTML = `<div>총 거리 : ${distance}km</div>`;
        }
    });
}

async function register() {
    const data = {
        category: null,
        arrTime: document.querySelector('#arrTime').value,
        place: obj,
        distance: distance * 1000,
        detailMemo: document.querySelector('#detailMemo').value,
    };
    const res = await axios({
        method: 'POST',
        url: '/api/schedule/detailWrite',
        data,
    });
    console.log(res);
}
