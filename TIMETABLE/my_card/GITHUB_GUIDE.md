# 🚀 GitHub 업로드 가이드

## 📋 준비 사항

### 1. Git 설치 (필수)
- [Git 공식 사이트](https://git-scm.com/download/win)에서 Windows용 Git 다운로드
- 설치 후 컴퓨터 재시작

### 2. GitHub 계정 생성 (필수)
- [GitHub](https://github.com)에서 무료 계정 생성
- 이메일 인증 완료

---

## 📝 단계별 업로드 방법

### Step 1: 로컬 저장소 초기화

이 폴더에서 PowerShell 또는 CMD를 열고 다음 명령어 실행:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git init
```

### Step 2: 모든 파일 추가

```bash
git add .
```

### Step 3: 첫 번째 커밋

```bash
git commit -m "Initial commit: Kim Yeon-su's Timetable Application"
```

### Step 4: GitHub에서 새 저장소 생성

1. GitHub.com에 로그인
2. 우상단 **+** 아이콘 클릭 → **New repository**
3. Repository 이름: `timetable-app` (또는 원하는 이름)
4. Description: `Kim Yeon-su's University Timetable Management Application`
5. **Public** 선택 (공개 저장소)
6. **Create repository** 클릭

### Step 5: 원격 저장소 연결

생성된 저장소 페이지에서 제공하는 명령어 실행:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/timetable-app.git
git push -u origin main
```

`YOUR_USERNAME`을 자신의 GitHub 사용자명으로 교체하세요.

### Step 6: 인증 (첫 번째만)

GitHub에 로그인하거나 Personal Access Token 입력:

- [Personal Access Token 생성](https://github.com/settings/tokens)
- 권한: `repo` 체크
- Token 복사 후 비밀번호 입력 시 사용

---

## 📂 완료 후 확인

GitHub 저장소 페이지에서 다음 파일들이 업로드되었는지 확인:

- ✅ `index.html`
- ✅ `style.css`
- ✅ `script.js`
- ✅ `README.md`
- ✅ `GITHUB_GUIDE.md`

---

## 🌐 온라인 공유

### GitHub Pages로 배포 (선택사항)

1. GitHub 저장소 → **Settings** → **Pages** 탭
2. **Source**: `main` branch 선택
3. **Save** 클릭
4. 몇 분 후 `https://YOUR_USERNAME.github.io/timetable-app`에서 접근 가능

---

## ⚠️ 문제 해결

### "git not found" 오류
→ Git 설치 후 PowerShell 재시작

### 인증 실패
→ Personal Access Token 생성 후 사용

### 이미 커밋한 후 수정하고 싶을 때
```bash
git add .
git commit --amend -m "수정된 메시지"
git push -f origin main
```

---

## 📚 추가 학습 자료

- [Git 기초 가이드](https://git-scm.com/book/ko/v2)
- [GitHub Hello World](https://guides.github.com/activities/hello-world/)
- [Git 명령어 치트시트](https://github.github.com/training-kit/downloads/github-git-cheat-sheet.pdf)

---

**도움이 필요하신가요?** GitHub 공식 문서나 Stack Overflow에서 답변을 찾을 수 있습니다!
