"use client"

import type React from "react"

function Cloud({
  className,
  style,
  opacity = 1,
  scale = 1,
}: {
  className?: string
  style?: React.CSSProperties
  opacity?: number
  scale?: number
}) {
  return (
    <div
      className={`absolute pointer-events-none ${className ?? ""}`}
      style={{ opacity, transform: `scale(${scale})`, ...style }}
    >
      <div className="relative">
        <div className="absolute bottom-0 left-0 w-48 h-14 bg-white rounded-full" />
        <div className="absolute bottom-8 left-6 w-20 h-20 bg-white rounded-full" />
        <div className="absolute bottom-10 left-16 w-28 h-28 bg-white rounded-full" />
        <div className="absolute bottom-7 left-28 w-22 h-18 bg-white rounded-full" />
        <div className="absolute bottom-16 left-24 w-16 h-16 bg-white rounded-full" />
      </div>
    </div>
  )
}

function SmallCloud({
  className,
  style,
  opacity = 1,
}: {
  className?: string
  style?: React.CSSProperties
  opacity?: number
}) {
  return (
    <div className={`absolute pointer-events-none ${className ?? ""}`} style={{ opacity, ...style }}>
      <div className="relative">
        <div className="absolute bottom-0 left-0 w-28 h-8 bg-white rounded-full" />
        <div className="absolute bottom-4 left-4 w-14 h-14 bg-white rounded-full" />
        <div className="absolute bottom-5 left-12 w-18 h-16 bg-white rounded-full" />
        <div className="absolute bottom-3 left-20 w-12 h-10 bg-white rounded-full" />
      </div>
    </div>
  )
}

const RAYS = [
  { left: "30%", rotate: "-18deg", delay: "0s",   width: "180px" },
  { left: "42%", rotate: "-8deg",  delay: "1.5s", width: "220px" },
  { left: "50%", rotate: "0deg",   delay: "0.5s", width: "260px" },
  { left: "58%", rotate: "8deg",   delay: "2s",   width: "200px" },
  { left: "68%", rotate: "16deg",  delay: "1s",   width: "160px" },
]

const STARS = [
  { top: "8%",  left: "15%", size: 3, delay: "0s"   },
  { top: "12%", left: "72%", size: 4, delay: "0.8s" },
  { top: "6%",  left: "48%", size: 2, delay: "1.6s" },
  { top: "18%", left: "88%", size: 3, delay: "0.4s" },
  { top: "4%",  left: "32%", size: 2, delay: "2.1s" },
  { top: "22%", left: "6%",  size: 3, delay: "1.2s" },
  { top: "9%",  left: "93%", size: 2, delay: "0.6s" },
]

export function CelestialBackground() {
  return (
    <>
      {/* Gradiente celestial */}
      <div className="fixed inset-0 bg-gradient-to-b from-sky-600 via-sky-300 via-60% to-amber-50" />

      {/* Raios de luz */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {RAYS.map((ray, i) => (
          <div
            key={i}
            className="ray-animate absolute top-0 origin-top"
            style={{
              left: ray.left,
              width: ray.width,
              height: "70vh",
              transform: `rotate(${ray.rotate})`,
              background: "linear-gradient(to bottom, rgba(255,255,200,0.6) 0%, transparent 100%)",
              animationDelay: ray.delay,
            }}
          />
        ))}
      </div>

      {/* Estrelas */}
      <div className="fixed inset-0 pointer-events-none">
        {STARS.map((star, i) => (
          <div
            key={i}
            className="star-twinkle absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Nuvens traseiras */}
      <div className="fixed inset-0 pointer-events-none">
        <SmallCloud className="cloud-drift-slow"  opacity={0.45} style={{ top: "8%",  left: "-5%" }} />
        <SmallCloud className="cloud-drift-right" opacity={0.35} style={{ top: "15%", left: "60%",  animationDelay: "4s" }} />
        <SmallCloud className="cloud-drift-slow"  opacity={0.30} style={{ top: "28%", left: "80%",  animationDelay: "8s" }} />
        <SmallCloud className="cloud-drift-left"  opacity={0.40} style={{ top: "40%", left: "20%",  animationDelay: "2s" }} />
        <SmallCloud className="cloud-drift-slow"  opacity={0.25} style={{ top: "55%", left: "-8%",  animationDelay: "6s" }} />
        <SmallCloud className="cloud-drift-right" opacity={0.35} style={{ top: "65%", left: "70%",  animationDelay: "10s" }} />
      </div>

      {/* Nuvens frontais */}
      <div className="fixed inset-0 pointer-events-none">
        <Cloud className="cloud-drift-left"  opacity={0.75} scale={1.0} style={{ top: "4%",  left: "-8%" }} />
        <Cloud className="cloud-drift-right" opacity={0.65} scale={0.8} style={{ top: "10%", left: "55%",  animationDelay: "3s" }} />
        <Cloud className="cloud-drift-slow"  opacity={0.80} scale={1.2} style={{ top: "18%", left: "25%",  animationDelay: "7s" }} />
        <Cloud className="cloud-drift-left"  opacity={0.55} scale={0.7} style={{ top: "30%", left: "75%",  animationDelay: "1.5s" }} />
        <Cloud className="cloud-drift-right" opacity={0.70} scale={1.1} style={{ top: "50%", left: "-12%", animationDelay: "5s" }} />
        <Cloud className="cloud-drift-slow"  opacity={0.60} scale={0.9} style={{ top: "62%", left: "60%",  animationDelay: "9s" }} />
        <Cloud className="cloud-drift-left"  opacity={0.80} scale={1.3} style={{ top: "72%", left: "15%",  animationDelay: "2.5s" }} />
        <Cloud className="cloud-drift-right" opacity={0.65} scale={0.8} style={{ top: "82%", left: "78%",  animationDelay: "4.5s" }} />
      </div>
    </>
  )
}
