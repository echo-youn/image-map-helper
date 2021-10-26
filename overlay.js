/* map element를 전부 가져온다. */
var ANCHOR = {
	x: 0,
	y: 0
};
resetOverlay();
var maps = document.querySelectorAll('map');

maps.forEach(map => {
	/* 가져온 map 중 img가 사용하고자 하는 map이 있는지 확인한다. */
	let imageRect = document.querySelector(`img[usemap="#${map.id}"]`).getBoundingClientRect().toJSON();
	/* body의 margin, padding, 스크롤의 상태 등을 위해 offset을 구해준다. */
	let bodyRect = document.body.getBoundingClientRect().toJSON();
	let offset = {
		x: bodyRect.x - document.body.computedStyleMap().get('margin-left').value,
		y: bodyRect.y - document.body.computedStyleMap().get('margin-top').value
	}
	let imageCord = {};

	/* 이미지의 시작 좌표값을 뽑아온다. */
	if (imageRect) {
		imageCord = {
			x: imageRect.x - offset.x,
			y: imageRect.y - offset.y
		}
		ANCHOR.x = imageRect.x - offset.x;
		ANCHOR.y = imageRect.y - offset.y;
	}
	else
		return;

	let areas = map.querySelectorAll('area');

	/* area들을 가져와 그 위치에 overlay를 입혀준다. */
	areas.forEach(area => {
		let coords = area.coords.split(',');
		let areaInfo = getAreaInfo(coords, imageCord);

		initOverlay(areaInfo, area.coords);
	})
})

function getAreaInfo(coordsArray, anchor) {
	return {
		x: Number(coordsArray[0]) + Number(anchor.x),
		y: Number(coordsArray[1]) + Number(anchor.y),
		width: Math.abs(Number(coordsArray[2]) - Number(coordsArray[0])),
		height: Math.abs(Number(coordsArray[3]) - Number(coordsArray[1]))
	}
}

function initOverlay(areaInfo, innerText) {
	let overlayArea = document.createElement('div');

	overlayArea.className = 'imgmap_overlay';
	overlayArea.style.position = 'absolute';
	overlayArea.style.top = areaInfo.y + 'px';
	overlayArea.style.left = areaInfo.x + 'px';
	overlayArea.style.width = areaInfo.width + 'px';
	overlayArea.style.height = areaInfo.height + 'px';
	overlayArea.style.backgroundColor = generateColor();
	overlayArea.style.opacity = 0.8;
	overlayArea.textContent = innerText || '';
	overlayArea.style.overflowWrap = 'break-word';

	overlayArea.onclick = getRelativePosition;

	document.body.append(overlayArea);
}

function generateColor() {
	return "hsl(" + 360 * Math.random() + ',' +
		(25 + 70 * Math.random()) + '%,' +
		(85 + 10 * Math.random()) + '%)'
}

function getRelativePosition(event) {
	let el = event.path[0];
	let top = Number(el.style.top.match(/\d/g).join(''));
	let left = Number(el.style.left.match(/\d/g).join(''));
	let width = Number(el.style.width.match(/\d/g).join(''))
	let height = Number(el.style.height.match(/\d/g).join(''))

	console.info({
		x1: left - ANCHOR.x,
		y1: top - ANCHOR.y,
		x2: left - ANCHOR.x + width,
		y2: top - ANCHOR.y + height,
	})
}

function resetOverlay() {
	document.querySelectorAll('.imgmap_overlay').forEach((overlay) => {
		overlay.remove();
	});
}