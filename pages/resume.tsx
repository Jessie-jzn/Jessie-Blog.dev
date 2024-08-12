import { useRef } from "react";
import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
import ResumeBox from "@/components/ResumeBox";

export default function Resume() {
  const resumeRef = useRef();

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  const exportPDF = () => {
    const resumeElement = resumeRef.current;

    html2canvas(resumeElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      //   const pdf = new jsPDF("p", "mm", "a4");
      //   const imgProps = pdf.getImageProperties(imgData);
      //   const pdfWidth = pdf.internal.pageSize.getWidth();
      //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      //   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      //   pdf.save("resume.pdf");
    });
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 font-sans leading-relaxed min-h-screen">
      <div className="flex justify-end p-4">
        <button
          onClick={toggleDarkMode}
          className="mr-4 p-2 bg-blue-500 text-white rounded"
        >
          Switch Theme
        </button>
        <button
          onClick={exportPDF}
          className="p-2 bg-green-500 text-white rounded"
        >
          Export PDF
        </button>
      </div>
      <div className="max-w-4xl mx-auto">
        <ResumeBox ref={resumeRef} />
      </div>
    </div>
  );
}
