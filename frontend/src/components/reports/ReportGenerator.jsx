import { useState } from "react";
import api from "../../services/api";
import jsPDF from "jspdf";

export default function ReportGenerator() {

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     GENERATE REPORT
  ========================= */

  const generateReport = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reports/generate");
      setReport(res.data);
    } catch (err) {
      alert("Error generating report");
    }
    setLoading(false);
  };

  /* =========================
     FORMAT AI TEXT
  ========================= */

  const formatReport = (text) => {
    if (!text) return [];

    const sections = text.split(/\*\*(.*?)\*\*/g);

    const formatted = [];

    for (let i = 1; i < sections.length; i += 2) {
      formatted.push({
        title: sections[i],
        content: sections[i + 1]
      });
    }

    return formatted;
  };

  const formattedSections = formatReport(report?.report);

  /* =========================
     ENTERPRISE PDF (TEXT BASED)
  ========================= */

  const downloadPDF = () => {

    const pdf = new jsPDF("p", "mm", "a4");

    let y = 20;

    const addHeader = () => {
      pdf.setFontSize(16);
      pdf.setTextColor(40);
      pdf.text("Kognio", 14, 15);

      pdf.setFontSize(10);
      pdf.setTextColor(120);
      pdf.text("Inventory, Powered by Intelligence", 14, 20);

      pdf.setFontSize(10);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 150, 15);
    };

    const addFooter = (page) => {
      pdf.setFontSize(9);
      pdf.setTextColor(150);
      pdf.text(`Page ${page}`, 180, 290);
    };

    let page = 1;

    addHeader();

    pdf.setFontSize(14);
    pdf.setTextColor(0);
    pdf.text("AI Inventory Report", 14, y);
    y += 10;

    formattedSections.forEach((section) => {

      if (y > 270) {
        pdf.addPage();
        page++;
        addHeader();
        y = 30;
      }

      /* SECTION TITLE */

      pdf.setFontSize(12);
      pdf.setTextColor(79, 70, 229);
      pdf.text(section.title, 14, y);
      y += 6;

      /* CONTENT */

      pdf.setFontSize(10);
      pdf.setTextColor(50);

      const lines = pdf.splitTextToSize(
        section.content.replace(/\*/g, ""),
        180
      );

      lines.forEach(line => {

        if (y > 280) {
          pdf.addPage();
          page++;
          addHeader();
          y = 30;
        }

        pdf.text(line, 14, y);
        y += 5;
      });

      y += 5;
    });

    addFooter(page);

    pdf.save("Kognio_Report.pdf");
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-6">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-semibold">
          📊 Kognio Report Generator
        </h1>

        <div className="flex gap-3">

          <button
            onClick={generateReport}
            className="px-5 py-2 rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-500"
          >
            {loading ? "Generating..." : "Generate AI Report"}
          </button>

          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-green-600 text-white rounded-xl"
          >
            Download
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl"
          >
            Print
          </button>

        </div>

      </div>

      {!report && (
        <div className="text-center text-gray-500 mt-20">
          Generate report to view insights
        </div>
      )}

      {/* REPORT */}

      {report && (
        <div
          id="report"
          className="bg-white p-10 rounded-2xl shadow space-y-6"
          style={{
            width: "800px",
            margin: "auto"
          }}
        >

          {/* TITLE */}

          <div className="border-b pb-4">
            <h2 className="text-xl font-bold">
              AI Inventory Report
            </h2>
            <p className="text-sm text-gray-500">
              Generated on {new Date().toLocaleString()}
            </p>
          </div>

          {/* SECTIONS */}

          {formattedSections.map((section, index) => {

            const isRisk = section.title.toLowerCase().includes("risk");
            const isHealth = section.title.toLowerCase().includes("health");

            return (
              <div
                key={index}
                className={`p-5 rounded-xl border
                ${isRisk ? "bg-red-50 border-red-200" :
                  isHealth ? "bg-green-50 border-green-200" :
                  "bg-gray-50 border-gray-200"}`}
              >

                <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                  {section.title}
                </h3>

                <div className="text-sm text-gray-700 space-y-2">

                  {section.content
                    .split("\n")
                    .filter(line => line.trim())
                    .map((line, i) => {

                      if (line.trim().startsWith("*")) {
                        return (
                          <div key={i} className="flex gap-2">
                            <span>•</span>
                            <span>{line.replace("*", "")}</span>
                          </div>
                        );
                      }

                      return <p key={i}>{line}</p>;
                    })}

                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* PRINT ONLY REPORT */}

      <style>{`
        @media print {

          body * {
            visibility: hidden;
          }

          #report, #report * {
            visibility: visible;
          }

          #report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

        }
      `}</style>

    </div>
  );
}