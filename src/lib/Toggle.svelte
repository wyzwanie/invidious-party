<script>
    import { createEventDispatcher } from 'svelte'

    export let status = false

    const dispatch = createEventDispatcher()

    $: dispatch('status', status)
    $: console.log(status)
</script>

<label class="switch">
    <input type="checkbox" bind:checked={status}>
    <span class="slider round"></span>
</label>

<style>
.switch {
    position: relative;
    display: inline-flex;
    width: 3.09em;
    height: 1.854em;
}
.switch input {
    opacity: 0;
    height: 0;
    width: 0;
}
.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--accent);
    transition: .4s;
}
.slider:before {
    position: absolute;
    content: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0ndXRmLTgnPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgJy0vL1czQy8vRFREIFNWRyAxLjEvL0VOJyAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiBmaWxsPSIjNGVjZGM0Ij4KICA8Zz4KICAgIDxnPgogICAgICA8cGF0aCBkPSJtNTAwLDExMy4xYy0yLjQtNy41LTguOS0xMy0xNi44LTE0LjFsLTU1LjItNy45LTI0LjYtNDguOWMtMy41LTctMTAuNy0xMS40LTE4LjUtMTEuNC03LjgsMC0xNSw0LjQtMTguNSwxMS40bC0yNC42LDQ4LjktNTUuMiw3LjljLTcuOCwxLjEtMTQuMyw2LjYtMTYuOCwxNC4xLTIuNCw3LjUtMC4zLDE1LjggNS40LDIxLjNsMzkuNywzNy45LTkuNCw1My40Yy0xLjQsNy43IDEuOCwxNS42IDguMSwyMC4yIDYuMyw0LjcgMTQuNyw1LjMgMjEuNywxLjdsNDkuNS0yNS41IDQ5LjUsMjUuNWMzLDEuNSA2LjIsMi4zIDkuNSwyLjMgNC4zLDAgOC42LTEuNCAxMi4yLTQgNi4zLTQuNiA5LjUtMTIuNSA4LjEtMjAuMmwtOS40LTUzLjQgMzkuNy0zNy45YzUuOS01LjUgOC0xMy44IDUuNi0yMS4zem0tODEuNiwzNi45Yy01LDQuOC03LjMsMTEuNy02LjEsMTguNWw0LjEsMjMuMy0yMi0xMS4zYy01LjktMy0xMy0zLTE4LjksMGwtMjIsMTEuMyA0LjEtMjMuM2MxLjItNi44LTEuMS0xMy43LTYuMS0xOC41bC0xNi45LTE2LjIgMjMuOC0zLjRjNi43LTEgMTIuNS01LjEgMTUuNS0xMS4ybDExLTIxLjkgMTEsMjEuOWMzLDYgOC44LDEwLjIgMTUuNSwxMS4ybDIzLjgsMy40LTE2LjgsMTYuMnoiLz4KICAgICAgPHBhdGggZD0ibTQ0MiwzNjFjLTE0LjksMy40LTMwLjMsNS4xLTQ1LjcsNS4xLTExMy44LDAtMjA2LjQtOTIuNi0yMDYuNC0yMDYuMyAwLTQxLjggMTIuNC04MiAzNS45LTExNi4zIDQuOC03IDQuOC0xNi4zIDAtMjMuNC00LjgtNy4xLTEzLjQtMTAuNS0yMS44LTguNi01NCwxMi4yLTEwMyw0Mi43LTEzOCw4Ni0zNS40LDQzLjgtNTUsOTkuMi01NSwxNTUuNyAwLDY2LjIgMjUuOCwxMjguNCA3Mi42LDE3NS4yIDQ2LjgsNDYuOCAxMDkuMSw3Mi42IDE3NS4zLDcyLjYgODEuOSwwIDE1OC40LTQwLjQgMjA0LjgtMTA4LjEgNC44LTcgNC44LTE2LjMgMC0yMy40LTQuOC03LTEzLjQtMTAuNC0yMS43LTguNXptLTE4My4xLDk4LjVjLTExMy44LDAtMjA2LjQtOTIuNi0yMDYuNC0yMDYuMyAwLTc4LjIgNDUuMy0xNDkuMSAxMTIuOC0xODMuOC0xMS4yLDI4LjYtMTcsNTkuMS0xNyw5MC40IDAsNjYuMiAyNS44LDEyOC40IDcyLjYsMTc1LjIgNDYuNyw0Ni43IDEwOC44LDcyLjUgMTc0LjksNzIuNi0zNy4zLDMzLjEtODUuOCw1MS45LTEzNi45LDUxLjl6Ii8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K');
    padding: 3px;
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: var(--bg-dark);
    transition: .4s;
}
input:checked + .slider {
    background-color: var(--accent);
}
input:focus + .slider {
    box-shadow: 0 0 1px var(--accent);
}
input:checked + .slider:before {
    transform: translateX(1.236em);
}
.slider.round {
    border-radius: 3em;
}
.slider.round:before {
    border-radius: 50%;
}
</style>