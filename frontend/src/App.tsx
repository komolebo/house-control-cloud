import React, {useContext} from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {privateRoutes, publicRoutes} from "./routes";
import {UserAuthContext} from "./globals/UserAuthProvider";
import {HOME_PAGE, LOGIN_PAGE} from "./utils/consts";
import {NavBar} from "./components/NavBar";


const App = () => {
    const  {authorized} = useContext(UserAuthContext);

    return (
      <BrowserRouter>
         { authorized && <NavBar/> }
          <Routes>
              {authorized
              ? privateRoutes.map(({path, Component}, i) =>
                  <Route path={path} element={Component} key={i}/>)
              : publicRoutes.map(({path, Component}, i) =>
                  <Route path={path} element={Component} key={i}/>)
              }

              <Route
                  path="*"
                  element={<Navigate
                      to={authorized ? HOME_PAGE : LOGIN_PAGE}
                      replace
                  />}
              />
          </Routes>
      </BrowserRouter>
    )}

export default App;
