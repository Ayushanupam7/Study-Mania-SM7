import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Subjects from "@/pages/Subjects";
import SubjectDetail from "@/pages/SubjectDetail";
import Flashbook from "@/pages/Flashbook";
import Planner from "@/pages/Planner";
import History from "@/pages/History";
import Settings from "@/pages/Settings";
import StudyTime from "@/pages/StudyTime";
import NotFound from "@/pages/not-found";
import { StudyProvider } from "./context/StudyContext";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/study-time" component={StudyTime} />
        <Route path="/subjects" component={Subjects} />
        <Route path="/subjects/:id" component={SubjectDetail} />
        <Route path="/flashbook" component={Flashbook} />
        <Route path="/planner" component={Planner} />
        <Route path="/history" component={History} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <StudyProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </StudyProvider>
  );
}

export default App;
