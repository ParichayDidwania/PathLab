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
import Address from './pages/Address';
import Success from './pages/Success';
import Bookings from './pages/Bookings';
import ClientBookingDetails from './pages/ClientBookingDetails';
// import Download from './components/Download';

function App() {

  CookieHelper.init();

  const [name, setName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [authToken, setAuthToken] = useState(CookieHelper.get("authToken") || "");
  const [address, setAddress] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  function setCartWrapper(cartObject) {
    CookieHelper.set("cart", cartObject);
    setCart(cartObject);
  }
  
  useEffect(() => {
    async function autoLogin() {
      if(authToken != "") {
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
          await fetchAddress();
        }
      } else {
        setName("");
        setIsLoggedIn(false);
      }
    }

    async function fetchAddress() {
      let res = await fetch(`${import.meta.env.VITE_URL}/details/`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': authToken
        }
      })

      if(res.status === 200) {
        res = await res.json();
        setAddress(res.data);
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

    async function start() {
      await Promise.all([
        autoLogin(),
        fetchAllProducts(),
        fetchCart()
      ]);
      setIsLoaded(true);
    }

    start();
  }, [authToken])

  return(
      <BrowserRouter>
        <div className="page">
          <Header className="page__header" name={name} isLoggedIn={isLoggedIn} setAuthToken={setAuthToken}/>
          {isLoaded ? 
            <Routes>
              <Route path='/' element={<Home className="page__main" cart={cart} setCart={setCartWrapper} products={products}/>}></Route>
              <Route path='/auth' element={!isLoggedIn ? <Auth className="page__main" setAuthToken={setAuthToken}/> : <Navigate replace to="/" />}></Route>
              <Route path='/activate/:id' element={<Activate className="page__main"/>}></Route>
              <Route path='/cart' element={<Cart className="page__main" cart={cart} setCart={setCartWrapper} products={products} isLoggedIn={isLoggedIn}/>}></Route>
              <Route path='/details' element={(!isLoggedIn || Object.keys(cart).length == 0) ? <Navigate replace to="/" /> : <Details className="page__main" cart={cart} authToken={authToken} address={address}/>}></Route>
              <Route path='/address' element={isLoggedIn ? <Address className="page__main" authToken={authToken} address={address} setAddress={setAddress}/> : <Navigate replace to="/" />}></Route>
              <Route path='/success' element={isLoggedIn ? <Success className="page__main" setCart={setCart}/> : <Navigate replace to="/" />}></Route>
              <Route path='/bookings' element={isLoggedIn ? <Bookings className="page__main" authToken={authToken}/> : <Navigate replace to="/" />}></Route>
              <Route path='/booking-detail/:order_id' element={isLoggedIn ? <ClientBookingDetails className="page__main" authToken={authToken}/> : <Navigate replace to="/" />}></Route>
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
