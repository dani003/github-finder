import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Alert from './components/layouts/Alert';
import Users from './components/users/Users';
import Search from './components/users/Search';
import User from './components/users/User';
import About from './components/pages/About';
import axios from 'axios';
import './App.css';


class App extends Component {

  state = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert: null
  }

  /*async componentDidMount(){
    this.setState({loading: true});

    const res = await axios.get(`https://api.github.com/users?client_id=$
    {process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=$
    {process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

    this.setState({users: res.data, loading:false});
  }*/

  // Search Github Users
  searchUsers = async text => {
    this.setState({ loading: true });

    const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

    this.setState({ users: res.data.items, loading: false });
  }

  //Get single GitHub user

  getUser = async (username) => {
    this.setState({ loading: true });

    const res = await axios.get(`
    https://api.github.com/users/${username}?client_id=${
      process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${
      process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

      this.setState({ user: res.data, loading: false });
  }

  //Get users repos

  getUserRepos = async (username) => {
    this.setState({ loading: true });

    const res = await axios.get(`
    https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${
      process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${
      process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

      this.setState({ repos: res.data, loading: false });
  }

  //  Clear users fromm state
  clearUsers = () => {
    this.setState({ users: [], loading: false });
  }

  //
  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } });

    setTimeout(() => this.setState({ alert: null }), 2000);
  }

  render() {

    const { users, loading, user, repos } = this.state;

    return (
      <Router>
        <div className="App">
          <Navbar></Navbar>
          <div className="container">
            <Alert alert={this.state.alert}></Alert>
            <Switch>
              <Route
                exact
                path='/'
                render={props => (
                  <Fragment>
                    <Search
                      searchUsers={this.searchUsers}
                      clearUsers={this.clearUsers}
                      showClear={users.length > 0 ? true : false}
                      setAlert={this.setAlert}>
                    </Search>
                    <Users loading={loading} users={users}></Users>
                  </Fragment>
                )}>
              </Route>
              <Route exact path='/about' component={About}></Route>
              <Route exact path='/user/:login' render={props => (
                <User 
                  {...props} 
                  getUser={this.getUser} 
                  getUserRepos={this.getUserRepos} 
                  user={user} 
                  repos={repos}
                  loading={loading}/>
              )}></Route>
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
