import React, {useContext, useEffect, useState} from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {privateRoutes, publicRoutes} from "./routes";
import {isAuth, UserAuthContext, UserAuthProvider} from "./globals/UserAuthProvider";
import {HOME_PAGE, LOGIN_PAGE} from "./utils/consts";


const App = () => {
    const  {authorized} = useContext(UserAuthContext);

    return (
      <BrowserRouter>
          <Routes>
              {authorized
              ? privateRoutes.map(({path, Component}) =>
                  <Route path={path} element={Component}/>)
              : publicRoutes.map(({path, Component}) =>
                  <Route path={path} element={Component}/>)
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
