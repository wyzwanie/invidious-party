<script>
    export let progress
    export let total
</script>

{#if progress < 100}
    <div class="progress-bar container">
        <div class="progress" style="width: {progress}%">
            <span class="label">Processing <b class="value">{Math.floor(progress*total/100)} / {total}</b></span>
        </div>
    </div>
{/if}

<style>
.progress-bar {
    margin-top: 3em;
    margin-bottom: 3em;
} 
.progress span.label {
    font-size: 1.2em;
    position: absolute;
    right: 0;
    line-height: 1.4;
    padding-right: 12px;
    color: rgba(0,0,0,0.6);
    text-shadow: rgba(255,255,255, 0.45) 0 1px 0px;
    white-space: nowrap;
}
@keyframes animate-stripes {
    from {
        background-position: 0 0;
    }
    to {
        background-position: 2em 0;
    }
}      
.progress-bar {
    position: relative;
    height: 1.618em;
    background-color: #abb2bc;
    border-radius: 1.618em;
    -moz-border-radius: 1.618em;
    -webkit-border-radius: 1.618em;
    background: #abb2bc;
}        
.progress {
    position: relative;
    display: block;
    overflow: hidden;
    height: 1.618em;
    -moz-border-radius: 1.618em;
    -webkit-border-radius: 1.618em;
    border-radius: 1.618em;
    background-size: 2em 2em;
    background-color: var(--accent);
    animation: animate-stripes 2s linear infinite;
}
</style>