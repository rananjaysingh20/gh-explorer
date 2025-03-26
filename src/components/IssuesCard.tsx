import { CircleCheck, Info } from "lucide-react";
import "./IssuesCard.scss"

interface IssuesCardProps {
    issue: object;
    index: number;
}
const IssuesCard = ({issue: issueData, index: index}: IssuesCardProps) => {
    return (
        <div key={index} className="issue-card">
            <div className="issue-number">{'#' + issueData.url.split('/').pop()}</div>
            <div className="issue-heading">
                {issueData.state === 'open' ? <Info className="heading-icon"/> : <CircleCheck className="heading-icon"/>}
                <a target="_blank" href={issueData?.pull_request?.html_url}>{issueData.title}</a>
            </div>
            <div className="labels-container">{issueData.labels.map((label) => {
                return (
                    <div className="label" style={{backgroundColor: `#${label.color}`}}>{label.name}</div>
                )
            })}</div>
        </div>
    )
}

export default IssuesCard;