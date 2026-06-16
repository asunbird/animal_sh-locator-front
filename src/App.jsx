
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Map from './Map.jsx';
import { About, Info, Contact } from './About.jsx';
import Error from  './Error.jsx';
import SignIn from  './SignIn.jsx';
import EvolvingBackground from './EvolvingBackground.jsx';
import Favorites from './Favorites.jsx';
import Home from './Home.jsx';




function App() {
  return (
      <EvolvingBackground>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/map" element={<Map />} />
            <Route path="/about" element={<About />} >
                <Route path="/about/info" element={<Info />} />
                <Route path="/about/contact" element={<Contact />} />
            </Route>
            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </EvolvingBackground>
  )
}

export default App;