import { PUBLIC_SEARCH_RADIUS } from '$env/static/public';
import { INVADERS, type Invader } from '$lib/game-data/invaders';
import { insideCircle, type LatitudeLongitude } from 'geolocation-utils';
import { supabase } from './supabase-client';

const matchLocalInvaders = (invader: Invader, userGeoLocation: LatitudeLongitude): Boolean =>
	insideCircle(userGeoLocation, invader, +PUBLIC_SEARCH_RADIUS);

export function getInvadersFromCoords(coords: GeolocationCoordinates): Invader[] {
	return INVADERS.filter((invader) =>
		matchLocalInvaders(invader, {
			latitude: coords.latitude,
			longitude: coords.longitude
		})
	);
}

export async function updateUserPrivileges(invaderId: number, userId: string) {
	const { error } = await supabase.rpc('update_user_permissions_and_score', {
		invader_id: invaderId,
		user_id_input: userId,
		permission_level: 1,
		incremented_score: 0
	});
	if (error) {
		console.error('Error updating user profile', error); // TODO: handle errors
	}
}

export function getInvaderFromTagContent(tagContent: string): Invader | null {
	const invader = INVADERS.find((invader) => `zwietess://invader${invader.id}` === tagContent);
	if (invader) {
		return invader;
	}
	return null;
}
