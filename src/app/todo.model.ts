export interface TodoModel extends Document {
  id: string;
  name: string;
  deleted?: boolean;
}
