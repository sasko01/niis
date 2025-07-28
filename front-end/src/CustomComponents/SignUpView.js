import { Component } from "react";
import axios from "axios";

class SignUpView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        type: "login",
      },
    };
  }

  QGetTextFromField = (e) => {
    this.setState((prevState) => ({
      user: { ...prevState.user, [e.target.name]: e.target.value },
    }));
  };

  QSendUserToParent = (state) => {
    this.props.QUserFromChild(state.user);
  };

  QPostSignUp = () => {
    let user = this.state.user
    axios.post("http://88.200.63.148:3947/users/register", {
      Ime_in_priimek: user.Ime_in_priimek,
      Email: user.Email,
      Tel_st: user.Tel_st,
      Lokacija: user.Lokacija,
      Geslo: user.Geslo
    }).then (res => {
      console.log("Sent to the server")
    }).catch (err => {
      console.log(err)
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
            <label className="form-label">Name and surname</label>
            <input
              onChange={(e) => this.QGetTextFromField(e)}
              name="Ime_in_priimek"
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              onChange={(e) => this.QGetTextFromField(e)}
              name="Email"
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Telephone number</label>
            <input
              onChange={(e) => this.QGetTextFromField(e)}
              name="Tel_st"
              type="tel"
              className="form-control"
              id="Tel_st"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Adress</label>
            <input
              onChange={(e) => this.QGetTextFromField(e)}
              name="Lokacija"
              type="text"
              className="form-control"
              id="Lokacija"
              aria-describedby="emailHelp"
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
          onClick={() => this.QPostSignUp()}
          style={{ margin: "10px" }}
          className="btn btn-primary bt"
        >
          Submit
        </button>
      </div>
    );
  }
}

export default SignUpView;
