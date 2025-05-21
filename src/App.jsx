import { useState } from 'react'
import './App.css'

const EMOJIS = ['🐶','🐱','🦊','🐻','🐼','🐵','🦁','🐸']
const SHUFFLED_EMOJIS = [...EMOJIS, ...EMOJIS]

function shuffle(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

function App() {
  const [cards, setCards] = useState(() => shuffle(SHUFFLED_EMOJIS).map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false })))
  const [flipped, setFlipped] = useState([])
  const [lock, setLock] = useState(false)
  const [won, setWon] = useState(false)

  const handleFlip = (idx) => {
    if (lock || cards[idx].flipped || cards[idx].matched) return
    const newFlipped = [...flipped, idx]
    const newCards = cards.map((card, i) => i === idx ? { ...card, flipped: true } : card)
    setCards(newCards)
    setFlipped(newFlipped)
    if (newFlipped.length === 2) {
      setLock(true)
      setTimeout(() => {
        const [i1, i2] = newFlipped
        if (newCards[i1].emoji === newCards[i2].emoji) {
          const matchedCards = newCards.map((card, i) => (i === i1 || i === i2) ? { ...card, matched: true } : card)
          setCards(matchedCards)
          if (matchedCards.every(card => card.matched)) setWon(true)
        } else {
          setCards(newCards.map((card, i) => (i === i1 || i === i2) ? { ...card, flipped: false } : card))
        }
        setFlipped([])
        setLock(false)
      }, 1000)
    }
  }

  const handleRestart = () => {
    setCards(shuffle(SHUFFLED_EMOJIS).map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false })))
    setFlipped([])
    setLock(false)
    setWon(false)
  }

  return (
    <div>
      <h1>Memory Game 🧠</h1>
      <div className="memory-grid">
        {cards.map((card, idx) => (
          <button
            key={card.id}
            className={`memory-card${card.flipped || card.matched ? ' flipped' : ''}`}
            onClick={() => handleFlip(idx)}
            disabled={card.flipped || card.matched}
          >
            {card.flipped || card.matched ? card.emoji : '❓'}
          </button>
        ))}
      </div>
      {won && <div className="win-message">🎉 Bravo, tu as gagné ! <button onClick={handleRestart}>Rejouer</button></div>}
      {!won && <button className="restart-btn" onClick={handleRestart}>Recommencer</button>}
    </div>
  )
}

export default App
