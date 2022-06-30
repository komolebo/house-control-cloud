import React, {useState} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {publicRoutes} from "./routes";
import {UserSettingContext} from "./globals/UserGlobals";
import {isAuthToken} from "./globals/AuthGlobal";
import {NavBar} from "./components/NavBar";


const App = () => {
    let [isAuth, setIsAuth] = useState(false)
    const authorized = isAuthToken();

    return (
      <UserSettingContext.Provider value={{isAuth, setIsAuth}}>
          <BrowserRouter>
              {<NavBar/>}
              <Routes>
                  {publicRoutes.map(({path, Component}) =>
                      <Route path={path} element={Component}/>
                  )}
              </Routes>
          </BrowserRouter>
          {authorized ? <div>AUTH</div> : <div>NOT AUTH</div>}
      </UserSettingContext.Provider>
    )}

export default App;
