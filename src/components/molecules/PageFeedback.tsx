interface PageFeedbackProps {
  message: string;
  variant?: "loading" | "empty" | "error";
}

export default function PageFeedback({
  message,
  variant = "loading",
}: PageFeedbackProps) {
  const isError = variant === "error";

  return (
    <p
      role={isError ? "alert" : "status"}
      className={`rounded-xl border p-8 text-center text-sm shadow-sm ${
        isError
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-gray-200 bg-white text-gray-500"
      }`}
    >
      {message}
    </p>
  );
}
