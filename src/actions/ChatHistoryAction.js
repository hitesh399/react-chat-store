import config from '../config'
export const CHAT_NEW_MESSAGE = 'CHAT_NEW_MESSAGE';
export const CHAT_DELETE_MESSAGE = 'CHAT_DELETE_MESSAGE';
export const CHAT_UPDATE_MESSAGE = 'CHAT_UPDATE_MESSAGE';
export const CHAT_UPDATE_MESSAGES = 'CHAT_UPDATE_MESSAGES';
export const CHAT_PUSH_MESSAGES = 'CHAT_PUSH_MESSAGES';
export const CHAT_UNSHIFT_MESSAGES = 'CHAT_UNSHIFT_MESSAGES';
export const CHAT_MAKE_READ = 'CHAT_MAKE_READ';

 import { unreadIncrement } from './ChatCountAction'

//getHistoryUniqueId
export function newMessage(message, chat_list_id, addInUnRead = false) {
	
	const message_id = message[config.getHistoryUniqueId()]
	console.log('message_id___', message, chat_list_id, message_id)

	return function(dispatch, getstate) {		
		let history = getstate().chat.histories[`history_of_${chat_list_id}`];
		history = history ? history : []
		// let has_message = false

		/**
		 * Check mesasge is already in collection
		 */
		const has_message = history.some(function(item) {
			const _message_id = item[config.getHistoryUniqueId()]
			return (_message_id === message_id)
		})
		if (!has_message) {
			dispatch({
				type: CHAT_NEW_MESSAGE,
				payload: {
					message,
					chat_list_id
				}
			})
			if (addInUnRead) {
				dispatch(unreadIncrement(chat_list_id))
			}

		} else {
			dispatch(updateMessage(message, chat_list_id))
		}
	}
}

export function updateMessages(chat_list_id, callBack) {
	if (typeof callBack !== 'function') {
		new Error('Callback should be a function.')
	}
	return {
		type: CHAT_UPDATE_MESSAGES,
		payload: {
			chat_list_id,
			callBack
		}
	}
}

export function updateMessage(message, chat_list_id) {
	return {
		type: CHAT_UPDATE_MESSAGE,
		payload: {
			message,
			chat_list_id
		}
	}
}

export function markAsRead(time, chat_list_list) {
	return {
		type: CHAT_MAKE_READ,
		payload: {
			time,
			chat_list_list
		}
	}
}

export function deleteMessage(message_id, chat_list_id) {
	return {
		type: CHAT_DELETE_MESSAGE,
		payload: {
			message_id,
			chat_list_id
		}
	}
}

export function pushMessages(messages, chat_list_id) {
	return {
		type: CHAT_PUSH_MESSAGES,
		payload: {
			messages,
			chat_list_id
		}
	}
}

export function unshiftMessages(messages, chat_list_id) {
	return {
		type: CHAT_UNSHIFT_MESSAGES,
		payload: {
			messages,
			chat_list_id
		}
	}
}