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
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // 將原始影像座標映射到畫布上縮放後的位置
          let x = map(keypoint.x, 0, video.width, width / 2 - displayW / 2, width / 2 + displayW / 2);
          let y = map(keypoint.y, 0, video.height, height / 2 - displayH / 2, height / 2 + displayH / 2);

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(x, y, 16);
        }
      }
    }
  }
}

function windowResized() {
  // 當視窗大小改變時，重新調整畫布大小
  resizeCanvas(windowWidth, windowHeight);
}
