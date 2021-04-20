import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  HashRouter,
  Switch,
  Route,
} from "react-router-dom";
import BaseLayout from './components/BaseLayout';
import PokemonDetail from './components/PokemonDetail';
import PokemonCompared from './components/PokemonCompared';
import Navbar from './components/Navbar';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <BaseLayout>
      <Navbar/>
      <Switch>
        <Route exact path="/" component={App}></Route>
        <Route exact path="/compared" component={PokemonCompared}></Route>
        <Route path="/:pokemonName" component={PokemonDetail}></Route>
        
      </Switch>
      </BaseLayout>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
