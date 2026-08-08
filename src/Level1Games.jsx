import { useMemo, useState } from 'react'
import { ArrowDownAZ, ArrowUpAZ, ChevronLeft, Grip, RefreshCcw, Sparkles, Star, Volume2, VolumeX } from 'lucide-react'

const CHILD_NAME='Quỳnh Anh'
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a
const shuffle=a=>[...a].sort(()=>Math.random()-.5)
function uniqueNumbers(count=4,max=20){const s=new Set();while(s.size<count)s.add(rnd(0,max));return [...s]}
function speak(text,enabled=true){if(!enabled||!('speechSynthesis'in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='vi-VN';u.rate=.88;u.pitch=1.08;const voices=window.speechSynthesis.getVoices();const vi=voices.find(v=>v.lang?.toLowerCase().startsWith('vi'));if(vi)u.voice=vi;window.speechSynthesis.speak(u)}
const praise=()=>shuffle([`Giỏi lắm ${CHILD_NAME}! Con làm đúng rồi.`,`Tuyệt vời ${CHILD_NAME}! Chính xác!`,`Xuất sắc lắm ${CHILD_NAME}! Mình làm câu tiếp theo nhé.`])[0]

function CompareGame({voice}){
  const make=()=>{const a=rnd(0,20),equal=Math.random()<.2,b=equal?a:rnd(0,20);return{a,b,answer:a===b?'=':a>b?'>':'<'}}
  const [q,setQ]=useState(make),[picked,setPicked]=useState(null)
  const next=()=>{setQ(make());setPicked(null)}
  const choose=x=>{setPicked(x);const ok=x===q.answer;if(ok)speak(praise(),voice);else{const guide=q.answer==='='?`Chưa đúng rồi ${CHILD_NAME}. Hai số đều là ${q.a}, nên mình dùng dấu bằng nhé.`:`Chưa đúng rồi ${CHILD_NAME}. Con hãy tìm số lớn hơn trước. Miệng cá sấu quay về phía số lớn hơn. ${q.a} ${q.answer==='>'?'lớn hơn':'bé hơn'} ${q.b}, nên dấu đúng là ${q.answer==='>'?'lớn hơn':'bé hơn'}.`;speak(guide,voice)}}
  const ok=picked===q.answer
  return <section className="l1-game-card"><div className="game-label">🐊 DẤU LỚN · DẤU BÉ · DẤU BẰNG</div><h2>Chọn dấu đúng</h2><p className="game-help">Miệng cá sấu luôn quay về phía số lớn hơn.</p><div className="compare-board"><span>{q.a}</span><b className={picked?ok?'good':'bad':''}>{picked||'?'}</b><span>{q.b}</span></div><div className="sign-buttons">{['<','=','>'].map(x=><button key={x} disabled={picked!==null} onClick={()=>choose(x)}>{x}</button>)}</div>{picked&&<div className={`game-feedback ${ok?'good':'bad'}`}>{ok?'🌟 Chính xác!':`💡 Đáp án đúng là ${q.answer}`}<button onClick={next}>Câu mới →</button></div>}</section>
}

function SortGame({voice}){
  const make=()=>{const values=uniqueNumbers(4);return{values:shuffle(values),direction:Math.random()>.5?'asc':'desc'}}
  const [q,setQ]=useState(make),[chosen,setChosen]=useState([])
  const target=useMemo(()=>[...q.values].sort((a,b)=>q.direction==='asc'?a-b:b-a),[q])
  const complete=chosen.length===q.values.length,ok=complete&&chosen.every((x,i)=>x===target[i])
  const choose=n=>{if(!chosen.includes(n)){const z=[...chosen,n];setChosen(z);if(z.length===q.values.length){const good=z.every((x,i)=>x===target[i]);speak(good?praise():`Gần đúng rồi ${CHILD_NAME}. ${q.direction==='asc'?'Tăng dần nghĩa là đi từ số bé nhất đến số lớn nhất.':'Giảm dần nghĩa là đi từ số lớn nhất đến số bé nhất.'} Con nhìn lại số đầu tiên trước nhé.`,voice)}}
  const reset=()=>setChosen([]),next=()=>{setQ(make());setChosen([])}
  return <section className="l1-game-card"><div className="game-label">{q.direction==='asc'?'📈 TĂNG DẦN':'📉 GIẢM DẦN'}</div><h2>Sắp xếp các số</h2><p className="game-help">{q.direction==='asc'?'Từ bé đến lớn':'Từ lớn đến bé'} · Chạm lần lượt vào các số.</p><div className="sort-slots">{q.values.map((_,i)=><div key={i} className={chosen[i]!==undefined?'filled':''}>{chosen[i]??'_'}</div>)}</div><div className="number-chips">{q.values.map(n=><button key={n} className={chosen.includes(n)?'used':''} onClick={()=>choose(n)}><Grip size={16}/>{n}</button>)}</div><div className="game-actions"><button onClick={reset}><RefreshCcw size={17}/> Làm lại</button>{complete&&<button className="next-game" onClick={ok?next:reset}>{ok?'🌟 Đúng rồi · Câu mới':'Chưa đúng · Thử lại'}</button>}</div></section>
}

function DragGame({voice}){
  const make=()=>{const nums=uniqueNumbers(3,10);return{nums:shuffle(nums),target:[...nums].sort((a,b)=>a-b)}}
  const [q,setQ]=useState(make),[slots,setSlots]=useState([null,null,null]),[selected,setSelected]=useState(null)
  const used=slots.filter(x=>x!==null)
  const place=(i,n=selected)=>{if(n===null||n===undefined)return;setSlots(s=>{const z=[...s];const old=z.indexOf(n);if(old>=0)z[old]=null;z[i]=n;const complete=z.every(x=>x!==null);if(complete){const ok=z.every((x,j)=>x===q.target[j]);setTimeout(()=>speak(ok?praise():`Chưa đúng thứ tự rồi ${CHILD_NAME}. Mình tìm số bé nhất trước và đặt vào ô đầu tiên. Sau đó chọn số lớn hơn tiếp theo nhé.`,voice),50)}return z});setSelected(null)}
  const drag=e=>setSelected(Number(e.currentTarget.dataset.value)),complete=slots.every(x=>x!==null),ok=complete&&slots.every((x,i)=>x===q.target[i])
  const next=()=>{setQ(make());setSlots([null,null,null]);setSelected(null)}
  return <section className="l1-game-card"><div className="game-label">🧩 KÉO THẢ SỐ</div><h2>Kéo số vào đúng vị trí</h2><p className="game-help">Xếp từ bé đến lớn. Trên điện thoại: chạm số rồi chạm vào ô.</p><div className="drag-slots">{slots.map((n,i)=><button key={i} onClick={()=>place(i)} onDragOver={e=>e.preventDefault()} onDrop={()=>place(i)} className={n!==null?'filled':''}>{n??<span>Ô {i+1}</span>}</button>)}</div><div className="drag-bank">{q.nums.map(n=><button draggable data-value={n} onDragStart={drag} key={n} onClick={()=>setSelected(n)} className={`${used.includes(n)?'used':''} ${selected===n?'selected':''}`}>{n}</button>)}</div>{complete&&<div className={`game-feedback ${ok?'good':'bad'}`}>{ok?'🌟 Tuyệt vời! Con đã xếp đúng.':'💪 Chưa đúng thứ tự.'}<button onClick={ok?next:()=>setSlots([null,null,null])}>{ok?'Bài mới →':'Xếp lại'}</button></div>}</section>
}

export default function Level1Games({onBack}){
  const [mode,setMode]=useState('compare'),[voice,setVoice]=useState(true)
  const [stars]=useState(()=>{try{return JSON.parse(localStorage.getItem('math-kid-progress'))?.stars||0}catch{return 0}})
  const welcome=()=>speak(`Xin chào ${CHILD_NAME}. Hôm nay mình cùng luyện Toán nhé!`,voice)
  return <main className="l1-games-shell"><header className="l1-games-top"><button onClick={onBack}><ChevronLeft/></button><div><small>LEVEL 1 · LỚP 1</small><strong>Bài tương tác của {CHILD_NAME}</strong></div><div style={{display:'flex',gap:8,alignItems:'center'}}><button className="voice-toggle" onClick={()=>{const next=!voice;setVoice(next);if(next)setTimeout(()=>speak(`Bật giọng nói rồi nhé ${CHILD_NAME}.`,true),50)}} aria-label="Bật tắt giọng nói">{voice?<Volume2/>:<VolumeX/>}</button><div className="l1-star"><Star size={17} fill="currentColor"/> {stars}</div></div></header><section className="l1-games-hero" onClick={welcome}><div><span>🎮</span><div><small>LUYỆN TOÁN VUI</small><h1>Quỳnh Anh ơi, mình cùng học nhé!</h1><p>Chạm vào đây để nghe lời chào. Khi trả lời sai, cô giáo sẽ đọc gợi ý để con tự tìm lại đáp án.</p></div></div></section><nav className="game-tabs"><button className={mode==='compare'?'active':''} onClick={()=>setMode('compare')}><Sparkles/> Dấu &gt; &lt; =</button><button className={mode==='sort'?'active':''} onClick={()=>setMode('sort')}><ArrowUpAZ/> Sắp xếp</button><button className={mode==='drag'?'active':''} onClick={()=>setMode('drag')}><Grip/> Kéo thả</button></nav><div className="l1-game-wrap">{mode==='compare'?<CompareGame voice={voice}/>:mode==='sort'?<SortGame voice={voice}/>:<DragGame voice={voice}/>}</div></main>
}
