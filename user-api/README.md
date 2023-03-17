# build docker image

docker build -t nestjs-user-api .

# run 

docker run -p 3000:3000 nest-user-api

sudo docker-compose up --build test






GET /api/user/{userId}/avatar
Retrieves image by 'avatar' URL.
On the first request it should save the image as a plain file, stored as a mongodb entry with userId and hash. Return its base64-encoded representation.
On following requests should return the previously saved file in base64-encoded. representation (retrieve from db).


--- 
    this part is unclear, in queryArguments is used {userId}, 
    however, in description is mentioned: "by avatar url"


