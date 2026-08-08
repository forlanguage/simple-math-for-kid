import {useMemo,useState} from 'react'
import {Minus,Plus,RefreshCcw,Volume2} from 'lucide-react'
import quynhanhPhoto from './quynhanhPhoto'
import {smoothieIngredients,ingredientGroups} from './smoothieIngredients'

const CHILD='Quỳnh Anh'
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a
const shuffle=a=>[...a].sort(()=>Math.random()-.5)
const item=name=>smoothieIngredients.find(x=>x.name===name)

function speak(text,on,rate=.86){
  if(!on||!('speechSynthesis'in window))return
  window.speechSynthesis.cancel()
  const u=new SpeechSynthesisUtterance(text)
  u.lang='vi-VN'
  u.rate=rate
  window.speechSynthesis.speak(u)
}

function blenderSound(on){
  if(!on)return
  const AC=window.AudioContext||window.webkitAudioContext
  if(!AC)return
  const ctx=new AC()
  const master=ctx.createGain()
  master.gain.setValueAtTime(.0001,ctx.currentTime)
  master.gain.exponentialRampToValueAtTime(.22,ctx.currentTime+.08)
  master.gain.setValueAtTime(.22,ctx.currentTime+3.15)
  master.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+3.4)
  master.connect(ctx.destination)

  ;[78,156,234,312].forEach((f,i)=>{
    const o=ctx.createOscillator(),g=ctx.createGain()
    o.type=i===0?'sawtooth':i===1?'square':'triangle'
    o.frequency.setValueAtTime(f,ctx.currentTime)
    o.frequency.linearRampToValueAtTime(f+55,ctx.currentTime+1.1)
    o.frequency.linearRampToValueAtTime(f+20,ctx.currentTime+2.25)
    o.frequency.linearRampToValueAtTime(f,ctx.currentTime+3.4)
    g.gain.value=i===0?.5:i===1?.16:.08
    o.connect(g);g.connect(master);o.start();o.stop(ctx.currentTime+3.42)
  })

  const len=Math.floor(ctx.sampleRate*3.4)
  const buf=ctx.createBuffer(1,len,ctx.sampleRate),data=buf.getChannelData(0)
  for(let i=0;i<len;i++)data[i]=(Math.random()*2-1)*(.16+.08*Math.sin(i/900))
  const noise=ctx.createBufferSource(),ng=ctx.createGain()
  noise.buffer=buf;ng.gain.value=.2;noise.connect(ng);ng.connect(master);noise.start();noise.stop(ctx.currentTime+3.4)
  setTimeout(()=>ctx.close(),3900)
}

function successSound(on){
  if(!on)return
  const AC=window.AudioContext||window.webkitAudioContext
  if(!AC)return
  const c=new AC()
  ;[523,659,784,1046].forEach((f,i)=>{
    const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+i*.11
    o.frequency.value=f;o.type='sine'
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.16,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+.32)
    o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+.35)
  })
  setTimeout(()=>c.close(),900)
}

function makeOrder(){
  const fruits=shuffle(smoothieIngredients.filter(x=>x.group==='fruit'))
  const bases=shuffle(smoothieIngredients.filter(x=>x.group==='base'))
  const extras=shuffle(smoothieIngredients.filter(x=>x.group==='extra'))
  const total=rnd(4,5)
  const fruitCount=total===4?3:rnd(3,4)
  const order=fruits.slice(0,fruitCount).map(x=>({...x,qty:rnd(1,2)}))
  order.push({...bases[0],qty:1})
  if(order.length<total)order.push({...extras[0],qty:extras[0].name==='Đá viên'?rnd(1,2):1})
  return order
}

function Confetti(){
  const pieces=['⭐','✨','💛','💖','🎉','🌟','💫','🧡','💚','💜']
  return <div className="smoothie3-confetti" aria-hidden="true">{Array.from({length:28},(_,i)=><span key={i} style={{'--i':i,'--x':`${(i*37)%100}%`}}>{pieces[i%pieces.length]}</span>)}</div>
}

export default function SmoothieShop({voice=true}){
  const [order,setOrder]=useState(makeOrder)
  const [counts,setCounts]=useState({})
  const [stage,setStage]=useState('pick')
  const [filter,setFilter]=useState('fruit')
  const [served,setServed]=useState(false)
  const [score,setScore]=useState(0)
  const [cups,setCups]=useState(0)

  const required=useMemo(()=>Object.fromEntries(order.map(x=>[x.name,x.qty])),[order])
  const totalRequired=order.reduce((s,x)=>s+x.qty,0)
  const totalChosen=Object.values(counts).reduce((s,x)=>s+x,0)
  const exact=()=>Object.keys(counts).length===order.length&&order.every(x=>(counts[x.name]||0)===x.qty)
  const orderText=order.map(x=>`${x.name} ${x.qty} phần`).join(', ')

  const change=(name,d)=>{
    if(stage!=='pick')return
    setCounts(c=>{
      const next=Math.max(0,Math.min(3,(c[name]||0)+d))
      const z={...c}
      if(next)z[name]=next;else delete z[name]
      return z
    })
  }

  const readOrder=()=>speak(`${CHILD} ơi, khách gọi một ly gồm ${orderText}. Con hãy lấy đúng loại và đúng số lượng nhé.`,voice,.8)

  const blend=()=>{
    if(!exact()){
      speak(`Chưa đúng nguyên liệu rồi ${CHILD}. Con nhìn lại đơn nhé. Khách cần ${orderText}.`,voice,.8)
      return
    }
    setStage('blend')
    speak(`Đúng hết rồi ${CHILD}! Chuẩn bị xay nhé.`,voice)
    setTimeout(()=>blenderSound(voice),450)
    setTimeout(()=>setStage('pour'),3800)
    setTimeout(()=>speak(`Sinh tố mịn rồi! Bây giờ rót ra ly và phục vụ khách nào.`,voice),4000)
  }

  const serve=()=>{
    successSound(voice)
    setStage('serve')
    setServed(true)
    setScore(s=>s+12)
    setCups(c=>c+1)
    setTimeout(()=>speak(`Ôi ngon quá! Cảm ơn ${CHILD}. Ly sinh tố ngon tuyệt vời!`,voice,.84),350)
  }

  const next=()=>{
    setOrder(makeOrder())
    setCounts({})
    setStage('pick')
    setFilter('fruit')
    setServed(false)
  }

  const visible=smoothieIngredients.filter(x=>x.group===filter)

  return <section className="smoothie3-shell">
    <div className="smoothie3-banner">
      <div className="smoothie3-sign">🥤 TIỆM SINH TỐ <strong>QUỲNH ANH</strong></div>
      <div className="smoothie3-stats"><span>⭐ {score}</span><span>🥤 {cups} ly</span></div>
    </div>

    <div className="smoothie3-order-zone">
      <div className="smoothie3-customer">🐼<div className="smoothie3-bubble">Cho mình một ly thật ngon nhé!</div></div>
      <button className="smoothie3-order" onClick={readOrder}>
        <div className="smoothie3-order-head"><span>🧾 ĐƠN HÀNG</span><Volume2 size={20}/></div>
        <div className="smoothie3-order-grid">{order.map(x=>{
          const got=counts[x.name]||0,ok=got===x.qty
          return <div className={'smoothie3-order-item '+(ok?'done':'')} key={x.name}>
            <span>{x.icon}</span><b>{x.name}</b><strong>× {x.qty}</strong><em>{ok?'✅':got?`${got}/${x.qty}`:'Chưa lấy'}</em>
          </div>
        })}</div>
      </button>
      <div className="smoothie3-helper"><img src={quynhanhPhoto} alt="Quỳnh Anh"/><div>“Dạ vâng! Quỳnh Anh làm ngay ạ!”</div></div>
    </div>

    {stage==='pick'&&<div className="smoothie3-pick-zone">
      <div className="smoothie3-step-title"><b>1</b><span>CHỌN NGUYÊN LIỆU</span><small>{totalChosen}/{totalRequired} phần</small></div>
      <nav className="smoothie3-tabs">{ingredientGroups.map(g=><button key={g.id} className={filter===g.id?'active':''} onClick={()=>setFilter(g.id)}>{g.label}</button>)}</nav>
      <div className="smoothie3-shelf">{visible.map(x=>{
        const c=counts[x.name]||0,need=required[x.name]
        return <div className={'smoothie3-ingredient '+(c?'picked':'')+(need?' needed':'')} key={x.name}>
          <span className="smoothie3-ingredient-icon">{x.icon}</span>
          <b>{x.name}</b>
          <div className="smoothie3-counter"><button onClick={()=>change(x.name,-1)} disabled={!c}><Minus/></button><strong>{c}</strong><button onClick={()=>change(x.name,1)}><Plus/></button></div>
          {need&&<small>Cần ×{need}</small>}
        </div>
      })}</div>
      <div className="smoothie3-actions"><button onClick={()=>setCounts({})}><RefreshCcw size={18}/> Làm lại</button><button className="smoothie3-blend-btn" onClick={blend}>⚡ XAY SINH TỐ</button></div>
    </div>}

    {(stage==='blend'||stage==='pour')&&<div className="smoothie3-machine-zone">
      <div className="smoothie3-step-title"><b>2</b><span>XAY SINH TỐ</span><small>{stage==='blend'?'Đang xay...':'Mịn rồi!'}</small></div>
      <div className={'smoothie3-blender '+(stage==='blend'?'is-blending':'is-ready')}>
        <div className="smoothie3-sparkles">✨ 💫 ✨</div>
        <div className="smoothie3-lid"/>
        <div className="smoothie3-jar">
          <div className="smoothie3-liquid"/>
          <div className="smoothie3-vortex">🌀</div>
          <div className="smoothie3-fruit-spin">{order.flatMap(x=>Array.from({length:Math.min(x.qty,2)},(_,i)=><span key={x.name+i}>{x.icon}</span>))}</div>
          {stage==='blend'&&<div className="smoothie3-bubbles">{Array.from({length:14},(_,i)=><i key={i} style={{'--b':i}}/> )}</div>}
        </div>
        <div className="smoothie3-base">{stage==='blend'?'🔊 RRRR... Ù Ù Ù...':'✨ SINH TỐ ĐÃ MỊN'}</div>
      </div>
      {stage==='blend'?<div className="smoothie3-sound-wave"><i/><i/><i/><i/><i/><span>Máy xay đang chạy!</span></div>:<button className="smoothie3-serve-btn" onClick={serve}>🛎️ RÓT LY & PHỤC VỤ KHÁCH</button>}
    </div>}

    {stage==='serve'&&served&&<div className="smoothie3-serve-zone">
      <Confetti/>
      <div className="smoothie3-step-title"><b>3</b><span>PHỤC VỤ KHÁCH</span><small>Hoàn thành!</small></div>
      <div className="smoothie3-serving-scene">
        <div className="smoothie3-quynhanh"><img src={quynhanhPhoto} alt="Quỳnh Anh phục vụ sinh tố"/><div>Quỳnh Anh mang sinh tố ra 🥤</div></div>
        <div className="smoothie3-glass"><span>🍓</span><b>🥤</b><i>✨</i></div>
        <div className="smoothie3-happy-customer"><div className="smoothie3-panda">🐼 😋 💕</div><h3>“Ôi ngon quá!”</h3><p>Cảm ơn Quỳnh Anh! Ly sinh tố tuyệt vời!</p><div className="smoothie3-stars">⭐ ⭐ ⭐</div><button onClick={next}>🥤 Nhận đơn tiếp theo →</button></div>
      </div>
    </div>}
  </section>
}
