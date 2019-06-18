import React from 'react';
import './index.css';
import {Route, BrowserRouter} from 'react-router-dom';
import SearchPage from './components/SearchPage';


const App = ({match}) => {

return (
  <BrowserRouter><Route exact path="/" render={(props)=><SearchPage {...props}  />} /></BrowserRouter>
      
  )
  }



export default App;