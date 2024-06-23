import axios from 'axios';
const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:5000',
    timeout: 1000,
});

export const sendPdfProcessingRequestWithFetch = async (question: string, pdfUrl: string) => {
    console.log("Body: ", JSON.stringify({question: question,
        pdf_url: pdfUrl}))
    try {
        const response = await fetch("http://127.0.0.1:5000/process-pdf", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: question,
                pdf_url: pdfUrl
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: data,
        };
    } catch (error) {
        console.error('Error sending PDF processing request:', error);
        throw error;
    }
};
