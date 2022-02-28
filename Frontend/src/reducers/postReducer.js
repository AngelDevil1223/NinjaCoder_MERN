import { GET_TICKETS , GET_LEADERS , GET_AVATARS , GET_LOGIN , LOGOUT , GET_BIDERS , GET_PAGES , GET_REQUESTS, GET_FREELANCERS } from '../actions/types';


const initialState = {
	items: [],
	leaders: [],
	avatars: [],
	present: [],
	pages: [],
	biders: [],
	asklists: [],
	freelancers: [],
	item: {}
}


export default function(state = initialState , action) {
	switch (action.type) {
		case GET_TICKETS:
			return {
				...state,
				items: action.payload
			}
		case GET_LEADERS:
			return {
				...state,
				leaders: action.payload
			}
		case GET_AVATARS:
			return {
				...state,
				avatars: action.payload
			}
		case GET_LOGIN:
			return {
				...state,
				present: action.payload
			}
		case LOGOUT:
			return{
				...state,
				present: action.payload
			}
		case GET_BIDERS:
			return {
				...state,
				biders: action.payload
			}
		case GET_PAGES: 
			return {
				...state,
				pages: action.payload
			}
		case GET_REQUESTS:
			return {
				...state,
				asklists: action.payload
			}
		case GET_FREELANCERS: {
			return {
				...state,
				freelancers: action.payload
			}
		}
		default:
			return state;
	}
}