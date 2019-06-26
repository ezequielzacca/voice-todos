import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit
} from "@angular/core";
import { VoiceAPIService } from "./voice.service";
import { DialogflowService } from "./dialogflow.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit {
  constructor(
    private voiceService: VoiceAPIService,
    private dialogflow: DialogflowService
  ) {}
  isListening: "active" | "inactive" = "inactive";
  ngAfterViewInit() {
    this.voiceService.isListening.subscribe(is => {
      console.log("listening: ", is);
      this.isListening = is;
    });
    this.voiceService.onVoiceReady.subscribe(() => {
      this.voiceService.onSpeechRecognized.subscribe(text => {
        this.dialogflow
          .getIntent(text)
          .subscribe(dialog =>
            this.voiceService.createMessage(dialog.result.fulfillment.speech)
          );
      });
    });
  }

  toggleVoiceRecognition() {
    this.voiceService.startRecognizing();
  }
}
