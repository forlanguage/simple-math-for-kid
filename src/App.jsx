import { useEffect, useMemo, useState } from 'react'
import { Award, BarChart3, BookOpen, ChevronLeft, CheckCircle2, Flame, Home, Lightbulb, RotateCcw, Sparkles, Star, Trophy, Volume2, VolumeX } from 'lucide-react'
import { allLessons, curriculum } from './curriculum'

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = (items) => items[rnd(0, items.length - 1)]
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5)

function numericQuestion(text, answer, hint, visual = null) {
  const value = Number(answer)
  const delta = Math.max(1, Math.round(Math.abs(value) * 0.15))
  const wrong = new Set()
  while (wrong.size < 3) {
    const candidate = value + pick([-2, -1, 1, 2]) * rnd(1, delta + 2)
    if (candidate >= 0 && candidate !== value) wrong.add(Number(candidate.toFixed(1)))
  }
  return { text, answer, choices: shuffle([value, ...wrong]), hint, visual }
}

function makeQuestion(type) {
  switch (type) {
    case 'count': {
      const n = rnd(2, 10)
      return numericQuestion('Có bao nhiêu bạn nhỏ?', n, 'Chạm từng hình và đếm từ 1 nhé!', { type: 'count', count: n })
    }
    case 'compare': {
      const a = rnd(0, 20), b = rnd(0, 20)
      return { text: `${a} __ ${b}`, answer: a === b ? '=' : a > b ? '>' : '<', choices: ['<', '=', '>'], hint: 'Nhìn vị trí của hai số trên trục số.', visual: { type: 'numberline', a, b } }
    }
    case 'add10': {
      const a = rnd(1, 7), b = rnd(1, 10 - a)
      return numericQuestion(`${a} + ${b} = ?`, a + b, 'Gộp hai nhóm lại rồi đếm tất cả.', { type: 'groups', a, b, mode: 'add' })
    }
    case 'sub20': {
      const a = rnd(5, 20), b = rnd(1, Math.min(a, 9))
      return numericQuestion(`${a} − ${b} = ?`, a - b, 'Bắt đầu từ số lớn rồi nhảy lùi.', { type: 'jump', a, b })
    }
    case 'shapes1': {
      const shapes = [
        { q: 'Hình nào có 3 cạnh?', a: 'Tam giác', c: ['Tam giác', 'Hình tròn', 'Hình vuông', 'Hình chữ nhật'], icon: 'triangle' },
        { q: 'Hình nào không có góc?', a: 'Hình tròn', c: ['Hình tròn', 'Tam giác', 'Hình vuông', 'Hình chữ nhật'], icon: 'circle' },
        { q: 'Hình nào có 4 cạnh bằng nhau?', a: 'Hình vuông', c: ['Hình vuông', 'Hình tròn', 'Tam giác', 'Hình chữ nhật'], icon: 'square' },
      ]
      const x = pick(shapes)
      return { text: x.q, answer: x.a, choices: shuffle(x.c), hint: 'Đếm số cạnh và số góc của từng hình.', visual: { type: 'shapes' } }
    }
    case 'time1': {
      const h = rnd(1, 12)
      return { text: 'Đồng hồ đang chỉ mấy giờ?', answer: `${h} giờ`, choices: shuffle([`${h} giờ`, `${(h % 12) + 1} giờ`, `${Math.max(1, h - 1)} giờ`, `${h}:30`]), hint: 'Kim phút ở số 12 nghĩa là giờ đúng.', visual: { type: 'clock', hour: h } }
    }
    case 'placeValue': {
      const h = rnd(1, 9), t = rnd(0, 9), u = rnd(0, 9)
      return numericQuestion(`${h}${t}${u} có chữ số hàng chục là?`, t, 'Hàng chục nằm ở giữa hàng trăm và hàng đơn vị.', { type: 'place', h, t, u })
    }
    case 'compare1000': {
      const a = rnd(100, 999), b = rnd(100, 999)
      return { text: `${a} __ ${b}`, answer: a === b ? '=' : a > b ? '>' : '<', choices: ['<', '=', '>'], hint: 'So sánh hàng trăm trước.' }
    }
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
      return numericQuestion(`Món đồ giá ${price.toLocaleString('vi-VN')}đ. Tiền thừa là bao nhiêu?`, paid - price, 'Tiền thừa = tiền đưa − giá món đồ.', { type: 'money', price, paid })
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
    default: return numericQuestion('2 + 2 = ?', 4, 'Đếm thêm 2 từ số 2.')
  }
}

function playTone(ok) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.type = ok ? 'sine' : 'triangle'
    osc.frequency.setValueAtTime(ok ? 660 : 260, ctx.currentTime)
    if (ok) osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + .16)
    gain.gain.setValueAtTime(.06, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .28)
    osc.start(); osc.stop(ctx.currentTime + .28)
  } catch {}
}

function Clock({ hour }) {
  const angle = hour * 30
  return <div className="kid-clock"><div className="clock-hand hour" style={{ transform: `translateX(-50%) rotate(${angle}deg)` }} /><div className="clock-hand minute"/><div className="clock-dot"/>{[12,3,6,9].map(n=><span key={n} className={`clock-n n${n}`}>{n}</span>)}</div>
}

function VisualQuestion({ visual }) {
  const [tapped, setTapped] = useState([])
  if (!visual) return null
  if (visual.type === 'count') return <div className="count-play">{Array.from({ length: visual.count }, (_, i) => <button aria-label={`Vật thứ ${i+1}`} className={tapped.includes(i) ? 'counted' : ''} key={i} onClick={() => setTapped(v => v.includes(i) ? v : [...v, i])}>🐥<small>{tapped.includes(i) ? tapped.indexOf(i)+1 : ''}</small></button>)}</div>
  if (visual.type === 'numberline') return <div className="number-line"><div className="number-track"/>{Array.from({length:21},(_,i)=><span key={i} className={i===visual.a?'mark-a':i===visual.b?'mark-b':''}>{i}</span>)}</div>
  if (visual.type === 'groups') return <div className="group-visual"><div>{Array.from({length:visual.a},(_,i)=><span key={i}>🔵</span>)}</div><b>+</b><div>{Array.from({length:visual.b},(_,i)=><span key={i}>🟡</span>)}</div></div>
  if (visual.type === 'jump') return <div className="jump-visual"><strong>{visual.a}</strong><span>⬅️ nhảy lùi {visual.b} bước</span><strong>?</strong></div>
  if (visual.type === 'shapes') return <div className="shape-showcase"><span className="shape circle"/><span className="shape triangle"/><span className="shape square"/><span className="shape rectangle"/></div>
  if (visual.type === 'clock') return <Clock hour={visual.hour}/>
  if (visual.type === 'place') return <div className="place-box"><div><b>{visual.h}</b><small>Trăm</small></div><div><b>{visual.t}</b><small>Chục</small></div><div><b>{visual.u}</b><small>Đơn vị</small></div></div>
  if (visual.type === 'money') return <div className="money-scene"><div className="shop-item">🧸<small>Giá</small><b>{visual.price.toLocaleString('vi-VN')}đ</b></div><div className="pay-card">💵<small>Bé đưa</small><b>{visual.paid.toLocaleString('vi-VN')}đ</b></div></div>
  return null
}

function LessonPlayground({ type }) {
  const [dragged, setDragged] = useState(null)
  const [drop, setDrop] = useState(null)
  if (type === 'count') return <div className="mini-play"><h3>👆 Chạm và đếm</h3><p>Chạm từng chú cá để đánh dấu khi con đếm.</p><TapCounter/></div>
  if (type === 'compare') return <div className="mini-play"><h3>🛤️ Trục số 0–20</h3><p>Số càng ở bên phải thì càng lớn.</p><div className="learn-numberline">{Array.from({length:21},(_,i)=><span key={i}>{i}</span>)}</div></div>
  if (type === 'shapes1') return <div className="mini-play"><h3>🧩 Kéo hình vào đúng tên</h3><div className="drag-game"><div className="drag-items"><div draggable onDragStart={()=>setDragged('circle')} className="drag-shape circle"/><div draggable onDragStart={()=>setDragged('square')} className="drag-shape square"/></div><div className="drop-items"><div onDragOver={e=>e.preventDefault()} onDrop={()=>setDrop(dragged==='circle'?'circle':'wrong')} className={drop==='circle'?'drop-ok':drop==='wrong'?'drop-wrong':''}>Hình tròn</div><div onDragOver={e=>e.preventDefault()} onDrop={()=>setDrop(dragged==='square'?'square':'wrong2')} className={drop==='square'?'drop-ok':drop==='wrong2'?'drop-wrong':''}>Hình vuông</div></div></div></div>
  if (type === 'time1') return <div className="mini-play"><h3>🕐 Nhìn đồng hồ</h3><p>Kim dài ở số 12, kim ngắn cho biết giờ.</p><Clock hour={3}/><strong className="clock-caption">3 giờ</strong></div>
  if (type === 'add10') return <div className="mini-play"><h3>➕ Gộp hai nhóm</h3><div className="group-visual"><div>🍎🍎🍎</div><b>+</b><div>🍎🍎</div><b>= 5</b></div></div>
  return null
}

function TapCounter() {
  const [seen, setSeen] = useState([])
  return <div className="tap-counter">{Array.from({length:7},(_,i)=><button className={seen.includes(i)?'seen':''} key={i} onClick={()=>setSeen(v=>v.includes(i)?v:[...v,i])}>🐟<small>{seen.includes(i)?seen.indexOf(i)+1:''}</small></button>)}</div>
}

const emptyProgress = { stars: 0, bestStreak: 0, solved: 0, correct: 0, completedLessons: {}, lessonScores: {} }
const initialProgress = () => { try { return { ...emptyProgress, ...(JSON.parse(localStorage.getItem('math-kid-progress')) || {}) } } catch { return emptyProgress } }

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
  const [sound, setSound] = useState(true)

  useEffect(() => localStorage.setItem('math-kid-progress', JSON.stringify(progress)), [progress])
  const currentLevel = useMemo(() => curriculum.find(x => x.level === level), [level])
  const currentChapter = currentLevel?.chapters.find(x => x.id === chapterId)
  const currentLesson = currentChapter?.lessons.find(x => x.id === lessonId)
  const correct = selected !== null && String(selected) === String(question?.answer)
  const accuracy = progress.solved ? Math.round(progress.correct / progress.solved * 100) : 0

  const openLevel = n => { setLevel(n); setChapterId(null); setLessonId(null); setScreen('level') }
  const openChapter = id => { setChapterId(id); setLessonId(null); setScreen('chapter') }
  const openLesson = id => { setLessonId(id); setScreen('learn') }
  const beginPractice = mode => { setQuestion(makeQuestion(currentLesson.practice)); setSelected(null); setShowHint(false); if(mode==='quiz') setQuiz({index:0,score:0,total:5}); setScreen(mode) }
  const answer = choice => {
    if (selected !== null) return
    setSelected(choice)
    const ok = String(choice) === String(question.answer)
    if (sound) playTone(ok)
    const ns = ok ? streak + 1 : 0
    setStreak(ns)
    setProgress(p => ({...p,stars:p.stars+(ok?1:0),solved:p.solved+1,correct:p.correct+(ok?1:0),bestStreak:Math.max(p.bestStreak,ns)}))
    if(screen==='quiz' && ok) setQuiz(q=>({...q,score:q.score+1}))
  }
  const nextQuestion = () => {
    if(screen==='quiz' && quiz.index+1>=quiz.total){
      setProgress(p=>({...p,completedLessons:{...p.completedLessons,[lessonId]:true},lessonScores:{...p.lessonScores,[lessonId]:Math.max(p.lessonScores?.[lessonId]||0,quiz.score)}})); setScreen('result'); return
    }
    if(screen==='quiz') setQuiz(q=>({...q,index:q.index+1}))
    setQuestion(makeQuestion(currentLesson.practice)); setSelected(null); setShowHint(false)
  }
  const Back = ({to}) => <button className="icon-button" onClick={()=>setScreen(to)} aria-label="Quay lại"><ChevronLeft/></button>
  const Sound = () => <button className="sound-toggle" onClick={()=>setSound(v=>!v)} aria-label="Bật tắt âm thanh">{sound?<Volume2/>:<VolumeX/>}</button>

  if(screen==='level') return <main className="app-shell inner-shell"><header className="topbar"><Back to="home"/><div className="practice-title"><span>{currentLevel.emoji}</span><div><small>{currentLevel.grade}</small><strong>{currentLevel.title}</strong></div></div><div className="stats-pill"><Star size={17} fill="currentColor"/> {progress.stars}</div></header><section className="inner-content"><div className="page-heading"><small>LEVEL {level}</small><h1>Chọn chương học</h1><p>Học từng phần nhỏ, hoàn thành bài và mở khóa sao.</p></div><div className="chapter-grid">{currentLevel.chapters.map(ch=><button className="chapter-card" key={ch.id} onClick={()=>openChapter(ch.id)}><span>{ch.icon}</span><div><h3>{ch.name}</h3><p>{ch.note}</p><small>{ch.lessons.length} bài học</small></div><b>→</b></button>)}</div></section></main>

  if(screen==='chapter') return <main className="app-shell inner-shell"><header className="topbar"><Back to="level"/><div className="practice-title"><span>{currentChapter.icon}</span><div><small>{currentLevel.grade}</small><strong>{currentChapter.name}</strong></div></div><div className="stats-pill"><Star size={17} fill="currentColor"/> {progress.stars}</div></header><section className="inner-content"><div className="page-heading"><small>CHƯƠNG HỌC</small><h1>{currentChapter.name}</h1><p>{currentChapter.note}</p></div><div className="lesson-list">{currentChapter.lessons.map((lesson,i)=>{const done=progress.completedLessons?.[lesson.id];return <button className="lesson-row" key={lesson.id} onClick={()=>openLesson(lesson.id)}><span className="lesson-index">{done?<CheckCircle2/>:i+1}</span><div><h3>{lesson.title}</h3><p>{done?`Đã hoàn thành · Điểm tốt nhất ${progress.lessonScores?.[lesson.id]||0}/5`:'Học → chơi thử → luyện tập → quiz'}</p></div><b>{done?'⭐':'→'}</b></button>})}</div></section></main>

  if(screen==='learn') return <main className="app-shell inner-shell"><header className="topbar"><Back to="chapter"/><div className="practice-title"><span>📘</span><div><small>BÀI HỌC</small><strong>{currentLesson.title}</strong></div></div><Sound/></header><section className="learn-card"><div className="learn-hero">{currentChapter.icon}</div><small>HỌC NHANH</small><h1>{currentLesson.title}</h1><div className="concept-list">{currentLesson.learn.map((item,i)=><div key={item}><span>{i+1}</span><p>{item}</p></div>)}</div>{level===1&&<LessonPlayground type={currentLesson.practice}/>}<div className="learn-actions"><button className="secondary" onClick={()=>beginPractice('practice')}>🎯 Luyện tập</button><button className="primary" onClick={()=>beginPractice('quiz')}>Quiz 5 câu <Sparkles size={18}/></button></div></section></main>

  if(screen==='practice'||screen==='quiz') return <main className="app-shell practice-shell"><header className="topbar"><Back to="learn"/><div className="practice-title"><span>{currentChapter.icon}</span><div><small>{screen==='quiz'?`QUIZ ${quiz.index+1}/${quiz.total}`:'LUYỆN TẬP'}</small><strong>{currentLesson.title}</strong></div></div><div className="practice-tools"><div className="streak"><Flame size={20}/> {streak}</div><Sound/></div></header><section className="question-card"><div className="question-badge"><Sparkles size={16}/> {screen==='quiz'?'Thử thách nhỏ':'Câu hỏi mới'}</div><VisualQuestion key={`${question.text}-${quiz.index}`} visual={question.visual}/><h1>{question.text}</h1><p>Chọn đáp án đúng</p><div className="answer-grid">{question.choices.map(choice=>{let state='';if(selected!==null&&String(choice)===String(question.answer))state='correct';else if(selected!==null&&String(choice)===String(selected))state='wrong';return <button key={choice} className={`answer ${state}`} onClick={()=>answer(choice)}>{choice}</button>})}</div>{selected===null?<button className="hint-button" onClick={()=>setShowHint(v=>!v)}><Lightbulb size={16}/> {showHint?question.hint:'Gợi ý cho bé'}</button>:<div className={`feedback ${correct?'yay':'oops'}`}><div><strong>{correct?'Tuyệt vời! 🌟':'Thử lại ở câu sau nhé! 💪'}</strong><span>{correct?'Con nhận được 1 ngôi sao.':`Đáp án đúng là ${question.answer}.`}</span></div><button onClick={nextQuestion}>{screen==='quiz'&&quiz.index+1>=quiz.total?'Xem kết quả':'Câu tiếp theo →'}</button></div>}</section></main>

  if(screen==='result') return <main className="app-shell result-shell"><section className="result-card"><div className="result-trophy">🏆</div><small>HOÀN THÀNH BÀI HỌC</small><h1>{quiz.score}/5 điểm</h1><p>{quiz.score>=4?'Xuất sắc! Con đã nắm bài rất tốt.':quiz.score>=3?'Tốt lắm! Luyện thêm một lượt để chắc hơn nhé.':'Không sao, mình học lại phần Học nhanh rồi thử tiếp nhé.'}</p><div className="result-actions"><button className="secondary" onClick={()=>setScreen('learn')}>Học lại</button><button className="primary" onClick={()=>setScreen('chapter')}>Chọn bài khác →</button></div></section></main>

  if(screen==='parent') return <main className="app-shell inner-shell"><header className="topbar"><Back to="home"/><div className="practice-title"><span>👨‍👩‍👧</span><div><small>DASHBOARD</small><strong>Dành cho phụ huynh</strong></div></div><div/></header><section className="inner-content"><div className="page-heading"><small>TIẾN ĐỘ HỌC</small><h1>Hôm nay con học thế nào?</h1><p>Dữ liệu được lưu trên thiết bị này.</p></div><div className="parent-stats"><div><Star/><strong>{progress.stars}</strong><span>Ngôi sao</span></div><div><Trophy/><strong>{progress.solved}</strong><span>Câu đã làm</span></div><div><BarChart3/><strong>{accuracy}%</strong><span>Độ chính xác</span></div><div><Award/><strong>{Object.keys(progress.completedLessons||{}).length}/{allLessons.length}</strong><span>Bài hoàn thành</span></div></div><div className="progress-table">{curriculum.map(l=>{const lessons=allLessons.filter(x=>x.level===l.level),done=lessons.filter(x=>progress.completedLessons?.[x.id]).length;return <div key={l.level}><span>{l.emoji} {l.grade}</span><div className="progress-bar"><i style={{width:`${lessons.length?done/lessons.length*100:0}%`}}/></div><b>{done}/{lessons.length}</b></div>})}</div></section></main>

  return <main className="app-shell"><header className="hero"><nav><div className="brand"><span>∑</span><strong>Math Adventure</strong></div><div className="nav-actions"><button className="parent-button" onClick={()=>setScreen('parent')}><BarChart3 size={17}/> Phụ huynh</button><div className="stats-pill"><Star size={18} fill="currentColor"/> {progress.stars} sao</div></div></nav><div className="hero-content"><div className="hero-copy"><div className="eyebrow">✨ HỌC TOÁN MỖI NGÀY, VUI MỖI NGÀY</div><h1>Chinh phục Toán học<br/><span>qua từng cuộc phiêu lưu!</span></h1><p>Bài học ngắn, tương tác trực quan và thử thách vừa sức cho học sinh tiểu học từ Lớp 1 đến Lớp 5.</p><button className="primary" onClick={()=>document.getElementById('levels')?.scrollIntoView({behavior:'smooth'})}>Bắt đầu học <Sparkles size={19}/></button></div><div className="hero-art" aria-hidden="true"><div className="planet">🌍</div><div className="rocket">🚀</div><div className="cloud c1">☁️</div><div className="cloud c2">☁️</div><span className="float f1">7</span><span className="float f2">+</span><span className="float f3">π</span></div></div></header><section className="progress-strip"><div><Award/><span><strong>{progress.stars}</strong> Ngôi sao</span></div><div><Flame/><span><strong>{progress.bestStreak}</strong> Chuỗi đúng tốt nhất</span></div><div><Trophy/><span><strong>{progress.solved}</strong> Câu đã làm</span></div></section><section id="levels" className="levels-section"><div className="section-heading"><span>🗺️</span><div><small>LỘ TRÌNH HỌC</small><h2>Chọn cấp độ của con</h2><p>Level 1 đã có bài học tương tác trực quan; các level sau dùng cùng lộ trình Learn → Practice → Quiz.</p></div></div><div className="level-grid">{curriculum.map(item=><article className={`level-card ${item.color}`} key={item.level}><div className="level-top"><div className="level-number">{item.level}</div><div className="level-emoji">{item.emoji}</div></div><small>LEVEL {item.level} · {item.grade.toUpperCase()}</small><h3>{item.title}</h3><div className="topic-list">{item.chapters.map(ch=><div className="topic" key={ch.id}><span>{ch.icon}</span><div><strong>{ch.name}</strong><small>{ch.note}</small></div></div>)}</div><button onClick={()=>openLevel(item.level)}>Học Level {item.level}<span>→</span></button></article>)}</div></section><section className="parent-note"><div className="note-icon"><BookOpen/></div><div><small>DÀNH CHO PHỤ HUYNH</small><h2>Học ít nhưng đều đặn</h2><p>Mỗi lượt 5–10 phút. Theo dõi độ chính xác và bài đã hoàn thành trong Dashboard.</p></div><button className="reset" onClick={()=>{setProgress(emptyProgress);setStreak(0)}}><RotateCcw size={16}/> Đặt lại tiến độ</button></section><footer><div className="brand"><span>∑</span><strong>Math Adventure</strong></div><p>Học Toán vui vẻ · Level 1–5 · Made for curious kids 🌈</p><button className="home-link"><Home size={15}/> Trang chủ</button></footer></main>
}
