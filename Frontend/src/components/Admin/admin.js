import React, { Component } from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTickets , getBiders , getPages , getAvatars , getRequests} from '../../actions/postActions';
import axios from 'axios';
import "./admin.css";

var dir = [
  "http://localhost:3000/images/flowback/1.jpg",
  "http://localhost:3000/images/flowback/9.jpg",
  "http://localhost:3000/images/flowback/2.jpg",
  "http://localhost:3000/images/flowback/7.jpg",
  "http://localhost:3000/images/flowback/3.jpg",
  "http://localhost:3000/images/flowback/6.jpg",
  "http://localhost:3000/images/flowback/4.jpg",
  "http://localhost:3000/images/flowback/8.jpg",
  "http://localhost:3000/images/flowback/5.jpg",  
] ;
var i = 0;
var pageinfo = {};
var totalpagenum = 0;
var lastpagenum = 0;

class admin extends Component {
  
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.selectTask = this.selectTask.bind(this);
    this.Post = this.Post.bind(this);
    this.PostTicket = this.PostTicket.bind(this);
    this.nextPagination = this.nextPagination.bind(this);
    this.prevPagination = this.prevPagination.bind(this);
    this.firstPagination = this.firstPagination.bind(this);
    this.lastPagination = this.lastPagination.bind(this);
    this.selectBider = this.selectBider.bind(this);
    this.Award = this.Award.bind(this);
    this.ChangeSelect = this.ChangeSelect.bind(this);
    this.Logout = this.Logout.bind(this);
    this.avatarClick = this.avatarClick.bind(this);
    this.ChangeAvatar = this.ChangeAvatar.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmit =  this.onSubmit.bind(this);
    this.Report = this.Report.bind(this);

    this.state = {
      currentTitle: "",
      currentDes: "",
      currentTask: "",
      currentTaskskills: "",
      currentPage: 1,
      currentBidername: "",
      currentBideravatar: "",
      currentAvatarurl: "",
      currentAvatarbudget: 0,
      imgCollection: "",
      feedback: "",
      review: 1,
      currentticket_id: "",
    }

    pageinfo.pagenum = this.state.currentPage;
    pageinfo.pagesize = 4;
  }

  componentWillMount() {
    setInterval(this.myFunction, 60000);
    this.props.getPages(pageinfo); 
    // this.props.getTickets();
    axios.get("http://localhost:5000/freelancing/api/get/cnttickets").then(res => {
      totalpagenum = res.data;
    });
  }
  
  componentWillReceiveProps(nextProps) {

  }

  Report() {
    var Reportdata = {};
    Reportdata.id = this.state.currentticket_id;
    Reportdata.review = document.getElementById("review_area").value;
    Reportdata.feedback = document.getElementById("feedback_area").value;
    axios.post("http://localhost:5000/freelancing/api/submit/result" , Reportdata).then(res=>{
      alert("Report success");
      var feedbackmodal = document.getElementById("feedback");
      feedbackmodal.setAttribute("style", "display: none; ");
    });
  }
  onFileChange(e) {
        this.setState({ imgCollection: e.target.files });
    }

  onSubmit(e) {
      e.preventDefault()
      var formData = new FormData();
      for (const key of Object.keys(this.state.imgCollection)){
          formData.append('imgCollection', this.state.imgCollection[key]);
      }
      console.log(formData);
      
      axios.post("http://localhost:5000/freelancing/api/upload-images", formData, {
      }).then(res => {
          console.log("this is result " + res.data);
      }).catch((error) => {
          console.log("this is error" + error);
        })
  }

  ChangeAvatar(id , who , url) {
    var changeavatardata = {};
    changeavatardata._id = id ; 
    changeavatardata.avatar_url = url;
    changeavatardata.request_id = who;
    changeavatardata.value =  document.getElementById(id).value;
    axios.post("http://localhost:5000/freelancing/api/permission/avatar" , changeavatardata).then(res=> {
      var modal4 = document.getElementById("myModal4");
      modal4.setAttribute("style", "display: none;");
      this.props.getRequests(url);
      this.props.getAvatars();
    });
  }

  avatarClick(id , flag , price) {
    if(flag == 1)
      return;
    else {
      var modal = document.getElementById("myModal4");
      var span = document.getElementsByClassName("close")[3];

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
      this.props.getRequests(id);
    }
  }

  Logout() {
    window.location.href = '/';
  }

  goToModal(id) {
    var feedback = document.getElementById("feedback");
    var span = document.getElementsByClassName("close")[3];
    this.setState({
      currentticket_id: id,
    })
    feedback.style.display = "block";

    span.onclick = function() {
      feedback.style.display = "none";
    }

    window.onclick = function(event) {
      if (event.target == feedback) {
        feedback.style.display = "none";
      }
    }
  }

  ChangeSelect(id , user) {
    var selectValue = document.getElementById(id).value;
    var ChangeSelectdata = {};
    ChangeSelectdata._id = id;
    ChangeSelectdata.value = selectValue;
    ChangeSelectdata.user = user;
    
    axios.post("http://localhost:5000/freelancing/api/status/changed" , ChangeSelectdata).then(res =>{
      var maininfo = {};
      maininfo.pagenum = this.state.currentPage;
      maininfo.pagesize = 4;
      this.props.getPages(maininfo);
      if(selectValue == "Complete" || selectValue == "InComplete" )
        this.goToModal(id);
    })
  }

  Award() {
    var awarddata = {};
    awarddata.ticket_id = this.state.currentTask;
    awarddata.bider_id = this.state.currentBidername;
    awarddata.bider_price = document.getElementById("bidprice_input").value;
    awarddata.bider_deadline = document.getElementById("biddeadline_input").value ;
    awarddata.bider_url = this.state.currentBideravatar;

    axios.post("http://localhost:5000/freelancing/api/award/ticket" , awarddata).then(res => {
      var maininfo = {};
      maininfo.pagenum = this.state.currentPage;
      maininfo.pagesize = 4;
      this.props.getPages(maininfo);
      var modal = document.getElementById("myModal");
      var modal2 = document.getElementById("myModal2");
      modal.setAttribute("style", "display: none;");
      modal2.setAttribute("style", "display: none;");
    })
  }

  selectBider(data) {
    this.setState({
      currentBideravatar: data.bider_url,
      currentBidername: data.bider_id,
    })

     var modal = document.getElementById("myModal2");
      var span = document.getElementsByClassName("close")[2];

      modal.style.display = "block";

      span.onclick = function() {
        modal.style.display = "none";
      }

      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }

      document.getElementById("biddes").value = data.bid_description;
      document.getElementById("biddeadline_input").value = data.bid_deadline;
      document.getElementById("bidprice_input").value = data.bid_price;
         
  }

  lastPagination() {
    lastpagenum = Math.ceil(totalpagenum / 4);
    this.setState({
      currentPage: lastpagenum, 
    })
    pageinfo.pagenum = lastpagenum;
    pageinfo.pagesize = 4;
    this.props.getPages(pageinfo);
  }

  firstPagination() {
    this.setState({
      currentPage: 1,
    })
    pageinfo.pagenum = 1;
    pageinfo.pagesize = 4;
    this.props.getPages(pageinfo);
  }

  nextPagination() {
    if(this.state.currentPage > (totalpagenum / 4) )
      return;
    this.setState ({
      currentPage: this.state.currentPage + 1,
    });
    pageinfo.pagenum = this.state.currentPage + 1;
    pageinfo.pagesize = 4;
    this.props.getPages(pageinfo);
  }

  prevPagination() {
    if(this.state.currentPage == 1)
      return;
    else {
      this.setState ({
        currentPage: this.state.currentPage - 1,
      });
      pageinfo.pagenum = this.state.currentPage - 1;
      pageinfo.pagesize = 4;
      this.props.getPages(pageinfo);
    }
  }

  PostTicket() {
    let postdata = {};
    postdata.ticket_name = document.getElementById("posttitle").value;
    postdata.ticket_description = document.getElementById("postdes").value;
    postdata.ticket_skills = document.getElementById("postskills").value;
    postdata.ticket_price = document.getElementById("postprice_input").value;
    postdata.ticket_deadline = document.getElementById("postdeadline_input").value;
    
    var modal1 = document.getElementById("myModal1");
    if (postdata.ticket_deadline == "" || postdata.ticket_price == "" || postdata.ticket_skills == "" || postdata.ticket_description == "" || postdata.ticket_name == "")
    {
      alert("All field are Required");
    }
    else {
      axios.post("http://localhost:5000/freelancing/api/ticket/post", postdata).then(res=> {
        modal1.setAttribute("style", "display: none;");
        this.props.getTickets();
      }).catch(err => {
        alert(err);
      })
    }
  }

  Post() {
    var modal = document.getElementById("myModal1");
      var span = document.getElementsByClassName("close")[1];

      modal.style.display = "block";

      span.onclick = function() {
        modal.style.display = "none";
      }

      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
  }
  myFunction() {
    if(i > 8)
      i = i % 9;
    document.getElementById("mainbody1").setAttribute("style", "background-image: url("+ dir[i] +")");
    i++;
  }
  selectTask(id, flag) {
    if(flag != "Not Assigned")
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
      axios.get("http://localhost:5000/freelancing/api/freelancer/tickets" + "/" + id ).then(res=>{
        this.setState({
          "currentTitle": res.data.ticket_name,
          "currentDes": res.data.ticket_description,
          "currentTask": res.data._id,
          "currentTaskskills": res.data.ticket_skills,
        })
        this.props.getBiders(this.state.currentTask);
      })

    }
  }
  onClick(flag) {
    var content1 = document.getElementById("content1");
    var content2 = document.getElementById("content2");
    var ticketa = document.getElementById("ticketa");
    var avatara = document.getElementById("avatara");    

    switch(flag) {
      case 1:
        content1.setAttribute("style", "display: inline-block;");
        content2.setAttribute("style", "display: none;");
        ticketa.setAttribute("style", "background-color: black ; color: white;");
        avatara.setAttribute("style", "background-color: #cccccc; color: white;"); 
        break;
      case 2:
        this.props.getAvatars();
        content2.setAttribute("style", "display: inline-block;");
        content1.setAttribute("style", "display: none;");
        avatara.setAttribute("style", "background-color: black ; color: white;");
        ticketa.setAttribute("style", "background-color: #cccccc; color: white;"); 
        break;
    }
  }

  render() {

    var result = Object.values(this.props.pages);
    const ticketItems = result.map(ticket => (
        <tr className="tr" key={ticket._id} onClick={() => { this.selectTask(ticket._id , ticket.ticket_status)}} >
          <td className="td"> {ticket.ticket_name} </td>
          <td className="td"> {ticket.ticket_skills} </td>
          <td className="td"> {ticket.ticket_price} </td>
          <td className="td"> {ticket.ticket_deadline} </td>
          <td className="td"> <select id={ticket._id} value={ticket.ticket_status} onChange={()=> {this.ChangeSelect(ticket._id , ticket.ticket_winner)}}>
                                <option value="Not Assigned">Not Assigned</option>
                                <option value="Assigned">Assigned</option>
                                <option value="Progressing">Progressing</option>
                                <option value="InComplete">InComplete</option>
                                <option value="Complete">Complete</option>
                              </select></td>
          <td className="td"> <img className="winneravatar" src={ticket.winner_avatar} alt="loading..." />{ticket.ticket_winner} </td>
          <td className="td"> {ticket.ticket_budget} </td>
          <td className="td"> {ticket.winner_deadline} </td>
        </tr>
      ));
    const biderItems = this.props.biders.map(bider => (
        <tr className="tr" key={bider._id} onClick={()=>{this.selectBider(bider)}} >
          <td className="td"><img className="bider_avatar" src={bider.bider_url} alt="loading..." /> {bider.bider_id}  </td>
          <td className="td"> {bider.bid_price} </td>
          <td className="td"> {bider.bid_deadline} </td>
        </tr>
    ));
    var result1 = Object.values(this.props.asklists);
    const asklistItems = this.props.asklists.map(asklist => {
      return <tr className="tr" key={asklist._id}>
                <td className="td"><img className="bider_avatar" src={asklist.Avatar_url} alt="loading..." /></td>
                <td className="td"> { asklist.request_id } </td>
                <td className="td">
                  <select id={asklist._id} value={asklist.status} onChange={()=> {this.ChangeAvatar(asklist._id , asklist.request_id , asklist.Avatar_url )}}>
                    <option value="false">false</option>
                    <option value="true">true</option>
                  </select> 
                </td>
              </tr>
    })


     const avatarItems = this.props.avatars.map(Avatar => {  
          if(Avatar.ava_level === 1)
            return <div className="contain_img" key={Avatar._id}><img className="level" src={Avatar.ava_url} alt="loading.." style={{opacity:Avatar.ava_status == 1 ? 0.3:1}}  id={Avatar.ava_url} onClick={() => { this.avatarClick(Avatar.ava_url , Avatar.ava_status , Avatar.ava_budget)}}/></div>      
      });
    const avatarItems1 = this.props.avatars.map(Avatar => {  
          if(Avatar.ava_level === 2)
            return <div className="contain_img" key={Avatar._id}><img className="level" src={Avatar.ava_url} alt="loading..." style={{opacity:Avatar.ava_status == 1 ? 0.3:1}} id={Avatar.ava_url} onClick={() => { this.avatarClick(Avatar.ava_url , Avatar.ava_status, Avatar.ava_budget)}}/></div>      
      });
    const avatarItems2 = this.props.avatars.map(Avatar => {  
          if(Avatar.ava_level === 3)
            return <div className="contain_img" key={Avatar._id}><img className="level" src={Avatar.ava_url} alt="loading..." style={{opacity:Avatar.ava_status == 1 ? 0.3:1}} id={Avatar.ava_url} onClick={() => { this.avatarClick(Avatar.ava_url , Avatar.ava_status, Avatar.ava_budget)}}/></div>      
      });
    
    
    return (

      <div className='mainbody1' id="mainbody1">
        <div className="adminheader">
            <div className="adminlogodiv">  </div>
            <div className="adminheaderdiv">Faster and Faster , Higher and Higher <button className="adminlogoutbtn" id="adminlogoutbtn" onClick={()=>{this.Logout()}}> Logout</button></div>
        </div>
        <div className="contentbody">
          <div className="sidebar1">
            <a onClick={()=>{this.onClick(1)}} className="active" id="ticketa">Tickets</a>
            <a onClick={()=>{this.onClick(2)}} id="avatara">Avatars</a>
          </div>
          <div className="contentss content1" id="content1">
              <div className="postdiv"><img className="postimg" src="http://localhost:3000/images/post.png" alt="loading..." onClick={()=>{this.Post()}} /></div>
              <table className='table'> 
                <tr className='tableheader'>
                  <th className='tableth'>Title</th>
                  <th className='tableth'>Skills Required</th>
                  <th className='tableth'>Price</th>
                  <th className='tableth'>Deadline</th>
                  <th className='tableth'>Status</th>
                  <th className='tableth'>Winner</th>
                  <th className='tableth'>Budget</th>
                  <th className='tableth'>Winner_deadline</th>
                </tr>
                {ticketItems} 
              </table>
              <div className="footerdiv">
                <div className="pagenumbtngroup">
                  <div className="pageicon firstbtn" onClick={()=>{this.firstPagination()}}></div>
                  <div className="pageicon prevbtn" onClick={()=>{this.prevPagination()}}></div>
                  <div className="pageicon nextbtn" onClick={()=>{this.nextPagination()}}></div>
                  <div className="pageicon lastbtn" onClick={()=>{this.lastPagination()}}></div>
                </div>
              </div>
              <div id="myModal" class="modal1">
                <div class="modal-content1">
                  <div class="modal-header1">
                    <span class="close" onClick={()=>{this.Close()}}>&times;</span>
                    <h2> {this.state.currentTitle} </h2>
                  </div>
                  <div class="modal-body1">
                    <p className="task_des_area">
                      {this.state.currentDes}
                    </p>
                    <p className="task_skill_area">
                      {this.state.currentTaskskills}
                    </p>
                    <div>
                      <table className='table bidlisttable'> 
                        <tr className='tableheader'>
                          <th className='tableth'>Who</th>
                          <th className='tableth'>Budget</th>
                          <th className='tableth'>Deadline</th>
                        </tr>
                         {biderItems}
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div id="myModal1" class="modal1">
                <div class="modal-content1">
                  <div class="modal-header1">
                    <span class="close" onClick={()=>{this.Close()}}>&times;</span>
                    <h2> Post Ticket! </h2>
                  </div>
                  <div class="modal-body1">
                    <label className="titlelabel">Title</label><input className="posttitle" id="posttitle" />
                    <label className="deslabel">Description</label><textarea className="postdes" id="postdes" />
                    <div>
                      <label className="titlelabel">Skills</label><input className="skills" id="postskills" />
                      <div className="deadline_div">
                        <p className="deadline_label">Deadline:</p>
                        <input className="deadline_input"  placeholder="2000/2/20 EST 20:00" id="postdeadline_input"/>
                      </div>
                      <div className="price_div">
                        <p className="price_label">Budget:</p>
                        <input className="price_input" placeholder="$..." id="postprice_input" />
                      </div>

                      <form onSubmit={this.onSubmit}  encType="multipart/form-data">
                          <div className="form-group">
                              <input type="file" name="imgCollection" onChange={this.onFileChange} multiple />
                          </div>
                          <div className="form-group">
                              <button className="btn btn-primary" type="submit">Upload</button>
                          </div>
                      </form>

                    </div>
                    <div className="modalpostdiv"><button className="modalpostbtn" onClick={()=>{this.PostTicket()}}> Post </button></div>
                  </div>
                </div>
              </div>


              <div id="myModal2" class="modal1">
                <div class="modal-content1">
                  <div class="modal-header1" id="bidermodalheader">
                    <span class="close" onClick={()=>{this.Close()}}>&times;</span>
                    <img className="currentBiderAvatar" src={this.state.currentBideravatar} alt="loading..." /><h2 className="currentBidername">{this.state.currentBidername}</h2>
                  </div>
                  <div class="modal-body1">
                    <label className="deslabel">Bid Sentence</label><textarea className="postdes" id="biddes" disabled/>
                    <div>
                      <div className="deadline_div">
                        <p className="deadline_label">Deadline:</p>
                        <input className="deadline_input" id="biddeadline_input" disabled/>
                      </div>
                      <div className="price_div">
                        <p className="price_label">Budget:</p>
                        <input className="price_input" id="bidprice_input" disabled/>
                      </div>
                    </div>
                    <div className="modalpostdiv"><button className="modalpostbtn" onClick={()=>{this.Award()}}> Award </button></div>
                  </div>
                </div>
              </div>


              <div id="feedback" class="modal1">
                <div class="modal-content1">
                  <div class="modal-header1">
                    <span class="close" onClick={()=>{this.Close()}}>&times;</span>
                    <h2>Left feedback and review</h2> 
                  </div>
                  <div class="modal-body1">
                    <label className="label feedbacklabel">Feedback</label><textarea className="task_bid_area" id="feedback_area"></textarea>
                    <label className="label">Review</label><input className="price_input" id="review_area" />
                    <div className="feedbackdiv">
                      <button className="Report" onClick={() => {this.Report()}}> Report </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div className="contentss content2" id="content2">
              <div className='container4'>
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

              <div id="myModal4" class="modal1">
                <div class="modal-content1">
                  <div class="modal-header1">
                    <span class="close" onClick={()=>{this.Close()}}>&times;</span>
                    <img className="avatarshow" src={this.state.currentAvatarurl} alt="loading..." />
                    <h3 className="avatarpriceshow"> {this.state.currentAvatarbudget}  </h3> 
                  </div>
                  <div class="modal-body1">
                    <table className='table bidlisttable'> 
                      <tr className='tableheader'>
                        <th className='tableth'>Avatar</th>
                        <th className='tableth'>Who</th>
                        <th className='tableth'>Status</th>
                      </tr>
                       {asklistItems}
                    </table>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
    );
  }
}

admin.propTypes = {
  getTickets: PropTypes.func.isRequired,
  getBiders: PropTypes.func.isRequired,
  getPages: PropTypes.func.isRequired,
  getAvatars: PropTypes.func.isRequired,
  getRequests: PropTypes.func.isRequired,
  avatars: PropTypes.array.isRequired,
  posts: PropTypes.array.isRequired,
  asklists: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
  biders: state.posts.biders,
  posts: state.posts.items,
  pages: state.posts.pages,
  avatars: state.posts.avatars,
  asklists: state.posts.asklists,
})

export default connect(mapStateToProps , { getTickets, getBiders , getPages , getAvatars , getRequests})(admin);