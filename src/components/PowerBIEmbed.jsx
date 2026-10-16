import { useEffect, useRef, useState } from "react";

export default function PowerBIEmbed({ embedConfig, activePage }) {
  const containerRef = useRef(null);
  const reportRef = useRef(null);
  const [customError, setCustomError] = useState(null);

  useEffect(() => {
    if (!containerRef.current || !embedConfig) return;
    const powerbi = window.powerbi;
    const models = window["powerbi-client"].models;
    const config = {
      type: "report",
      id: embedConfig.reportId,
      embedUrl: embedConfig.embedUrl,
      accessToken: embedConfig.embedToken,
      tokenType: models.TokenType.Embed,
      settings: {
        panes: {
          filters: { visible: false },
          pageNavigation: { visible: false }
        },
        layoutType: models.LayoutType.Custom,
        customLayout: {
          displayOption: models.DisplayOption.FitToPage
        },
        hideErrors: true
      }
    };
    const report = powerbi.embed(containerRef.current, config);
    reportRef.current = report;

    report.off("error");
    report.on("error", (event) => {
      const detail = event && event.detail ? event.detail : {};
      console.error("Power BI embed error:", detail.errorCode, detail.message, detail);
      setCustomError(
        "This page could not be loaded. If the dashboard has been idle it may still be starting up. Wait a moment, then reload the page."
      );
    });

    report.off("rendered");
    report.on("rendered", () => setCustomError(null));

    return () => {
      powerbi.reset(containerRef.current);
      reportRef.current = null;
    };
  }, [embedConfig]);

  useEffect(() => {
    if (!reportRef.current || !activePage) return;
    setCustomError(null);
    const normalize = (s) => (s || "").trim().replace(/\s+/g, " ").toLowerCase();
    reportRef.current
      .getPages()
      .then((pages) => {
        const target = pages.find((p) => normalize(p.displayName) === normalize(activePage));
        if (target) {
          target.setActive();
        } else {
          console.warn(`No report page found matching "${activePage}"`);
        }
      })
      .catch((err) => console.error("Could not read report pages:", err));
  }, [activePage]);

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {customError && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.95)",
            padding: "24px",
            textAlign: "center",
            fontSize: "15px",
            color: "#333"
          }}
        >
          {customError}
        </div>
      )}
    </div>
  );
}
