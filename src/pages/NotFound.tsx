import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if this is a lid= redirect URL
    const lidMatch = location.pathname.match(/\/lid=(\d+)/);
    
    if (lidMatch) {
      const lid = parseInt(lidMatch[1]);
      console.log("NotFound - Detected lid redirect:", lid);
      
      const savedResults = localStorage.getItem("webResults");
      
      if (savedResults) {
        const allResults = JSON.parse(savedResults);
        const result = allResults.find((r: any) => r.lid === lid || r.id === lid.toString());
        
        console.log("NotFound - Found result:", result);
        
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
          
          console.log("NotFound - Redirecting to:", result.link);
          
          // Redirect to actual URL
          window.location.href = result.link;
          return;
        }
      }
    }
    
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
