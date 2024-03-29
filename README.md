# Findining - (Mobile Application)

<!-- !["screenshot"](https://github.com/ray1028/scheduler/blob/master/docs/scheduler-1.png)

!["screenshot"](https://github.com/ray1028/scheduler/blob/master/docs/scheduler-2.png)
/Users/rayj/react-native/findining/docs
!["screenshot"](https://github.com/ray1028/scheduler/blob/master/docs/scheduler-3.png) -->

## DESCRIPTION

Findining is a social dining mobile app that connects people together with the same hobbies and interests.

It offers a unique one-on-one dining experience that allows users to take a picture of a restaurant sign that will then display the restaurant menu.

Users will be able to create an event that will show your location to other users interested in sharing a dining experience with you.

User Login <br/><br/>
<img src="https://github.com/ray1028/findining/blob/master/docs/login.jpg" width=300 height=600 />

User Profile <br/><br/>
<img src="https://github.com/ray1028/findining/blob/master/docs/profile-pic.jpg" width=300 height=600 />

Main Screen where users can see others who created an event <br/><br/>
<img src="https://github.com/ray1028/findining/blob/master/docs/even-map.jpg" width=300 height=600 />

Camera screen to take pictures of restaurant signs <br/><br/>
<img src="https://github.com/ray1028/findining/blob/master/docs/camera.jpg" width=300 height=600 />

The application then highlights the restaurant signs for user to select <br/><br/>
<img src="https://github.com/ray1028/findining/blob/master/docs/camera2.jpg" width=300 height=600 />

Base on the user's selection, restaurant's info screen will be display to the user <br/><br/>
<img src="https://github.com/ray1028/findining/blob/master/docs/menu.jpg" width=300 height=600 />

User can then create an event and wait for others to join them <br/><br/>
<img src="https://github.com/ray1028/findining/blob/master/docs/sent-event.jpg" width=300 height=600 />



## Technical Specifications

Findining is a social dining app that connects people together with the same hobbies and interests.IT allows users to take a picture of a restaurant sign then using AWS rekognition to retrieve the menu from the restaurant to display back the the user. Users will be able to create an event that will show your location to other users interested in sharing a dining experience with you.

Front End: React Native(Interface), Expo (managed), Firebase(FCM Push notification), Redux(State Management) </br>
Back End: AWS (S3, Text Rekognition), Postgres(Database), Redis(Session token), Ruby(Back-end Language), Rails(Api-server, ActiveRecord (ORM)

## Setup

Install dependencies with `npm install`.

## Running Webpack Development Server

```sh
npm start
```
