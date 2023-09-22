const DEFAULT_START_BAR_VALUE = 0;
const START_AREA = 210;
const END_AREA = 315;
const AREA_WIDTH = 15;
const LINE_WIDTH = 0.5;
const GAME_BODY = document.getElementById("main");
const END_ALERT = document.getElementById("endAlert");
const colorThief = new ColorThief();
let LOAD_BAR, loadBar;
startMiniGame = (data) => {
  LOAD_BAR = document.createElement("div");
  LOAD_BAR.style.width = "140px";
  LOAD_BAR.style.height = "140px";
  LOAD_BAR.dataset.type = "fill";
  LOAD_BAR.dataset.img = data?.img || "img/fire.webp";
  LOAD_BAR.id = "loadBar";
  GAME_BODY.appendChild(LOAD_BAR);
  let canvasDraw = new SircleCanvas(250);
  let timeArea = [START_AREA];
  let areaMoveUp = true;
  let lineUp = false;
  let randomStart = randomRange(START_AREA, END_AREA);
  let lineS = START_AREA + 10;
  loadBar = new ldBar(LOAD_BAR);

  const getColorImg = document.createElement("img");
  getColorImg.src = LOAD_BAR.dataset.img;
  getColorImg.onload = () => {
    imgColor = colorThief.getColor(getColorImg);
    getColorImg.remove();
  };

  const handleKeyDown = (e) => {
    if (e.key === "e" || e.key === "E") lineUp = true;
  };

  const handleKeyUp = (e) => {
    if (e.key === "e" || e.key === "E") lineUp = false;
  };

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  const updatePositions = () => {
    if (Math.random() > (data?.difficultyFactor || 0.98))
      areaMoveUp = !areaMoveUp;

    areaMoveUp
      ? randomStart < END_AREA
        ? (randomStart += data?.areaMoveSpeed || 0.5)
        : (areaMoveUp = false)
      : randomStart > START_AREA
      ? (randomStart -= data?.areaMoveSpeed || 0.5)
      : (areaMoveUp = true);

    if (lineUp) {
      if (lineS < END_AREA + 10) lineS += data?.lineSpeedUp || 1;
    } else {
      if (lineS >= START_AREA + 5) lineS -= data?.lineSpeedUp || 1;
    }
  };

  const updateCanvas = () => {
    const areaStart = (Math.PI * randomStart) / 180;
    const areaEnd = (Math.PI * (randomStart + AREA_WIDTH)) / 180;
    const lineArea = (Math.PI * (lineS + LINE_WIDTH)) / 180;

    canvasDraw.drawCanvas();

    if (isRadianInInterval(lineArea, areaStart, areaEnd)) {
      loadBar.value < 100
        ? (loadBar.value += data?.valueUpSpeed || 0.3)
        : (loadBar.value = 100);
      canvasDraw.newArea(`rgb(${imgColor})`, areaStart, areaEnd, 250, 30, 20);
      canvasDraw.newArea(
        `rgb(255,255,255)`,
        (Math.PI * lineS) / 180,
        (Math.PI * (lineS + LINE_WIDTH * 2)) / 180,
        250,
        80,
        10
      );
    } else {
      loadBar.value > DEFAULT_START_BAR_VALUE
        ? (loadBar.value -= data?.valueDownSpeed || 0.3)
        : (loadBar.value = DEFAULT_START_BAR_VALUE);
      canvasDraw.newArea(`rgb(${imgColor})`, areaStart, areaEnd, 250, 30, 8);
      canvasDraw.newArea(
        `rgb(255,255,255)`,
        (Math.PI * lineS) / 180,
        (Math.PI * (lineS + LINE_WIDTH * 2)) / 180,
        250,
        80,
        0
      );
    }

    loadBar.set(loadBar.value);
  };

  const updateTimeArea = () => {
    for (let i = 0; i < timeArea.length; i++) {
      const start = timeArea[i];
      canvasDraw.newArea(
        `rgb(255,255,255)`,
        (Math.PI * start) / 180,
        (Math.PI * (start + LINE_WIDTH)) / 180,
        220,
        10,
        0
      );
    }
  };

  drawInterval = setInterval(() => {
    updatePositions();
    updateCanvas();
    updateTimeArea();

    if (loadBar.value == 100) {
      endGame();
    }
  }, 25);

  timer = setInterval(() => {
    const newStart = timeArea[timeArea.length - 1] + 120 / (data?.time || 25);
    timeArea.push(newStart);
    if (newStart > END_AREA + 15) {
      endGame();
    }
  }, 1000);
  animateCSS(GAME_BODY, "zoomIn");
  GAME_BODY.style.display = "block";

  const endGame = async () => {
    if (loadBar.value == 100) return sendEndGame("success");
    loadBar.value >= (data?.halfSuccessMin || 100)
      ? sendEndGame("halfSuccess")
      : sendEndGame("failed");
  };
};

const sendEndGame = (endType) => {
  loadBar.set(DEFAULT_START_BAR_VALUE);
  LOAD_BAR.remove();
  post("endGame", endType);
  if (endType === "success" || endType === "halfSuccess")
    startEndAlertAnimation();
};

const randomRange = (start, end) => Math.random() * (end - start) + start;

const isRadianInInterval = (radian, startRadian, endRadian) =>
  radian >= startRadian && radian <= endRadian;

const animateCSS = (element, animation, prefix = "animate__") =>
  new Promise((resolve, reject) => {
    const animationName = prefix + animation;
    element.classList.add(prefix + "animated", animationName);
    function handleAnimationEnd(event) {
      event.stopPropagation();
      element.classList.remove(prefix + "animated", animationName);
      resolve("Animation ended");
    }
    element.addEventListener("animationend", handleAnimationEnd, {
      once: true,
    });
  });

const startEndAlertAnimation = async () => {
  const imageDiv = END_ALERT.getElementsByTagName("img")[0];
  const frame = document.getElementById("frame");
  imageDiv.src = LOAD_BAR.dataset.img;
  const frameColor = colorThief.getColor(imageDiv);
  frame.style.border = "3px solid " + `rgb(${frameColor})`;
  frame.style.boxShadow = "inset 0 0 40px -10px " + `rgb(${frameColor})`;
  END_ALERT.style.opacity = 1;
  await animateCSS(END_ALERT, "flip");
  await animateCSS(END_ALERT, "tada");
  END_ALERT.style.opacity = 0;
};

async function post(name, body) {
  const url = `https://${GetParentResourceName()}/` + name;
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    // console.error('Post request failed:', error);
  }
}

// startMiniGame()

window.addEventListener("message", async (event) => {
  var action = event.data.type;
  if (action == "start") {
    startMiniGame(event.data.data);
  } else if (action == "stop") {
    clearInterval(timer);
    clearInterval(drawInterval);
    await animateCSS(GAME_BODY, "zoomOut");
    GAME_BODY.style.display = "none";
  }
});
