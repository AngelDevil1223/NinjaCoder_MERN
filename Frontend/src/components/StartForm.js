import React, { Component } from 'react';
import "./custom.css";
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom';

var errinput="";
var errorcode="";
class StartForm extends Component {
    constructor (props) {
        super(props);
        this.state = {
            user_id: "",
            err: "",        
        };
        this.onChange = this.onChange.bind(this); 
        this.login = this.login.bind(this);
    }
  onChange(e) {
    this.setState({user_id: e.target.value});
    console.log(this.state.user_id);
  }
  myFunction() {
    errinput = document.getElementById("err_id");
    errinput.setAttribute("style", "display: none;");
    }
  goOn(flag) {
    axios.get('http://localhost:5000/freelancing/api/get/avatars' + '/' + flag)
        .then(result => {
          localStorage.setItem('currentUser_avatar', result.data.Leader_avatar);
          window.location.href='/Main/main';
          localStorage.setItem('currentUser_avatar', result.data.Leader_avatar);
        })
        .catch(err=>console.log(err));
  }
  login() {
      const user_id = this.state.user_id;
      axios.post('http://localhost:5000/freelancing/api/auth/login', { user_id: user_id})
      .then(res=> {
          if(res.data.id === "admin") {
            window.location.href = '/Main/admin';
          }
          else {
            localStorage.setItem('currentUser', res.data.id);
            this.goOn(res.data.id);
          }
        })
      .catch(err => {
        let str1 = String(err);
        str1 = str1.slice(-1);
        errinput = document.getElementById("err_id");
        errinput.setAttribute("style", "display: block;");
        switch(str1) {
          case '0':
            errorcode = "The field is required";
            errinput.value = errorcode;
            setTimeout(this.myFunction, 3000);
            break;
          case '1':
            errorcode = "Wait our Permission";
            errinput.value = errorcode;
            setTimeout(this.myFunction, 3000);
            break;
          case '4':
            errorcode = "Your account does not exist";
            errinput.value = errorcode;
            setTimeout(this.myFunction, 3000);
            break;
          default:
            break;
        }
      })
    }

  render() {
    return (
      <div className="Form">
          <div className="Form_p"><p className="Form_text"> Login </p></div>
          <input style={{display:'none'}} value={this.state.err} onChange={this.onChange} id="err_id" />
          <div className="Form_content">
            <p className="Form_id">ID:</p>
            <input className="Form_input" onChange={this.onChange} value={this.state.user_id} />
          </div>
          <div className="Form_footer">
            <img className="toimg" src="./images/register_png1.png" alt="loading"/>
            <img className="hereimg" onClick={()=> window.location.href='/register'} src="./images/register_png2.png" alt="loading" />
          </div>
          <div className="Form_img" onClick={()=>{this.login()}}>
            
          </div>
      </div>
    );
  }
}

StartForm.propTypes = {
  posts: PropTypes.array.isRequired,
}
const mapStateToProps = state => ({
  posts: state.posts.present
})

export default connect(mapStateToProps , {})(StartForm);