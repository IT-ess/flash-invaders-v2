export type Invader = {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	imageUrl: string;
	carouselCaptions: string[];
	carouselUrls: string[];
	itemsTypes: string[];
	itemsSources: string[];
	itemsCaptions: string[];
};

export let INVADERS: Invader[] = [
	{
		id: 0,
		name: 'Le tuto',
		latitude: 46.99963718022231,
		longitude: -0.8122978309235765,
		imageUrl: '/zwietess/0.webp',
		carouselCaptions: ['Jeu concours 1983', 'Arrosoirs', 'Logos'],
		carouselUrls: ['/context/0-1.jpg', '/context/0-2.jpg', '/context/0-3.jpg'],
		itemsTypes: ['text'],
		itemsSources: ['context.zwt0.content'],
		itemsCaptions: ['']
	},
	{
		id: 1,
		name: 'La ronde',
		latitude: 47.0050635,
		longitude: -0.8502914,
		imageUrl: '/zwietess/1.webp',
		carouselCaptions: ['Coeur logo', 'Ronde présentation', 'Arrivée 40e', 'BD Cercle'],
		carouselUrls: ['/context/1-1.jpg', '/context/1-2.jpg', '/context/1-3.jpg', '/context/1-4.jpg'],
		itemsTypes: ['text'],
		itemsSources: ['context.zwt1.content'],
		itemsCaptions: ['']
	},
	{
		id: 2,
		name: 'Le clocher',
		latitude: 47.004946958638584,
		longitude: -0.8511354176095234,
		imageUrl: '/zwietess/2.webp',
		carouselCaptions: ['Clochers réunis', 'Vue face église Zwief', 'Vue intérieure église Zwief'],
		carouselUrls: ['/context/2-1.jpg', '/context/2-2.jpeg', '/context/2-3.jpeg'],
		itemsTypes: ['text'],
		itemsSources: ['context.zwt2.content'],
		itemsCaptions: ['']
	},
	{
		id: 3,
		name: 'La paix',
		latitude: 47.004980731767795,
		longitude: -0.8523743877935895,
		imageUrl: '/zwietess/3.webp',
		carouselCaptions: [
			'Elus fleur',
			'Balons paix',
			'Ancien combattants',
			'Monument',
			'Sortie église'
		],
		carouselUrls: [
			'/context/3-1.jpg',
			'/context/3-2.jpg',
			'/context/3-3.jpg',
			'/context/3-4.jpg',
			'/context/3-5.jpg'
		],
		itemsTypes: ['text'],
		itemsSources: ['context.zwt3.content'],
		itemsCaptions: ['']
	},
	{
		id: 4,
		name: 'Le voyage',
		latitude: 47.004983296815865,
		longitude: -0.8519022234753352,
		imageUrl: '/zwietess/4.webp',
		carouselCaptions: [
			'Front de bus 1',
			'Front de bus 2',
			'Front de bus 3',
			'Front de bus 4',
			'Front de bus 5',
			'Front de bus 6',
			'VJ 2022',
			'Départ de la borne',
			'Départ Florent'
		],
		carouselUrls: [
			'/context/4-1.jpg',
			'/context/4-2.jpg',
			'/context/4-3.jpg',
			'/context/4-4.jpg',
			'/context/4-5.jpg',
			'/context/4-6.jpg',
			'/context/4-7.jpg',
			'/context/4-8.jpg',
			'/context/4-9.jpg'
		],
		itemsTypes: ['text'],
		itemsSources: ['context.zwt4.content'],
		itemsCaptions: ['']
	},
	{
		id: 5,
		name: 'La musique',
		latitude: 47.0055787,
		longitude: -0.8551144,
		imageUrl: '/zwietess/5.webp',
		carouselCaptions: ['Partition', 'Concert église', 'Weinrauch', 'BD chants'],
		carouselUrls: ['/context/5-1.jpg', '/context/5-2.jpg', '/context/5-3.jpg', '/context/5-4.jpg'],
		itemsTypes: ['text', 'audio'],
		itemsSources: ['context.zwt5.content', '/salve-regina.mp3'],
		itemsCaptions: ['', 'Salve-Regina']
	},
	{
		id: 6,
		name: 'La Hockete',
		latitude: 47.0075601,
		longitude: -0.8518778,
		imageUrl: '/zwietess/6.webp',
		carouselCaptions: ['Vue fête', 'Affiche', 'BD Hockete', 'Fête2', 'Album musique', 'Invitation'],
		carouselUrls: [
			'/context/6-1.jpg',
			'/context/6-2.jpg',
			'/context/6-3.jpg',
			'/context/6-4.jpg',
			'/context/6-5.jpg',
			'/context/6-6.jpg'
		],
		itemsTypes: ['text', 'audio'],
		itemsSources: ['context.zwt6.content', '/zwiefalterklosterbrau.mp3'],
		itemsCaptions: ['', 'Zwiefalter Klosterbräu']
	},
	{
		id: 7,
		name: 'La mairie',
		latitude: 47.0047309,
		longitude: -0.850128,
		imageUrl: '/zwietess/7.webp',
		carouselCaptions: ['Elus', 'Blason LT', 'Blason Zwief'],
		carouselUrls: ['/context/7-1.png', '/context/7-2.jpg', '/context/7-3.jpg'],
		itemsTypes: ['text'],
		itemsSources: ['context.zwt7.content'],
		itemsCaptions: ['']
	},
	{
		id: 8,
		name: 'La bière',
		latitude: 47.00522784178306,
		longitude: -0.8472995324521793,
		imageUrl: '/zwietess/8.webp',
		carouselCaptions: ['Caisse jaune', 'Camion', 'Camion2', 'Local', 'Echope', 'Charette'],
		carouselUrls: [
			'/context/8-1.jpg',
			'/context/8-2.jpg',
			'/context/8-3.jpg',
			'/context/8-4.jpg',
			'/context/8-5.jpg',
			'/context/8-6.jpg'
		],
		itemsTypes: ['text'],
		itemsSources: ['context.zwt8.content'],
		itemsCaptions: ['']
	},
	{
		id: 9,
		name: 'La culture',
		latitude: 47.00344172476325,
		longitude: -0.85728023215241,
		imageUrl: '/zwietess/9.webp',
		carouselCaptions: ['Masques Fasnet', 'Tessalis inauguration', 'Carnaval défilé'],
		carouselUrls: ['/context/9-1.jpg', '/context/9-2.jpg', '/context/9-3.png'],
		itemsTypes: ['text', 'video', 'video'],
		itemsSources: ['context.zwt9.content', '/fasnet1.mp4', '/fasnet2.mp4'],
		itemsCaptions: ['', 'Fasnet 1', 'Fasnet 2']
	},
	{
		id: 10,
		name: 'Les émotions',
		latitude: 47.00247501325306,
		longitude: -0.8573560045634288,
		imageUrl: '/zwietess/10.webp',
		carouselCaptions: ['Musique', 'Soirée thème gaulois', "Soirée d'adieu à l'ancienne"],
		carouselUrls: ['/context/10-1.jpg', '/context/10-2.jpg', '/context/10-3.jpg'],
		itemsTypes: ['text', 'video', 'video'],
		itemsSources: ['context.zwt10.content', '/jeusoiree.mp4', '/plagechant.mp4'],
		itemsCaptions: ['', "Jeu soirée d'adieu 2022", "Soirée aux Sables D'Olonne"]
	},
	{
		id: 11,
		name: 'Le prix',
		latitude: 47.000883875400184,
		longitude: -0.8558925547807724,
		imageUrl: '/zwietess/11.webp',
		carouselCaptions: ['Ghislaine devant chez elle'],
		carouselUrls: ['/context/11-1.jpeg'],
		itemsTypes: ['text'],
		itemsSources: ['context.zwt11.content'],
		itemsCaptions: ['']
	}
] as const;
