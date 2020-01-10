import {MessageBoxContainer, mapStateToProps} from './MessageBoxContainer.jsx'
import {
	connect
} from 'react-redux';

export class MobileMessageBox extends MessageBoxContainer {
	constructor(props) {
		super(props);
	}
	render() {
		if (!this.props.isMobile) return null
		const boxes = this.getActiveBoxes()
		if (!boxes.length) return

		const item = boxes[0]
		let histories = this.props.histories[`history_of_${config.getChatListId(item)}`]
		const chatCount = this.props.chatCount[`count_for_${config.getChatListId(item)}`]

		histories = histories ? histories.slice().reverse() : []
		const unread = chatCount && chatCount.unread ? chatCount.unread : 0
		const typing = chatCount && chatCount.typing ? chatCount.typing : false

		return React.createElement(
			'div', {
				key: 'mobile_chat_box' + config.getChatListId(item), //
				className: `mobile-chat-message-box ${item.highlight ? 'highlight' : ''}`,
				style: this.getStyle(item)
			}, [
				React.createElement(
					this.props.itemConponent, 
					{
						item,
						index,
						key: 'chat_box_inner' + config.getChatListId(item),
						makeDim: () => this.makeDim(item),
						makeHighlight: () => this.makeHighlight(item),
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
	}
}

export default connect(
	mapStateToProps,
	// Implement map dispatch to props
)(MobileMessageBox)