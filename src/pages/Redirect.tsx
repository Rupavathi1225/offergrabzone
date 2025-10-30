import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Redirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const lidMatch = location.pathname.match(/\/lid=(\d+)/);
    
    if (lidMatch) {
      const lid = parseInt(lidMatch[1]);
      const savedResults = localStorage.getItem("webResults");
      
      if (savedResults) {
        const allResults = JSON.parse(savedResults);
        const result = allResults.find((r: any) => r.lid === lid || r.id === lid.toString());
        
        if (result && result.link) {
          // Track the click before redirecting
          const clickData = {
            lid: lid,
            destinationUrl: result.link,
            timestamp: Date.now(),
            date: new Date().toISOString(),
            resultName: result.name,
            resultTitle: result.title,
          };
          
          const existingClicks = JSON.parse(localStorage.getItem("linkClicks") || "[]");
          localStorage.setItem("linkClicks", JSON.stringify([...existingClicks, clickData]));
          
          // Redirect to actual URL
          window.location.href = result.link;
          return;
        }
      }
    }
    
    // If no match found, redirect to home
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
