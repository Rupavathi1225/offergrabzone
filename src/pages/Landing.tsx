import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";
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
    title: "Top University Territian - Your Guide to Academic Excellence",
    description: "Discover comprehensive information about top universities worldwide. Whether you're exploring higher education options, comparing institutions, or seeking admission guidance, Top University Territian provides you with detailed insights and resources to make informed decisions about your academic future.",
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
      setSearchButtons(buttons.sort((a: SearchButton, b: SearchButton) => a.order - b.order));
    } else {
      const defaultButtons: SearchButton[] = [
        { id: "1", title: "Top Universities Rankings", link: "", webResultPage: "wr=1", order: 1 },
        { id: "2", title: "Admission Requirements", link: "", webResultPage: "wr=2", order: 2 },
        { id: "3", title: "Scholarship Opportunities", link: "", webResultPage: "wr=3", order: 3 },
        { id: "4", title: "Campus Life and Facilities", link: "", webResultPage: "wr=4", order: 4 },
        { id: "5", title: "Career Prospects and Alumni", link: "", webResultPage: "wr=5", order: 5 },
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">TopUniversityTerritian</h1>
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
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-6">Related categories</h3>
          {searchButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => handleButtonClick(button)}
              className="w-full group flex items-center justify-between px-6 py-4 bg-card border border-primary/30 rounded-lg hover:bg-card/80 hover:border-primary/60 transition-all duration-200"
            >
              <span className="text-foreground font-medium">{button.title}</span>
              <ChevronRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Landing;
