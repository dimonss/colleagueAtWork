import { useState, useEffect } from 'react'
import fedorImage from './assets/img.jpg'
import './App.css'

function App() {
  const [status, setStatus] = useState('')
  const [statusColor, setStatusColor] = useState('')
  const [error, setError] = useState('')

  const guestId = '65D5B8E9-C462-C92B-1032-CB9812273E56'
  const apiGetUrl = `https://chalysh.tech/wedding/api/guest/${guestId}`
  const apiAcceptUrl = `https://chalysh.tech/wedding/api/guest_accept/${guestId}`
  const apiRejectUrl = `https://chalysh.tech/wedding/api/guest_reject/${guestId}`

  // Получение данных о госте
  const fetchGuestInfo = async () => {
    try {
      const response = await fetch(apiGetUrl)
      if (!response.ok) {
        setError('Не удалось загрузить данные о госте.')
        console.error('Ошибка при получении данных:', response.status)
        return
      }
      const data = await response.json()
      console.log(data?.data?.respStatus)
      
      if (data?.data?.respStatus) {
        setStatus('Федор на месте! ✅')
        setStatusColor('#4CAF50')
      } else {
        setStatus('Федор не на месте! ❌')
        setStatusColor('#f44336')
      }
      setError('')
    } catch (error) {
      setError('Не удалось загрузить данные о госте.')
      console.error('Ошибка:', error)
    }
  }

  // Подтверждение присутствия
  const acceptGuest = async () => {
    try {
      const response = await fetch(apiAcceptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        setStatus('Ошибка при подтверждении. 😞')
        setStatusColor('#f44336')
        console.error('Ошибка при подтверждении:', response.status)
        return
      }
      setStatus('Федор на месте! ✅')
      setStatusColor('#4CAF50')
      setError('')
    } catch (error) {
      setStatus('Ошибка при подтверждении. 😞')
      setStatusColor('#f44336')
      console.error('Ошибка:', error)
    }
  }

  // Отклонение присутствия
  const rejectGuest = async () => {
    try {
      const response = await fetch(apiRejectUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        setStatus('Ошибка при отклонении. 😞')
        setStatusColor('#f44336')
        console.error('Ошибка при отклонении:', response.status)
        return
      }
      setStatus('Федор не на месте! ❌')
      setStatusColor('#f44336')
      setError('')
    } catch (error) {
      setStatus('Ошибка при отклонении. 😞')
      setStatusColor('#f44336')
      console.error('Ошибка:', error)
    }
  }

  // Загрузка данных при открытии страницы и каждые 5 секунд
  useEffect(() => {
    fetchGuestInfo()
    const interval = setInterval(fetchGuestInfo, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="workplace">
      <h1>Федор на месте</h1>
      <img src={fedorImage} alt="Федор на рабочем месте" className="photo" />
      <p>Проверьте статус и подтвердите присутствие.</p>
      
      {error && <div className="error">{error}</div>}
      
      <div className="buttons">
        <button onClick={acceptGuest}>Федор на месте</button>
        <button className="reject" onClick={rejectGuest}>Федор не на месте</button>
      </div>
      
      {status && (
        <div className="status" style={{ color: statusColor }}>
          {status}
        </div>
      )}
    </div>
  )
}

export default App
