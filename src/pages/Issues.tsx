import { ChevronLeft, CircleCheck, Info } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import "./Issues.scss";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import IssuesCard from "../components/IssuesCard";

interface Issue {
    id: number;
    title: string;
    state: "open" | "closed";
    user: { login: string };
    created_at: string;
    comments: number;
    url: string;
    labels: Label[];
}

interface Label {
    name: string;
    color: string;
}

const getRepository = async (owner:string, repo:string) => {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
    return response.data
}

const getRepositoryIssues = async (owner:string, repo:string, state = "all", page = 1, per_page = 100, sort = "created", direction = "desc") => {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues?state=${state}&page=${page}&per_page=${per_page}&sort=${sort}&direction=${direction}`);
    return response.data
}

const Issues = () => {
    const [activeTab, setActiveTab] = useState('kanban');
    const { owner, repo } = useParams<{ owner: string; repo: string }>();
    const [sortBy] = useState("updated");
    const [sortDirection] = useState("desc");
    const { data: repoData } = useQuery({
        queryKey: ["repository", owner, repo],
        queryFn: () => getRepository(owner!, repo!),
        enabled: !!owner && !!repo,
      });
    
      // Fetch repository issues
      const { data: issuesData } = useQuery({
        queryKey: ["repository-issues", owner, repo, sortBy, sortDirection],
        queryFn: () => getRepositoryIssues(owner!, repo!, "all", 1, 100, sortBy, sortDirection),
        enabled: !!owner && !!repo,
      });
    return (
        <div className="repo-page">
            <div className="repo-info-container">
                <Link to="/">
                    <button className="back-btn">
                        <ChevronLeft className="back-icon"/>
                        <span>Back to search</span>
                    </button>
                </Link>
                {repoData && <h3>Issues for {repoData.owner.login}/{repoData.name}</h3>}
                <div className="tabs-container">
                    <button className={`tab-btn ${activeTab === "kanban" ? "active" : ""}`} onClick={() => setActiveTab('kanban')}>Kanban</button>
                    <button className={`tab-btn ${activeTab === "list" ? "active" : ""}`} onClick={() => setActiveTab('list')}>List</button>
                </div>
                {issuesData && <div className="issues-container">
                    {activeTab === 'kanban' && <>
                        <div className="issues-column">
                            <div className="column-heading open">
                                <Info className="column-icon"/>
                                <h3>Open</h3>
                            </div>
                            <div className="column">
                                {issuesData?.filter((issue: Issue) => issue.state === 'open').map((issue: Issue, index: number) => (
                                    <IssuesCard key={index} issue={issue} index={index} />
                                ))}
                            </div>
                        </div>
                        <div className="issues-column">
                            <div className="column-heading closed">
                                <CircleCheck className="column-icon"/>
                                <h3>Closed</h3>
                            </div>
                            <div className="column">
                                {issuesData?.filter((issue: Issue) => issue.state === 'closed').map((issue: Issue, index: number) => (
                                    <IssuesCard key={index} issue={issue} index={index} />
                                ))}
                            </div>
                        </div>
                    </>}
                    {activeTab === 'list' && <>
                        <div className="list-column">
                            {issuesData?.map((issue: Issue, index: number) => (
                                <IssuesCard key={index} issue={issue} index={index} />
                            ))}
                        </div>
                    </>}
                </div>}
            </div>
        </div>
    )
}

export default Issues;