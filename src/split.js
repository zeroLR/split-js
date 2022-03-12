// split the code with setting size, return an array with splited code
const split = (props) => {
  let size = 0;
  let chunkCount = 1;
  let chunkSize = props.chunkSize * 1000;
  let sourceFile = props.sourceFile;
  let splitedCode = [];
  let start = performance.now();

  console.log(`Split size: ${chunkSize}`);
  console.log("Start split...");

  // split code with setting size
  while (size < sourceFile.size) {
    size++;
    if (size === chunkSize * chunkCount) {
      let content = sourceFile.data.substring(
        chunkSize * (chunkCount - 1),
        chunkSize * chunkCount
      );
      splitedCode.push(content);
      chunkCount++;
    }
  }
  // after split will remain some code less than chunk size
  let remained = sourceFile.data.substring(
    chunkSize * (chunkCount - 1),
    sourceFile.size
  );
  splitedCode.push(remained);

  let end = (performance.now() - start) / 1000;
  console.log(`Split end, total files: ${chunkCount}, spend time: ${end}`);

  return splitedCode;
};

export default split;
