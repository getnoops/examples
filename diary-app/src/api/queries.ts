import { UseMutationOptions, useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CreateEntryBody, Entry } from "./types";

export const useCreateEntryMutation = (
  options?: UseMutationOptions<void, AxiosError, CreateEntryBody, unknown>
) =>
  useMutation({
    mutationKey: ["createEntry"],
    mutationFn: async (body: CreateEntryBody) =>
      (await axios.post<void>("/api/entry", body)).data,
      ...options,
  });

export const useGetEntriesQuery = () =>
  useQuery<Entry[], AxiosError>({
    queryKey: ["getEntries"],
    queryFn: async () => (await axios.get("/api/entries")).data,
  });
