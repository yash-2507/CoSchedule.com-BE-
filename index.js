const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(PORT, () => {
    try {
        console.log(`Server started at PORT ${PORT}`);
    } catch (error) {
        console.log(error.message);
    }
});
