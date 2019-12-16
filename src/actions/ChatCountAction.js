import config from '../config'
export const CHAT_UNREAD = 'CHAT_UNREAD';
export const CHAT_UNREAD_INCREMENT = 'CHAT_UNREAD_INCREMENT';
export const CHAT_UNREAD_DECREMENT = 'CHAT_UNREAD_DECREMENT';
export const CHAT_TYPING_ON = 'CHAT_TYPING_ON';
export const CHAT_TYPING_OFF = 'CHAT_TYPING_OFF';

export function unread (total, chat_list_id){
	return {
		type: CHAT_UNREAD,
		payload: {
			total,
			chat_list_id
		}
	}
}

export function unreadIncrement(chat_list_id){
	return {
		type: CHAT_UNREAD_INCREMENT,
		payload: {
			chat_list_id
		}
	}
}

export function unreadDecrement(chat_list_id){
	return {
		type: CHAT_UNREAD_DECREMENT,
		payload: {
			chat_list_id
		}
	}
}

export function typingOn(chat_list_id) {
	return {
		type: CHAT_TYPING_ON,
		payload: {
			chat_list_id
		}
	}
}

export function typingOff(chat_list_id) {
	return {
		type: CHAT_TYPING_OFF,
		payload: {
			chat_list_id
		}
	}
}