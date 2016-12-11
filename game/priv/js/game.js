//
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
//

function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}

function log(string) {
  var date = new Date();
  document.getElementById("log").innerHTML =
  format_time_component(date.getHours()) + ":"
  + format_time_component(date.getMinutes()) + ":"
  + format_time_component(date.getSeconds()) + ":"
  + date.getMilliseconds()
  + ": " + string;
}

function format_time_component(component) {
   if (component < 10)
       return "0" + component
   else
       return "" + component
}

//
// WEBSOCKETS
//

var socket = new WebSocket("ws://127.0.0.1:18080/websocket");

socket.onopen = function() {
  log("Connection established.");
};

socket.onclose = function(event) {
  if (event.wasClean) {
    log('Connection closed');
  } else {
    log('Connection lost'); // например, "убит" процесс сервера
  }
  log('Code: ' + event.code + ' reason: ' + event.reason);
};

socket.onmessage = function(event) {
  log("Incoming message: " + event.data);
};

socket.onerror = function(error) {
  log("Error: " + error.message);
};

//
// ИНИЦИАЛИЗАЦИЯ CRAFTY
//

var w = window.innerWidth;
var h = window.innerHeight;

Crafty.init(w, h, document.getElementById('game'));

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

Crafty.c('DelayAction', {
	init: function() {
	    this.isStarted = false;
	    this.ticks = 0;
	    this.triggerAfter = 0;
		this.bind("EnterFrame", function(e) {
        			if (this.isStarted) {
        			    if (this.ticks >= this.triggerAfter) {
                            this.trigger('Timeout', {});
                            this.isStarted = false;
                            this.ticks = 0;
        			    }
        			    else {
        			       this.ticks += 1;
        			    }
        			}
        });
    },
    delayAction: function (afterTicks) {
        this.isStarted = true;
        this.triggerAfter = afterTicks;
    }
});

Crafty.c('Unit', {
	init: function() {
		this.requires("2D");
		this.requires("Canvas");
		this.requires("SpriteAnimation");
		this.requires("DelayAction");

		this.attr({x: 0, y: 0, z: 1});
        this.speedVector = {x: -1, y: -1};
        this.state = "idle"
		// анимация движения, сами указатели на sprite
		// находятся в дочерних компонентах

		this.bind("Walk", function(e) {
		    if (this.state != "walk") {
		        this.state = "walk";
		        this.speedVector.x *= -1;
		        this.speedVector.y *= -1;
		        if(!this.isPlaying("walk"))
            		this.animate("walk", -1);
		    }
		});
		this.bind("Idle", function(e) {
        	if (this.state != "idle") {
                this.state = "idle";
        		if(!this.isPlaying("idle"))
        			this.animate("idle", -1);
        	}
        });
        this.bind("Fight", function(e) {
            if (this.state != "fight") {
                this.state = "fight";
        		if(!this.isPlaying("fight_right"))
        			this.animate("fight_right", -1);
        	}
        });
        this.bind("EnterFrame", function() {
              switch(this.state) {
                  case "idle":
                     break;
                  case "walk":
                     this.x += this.speedVector.x;
                     this.y += this.speedVector.y;
                     break;
                  case "fight":
                     break;
              };
              this.delayAction(50);
        });
        this.bind("Timeout", function (e) {
            actionNum = randomInteger(1, 3);
            switch (actionNum) {
                case 1:
                    this.trigger("Walk", {});
                    break;
                case 2:
                    this.trigger("Idle", {});
                    break;
                case 3:
                    this.trigger("Fight", {});
                    break;
            }
        });
	}
});

Crafty.c('NPC', {
	init: function() {
		this.requires("2D");
		this.requires("Canvas");
		this.requires("npc");
		this.requires("SpriteAnimation");
		this.requires("Unit");

		this.attr({x: 0, y: 0});

		//reel(ReelId, DurationMilliseconds, SpriteMapStartPosX, SpriteMapStartPosY, NumberOfSprites)
		this.reel('idle', 1000, 0, 1, 1);
		this.reel('walk', 1000, 0, 1, 4);
		this.reel('fight_right', 500, 0, 2, 4);
		this.reel('fight_left', 500, 0, 3, 4);
	},

	clear: function() {
		this.removeComponent('walk');
		this._visible = false;
	}
});

Crafty.e("NPC").attr({x: 2 * 32, y: 2 * 32}).delayAction(10);
Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e) {
	if(e.button > 1) return;
	var base = {x: e.clientX, y: e.clientY};

	function scroll(e) {
		var dx = base.x - e.clientX,
			dy = base.y - e.clientY;
		base = {x: e.clientX, y: e.clientY};
		Crafty.viewport.x -= dx;
		Crafty.viewport.y -= dy;
	};

	Crafty.addEvent(this, Crafty.stage.elem, "mousemove", scroll);
	Crafty.addEvent(this, Crafty.stage.elem, "mouseup", function() {
		Crafty.removeEvent(this, Crafty.stage.elem, "mousemove", scroll);
	});
});