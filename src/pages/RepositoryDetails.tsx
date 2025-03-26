import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Calendar, ChevronLeft, Clock, GitFork, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import "./RepositoryDetails.scss";
import { useState } from "react";


const getRepository = async (owner:string, repo:string) => {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
    return response.data
}

const getRepositoryLanguages = async (owner:string, repo:string) => {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/languages`);
    return response.data
}

const getRepositoryContributors = async (owner:string, repo:string, page=1, per_page=10) => {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors?page=${page}&per_page=${per_page}`);
    return response.data
}

const RepositoryDetails = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const { owner, repo } = useParams<{ owner: string; repo: string }>();
    const { data: repoData, isLoading: repoLoading, isError: repoError } = useQuery({
        queryKey: ["repository", owner, repo],
        queryFn: () => getRepository(owner!, repo!),
        enabled: !!owner && !!repo,
    });

    const { data: langData, isLoading: langLoading } = useQuery({
        queryKey: ["repository-languages", owner, repo],
        queryFn: () => getRepositoryLanguages(owner!, repo!),
        enabled: !!owner && !!repo,
    });

    const { data: contributorsData, isLoading: contributorsLoading } = useQuery({
        queryKey: ["repository-contributors", owner, repo],
        queryFn: () => getRepositoryContributors(owner!, repo!, 1, 10),
        enabled: !!owner && !!repo,
    });

    console.log(langData, repoData)
    return (
        <div className="repo-page">
            <div className="repo-info-container">
                <Link to="/">
                    <button className="back-btn">
                        <ChevronLeft className="back-icon"/>
                        <span>Back to search</span>
                    </button>
                </Link>
                {repoData && <div className="repo-details">
                    <h1>{repoData.name}</h1>
                    <Link to={`/user/${repoData.owner.login}`} style={{textDecoration: 'none', color: 'black'}}>
                        <div className="owner-details">
                            <img src={repoData.owner.avatar_url} alt="avatar" className="avatar-image"/>
                            <h3>{repoData.owner.login}</h3>
                        </div>
                    </Link>
                    <p>{repoData.description}</p>
                    <div className="repo-stats">
                        <span className="stats">
                            <Star className="stat-icons" id="star-icon" />
                            {repoData.watchers}
                        </span>
                        <span className="stats">
                            <GitFork className="stat-icons"/>
                            {repoData.forks}
                        </span>
                    </div>
                    <div className="tabs-container">
                        <button className={`tab-btn ${activeTab === "overview" ? "active" : ""}`} onClick={()=>setActiveTab("overview")}>Overview</button>
                        <button className={`tab-btn ${activeTab === "languages" ? "active" : ""}`} onClick={()=>setActiveTab("languages")}>Languages</button>
                        <button className={`tab-btn ${activeTab === "contributors" ? "active" : ""}`} onClick={()=>setActiveTab("contributors")}>Contributors</button>
                    </div>
                    {activeTab === 'overview' && <div className="repoInfo-container">
                        <div className="info-container">
                            <h3>Repository Info</h3>
                            <div>
                                <div className="details">Created: <span><Calendar id="calender-icon"/> {repoData.created_at}</span></div>
                                <div className="details">Last Pushed: <span><Clock id="clock-icon" /> {repoData.pushed_at}</span></div>
                                <div className="details">License: <span>{repoData?.license?.name ? repoData.license.name : 'N/A'}</span></div>
                                <div className="details">Size: <span>{(repoData.size/1024).toFixed(2)} MB</span></div>
                                <div className="details">Issues: <span>{repoData.open_issues}</span></div>
                                <div className="details">Has Wiki: <span>{repoData.has_wiki ? 'Yes' : 'No'}</span></div>
                            </div>
                        </div>
                        <div className="info-container">
                            <h3>Top Languages</h3>
                            {langData && Object.entries(langData).slice(0,4).map(([language, size]) => {
                                const total = Object.values(langData).reduce((sum, size) => sum + size, 0);
                                return (
                                    <>
                                        <div className="language-info" key={language}>
                                            <div>{language}</div>
                                            <div>{((size/total)*100).toFixed(2)}%</div>
                                        </div>
                                        <div className="precentage-bar">
                                            <div style={{ 
                                                width: `${((size/total)*100).toFixed(2)}%`,
                                                backgroundColor: 'black',
                                                height: '10px',
                                                borderRadius: '10px'
                                            }}>
                                            </div>
                                        </div>
                                    </>
                                )
                            })}
                        </div>
                    </div>}
                    {activeTab === 'languages' && <div className="repo-info">
                        <h3>Language Distribution</h3>
                        <div className="language-bar">
                            {Object.values(langData).map((size, index) => {
                                const total = Object.values(langData).reduce((sum, size) => sum + size, 0);
                                const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8"];
                                const barColor = colors[index % colors.length];
                                return <span style={{
                                    width: `${Math.ceil((size/total)*100).toFixed(2)}%`,
                                    backgroundColor: barColor,
                                    height: '40px'
                                }}></span>
                            })}
                        </div>
                        <div className="languages">
                        {Object.keys(langData).map((language, index) => {
                            const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8"];
                            const barColor = colors[index % colors.length];
                            return (
                                <div>
                                    <div className="language-info">
                                        <div style={{width: '15px', height: '15px', backgroundColor: barColor, borderRadius: '10px'}}></div>
                                        <div>{language}</div>
                                    </div>
                                </div>
                            )
                        })}
                        </div>
                    </div>}
                    {activeTab === 'contributors' && <div className="repo-info">
                        <h3>Top Contributors</h3>
                        <div className="contributors">
                            {contributorsData.map((contibutor) => {
                                return (
                                    <div className="contributor">
                                        <img className="contributor-image" src={contibutor.avatar_url} alt="avatar_url" />
                                        <div>{contibutor.login}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>}
                    <Link to={`/repository/${repoData.owner.login}/${repoData.name}/issues`}>
                        <button className="issues-btn">Issues Kanban</button>
                    </Link>
                </div>}
            </div>
        </div>
    )
}

export default RepositoryDetails;