import { Component } from "react";
import axios from "axios";

class SingleEventView extends Component {

  constructor (props) {
    super (props) 
    this.state = {
      event:[],
      comments:[],
      newComment: ""
    }
  }

  

  componentDidMount () {
    axios.get("http://88.200.63.148:3947/event/" + this.props.data)
    .then(res => {
      this.setState ({
        event:res.data
      })
    })
    axios.get(`http://88.200.63.148:3947/comments/${this.props.data}`)
    .then(res2 => {
      this.setState({ comments: res2.data });
    })
    .catch(err => {
      console.error("Failed to load comments:", err);
    });
  }

  QPostComment = () => {
  const userId = localStorage.getItem("u_id");
  const newComment  = this.state.newComment;

  if (!userId) {
    alert("You must be logged in to comment.");
    return;
  }
  if (!newComment.trim()) {
    alert("Comment cannot be empty.");
    return;
  }
  axios.post("http://88.200.63.148:3947/comments", {
    u_id: userId,
    d_id: this.props.data,
    Tekst: newComment
  })
  .then(() => {
    return axios.get(`http://88.200.63.148:3947/comments/${this.props.data}`);
  })
  .then(res => {
    this.setState({ comments: res.data, newComment: "" });
  })
  .catch(err => {
    console.error("Failed to post comment:", err);
  });
};

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
          
          </div>
        </div>
        : "Loading..." }
        
          <h5 style={{ marginTop: "20px" }}>Comments</h5>

          {this.state.comments.length > 0 ? (
            <ul className="list-group">
              {this.state.comments.map(c => (
                <li key={c.k_id} className="list-group-item">
                  <strong>{c.Ime_priimek}:</strong> {c.Tekst} <br />
                  <small>{new Date(c.Datum_in_ura).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments yet: Login to add a comment.</p>
          )}

          <br />

          {localStorage.getItem("u_id") && (
            <>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Leave a comment..."
                value={this.state.newComment}
                onChange={(e) => this.setState({ newComment: e.target.value })}
                style={{ marginTop: "10px" }}
              ></textarea>
              <button
                onClick={this.QPostComment}
                className="btn btn-outline-warning"
                style={{ marginTop: "10px" }}
              >
                Submit Comment
              </button>
            </>
          )}

      </div>
    );
  }
}

export default SingleEventView;
