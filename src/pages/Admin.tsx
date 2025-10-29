import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Edit, Plus, ExternalLink, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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
  lid?: number;
}

const Admin = () => {
  const navigate = useNavigate();
  const [landingContent, setLandingContent] = useState<LandingContent>({
    title: "",
    description: "",
  });
  const [searchButtons, setSearchButtons] = useState<SearchButton[]>([]);
  const [webResults, setWebResults] = useState<WebResult[]>([]);

  const [newButton, setNewButton] = useState({ title: "", link: "", webResultPage: "wr=1" });
  const [newResult, setNewResult] = useState({
    name: "",
    link: "",
    title: "",
    description: "",
    logoUrl: "",
    isSponsored: false,
    webResultPage: "wr=1",
  });

  const [editingButton, setEditingButton] = useState<string | null>(null);
  const [editingResult, setEditingResult] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedContent = localStorage.getItem("landingContent");
    if (savedContent) {
      setLandingContent(JSON.parse(savedContent));
    }

    const savedButtons = localStorage.getItem("searchButtons");
    if (savedButtons) {
      setSearchButtons(JSON.parse(savedButtons));
    }

    const savedResults = localStorage.getItem("webResults");
    if (savedResults) {
      setWebResults(JSON.parse(savedResults));
    }
  };

  const saveLandingContent = () => {
    localStorage.setItem("landingContent", JSON.stringify(landingContent));
    toast.success("Landing page content saved!");
  };

  const addSearchButton = () => {
    if (!newButton.title) {
      toast.error("Button title is required");
      return;
    }
    const button: SearchButton = {
      id: Date.now().toString(),
      ...newButton,
      order: searchButtons.length + 1,
    };
    const updated = [...searchButtons, button];
    setSearchButtons(updated);
    localStorage.setItem("searchButtons", JSON.stringify(updated));
    setNewButton({ title: "", link: "", webResultPage: "wr=1" });
    toast.success("Search button added!");
  };

  const deleteSearchButton = (id: string) => {
    const updated = searchButtons.filter((b) => b.id !== id);
    setSearchButtons(updated);
    localStorage.setItem("searchButtons", JSON.stringify(updated));
    toast.success("Search button deleted!");
  };

  const moveButton = (id: string, direction: "up" | "down") => {
    const index = searchButtons.findIndex((b) => b.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === searchButtons.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...searchButtons];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updated[index].order = index + 1;
    updated[newIndex].order = newIndex + 1;

    setSearchButtons(updated);
    localStorage.setItem("searchButtons", JSON.stringify(updated));
    toast.success("Button order updated!");
  };

  const addWebResult = () => {
    if (!newResult.name || !newResult.title) {
      toast.error("Name and title are required");
      return;
    }
    // Generate next available lid
    const maxLid = webResults.reduce((max, r) => Math.max(max, r.lid || 0), 0);
    const result: WebResult = {
      id: Date.now().toString(),
      ...newResult,
      order: webResults.filter((r) => r.webResultPage === newResult.webResultPage).length + 1,
      lid: maxLid + 1,
    };
    const updated = [...webResults, result];
    setWebResults(updated);
    localStorage.setItem("webResults", JSON.stringify(updated));
    setNewResult({
      name: "",
      link: "",
      title: "",
      description: "",
      logoUrl: "",
      isSponsored: false,
      webResultPage: "wr=1",
    });
    toast.success("Web result added!");
  };

  const deleteWebResult = (id: string) => {
    const updated = webResults.filter((r) => r.id !== id);
    setWebResults(updated);
    localStorage.setItem("webResults", JSON.stringify(updated));
    toast.success("Web result deleted!");
  };

  const updateWebResult = (id: string, data: Partial<WebResult>) => {
    const updated = webResults.map((r) => (r.id === id ? { ...r, ...data } : r));
    setWebResults(updated);
    localStorage.setItem("webResults", JSON.stringify(updated));
    setEditingResult(null);
    toast.success("Web result updated!");
  };

  const moveResult = (id: string, direction: "up" | "down") => {
    const result = webResults.find((r) => r.id === id);
    if (!result) return;

    const pageResults = webResults.filter((r) => r.webResultPage === result.webResultPage);
    const index = pageResults.findIndex((r) => r.id === id);

    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === pageResults.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    [pageResults[index], pageResults[newIndex]] = [pageResults[newIndex], pageResults[index]];
    pageResults[index].order = index + 1;
    pageResults[newIndex].order = newIndex + 1;

    const otherResults = webResults.filter((r) => r.webResultPage !== result.webResultPage);
    const updated = [...otherResults, ...pageResults].sort((a, b) => a.order - b.order);

    setWebResults(updated);
    localStorage.setItem("webResults", JSON.stringify(updated));
    toast.success("Result order updated!");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/")}>
              View Site
            </Button>
            <Button variant="ghost">Logout</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="landing" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card">
            <TabsTrigger value="landing">Landing Content</TabsTrigger>
            <TabsTrigger value="buttons">Search Buttons</TabsTrigger>
            <TabsTrigger value="results">Web Results</TabsTrigger>
          </TabsList>

          <TabsContent value="landing" className="space-y-6">
            <div className="bg-card border border-primary/30 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Edit Landing Page Content</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={landingContent.title}
                    onChange={(e) =>
                      setLandingContent({ ...landingContent, title: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={landingContent.description}
                    onChange={(e) =>
                      setLandingContent({ ...landingContent, description: e.target.value })
                    }
                    className="mt-2 min-h-[120px]"
                  />
                </div>
                <Button onClick={saveLandingContent}>Save Changes</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="buttons" className="space-y-6">
            <div className="bg-card border border-primary/30 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Manage Search Buttons</h2>
              
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-foreground">Add New Button</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Button title"
                    value={newButton.title}
                    onChange={(e) => setNewButton({ ...newButton, title: e.target.value })}
                  />
                  <Input
                    placeholder="https://example.com or leave empty for /webresult"
                    value={newButton.link}
                    onChange={(e) => setNewButton({ ...newButton, link: e.target.value })}
                  />
                  <Select
                    value={newButton.webResultPage}
                    onValueChange={(value) => setNewButton({ ...newButton, webResultPage: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wr=1">Web Result 1</SelectItem>
                      <SelectItem value="wr=2">Web Result 2</SelectItem>
                      <SelectItem value="wr=3">Web Result 3</SelectItem>
                      <SelectItem value="wr=4">Web Result 4</SelectItem>
                      <SelectItem value="wr=5">Web Result 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addSearchButton}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Button
                </Button>
              </div>

              <div className="space-y-3">
                {searchButtons
                  .sort((a, b) => a.order - b.order)
                  .map((button) => (
                    <div
                      key={button.id}
                      className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg border border-border/40"
                    >
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveButton(button.id, "up")}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveButton(button.id, "down")}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-foreground">{button.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {button.link || `/${button.webResultPage}`}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteSearchButton(button.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="bg-card border border-primary/30 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Manage Web Results</h2>

              <div className="space-y-4 mb-8 p-4 bg-secondary/20 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground">Add New Result</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Name (e.g., example.com)"
                    value={newResult.name}
                    onChange={(e) => setNewResult({ ...newResult, name: e.target.value })}
                  />
                  <Input
                    placeholder="https://example.com"
                    value={newResult.link}
                    onChange={(e) => setNewResult({ ...newResult, link: e.target.value })}
                  />
                  <Input
                    placeholder="Result title"
                    value={newResult.title}
                    onChange={(e) => setNewResult({ ...newResult, title: e.target.value })}
                  />
                  <Input
                    placeholder="Logo URL (optional)"
                    value={newResult.logoUrl}
                    onChange={(e) => setNewResult({ ...newResult, logoUrl: e.target.value })}
                  />
                </div>
                <Textarea
                  placeholder="Result description"
                  value={newResult.description}
                  onChange={(e) => setNewResult({ ...newResult, description: e.target.value })}
                  className="min-h-[80px]"
                />
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="sponsored"
                      checked={newResult.isSponsored}
                      onCheckedChange={(checked) =>
                        setNewResult({ ...newResult, isSponsored: checked as boolean })
                      }
                    />
                    <Label htmlFor="sponsored">Sponsored</Label>
                  </div>
                  <Select
                    value={newResult.webResultPage}
                    onValueChange={(value) =>
                      setNewResult({ ...newResult, webResultPage: value })
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wr=1">Web Result 1</SelectItem>
                      <SelectItem value="wr=2">Web Result 2</SelectItem>
                      <SelectItem value="wr=3">Web Result 3</SelectItem>
                      <SelectItem value="wr=4">Web Result 4</SelectItem>
                      <SelectItem value="wr=5">Web Result 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addWebResult}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Result
                </Button>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Existing Results</h3>
                {["wr=1", "wr=2", "wr=3", "wr=4", "wr=5"].map((page) => {
                  const pageResults = webResults.filter((r) => r.webResultPage === page);
                  if (pageResults.length === 0) return null;

                  return (
                    <div key={page} className="space-y-3">
                      <h4 className="text-md font-medium text-primary flex items-center gap-2">
                        Web Result Page: {page}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/${page}`)}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </h4>
                      {pageResults
                        .sort((a, b) => a.order - b.order)
                        .map((result) => (
                          <div
                            key={result.id}
                            className="p-4 bg-secondary/30 rounded-lg border border-border/40"
                          >
                            {editingResult === result.id ? (
                              <div className="space-y-3">
                                <Input
                                  placeholder="Name"
                                  defaultValue={result.name}
                                  onBlur={(e) =>
                                    updateWebResult(result.id, { name: e.target.value })
                                  }
                                />
                                <Input
                                  placeholder="Link"
                                  defaultValue={result.link}
                                  onBlur={(e) =>
                                    updateWebResult(result.id, { link: e.target.value })
                                  }
                                />
                                <Input
                                  placeholder="Title"
                                  defaultValue={result.title}
                                  onBlur={(e) =>
                                    updateWebResult(result.id, { title: e.target.value })
                                  }
                                />
                                <Textarea
                                  placeholder="Description"
                                  defaultValue={result.description}
                                  onBlur={(e) =>
                                    updateWebResult(result.id, { description: e.target.value })
                                  }
                                />
                                <Button onClick={() => setEditingResult(null)}>Done</Button>
                              </div>
                            ) : (
                              <div className="flex items-start gap-3">
                                <div className="flex flex-col gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => moveResult(result.id, "up")}
                                  >
                                    <ArrowUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => moveResult(result.id, "down")}
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    {result.isSponsored && (
                                      <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                                        Sponsored
                                      </span>
                                    )}
                                  </div>
                                  <div className="font-bold text-foreground">{result.title}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {result.name}
                                  </div>
                                  <div className="text-sm text-primary/80 mt-1">{result.link}</div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditingResult(result.id)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteWebResult(result.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
