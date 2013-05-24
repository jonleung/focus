login = function(uid) {
  mixpanel.people.set({
    "$email": uid,
    "$last_login": new Date(),    
  });
}

track = function (action, params) {
  console.log("track: " + action)
  console.log(hash)
  console.log("\n")
  mixpanel.track(action, params);
}

track("launch", {})
