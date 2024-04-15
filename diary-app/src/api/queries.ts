import {
  UseMutationOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CreateEntryBody, CreateEntryResponse, Entry } from "./types";

const client = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
});

export const useCreateEntryMutation = (
  options?: UseMutationOptions<
    CreateEntryResponse,
    AxiosError,
    CreateEntryBody,
    unknown
  >,
) =>
  useMutation({
    mutationKey: ["createEntry"],
    mutationFn: async (body: CreateEntryBody) =>
      (await client.post("/entry", body)).data,
    ...options,
  });

export const useGetEntriesQuery = () =>
  useQuery<Entry[], AxiosError>({
    queryKey: ["getEntries"],
    queryFn: async () => (await client.get("/entries")).data,
  });
