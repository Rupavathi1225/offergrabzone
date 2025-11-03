import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Redirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const lidMatch = location.pathname.match(/\/lid=(\d+)/);
    
    console.log("Redirect - pathname:", location.pathname);
    console.log("Redirect - lidMatch:", lidMatch);
    
    if (lidMatch) {
      const lid = parseInt(lidMatch[1]);
      console.log("Redirect - lid:", lid);
      
      const savedResults = localStorage.getItem("webResults");
      console.log("Redirect - savedResults:", savedResults);
      
      if (savedResults) {
        const allResults = JSON.parse(savedResults);
        const result = allResults.find((r: any) => r.lid === lid || r.id === lid.toString());
        
        console.log("Redirect - found result:", result);
        
        if (result && result.link) {
          // Get or create session ID
          let sessionId = sessionStorage.getItem("userSessionId");
          if (!sessionId) {
            sessionId = `SID-${Math.random().toString(36).substr(2, 9)}`;
            sessionStorage.setItem("userSessionId", sessionId);
          }

          // Track the click before redirecting
          const clickData = {
            sessionId: sessionId,
            linkId: `oid=${lid}`,
            lid: lid,
            destinationUrl: result.link,
            timestamp: Date.now(),
            date: new Date().toISOString(),
            resultName: result.name,
            resultTitle: result.title,
          };
          
          const existingClicks = JSON.parse(localStorage.getItem("linkClicks") || "[]");
          localStorage.setItem("linkClicks", JSON.stringify([...existingClicks, clickData]));
          
          console.log("Redirect - redirecting to:", result.link);
          
          // Redirect to actual URL
          window.location.href = result.link;
          return;
        }
      }
    }
    
    // If no match found, redirect to home
    console.log("Redirect - no match, going to home");
    navigate("/");
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
};

export default Redirect;
