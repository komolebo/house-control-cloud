import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {publicRoutes} from "./routes";

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
