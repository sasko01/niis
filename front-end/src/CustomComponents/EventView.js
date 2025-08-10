import { Component } from "react";
import axios from "axios";
import { withTranslation } from "react-i18next";

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
    axios.get("/event?accepted=0")
    .then (res => {
      this.setState ({
        events:res.data
      })
    })
  }

  render() {
    const t = this.props.t;
    let data = this.state.events
    return (
      <div className="card" style={{ margin: "10px" }}>
        <div className="card-body">
          <p className="card-text">
            {t("events.intro1")}
            <br/>
            {t("events.intro2")}  
          </p>
        </div>
      <br/>
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
                    className="btn btn-outline-warning"
                  >
                    {t("events.readMore")}
                  </button>
                </div>
              </div>
            )
          })
        : 
        "Loading..."}
      </div>
    </div>
    );
  }
}

export default withTranslation()(EventView);