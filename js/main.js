
import Player from './player/index'
import Boss from './npc/boss'
import BackGround from './runtime/background'
import GameInfo   from './runtime/gameinfo'
import Music      from './runtime/music'
import DataBus from './databus'



const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const ctx = canvas.getContext('2d')
const databus = new DataBus()

/**
 * 游戏主函数
 */
export default class Main {

  constructor() {
    wx.setPreferredFramesPerSecond(60);
    this.frame=0;
    this.score=0;
    this.defance=0;
    this.music= new Music();
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    this.stage = new createjs.Stage(canvas);
    wx.getUserInfo({//替换头像
        success: (res)=> {
            let user_info=res.userInfo;
            this.init(user_info);
        },
        fail:()=>{
            this.init();
        }
    })
  }
  init(user_info=""){
    this.bg = new BackGround();
    this.stage.addChild(this.bg);
    this.player = new Player(this.stage,user_info.avatarUrl,10);
    this.stage.addChild(this.player);
    this.boss = new Boss(this.stage);
    this.stage.addChild(this.boss);
    this.gameinfo =new GameInfo();
    this.stage.addChild(this.gameinfo);
    window.requestAnimationFrame(
      this.TimerHandel.bind(this),
      canvas
    )
  }
  TimerHandel() {
    this.frame++;
    if(this.frame>999999999){
      this.frame=0;
    }
    if (this.frame % 30 === 0) {
      this.player.shoot();
    }
    this.bg.update();
    this.player.update(true);
    this.boss.update(true);
    this.collisionDetection();
    this.stage.update();
    this.gameinfo.updateScore(this.score,this.defance);
    window.requestAnimationFrame(//帧定wx的回调函数
      this.TimerHandel.bind(this),
      canvas
    )
  }
  isCollideWith(rectObj,pointObj) {//判断两个东西是否碰撞
    let spX = pointObj.x;
    let spY = pointObj.y;
    return !!(spX >= rectObj.x - rectObj.width / 2
      && spX <= rectObj.x + rectObj.width / 2
      && spY >= rectObj.y - rectObj.height / 2
      && spY <= rectObj.y + rectObj.height / 2)
  }




  collisionDetection() {//判断子弹击中
    let that = this;
    let pp={x:this.player.player.x,y:this.player.player.y};
    let br={x:this.boss.player.x,y:this.boss.player.y,width:this.boss.player.width,height:this.boss.player.height};
    this.player.bullet.list.forEach((bu) => {
      if ( this.isCollideWith(br,bu)&&!bu.isdie) {
        bu.die();
        this.score += 1;
      }
    });
    this.boss.bullets.forEach((bu) => {
      bu.list.forEach((b) => {
        if ( this.isCollideWith(b,pp)&&!b.isdie) {
          b.die();
          this.defance += 1;//被击中
          if(this.defance>=100)
          {
            databus.gameOver = true
          }
          
          //break;
        }
      });
    });

    


    if (databus.gameOver) {
      databus.score=this.score;
      this.gameinfo.renderGameOver(ctx, databus.score)

      if (!this.hasEventBind) {
        this.hasEventBind = true
        this.touchHandler = this.touchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
    }
  }
}
