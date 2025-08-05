import { Component } from "react";
import axios from "axios";

class AboutView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pastEvents: []
    };
  }

  QSetViewInParent = (obj) => {
    this.props.QIDfromChild(obj);
  }; 


  componentDidMount() {
   axios.get("http://88.200.63.148:3947/event/past")
    .then(res => {
      console.log("Received past events:", res.data); 
      this.setState({ pastEvents: res.data });
    })
    .catch(err => {
      console.error("Failed to fetch past events:", err);
    });
  }

  render() {
    return (
      <div className="card" style={{ margin: "10px" }}>
        <div className="card-body">
          <h5 className="card-title">About us</h5>
          <p className="card-text">
            Never In is a no-profit organization from Trieste, Italy.
            <br/>
            Here are our past events; if you'd been to any of them, feel free to tell us what you think in the Comments.
            Your feedback is very important to us and it can really help us to improve in the future! 
          </p>
        </div>
        
        <br/>

         <div className="card border-secondary mb-3" 
          style={{ margin: "10px", backgroundColor: "rgba(255, 255, 255, 0.1)" }}>
          <h5 className="card-header">Past Events</h5>
          {this.state.pastEvents.length > 0 ? (
            this.state.pastEvents.map(d => (
              <div className="col" key={d.d_id}>
                <div className="card" style={{ margin: "10px" }}>
                  <div className="card-body">
                    {d.Flyer && (
                      <img
                        src={`/images/${d.Flyer}`}
                        alt={`${d.Ime_dogodka} flyer`}
                        className="img-fluid d-block mx-auto mb-2"
                        style={{ maxHeight: "500px", objectFit: "cover" }}
                      />
                    )}
                    <h5 className="card-title">{d.Ime_dogodka}</h5>
                    <p className="card-text">{d.Lokacija}</p>
                  </div>
                  <button
                    onClick={() =>
                      this.QSetViewInParent({ page: "singleEvent", id: d.d_id })
                    }
                    style={{ margin: "10px" }}
                    className="btn btn-outline-warning"
                  >
                    Read more
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="card-text" style={{ margin: "10px" }}>
              No past events found.
            </p>
          )}
        </div>        

      </div>
    );
  }
}

export default AboutView;
