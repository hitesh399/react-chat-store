import {
	chatReducer
} from './reducers/chatReducer'
import MessageBoxContainer from './components/MessageBoxContainer.jsx'
import MobileMessageBox from './components/MobileMessageBox.jsx'
import * as boxActions from './actions/MessageBoxAction'
import * as historyActions from './actions/ChatHistoryAction'
import * as chatlistActions from './actions/ChatListAction'
import * as ChatCountActions from './actions/ChatCountAction'
import * as OnlineUserAction from './actions/OnlineUserAction'
import config from './config'

const actions = { ...boxActions, ...historyActions , ...chatlistActions, ...ChatCountActions, ...OnlineUserAction }

export {
	MessageBoxContainer,
	chatReducer,
	actions,
	config,
	MobileMessageBox
}