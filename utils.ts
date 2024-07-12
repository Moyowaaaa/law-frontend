import { getDownloadURL, getStorage, ref } from "firebase/storage";

// utils/dateUtils.ts
export function convertFirestoreTimestampToDate(timestamp: any): Date {
  if (timestamp && timestamp.seconds) {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  }
  return new Date(); // return current date if invalid timestamp
}

export const sentenceCase = (str: string) => {
  if (!str) return "";

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export function sentenceCaseEachWord(str: string) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const generateDownloadURL = async (filePath: string) => {
  const storage = getStorage();
  const fileRef = ref(storage, filePath);
  const url = await getDownloadURL(fileRef);
  return url;
};
