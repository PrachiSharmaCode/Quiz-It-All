import "./home.css";
import { useState, useRef } from 'react';
import Loading from "../loading/Loading";

const Home = ({ updateQuizType }) => {

    const fileInputRef = useRef(null);
    const [isUploadingPdf, setIsUploadingPdf] = useState(false);

    const handlePDF = async (file) => {
        const formData = new FormData();
        formData.append("pdf", file);

        const res = await fetch("http://localhost:8080/api/quiz/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data?.error || "PDF upload failed");
        }

        return data;
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        setIsUploadingPdf(true);

        try {
            await handlePDF(selectedFile);
            setQuizType('pdf');
        } catch (error) {
            console.error("PDF upload failed:", error);
            alert(error.message || "PDF upload failed. Please try again.");
        } finally {
            setIsUploadingPdf(false);
            e.target.value = "";
        }
    };

    const setQuizType = (typeOfQuiz) => {
        updateQuizType(typeOfQuiz);
    }

    return (
        <div className="home-container">
            {isUploadingPdf ? (
                <div className="quiz-choice-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                    <Loading text="File is uploading and being processed." />
                </div>
            ) : (
                <>
                    <p className="qoute">Tailored Trivia <br></br> for <br></br> Curious Minds.</p>
                    <div className="quiz-choice-container">
                        <div className="home-button-container">
                            <div className="home-button">
                                <button onClick={() => setQuizType('topic')} className="quiz-button">
                                    Enter Topic
                                </button>
                            </div>
                            <p>OR</p>
                            <div className="home-button">
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                />
                                <button onClick={handleButtonClick} className="quiz-button">
                                    Upload PDF
                                </button>
                            </div>
                        </div>

                        <p className="app-description">
                            You can enter a TOPIC or upload a PDF and we will create a quiz for you. </p>
                    </div>
                </>
            )}
        </div>
    )
}

export default Home;
