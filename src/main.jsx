import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Level1Games from './Level1Games.jsx'
import FunGames from './FunGames.jsx'
import './styles.css'
import './learning.css'
import './interactive.css'
import './level1-games.css'
import './fun-games.css'
import './smoothie-v2.css'
import './smoothie-ipad.css'

function Root(){
  const [screen,setScreen]=useState('app')
  if(screen==='games') return <Level1Games onBack={()=>setScreen('app')}/>
  if(screen==='fun') return <FunGames onBack={()=>setScreen('app')}/>
  return <div className="interactive-root"><App/><button className="interactive-launch" onClick={()=>setScreen('games')}>🎮 Math Playground</button><button className="interactive-launch" style={{bottom:76,background:'#ee6f91'}} onClick={()=>setScreen('fun')}>⚽🎨 Vui học</button></div>
}
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><Root/></React.StrictMode>)
