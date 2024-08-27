# map-generator-api
Generate image maps 

uses node, express and ts

Currently generates
 - AO Maps 
 - Normal Maps


```
npm i
npm start
```

Basic cURL request (dev):
```
curl -L 'http://localhost:3000/api/generate' \
-H 'Content-Type: application/json' \
-d '{
    "imageUrl": "https://images.rugs.com/yellow-runner-lattice-frieze-rug/3146541/3146541_main.jpg", //Supports jpeg,jpg, png.  
    "mapType": "ao" // options are "normal" and "ao"
}'
```

There is a basic frontend available to test with an image url and preview outputs. Run `http-server` in frontend folder.
