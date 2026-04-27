// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let isModelLoaded = false;

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true }, () => {
    isModelLoaded = true;
  });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  // 設定背景顏色為 e7c6ff
  background('#e7c6ff');

  // 計算影像顯示的寬高（全螢幕的 50%）
  let displayW = width * 0.5;
  let displayH = height * 0.5;

  // 將影像繪製在視窗中間
  imageMode(CENTER);
  image(video, width / 2, height / 2, displayW, displayH);

  // 在畫布上方顯示文字
  fill(0);
  noStroke();
  textSize(40);
  textAlign(CENTER, CENTER);
  text("414730589黃讌婷", width / 2, height * 0.15);

  // 如果模型還沒載入完成，顯示提示文字
  if (!isModelLoaded) {
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("模型載入中，請稍候...", width / 2, height / 2);
  }

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 定義要串接的手指關節編號群組
        let fingerParts = [
          [0, 1, 2, 3, 4],     // 大拇指 (含手腕)
          [5, 6, 7, 8],        // 食指
          [9, 10, 11, 12],     // 中指
          [13, 14, 15, 16],    // 無名指
          [17, 18, 19, 20]     // 小指
        ];

        // 根據左右手決定顏色 (左手紫色，右手黃色)
        let col = hand.handedness == "Left" ? color(255, 0, 255) : color(255, 255, 0);

        // 1. 繪製連接線
        stroke(col);
        strokeWeight(4);
        noFill();
        for (let part of fingerParts) {
          for (let i = 0; i < part.length - 1; i++) {
            let p1 = hand.keypoints[part[i]];
            let p2 = hand.keypoints[part[i + 1]];
            
            let x1 = map(p1.x, 0, video.width, width / 2 - displayW / 2, width / 2 + displayW / 2);
            let y1 = map(p1.y, 0, video.height, height / 2 - displayH / 2, height / 2 + displayH / 2);
            let x2 = map(p2.x, 0, video.width, width / 2 - displayW / 2, width / 2 + displayW / 2);
            let y2 = map(p2.y, 0, video.height, height / 2 - displayH / 2, height / 2 + displayH / 2);
            
            line(x1, y1, x2, y2);
          }
        }

        // 2. 繪製關節點 (保持原本的圓點)
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];
          let x = map(keypoint.x, 0, video.width, width / 2 - displayW / 2, width / 2 + displayW / 2);
          let y = map(keypoint.y, 0, video.height, height / 2 - displayH / 2, height / 2 + displayH / 2);

          // 針對 4, 8, 12, 16, 20 產生水泡與紫色火焰
          let tips = [4, 8, 12, 16, 20];
          if (tips.includes(i)) {
            drawFlame(x, y);
            drawBubble(x, y);
          }

          fill(col);
          noStroke();
          circle(x, y, 12);
        }
      }
    }
  }
}

function windowResized() {
  // 當視窗大小改變時，重新調整畫布大小
  resizeCanvas(windowWidth, windowHeight);
}

// 繪製紫色火焰特效
function drawFlame(x, y) {
  push();
  noStroke();
  for (let i = 0; i < 6; i++) {
    // 紫色調顏色變化
    let r = random(100, 200);
    let b = 255;
    fill(r, 0, b, 150 - i * 20);
    
    let offsetX = random(-8, 8);
    let offsetY = -i * 12 - (frameCount % 15);
    let size = 25 - i * 4;
    
    ellipse(x + offsetX, y + offsetY, size, size * 1.5);
  }
  pop();
}

// 繪製水泡特效
function drawBubble(x, y) {
  push();
  // 半透明水藍色
  fill(200, 235, 255, 120);
  stroke(255, 200);
  strokeWeight(2);
  circle(x, y, 35);
  // 水泡反光點
  noStroke();
  fill(255, 255, 255, 180);
  circle(x - 8, y - 8, 10);
  pop();
}
