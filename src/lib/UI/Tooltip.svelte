<script>
    export let text
    export let mb = '80px';
</script>

<div class="tooltip">
    <slot />
    <div class="tooltiptext" style="margin-bottom: {mb}">
        {text}
    </div>
</div>

<style>
.tooltip {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}
/* Tooltip text */
.tooltip .tooltiptext {
    visibility: hidden;
    background-color: var(--text--00);
    color: var(--text--80);
    text-align: center;
    padding: 5px 11px;
    border-radius: 5px;
    position: absolute;
    z-index: 100;
    opacity: 0;
    transition: opacity 0.3s;
    margin-bottom: 80px;
    font-size: 1em;
}
.tooltip .tooltiptext::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
}
.tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
    font-size: 18px;
    white-space: nowrap;
}
</style>