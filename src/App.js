import React, { useState, useEffect } from "react";
import {
  Container,
  Header,
  Content,
  Footer,
  Steps,
  Panel,
  ButtonGroup,
  Button,
  Stack,
  Input,
  InputGroup,
  InputNumber,
  Modal,
  Toggle,
} from "rsuite";
import split from "./split";
import jsZip from "./jsZip";

import "rsuite/dist/rsuite.min.css";
import "./App.css";

const App = () => {
  const [step, setStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [sourceFile, setSourceFile] = useState({});
  const [chunkSize, setChunkSize] = useState(1);
  const [splitCount, setSplitCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState({});
  const [backdrop, setBackdrop] = useState("true");
  const [callBackOnClose, setCallBackOnClose] = useState(undefined);
  const [btnLoading, setBtnLoading] = useState(false);

  // Start export zipped file
  const exportZippedFile = () => {
    setModalMsg({ title: "Export", body: fileNameBlock });
    handleOpen();
    setCallBackOnClose(() => () => {
      setBtnLoading(true);
      setBackdrop("static");
      let props = {
        chunkSize: chunkSize,
        sourceFile: sourceFile,
      };
      let codeArray = split(props);
      props = {
        sourceFileName: sourceFile.name,
        outputFileName: document.getElementById("input_fileName").value,
        codeArray: codeArray,
        ext: sourceFile.ext,
        load: setBtnLoading,
      };
      jsZip(props).then(() => {
        setSourceFile({ name: "", ext: "", data: "", size: null });
        setBtnLoading(false);
        setCallBackOnClose(undefined);
        setBackdrop("true");
        setOpen(false);
        setStep(0);
      });
    });
  };

  // input number
  const handleMinus = () => {
    if (chunkSize <= 1) return;
    setChunkSize(parseInt(chunkSize, 10) - 1);
  };
  const handlePlus = () => {
    if (chunkSize >= 15) return;
    setChunkSize(parseInt(chunkSize, 10) + 1);
  };

  // on step change
  const onChange = (nextStep) => {
    setStep(nextStep < 0 ? 0 : nextStep > 2 ? 2 : nextStep);
  };
  const onNext = () => {
    if (!sourceFile.data) {
      setModalMsg({
        title: "Warning",
        body: "required a file ! (html,js,css,json)",
      });
      handleOpen();
      return;
    }
    setSplitCount(Math.floor(sourceFile.size / (chunkSize * 1000)));
    onChange(step + 1);
    if (step === 2) {
      exportZippedFile();
    }
  };
  const onPrevious = () => onChange(step - 1);

  // modal window
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setCallBackOnClose(undefined);
  };
  const handleOk = () => {
    if (typeof callBackOnClose === "function") {
      callBackOnClose();
    }
  };

  // on file uploaded
  const onFileUpload = () => {
    let size = document.getElementById("upload_file").files[0].size;
    if (size > 2000000) {
      setModalMsg({
        title: "Warning",
        body: "File size must less than 2MB.",
      });
      handleOpen();

      return;
    }
    document
      .getElementById("upload_file")
      .files[0].text()
      .then((d) => {
        // console.log(document.getElementById("upload_file").files[0]);
        let file = document.getElementById("upload_file").files[0];
        let ext = file.name.split(".").splice(-1);
        let name = file.name.split(`.${ext}`)[0];
        setSourceFile({
          name: name,
          ext: ext,
          data: d,
          size: file.size,
        });
      });
  };

  // upload file block
  const uploadFileBlock = (
    <div>
      Upload single static file (html,js,css,json), max size less than 2MB.
      <br />
      <br />
      <input
        id="upload_file"
        multiple
        type={"file"}
        accept="text/html, text/javascript, application/json, text/css"
        onChange={onFileUpload}
      ></input>
      {`File size: ${sourceFile.size}`}
      <Input
        as="textarea"
        row={3}
        placeholder="Show your file content"
        disabled
        className="mt-8 mb-4"
        style={{
          backgroundColor: "#3f3f3f",
          color: "rgb(74 222 128)",
          resize: "none",
          height: "15rem",
        }}
        value={sourceFile.data}
      />
    </div>
  );

  // set file size block
  const chunkSizeBlock = (
    <div>
      Input the size you want to split with(KB).
      <hr />
      You will get
      <span className=" text-xl text-orange-600"> {splitCount + 1} </span>{" "}
      splited file.
      <hr />
      <div className="w-1/4 min-w-max m-auto">
        <Stack spacing={8} direction={isMobile ? "column" : "row"}>
          <InputGroup>
            <InputGroup.Button onClick={handleMinus}>-</InputGroup.Button>
            <InputNumber
              className={"custom-input-number"}
              value={chunkSize}
              onChange={setChunkSize}
              max={15}
              min={1}
              defaultValue={chunkSize}
            />
            <InputGroup.Button onClick={handlePlus}>+</InputGroup.Button>
          </InputGroup>
          <Button appearance="primary" onClick={onNext}>
            OK
          </Button>
        </Stack>
      </div>
    </div>
  );

  // output file name setting
  const fileNameBlock = (
    <div>
      <Stack justifyContent="center" spacing={8}>
        <div>Named file:</div>
        <Input
          id={"input_fileName"}
          placeholder="file name"
          defaultValue={sourceFile.name}
        />
      </Stack>
    </div>
  );

  // download block
  const downloadFileBlock = (
    <div>
      Download the zipped file !
      <hr />
      <Stack spacing={8}>
        Gzip:
        <Toggle
          checkedChildren="Enable"
          unCheckedChildren="Disable"
          onClick={() => {
            setModalMsg({
              title: "Sorry",
              body: "This feature still working...",
            });
            handleOpen();
          }}
          disabled
        />
      </Stack>
      <Button
        color="yellow"
        appearance="primary"
        className="mt-4"
        onClick={exportZippedFile}
      >
        Download
      </Button>
    </div>
  );

  // show different node when step change
  const stepNode = (step) => {
    switch (step) {
      case 0:
        return uploadFileBlock;
      case 1:
        return chunkSizeBlock;
      case 2:
        return downloadFileBlock;
      default:
        break;
    }
  };

  // refresh ui style when in mobile
  useEffect(() => {
    console.log(window.innerWidth);
    if (window.innerWidth < 750) {
      setIsMobile(true);
    }
  }, []);

  // refresh number of output files when change split size
  useEffect(() => {
    setSplitCount(Math.floor(sourceFile.size / (chunkSize * 1000)));
  }, [chunkSize]);

  return (
    <div className="h-screen">
      <Container>
        <Header>
          <h1 className="bg-zinc-600 w-36 rounded-xl  p-1 shadow-md m-auto mt-8 text-center text-3xl font-bold ">
            <span className=" text-sky-300">Split</span>{" "}
            <sapn className=" text-yellow-300">JS</sapn>
          </h1>
        </Header>
        <Content className="w-2/3 m-auto mt-12">
          <Steps current={step} vertical={isMobile} className=" m-auto">
            <Steps.Item title="Upload" description="Upload static file" />
            <Steps.Item title="Size" description="Each file size" />
            <Steps.Item title="Download" description="Download zipped file!" />
          </Steps>
          <hr />
          <ButtonGroup>
            <Button onClick={onPrevious} disabled={step === 0}>
              Previous
            </Button>
            <Button onClick={onNext} disabled={step === 3}>
              Next
            </Button>
          </ButtonGroup>
          <Panel bordered header={`Step: ${step + 1}`} className="mt-8">
            {stepNode(step)}
          </Panel>
        </Content>
        <Modal open={open} onClose={handleClose} backdrop={backdrop}>
          <Modal.Header>
            <Modal.Title>{modalMsg.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMsg.body}</Modal.Body>
          <Modal.Footer>
            <Button
              onClick={handleOk}
              appearance="primary"
              loading={btnLoading}
            >
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
        <Footer></Footer>
      </Container>
    </div>
  );
};

export default App;
