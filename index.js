// Create an audio player with reduced volume
const audioPlayer = new Audio();
audioPlayer.muted = true;
audioPlayer.volume = 0.1;

// Initialize speech recognition for voice commands
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

// Define music genres for voice recognition
const genres = ["cringe", "grinch", "k-pop", "lofi", "metal", "rap", "rock", "mainstream"];

// Set up grammar for recognizing genres
const grammar = `#JSGF V1.0; grammar genres; public <genre> = ${genres.join(
  " | "
)};`;

// Initialize variables to manage music playback
let currentGenre = null;
let currentSongIndex = -1;

// Function to play a random song within the selected genre
function playRandomSong() {
  if (currentGenre !== null) {
    const audioFolderPath = `music/${currentGenre}/`;
    const songs = [
      "song0.mp3",
      "song1.mp3",
      "song2.mp3",
      "song3.mp3",
      "song4.mp3",
    ];

    // Generate a random index for song selection
    const randomIndex = Math.floor(Math.random() * songs.length);

    // Ensure the next song is not the same as the current one
    currentSongIndex = (randomIndex === currentSongIndex) ? (randomIndex + 1) % songs.length : randomIndex;
  
    // Set the audio source to the selected song and play it
    audioPlayer.src = audioFolderPath + songs[currentSongIndex];
    audioPlayer.muted = false;
    audioPlayer.play();
  }
}

// Hide loading elements and configure speech recognition
document.querySelector("#loading").style.display = "none";

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = "nl-NL";
recognition.interimResults = false;

// Add an event listener to hide the overlay when the button is clicked
document.getElementById('enterButton').addEventListener('click', function () {
  document.getElementById('overlay').style.display = 'none';
});

// Start listening for voice commands
recognition.start();

// Handle voice recognition results
recognition.onresult = function (event) {
  let recognizedSpeech = event.results[event.results.length - 1][0].transcript;

  if (recognizedSpeech === "") return;

  recognizedSpeech = recognizedSpeech.trim().toLowerCase();

  // Display recognized speech in the UI
  document.querySelector("#commando").innerHTML = recognizedSpeech;

  // Log recognized speech to the console
  console.log("Recognized Speech:", recognizedSpeech);

  // Check if the recognized speech matches a music genre
  if (genres.includes(recognizedSpeech)) {
    // If a genre is recognized, select it and reset the song index
    currentGenre = recognizedSpeech;
    currentSongIndex = -1;

    // Play a random song within the selected genre
    playRandomSong();
  } 
};
