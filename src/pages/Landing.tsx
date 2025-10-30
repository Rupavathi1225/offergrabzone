import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingContent {
  title: string;
  description: string;
}

interface SearchButton {
  id: string;
  title: string;
  link: string;
  webResultPage: string;
  order: number;
}

const Landing = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState<LandingContent>({
    title: "OfferGrabZone - Find Amazing Deals and Discounts",
    description:
      "Discover the best offers, deals, and discounts from top brands and retailers. Whether you are shopping for electronics, fashion, home essentials, or travel packages, OfferGrabZone brings you exclusive deals and promotional offers to help you save money on every purchase.",
  });
  const [searchButtons, setSearchButtons] = useState<SearchButton[]>([]);

  useEffect(() => {
    const savedContent = localStorage.getItem("landingContent");
    if (savedContent) {
      setContent(JSON.parse(savedContent));
    }

    const savedButtons = localStorage.getItem("searchButtons");
    if (savedButtons) {
      const buttons = JSON.parse(savedButtons);
      setSearchButtons(
        buttons.sort((a: SearchButton, b: SearchButton) => a.order - b.order)
      );
    } else {
      const defaultButtons: SearchButton[] = [
        { id: "1", title: "Electronics & Gadgets Deals", link: "", webResultPage: "wr=1", order: 1 },
        { id: "2", title: "Fashion & Apparel Offers", link: "", webResultPage: "wr=2", order: 2 },
        { id: "3", title: "Home & Kitchen Discounts", link: "", webResultPage: "wr=3", order: 3 },
        { id: "4", title: "Travel & Hotel Packages", link: "", webResultPage: "wr=4", order: 4 },
        { id: "5", title: "Food & Dining Vouchers", link: "", webResultPage: "wr=5", order: 5 },
      ];
      setSearchButtons(defaultButtons);
      localStorage.setItem("searchButtons", JSON.stringify(defaultButtons));
    }
  }, []);

  const handleButtonClick = (button: SearchButton) => {
    if (button.link) {
      window.open(button.link, "_blank");
    } else {
      navigate(`/${button.webResultPage}`);
    }
  };

  // 🔗 Arrow button click handler
  const handleArrowClick = () => {
    window.open(
      "https://nipholder.com/irnxhbri5a?key=ca71564220098e966cc7eec56b08df72",
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">OfferGrabZone</h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            {content.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {content.description}
          </p>

          {/* 🔘 Small arrow button below content */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleArrowClick}
              variant="outline"
              className="flex items-center gap-2 text-primary border-primary/40 hover:bg-primary/10"
            >
              <ArrowUpRight className="h-4 w-4" />
              Explore Offer
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-6">
            Related categories
          </h3>
          {searchButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => handleButtonClick(button)}
              className="w-full group flex items-center justify-between px-6 py-4 bg-card border border-primary/30 rounded-lg hover:bg-card/80 hover:border-primary/60 transition-all duration-200"
            >
              <span className="text-foreground font-medium">
                {button.title}
              </span>
              <ChevronRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Landing;
