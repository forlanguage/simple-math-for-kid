import { useMemo, useState } from 'react'
import { ArrowDownAZ, ArrowUpAZ, ChevronLeft, Grip, RefreshCcw, Sparkles, Star } from 'lucide-react'

const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a
const shuffle=a=>[...a].sort(()=>Math.random()-.5)

function uniqueNumbers(count=4,max=20){const s=new Set();while(s.size<count)s.add(rnd(0,max));return [...s]}

function CompareGame(){
  const make=()=>{const a=rnd(0,20),equal=Math.random()<.2,b=equal?a:rnd(0,20);return{a,b,answer:a===b?'=':a>b?'>':'<'}}
  const [q,setQ]=useState(make)
  const [picked,setPicked]=useState(null)
  const next=()=>{setQ(make());setPicked(null)}
  const ok=picked===q.answer
  return <section className="l1-game-card">
    <div className="game-label">🐊 DẤU LỚN · DẤU BÉ · DẤU BẰNG</div>
    <h2>Chọn dấu đúng</h2>
    <p className="game-help">Miệng cá sấu luôn quay về phía số lớn hơn.</p>
    <div className="compare-board"><span>{q.a}</span><b className={picked?ok?'good':'bad':''}>{picked||'?'}</b><span>{q.b}</span></div>
    <div className="sign-buttons">{['<','=','>'].map(x=><button key={x} disabled={picked!==null} onClick={()=>setPicked(x)}>{x}</button>)}</div>
    {picked&&<div className={`game-feedback ${ok?'good':'bad'}`}>{ok?'🌟 Chính xác!':`💡 Đáp án đúng là ${q.answer}`}<button onClick={next}>Câu mới →</button></div>}
  </section>
}

function SortGame(){
  const make=()=>{const values=uniqueNumbers(4);return{values:shuffle(values),direction:Math.random()>.5?'asc':'desc'}}
  const [q,setQ]=useState(make)
  const [chosen,setChosen]=useState([])
  const target=useMemo(()=>[...q.values].sort((a,b)=>q.direction==='asc'?a-b:b-a),[q])
  const complete=chosen.length===q.values.length
  const ok=complete&&chosen.every((x,i)=>x===target[i])
  const choose=n=>{if(!chosen.includes(n))setChosen(v=>[...v,n])}
  const reset=()=>setChosen([])
  const next=()=>{setQ(make());setChosen([])}
  return <section className="l1-game-card">
    <div className="game-label">{q.direction==='asc'?'📈 TĂNG DẦN':'📉 GIẢM DẦN'}</div>
    <h2>Sắp xếp các số</h2>
    <p className="game-help">{q.direction==='asc'?'Từ bé đến lớn':'Từ lớn đến bé'} · Chạm lần lượt vào các số.</p>
    <div className="sort-slots">{q.values.map((_,i)=><div key={i} className={chosen[i]!==undefined?'filled':''}>{chosen[i]??'_'}</div>)}</div>
    <div className="number-chips">{q.values.map(n=><button key={n} className={chosen.includes(n)?'used':''} onClick={()=>choose(n)}><Grip size={16}/>{n}</button>)}</div>
    <div className="game-actions"><button onClick={reset}><RefreshCcw size={17}/> Làm lại</button>{complete&&<button className="next-game" onClick={ok?next:reset}>{ok?'🌟 Đúng rồi · Câu mới':'Chưa đúng · Thử lại'}</button>}</div>
  </section>
}

function DragGame(){
  const make=()=>{const nums=uniqueNumbers(3,10);return{nums:shuffle(nums),target:[...nums].sort((a,b)=>a-b)}}
  const [q,setQ]=useState(make)
  const [slots,setSlots]=useState([null,null,null])
  const [selected,setSelected]=useState(null)
  const used=slots.filter(x=>x!==null)
  const place=(i,n=selected)=>{if(n===null||n===undefined)return;setSlots(s=>{const z=[...s];const old=z.indexOf(n);if(old>=0)z[old]=null;z[i]=n;return z});setSelected(null)}
  const drag=e=>setSelected(Number(e.currentTarget.dataset.value))
  const complete=slots.every(x=>x!==null)
  const ok=complete&&slots.every((x,i)=>x===q.target[i])
  const next=()=>{setQ(make());setSlots([null,null,null]);setSelected(null)}
  return <section className="l1-game-card">
    <div className="game-label">🧩 KÉO THẢ SỐ</div>
    <h2>Kéo số vào đúng vị trí</h2>
    <p className="game-help">Xếp từ bé đến lớn. Trên điện thoại: chạm số rồi chạm vào ô.</p>
    <div className="drag-slots">{slots.map((n,i)=><button key={i} onClick={()=>place(i)} onDragOver={e=>e.preventDefault()} onDrop={()=>place(i)} className={n!==null?'filled':''}>{n??<span>Ô {i+1}</span>}</button>)}</div>
    <div className="drag-bank">{q.nums.map(n=><button draggable data-value={n} onDragStart={drag} key={n} onClick={()=>setSelected(n)} className={`${used.includes(n)?'used':''} ${selected===n?'selected':''}`}>{n}</button>)}</div>
    {complete&&<div className={`game-feedback ${ok?'good':'bad'}`}>{ok?'🌟 Tuyệt vời! Con đã xếp đúng.':'💪 Chưa đúng thứ tự.'}<button onClick={ok?next:()=>setSlots([null,null,null])}>{ok?'Bài mới →':'Xếp lại'}</button></div>}
  </section>
}

export default function Level1Games({onBack}){
  const [mode,setMode]=useState('compare')
  const [stars]=useState(()=>{try{return JSON.parse(localStorage.getItem('math-kid-progress'))?.stars||0}catch{return 0}})
  return <main className="l1-games-shell">
    <header className="l1-games-top"><button onClick={onBack}><ChevronLeft/></button><div><small>LEVEL 1 · LỚP 1</small><strong>Bài tương tác</strong></div><div className="l1-star"><Star size={17} fill="currentColor"/> {stars}</div></header>
    <section className="l1-games-hero"><div><span>🎮</span><div><small>LUYỆN TOÁN VUI</small><h1>Chạm, kéo và sắp xếp!</h1><p>Ba dạng bài giúp bé luyện số đến 20 bằng thao tác trực quan.</p></div></div></section>
    <nav className="game-tabs">
      <button className={mode==='compare'?'active':''} onClick={()=>setMode('compare')}><Sparkles/> Dấu &gt; &lt; =</button>
      <button className={mode==='sort'?'active':''} onClick={()=>setMode('sort')}><ArrowUpAZ/> Sắp xếp</button>
      <button className={mode==='drag'?'active':''} onClick={()=>setMode('drag')}><Grip/> Kéo thả</button>
    </nav>
    <div className="l1-game-wrap">{mode==='compare'?<CompareGame/>:mode==='sort'?<SortGame/>:<DragGame/>}</div>
  </main>
}
