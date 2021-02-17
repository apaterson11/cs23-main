import React, {useState, useEffect} from 'react';
import './App.css';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import About from './components/About'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './components/Auth/Login'
import Logout from './components/Auth/Logout'
import Register from './components/Auth/Register'
import ProtoMap from './components/ProtoMap'
import Dashboard from './components/Profile/Dashboard'
import CreateProject from './components/Project/CreateProject'
import { UserContext } from './Context'
import axiosInstance from './axios'
import jwt from 'jwt-decode'

function App(props) {

  const [defaultLocation, setDefaultLocation] = useState({
    defaultLat: "55.86515",
    defaultLon: "-4.25763"
  })

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userDetails, setUserDetails] = useState()

  useEffect(() => {
    // On the App component mounting, check to see if user logged in already
    const token = localStorage.getItem('access_token')
    if (token) {
      // verify token is correct
      axiosInstance.post('token/refresh/', {refresh: localStorage.getItem('refresh_token')}).then((res) => {
          axiosInstance.defaults.headers['Authorization'] = 'JWT ' + res.data.access
          setIsAuthenticated(true)
      }).catch((err) => {
        console.log(err)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      })
    }
  }, [])
  
  const login = () => {
    const userData = jwt(localStorage.getItem('access_token'))
    setIsAuthenticated(true)
    setUserDetails(userData)
  }

  const logout = () => {
    setIsAuthenticated(false)
  }

  return (
    <Router>
      <UserContext.Provider value={{userDetails, setUserDetails}}>
        <Header isAuthenticated={isAuthenticated} />
        <Switch>
          <Route exact path="/" component={About}/>
          <Route exact path="/demo-map/" render={() => (
            <ProtoMap latitude={defaultLocation.defaultLat} longitude={defaultLocation.defaultLon}/>
          )} />
          <Route exact path="/dashboard/" render={() => (
            <Dashboard />
          )} />
          <Route exact path="/projects/create/" component={CreateProject} />
          <Route exact path="/register/" component={Register}/>
          <Route exact path="/login/" render={() => (
            <Login login={login}/>
          )} />
          <Route path="/logout/" render={() => (
            <Logout logout={logout}/>
          )} />
        </Switch>
        <Footer isAuthenticated={isAuthenticated}/>
      </UserContext.Provider>
    </Router>
  )
}


export default App;
