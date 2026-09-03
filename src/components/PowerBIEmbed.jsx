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
      const error = event.detail;
      console.error("Power BI embed error:", error);
      setCustomError(
        "Your dashboard is warming up — this usually takes under a minute. Please refresh shortly."
      );
    });

    return () => {
      powerbi.reset(containerRef.current);
    };
  }, [embedConfig]);

  useEffect(() => {
    if (!reportRef.current || !activePage) return;
    reportRef.current.getPages().then((pages) => {
      const target = pages.find((p) => p.displayName === activePage);
      if (target) target.setActive();
    });
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
