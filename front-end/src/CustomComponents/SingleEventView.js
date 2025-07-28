import { Component } from "react";
import axios from "axios";

class SingleEventView extends Component {

  constructor (props) {
    super (props) 
    this.state = {
      event:[]
    }
  }

  QSetViewInParent = (obj) => {
    this.props.QViewFromChild(obj);
  }; //tudi to menjat za gumb za listke

  componentDidMount () {
    axios.get("http://88.200.63.148:3947/event/" + this.props.data)
    .then(res => {
      this.setState ({
        event:res.data
      })
    })
  }

  render() {
    let event = this.state.event
    return (
      <div className="card" style={{ margin: "10px" }}>
        {event.length > 0 ?
        <div>
          <h5 className="card-header">{event[0].Ime_dogodka}</h5>
          <div className="card-body">
          <h5 className="card-title">{event[0].Lokacija}</h5>
          <p className="card-text">
            {event[0].Druge_info}
          </p>
          <button
            onClick={() => this.QSetViewInParent({ page: "events" })} //menjat z gumbom za kupit listke
            className="btn btn-primary"
          >
            Back to events (add Get tix!)
          </button>
          </div>
        </div>
        : "Loading..." }
      </div>
    );
  }
}

export default SingleEventView;
