import { useEffect, useMemo, useState } from 'react'
import { Award, BookOpen, ChevronLeft, Flame, Home, RotateCcw, Sparkles, Star, Trophy } from 'lucide-react'
import { curriculum } from './curriculum'

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = (items) => items[rnd(0, items.length - 1)]
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5)

function makeQuestion(level) {
  if (level === 1) {
    const type = pick(['add', 'sub', 'compare'])
    if (type === 'compare') {
      const a = rnd(0, 20), b = rnd(0, 20)
      return { text: `${a} __ ${b}`, answer: a === b ? '=' : a > b ? '>' : '<', choices: ['<', '=', '>'], hint: 'Số nào lớn hơn?' }
    }
    const a = rnd(0, 15), b = type === 'sub' ? rnd(0, a) : rnd(0, 20 - a)
    const answer = type === 'add' ? a + b : a - b
    return numericQuestion(`${a} ${type === 'add' ? '+' : '−'} ${b} = ?`, answer, 'Đếm tiến hoặc đếm lùi nhé!')
  }

  if (level === 2) {
    const type = pick(['add', 'sub', 'mul'])
    if (type === 'mul') {
      const a = pick([2, 5]), b = rnd(1, 10)
      return numericQuestion(`${a} × ${b} = ?`, a * b, `Nhớ bảng nhân ${a}.`)
    }
    const a = rnd(20, 500), b = type === 'sub' ? rnd(0, a) : rnd(10, 400)
    return numericQuestion(`${a} ${type === 'add' ? '+' : '−'} ${b} = ?`, type === 'add' ? a + b : a - b, 'Tính theo hàng đơn vị, chục, trăm.')
  }

  if (level === 3) {
    const type = pick(['mul', 'div', 'area'])
    if (type === 'area') {
      const a = rnd(2, 12), b = rnd(2, 10)
      return numericQuestion(`HCN dài ${a} cm, rộng ${b} cm. Diện tích = ? cm²`, a * b, 'Diện tích hình chữ nhật = dài × rộng.')
    }
    const a = rnd(2, 9), b = rnd(2, 10)
    return type === 'mul'
      ? numericQuestion(`${a} × ${b} = ?`, a * b, 'Dùng bảng nhân để tính nhanh.')
      : numericQuestion(`${a * b} ÷ ${a} = ?`, b, 'Phép chia là phép tính ngược của phép nhân.')
  }

  if (level === 4) {
    const type = pick(['fraction', 'average', 'large'])
    if (type === 'fraction') {
      const d = pick([4, 5, 8, 10]), a = rnd(1, d - 1), b = rnd(1, d - a)
      return numericQuestion(`${a}/${d} + ${b}/${d} = ?/${d}`, a + b, 'Cùng mẫu số: cộng các tử số.')
    }
    if (type === 'average') {
      const a = rnd(10, 40), b = rnd(10, 40), c = rnd(10, 40)
      const sum = a + b + c
      const fixedC = c + ((3 - (sum % 3)) % 3)
      return numericQuestion(`Trung bình của ${a}, ${b}, ${fixedC} là?`, (a + b + fixedC) / 3, 'Cộng các số rồi chia cho số lượng số.')
    }
    const a = rnd(1000, 9000), b = rnd(100, 3000)
    return numericQuestion(`${a} + ${b} = ?`, a + b, 'Đặt tính thẳng hàng rồi cộng.')
  }

  const type = pick(['decimal', 'percent', 'motion'])
  if (type === 'decimal') {
    const a = rnd(10, 90) / 10, b = rnd(10, 90) / 10
    const ans = Number((a + b).toFixed(1))
    return numericQuestion(`${a.toFixed(1)} + ${b.toFixed(1)} = ?`, ans, 'Đặt dấu phẩy thẳng cột.')
  }
  if (type === 'percent') {
    const total = pick([100, 200, 400, 500]), percent = pick([10, 20, 25, 50])
    return numericQuestion(`${percent}% của ${total} là?`, total * percent / 100, 'Đổi phần trăm thành phần của 100.')
  }
  const speed = pick([10, 20, 30, 40]), time = rnd(2, 5)
  return numericQuestion(`Đi ${speed} km/h trong ${time} giờ. Quãng đường?`, speed * time, 'Quãng đường = vận tốc × thời gian.')
}

function numericQuestion(text, answer, hint) {
  const delta = Math.max(1, Math.round(Math.abs(Number(answer)) * 0.2))
  const wrong = new Set()
  while (wrong.size < 3) {
    const value = Number(answer) + pick([-2, -1, 1, 2]) * rnd(1, delta + 2)
    if (value >= 0 && value !== Number(answer)) wrong.add(Number(value.toFixed(1)))
  }
  return { text, answer, choices: shuffle([Number(answer), ...wrong]), hint }
}

const initialProgress = () => {
  try { return JSON.parse(localStorage.getItem('math-kid-progress')) || { stars: 0, bestStreak: 0, solved: 0 } }
  catch { return { stars: 0, bestStreak: 0, solved: 0 } }
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [level, setLevel] = useState(1)
  const [question, setQuestion] = useState(() => makeQuestion(1))
  const [selected, setSelected] = useState(null)
  const [streak, setStreak] = useState(0)
  const [progress, setProgress] = useState(initialProgress)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => localStorage.setItem('math-kid-progress', JSON.stringify(progress)), [progress])

  const current = useMemo(() => curriculum.find((item) => item.level === level), [level])
  const correct = selected !== null && String(selected) === String(question.answer)

  const start = (nextLevel) => {
    setLevel(nextLevel)
    setQuestion(makeQuestion(nextLevel))
    setSelected(null)
    setShowHint(false)
    setScreen('practice')
  }

  const answer = (choice) => {
    if (selected !== null) return
    setSelected(choice)
    const ok = String(choice) === String(question.answer)
    if (ok) {
      const nextStreak = streak + 1
      setStreak(nextStreak)
      setProgress((p) => ({ ...p, stars: p.stars + 1, solved: p.solved + 1, bestStreak: Math.max(p.bestStreak, nextStreak) }))
    } else {
      setStreak(0)
      setProgress((p) => ({ ...p, solved: p.solved + 1 }))
    }
  }

  const next = () => {
    setQuestion(makeQuestion(level))
    setSelected(null)
    setShowHint(false)
  }

  if (screen === 'practice') {
    return (
      <main className="app-shell practice-shell">
        <header className="topbar">
          <button className="icon-button" onClick={() => setScreen('home')} aria-label="Về trang chủ"><ChevronLeft /></button>
          <div className="practice-title"><span>{current.emoji}</span><div><small>{current.grade}</small><strong>Luyện tập nhanh</strong></div></div>
          <div className="streak"><Flame size={20} /> {streak}</div>
        </header>

        <section className="question-card">
          <div className="question-badge"><Sparkles size={16} /> Câu hỏi mới</div>
          <h1>{question.text}</h1>
          <p>Chọn đáp án đúng</p>
          <div className="answer-grid">
            {question.choices.map((choice) => {
              let state = ''
              if (selected !== null && String(choice) === String(question.answer)) state = 'correct'
              else if (selected !== null && String(choice) === String(selected)) state = 'wrong'
              return <button key={choice} className={`answer ${state}`} onClick={() => answer(choice)}>{choice}</button>
            })}
          </div>
          {selected === null ? (
            <button className="hint-button" onClick={() => setShowHint((v) => !v)}>💡 {showHint ? question.hint : 'Gợi ý cho bé'}</button>
          ) : (
            <div className={`feedback ${correct ? 'yay' : 'oops'}`}>
              <div><strong>{correct ? 'Tuyệt vời! 🌟' : 'Gần đúng rồi! 💪'}</strong><span>{correct ? 'Con nhận được 1 ngôi sao.' : `Đáp án đúng là ${question.answer}.`}</span></div>
              <button onClick={next}>Câu tiếp theo →</button>
            </div>
          )}
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <nav>
          <div className="brand"><span>∑</span><strong>Math Adventure</strong></div>
          <div className="stats-pill"><Star size={18} fill="currentColor" /> {progress.stars} sao</div>
        </nav>
        <div className="hero-content">
          <div className="hero-copy">
            <div className="eyebrow">✨ HỌC TOÁN MỖI NGÀY, VUI MỖI NGÀY</div>
            <h1>Chinh phục Toán học<br/><span>qua từng cuộc phiêu lưu!</span></h1>
            <p>Bài học ngắn, trò chơi vui và thử thách vừa sức cho học sinh tiểu học từ Lớp 1 đến Lớp 5.</p>
            <button className="primary" onClick={() => document.getElementById('levels')?.scrollIntoView({ behavior: 'smooth' })}>Bắt đầu học <Sparkles size={19} /></button>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="planet">🌍</div><div className="rocket">🚀</div><div className="cloud c1">☁️</div><div className="cloud c2">☁️</div>
            <span className="float f1">7</span><span className="float f2">+</span><span className="float f3">π</span>
          </div>
        </div>
      </header>

      <section className="progress-strip">
        <div><Award /><span><strong>{progress.stars}</strong> Ngôi sao</span></div>
        <div><Flame /><span><strong>{progress.bestStreak}</strong> Chuỗi đúng tốt nhất</span></div>
        <div><Trophy /><span><strong>{progress.solved}</strong> Câu đã làm</span></div>
      </section>

      <section id="levels" className="levels-section">
        <div className="section-heading"><span>🗺️</span><div><small>LỘ TRÌNH HỌC</small><h2>Chọn cấp độ của con</h2><p>Mỗi level bám các mạch kiến thức cốt lõi của Toán tiểu học.</p></div></div>
        <div className="level-grid">
          {curriculum.map((item) => (
            <article className={`level-card ${item.color}`} key={item.level}>
              <div className="level-top"><div className="level-number">{item.level}</div><div className="level-emoji">{item.emoji}</div></div>
              <small>LEVEL {item.level} · {item.grade.toUpperCase()}</small>
              <h3>{item.title}</h3>
              <div className="topic-list">
                {item.topics.map((topic) => <div className="topic" key={topic.id}><span>{topic.icon}</span><div><strong>{topic.name}</strong><small>{topic.note}</small></div></div>)}
              </div>
              <button onClick={() => start(item.level)}>Học Level {item.level} <span>→</span></button>
            </article>
          ))}
        </div>
      </section>

      <section className="parent-note">
        <div className="note-icon"><BookOpen /></div>
        <div><small>DÀNH CHO PHỤ HUYNH</small><h2>Học ít nhưng đều đặn</h2><p>Mỗi lượt chỉ cần 5–10 phút. Tiến độ được lưu ngay trên thiết bị, không cần tạo tài khoản.</p></div>
        <button className="reset" onClick={() => { setProgress({ stars: 0, bestStreak: 0, solved: 0 }); setStreak(0) }}><RotateCcw size={16}/> Đặt lại tiến độ</button>
      </section>

      <footer><div className="brand"><span>∑</span><strong>Math Adventure</strong></div><p>Học Toán vui vẻ · Level 1–5 · Made for curious kids 🌈</p><button className="home-link"><Home size={15}/> Trang chủ</button></footer>
    </main>
  )
}
