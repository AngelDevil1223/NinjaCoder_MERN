import React,  { Component } from "react";
import "./Application.css";
import axios from 'axios';
import { PicturesWall } from '../upload/Upload.js';

class Application extends Component {


      constructor(props) {
        super(props);

        this.onFileChange = this.onFileChange.bind(this);
        this.onSubmit =  this.onSubmit.bind(this);

        this.state = {
            imgCollection: ''
        }
    }
    clickbtn() {
        this.onFileChange();
    }
    onFileChange(e) {
        this.setState({ imgCollection: e.target.files })
    }

    onSubmit(e) {
        e.preventDefault()
        console.log("hello");
        var formData = new FormData();
        for (const key of Object.keys(this.state.imgCollection)){
            formData.append('imgCollection', this.state.imgCollection[key]);
        }
        console.log(formData);
        
        axios.post("http://localhost:4000/api/upload-images", formData, {
        }).then(res => {
            console.log(res.data)
            alert('Done file upload')
        }).catch((error) => {
            alert(" Select the image");
          })
    }

  render() {
    return (
      	<div>
      		<div className="each_appli">
      		    <div className="e_a_d">
                        <p className="in_p">Legal Name:</p>
                        <input className="f_d_i" placeholder="Insert Legal name"/>
      		    </div>
                      <div className="e_a_d">
                        <p className="in_p">Stage Name:</p>
                        <input className="f_d_i" placeholder="Insert Stage name " />
                      </div>
                      <div className="e_a_d">
      			<p className="in_p">City/Location:</p>
                        <input className="f_d_i" placeholder="Insert City/Location" />
                      </div>
                      <div className="e_a_d">
                        <p className="in_p email">Your Email:</p>
                        <input className="f_d_i email_in" placeholder="Insert your email..." />
                      </div>
      		</div>
      		<div className="each_appli">
      			<p className="p_h">Links to accounts</p>
                        <div className="e_a_d">
            			<p className="in_p">Chaturbate</p>
                              <input className="f_d_i"/>
                        </div>
                        <div className="e_a_d">
            			<p className="in_p">LiveJasmin</p>
                              <input className="f_d_i"/>
                        </div>
                        <div className="e_a_d">
            			<p className="in_p">other</p>
                              <input className="f_d_i"/>
                        </div>
                        <div className="e_a_d">
            			<p className="in_p">Twitter</p>
                              <input className="f_d_i"/>
                        </div>
                        <div className="e_a_d">
            			<p className="in_p">Pornhub</p>
                              <input className="f_d_i"/>
                        </div>
                        <div className="e_a_d">
            			<p className="in_p">Instagram</p>
                              <input className="f_d_i"/>
                        </div>
      		</div>
      		<div className="each_appli">
                        <p className="p_h">Photos</p>
      			<p>Headshot</p>
      			<p>Full Front Nude</p>
      			<p>Full Back Nude</p>
      			<p>Show off</p>
      			<p>Face with holding government ID</p>
                        <PicturesWall />
      		</div>
      		<div className="each_appli">
      			<p className="p_h">Mental Health Check</p>
      			<p>Why are you submitting an application?</p>
                        <textarea></textarea>
      			<p>How have you been lately?</p>
                        <textarea></textarea>
      			<p>Have you thought about the how others might react to finding out you had sex on camera?</p>
                        <textarea></textarea>
      		</div>
      		<div className="submit">
      			<button className="submit_btn"> Submit </button>
      		</div>
      	</div>
    );
  }
}

export default Application;