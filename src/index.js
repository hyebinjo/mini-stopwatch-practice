// TODO: 이 곳에 정답 코드를 작성해주세요.
import Stopwatch from './stopwatch.js';

const stopWatch = new Stopwatch();
const timer = document.querySelector('#timer');
const startStopBtn = document.querySelector('#start-stop-btn');
const startStopBtnLabel = document.querySelector('#start-stop-btn-label');
const lapResetBtn = document.querySelector('#lap-reset-btn');
const lapResetBtnLabel = document.querySelector('#lap-reset-btn-label');
const laps = document.querySelector('#laps');

let start = false;
let updateInterval;

//시간 포맷팅 구현
const formatTimeNum = (num) => {
    return num.toString().length === 1 ? `0${num}` : num;
};

const formatTime = (num) => {
    const minute = parseInt(num / 6000);
    const second = parseInt((num % 6000) / 100);
    const centisecond = parseInt((num % 6000) % 100);
    return (
        formatTimeNum(minute) +
        ':' +
        formatTimeNum(second) +
        '.' +
        formatTimeNum(centisecond)
    );
};

// 시작, 중단 기능
const onClickStartStop = () => {
    if (!start) {
        stopWatch.start();
        updateInterval = setInterval(() => {
            timer.innerText = formatTime(stopWatch.centisecond);
        }, 10);
        start = true;
    } else {
        stopWatch.pause();
        clearInterval(updateInterval);
        start = false;
    }
};

const changeStartStopBtn = () => {
    if (start) {
        startStopBtn.classList.add('bg-red-600');
        startStopBtnLabel.innerText = '중단';
    } else {
        startStopBtn.classList.remove('bg-red-600');
        startStopBtnLabel.innerText = '시작';
    }
};

const changeLapResetBtn = () => {
    if (start) {
        lapResetBtnLabel.innerText = '랩';
    } else {
        lapResetBtnLabel.innerText = '리셋';
    }
};

startStopBtn.addEventListener('click', () => {
    onClickStartStop();
    changeStartStopBtn();
    changeLapResetBtn();
});

// 랩 추가, 리셋 기능
const addLap = (lapCount, formatLapTime, lapTime) => {
    laps.insertAdjacentHTML(
        'afterbegin',
        `<li class="flex justify-between py-2 px-3 border-b-2" data-centisecond=${lapTime}>
    <span>랩 ${lapCount}</span>
    <span>${formatLapTime}</span>
    </li>`
    );
};

const onClickLapResetBtn = () => {
    if (start) {
        const [lapCount, lapTime] = stopWatch.createLap();
        addLap(lapCount, formatTime(lapTime), lapTime);
    } else {
        stopWatch.reset();
        laps.innerHTML = '';
        timer.innerText = `00:00.00`;
    }
};

//최단, 최장 기록 강조 효과
const emphasizeLaps = (lap, timeOfLap) => {
    if (laps.children.length === 1) return;
    else if (laps.children.length === 2) {
        if (timeOfLap <= parseInt(laps.children[1].dataset.centisecond)) {
            [shortest, longest] = [lap, laps.children[1]];
            shortest.classList.add('text-green-600');
            longest.classList.add('text-red-600');
        } else {
            [shortest, longest] = [laps.children[1], lap];
            shortest.classList.add('text-green-600');
            longest.classList.add('text-red-600');
        }
    } else if (
        timeOfLap >= parseInt(shortest.dataset.centisecond) &&
        timeOfLap <= parseInt(longest.dataset.centisecond)
    ) {
        return;
    } else if (timeOfLap < parseInt(shortest.dataset.centisecond)) {
        shortest.classList.remove('text-green-600');
        shortest = lap;
        shortest.classList.add('text-green-600');
    } else if (timeOfLap > parseInt(longest.dataset.centisecond)) {
        longest.classList.remove('text-red-600');
        longest = lap;
        longest.classList.add('text-red-600');
    }
};

let longest;
let shortest;
lapResetBtn.addEventListener('click', () => {
    onClickLapResetBtn();
    emphasizeLaps(
        laps.children[0],
        parseInt(laps.children[0].dataset.centisecond)
    );
});

//키보드 조작 기능
window.addEventListener('keydown', (e) => {
    if (e.key !== 'l' && e.key !== 's') return;
    else if (e.key === 'l') lapResetBtn.dispatchEvent(new Event('click'));
    else if (e.key === 's') startStopBtn.dispatchEvent(new Event('click'));
});
