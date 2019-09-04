import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";
declare var responsiveVoice: any;
@Injectable()
export class VoiceAPIService {
  private readonly VOICE_NAME = "Spanish Male";

  constructor() {}
  onSpeechRecognized: Subject<any> = new Subject<any>();
  isListening: BehaviorSubject<"active" | "inactive"> = new BehaviorSubject<
    "active" | "inactive"
  >("inactive");

  createMessage(message: string) {
    responsiveVoice.speak(message, this.VOICE_NAME);
  }

  startRecognizing() {
    //this._recognition.continuous = true;
    const recognition = new (<any>window).webkitSpeechRecognition();
    recognition.lang = "es-ES";
    recognition.onresult = event => {
      const speechToText = event.results[0][0].transcript;
      this.onSpeechRecognized.next(speechToText);
      console.log("REEECOOOGGGNIIIZZEEEDD");
      this.isListening.next("inactive");
    };

    /*this._recognition.onend = () => {
      this._recognition.start();
    };*/
    this.isListening.next("active");
    recognition.start();
  }
}
