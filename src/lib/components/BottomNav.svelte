<script>
	import IonIosRadio from '~icons/ion/ios-radio';
	import Fa6RegularImages from '~icons/fa6-regular/images';
	import MaterialSymbolsPinDropOutline from '~icons/material-symbols/pin-drop-outline';
	import SolarRankingLineDuotone from '~icons/solar/ranking-line-duotone';
	import { Button } from '$lib/components/ui/button';
	let { opacity = 1, bottom = '3%' } = $props();
</script>

<nav class="nav-bar" style="opacity: {opacity}; bottom: {bottom};">
	<ul class="nav-bar_nav">
		<Button href="./gallery" variant="outline" size="icon">
			<Fa6RegularImages />
		</Button>
		<Button href="./home" variant="outline" size="icon">
			<IonIosRadio />
		</Button>
		<Button href="./ranking" variant="outline" size="icon">
			<SolarRankingLineDuotone />
		</Button>
	</ul>
</nav>

<style>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	.nav-bar {
		width: 80%;
		height: 65px;
		background: orangered;
		padding: 15px;
		margin: auto;
		border-radius: 15px;
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: -10%;
		transition-property: opacity, bottom;
		transition-duration: 0.5s;
		transition-timing-function: ease;
		z-index: 1;
		display: flex;
	}
	.nav-bar_nav {
		width: 100%;
		height: 100%;
		display: flex;
		list-style-type: none;
		justify-content: space-around;
		align-items: center;
	}
</style>
