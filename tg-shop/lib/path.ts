/**
 * Function to get the path from telegram startapp param
 * @param {string} startapp - The startapp param from telegram
 *
 * @returns {string} - path with url search params
 *
 * Currently, the only way to open specific page on the bot on start is to use the startapp param
 * The startapp param is a string that contains the path and the query params
 * The path is the first part of the string and the query params are the rest of the string
 * They are split by the __
 * On the left side, each path is split by single _
 * and on the right side, each query param is split by single _
 */

export function getPath(startapp: string): string {
  const [path, params] = startapp.split("__");
  const fullPath = path.split("_").join("/");
  if (params) {
    const searchParams = params.split("_").join("=");
    return `${fullPath}?${searchParams}`;
  }
  return fullPath;
}
