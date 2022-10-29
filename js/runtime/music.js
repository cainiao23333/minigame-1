export default class Music {
  constructor() {
    this.bgmAudio = new Audio()
    this.bgmAudio.volume = 0.5;
    this.bgmAudio.loop = true
    this.bgmAudio.src  = 'audio/bgm.mp3'
    this.playBgm();
    wx.onShow(()=>{
      this.playBgm();
    });
    wx.onAudioInterruptionEnd(()=>{
      this.playBgm();
    })
  }
  playBgm() {
    this.bgmAudio.play()
  }
}
