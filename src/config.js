class config {
    constructor() {
        this.options = {
            containerId: 'chat-message-container',
            width: 280,
            margin: 10,
            height: 360,
            // uniqueId: 'id',
            chatListIdentifiers: ['connected_user_id'],
            loginUserId: null,
            historyUniqueId: 'id',
            readAtKey: 'read_at'
        }
    }
    init(options = {}) {
        this.options = {
            ...this.options,
            ...options
        }
    }
    getReadAtKey() {
        this.options.readAtKey
    }
    getContainer() {
        return window
    }
    getBoxWith() {
        return this.options.width
    }
    getMargin() {
        return this.options.margin
    }
   
    getHeight() {
        return this.options.height
    }
    getHistoryUniqueId() {
        return this.options.historyUniqueId
    }

    getChatListId(item) {
        if (!item) return null;
        let idValue = null
        this.options.chatListIdentifiers.every(function (key) {
            if (item[key]) {
                idValue =item[key] 
                return false
            }
            return true
        })

        return idValue
    }
    getChatListKeyName(item) {
        if (!item) return null;
        let idKeyName = null
        this.options.chatListIdentifiers.every(function (key) {
            if (item[key]) {
                idKeyName = key 
                return false
            }
            return true
        })
        return idKeyName
    }
}

export default new config();