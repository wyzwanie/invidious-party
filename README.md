[invidious.PARTY](https://invidious.party)
===============
(WIP) Pure client side, privacy focused app, that fetches instances from api.invidious.io. Instances automatically rotate on failed request, upon empty search result you can request fresh one from new instance. Settings are currently stored in localStorage.

# inspiration
showing invidious to non-technical friend, had to try multiple domains before one worked.
using invidious daily as full replacement for yt, had to copy instance addresses to find one that has particular channel or video.

## browser support
only modern, no mobile version yet

## routes status
- index (only chat - will be some party room with p2p interaction sharing videos currently being watched)
- popular (done)
- trending (done)
- watch (partially done)
- search (partially done)
- channel (partially done)
- playlist (partially done)
- subscriptions (prototype working, ipfs storage is working)


### PLAN/IDEAS
- implement "party queue" where you can add songs to temporary list in one tab, while listening on another.
- implement p2p Key Value database solution, where you could store data using your private key. to "login" you would request `dbKey == yourPubKey`, given correct privKey data stored entry could be decrypted and used in the app. each running instance (tab in browser) would seed the database in the background, so other peers can discover via DHT
- (WIP) implement IPFS storage with option to pin your settings if you provide API to ex. pinata.cloud
- (WORKING) implement p2p chat under videos
- (WIP) implement p2p chat main site.
- Information which videos have peers in chat
- Party mode: (initial idea is to have chat like now, video on left
and when you play video its broadcasted to others in the room and you get some kind of a display what is wathced and you can swithc.)

# TODO
alot :D

# license
The WeThePeople License (WTP)
Pasteleft WeThePeople 2021

As long as you are a human (for sure not a corporation) you can do what the heck you want with it, unless its made for profit and/or incorporated in any way shape or form, then you are not allowed to benefit and/or profit from this software in any way shape or form.

The above pasteleft notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR PASTELEFT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
