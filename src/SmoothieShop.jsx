import {useMemo,useState} from 'react'
import {Minus,Plus,RefreshCcw,Volume2} from 'lucide-react'
import {QUYNH_ANH_PHOTO} from './quynhAnhPhoto'
import {smoothieIngredients,ingredientGroups} from './smoothieIngredients'

const CHILD='Quỳnh Anh'
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a
const shuffle=a=>[...a].sort(()=>Math.random()-.5)

function speak(text,on,rate=.84){
  if(!on||!('speechSynthesis'in window))return
  window.speechSynthesis.cancel()
  const u=new SpeechSynthesisUtterance(text)
  u.lang='vi-VN';u.rate=rate
  window.speechSynthesis.speak(u)
}

function blenderSound(on){
  if(!on)return
  const AC=window.AudioContext||window.webkitAudioContext
  if(!AC)return
  const ctx=new AC(),master=ctx.createGain()
  master.gain.setValueAtTime(.0001,ctx.currentTime)
  master.gain.exponentialRampToValueAtTime(.2,ctx.currentTime+.06)
  master.gain.setValueAtTime(.2,ctx.currentTime+3.0)
  master.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+3.35)
  master.connect(ctx.destination)
  ;[82,164,246].forEach((f,i)=>{
    const o=ctx.createOscillator(),g=ctx.createGain()
    o.type=i===0?'sawtooth':i===1?'square':'triangle'
    o.frequency.setValueAtTime(f,ctx.currentTime)
    o.frequency.linearRampToValueAtTime(f+60,ctx.currentTime+1.2)
    o.frequency.linearRampToValueAtTime(f+20,ctx.currentTime+2.3)
    o.frequency.linearRampToValueAtTime(f,ctx.currentTime+3.35)
    g.gain.value=i===0?.48:i===1?.12:.07
    o.connect(g);g.connect(master);o.start();o.stop(ctx.currentTime+3.4)
  })
  const len=Math.floor(ctx.sampleRate*3.35),buf=ctx.createBuffer(1,len,ctx.sampleRate),data=buf.getChannelData(0)
  for(let i=0;i<len;i++)data[i]=(Math.random()*2-1)*(.14+.06*Math.sin(i/700))
  const noise=ctx.createBufferSource(),ng=ctx.createGain();noise.buffer=buf;ng.gain.value=.18;noise.connect(ng);ng.connect(master);noise.start();noise.stop(ctx.currentTime+3.35)
  setTimeout(()=>ctx.close(),3800)
}

function successSound(on){
  if(!on)return
  const AC=window.AudioContext||window.webkitAudioContext
  if(!AC)return
  const c=new AC()
  ;[523,659,784,1046].forEach((f,i)=>{
    const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+i*.1
    o.frequency.value=f;o.type='sine'
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.15,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+.3)
    o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+.32)
  })
  setTimeout(()=>c.close(),800)
}

function makeOrder(){
  const fruits=shuffle(smoothieIngredients.filter(x=>x.group.startsWith('fruit')))
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
  const p=['⭐','✨','💛','💖','🎉','🌟','💫','🧡']
  return <div className="smoothie3-confetti" aria-hidden="true">{Array.from({length:24},(_,i)=><span key={i} style={{'--i':i,'--x':`${(i*41)%100}%`}}>{p[i%p.length]}</span>)}</div>
}

function StepBar({stage}){
  const idx=stage==='pick'?0:stage==='blend'?1:2
  return <div className="smoothie3-stepbar">{['1. Chuẩn bị','2. Xay','3. Phục vụ'].map((x,i)=><div key={x} className={(i===idx?'active ':'')+(i<idx?'done':'')}><b>{i<idx?'✓':i+1}</b><span>{x.replace(/^\d\. /,'')}</span></div>)}</div>
}

export default function SmoothieShop({voice=true}){
  const [order,setOrder]=useState(makeOrder)
  const [counts,setCounts]=useState({})
  const [stage,setStage]=useState('pick')
  const [filter,setFilter]=useState('fruit1')
  const [served,setServed]=useState(false)
  const [score,setScore]=useState(0)
  const [cups,setCups]=useState(0)

  const required=useMemo(()=>Object.fromEntries(order.map(x=>[x.name,x.qty])),[order])
  const totalRequired=order.reduce((s,x)=>s+x.qty,0)
  const totalChosen=Object.values(counts).reduce((s,x)=>s+x,0)
  const exact=()=>Object.keys(counts).length===order.length&&order.every(x=>(counts[x.name]||0)===x.qty)
  const orderText=order.map(x=>`${x.name} ${x.qty} phần`).join(', ')
  const visible=smoothieIngredients.filter(x=>x.group===filter)

  const change=(name,d)=>{
    if(stage!=='pick')return
    setCounts(c=>{const next=Math.max(0,Math.min(3,(c[name]||0)+d)),z={...c};if(next)z[name]=next;else delete z[name];return z})
  }
  const readOrder=()=>speak(`${CHILD} ơi, khách cần ${orderText}. Con chọn đúng loại và đúng số lượng nhé.`,voice,.78)
  const blend=()=>{
    if(!exact()){speak(`Chưa đúng rồi ${CHILD}. Con xem lại đơn nhé. Khách cần ${orderText}.`,voice,.78);return}
    setStage('blend');speak(`Đúng hết rồi ${CHILD}! Bắt đầu xay sinh tố nhé.`,voice)
    setTimeout(()=>blenderSound(voice),300)
    setTimeout(()=>{setStage('serve');speak(`Sinh tố xay xong rồi. Quỳnh Anh mang ra phục vụ khách nhé!`,voice)},3600)
  }
  const serve=()=>{
    successSound(voice);setServed(true);setScore(s=>s+12);setCups(c=>c+1)
    setTimeout(()=>speak(`Ôi ngon quá! Cảm ơn ${CHILD}. Ly sinh tố ngon tuyệt vời!`,voice,.82),280)
  }
  const next=()=>{setOrder(makeOrder());setCounts({});setStage('pick');setFilter('fruit1');setServed(false)}

  return <section className={`smoothie3-shell smoothie3-app smoothie-cafe-theme stage-${stage}`}>
    <header className="smoothie-cafe-hero">
      <div className="smoothie-cafe-mascot">
        <div className="smoothie-cafe-talk">Cho mình một ly sinh tố thật ngon nhé!</div>
        <div className="smoothie-cafe-panda">🐼</div>
        <button onClick={readOrder}><Volume2 size={18}/> Nghe lại đơn</button>
      </div>
      <div className="smoothie-cafe-center">
        <div className="smoothie-cafe-sign"><small>TIỆM SINH TỐ</small><strong>QUỲNH ANH</strong><span>🥤</span></div>
        <div className="smoothie-cafe-ribbon">Cùng Quỳnh Anh làm sinh tố nhé!</div>
      </div>
      <div className="smoothie-cafe-hero-photo">
        <div className="smoothie-cafe-talk right">Dạ vâng! Quỳnh Anh sẽ làm ngay ạ!</div>
        <img src={QUYNH_ANH_PHOTO} alt="Quỳnh Anh"/>
      </div>
      <div className="smoothie-cafe-stats"><span>⭐ {score}</span><span>🥤 {cups} ly</span></div>
    </header>

    <StepBar stage={stage}/>

    <section className="smoothie3-order-compact smoothie-cafe-order">
      <div className="smoothie-cafe-order-title">ĐƠN HÀNG</div>
      <div className="smoothie3-order-grid compact">{order.map(x=>{
        const got=counts[x.name]||0,ok=got===x.qty
        return <div className={'smoothie3-order-item '+(ok?'done':'')} key={x.name}><span>{x.icon}</span><b>{x.name}</b><strong>×{x.qty}</strong><em>{ok?'✅':got?`${got}/${x.qty}`:'—'}</em></div>
      })}</div>
    </section>

    {stage==='pick'&&<section className="smoothie3-view smoothie3-prep-view smoothie-cafe-stage">
      <div className="smoothie-cafe-stage-label">1. CHỌN NGUYÊN LIỆU</div>
      <nav className="smoothie3-tabs five-tabs">{ingredientGroups.map(g=><button key={g.id} className={filter===g.id?'active':''} onClick={()=>setFilter(g.id)}>{g.label}</button>)}</nav>
      <div className="smoothie3-prep-body">
        <div className="smoothie3-shelf no-scroll">{visible.map(x=>{
          const c=counts[x.name]||0,need=required[x.name]
          return <div className={'smoothie3-ingredient '+(c?'picked ':'')+(need?'needed':'')} key={x.name}>
            <span className="smoothie3-ingredient-icon">{x.icon}</span><b>{x.name}</b>
            <div className="smoothie3-counter"><button onClick={()=>change(x.name,-1)} disabled={!c}><Minus/></button><strong>{c}</strong><button onClick={()=>change(x.name,1)}><Plus/></button></div>
            {need&&<small>Cần ×{need}</small>}
          </div>
        })}</div>
        <aside className="smoothie3-prep-side smoothie-cafe-prep-side">
          <h3>Quỳnh Anh đã chọn</h3><p><b>{totalChosen}/{totalRequired}</b> phần</p>
          <div className="smoothie-cafe-mini-jar">🥭🍓🍌<span>🥤</span></div>
          <button onClick={()=>setCounts({})}><RefreshCcw size={17}/> Xóa chọn</button>
          <button className="smoothie3-blend-btn" onClick={blend}>⚡ XAY SINH TỐ</button>
        </aside>
      </div>
    </section>}

    {stage==='blend'&&<section className="smoothie3-view smoothie3-blend-view smoothie-cafe-stage smoothie-cafe-blend-stage">
      <div className="smoothie-cafe-stage-label">2. XAY SINH TỐ</div>
      <div className="smoothie3-blend-copy"><div className="smoothie-cafe-speech">Nguyên liệu đúng rồi!<br/>Bắt đầu xay sinh tố nào...<strong>Ù ù ù ù...!!!</strong></div><div className="smoothie3-sound-wave"><i/><i/><i/><i/><i/><span>Rrrrr...</span></div></div>
      <div className="smoothie3-blender is-blending">
        <div className="smoothie3-sparkles">✨ 💫 ✨</div><div className="smoothie3-lid"/>
        <div className="smoothie3-jar"><div className="smoothie3-liquid"/><div className="smoothie3-vortex">🌀</div><div className="smoothie3-fruit-spin">{order.flatMap(x=>Array.from({length:Math.min(x.qty,2)},(_,i)=><span key={x.name+i}>{x.icon}</span>))}</div><div className="smoothie3-bubbles">{Array.from({length:14},(_,i)=><i key={i} style={{'--b':i}}/> )}</div></div>
        <div className="smoothie3-base">😊 🔊 ĐANG XAY...</div>
      </div>
      <div className="smoothie3-timer">⏱️ Đang xay...<strong>3.4s</strong><div className="smoothie3-progress"><i/></div><div className="smoothie-cafe-notes">🎵 ✨ 🎶</div></div>
    </section>}

    {stage==='serve'&&<section className="smoothie3-view smoothie3-serve-view smoothie-cafe-stage smoothie-cafe-serve-stage">
      <div className="smoothie-cafe-stage-label">3. PHỤC VỤ KHÁCH</div>
      {served&&<Confetti/>}
      <div className="smoothie3-quynhanh sharp smoothie-cafe-serving-photo"><img src={QUYNH_ANH_PHOTO} alt="Quỳnh Anh phục vụ sinh tố"/><div>Đây ạ! Sinh tố của bạn nè! 💕</div></div>
      <div className="smoothie3-serve-center"><div className="smoothie3-glass"><span>🍓</span><b>🥤</b><i>✨</i></div>{!served?<button className="smoothie3-serve-btn" onClick={serve}>🛎️ PHỤC VỤ KHÁCH</button>:<div className="smoothie3-stars">⭐ ⭐ ⭐</div>}</div>
      <div className="smoothie3-happy-customer smoothie-cafe-customer-card">{served?<><div className="smoothie3-panda">🐼 😋 💕</div><div className="smoothie-cafe-customer-speech">Ôi ngon quá!<br/>Cảm ơn Quỳnh Anh!<br/>Ly sinh tố tuyệt vời!</div><button onClick={next}>🥤 Nhận đơn tiếp theo →</button></>:<><div className="smoothie3-panda">🐼</div><h3>Khách đang chờ!</h3><p>Quỳnh Anh mang ly sinh tố ra nhé!</p></>}</div>
    </section>}
  </section>
}
