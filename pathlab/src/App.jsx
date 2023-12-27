import './App.css'
import Footer from './common/Footer';
import Header from './common/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
// import Upload from './components/Upload';
import Download from './components/Download';

function App() {
  return(
      <BrowserRouter>
        <div className="page">
          <Header className="page__header"/>
            <Routes>
              <Route path='/' element={<Download className="page__main"/>}></Route>
            </Routes>
            <Footer className="page__footer"/>
        </div>
      </BrowserRouter>
  );
}

export default App
