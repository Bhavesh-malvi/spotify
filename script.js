$(document).ready(function() {
    $(".right-box").scroll(function() {
        var scroll = $(".right-box").scrollTop();

        if (scroll >= 110) {
            $(".nav-box").addClass("nav-scroll");
        } else {
            $(".nav-box").removeClass("nav-scroll");
        }
    });
});


const Bigbox = document.querySelector(".big-box"),
MusicImg = Bigbox.querySelector(".info-img img"),
musicName = Bigbox.querySelector(".song-detail .name"),
musicArtist = Bigbox.querySelector(".song-detail .artist"),
mainAudio = Bigbox.querySelector("#main-audio"),
playpouseBtn = Bigbox.querySelector(".play-pause"),
nextBtn = Bigbox.querySelector("#next"),
prevBtn = Bigbox.querySelector("#prev"),
progressArea = Bigbox.querySelector(".progress-area"),
progressBar = Bigbox.querySelector(".progress-bar"),
musicList = Bigbox.querySelector(".containt");


let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;

window.addEventListener("load", ()=>{
    loadMusic(musicIndex);
    playingSong();
})

function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    MusicImg.src = `img/${allMusic[indexNumb - 1].img}.png`;
    mainAudio.src = `song/${allMusic[indexNumb - 1].src}.mp3`;
}

function playMusic(){
    Bigbox.classList.add("paused");
    playpouseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}


function pauseMusic(){
    Bigbox.classList.remove("paused");
    playpouseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

function nextMusic(){
    musicIndex++;

    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

function prevMusic() {
    musicIndex--;

    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

playpouseBtn.addEventListener("click", () => {
    const isMusicPaused = Bigbox.classList.contains("paused");

    isMusicPaused ? pauseMusic() : playMusic();

});

nextBtn.addEventListener("click", () =>{
    nextMusic();
});

prevBtn.addEventListener("click", () =>{
    prevMusic();
});


mainAudio.addEventListener("timeupdate", (e) =>{
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = Bigbox.querySelector(".current-time"),
        musicDuration = Bigbox.querySelector(".max-duration");
    mainAudio.addEventListener("loadeddata", () => {

        let mainAdDuration = mainAudio.duration;
        let totalMin = Math.floor(mainAdDuration / 60);
        let totalSec = Math.floor(mainAdDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }

        musicDuration.innerText = `${totalMin}:${totalSec}`;

    });

    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }

    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;

});


progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth;
    let clickedOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic();

});


const repeatBtn = Bigbox.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "playback shuffled");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "playlist looped");
            break;

    }

});


mainAudio.addEventListener("ended", () =>{
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "suffle":
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }
            while (musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            playingSong();
            break;
    }
});



const allSong = Bigbox.querySelector(".row");


for (let i = 0; i < allMusic.length; i++) {
    let colTag = `<div class="col-md-2 c" col-index="${i + 1}">
        <div class="containt-card" style="height: 290px;">
            <div class="c-card-img1">
                <img class="${allMusic[i].src} " src="img/${allMusic[i].img}.png" width="100%" height="100%" alt="">
                <audio class="${allMusic[i].src}" src="song/${allMusic[i].src}.mp3"></audio>
                <div class="play-button">
                    <i class="material-icons audio-duration">play_arrow</i>
                </div>
            </div>
            <h6>${allMusic[i].name}</h6>
            <p style="font-size: 14px;">${allMusic[i].artist}</p>
        </div>
    </div>`;

    allSong.insertAdjacentHTML("beforeend", colTag);

    // let colAudioDuration = allSong.querySelector(`#${allMusic[i].src}`);
    // let colAudioTag = allSong.querySelector(`.${allMusic[i].src}`);

}


const allcolTag = allSong.querySelectorAll(".c");
function playingSong() {
    for (let j = 0; j < allcolTag.length; j++) {
        let audioTag = allcolTag[j].querySelector(".audio-duration");

        if(allcolTag[j].classList.contains("paused")){
            allcolTag[j].classList.remove("pause");

            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }


        if(allcolTag[j].getAttribute("col-index") == musicIndex){
            allcolTag[j].classList.add("pause");
            audioTag.innerText = "pause";
        }

        else{
            allcolTag[j].classList.remove("pause");
            audioTag.innerText = "play_arrow";
        }

        allcolTag[j].setAttribute("onclick", "clicked(this)");
    }


}

function clicked(element){
    
    let getColIndex = element.getAttribute("col-index");
    musicIndex = getColIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();

}



const volumeRange = document.getElementById('volume-range');

        function setVolume(volume) {
            mainAudio.volume = volume;
        }

        function changeVolume(delta) {
            let currentVolume = parseFloat(volumeRange.value);
            let newVolume = currentVolume + delta;

            // Ensure the new volume is within the valid range (0 to 1)
            newVolume = Math.max(0, Math.min(1, newVolume));

            volumeRange.value = newVolume;
            setVolume(newVolume);
        }