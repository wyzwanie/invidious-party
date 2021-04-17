# INVIDIOUS party
(WIP) Pure client side privacy focused app, that fetches instances from api.invidious.io and rotates instance on every request. Instances automatically rotate on failed request, upon empty search result you can request fresh one from new instance. Settings are currently stored in localStorage.

# WORKING ROUTES
- index (popular)
- watch (only video feed)
- search (videos)
- channel (basic with playlists)
- playlist (only first video working)

# PLAN/IDEAS
- implement "party queue" where you can add songs to temporary list in one tab, while listening on another.
- implement p2p Key Value database solution, where you could store data using your private key. to "login" you would request `dbKey == yourPubKey`, given correct privKey data stored entry could be decrypted and used in the app. each running instance (tab in browser) would seed the database in the background, so other peers can discover via DHT
- (WIP) implement IPFS storage with option to pin your settings if you provide API to ex. pinata.cloud
- (WORKING) implement p2p chat under videos
- (WIP) implement p2p chat main site.
- Information which videos have peers in chat.

# TODO
- trending
- subscriptions: route
- playlist: fix fideo switching
- add global chat button
- component=Video: beautify loading
- video: add status
- video: add description
- video: add subscribe
- video: add download
- video: add to playlist
- video: watch on yt
- video: statistics
- video: related