import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: 1200, suffix: '+', label: 'Bebés beneficiados', color: 'text-orange-600' },
  { value: 48, suffix: '', label: 'Comunidades alcanzadas', color: 'text-green-600' },
  { value: 5, suffix: ' años', label: 'De experiencia', color: 'text-blue-600' },
  { value: 98, suffix: '%', label: 'Donaciones al programa', color: 'text-purple-600' },
]

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

function StatCard({ value, suffix, label, color, animate }: typeof stats[0] & { animate: boolean }) {
  const count = useCountUp(value, 1800, animate)
  return (
    <div className="text-center p-6">
      <div className={`text-5xl font-extrabold ${color} mb-2`}>
        {count}{suffix}
      </div>
      <div className="text-gray-600 font-medium">{label}</div>
    </div>
  )
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-16 bg-gradient-to-r from-orange-50 to-amber-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-orange-200">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} animate={animate} />
          ))}
        </div>
      </div>
    </section>
  )
}
