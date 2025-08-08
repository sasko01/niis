import { Component } from "react";
import AboutView from "./CustomComponents/AboutView";
import AddEventView from "./CustomComponents/AddEventView";
import EventView from "./CustomComponents/EventView";
import HomeView from "./CustomComponents/HomeView";
import LoginView from "./CustomComponents/LoginView";
import SignUpView from "./CustomComponents/SignUpView";
import SingleEventView from "./CustomComponents/SingleEventView";
import LoggedUserView from "./CustomComponents/LoggedUserView";
import axios from "axios";
import { withTranslation } from "react-i18next";

import backgroundImage from './images/ni_background.jpg';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "none",  
      event: 0,
      userStatus:{logged:false}
    }; //this.state
  } //constructor

  QSetView = (obj) => {
    this.setState({
      currentPage: obj.page,
      event: obj.id || 0,
    });
  }; 

  QSetViewInParent = (obj) => {
    this.props.QIDfromChild(obj);
  }; 

  QGetView = (state) => {
    let page = state.currentPage;
    switch (page) {
      case "home":
        return <HomeView QIDfromChild={this.QSetView} />;
      case "about":
        return <AboutView QIDfromChild={this.QSetView} />;
      case "events":
        return <EventView QIDfromChild={this.QSetView} />;
      case "addEvent":
        return state.userStatus.logged ? <AddEventView QViewFromChild={this.QSetView}  /> :
          <div  className="card" style={{ margin: "10px" }}>
            <div className="card-body">
              <p className="card-text">
                You have to be logged in with an organization to suggest events!
              </p>
            </div>
          </div>;
      case "signUp":
        return <SignUpView QUserFromChild={this.QHandleUserLog} />;// QHandleUserLog postalo QSetUser (v TUT)!
      case "login":
        return <LoginView QUserFromChild={this.QSetUser}  QIDfromChild={this.QSetView} />;
      case "singleEvent":
        return <SingleEventView 
                  QViewFromChild={this.QSetView} 
                  data={this.state.event} />;
      case "loggedUserView":
        return <LoggedUserView 
                  QViewFromChild={this.QSetView} 
                  user={this.state.userStatus.user}
                  QIDfromChild={this.QSetView} />;
      default:
        return <HomeView QIDfromChild={this.QSetView}/>;
    }
  }; //QgetView

  QHandleUserLog = (obj) => {
    this.QSetView({ page: "home" });
  }; //za login/signup: treba spremenit. Prej QHandleUserLog;spremenu v QSetUser

  QSetUser = (obj) => {
    this.setState({
      userStatus:{logged:true, user:obj}
    })
  };

  componentDidMount () {
    axios.get("http://88.200.63.148:3947/users/login")
    .then(res => {
      console.log(res)
    })
  }//za login

  logout = () => {
  localStorage.removeItem("u_id"); 
  this.setState({
    userStatus: { logged: false },
    currentPage: "home"
  });
};

  render() {
    console.log(this.state)
    const { t, i18n } = this.props;

    return (
      <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <div id="APP" className="container">
        <div id="menu" className="row">
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
              <a
                onClick={() => this.QSetView({ page: "home" })}
                className="navbar-brand"
                href="#"
              >
                {t("navbar.home")}
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <a
                      onClick={() => this.QSetView({ page: "about" })}
                      className="nav-link "
                      href="#"
                    >
                      {t("navbar.about")}
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      onClick={() => this.QSetView({ page: "events" })}
                      className="nav-link "
                      href="#"
                    >
                      {t("navbar.events")}
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      onClick={() => this.QSetView({ page: "addEvent" })}
                      className="nav-link"
                      href="#"
                    >
                      {t("navbar.suggestEvent")}
                    </a>
                  </li>
                  
                  {!this.state.userStatus.logged && (
                    <>
                      <li className="nav-item">
                        <a onClick={() => this.QSetView({ page: "signUp" })} className="nav-link" href="#">
                          {t("navbar.signup")}
                        </a>
                      </li>
                      <li className="nav-item">
                        <a onClick={() => this.QSetView({ page: "login" })} className="nav-link" href="#">
                          {t("navbar.login")}
                        </a>
                      </li>
                    </>
                  )}
                  
                  {this.state.userStatus.logged && (
                    <li className="nav-item">
                      <a
                        onClick={this.logout}
                        className="nav-link"
                        href="#"
                      >
                        {t("navbar.logout")}
                      </a>
                    </li>
                  )}

                </ul>
              </div>

              {this.state.userStatus.logged && this.state.userStatus.user && (
                <a
                  onClick={() => this.QSetView({ page: "loggedUserView" })}
                  className="navbar-text text-white ms-auto"
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  {this.state.userStatus.user.Ime_priimek}
                </a>
              )}
              
            </div>
            <div>
              <button onClick={() => i18n.changeLanguage("si")} className="btn btn-sm btn-outline-light">
                SL
              </button>
              <button onClick={() => i18n.changeLanguage("en")} className="btn btn-sm btn-outline-light">
                EN
              </button>
              <button onClick={() => i18n.changeLanguage("it")} className="btn btn-sm btn-outline-light">
                IT
              </button>
          </div>

          </nav>
        </div>

        <div id="viewer" className="row container">
          {this.QGetView(this.state)}
        </div>
      </div>
      </div>
    );
  } //render
} //App

export default withTranslation()(App);
