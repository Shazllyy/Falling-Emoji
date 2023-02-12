//Variable declaration
var container = document.querySelector(".container");
const colEmptyHeight = new Array(12).fill(850);
var startBtn = document.querySelector(".startBtn");
var stopWatch = document.querySelector(".stopWatch");

// Function to ask player for name 
function greetingPlayer(){
    var greetingPhrase = document.querySelector("#greetingPhrase");
    var playerNickName = prompt(`Please enter a Nickname : 
(Nick must be between 3 to 8 characters)`);
    while (playerNickName == null || playerNickName.trim().length < 3 || playerNickName.trim().length > 8){
        playerNickName = prompt(`You must enter Nickname to be able to start the game : 
(Nick must be between 3 to 8 characters)`);
    };
    greetingPhrase.innerText = `Welcome ${playerNickName}`;
}

//Function to countdown 2 minutes
function CountDown(){
    var stopWatch = document.querySelector(".stopWatch");
    var seconds = 120;
    var timer = setInterval(() => {
        seconds -= 1 ;
        stopWatch.innerText = `${Math.floor(seconds/60)}:${seconds%60}`
        if (seconds == 0){
            clearInterval(timer)
        };
    }, 1000);
}

//Function to choose random image, style it, and position it
function CreateEmoji(emoji,imgNumber,left,container){
    emoji.src=`images/${imgNumber}.png`;
    emoji.classList.add("block");
    emoji.style.left = `${left}px`
    container.appendChild(emoji);
}

//Function to remove the emojis when 3 of the same type aligned vertically or horizontally and record score
function removeEmoji(left,top,score,emoji,positionIndex){
    var onLeft = [document.querySelector(`.block[style='left: ${left-50}px; top: ${top}px;']`),document.querySelector(`.block[style='left: ${left-100}px; top: ${top}px;']`)]
    var onRight = [document.querySelector(`.block[style='left: ${left+50}px; top: ${top}px;']`),document.querySelector(`.block[style='left: ${left+100}px; top: ${top}px;']`)]
    var under = document.querySelectorAll(`.block[style='left: ${left}px; top: ${top+50}px;'],[style='left: ${left}px; top: ${top+100}px;']`);
    var over;
    if(onLeft[0] != null && onRight[0] != null && emoji.src == onLeft[0].src && emoji.src == onRight[0].src){
        score.innerText = `${Number(score.innerText)+1}`
        emoji.remove()
        onLeft[0].remove()
        onRight[0].remove()
        colEmptyHeight[positionIndex-1] += 50;
        colEmptyHeight[positionIndex+1] += 50;
        colEmptyHeight[positionIndex] += 50;
        over = document.querySelectorAll(`.block[style^='left: ${left-50}px;'],[style^='left: ${left+50}px;']`);
        for (let i = 0; i < over.length;i++){
            over[i].style.top = `${parseInt(over[i].style.top) + 50}px`
        }
    }
    else if(onLeft[0] != null && onLeft[1] != null && emoji.src == onLeft[0].src && onLeft[0].src == onLeft[1].src){
        score.innerText = `${Number(score.innerText)+1}`;
        onLeft[0].remove();
        onLeft[1].remove();
        emoji.remove();
        colEmptyHeight[positionIndex-1] +=50;
        colEmptyHeight[positionIndex] +=50;
        colEmptyHeight[positionIndex-2] +=50;
        over = document.querySelectorAll(`.block[style^='left: ${left-50}px;'],[style^='left: ${left-100}px;']`);
        for (let i = 0; i < over.length;i++){
            over[i].style.top = `${parseInt(over[i].style.top) + 50}px`
        }
    }
    else if(onRight[0] != null && onRight[1] != null && emoji.src == onRight[0].src && onRight[0].src == onRight[1].src){
        score.innerText = `${Number(score.innerText)+1}`
        emoji.remove()
        onRight[0].remove()
        onRight[1].remove()
        colEmptyHeight[positionIndex] +=50;
        colEmptyHeight[positionIndex+1] +=50;
        colEmptyHeight[positionIndex+2] +=50;
        over = document.querySelectorAll(`.block[style^='left: ${left+50}px;'],[style^='left: ${left+100}px;']`);
        for (let i = 0; i < over.length;i++){
            over[i].style.top = `${parseInt(over[i].style.top) + 50}px`
        }
    }
    else if(under[0] != null && under[1] != null && emoji.src == under[0].src && under[0].src == under[1].src){
        score.innerText = `${Number(score.innerText)+1}`
        emoji.remove()
        under[0].remove()
        under[1].remove()
        colEmptyHeight[positionIndex] +=150;
    }
}

//Function to stop the game when reaching the end of the container
function GameOver(falling){
    for (let i = 0; i < colEmptyHeight.length; i++){
        if (colEmptyHeight[i] == -50){
            clearInterval(falling)
            alert("GameOver");
        }
    }
}

//Function to control emoji movement and fall
function EmojiMovement(){
    var positionIndex = Math.floor(Math.random() * 12) ;
    var left = positionIndex *50;
    var imgNumber = Math.ceil(Math.random() * 5);
    var score = document.querySelector(`#s${imgNumber}`);
    var emoji = document.createElement("img");
    var top = 0;

    CreateEmoji(emoji,imgNumber,left,container);    

    document.onkeydown = function(e){
        if (top < 850){
            if(e.code == "ArrowRight" && positionIndex < 11 && top < colEmptyHeight[positionIndex+1]){
                positionIndex += 1;
                left += 50
                emoji.style.left = `${left}px`
            }
            else if(e.code == "ArrowLeft" && positionIndex > 0 && top < colEmptyHeight[positionIndex-1]){
                positionIndex -= 1;
                left -= 50
                emoji.style.left = `${left}px`
            }
            else if (e.code == "ArrowDown"){
                top +=50
                emoji.style.top = `${top}p`;
            }
        }
    }

    falling = setInterval(() => {
        top += 1;
        if (top > colEmptyHeight[positionIndex]){
            top = colEmptyHeight[positionIndex]
            colEmptyHeight[positionIndex] -=50
            clearInterval(falling);
            
            removeEmoji(left,top,score,emoji,positionIndex)
            
            EmojiMovement()
        };
        emoji.style.top = `${top}px`;

        GameOver(falling);

        if(stopWatch.innerText == "0:0"){
            clearInterval(falling);
        }

    }, 1);

}


greetingPlayer()

//Start Button Event
startBtn.onclick = function () {
    startBtn.disabled = true;
    CountDown()
    EmojiMovement() 
} 

