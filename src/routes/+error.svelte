<script lang="ts">
	import { t } from '$lib/translations/translations';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
</script>

<h1>{$page.status}: {$page.error?.message}</h1>
<Button variant="default" size="default" href="/auth">
	{$t('common.nav.auth')}
</Button>
