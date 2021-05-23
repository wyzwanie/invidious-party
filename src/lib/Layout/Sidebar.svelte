<script>
	import { page } from '$app/stores'
	import { fade } from 'svelte/transition'

	import DropIcon from '$lib/Icons/DropIcon.svelte'
	import GitIcon from '$lib/Icons/GitIcon.svelte'
	import MenuIcon from '$lib/Icons/MenuIcon.svelte'

	export let isOpen = true
</script>

{#if !isOpen}
	<div class="toggle" on:click={() => isOpen = !isOpen} transition:fade>
		<MenuIcon fill=var(--bg--1) width=16px />
	</div>
{/if}

<div class="sidebar" class:isOpen>
	<ul class="menu">
		<li class="listToggle" on:click={() => isOpen = !isOpen}><MenuIcon fill=var(--text--50) width=16px /></li>
		<li><a sveltekit:prefetch href="/" class={$page.path === '/' ? 'active' : ''}>PARTY</a></li>
		<li><a sveltekit:prefetch href="/popular" class={$page.path === '/popular' ? 'active' : ''}>POPULAR</a></li>
		<li><a sveltekit:prefetch href="/trending" class={$page.path === '/trending' ? 'active' : ''}>TRENDING</a></li>
		<li><a sveltekit:prefetch href="/subscriptions" class={$page.path === '/subscriptions' ? 'active' : ''}>SUB<span style="font-size: 8px;">SCRIPTIONS</span></a></li>
		<li>PLAYLISTS</li>
	</ul>
	<div class="bottom">
		<a href="https://github.com/wyzwanie/invidious-party">
			<div class="git">
				<p>source:</p>
				<GitIcon fill=var(--text--30) width=1.618em />
				<!-- <p>free software</p>
				<p>license</p> -->
			</div>
			<div class="license">
				<p>license:</p>
				<DropIcon fill=var(--text--30) width=1.618em />
			</div>
		</a>
	</div>
</div>

<style>
a {
    color: var(--text-50);
}
.listToggle {
	padding: 9px;
	cursor: pointer;
	/* background: yellowgreen; */
}
.toggle {
	transition: all 3s ease-in-out;
    position: absolute;
    display: flex;
    width: 33px;
    height: 33px;
    background: rgb(78 205 196);
    color: var(--border);
    left: 3px;
    top: 3px;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    opacity: 0.8;
    cursor: pointer;
}
.sidebar.isOpen {
	margin-left: 0;
}
.sidebar {
	margin-left: -96px;
	display: flex;
    justify-content: space-between;
    flex-direction: column;
	transition: all 0.3s ease-in-out;
    background: var(--bg-1);
    border-right: 1px solid var(--border);
}
.menu {
    display: flex;
    list-style: none;
    justify-content: center;
    flex-flow: column;
	position: relative;
}
.menu li {
    padding: 9px;
}
.active {
    font-weight: bold;
    color: var(--accent);
}

.git, .license {
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	padding: 0 3px;
}
p {
	color: var(--text--30);
	font-size: 83%;
}
</style>