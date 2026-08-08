import {useState} from 'react'
import {ChevronLeft,Volume2,VolumeX} from 'lucide-react'
import SmoothieShop from './SmoothieShop'

const CHILD='Quỳnh Anh'
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a
const shuffle=a=>[...a].sort(()=>Math.random()-.5)

function speak(t,on){
  if(!on||!('speechSynthesis'in window))return
  window.speechSynthesis.cancel()
  const u=new SpeechSynthesisUtterance(t)
  u.lang='vi-VN'
  u.rate=.86
  window.speechSynthesis.speak(u)
}

const players=[
  {name:'Lionel Messi',country:'Argentina',flag:'🇦🇷',shirt:10},
  {name:'Cristiano Ronaldo',country:'Bồ Đào Nha',flag:'🇵🇹',shirt:7},
  {name:'Kylian Mbappé',country:'Pháp',flag:'🇫🇷',shirt:10},
  {name:'Neymar Jr.',country:'Brazil',flag:'🇧🇷',shirt:10},
  {name:'Son Heung-min',country:'Hàn Quốc',flag:'🇰🇷',shirt:7}
]

const mixes=[
  {result:'Hồng',emoji:'🩷',a:'Trắng',b:'Đỏ'},
  {result:'Cam',emoji:'🟠',a:'Đỏ',b:'Vàng'},
  {result:'Xanh lá',emoji:'🟢',a:'Xanh dương',b:'Vàng'},
  {result:'Tím',emoji:'🟣',a:'Đỏ',b:'Xanh dương'},
  {result:'Xám',emoji:'🩶',a:'Trắng',b:'Đen'}
]

function Feedback({ok,next}){
  return <div className={'fun-feedback '+(ok?'ok':'no')}>
    <b>{ok?'🌟 Chính xác!':'💡 Chưa đúng, nghe gợi ý nhé!'}</b>
    <button onClick={next}>Câu tiếp →</button>
  </div>
}

function Country({voice}){
  const make=()=>players[rnd(0,players.length-1)]
  const [q,setQ]=useState(make)
  const [pick,setPick]=useState(null)
  const flags=shuffle(players.map(x=>({flag:x.flag,country:x.country}))).slice(0,4)
  if(!flags.some(x=>x.country===q.country))flags[rnd(0,3)]={flag:q.flag,country:q.country}
  const choose=x=>{
    if(pick)return
    setPick(x)
    speak(x===q.country?`Giỏi lắm ${CHILD}. ${q.name} đến từ ${q.country}.`:`${CHILD} ơi, ${q.name} đến từ ${q.country}. Con hãy tìm lá cờ ${q.country} nhé.`,voice)
  }
  return <Card tag="⚽ CẦU THỦ & QUỐC GIA" title="Cầu thủ đến từ đâu?" sub={`Hãy chọn lá cờ đúng cho ${q.name}.`}>
    <div className="player-card"><div className="player-avatar">⚽</div><strong>{q.name}</strong><button onClick={()=>speak(`${q.name} đến từ nước nào? Hãy chọn lá cờ đúng.`,voice)}><Volume2/> Nghe câu hỏi</button></div>
    <div className="flag-grid">{flags.map(x=><button key={x.country} onClick={()=>choose(x.country)}><span>{x.flag}</span><small>{x.country}</small></button>)}</div>
    {pick&&<Feedback ok={pick===q.country} next={()=>{setQ(make());setPick(null)}}/>}
  </Card>
}

function Shirt({voice}){
  const make=()=>players[rnd(0,players.length-1)]
  const [q,setQ]=useState(make)
  const [pick,setPick]=useState(null)
  const choices=shuffle([...new Set([q.shirt,7,9,10,11])]).slice(0,4)
  if(!choices.includes(q.shirt))choices[0]=q.shirt
  const choose=n=>{
    if(pick!==null)return
    setPick(n)
    speak(n===q.shirt?`Đúng rồi ${CHILD}. ${q.name} nổi tiếng với áo số ${q.shirt}.`:`Chưa đúng rồi. ${q.name} nổi tiếng với áo số ${q.shirt}. Con nhớ con số này nhé.`,voice)
  }
  return <Card tag="👕 ÁO SỐ BÍ MẬT" title="Cầu thủ mặc áo số mấy?" sub="Chọn số áo nổi tiếng của cầu thủ.">
    <div className="jersey-scene"><div className="jersey">👕<b>?</b></div><h3>{q.name}</h3><span>{q.flag} {q.country}</span></div>
    <div className="shirt-grid">{choices.map(n=><button key={n} onClick={()=>choose(n)}>{n}</button>)}</div>
    {pick!==null&&<Feedback ok={pick===q.shirt} next={()=>{setQ(make());setPick(null)}}/>}
  </Card>
}

function ColorMix({voice}){
  const make=()=>mixes[rnd(0,mixes.length-1)]
  const [q,setQ]=useState(make)
  const [chosen,setChosen]=useState([])
  const palette=[['Trắng','⚪'],['Đỏ','🔴'],['Vàng','🟡'],['Xanh dương','🔵'],['Đen','⚫']]
  const choose=n=>{
    if(chosen.includes(n)||chosen.length===2)return
    const z=[...chosen,n]
    setChosen(z)
    if(z.length===2){
      const ok=z.includes(q.a)&&z.includes(q.b)
      speak(ok?`Tuyệt vời ${CHILD}. ${q.a} pha với ${q.b} tạo thành màu ${q.result}.`:`${CHILD} thử lại nhé. Muốn tạo màu ${q.result}, mình cần màu ${q.a} và màu ${q.b}.`,voice)
    }
  }
  const done=chosen.length===2
  const ok=done&&chosen.includes(q.a)&&chosen.includes(q.b)
  return <Card tag="🎨 PHÒNG PHA MÀU" title={`Pha màu ${q.result} ${q.emoji}`} sub="Chọn 2 màu để tạo ra màu được yêu cầu.">
    <div className="mix-bowl"><span>{chosen[0]?palette.find(x=>x[0]===chosen[0])?.[1]:'❔'}</span><b>+</b><span>{chosen[1]?palette.find(x=>x[0]===chosen[1])?.[1]:'❔'}</span><b>=</b><span className={ok?'reveal':''}>{done&&ok?q.emoji:'🎨'}</span></div>
    <div className="palette-grid">{palette.map(([n,e])=><button key={n} className={chosen.includes(n)?'chosen':''} onClick={()=>choose(n)}><span>{e}</span><small>{n}</small></button>)}</div>
    {done&&<Feedback ok={ok} next={()=>{setQ(make());setChosen([])}}/>}
  </Card>
}

function Card({tag,title,sub,children}){
  return <section className="fun-card"><div className="fun-tag">{tag}</div><h2>{title}</h2><p>{sub}</p>{children}</section>
}

export default function FunGames({onBack}){
  const [mode,setMode]=useState('country')
  const [voice,setVoice]=useState(true)
  return <main className={'fun-shell '+(mode==='smoothie'?'smoothie-mode':'')}>
    <header className="fun-top"><button onClick={onBack}><ChevronLeft/></button><div><small>LEVEL 1 · VUI HỌC</small><strong>Khám phá cùng {CHILD}</strong></div><button onClick={()=>setVoice(!voice)}>{voice?<Volume2/>:<VolumeX/>}</button></header>
    <section className="fun-hero"><span>⚽ 🎨 🥤</span><div><h1>Chơi mà học!</h1><p>Bóng đá, màu sắc và Tiệm sinh tố với 25 loại trái cây.</p></div></section>
    <nav className="fun-tabs fun-tabs-4"><button className={mode==='country'?'active':''} onClick={()=>setMode('country')}>🌍 Cầu thủ & cờ</button><button className={mode==='shirt'?'active':''} onClick={()=>setMode('shirt')}>👕 Số áo</button><button className={mode==='color'?'active':''} onClick={()=>setMode('color')}>🎨 Pha màu</button><button className={mode==='smoothie'?'active':''} onClick={()=>setMode('smoothie')}>🥤 Tiệm sinh tố</button></nav>
    {mode==='country'?<Country voice={voice}/>:mode==='shirt'?<Shirt voice={voice}/>:mode==='color'?<ColorMix voice={voice}/>:<SmoothieShop voice={voice}/>} 
  </main>
}
