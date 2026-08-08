import { useMemo, useState } from 'react'
import { ChevronLeft, RefreshCcw, Star, Volume2, VolumeX } from 'lucide-react'

const CHILD_NAME='Quỳnh Anh'
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a
const shuffle=a=>[...a].sort(()=>Math.random()-.5)
function uniqueNumbers(count=4,max=20){const s=new Set();while(s.size<count)s.add(rnd(0,max));return [...s]}
function speak(text,enabled=true){if(!enabled||!('speechSynthesis'in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='vi-VN';u.rate=.88;u.pitch=1.08;const voices=window.speechSynthesis.getVoices();const vi=voices.find(v=>v.lang?.toLowerCase().startsWith('vi'));if(vi)u.voice=vi;window.speechSynthesis.speak(u)}
const praise=()=>shuffle([`Giỏi lắm ${CHILD_NAME}! Con làm đúng rồi.`,`Tuyệt vời ${CHILD_NAME}! Chính xác!`,`Xuất sắc lắm ${CHILD_NAME}! Mình chơi tiếp nhé.`])[0]

function CrocodileGame({voice}){
  const make=()=>{const a=rnd(0,20),equal=Math.random()<.2,b=equal?a:rnd(0,20);return{a,b,answer:a===b?'=':a>b?'>':'<'}}
  const[q,setQ]=useState(make),[picked,setPicked]=useState(null);const ok=picked===q.answer
  const choose=x=>{if(picked)return;setPicked(x);if(x===q.answer)speak(praise(),voice);else speak(q.answer==='='?`Quỳnh Anh ơi, hai số đều là ${q.a}, nên dùng dấu bằng nhé.`:`Quỳnh Anh thử nhìn số ${q.a} và ${q.b}. Miệng cá sấu quay về phía số lớn hơn nhé.`,voice)}
  const next=()=>{setQ(make());setPicked(null)}
  const face=q.answer==='>'?'🐊':q.answer==='<'?'🐊':'😊'
  return <Game title="Cá sấu tham ăn" badge="🐊 SO SÁNH SỐ" help="Cá sấu luôn há miệng về phía số lớn hơn."><div className="croc-scene"><div className="food-pile">🍎<b>{q.a}</b></div><div className={`croc ${picked?ok?'happy':'sad':''}`}>{face}</div><div className="food-pile">🍊<b>{q.b}</b></div></div><div className="compare-board"><span>{q.a}</span><b className={picked?ok?'good':'bad':''}>{picked||'?'}</b><span>{q.b}</span></div><div className="sign-buttons">{['<','=','>'].map(x=><button key={x} disabled={picked!==null} onClick={()=>choose(x)}>{x}</button>)}</div>{picked&&<Feedback ok={ok} text={ok?'Cá sấu ăn đúng phía rồi!':`Đáp án đúng là ${q.answer}`} next={next}/>}</Game>
}

function TrainGame({voice}){
  const make=()=>{const vals=uniqueNumbers(4);const direction=Math.random()>.5?'asc':'desc';return{vals:shuffle(vals),direction}}
  const[q,setQ]=useState(make),[chosen,setChosen]=useState([]);const target=useMemo(()=>[...q.vals].sort((a,b)=>q.direction==='asc'?a-b:b-a),[q]);const complete=chosen.length===4,ok=complete&&chosen.every((x,i)=>x===target[i])
  const choose=n=>{if(chosen.includes(n))return;const z=[...chosen,n];setChosen(z);if(z.length===4)speak(z.every((x,i)=>x===target[i])?praise():`Quỳnh Anh ơi, ${q.direction==='asc'?'tăng dần là từ bé đến lớn':'giảm dần là từ lớn đến bé'}. Con tìm toa đầu tiên trước nhé.`,voice)}
  const reset=()=>setChosen([]),next=()=>{setQ(make());setChosen([])}
  return <Game title="Đoàn tàu số" badge="🚂 SẮP XẾP" help={q.direction==='asc'?'Xếp toa từ bé đến lớn.':'Xếp toa từ lớn đến bé.'}><div className="train"><span className="engine">🚂</span>{[0,1,2,3].map(i=><div className="car" key={i}>{chosen[i]??'?'}</div>)}</div><div className="number-chips">{q.vals.map(n=><button key={n} className={chosen.includes(n)?'used':''} onClick={()=>choose(n)}>{n}</button>)}</div><div className="game-actions"><button onClick={reset}><RefreshCcw size={17}/> Làm lại</button></div>{complete&&<Feedback ok={ok} text={ok?'Tàu đã xếp đúng thứ tự!':'Các toa chưa đúng thứ tự.'} next={ok?next:reset}/>}</Game>
}

function BalloonGame({voice}){
  const make=()=>{const add=Math.random()>.35;let a,b,answer;if(add){a=rnd(1,9);b=rnd(1,10-a);answer=a+b}else{a=rnd(4,10);b=rnd(1,a);answer=a-b}const wrong=new Set();while(wrong.size<3){const x=Math.max(0,answer+rnd(-3,3));if(x!==answer)wrong.add(x)}return{a,b,op:add?'+':'−',answer,choices:shuffle([answer,...wrong])}}
  const[q,setQ]=useState(make),[picked,setPicked]=useState(null);const ok=picked===q.answer
  const choose=n=>{if(picked!==null)return;setPicked(n);if(n===q.answer)speak(`${praise()} ${q.a} ${q.op==='+'?'cộng':'trừ'} ${q.b} bằng ${q.answer}.`,voice);else speak(`Chưa đúng rồi ${CHILD_NAME}. ${q.op==='+'?'Con thử gộp hai nhóm lại rồi đếm tất cả nhé.':'Con bắt đầu từ số lớn và đếm lùi nhé.'}`,voice)}
  const next=()=>{setQ(make());setPicked(null)}
  return <Game title="Bắn bóng đáp án" badge="🎈 TÍNH NHẨM" help="Chạm vào quả bóng mang đáp án đúng."><div className="balloon-question">{q.a} {q.op} {q.b} = ?</div><div className="balloon-field">{q.choices.map((n,i)=><button key={n} className={`balloon b${i} ${picked===n?(n===q.answer?'pop-good':'pop-bad'):''}`} onClick={()=>choose(n)}><span>{n}</span></button>)}</div>{picked!==null&&<Feedback ok={ok} text={ok?'Bùm! Trúng rồi! 🎉':`Đáp án đúng là ${q.answer}`} next={next}/>}</Game>
}

function RabbitGame({voice}){
  const make=()=>{const a=rnd(2,8),b=rnd(1,Math.min(5,10-a)),answer=a+b;const wrong=new Set();while(wrong.size<3){const x=Math.max(0,answer+rnd(-2,2));if(x!==answer)wrong.add(x)}return{a,b,answer,choices:shuffle([answer,...wrong])}}
  const[q,setQ]=useState(make),[picked,setPicked]=useState(null),[steps,setSteps]=useState(0);const ok=picked===q.answer
  const choose=n=>{if(picked!==null)return;setPicked(n);if(n===q.answer){setSteps(s=>Math.min(5,s+1));speak(`${praise()} Thỏ nhảy thêm một bước tới củ cà rốt.`,voice)}else speak(`Quỳnh Anh ơi, mình có ${q.a} và thêm ${q.b}. Con thử đếm tiếp ${q.b} bước từ ${q.a} nhé.`,voice)}
  const next=()=>{setQ(make());setPicked(null)}
  return <Game title="Thỏ tìm cà rốt" badge="🐰 CỘNG VUI" help="Mỗi câu đúng giúp thỏ tiến gần củ cà rốt."><div className="rabbit-path">{[0,1,2,3,4,5].map(i=><div key={i} className={i<=steps?'done':''}>{i===steps?'🐰':i===5?'🥕':'🌿'}</div>)}</div><div className="rabbit-question">{q.a} + {q.b} = ?</div><div className="rabbit-answers">{q.choices.map(n=><button key={n} onClick={()=>choose(n)}>{n}</button>)}</div>{picked!==null&&<Feedback ok={ok} text={ok?(steps>=4?'Sắp tới cà rốt rồi! 🥕':'Thỏ đã nhảy thêm một bước!'):`Đáp án đúng là ${q.answer}`} next={next}/>}</Game>
}

function Game({title,badge,help,children}){return <section className="l1-game-card"><div className="game-label">{badge}</div><h2>{title}</h2><p className="game-help">{help}</p>{children}</section>}
function Feedback({ok,text,next}){return <div className={`game-feedback ${ok?'good':'bad'}`}><span>{ok?'🌟':'💡'} {text}</span><button onClick={next}>{ok?'Câu mới →':'Thử câu khác →'}</button></div>}

export default function Level1Games({onBack}){
  const[mode,setMode]=useState('croc'),[voice,setVoice]=useState(true);const[stars]=useState(()=>{try{return JSON.parse(localStorage.getItem('math-kid-progress'))?.stars||0}catch{return 0}})
  const tabs=[['croc','🐊','Cá sấu'],['train','🚂','Tàu số'],['balloon','🎈','Bắn bóng'],['rabbit','🐰','Thỏ cà rốt']]
  return <main className="l1-games-shell"><header className="l1-games-top"><button onClick={onBack}><ChevronLeft/></button><div><small>LEVEL 1 · LỚP 1</small><strong>Math Playground của {CHILD_NAME}</strong></div><div className="top-tools"><button className="voice-toggle" onClick={()=>{const n=!voice;setVoice(n);if(n)setTimeout(()=>speak(`Bật giọng nói rồi nhé ${CHILD_NAME}.`,true),50)}}>{voice?<Volume2/>:<VolumeX/>}</button><div className="l1-star"><Star size={17} fill="currentColor"/> {stars}</div></div></header><section className="l1-games-hero" onClick={()=>speak(`Xin chào ${CHILD_NAME}. Chọn một trò chơi mình thích nhé!`,voice)}><div><span>🎡</span><div><small>MATH PLAYGROUND</small><h1>Quỳnh Anh ơi, chọn trò chơi nào!</h1><p>Chạm vào đây để nghe lời chào. Mỗi game đều có giọng nói khen và hướng dẫn khi làm sai.</p></div></div></section><nav className="game-tabs game-tabs-4">{tabs.map(([id,icon,label])=><button key={id} className={mode===id?'active':''} onClick={()=>setMode(id)}><span>{icon}</span>{label}</button>)}</nav><div className="l1-game-wrap">{mode==='croc'?<CrocodileGame voice={voice}/>:mode==='train'?<TrainGame voice={voice}/>:mode==='balloon'?<BalloonGame voice={voice}/>:<RabbitGame voice={voice}/>}</div></main>
}
