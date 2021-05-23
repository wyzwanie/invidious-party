import { joinRoom, selfId } from 'trystero/torrent'

export default initParty = () => {
    
}

// export default class Party {
//     constructor(options) {
//         const { roomName, nick, actions } = options
//         this.name = roomName
//         this.nick = nick
//         this.room = joinRoom({ appId: 'invidious.party '}, roomName)
//         this.peers = {}

//         this.actions = {
//             chat: this.room.makeAction('chat'),
//             name: this.room.makeAction('name'),
//             nowPlaying: this.room.makeAction('nowPlaying')
//         }

//         this.actions.name[0](nick)

//         this.room.onPeerJoin(id => {
//             console.log('joined', id)
//             this.actions.name[0](this.nick, id)
//             if(this.peers.self && this.peers.self.nowPlaying) this.actions.nowPlaying[0](this.peers.self.nowPlaying, id)
//         })

//         this.actions.name[1]((nick, id) => this.peers[id] = {...this.peers[id], nick })
//         this.actions.nowPlaying[1]((videoID, id) => this.peers[id] = {...this.peers[id], nowPlaying: videoID})

//         this.room.onPeerLeave(id => {
//             console.log('left', id)
//             delete this.peers[id]
//         })
//     }
    
//     // addAction(name) {
//     //     this.actions[name] = this.party.makeAction(name)
//     // }
//     // runAction(name, type, fnctn) {
//     //     //type - 0: send, 1: get
//     //     this.actions[name][type]functn()
//     // }
// }