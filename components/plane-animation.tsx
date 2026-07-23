'use client'

import { useEffect, useRef, useState } from 'react'

export function PlaneAnimation() {
  const [phase, setPhase] = useState<'takeoff' | 'flying' | 'landing'>('takeoff')
  const planeRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cycle = () => {
      // Phase 1: Takeoff (0-4s)
      setPhase('takeoff')
      
      // Phase 2: Flying (4-8s)
      setTimeout(() => setPhase('flying'), 4000)
      
      // Phase 3: Landing (8-12s)
      setTimeout(() => setPhase('landing'), 8000)
      
      // Repeat
      setTimeout(cycle, 12000)
    }
    
    cycle()
  }, [])

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 5 }}
    >
      {/* Moving Clouds */}
      <div className="clouds-container">
        <div className="cloud cloud-1">☁️</div>
        <div className="cloud cloud-2">☁️</div>
        <div className="cloud cloud-3">☁️</div>
        <div className="cloud cloud-4">☁️</div>
      </div>

      {/* Airplane */}
      <div 
        ref={planeRef}
        className={`airplane ${phase}`}
      >
        <svg 
          viewBox="0 0 200 200" 
          className="plane-svg"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Body */}
          <ellipse cx="100" cy="100" rx="80" ry="20" fill="#f0f0f0" stroke="#ccc" strokeWidth="1"/>
          
          {/* Cockpit */}
          <ellipse cx="160" cy="95" rx="15" ry="12" fill="#87CEEB" stroke="#666" strokeWidth="1"/>
          
          {/* Left Wing */}
          <path d="M80 85 L40 50 L60 50 L90 80 Z" fill="#e0e0e0" stroke="#bbb" strokeWidth="1"/>
          
          {/* Right Wing */}
          <path d="M80 115 L40 150 L60 150 L90 120 Z" fill="#e0e0e0" stroke="#bbb" strokeWidth="1"/>
          
          {/* Tail */}
          <path d="M30 95 L10 70 L25 70 L35 90 Z" fill="#d0d0d0" stroke="#aaa" strokeWidth="1"/>
          
          {/* Engine Left */}
          <rect x="70" y="60" width="25" height="15" rx="5" fill="#ccc" stroke="#999"/>
          
          {/* Engine Right */}
          <rect x="70" y="125" width="25" height="15" rx="5" fill="#ccc" stroke="#999"/>
          
          {/* Windows */}
          <circle cx="120" cy="95" r="3" fill="#333"/>
          <circle cx="135" cy="95" r="3" fill="#333"/>
          <circle cx="150" cy="95" r="3" fill="#333"/>
          
          {/* Landing Gear - Front */}
          <line x1="160" y1="115" x2="160" y2="130" stroke="#666" strokeWidth="2" className={`gear ${phase === 'flying' ? 'retracted' : ''}`}/>
          <circle cx="160" cy="132" r="4" fill="#333" className={`gear ${phase === 'flying' ? 'retracted' : ''}`}/>
          
          {/* Landing Gear - Back */}
          <line x1="50" y1="115" x2="50" y2="135" stroke="#666" strokeWidth="2" className={`gear ${phase === 'flying' ? 'retracted' : ''}`}/>
          <circle cx="50" cy="137" r="5" fill="#333" className={`gear ${phase === 'flying' ? 'retracted' : ''}`}/>
        </svg>
      </div>

      {/* Runway */}
      <div className="runway">
        <div className="runway-line"></div>
        <div className="runway-line"></div>
        <div className="runway-line"></div>
      </div>
    </div>
  )
}