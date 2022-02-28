import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAvatars } from '../../../actions/postActions';
import axios from 'axios';
import './Avatar.css';

class Avatar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      "currentAvatarurl": "",
      "currentAvatarbudget": 0,
    }
    this.avatarClick = this.avatarClick.bind(this);
    this.avatarClick = this.avatarClick.bind(this);
    this.avatarClick = this.avatarClick.bind(this);
    this.Buy = this.Buy.bind(this);
  }  
  componentWillMount() {
    this.props.getAvatars(); 
  }
  Buy() {
    var buydata = {};
    buydata.avatar_url = this.state.currentAvatarurl;
    buydata.request_id = localStorage.getItem("currentUser");
    axios.post("http://localhost:5000/freelancing/api/sell/avatar", {
      avatar_url: buydata.avatar_url,
      request_id: buydata.request_id,
    }).then(res => {
      alert("Your request is success! Wait our permission!");
      var modal = document.getElementById("myModal");
      modal.setAttribute("style", "display: none;");

    }).catch(err=>{
      alert(err);
    })
  }
  avatarClick(id , flag , price) {
    if(flag == 1)
      return;
    else {
      var modal = document.getElementById("myModal");
      var span = document.getElementsByClassName("close")[0];
      modal.style.display = "block";
      span.onclick = function() {
        modal.style.display = "none";
      }
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
      this.setState({
        "currentAvatarbudget": price,
        "currentAvatarurl": id,
      });
    }
  }
  render() {
    const avatarItems = this.props.avatars.map(Avatar => {  
          if(Avatar.ava_level === 1)
            return <div className="contain_img" key={Avatar._id}><img className="level" src={Avatar.ava_url} alt="loading.." style={{opacity:Avatar.ava_status == 1 ? 0.3:1}}  id={Avatar.ava_url} onClick={() => { this.avatarClick(Avatar.ava_url , Avatar.ava_status , Avatar.ava_budget)}}/></div>      
      })
    const avatarItems1 = this.props.avatars.map(Avatar => {  
          if(Avatar.ava_level === 2)
            return <div className="contain_img" key={Avatar._id}><img className="level" src={Avatar.ava_url} alt="loading..." style={{opacity:Avatar.ava_status == 1 ? 0.3:1}} id={Avatar.ava_url} onClick={() => { this.avatarClick(Avatar.ava_url , Avatar.ava_status, Avatar.ava_budget)}}/></div>      
      })
    const avatarItems2 = this.props.avatars.map(Avatar => {  
          if(Avatar.ava_level === 3)
            return <div className="contain_img" key={Avatar._id}><img className="level" src={Avatar.ava_url} alt="loading..." style={{opacity:Avatar.ava_status == 1 ? 0.3:1}} id={Avatar.ava_url} onClick={() => { this.avatarClick(Avatar.ava_url , Avatar.ava_status, Avatar.ava_budget)}}/></div>      
      })
    return (
      <div className='background1'>
        <div className='container3'>
          <img className="intro_img premium_img" src="http://localhost:3000/images/premium.png" alt="loading..." />
          <div className="gallery premium">
            {avatarItems}
          </div>
          <img className="intro_img amateur_img" src="http://localhost:3000/images/amateur.png" alt="loading..." />
          <div className="gallery Amateur"> 
            {avatarItems1}
          </div>
          <img className="intro_img basic_img" src="http://localhost:3000/images/basic.png" alt="loading..." />
          <div className="gallery premium"> 
            {avatarItems2}
          </div>
        </div>

        <div id="myModal" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <span class="close" onClick={()=>{this.Close()}}>&times;</span>
              <h2> Enjoy Avatar </h2>
            </div>
            <div class="modal-body">
              <div className="imgdiv">
                <img className="img" src={this.state.currentAvatarurl} alt="loading..." />
              </div>
              <div className="budgetdiv">
                <label className="label">Cost:  $ <strong>{this.state.currentAvatarbudget}</strong> USD</label>
              </div>
              <div className="buydiv">
                <button className="buybtn" id="buybtn" onClick={()=>{this.Buy()}}>Buy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Avatar.propTypes = {
  getAvatars: PropTypes.func.isRequired,
  avatars: PropTypes.array.isRequired,
}
const mapStateToProps = state => ({
  avatars: state.posts.avatars
})

export default connect(mapStateToProps , { getAvatars })(Avatar);