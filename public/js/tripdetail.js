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
            // console.log(showTime);
            if (j === category - 1) {
                var hour = (distance * 4) / 60;
                var min = (distance * 4) % 60;
                html = `
                <li class="list_box" onclick="openBox(${j}, ${k})">
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
function openCategory(list) {
    const nowList = document.querySelectorAll('.detail_wrap')[list];
    if (nowList.classList.contains('open')) {
        nowList.classList.remove('open');
    } else {
        nowList.classList.add('open');
    }
}
function openBox(list, box) {
    const nowList = document.querySelectorAll('.detail_wrap')[list];
    const nowBox = nowList.querySelectorAll('.list_box')[box];
    const count = document.querySelectorAll('.list_box').length;
    for (let i = 0; i < count; i++) {
        if (!nowBox === document.querySelectorAll('.list_box')[i]) {
            document.querySelectorAll('.list_box')[i].classList.remove('on');
        }
    }
    if (nowBox.classList.contains('on')) {
        nowBox.classList.remove('on');
        console.log(nowBox);
    } else {
        nowBox.classList.add('on');
    }
    openMap(list, box);
}

function openMap(list, box) {
    const nowList = document.querySelectorAll('.detail_wrap')[list];
    const nowBox = nowList.querySelectorAll('.list_box')[box];
    console.log(nowList);
    if (nowBox.classList.contains('on')) {
        console.log('성공');
        html = `<div style="height : 100px">지도</div>`;
        nowBox.insertAdjacentHTML('beforeend', html);
    }
}
