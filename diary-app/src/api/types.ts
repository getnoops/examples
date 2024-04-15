export interface Entry {
  id: string;
  text: string;
  createdAt: string;
}

export interface CreateEntryBody {
  text: string;
}

export interface CreateEntryResponse {
  id: string;
}
