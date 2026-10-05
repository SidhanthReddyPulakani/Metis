// components/home/dataset-entry.tsx

export function DatasetEntry() {
  return (
    <div>
      <input
        type="text"
        placeholder="Upload your Dataset or URL"
      />

      <button type="button" aria-label="Upload dataset">
        {/* upload icon */}
      </button>
    </div>
  );
}