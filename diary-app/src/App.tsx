import { DocumentIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { useCreateEntryMutation, useGetEntriesQuery } from "./api/queries";
import Pencil from "./components/Pencil";
import WriteText from "./components/WriteText";
import { cn, formatTimestamp } from "./lib/utils";

interface FormInputs {
  text: string;
}

const schema = yup
  .object({
    text: yup
      .string()
      .required("Text is required")
      .max(300, "max 300 characters"),
  })
  .required();

const App = () => {
  const [animationText, setAnimationText] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
  });

  const textRegister = register("text");

  const formTextError = errors.text?.message;

  const {
    data: entries,
    error: getEntriesQueryError,
  } = useGetEntriesQuery();

  const {
    mutate: createEntryMutation,
    error: createEntryMutationError,
    reset: resetCreateEntryMutation,
  } = useCreateEntryMutation({
    onSettled: () => {},
  });

  const onSubmit: SubmitHandler<FormInputs> = (formData) => {
    reset();
    setAnimationText(formData.text);
    createEntryMutation({ text: formData.text });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-8">
      <div className="mx-auto w-full max-w-6xl space-y-4 px-4 text-slate-700">
        <div className="flex items-end justify-between">
          <h1 className="text-xl font-medium">Dear Diary...</h1>

          <h2 className="text-lg  tracking-wide text-slate-700">
            {format(new Date(), "do MMMM yyyy")}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <textarea
            {...textRegister}
            onChange={(e) => {
              if (createEntryMutationError) {
                resetCreateEntryMutation();
              }

              textRegister.onChange(e);
            }}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink= 'http://www.w3.org/1999/xlink' height='28' width='20' stroke='%23d9f0ff' stroke-width='2' %3E%3Cline x1='0' y1='7' x2='20' y2='7' /%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundAttachment: "local",
            }}
            rows={6}
            className={cn(
              "relative block w-full rounded-md border-slate-300 bg-white leading-7 shadow-sm transition focus:border-indigo-500 focus:ring-indigo-500",
              formTextError && "border-2 border-red-700",
            )}
          />

          <div className="mt-2 mb-8 flex justify-between">
            <p className="font-medium text-red-700">
              {createEntryMutationError?.message || formTextError}
            </p>

            <button
              className="inline-flex items-center gap-x-2 rounded-md bg-amber-500 px-3 py-1 font-medium text-white transition hover:bg-amber-600 hover:text-slate-100"
              type="submit"
            >
              <div className="size-6 flex items-center justify-center rounded border border-white">
                {animationText === "" && (
                  <motion.div
                    className="pointer-events-none"
                    animate={{
                      top: 0,
                    }}
                    style={{
                      transformOrigin: "bottom left",
                    }}
                    layoutId="pencil"
                  >
                    <Pencil className="size-4 text-white" />
                  </motion.div>
                )}
              </div>

              <span>Write</span>
            </button>
          </div>
        </form>

        {/* This div is referenced in `WriteText.tsx` */}
        <div className="relative -z-10  w-full">
          <div className="absolute w-fit max-w-full">
            <span
              id="example_text"
              className="m-4 block break-words bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text leading-7 text-transparent"
            />
          </div>
        </div>

        {animationText !== "" && (
          <div
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' height='28' width='20' stroke='%23d9f0ff' stroke-width='2' %3E%3Cline x1='0' x2='20' y1='11' y2='11' /%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundAttachment: "local",
            }}
            className="my-4 rounded-md bg-white p-4 shadow-md"
          >
            <div className="flex justify-between">
              <h1 className="text-lg font-medium">Dear Diary...</h1>
              <h1 className="">{new Date().toLocaleDateString()}</h1>
            </div>

            <WriteText
              text={animationText}
              onAnimationComplete={() => setAnimationText("")}
            />
          </div>
        )}

        <div className="space-y-4">
          <h1 className="text-xl font-medium">Pages</h1>

          {getEntriesQueryError ? (
            <div className="w-full rounded-lg border-2 border-dashed border-slate-300 p-12 text-center text-red-500 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <XMarkIcon className="size-12 mx-auto" />
              <span className="mt-2 block text-sm font-semibold">
                Unable to fetch diary entries
              </span>

              <span>{getEntriesQueryError.message}</span>
            </div>
          ) : (
            !entries?.length && (
              <div className="relative block w-full rounded-lg border-2 border-dashed border-slate-300 p-12 text-center hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <DocumentIcon className="mx-auto h-12 w-12 text-slate-400" />
                <span className="mt-2 block text-sm font-semibold text-slate-600">
                  No pages yet <br />
                  Write your first page above
                </span>
              </div>
            )
          )}

          <div className="grid grid-cols-3 gap-4">
            <AnimatePresence>
              {entries?.length &&
                entries.map((entry) => (
                  <motion.div
                    key={entry.ts}
                    layoutId={"page_" + entry.ts}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5 },
                    }}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' height='28' width='20' stroke='%23d9f0ff' stroke-width='2' %3E%3Cline x1='0' x2='20' y1='11' y2='11' /%3E%3C/svg%3E")`,
                      backgroundRepeat: "repeat",
                      backgroundAttachment: "local",
                    }}
                    className="relative space-y-2 overflow-hidden rounded-md border border-slate-200 bg-white p-4 shadow-md"
                  >
                    <div className="relative">
                      <div className="flex items-end justify-between">
                        <p className="font-medium">Dear Diary...</p>
                        <p className="text-sm text-slate-600">
                          {formatTimestamp(entry.dateTime)}
                        </p>
                      </div>

                      <p className="pt-7 leading-7">{entry.text}</p>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
