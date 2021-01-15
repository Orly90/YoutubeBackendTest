const axios = require('axios');

const API_KEY = process.env.API_KEY;
const API_YOUTUBE_URL = process.env.API_YOUTUBE_URL;

//MIDDLEWARES

//REQ/RESP

exports.getVideos = (req, res) => {
    const { search, part = 'id,snippet', type = 'video', cant = 8, order = 'viewCount' } = req.query;

    axios({
        method: 'get',
        url: `${API_YOUTUBE_URL}`,
        params: {
            key: `${API_KEY}`,
            part: part,
            q: search,
            type: type,
            maxResults: cant,
            order: order,
        },
    })
        .then((response) => {
            const { status, statusText, data } = response;

            res.status(status).json({
                status,
                statusText,
                data,
            });
        })
        .catch((error) => {
            const { status, statusText, data } = error.response;

            res.status(status).json({
                status,
                statusText,
                data,
            });
        });
};
