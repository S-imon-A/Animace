const leftRacket = document.querySelector("#left-racket")
const rightRacket = document.querySelector("#right-racket")
const ball = document.querySelector("#ball")

let racketSpeed = 5

let leftRacketDirection = 0
let rightRacketDirection = 0

let leftUp = false
let leftDown = false

let rightUp = false
let rightDown = false

let ballVelocity = [0, 0]

function onKeyDown(event) {
    let key = event.key
    
    if (key == "w") {
        leftUp = true
    }
    else if (key == "s"){
        leftDown = true
    }
    else if (key == "ArrowUp") {
        rightUp = true
    }
    else if (key == "ArrowDown") {
        rightDown = true
    }
}

function onKeyUp(event) {
    let key = event.key

    if (key == "w") {
        leftUp = false
    }
    else if (key == "s"){
        leftDown = false
    }
    else if (key == "ArrowUp") {
        rightUp = false
    }
    else if (key == "ArrowDown") {
        rightDown = false
    }
}

function checkInput() {
    if (leftUp && !leftDown) {
        leftRacketDirection = -1
    }
    else if (leftDown && !leftUp) {
        leftRacketDirection = 1
    }
    else {
        leftRacketDirection = 0
    }

    if (rightUp && !rightDown) {
        rightRacketDirection = -1
    }
    else if (rightDown && !rightUp) {
        rightRacketDirection = 1
    }
    else {
        rightRacketDirection = 0
    }
}

function mainLoop() {
    checkInput()

    const leftRacketStyle = window.getComputedStyle(leftRacket)
    const rightRacketStyle = window.getComputedStyle(rightRacket)

    let leftRacketTopPosition = parseFloat(leftRacketStyle.top.slice(0, leftRacketStyle.top.length - 2))
    let leftMove = racketSpeed * leftRacketDirection

    if (leftRacketTopPosition + leftMove < 350) {
        leftRacketTopPosition = 350
        leftMove = 0
    }
    else if (leftRacketTopPosition + leftMove > 750) {
        leftRacketTopPosition = 750
        leftMove = 0
    }

    let rightRacketTopPosition = parseFloat(rightRacketStyle.top.slice(0, rightRacketStyle.top.length - 2))
    let rightMove = racketSpeed * rightRacketDirection

    if (rightRacketTopPosition + rightMove < 350) {
        rightRacketTopPosition = 350
        rightMove = 0
    }
    else if (rightRacketTopPosition + rightMove > 750) {
        rightRacketTopPosition = 750
        rightMove = 0
    }

    leftRacket.style.top = (leftRacketTopPosition + leftMove).toString() + "px"
    rightRacket.style.top = (rightRacketTopPosition + rightMove).toString() + "px"

    const ballStyle = window.getComputedStyle(ball)
    let ballTopPosition = parseFloat(ballStyle.top.slice(0, ballStyle.top.length - 2))
    
    
    
    
}

document.addEventListener("keydown", onKeyDown)
document.addEventListener("keyup", onKeyUp)
setInterval(mainLoop, 10)