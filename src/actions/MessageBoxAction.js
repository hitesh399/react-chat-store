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
export const ENABLE_MOBILE = 'ENABLE_MOBILE';
export const DISABLE_MOBILE = 'DISABLE_MOBILE';

import config from '../config'

export const enableOnMobile = () => {
		
	return function(dispatch, getState) {
		dispatch({
			type: ENABLE_MOBILE,
			payload: {}
		})
		const items = getState().chat.items
		const other_active_chat_boxes =  items.filter(i  => i.status === 'active' )
		other_active_chat_boxes.forEach((item, index) => {
			if (index > 0 ) {
				const _chat_list_id = config.getChatListId(item)
				dispatch(deactiveChatBox(_chat_list_id))
			}
		})
	}
}
export const disableOnMobile = () => {
	return {
		type: DISABLE_MOBILE,
		payload: {}
	}
}

export const openChatBox = (item, force_open = true) => {

	const _chat_list_id = config.getChatListId(item)
	const _chat_list_id_key = config.getChatListKeyName(item)
	
	return function(dispatch, getState) {
		const items = getState().chat.items
		const isMobile = getState().chat.isMobile

		const hasItem = items.filter(i  => _chat_list_id === i[_chat_list_id_key])
		const other_active_chat_boxes =  items.filter(i  => _chat_list_id != i[_chat_list_id_key] && i.status === 'active' )

		if (isMobile && other_active_chat_boxes.length && force_open === false) {
			return 
		}

		if (isMobile) {			
			other_active_chat_boxes.forEach((other_actove_box) => {
				dispatch(deactiveChatBox(other_actove_box[_chat_list_id_key]))
			})
		}


		if (hasItem.length) {
			if (hasItem[0].status === 'inactive' && ( !isMobile || other_active_chat_boxes.length === 0)) {
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