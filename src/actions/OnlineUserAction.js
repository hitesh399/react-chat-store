import config from '../config'
export const CHAT_PUSH_ONLINE_USER = 'CHAT_PUSH_ONLINE_USER';
export const CHAT_ADD_ONLINE_USER = 'CHAT_ADD_ONLINE_USER';
export const CHAT_DELETE_ONLINE_USER = 'CHAT_DELETE_ONLINE_USER';
export const CHAT_DELETE_ALL_ONLINE_USERS = 'CHAT_DELETE_ALL_ONLINE_USERS';

export function pushOnlineUsers(user_online_keys) {
	return function(dispatch) {
		user_online_keys.forEach((online_user) => {
			return dispatch(newOnlineUser(online_user))
		})
	}
}
export function newOnlineUser(user_online_key) {
	return function(dispatch, getstate) {
		//onlineUsers
		let onlineUsers = getstate().chat.onlineUsers
		onlineUsers = onlineUsers ? onlineUsers : []
		if (!onlineUsers.includes(user_online_key)) {
			return dispatch({
				type: CHAT_ADD_ONLINE_USER,
				payload: {
					user_online_key
				}
			})
		}

	}
}
export function deleteOnlineUser(user_online_key) {

	return {
		type: CHAT_DELETE_ONLINE_USER,
		payload: {
			user_online_key
		}
	}
}

export function deleteAllOnlineUsers() {
	return {
		type: CHAT_DELETE_ALL_ONLINE_USERS,
		payload: {}
	}
}