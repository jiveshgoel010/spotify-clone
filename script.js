const cards = document.querySelectorAll(".card");
const playBtns = document.querySelectorAll(".play-button");

cards.forEach((card, index) => {
    card.addEventListener("mouseover", () => {
        playBtns[index].style.opacity = '1';
        playBtns[index].style.bottom = '130px';
    });

    card.addEventListener("mouseleave", () => {
        playBtns[index].style.opacity = '0';
        playBtns[index].style.bottom = '90px';
    });
});



//Will be done using back-end
//This is a client side project
//Therefore we are using this approach

//Global var;
let currentSong = new Audio();

//Function to convert seconds into minutes
function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60); // Truncate to remove microseconds

    // Add leading zero if remainingSeconds is less than 10
    if (remainingSeconds < 10) {
        remainingSeconds = "0" + remainingSeconds;
    }

    return minutes + ":" + remainingSeconds;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3002/assets/songs/");
    let response = await a.text();
    // console.log(response);

    let div = document.createElement('div');
    div.innerHTML = response;
    let a_link = div.getElementsByTagName('a');

    let songs = [];
    for (let index = 0; index < a_link.length; index++) {
        const element = a_link[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }

    return songs;
}


//Functions to update the play and pause button of play-section
//Ids can be targeted directly and are global in scope
const playToPause = ()=>{
    play.src = '/assets/images/pause.svg';
}

const PauseToPlay = ()=>{
    play.src = '/assets/images/play.svg';
}


const playMusic = (audioTrack)=>{
    currentSong.src = ('/assets/songs/'+audioTrack);
    currentSong.play();
    document.querySelector('.song-info').innerHTML = audioTrack;
    document.querySelector('.song-time').innerHTML = `00:00 / 00.00`
}

async function main() {
    
    
    //Getting the list of songs
    let songs = await getSongs();
    console.log(songs);

    //Show all the songs in the library area
    let songUl = document.querySelector('.song-list').getElementsByTagName('ul')[0];
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + 
        `<li>
        <div class="info">
        <img src="assets/images/music.svg" alt="">
                <div>${song.replaceAll('%20', ' ')}</div>
            </div>
            <img class="list-play-btn" src="assets/images/play.svg" alt="">
        </li>`;
    }

    //Attach an event listener to each song
    let songArray = Array.from(document.querySelector('.song-list').getElementsByTagName('li'));
    songArray.forEach((e)=>{
        e.addEventListener('click', ()=>{
            let song = e.querySelector('.info').children[1].innerHTML;
            console.log(song);
            playMusic(song);
            playToPause();
        })
    })


    //Attach an event listener to play, prev and next
    document.getElementById('play').addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            playToPause();

        } else {
            currentSong.pause();
            PauseToPlay();
        }
    })

    //Listen for time update event
    currentSong.addEventListener("timeupdate",()=>{
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector('.song-time').innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
        document.querySelector('.circle').style.left = (currentSong.currentTime/currentSong.duration)*100 + '%';
    })

    //Add an event for seeking the seekbar and changing the song current time
    document.querySelector('.seekbar').addEventListener('click', (e)=>{
        //getBoundingClientRect() returns a DOM obj with info about size of an element
        let percentage = ((e.offsetX/e.target.getBoundingClientRect().width)*100).toFixed(2);
        document.querySelector('.circle').style.left = percentage + '%';
        currentSong.currentTime = (currentSong.duration*percentage)/100;
    })

}

main();