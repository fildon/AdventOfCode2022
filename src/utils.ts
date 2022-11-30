export const getInputStrings = (filePath: string) =>
  Deno.readTextFileSync(filePath).split(/[\r\n]+/);
