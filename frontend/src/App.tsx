import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import LoginPage from "./components/LoginPage";
import {publicRoutes} from "./routes";
import NavBar from "./components/NavBar";

const App = () => {
  return (
      <BrowserRouter>
          {/*<NavBar/>*/}
          <Routes>
              {publicRoutes.map(({path, Component}) =>
                  <Route path={path} element={Component}/>
              )}
          </Routes>
      </BrowserRouter>
  );
}

export default App;
