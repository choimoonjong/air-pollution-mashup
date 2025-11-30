window.onload = initMap;

let map;
let sidoName = null;
let regionMarker = null;

//-------------------------------------
// 1. 지도 초기화
//-------------------------------------
function initMap() {
    var mapContainer = document.getElementById('map'),
        mapOption = {
            center: new daum.maps.LatLng(37.5665, 126.9780),
            level: 12
        };

    map = new daum.maps.Map(mapContainer, mapOption);
    map.setZoomable(false);

    initControl();
}

//-------------------------------------
// 2. 지도 컨트롤
//-------------------------------------
function initControl() {
    var mapTypeControl = new daum.maps.MapTypeControl();
    map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);
}

//-------------------------------------
// 3. 내 위치로 이동
//-------------------------------------
function myLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {
            var lat = pos.coords.latitude;
            var lon = pos.coords.longitude;

            var locPos = new daum.maps.LatLng(lat, lon);
            displayMarker(locPos, "<div>현위치</div>");
            getmyLocationAddr();
        });
    }
}

function displayMarker(locPosition, message) {
    var imageSrc = 'here.png',
        imageSize = new daum.maps.Size(64, 69),
        imageOption = { offset: new daum.maps.Point(27, 69) };

    var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOption);

    if (regionMarker) regionMarker.setMap(null);

    regionMarker = new daum.maps.Marker({
        map: map,
        position: locPosition,
        image: markerImage
    });

    // ❌ map.setCenter(locPosition);  <-- 이거 때문에 이동이 안됨
}


function getmyLocationAddr() {
    var geocoder = new daum.maps.services.Geocoder();
    var center = map.getCenter();

    geocoder.coord2Address(
        center.getLng(),
        center.getLat(),
        function (result, status) {
            if (status === daum.maps.services.Status.OK) {
                selectMYLoc(result[0].address.region_1depth_name);
            }
        }
    );
}

//-------------------------------------
// 4. 지역 선택 → 지도 이동 + 파싱
//-------------------------------------
function MoveTo(lat, lon) {
    const target = new daum.maps.LatLng(lat, lon);

    // 지도 크기/레이아웃 갱신
    map.relayout();

    // 약간의 지연 후 이동하면 더 안정적
    setTimeout(() => {
        map.panTo(target);
    }, 10);
}



function selectLoc(value) {
    sidoName = convertToSido(value);

    const pos = getPosition(sidoName);
    const target = new daum.maps.LatLng(pos.lat, pos.lon);

    // 레이아웃 업데이트 후 이동
    map.relayout();

    setTimeout(() => {
        map.panTo(target);
        displayMarker(target, value + " 중심");
    }, 20);

    parsing();
}


function selectMYLoc(value) {
    sidoName = convertToSido(value);
    parsing();
}

function convertToSido(text) {
    switch (text) {
        // 서울
        case '서울특별시':
        case '서울':
            return '서울';

        // 부산
        case '부산광역시':
        case '부산':
            return '부산';

        // 대구
        case '대구광역시':
        case '대구':
            return '대구';

        // 인천
        case '인천광역시':
        case '인천':
            return '인천';

        // 광주
        case '광주광역시':
        case '광주':
            return '광주';

        // 대전
        case '대전광역시':
        case '대전':
            return '대전';

        // 울산
        case '울산광역시':
        case '울산':
            return '울산';

        // 경기
        case '경기도':
        case '경기':
            return '경기';

        // 강원
        case '강원도':
        case '강원':
            return '강원';

        // 충북
        case '충청북도':
        case '충북':
            return '충북';

        // 충남
        case '충청남도':
        case '충남':
            return '충남';

        // 전북
        case '전라북도':
        case '전북':
            return '전북';

        // 전남
        case '전라남도':
        case '전남':
            return '전남';

        // 경북
        case '경상북도':
        case '경북':
            return '경북';

        // 경남
        case '경상남도':
        case '경남':
            return '경남';

        // 제주
        case '제주특별자치도':
        case '제주':
            return '제주';

        default:
            // 혹시 모를 경우 그냥 원본을 돌려보내고,
            // getPosition에서 못 찾으면 서울로 fallback
            return text;
    }
}


function getPosition(sido) {
    const pos = {
        서울: { lat: 37.5665, lon: 126.9780 },
        부산: { lat: 35.177, lon: 129.077 },
        대구: { lat: 35.8685, lon: 128.6036 },
        인천: { lat: 37.4532, lon: 126.7074 },
        광주: { lat: 35.157, lon: 126.8534 },
        대전: { lat: 36.3471, lon: 127.3866 },
        울산: { lat: 35.5354, lon: 129.3137 },
        경기: { lat: 37.2606, lon: 127.0307 },
        강원: { lat: 37.8785, lon: 127.7323 },
        충북: { lat: 36.6396, lon: 127.4912 },
        충남: { lat: 36.8121, lon: 127.1162 },
        전북: { lat: 35.8215, lon: 127.15 },
        전남: { lat: 34.8088, lon: 126.3944 },
        경북: { lat: 36.016, lon: 129.3456 },
        경남: { lat: 35.2248, lon: 128.6841 },
        제주: { lat: 33.4963, lon: 126.5332 }
    };
    return pos[sido] || pos['서울'];
}

//-------------------------------------
// 5. 프록시 호출
//-------------------------------------
async function fetchDustData(sido) {
    try {
        const response = await fetch(`/.netlify/functions/dust?sido=${encodeURIComponent(sido)}`);
        return await response.json();
    } catch (e) {
        console.error("프록시 통신 오류:", e);
        return null;
    }
}

//-------------------------------------
// 6. 실시간 대기오염 파싱
//-------------------------------------
async function parsing() {
    if (!sidoName) return;

    const data = await fetchDustData(sidoName);
    if (!data || !data.response) {
        alert("데이터 조회 실패");
        return;
    }

    const items = data.response.body.items;

    if (!items || items.length === 0) {
        alert("해당 지역 데이터 없음");
        return;
    }

    const d = items[0];

    document.getElementById("d_1").textContent = d.dataTime;
    document.getElementById("d_2").textContent = d.stationName;
    document.getElementById("d_3").textContent = setTotalContent(d.khaiGrade);
    document.getElementById("d_4").textContent = setContentforDust(d.pm10Grade);
    document.getElementById("d_5").textContent = setContentforDust(d.o3Grade);
    document.getElementById("d_6").textContent = setContentforDust(d.coGrade);

    // ★ 예보 정보 실행
    showForecast();
}

//-------------------------------------
// 7. 등급 변환
//-------------------------------------
function setTotalContent(text) {
    switch (text) {
        case '1': return '좋음';
        case '2': return '보통';
        case '3': return '나쁨';
        case '4': return '매우나쁨';
        default: return '정보없음';
    }
}

function setContentforDust(text) {
    switch (text) {
        case '1': return '좋음';
        case '2': return '보통';
        case '3': return '나쁨';
        case '4': return '매우나쁨';
        default: return '정보없음';
    }
}

//-------------------------------------
// 8. 예보 조회 (XML 파싱)
//-------------------------------------
function getCurrentDate() {
    const d = new Date();
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}


async function fetchForecast() {
    const today = getCurrentDate();

    try {
        const res = await fetch(`/api/forecast?date=${today}`);
        return await res.text();   // ★ XML로 받음
    } catch (e) {
        console.error("Forecast fetch error:", e);
        return null;
    }
}

async function fetchForecastByDate(date) {
    const res = await fetch(`/api/forecast?date=${date}`);
    return await res.text();
}

async function showForecast() {
    const today = getCurrentDate();
    const res = await fetch(`/api/forecast?date=${today}`);
    const json = await res.json();

    const items = json?.response?.body?.items;

    if (!items || items.length === 0) {
        document.getElementById("f_time").textContent = "정보없음";
        document.getElementById("f_grade").textContent = "정보없음";
        document.getElementById("f_cause").textContent = "정보없음";
        return;
    }

    const f = items[0];

    document.getElementById("f_time").textContent = f.informData ?? "정보없음";
    document.getElementById("f_grade").textContent = f.informOverall ?? "정보없음";
    document.getElementById("f_cause").textContent = f.informCause ?? "정보없음";
}



