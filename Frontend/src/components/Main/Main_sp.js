import React, { Component } from 'react';
import "../custom.css";
import Header from "../parts/Header/header.js";
import { contentdatasp } from "../../staticdata/contentdatasp.js";
import Content from "../parts/content/content.js";
import Application from "../parts/Application/Application.js";

class Main_sp extends Component {
  render() {
    return (

      <div className="container1">
      	<Header />
      	<div className="content">
      		<div className="left_content">
      			<div className="up_part">
      				{contentdatasp.map(content=> <Content content={content} key={content.question} />)}
      			</div>
      			<div className="un_part">
      				<p className="un_part_h">Application</p>
      				<Application />
      			</div>
      		</div>
      		<div className="right_content">
      			<img className="img" src="../tree.jpg" alt="Browse"/>
      		</div>
      	</div>
      </div>
    );
  }
}

export default Main_sp;