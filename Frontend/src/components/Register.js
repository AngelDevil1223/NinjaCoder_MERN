import React, { Component } from 'react';
import "./custom.css";
import axios from 'axios';

var global_skype_id = "";
class Register extends Component {
  constructor() {
        super();
        this.state = {
            user_id: "",
            skype_id: "",
        };
    }

  register() {
    global_skype_id = document.getElementById("skype_id").value;
    axios.post(`http://localhost:5000/freelancing/api/auth/register`, { user_skypeid: global_skype_id })
      .then(res => {
        alert("success");
      })
       .catch(err => {
        alert(err);
       });
  }

  render() {
    return (
      <div className="Form">
          <div className="Form_p1"><p className="Form_text"> Register </p></div>
          <div className="Form_content">
            <p className="Form_id">Skype:</p>
            <input className="Form_input" onChange={this.onChange} value={this.state.userid} id="skype_id"/>
          </div>
          <div className="Form_footer1">
            <img className="toimg1" src="./images/login_png1.png" alt="loading"/>
            <img className="hereimg1" onClick={()=> window.location.href='/'} src="./images/register_png2.png" alt="loading" />
          </div>
          <div className="Form_img3" onClick={this.register} >     
          </div>
      </div>
    );
  }
}

export default Register;
