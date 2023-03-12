export default function objectNullRemover(obj: any) {
  for (const key in obj) {
    if (obj[key] === null) {
      obj[key] = '';
    } else if (typeof obj[key] === 'object') {
      objectNullRemover(obj[key]);
    }
  }
  //
  return obj;
}
