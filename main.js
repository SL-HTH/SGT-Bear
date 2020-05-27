/**
 * BUG:
 * -chime replay
 * --->JS problem. 
 * ---<onend stop 
 * ---<time = duration stop
 * 
 * -MultiZero
 * 
 */

 /**
  * TODO:
  * -Mobile Support
  * --Controls
  * --Viewport
  * --Zoom/Scale
  * 
  * -Meta Tags HTML
  * 
  * -Comment name
  */

/**
 * REFS
 * https://inventwithpython.com/blogstatic/stratego.jpg
 * https://en.wikipedia.org/wiki/Stratego
 * 
 */

const ini = {
  WIDTH:  160,
  HEIGHT: 144,
  SPRITE_SIZE: 8,

  MUTED: false,

  SCALE: 4
};

const assets = {
  toLoad: 15,
  loaded: 0,

  imgs: [],
  snds: [],
  maps: [],
  diag: []
};

let cnv = null;
let ctx = null;







/******************
 *    HANDLERS    *
 ******************/
let keys = [];
const keyHandler = e => {
  e.preventDefault();

  keys[e.keyCode] = (e.type == "keydown");
};

function AnimationHandler(frame_set, delay){
  this.count = 0;
  this.delay = delay;
  this.frame = 0;
  this.frame_index = 0;
  this.frame_set = frame_set;

  this.change = function(frame_set, delay=0.5){
    if (this.frame_set != frame_set){
      this.count = 0;
      this.delay = delay;
      this.frame_index = 0;
      this.frame_set = frame_set;
      this.frame = this.frame_set[this.frame_index];
    }
  }

  this.update = function(dt){
    this.count += dt;

    if (this.count >= this.delay){
      this.count = 0;

      this.frame_index = (this.frame_index == this.frame_set.length-1) ? 0 : this.frame_index + 1;
      this.frame = this.frame_set[this.frame_index];
    }
  }
}

function LabelHandler(text="no text", x=0, y=16, f_x=0, f_y=16, f_w=20, f_h=2){
  this.text = text.toString().toUpperCase();

  this.letters = [];

  this.x = x > 0 ? x : 0;
  this.y = y > 0 ? y : 0;
  this.o_x = this.x;
  this.o_y = this.y;

  this.f_x = f_x > 0 ? f_x : 0;
  this.f_y = f_y > 0 ? f_y : 0;
  this.f_w = f_w > 0 ? f_w : 0;
  this.f_h = f_h > 0 ? f_h : 0;

  this.letters_done = false;

  this.first = true;

  this.change = function(text=this.text,x=this.o_x,y=this.o_y,f_x=this.f_x,f_y=this.f_y,f_w=this.f_w,f_h=this.f_h){
    if (this.text == text && !this.first)return;

    this.first = false;

    this.letters_done = false;
    this.text = text.toString().toUpperCase();
    this.x = x;
    this.y = y;

    this.f_x = f_x;
    this.f_y = f_y;
    this.f_w = f_w;
    this.f_h = f_h;

    this.letters.splice(0,this.letters.length);

    let newline = false;
    let line = 0;

    for (let l in this.text){
      let char = this.text[l];

      let letter = {
        x: this.x,
        y: this.y + line,

        sx: 0,
        sy: 248
      };

      newline = false;

      switch(char){
        // Empties
        case '#':
          newline = true;
          this.x = this.o_x-1;
          line++;
          break;
        case ' ':
          letter.sx = 26;
          break;

        // Punctuation
        case '!':
          letter.sy-=16;
          break;
        case '*':
          letter.sx = 1;
          letter.sy-=16;
          break;
        case '(': 
          letter.sx = 2;
          letter.sy-=16;
          break;
        case ')':
          letter.sx = 3;
          letter.sy-=16;
          break;
        case '-':
          letter.sx = 4;
          letter.sy-=16;
          break;
        case '+':
          letter.sx = 5;
          letter.sy-=16;
          break;
        case '[':
          letter.sx = 6;
          letter.sy-=16;
          break;
        case ']':
          letter.sx = 7;
          letter.sy-=16;
          break;
        case ':':
          letter.sx = 8;
          letter.sy-=16;
          break;
        case ';':
          letter.sx = 9;
          letter.sy-=16;
          break;
        case '\"': 
          letter.sx = 10;
          letter.sy-=16;
          break;
        case '\'': 
          letter.sx = 11;
          letter.sy-=16;
          break;
        case ',':
          letter.sx = 12;
          letter.sy-=16;
          break;
        case '.':
          letter.sx = 13;
          letter.sy-=16;
          break;
        case '?':
          letter.sx = 14;
          letter.sy-=16;
          break;

        // Numbers
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          letter.sx = Number(char);
          letter.sy -= 8; 
          break;

        // Arrows
        case '<':
          letter.sx = 10;
          letter.sy -=8;
          break;
        case '^':
          letter.sx = 11;
          letter.sy -=8;
          break;
        case '>':
          letter.sx = 12;
          letter.sy -=8;
          break;
        case '=':
          letter.sx = 13;
          letter.sy -=8;
          break;

        // Control Icons
        case '@':
          letter.sx = 14;
          letter.sy -= 8;
          break;
        case '&':
          letter.sx = 15;
          letter.sy -=8;
          break;
        case '%':
          letter.sx = 16;
          letter.sy -= 8;
          break;

        // ABCs
        default: 
          letter.sx = char.charCodeAt(0) % 65;
          break;
      }

      this.x++;

      if (!newline){
        this.letters.push(letter);
      }
    }

    this.letters_done = true;
    
  }

  this.update = function(dt){}

  this.draw = function(){
    // Background
    ctx.drawImage(
      assets.imgs['main'],
      8, 216, ini.SPRITE_SIZE, ini.SPRITE_SIZE,
      this.f_x * ini.SPRITE_SIZE * ini.SCALE, this.f_y * ini.SPRITE_SIZE * ini.SCALE, this.f_w * ini.SPRITE_SIZE * ini.SCALE, this.f_h * ini.SPRITE_SIZE * ini.SCALE
    );

    if (this.letters_done)
      // Letters
      for (const l of this.letters){
        ctx.drawImage(
          assets.imgs['main'],
          l.sx * ini.SPRITE_SIZE, l.sy, ini.SPRITE_SIZE, ini.SPRITE_SIZE,
          l.x * ini.SPRITE_SIZE * ini.SCALE, l.y * ini.SPRITE_SIZE * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE
        );
      }
  }

  this.change();
}








/**********************
 *    GAME OBJECTS    *
 **********************/
function GameObject(type="no_type", x=0, y=0){
  this.type = type;

  this.x = x;
  this.y = y;
  this.w = ini.SPRITE_SIZE;
  this.h = ini.SPRITE_SIZE;

  this.image = 'main';
  this.sx = 0;
  this.sy = 0;
  this.sw = ini.SPRITE_SIZE;
  this.sh = ini.SPRITE_SIZE;

  this.init   = function(){}
  this.update = function(dt){}
  this.draw   = function(){
    ctx.drawImage(
      assets.imgs[this.image],
      this.sx, this.sy, this.sw, this.sh,
      this.x * ini.SCALE, this.y * ini.SCALE, this.w * ini.SCALE, this.h * ini.SCALE
    );
  }
}

function GamePiece(x=0,y=0,value=-1, tile_id=0){
  let self = new GameObject("game_piece", x, y);

  self.descriptions = [
    "flag#capture this to win",
    "assassin#kill# *marshall# *miner#killed by# *all but miner",
    "scout#kill# *scout# *assassin# *miner#killed by# *bomb# *scout# *marshall",
    "miner#kill# *bomb#killed by# *all",
    "marshall#kill# *all but bomb#killed by# *bomb# *assassin",
    "bomb#kill# *all#killed by# *miner",
    "ERROR#error# *error#error# *error"
  ];

  
  self.kill = [
  //[F,A,S,m,M,b]
    [0,0,0,0,0,0], //F
    [1,1,0,1,1,0], //A
    [1,1,1,1,0,0], //S
    [1,0,0,1,0,1], //m
    [1,1,1,1,1,0], //M
    [0,1,1,1,1,1]  //b
  ];

  self.description = self.descriptions[value];

  self.movable = true;


  self.canKill = function(value){
    return this.kill[this.value][value];
  }

  self.step = 1;

  self.value = value;
  self.tile_id = tile_id-1;
  self.tiles = {
    TL: self.tile_id,
    TR: self.tile_id + 1,
    BL: self.tile_id + 32,
    BR: self.tile_id + 1 + 32
  };

  return self;
}

function Soldier(x=0,y=0,value=-1,tile_id=-1){
  let self = GamePiece(x,y,value,tile_id);

  self.anim = new AnimationHandler([620, 622], 0.3);
  self.anim.frame = 620;

  self.update = function(dt){
    this.anim.update(dt);
  }

  self.draw = function(){
    // Bear
    ctx.drawImage(
      assets.imgs['main'],
      this.anim.frame % 32 * ini.SPRITE_SIZE, ((this.anim.frame / 32) | 0) * ini.SPRITE_SIZE, 16, 16,
      (this.x - ini.SPRITE_SIZE) * ini.SCALE, (this.y - ini.SPRITE_SIZE) * ini.SCALE, ini.SPRITE_SIZE * 2 * ini.SCALE, ini.SPRITE_SIZE * 2 * ini.SCALE
    );

    // Type
    ctx.drawImage(
      assets.imgs['main'],
      this.sx, this.sy, ini.SPRITE_SIZE, ini.SPRITE_SIZE,
      this.x * ini.SCALE, this.y * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE
    );
  }

  return self;
}

function Bomb(x=0,y=0,value=-1,tile_id=-1){
  let self = GamePiece(x,y,value,tile_id);

  self.anim = new AnimationHandler([624, 626], 0.1);
  self.anim.frame = 624;

  self.update = function(dt){
    this.anim.update(dt);
  }

  self.draw = function(){
    // Bomb
    ctx.drawImage(
      assets.imgs['main'],
      this.anim.frame % 32 * ini.SPRITE_SIZE, ((this.anim.frame / 32) | 0) * ini.SPRITE_SIZE, 16, 16,
      (this.x - ini.SPRITE_SIZE) * ini.SCALE, (this.y - ini.SPRITE_SIZE) * ini.SCALE, ini.SPRITE_SIZE * 2 * ini.SCALE, ini.SPRITE_SIZE * 2 * ini.SCALE
    );
  }

  return self;
}

function Flag(x=0,y=0,value=-1,tile_id=-1){
  let self = GamePiece(x,y,value,tile_id);

  self.anim = new AnimationHandler([608, 610, 612, 614, 616, 618], 0.2);
  self.anim.frame = 608;

  self.update = function(dt){
    this.anim.update(dt);
  }

  self.draw = function(){
    // Flag
    ctx.drawImage(
      assets.imgs['main'],
      this.anim.frame % 32 * ini.SPRITE_SIZE, ((this.anim.frame / 32) | 0) * ini.SPRITE_SIZE, 16, 16,
      (this.x - ini.SPRITE_SIZE) * ini.SCALE, (this.y - ini.SPRITE_SIZE) * ini.SCALE, ini.SPRITE_SIZE * 2 * ini.SCALE, ini.SPRITE_SIZE * 2 * ini.SCALE
    );
  }

  return self;
}

function Enemy(x=0,y=0,value=-1,tile_id=-1){
  let self = GamePiece(x,y,value,tile_id);

  self.anim = new AnimationHandler([628, 630, 628, 632], 0.5);
  self.anim.frame = 628;

  self.update = function(dt){
    this.anim.update(dt);
  }

  self.draw = function(){
    // Bomb
    ctx.drawImage(
      assets.imgs['main'],
      this.anim.frame % 32 * ini.SPRITE_SIZE, ((this.anim.frame / 32) | 0) * ini.SPRITE_SIZE, 16, 16,
      (this.x - ini.SPRITE_SIZE) * ini.SCALE, (this.y - ini.SPRITE_SIZE) * ini.SCALE, ini.SPRITE_SIZE * 2 * ini.SCALE, ini.SPRITE_SIZE * 2 * ini.SCALE
    );
  }

  return self;
}

function OceanPiece(x=0,y=0, frame_set=[]){
  let self = new GameObject("ocean", x, y);

  self.tile_id=-1;

  self.anim = new AnimationHandler(frame_set, 0.5);
  self.anim.frame = frame_set[0];

  self.update = function(dt){
    this.anim.update(dt);
  }

  self.draw = function(){
    ctx.drawImage(
      assets.imgs['main'],
      this.anim.frame % 32 * ini.SPRITE_SIZE, ((this.anim.frame / 32) | 0) * ini.SPRITE_SIZE, this.sw, this.sh,
      this.x * ini.SCALE, this.y * ini.SCALE, this.w * ini.SCALE, this.h * ini.SCALE
    );
  }

  return self;
}










/****************
 *    STATES    *
 ****************/
function State(){
  this.timer = 0;

  this.onEnter = function(){};
  this.init = function(){};
  this.update = function(dt){};
  this.render = function(){};
  this.onExit = function(){};
}

let stateStack = null;
function StateStack(){
  this.states = [];

  this.push = function(state=null){
    if (state){
      state.onEnter();
      this.states.push(state);
    }
  }

  this.pop = function(){
    if (this.states[this.states.length-1] != null ||
        this.states[this.states.length-1] != undefined
      )this.states.pop().onExit();
  }

  this.flush = function(){
    this.states.splice(0,this.states.length);
  }

  this.update = function(dt){
    this.states.length > 0 ? this.states[this.states.length-1].update(dt) : null;
  }

  this.render = function(){
    for (const s of this.states){
      s.render();
    }
  }

  this.length = function(){
    return this.states.length;
  }
}

function LogoState(){
  let self = new State();

  self.rect = {
    x:  4*ini.SPRITE_SIZE,
    y:  7*ini.SPRITE_SIZE,
    w: 16,
    h: 16,

    speed: 2,

    color: "#F00"
  };

  self.duration = 3;

  self.onEnter = function(){
    assets.snds['music_main'].pause();
    assets.snds['music_main'].currentTime = 0;
  }

  self.update = function(dt){
    this.timer += dt;

    this.rect.x+=this.rect.speed;

    if (!assets.snds['logo_bell'].playing){
      assets.snds['logo_bell'].play();
    }

    if (this.timer >= this.duration){
      assets.snds['logo_bell'].pause();
      assets.snds['logo_bell'].currentTime = 0;
      stateStack.pop();
      stateStack.push(StartScreenState());
    }
  }

  self.render = function(){
    

    // Logo 
    ctx.drawImage(
      assets.imgs['main'],
      120, 0, 88, 16,
      4.5 * ini.SPRITE_SIZE * ini.SCALE, 7 * ini.SPRITE_SIZE * ini.SCALE, 88 * ini.SCALE, 16 * ini.SCALE
    );

    // Rectangle
    ctx.drawImage(
      assets.imgs['main'],
      208, 0, ini.SPRITE_SIZE*2, ini.SPRITE_SIZE*2,
      this.rect.x * ini.SCALE, this.rect.y * ini.SCALE, this.rect.w * ini.SCALE, this.rect.h * ini.SCALE
    );
  }

  return self;
}

function StartScreenState(){
  let self = new State();

  self.img_title = {
    x: 6*ini.SPRITE_SIZE,
    y: -2*ini.SPRITE_SIZE,
    w: 8*ini.SPRITE_SIZE,
    h: 4*ini.SPRITE_SIZE,

    sx: 8,
    sy: 0,
    sw: 8 * ini.SPRITE_SIZE,
    sh: 4 * ini.SPRITE_SIZE,

    delay: 0.02,
    speed: 3,
    target_y: 6*ini.SPRITE_SIZE,

    isDone: false
  };

  self.letter_x = 0 * ini.SPRITE_SIZE;
  self.letter_y = 10 * ini.SPRITE_SIZE;
  self.letter_speed = 1;
  self.letter_delay = 0.01;
  self.letter_target_x = 7*ini.SPRITE_SIZE;
  self.letter_done = false;

  self.update = function(dt){
    this.timer += dt;

    if (this.img_title.isDone && this.letter_done){
      if (keys[90]){
        stateStack.push(FadeState(false, 0.5, 0.5, ()=>{
          stateStack.pop();

          //return PlacementState("map");

          // Story
          return DialogueState("humans have taken#over our island!!=",1,15,18,2,1,()=>{
            stateStack.pop();
            return DialogueState("please help us#drive them out!=",1,15,18,2,1,()=>{
              return OptionState(">yes# no", 8, 15, 4, 2, 0, ()=>{
                stateStack.push(FadeState(false, 0.3, 0.2,()=>{
                  stateStack.pop();
                  stateStack.pop();

                  stateStack.push(PlacementState("map"))

                  return FadeState(true, 0.3, 0.2);
                }))
              }, ()=>{
                stateStack.pop();
                stateStack.pop();
                return DialogueState("ok#=", 9, 10, 2, 2, 1, ()=>{
                  return FadeState(false, 0.5, 0.2, ()=>{
                    stateStack.pop();
                  });
                }, 0, 'l', [0,1], 'voice_deep');
              });
            },0,'c',[0,1]);
          },0,'c',[0,1]);
        }));
      }
    }

    if (this.timer >= this.img_title.delay && !this.img_title.isDone){
      this.timer = 0;
      this.img_title.y+=this.img_title.speed;

      if (this.img_title.y >= this.img_title.target_y){
        this.img_title.y = this.img_title.target_y;
        this.img_title.isDone = true;
      }
    }

    if (this.timer >= this.letter_delay && this.img_title.isDone && !this.letter_done){
      this.timer = 0;
      this.letter_x+=this.letter_speed;

      if (this.letter_x >= this.letter_target_x){
        this.letter_done = true;
        this.letter_x = this.letter_target_x;
      }
    }
  }



  self.render = function(){
    // Title image
    ctx.drawImage(
      assets.imgs['main'],
      this.img_title.sx, this.img_title.sy, this.img_title.sw, this.img_title.sh,
      this.img_title.x * ini.SCALE, this.img_title.y * ini.SCALE, this.img_title.w * ini.SCALE, this.img_title.h * ini.SCALE
    );

    // >
    ctx.drawImage(
      assets.imgs['main'],
      96,240,ini.SPRITE_SIZE,ini.SPRITE_SIZE,
      this.letter_x * ini.SCALE, this.letter_y * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE
    );
    // S
    ctx.drawImage(
      assets.imgs['main'],
      144,248,ini.SPRITE_SIZE,ini.SPRITE_SIZE,
      (this.letter_x + ini.SPRITE_SIZE) * ini.SCALE, this.letter_y * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE
    );
    // T
    ctx.drawImage(
      assets.imgs['main'],
      152,248,ini.SPRITE_SIZE,ini.SPRITE_SIZE,
      (this.letter_x + 2 * ini.SPRITE_SIZE) * ini.SCALE, this.letter_y * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE
    );
    // A
    ctx.drawImage(
      assets.imgs['main'],
      0,248,ini.SPRITE_SIZE,ini.SPRITE_SIZE,
      (this.letter_x + 3 * ini.SPRITE_SIZE) * ini.SCALE, this.letter_y * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE
    );
    // R
    ctx.drawImage(
      assets.imgs['main'],
      136,248,ini.SPRITE_SIZE,ini.SPRITE_SIZE,
      (this.letter_x + 4 * ini.SPRITE_SIZE) * ini.SCALE, this.letter_y * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE
    );
    // T
    ctx.drawImage(
      assets.imgs['main'],
      152,248,ini.SPRITE_SIZE,ini.SPRITE_SIZE,
      (this.letter_x + 5 * ini.SPRITE_SIZE) * ini.SCALE, this.letter_y * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE
    );
  }

  return self;
}

function PlacementState(map="no_map"){
  let self = new State();

  self.onEnter = function(){
    fetch("map.json")
    .then(res=>res.json())
    .then(data=>{
      assets.maps['map'] = {...data};

      this.build_map();
    })
    .catch(e=>console.error(e));
    
  }

  self.build_map = function(){
    for (const i in assets.maps[this.currentMap].layers[1].data){
      let current = assets.maps[this.currentMap].layers[1].data[i];

      if (current != 0){
        let sprite = null;

        let xx = (i % assets.maps[this.currentMap].width) * ini.SPRITE_SIZE;
        let yy = ((i / assets.maps[this.currentMap].width) | 0) * ini.SPRITE_SIZE;

        let sx = ((current-1) % 32)       * ini.SPRITE_SIZE;
        let sy = (((current-1) / 32) | 0) * ini.SPRITE_SIZE;

        // let value = (sx / ini.SPRITE_SIZE * 0.5) | 0; // OLD
        let value = (sx / ini.SPRITE_SIZE) | 0;

        /*switch(value){
          case 0: value = 0; break;
          case 1: value = 1; break;
          case 2:
          case 3:
          case 4:
          case 5: value = 2; break;
          case 6:
          case 7:
          case 8: value = 3; break;
          case 9: value = 4; break;
          case 10:
          case 11:
          case 12: value = 5; break;

          default: value = 6; break;
        }*/

        switch(current){
          // Old pieces
          case 161:
          case 163:
          case 165:
          case 167:
          case 169:
          case 171:
          case 173:
          case 175:
          case 177:
          case 179:
          case 181:
          case 183:
          case 185:
            sprite = new GamePiece(xx, yy, value, current);
            sprite.sw = 16;
            sprite.w = 16;
            sprite.sh = 16;
            sprite.h = 16;
            break;


          // Ocean
          // -non anim
          case 344:
          case 346:
          case 408:
          case 410:
            sprite = new OceanPiece(xx, yy, [current-1]);
            break;

          // -anim
          case 345:
          case 376:
          case 378:
            sprite = new OceanPiece(xx, yy, [current-1, (current-1) + 3]);
            break;

          // Soldiers
          case 673:
          case 674:
          case 675:
          case 676:
            sprite = new Soldier(xx,yy,value+1,current);
            break;

          case 658:
            sprite = new Bomb(xx,yy,5,current);
            break;
          
          case 642:
            sprite = new Flag(xx,yy,0,current);
            break;
        }

        if (sprite != null){
          sprite.sx = sx;
          sprite.sy = sy;
          this.gameobjects.push(sprite);
        }
      }

    }

    this.map_built = true;

  }

  let gameBoard = [
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0]
  ];

  self.map_built = false;

  self.gameobjects = [];
  self.map_data = {};
  self.map_read = false;

  self.currentMap = map;

  self.txt_controls = "%move @select place#&finish";

  self.label = new LabelHandler(self.txt_controls);
  self.label_timer = 0;
  self.label_cooldown = 0.8;

  self.cursor = {
    x: 1,
    y: 1,
    w: 2,
    h: 2,

    selected: false,
    tile_ptr: null,

    select_cooldown: 0.3,
    grab_timer: 0,
    place_timer: 0,

    next_x: 1,
    next_y: 1,

    step: 2,

    cooldown: 0.23,
    timer: 0,

    update: function(dt){
      this.timer += dt;

      if (this.timer >= this.cooldown && !keys[90]){
        this.timer = 0;
        if (keys[37]){
          this.next_x-=this.step;

          if (getTile(this.next_x, this.next_y, self.currentMap, 0) == 78){
            this.next_x = this.x;
          }

          if (
              this.selected && getTile(this.next_x, this.next_y, self.currentMap, 2) > 0 /*||
              this.selected && getTile(this.next_x, this.next_y, self.currentMap, 1) > 0*/
            ){
            this.next_x = this.x;
          }
        }
        else if (keys[39]){
          this.next_x += this.step;

          if (getTile(this.next_x, this.next_y, self.currentMap, 0) == 78){
            this.next_x = this.x;
          }

          if (
              this.selected && getTile(this.next_x, this.next_y, self.currentMap, 2) > 0 //||
              //this.selected && getTile(this.next_x, this.next_y, self.currentMap, 1) > 0
            ){
            this.next_x = this.x;
          }
        }

        if (keys[38]){
          this.next_y -= this.step;

          if (getTile(this.next_x, this.next_y+1, self.currentMap, 0) == 78){
            this.next_y = this.y;
          }

          if (
              this.selected && getTile(this.next_x, this.next_y, self.currentMap, 2) > 0 //||
              //this.selected && getTile(this.next_x, this.next_y, self.currentMap, 1) > 0
            ){
            this.next_y = this.y;
          }
        }
        else if (keys[40]){
          this.next_y += this.step

          if (getTile(this.next_x, this.next_y, self.currentMap, 0) == 78){
            this.next_y = this.y;
          }

          if (
              this.selected && getTile(this.next_x, this.next_y, self.currentMap, 2) > 0 //||
              //this.selected && getTile(this.next_x, this.next_y, self.currentMap, 1) > 0 
            ){
            this.next_y = this.y;
          }
        }

        
      }

      if (!this.selected)this.grab_timer += dt;

      // Change to game state
      if (keys[88] && !this.selected){
        stateStack.push(OptionState(">not ready# ready", 5, 6, 10, 2, 0, ()=>{stateStack.pop()},()=>{ 
          stateStack.pop();
          stateStack.push(FadeState(false, 0.03, 0.03, ()=>{
            stateStack.pop();
            stateStack.push(GameState(self.gameobjects, self.currentMap))
            stateStack.push(FadeState(true, 0.03,0.03)
          )}))
        }));
      }

      if (keys[90] && !this.selected && this.grab_timer >= this.select_cooldown){
        this.grab_timer = 0;
        /*if(
            getTile(this.next_x, this.next_y, self.currentMap, 1) >= 161 &&
            getTile(this.next_x, this.next_y, self.currentMap, 1) <= 185
          ){
          if (!this.selected){
            for (const o of self.gameobjects){
              if (o.x == this.x * ini.SPRITE_SIZE && o.y == this.y * ini.SPRITE_SIZE){
                this.tile_ptr = o;
                this.selected = true;

                setTile(this.x,   this.y,   -1, self.currentMap, 1);
                setTile(this.x+1, this.y,   -1, self.currentMap, 1);
                setTile(this.x,   this.y+1, -1, self.currentMap, 1);
                setTile(this.x+1, this.y+1, -1, self.currentMap, 1);
                break;
              }
            }
          }
        }*/

        // NEW check for shield
        if (
          (getTile(this.next_x + 1, this.next_y + 1, self.currentMap, 1) >= 673 &&
          getTile(this.next_x + 1, this.next_y + 1, self.currentMap, 1) <= 676) ||
          getTile(this.next_x+1, this.next_y+1, self.currentMap, 1) == 658      ||
          getTile(this.next_x+1, this.next_y+1, self.currentMap, 1) == 642
        ){
          if (!this.selected){
            for (const o of self.gameobjects){
              if (o.x == (this.x + 1) * ini.SPRITE_SIZE && o.y == (this.y + 1) * ini.SPRITE_SIZE){
                this.tile_ptr = o;
                this.selected = true;

                setTile(this.x + 1,   this.y + 1,   -1, self.currentMap, 1);
              }
            }
          }
        }

        
      }

      if (this.selected){
        this.place_timer += dt;
        this.tile_ptr.x = (this.next_x + 1) * ini.SPRITE_SIZE;
        this.tile_ptr.y = (this.next_y + 1) * ini.SPRITE_SIZE;

        // Print details
        if (self.label_timer >= self.label_cooldown){
          self.label.change(this.tile_ptr.description,0,0,0,0,20,9);
        }

        // CANT PLACE HERE
        if (keys[90] && this.place_timer >= this.select_cooldown){
          if (getTile(this.next_x+1, this.next_y+1, self.currentMap, 1) > 0){
            self.label.change("can't place here!!",0,16,0,16,20,2);
            self.label_timer = 0;
          }
          else {
            this.place_timer = 0;
            this.selected = false;

            setTile(this.next_x + 1, this.next_y + 1, this.tile_ptr.tile_id, self.currentMap, 1);
          }
        }
      }

      this.x = this.next_x;
      this.y = this.next_y;
      
    },

    draw: function(){
      ctx.strokeStyle = "red"
      ctx.strokeRect(
        this.x * ini.SPRITE_SIZE * ini.SCALE, this.y * ini.SPRITE_SIZE * ini.SCALE, 
        this.w * ini.SPRITE_SIZE * ini.SCALE, this.h * ini.SPRITE_SIZE * ini.SCALE
      );
    }
  };

  self.update = function(dt){
    if (!this.map_built)return;
    this.label_timer += dt;
    if (this.label_timer >= this.label_cooldown && !this.cursor.selected)this.label.change(this.txt_controls,0, 16, 0, 16,20,2);

    this.cursor.update(dt);

    for (const o of this.gameobjects)o.update(dt);
  }

  self.render = function(){
    this.draw_map();

    for (const o of this.gameobjects){
      o.draw();
    }

    this.cursor.draw();

    this.label.draw();
  }

  self.draw_map = function(){
    //for (const l in assets.maps[this.currentMap].layers){
      for (const i in assets.maps[this.currentMap].layers[0].data){
        let current = assets.maps[this.currentMap].layers[0].data[i];

        if (current != 0){
          let sprite = null;

          let xx = (i % assets.maps[this.currentMap].width) * ini.SPRITE_SIZE;
          let yy = ((i / assets.maps[this.currentMap].width) | 0) * ini.SPRITE_SIZE;

          let sx = ((current-1) % 32)       * ini.SPRITE_SIZE;
          let sy = (((current-1) / 32) | 0) * ini.SPRITE_SIZE;

          ctx.drawImage(
            assets.imgs['main'],
            sx, sy, ini.SPRITE_SIZE, ini.SPRITE_SIZE,
            xx*ini.SCALE,yy*ini.SCALE,ini.SPRITE_SIZE*ini.SCALE,ini.SPRITE_SIZE*ini.SCALE
          );
        }
      }
    //}
  }

  

  return self;
}

function GameState(go=null, map="no_map"){
  let self = new State();

  self.gameobjects = [...go];
  self.egobjects = [];

  self.currentMap = map.toString();

  self.formations = [
    "formation_1",
    "formation_2",
    "formation_3",
    "formation_4",
    "formation_5"
  ];
  self.level = Math.random() * self.formations.length | 0;

  self.formationMap = self.formations[self.level];

  
  self.label_text = {
    p: "%move @select place#&view piece details",
    e: "Enemy turn"
  }
  self.label = new LabelHandler(self.label_text.p);
  self.label_timer = 0;
  self.label_cooldown = 0.3;

  self.turn = 'e';

  self.enemy_move_cooldown = 1;
  self.enemy_move_timer = 0;

  self.can_move = {p:true,e:true};

  self.cursor = {
    x: 9,
    y: 11,
    w: 2,
    h: 2,

    step: 2,
    timer: 0,
    cooldown: 0.3,

    next_x:  9,
    next_y: 11,

    old_x:  9,
    old_y: 11,

    selected: false,
    o_ptr: null,

    key_press: 0,

    update: function(dt){
      this.timer += dt;

      if (!this.selected)this.move_phase(dt);
      else this.place_phase(dt);
      
    },

    move_phase: function(dt){
      if (this.timer >= this.cooldown){
        if (keys[37]){
          this.timer = 0;
          this.next_x -= this.step;

          if (getTile(this.next_x, this.next_y, self.currentMap, 0) == 78){
            this.next_x = this.x;
          }

        }
        else if (keys[38]){
          this.timer = 0;
          this.next_y -= this.step;

          if (getTile(this.next_x, this.next_y+1, self.currentMap, 0) == 78){
            this.next_y = this.y;
          }
        }
        else if (keys[39]){
          this.timer = 0;
          this.next_x += this.step;

          if (getTile(this.next_x+1, this.next_y, self.currentMap, 0) == 78){
            this.next_x = this.x;
          }
        }
        else if (keys[40]){
          this.timer = 0;
          this.next_y += this.step;

          if (getTile(this.next_x, this.next_y, self.currentMap, 0) == 78){
            this.next_y = this.y;
          }
        }

        if (keys[90]){
          this.timer = 0;

          let tile = getTile(this.next_x+1, this.next_y+1, self.currentMap, 1);

          /*switch(tile){
            case 163:
            case 165:
            case 167:
            case 169:
            case 171:
            case 173:
            case 175:
            case 177:
            case 179:
              this.selected = true;
              break;
            case 161:
            case 181:
            case 183:
            case 185:
              self.label_timer = 0;
              self.label.change("Cant move", 5);
              break;
          }*/

          // NEW
          switch(tile){
            case 673:
            case 674:
            case 675:
            case 676:
              this.selected = true;
              break;
          }

          if (this.selected){
            for (const o of self.gameobjects){
              /*console.log(o.x == this.x* ini.SPRITE_SIZE && o.y == this.y* ini.SPRITE_SIZE)
              if (o.x == this.x* ini.SPRITE_SIZE && o.y == this.y* ini.SPRITE_SIZE){
                
                this.o_pointer = o;
                this.timer = 0;
                this.old_x = this.x;
                this.old_y = this.y;

                setTile(this.x,   this.y,   -1, self.currentMap, 1);
                setTile(this.x+1, this.y,   -1, self.currentMap, 1);
                setTile(this.x,   this.y+1, -1, self.currentMap, 1);
                setTile(this.x+1, this.y+1, -1, self.currentMap, 1);
                break;
              }*/

              // NEW
              if (o.x == (this.x + 1) * ini.SPRITE_SIZE && o.y == (this.y+1) * ini.SPRITE_SIZE){
                this.o_pointer = o;
                this.timer = 0;
                this.old_x = this.x;
                this.old_y = this.y;

                setTile(this.x + 1, this.y+1, -1, self.currentMap, 1);
              }
            }
          }
          
        }
      }

      this.x = this.next_x;
      this.y = this.next_y;
    },

    place_phase: function(dt){
      // Cancel or skip turn (B)
      if (keys[88]){
        this.selected = false;
      }

      if (this.timer >= this.cooldown){
        if (keys[37]){
          this.timer = 0;
          this.next_x -= this.step;

          if (this.next_x <= this.old_x-4){
            this.next_x = this.x;
          }

          if (getTile(this.next_x, this.next_y, self.currentMap, 0) == 78){
            this.next_x = this.x;
          }
        }
        else if (keys[38]){
          this.timer = 0;
          this.next_y -= this.step;

          if (this.next_y <= this.old_y-4){
            this.next_y = this.y;
          }

          if (getTile(this.next_x, this.next_y+1, self.currentMap, 0) == 78){
            this.next_y = this.y;
          }
        }
        else if (keys[39]){
          this.timer = 0;
          this.next_x += this.step;

          if (this.next_x >= this.old_x+4){
            this.next_x = this.x;
          }

          if (getTile(this.next_x+1, this.next_y, self.currentMap, 0) == 78){
            this.next_x = this.x;
          }
        }
        else if (keys[40]){
          this.timer = 0;
          this.next_y += this.step;

          if (this.next_y >= this.old_y+4){
            this.next_y = this.y;
          }

          if (getTile(this.next_x, this.next_y, self.currentMap, 0) == 78){
            this.next_y = this.y;
          }
        }

        this.x = this.next_x;
        this.y = this.next_y;

        if (keys[90]){
          this.timer = 0;

          // If moved
          if (this.x != this.old_x || this.y != this.old_y){
            
            // If empty sapce
            if (getTile(this.x+1, this.y+1, self.currentMap, 1) == 0){
              let dead = false;
  
              for (const i in self.egobjects){
                let o = self.egobjects[i];
                // check new tile
                if ((this.x+1) * ini.SPRITE_SIZE == o.x && (this.y+1) * ini.SPRITE_SIZE == o.y){
                  // enemy
                  if (o.tile_id == 661){
                    console.log(o.value)
                    // I can kill?
                    if (this.o_pointer.canKill(o.value) == 1){
                      if (o.value == 0)stateStack.push(VictoryState());
                      this.selected = false;
                      self.egobjects.splice(i, 1);
                    }
                    // Maybe they can kill?
                    else if (o.canKill(this.o_pointer.value) == 1){
                      console.log("ENEMY KILL")
                      for (const ii in self.gameobjects){
                        if (self.gameobjects[ii].x == this.o_pointer.x && self.gameobjects[ii].y == this.o_pointer.y){
                          self.gameobjects.splice(ii, 1);
                          console.log("SPLICE")
                          this.selected = false;
                          dead = true;
                        }
                      } 
                    }
                    // Both cant kill
                    else {
                      self.label.change("nothing happened");
                      this.selected = false;
                    }

                    self.turn = 'e';
                  }
                }
              }

              // Empty tile
              if (!dead){
                this.selected = false;
                this.o_pointer.x = (this.x+1) * ini.SPRITE_SIZE;
                this.o_pointer.y = (this.y+1) * ini.SPRITE_SIZE;

                setTile(this.next_x+1, this.next_y+1, this.o_pointer.tile_id, self.currentMap, 1);

                self.turn = 'e';
              }
            }
            // Not empty space
            else {
              self.label.change("can\'t place here");
              self.label_timer = 0;
            }
          }
          // Place on self
          else {
            this.selected = false;
            setTile(this.next_x+1, this.next_y+1, this.o_pointer.tile_id, self.currentMap, 1);
            self.turn = 'e';
          }
        }
      }
    },

    draw: function(){
      ctx.strokeStyle = "red";
      ctx.strokeRect(this.x* ini.SPRITE_SIZE * ini.SCALE, this.y* ini.SPRITE_SIZE * ini.SCALE,this.w* ini.SPRITE_SIZE * ini.SCALE,this.h* ini.SPRITE_SIZE * ini.SCALE);
    }
  };

  // Set up the enemy spots
  self.onEnter = function(){
    let pieces = this.shuffle([0,1,2,2,2,2,3,3,3,4,5,5,5]);

    for (const i in assets.maps[this.formationMap].layers[1].data){
      let current = assets.maps[this.formationMap].layers[1].data[i];

      if (current == 662){
        let xx = (i%assets.maps[this.formationMap].width) * ini.SPRITE_SIZE;
        let yy = ((i/assets.maps[this.formationMap].width)|0) * ini.SPRITE_SIZE;

        let sx = ((current-1) % 32)       * ini.SPRITE_SIZE;
        let sy = (((current-1) / 32) | 0) * ini.SPRITE_SIZE;

        let sprite = Enemy(xx, yy, pieces.pop(), current);
        sprite.sx = sx;
        sprite.sy = sy;
        sprite.w=16;
        sprite.h=16;
        sprite.sw = ini.SPRITE_SIZE*2;
        sprite.sh = ini.SPRITE_SIZE*2;

        this.egobjects.push(sprite);


      }
    }

    // Restart on new game
    assets.snds['music_main'].currentTime = 0;
    assets.snds['music_main'].loop=true;
    assets.snds['music_main'].play();
  }

  self.update = function(dt){
    this.timer += dt;

    this.label_timer += dt;

    if (this.label_timer >= this.label_cooldown)
      this.label.change(this.label_text[this.turn]);

    if (!this.can_move.p && !this.can_move.e)console.log("NO LEGAL MOVES")

    if (this.turn == 'p'){
      this.player_move(dt);
    }
    else {
      this.enemy_move(dt);
    }

    for (const o of this.gameobjects)o.update(dt);
    for (const o of this.egobjects)o.update(dt);
  }

  self.render = function(){
    this.draw_map();

    for (const o of this.gameobjects){
      o.draw();
    }
    for (const e of this.egobjects){
      e.draw();
    }

    this.cursor.draw();

    this.label.draw();
  }

  self.player_move = function(dt){
    let legal_move = false;

    for (const e of this.gameobjects){
      if (e.value != 0 && e.value != 5 && e.value != undefined)legal_move = true;
    }

    this.can_move.p = legal_move;

    if (!legal_move){
      // this.turn = 'e';
      stateStack.push(VictoryState(false));
      return;
    }
    

    this.cursor.update(dt);

  }

  self.enemy_move = function(dt){
    this.enemy_move_timer += dt;

    if (this.enemy_move_timer >= this.enemy_move_cooldown){
      this.enemy_move_timer = 0;

      let current = this.egobjects[Math.random() * this.egobjects.length | 0];
      let movement = 'lrud'[Math.random() * 4 | 0];
      let legal_move = false;
      let kill = false;

      for (e of this.egobjects){
        if (e.value != 0 && e.value != 5)legal_move = true;
      }

      this.can_move.e = legal_move;

      if (!legal_move){
        stateStack.push(VictoryState());
        return;
      }

      // Infinite put game done flag
      while (current.value == 0 || current.value == 5){
        current = this.egobjects[Math.random() * this.egobjects.length | 0];
      }

      let nx = current.x;
      let ny = current.y;

      if (movement == 'l'){
        nx -= ini.SPRITE_SIZE * 2;
      }
      else if (movement == 'r'){
        nx += ini.SPRITE_SIZE * 2;
      }
      else if (movement == 'u'){
        ny -= ini.SPRITE_SIZE * 2;
      }
      else if (movement == 'd'){
        ny += ini.SPRITE_SIZE * 2;
      }

      

      // check enemy col
      for (let e of this.egobjects){
        if (e.x == nx && e.y == ny){
          //console.log("enemy COLLISION");
          nx = current.x;
          ny = current.y;
          break;
        }
      }
      // check player col
      for (let i in this.gameobjects){
        let o = this.gameobjects[i];
        console.log(o.tile_id);
        if (o.x == nx && o.y == ny && o.tile_id != -1){
          //console.log("player COLLISION");
          if (o.value == 0)stateStack.push(VictoryState(false));
          
          if (current.canKill(o.value) == 1){
            //console.log("can kill")

            // Splice player
            this.gameobjects.splice(i, 1);
            setTile((o.x / ini.SPRITE_SIZE) | 0, (o.y/ ini.SPRITE_SIZE) | 0,     -1, this.currentMap, 1);
            setTile(((o.x+8) / ini.SPRITE_SIZE) | 0, (o.y/ ini.SPRITE_SIZE) | 0, -1, this.currentMap, 1);
            setTile((o.x / ini.SPRITE_SIZE) | 0, ((o.y+8)/ ini.SPRITE_SIZE) | 0, -1, this.currentMap, 1);
            setTile(((o.x+8) / ini.SPRITE_SIZE) | 0, ((o.y+8)/ ini.SPRITE_SIZE) | 0, -1, this.currentMap, 1);
          }
          else {
            //console.log("DEAD")
            
            for (const ii in this.egobjects){
              let en = this.egobjects[ii];
              if (en.x == current.x && en.y == current.y){
                this.egobjects.splice(ii,1);
                this.turn = 'p';
                return;
              }
            }
            
          }
          break;
        }
      }

      if (nx <= 0 || nx >= 8*19 ||  ny <= 0 || ny >= 8*15){
        //console.log("border collision");
        nx = current.x;
        ny = current.y;
      }

      current.x = nx;
      current.y = ny;

      this.turn = 'p';
    }
  }

  self.draw_map = function(){
    //for (const l in assets.maps[this.currentMap].layers){
      for (const i in assets.maps[this.currentMap].layers[0].data){
        let current = assets.maps[this.currentMap].layers[0].data[i];

        if (current != 0){
          let sprite = null;

          let xx = (i % assets.maps[this.currentMap].width) * ini.SPRITE_SIZE;
          let yy = ((i / assets.maps[this.currentMap].width) | 0) * ini.SPRITE_SIZE;

          let sx = ((current-1) % 32)       * ini.SPRITE_SIZE;
          let sy = (((current-1) / 32) | 0) * ini.SPRITE_SIZE;

          ctx.drawImage(
            assets.imgs['main'],
            sx, sy, ini.SPRITE_SIZE, ini.SPRITE_SIZE,
            xx*ini.SCALE,yy*ini.SCALE,ini.SPRITE_SIZE*ini.SCALE,ini.SPRITE_SIZE*ini.SCALE
          );
        }
      }
    //}
  }

  self.shuffle = function(arr){
    let len = arr.length;
    let temp  = -1;
    let index = -1;

    while(len > 0){
      index = (Math.random() * len--) | 0;

      temp       = arr[len];
      arr[len]   = arr[index];
      arr[index] = temp;
    }

    return arr;
  }

  return self;
}

function FadeState(f_in=false, delay=0.5, step = 0.5, cb=null){
  let self = new State();

  self.delay = delay;
  self.step  = step;
  self.f_in  = f_in;

  self.alpha = f_in ? 0 : 1;

  self.complete = false;

  self.onEnter = function(){
    ctx.globalAlpha = this.alpha;
  }

  self.update = function(dt){
    this.timer += dt;

    if (this.timer >= this.delay && !this.complete){
      this.timer = 0;

      if (this.f_in){
        this.alpha += this.step;

        if (this.alpha >= 1){
          this.alpha = 1;
          this.complete = true;
        }
      }
      else{
        this.alpha -= this.step;

        if (this.alpha <= 0){
          this.alpha = 0;
          this.complete = true;
        }
      }
    }

    ctx.globalAlpha = this.alpha;

    if (this.complete){
      stateStack.pop();
      ctx.globalAlpha = 1;
      if (cb){
        stateStack.push(cb());
      }
    }


  }

  return self;

}

function DialogueState(text="NO TEXT", x=1, y=16, f_w=18, f_h=1, f_type=0, cb=null, face=0, face_place='l', face_set=null, voice="voice_l"){
  let self = new State();

  self.onEnter = function(){
    keys[90] = false;
  }

  self.text = text.toString().toUpperCase();
  self.c_index = 0;

  // Placement
  self.x = x > 0 ? x : 0;
  self.y = y > 0 ? y : 0;
  self.o_x = self.x;
  self.o_y = self.y;

  self.letters = [];

  self.speed = 0.2;

  // All chars drawn?
  self.c_done = false;

  // Frame
  self.f_x = self.x;
  self.f_y = self.y;
  self.f_w = f_w > 0 ? f_w : 1;
  self.f_h = f_h > 0 ? f_h : 1;
  self.f_type = f_type;

  // Face
  self.face_sx = (face/4 | 0) * ini.SPRITE_SIZE * 4;
  self.face_sy = 176;
  self.face_x = 0;
  self.face_y = self.o_y
  self.face_w = 4;
  self.face_h = 4;
  self.face_set = !face_set ? null : [...face_set];
  self.anim = !self.face_set ? null : new AnimationHandler(self.face_set);

  // Voice
  self.voice = voice;

  if (face_place == 'l'){
    self.face_x = 0;
  }
  else if (face_place == 'c'){
    self.face_x = ((ini.WIDTH / ini.SPRITE_SIZE) * 0.5 - 2) | 0;
  }
  else {
    self.face_x = ((ini.WIDTH / ini.SPRITE_SIZE) - self.face_w) | 0;
  }

  self.update = function(dt){
    this.timer += dt;

    if (!this.c_done){
      if (keys[90])this.speed = 0.03;
    }
    else {
      if (keys[90])this.cb_action();

      if (this.anim){
        this.anim.frame = this.face_set[0];
        this.face_sx = this.anim.frame * ini.SPRITE_SIZE * this.face_w;
      }
      
    }

    this.calc_text();

    if (this.anim != null && !this.c_done){
      this.anim.delay = this.speed;
      this.anim.update(dt);
      this.face_sx = this.anim.frame * ini.SPRITE_SIZE * this.face_w;
    }
  }

  self.render = function(){
    this.draw_face();
    this.draw_frame();

    for (const l of this.letters){
      ctx.drawImage(
        assets.imgs['main'],
        l.sx * ini.SPRITE_SIZE, l.sy, l.sw, l.sh,
        l.x * ini.SPRITE_SIZE * ini.SCALE, l.y * ini.SPRITE_SIZE * ini.SCALE, l.w * ini.SCALE, l.h * ini.SCALE,
      )
    }
  }

  self.draw_face = function(){
    if (this.face_set == null)return;

    ctx.drawImage(
      assets.imgs['main'],
      this.face_sx, this.face_sy, this.face_w * ini.SPRITE_SIZE, this.face_h * ini.SPRITE_SIZE,
      this.face_x * ini.SPRITE_SIZE * ini.SCALE, (this.face_y - this.face_h - 1)  * ini.SPRITE_SIZE * ini.SCALE, this.face_w * ini.SPRITE_SIZE * ini.SCALE, this.face_h * ini.SPRITE_SIZE * ini.SCALE
    )
  }

  self.draw_frame = function(){
    // TR
    ctx.drawImage(
      assets.imgs['main'],
      (this.f_type * 3) * ini.SPRITE_SIZE, 208, ini.SPRITE_SIZE, ini.SPRITE_SIZE,
      (this.f_x-1) * ini.SPRITE_SIZE * ini.SCALE, (this.f_y - 1) * ini.SPRITE_SIZE * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE
    );
    // TM
    ctx.drawImage(
      assets.imgs['main'],
      (this.f_type * 3 + 1) * ini.SPRITE_SIZE, 208, ini.SPRITE_SIZE, ini.SPRITE_SIZE,
      (this.f_x) * ini.SPRITE_SIZE * ini.SCALE, (this.f_y - 1) * ini.SPRITE_SIZE * ini.SCALE, this.f_w * ini.SPRITE_SIZE * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE
    );
    // TL
    ctx.drawImage(
      assets.imgs['main'],
      (this.f_type * 3 + 2) * ini.SPRITE_SIZE, 208, ini.SPRITE_SIZE, ini.SPRITE_SIZE,
      (this.f_x + this.f_w) * ini.SPRITE_SIZE * ini.SCALE, (this.f_y - 1) * ini.SPRITE_SIZE * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE
    );

    // ML
    ctx.drawImage(
      assets.imgs['main'],
      (this.f_type * 3) * ini.SPRITE_SIZE, 216, ini.SPRITE_SIZE, ini.SPRITE_SIZE,
      (this.f_x-1) * ini.SPRITE_SIZE * ini.SCALE, (this.f_y) * ini.SPRITE_SIZE * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE, this.f_h * ini.SPRITE_SIZE * ini.SCALE
    );
    // MM
    ctx.drawImage(
      assets.imgs['main'],
      (this.f_type * 3 + 1) * ini.SPRITE_SIZE, 216, ini.SPRITE_SIZE, ini.SPRITE_SIZE,
      (this.f_x) * ini.SPRITE_SIZE * ini.SCALE, (this.f_y) * ini.SPRITE_SIZE * ini.SCALE, this.f_w * ini.SPRITE_SIZE * ini.SCALE, this.f_h * ini.SPRITE_SIZE * ini.SCALE
    );
    // MR
    ctx.drawImage(
      assets.imgs['main'],
      (this.f_type * 3 + 2) * ini.SPRITE_SIZE, 216, ini.SPRITE_SIZE, ini.SPRITE_SIZE,
      (this.f_x + this.f_w) * ini.SPRITE_SIZE * ini.SCALE, (this.f_y) * ini.SPRITE_SIZE * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE, this.f_h * ini.SPRITE_SIZE * ini.SCALE
    );

    // BL
    ctx.drawImage(
      assets.imgs['main'],
      (this.f_type * 3) * ini.SPRITE_SIZE, 224, ini.SPRITE_SIZE, ini.SPRITE_SIZE,
      (this.f_x-1) * ini.SPRITE_SIZE * ini.SCALE, (this.f_y + this.f_h) * ini.SPRITE_SIZE * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE
    );
    // BM
    ctx.drawImage(
      assets.imgs['main'],
      (this.f_type * 3 + 1) * ini.SPRITE_SIZE, 224, ini.SPRITE_SIZE, ini.SPRITE_SIZE,
      (this.f_x) * ini.SPRITE_SIZE * ini.SCALE, (this.f_y + this.f_h) * ini.SPRITE_SIZE * ini.SCALE, this.f_w * ini.SPRITE_SIZE * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE
    );
    // BR
    ctx.drawImage(
      assets.imgs['main'],
      (this.f_type * 3 + 2) * ini.SPRITE_SIZE, 224, ini.SPRITE_SIZE, ini.SPRITE_SIZE,
      (this.f_x + this.f_w) * ini.SPRITE_SIZE * ini.SCALE, (this.f_y + this.f_h) * ini.SPRITE_SIZE * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE, ini.SPRITE_SIZE * ini.SCALE
    );

  }

  self.calc_text = function(){
    if (this.timer >= this.speed && !this.c_done){
      this.timer = 0;

      let char = this.text[this.c_index++];

      let sx = 0;
      let sy = 248;
      let newline = false;

      switch(char){
        // Newline
        case '#':
          newline = true;
          this.y++;
          this.x = this.o_x-1; 
          break;

        case ' ':
          sx = 26;
          break;

        // Punctuation
        case '!':
          sy -= 16;
          break;
        case '*':
          sx = 1;
          sy -= 16;
          break;
        case '(': 
          sx = 2;
          sy -= 16;
          break;
        case ')':
          sx = 3; 
          sy -= 16;
          break;
        case '-': 
          sx = 4;
          sy -= 16;
          break;
        case '+': 
          sx = 5;
          sy -= 16;
          break;
        case '[':
          sx = 6; 
          sy -= 16;
          break;
        case ']':
          sx = 7; 
          sy -= 16;
          break;
        case ':':
          sx = 8; 
          sy -= 16;
          break;
        case ';':
          sx = 9; 
          sy -= 16;
          break;
        case '\"':
          sx = 10; 
          sy -= 16;
          break;
        case '\'':
          sx = 11; 
          sy -= 16;
          break;
        case ',':
          sx = 12; 
          sy -= 16;
          break;
        case '.':
          sx = 13; 
          sy -= 16;
          break;
        case '?':
          sx = 14; 
          sy -= 16;
          break;

        // Numbers
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          sx = Number(char);
          sy -= 8;
          break;

        // Arrows
        case '<':
          sx = 10;
          sy -= 8;
          break;
        case '^':
          sx = 11;
          sy -= 8;
          break;
        case '>':
          sx = 12;
          sy -= 8;
          break;
        case '=':
          sx = 13;
          sy -= 8;
          break;

        // Control Icons
        case '@':
          sx = 14;
          sy -= 8;
          break;
        case '&':
          sx = 15;
          sy -=8;
          break;
        case '%':
          sx = 16;
          sy -= 8;
          break;

        default: 
          sx = char.charCodeAt(0) % 65;
          break;
      }

      let letter = {
        char: char,
        x: this.x,
        y: this.y,
        w: ini.SPRITE_SIZE,
        h: ini.SPRITE_SIZE,

        sx: sx,
        sy: sy,
        sw: ini.SPRITE_SIZE,
        sh: ini.SPRITE_SIZE
      };

      if (!newline){
        this.letters.push(letter);
      }

      if (letter.sy == 248 && letter.char != ' '){
        //assets.snds['voice_l'].pause();
        assets.snds[this.voice].currentTime = 0;
        assets.snds[this.voice].play();
      }

      this.x++;

      if (this.c_index >= this.text.length){
        this.c_done = true;
      }

    }
  }

  self.cb_action = function(){
    if (cb){
      stateStack.push(cb());
    }
    else {
      stateStack.pop();
    }
  }

  return self;
}

function OptionState(text="NO TEXT", x=1, y=16, f_w=18, f_h=1, f_type=0, ...cbs){
  let self = DialogueState(text, x, y, f_w, f_h, f_type, null, null, null, null);

  self.speed = 0.03;

  self.arrow_cooldown = 0.2;
  self.arrow_pos = 0;

  self.select_cooldown = 0.5;
  self.select_timer = 0;

  self.cbs = [...cbs];

  self.selection = false;

  self.update = function(dt){
    this.timer += dt;

    if (this.selection)
      this.select_timer += dt;

    if (this.select_timer >= this.select_cooldown){
      this.select_timer = 0;
      this.selection = false;
    }

    if (this.c_done){
      
      if (keys[40] && this.timer >= this.arrow_cooldown){
        this.timer = 0;
        for (const c of this.letters){
          if (c.char == '>'){
            c.y = c.y > (this.o_y-1) + (cbs.length -1) ? c.y : c.y + 1;
            this.arrow_pos = this.arrow_pos >= cbs.length-1 ? cbs.length-1 : this.arrow_pos+1;
          }
        }
      }
     else if (keys[38] && this.timer >= this.arrow_cooldown){
        this.timer = 0;
        for (const c of this.letters){
          if (c.char == '>'){
            c.y = c.y <= this.o_y ? this.o_y : c.y - 1;
            this.arrow_pos = this.arrow_pos <= 0 ? 0 : this.arrow_pos-1;
          }
        }
      }

      if (keys[90] && !this.selection){
        this.selection = true;
        stateStack.push(this.cbs[this.arrow_pos]());
      }
    }

    this.calc_text();
  }

  return self;
}

function LabelState(text="NO TEXT", x=1, y=16,f_w=18, f_h=1, cb=null){
  let self = new State();

  self.text = text.toString().toUpperCase();
  self.letters = [];
  self.c_index = 0;
  self.c_done  = false;

  self.x = x > 0 ? x : 0;
  self.y = y > 0 ? y : 0;
  self.o_x = self.x;
  self.o_y = self.y;

  self.f_w = f_w > 0 ? f_w : 1;
  self.f_h = f_h > 0 ? f_h : 1;

  self.read_cooldown = 0.5;

  self.onEnter = function(){
    for (const i in this.text){
      let char = this.text[this.c_index++];

      let sx = 0;
      let sy = 248;
      let newline = false;

      switch(char){
        // Newline
        case '#':
          newline = true;
          this.y++;
          this.x = this.o_x-1; 
          break;

        case ' ':
          sx = 26;
          break;

        // Punctuation
        case '!':
          sy -= 16;
          break;
        case '*':
          sx = 1;
          sy -= 16;
          break;
        case '(': 
          sx = 2;
          sy -= 16;
          break;
        case ')':
          sx = 3; 
          sy -= 16;
          break;
        case '-': 
          sx = 4;
          sy -= 16;
          break;
        case '+': 
          sx = 5;
          sy -= 16;
          break;
        case '[':
          sx = 6; 
          sy -= 16;
          break;
        case ']':
          sx = 7; 
          sy -= 16;
          break;
        case ':':
          sx = 8; 
          sy -= 16;
          break;
        case ';':
          sx = 9; 
          sy -= 16;
          break;
        case '\"':
          sx = 10; 
          sy -= 16;
          break;
        case '\'':
          sx = 11; 
          sy -= 16;
          break;
        case ',':
          sx = 12; 
          sy -= 16;
          break;
        case '.':
          sx = 13; 
          sy -= 16;
          break;
        case '?':
          sx = 14; 
          sy -= 16;
          break;

        // Numbers
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          sx = Number(char);
          sy -= 8;
          break;

        // Arrows
        case '<':
          sx = 10;
          sy -= 8;
          break;
        case '^':
          sx = 11;
          sy -= 8;
          break;
        case '>':
          sx = 12;
          sy -= 8;
          break;
        case '=':
          sx = 13;
          sy -= 8;
          break;

        // Control Icons
        case '@':
          sx = 14;
          sy -= 8;
          break;
        case '&':
          sx = 15;
          sy -=8;
          break;
        case '%':
          sx = 16;
          sy -= 8;
          break;

        default: 
          sx = char.charCodeAt(0) % 65;
          break;
      }

      let letter = {
        x: this.x,
        y: this.y,
        w: ini.SPRITE_SIZE,
        h: ini.SPRITE_SIZE,

        sx: sx,
        sy: sy,
        sw: ini.SPRITE_SIZE,
        sh: ini.SPRITE_SIZE
      };

      if (!newline){
        this.letters.push(letter);
      }

      this.x++;

      if (this.c_index >= this.text.length){
        this.c_done = true;
      }
    }
  }

  self.update = function(dt){
    this.timer += dt;

    if (this.timer >= this.read_cooldown){
      if (keys[90]){
        stateStack.pop();
      }
    }
  }

  self.render = function(){
    // Background color
    ctx.drawImage(
      assets.imgs['main'],
      8, 216, ini.SPRITE_SIZE, ini.SPRITE_SIZE,
      (this.o_x) * ini.SPRITE_SIZE * ini.SCALE, (this.o_y) * ini.SPRITE_SIZE * ini.SCALE, this.f_w * ini.SPRITE_SIZE * ini.SCALE, this.f_h * ini.SPRITE_SIZE * ini.SCALE
    );
    for (const t of this.letters){
      ctx.drawImage(
        assets.imgs['main'],
        t.sx * ini.SPRITE_SIZE, t.sy, t.sw, t.sh,
        t.x * ini.SPRITE_SIZE * ini.SCALE, t.y * ini.SPRITE_SIZE * ini.SCALE, t.w * ini.SCALE, t.h * ini.SCALE
      );
    }
  }

  return self;
}

function VictoryState(isVictory=true){
  let self = new State();

  self.onEnter = function(){
    assets.snds['fail_chime'].loop = false;
    assets.snds['victory_chime'].loop = false;
    isVictory ? assets.snds['victory_chime'].play() : assets.snds['fail_chime'].play();
  }

  self.isVictory = isVictory;

  self.x = isVictory ? 0 : -20;
  self.y = isVictory ? -3 : 7;
  self.w=20;
  self.h=3;

  self.delay = 0.02;
  self.target_x = 0;
  self.target_y = 6;

  self.sx = isVictory ? 184 : 184;
  self.sy = isVictory ? 192 : 176;
  self.sw = isVictory ? 56 : 72;
  self.sh = isVictory ? 16 : 16;

  self.f_sx = isVictory ? 176 : 176;
  self.f_sy = isVictory ? 184 : 176;

  self.letter_x = isVictory? 6.5: 19;
  self.letter_y = isVictory? 18 : self.y;
  self.letter_target_x = isVictory? 0 : 6;
  self.letter_target_y = isVictory? 6.5 : 7;

  self.update = function(dt){
    this.timer += dt;
    
    if (this.isVictory)this.update_victory();
    else this.update_fail();

    // If ended, ask restart entire game
    //if (assets.snds['fail_chime'].ended)console.log(9)
    
  }

  self.update_victory = function(){
    if (this.timer >= this.delay){
      this.timer = 0;
      this.y++;
      this.letter_y--;

      if (this.y >= this.target_y){
        this.y = this.target_y;
      }

      if (this.letter_y <= this.letter_target_y){
        this.letter_y = this.letter_target_y;
      }

      if (assets.snds['victory_chime'].ended){
        stateStack.push(DialogueState("new level?=", 4.5, 10, 11, 1, 1, ()=>{
          return OptionState(">yes# no", 8, 13, 4, 2, 1, ()=>{
            stateStack.pop();
            stateStack.pop();
            stateStack.pop();
            stateStack.push(FadeState(false, 0.2, 0.1, ()=>{
              stateStack.pop();
              stateStack.push(PlacementState("map"));
              stateStack.push(FadeState(true, 0.2, 0.1));
            }));
            
          }, ()=>{
            stateStack.pop();
            stateStack.pop();
            stateStack.pop();
            stateStack.pop();
            stateStack.push(LogoState());
          });
        }));
      }
    }
  }

  self.update_fail = function(){
    if (this.timer >= this.delay){
      this.timer = 0;
      this.x+=2;
      this.letter_x--;

      if (this.x >= this.target_x){
        this.x = this.target_x;
      }

      if (this.letter_x <= this.letter_target_x){
        this.letter_x = this.letter_target_x;
      }

      if (assets.snds['fail_chime'].ended){
        stateStack.push(DialogueState("new level?=", 4.5, 11, 11, 1, 1, ()=>{
          return OptionState(">yes# no", 8, 14, 4, 2, 1, ()=>{
            stateStack.pop();
            stateStack.pop();
            stateStack.pop();
            stateStack.push(FadeState(false, 0.2, 0.1, ()=>{
              stateStack.pop();
              stateStack.push(PlacementState("map"));
              stateStack.push(FadeState(true, 0.2, 0.1));
            }));
          }, ()=>{
            stateStack.pop();
            stateStack.pop();
            stateStack.pop();
            stateStack.pop();
            stateStack.push(LogoState());
          });
        }));
      }

    }
  }

  self.render = function(){
    // BKGD
    ctx.drawImage(
      assets.imgs['main'],
      this.f_sx,this.f_sy,ini.SPRITE_SIZE,ini.SPRITE_SIZE,
      this.x* ini.SPRITE_SIZE * ini.SCALE, this.y* ini.SPRITE_SIZE * ini.SCALE, this.w * ini.SPRITE_SIZE * ini.SCALE, this.h * ini.SPRITE_SIZE * ini.SCALE
    );

    // Words
    ctx.drawImage(
      assets.imgs['main'],
      this.sx,this.sy,this.sw,this.sh,
      this.letter_x* ini.SPRITE_SIZE * ini.SCALE, this.letter_y* ini.SPRITE_SIZE * ini.SCALE, this.sw * ini.SCALE, this.sh * ini.SCALE
    );
  }

  return self;
}

/**
 * types:
 * -attack
 * -worry
 * -sad
 * -anger
 */
function ActionDialogueState(type="attack", pos='r', fsx=0,fsy=0,fsw=0,fsh=0){
  let self = new State();

  self.type = "attack";
  self.pos = pos;

  self.face_sx = fsx;
  self.face_sy = fsy;
  self.face_sw = fsw;
  self.face_sh = fsh;

  self.done = false;

  switch(type){
    case 'attack':
      self.label_sx =  0;
      self.label_sy = 88;
      self.label_sw = 6*ini.SPRITE_SIZE;
      self.label_sh = 4*ini.SPRITE_SIZE;
      break;
    case "sad":
      self.label_sx = 48;
      self.label_sy = 88;
      self.label_sw = 2*ini.SPRITE_SIZE;
      self.label_sh = 2*ini.SPRITE_SIZE;
      break;

  }

  switch(pos){
    case 'l': 
      // label starts from right
      self.label_x = 20*ini.SPRITE_SIZE;
      self.label_y = 0;
      self.label_w = self.label_sw;
      self.label_h = self.label_sh;

      self.label_target_x = 10*ini.SPRITE_SIZE;

      self.label_centered = false;

      self.label_speed = 2;

      // Person from left

      break;
    case 'r':
      // label comes from left
      self.label_x = -self.label_sw;
      self.label_y = 0;
      self.label_w = self.label_sw;
      self.label_h = self.label_sh;

      self.label_target_x = 7*ini.SPRITE_SIZE;

      self.label_centered = false;

      self.label_speed = 2;

      // Person from right
      self.face_x = 20 * ini.SPRITE_SIZE;
      self.face_y =  8 * ini.SPRITE_SIZE;
      self.face_w = self.face_sw;
      self.face_h = self.face_sh;
      break;
  }

  self.update = function(dt){
    this.timer += dt;

    if (this.pos == 'l'){
      if (!this.label_centered){
        if (this.label_x > this.label_target_x){
          this.label_x-=this.label_speed;
        }
        else if (this.label_x <= this.label_target_x){
          this.label_x = this.label_target_x;
          this.label_centered = true;
          this.label_speed = 1 | 0;
          this.timer = 0;
        }
      }
      else {
        if (this.label_x > -this.label_w){
          this.label_x-=this.label_speed;

          if (this.timer >= 0.6)this.label_speed = 2 | 0;
        }
        else {
          // POP
          stateStack.pop();
        }
      }
    }
    else if (this.pos == 'r'){
      if (!this.label_centered){
        if (this.label_x < this.label_target_x){
          this.label_x += this.label_speed;
          this.face_x -= this.label_speed;
        }
        else if (this.label_x >= this.label_target_x){
          this.label_x = this.label_target_x;
          this.label_centered = true;
          this.label_speed = 1 | 0;
          this.timer = 0;
        }
      }
      else {
        if (this.label_x < 20*ini.SPRITE_SIZE){
          this.label_x += this.label_speed;
          this.face_x -= this.label_speed;

          if (this.timer >= 0.6)this.label_speed = 2 | 0;
        }
        else {
          // POP
          stateStack.pop();
        }
      }
    }
  }
  self.render = function(){
    // Label
    ctx.drawImage(
      assets.imgs['main'],
      this.label_sx, this.label_sy, this.label_sw, this.label_sh,
      this.label_x * ini.SCALE, this.label_y * ini.SCALE, this.label_w * ini.SCALE, this.label_h * ini.SCALE
    );

    // Face
    ctx.drawImage(
      assets.imgs['main'],
      this.face_sx, this.face_sy, this.face_sw, this.face_sh,
      this.face_x * ini.SCALE, this.face_y * ini.SCALE, this.face_w * ini.SCALE, this.face_h * ini.SCALE
    );
  }

  return self;
}












/*********************
 *    Helpers/Misc   *
 *********************/
const getTile = function(x, y, map="no_map", layer=0){
  return assets.maps[map].layers[layer].data[x + y * assets.maps[map].width];
}
const setTile = function(x, y, type=0, map="no_map", layer=0){
  assets.maps[map].layers[layer].data[x + y * assets.maps[map].width] = type+1;
}







const init = () => {
  window.onkeydown = keyHandler;
  window.onkeyup   = keyHandler;

  init_btns();

  ctx.imageSmoothingEnabled = false;

  stateStack = new StateStack();

  stateStack.push(LogoState());

  update(performance.now());
};

let now = 0;
let last = 0;
const update = ts =>{
  now = ts;

  requestAnimationFrame(update);

  let dt = (now - last) / 1000;

  stateStack.update(dt);

  render(dt);

  last = now;
};

const render = (dt) =>{
  ctx.clearRect(0,0,cnv.width, cnv.height);

  stateStack.render();

  ctx.fillText((1/dt).toPrecision(4), 34, 106);

  //draw_grid();


  //draw_array();
};

const draw_grid = (color="black") => {
  ctx.strokeStyle = color;
  for (let i = 0; i < ini.HEIGHT / ini.SPRITE_SIZE; i++){
    for (let j = 0; j < ini.WIDTH / ini.SPRITE_SIZE; j++){
      ctx.strokeRect(
        j * ini.SPRITE_SIZE * ini.SCALE,
        i * ini.SPRITE_SIZE * ini.SCALE,
        ini.SPRITE_SIZE * ini.SCALE,
        ini.SPRITE_SIZE * ini.SCALE
      )
    }
  }
};

const draw_array = (map="map",color="red") =>{
  ctx.fillStyle = color;

  for (const i in assets.maps[map].layers[1].data){
    let data = assets.maps[map].layers[1].data[i];
    let x = (i%assets.maps[map].width) * ini.SPRITE_SIZE;
    let y = ((i/assets.maps[map].width) | 0) * ini.SPRITE_SIZE;

    ctx.fillText(data,
      ((x * 4) + i % assets.maps[map].width),
      (y + (i/assets.maps[map].width) | 0)
    );
  }
};





window.onload = function(){
  cnv = document.querySelector('canvas');
  cnv.width = ini.WIDTH   * ini.SCALE;
  cnv.height = ini.HEIGHT * ini.SCALE;

  ctx = cnv.getContext('2d');

  loadAssets();

  init_btns();
  
}

const loadAssets = () =>{
  // Images
  assets.imgs['main'] = new Image();
  assets.imgs['main'].onload = function(){
    loadHandler(this.src.replace(/^.*[\\\/]/, ''));
  };
  assets.imgs['main'].onerror = function(){
    console.error(`FAILED TO LOAD ${this.src.replace(/^.*[\\\/]/, '')}`);
  };
  assets.imgs['main'].src = "sheet.png";

  // Maps
  fetch("test_map.json")
    .then(res=>res.json())
    .then(data=>{
      assets.maps['test_map'] = {...data};

      loadHandler('test_map');
    })
    .catch(e=>console.error(e));

  fetch("map.json")
    .then(res=>res.json())
    .then(data=>{
      assets.maps['map'] = {...data};

      loadHandler('map');
    })
    .catch(e=>console.error(e));

  fetch("test_formation.json")
    .then(res=>res.json())
    .then(data=>{
      assets.maps['test_formation'] = {...data};

      loadHandler('test_formation');
    })
    .catch(e=>console.error(e));

  fetch("formation_1.json")
    .then(res=>res.json())
    .then(data=>{
      assets.maps['formation_1'] = {...data};

      loadHandler('formation_1');
    })
    .catch(e=>console.error(e));

  fetch("formation_2.json")
    .then(res=>res.json())
    .then(data=>{
      assets.maps['formation_2'] = {...data};

      loadHandler('formation_2');
    })
    .catch(e=>console.error(e));

  fetch("formation_3.json")
    .then(res=>res.json())
    .then(data=>{
      assets.maps['formation_3'] = {...data};

      loadHandler('formation_3');
    })
    .catch(e=>console.error(e));

  fetch("formation_4.json")
    .then(res=>res.json())
    .then(data=>{
      assets.maps['formation_4'] = {...data};

      loadHandler('formation_4');
    })
    .catch(e=>console.error(e));

  fetch("formation_5.json")
    .then(res=>res.json())
    .then(data=>{
      assets.maps['formation_5'] = {...data};

      loadHandler('formation_5');
    })
    .catch(e=>console.error(e));

    // Audio
    assets.snds['voice_l'] = new Audio();
    assets.snds['voice_l'].onloadstart = function(){
      loadHandler(this.src.replace(/^.*[\\\/]/, ''));
    };
    assets.snds['voice_l'].onerror = function(){
      console.error(`FAILED TO LOAD ${this.src.replace(/^.*[\\\/]/, '')}`);
    }
    assets.snds['voice_l'].src = 'voice_l.wav';

    assets.snds['voice_deep'] = new Audio();
    assets.snds['voice_deep'].onloadstart = function(){
      loadHandler(this.src.replace(/^.*[\\\/]/, ''));
    };
    assets.snds['voice_deep'].onerror = function(){
      console.error(`FAILED TO LOAD ${this.src.replace(/^.*[\\\/]/, '')}`);
    }
    assets.snds['voice_deep'].src = 'voice_deep.wav';

    assets.snds['logo_bell'] = new Audio();
    assets.snds['logo_bell'].onloadstart = function(){
      loadHandler(this.src.replace(/^.*[\\\/]/, ''));
    };
    assets.snds['logo_bell'].onerror = function(){
      console.error(`FAILED TO LOAD ${this.src.replace(/^.*[\\\/]/, '')}`);
    }
    assets.snds['logo_bell'].src = 'logo_bell.wav';

    assets.snds['victory_chime'] = new Audio();
    assets.snds['victory_chime'].onloadstart = function(){
      loadHandler(this.src.replace(/^.*[\\\/]/, ''));
    };
    assets.snds['victory_chime'].onerror = function(){
      console.error(`FAILED TO LOAD ${this.src.replace(/^.*[\\\/]/, '')}`);
    }
    assets.snds['victory_chime'].src = 'victory_chime.wav';

    assets.snds['fail_chime'] = new Audio();
    assets.snds['fail_chime'].onloadstart = function(){
      loadHandler(this.src.replace(/^.*[\\\/]/, ''));
    };
    assets.snds['fail_chime'].onerror = function(){
      console.error(`FAILED TO LOAD ${this.src.replace(/^.*[\\\/]/, '')}`);
    }
    assets.snds['fail_chime'].src = 'fail_chime.wav';

    assets.snds['music_main'] = new Audio();
    assets.snds['music_main'].onloadstart = function(){
      loadHandler(this.src.replace(/^.*[\\\/]/, ''));
    };
    assets.snds['music_main'].onerror = function(){
      console.error(`FAILED TO LOAD ${this.src.replace(/^.*[\\\/]/, '')}`);
    }
    assets.snds['music_main'].src = 'music_main.mp3';
};

const loadHandler = f_name => {
  assets.loaded++;

  if (assets.loaded == assets.toLoad){
    init();
  }
};

const init_btns = () => {
  document.getElementById("mute").onclick = function() {
    ini.MUTED = !ini.MUTED;

    this.src= ini.MUTED ? "sound_off.png" : "sound_on.png";

    if (ini.MUTED){
      for (let o in assets.snds){
        assets.snds[o].volume = 0;
      }
    }
    else {
      for (let o in assets.snds){
        assets.snds[o].volume = 1;
      }
    }
  };

  document.getElementById("zoom-in").onclick = () => {
    ini.SCALE = (ini.SCALE < 5) ? ini.SCALE + 1 : 5;
    cnv.width = ini.WIDTH * ini.SCALE;
    cnv.height = ini.HEIGHT * ini.SCALE;
    ctx.imageSmoothingEnabled = false;
  }
  document.getElementById("zoom-out").onclick = () => {
    ini.SCALE = (ini.SCALE > 1) ? ini.SCALE - 1 : 1;
    cnv.width = ini.WIDTH * ini.SCALE;
    cnv.height = ini.HEIGHT * ini.SCALE;
    ctx.imageSmoothingEnabled = false;
  }

  document.getElementById("btn-lt").ontouchstart = () => {
    keys[37]= true;
  }
  document.getElementById("btn-lt").ontouchmove = () => {
    keys[37]= true;
  }
  document.getElementById("btn-lt").ontouchend = () => {
    keys[37] = false;
  }

  document.getElementById("btn-up").ontouchstart = () => {
    keys[38]= true;
  }
  document.getElementById("btn-up").ontouchmove = () => {
    keys[38]= true;
  }
  document.getElementById("btn-up").ontouchend = () => {
    keys[38] = false;
  }

  document.getElementById("btn-rt").ontouchstart = () => {
    keys[39]= true;
  }
  document.getElementById("btn-rt").ontouchmove = () => {
    keys[39]= true;
  }
  document.getElementById("btn-rt").ontouchend = () => {
    keys[39] = false;
  }

  document.getElementById("btn-dn").ontouchstart = () => {
    keys[40]= true;
  }
  document.getElementById("btn-dn").ontouchmove = () => {
    keys[40]= true;
  }
  document.getElementById("btn-dn").ontouchend = () => {
    keys[40] = false;
  }

  document.getElementById("btn-a").ontouchstart = () => {
    keys[90]= true;
  }
  document.getElementById("btn-a").ontouchmove = () => {
    keys[90]= true;
  }
  document.getElementById("btn-a").ontouchend = () => {
    keys[90] = false;
  }

  document.getElementById("btn-b").ontouchstart = () => {
    keys[88]= true;
  }
  document.getElementById("btn-b").ontouchmove = () => {
    keys[88]= true;
  }
  document.getElementById("btn-b").ontouchend = () => {
    keys[88] = false;
  }
}

window.oncontextmenu = () => false;
