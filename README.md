# Greetings Explorer🎉
🎉You have reached invidious.party project, where [invidious](https://github.com/iv-org/invidious "invidious") instances have a party 🎉
invidious.party is a fully static site build using ![svelte hoolingans reprezent](https://cdn.discordapp.com/icons/457912077277855764/ea3d74c9d4e51d12cd2daa3ea1b44bb6.png?size=32 "svelte hoolingans reprezent") [SvelteKit](https://kit.svelte.dev) 

## installation
```
git clone https://github.com/wyzwanie/invidious-party.git project-folder
cd project-folder
npm i

npm run start
npm run dev
npm run build
```

## inspiration
showing invidious to non-technical friend, had to try multiple domains before one worked.
using invidious daily as full replacement for yt, had to copy instance addresses to find one that had particular channel or video.

## solo mode
in solo mode your browser communicates only with invidious instances to serve you content.
by default your subscriptions and settings are stored only in browser' localStorage
if you want to share your data with a friend or another device you can do so using bookmarks and QRcodes (WIP)
this solution apart from obvious drawback that everytime you add a subscription you need to bookmark new address [maybe some snippet?]
has a limitations on maximum number of subscriptions (150) or videos in playlist (500) per link

## party mode
in order to have a party there needs to be a way for browsers to communicate directly between each other.
made possible thanks to brilliant package [trystero](https://github.com/dmotz/trystero)

in party mode we use torrent trackers for signaling, so browsers can find direct communication tunnel.
in party mode you notify party members what you are watching by broadcasting videoID you watch,(WIP)
so other peers having a party, can dynamically see what is being watched right now, have fun in (to be encrypted)
global public p2p chat

## browser support
only modern, no mobile version yet

## routes status
- index (will be some party room with p2p interaction sharing videos currently being watched)
- popular (done)
- trending (done)
- watch (partially done)
- search (partially done)
- channel (partially done)
- playlist (partially done)
- subscriptions (prototype working with localStorage)

# TODO
alot :D

# license
The WeThePeople License (WTP)
Pasteleft WeThePeople 2021

As long as you are a human (for sure not a corporation) you can do what the heck you want with it, unless its made for profit and/or incorporated in any way shape or form, then you are not allowed to intercact, use, benefit, and/or profit from this software in any way shape or form.

The above pasteleft notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR PASTELEFT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
