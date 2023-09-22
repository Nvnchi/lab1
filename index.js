import { HfInference } from "https://cdn.jsdelivr.net/npm/@huggingface/inference@2.6.1/+esm";

const HF_ACCESS_TOKEN = "";
const inference = new HfInference(HF_ACCESS_TOKEN);

const audio = new Audio('jay-z-ai.mp3');
audio.muted = true;

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

const commands = ["start", "stop"];
const grammar = `#JSGF V1.0; grammar commands; public <command> = ${commands.join(
  " | "
)};`;

document.querySelector("#loading").style.display = "none";

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = "nl-NL";
recognition.interimResults = false;

// Display a message to inform the user
const message = document.querySelector("#message");

document.querySelector("#loading").style.display = "none";

recognition.start();

recognition.onresult = function (event) {
  let recognizedSpeech = event.results[event.results.length - 1][0].transcript;

  if (recognizedSpeech === "") return;

  recognizedSpeech = recognizedSpeech.trim().toLowerCase();

  document.querySelector("#commando").innerHTML = recognizedSpeech;

  if (recognizedSpeech === "speel muziek") {
    // Unmute and play the audio when recognized
    audio.muted = false;
    audio.play();
    // Hide the message
    message.style.display = "none";
  }
};
