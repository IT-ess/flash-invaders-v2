type QuizQuestions = {
	question1: string;
	options1: string[];
	index1: number;
	question2: string;
	options2: string[];
	index2: number;
	question3: string;
	options3: string[];
	index3: number;
	question4: string;
	options4: string[];
	index4: number;
};

export type QuizData = {
	fr: QuizQuestions[];
	de: QuizQuestions[];
};

export let QUIZ_DATA: QuizData = {
	fr: [
		{
			question1: "Quand a été signé le traité de l'Elysée ?",
			options1: ['1953', '1963', '1973', '1983'],
			index1: 1,
			question2: "Qui est l'artisan(e) des principaux logos du jumelage ?",
			options2: ['Martin', 'Maïlys', 'Maryvone', 'Michel'],
			index2: 1,
			question3: 'Pour quelle occasion ce logo fut-il créé ?',
			options3: [
				"Pour le cinquantième anniversaire du traité de l'Elysée",
				"Pour la signature du traité de l'Elysée",
				'Pour la commémoration du premier voyage jeunes.',
				"Ce logo n'a jamais existé"
			],
			index3: 2,
			question4:
				'Lors du premier voyage jeune en Allemagne, nos jeunes furent accueillis par deux personnages fondateurs du jumelage...',
			options4: [
				'Mme Butz & M.Ragg',
				'Ernest Weinrauch & Dom Mocquereau',
				"Konrad Adenauer et un représentant de l'OFAJ.",
				"Personne, les Zwiefalter n'étaient pas prévenus de leur arrivée !"
			],
			index4: 0
		},
		{
			question1: 'Dans quelle ville a été fondue la ronde de trois personnages ?',
			options1: ['Munderkingen', 'Zwiefalten', 'Schussenried', 'Stuttgart'],
			index1: 0,
			question2: 'Où se situe l’autre exemplaire de cette ronde ?',
			options2: [
				'Place de la Rathaus',
				'Tessoualler Park',
				"Au bord de l'Aach",
				'Dans le Biergarten'
			],
			index2: 2,
			question3: 'Qui étaient les maires de nos deux communes à cette époque ?',
			options3: [
				'M.O. Malinge & H. Riedlinger',
				'D. Landreau & A. Hepp',
				'C. Fonteneau & K. Ragg',
				'M. Gental & K. Kapeller'
			],
			index3: 0,
			question4:
				"En quelle année a été célébré le Traité de l'Elysée, pour la première fois à La Tessoualle, autour de cette ronde ?",
			options4: ['2005', '2009', '2013', '2017'],
			index4: 1
		},
		{
			question1: 'Quelle est la particularité des deux paroisses ?',
			options1: [
				'Il y a une statue de St Ernest dans chacune',
				'Toutes les deux sont dédiées à Notre Dame',
				'Elles sont de style gothique',
				'Elles ont le même nombre de fidèles'
			],
			index1: 1,
			question2: 'En quelle année a été détruite cette église ?',
			options2: ['1594', '1694', '1794', '1894'],
			index2: 2,
			question3: 'Quels étaient les noms des 2 prêtres officiant dans nos 2 communes en 1973 ?',
			options3: [
				'Bonnenfant - K.Ragg',
				'Mazarin - Krementz',
				"L'abbé Mathis - Augustin Stegmüller",
				'J.Boiteau - F.Gueter'
			],
			index3: 3,
			question4: "Lequel de ces quatre couples s'est marié en cette église ?",
			options4: ['Anton et Bernadette', 'Luc et Uschi', 'Michel et Doris', 'Pierrette & Marc'],
			index4: 2
		},
		{
			question1:
				'En quelle année la commémoration du 11 novembre 1918 a-t-elle eu lieu en présence des maires des deux communes ?',
			options1: ['2014', '2016', '2018', '2020'],
			index1: 2,
			question2: 'Où se trouve une autre plaque commémorative de nos morts à La Tessoualle ?',
			options2: ['Au Cercle', 'Au cimetière', "A l'église", 'A la Mairie'],
			index2: 2,
			question3: 'Où était installé le monument aux morts à son inauguration en 1921 ?',
			options3: [
				'Au cimetière',
				'En bas de la place du Souvenir',
				'Place de la Paix de La Tessoualle',
				"Rue de l'Hôtel de Ville"
			],
			index3: 1,
			question4: 'On parle de la guerre 14-18, mais sait-on combien de jours a duré cette guerre ?',
			options4: ['1461 jours', '1491 jours', '1521 jours', '1561 jours'],
			index4: 3
		},
		{
			question1:
				'Une borne kilométrique existe à Zwiefalten, mais quelle distance Zwiefalten La Tessoualle indique-t-elle ?',
			options1: ['993 km', '998 km', '1008 km', '1018 km'],
			index1: 3,
			question2: 'Quelle est la distance à vol d’oiseau La Tessoualle-Zwiefalten ?',
			options2: ['785,120 km', '885,120 km', '985,120 km', '1085,120 km'],
			index2: 0,
			question3: 'Qui a fabriqué la borne de La Tessoualle à Zwiefalten ?',
			options3: ['Michelin', 'Un sculpteur de renom', 'Un compagnon du devoir', 'Un maçon'],
			index3: 2,
			question4:
				'Combien de jours Gérard et Claudie DURANDET ont-ils mis pour rallier à pied La Tessoualle à Zwiefalten en 2008 ?',
			options4: ['38', '50', '58', '52'],
			index4: 1
		},
		{
			question1:
				"En quelle année les 2 chorales ont-elles chanté Weinrauch ensemble en l'église de La Tesssoualle ?",
			options1: ['1999', '2005', '2011', '2017'],
			index1: 2,
			question2:
				'Une autre commune allemande s’est parfois jointe à ces chorales, elle venait de …',
			options2: ['Halle', 'Ohorn', 'Erfurt', 'Upflamör'],
			index2: 1,
			question3: 'Les Tessouallais sont allés tous les deux ans chanter là-bas de … à … ?',
			options3: ['1965 à 1979', '1975 à 1985', '1985 à 1999', '2005 à 2019'],
			index3: 2,
			question4:
				'Quelles sont les dates du pontificat du Pape Grégoire le Grand, promoteur du chant grégorien ?',
			options4: ['590 - 604', '690 - 704', '790 - 804', '890 - 904'],
			index4: 0
		},
		{
			question1:
				'Quel est le nom de la fête de la bière ayant lieu tous les deux ans dans la Garenne ?',
			options1: ['Bierhimmel', 'Festbier', 'Bierfest', 'Hockete'],
			index1: 3,
			question2:
				'Quelle spécialité culinaire est proposée par nos amis allemands lors de cette fête ?',
			options2: ['Choucroute', 'Maultaschen', 'Schweinekotelett', 'Kässpätzle'],
			index2: 1,
			question3: 'Combien de ces fêtes se sont déjà déroulées dans la vallée de la Garenne ?',
			options3: ['50', '30', '20', '10'],
			index3: 3,
			question4: 'Où a été organisée la première fête de la bière à La Tessoualle ?',
			options4: ['Lac du Verdon', 'Lac de Ribou', 'Vallée de La Garenne', 'Centre bourg'],
			index4: 0
		},
		{
			question1: 'La Charte du jumelage fut signée par …',
			options1: [
				'Henri Girardeau et Karl Ragg',
				'Lucien Paquier et Geor Häbe',
				'René Augereau et Anneliese Zinzer',
				'Léon Augereau & Karl Ragg'
			],
			index1: 0,
			question2: 'Quelle est la date exacte de cette signature ?',
			options2: ['12 mai 1973', '12 juillet 1973', '12 août 1973', '12 septembre 1973'],
			index2: 2,
			question3: 'Quels étaient les signataires du traité de l’Elysée ?',
			options3: [
				'M. de Gaulle - M. Adenauer',
				'M. Chirac - M. Schroeder',
				'Mme Merkel - M. Macron',
				'Mme Merkel - M. Hollande'
			],
			index3: 0,
			question4:
				'Combien de femmes ont été élues maire en cumulé entre la Tessoualle et Zwiefalten ?',
			options4: ['1', '2', '3', '4'],
			index4: 2
		},
		{
			question1: "Quels matériels d'importance sont stockés dans ce local ?",
			options1: [
				'La cave du Président du jumelage de La Tessoualle',
				'Le car Dudule',
				'Les tables et bancs du Comité',
				"L'automobile de Michel Ferchaud"
			],
			index1: 2,
			question2:
				'Les livraisons de bière se font ici, mais qui sont les fidèles chauffeurs chargés de cette lourde tâche ?',
			options2: ['Gisela & Manuela', 'Kurt & Ralf', 'Helmut & Jimmy', 'Herbert & Markus'],
			index2: 1,
			question3: "Quel est le degré d'alcool d'une '1521' ?",
			options3: ['4,7°', '4,9°', '5,1°', '5,3°'],
			index3: 2,
			question4: 'Ce bâtiment a appartenu à une personnalité du jumelage, lequel ?',
			options4: ['Gildas Ferchaud', 'Henri Girardeau', 'Luc Chupin', 'Denis Fouillet'],
			index4: 1
		},
		{
			question1: 'Que symbolise le masque du Rälle ?',
			options1: ['Un chat', 'Un chien', 'Un ours', 'Un renard'],
			index1: 0,
			question2:
				'Pour que le Maire coupe le cordon inaugural bleu-blanc-rouge de Tessallis, celui-ci fut maintenu en hauteur par deux porteurs, lesquels ?',
			options2: [
				'Cater & Pillar',
				'Pierre & David',
				'Massey & Fergusson',
				'Paul De Dion & Jean Bouton'
			],
			index2: 1,
			question3: "Quel était le nom de l'Orchestre Harmonique de La Tessoualle avant l'an 2000 ?",
			options3: [
				"L'harmonie Saint Louis",
				"L'harmonie Sainte Radegonde",
				"L'harmonie Saint Joseph",
				'La Tessoualle Orchestra'
			],
			index3: 2,
			question4: 'Qui étaient les rois de la cérémonie du Fasnet 2023 ?',
			options4: ['Uschi & Luc', 'Bernadette & Anton', 'Déborah & Markus', 'Adrian F & Sophie B'],
			index4: 3
		},
		{
			question1: 'Qui était le premier couple marié entre la Tessoualle et Zwiefalten ?',
			options1: ['Uschi & Luc', 'Doris & Michel', 'Bernadette & Anton', 'Déborah & Markus'],
			index1: 2,
			question2:
				'Quel était le nom du jeu de la soirée d’adieu du Voyage Jeunes 2022 à La Tessoualle ?',
			options2: [
				'Oeuf, Poule, Dino',
				'Poule, Renard, Vipère',
				'Les chaises musicales',
				'Le jeu des 12 mois'
			],
			index2: 0,
			question3: "Quel est le nom du chant où nous 'Buvons à l'aimable [...]' ?",
			options3: ['Fanchon', 'Madelon', 'Marine', 'Huguette'],
			index3: 0,
			question4:
				"Où se retrouvent depuis quelques années français et allemands pour le 'vrai' départ lors des voyages jeunes ?",
			options4: [
				"Juste avant l'autoroute",
				'Devant Jouteau',
				'Sur la place de la Poste',
				"Devant l'ancienne déchetterie"
			],
			index4: 3
		},
		{
			question1: 'Quel était le prénom du grand-père de Richard ?',
			options1: ['Raymond', 'Maurice', 'Pierre', 'Firmin'],
			index1: 3,
			question2: "Quel est le nom d'un des fils d'Anne-Laure et Richard ?",
			options2: ['Raymond', 'Maurice', 'Pierre', 'Firmin'],
			index2: 3,
			question3: "On dit souvent la 'blute' pour la Bleutre, mais que signifie le verbe 'bluter' ?",
			options3: ['Tamiser la farine', 'Faire la sieste', "Prendre l'apéro", 'Cuisiner'],
			index3: 0,
			question4: 'Lors du week-end du 50e, Ghislaine a dormi dans une autre maison, laquelle ?',
			options4: [
				"A l'hôtel",
				'Chez Colette Brémaud',
				'Chez Alain Lamotte',
				"C'est faux, elle a dormi chez elle"
			],
			index4: 1
		}
	],
	de: [
		{
			question1: 'Wann wurde der Élysée-Vertrag unterzeichnet?',
			options1: ['1953', '1963', '1973', '1983'],
			index1: 1,
			question2: 'Wer ist der Schöpfer der wichtigsten Partnerschaftslogos?',
			options2: ['Martin', 'Maïlys', 'Maryvone', 'Michel'],
			index2: 1,
			question3: 'Für welchen Anlass wurde dieses Logo erstellt?',
			options3: [
				'Zum 50. Jahrestag des Élysée-Vertrags',
				'Zur Unterzeichnung des Élysée-Vertrags',
				'Zur Erinnerung an die erste Jugendreise',
				'Dieses Logo hat nie existiert'
			],
			index3: 2,
			question4:
				'Während der ersten Jugendreise nach Deutschland wurden unsere Jugendlichen von zwei Gründerpersönlichkeiten der Städtepartnerschaft begrüßt...',
			options4: [
				'Frau Butz & Herr Ragg',
				'Ernest Weinrauch & Dom Mocquereau',
				'Konrad Adenauer und ein Vertreter der DFJW',
				'Niemand, die Zwiefalter waren nicht über ihre Ankunft informiert!'
			],
			index4: 0
		},
		{
			question1: 'In welcher Stadt wurde die Runde aus drei Figuren gegossen?',
			options1: ['Munderkingen', 'Zwiefalten', 'Schussenried', 'Stuttgart'],
			index1: 0,
			question2: 'Wo ist die andere Kopie dieser Runde?',
			options2: ['Rathaus Platz', 'Im Tessoualler Park', 'Am Ufer der Aach', 'Im Biergarten'],
			index2: 2,
			question3: 'Wer waren damals die Bürgermeister unserer beiden Gemeinden?',
			options3: [
				'M.O. Malinge & H. Riedlinger',
				'D. Landreau & A. Hepp',
				'C. Fonteneau & K. Ragg',
				'M. Gental & K. Kapeller'
			],
			index3: 0,
			question4:
				'In welchem ​​Jahr wurde in dieser Runde der Vertrag des Elysée zum ersten Mal in La Tessoualle gefeiert?',
			options4: ['2005', '2009', '2013', '2017'],
			index4: 1
		},
		{
			question1: 'Was ist das Besondere an den beiden Pfarrgemeinden?',
			options1: [
				'Es gibt eine Statue von St. Ernest in jeder Gemeinde',
				'Beide sind der Jungfrau Maria gewidmet',
				'Sie sind im gotischen Stil erbaut',
				'Sie haben die gleiche Anzahl von Gläubigen'
			],
			index1: 1,
			question2: 'In welchem Jahr wurde diese Kirche zerstört?',
			options2: ['1594', '1694', '1794', '1894'],
			index2: 2,
			question3: 'Wie hießen die beiden Priester, die 1973 in unseren beiden Gemeinden amtierten?',
			options3: [
				'Bonnenfant - K. Ragg',
				'Mazarin - Krementz',
				'Pfarrer Mathis - Augustin Stegmüller',
				'J. Boiteau - F. Gueter'
			],
			index3: 3,
			question4: 'Welches dieser vier Paare hat in dieser Kirche geheiratet?',
			options4: ['Anton und Bernadette', 'Luc und Uschi', 'Michel und Doris', 'Pierrette & Marc'],
			index4: 2
		},
		{
			question1:
				'In welchem ​​Jahr fand die Gedenkfeier zum 11. November 1918 im Beisein der Bürgermeister der beiden Gemeinden statt?',
			options1: ['2014', '2016', '2018', '2020'],
			index1: 2,
			question2: 'Wo ist eine weitere Gedenktafel, die an unseren Tod in La Tessoualle erinnert?',
			options2: ['Am Cercle', 'Auf dem Friedhof', 'In der Kirche', 'Im Rathaus'],
			index2: 2,
			question3: 'Wo stand das Kriegerdenkmal bei seiner Einweihung im Jahr 1921?',
			options3: [
				'Auf dem Friedhof',
				'Unterhalb des Place du Souvenir',
				'Place de la Paix de La Tessoualle',
				'Hôtel de Ville Strasse'
			],
			index3: 1,
			question4:
				'Wir sprechen über den 14-18-Krieg, aber wissen wir, wie viele Tage dieser Krieg dauerte?',
			options4: ['1461 Tage', '1491 Tage', '1521 Tage', '1561 Tage'],
			index4: 3
		},
		{
			question1:
				'In Zwiefalten gibt es eine Kilometermarkierung, aber welche Entfernung zeigt Zwiefalten La Tessoualle an?',
			options1: ['993 km', '998 km', '1008 km', '1018 km'],
			index1: 3,
			question2: 'Wie weit ist La Tessoualle-Zwiefalten in Luftlinie?',
			options2: ['785,120 km', '885,120 km', '985,120 km', '1085,120 km'],
			index2: 0,
			question3: 'Wer hat den Poller La Tessoualle in Zwiefalten hergestellt?',
			options3: ['Michelin', 'Ein renommierter Bildhauer', 'Ein berühmter', 'Ein Maurer'],
			index3: 2,
			question4:
				'Wie viele Tage brauchten Gérard und Claudie DURANDET im Jahr 2008 für die Wanderung von La Tessoualle nach Zwiefalten?',
			options4: ['38', '50', '58', '52'],
			index4: 1
		},
		{
			question1:
				'In welchem ​​Jahr sangen die beiden Chöre gemeinsam Weinrauch in der Kirche von La Tesssoualle?',
			options1: ['1999', '2005', '2011', '2017'],
			index1: 2,
			question2: 'Ein andere deutsche Chor schloss sich ihnen manchmal an, sie kam aus …',
			options2: ['Halle', 'Ohorn', 'Erfurt', 'Upflamör'],
			index2: 1,
			question3: 'Tessouallais ging alle zwei Jahre dorthin, um von … bis … zu singen?',
			options3: ['1965 bis 1979', '1975 bis 1985', '1985 bis 1999', '2005 bis 2019'],
			index3: 2,
			question4:
				'Was sind die Daten des Pontifikats von Papst Gregor dem Großen, dem Förderer des gregorianischen Chorals?',
			options4: ['590 - 604', '690 - 704', '790 - 804', '890 - 904'],
			index4: 0
		},
		{
			question1: 'Wie heißt das Bierfest, das alle zwei Jahre in der Garenne stattfindet?',
			options1: ['Bierhimmel', 'Festbier', 'Bierfest', 'Hockete'],
			index1: 3,
			question2:
				'Welche kulinarische Spezialität bieten unsere deutschen Freunde auf dieser Party an?',
			options2: ['Sauerkraut', 'Maultaschen', 'Schweinekotelett', 'Kässpätzle'],
			index2: 1,
			question3: 'Wie viele dieser Feste haben bereits im Garenne-Tal stattgefunden?',
			options3: ['50', '30', '20', '10'],
			index3: 3,
			question4: 'Wo fand das erste Bierfest in La Tessoualle statt?',
			options4: ['Verdon-See', 'Ribou-See', 'Garenne-Tal', 'Stadtmitte'],
			index4: 0
		},
		{
			question1: 'Die Partnerschaftscharta wurde unterzeichnet von…',
			options1: [
				'Henri Girardeau und Karl Ragg',
				'Lucien Paquier und Geor Häbe',
				'René Augereau und Anneliese Zinzer',
				'Léon Augereau und Karl Ragg'
			],
			index1: 0,
			question2: 'Was ist das genaue Datum dieser Unterschrift?',
			options2: ['12. Mai 1973', '12. Juli 1973', '12. August 1973', '12. September 1973'],
			index2: 2,
			question3: 'Wer waren die Unterzeichner des Elysée-Vertrags?',
			options3: [
				'M. de Gaulle - M. Adenauer',
				'M. Chirac - M. Schroeder',
				'Frau Merkel - Herr Macron',
				'Frau Merkel - Herr Hollande'
			],
			index3: 0,
			question4:
				'Wie viele Frauen wurden zwischen Tessoualle und Zwiefalten insgesamt zur Bürgermeisterin gewählt?',
			options4: ['1', '2', '3', '4'],
			index4: 2
		},
		{
			question1: 'Welche wichtigen Materialien werden in diesem Raum aufbewahrt?',
			options1: [
				'Der Keller des Präsidenten der Städtepartnerschaft La Tessoualle',
				'Die Kutsche von Dudule',
				'Die Tische und Bänke des Komitees',
				'Das Automobil von Michel Ferchaud'
			],
			index1: 2,
			question2:
				'Hier werden B-Beer-Lieferungen durchgeführt, aber wer sind die treuen Fahrer, die diese schwere Aufgabe übernehmen?',
			options2: ['Gisela & Manuela', 'Kurt & Ralf', 'Helmut & Jimmy', 'Herbert & Markus'],
			index2: 1,
			question3: 'Wie hoch ist der Alkoholgehalt eines „1521“?',
			options3: ['4,7°', '4,9°', '5,1°', '5,3°'],
			index3: 2,
			question4: 'Dieses Gebäude gehörte einer Persönlichkeit der Städtepartnerschaft, welcher?',
			options4: ['Gildas Ferchaud', 'Henri Girardeau', 'Luc Chupin', 'Denis Fouillet'],
			index4: 1
		},
		{
			question1: 'Was symbolisiert die Rälle-Maske?',
			options1: ['Eine Katze', 'Ein Hund', 'Ein Bär', 'Ein Fuchs'],
			index1: 0,
			question2:
				'Damit der Bürgermeister die erste blau-weiß-rote Schnur von Tessallis durchtrennen konnte, wurde sie von zwei Trägern hochgehalten?',
			options2: [
				'Cater & Pillar',
				'Pierre & David',
				'Massey & Fergusson',
				'Paul De Dion & Jean Bouton'
			],
			index2: 1,
			question3: 'Wie hieß das Orchestre Harmonique de La Tessoualle vor dem Jahr 2000?',
			options3: [
				"L'harmonie Saint Louis",
				"L'harmonie Sainte Radegonde",
				"L'harmonie Saint Joseph",
				'La Tessoualle Orchestra'
			],
			index3: 2,
			question4: 'Wer waren die Könige der Fasnet 2023-Zeremonie?',
			options4: ['Uschi & Luc', 'Bernadette & Anton', 'Déborah & Markus', 'Adrian F & Sophie B'],
			index4: 3
		},
		{
			question1: 'Wer war das erste Ehepaar zwischen Tessoualle und Zwiefalten?',
			options1: ['Uschi & Luc', 'Doris & Michel', 'Bernadette & Anton', 'Déborah & Markus'],
			index1: 2,
			question2: 'Wie hieß das Spiel bei der Abschiedsparty des Jugendfahrt 2022 in La Tessoualle?',
			options2: [
				'Ei, Huhn, Dino',
				'Huhn, Fuchs, Viper',
				'Musikalische Stühle',
				'Das Spiel für 12 Monate'
			],
			index2: 0,
			question3: "Wie heißt das Lied, in dem wir „Buvons à l'aimable [...]“ ?",
			options3: ['Fanchon', 'Madelon', 'Marine', 'Huguette'],
			index3: 0,
			question4:
				'Wo trafen sich Franzosen und Deutsche in den letzten Jahren zum „richtigen“ Aufbruch bei Jugendreisen?',
			options4: [
				'Kurz vor der Autobahn',
				'Vor Jouteau',
				'Auf dem Place de la Poste',
				'Vor der alten Müllsammelstelle'
			],
			index4: 3
		},
		{
			question1: 'Welcher Vorname hatte Richards Großvater?',
			options1: ['Raymond', 'Maurice', 'Pierre', 'Firmin'],
			index1: 3,
			question2: 'Wie heißt einer der Söhne von Anne-Laure und Richard?',
			options2: ['Raymond', 'Maurice', 'Pierre', 'Firmin'],
			index2: 3,
			question3: "Man sagt oft 'blute' für 'Bleutre', aber was bedeutet das Verb 'bluter'?",
			options3: ['Mehl sieben', 'Nickerchen machen', 'Aperitif nehmen', 'Kochen'],
			index3: 0,
			question4:
				'Während des 50. Wochenendes hat Ghislaine in einem anderen Haus geschlafen, welchem?',
			options4: [
				'Im Hotel',
				'Bei Colette Brémaud',
				'Bei Alain Lamotte',
				'Das ist falsch, sie hat bei sich zu Hause geschlafen'
			],
			index4: 1
		}
	]
} as const;
