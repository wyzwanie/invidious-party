<script context="module">
    import { browser } from '$app/env'
    export const router = browser

	export async function load({ page, fetch }) {
		// const req = await fetch(`https://vid.puffyan.us/api/v1/videos/OOMxU9f1FBU`)
        const res = {}
        if(res) return {
            status: 200,
            props: {
                res
            }
        }
		return {
			status: req.status,
			error: new Error(`Could not load`)
		}
	}
</script>

<script>
export let res

</script>

<div>
{JSON.stringify(res)}
</div>