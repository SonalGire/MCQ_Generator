import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  Alert,
  Modal,
  ModalBody,
  Progress,
} from "reactstrap";
import { Upload, CheckCircle, AlertCircle, FileText, X, Loader } from "lucide-react";

const UploadContentFile = ({ onContinue }) => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [filePath, setFilePath] = useState(""); // ✅ Added state for file path
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);
  const [apiResponseReceived, setApiResponseReceived] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);

  const processingSteps = [
    "Analyzing uploaded documents...",
    "Extracting key information...",
    "Generating quiz questions...",
    "Finalizing your quiz...",
  ];

  useEffect(() => {
    if (apiResponseReceived) {
      setIsProcessing(false);
      setIsComplete(true);
      setShowProcessingModal(false);
    }
  }, [apiResponseReceived]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setError(null);
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async () => {
    if (files.length === 0 && !filePath.trim()) {
      setError("Please select a file or enter a file path.");
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);
    setApiResponseReceived(false);
    setIsComplete(false);
    setIsProcessing(true);
    setCurrentStep(0);
    setShowProcessingModal(true);

    try {
      const formData = new FormData();

      if (files.length > 0) {
        files.forEach((file) => {
          formData.append("file", file);
        });
      } else if (filePath.trim()) {
        formData.append("file_path", filePath.trim()); // ✅ Send file path
      }

      // Simulated progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const next = prev + 10;
          return next > 90 ? 90 : next;
        });
      }, 300);

      const response = await fetch("http://localhost:8000/api/uploadFile", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error("Failed to upload or process file");
      }

      const result = await response.json();

      if (result.quiz && onContinue) {
        onContinue(result.quiz);
        navigate("/questionnaire");
      }

      setTimeout(() => {
        simulateProcessingSteps();
        navigate("/questionnaire");
      }, 500);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setIsUploading(false);
      setIsProcessing(false);
      setShowProcessingModal(false);
    }
  };

  const simulateProcessingSteps = () => {
    const totalSteps = processingSteps.length;
    const stepTime = 1500;

    for (let i = 0; i < totalSteps; i++) {
      setTimeout(() => {
        setCurrentStep(i);
        if (i === totalSteps - 1) {
          setTimeout(() => {
            setIsUploading(false);
            setApiResponseReceived(true);
          }, 1000);
        }
      }, i * stepTime);
    }
  };

  const handleNext = () => {
    navigate("/");
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <>
      <style>{`
        .modern-upload-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 2rem 0;
        }
        .upload-card {
          border: none;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          overflow: hidden;
          background: white;
        }
        
        .upload-header {
          background: linear-gradient(135deg, #000 0%, #333 100%);
          color: white;
          padding: 2rem;
          border: none;
        }
        
        .upload-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.5px;
        }
        
        .upload-subtitle {
          opacity: 0.8;
          margin: 0.5rem 0 0 0;
          font-weight: 300;
        }
        
        .file-input-section {
          margin-bottom: 2rem;
        }
        
        .file-input-label {
          font-weight: 600;
          color: #333;
          margin-bottom: 0.75rem;
          display: block;
        }
        
        .custom-file-input {
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 0.75rem;
          transition: all 0.3s ease;
        }
        
        .custom-file-input:focus {
          border-color: #000;
          box-shadow: 0 0 0 0.2rem rgba(0,0,0,0.1);
        }
        
        .upload-zone {
          border: 3px dashed #dee2e6;
          border-radius: 16px;
          padding: 3rem 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fafbfc;
          position: relative;
          overflow: hidden;
        }
        
        .upload-zone:hover, .upload-zone.drag-over {
          border-color: #000;
          background: #f8f9fa;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .upload-zone.drag-over {
          border-color: #000;
          background: #f1f3f4;
        }
        
        .upload-icon {
          margin-bottom: 1.5rem;
          opacity: 0.6;
          transition: all 0.3s ease;
        }
        
        .upload-zone:hover .upload-icon {
          opacity: 1;
          transform: scale(1.1);
        }
        
        .upload-text {
          font-size: 1.25rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
        }
        
        .upload-subtext {
          color: #6c757d;
          font-size: 0.95rem;
        }
        
        .file-list {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
          margin-top: 1.5rem;
        }
        
        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          margin-bottom: 0.75rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          transition: all 0.2s ease;
        }
        
        .file-item:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .file-item:last-child {
          margin-bottom: 0;
        }
        
        .file-info {
          display: flex;
          align-items: center;
          flex: 1;
        }
        
        .file-icon {
          margin-right: 1rem;
          color: #6c757d;
        }
        
        .file-details h6 {
          margin: 0;
          font-weight: 600;
          color: #333;
        }
        
        .file-size {
          font-size: 0.85rem;
          color: #6c757d;
          margin: 0;
        }
        
        .remove-file-btn {
          background: none;
          border: none;
          color: #dc3545;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .remove-file-btn:hover {
          background: #dc3545;
          color: white;
        }
        
        .modern-footer {
          background: #f8f9fa;
          padding: 2rem;
          border: none;
        }
        
        .btn-modern {
          border-radius: 12px;
          padding: 0.75rem 2rem;
          font-weight: 600;
          border: none;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 0.9rem;
        }
        
        .btn-modern-dark {
          background: #000;
          color: white;
        }
        
        .btn-modern-dark:hover {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        }
        
        .btn-modern-light {
          background: white;
          color: #333;
          border: 2px solid #dee2e6;
        }
        
        .btn-modern-light:hover {
          background: #f8f9fa;
          border-color: #000;
          color: #000;
        }
        
        .btn-modern-success {
          background: #28a745;
          color: white;
        }
        
        .btn-modern-success:hover {
          background: #218838;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(40,167,69,0.3);
        }
        
        .processing-modal .modal-content {
          border: none;
          border-radius: 20px;
          overflow: hidden;
        }
        
        .processing-header {
          background: linear-gradient(135deg, #000 0%, #333 100%);
          color: white;
          padding: 2rem;
          text-align: center;
        }
        
        .processing-body {
          padding: 3rem 2rem;
          text-align: center;
        }
        
        .processing-spinner {
          width: 60px;
          height: 60px;
          margin: 0 auto 2rem;
          animation: spin 1s linear infinite;
        }
        
        .or-divider {
        display: flex;
        align-items: center;
        text-align: center;
        margin: 20px 0;
      }

      .or-divider::before,
      .or-divider::after {
        content: "";
        flex: 1;
        border-bottom: 1px solid #ccc;
      }

      .or-divider:not(:empty)::before {
        margin-right: 10px;
      }

      .or-divider:not(:empty)::after {
        margin-left: 10px;
      }

      .or-divider span {
        font-weight: bold;
        font-size: 16px;
        color: #333;
      }

        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .processing-step {
          font-size: 1.1rem;
          color: #333;
          margin-bottom: 1rem;
          font-weight: 500;
        }
        
        .processing-progress {
          margin-top: 2rem;
        }
        
        .success-alert {
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
          border-left: 4px solid #28a745;
        }
        
        .error-alert {
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
          border-left: 4px solid #dc3545;
        }
      `}</style>

      <div className="modern-upload-container">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} xl={7}>
              <Card className="upload-card">
                <CardHeader className="upload-header">
                  <h2 className="upload-title">Upload Documents</h2>
                  <p className="upload-subtitle">Transform your documents into interactive quizzes</p>
                </CardHeader>

                <CardBody style={{ padding: "2.5rem" }}>
                   {/* ✅ File Path Input */}
                  <div className="file-input-section mt-3">
                    <label className="file-input-label">Enter File Path:</label>
                    <Input
                      type="text"
                      placeholder="e.g., C:\\Users\\Admin\\Documents\\sample.pdf"
                      value={filePath}
                      onChange={(e) => setFilePath(e.target.value)}
                      className="custom-file-input"
                    />
                  </div>

                  <div className="or-divider">
                    <span>OR</span>
                  </div>

                  <div className="file-input-section">
                    <label className="file-input-label">Select Files: </label>
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="custom-file-input"
                      accept=".pdf,.docx,.xlsx"
                    />
                  </div>

                  {!isUploading && !isProcessing && !isComplete && (
                    <>
                      <input
                        id="fileInput"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        accept=".pdf,.docx,.xlsx"
                      />

                      <div
                        className={`upload-zone ${isDragOver ? "drag-over" : ""}`}
                        onClick={() => document.getElementById("fileInput").click()}
                        onDragOver={(e) => {
                          e.preventDefault()
                          setIsDragOver(true)
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault()
                          setIsDragOver(false)
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          setIsDragOver(false)
                          const droppedFiles = Array.from(e.dataTransfer.files)
                          setFiles((prev) => [...prev, ...droppedFiles])
                        }}
                      >
                        <Upload size={64} className="upload-icon" />
                        <h4 className="upload-text">Drag & drop your files here</h4>
                        <p className="upload-subtext">or click to browse • PDF, DOCX, XLSX supported</p>
                      </div>

                      {files.length > 0 && (
                        <div className="file-list">
                          <h6 style={{ marginBottom: "1rem", fontWeight: "600" }}>Selected Files ({files.length})</h6>
                          {files.map((file, index) => (
                            <div key={index} className="file-item">
                              <div className="file-info">
                                <FileText size={24} className="file-icon" />
                                <div className="file-details">
                                  <h6>{file.name}</h6>
                                  <p className="file-size">{formatFileSize(file.size)}</p>
                                </div>
                              </div>
                              <button
                                className="remove-file-btn"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeFile(index)
                                }}
                              >
                                <X size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}


                  {error && (
                    <Alert className="error-alert d-flex align-items-center mb-4">
                      <AlertCircle size={20} className="me-2" />
                      {error}
                    </Alert>
                  )}

                  {files.length > 0 && (
                    <div className="file-list">
                      <h6 style={{ marginBottom: "1rem", fontWeight: "600" }}>Selected Files ({files.length})</h6>
                      {files.map((file, index) => (
                        <div key={index} className="file-item">
                          <div className="file-info">
                            <FileText size={24} className="file-icon" />
                            <div className="file-details">
                              <h6>{file.name}</h6>
                              <p className="file-size">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            className="remove-file-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {isComplete && (
                    <Alert className="success-alert mt-4 d-flex align-items-center">
                      <CheckCircle size={20} className="me-2" />
                      <div>
                        <strong>Success!</strong> Your quiz has been generated successfully.
                      </div>
                    </Alert>
                  )}
                </CardBody>

                <CardFooter className="modern-footer d-flex justify-content-between">
                  <Button
                    className="btn-modern btn-modern-light"
                    onClick={() => navigate("/questionnaire")}
                    disabled={isUploading || isProcessing}
                  >
                    Back
                  </Button>

                  {!isUploading && !isProcessing && !isComplete && (
                    <Button className="btn-modern btn-modern-dark" onClick={handleUpload}>
                      Generate Quiz
                    </Button>
                  )}

                  {isComplete && (
                    <Button className="btn-modern btn-modern-success" onClick={onContinue}>
                      Continue
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Processing Modal */}
      <Modal isOpen={showProcessingModal} centered backdrop="static" keyboard={false} className="processing-modal">
        <div className="processing-header">
          <h4 style={{ margin: 0, fontWeight: "700" }}>Processing Your Documents</h4>
        </div>
        <ModalBody className="processing-body">
          <div className="processing-spinner">
            <Loader size={60} />
          </div>

          <div className="processing-step">{processingSteps[currentStep]}</div>

          <div className="processing-progress">
            <Progress
              value={((currentStep + 1) / processingSteps.length) * 100}
              style={{ height: "8px", borderRadius: "4px" }}
              color="dark"
            />
            <small className="text-muted mt-2 d-block">
              Step {currentStep + 1} of {processingSteps.length}
            </small>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default UploadContentFile;
