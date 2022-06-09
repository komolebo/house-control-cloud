import React, {createContext, useState} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {publicRoutes} from "./routes";
import {UserSettingContext} from "./globals/UserGlobals";

const App = () => {
    let [isAuth, setIsAuth] = useState(false)

    return (
      <UserSettingContext.Provider value={{isAuth, setIsAuth}}>
              {isAuth ? <div>AUTH</div> : <div>NOT AUTH</div>}
          <BrowserRouter>
              {/*<NavBar/>*/}
              <Routes>
                  {publicRoutes.map(({path, Component}) =>
                      <Route path={path} element={Component}/>
                  )}
              </Routes>
          </BrowserRouter>
      </UserSettingContext.Provider>
    );
    }

export default App;
