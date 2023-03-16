export default function removeDuplicateFunction<T>(array: T[]): T[] {
  var temp_array = Array.from(new Set(array)).filter((each_element) => {
    return (
      //@ts-ignore
      each_element != undefined && each_element != '' && each_element != null
    );
  });
  return temp_array;
}
