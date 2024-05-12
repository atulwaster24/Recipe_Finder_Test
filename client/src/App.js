import {Routes, Route} from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import Home from './pages/Home';

function App() {
  // useEffect(()=>{
  //   async function fetchData (){
  //     const response = await fetch('http://localhost:5500/api/user/663a0a11f810fbd60ec551e3');
  //     const data = await response.json();
  //     console.log(data);
  //   };
  //   fetchData();
  // },[])

  return (
    <div className="App">
      <Routes>
        <Route path='/*' element={<Home /> } />
      </Routes>
    </div>
  );
}

export default App;
