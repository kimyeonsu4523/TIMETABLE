// 강의 데이터 저장소
let lectureData = {};

// 페이지 로드 시
window.addEventListener('DOMContentLoaded', function() {
    loadTimetableFromStorage();
});

// 폼 제출 이벤트
document.getElementById('lectureForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // 폼에서 입력값 가져오기
    const lectureName = document.getElementById('lectureName').value;
    const classroom = document.getElementById('classroom').value;
    const credit = parseInt(document.getElementById('credit').value);

    // 일정 정보 수집
    const schedules = [];
    const scheduleEntries = document.querySelectorAll('.schedule-entry');
    
    scheduleEntries.forEach(entry => {
        const day = entry.querySelector('.day-select').value;
        const startClass = entry.querySelector('.class-select').value;
        const duration = parseInt(entry.querySelector('.duration-input').value);

        if (day && startClass && duration) {
            const endClass = parseInt(startClass) + duration - 1;
            
            if (endClass > 9) {
                alert('9교시를 넘을 수 없습니다. 시작 교시를 조정해주세요.');
                return;
            }

            // 중복 검사
            for (let i = parseInt(startClass); i <= endClass; i++) {
                const cell = document.querySelector(`tr[data-class="${i}"] .lecture-cell[data-day="${day}"]`);
                if (cell && cell.textContent.trim() !== '') {
                    alert(`${day}요일 ${i}교시에 이미 강의가 있습니다.`);
                    return;
                }
            }

            schedules.push({
                day: day,
                startClass: startClass,
                endClass: endClass,
                duration: duration
            });
        }
    });

    if (schedules.length === 0) {
        alert('최소 하나 이상의 일정을 입력해주세요.');
        return;
    }

    // 시간표에 강의 추가
    const lectureId = 'lecture_' + Date.now();
    
    schedules.forEach(schedule => {
        addLectureToTimetable(
            schedule.day,
            schedule.startClass,
            schedule.endClass,
            lectureName,
            classroom,
            credit,
            lectureId
        );
    });

    // 입력창 초기화
    document.getElementById('lectureName').value = '';
    document.getElementById('classroom').value = '';
    document.getElementById('credit').value = '';
    
    // 일정 항목 초기화 (첫 번째만 남김)
    const scheduleContainer = document.getElementById('scheduleContainer');
    scheduleContainer.innerHTML = `
        <div class="schedule-entry">
            <select class="day-select" required>
                <option value="">-- 요일 --</option>
                <option value="1">월</option>
                <option value="2">화</option>
                <option value="3">수</option>
                <option value="4">목</option>
                <option value="5">금</option>
            </select>
            <select class="class-select" required>
                <option value="">-- 시작 교시 --</option>
                <option value="1">1 (9~10)</option>
                <option value="2">2 (10~11)</option>
                <option value="3">3 (11~12)</option>
                <option value="4">4 (12~13)</option>
                <option value="5">5 (13~14)</option>
                <option value="6">6 (14~15)</option>
                <option value="7">7 (15~16)</option>
                <option value="8">8 (16~17)</option>
                <option value="9">9 (17~18)</option>
            </select>
            <input type="number" class="duration-input" placeholder="시간수" min="1" max="9" required>
            <button type="button" class="btn-remove-schedule" onclick="removeScheduleEntry(this)">✕</button>
        </div>
    `;

    // 총 학점 업데이트
    updateTotalCredits();

    // 성공 알림
    alert(`"${lectureName}" 강의(${credit}학점)가 추가되었습니다!`);

    // 저장
    saveTimetableToStorage();
});

// 일정 항목 추가
function addScheduleEntry() {
    const scheduleContainer = document.getElementById('scheduleContainer');
    const newEntry = document.createElement('div');
    newEntry.className = 'schedule-entry';
    newEntry.innerHTML = `
        <select class="day-select" required>
            <option value="">-- 요일 --</option>
            <option value="1">월</option>
            <option value="2">화</option>
            <option value="3">수</option>
            <option value="4">목</option>
            <option value="5">금</option>
        </select>
        <select class="class-select" required>
            <option value="">-- 시작 교시 --</option>
            <option value="1">1 (9~10)</option>
            <option value="2">2 (10~11)</option>
            <option value="3">3 (11~12)</option>
            <option value="4">4 (12~13)</option>
            <option value="5">5 (13~14)</option>
            <option value="6">6 (14~15)</option>
            <option value="7">7 (15~16)</option>
            <option value="8">8 (16~17)</option>
            <option value="9">9 (17~18)</option>
        </select>
        <input type="number" class="duration-input" placeholder="시간수" min="1" max="9" required>
        <button type="button" class="btn-remove-schedule" onclick="removeScheduleEntry(this)">✕</button>
    `;
    scheduleContainer.appendChild(newEntry);
}

// 일정 항목 제거
function removeScheduleEntry(button) {
    const scheduleContainer = document.getElementById('scheduleContainer');
    if (scheduleContainer.children.length > 1) {
        button.parentElement.remove();
    } else {
        alert('최소 하나의 일정은 필요합니다.');
    }
}

// 시간표에 강의 추가
function addLectureToTimetable(day, startClass, endClass, lectureName, classroom, credit, lectureId) {
    const duration = endClass - parseInt(startClass) + 1;

    for (let i = parseInt(startClass); i <= endClass; i++) {
        const cell = document.querySelector(`tr[data-class="${i}"] .lecture-cell[data-day="${day}"]`);

        if (i === parseInt(startClass)) {
            // 첫 번째 셀: 강의 정보 표시
            cell.innerHTML = `
                <div class="lecture-info">
                    <div class="lecture-name">${lectureName}</div>
                    <div class="classroom">${classroom}</div>
                    <div class="credit">${credit}학점</div>
                </div>
            `;
            cell.dataset.lectureName = lectureName;
            cell.dataset.classroom = classroom;
            cell.dataset.credit = credit;
            cell.dataset.startClass = startClass;
            cell.dataset.day = day;
            cell.dataset.lectureId = lectureId;

            if (duration > 1) {
                cell.setAttribute('rowspan', duration);
                cell.classList.add('merged');
            }
        } else {
            // 나머지 셀: 병합 처리
            cell.style.display = 'none';
            cell.classList.add('merged');
        }
    }
}

// 총 학점 계산 및 표시
function updateTotalCredits() {
    let totalCredits = 0;
    const cells = document.querySelectorAll('.lecture-cell[data-credit]');

    cells.forEach(cell => {
        if (cell.offsetParent !== null) { // 표시되는 셀만
            const creditText = cell.dataset.credit;
            if (creditText) {
                totalCredits += parseInt(creditText);
            }
        }
    });

    document.getElementById('totalCredits').innerHTML = '<strong>총 학점: ' + totalCredits + '</strong>';
}

// 전체 삭제 함수
function clearAllLectures() {
    if (confirm('정말 모든 강의를 삭제하시겠습니까?')) {
        // 모든 강의 셀 초기화
        const cells = document.querySelectorAll('.lecture-cell');
        cells.forEach(cell => {
            if (cell.dataset.lectureName) {
                // 해당 강의가 차지한 모든 셀 초기화
                const lectureId = cell.dataset.lectureId;
                const startClass = cell.dataset.startClass;
                const day = cell.dataset.day;
                const credit = parseInt(cell.dataset.credit);
                const endClass = parseInt(startClass) + credit - 1;

                for (let i = parseInt(startClass); i <= endClass; i++) {
                    const c = document.querySelector(`tr[data-class="${i}"] .lecture-cell[data-day="${day}"]`);
                    if (c && c.dataset.lectureId === lectureId) {
                        c.innerHTML = '';
                        c.removeAttribute('rowspan');
                        c.classList.remove('merged');
                        c.style.display = '';
                        delete c.dataset.lectureName;
                        delete c.dataset.classroom;
                        delete c.dataset.credit;
                        delete c.dataset.startClass;
                        delete c.dataset.lectureId;
                    }
                }
            }
        });

        localStorage.removeItem('timetable');
        updateTotalCredits();
        alert('모든 강의가 삭제되었습니다.');
    }
}

// 셀 클릭으로 강의 삭제
document.addEventListener('click', function(e) {
    if (e.target.closest('.lecture-cell[data-lectureName]')) {
        const cell = e.target.closest('.lecture-cell[data-lectureName]');
        if (confirm(`"${cell.dataset.lectureName}" 강의를 삭제하시겠습니까?`)) {
            deleteLecture(cell);
            updateTotalCredits();
            saveTimetableToStorage();
        }
    }
});

// 강의 삭제 함수
function deleteLecture(cell) {
    const lectureId = cell.dataset.lectureId;
    const credit = parseInt(cell.dataset.credit);
    
    // 같은 lectureId를 가진 모든 셀 찾기
    const allCells = document.querySelectorAll(`.lecture-cell[data-lectureId="${lectureId}"]`);
    
    allCells.forEach(c => {
        const startClass = c.dataset.startClass;
        const day = c.dataset.day;
        const endClass = parseInt(startClass) + credit - 1;

        for (let i = parseInt(startClass); i <= endClass; i++) {
            const cell = document.querySelector(`tr[data-class="${i}"] .lecture-cell[data-day="${day}"]`);
            if (cell) {
                cell.innerHTML = '';
                cell.removeAttribute('rowspan');
                cell.classList.remove('merged');
                cell.style.display = '';
                delete cell.dataset.lectureName;
                delete cell.dataset.classroom;
                delete cell.dataset.credit;
                delete cell.dataset.startClass;
                delete cell.dataset.lectureId;
            }
        }
    });
}

// 로컬스토리지에 저장
function saveTimetableToStorage() {
    const timetableData = [];
    const cells = document.querySelectorAll('.lecture-cell[data-lectureName]');

    cells.forEach(cell => {
        // 각 강의당 한 번만 저장 (첫 번째 셀에서)
        if (cell.offsetParent !== null) { // 표시되는 셀만
            timetableData.push({
                day: cell.dataset.day,
                startClass: cell.dataset.startClass,
                lectureName: cell.dataset.lectureName,
                classroom: cell.dataset.classroom,
                credit: cell.dataset.credit,
                lectureId: cell.dataset.lectureId
            });
        }
    });

    localStorage.setItem('timetable', JSON.stringify(timetableData));
}

// 로컬스토리지에서 불러오기
function loadTimetableFromStorage() {
    const savedData = localStorage.getItem('timetable');

    if (savedData) {
        const timetableData = JSON.parse(savedData);

        timetableData.forEach(lecture => {
            const startClass = lecture.startClass;
            const credit = parseInt(lecture.credit);
            const endClass = parseInt(startClass) + credit - 1;

            addLectureToTimetable(
                lecture.day,
                startClass,
                endClass,
                lecture.lectureName,
                lecture.classroom,
                credit,
                lecture.lectureId
            );
        });

        updateTotalCredits();
    }
}
