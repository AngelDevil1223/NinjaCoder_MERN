import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getLeaders } from '../../../actions/postActions';
import './Leader.css';

class Leader extends Component {
  componentWillMount() {
    this.props.getLeaders(); 
  }

  render() {
    var i = 0;
    const leaderItems = this.props.leaders.map(leader => (
        <tr className="tr" key={leader._id} onClick={this.onClick}>
          <td className="td"> { i = i + 1 } </td>
          <td className="td tdavatar"> <img className="leader_avatar" src={leader.Leader_avatar} alt="loading..." /> {leader.Leader_Name}  </td>
          <td className="td"> {leader.Leader_budget} </td>
          <td className="td"> {leader.Leader_success} </td>
        </tr>
      ))
    return (
      <div className='background1'>
        <div className='container2'>
          <table className='table'> 
            <tr className='tableheader'>
              <th className='tableth'>No</th>
              <th className='tableth'>UserID</th>
              <th className='tableth'>Profit($)</th>
              <th className='tableth'>Success(%)</th>
            </tr>
            { leaderItems } 
          </table>
        </div>
      </div>
    );
  }
}

Leader.propTypes = {
  getLeaders: PropTypes.func.isRequired,
  leaders: PropTypes.array.isRequired,
}
const mapStateToProps = state => ({
  leaders: state.posts.leaders
})

export default connect(mapStateToProps , { getLeaders })(Leader);