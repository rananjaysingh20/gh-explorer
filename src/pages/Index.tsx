import { useEffect, useState } from "react";
import "./Index.scss";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import RepoCard from "../components/RepoCard";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";

const fetchSearchResults = async (search: string, page: number, sort: string) => {
    const response = await axios.get(`https://api.github.com/search/repositories?q=${search}&page=${page}&per_page=10&sort=${sort}&order=desc`);
    return response.data
}

interface Repo {
    name: string;
    owner: { login: string };
    description?: string;
    topics: string[];
    language: string | null;
    watchers: number;
    forks: number;
    updated_at: string;
}

const Index = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [sort, setSort] = useState("stars")
    const [perPage] = useState(10);
    const { data, refetch } = useQuery({
        queryKey: ["repos", searchTerm],
        queryFn: () => fetchSearchResults(searchTerm, page, sort),
        enabled: false, // Prevents auto-fetching until refetch is called
    });

    const totalPages = data?.total_count
    ? Math.min(Math.ceil(data.total_count / perPage), 100)
    : 0;

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSort(e.target.value.toLowerCase());
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    useEffect(() => {
        if (page > 1) refetch();
        if (sort !== null) refetch();
    }, [page, sort]);
    
    return (
        <div>
            <div className="hero-section">
                <div className="main-title">Github Repo Explorer</div>
                <div className="subtitle">Search for repos, and explore info about them</div>
                <div className="searchbar-container">
                    <input className="searchbar" onChange={(e) => {setSearchTerm(e.target.value); setPage(1)}} type="text" placeholder="search for repository name" />
                    <button onClick={() => refetch()}>Search</button>
                </div>
            </div>
            <div className="reults-section">
                <div className="results-container">
                    {data && <div className="filters-section">
                        <div className="repo-count">Found {data?.total_count?.toLocaleString()} repos</div>
                        <div className="filter">
                            <Filter className="filter-icon"/>
                            <span>Sort</span>
                            <select onChange={(e) => handleFilterChange(e)} className="dropdown">
                                <option className="option">Stars</option>
                                <option className="option">Forks</option>
                                <option className="option">Updated</option>
                            </select>
                        </div>
                    </div>}
                    {data?.items?.map((item: Repo) => (
                        <RepoCard key={item.name} item={item} />
                    ))}
                </div>
            </div>
            {totalPages > 1 && (
                <div className="page-number-container">
                    <button
                        onClick={() => handlePageChange(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="prev-btn"
                    >
                        <ChevronLeft className="icon" />
                        Previous
                    </button>
                
                    <div className="pages">
                        {page > 2 && <button className="page-number" onClick={() => handlePageChange(1)}>1</button>}
                        {page > 3 && <span>...</span>}
                        
                        {page > 1 && (
                        <button className="page-number" onClick={() => handlePageChange(page - 1)}>
                            {page - 1}
                        </button>
                        )}
                        
                        <button className={`page-number active`}>
                        {page}
                        </button>
                        
                        {page < totalPages && (
                        <button className="page-number" onClick={() => handlePageChange(page + 1)}>
                            {page + 1}
                        </button>
                        )}
                        
                        {page < totalPages - 2 && <span>...</span>}
                        {page < totalPages - 1 && (
                        <button className="page-number" onClick={() => handlePageChange(totalPages)}>
                            {totalPages}
                        </button>
                        )}
                    </div>
                
                    <button
                        onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="next-btn"
                    >
                        Next
                        <ChevronRight className="icon" />
                    </button>
                </div>
            )}
        </div>
    )
}

export default Index;