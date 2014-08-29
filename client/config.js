"use strict";

 angular.module("config", [])

.constant("ENV", {
  "name": "development",
  "FIREBASE_URI": "https://doresol-dev.firebaseio.com/",
  "GOOGLE_API_URI": "https://www.googleapis.com/urlshortener/v1/url?key="
})
;