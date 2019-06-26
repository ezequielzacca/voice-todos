import { Injectable } from "@angular/core";
import { ReplaySubject, Observable, Subject, BehaviorSubject } from "rxjs";
import { take } from "rxjs/operators";
declare var window: any;
window.SpeechRecognition =
  window.webkitSpeechRecognition || window.SpeechRecognition;
@Injectable()
export class VoiceAPIService {
  private readonly VOICE_NAME = "Google UK English Male";
  private _voice: SpeechSynthesisVoice;

  constructor() {
    if ("SpeechRecognition" in window) {
      console.log("recognition supported");
    } else {
      console.log("speech recognition is not supported");
    }
    this.init();
  }
  private _onVoiceReady: ReplaySubject<any> = new ReplaySubject<any>();
  onSpeechRecognized: Subject<any> = new Subject<any>();
  isListening: Subject<"active" | "inactive"> = new BehaviorSubject<
    "active" | "inactive"
  >("inactive");

  init(): void {
    speechSynthesis.onvoiceschanged = () => {
      console.log(speechSynthesis.getVoices());
      this._voice = speechSynthesis.getVoices().find(voice => {
        return voice.name == "Google UK English Male";
      });
      this._onVoiceReady.next();
    };
  }

  onVoiceReady: Observable<any> = this._onVoiceReady.pipe(take(1));

  createMessage(message: string) {
    var msg = new SpeechSynthesisUtterance(message);
    msg.voice = this._voice;
    speechSynthesis.speak(msg);
  }

  startRecognizing() {
    //this._recognition.continuous = true;
    const recognition = new window.SpeechRecognition();
    recognition.onresult = event => {
      const speechToText = event.results[0][0].transcript;
      console.log("transcript is: ", speechToText);
      console.log("next is: ", speechToText);
      this.onSpeechRecognized.next(speechToText);
      this.isListening.next("inactive");
    };

    /*this._recognition.onend = () => {
      this._recognition.start();
    };*/
    this.isListening.next("active");
    recognition.start();
  }
}
