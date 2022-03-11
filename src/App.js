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
  Divider,
  Input,
  InputGroup,
  InputNumber,
  Modal,
  Toggle,
} from "rsuite";

import "rsuite/dist/rsuite.min.css";
import "./App.css";

const App = () => {
  const [step, setStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [sourceData, setSourceData] = useState({});
  const [fileSize, setFileSize] = useState(1);
  const [splitCount, setSplitCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState({});

  // input number
  const handleMinus = () => {
    if (fileSize <= 1) return;
    setFileSize(parseInt(fileSize, 10) - 1);
  };
  const handlePlus = () => {
    if (fileSize >= 15) return;
    setFileSize(parseInt(fileSize, 10) + 1);
  };

  // on step change
  const onChange = (nextStep) => {
    setStep(nextStep < 0 ? 0 : nextStep > 3 ? 3 : nextStep);
  };
  const onNext = () => {
    if (!sourceData.data) {
      setModalMsg({
        title: "Warnning!",
        body: "required file ! (accept html,js,css,json)",
      });
      handleOpen();
      return;
    }
    setSplitCount(Math.floor(sourceData.size / (fileSize * 1000)));
    onChange(step + 1);
  };
  const onPrevious = () => onChange(step - 1);

  // switch modal window
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // on file uploaded
  const onFileUpload = () => {
    let size = document.getElementById("upload_file").files[0].size;
    if (size > 20000) {
      setModalMsg({
        title: "Warnning!",
        body: "File size must less than 2MB.",
      });
      handleOpen();
      return;
    }
    document
      .getElementById("upload_file")
      .files[0].text()
      .then((d) =>
        setSourceData({
          data: d,
          size: document.getElementById("upload_file").files[0].size,
        })
      );
  };

  // upload file block
  const upload = (
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
      {`File size: ${sourceData.size}`}
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
        value={sourceData.data}
      />
    </div>
  );

  // set file size block
  const file_size = (
    <div>
      Input the size you want to split with(KB).
      <hr />
      You will get {splitCount + 1} splited file.
      <hr />
      <div className="w-1/4 min-w-max m-auto">
        <Stack spacing={8}>
          <InputGroup>
            <InputGroup.Button onClick={handleMinus}>-</InputGroup.Button>
            <InputNumber
              className={"custom-input-number"}
              value={fileSize}
              onChange={setFileSize}
              max={15}
              min={1}
              defaultValue={fileSize}
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

  // download block
  const download_file = (
    <div>
      <Stack spacing={8}>
        Gzip:
        <Toggle
          checkedChildren="Enable"
          unCheckedChildren="Disable"
          defaultChecked
        />
      </Stack>
      <Button
        appearance="primary"
        className="mt-4"
        onClick={() => {
          setModalMsg({ title: "Sorry", body: "still working..." });
          handleOpen();
        }}
      >
        Download
      </Button>
    </div>
  );

  // show different node when step change
  const stepNode = (step) => {
    switch (step) {
      case 0:
        return upload;
      case 1:
        return file_size;
      case 2:
        return download_file;
      default:
        break;
    }
  };

  // change ui style when in mobile
  useEffect(() => {
    console.log(window.innerWidth);
    if (window.innerWidth < 750) {
      setIsMobile(true);
    }
  }, []);

  useEffect(() => {
    setSplitCount(Math.floor(sourceData.size / (fileSize * 1000)));
  }, [fileSize]);

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
        <Modal open={open} onClose={handleClose}>
          <Modal.Header>
            <Modal.Title>{modalMsg.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMsg.body}</Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose} appearance="primary">
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
