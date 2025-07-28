import { Component } from "react";

class SingleEventView extends Component {
  QSetViewInParent = (obj) => {
    this.props.QViewFromChild(obj);
  }; //tudi to menjat za gumb za listke

  render() {
    return (
      <div className="card" style={{ margin: "10px" }}>
        <h5 className="card-header">Next Never In event:</h5>
        <div className="card-body">
          <h5 className="card-title">StonerKras Fest</h5>
          <p className="card-text">
            A weekend of Stoner Rock and Heavy Psych music
          </p>
          <button
            onClick={() => this.QSetViewInParent({ page: "events" })} //menjat z gumbom za kupit listke
            className="btn btn-primary"
          >
            Back to events (add Get tix!)
          </button>
        </div>
      </div>
    );
  }
}

export default SingleEventView;
