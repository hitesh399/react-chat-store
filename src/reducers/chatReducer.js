import {
	OPEN_NEW_CHAT_BOX,
	DELETE_CHAT_BOX,
	ACTIVE_CHAT_BOX,
	DEACTIVE_CHAT_BOX,
	DELETE_ALL_CHAT_BOX,
	MAKE_DIM_CHAT_BOX,
	MAKE_HIGHLIGHT_CHAT_BOX,
	MAKE_INACTIVE_ALL_CHAT_BOX,
	MAKE_GAP_FROM_RIGHT,
	MAKE_COLLAPSE_CHAT_BOX,
	MAKE_EXPAND_CHAT_BOX,
	ENABLE_MOBILE,
	DISABLE_MOBILE
} from '../actions/MessageBoxAction';


import {
	CHAT_NEW_CHATLIST,
	CHAT_DELETE_CHATLIST,
	CHAT_UPDATE_CHAT_LIST,
	CHAT_PUSH_CHATLIST,
	CHAT_UNSHIFT_CHATLIST,
	CHAT_UPDATE_CHAT_LIST_DYNAMICALLY,
	CHAT_ADD_CHATLIST
} from '../actions/ChatListAction'

import {
	CHAT_NEW_MESSAGE,
	CHAT_DELETE_MESSAGE,
	CHAT_UPDATE_MESSAGE,
	CHAT_PUSH_MESSAGES,
	CHAT_UNSHIFT_MESSAGES,
	CHAT_MAKE_READ,
	CHAT_UPDATE_MESSAGES
} from '../actions/ChatHistoryAction'

import {
	CHAT_UNREAD,
	CHAT_UNREAD_INCREMENT,
	CHAT_UNREAD_DECREMENT,
	CHAT_TYPING_ON,
	CHAT_TYPING_OFF
} from '../actions/ChatCountAction'

import {
	CHAT_ADD_ONLINE_USER,
	CHAT_DELETE_ONLINE_USER,
	CHAT_DELETE_ALL_ONLINE_USERS,
} from '../actions/OnlineUserAction'



import {
	hasRequiredWidth,
	getMaxOrder,
	getMinOrder,
	makeFreeSpace,
	makeNewItem,
	nextOffset,
	reArrangePossition
} from '../helper'

import config from '../config'

let defaultStructure = {
	items: [], // For Chat Boxes
	firstBoxgap: 0,
	onlineUsers: [], // To Contains list of online users
	chatList: [], // To COntains the list of Chat 
	histories: {}, // To Contains the list of message history separate by [chat id] like: { chat_{id}: [] }
	chatCount: {},
	isMobile: false

}

const chatBoxActions = [
	MAKE_EXPAND_CHAT_BOX,
	OPEN_NEW_CHAT_BOX,
	MAKE_COLLAPSE_CHAT_BOX,
	DELETE_CHAT_BOX,
	DELETE_ALL_CHAT_BOX,
	MAKE_GAP_FROM_RIGHT,
	ACTIVE_CHAT_BOX,
	DEACTIVE_CHAT_BOX,
	DELETE_ALL_CHAT_BOX,
	MAKE_DIM_CHAT_BOX,
	MAKE_HIGHLIGHT_CHAT_BOX,
	MAKE_INACTIVE_ALL_CHAT_BOX
]

const chatHistoryActions = [
	CHAT_NEW_MESSAGE,
	CHAT_DELETE_MESSAGE,
	CHAT_UPDATE_MESSAGE,
	CHAT_PUSH_MESSAGES,
	CHAT_UNSHIFT_MESSAGES,
	CHAT_MAKE_READ,
	CHAT_UPDATE_MESSAGES
]

const chatListActions = [
	CHAT_NEW_CHATLIST,
	CHAT_DELETE_CHATLIST,
	CHAT_UPDATE_CHAT_LIST,
	CHAT_PUSH_CHATLIST,
	CHAT_UNSHIFT_CHATLIST,
	CHAT_UPDATE_CHAT_LIST_DYNAMICALLY,
	CHAT_ADD_CHATLIST
]

const ChatCountActions = [
	CHAT_UNREAD,
	CHAT_UNREAD_INCREMENT,
	CHAT_UNREAD_DECREMENT,
	CHAT_TYPING_ON,
	CHAT_TYPING_OFF
]
const chatOnlineUserActions = [
	CHAT_ADD_ONLINE_USER,
	CHAT_DELETE_ONLINE_USER,
	CHAT_DELETE_ALL_ONLINE_USERS
]
export const chatReducer = (state, action) => {

	if (![ENABLE_MOBILE, DISABLE_MOBILE, ...chatBoxActions, ...chatHistoryActions, ...chatListActions, ...ChatCountActions, ...chatOnlineUserActions].includes(action.type)) {
		return state ? state : defaultStructure
	}

	/**
	 * When A chat box related action has been dispatched.
	 */
	if (action.type === ENABLE_MOBILE) {
	 	state.isMobile = true
	 	return {...state}
	} else if (action.type === DISABLE_MOBILE) {
		state.isMobile = false
		return {...state}
	} else if (chatBoxActions.includes(action.type)) {
		return chatBoxManager(state, action)
	} else if (chatHistoryActions.includes(action.type)) {
		return chathistoryManager(state, action)
	} else if (chatListActions.includes(action.type)) {
		return chatListManager(state, action)
	} else if (ChatCountActions.includes(action.type)) {
		return chatCountManager(state, action)
	}  else if (chatOnlineUserActions.includes(action.type)) {
		return onlineUserManager(state, action)
	}else {
		return state
	}
}



function storeChatBoxIntoLocalStorage(items) {
	const activeIds = items.slice().filter(v => (v.status === 'active'))
		.sort((a, b) => a.order - b.order)
		.map(item => config.getChatListId(item))
	localStorage.setItem('chat_boxes', JSON.stringify(activeIds))
}


/**
 * Chat Boxes Amendment in chat state
 */
function chatBoxManager(state, action) {
	const {
		payload: {
			item,
			uniqueId,
			gap
		}
	} = action

	const chat_box_item_index = uniqueId ? state.items.findIndex(v => config.getChatListId(v) === uniqueId) : -1;
	const activeBoxLength = state.items.filter((i => i.status === 'active')).length
	const hasWidth = hasRequiredWidth(activeBoxLength, state.firstBoxgap)

	switch (action.type) {

		case OPEN_NEW_CHAT_BOX:
			const max_order = getMaxOrder(state.items)
			const newItem = makeNewItem(item, state.items)
			let leftOffset = activeBoxLength ? nextOffset(state.firstBoxgap, activeBoxLength) : state.firstBoxgap

			if (!hasWidth) {
				// Inative Last item
				makeFreeSpace(state.items)
			}
			state.items.push({ ...newItem,
				leftOffset
			})

			if (!hasWidth) {
				reArrangePossition(state.items, state.firstBoxgap)
			}
			storeChatBoxIntoLocalStorage(state.items)
			return {
				...state,
				items: state.items.slice()
			}

		case DELETE_CHAT_BOX:
			if (chat_box_item_index !== -1) {
				state.items.splice(chat_box_item_index, 1)
			}

			// Acticated last Inactive Item
			const max_inactive_order = getMaxOrder(state.items, 'inactive')
			if (max_inactive_order) {
				state.items.map(function(v) {
					if (v.order === max_inactive_order) {
						v.status = 'active'
					}
					return v;
				})
			}
			reArrangePossition(state.items, state.firstBoxgap)
			storeChatBoxIntoLocalStorage(state.items)
			return {
				...state,
				items: state.items.slice()
			}
		case ACTIVE_CHAT_BOX:

			if (!hasWidth) {
				// Inative Lastone 
				makeFreeSpace(state.items)
			}
			if (chat_box_item_index !== -1) {
				let leftOffset = activeBoxLength ? nextOffset(state.firstBoxgap, activeBoxLength) : state.firstBoxgap
				let olditem = state.items[chat_box_item_index]
				olditem.leftOffset = leftOffset;
				state.items.splice(chat_box_item_index, 1)
				state.items.push(makeNewItem(olditem, state.items))
			}

			if (!hasWidth) {
				reArrangePossition(state.items, state.firstBoxgap)
			}
			storeChatBoxIntoLocalStorage(state.items)

			return {
				...state,
				items: state.items.slice()
			}

		case DEACTIVE_CHAT_BOX:
			if (chat_box_item_index !== -1) {
				state.items.map(function(v) {
					if (config.getChatListId(v) === uniqueId) {
						v.status = 'inactive'
					}
					return v;
				})
				reArrangePossition(state.items, state.firstBoxgap)
			}
			storeChatBoxIntoLocalStorage(state.items)
			return {
				...state,
				items: state.items.slice()
			}
		case MAKE_INACTIVE_ALL_CHAT_BOX:
			state.items.map(function(v) {
				v.status = 'inactive'
				return v;
			})
			storeChatBoxIntoLocalStorage(state.items)
			return {
				...state,
				items: state.items.slice()
			}
		case MAKE_DIM_CHAT_BOX:
			state.items.map(function(v) {
				if (config.getChatListId(v) === uniqueId) {
					v.highlight = false
				}
				return v;
			})
			return {
				...state,
				items: state.items.slice()
			}
		case MAKE_COLLAPSE_CHAT_BOX:
			state.items.map(function(v) {
				if (config.getChatListId(v) === uniqueId) {
					v.minimize = true
				}
				return v;
			})
			return {
				...state,
				items: state.items.slice()
			}
		case MAKE_EXPAND_CHAT_BOX:
			state.items.map(function(v) {
				if (config.getChatListId(v) === uniqueId) {
					v.minimize = false
				}
				return v;
			})
			return {
				...state,
				items: state.items.slice()
			}
		case MAKE_HIGHLIGHT_CHAT_BOX:
			state.items.map(function(v) {
				if (config.getChatListId(v) === uniqueId) {
					v.highlight = true
				}
				return v;
			})
			return {
				...state,
				items: state.items.slice()
			}
		case MAKE_GAP_FROM_RIGHT:
			state.firstBoxgap = gap
			return {
				...state,
				firstBoxgap: state.firstBoxgap
			}
		case DELETE_ALL_CHAT_BOX:
			state.items = []
			storeChatBoxIntoLocalStorage(state.items)
			return {
				...state,
				items: state.items.slice()
			}
		default:
			return state
	}
}

/**
 * Chat History Amendment in chat state
 */
function chathistoryManager(state, action) {
	const {
		payload: {
			chat_list_id,
		}
	} = action

	const histories = _historyManager(state.histories[`history_of_${chat_list_id}`], action)
	return {
		...state,
		histories: {
			...state.histories,
			[`history_of_${chat_list_id}`]: histories.slice()
		}
	}
}

/**
 * Online user Amendment in chat state
 */
function onlineUserManager(state, action) {
	const {
		payload: {
			user_online_key
		}
	} = action

	switch (action.type) {
		case CHAT_ADD_ONLINE_USER:
			state.onlineUsers.push(user_online_key)
			return {
				...state,
				onlineUsers: state.onlineUsers.slice()
			}
		case CHAT_DELETE_ONLINE_USER:
			const index = state.onlineUsers.findIndex(v => v ===user_online_key)
			if (index !== -1) {
				state.onlineUsers.splice(index, 1)
			}
			return {
				...state,
				onlineUsers: state.onlineUsers.slice()
			}
		case CHAT_DELETE_ALL_ONLINE_USERS: 
			state.onlineUsers = []

			return {
				...state,
				onlineUsers: state.onlineUsers.slice()
			}
		default:
			return state
	}
}

/**
 * Chat list amendment in chat state
 */

function chatListManager(state, action) {
	const {
		payload: {
			chat_list,
			chat_list_id,
			chat_lists,
			callBack
		}
	} = action

	const _chat_list_id = config.getChatListId(chat_list)
	const _chat_list_id_key = config.getChatListKeyName(chat_list)

	switch (action.type) {
		case CHAT_NEW_CHATLIST:
			state.chatList.push(chat_list)
			return {
				...state,
				chatList: state.chatList.slice()
			}
		case CHAT_UPDATE_CHAT_LIST:

			state.chatList.map(function(item, index) {
				if (item[_chat_list_id_key] === _chat_list_id) {
					item = {
						...item,
						...chat_list
					}
				}
				return item
			})
			return {
				...state,
				chatList: state.chatList.slice()
			}
		case CHAT_ADD_CHATLIST:
			return {
				...state,
				chatList: chat_lists.slice()
			}
		case CHAT_DELETE_CHATLIST:
			let _index = null
			state.chatList.every(function(item, i) {
				if (config.getChatListId(item) === chat_list_id) {
					_index = i
					return false
				}
				return true
			})
			if (_index !== null) {
				state.chatList.splice(_index, 1)
			}
			return {
				...state,
				chatList: state.chatList.slice()
			}
		case CHAT_PUSH_CHATLIST:
			chat_lists.forEach(function(item) {
				state.chatList.push(item)
			})
			return {
				...state,
				chatList: state.chatList.slice()
			}
		case CHAT_UNSHIFT_CHATLIST:
			chat_lists.forEach(function(item) {
				state.chatList.unshift(item)
			})
			return {
				...state,
				chatList: state.chatList.slice()
			}

		case CHAT_UPDATE_CHAT_LIST_DYNAMICALLY:
			state.chatList.map(function(item, index) {
				return callBack(item)
			})
			return {
				...state,
				chatList: state.chatList.slice()
			}
		default:
			return state
	}
}


function chatCountManager(state, action) {
	const {
		payload: {
			total,
			chat_list_id,
		}
	} = action

	const pre_unread_total = state.chatCount[`count_for_${chat_list_id}`] && state.chatCount[`count_for_${chat_list_id}`].unread ? state.chatCount[`count_for_${chat_list_id}`].unread : 0

	switch (action.type) {
		case CHAT_UNREAD:
			return {
				...state,
				chatCount: {
					...state.chatCount,
					[`count_for_${chat_list_id}`]: {
						...state.chatCount[`count_for_${chat_list_id}`],
						unread: total
					}
				}
			}
		case CHAT_UNREAD_INCREMENT:


			return {
				...state,
				chatCount: {
					...state.chatCount,
					[`count_for_${chat_list_id}`]: {
						...state.chatCount[`count_for_${chat_list_id}`],
						unread: pre_unread_total + 1
					}
				}
			}
		case CHAT_UNREAD_DECREMENT:
			return {
				...state,
				chatCount: {
					...state.chatCount,
					[`count_for_${chat_list_id}`]: {
						...state.chatCount[`count_for_${chat_list_id}`],
						unread: pre_unread_total ? pre_unread_total - 1 : 0
					}
				}
			}
		case CHAT_TYPING_ON:
			return {
				...state,
				chatCount: {
					...state.chatCount,
					[`count_for_${chat_list_id}`]: {
						...state.chatCount[`count_for_${chat_list_id}`],
						typing: true
					}
				}
			}
		case CHAT_TYPING_OFF:
			return {
				...state,
				chatCount: {
					...state.chatCount,
					[`count_for_${chat_list_id}`]: {
						...state.chatCount[`count_for_${chat_list_id}`],
						typing: false
					}
				}
			}
		default:
			return state
	}
}

function _historyManager(history, action) {
	const {
		payload: {
			message,
			chat_list_id,
			message_id,
			messages,
			time,
			callBack
		}
	} = action
	if (!history) {
		history = []
	}
	switch (action.type) {
		case CHAT_NEW_MESSAGE:
			history.unshift(message)
			return history
		case CHAT_UPDATE_MESSAGE:
			history.map(function(item, index) {
				if (item[config.getHistoryUniqueId()] === message[config.getHistoryUniqueId()]) {
					item = { ...item,
						...message
					}
				}
				return item
			})
			return history
		case CHAT_MAKE_READ:
			history.map(function(item, index) {
				if (!item[config.getReadAtKey()]) {
					item[config.getReadAtKey()] = time
				}
				return item
			})
			return history
		case CHAT_UPDATE_MESSAGES:
			history.map(function(item, index) {
				return callBack(item)
			})
			return history

		case CHAT_DELETE_MESSAGE:
			let _index = null
			history.every(function(item, i) {
				if (item[config.getHistoryUniqueId()] === message_id) {
					_index = i
					return false
				}
				return true
			})
			if (_index !== null) {
				history.splice(_index, 1)
			}
			return history
		case CHAT_PUSH_MESSAGES:
			messages.forEach(function(item) {
				history.push(item)
			})
			return history
		case CHAT_UNSHIFT_MESSAGES:
			messages.forEach(function(item) {
				history.unshift(item)
			})
			return history
		default:
			return history
	}
}