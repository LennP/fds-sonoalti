import yaml from "js-yaml";

/**
 * Converts a given object to a YAML string.
 * @param data - The object to convert to YAML.
 * @returns The YAML string representation of the object.
 */
export function toYAML<T>(data: T): string {
  try {
    return yaml.dump(data);
  } catch (error) {
    console.error("Error converting to YAML:", error);
    throw error;
  }
}

/**
 * Triggers a download of a file with the given content and filename.
 * @param content - The content of the file.
 * @param filename - The name of the file to be downloaded.
 */
export function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/yaml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  // Append to the DOM to make the click work in Firefox
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parses a YAML file and returns its content as an object of type T.
 * @param file - The YAML file to parse.
 * @returns A promise that resolves to the parsed object of type T.
 */
export async function parseYAMLFile<T>(file: File): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content !== "string") {
        reject(new Error("File content is not a string."));
        return;
      }

      try {
        const parsedData = yaml.load(content) as T;

        if (!parsedData) {
          reject(new Error("Parsed data is undefined."));
          return;
        }

        resolve(parsedData);
      } catch (error) {
        console.error("Error parsing YAML:", error);
        reject(new Error("Failed to parse YAML file."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading the file."));
    };

    reader.readAsText(file);
  });
}
