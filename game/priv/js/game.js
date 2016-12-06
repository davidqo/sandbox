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

Crafty.c('Unit', {
	init: function() {
		this.requires("2D");
		this.requires("Canvas");
		this.requires("SpriteAnimation");

		this.attr({x: 0, y: 0, z: 1});

		// анимация движения, сами указатели на sprite
		// находятся в дочерних компонентах

		this.bind("Moved", function(e) {
			if(!this.isPlaying("walk"))
				this.stop().animate("walk", 2);
		});
	}
});

Crafty.c('NPC', {
	init: function() {
		this.requires("2D");
		this.requires("Canvas");
		this.requires("npc");
		this.requires("SpriteAnimation");
		//this.requires("Fourway");
		//this.fourway(100);

		this.attr({x: 0, y: 0});

		//reel(ReelId, DurationMilliseconds, SpriteMapStartPosX, SpriteMapStartPosY, NumberOfSprites)
		this.reel('idle', 1000, 0, 1, 4);
		this.reel('walk', 1000, 0, 1, 4);
		this.reel('hit_right', 500, 0, 2, 4);
		this.reel('hit_left', 500, 0, 3, 4);

		//this.bind("EnterFrame", function() {
		//	if(!this.isPlaying()) {
		//		this.animate("hit_right", -1);
		//	}
		//});
	},

	clear: function() {
		this.removeComponent('walk');
		this._visible = false;
	}
});

Crafty.e("NPC").attr({x: 2 * 32, y: 2 * 32});
