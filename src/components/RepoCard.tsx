import { Clock, GitForkIcon, Star } from "lucide-react";
import "./RepoCard.scss";
import { Link } from "react-router-dom";

interface RepoCardProps {
    item: object
}

const RepoCard = ({item} : RepoCardProps) => {
    return (
        <div className="repo-card-container">
            <div className="repo-info-container">
                <div className="repo-title">{item.name}</div>
                <div className="repo-subtitle">{item.owner.login}</div>
                <div className="description">{item?.description?.length > 50 ? item.description.slice(0, 50) + '...' : item.description}</div>
                <div className="topics">{item.topics.slice(0,4).map((topic) => {return <span className="topic">{topic}</span>})}</div>
                {item.language !== null && <span className="repo-language">{item.language}</span>}
            </div>
            <div className="repo-stats-container">
                <div className="repo-stat"><Star className="stats-icons" id="star"/> <span>{item.watchers}</span></div>
                <div className="repo-stat"><GitForkIcon className="stats-icons" /> <span>{item.forks}</span></div>
                <div className="repo-stat"><Clock id="clock"  className="stats-icons"/> <span>Updated: {item.updated_at}</span></div>
            </div>
            <div className="repo-button-container">
                <Link to={`/repository/${item.owner.login}/${item.name}`}>
                    <button>Details</button>
                </Link>
                <Link to={`/repository/${item.owner.login}/${item.name}/issues`}>
                    <button>Issues</button>
                </Link>
            </div>
        </div>
    )
}

export default RepoCard;