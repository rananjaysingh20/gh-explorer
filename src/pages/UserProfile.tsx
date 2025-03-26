import { Link, useParams } from "react-router-dom";
import "./UserProfile.scss";
import { Calendar, ChevronLeft, GitBranch, GitFork, GitPullRequest, Link2, MapPin, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import RepoCard from "../components/RepoCard";

export async function getUserProfile(username: string) {
    const response = await axios.get(`https://api.github.com/users/${username}`);
    return response.data
}

export async function getUserRepositories(username: string, page = 1, per_page = 10, sort = "updated", direction = "desc") {
    const response = await axios.get(`https://api.github.com/users/${username}/repos?page=${page}&per_page=${per_page}&sort=${sort}&direction=${direction}`);
    return response.data
}

export async function getUserFollowers(username: string, page = 1, per_page = 10) {
    const response = await axios.get(`https://api.github.com/users/${username}/followers?page=${page}&per_page=${per_page}`);
    return response.data
}

export async function getUserEvents(username: string, page = 1, per_page = 10) {
    const response = await axios.get(`https://api.github.com/users/${username}/events?page=${page}&per_page=${per_page}`);
    return response.data
}

interface Repo {
    id: number;
    name: string;
    owner: Owner;
    description?: string;
    topics: string[];
    language: string | null;
    watchers: number;
    forks: number;
    updated_at: string;
}

interface Owner {
    login: string;
}

interface Follower {
    id: number;
    login: string;
    avatar_url: string;
}

interface Event {
    id: string;
    type: string;
    payload: {
        commits?: { message: string; author: { name: string } }[];
    };
    created_at: string;
}

const UserProfile = () => {
    const { username } = useParams<{ username: string }>();
    const [page] = useState(1);
    const [activeTab, setActiveTab] = useState("repos");

    const { data: userData } = useQuery({
        queryKey: ["user", username],
        queryFn: () => getUserProfile(username!),
        enabled: !!username,
    });
    console.log(userData)

    // Fetch user repositories
    const { data: reposData } = useQuery({
        queryKey: ["user-repositories", username, page],
        queryFn: () => getUserRepositories(username!, page, 10, "updated"),
        enabled: !!username,
    });

    // Fetch user followers
    const { data: followersData } = useQuery({
        queryKey: ["user-followers", username],
        queryFn: () => getUserFollowers(username!, 1, 20),
        enabled: !!username && activeTab === "followers",
    });

    // Fetch user events (for commits)
    const { data: eventsData } = useQuery({
        queryKey: ["user-events", username],
        queryFn: () => getUserEvents(username!, 1, 30),
        enabled: !!username && activeTab === "activity",
    });
    return (
        <div className="user-page">
            <div className="user-info-container">
                <Link to="/">
                    <button className="back-btn">
                        <ChevronLeft className="back-icon"/>
                        <span>Back to search</span>
                    </button>
                </Link>
                {userData && <div className="user-card">
                    <div className="user-details">
                        <img className="profile-image" src={userData.avatar_url} alt="avatar" />
                        <div className="profile-details">
                            <div className="username">{userData.name}</div>
                            <div className="user-handle">{"@" + userData.login}</div>
                            <div className="bio">{userData.bio}</div>
                            <div className="location-blog">
                                <div className="location"><MapPin className="map-icon"/>{userData.location}</div>
                                <div className="blog-link"><Link2 className="link-icon" />{userData.blog}</div>
                            </div>
                            <div className="joining-date"><Calendar className="calender-icon"/>{userData.created_at}</div>
                            <div className="profile-stats">
                                <div className="stat"><Users className="stat-icon" id="follower-icon" />{userData.followers + ' '}<span>followers</span></div>
                                <div className="stat"><Users className="stat-icon" id="following-icon" />{userData.following + ' '}<span>following</span></div>
                                <div className="stat"><GitBranch className="stat-icon" id="repo-icon"/>{userData.public_repos + ' '}<span>repos</span></div>
                                <div className="stat"><GitFork className="stat-icon" id="gist-icon"/>{userData.public_gists + ' '}<span> gists</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="tabs-container">
                        <button className={`tab-btn ${activeTab === "repos" ? "active" : ""}`} onClick={() => setActiveTab('repos')}>Repos</button>
                        <button className={`tab-btn ${activeTab === "followers" ? "active" : ""}`} onClick={() => setActiveTab('followers')}>Followers</button>
                        <button className={`tab-btn ${activeTab === "activity" ? "active" : ""}`} onClick={() => setActiveTab('activity')}>Recent Activity</button>
                    </div>
                    {reposData && activeTab === 'repos' && <div>
                        {reposData.map((repo: Repo) => {
                            return <RepoCard key={repo.id} item={repo} />
                        })}
                    </div>}
                    {followersData && activeTab === 'followers' && <div className="follower-list">
                        {followersData.map((follower: Follower) => {
                            return (
                                <div className="follower" key={follower.id}>
                                    <img className="follower-image" src={follower.avatar_url} alt="follower"/>
                                    <div className="follower-name">{follower.login}</div>
                                </div>
                            )
                        })}
                    </div>}
                    {eventsData && activeTab === 'activity' && <div className="event-list">
                        {eventsData.filter((event: Event) => event.type === 'PushEvent').map((event: Event) => {
                            return (
                                <div className="event" key={event.id}>
                                    <div className="event-message"><GitPullRequest className="event-icon" />{event.payload.commits?.[0].message}</div>
                                    <div className="event-author">
                                        {event.payload.commits?.[0].author.name}
                                        {event.created_at}
                                    </div>
                                </div>
                            )
                        })}
                        {!eventsData.filter((event: Event) => event.type === 'PushEvent').length ? (<div>No recent activity</div>) : ""}
                    </div>}
                </div>}
            </div>
        </div>
    )
}

export default UserProfile;