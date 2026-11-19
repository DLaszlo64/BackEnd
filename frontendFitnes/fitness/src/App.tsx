import './App.css'
import Felhasznalo from "./asd"
import { useState } from 'react';

function App() {
  const [megjelenit, setMegjelenit] = useState(false);
  return (
    <>
      <header>
            <h1 id='cim'>Fitness</h1>
            <h2 id='alcim'>Lorem, ipsum dolor.</h2>
            <hr />
      </header>

      <main>
          <button onClick={() => setMegjelenit(true)}>betöltés</button>
          

          <div className='hely'>
            {megjelenit && <Felhasznalo />}
          </div>
      </main>
    </>
  )
}

export default App
