import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { TodoModel } from "./todo.model";
import { map } from "rxjs/operators";

@Injectable()
export class TodosService {
  constructor(private db: AngularFirestore) {}

  list(): Observable<Array<TodoModel>> {
    return this.db
      .collection<TodoModel>("todos")
      .valueChanges()
      .pipe(map(todos => todos.filter(todo => !todo.deleted)));
  }
  1;

  add(todo: TodoModel) {
    const id = this.db.createId();
    todo.id = id;
    return this.db
      .collection<TodoModel>("todos")
      .doc(id)
      .set(todo);
  }

  update(todo: TodoModel) {
    this.db.doc<TodoModel>("todos/" + todo.id).update(todo);
  }
}
