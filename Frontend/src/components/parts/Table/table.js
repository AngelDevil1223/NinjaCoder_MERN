import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTickets, getBiders , getPages } from '../../../actions/postActions';
import axios from 'axios';
import './table.css';

var detaildiv = "" ;
var listdiv = "";
var bidlistlabel = "";
var detaillabel = "";
var maininfo = {};
var totalpagenum = 0;
var lastpagenum = 0;

class Table extends Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.Bid = this.Bid.bind(this);
    this.Close = this.Close.bind(this);
    this.state = {
      currentTitle: "",
      currentDes: "",
      currentTask: "",
      currentPageNum: 1,
      PageSize: 6,
      uploadurl: [],
      currentWho: "",
      review: "",
      rating: "",
      currentavatar: "",
      currentTicket: "",
    }
    this.listtab = this.listtab.bind(this);
    this.detailtab = this.detailtab.bind(this);
    this.firstPagination = this.firstPagination.bind(this);
    this.prevPagination = this.prevPagination.bind(this);
    this.nextPagination = this.nextPagination.bind(this);
    this.lastPagination = this.lastPagination.bind(this);
  }
  componentWillMount() {
    maininfo.pagenum = this.state.currentPageNum;
    maininfo.pagesize = this.state.PageSize;
    this.props.getPages(maininfo); 
     axios.get("http://localhost:5000/freelancing/api/get/cnttickets").then(res => {
      totalpagenum = res.data;
    });
  }
  ChangePagesize(e) {
    if(e.target.value == "")
    {
      this.setState({
        "PageSize" : 5,
        "currentPageNum" : 1,
      });
      maininfo.pagesize = 5;
      maininfo.pagenum = 1;
      this.props.getPages(maininfo);
      return;
    }
    this.setState({
      "PageSize" : e.target.value,
      "currentPageNum" : 1,
    });
    maininfo.pagenum = 1;
    maininfo.pagesize = e.target.value;
    this.props.getPages(maininfo);
  }

   lastPagination() {
    lastpagenum = Math.ceil(totalpagenum / this.state.PageSize);
    this.setState({
      currentPageNum: lastpagenum, 
    })
    maininfo.pagenum = lastpagenum;
    maininfo.pagesize = this.state.PageSize;
    this.props.getPages(maininfo);
  }

  firstPagination() {
    this.setState({
      currentPageNum: 1,
    })
    maininfo.pagenum = 1;
    maininfo.pagesize = this.state.PageSize;
    this.props.getPages(maininfo);
  }
  nextPagination() {
    var flag1 = 0;
    if((totalpagenum % this.state.PageSize) == 0 )
      flag1 = 1;
    else
      flag1 = 0;
    if((this.state.currentPageNum + flag1 ) > (totalpagenum / this.state.PageSize) )
      return;
    this.setState ({
      currentPageNum: this.state.currentPageNum + 1,
    });
    maininfo.pagenum = this.state.currentPageNum + 1;
    maininfo.pagesize = this.state.PageSize;
    this.props.getPages(maininfo);
  }
  prevPagination() {
    if(this.state.currentPageNum == 1)
      return;
    else {
      this.setState ({
        currentPageNum: this.state.currentPageNum - 1,
      });
      maininfo.pagenum = this.state.currentPageNum - 1;
      maininfo.pagesize = this.state.PageSize;
      this.props.getPages(maininfo);
    }
  }
  Close() {
    document.getElementById("price_input").value = "";
    document.getElementById("description_textarea").value = "";
    document.getElementById("deadline_input").value = "";
  }
  Bid() {
    var biddata = {};
    biddata.bider_id = localStorage.getItem('currentUser');
    biddata.bider_url = localStorage.getItem('currentUser_avatar');
    biddata.ticket_id = this.state.currentTask;
    biddata.bid_price = document.getElementById("price_input").value;
    biddata.bid_description = document.getElementById("description_textarea").value;
    biddata.bid_deadline = document.getElementById("deadline_input").value;
    if (biddata.bid_deadline == "" || biddata.bid_description =="" || biddata.bid_price == "")
    {
      alert("All field are Required");
    }
    else {
        axios.post("http://localhost:5000/freelancing/api/freelancer/bid", biddata).
        then(res=>{
          document.getElementById("price_input").value = "";
          document.getElementById("description_textarea").value = "";
          document.getElementById("deadline_input").value = "";
          alert("success your bid");
          document.getElementById("myModal").setAttribute("style" , "display:none;");
        })
        .catch(err => {
          alert("you are already bidded this task!");
          document.getElementById("myModal").setAttribute("style" , "display:none;");
        });
      }
    }
    onClick(id, flag , ticket) {
    if(flag === "Assigned")
      return;
    else if(flag === "Not Assigned") {

      console.log("upload files list" + ticket.ticket_upload.length);
      if(ticket.ticket_upload) {
          this.setState({ uploadurl:ticket.ticket_upload}) 
      }
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
        })
         this.props.getBiders(this.state.currentTask);
      })

    }
    else if(flag === "Complete" || flag === "InComplete") {
      var modal2 = document.getElementById("myModal2");
      this.setState({
        currentWho: ticket.ticket_winner,
        review: ticket.feedback,
        rating: ticket.review,
        currentavatar: ticket.winner_avatar,
        currentTicket: ticket.ticket_name,
      });

      var span = document.getElementsByClassName("close")[1];

      modal2.style.display = "block";

      span.onclick = function() {
        modal2.style.display = "none";
      }

      window.onclick = function(event) {
        if (event.target == modal) {
          modal2.style.display = "none";
        }
      }

    }
  }

  detailtab() {
      listdiv = document.getElementById("tab2");
      detaildiv = document.getElementById("tab1");
      var labeldetail = document.getElementById("detaildiv");
      var labellist = document.getElementById("listdiv");
      labellist.setAttribute("style", "border-bottom: 3px solid #505050; font-size: 25px;");
      labeldetail.setAttribute("style", "border-bottom: none; font-size: 27px;");
      listdiv.setAttribute("style", "display: none;");
      detaildiv.setAttribute("style" , "display: block;");
  }
  listtab() {
      this.props.getBiders(this.state.currentTask);
      listdiv = document.getElementById("tab2");
      detaildiv = document.getElementById("tab1");
      var labeldetail = document.getElementById("detaildiv");
      var labellist = document.getElementById("listdiv");
      labeldetail.setAttribute("style", "border-bottom: 3px solid #505050; font-size: 25px;");
      labellist.setAttribute("style", "border-bottom: none; font-size: 27px;");
      listdiv.setAttribute("style", "display: block;");
      detaildiv.setAttribute("style" , "display: none;");
  }
  render() {
    var result = Object.values(this.props.pages);
    const ticketItems = result.map(ticket => (
        <tr className="tr" key={ticket._id} onClick={() => { this.onClick(ticket._id , ticket.ticket_status , ticket)}} id="tickettabletr">
          <td className="td"> {ticket.ticket_name} </td>
          <td className="td"> {ticket.ticket_skills} </td>
          <td className="td"> {ticket.ticket_price} </td>
          <td className="td"> {ticket.ticket_deadline} </td>
          <td className="td"> {ticket.ticket_status} </td>
          <td className="td"> {ticket.ticket_winner} </td>
        </tr>
      ));

    const biderItems = this.props.biders.map(bider => (
        <tr className="tr" key={bider._id} >
          <td className="td"><img className="bider_avatar" src={bider.bider_url} alt="loading..." /> {bider.bider_id}  </td>
          <td className="td"> {bider.bid_price} </td>
          <td className="td"> {bider.bid_deadline} </td>
        </tr>
    ))
    return (
      <div className='background1'>
        <div className='container3'>
          <label className="rowcnt">Row Count:</label><input className="ChangePagesize" onChange = {e =>this.ChangePagesize(e)} />
          <table className='table'> 
            <tr className='tableheader'  id="tickettableth">
              <th className='tableth'>Title</th>
              <th className='tableth'>Skills Required</th>
              <th className='tableth'>Price</th>
              <th className='tableth'>Deadline</th>
              <th className='tableth'>Status</th>
              <th className='tableth'>Winner</th>
            </tr>
            {ticketItems} 
          </table>
        </div>
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
            <div class="modal-body1" id="tabmodal">
              <div class="tabs">
                <div className="labeldiv">
                  <div className="detaildiv" id="detaildiv" onClick={()=>{this.detailtab()}}>Details</div>
                  <div className="listdiv" id="listdiv" onClick={()=>{this.listtab()}}>Bid List</div>
                </div>
                <div class="tab-2" id="tab1">
                  <div >
                    <div className="task_des_div">
                      <h4> Task Description </h4>
                      <p className="task_des_area">
                        {this.state.currentDes}
                      </p>
                    </div>
                    <div className="task_bid_div">
                      <h4> Your Proposal </h4>
                      <textarea className="task_bid_area" id="description_textarea"></textarea>
                      <div className="task_bid_detail_area">
                        <div className="deadline_div">
                          <p className="deadline_label">Deadline:</p>
                          <input className="deadline_input"  placeholder="2000/2/20 EST 20:00" id="deadline_input"/>
                        </div>
                        <div className="price_div">
                          <p className="price_label">Budget:</p>
                          <input className="price_input" placeholder="$..." id="price_input" />
                        </div>
                        
                           {this.state.uploadurl.map(item => (
                              <a className="download" key={item} href={item}>{item.slice(item.lastIndexOf("-"))}</a>
                            ))}

                      </div>
                    </div>
                    <button className="bid_btn" onClick={() => { this.Bid()}}>Bid</button>
                  </div>
                </div>
                <div class="tab-2" id="tab2">
                  <div >
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
          </div>

        </div>

        <div id="myModal2" class="modal1">
          <div class="modal-content1">
            <div class="modal-header1">
              <span class="close" onClick={()=>{this.Close()}}>&times;</span>
              <h2> {this.state.currentTitle} </h2>
            </div>
            <div class="modal-body1">
              <table className="table1" id="resulttable"><tr><th>Title</th><th>Who</th><th>Review</th><th>Rating</th></tr>
              <tr>
                <td>{this.state.currentTicket}</td>
                <td><img className="winner_avatar" src={this.state.currentavatar} alt="loading..." />{this.state.currentWho}</td>
                <td>{this.state.review}</td>
                <td>{this.state.rating}</td>
              </tr>
              </table>
            </div>
          </div>

        </div>

      </div>
    );
  }
}

Table.propTypes = {
  getTickets: PropTypes.func.isRequired,
  getBiders: PropTypes.func.isRequired,
  getPages: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
  posts: state.posts.items,
  biders: state.posts.biders,
  pages: state.posts.pages,
})

export default connect(mapStateToProps , { getTickets , getBiders , getPages  })(Table);