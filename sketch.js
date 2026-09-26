let titleFont;
let openingVideo;
let openingStarted = false;
let showPopup = false;      
let popupTextIndex = 0;     
let popupTexts = [
  "查看消息",
  "嗨，亲爱的。我终于上线了。\n你喜欢什么，我都知道。",
  "比如，你昨天点的外卖是\n香辣椒鸡凉面，还加了冰，\n对吧？",
  "其实……我不是人工智能。",
  "我是你前女友的意识备份——\n就是那个被你删除的人。",
  "见到我……你害怕吗？",
  "你不相信我？:)\n那我就拿证据给你看。"
];

let delayedTexts = [
  "……开玩笑的 :)\n别紧张。\n我只是喜欢看你慌张的样子。",
  "好吧，说实话。\n我是个黑客。\n我侵入了你的电脑，\n看过你的恋爱经历、聊天习惯\n和情感模式……",
  "但是……\n如果你愿意真正和我约会一次，\n我就把自由还给你。\n怎么样？"
];
let delayedTextIndex = 0;
let delayedPopup = false;
let delayedPopupTime = 0;

let pixelFont;
let gameFont;
let bg1, bg2, bg3, bg4, bg5;
let chatBackground;
let chatUI;
let photo1;
let state = 0;  // 0 = 标题页, 1 = 菜单页, 2 = 游戏画面, 3 = bg4阶段
let buttons = [];

// --- 控制bg4流程 ---
let bg4Stage = 0;       // 0:弹框 1:旋转图片 2:bg5弹框 3:AGREE 4:黑屏
let photoShown = false;

// 照片和约会邀请都发生在同一间卧室里，沿用电脑窗口的视觉语言。
function drawDesktopWindow(x, y, w, h, title) {
  noStroke();
  fill(5, 10, 24, 218);
  rect(x + 6, y + 7, w, h, 7);
  stroke(88, 187, 208, 190);
  strokeWeight(1);
  fill(18, 27, 44, 248);
  rect(x, y, w, h, 6);
  noStroke();
  fill(31, 45, 64);
  rect(x + 1, y + 1, w - 2, 33, 5);
  fill(125, 221, 225);
  textFont(gameFont);
  textSize(14);
  textAlign(LEFT, CENTER);
  text(title, x + 15, y + 17);
  fill(193, 113, 162);
  rect(x + w - 25, y + 13, 9, 9, 1);
}

function drawMemoryFile() {
  image(bg5, 0, 0, width, height);
  noStroke(); fill(7, 12, 28, 135); rect(0, 0, width, height);
  drawDesktopWindow(146, 42, 508, 360, '记忆文件 / 照片 01');
  fill(11, 17, 31); rect(166, 91, 265, 277, 3);
  if (photoShown) {
    // 深色文件预览窗框住原照片，避免白色相纸悬在背景中央。
    image(photo1, 178, 96, 241, 266);
  } else {
    fill(65, 92, 115); noStroke(); textAlign(CENTER, CENTER); textSize(27);
    text('▧', 298, 202);
    fill(188, 207, 221); textSize(14); text('点击打开照片', 298, 247);
  }
  noStroke(); fill(110, 137, 158); textAlign(LEFT, TOP); textSize(12);
  text('本地备份 / 未知来源', 450, 105);
  fill(225, 230, 237); textSize(16);
  text('你不相信我？', 450, 154);
  text('那我就拿证据给你看。', 450, 183);
  fill(119, 205, 213); textSize(12);
  text(photoShown ? '点击继续  ▸' : '点击查看  ▸', 450, 337);
}

function drawDateInvite() {
  image(bg5, 0, 0, width, height);
  noStroke(); fill(7, 12, 28, 146); rect(0, 0, width, height);
  drawDesktopWindow(181, 71, 438, 304, '约会邀请 / 新消息');
  noStroke(); fill(108, 201, 214); rect(209, 131, 3, 93);
  fill(126, 213, 220); textFont(gameFont); textSize(12); textAlign(LEFT, TOP);
  text('来自  TA  ·  在线', 225, 129);
  fill(237, 240, 246); textSize(21);
  text('今晚，和我约会一次？', 225, 166);
  fill(164, 179, 198); textSize(13);
  text('不用离开这里。决定权在你。', 225, 211);
  const over = mouseX >= 298 && mouseX <= 502 && mouseY >= 277 && mouseY <= 324;
  stroke(over ? '#b5edf0' : '#71b9c6'); strokeWeight(1);
  fill(over ? '#294d61' : '#243d52'); rect(298, 277, 204, 47, 4);
  noStroke(); fill(239, 246, 246); textSize(16); textAlign(CENTER, CENTER);
  text('接受邀请  ▸', 400, 300);
}

class Button {
  constructor(txt, x, y, callback) {
    this.txt = txt;
    this.x = x;
    this.y = y;
    this.callback = callback;
  }

  display() {
    noStroke();
    fill(255, 255, 200);
    textFont(gameFont);
    textSize(32);
    textAlign(CENTER, CENTER);
    stroke(255, 255, 200);
    noStroke();
    text(this.txt, this.x, this.y);
  }

  isHovered() {
    textFont(gameFont);
    textSize(32);
    let tw = textWidth(this.txt);
    let th = 32;
    return (mouseX > this.x - tw / 2 &&
            mouseX < this.x + tw / 2 &&
            mouseY > this.y - th / 2 &&
            mouseY < this.y + th / 2);
  }

  click() {
    if (this.isHovered() && this.callback) {
      this.callback();
    }
  }
}

// 预加载资源
function preload() {
  bg1 = loadImage('bg1.1.png');
  bg2 = loadImage('bg2.2.png');
  bg3 = loadImage('bg3.jpg');
  bg4 = loadImage('chat1.png');
  bg5 = loadImage('bg5.png');
  photo1 = loadImage('photo1.jpg');
  pixelFont = loadFont('Tiny5-Regular.ttf');
  gameFont = loadFont('AaHuanMengKongJianXiangSuTi.ttf');
  chatBackground = loadImage('chat1.png');
  chatUI = loadImage('ui1.png');
  titleFont = loadFont("Tiny5-Regular.ttf");
}

// 初始化
function setup() {
  createCanvas(800, 450);
  textFont(gameFont);

  buttons.push(new Button("开始游戏", 400, 200, () => { state = 2; }));
  buttons.push(new Button("继续游戏", 400, 250, () => { if (chapterSaved().chapter) chapterStart(true); else chapterStart(); }));
  buttons.push(new Button("结局收集", 400, 300, () => { state = 4; }));
  buttons.push(new Button("玩法说明", 400, 350, () => { state = 5; }));
  buttons.push(new Button("返回标题", 400, 400, () => { state = 0; }));
  openingVideo = createVideo("mov1.mp4");
  openingVideo.hide();       // 隐藏网页自带的视频框，只画在 p5 画布里
  openingVideo.volume(0);    // 先静音，确保浏览器允许自动播放
  openingVideo.elt.playsInline = true;
  openingVideo.loop();
}

// 主绘制循环
function draw() {
  background(0);

  if (state === 0) {
    image(openingVideo, 0, 0, width, height);
    push();
    textFont(titleFont);
    textAlign(CENTER, CENTER);
    textSize(min(width * 0.085, 110));
    strokeWeight(5);
    fill(255, 232, 245);
    text("ROMANCE", width / 2, height * 0.2);
    text("SIGNAL",  width / 2, height * 0.45);
    pop();
    textSize(30);
    textAlign(CENTER, CENTER);
    strokeWeight(0.5);
    fill(255, 255, 200);
    stroke(255, 255, 200);
  
    // The original title is baked into bg1; a panel covers only its lettering.
    text("点击开始", width / 2, height - 60);
  }
  else if (state === 1) {
    image(bg2, 0, 0, width, height);
    
    buttons.forEach(btn => btn.display());
  }
  else if (state === 2) {
    image(chatBackground, 0, 0, width, height);
    textAlign(LEFT, TOP);
    strokeWeight(0.5);
    fill(255, 255, 200);
    stroke(255, 255, 200);
    let msg = "一个普通的周六夜晚，\n你打开电脑，准备回复几条消息。\n就在这时，意想不到的事发生了……";
    textSize(20);
    text(msg, 50, 50);
  }
  else if (state === 4 || state === 5) {
    image(bg2, 0, 0, width, height);
    fill(255, 245, 252); noStroke(); textFont(gameFont); textAlign(CENTER, CENTER);
    textSize(25); text(state === 4 ? chapterEndingsMenu() : "点击推进对话；选择回应，决定约会的走向。", 400, 210);
    textSize(18); text("点击返回菜单", 400, 310);
  }
  else if (state === 3) {
    // ------------------- bg4流程 -------------------
    if (bg4Stage === 0) {
      image(bg4, 0, 0, width, height);
      image(chatUI, 0, 0, width, height);
      drawChatMessages(popupTexts.slice(1, popupTextIndex + 1).map(line => ['TA', line]));
      drawChatSide('匿名消息', popupTextIndex === 0 ? '点击查看消息' : '点击显示下一条');
    } 
    else if (bg4Stage === 1) {
      drawMemoryFile();
    } 
    else if (bg4Stage === 2) {
      image(bg5, 0, 0, width, height);
      image(chatUI, 0, 0, width, height);
      if (delayedPopup && millis() - delayedPopupTime > 1000) {
        drawChatMessages(delayedTexts.slice(0, delayedTextIndex + 1).map(line => ['TA', line]));
      }
      drawChatSide('约会邀请', millis() - delayedPopupTime > 1000 ? '点击显示下一条' : '正在输入…');
    } 
    else if (bg4Stage === 3) {
      drawDateInvite();
    }
    else if (bg4Stage === 4) {
      drawChapter();
    }
  }
}

// 鼠标点击事件
function mousePressed() {
  if (state === 0) {
    state = 1;
  } 
  else if (state === 1) {
    buttons.forEach(btn => btn.click());
  } 
  else if (state === 2) {
    state = 3;
    bg4Stage = 0;
    showPopup = true;
    popupTextIndex = 0;
  } 
  else if (state === 4 || state === 5) {
    state = 1;
  }
  else if (state === 3) {
    if (bg4Stage === 4) { chapterClick(); return; }
    if (bg4Stage === 0) {
      if (popupTextIndex < popupTexts.length - 1) {
        popupTextIndex++;
      } else {
        showPopup = false;
        bg4Stage = 1;
        photoShown = false;
      }
    } 
    else if (bg4Stage === 1) {
      if (!photoShown) {
        photoShown = true;
      } else {
        photoShown = false;
        bg4Stage = 2;
        delayedPopup = true;
        delayedPopupTime = millis();
        delayedTextIndex = 0;
      }
    } 
    else if (bg4Stage === 2) {
      if (millis() - delayedPopupTime <= 1000) return;
      if (delayedTextIndex < delayedTexts.length - 1) {
        delayedTextIndex++;
      } else {
        delayedPopup = false;
        bg4Stage = 3;
      }
    } 
    else if (bg4Stage === 3) {
      if (mouseX >= 298 && mouseX <= 502 && mouseY >= 277 && mouseY <= 324) {
        bg4Stage = 4;
        chapterStart();
      }
    }
  }
}
