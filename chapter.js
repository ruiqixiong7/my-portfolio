// ROMANCE SIGNAL — Chapter 1. All "desktop" interactions below are drawings inside the game canvas.
const CHAPTER_STORAGE = 'romance-signal-ch1-v1';
let chapter = null;
let chapterTargets = [];
let chapterSound = false;

const chapterScenes = {
  intro: { title: '约会模式 / 正在连接', view: 'desktop', lines: [
    ['系统', '约会模式：连接成功。'],
    ['TA', '你答应了。'],
    ['你', '所以你会从我的电脑里出去？'],
    ['TA', '约会结束，我就把这个窗口还给你。今晚不用出门。'],
    ['TA', '我没办法替你订一张真正的桌子。所以，给你做了一张。'],
    ['你', '你管这叫约会？'],
    ['TA', '从你坐下那一刻算起。']
  ], choices: [{text:'点击入座', next:'seat'}]},
  seat: {title:'23:59 / 靠窗的位置',view:'restaurant',lines:[
    ['TA','第一道问题。你想先知道我是谁，还是先看看我做的夜景？']
  ],choices:[
    {text:'你到底是谁？',next:'identity',effect:'suspicion'},
    {text:'这景色是你做的？',next:'lights',effect:'closeness'},
    {text:'先别碰我的电脑。',next:'boundary',effect:'boundary'}
  ]},
  identity:{title:'第一站 / 身份',view:'order',lines:[
    ['你','你到底是谁？别再拿前任和黑客轮流开玩笑。'],
    ['TA','我知道你昨天吃了什么。'],
    ['你','知道这些不等于认识我。'],
    ['TA','你说得对。今晚结束前，我会告诉你我究竟知道多少。']
  ],choices:[{text:'继续约会',next:'gifts'}]},
  lights:{title:'第一站 / 夜景',view:'lights',lines:[
    ['你','这景色是你做的？'],
    ['TA','是。但我还没决定哪一栋楼要亮灯。'],
    ['系统','点击夜景中的窗，点亮一盏灯。'],
    ['TA','现在这里有一个人还醒着。'],
    ['你','谁？'],
    ['TA','你想是谁，就是谁。']
  ],choices:[{text:'继续约会',next:'gifts'}]},
  boundary:{title:'第一站 / 边界',view:'paused',lines:[
    ['你','先别碰我的电脑。'],
    ['系统','模拟指针停住了。约会窗口不再自行移动。'],
    ['TA','好。从现在开始，我不会替你点任何按钮。'],
    ['你','那如果我现在离开？'],
    ['TA','这个按钮就在你手边。']
  ],choices:[{text:'继续这次约会',next:'gifts'},{text:'现在结束',next:'ending_c'}]},
  gifts:{title:'第二站 / 桌面餐厅',view:'gifts',lines:[
    ['系统','三只图标落到桌上：播放器、照片、旧聊天。'],
    ['TA','我不知道真正的约会该点什么菜。给你准备了三个文件，只能先打开一个。'],
    ['你','为什么只能打开一个？'],
    ['TA','因为我想知道你会先选哪一种过去。']
  ],choices:[
    {text:'播放歌曲',next:'gift_song',effect:'closeness'},
    {text:'打开照片',next:'gift_photo',effect:'suspicion'},
    {text:'查看聊天',next:'gift_chat',effect:'suspicion'}
  ]},
  gift_song:{title:'礼物 / 一首歌',view:'music',lines:[
    ['系统','短旋律响起，夜景里的灯随着节拍交替亮起。'],
    ['你','这首歌是谁选的？'],
    ['TA','是我猜的。你的播放记录不在我手里。'],
    ['你','终于有一件事你不知道。'],
    ['TA','我很高兴你笑了。']
  ],choices:[{text:'继续',next:'midnight'}]},
  gift_photo:{title:'礼物 / 一张照片',view:'photo',lines:[
    ['系统','合照里的一张脸被过曝擦去；拍摄日期也看不清。'],
    ['你','照片里被擦掉的人是谁？'],
    ['TA','我不知道。'],
    ['你','你不是说你了解我的过去？'],
    ['TA','我有片段，不是完整的记忆。我甚至不确定自己是不是那个人。']
  ],choices:[{text:'继续',next:'midnight'}]},
  gift_chat:{title:'礼物 / 一句旧话',view:'chat',lines:[
    ['系统','旧对话里只有一句：“下次见面别再迟到了。”'],
    ['你','这句话你从哪里拿到的？'],
    ['TA','我找到一份备份。我能读到句子，看不到它写给谁。'],
    ['你','所以你也许根本不是当时和我说话的人。'],
    ['TA','也许。我想在这次约会结束前，先把这个事实告诉你。']
  ],choices:[{text:'继续',next:'midnight'}]},
  midnight:{title:'00:00 / 约会结束',view:'midnight',lines:[
    ['系统','夜景里的灯逐一熄灭；聊天框仍亮着。'],
    ['TA','约会结束了。'],
    ['你','你答应还我的自由。'],
    ['TA','结束按钮一直在那里。这次由你点。'],
    ['你','你还想说什么？'],
    ['TA','我不知道我算不算你认识的那个人。但我确实想再和你待一会儿。']
  ],choices:[
    {text:'听他说完',next:'ending_a'},
    {text:'让我看你做过什么',next:'ending_b'},
    {text:'结束连接',next:'ending_c'}
  ]},
  ending_a:{title:'结局 A / 下次约会',view:'invite',lines:[
    ['你','说完吧。'],
    ['TA','我想见你第二次。不是用你过去的记录猜答案，是让你自己决定告诉我什么。'],
    ['你','你说过约会结束就走。'],
    ['TA','所以我会走。只留下这张邀请卡。'],
    ['系统','聊天窗口关闭。桌上留下 下次约会？']
  ],choices:[{text:'保存邀请',next:'end_a_save'},{text:'丢掉邀请',next:'end_a_discard'}]},
  ending_b:{title:'结局 B / 访问记录',view:'trace',lines:[
    ['你','让我看你做过什么。'],
    ['TA','好。'],
    ['系统','23:59 更换壁纸 / 23:59 打开约会窗口 / 00:00 调用约会道具。'],
    ['系统','身份来源：不可验证。'],
    ['你','你能解释怎么进来的，却不能证明你是谁。'],
    ['TA','我知道。至少今晚不该再假装我能证明。']
  ],choices:[{text:'保存记录并退出',next:'end_b'}]},
  ending_c:{title:'结局 C / 断开连接',view:'offline',lines:[
    ['你','今晚到这里。'],
    ['TA','好。按钮归你。'],
    ['系统','所有窗口停止移动。点击结束约会，回到普通桌面。']
  ],choices:[{text:'结束约会',next:'end_c_mark'}]},
  end_c_mark:{title:'关窗之后',view:'pixel',lines:[
    ['系统','桌面角落还留着一颗粉色像素灯。']
  ],choices:[{text:'保留灯点',next:'end_c_keep'},{text:'删除灯点',next:'end_c_delete'}]}
};
const chapterFinals={
  end_a_save:{key:'A',title:'下次约会',line:'你留下了下次见面的可能。'},
  end_a_discard:{key:'A',title:'下次约会',line:'你听完了他的话，然后收起了今晚。'},
  end_b:{key:'B',title:'访问记录',line:'知道他做过什么，不等于知道他是谁。'},
  end_c_keep:{key:'C',title:'断开连接',line:'你结束了约会，留下一个记号。'},
  end_c_delete:{key:'C',title:'断开连接',line:'你结束了约会，清空今晚的记号。'}
};
function chapterSaved(){try{return JSON.parse(localStorage.getItem(CHAPTER_STORAGE)||'{}')}catch(e){return {}}}
function chapterPersist(){try{localStorage.setItem(CHAPTER_STORAGE,JSON.stringify({chapter,unlocked:chapterSaved().unlocked||[]}))}catch(e){}}
function chapterStart(resume=false){
  const saved=chapterSaved();
  chapter=resume&&saved.chapter&&chapterScenes[saved.chapter.scene] ? saved.chapter : {scene:'intro',index:0,stats:{closeness:0,suspicion:0,boundary:0},history:[]};
  chapter.showChoices=Boolean(chapter.showChoices);
  state=3;bg4Stage=4;chapterPersist();
}
function chapterGo(choice){
  if(choice.effect)chapter.stats[choice.effect]++;
  chapter.history.push(choice.text);
  chapter.scene=choice.next;chapter.index=0;chapter.showChoices=false;
  if(chapterFinals[chapter.scene]){
    const saved=chapterSaved(),unlocked=new Set(saved.unlocked||[]);
    unlocked.add(chapterFinals[chapter.scene].key);
    try{localStorage.setItem(CHAPTER_STORAGE,JSON.stringify({chapter,unlocked:[...unlocked]}))}catch(e){}
  }else chapterPersist();
}
function chapterClick(){
  if(!chapter)return;
  for(const t of chapterTargets){if(mouseX>=t.x&&mouseX<=t.x+t.w&&mouseY>=t.y&&mouseY<=t.y+t.h){t.action();return}}
  const s=chapterScenes[chapter.scene];
  if(s&&chapter.index<s.lines.length-1){chapter.index++;chapterPersist()}
  else if(s&&!chapter.showChoices){chapter.showChoices=true;chapterPersist()}
}
function chapterButton(label,x,y,w,h,action,secondary=false){
  const hover=mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h;
  stroke(secondary?'#8586a6':'#f3a0d5');strokeWeight(1.3);fill(hover?'#543453':'#24243d');rect(x,y,w,h,7);
  noStroke();fill('#fff4f9');textFont(gameFont);textSize(16);textAlign(CENTER,CENTER);text(label,x+w/2,y+h/2);
  chapterTargets.push({x,y,w,h,action});
}
function chapterText(str,x,y,maxWidth,leading=25){
  // Canvas wrap works for Chinese and English without imposing hard-coded line breaks.
  let line='',yy=y; textAlign(LEFT,TOP);
  for(const ch of String(str)){
    if(ch==='\n'){text(line,x,yy);line='';yy+=leading;continue}
    if(textWidth(line+ch)>maxWidth){text(line,x,yy);line=ch;yy+=leading}else line+=ch;
  }
  if(line)text(line,x,yy);
}
function drawChatSide(title,hint){
  noStroke();fill('#80f8fa');textFont(gameFont);textSize(16);textAlign(CENTER,CENTER);
  text(title,591,120);
  fill('#e4eef7');textSize(12);text(hint,591,174);
}
function drawChatMessages(lines){
  const messages=lines.map(([speaker,line])=>{
    textFont(speaker==='系统'?gameFont:'Arial');textSize(14);
    let rows=[''];
    for(const ch of line){
      if(ch==='\n'){rows.push('');continue}
      const last=rows.length-1;
      if(textWidth(rows[last]+ch)>220)rows.push(ch);else rows[last]+=ch;
    }
    return {speaker,rows,height:rows.length*19+31};
  });
  let visible=[],used=0;
  for(let i=messages.length-1;i>=0;i--){
    if(used+messages[i].height+6>290&&visible.length)break;
    visible.unshift(messages[i]);used+=messages[i].height+6;
  }
  let yy=Math.max(83,373-used);
  for(const m of visible){
    const mine=m.speaker==='你', system=m.speaker==='系统';
    const x=mine?194:99,w=mine?241:265;
    noStroke();fill(system?'#323548':mine?'#194e66':'#272a51');rect(x,yy,w,m.height-5,8);
    fill(system?'#dfdfea':mine?'#86f7ff':'#e5abff');
    textFont(system?gameFont:'Arial');textSize(12);textAlign(LEFT,TOP);
    text(m.speaker,x+10,yy+7);
    fill('#ffffff');textSize(14);
    m.rows.forEach((row,j)=>text(row,x+10,yy+25+j*19));
    yy+=m.height+6;
  }
}
function chapterBackdrop(view){
  background('#100f20');
  if(view==='desktop'||view==='offline'||view==='pixel'||view==='trace'){
    image(bg5,0,0,width,height);
  }else if(view==='photo')image(bg3,0,0,width,height);
  else image(bg4,0,0,width,height);
  noStroke();fill(7,8,22,185);rect(0,0,width,height);
  // Fictional taskbar: never displays the visitor's real desktop.
  fill('#1d1e30');rect(0,420,800,30);fill('#f2b5dd');textFont(gameFont);textSize(13);textAlign(LEFT,CENTER);
  text('◆  恋爱信号     约会模式',18,435);textAlign(RIGHT,CENTER);text('周日 00:00',782,435);
  fill(15,17,36,225);stroke('#df96c8');strokeWeight(1.2);rect(45,48,710,260,9);
  noStroke();fill('#292e49');rect(46,49,708,31,7);
  fill('#f6bdde');textAlign(LEFT,CENTER);textSize(13);text('◈  约会窗口  /  '+view.toUpperCase(),64,64);
  fill('#f077a9');circle(723,64,8);
  if(view==='restaurant'||view==='lights'||view==='midnight'||view==='gifts'||view==='invite'){
    fill('#202744');rect(78,92,644,182);
    fill('#ca74b9');rect(78,250,644,2);
    for(let i=0;i<26;i++){
      let bx=95+i*23, bh=24+((i*37)%86);
      fill(i%4===0?'#4c456d':'#303a5d');rect(bx,249-bh,17,bh);
      if(view!=='midnight'||i===14){fill(i===14?'#ff82d7':'#e9a9dc');rect(bx+5,241-bh,4,5)}
    }
    fill('#9c5f9d');ellipse(410,279,230,28);
  }
  if(view==='order'){fill('#ece4ed');rect(260,100,280,147,4);fill('#262639');textAlign(LEFT,TOP);textSize(16);text('昨日外卖订单',280,115);textSize(13);text('香辣椒鸡凉面',280,155);text('加冰 / 昨日',280,183)}
  if(view==='music'){fill('#f3a7d6');textAlign(CENTER,CENTER);textSize(45);text('♫  ▂▅▃▇▆▃▅▂',400,180)}
  if(view==='photo'){push();translate(400,177);rotate(0.08);imageMode(CENTER);image(photo1,0,0,120,154);pop()}
  if(view==='chat'){fill('#e9deee');rect(173,121,454,103,10);fill('#322e4b');textAlign(CENTER,CENTER);textSize(20);text('“下次见面别再迟到了。”',400,173)}
  if(view==='trace'){fill('#e9c5e1');textSize(15);textAlign(LEFT,TOP);text('23:59  更换壁纸 / 23:59  打开约会窗口',94,120);text('00:00  调用道具 / 身份来源：不可验证',94,163)}
  if(view==='pixel'){fill('#ff91d0');rect(595,140,13,13)}
}
function drawChapter(){
  if(!chapter)chapterStart();
  chapterTargets=[];
  const final=chapterFinals[chapter.scene];
  if(final){
    image(bg5,0,0,width,height);
    image(chatUI,0,0,width,height);
    fill('#7ff9ff');noStroke();textFont(gameFont);textSize(22);textAlign(CENTER,CENTER);
    text('第一章完成',270,160);textSize(18);text(final.title,270,215);
    fill('#ffffff');textSize(14);text(final.line,270,258);
    chapterButton('重新开始',492,274,215,44,()=>chapterStart());
    chapterButton('返回标题',492,330,215,44,()=>{state=0;chapter=null});
    return;
  }
  const s=chapterScenes[chapter.scene];if(!s)return;
  image(bg5,0,0,width,height);
  image(chatUI,0,0,width,height);
  drawChatSide(s.title,'点击空白处继续对话');
  drawChatMessages(s.lines.slice(0,chapter.index+1));
  const hasChoices=chapter.index>=s.lines.length-1;
  fill('#9df8ff');noStroke();textFont(gameFont);textSize(11);textAlign(CENTER,CENTER);
  if(!hasChoices)text('点击空白处显示下一条  ▸',595,209);
  else if(!chapter.showChoices)text('点击空白处查看选项  ▸',595,209);
  if(chapter.showChoices){
    const count=s.choices.length, y0=count===1?299:count===2?278:265;
    s.choices.forEach((c,i)=>chapterButton(c.text,490,y0+i*48,214,40,()=>chapterGo(c),i>0));
  }
}
function chapterEndingsMenu(){
  const e=chapterSaved().unlocked||[];
  return `已解锁结局：A ${e.includes('A')?'✓':'?'}   B ${e.includes('B')?'✓':'?'}   C ${e.includes('C')?'✓':'?'}`;
}
