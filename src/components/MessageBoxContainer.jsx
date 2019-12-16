import React from 'react';
import {
	connect
} from 'react-redux';
import config from '../config'
import PropTypes from 'prop-types';
import {
	deleteChatBox,
	chatBoxCollapse,
	chatBoxExpand,
	deleteAllChatBox,
	openChatBox,
	makeDim,
	makeHighlight,
	deactiveChatBoxes	
} from '../actions/MessageBoxAction'

import {unread} from '../actions/ChatCountAction'
import { newMessage, pushMessages } from '../actions/ChatHistoryAction'

const margin = config.getMargin()
const height = config.getHeight()
const width = config.getBoxWith()

function mapStateToProps(state) {

	return {
		chatBoxes: state.chat ? state.chat.items : [],
		histories: state.chat ? state.chat.histories : {},
		chatCount: state.chat ? state.chat.chatCount : {},
		onlineUsers: state.chat ? state.chat.onlineUsers : [],
	}
}

export class MessageBoxContainer extends React.Component {

	constructor(props) {
		super(props);
		this.getStyle = this.getStyle.bind(this)
		this.whenWindowResize = this.whenWindowResize.bind(this)
		//this.newMessage = this.newMessage.bind(this)
	}
	getActiveBoxes() {

		return this.props.chatBoxes.filter(function(item) {
			return item.status == 'active'
		})
	}

	getActiveBoxesLength() {
		return this.getActiveBoxes().length
	}
	getStyle(item) {
		const length = this.getActiveBoxesLength()
		let style = {
			position: 'fixed',
			width: width + 'px',
			height: (item.minimize ? 40 : height) + 'px',
			bottom: 0,
			right: item.leftOffset
		}
		return style
	}
	remove(item) {
		this.props.dispatch(deleteChatBox(config.getChatListId(item)))
	}
	collapse(item) {
		this.props.dispatch(chatBoxCollapse(config.getChatListId(item)))
	}
	expand(item) {
		this.props.dispatch(chatBoxExpand(config.getChatListId(item)))
	}
	newMessage(item, chatMessage) {		
		const chatid = config.getChatListId(item)
		// console.log('Get New Message form Event', chatid, item, chatMessage)
		this.props.dispatch(newMessage(chatMessage, chatid))
	}
	setUnreadMessage(item, total) {
		const chatid = config.getChatListId(item)
		this.props.dispatch(unread(total, chatid))
	}
	addHistories(item, histories) {
		const chatid = config.getChatListId(item)
		this.props.dispatch(pushMessages(histories, chatid))
	}
	whenWindowResize() {
		const {
			chatBoxes
		} = this.props
		const container = config.getContainer()
		const requiredWithOpenBox = (config.getBoxWith() + config.getMargin()) * 2;

		if (container.innerWidth < requiredWithOpenBox) {
			this.props.dispatch(deactiveChatBoxes())
			return
		}

		this.props.dispatch(deleteAllChatBox())
		chatBoxes.sort(function(a, b) {
			return a.order > b.order
		})
		chatBoxes.forEach(item => {
			this.props.dispatch(openChatBox(item))
		})
	}
	isUserOnline(user_id) {
		return this.props.onlineUsers
			.some(online_user_key =>  online_user_key.indexOf(`.${user_id}.`) !== -1 )
	}
	componentDidMount() {
		window.addEventListener('resize', this.whenWindowResize)
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.whenWindowResize)
	}
	makeDim(item) {
		this.props.dispatch(makeDim(config.getChatListId(item)))
	}
	makeHighlight(item) {
		this.props.dispatch(makeHighlight(config.getChatListId(item)))
	}
	
	render() {
		const boxes = this.getActiveBoxes()
		return React.createElement(
			'div', {
				style: {
					position: "relative",
					width: "100%",
					bottom: 0,
					height: 0,
					left: 0
				},
				id: 'chat-message-container'
			},
			boxes.map((item, index) => {
				
				let histories = this.props.histories[`history_of_${config.getChatListId(item)}`]
				const chatCount = this.props.chatCount[`count_for_${config.getChatListId(item)}`]

				histories = histories ? histories.slice().reverse() : []
				const unread = chatCount && chatCount.unread ? chatCount.unread : 0
				const typing = chatCount && chatCount.typing ? chatCount.typing : false

				return React.createElement(
					'div', {
						key: 'chat_box' + config.getChatListId(item), //
						className: `chat-message-box ${item.highlight ? 'highlight' : ''}`,
						style: this.getStyle(item)
					}, [
						React.createElement(
							this.props.itemConponent, {
								item,
								index,
								key: 'chat_box_inner' + config.getChatListId(item),
								deleteFnc: () => this.remove(item),
								makeDim: () => this.makeDim(item),
								makeHighlight: () => this.makeHighlight(item),
								collapse: () => this.collapse(item),
								expand: () => this.expand(item),
								histories,
								unread,
								typing,
								newMessage: (message) => this.newMessage(item, message),
								addHistories: (messages) => this.addHistories(item, messages),
								setUnreadMessage: (total) => this.setUnreadMessage(item, total),
								isUserOnline: (user_id) => this.isUserOnline(user_id),
							}
						)
					]
				)
			})
		)
	}
}

MessageBoxContainer.propTypes = {
	itemConponent: PropTypes.func.isRequired
}

export default connect(
	mapStateToProps,
	// Implement map dispatch to props
)(MessageBoxContainer)