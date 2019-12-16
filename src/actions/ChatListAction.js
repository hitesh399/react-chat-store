import config from '../config'
export const CHAT_NEW_CHATLIST = 'CHAT_NEW_CHATLIST';
export const CHAT_DELETE_CHATLIST = 'CHAT_DELETE_CHATLIST';
export const CHAT_UPDATE_CHAT_LIST = 'CHAT_UPDATE_CHAT_LIST';
export const CHAT_PUSH_CHATLIST = 'CHAT_PUSH_CHATLIST';
export const CHAT_UNSHIFT_CHATLIST = 'CHAT_UNSHIFT_CHATLIST';
export const CHAT_UPDATE_CHAT_LIST_DYNAMICALLY = 'CHAT_UPDATE_CHAT_LIST_DYNAMICALLY';

export function newChatList(chat_list) {
	return function(dispatch, getstate) {
		const chat_list_id = config.getChatListId(chat_list)
		const chat_list_id_key = config.getChatListKeyName(chat_list)
		let chatlist = getstate().chat.chatList
		chatlist = chatlist ? chatlist : []
		let has_chatlist = false
		/**
		 * Check mesasge is already in collection
		 */
		chatlist.every(function(item) {
			const _chat_list_id = item[chat_list_id_key]
			if (_chat_list_id === chat_list_id) {
				has_chatlist = true
				return false;
			}
			return true;
		})
		if (!has_chatlist) {
			dispatch({
				type: CHAT_NEW_CHATLIST,
				payload: {
					chat_list
				}
			})
		} else {
			dispatch(updateChatList(chat_list))
		}
	}
}

export function updateChatList(chat_list) {
	return {
		type: CHAT_UPDATE_CHAT_LIST,
		payload: {
			chat_list
		}
	}
}

export function updateChatListDynamically(callBack) {
	return {
		type: CHAT_UPDATE_CHAT_LIST_DYNAMICALLY,
		payload: {
			callBack
		}
	}
}

export function deleteChatList(chat_list_id) {
	return {
		type: CHAT_DELETE_CHATLIST,
		payload: {
			chat_list_id
		}
	}
}

export function pushChatList(chat_lists) {
	return {
		type: CHAT_PUSH_CHATLIST,
		payload: {
			chat_lists			
		}
	}
}

export function unshiftChatList(chat_lists) {
	return {
		type: CHAT_UNSHIFT_CHATLIST,
		payload: {
			chat_lists
		}
	}
}