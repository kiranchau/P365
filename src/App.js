import './App.css';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { routesArray } from './routing/RoutingPaths';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./components/commonModules/Header";
import { FormProvider } from '../src/context/FormContext'
import '../src/style.scss';
import AutoLogout from "./components/AutoLogOutFolder/AutoLogOutFile";
import { Notification } from './components/Notification/Notification';
import { Footer } from './components/pages/Footer';
function App() {
  return (

    <FormProvider>
      <div className="App">
        <BrowserRouter>
          <AutoLogout />
          <Header />
          <div className='height-container'>
            <Switch>
              {
                routesArray.map((route, index) => (
                  <Route
                    path={route.path}
                    exact={route.exact}
                    component={route.component}
                    key={index}
                  />
                ))
              }
            </Switch>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
      <Notification />
    </FormProvider>
  );
}

export default App;
