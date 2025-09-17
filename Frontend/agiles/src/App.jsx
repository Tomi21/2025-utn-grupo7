import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then(res => res.text())
      .then(data => setMessage(data));
  }, []);

return (
    <div>
      <h1>Frontend Running!</h1>
      <p>Mensaje desde el backend: {message}</p>
    </div>
  );
}

export default App;
