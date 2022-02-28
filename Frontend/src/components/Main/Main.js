import React, { Component } from 'react';
import "../custom.css";
import "../parts/Header/header.css";
import Table from "../parts/Table/table.js";
import Leader from "../parts/Leader/Leader.js";
import Avatar from "../parts/Avatar/Avatar.js";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getLogin } from '../../actions/postActions';
import {logoutUser} from "../../actions/postActions";

var tabbtn1 = "";
var tabbtn2 = "";
var tabbtn3 = "";
var mainbody = "";
var dir1 = "http://localhost:3000/images/mainback.png";
var dir2 = "http://localhost:3000/images/8.jpg";
var dir3 = "http://localhost:3000/images/6.jpg";
class Main extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      compName : "",
      currentUser : "",
      currentUser_avatar: "",
    }
    this.Tabclick = this.Tabclick.bind(this);
    this.Tabclick = this.Tabclick.bind(this);
    this.Tabclick = this.Tabclick.bind(this);
    this.Logout = this.Logout.bind(this);
  }

  componentWillMount() {
    const Session_flag = localStorage.getItem('currentUser');
    const nowAvatar = localStorage.getItem('currentUser_avatar');
     if(Session_flag == "")
        window.location.href ="/";
    else {
      this.setState({currentUser : Session_flag,});
    }
    this.setState({
      compName: "Table",
      currentUser_avatar: nowAvatar,
    })
  }
  Logout() {
    const to="";
    localStorage.setItem('currentUser' , to);
    localStorage.setItem('currentUser_avatar' , to);
    window.location.href="/Main/main"; 
  }
  Tabclick(flag) {
      tabbtn1 = document.getElementById("tab_1");
      tabbtn2 = document.getElementById("tab_2");
      tabbtn3 = document.getElementById("tab_3");
      mainbody = document.getElementById("mainbody");
    switch(flag) {
      case 1:
        this.setState({
          compName: "Table",
        });
        mainbody.setAttribute("style" , "background-image: url("+dir1+");");
        tabbtn1.setAttribute("style", "font-weight:bold; text-decoration: underline;");
        tabbtn2.setAttribute("style", "font-weight:normal; text-decoration: none;");
        tabbtn3.setAttribute("style", "font-weight:normal; text-decoration: none;");
        break;
      case 2:
        this.setState({
          compName: "Leader",
        });
        mainbody.setAttribute("style" , "background-image: url("+dir2+");");
        tabbtn2.setAttribute("style", "font-weight:bold; text-decoration: underline;");
        tabbtn1.setAttribute("style", "font-weight:normal; text-decoration: none;");
        tabbtn3.setAttribute("style", "font-weight:normal; text-decoration: none;");
        break; 
      case 3:
        this.setState({
          compName: "Avatar",
        });
        mainbody.setAttribute("style" , "background-image: url("+dir3+");");
        tabbtn3.setAttribute("style", "font-weight:bold; text-decoration: underline;");
        tabbtn1.setAttribute("style", "font-weight:normal; text-decoration: none;");
        tabbtn2.setAttribute("style", "font-weight:normal; text-decoration: none;");
        break;
      default:
        break; 
    }
  }
  mySwitchFunction = (param) => {
    switch (param) {
       case 'Table':
          return ([
             <Table />
          ]);
        case 'Leader':
          return ([
              <Leader />
            ]);
        case 'Avatar':
          return ([
              <Avatar />
            ]);
        default: 
          break;
    }
 }
  render() {
    return (

      <div className='mainbody' id="mainbody">
        <div className="header">
          <div className="main_container">
            <div className="logo_div">
              <img className="main_logo" src="../../images/PNG.png" alt="loading..." />
            </div>
            <div className="he_an_div"> 
              <img className="main_h_img" src="../../images/header4.png" alt="loading..." />
              <div className="header_tab">
                <button className="tab tab_1" onClick={() => { this.Tabclick(1)}} id="tab_1">TicketList</button>
                <button className="tab tab_2" onClick={() => { this.Tabclick(2)}} id="tab_2">LeaderBoard</button>
                <button className="tab tab_3" onClick={() => { this.Tabclick(3)}} id="tab_3">NinjaShop</button>
              </div>
            </div>
            <div className='log_out'>
              <div className="user_avatar">
                <img className="user_avatar" src={this.state.currentUser_avatar} alt="loading..." />
              </div>
              <div className="user_div">
                <input type="text" className="user_id_input" value={this.state.currentUser} id="user_id_input" />
              </div>
              <div className="logbtndiv">
                <button className="logout_btn" onClick={this.Logout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
        { this.mySwitchFunction(this.state.compName) }
      </div>
    );
  }
}

Main.propTypes = {
  getLogin: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.present
});
export default connect(
  mapStateToProps,
  { getLogin , logoutUser }
)(Main);