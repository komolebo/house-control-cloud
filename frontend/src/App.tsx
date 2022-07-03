import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {publicRoutes} from "./routes";
import {isAuth, UserSettingsProvider} from "./globals/UserSettingsProvider";
import {NavBar} from "./components/NavBar";


const App = () => {
    // let [isAuth, setIsAuth] = useState(false)
    const authorized = isAuth();

    return (
        <UserSettingsProvider>
          <BrowserRouter>
              {<NavBar/>}
              <Routes>
                  {publicRoutes.map(({path, Component}) =>
                      <Route path={path} element={Component}/>
                  )}
              </Routes>
          </BrowserRouter>
          {authorized ? <div>AUTH</div> : <div>NOT AUTH</div>}
        </UserSettingsProvider>
    )}

export default App;
