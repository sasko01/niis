import { Component } from "react";
import axios from "axios";

class LoginView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {
        type: "login",
      },
    };
  }

  QGetTextFromField = (e) => {
  this.setState(prevState => ({
    user: {
      ...prevState.user,
      [e.target.name]: e.target.value
    }
  }));
};

  QSendUser2Parent = (obj) => {
    this.props.QUserFromChild(obj);
  };//Prej je blo QSendUserToParent; spremenu v QSendUser2Parent

  QPostLogin = () => {
    let user = this.state.user
    axios.post("http://88.200.63.148:3947/users/login", {
      Email: user.Email,
      Geslo: user.Geslo
    }, {withCredentials:true})
    .then(res => {
      console.log("Sent to the server")
      console.log(res.data)
      this.QSendUser2Parent(res.data)
    })
  }

  render() {
    return (
      <div
        className="card"
        style={{
          width: "400px",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        <form style={{ margin: "20px" }}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              onChange={(e) => this.QGetTextFromField(e)}
              name="Email"
              type="text"
              className="form-control"
              id="exampleInputEmail1"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              onChange={(e) => this.QGetTextFromField(e)}
              name="Geslo"
              type="password"
              className="form-control"
              id="exampleInputPassword1"
            />
          </div>
        </form>
        <button
          onClick={() => this.QPostLogin(this.state)}
          style={{ margin: "10px" }}
          className="btn btn-primary bt"
        >
          Login 
        </button>
      </div>
    );
  }
}

export default LoginView;
