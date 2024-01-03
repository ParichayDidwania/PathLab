import './App.css'
import Footer from './common/Footer';
import Header from './common/Header';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
// import Upload from './components/Upload';
import Activate from './pages/Activate';
import { useEffect, useState } from 'react';
import CookieHelper from './helpers/cookieHelper';
import Cart from './pages/Cart';
import Details from './pages/Details';
// import Download from './components/Download';

function App() {

  const [name, setName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);

  function setCartWrapper(cartObject) {
    CookieHelper.set("cart", cartObject);
    setCart(cartObject);
  }
  
  useEffect(() => {
    async function autoLogin() {
      const authToken = CookieHelper.get("authToken");
      if(authToken) {
        let res = await fetch(`${import.meta.env.VITE_URL}/auth/authToken`, {
          method: "GET",
          headers: {
              'Content-Type': 'application/json',
              'x-auth-token': authToken
          }
        })
  
        if(res.status === 200) {
          res = await res.json();
          setName(res.data.name);
          setIsLoggedIn(true);
        }
      }
    }

    async function fetchAllProducts() {
      let res = await fetch(`${import.meta.env.VITE_URL}/all`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
      })

      if(res.status === 200) {
        res = await res.json();
        setProducts(res.data);
      }
    }

    function fetchCart() {
      let cartObject = CookieHelper.get("cart");
      if(cartObject) {
        setCart(cartObject);
      }
    }

    CookieHelper.init();

    autoLogin();
    fetchAllProducts();
    fetchCart();
  }, [name])
  

  return(
      <BrowserRouter>
        <div className="page">
          <Header className="page__header" name={name} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          {products.length > 0 ? 
            <Routes>
              <Route path='/' element={<Home className="page__main" cart={cart} setCart={setCartWrapper} products={products}/>}></Route>
              <Route path='/auth' element={!isLoggedIn ? <Auth className="page__main" setName={setName}/> : <Navigate replace to="/" />}></Route>
              <Route path='/activate/:id' element={<Activate className="page__main"/>}></Route>
              <Route path='/cart' element={<Cart className="page__main" cart={cart} setCart={setCartWrapper} products={products} isLoggedIn={isLoggedIn}/>}></Route>
              <Route path='/details' element={<Details className="page__main" cart={cart}/>}></Route>
              <Route path='/*' element={<Navigate replace to="/" />}></Route>
            </Routes>
            :
            <span>Loading</span>
          }
          
          <Footer className="page__footer"/>
        </div>
      </BrowserRouter>
  );
}

export default App
