"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { FolderPlus,  ChevronLeft, ChevronRight, } from "lucide-react";
import { useRouter } from "next/navigation";

import { useCurrentUser } from "@/hooks/use-current-user";
import { ApiError, api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { HomeHeader } from "@/components/home/home-header";
export function CreateProjectForm() {
  const router = useRouter();
  const { user, isLoading, error: sessionError } = useCurrentUser();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    if (!isLoading && !user && !sessionError) {
      router.replace("/login?next=%2Fprojects%2Fnew");
    }
  }, [isLoading, user, sessionError, router]);

  const createMutation = useMutation({
    mutationFn: () =>
      api.projects.create({
        name: name.trim(),
        description: description.trim() || null,
      }),
    onSuccess: (project) => {
      router.push(`/projects/${project.id}`);
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && error.status === 422) {
        setFormError("Please check the project name and try again.");
        return;
      }

      if (error instanceof ApiError && error.status === 401) {
        router.replace("/login?next=%2Fprojects%2Fnew");
        return;
      }

      setFormError(
        error instanceof ApiError
          ? error.message
          : "Unable to reach Metis. Please try again.",
      );
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setFormError("Give your project a name before continuing.");
      return;
    }

    createMutation.mutate();
  }

  if (isLoading || (!user && !sessionError)) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#F7E1CB] px-6">
        <p className="text-sm text-[#724e2a]" aria-live="polite">
          Preparing your workspace…
        </p>
      </main>
    );
  }

  if (sessionError) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#F7E1CB] px-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-[#472401]">
            We couldn't verify your session
          </h1>

          <p className="mt-2 text-sm text-[#724e2a]">
            Check your connection and try again.
          </p>

          <Button
            className="mt-5 bg-[#472401] text-[#F7E1CB] hover:bg-[#724e2a]"
            onClick={() => router.refresh()}
          >
            Try again
          </Button>
        </div>
      </main>
    );
  }
    

    const introSlides = [
    {
        eyebrow: "Your workspace starts here",
        title: "Create a project",
        description:
        "Give your work a name. Bring in your dataset and shape your machine learning pipeline when you're ready.",
        number: "01",
    },
    {
        eyebrow: "Start with your data",
        title: "Every model begins with a dataset.",
        description:
        "Bring your tabular data into Metis. Inspect its structure, understand its columns, and prepare it for the work ahead.",
        number: "02",
    },
    {
        eyebrow: "Build with intention",
        title: "From raw data to ready models.",
        description:
        "Move through ingestion, data preparation, and model training in a workspace designed to make each step clear.",
        number: "03",
    },
    {
        eyebrow: "Your work, organized",
        title: "One workspace. A clear direction.",
        description:
        "Keep your experiments, datasets, and modelling workflow connected to a project you can return to as your work evolves.",
        number: "04",
    },
    ];
  return (
    <main className="min-h-dvh overflow-y-auto bg-[#F7E1CB] text-[#472401]">
        <HomeHeader />
    <section className="mx-auto flex h-[calc(100dvh-5rem)] w-full max-w-[1440px] min-h-0 flex-col px-5 pb-5 sm:px-8 lg:px-10">
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-8">

        {/* LEFT: Intro carousel — 5/12 */}
        <div className="relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#724e2a]/15 bg-[#F4CAA0]/35 p-6 sm:p-8 lg:col-span-5 lg:p-10">

        <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#724e2a]">
            METIS / PROJECTS
            </span>

            <span className="text-sm tabular-nums text-[#724e2a]/70">
            {String(activeSlide + 1).padStart(2, "0")} / {String(introSlides.length).padStart(2, "0")}
            </span>
        </div>

        <div className="my-auto py-10" aria-live="polite">
            <div className="mb-8 flex size-12 items-center justify-center rounded-xl bg-[#F4CAA0]">
            <FolderPlus size={24} strokeWidth={1.7} />
            </div>

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#724e2a]">
            {introSlides[activeSlide].eyebrow}
            </p>

            <h1
            key={activeSlide}
            className="max-w-lg text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
            >
            {introSlides[activeSlide].title}
            </h1>

            <p
            key={`description-${activeSlide}`}
            className="mt-5 max-w-md text-base leading-7 text-[#724e2a]"
            >
            {introSlides[activeSlide].description}
            </p>
        </div>

        <div className="border-t border-[#724e2a]/15 pt-5">
            <div className="mb-5 flex items-center gap-2">
            {introSlides.map((slide, index) => (
                <button
                key={slide.number}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`Show slide ${index + 1}: ${slide.eyebrow}`}
                aria-current={activeSlide === index ? "step" : undefined}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeSlide === index
                    ? "w-9 bg-[#472401]"
                    : "w-3 bg-[#724e2a]/25 hover:bg-[#724e2a]/50"
                }`}
                />
            ))}
            </div>

            <div className="flex items-center justify-between">
            <p className="text-xs text-[#724e2a]">
                Intelligence, Forged from Data.
            </p>

            <div className="flex gap-2">
                <button
                type="button"
                onClick={() =>
                    setActiveSlide((activeSlide - 1 + introSlides.length) % introSlides.length)
                }
                aria-label="Previous slide"
                className="flex size-10 items-center justify-center rounded-full border border-[#724e2a]/20 transition hover:bg-[#F4CAA0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#472401]"
                >
                <ChevronLeft size={18} />
                </button>

                <button
                type="button"
                onClick={() =>
                    setActiveSlide((activeSlide + 1) % introSlides.length)
                }
                aria-label="Next slide"
                className="flex size-10 items-center justify-center rounded-full border border-[#724e2a]/20 transition hover:bg-[#F4CAA0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#472401]"
                >
                <ChevronRight size={18} />
                </button>
            </div>
            </div>
        </div>
        </div>

        {/* RIGHT: Project form — 7/12 */}
        <div className="hide-scrollbar flex min-h-0 flex-col overflow-y-auto rounded-2xl border border-[#724e2a]/15 bg-white/25 p-6 sm:p-8 lg:col-span-7 lg:justify-center lg:p-10">

        <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#724e2a]">
            NEW WORKSPACE
            </p>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Project details
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-[#724e2a]">
            Start with the essentials. You can configure your dataset and
            machine learning workflow in the next steps.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">

        {/* Project name */}
          <div className="space-y-2">
            <label
              htmlFor="project-name"
              className="block text-sm font-semibold"
            >
              Project name <span aria-hidden="true">*</span>
            </label>

            <input
              id="project-name"
              name="name"
              type="text"
              required
              autoFocus
              maxLength={120}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Customer Churn Prediction"
              className="w-full rounded-lg border border-[#724e2a]/30 bg-white/65 px-4 py-3 text-[#472401] outline-none transition placeholder:text-[#724e2a]/55 focus:border-[#724e2a] focus:ring-2 focus:ring-[#724e2a]/15"
              aria-describedby="project-name-help"
            />

            <p id="project-name-help" className="text-xs text-[#724e2a]">
              Choose a clear name you can recognize later.
            </p>
          </div>


        

        {/* Project description */}
          <div className="mt-6 space-y-2">
            <label
              htmlFor="project-description"
              className="block text-sm font-semibold"
            >
              Description{" "}
              <span className="font-normal text-[#724e2a]">
                (optional)
              </span>
            </label>

            <textarea
              id="project-description"
              name="description"
              rows={4}
              maxLength={5000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What are you trying to understand or predict?"
              className="w-full resize-y rounded-lg border border-[#724e2a]/30 bg-white/65 px-4 py-3 text-[#472401] outline-none transition placeholder:text-[#724e2a]/55 focus:border-[#724e2a] focus:ring-2 focus:ring-[#724e2a]/15"
            />

            <p className="text-xs text-[#724e2a]">
              You can add more context as your pipeline takes shape.
            </p>
          </div>

        {/* Form error */}
        {formError && (
            <p
              role="alert"
              className="mt-5 rounded-lg border border-red-800/20 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {formError}
            </p>
          )}

            <div className="mt-8 flex flex-col gap-4 border-t border-[#724e2a]/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-[#724e2a]">
                You can add a dataset later.
            </p>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <Button
                type="button"
                variant="outline"
                disabled={createMutation.isPending}
                onClick={() => router.push("/")}
                className="h-11 border-[#724e2a]/30 bg-transparent px-5 text-[#472401] hover:bg-[#F4CAA0]"
                >
                Cancel
                </Button>

                <Button
                type="submit"
                disabled={createMutation.isPending || !name.trim()}
                className="h-11 bg-[#472401] px-5 text-[#F7E1CB] hover:bg-[#724e2a]"
                >
                {createMutation.isPending
                    ? "Creating project…"
                    : "Create project"}
                </Button>
            </div>
            </div>
        </form>
        </div>

    </div>
    </section>
    </main>
  );
}
