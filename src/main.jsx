import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Level1Games from './Level1Games.jsx'
import './styles.css'
import './learning.css'
import './interactive.css'
import './level1-games.css'

function Root(){
  const [games,setGames]=useState(false)
  if(games) return <Level1Games onBack={()=>setGames(false)}/>
  return <div className="interactive-root"><App/><button className="interactive-launch" onClick={()=>setGames(true)}>🎮 Bài tương tác Lớp 1</button></div>
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
