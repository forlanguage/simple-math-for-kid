import { useEffect, useMemo, useState } from 'react'
import { Award, BarChart3, BookOpen, ChevronLeft, CheckCircle2, Flame, Home, Lightbulb, RotateCcw, Sparkles, Star, Trophy } from 'lucide-react'
import { allLessons, curriculum } from './curriculum'

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = (items) => items[rnd(0, items.length - 1)]
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5)

function numericQuestion(text, answer, hint) {
  const value = Number(answer)
  const delta = Math.max(1, Math.round(Math.abs(value) * 0.15))
  const wrong = new Set()
  while (wrong.size < 3) {
    const candidate = value + pick([-2, -1, 1, 2]) * rnd(1, delta + 2)
    if (candidate >= 0 && candidate !== value) wrong.add(Number(candidate.toFixed(1)))
  }
  return { text, answer, choices: shuffle([value, ...wrong]), hint }
}

function makeQuestion(type) {
  switch (type) {
    case 'count': {
      const n = rnd(2, 10)
      return numericQuestion(`${'🍎 '.repeat(n)} Có bao nhiêu quả táo?`, n, 'Chạm từng quả và đếm từ 1 nhé!')
    }
    case 'compare': {
      const a = rnd(0, 20), b = rnd(0, 20)
      return { text: `${a} __ ${b}`, answer: a === b ? '=' : a > b ? '>' : '<', choices: ['<', '=', '>'], hint: 'So sánh hai số từ trái sang phải.' }
    }
    case 'add10': {
      const a = rnd(0, 8), b = rnd(0, 10 - a)
      return numericQuestion(`${a} + ${b} = ?`, a + b, 'Đếm tiếp từ số lớn hơn.')
    }
    case 'sub20': {
      const a = rnd(5, 20), b = rnd(0, a)
      return numericQuestion(`${a} − ${b} = ?`, a - b, 'Đếm lùi hoặc dùng phép cộng để kiểm tra.')
    }
    case 'shapes1': {
      const shapes = [
        { q: 'Hình nào có 3 cạnh?', a: 'Tam giác', c: ['Tam giác', 'Hình tròn', 'Hình vuông', 'Hình chữ nhật'] },
        { q: 'Hình nào không có góc?', a: 'Hình tròn', c: ['Hình tròn', 'Tam giác', 'Hình vuông', 'Hình chữ nhật'] },
      ]
      const x = pick(shapes)
      return { text: x.q, answer: x.a, choices: shuffle(x.c), hint: 'Hãy nhớ đặc điểm số cạnh và số góc.' }
    }
    case 'time1': {
      const h = rnd(1, 12)
      return { text: `🕐 Kim phút chỉ số 12, kim giờ chỉ số ${h}. Mấy giờ?`, answer: `${h} giờ`, choices: shuffle([`${h} giờ`, `${(h % 12) + 1} giờ`, `${Math.max(1, h - 1)} giờ`, `${h}:30`]), hint: 'Kim phút ở số 12 nghĩa là giờ đúng.' }
    }
    case 'placeValue': {
      const h = rnd(1, 9), t = rnd(0, 9), u = rnd(0, 9)
      return numericQuestion(`${h}${t}${u} có chữ số hàng chục là?`, t, 'Hàng chục nằm ở giữa hàng trăm và hàng đơn vị.')
    }
    case 'compare1000': {
      const a = rnd(100, 999), b = rnd(100, 999)
      return { text: `${a} __ ${b}`, answer: a === b ? '=' : a > b ? '>' : '<', choices: ['<', '=', '>'], hint: 'So sánh hàng trăm trước.') }
    case 'addSub1000': {
      const add = Math.random() > .5
      const a = rnd(100, 700), b = add ? rnd(10, 250) : rnd(10, a)
      return numericQuestion(`${a} ${add ? '+' : '−'} ${b} = ?`, add ? a + b : a - b, 'Đặt các chữ số cùng hàng thẳng cột.')
    }
    case 'mul25': {
      const a = pick([2, 5]), b = rnd(1, 10)
      return numericQuestion(`${a} × ${b} = ?`, a * b, `Nhớ bảng nhân ${a}.`)
    }
    case 'length2': {
      const m = rnd(1, 5)
      return numericQuestion(`${m} m = ? cm`, m * 100, '1 m = 100 cm.')
    }
    case 'money2': {
      const price = pick([5000, 10000, 15000, 20000]), paid = price + pick([5000, 10000])
      return numericQuestion(`Món đồ giá ${price.toLocaleString('vi-VN')}đ. Bé đưa ${paid.toLocaleString('vi-VN')}đ. Tiền thừa?`, paid - price, 'Tiền thừa = tiền đưa − giá món đồ.')
    }
    case 'large3':
    case 'large4': {
      const max = type === 'large3' ? 99999 : 999999
      const a = rnd(1000, Math.floor(max / 2)), b = rnd(100, Math.floor(max / 4))
      return numericQuestion(`${a.toLocaleString('vi-VN')} + ${b.toLocaleString('vi-VN')} = ?`, a + b, 'Đặt tính thẳng hàng rồi cộng.')
    }
    case 'muldiv3': {
      const a = rnd(2, 9), b = rnd(2, 10), div = Math.random() > .5
      return div ? numericQuestion(`${a * b} ÷ ${a} = ?`, b, 'Dùng phép nhân ngược để kiểm tra.') : numericQuestion(`${a} × ${b} = ?`, a * b, 'Dùng bảng nhân.')
    }
    case 'area3': {
      const a = rnd(2, 12), b = rnd(2, 10)
      return numericQuestion(`HCN dài ${a} cm, rộng ${b} cm. Diện tích?`, a * b, 'Diện tích = dài × rộng.')
    }
    case 'fraction4': {
      const d = pick([4, 5, 8, 10]), a = rnd(1, d - 1), b = rnd(1, d - a)
      return numericQuestion(`${a}/${d} + ${b}/${d} = ?/${d}`, a + b, 'Cùng mẫu số: cộng tử số.')
    }
    case 'average4': {
      const a = rnd(10, 30), b = rnd(10, 30), c0 = rnd(10, 30)
      const c = c0 + ((3 - ((a + b + c0) % 3)) % 3)
      return numericQuestion(`Trung bình của ${a}, ${b}, ${c} là?`, (a + b + c) / 3, 'Cộng các số rồi chia cho 3.')
    }
    case 'decimal5': {
      const a = rnd(10, 90) / 10, b = rnd(10, 90) / 10
      return numericQuestion(`${a.toFixed(1)} + ${b.toFixed(1)} = ?`, Number((a + b).toFixed(1)), 'Đặt dấu phẩy thẳng cột.')
    }
    case 'percent5': {
      const total = pick([100, 200, 400, 500]), p = pick([10, 20, 25, 50])
      return numericQuestion(`${p}% của ${total} là?`, total * p / 100, 'Lấy số đó × phần trăm ÷ 100.')
    }
    case 'motion5': {
      const speed = pick([10, 20, 30, 40]), time = rnd(2, 5)
      return numericQuestion(`Đi ${speed} km/h trong ${time} giờ. Quãng đường?`, speed * time, 'Quãng đường = vận tốc × thời gian.')
    }
    default:
      return numericQuestion('2 + 2 = ?', 4, 'Đếm thêm 2 từ số 2.')
  }
}

const emptyProgress = { stars: 0, bestStreak: 0, solved: 0, correct: 0, completedLessons: {}, lessonScores: {} }
const initialProgress = () => {
  try { return { ...emptyProgress, ...(JSON.parse(localStorage.getItem('math-kid-progress')) || {}) } }
  catch { return emptyProgress }
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [level, setLevel] = useState(1)
  const [chapterId, setChapterId] = useState(null)
  const [lessonId, setLessonId] = useState(null)
  const [question, setQuestion] = useState(null)
  const [selected, setSelected] = useState(null)
  const [streak, setStreak] = useState(0)
  const [progress, setProgress] = useState(initialProgress)
  const [showHint, setShowHint] = useState(false)
  const [quiz, setQuiz] = useState({ index: 0, score: 0, total: 5 })

  useEffect(() => localStorage.setItem('math-kid-progress', JSON.stringify(progress)), [progress])

  const currentLevel = useMemo(() => curriculum.find(x => x.level === level), [level])
  const currentChapter = currentLevel?.chapters.find(x => x.id === chapterId)
  const currentLesson = currentChapter?.lessons.find(x => x.id === lessonId)
  const correct = selected !== null && String(selected) === String(question?.answer)
  const accuracy = progress.solved ? Math.round(progress.correct / progress.solved * 100) : 0

  const openLevel = (nextLevel) => { setLevel(nextLevel); setChapterId(null); setLessonId(null); setScreen('level') }
  const openChapter = (id) => { setChapterId(id); setLessonId(null); setScreen('chapter') }
  const openLesson = (id) => { setLessonId(id); setScreen('learn') }

  const beginPractice = (mode = 'practice') => {
    setQuestion(makeQuestion(currentLesson.practice)); setSelected(null); setShowHint(false)
    if (mode === 'quiz') setQuiz({ index: 0, score: 0, total: 5 })
    setScreen(mode)
  }

  const answer = (choice) => {
    if (selected !== null) return
    setSelected(choice)
    const ok = String(choice) === String(question.answer)
    const nextStreak = ok ? streak + 1 : 0
    setStreak(nextStreak)
    setProgress(p => ({ ...p, stars: p.stars + (ok ? 1 : 0), solved: p.solved + 1, correct: p.correct + (ok ? 1 : 0), bestStreak: Math.max(p.bestStreak, nextStreak) }))
    if (screen === 'quiz' && ok) setQuiz(q => ({ ...q, score: q.score + 1 }))
  }

  const nextQuestion = () => {
    if (screen === 'quiz') {
      if (quiz.index + 1 >= quiz.total) {
        const finalScore = quiz.score + (correct ? 0 : 0)
        setProgress(p => ({ ...p, completedLessons: { ...p.completedLessons, [lessonId]: true }, lessonScores: { ...p.lessonScores, [lessonId]: Math.max(p.lessonScores?.[lessonId] || 0, finalScore) } }))
        setScreen('result'); return
      }
      setQuiz(q => ({ ...q, index: q.index + 1 }))
    }
    setQuestion(makeQuestion(currentLesson.practice)); setSelected(null); setShowHint(false)
  }

  const Back = ({ to }) => <button className="icon-button" onClick={() => setScreen(to)} aria-label="Quay lại"><ChevronLeft /></button>

  if (screen === 'level') return (
    <main className="app-shell inner-shell">
      <header className="topbar"><Back to="home"/><div className="practice-title"><span>{currentLevel.emoji}</span><div><small>{currentLevel.grade}</small><strong>{currentLevel.title}</strong></div></div><div className="stats-pill"><Star size={17} fill="currentColor"/> {progress.stars}</div></header>
      <section className="inner-content"><div className="page-heading"><small>LEVEL {level}</small><h1>Chọn chương học</h1><p>Học từng phần nhỏ, hoàn thành bài và mở khóa sao.</p></div><div className="chapter-grid">{currentLevel.chapters.map(ch => <button className="chapter-card" key={ch.id} onClick={() => openChapter(ch.id)}><span>{ch.icon}</span><div><h3>{ch.name}</h3><p>{ch.note}</p><small>{ch.lessons.length} bài học</small></div><b>→</b></button>)}</div></section>
    </main>
  )

  if (screen === 'chapter') return (
    <main className="app-shell inner-shell"><header className="topbar"><Back to="level"/><div className="practice-title"><span>{currentChapter.icon}</span><div><small>{currentLevel.grade}</small><strong>{currentChapter.name}</strong></div></div><div className="stats-pill"><Star size={17} fill="currentColor"/> {progress.stars}</div></header>
      <section className="inner-content"><div className="page-heading"><small>CHƯƠNG HỌC</small><h1>{currentChapter.name}</h1><p>{currentChapter.note}</p></div><div className="lesson-list">{currentChapter.lessons.map((lesson, i) => { const done = progress.completedLessons?.[lesson.id]; return <button className="lesson-row" key={lesson.id} onClick={() => openLesson(lesson.id)}><span className="lesson-index">{done ? <CheckCircle2/> : i + 1}</span><div><h3>{lesson.title}</h3><p>{done ? `Đã hoàn thành · Điểm tốt nhất ${progress.lessonScores?.[lesson.id] || 0}/5` : 'Học lý thuyết → luyện tập → quiz'}</p></div><b>{done ? '⭐' : '→'}</b></button> })}</div></section>
    </main>
  )

  if (screen === 'learn') return (
    <main className="app-shell inner-shell"><header className="topbar"><Back to="chapter"/><div className="practice-title"><span>📘</span><div><small>BÀI HỌC</small><strong>{currentLesson.title}</strong></div></div><div className="stats-pill"><Star size={17} fill="currentColor"/> {progress.stars}</div></header>
      <section className="learn-card"><div className="learn-hero">{currentChapter.icon}</div><small>HỌC NHANH</small><h1>{currentLesson.title}</h1><div className="concept-list">{currentLesson.learn.map((item, i) => <div key={item}><span>{i + 1}</span><p>{item}</p></div>)}</div><div className="learn-actions"><button className="secondary" onClick={() => beginPractice('practice')}>🎯 Luyện tập</button><button className="primary" onClick={() => beginPractice('quiz')}>Làm Quiz 5 câu <Sparkles size={18}/></button></div></section>
    </main>
  )

  if (screen === 'practice' || screen === 'quiz') return (
    <main className="app-shell practice-shell"><header className="topbar"><Back to="learn"/><div className="practice-title"><span>{currentChapter.icon}</span><div><small>{screen === 'quiz' ? `QUIZ ${quiz.index + 1}/${quiz.total}` : 'LUYỆN TẬP'}</small><strong>{currentLesson.title}</strong></div></div><div className="streak"><Flame size={20}/> {streak}</div></header>
      <section className="question-card"><div className="question-badge"><Sparkles size={16}/> {screen === 'quiz' ? 'Thử thách nhỏ' : 'Câu hỏi mới'}</div><h1>{question.text}</h1><p>Chọn đáp án đúng</p><div className="answer-grid">{question.choices.map(choice => { let state=''; if(selected!==null && String(choice)===String(question.answer)) state='correct'; else if(selected!==null && String(choice)===String(selected)) state='wrong'; return <button key={choice} className={`answer ${state}`} onClick={() => answer(choice)}>{choice}</button> })}</div>{selected===null ? <button className="hint-button" onClick={() => setShowHint(v=>!v)}><Lightbulb size={16}/> {showHint ? question.hint : 'Gợi ý cho bé'}</button> : <div className={`feedback ${correct?'yay':'oops'}`}><div><strong>{correct?'Tuyệt vời! 🌟':'Gần đúng rồi! 💪'}</strong><span>{correct?'Con nhận được 1 ngôi sao.':`Đáp án đúng là ${question.answer}.`}</span></div><button onClick={nextQuestion}>{screen==='quiz' && quiz.index+1>=quiz.total?'Xem kết quả':'Câu tiếp theo →'}</button></div>}</section>
    </main>
  )

  if (screen === 'result') return (
    <main className="app-shell result-shell"><section className="result-card"><div className="result-emoji">🏆</div><small>HOÀN THÀNH BÀI HỌC</small><h1>{currentLesson.title}</h1><div className="score-ring">{quiz.score}<span>/5</span></div><p>{quiz.score >= 4 ? 'Xuất sắc! Con đã nắm bài rất tốt.' : quiz.score >= 3 ? 'Tốt lắm! Luyện thêm một lượt để chắc hơn nhé.' : 'Không sao, quay lại phần Học nhanh rồi thử lại nhé.'}</p><div className="learn-actions"><button className="secondary" onClick={() => setScreen('learn')}>Xem lại bài</button><button className="primary" onClick={() => setScreen('chapter')}>Về chương học</button></div></section></main>
  )

  if (screen === 'parent') return (
    <main className="app-shell inner-shell"><header className="topbar"><Back to="home"/><div className="practice-title"><span>👨‍👩‍👧</span><div><small>PHỤ HUYNH</small><strong>Tiến độ học tập</strong></div></div><div/></header><section className="inner-content"><div className="page-heading"><small>DASHBOARD</small><h1>Con đang học thế nào?</h1></div><div className="dashboard-grid"><div><Star/><strong>{progress.stars}</strong><span>Ngôi sao</span></div><div><Trophy/><strong>{progress.solved}</strong><span>Câu đã làm</span></div><div><BarChart3/><strong>{accuracy}%</strong><span>Tỉ lệ đúng</span></div><div><BookOpen/><strong>{Object.keys(progress.completedLessons || {}).length}</strong><span>Bài hoàn thành</span></div></div><div className="progress-table"><h2>Tiến độ theo bài</h2>{allLessons.map(l => <div key={l.id}><span>{progress.completedLessons?.[l.id] ? '✅' : '⬜'}</span><div><strong>{l.grade} · {l.title}</strong><small>{l.chapterName}</small></div><b>{progress.lessonScores?.[l.id] ? `${progress.lessonScores[l.id]}/5` : '—'}</b></div>)}</div></section></main>
  )

  return (
    <main className="app-shell"><header className="hero"><nav><div className="brand"><span>∑</span><strong>Math Adventure</strong></div><div className="nav-actions"><button className="parent-link" onClick={()=>setScreen('parent')}><BarChart3 size={17}/> Phụ huynh</button><div className="stats-pill"><Star size={18} fill="currentColor"/> {progress.stars} sao</div></div></nav><div className="hero-content"><div className="hero-copy"><div className="eyebrow">✨ HỌC TOÁN MỖI NGÀY, VUI MỖI NGÀY</div><h1>Chinh phục Toán học<br/><span>qua từng cuộc phiêu lưu!</span></h1><p>Bài học ngắn, luyện tập tương tác và quiz vừa sức cho học sinh tiểu học từ Lớp 1 đến Lớp 5.</p><button className="primary" onClick={()=>document.getElementById('levels')?.scrollIntoView({behavior:'smooth'})}>Bắt đầu học <Sparkles size={19}/></button></div><div className="hero-art" aria-hidden="true"><div className="planet">🌍</div><div className="rocket">🚀</div><span className="float f1">7</span><span className="float f2">+</span><span className="float f3">π</span></div></div></header>
      <section className="progress-strip"><div><Award/><span><strong>{progress.stars}</strong> Ngôi sao</span></div><div><Flame/><span><strong>{progress.bestStreak}</strong> Chuỗi đúng tốt nhất</span></div><div><Trophy/><span><strong>{progress.solved}</strong> Câu đã làm</span></div></section>
      <section id="levels" className="levels-section"><div className="section-heading"><span>🗺️</span><div><small>LỘ TRÌNH HỌC</small><h2>Chọn cấp độ của con</h2><p>Mỗi level được chia thành chương và bài học rõ ràng.</p></div></div><div className="level-grid">{curriculum.map(item => <article className={`level-card ${item.color}`} key={item.level}><div className="level-top"><div className="level-number">{item.level}</div><div className="level-emoji">{item.emoji}</div></div><small>LEVEL {item.level} · {item.grade.toUpperCase()}</small><h3>{item.title}</h3><div className="topic-list">{item.chapters.map(ch => <div className="topic" key={ch.id}><span>{ch.icon}</span><div><strong>{ch.name}</strong><small>{ch.note}</small></div></div>)}</div><button onClick={()=>openLevel(item.level)}>Học Level {item.level} <span>→</span></button></article>)}</div></section>
      <section className="parent-note"><div className="note-icon"><BookOpen/></div><div><small>DÀNH CHO PHỤ HUYNH</small><h2>Theo dõi tiến độ ngay trên thiết bị</h2><p>Xem số bài đã hoàn thành, tỉ lệ đúng và điểm quiz tốt nhất của từng bài.</p></div><button className="reset" onClick={()=>{setProgress(emptyProgress);setStreak(0)}}><RotateCcw size={16}/> Đặt lại tiến độ</button></section>
      <footer><div className="brand"><span>∑</span><strong>Math Adventure</strong></div><p>Học Toán vui vẻ · Level 1–5 · Made for curious kids 🌈</p><button className="home-link"><Home size={15}/> Trang chủ</button></footer>
    </main>
  )
}
