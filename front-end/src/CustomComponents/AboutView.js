import { Component } from "react";

class AboutView extends Component {
  render() {
    return (
      <div className="card" style={{ margin: "10px" }}>
        <div className="card-body">
          <h5 className="card-title">About us</h5>
          <p className="card-text">
            Never In is a no-profit organization from Trieste, Italy
          </p>
        </div>
      </div>
    );
  }
}

export default AboutView;
