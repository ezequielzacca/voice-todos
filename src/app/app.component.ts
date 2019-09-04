import { Component, OnInit } from "@angular/core";
import { VoiceAPIService } from "./voice.service";
import { DialogflowService, IDialog } from "./dialogflow.service";
import { Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { TodosService } from "./todos.service";
import { first, take } from "rxjs/operators";
import { TodoModel } from "./todo.model";
import { nthify, nthifyes } from "./utils";

export enum Intents {
  AddTodo = "APP_ADD_TODO",
  ListTodos = "APP_LIST_TODOS",
  RemoveTodoByPosition = "APP_DELETE_TODO_BY_NUMER"
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  isListening$: Observable<"active" | "inactive">;
  isFirsttap: boolean = true;
  constructor(
    private voiceService: VoiceAPIService,
    private dialogflow: DialogflowService,
    private todosService: TodosService
  ) {}

  ngOnInit() {
    this.isListening$ = this.voiceService.isListening;
    this.voiceService.onSpeechRecognized.subscribe(text => {
      this.dialogflow.getIntent(text).subscribe(dialog => {
        this.resolveIntent(dialog);
      });
    });
  }

  toggleVoiceRecognition() {
    if (this.isFirsttap) {
      this.voiceService.createMessage("Hola amigo humano...");
      this.isFirsttap = false;
    }
    this.voiceService.startRecognizing();
  }

  resolveIntent(dialog: IDialog) {
    console.log("resolve intent called");
    switch (dialog.actionName) {
      case Intents.AddTodo: {
        this.todosService.add(<TodoModel>{
          name: dialog.data["TODO_NAME"]
        });
        this.voiceService.createMessage(
          `${dialog.response} ${
            dialog.data["TODO_NAME"]
          } fue añadido a tu listado.`
        );
        break;
      }
      case Intents.ListTodos: {
        this.listTodosByVoice(dialog.response);
        break;
      }
      case Intents.RemoveTodoByPosition: {
        this.todosService
          .list()
          .pipe(take(1))
          .subscribe(todos => {
            let position: number;
            if (dialog.data["TODO_NUMBER"]) {
              position = dialog.data["TODO_NUMBER"] - 1;
            }
            if (position || position == 0) {
              let todo = todos[position];
              console.log(todo);
              todo.deleted = true;
              this.todosService.update(todo);
              this.listTodosByVoice(
                `${dialog.response} Tu lista actualizada es: `
              );
            } else {
              this.voiceService.createMessage(
                "Lo siento. No entiendo que tarea debería borrar. ¿Te importaria repetirlo?"
              );
            }
          });

        break;
      }
      default: {
        console.log("is default");
        this.voiceService.createMessage(dialog.response);
      }
    }
  }

  private listTodosByVoice(prePhrahse?: string) {
    this.todosService
      .list()
      .pipe(take(1))
      .subscribe(
        todos => {
          console.log("todos: ", todos);
          if (todos.length > 1) {
            let text = `${prePhrahse ? prePhrahse : ""} `;
            todos.map((todo, index) => {
              text += `${nthifyes(index + 1)}: ${todo.name}. `;
            });
            this.voiceService.createMessage(text);
          } else if (todos.length == 1) {
            let text = `${
              prePhrahse ? prePhrahse : ""
            } tienes una sola tarea. ${todos[0].name}`;
            this.voiceService.createMessage(text);
          } else {
            this.voiceService.createMessage(
              "Por el momento, no tienes tareas."
            );
          }
        },
        err => {
          console.log(err);
        }
      );
  }
}
