function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}

Crafty.init(500,350, document.getElementById('game'));

Crafty.sprite(32, "img/sprite_map.png", {
		grass1: [0,0],
		grass2: [1,0],
		grass3: [2,0],
		grass4: [3,0],
		npc: [0,1]
	});

for(var i = 0; i < 20; i++) {
    for(var j = 0; j < 20; j++) {
        grassType = randomInteger(1, 4);
        Crafty.e("2D, Canvas, grass" + grassType).attr({x: i * 32, y: j * 32});
    }
}

Crafty.e("2D, DOM, npc, Animate")
						.attr({x: 2 * 32, y: 2 * 32})
						.animate("walk", 0, 1, 2)
						.bind("enterframe", function() {
							if(!this.isPlaying())
								this.animate("walk", 80);
						});