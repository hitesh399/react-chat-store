import config from './config'

const boxWidth = config.getBoxWith()
const margin = config.getMargin()

export function hasRequiredWidth(activeBoxLength, firstBoxgap) {
	const chat_container = config.getContainer()
	const container_width = chat_container.innerWidth;
	const current_box_width = filledWidth(activeBoxLength, firstBoxgap)
	return (container_width >= (current_box_width + boxWidth + margin))
}

export function filledWidth(activeBoxLength, firstBoxgap) {
	return (activeBoxLength * (boxWidth + margin ) ) + firstBoxgap
}
export function nextOffset(firstBoxgap, activeBoxLength) {
	return filledWidth(activeBoxLength, firstBoxgap)	
}
export function getMaxOrder(chatBox, status) {

	const activeChatBox = status ? chatBox.filter(function(fv) {
		return (fv.status === status)
	}) : chatBox

	return activeChatBox.reduce(function(max, value) {
		return value.order > max ? value.order : max
	}, 0)
}
export function reArrangePossition(items, firstBoxgap) {

	items.reduce(function (lastOffset, item, index){
		if (item.status === 'active') {
			item.leftOffset = lastOffset
			return lastOffset + boxWidth + margin
		} else {
			return lastOffset
		}
	}, firstBoxgap ? firstBoxgap : 0)
}
export function getMinOrder(chatBox, status) {

	const activeChatBox = status ? chatBox.filter(function(fv) {
		return (fv.status === status)
	}) : chatBox

	return activeChatBox.reduce(function(min, value) {
			return value.order < min ? value.order : min
		},
		activeChatBox.length ? activeChatBox[0].order : 0
	);
}

export function makeFreeSpace(items) {
	const min_order = getMinOrder(items, 'active')
	items.map(function(v) {
		if (v.order === min_order) {
			v.status = 'inactive'
		}
		return v;
	})
}

export function makeNewItem(item, items) {
	const max_order = getMaxOrder(items)
	return {
		...item,
		order: max_order + 1,
		status: 'active',
		highlight: true,
		minimize: false,
		chatBoxId: (new Date).getTime()
	}
}