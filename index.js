const app = require('./app')
const db = require('./config/database')

const PORT = process.env.PORT || 5000;

async function start() {
    try {
        await db.authenticate();
        await db.sync({ force: true });
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (error) {
        console.log(`An Error has been occurred ${error}`);
    }

}

start();