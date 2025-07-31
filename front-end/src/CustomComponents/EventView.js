import { Component } from "react";
import axios from "axios";

class EventView extends Component {

  constructor (props) {
    super(props)
    this.state = {
      events: []
    } 
  }

  QSetViewInParent = (obj) => {
    this.props.QIDfromChild(obj);
  }; 

  componentDidMount () {
    axios.get("http://88.200.63.148:3947/event")
    .then (res => {
      this.setState ({
        events:res.data
      })
    })
  }

  render() {
    let data = this.state.events
    return (
      <div className="row row-cols-1 row-cols-md-3 g-4" style={{ margin: "10px" }}>
        {data.length > 0 ? 
          data.map (d => {
            return (
              <div className="col" key={d.d_id}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{d.Ime_dogodka}</h5>
                    <p className="card-text">{d.Lokacija}</p>
                  </div>
                  <button
                    onClick={() =>
                      this.QSetViewInParent({ page: "singleEvent", id: d.d_id })
                    }
                    style={{ margin: "10px" }}
                    className="btn btn-primary bt"
                  >
                    Read more
                  </button>
                </div>
              </div>
            )
          })
        : 
        "Loading..."}
      </div>
    );
  }
}

export default EventView;
