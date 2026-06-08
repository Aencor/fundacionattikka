import { useState, useEffect } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Mission from './components/Mission'
import Impact from './components/Impact'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import DonationModal from './components/DonationModal'
import ThankYouPage from './components/ThankYouPage'

type View = 'home' | 'thankyou' | 'cancelled'

function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [view, setView] = useState<View>('home')

  // Detect Stripe redirect result from URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const status = params.get('donacion')
    if (status === 'exitosa') {
      setView('thankyou')
      // Clean the URL without reloading
      window.history.replaceState({}, '', window.location.pathname)
    } else if (status === 'cancelada') {
      // User cancelled on Stripe – just open modal again so they can retry
      window.history.replaceState({}, '', window.location.pathname)
      setModalOpen(true)
    }
  }, [])

  function handleHome() {
    setView('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Show thank you page after successful donation
  if (view === 'thankyou') {
    return <ThankYouPage onHome={handleHome} />
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onDonate={() => setModalOpen(true)} />
      <Hero onDonate={() => setModalOpen(true)} />
      <Stats />
      <Mission />
      <Impact />
      <HowItWorks />
      <Testimonials />
      <Footer onDonate={() => setModalOpen(true)} />
      {modalOpen && <DonationModal onClose={() => setModalOpen(false)} />}
    </div>
  )
}

export default App
