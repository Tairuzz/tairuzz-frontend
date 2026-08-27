import { useEffect, useRef } from "react";
export default function PowerBIEmbed({ embedConfig, activePage }) {
  const containerRef = useRef(null);
  const reportRef = useRef(null);
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
        }
      }
    };
    const report = powerbi.embed(containerRef.current, config);
    reportRef.current = report;
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
        position: "relative"
      }}
    />
  );
}
