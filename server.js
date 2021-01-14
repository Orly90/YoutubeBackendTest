const dotenv = require('dotenv');

if (process.env.NODE_ENV == 'production') {
    dotenv.config({ path: './config-prod.env' });
} else {
    dotenv.config({ path: './config-dev.env' });
}

const app = require('./app');

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`the server is running on port: ${port}`);
});
