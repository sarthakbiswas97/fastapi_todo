export interface Todo {
  id: string;
  title: string;
  description: string | null;
  status: boolean;
}

export interface TodoCreate {
  title: string;
  description?: string | null;
  status: boolean;
}

export interface TodoUpdate {
  title?: string;
  description?: string | null;
  status?: boolean;
}