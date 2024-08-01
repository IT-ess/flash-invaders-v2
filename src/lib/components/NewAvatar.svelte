<script lang="ts">
	import { supabase } from '../supabase-client';
	import * as Avatar from '$lib/components/ui/avatar';
	import { downloadAvatar, updateAvatarPath } from '$lib/utils/avatar-functions';

	let {
		url = $bindable(),
		userId,
		username,
		size = 'default'
	}: {
		url: string | null;
		userId: string;
		username: string | null;
		size?: 'lg' | 'default';
	} = $props();

	let classSize = size === 'lg' ? 'h-36 w-36' : 'h-20 w-20';

	let uploading = $state(false);
	let files: FileList | undefined = $state();

	const uploadAvatar = async () => {
		try {
			uploading = true;

			if (!files || files.length === 0) {
				throw new Error('You must select an image to upload.');
			}
			if (userId === undefined) {
				throw new Error("You aren't authenicated");
			}

			const file = files[0];
			const fileExt = file.name.split('.').pop();
			const filePath = `${userId}/${Math.random()}.${fileExt}`;

			let { error } = await supabase.storage.from('avatars').upload(filePath, file);
			await updateAvatarPath(userId, filePath);

			if (error) {
				throw error;
			}

			url = filePath;
			url = (await downloadAvatar(url)) ?? null;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			uploading = false;
		}
	};
</script>

<div class="text-center">
	<span style="display:none">
		<input
			type="file"
			id="single"
			accept="image/*"
			bind:files
			onchange={uploadAvatar}
			disabled={uploading}
		/>
	</span>
	<label for="single">
		<div class="inline-block">
			<Avatar.Root class="{classSize} mx-auto border-2 border-primary">
				<Avatar.Image src={url} alt={username} />
				<Avatar.Fallback>{username !== null ? username[0] : 'U'}</Avatar.Fallback>
			</Avatar.Root>
		</div>
	</label>
</div>
