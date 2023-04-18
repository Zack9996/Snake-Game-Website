const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
// getcontext()method會回傳一個canvas 的drawing context
// drawing context可以用夾在canvas 内畫圖
const unit = 20;
const row = canvas.height / unit; // 320 / 20 = 16
const column = canvas.width / unit; // 320 / 20 = 16
let snake = []; // array中的每個元素，都是一個物件
let score = 0;
let heightScore;
loadHighestScore();
document.getElementById("myScore").innerText = "目前分數為：" + score;
document.getElementById("myScoreHistory").innerText =
  "歷史最高分數為：" + heightScore;
// 物件的工作是，儲存身體的x，y座標
// 基本上在各大程式語言中的畫布功能，座標的起始位置都是最左上角從(0,0)開始，和數學上的xy座標有不太一樣。
createSnake();
function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };
  snake[1] = {
    x: 60,
    y: 0,
  };
  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }
  picklocation() {
    let overlapping = false;
    let newX;
    let newY;

    function checkOverlap(newX, newY) {
      for (let i = 0; i < snake.length; i++) {
        if (newX == snake[i].x && newY == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }
    do {
      newX = Math.floor(Math.random() * column) * unit;
      newY = Math.floor(Math.random() * row) * unit;
      checkOverlap(newX, newY);
    } while (overlapping);
    this.x = newX;
    this.y = newY;
  }
}
let fruit = new Fruit();
let d = "Right"; // 蟲的預設方向

function draw() {
  // 每次畫圖之前，確認蛇有沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(mygame); // 遊戲結束
      alert("Gameover!");
      return; // 跳出function。
    }
  }
  // 背景全設定為黑色
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  fruit.drawFruit(); // 畫出果實
  // 畫出蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightblue";
    } else {
      ctx.fillStyle = "lightyellow";
    }
    ctx.strokeStyle = "white"; // 外框樣式

    // 下方為穿牆功能
    if (snake[0].x > canvas.width) {
      snake[0].x = 0;
    } else if (snake[0].x < 0) {
      snake[0].x = canvas.width - unit;
    } else if (snake[0].y > canvas.height) {
      snake[0].y = 0;
    } else if (snake[0].y < 0) {
      snake[0].y = canvas.height - unit;
    }

    // 下方總共有四個參數 x,y,width,height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit); // 畫出本體
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit); // 畫出外框
  }
  // 以目前d變數的方向，來決定蛇的下一幀要放在哪個座標。
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  switch (d) {
    case "Left":
      snakeX -= unit;
      break;
    case "Right":
      snakeX += unit;
      break;
    case "Up":
      snakeY -= unit;
      break;
    case "Down":
      snakeY += unit;
      break;
  }
  // 製造新的蛇頭
  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // 確認蛇是否有吃到果費
  if (fruit.x == snake[0].x && fruit.y == snake[0].y) {
    // 重新產生果實的隨機位置
    fruit.picklocation();
    // 更新分數
    score++;
    setHeghtestScore(score);
    document.getElementById("myScore").innerText = "目前分數為：" + score;
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
  addEventListener("keydown", directionControl); // 打開監聽鍵盤事件
}
let mygame = setInterval(draw, 100);
addEventListener("keydown", directionControl); // 監聽鍵盤事件
// 下方為控制方向
function directionControl(e) {
  key = e.key;
  if (key == "d" && d != "Left") {
    d = "Right";
  } else if (key == "a" && d != "Right") {
    d = "Left";
  } else if (key == "w" && d != "Down") {
    d = "Up";
  } else if (key == "s" && d != "Up") {
    d = "Down";
  }
  // 每次按下上下左右鍵之後，在下一幀被畫出來之前，
  // 不接受任何keydown事件
  // 這樣可以防止連續按鍵導致蛇在邏輯上自殺
  removeEventListener("keydown", directionControl); // 關閉監聽鍵盤事件，直到draw畫完。
}

function loadHighestScore() {
  if (localStorage.getItem("heightScore") == null) {
    console.log("沒存過！");
    heightScore = 0;
  } else {
    heightScore = Number(localStorage.getItem("heightScore"));
  }
}

function setHeghtestScore(score) {
  if (score > heightScore) {
    localStorage.setItem("heightScore", score);
    heightScore = score;
    document.getElementById("myScoreHistory").innerText =
      "歷史最高分數為：" + heightScore;
  }
}
