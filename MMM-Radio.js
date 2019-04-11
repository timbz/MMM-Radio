/*
 MMM-Radio
*/

Module.register("MMM-Radio", {

 requiresVersion: "2.1.0",

  // Default module config.
  defaults: {
    volumeDefault: 0.5,
    volumeStep: 0.1,
    stations: [{
      name: "Radio ausgeschaltet"
    }, {
      name: "FM4",
      url: "http://mp3stream1.apasf.apa.at:8000/;stream.mp3"
    }, {
      name: "917XFM",
      url: "http://mp3channels.rockantenne.hamburg/917xfm"
    }]
  },

  // Define required scripts.
  getStyles: function() {
    return ["MMM-Radio.css", "font-awesome.css"];
  },

  // Define start sequence.
  start: function() {
    Log.info("Starting module: " + this.name);

    this.player = new Audio();
    this.stationIndex = 0;
    this.playing = false;

    this.setVolume(this.config.volumeDefault);
    this.updatePlayer();

    var that = this;
    document.onkeypress = function(e) {
      if (e.key == "n") {
        that.next();
      }
    };
  },

  notificationReceived: function(notification, payload, sender) {
    Log.log(this.name + " received a module notification: " + notification);
		if (notification === "RADIO_CHANNEL_NEXT") {
      this.next();
		} else if (notification === "RADIO_VOLUME_UP") {
      this.volumeUp();
    } else if (notification === "RADIO_VOLUME_DOWN") {
      this.volumeDown();
    }
	},

  updatePlayer: function() {
    var station = this.config.stations[this.stationIndex];
    if (station.url) {
      this.player.src = station.url;
      this.player.load();
      this.player.play();
      if (!this.playing) {
        this.playing = true;
        this.sendNotification("RADIO_PLAYING", {});
      }
    } else {
      this.player.src = "";
      this.player.load();
      this.player.pause();
      if (this.playing) {
        this.playing = false;
        this.sendNotification("RADIO_STOPPED", {});
      }
    }
  },

  next: function() {
    this.stationIndex++;
    while (this.stationIndex >= this.config.stations.length) {
      this.stationIndex -= this.config.stations.length;
    }
    this.updateDom();
    this.updatePlayer();
  },

  volumeUp: function() {
    var value = this.getVolume() + this.config.volumeStep;
    if (value > 1) {
      value = 1
    }
    this.setVolume(value);
    this.updateDom();
  },

  volumeDown: function() {
    var value = this.getVolume() - this.config.volumeStep;
    if (value < 0) {
      value = 0
    }
    this.setVolume(value);
    this.updateDom();
  },

  setVolume: function(value) {
    this.player.volume = value * value;
  },

  getVolume: function() {
    return Math.sqrt(this.player.volume);
  },

  getDom: function() {
    var wrapper = document.createElement("div");

    var stationsWrapper = document.createElement("div");
    stationsWrapper.className = "small stations";

    for (var i in this.config.stations) {
      var station = this.config.stations[i];

      var stationElement = document.createElement("div");
      stationElement.innerHTML = station.name;
      stationsWrapper.appendChild(stationElement);

      if (i == this.stationIndex) {
        stationElement.className = "selected";
      }

    }

    var volumeWrapper = document.createElement("div");
    volumeWrapper.className = "volume";

    var iconVolumeDown = document.createElement("span");
    iconVolumeDown.className = "fa fa-volume-down icon-volume-down";
    var volumeProgress = document.createElement("progress");
    volumeProgress.max = 1;
    volumeProgress.value = this.getVolume();
    var iconVolumeUp = document.createElement("span");
    iconVolumeUp.className = "fa fa-volume-up icon-volume-up";

    volumeWrapper.appendChild(iconVolumeDown);
    volumeWrapper.appendChild(volumeProgress);
    volumeWrapper.appendChild(iconVolumeUp);

    wrapper.appendChild(stationsWrapper);
    wrapper.appendChild(volumeWrapper);

    return wrapper;
  },

});
