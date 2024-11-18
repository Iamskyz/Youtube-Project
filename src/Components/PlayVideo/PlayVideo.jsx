import React, { useEffect, useState } from "react";
import "./PlayVideo.css";
import { API_KEY, value_converter } from "../../data";
import moment from "moment";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import { useParams } from "react-router-dom";

const PlayVideo = () => {

    const {videoId}= useParams();

    const [apidata, setapidata] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentData, setCommentData] = useState(null);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const fetchVideoData = async () => {
        const videoDetail_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
        try {
            const response = await fetch(videoDetail_url);
            const data = await response.json();
            setapidata(data.items[0]);
        } catch (error) {
            console.error("Error fetching video data:", error);
        }
    };

    const fetchOtherData = async () => {
        try {
            const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apidata.snippet.channelId}&key=${API_KEY}`;
            const channelResponse = await fetch(channelData_url);
            const channelData = await channelResponse.json();
            setChannelData(channelData.items[0]);

            const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${API_KEY}`;
            const commentResponse = await fetch(comment_url);
            const comments = await commentResponse.json();
            setCommentData(comments.items);
        } catch (error) {
            console.error("Error fetching additional data:", error);
        }
    };

    useEffect(() => {
        fetchVideoData();
    }, [videoId]);

    useEffect(() => {
        if (apidata) fetchOtherData();
    }, [apidata]);

    const toggleDescription = () => {
        setIsDescriptionExpanded(!isDescriptionExpanded);
    };

    return (
        <div className="play-video">
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            ></iframe>

            <h3>{apidata ? apidata.snippet.title : "Loading..."}</h3>
            <div className="div-play-info">
                <p>
                    {value_converter(apidata?.statistics?.viewCount || 0)} •{" "}
                    {moment(apidata?.snippet?.publishedAt || "").fromNow()}
                </p>
                <div>
                    <span>
                        <img src={like} alt="" />
                        {value_converter(apidata?.statistics?.likeCount || 0)}
                    </span>
                    <span>
                        <img src={dislike} alt="" />
                    </span>
                    <span>
                        <img src={share} alt="" />
                        Share
                    </span>
                    <span>
                        <img src={save} alt="" />
                        Save
                    </span>
                </div>
            </div>
            <hr />
            <div className="publisher">
                <img src={channelData?.snippet?.thumbnails?.default?.url || ""} alt="" />
                <div>
                    <p>{apidata?.snippet?.channelTitle || "Loading..."}</p>
                    <span>{value_converter(channelData?.statistics?.subscriberCount || 0)}</span>
                </div>
                <button>Subscribe</button>
            </div>
            <div className="vid-description">
                <p>
                    {isDescriptionExpanded
                        ? apidata?.snippet?.description
                        : `${apidata?.snippet?.description?.slice(0, 255)}...`}
                    <button onClick={toggleDescription}>
                        {isDescriptionExpanded ? "Show Less" : "SHOW MORE"}
                    </button>
                </p>
                <hr />
                <h4>{value_converter(apidata?.statistics?.commentCount || 0)} Comments</h4>
                {commentData && commentData.length > 0 ? (
                    commentData.map((item, index) => (
                        <div key={index} className="comment">
                            <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
                            <div>
                                <h3>
                                    {item.snippet.topLevelComment.snippet.authorDisplayName}{" "}
                                    <span>
                                        {moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}
                                    </span>
                                </h3>
                                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                                <div className="comment-action">
                                    <img src={like} alt="Like" />
                                    <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                                    <img src={dislike} alt="Dislike" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No comments available.</p>
                )}
            </div>
        </div>
    );
};

export default PlayVideo;
