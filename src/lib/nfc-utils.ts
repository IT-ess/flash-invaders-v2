import type { Tag } from '@tauri-apps/plugin-nfc';
import { scan, isAvailable } from '@tauri-apps/plugin-nfc';

export function decodePayload(tag: Tag): string {
	// Convert DataView to a Uint8Array
	const bytes = new Uint8Array(tag.records[0].payload); // TODO: handle multiple records

	// Get the status byte (first byte of the payload)
	const status = bytes[0];

	// Extract the text encoding (bit 7 of status byte)
	const textEncoding = (status & 0x80) === 0 ? 'utf-8' : 'utf-16';

	// Extract the language code length (lower 6 bits of status byte)
	const langCodeLength = status & 0x3f;

	// Extract the language code (next bytes after the status byte)
	const langCode = new TextDecoder('utf-8').decode(bytes.slice(1, 1 + langCodeLength));

	// Extract the actual text (remaining bytes after the language code)
	const text = new TextDecoder(textEncoding).decode(bytes.slice(1 + langCodeLength));

	console.log('Language Code:', langCode);
	console.log('Decoded Text:', text);
	return text;
}

export async function readNfcTag(timeout: number = 10000): Promise<string | null> {
	const scanPromise = scan({ type: 'tag' }, { keepSessionAlive: true });

	const timeoutPromise = new Promise<never>((_, reject) =>
		setTimeout(() => reject(new Error('Operation timed out')), timeout)
	);

	try {
		const tag = await Promise.race([scanPromise, timeoutPromise]);
		return decodePayload(tag);
	} catch (error) {
		return null;
	}
}
