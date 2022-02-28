import { GET_TICKETS , GET_LEADERS , GET_AVATARS , GET_LOGIN, LOGOUT , GET_BIDERS , GET_PAGES , GET_REQUESTS, GET_FREELANCERS} from './types';
import axios from 'axios';

export const getTickets = () => dispatch => {
	// console.log("fetching");
	axios.get("http://localhost:5000/freelancing/api/freelancer/tickets")
	.then(res => dispatch({
		type: GET_TICKETS,
		payload: res.data,
	}));
}

export const getPages = userdata => dispatch => {
	axios.post("http://localhost:5000/freelancing/api/get/tickets", userdata )
	.then(res => dispatch({
		type: GET_PAGES,
		payload: res.data,
	}));
}

export const getLeaders = () => dispatch => {
	axios.get("http://localhost:5000/freelancing/api/get/leaders")
	.then(res => dispatch({
		type: GET_LEADERS,
		payload: res.data,
	}));
}

export const getAvatars = () => dispatch => {
	axios.get("http://localhost:5000/freelancing/api/get/avatars")
	.then(res => dispatch({
		type: GET_AVATARS,
		payload: res.data,
	}));
}

export const getLogin = userdata => dispatch => {
	axios.post("http://localhost:5000/freelancing/api/auth/login", {user_id:userdata})
	.then(res => dispatch({
		type: GET_LOGIN,
		payload: res.data,
	}));
}
export const logoutUser = () => dispatch => {
	const empty = "";
	return {
		type: LOGOUT,
		payload: empty,
	};
}

export const getBiders = userdata => dispatch => {
	axios.get("http://localhost:5000/freelancing/api/freelancer/biders"+ '/' + userdata)
	.then(res=>dispatch({
		type: GET_BIDERS,
		payload: res.data,
	}))
}

export const getRequests = userdata => dispatch => {
	axios.post("http://localhost:5000/freelancing/api/view/asklist" , {id: userdata}).then(res => dispatch({
		type:GET_REQUESTS,
		payload: res.data,
	}))
}

export const getFreelancers = () => dispatch => {
	axios.get("http://localhost:5000/freelancing/api/get/freelancers").then(res=>dispatch({
		type:GET_FREELANCERS,
		payload: res.data,
	}))
}