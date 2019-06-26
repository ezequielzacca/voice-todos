import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

export interface IDialogFlowIntentResponse {
  result: {
    action: string;
    fulfillment: {
      speech: string;
    };
  };
}

@Injectable({
  providedIn: "root"
})
export class DialogflowService {
  private baseURL: string = "https://api.dialogflow.com/v1/query?v=20150910";
  private token: string = "11ec9606472246ee92465401793a907b";

  private _sessionId = Math.floor(Math.random() * 999999);
  constructor(private http: HttpClient) {}

  public getIntent(query: string): Observable<IDialogFlowIntentResponse> {
    let data = {
      query: query,
      lang: "en",
      sessionId: this._sessionId.toString()
    };

    return this.http
      .post(`${this.baseURL}`, data, {
        headers: this.getHeaders()
      })
      .pipe(
        tap(console.log),
        map(res => <IDialogFlowIntentResponse>res)
      );
  }

  public getHeaders() {
    let headers = new HttpHeaders();
    headers = headers.set("Authorization", `Bearer ${this.token}`);
    return headers;
  }
}
