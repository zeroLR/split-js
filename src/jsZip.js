import { saveAs } from "file-saver";
import JSZip from "jszip";

var zip = new JSZip();

const jsZip = async (props) => {
  let outputFileName = props.outputFileName;
  let sourceFileName = props.sourceFileName;
  let codeArray = props.codeArray;
  let ext = props.ext;
  let start = performance.now();

  console.log("Zip proccessing...");

  if (!outputFileName) {
    outputFileName = `${Date.now()}_splitJS`;
  }

  // add each splited code to zip file
  codeArray.forEach((element, i) => {
    zip.file(`${i}_${sourceFileName}.${ext}`, element);
  });

  // generate zip file
  await zip.generateAsync({ type: "blob" }).then(function (content) {
    let end = (performance.now() - start) / 1000;
    saveAs(content, `${outputFileName}.zip`);
    console.log(`Zip done, spend time: ${end}`);
  });
};

export default jsZip;
