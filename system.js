const leftRacket = document.querySelector("#left-racket")
const rightRacket = document.querySelector("#right-racket")
const ball = document.querySelector("#ball")
const startButton = document.querySelector("#start-game-button")
const startButtonBackground = document.querySelector("#start-game-blur")
const winner = document.querySelector("#winner")
const leftPoints = document.querySelector("#left-points")
const rightPoints = document.querySelector("#right-points")
const serveInfo = document.querySelector("#serve-info")
const matchPointInfo = document.querySelector("#match-point")
let countdownBlur = NaN

let leftPlayerPoints = 0
let rightPlayerPoints = 0

let racketSpeed = 10

let leftRacketDirection = 0
let rightRacketDirection = 0

let leftUp = false
let leftDown = false

let rightUp = false
let rightDown = false

let ballDirection = [0, 0]
let ballHitDirectionChange = 0.15
let ballSpeed = 5
let adjustedBallSpeed = ballSpeed
let ballStop = true
let handleBallStop = false
let ballStopTimer = 0

let playerStarts = 0
let randomServe = 1
let startSide = -1

let allowRacketMovement = false

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

function random(rangeMin, rangeMax) {
    rangeMax *= 100
    rangeMin *= 100

    let randomNumber = Math.floor(Math.random() * Math.abs(rangeMax - rangeMin) + 1)

    return rangeMin / 100 + randomNumber / 100
}

function getDistance(element0, element1) {
    const rect0 = element0.getBoundingClientRect()
    const rect1 = element1.getBoundingClientRect()

    const diffX = Math.abs((rect0.left + rect0.width/2) - (rect1.left + rect1.width/2))
    const diffY = Math.abs((rect0.top + rect0.height/2) - (rect1.top + rect1.height/2))

    return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2))
}

function calculateBallSpeed() {
    const ballToLeftRacket = getDistance(ball, leftRacket)
    const ballToRightRacket = getDistance(ball, rightRacket)

    if (ballToLeftRacket < ballToRightRacket) {
        if (ballDirection[0] == -1) {
            if (ballToLeftRacket > 400 && ballToLeftRacket < 450 && ballStop) {
                ballStop = false
                handleBallStop = true
            }
        }
        else {
            ballStop = true
        }
    }
    else {
        if (ballDirection[0] == 1) {
            if (ballToRightRacket > 400 && ballToRightRacket < 450 && ballStop) {
                ballStop = false
                handleBallStop = true
            }
        }
        else {
            ballStop = true
        }
    }

    if (handleBallStop) {
        ballStopTimer ++

        if (ballStopTimer >= 50) {
            handleBallStop = false
        }

        adjustedBallSpeed = ballSpeed - (ballStopTimer / 10)
    }
    else {
        ballStopTimer = 0

        if (adjustedBallSpeed < ballSpeed) {
            adjustedBallSpeed = adjustedBallSpeed + 1
        }
    }
}

function handleBallVelocity() {
    const ballStyle = window.getComputedStyle(ball)
    let ballTopPosition = parseFloat(ballStyle.top.slice(0, ballStyle.top.length - 2))
    let ballLeftPosition = parseFloat(ballStyle.left.slice(0, ballStyle.left.length - 2))
    
    ball.style.top = (ballTopPosition + adjustedBallSpeed * ballDirection[1]).toString() + "px"
    ball.style.left = (ballLeftPosition + adjustedBallSpeed * ballDirection[0]).toString() + "px"

    if (ballTopPosition < 350 && ballDirection[1] < 0) {
        ballDirection = [ballDirection[0], Math.abs(ballDirection[1])]
    }

    if (ballTopPosition > 725 && ballDirection[1] > 0) {
        ballDirection = [ballDirection[0], -Math.abs(ballDirection[1])]
    }
}

function handleRacketPositions() {
    const leftRacketStyle = window.getComputedStyle(leftRacket)
    const rightRacketStyle = window.getComputedStyle(rightRacket)

    let leftRacketTopPosition = parseFloat(leftRacketStyle.top.slice(0, leftRacketStyle.top.length - 2))
    let leftMove = racketSpeed * leftRacketDirection

    if (leftRacketTopPosition + leftMove < 350) {
        leftRacketTopPosition = 350
        leftMove = 0
    }
    else if (leftRacketTopPosition + leftMove > 650) {
        leftRacketTopPosition = 650
        leftMove = 0
    }

    let rightRacketTopPosition = parseFloat(rightRacketStyle.top.slice(0, rightRacketStyle.top.length - 2))
    let rightMove = racketSpeed * rightRacketDirection

    if (rightRacketTopPosition + rightMove < 350) {
        rightRacketTopPosition = 350
        rightMove = 0
    }
    else if (rightRacketTopPosition + rightMove > 650) {
        rightRacketTopPosition = 650
        rightMove = 0
    }

    if (allowRacketMovement) {
        leftRacket.style.top = (leftRacketTopPosition + leftMove).toString() + "px"
        rightRacket.style.top = (rightRacketTopPosition + rightMove).toString() + "px"
    }
}

function handleBallHits() {
    const ballStyle = window.getComputedStyle(ball)
    let ballTopPosition = parseFloat(ballStyle.top.slice(0, ballStyle.top.length - 2))
    let ballLeftPosition = parseFloat(ballStyle.left.slice(0, ballStyle.left.length - 2))
    let leftRect = leftRacket.getBoundingClientRect()
    let rightRect = rightRacket.getBoundingClientRect()

    if (leftRect.right > ballLeftPosition && leftRect.top - 50 <= ballTopPosition && leftRect.bottom - 100 >= ballTopPosition) {
        let distanceToTop = Math.abs(leftRect.top - ballTopPosition)

        let rotation = -0.5 + (distanceToTop / 150)

        ballDirection = [1, rotation]
        ballSpeed += 0.25

        ballSpeed = random(ballSpeed - 0.25, ballSpeed + 1)
    }

    if (rightRect.left < ballLeftPosition + 50 && rightRect.top - 50 <= ballTopPosition && rightRect.bottom - 100 >= ballTopPosition) {
        let distanceToTop = Math.abs(rightRect.top - ballTopPosition)

        let rotation = -0.5 + (distanceToTop / 150)

        ballDirection = [-1, rotation]
        ballSpeed += 0.25

        ballSpeed = random(ballSpeed - 0.25, ballSpeed + 1)
    }

    if (leftRect.left > ballLeftPosition && allowRacketMovement) {
        ballDirection = [0, 0]
        allowRacketMovement = false
        rightPlayerPoints++
        rightPoints.style.animation = "countdown-animation 0.5s alternate 2"
        endRound("Right player")
    }

    if (rightRect.right < ballLeftPosition + 50 && allowRacketMovement) {
        ballDirection = [0, 0]
        allowRacketMovement = false
        leftPlayerPoints++
        leftPoints.style.animation = "countdown-animation 0.5s alternate 2"
        endRound("Left player")
    }
}

function countdownAnimationEnd() {
    if (countdown.innerText === "3") {
        countdown.innerText = "2"
        countdown.style.animation = "none"
        setTimeout(() => {
            countdown.style.animation = "countdown-animation 0.5s alternate 2"
        }, 10)
    }
    else if (countdown.innerText === "2") {
        countdown.innerText = "1"
        countdown.style.animation = "none"
        setTimeout(() => {
            countdown.style.animation = "countdown-animation 0.5s alternate 2"
        }, 10)
    }
    else if (countdown.innerText === "1") {
        countdown.innerText = "Go!"
        countdown.style.animation = "none"
        setTimeout(() => {
            countdown.style.animation = "countdown-animation 0.5s alternate 2"
        }, 10)
    }
    else {
        countdown.innerText = "3"
        countdown.style.animation = "none"
        countdown.style.display = "none"
        countdownBlur.remove()
        countdown.removeEventListener("click", countdownAnimationEnd)

        enableBall()
    }
}

function startRound() {
    const countdown = document.querySelector("#countdown")
    countdown.style.display = "block"
    countdown.style.animation = "countdown-animation 0.5s alternate 2"

    countdownBlur = document.createElement("div")
    countdownBlur.classList.add("blur")
    document.body.append(countdownBlur)

    countdown.innerText = "3"

    countdown.addEventListener("animationend", countdownAnimationEnd)
}

function endRound(winnerName) {
    leftRacket.style.top = "45%"
    rightRacket.style.top = "45%"

    ball.style.visibility = "hidden"

    winner.style.display = "block"

    if (leftPlayerPoints === 11 && rightPlayerPoints < 10 || rightPlayerPoints === 11 && leftPlayerPoints <= 10 || Math.abs(leftPlayerPoints - rightPlayerPoints) > 1 && rightPlayerPoints >= 10 && leftPlayerPoints >= 10) {
        winner.innerText = winnerName + " is the winner!"
        displayPoints()
        rightPoints.style.animation = "none"
        leftPoints.style.animation = "none"

        return
    }
    else {
        winner.innerText = winnerName
    }

    displayPoints()

    setTimeout(() => {
        winner.style.display = "none"
        rightPoints.style.animation = "none"
        leftPoints.style.animation = "none"

        setNextServePlayer()

        let matchPoint = isMatchPoint()
        if (matchPoint[0]) {
            matchPointInfo.innerText = matchPoint[1] + " matchpoint!"
            matchPointInfo.style.display = "block"
        }

        serveInfo.style.display = "block"
        startRound()
    }, 2000)
}

function setNextServePlayer() {
    let prevStartSide = startSide

    if (playerStarts < 2) {
        playerStarts++

        startSide = -1 * randomServe
    }
    else if (playerStarts < 4) {
        playerStarts++

        startSide = 1 * randomServe
    }
    else {
        playerStarts = 1

        startSide = -1 * randomServe
    }

    if (leftPlayerPoints >= 10 && rightPlayerPoints >= 10) {
        if (prevStartSide === -1) {
            startSide = 1
        }
        else [
            startSide = -1
        ]
    }

    if (startSide === -1) {
        serveInfo.classList = ["left-serve-pos"]
    }
    else {
        serveInfo.classList = ["right-serve-pos"]
    }
}

function enableBall() {
    if (startSide === -1) {
        ball.style.left = "20%"
    }
    else {
        ball.style.left = "80%"
    }
    
    ball.style.top = "50%"

    ballSpeed = 10
    adjustedBallSpeed = ballSpeed
    ballHitDirectionChange = 0.15

    ballDirection = [startSide, random(-ballHitDirectionChange, ballHitDirectionChange)]

    ball.style.visibility = "visible"
    allowRacketMovement = true

    serveInfo.style.display = "none"
    matchPointInfo.style.display = "none"
}

function isMatchPoint() {
    if (leftPlayerPoints === 10 && rightPlayerPoints < 10) {
        return [true, "Left player"]
    }
    else if (rightPlayerPoints === 10 && leftPlayerPoints < 10) {
        return [true, "Right player"]
    }
    else if (rightPlayerPoints >= 10 && leftPlayerPoints >= 10) {
        if (leftPlayerPoints > rightPlayerPoints) {
            return [true, "Left player"]
        }
        else if (rightPlayerPoints > leftPlayerPoints) {
            return [true, "Right player"]
        }
    }

    return [false, "None"]
}

function displayPoints() {
    leftPoints.innerText = leftPlayerPoints
    rightPoints.innerText = rightPlayerPoints
}

function mainLoop() {
    checkInput()
    handleRacketPositions()
    handleBallVelocity()
    handleBallHits()
    calculateBallSpeed()
}

function setup() {
    ball.style.visibility = "hidden"

    let randomServerNumber = Math.floor(Math.random() * 2)
    if (randomServerNumber === 0) {
        randomServe = -1
        serveInfo.classList = ["right-serve-pos"]
    }
    else {
        serveInfo.classList = ["left-serve-pos"]
    }

    startButton.addEventListener("click", () => {
        startButton.style.display = "none"
        startButtonBackground.style.display = "none"

        serveInfo.style.display = "block"

        setNextServePlayer()

        startRound()
    })

    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("keyup", onKeyUp)
    setInterval(mainLoop, 10)
}

setup()