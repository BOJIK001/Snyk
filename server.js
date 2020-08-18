const express = require('express');
const app = express();
const { fetch_dependencies_tree } = require('./dependecy_tree');

app.get('/dep_tree/:package_name/:version_or_tag', async function(req, res, next){
    var name = req.params.package_name;
    var version = req.params.version_or_tag;
    const res_data = await fetch_dependencies_tree(name, version);
    res.send(res_data);
  });

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});