import { useState } from "react";
import "./Index.scss";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import RepoCard from "../components/RepoCard";

const fetchSearchResults = async (search: string) => {
    const GITHUB_TOKEN = "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";
    const response = await axios.get(`https://api.github.com/search/repositories?q=${search}&page=1&per_page=10&sort=stars&order=desc`,{
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`
        }
    });
    return response.data
}

const Index = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["repos", searchTerm],
        queryFn: () => fetchSearchResults(searchTerm),
        enabled: false, // Prevents auto-fetching until refetch is called
    });
    
    return (
        <div>
            <div className="hero-section">
                <div className="main-title">Github Repo Explorer</div>
                <div className="subtitle">Search for repos, and explore info about them</div>
                <div className="searchbar-container">
                    <input className="searchbar" onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder="search for repository name" />
                    <button onClick={() => refetch()}>Search</button>
                </div>
            </div>
            <div className="reults-section">
                <div className="results-container">
                    {data?.items?.map((item) => {
                        return (
                            <RepoCard item={item} />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Index;