const postsData = [
  {
    id: 1,
    date: "2026-03-20",
    text: {
      ru: "Теперь у меня есть сайт! 🎉",
      en: "Now I have a website! 🎉",
      ko: "이제 사이트가 생겼어요! 🎉"
    },
    image: "images/johan1.jpg",
    tags: ["life", "programming"]
  },
  {
    id: 2,
    date: "2026-03-21",
    text: {
      ru: "Сегодня я занимался корейским языком и готовился к экзамену TOPIC",
      en: "Today I studied Korean and prepared for the TOPIC exam",
      ko: "오늘은 한국어를 공부하고 TOPIC 시험을 준비했습니다"
    },
    image: null,
    tags: ["korean", "study"]
  }
];

const uiText = {
  ru: { 
    all: "Все", 
    noPosts: "Нет постов",
    theme: {
      light: "🌙 Темная",
      dark: "☀️ Светлая"
    },
    chart: {
      title: "Динамика публикаций",
      months: "Месяцы",
      posts: "Количество постов"
    }
  },
  en: { 
    all: "All", 
    noPosts: "No posts",
    theme: {
      light: "🌙 Dark",
      dark: "☀️ Light"
    },
    chart: {
      title: "Posts Timeline",
      months: "Months",
      posts: "Number of posts"
    }
  },
  ko: { 
    all: "전체", 
    noPosts: "게시물 없음",
    theme: {
      light: "🌙 다크 모드",
      dark: "☀️ 라이트 모드"
    },
    chart: {
      title: "게시물 추이",
      months: "월",
      posts: "게시물 수"
    }
  }
};