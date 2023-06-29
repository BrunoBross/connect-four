export type backgroundColors =
  | "bg-background-0"
  | "bg-background-1"
  | "bg-pink"
  | "bg-yellow"
  | "bg-white";

export async function copyTextToClipboard(text: string) {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}
