import { Component } from "react";
import AboutView from "./CustomComponents/AboutView";
import AddEventView from "./CustomComponents/AddEventView";
import EventView from "./CustomComponents/EventView";
import HomeView from "./CustomComponents/HomeView";
import LoginView from "./CustomComponents/LoginView";
import SignUpView from "./CustomComponents/SignUpView";
import SingleEventView from "./CustomComponents/SingleEventView";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "none",
      eventId: 0,
    }; //this.state
  } //constructor

  QSetView = (obj) => {
    this.setState({
      currentPage: obj.page,
      eventId: obj.id || 0,
    });
  }; //QSetView

  QGetView = (state) => {
    let page = state.currentPage;
    switch (page) {
      case "home":
        return <HomeView />;
      case "about":
        return <AboutView />;
      case "events":
        return <EventView QIDfromChild={this.QSetView} />;
      case "addEvent":
        return <AddEventView />;
      case "signUp":
        return <SignUpView QUserFromChild={this.QHandleUserLog} />;
      case "login":
        return <LoginView QUserFromChild={this.QHandleUserLog} />;
      case "singleEvent":
        return <SingleEventView QViewFromChild={this.QSetView} />;
      default:
        return <HomeView />;
    }
  }; //QgetView

  QHandleUserLog = (obj) => {
    this.QSetView({ page: "home" });
  }; //za login/signup: treba spremenit

  render() {
    return (
      <div id="APP" className="container">
        <div id="menu" className="row">
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
              <a
                onClick={() => this.QSetView({ page: "home" })}
                className="navbar-brand"
                href="#"
              >
                Home
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
                      About
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      onClick={() => this.QSetView({ page: "events" })}
                      className="nav-link "
                      href="#"
                    >
                      Events
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      onClick={() => this.QSetView({ page: "addEvent" })}
                      className="nav-link"
                      href="#"
                    >
                      Add event
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      onClick={() => this.QSetView({ page: "signUp" })}
                      className="nav-link "
                      href="#"
                    >
                      Sign up
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      onClick={() => this.QSetView({ page: "login" })}
                      className="nav-link "
                      href="#"
                    >
                      Login
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>

        <div id="viewer" className="row container">
          {this.QGetView(this.state)}
        </div>
      </div>
    );
  } //render
} //App

export default App;
