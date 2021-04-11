<script>
    import { createEventDispatcher } from 'svelte'
    export let chosen
    const dispatch = createEventDispatcher()
</script>
<header>
    <div class="container">
        <div class="topRow">
            <div class="logo">
                INVIDIOUS<br><span style="font-weight: 100">{chosen}</span>
            </div>
            <div class="search">
                <input type="text" placeholder="search">
            </div>
            <div class="stuff">
                notification/settings
            </div>
        </div>
        <div class="botRow">
            <div class="menu">
                <ul>
                    <li><a href="/">POPULAR</a></li>
                    <li>TRENDING</li>
                    <li>SUBSCRIPTIONS</li>
                    <li>PLAYLISTS</li>
                </ul>
            </div>
        </div>
    </div>
</header>

<style>
    header {
        padding: 9px;
    }
    .logo {
        font-weight: bold;
    }
    .topRow {
        display: flex;
        justify-content: space-between;
    }
    ul {
        display: flex;
        list-style: none;
        justify-content: center
    }
    li {
        padding: 9px;
    }
</style>