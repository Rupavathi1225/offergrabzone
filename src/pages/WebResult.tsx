import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WebResult {
  id: string;
  name: string;
  link: string;
  title: string;
  description: string;
  logoUrl: string;
  isSponsored: boolean;
  webResultPage: string;
  order: number;
}

const WebResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [results, setResults] = useState<WebResult[]>([]);
  const [sponsoredResults, setSponsoredResults] = useState<WebResult[]>([]);
  const [regularResults, setRegularResults] = useState<WebResult[]>([]);

  const currentPage = location.pathname.substring(1); // Gets "wr=1", "wr=2", etc.

  useEffect(() => {
    const savedResults = localStorage.getItem("webResults");
    if (savedResults) {
      const allResults: WebResult[] = JSON.parse(savedResults);
      const pageResults = allResults
        .filter((result) => result.webResultPage === currentPage)
        .sort((a, b) => a.order - b.order);
      
      setResults(pageResults);
      setSponsoredResults(pageResults.filter((r) => r.isSponsored));
      setRegularResults(pageResults.filter((r) => !r.isSponsored));
    } else {
      // Initialize with default data for wr=1
      if (currentPage === "wr=1") {
        const defaultResults: WebResult[] = [
          {
            id: "1",
            name: "Amazon",
            link: "https://amazon.com",
            title: "Amazon Electronics - Up to 50% Off",
            description: "Shop the latest electronics and gadgets with massive discounts. Find smartphones, laptops, tablets, and accessories at unbeatable prices.",
            logoUrl: "https://logo.clearbit.com/amazon.com",
            isSponsored: true,
            webResultPage: "wr=1",
            order: 1,
          },
          {
            id: "2",
            name: "Best Buy",
            link: "https://bestbuy.com",
            title: "Best Buy Daily Deals - Save Big on Tech",
            description: "Discover amazing deals on electronics, home appliances, and entertainment systems. Limited time offers on top brands.",
            logoUrl: "https://logo.clearbit.com/bestbuy.com",
            isSponsored: false,
            webResultPage: "wr=1",
            order: 2,
          },
        ];
        setResults(defaultResults);
        setSponsoredResults(defaultResults.filter((r) => r.isSponsored));
        setRegularResults(defaultResults.filter((r) => !r.isSponsored));
        localStorage.setItem("webResults", JSON.stringify(defaultResults));
      }
    }
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-foreground hover:text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-primary">OfferGrabZone</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {sponsoredResults.length > 0 && (
          <div className="mb-12">
            <h2 className="text-sm font-medium text-muted-foreground mb-6">Sponsored Results</h2>
            <div className="space-y-6">
              {sponsoredResults.map((result) => (
                <div key={result.id} className="space-y-3">
                  <div className="flex items-start gap-3">
                    {result.logoUrl && (
                      <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                          src={result.logoUrl}
                          alt={result.name}
                          className="w-6 h-6 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">Sponsored</span>
                      </div>
                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl font-medium text-primary hover:underline inline-flex items-center gap-2 group"
                      >
                        {result.title}
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary/80 hover:text-primary hover:underline mt-2 inline-block"
                      >
                        {result.link}
                      </a>
                      <Button
                        variant="default"
                        size="sm"
                        className="mt-3"
                        onClick={() => window.open(result.link, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Website
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {regularResults.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-6">Web Results</h2>
            <div className="space-y-6">
              {regularResults.map((result) => (
                <div key={result.id} className="space-y-2">
                  <div className="flex items-start gap-3">
                    {result.logoUrl && (
                      <div className="w-6 h-6 rounded-full bg-muted/30 flex items-center justify-center overflow-hidden flex-shrink-0 mt-1">
                        <img
                          src={result.logoUrl}
                          alt={result.name}
                          className="w-4 h-4 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{result.name}</p>
                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl font-medium text-primary hover:underline"
                      >
                        {result.title}
                      </a>
                      <p className="text-sm text-foreground mt-1">{result.description}</p>
                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary/80 hover:text-primary hover:underline mt-1 inline-block"
                      >
                        {result.link}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No results available for this page yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add results from the admin panel to see them here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default WebResult;
