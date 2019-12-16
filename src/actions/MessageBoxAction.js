export const OPEN_NEW_CHAT_BOX = 'OPEN_NEW_CHAT_BOX';
export const DELETE_CHAT_BOX = 'DELETE_CHAT_BOX';
export const ACTIVE_CHAT_BOX = 'ACTIVE_CHAT_BOX';
export const DEACTIVE_CHAT_BOX = 'DEACTIVE_CHAT_BOX';
export const DELETE_ALL_CHAT_BOX = 'DELETE_ALL_CHAT_BOX';
export const MAKE_DIM_CHAT_BOX = 'MAKE_DIM_CHAT_BOX';
export const MAKE_HIGHLIGHT_CHAT_BOX = 'MAKE_HIGHLIGHT_CHAT_BOX';
export const MAKE_INACTIVE_ALL_CHAT_BOX = 'MAKE_INACTIVE_ALL_CHAT_BOX';
export const MAKE_GAP_FROM_RIGHT = 'MAKE_GAP_FROM_RIGHT';
export const MAKE_COLLAPSE_CHAT_BOX = 'MAKE_COLLAPSE_CHAT_BOX';
export const MAKE_EXPAND_CHAT_BOX = 'MAKE_EXPAND_CHAT_BOX';

import config from '../config'


export const openChatBox = (item) => {

	const _chat_list_id = config.getChatListId(item)
	const _chat_list_id_key = config.getChatListKeyName(item)
	
	return function(dispatch, getState) {
		const items = getState().chat.items

		const hasItem = items.filter(i  => _chat_list_id === i[_chat_list_id_key])

		if (hasItem.length) {
			// console.log(hasItem[0], 'Testskdhskjd')
			if (hasItem[0].status === 'inactive') {
				dispatch(activeChatBox(hasItem[0][_chat_list_id_key]))	
			}

		} else {

			dispatch({
				type: OPEN_NEW_CHAT_BOX,
				payload: {
					item: item
				}
			})
		}

	}
	
}

export const deleteChatBox = (uniqueId) => {
	return {
		type: DELETE_CHAT_BOX,
		payload: {
			uniqueId: uniqueId
		}
	}
}

export const activeChatBox = (uniqueId) => {
	return {
		type: ACTIVE_CHAT_BOX,
		payload: {
			uniqueId: uniqueId
		}
	}
}

export const deleteAllChatBox = () => {
	return {
		type: DELETE_ALL_CHAT_BOX,
		payload: {}
	}
}

export const chatBoxCollapse = (uniqueId) => {
	return {
		type: MAKE_COLLAPSE_CHAT_BOX,
		payload: {
			uniqueId: uniqueId
		}
	}
}
export const chatBoxExpand = (uniqueId) => {
	return {
		type: MAKE_EXPAND_CHAT_BOX,
		payload: {
			uniqueId: uniqueId
		}
	}
}

export const deactiveChatBox = (uniqueId) => {
	return {
		type: DEACTIVE_CHAT_BOX,
		payload: {
			uniqueId: uniqueId
		}
	}
}

export const makeDim = (uniqueId) => {
	return {
		type: MAKE_DIM_CHAT_BOX,
		payload: {
			uniqueId: uniqueId
		}
	}
}

export const makeHighlight= (uniqueId) => {
	return {
		type: MAKE_HIGHLIGHT_CHAT_BOX,
		payload: {
			uniqueId: uniqueId
		}
	}
}

export const deactiveChatBoxes = () => {

	return {
		type: MAKE_INACTIVE_ALL_CHAT_BOX,
		payload: {}
	}
}
export const makeGap = (gap) => {
	
	return  function (dispatch, getstate)  {

		dispatch({
			type: MAKE_GAP_FROM_RIGHT,
			payload: {
				gap
			}
		})
		let chatBoxes = getstate().chat.items		
		
		dispatch(deleteAllChatBox())		
		chatBoxes.sort(function(a, b) { return a.order > b.order})
		chatBoxes.forEach(item => {
			dispatch(openChatBox(item))
		})
	}
	
}