import { instances, instancesUpdatedAt } from '$lib/stores/_localStore'

//never fetched before
if(!$instancesUpdatedAt || !$instances.length) {
    log('instances', 'init', 'dev')
    $instances = await getInstances()
    $instancesUpdatedAt = new Date().getTime()
}
//instances lastUpdated more than 24h ago
if ($instancesUpdatedAt && ((new Date().getTime() - $instancesUpdatedAt) > 24 * 60 * 60 * 1000)) {
    log('instances', 'starting refresh', 'dev')
    $instances = await getInstances()
    $instancesUpdatedAt = new Date().getTime()
    log('instances', $instances , 'dev')
}
$chosen = chooseInstance($instances)